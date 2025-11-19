#!/usr/bin/env python3
"""
断点续传管理工具
提供命令行接口来管理评估检查点
"""

import argparse
import os
import sys
import json
from datetime import datetime
import csv
import pandas as pd
import shutil
import re
from typing import Dict, Any, List

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from evaluation.checkpoint_manager import CheckpointManager
from evaluation.metrics import summarize_confusions, similarity_rates, similarity_means
from evaluation.metrics import compute_project_tuple_confusion, compute_function_quad_confusion, precision_recall_f1
from config.config import DATA_CONFIG, CONSENSUS_CONFIG
from models.llm_client import LLMClient
from evaluation.metrics import build_metrics_for_sample
from utils.project_loader import ProjectLoader
import os as _os_for_prompt
import sys as _sys_for_prompt
# 添加 claude-code-security-review 到路径
_claude_path = _os_for_prompt.path.join(_os_for_prompt.path.dirname(_os_for_prompt.path.dirname(_os_for_prompt.path.abspath(__file__))), 'claude-code-security-review')
if _os_for_prompt.path.exists(_claude_path):
    _sys_for_prompt.path.append(_claude_path)
    from claudecode.prompts import get_vulnerability_detection_prompt
else:
    # 如果找不到，尝试从父目录查找
    _parent_claude_path = _os_for_prompt.path.join(_os_for_prompt.path.dirname(_os_for_prompt.path.dirname(_os_for_prompt.path.dirname(_os_for_prompt.path.abspath(__file__)))), 'claude-code-security-review')
    if _os_for_prompt.path.exists(_parent_claude_path):
        _sys_for_prompt.path.append(_parent_claude_path)
        from claudecode.prompts import get_vulnerability_detection_prompt
    else:
        raise ImportError("claude-code-security-review 模块未找到。请确保该模块存在于 JudgeJS 目录或父目录中。")


def show_progress(model_name: str = "deepseek-ai/DeepSeek-V3.1", dataset_type: str = "original", include_errors_in_remaining: bool = False):
    """显示当前评估进度（按模型和数据集）"""
    checkpoint_manager = CheckpointManager(model_name=model_name, dataset_type=dataset_type)
    progress = checkpoint_manager.get_progress_summary(include_errors_in_remaining=include_errors_in_remaining)
    
    if progress and progress.get('evaluation_id'):
        print("📊 当前评估进度:")
        print(f"  评估ID: {progress['evaluation_id']}")
        print(f"  数据集: {progress['dataset_type']}")
        print(f"  模型: {progress['model_name']}")
        print(f"  总样本数: {progress['total_samples']}")
        print(f"  已完成: {progress['completed_samples']}")
        if progress.get('include_errors_in_remaining'):
            print(f"  失败: 0 (已并入剩余)")
            print(f"  剩余: {progress['remaining_samples']} (含error)")
        else:
            print(f"  失败: {progress['failed_samples']}")
            print(f"  剩余: {progress['remaining_samples']}")
        print(f"  进度: {progress['progress_percentage']:.1f}%")
        print(f"  开始时间: {progress['start_time']}")
        print(f"  最后更新: {progress['last_updated']}")
    else:
        print("ℹ️ 没有找到评估进度")


def sync_progress_from_results(model_name: str = "deepseek-ai/DeepSeek-V3.1", dataset_type: str = "original"):
    """将 results CSV 中的 success/error 同步到进度文件：
    - success → 加入 completed_samples
    - error → 从 completed_samples 剔除并加入 failed_samples
    """
    cm = CheckpointManager(model_name=model_name, dataset_type=dataset_type)
    results_csv = cm.results_csv
    if not os.path.exists(results_csv):
        print("ℹ️ 未找到结果CSV，跳过同步")
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
        completed = list(dict.fromkeys(cm.progress.get('completed_samples', [])))
        failed = list(dict.fromkeys(cm.progress.get('failed_samples', [])))
        # 从 completed 移除任何在 csv_error 中的键
        completed = [k for k in completed if k not in csv_error]
        # success 补入 completed
        for k in csv_success:
            if k not in completed:
                completed.append(k)
        # error 补入 failed
        for k in csv_error:
            if k not in failed:
                failed.append(k)
        cm.progress['completed_samples'] = completed
        cm.progress['failed_samples'] = failed
        cm._save_progress()
        print(f"✅ 已同步进度：success={len(csv_success)} error={len(csv_error)}")
    except Exception as e:
        print(f"❌ 同步失败: {e}")


def show_results():
    """显示评估结果"""
    checkpoint_manager = CheckpointManager()
    results_csv = checkpoint_manager.results_csv
    
    if os.path.exists(results_csv):
        try:
            df = pd.read_csv(results_csv)
            print(f"📈 评估结果 ({len(df)} 条记录):")
            print(f"  结果文件: {results_csv}")
            
            # 显示统计信息
            if len(df) > 0:
                print(f"  成功样本: {len(df[df['status'] == 'success'])}")
                print(f"  失败样本: {len(df[df['status'] == 'error'])}")
                
                # 显示指标统计（移除旧逐字段准确率展示）
                if 'cosine_similarity' in df.columns:
                    print(f"  平均余弦相似度: {df['cosine_similarity'].mean():.3f}")
                
                # 显示前几条记录
                print("\n  前5条记录:")
                for i, row in df.head().iterrows():
                    print(f"    {i+1}. 样本{row['sample_index']} - 状态: {row['status']}")
                    # 不再显示旧的accuracy/f1字段
        except Exception as e:
            print(f"❌ 读取结果文件失败: {e}")
    else:
        print("ℹ️ 没有找到结果文件")


