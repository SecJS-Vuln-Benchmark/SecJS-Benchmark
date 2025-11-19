#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
主控脚本：串联执行四步数据集构建流水线
1) js_cve_scraper.py        抓取NVD CVE并过滤JS相关
2) js_commit_info.py        提取GitHub提交信息与代码
3) js_function_extractor.py 提取函数级信息并产出最终benchmark
4) js_dataset_augmentor.py  数据集增强（混淆、噪声、组合）

可选参数允许覆盖第一步抓取的日期范围、CVSS阈值、是否使用API Key、是否强制刷新缓存。
支持数据集增强的各种配置选项。

使用示例：
  # 基础流水线
  python main.py --start 2022-01-01 --end 2022-03-31
  
  # 包含数据集增强
  python main.py --enable-augmentation --augment-strategies obfuscated
  
  # 仅运行数据集增强
  python main.py --only-augmentation --augment-strategies medium_obfuscation
  
  # 数据集增强（包含项目处理）
  python main.py --only-augmentation --augment-strategies obfuscated
"""

import os
import sys
import argparse
import traceback
from datetime import datetime


def run_step_cve_scraper(args) -> bool:
    """运行第一步：抓取NVD CVE并保存到 data/js_cve_dataset.csv"""
    try:
        import js_cve_scraper as scraper

        # 覆盖可选参数
        if args.start:
            scraper.CVE_START_DATE = args.start
        if args.end:
            scraper.CVE_END_DATE = args.end
        if args.cvss_min is not None:
            scraper.CVSS_MIN_SCORE = float(args.cvss_min)
        if args.results_per_page is not None:
            scraper.RESULTS_PER_PAGE = int(args.results_per_page)
        if args.use_api_key is not None:
            scraper.USE_API_KEY = (str(args.use_api_key).lower() == 'true')
        if args.force_refresh is not None:
            scraper.FORCE_REFRESH = (str(args.force_refresh).lower() == 'true')

        print("\n=== Step 1/3: Scrape CVEs ===")
        scraper.main()

        csv_out = os.path.join('data', 'js_cve_dataset.csv')
        exists = os.path.exists(csv_out)
        if not exists:
            print(f"[ERROR] 未找到输出文件: {csv_out}")
        return exists

    except Exception:
        print("[ERROR] 执行 js_cve_scraper 失败：")
        traceback.print_exc()
        return False


def run_step_commit_info() -> bool:
    """运行第二步：提取GitHub提交信息与代码，保存到 data/js_vulnerability_dataset.csv"""
    try:
        import js_commit_info as commit
        print("\n=== Step 2/3: Extract GitHub Commits & Code ===")
        commit.main()

        csv_out = os.path.join('data', 'js_vulnerability_dataset.csv')
        exists = os.path.exists(csv_out)
        if not exists:
            print(f"[ERROR] 未找到输出文件: {csv_out}")
        return exists

    except Exception:
        print("[ERROR] 执行 js_commit_info 失败：")
        traceback.print_exc()
        return False


def run_step_function_extractor() -> bool:
    """运行第三步：函数级提取，保存明细与最终 benchmark (data/final_dataset.csv)"""
    try:
        import js_function_extractor as extractor
        print("\n=== Step 3/3: Extract Functions & Build Benchmark ===")
        extractor.main()

        csv_out = os.path.join('data', 'final_dataset.csv')
        exists = os.path.exists(csv_out)
        if not exists:
            print(f"[ERROR] 未找到输出文件: {csv_out}")
        return exists

    except Exception:
        print("[ERROR] 执行 js_function_extractor 失败：")
        traceback.print_exc()
        return False


def resolve_strategy_aliases(strategies):
    """解析策略别名，将简化名称映射为实际策略名称"""
    # 简化的策略别名 - 只保留核心的3个
    STRATEGY_ALIASES = {
        'noise': 'medium_noise',
        'obfuscated': 'medium_obfuscation', 
        'combined': 'medium_obfuscation_medium_noise',
        'prompt_injection': 'prompt_injection'
    }
    
    resolved_strategies = []
    for strategy in strategies:
        if strategy in STRATEGY_ALIASES:
            resolved_strategy = STRATEGY_ALIASES[strategy]
            print(f"📝 使用策略: {strategy} → {resolved_strategy}")
            resolved_strategies.append(resolved_strategy)
        else:
            resolved_strategies.append(strategy)
    
    return resolved_strategies


def run_step_dataset_augmentation(args) -> bool:
    """运行第四步：数据集增强，生成混淆、噪声和组合数据集"""
    try:
        import js_dataset_augmentor as augmentor
        from augmentation_config import get_strategy_config, ALL_STRATEGIES
        
        print("\n=== Step 4/4: Dataset Augmentation ===")
        
        # 创建增强器实例（支持断点续传）
        resume_enabled = (str(getattr(args, 'resume_augmentation', 'true')).lower() == 'true')
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cp_dir_arg = getattr(args, 'checkpoint_dir', None)
        if cp_dir_arg and not os.path.isabs(cp_dir_arg):
            cp_dir_arg = os.path.join(project_root, cp_dir_arg)
        dataset_augmentor = augmentor.DatasetAugmentor(
            checkpoint_dir=cp_dir_arg,
            resume_enabled=resume_enabled
        )
        
        # 根据参数选择增强策略
        if args.augment_strategies:
            # 解析策略别名
            strategies = resolve_strategy_aliases(args.augment_strategies)
        else:
            # 默认策略
            strategies = ['obfuscated', 'noise', 'combined']
        
        print(f"选择的增强策略: {strategies}")
        
        # 检查策略有效性
        for strategy_name in strategies:
            if strategy_name not in ALL_STRATEGIES:
                print(f"[ERROR] 未知增强策略: {strategy_name}")
                print(f"可用策略: {list(ALL_STRATEGIES.keys())}")
                return False
        
        # 执行数据集增强
        success = True
        
        for strategy_name in strategies:
            try:
                print(f"\n--- 策略 {strategy_name} 配置验证 ---")
                strategy = get_strategy_config(strategy_name)
                print(f"✅ 策略 {strategy_name} 配置正确")
                
            except Exception as e:
                print(f"[ERROR] 策略 {strategy_name} 配置失败: {e}")
                if args.strict_mode:
                    success = False
                    break
        
        # 检测采样模式：若提供了 --augment-sample-size，则仅处理前N条并跳过项目级增强
        sample_size = getattr(args, 'augment_sample_size', None)
        sample_mode = isinstance(sample_size, int) and sample_size > 0

        # 项目级增强处理（默认启用；采样模式则跳过项目级，仅执行CSV级增强）
        if success:
            try:
                if sample_mode:
                    print("\n=== 采样模式 (仅CSV级增强) ===")
                    print(f"🎯 仅处理前 {sample_size} 条记录，跳过项目级增强")
                else:
                    print("\n=== 项目级增强处理 ===")
                    print(f"📂 源目录: {args.projects_dir}")
                    print(f"📂 输出目录: {args.augmented_projects_dir}")
                    cp_display = cp_dir_arg if cp_dir_arg else 'checkpoints'
                    print(f"🔁 断点续传: {'启用' if resume_enabled else '禁用'}  |  🧩 检查点目录: {cp_display}")
                
                # 根据策略确定项目级处理类型
                project_strategy_types = []
                for strategy_name in strategies:
                    strategy = get_strategy_config(strategy_name)
                    enable_obfuscation = getattr(strategy, 'enable_obfuscation', False)
                    enable_noise = getattr(strategy, 'enable_noise_injection', False)
                    
                    if enable_obfuscation and enable_noise:
                        if 'noise_obfuscated' not in project_strategy_types:
                            project_strategy_types.append('noise_obfuscated')
                    elif enable_obfuscation:
                        if 'obfuscated' not in project_strategy_types:
                            project_strategy_types.append('obfuscated')
                    elif enable_noise:
                        if 'noise' not in project_strategy_types:
                            project_strategy_types.append('noise')
                    else:
                        # 独立策略（如 prompt_injection）
                        if 'prompt_injection' not in project_strategy_types and strategy_name == 'prompt_injection':
                            project_strategy_types.append('prompt_injection')
                
                if project_strategy_types:
                    # 计算噪声密度（或策略特定密度）
                    noise_density = 0.3
                    for strategy_name in strategies:
                        strategy = get_strategy_config(strategy_name)
                        if hasattr(strategy, 'noise_config') and strategy.noise_config:
                            noise_density = strategy.noise_config.noise_density
                            break

                    if sample_mode:
                        # 采样模式：仅执行CSV级增强，限制前N条
                        try:
                            csv_outputs = dataset_augmentor.generate_csv_level_augmented_dataset(
                                final_csv_path='data/final_dataset.csv',
                                output_csv_dir='data',
                                strategy_types=project_strategy_types,
                                noise_density=noise_density,
                                resume=resume_enabled,
                                sample_size=sample_size,
                                prefer_reuse=False
                            )
                            if csv_outputs:
                                print("\n📝 生成增强CSV(采样):")
                                for k, v in csv_outputs.items():
                                    print(f"  • {k}: {v}")
                                print("✅ 采样CSV生成完成")
                            else:
                                print("⚠️ 采样CSV未产生输出")
                        except Exception as e:
                            print(f"[ERROR] 采样CSV生成失败: {e}")
                            if args.strict_mode:
                                success = False
                    else:
                        # 常规模式：先项目级增强，再CSV级提取
                        print(f"🎯 项目级处理策略: {project_strategy_types}")
                        project_success = dataset_augmentor.generate_project_level_augmented_datasets(
                            projects_dir=args.projects_dir,
                            output_dir=args.augmented_projects_dir,
                            strategy_types=project_strategy_types,
                            noise_density=noise_density,
                            resume=resume_enabled
                        )
                        
                        if project_success:
                            print("✅ 项目级增强完成")
                            print("\n=== 从增强项目提取单文件 ===")
                            try:
                                csv_outputs = dataset_augmentor.generate_csv_level_augmented_dataset(
                                    final_csv_path='data/final_dataset.csv',
                                    output_csv_dir='data',
                                    strategy_types=project_strategy_types,
                                    noise_density=noise_density,
                                    resume=resume_enabled,
                                    sample_size=getattr(args, 'augment_sample_size', None)
                                )
                                if csv_outputs:
                                    print("\n📝 生成增强CSV:")
                                    for k, v in csv_outputs.items():
                                        print(f"  • {k}: {v}")
                                    if k == 'obfuscated' and os.path.exists('data/obfuscated_dataset.csv'):
                                        print(f"    ✓ 已生成统一命名文件: data/obfuscated_dataset.csv")
                                    elif k == 'noise' and os.path.exists('data/noise_dataset.csv'):
                                        print(f"    ✓ 已生成统一命名文件: data/noise_dataset.csv")
                                    elif k == 'noise_obfuscated' and os.path.exists('data/noise_obfuscated_dataset.csv'):
                                        print(f"    ✓ 已生成统一命名文件: data/noise_obfuscated_dataset.csv")
                                    print("✅ 单文件提取和CSV生成完成")
                                else:
                                    print("⚠️ 单文件提取未产生输出")
                            except Exception as e:
                                print(f"[ERROR] 单文件提取失败: {e}")
                                if args.strict_mode:
                                    success = False
                        else:
                            print("❌ 项目级增强失败")
                            success = False
                else:
                    print("⚠️ 没有找到适用的项目级处理策略")
                    
            except Exception as e:
                print(f"[ERROR] 项目级增强失败: {e}")
                if args.strict_mode:
                    success = False
        
        if success:
            print("\n✅ 数据集增强完成")
        
        return success
        
    except Exception as e:
        print(f"[ERROR] 执行 js_dataset_augmentor 失败：{e}")
        traceback.print_exc()
        return False


def parse_args():
    parser = argparse.ArgumentParser(
        description="运行四步JS漏洞数据集构建流水线",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 运行完整流水线
  python main.py --start 2022-01-01 --end 2022-03-31
  
  # 仅运行数据集增强
  python main.py --only-augmentation --augment-strategies obfuscated
  
  # 列出所有可用策略
  python main.py --list-strategies
        """
    )
    
    # === 基础流水线参数 ===
    basic_group = parser.add_argument_group('基础流水线参数')
    basic_group.add_argument('--start', dest='start', type=str, default=None, 
                           help='CVE开始日期 YYYY-MM-DD')
    basic_group.add_argument('--end', dest='end', type=str, default=None, 
                           help='CVE结束日期 YYYY-MM-DD')
    basic_group.add_argument('--cvss-min', dest='cvss_min', type=float, default=None, 
                           help='最小CVSS分数')
    basic_group.add_argument('--results-per-page', dest='results_per_page', type=int, default=None, 
                           help='每页结果数')
    basic_group.add_argument('--use-api-key', dest='use_api_key', type=str, 
                           choices=['true', 'false'], default=None, 
                           help='是否使用API Key (true/false)')
    basic_group.add_argument('--force-refresh', dest='force_refresh', type=str, 
                           choices=['true', 'false'], default=None, 
                           help='是否强制刷新 (true/false)')
    
    # === 数据集增强参数 ===
    augment_group = parser.add_argument_group('数据集增强参数')
    augment_group.add_argument('--enable-augmentation', action='store_true',
                             help='启用数据集增强（第四步）')
    augment_group.add_argument('--only-augmentation', action='store_true',
                             help='仅运行数据集增强，跳过前三步')
    augment_group.add_argument('--augment-strategies', nargs='+', default=None,
                             help='指定增强策略：noise(噪声), obfuscated(混淆), combined(组合)')
    # 添加位置参数支持，用于简化用法
    augment_group.add_argument('strategies', nargs='*', help='策略名称(位置参数): noise, obfuscated, combined')
    augment_group.add_argument('--augment-sample-size', type=int, default=None,
                             help='增强时使用的样本大小（用于测试）')
    augment_group.add_argument('--list-strategies', action='store_true',
                             help='列出所有可用的增强策略')
    augment_group.add_argument('--projects-dir', type=str, default='../ArenaJS/projects',
                             help='项目源目录路径')
    augment_group.add_argument('--augmented-projects-dir', type=str, default='../ArenaJS/augmented_projects',
                             help='增强项目输出目录')
    augment_group.add_argument('--resume-augmentation', dest='resume_augmentation', type=str,
                             choices=['true', 'false'], default='true',
                             help='是否启用增强断点续传 (true/false)')
    augment_group.add_argument('--checkpoint-dir', dest='checkpoint_dir', type=str,
                             default='checkpoints',
                             help='增强检查点目录')
    
    # === 数据集路径参数 ===
    path_group = parser.add_argument_group('数据集路径参数')
    path_group.add_argument('--base-dataset-path', type=str, default=None,
                          help='基础数据集路径（默认：data/final_dataset.csv）')
    path_group.add_argument('--function-dataset-path', type=str, default=None,
                          help='函数级数据集路径（默认：data/js_functions_data/js_functions_dataset.csv）')
    
    # === 执行控制参数 ===
    control_group = parser.add_argument_group('执行控制参数')
    control_group.add_argument('--skip-step1', action='store_true',
                             help='跳过第一步（CVE抓取）')
    control_group.add_argument('--skip-step2', action='store_true',
                             help='跳过第二步（提交信息提取）')
    control_group.add_argument('--skip-step3', action='store_true',
                             help='跳过第三步（函数提取）')
    control_group.add_argument('--skip-base-augmentation', action='store_true',
                             help='跳过基础数据集增强')
    control_group.add_argument('--skip-function-augmentation', action='store_true',
                             help='跳过函数级数据集增强')
    control_group.add_argument('--strict-mode', action='store_true',
                             help='严格模式：任何步骤失败都会终止整个流程')
    
    return parser.parse_args()


