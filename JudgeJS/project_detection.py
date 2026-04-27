#!/usr/bin/env python3
"""
项目级漏洞检测脚本
使用完整项目作为输入进行安全分析
"""

import sys
import os

# 添加当前目录到路径，以便导入模块
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from evaluation.checkpoint_manager import CheckpointManager
from evaluation.checkpoint_utils import _get_project_data, _format_project_prompt, recompute_metrics, _get_dataset_df, show_summary
from models.llm_client import LLMClient
import argparse
import csv

def detect_project_vulnerabilities(dataset_type: str = "original", sample_size: int = 2, model_name: str = "deepseek-ai/DeepSeek-V3.1", force_restart: bool = False, force_continue: bool = False, only_errors: bool = False, indices: str = ""):
    """
    对项目进行漏洞检测
    
    Args:
        dataset_type: 数据集类型
        sample_size: 样本数量
        model_name: 使用的模型名称
        force_restart: 是否强制重新开始（跳过缓存询问）
        force_continue: 是否强制继续现有评估（跳过询问）
    """
    # 初始化组件 - 按数据集分离文件
    checkpoint_manager = CheckpointManager(model_name=model_name, dataset_type=dataset_type)
    
    # 优先从 model_endpoints.json 读取配置，否则使用 config.py
    import json
    import os
    model_cfg = None
    
    # 1. 尝试从 model_endpoints.json 读取
    model_endpoints_file = os.path.join(current_dir, "config", "model_endpoints.json")
    if os.path.exists(model_endpoints_file):
        try:
            with open(model_endpoints_file, 'r', encoding='utf-8') as f:
                endpoints_config = json.load(f)
                if model_name in endpoints_config:
                    cfg = endpoints_config[model_name]
                    if not cfg.get('hidden', False):  # 跳过隐藏的模型
                        api_base = cfg.get("api_base")
                        if isinstance(api_base, str) and api_base.startswith("${") and api_base.endswith("}"):
                            api_base = os.environ.get(api_base[2:-1], "")
                        api_key = cfg.get("api_key", "")
                        api_key_env = cfg.get("api_key_env")
                        if api_key_env:
                            api_key = os.environ.get(api_key_env, api_key)
                        model_cfg = {
                            "name": cfg.get("name"),
                            "api_base": api_base,
                            "api_key": api_key,
                            "api_key_env": api_key_env,
                            "max_tokens": cfg.get("max_tokens", 4096),
                            "timeout": cfg.get("timeout", 60)
                        }
                        print(f"📝 使用 model_endpoints.json 中的配置（超时: {cfg.get('timeout', 60)}秒）")
        except Exception as e:
            print(f"⚠️ 读取 model_endpoints.json 失败: {e}")
    
    # 2. 回退到 config.py
    if model_cfg is None:
        from config.config import LLM_CONFIG
        for m in LLM_CONFIG.get("models", []):
            if str(m.get("name","")) == str(model_name):
                model_cfg = m
                print(f"📝 使用 config.py 中的配置")
                break
    
    client = LLMClient(model_config=model_cfg)
    # 以GT真实行数限制sample_size，避免越界
    try:
        ds_df = _get_dataset_df(dataset_type)
        dataset_rows = len(ds_df)
        if sample_size > dataset_rows:
            print(f"⚙️  采样上限由 {sample_size} 调整为 GT 行数 {dataset_rows}")
            sample_size = dataset_rows
    except Exception as e:
        print(f"⚠️ 数据集读取失败，无法限幅sample_size: {e}")
    
    # 同步结果CSV中的success/error到进度，以便：
    # - error 不计入完成
    # - 仅错误重跑可覆盖到CSV中的错误样本
    try:
        def _sync_progress_with_results(cm: CheckpointManager):
            results_csv = cm.results_csv
            if not os.path.exists(results_csv):
                return
            try:
                with open(results_csv, 'r', encoding='utf-8', errors='ignore', newline='') as f:
                    rdr = csv.DictReader(f)
                    csv_success = set()
                    csv_error = set()
                    for r in rdr:
                        sid = str(r.get('sample_id', '')).strip()
                        try:
                            sidx = int(str(r.get('sample_index', '0')).strip())
                        except Exception:
                            continue
                        if not sid:
                            continue
                        key = f"{sidx}_{sid}"
                        st = str(r.get('status', '')).strip().lower()
                        if st == 'success':
                            csv_success.add(key)
                        elif st == 'error':
                            csv_error.add(key)
                # 去重合并
                completed = list(dict.fromkeys(checkpoint_manager.progress.get('completed_samples', [])))
                failed = list(dict.fromkeys(checkpoint_manager.progress.get('failed_samples', [])))
                # 从 completed 移除任何在 csv_error 中的键
                completed = [k for k in completed if k not in csv_error]
                # 把 csv_success 补入 completed
                for k in csv_success:
                    if k not in completed:
                        completed.append(k)
                # 把 csv_error 补入 failed
                for k in csv_error:
                    if k not in failed:
                        failed.append(k)
                checkpoint_manager.progress['completed_samples'] = completed
                checkpoint_manager.progress['failed_samples'] = failed
                checkpoint_manager._save_progress()
            except Exception:
                pass
        _sync_progress_with_results(checkpoint_manager)
    except Exception:
        pass

    # 检查是否有现有进度
    progress = checkpoint_manager.get_progress_summary()
    has_existing_progress = progress and progress.get('completed_samples', 0) > 0
    
    if has_existing_progress and not force_restart:
        print("🔍 检测到现有评估进度:")
        print(f"  评估ID: {progress['evaluation_id']}")
        print(f"  数据集: {progress['dataset_type']}")
        print(f"  模型: {progress['model_name']}")
        print(f"  已完成: {progress.get('completed_samples', 0)} 个样本")
        print(f"  失败: {progress.get('failed_samples', 0)} 个样本")
        print(f"  总样本数: {progress['total_samples']}")
        print(f"  进度: {progress['progress_percentage']:.1f}%")
        print(f"  最后更新: {progress['last_updated']}")
        print()
        
        if force_continue:
            print("📋 强制继续现有评估...")
            evaluation_id = progress['evaluation_id']
            # 若需要，更新总样本数
            try:
                if int(checkpoint_manager.progress.get('total_samples', 0)) != int(sample_size):
                    checkpoint_manager.progress['total_samples'] = int(sample_size)
                    checkpoint_manager._save_progress()
            except Exception:
                pass
        else:
            while True:
                choice = input("请选择操作 [C]继续现有评估 / [R]重新开始 / [Q]退出: ").strip().upper()
                if choice in ['C', 'CONTINUE', '继续']:
                    print("📋 继续现有评估...")
                    # 使用现有的evaluation_id
                    evaluation_id = progress['evaluation_id']
                    # 同步总样本数
                    try:
                        if int(checkpoint_manager.progress.get('total_samples', 0)) != int(sample_size):
                            checkpoint_manager.progress['total_samples'] = int(sample_size)
                            checkpoint_manager._save_progress()
                    except Exception:
                        pass
                    break
                elif choice in ['R', 'RESTART', '重新开始']:
                    print("🔄 清除缓存并重新开始...")
                    # 手动重置进度
                    import os
                    from datetime import datetime
                    progress_file = checkpoint_manager.progress_file
                    if os.path.exists(progress_file):
                        backup_file = f"{progress_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                        os.rename(progress_file, backup_file)
                        print(f"📋 进度已备份到: {backup_file}")
                    
                    # 删除结果CSV
                    results_csv = checkpoint_manager.results_csv
                    if os.path.exists(results_csv):
                        os.remove(results_csv)
                        print("🗑️ 已清除检测结果")
                    
                    evaluation_id = checkpoint_manager.start_evaluation(dataset_type, model_name, sample_size)
                    break
                elif choice in ['Q', 'QUIT', '退出']:
                    print("👋 退出检测")
                    return
                else:
                    print("❌ 无效选择，请输入 C/R/Q")
    else:
        # 没有现有进度或强制重新开始
        if has_existing_progress and force_restart:
            print("🔄 强制重新开始，清除现有缓存...")
            # 手动重置进度
            import os
            from datetime import datetime
            progress_file = checkpoint_manager.progress_file
            if os.path.exists(progress_file):
                backup_file = f"{progress_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                os.rename(progress_file, backup_file)
                print(f"📋 进度已备份到: {backup_file}")
            
            # 删除结果CSV
            results_csv = checkpoint_manager.results_csv
            if os.path.exists(results_csv):
                os.remove(results_csv)
                print("🗑️ 已清除检测结果")
        evaluation_id = checkpoint_manager.start_evaluation(dataset_type, model_name, sample_size)
    print(f"🚀 开始项目级漏洞检测评估: {evaluation_id}")
    print(f"📊 数据集类型: {dataset_type}")
    print(f"🤖 模型: {model_name}")
    print(f"📝 样本数量: {sample_size}")
    print()
    
    # 计算待处理的工作项（按项目与版本粒度）
    work_items = []  # List[Tuple[int, str]] of (sample_index, version)
    # 解析 indices 过滤
    indices_filter = set()
    if indices:
        try:
            for tok in str(indices).split(','):
                tok = tok.strip()
                if tok:
                    indices_filter.add(int(tok))
        except Exception:
            indices_filter = set()

    if has_existing_progress and evaluation_id == progress['evaluation_id']:
        # 继续现有评估，需要从checkpoint_manager获取详细的已完成样本键
        detailed_progress = checkpoint_manager.progress
        completed_keys = set(detailed_progress.get('completed_samples', []))
        failed_keys = set(detailed_progress.get('failed_samples', []))

        # 构建失败版本映射：index -> {vulnerable/fixed}
        failed_by_index = {}
        for k in failed_keys:
            try:
                ver = 'vulnerable' if str(k).endswith('_vulnerable') else ('fixed' if str(k).endswith('_fixed') else '')
                idx_str = str(k).split('_', 1)[0]
                idx = int(idx_str)
                if ver:
                    failed_by_index.setdefault(idx, set()).add(ver)
            except Exception:
                continue

        for i in range(sample_size):
            if indices_filter and i not in indices_filter:
                continue
            for version in ["vulnerable", "fixed"]:
                # 仅错误样本模式：只加入失败的 index/version
                if only_errors:
                    vers = failed_by_index.get(i, set())
                    if version not in vers:
                        continue
                # 忽略 project_name，仅按 index 和 version 判断处理状态
                prefix = f"{i}_"
                suffix = f"_{version}"
                done_in_completed = any(k.startswith(prefix) and k.endswith(suffix) for k in completed_keys)
                present_in_failed = any(k.startswith(prefix) and k.endswith(suffix) for k in failed_keys)
                # 若同时存在于completed与failed，视为需要重试（以failed为准）
                processed = done_in_completed and not present_in_failed
                if not processed:
                    work_items.append((i, version))

        if not work_items:
            print("✅ 所有样本已处理完成！")
            try:
                # 检查是否真正完成（completed+failed 覆盖 expanded_total）
                ps = checkpoint_manager.get_progress_summary()
                remaining = int(ps.get('remaining_samples', 0) or 0)
                if remaining == 0:
                    print("📦 正在自动触发评估（全量）...")
                    recompute_metrics(dataset_type=dataset_type or ps.get('dataset_type'))
                    show_summary()
                else:
                    print("ℹ️ 仍有剩余样本，暂不触发全量评估。")
            except Exception as e:
                print(f"⚠️ 自动评估失败: {e}")
                print(f"   可手动执行: python evaluation/checkpoint_utils.py recompute --dataset-type {dataset_type}")
                print(f"                 python evaluation/checkpoint_utils.py summary")
            return

        pending_by_index = {}
        for idx, ver in work_items:
            pending_by_index.setdefault(idx, []).append(ver)
        print("📋 继续处理剩余工作项:")
        for idx in sorted(pending_by_index.keys()):
            print(f"   样本 {idx}: {pending_by_index[idx]}")
    else:
        # 新的评估，全部加入（每个样本两个版本）
        for i in range(sample_size):
            if indices_filter and i not in indices_filter:
                continue
            for version in ["vulnerable", "fixed"]:
                # 新评估时 --only-errors 无意义，忽略
                work_items.append((i, version))
    
    # 处理工作项（按样本与版本）
    for widx, (i, version) in enumerate(work_items):
        print(f"🔍 处理样本 {i} [{version}] ({widx+1}/{len(work_items)})...")
        try:
                # 获取项目数据（按版本）
                project_data = _get_project_data(dataset_type, i, version=version)
                project_name = project_data['project_name']
                print(f"   项目: {project_name} [{version}]")
                
                # 格式化提示
                prompt = _format_project_prompt(project_data)
                print(f"   生成项目分析提示 ({len(prompt)} 字符)")
                
                # 调用LLM进行分析
                print("   🤖 调用LLM分析项目...")
                import time
                start_time = time.time()
                
                response = client.detect_vulnerability(prompt)
                processing_time = time.time() - start_time
                
                print(f"   ✅ LLM分析完成 ({processing_time:.2f}s)")
                print(f"   📋 检测结果: {response.get('has_vulnerability', False)}")
                if response.get('vulnerability_type'):
                    print(f"   🐛 漏洞类型: {response.get('vulnerability_type')}")
                
                # 构造样本数据（区分版本）
                gt_data = project_data['gt_data']
                is_fixed = (version == "fixed")
                sample_data = {
                    'index': i,
                    'id': f"{project_name}_{version}",
                    'has_vulnerability': False if is_fixed else (gt_data.get('cwe_ids') not in [None, '', 'None']),
                    'vulnerability_classification': '' if is_fixed else gt_data.get('cwe_ids', ''),
                    'vulnerable_code_paths': gt_data.get('vulnerable_code_paths', ''),
                    'vulnerable_function_names': gt_data.get('vulnerable_function_names', ''),
                    'file_path': '',
                    'function_name': gt_data.get('vulnerable_function_names', '').split(',')[0].strip() if gt_data.get('vulnerable_function_names') else '__file_scope__',
                    # 添加项目级元数据
                    'project_type': gt_data.get('project_type', ''),
                    'cve_ids': gt_data.get('cve_ids', ''),
                    'code_links': gt_data.get('code_links', ''),
                    'sources': gt_data.get('sources', ''),
                    'severity_breakdown': gt_data.get('severity_breakdown', ''),
                    'vulnerability_classification_breakdown': gt_data.get('vulnerability_classification_breakdown', ''),
                    'files': gt_data.get('files', ''),
                    'function_label_breakdown': gt_data.get('function_label_breakdown', ''),
                    'commit_shas': gt_data.get('commit_shas', ''),
                    'publish_date_last': gt_data.get('publish_date_last', ''),
                    'fixed_code_paths': gt_data.get('fixed_code_paths', ''),
                    'summaries_merged': gt_data.get('summaries_merged', ''),
                    'vulnerable_line_ranges': gt_data.get('vulnerable_line_ranges', ''),
                    'project_type_breakdown': gt_data.get('project_type_breakdown', ''),
                }
                
                # 提取预测指标
                metrics = {
                    'has_vulnerability_pred': response.get('has_vulnerability', False),
                    'vulnerability_type_pred': response.get('vulnerability_type', ''),
                    'filename_pred': response.get('filename', ''),
                    'function_name_pred': response.get('function_name', ''),
                    'vulnerable_lines_pred': response.get('vulnerable_lines', []),
                }

                # 判定是否为“None样”失败（如API失败的占位返回）：类型为None/空且无漏洞，且原始响应为空或解释包含API失败提示
                def _is_none_like_failure(resp: dict) -> bool:
                    try:
                        vt = str(resp.get('vulnerability_type', '')).strip().lower()
                        hv = bool(resp.get('has_vulnerability', False))
                        expl = str(resp.get('explanation', '')).replace('\n', ' ').strip()
                        raw = str(resp.get('raw_response', '')).strip()
                        return ((vt in ('none', '')) and (not hv) and (not raw or 'api调用失败' in expl))
                    except Exception:
                        return False

                status_flag = "error" if _is_none_like_failure(response) else "success"
                error_msg = "LLM API failure or empty fields (None-like response)" if status_flag == "error" else ""

                # 保存结果（按判定写入成功/失败）
                success = checkpoint_manager.save_sample_result(
                    sample_data, metrics, str(response), processing_time, status_flag, error_msg
                )
                
                if success:
                    if status_flag == "error":
                        print(f"   💾 结果已保存（标记为失败）")
                    else:
                        print(f"   💾 结果已保存")
                else:
                    print(f"   ❌ 保存失败")
                    
        except Exception as e:
                print(f"   ❌ 处理失败: {e}")
                # 保存错误记录
                error_sample_data = {
                    'index': i,
                    'id': f'{project_name}_{version}' if 'project_name' in locals() else f'sample_{i}_{version}',
                    'has_vulnerability': False,
                    'vulnerability_classification': '',
                    'vulnerable_code_paths': '',
                    'vulnerable_function_names': '',
                    'file_path': '',
                    'function_name': '',
                }
                error_metrics = {
                    'has_vulnerability_pred': False,
                    'vulnerability_type_pred': '',
                    'filename_pred': '',
                    'function_name_pred': '',
                    'vulnerable_lines_pred': [],
                }
                checkpoint_manager.save_sample_result(
                    error_sample_data, error_metrics, str(e), 0.0, "error", str(e)
                )
            
        print()
    
    print(f"🎉 检测完成！")
    # 检查是否达到完成条件（completed+failed 覆盖 expanded_total），若是则执行全量评估；否则不触发
    try:
        ps = checkpoint_manager.get_progress_summary()
        remaining = int(ps.get('remaining_samples', 0) or 0)
        if remaining == 0:
            print("📦 正在自动触发评估（全量）...")
            recompute_metrics(dataset_type=dataset_type or ps.get('dataset_type'))
            show_summary()
            print("✅ 评估完成。")
        else:
            print("ℹ️ 尚未覆盖全部样本，跳过全量评估触发。")
    except Exception as e:
        print(f"⚠️ 自动评估失败: {e}")
        print(f"   可手动执行: python evaluation/checkpoint_utils.py recompute --dataset-type {dataset_type}")
        print(f"                 python evaluation/checkpoint_utils.py summary")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="项目级漏洞检测")
    parser.add_argument("--dataset-type", type=str, default="original", 
                       choices=["original", "noise", "obfuscated", "noise_obfuscated", "prompt_injection"],
                       help="数据集类型")
    parser.add_argument("--sample-size", type=int, default=2, help="样本数量")
    parser.add_argument("--model", type=str, default="deepseek-ai/DeepSeek-V3.1", help="模型名称")
    parser.add_argument("--force-restart", action="store_true", 
                       help="强制重新开始，跳过缓存询问直接清除所有进度")
    parser.add_argument("--continue", dest="force_continue", action="store_true",
                       help="强制继续现有评估，跳过询问")
    parser.add_argument("--only-errors", action="store_true", help="仅重跑失败样本（需存在历史进度）")
    parser.add_argument("--indices", type=str, default="", help="仅处理指定索引（逗号分隔），例如: 0,5,12")
    args = parser.parse_args()

    # 处理互斥参数
    if args.force_restart and args.force_continue:
        print("❌ --force-restart 和 --continue 参数不能同时使用")
        sys.exit(1)

    detect_project_vulnerabilities(
        dataset_type=args.dataset_type,
        sample_size=args.sample_size,
        model_name=args.model,
        force_restart=args.force_restart,
        force_continue=args.force_continue,
        only_errors=args.only_errors,
        indices=args.indices,
    )