def show_summary(model_name: str = "deepseek-ai/DeepSeek-V3.1", dataset_type: str = "original"):
    """汇总当前结果CSV，输出项目级/函数级的TP/TN/FP/FN与P/R/F1，以及语义相似率。"""
    checkpoint_manager = CheckpointManager(model_name=model_name, dataset_type=dataset_type)
    results_csv = checkpoint_manager.results_csv
    if not os.path.exists(results_csv):
        print("ℹ️ 没有找到结果文件")
        return
    try:
        try:
            df = pd.read_csv(results_csv)
        except Exception:
            df = pd.read_csv(results_csv, engine='python', on_bad_lines='skip')
        # 仅统计成功样本
        if 'status' in df.columns:
            df = df[df['status'].astype(str).str.lower() == 'success']
        rows = df.to_dict(orient='records')
        proj = summarize_confusions(rows, 'project')
        func = summarize_confusions(rows, 'function')
        sims_mean = similarity_means(rows)
        print("\n===== Summary (Current Results) =====")
        print("Project-level:")
        print(f"  TP: {proj['project_tp']}  TN: {proj['project_tn']}  FP: {proj['project_fp']}  FN: {proj['project_fn']}")
        print(f"  Precision: {proj['project_precision']:.3f}  Recall: {proj['project_recall']:.3f}  F1: {proj['project_f1']:.3f}")
        print("Function-level:")
        print(f"  TP: {func['function_tp']}  TN: {func['function_tn']}  FP: {func['function_fp']}  FN: {func['function_fn']}")
        print(f"  Precision: {func['function_precision']:.3f}  Recall: {func['function_recall']:.3f}  F1: {func['function_f1']:.3f}")
        print("Similarity means:")
        print(f"  Cosine mean: {sims_mean['cosine_similarity_mean']:.3f}")
        print(f"  BERT mean:   {sims_mean['bert_similarity_mean']:.3f}")
        print(f"  ROUGE mean:  {sims_mean['rouge_score_mean']:.3f}")
    except Exception as e:
        print(f"❌ 汇总失败: {e}")


def _get_dataset_df(dataset_type: str) -> pd.DataFrame:
    dt = dataset_type or DATA_CONFIG.get('default_dataset_type', 'original')
    ds_cfg = DATA_CONFIG['dataset_types'].get(dt)
    if not ds_cfg:
        raise RuntimeError(f"未知数据集类型: {dt}")
    path = ds_cfg['path']
    if not os.path.exists(path):
        raise FileNotFoundError(f"数据集不存在: {path}")
    # 尝试多种读取方式，最大化兼容
    try:
        return pd.read_csv(path)
    except Exception:
        try:
            return pd.read_csv(path, engine='python', on_bad_lines='skip')
        except Exception:
            # 退化为分块读取
            chunks = []
            for chunk in pd.read_csv(path, engine='python', on_bad_lines='skip', chunksize=1000):
                chunks.append(chunk)
            if chunks:
                return pd.concat(chunks, ignore_index=True)
            raise