def list_available_strategies():
    """列出所有可用的增强策略"""
    try:
        from augmentation_config import list_all_strategies, get_obfuscation_strategies, get_noise_strategies, get_combined_strategies
        
        print("\n🎯 可用策略:")
        print("  • noise - 添加噪声干扰")
        print("  • obfuscated - 代码混淆")
        print("  • combined - 噪声+混淆")
        print("  • prompt_injection - 提示注入注释")
        
        print("\n使用示例:")
        print("  python main.py --only-augmentation --augment-strategies noise")
        print("  python main.py --only-augmentation --augment-strategies obfuscated")
        print("  python main.py --only-augmentation --augment-strategies combined")
        print("  python main.py --only-augmentation --augment-strategies prompt_injection")
        
    except ImportError:
        print("❌ 无法导入增强配置模块，请确保 augmentation_config.py 存在")


def main():
    args = parse_args()
    
    # 处理位置参数的策略（向后兼容）
    if args.strategies and not args.augment_strategies:
        args.augment_strategies = args.strategies
        args.only_augmentation = True  # 自动启用增强模式
    
    # 处理特殊命令
    if args.list_strategies:
        list_available_strategies()
        return
    
    print("\n===== JavaScript Vulnerability Dataset Pipeline =====")
    
    # 显示执行计划
    steps_to_run = []
    if not args.only_augmentation:
        if not args.skip_step1:
            steps_to_run.append("Step 1: CVE抓取")
        if not args.skip_step2:
            steps_to_run.append("Step 2: 提交信息提取")
        if not args.skip_step3:
            steps_to_run.append("Step 3: 函数级提取")
    
    if args.enable_augmentation or args.only_augmentation:
        steps_to_run.append("Step 4: 数据集增强")
    
    print(f"📋 执行计划: {' → '.join(steps_to_run)}")
    print()

    t0 = datetime.now()
    success_steps = 0
    total_steps = len(steps_to_run)
    
    # 执行基础流水线
    if not args.only_augmentation:
        # 第一步：CVE抓取
        if not args.skip_step1:
            ok1 = run_step_cve_scraper(args)
            if not ok1:
                print("❌ 流程中止（Step 1 失败）")
                if args.strict_mode:
                    return
            else:
                success_steps += 1
        
        # 第二步：提交信息提取
        if not args.skip_step2:
            ok2 = run_step_commit_info()
            if not ok2:
                print("❌ 流程中止（Step 2 失败）")
                if args.strict_mode:
                    return
            else:
                success_steps += 1
        
        # 第三步：函数级提取
        if not args.skip_step3:
            ok3 = run_step_function_extractor()
            if not ok3:
                print("❌ 流程中止（Step 3 失败）")
                if args.strict_mode:
                    return
            else:
                success_steps += 1
    
    # 第四步：数据集增强
    if args.enable_augmentation or args.only_augmentation:
        try:
            ok4 = run_step_dataset_augmentation(args)
            if not ok4:
                print("❌ 数据集增强失败")
                if args.strict_mode:
                    return
            else:
                success_steps += 1
        except ImportError:
            print("❌ 无法导入数据集增强模块，请确保相关文件存在")
            print("   需要文件: js_dataset_augmentor.py, augmentation_config.py")

    used = datetime.now() - t0
    
    # 输出结果总结
    print("\n" + "=" * 50)
    print("🎉 Pipeline 执行完成")
    print(f"⏱️  总耗时: {used}")
    print(f"✅ 成功步骤: {success_steps}/{total_steps}")
    
    print("\n📁 产出文件:")
    output_files = []
    
    if not args.only_augmentation:
        if os.path.exists('data/js_cve_dataset.csv'):
            output_files.append("  - data/js_cve_dataset.csv (CVE基础数据)")
        if os.path.exists('data/js_vulnerability_dataset.csv'):
            output_files.append("  - data/js_vulnerability_dataset.csv (增强漏洞数据)")
        if os.path.exists('data/final_dataset.csv'):
            output_files.append("  - data/final_dataset.csv (最终数据集)")
            
    if args.enable_augmentation or args.only_augmentation:
        # 只显示本次执行的策略产生的文件
        if hasattr(args, 'augment_strategies') and args.augment_strategies:
            from augmentation_config import get_strategy_config
            for strategy_name in args.augment_strategies:
                try:
                    strategy = get_strategy_config(strategy_name)
                    expected_files = [
                        f"data/augmented/{strategy.output_prefix}/final_dataset_{strategy.output_prefix}.csv"
                    ]
                    for file_path in expected_files:
                        if os.path.exists(file_path):
                            output_files.append(f"  - {file_path} (本次生成)")
                except:
                    pass
    
    for file_info in output_files:
        print(file_info)
    
    if not output_files:
        print("  ⚠️ 未检测到输出文件")
    
    print("\n📖 使用说明:")
    print("  - 查看可用策略: python main.py --list-strategies")
    print("  - 数据集增强: python main.py --only-augmentation --augment-strategies [策略名]")
    print("  - 完整帮助: python main.py --help")
    print("  - 示例: python main.py --only-augmentation --augment-strategies obfuscated")
    
    if success_steps == total_steps:
        print("\n🎊 所有步骤执行成功！")
    else:
        print(f"\n⚠️ 部分步骤失败，成功率: {success_steps/total_steps*100:.1f}%")


if __name__ == '__main__':
    main()