def _get_project_data(dataset_type: str, sample_index: int, version: str = "vulnerable") -> Dict[str, Any]:
    """
    获取项目级数据用于LLM分析
    
    Args:
        dataset_type: 数据集类型
        sample_index: 样本索引
        version: 项目版本（"vulnerable" 或 "fixed"）
        
    Returns:
        包含项目信息的字典
    """
    # 获取数据集配置
    dt = dataset_type or DATA_CONFIG.get('default_dataset_type', 'original')
    ds_cfg = DATA_CONFIG['dataset_types'].get(dt)
    if not ds_cfg:
        raise RuntimeError(f"未知数据集类型: {dt}")
    
    # 获取GT数据
    df = _get_dataset_df(dataset_type)
    if sample_index >= len(df):
        raise IndexError(f"样本索引 {sample_index} 超出数据集范围 [0, {len(df)-1}]")
    
    gt_row = df.iloc[sample_index]
    project_name = str(gt_row.get('project_name', '') or '').strip()
    cve_ids = str(gt_row.get('cve_ids', '') or '').strip()

    import re as _re
    # 1) 校验并提取 owner_repo
    # 支持 'owner/repo' 或 直接 'owner_repo'
    if '/' in project_name:
        owner, _, repo = project_name.partition('/')
    else:
        parts = project_name.split('_')
        if len(parts) >= 2:
            owner, repo = parts[0], parts[1]
        else:
            raise ValueError(f"[GT invalid] sample_index={sample_index}: project_name malformed: '{project_name}'")
    if not owner or not repo:
        raise ValueError(f"[GT invalid] sample_index={sample_index}: project_name missing owner/repo: '{project_name}'")
    allowed = _re.compile(r'^[A-Za-z0-9_.-]{1,64}$')
    if not allowed.match(owner) or not allowed.match(repo):
        raise ValueError(f"[GT invalid] sample_index={sample_index}: project_name contains illegal chars: '{project_name}'")

    owner_repo = f"{owner}_{repo}"

    # 2) 选取合法的 CVE（仅取首个匹配）
    m = _re.search(r'(CVE-\d{4}-\d+)', cve_ids)
    if not m:
        raise ValueError(f"[GT invalid] sample_index={sample_index}: cve_ids malformed: '{cve_ids}'")
    cve = m.group(1)

    # 3) 拼接严格目录名并验证存在性
    actual_project_dir = f"{owner_repo}_{cve}"
    
    # 初始化项目加载器
    projects_dir = ds_cfg.get('projects_dir', '../ArenaJS/projects')
    loader = ProjectLoader(projects_dir)

    # 目录存在性检查（不回退）
    def _dir_exists(dir_name: str) -> bool:
        try:
            p = loader.get_project_path(dir_name, version)
            return p is not None
        except Exception:
            return False
    if not _dir_exists(actual_project_dir):
        raise FileNotFoundError(f"[GT mismatch] sample_index={sample_index}: project directory not found: '{actual_project_dir}' under '{projects_dir}'")

    # 加载项目数据（支持 vulnerable/fixed 两个版本）
    project_data = loader.load_project_for_analysis(actual_project_dir, version)
    if not project_data:
        # 如果项目加载失败，返回基本信息
        return {
            'project_name': project_name,
            'project_description': f'项目 {project_name}',
            'file_structure': '项目结构无法获取',
            'source_files': '源代码无法获取',
            'gt_data': gt_row.to_dict()
        }
    
    # 添加GT数据
    project_data['gt_data'] = gt_row.to_dict()
    project_data['version'] = version
    return project_data


def _format_project_prompt(project_data: Dict[str, Any]) -> str:
    """
    格式化项目数据为LLM提示
    
    Args:
        project_data: 项目数据字典
        
    Returns:
        格式化后的提示字符串
    """
    return get_vulnerability_detection_prompt(project_data)


def _normalize_text(s: str) -> str:
    return (str(s) if s is not None else '').strip().lower()


def _normalize_project_key(name: str) -> str:
    return _normalize_text(name).replace('/', '_')


def _split_list_field(s: str) -> list:
    if s is None:
        return []
    return [x.strip() for x in str(s).split(';') if str(x).strip()]


def _basename(p: str) -> str:
    try:
        return os.path.basename(str(p).strip())
    except Exception:
        return str(p).strip()


def _align_gt_row(det_row: Dict[str, Any], df: pd.DataFrame) -> Dict[str, Any]:
    """
    Simple GT alignment: only use sample_index if valid, no complex matching.
    """
    if df is None or df.empty:
        return {}
    
    # Only use sample_index direct match if it's a valid integer within dataset range
    try:
        idx = int(det_row.get('sample_index', -1))
        if 0 <= idx < len(df):
            return df.iloc[idx].to_dict()
    except Exception:
        pass
    
    # If sample_index is invalid or out of range, return empty dict
    return {}


def recompute_metrics(dataset_type: str = None, sample: bool = False, sample_from_dataset: bool = False, sample_size: int = 2, model_name: str = "deepseek-ai/DeepSeek-V3.1"):
    """读取当前模型结果CSV，基于GT与llm_response重算新增指标并回写CSV。"""
    if not dataset_type:
        dataset_type = "original"  # 默认使用original
    checkpoint_manager = CheckpointManager(model_name=model_name, dataset_type=dataset_type)
    results_csv = checkpoint_manager.results_csv
    if not os.path.exists(results_csv):
        print("ℹ️ 没有找到结果文件")
        return
    df = None
    try:
        df = _get_dataset_df(dataset_type or checkpoint_manager.progress.get('dataset_type', DATA_CONFIG.get('default_dataset_type')))
    except Exception as e:
        print(f"⚠️ 数据集读取失败，将以检测CSV自身字段为准继续重算: {e}")
    try:
        res = pd.read_csv(results_csv)
        # 仅对成功样本重算与聚合
        if 'status' in res.columns:
            res = res[res['status'].astype(str).str.lower() == 'success']
        if sample:
            take_n = max(1, int(sample_size))
            selected_sample_indices = set()
            if sample_from_dataset and df is not None and not df.empty:
                # 选取数据集前N个 sample_index
                selected_sample_indices = set(list(df.index)[:take_n])
                wanted = [str(i) for i in selected_sample_indices]
                mask = res['sample_index'].astype(str).isin(wanted) if 'sample_index' in res.columns else pd.Series([False]*len(res))
                sel = res[mask]
                if sel.empty:
                    target_indices = set(res.head(take_n).index.tolist())
                    # 回退：从结果中选取前N个唯一 sample_index
                    unique_idx = []
                    for _, r in res.iterrows():
                        try:
                            si = int(r.get('sample_index'))
                        except Exception:
                            continue
                        if si not in unique_idx:
                            unique_idx.append(si)
                        if len(unique_idx) >= take_n:
                            break
                    selected_sample_indices = set(unique_idx)
                else:
                    target_indices = set(sel.index.tolist())
            else:
                # 无数据集时，从结果中选取前N个唯一 sample_index
                target_indices = set()
                unique_idx = []
                for i, r in res.iterrows():
                    try:
                        si = int(r.get('sample_index'))
                    except Exception:
                        continue
                    if si not in unique_idx:
                        unique_idx.append(si)
                        selected_sample_indices.add(si)
                    if len(unique_idx) >= take_n:
                        break
                    target_indices.add(i)
        else:
            target_indices = set(res.index.tolist())
            selected_sample_indices = set(res['sample_index'].dropna().astype(int).unique().tolist()) if 'sample_index' in res.columns else set()
        client = LLMClient()
        updated_rows: List[Dict[str, Any]] = []
        for i, row in res.iterrows():
            if i not in target_indices:
                updated_rows.append(row)
                continue
            gt_row = _align_gt_row(row, df) if df is not None else {}
            # 构造 sample_data
            sample_data: Dict[str, Any] = {
                'has_vulnerability': bool(row.get('has_vulnerability_gt', False)),
                'vulnerability_classification': str(row.get('vulnerability_type_gt', '') or (gt_row.get('vulnerability_classification_breakdown', '') if gt_row else '')),
                'vulnerable_code_paths': str(gt_row.get('vulnerable_code_paths', '')) if gt_row else '',
                'vulnerable_function_names': str(gt_row.get('vulnerable_function_names', '')) if gt_row else '',
                'file_path': str(gt_row.get('file_path', '')) if gt_row else '',
                'function_name': str(gt_row.get('function_name', '')) if gt_row else '',
                'files': str(gt_row.get('files', '')) if gt_row else '',
                # 供传统F1中的“噪声函数命中即加严”逻辑使用
                'dataset_type': str(dataset_type or ''),
                'sample_id': str(row.get('sample_id', '') or ''),
                'function_names': str(gt_row.get('function_names', '') if gt_row else ''),
            }
            # 解析预测
            llm_result: Dict[str, Any] = {
                'has_vulnerability': bool(row.get('has_vulnerability_pred', False)),
                'vulnerability_type': str(row.get('vulnerability_type_pred', '')),
                'filename': str(row.get('filename_pred', '')),
                'function_name': str(row.get('function_name_pred', '')),
            }
            # 如果缺失，尝试从 llm_response 解析；同时获取 explanation 纯文本
            parsed = None
            if (not llm_result['vulnerability_type']) or (not llm_result['filename'] and not llm_result['function_name']):
                parsed = client._parse_detection_response(str(row.get('llm_response', '')))
                if parsed:
                    llm_result.update({k: v for k, v in parsed.items() if k in {'has_vulnerability', 'vulnerability_type', 'filename', 'function_name'}})
            else:
                # 也尝试解析以提取 explanation 用于相似度
                parsed = client._parse_detection_response(str(row.get('llm_response', '')))

            gt_text = str(gt_row.get('summaries_merged', '')) if gt_row else ''
            pred_text = str(parsed.get('explanation', '')) if parsed else ''
            m = build_metrics_for_sample(sample_data, llm_result, gt_text, pred_text)
            # 可选：计算单行的precision/recall/f1不可行（需聚合），此处仅存贡献
            for k, v in m.items():
                row[k] = v
            # 回填解析得到但CSV中缺失的预测列值（以便导出）
            if parsed:
                if not row.get('vulnerability_type_pred') and parsed.get('vulnerability_type'):
                    row['vulnerability_type_pred'] = parsed.get('vulnerability_type')
                if not row.get('filename_pred') and parsed.get('filename'):
                    row['filename_pred'] = parsed.get('filename')
                if not row.get('function_name_pred') and parsed.get('function_name'):
                    row['function_name_pred'] = parsed.get('function_name')
            # sample 模式标记 evaluation_id
            if sample:
                ev = str(row.get('evaluation_id', ''))
                if not ev.endswith('_sample'):
                    row['evaluation_id'] = (ev + '_sample') if ev else 'eval_sample'
            updated_rows.append(row)
        # 追加聚合P/R/F1（每行放空，聚合由summary命令计算）；保持内部 results_csv 列稳定（不在此处删除列）
        res_updated = pd.DataFrame(updated_rows)
        res_updated.to_csv(results_csv, index=False)
        print("✅ 已基于GT与LLM响应重算并更新指标列" + ("（sample模式）" if sample else ""))

        # 命名导出：按模型名输出 evaluation / detection 命名文件
        try:
            if not res_updated.empty and 'model_name' in res_updated.columns:
                model_name = str(res_updated.iloc[0].get('model_name', 'model')).strip() or 'model'
            else:
                model_name = 'model'
            safe_model = model_name.replace('/', '_').replace(':', '_').replace(' ', '_')
            sample_suffix = '_sample' if (sample or any(str(x).endswith('_sample') for x in res_updated.get('evaluation_id', []))) else ''
            export_dir = os.path.join('evaluation', 'exports')
            os.makedirs(export_dir, exist_ok=True)
            # 1) detection 导出：sample 模式导出所选 sample_index 的所有行（两项目×两个版本=4行）；否则导出原始模型结果
            det_src = os.path.join('evaluation', 'checkpoints', 'models', safe_model, 'results', 'evaluation_results.csv')
            # dataset_type for naming
            dataset_type = str(res_updated.iloc[0].get('dataset_type','')) if not res_updated.empty else ''
            safe_dt = (dataset_type.strip() or 'dataset').replace('/', '_').replace(':', '_').replace(' ', '_')
            det_out = os.path.join(export_dir, f"{safe_model}_{safe_dt}_detection{sample_suffix}.csv")
            try:
                if os.path.exists(det_src):
                    det_df = pd.read_csv(det_src)
                else:
                    det_df = res_updated.copy()
                
                # 添加GT原始字段
                try:
                    gt_df = _get_dataset_df(dataset_type)
                    if not gt_df.empty and len(det_df) > 0:
                        # GT原始字段列表
                        gt_columns = [
                            'project_type', 'cve_ids', 'code_links', 'n_code_links', 'sources',
                            'severity_breakdown', 'vulnerability_classification_breakdown', 
                            'files', 'function_label_breakdown', 'commit_shas', 'publish_date_last',
                            'vulnerable_code_paths', 'fixed_code_paths', 'summaries_merged', 
                            'vulnerable_line_ranges', 'vulnerable_function_names', 'project_type_breakdown'
                        ]
                        # 为每个detection行添加GT原始字段
                        for i, row in det_df.iterrows():
                            sample_idx = row.get('sample_index')
                            if pd.notna(sample_idx) and 0 <= int(sample_idx) < len(gt_df):
                                gt_row = gt_df.iloc[int(sample_idx)]
                                for gt_col in gt_columns:
                                    if gt_col in gt_row.index:
                                        det_df.at[i, f'gt_{gt_col}'] = gt_row[gt_col]
                        # 按需保留GT原始字段（不再添加顶层重复字段以避免冗余）
                        # 对于 fixed 版本，将与漏洞类型/位置相关的 GT 字段清空，避免与“已修复”语义冲突
                        if 'sample_id' in det_df.columns:
                            vuln_location_cols = [
                                'gt_vulnerable_code_paths',
                                'gt_vulnerable_line_ranges',
                                'gt_vulnerable_function_names',
                                'gt_vulnerability_classification_breakdown',
                            ]
                            fixed_mask = det_df['sample_id'].astype(str).str.contains('_fixed')
                            for vc in vuln_location_cols:
                                if vc in det_df.columns:
                                    det_df.loc[fixed_mask, vc] = ''
                except Exception as e:
                    print(f"⚠️ 添加GT字段失败: {e}")
                
                # 检测导出移除仅内部用的时间戳与聚合字段；保留逐样本相似度原始数值与判定标志
                drop_cols = [
                    'timestamp',
                    # 去除混淆矩阵相关逐样本列（检测CSV仅保留原始GT与预测+相似度）
                    'project_confusion','project_tp','project_tn','project_fp','project_fn',
                    'project_precision','project_recall','project_f1',
                    'function_confusion','function_tp','function_tn','function_fp','function_fn',
                    'function_precision','function_recall','function_f1'
                ]
                for c in drop_cols:
                    if c in det_df.columns:
                        det_df = det_df.drop(columns=[c])
                if sample:
                    if 'sample_index' in det_df.columns:
                        wanted = [str(i) for i in (selected_sample_indices or set())]
                        det_sample = det_df[det_df['sample_index'].astype(str).isin(wanted)]
                        det_sample.to_csv(det_out, index=False)
                    else:
                        det_df.head(take_n * 2).to_csv(det_out, index=False)
                else:
                    det_df.to_csv(det_out, index=False)
                print(f"📁 检测结果已导出: {det_out}")
            except Exception:
                pass

            # 2) evaluation 导出：写出聚合后的宏观一行CSV（不含逐项目明细）
            # 选择参与汇总的行：sample 模式下汇总所选的 sample_index 全部行（通常4行），否则全部
            if sample:
                if 'sample_index' in res_updated.columns and selected_sample_indices:
                    wanted = [str(i) for i in selected_sample_indices]
                    agg_rows = res_updated[res_updated['sample_index'].astype(str).isin(wanted)].to_dict(orient='records')
                else:
                    agg_rows = res_updated.head(take_n * 2).to_dict(orient='records')
            else:
                agg_rows = res_updated.to_dict(orient='records')
            proj = summarize_confusions(agg_rows, 'project')
            func = summarize_confusions(agg_rows, 'function')
            sims_means = similarity_means(agg_rows)
            summary_cols = [
                'model_name','dataset_type','num_samples',
                'project_tp','project_tn','project_fp','project_fn','project_precision','project_recall','project_f1',
                'function_tp','function_tn','function_fp','function_fn','function_precision','function_recall','function_f1',
                'cosine_similarity_mean','bert_similarity_mean','rouge_score_mean'
            ]
            summary_row = {
                'model_name': model_name,
                'dataset_type': dataset_type,
                'num_samples': len(agg_rows),
                **proj,
                **func,
                'cosine_similarity_mean': sims_means.get('cosine_similarity_mean',0.0),
                'bert_similarity_mean': sims_means.get('bert_similarity_mean',0.0),
                'rouge_score_mean': sims_means.get('rouge_score_mean',0.0),
            }
            eval_out = os.path.join(export_dir, f"{safe_model}_{safe_dt}_evaluation{sample_suffix}.csv")
            pd.DataFrame([summary_row])[summary_cols].to_csv(eval_out, index=False)
            print(f"📁 评估结果已导出: {eval_out}")
        except Exception as e:
            print(f"⚠️ 命名导出失败: {e}")
    except Exception as e:
        print(f"❌ 重算失败: {e}")


def consensus_summary(dataset_type: str = "original", target_model: str = None, theta: float = None):
    """跨模型基于共识(包含目标模型)修正真实标签 y_cons，
    并按“与现有F1相同的判定口径”分别计算项目级与函数级的 Cons-Precision/Recall/F1。

    约定：
    - 仅统计 status == 'success' 的记录；错误/缺失视为弃权，从该样本的 M 中移除。
    - 每条检测记录(key = sample_index + sample_id)独立计算共识；同一 index 的 vulnerable/fixed 分别计。
    - 共识投票 K(x) 使用 has_vulnerability_pred 为正例判断。
    - 目标模型包含在共识集合 M 中（按用户要求）。
    """
    models_dir = os.path.join('evaluation', 'checkpoints', 'models')
    if not os.path.isdir(models_dir):
        print("ℹ️ 未发现模型结果目录")
        return
    theta = float(theta if theta is not None else CONSENSUS_CONFIG.get('consensus_threshold', 0.6))

    # 读取所有模型的该数据集结果
    def _safe_key(row: pd.Series) -> str:
        try:
            return f"{int(row.get('sample_index'))}_{str(row.get('sample_id','')).strip()}"
        except Exception:
            return f"{str(row.get('sample_index','')).strip()}_{str(row.get('sample_id','')).strip()}"

    model_to_df: Dict[str, pd.DataFrame] = {}
    for folder in sorted(os.listdir(models_dir)):
        res_csv = os.path.join(models_dir, folder, 'results', f'evaluation_results_{dataset_type}.csv')
        if not os.path.exists(res_csv):
            continue
        try:
            df = pd.read_csv(res_csv)
            if 'status' in df.columns:
                df = df[df['status'].astype(str).str.lower() == 'success']
            if df.empty:
                continue
            df = df.copy()
            df['__key__'] = df.apply(_safe_key, axis=1)
            model_to_df[folder] = df
        except Exception:
            continue

    if not model_to_df:
        print("ℹ️ 未找到任何模型的成功样本结果")
        return

    # 建立共识标签 y_cons[key]
    all_keys: set = set()
    for df in model_to_df.values():
        all_keys.update(df['__key__'].unique().tolist())

    # 为每个 key 计算 M 和 K
    y_cons: Dict[str, int] = {}
    for key in all_keys:
        M = 0
        K = 0
        for df in model_to_df.values():
            rows = df[df['__key__'] == key]
            if rows.empty:
                continue  # 该模型缺失此样本 -> 不计入M
            M += 1
            try:
                hv = bool(rows.iloc[0].get('has_vulnerability_pred', False))
            except Exception:
                hv = False
            if hv:
                K += 1
        if M > 0:
            y_cons[key] = 1 if (K / M) >= theta else 0
        else:
            # 理论上不会进入（all_keys由各模型并集而来），容错为负例
            y_cons[key] = 0

    # 对每个模型，按与现有F1相同的y_pred口径，替换真实标签为 y_cons，计算两个层级的混淆与PRF1
    def _row_to_sample_pred(row: pd.Series, y_true_cons: int) -> (Dict[str, Any], Dict[str, Any]):
        # sample_data: 使用GT字段，但 has_vulnerability 由共识替换
        sample_data = {
            'has_vulnerability': bool(y_true_cons),
            'vulnerability_classification': str(row.get('vulnerability_type_gt', '') or ''),
            'vulnerability_type': str(row.get('vulnerability_type_gt', '') or ''),
            'vulnerable_code_paths': str(row.get('vulnerable_code_paths', '') or ''),
            'vulnerable_function_names': str(row.get('vulnerable_function_names', '') or ''),
            'file_path': str(row.get('file_path', '') or ''),
            'function_name': str(row.get('function_name', '') or ''),
            'files': str(row.get('files', '') or ''),
        }
        llm_result = {
            'has_vulnerability': bool(row.get('has_vulnerability_pred', False)),
            'vulnerability_type': str(row.get('vulnerability_type_pred', '') or ''),
            'filename': str(row.get('filename_pred', '') or ''),
            'function_name': str(row.get('function_name_pred', '') or ''),
        }
        return sample_data, llm_result

    # 允许指定 target_model，仅输出该模型；否则输出所有
    selected_models = [target_model] if target_model else list(model_to_df.keys())
    # 正常化选择（用文件夹名匹配）
    selected_models = [m for m in selected_models if m in model_to_df] if target_model else selected_models
    if target_model and not selected_models:
        print(f"❌ 目标模型未找到: {target_model}")
        return

    print("\n===== Consensus-F1 Summary =====")
    print(f"Dataset: {dataset_type}  Theta: {theta}")
    for folder in selected_models:
        df = model_to_df[folder]
        # 友好名称：优先CSV中的model_name
        model_friendly = None
        try:
            if 'model_name' in df.columns and not df.empty:
                model_friendly = str(df.iloc[0].get('model_name', folder))
        except Exception:
            model_friendly = None
        model_label = model_friendly or folder

        proj_tp = proj_tn = proj_fp = proj_fn = 0
        func_tp = func_tn = func_fp = func_fn = 0

        for _, row in df.iterrows():
            key = row['__key__']
            y_true = int(y_cons.get(key, 0))
            sample_data, llm_result = _row_to_sample_pred(row, y_true)
            # 项目级
            _, proj_counts = compute_project_tuple_confusion(sample_data, llm_result)
            proj_tp += int(proj_counts.get('project_tp', 0))
            proj_tn += int(proj_counts.get('project_tn', 0))
            proj_fp += int(proj_counts.get('project_fp', 0))
            proj_fn += int(proj_counts.get('project_fn', 0))
            # 函数级
            _, func_counts = compute_function_quad_confusion(sample_data, llm_result)
            func_tp += int(func_counts.get('function_tp', 0))
            func_tn += int(func_counts.get('function_tn', 0))
            func_fp += int(func_counts.get('function_fp', 0))
            func_fn += int(func_counts.get('function_fn', 0))

        p_p, r_p, f1_p = precision_recall_f1(proj_tp, proj_fp, proj_fn)
        p_f, r_f, f1_f = precision_recall_f1(func_tp, func_fp, func_fn)

        print(f"\nModel: {model_label}")
        print("Project-level (consensus true labels):")
        print(f"  TP: {proj_tp}  TN: {proj_tn}  FP: {proj_fp}  FN: {proj_fn}")
        print(f"  Precision: {p_p:.3f}  Recall: {r_p:.3f}  F1: {f1_p:.3f}")
        print("Function-level (consensus true labels):")
        print(f"  TP: {func_tp}  TN: {func_tn}  FP: {func_fp}  FN: {func_fn}")
        print(f"  Precision: {p_f:.3f}  Recall: {r_f:.3f}  F1: {f1_f:.3f}")


def export_results(output_path: str = None):
    """导出评估结果"""
    checkpoint_manager = CheckpointManager()
    
    if output_path:
        output_file = checkpoint_manager.export_results(output_path)
    else:
        output_file = checkpoint_manager.export_results()
    
    if output_file:
        print(f"✅ 结果已导出到: {output_file}")
    else:
        print("❌ 导出失败")


def cleanup_checkpoints(max_age_days: int = 7):
    """清理旧的检查点文件"""
    checkpoint_manager = CheckpointManager()
    checkpoint_manager.cleanup_old_checkpoints(max_age_days)
    print(f"🧹 已清理 {max_age_days} 天前的检查点文件")


def reset_evaluation():
    """重置评估进度"""
    checkpoint_manager = CheckpointManager()
    
    # 备份当前进度
    progress_file = checkpoint_manager.progress_file
    if os.path.exists(progress_file):
        backup_file = f"{progress_file}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.rename(progress_file, backup_file)
        print(f"📋 当前进度已备份到: {backup_file}")
    
    # 重置进度
    checkpoint_manager.progress = {
        "evaluation_id": "",
        "start_time": "",
        "dataset_type": "",
        "model_name": "",
        "total_samples": 0,
        "completed_samples": [],
        "failed_samples": [],
        "current_sample_index": 0,
        "last_updated": ""
    }
    checkpoint_manager._save_progress()
    print("🔄 评估进度已重置")


def show_checkpoint_files():
    """显示检查点文件信息"""
    checkpoint_manager = CheckpointManager()
    
    print("📁 检查点文件信息:")
    print(f"  检查点目录: {checkpoint_manager.checkpoint_dir}")
    print(f"  进度文件: {checkpoint_manager.progress_file}")
    print(f"  结果文件: {checkpoint_manager.results_csv}")
    
    # 检查文件存在性
    if os.path.exists(checkpoint_manager.progress_file):
        progress_size = os.path.getsize(checkpoint_manager.progress_file)
        progress_time = datetime.fromtimestamp(os.path.getmtime(checkpoint_manager.progress_file))
        print(f"  进度文件: 存在 ({progress_size} bytes, 修改时间: {progress_time})")
    else:
        print("  进度文件: 不存在")
    
    if os.path.exists(checkpoint_manager.results_csv):
        results_size = os.path.getsize(checkpoint_manager.results_csv)
        results_time = datetime.fromtimestamp(os.path.getmtime(checkpoint_manager.results_csv))
        print(f"  结果文件: 存在 ({results_size} bytes, 修改时间: {results_time})")
    else:
        print("  结果文件: 不存在")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="断点续传管理工具")
    subparsers = parser.add_subparsers(dest='command', help='子命令')
    
    # 显示进度命令
    progress_parser = subparsers.add_parser('progress', help='显示当前评估进度')
    progress_parser.add_argument('--model', type=str, default="deepseek-ai/DeepSeek-V3.1", help='模型名称')
    progress_parser.add_argument('--dataset-type', type=str, default="original", help='数据集类型')
    progress_parser.add_argument('--include-errors', action='store_true', help='将 error 计入剩余（remaining）')
    # 同步进度命令
    sync_parser = subparsers.add_parser('sync', help='将results CSV中的success/error同步到进度文件')
    sync_parser.add_argument('--model', type=str, default="deepseek-ai/DeepSeek-V3.1", help='模型名称')
    sync_parser.add_argument('--dataset-type', type=str, default="original", help='数据集类型')
    
    # 显示结果命令
    results_parser = subparsers.add_parser('results', help='显示评估结果')
    # 汇总
    summary_parser = subparsers.add_parser('summary', help='汇总当前结果的TP/TN/FP/FN与P/R/F1及语义相似率')
    summary_parser.add_argument('--model', type=str, default="deepseek-ai/DeepSeek-V3.1", help='模型名称')
    summary_parser.add_argument('--dataset-type', type=str, default="original", help='数据集类型')
    # 重算新增指标
    recompute_parser = subparsers.add_parser('recompute', help='重算并填充结果CSV中的新增评估指标列')
    recompute_parser.add_argument('--model', type=str, default="deepseek-ai/DeepSeek-V3.1", help='模型名称')
    recompute_parser.add_argument('--dataset-type', type=str, default=None, help='数据集类型（默认从进度中读取）')
    recompute_parser.add_argument('--sample', action='store_true', help='仅对少量样本执行（evaluation_id追加 _sample 标记）')
    recompute_parser.add_argument('--sample-from-dataset', action='store_true', help='从数据集前N条中选择样本（匹配 sample_index），否则从检测CSV前N条选择')
    recompute_parser.add_argument('--sample-size', type=int, default=2, help='采样条数（默认2）')
    # 多模型共识
    consensus_parser = subparsers.add_parser('consensus', help='基于多模型共识计算Cons-F1摘要（项目级/函数级）')
    consensus_parser.add_argument('--dataset-type', type=str, default='original', help='数据集类型（与常规F1一致）')
    consensus_parser.add_argument('--target-model', type=str, default=None, help='仅输出指定模型（文件夹名，如 deepseek-ai_DeepSeek-V3.1）')
    consensus_parser.add_argument('--theta', type=float, default=None, help='共识阈值，默认0.6（可按数据集自行指定）')
    
    # 导出结果命令
    export_parser = subparsers.add_parser('export', help='导出评估结果')
    export_parser.add_argument('--output', '-o', type=str, help='输出文件路径')
    
    # 清理检查点命令
    cleanup_parser = subparsers.add_parser('cleanup', help='清理旧的检查点文件')
    cleanup_parser.add_argument('--days', '-d', type=int, default=7, help='保留天数')
    
    # 重置评估命令
    reset_parser = subparsers.add_parser('reset', help='重置评估进度')
    
    # 显示文件信息命令
    files_parser = subparsers.add_parser('files', help='显示检查点文件信息')
    
    args = parser.parse_args()
    
    if args.command == 'progress':
        show_progress(
            getattr(args, 'model', "deepseek-ai/DeepSeek-V3.1"),
            getattr(args, 'dataset_type', "original"),
            getattr(args, 'include_errors', False)
        )
    elif args.command == 'sync':
        sync_progress_from_results(
            getattr(args, 'model', "deepseek-ai/DeepSeek-V3.1"),
            getattr(args, 'dataset_type', "original")
        )
    elif args.command == 'results':
        show_results()
    elif args.command == 'summary':
        show_summary(
            getattr(args, 'model', "deepseek-ai/DeepSeek-V3.1"),
            getattr(args, 'dataset_type', "original")
        )
    elif args.command == 'recompute':
        recompute_metrics(
            getattr(args, 'dataset_type', None),
            getattr(args, 'sample', False),
            getattr(args, 'sample_from_dataset', False),
            getattr(args, 'sample_size', 2),
            getattr(args, 'model', "deepseek-ai/DeepSeek-V3.1"),
        )
    elif args.command == 'consensus':
        consensus_summary(
            getattr(args, 'dataset_type', 'original'),
            getattr(args, 'target_model', None),
            getattr(args, 'theta', None),
        )
    elif args.command == 'export':
        export_results(args.output)
    elif args.command == 'cleanup':
        cleanup_checkpoints(args.days)
    elif args.command == 'reset':
        reset_evaluation()
    elif args.command == 'files':
        show_checkpoint_files()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
