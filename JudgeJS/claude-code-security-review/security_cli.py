#!/usr/bin/env python3
"""
Claude Code 漏洞检测系统主命令行接口
集成目录扫描、模型管理等功能
"""

import sys
import argparse
from pathlib import Path

# 添加当前目录到Python路径，以便导入模块
sys.path.insert(0, str(Path(__file__).parent.parent))

from claudecode.vulnerability_scanner import VulnerabilityScanner, print_scan_results
from claudecode.model_manager import ClaudeModelManager, print_model_list
from claudecode.constants import DEFAULT_CLAUDE_MODEL, EXIT_SUCCESS, EXIT_GENERAL_ERROR


def create_parser():
    """创建命令行参数解析器"""
    parser = argparse.ArgumentParser(
        description='Claude Code 漏洞检测系统',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 扫描当前目录
  python security_cli.py scan .
  
  # 扫描指定目录，排除某些文件夹
  python security_cli.py scan /path/to/project --exclude-dirs node_modules .git
  
  # 使用特定模型扫描
  python security_cli.py scan . --model claude-3-5-sonnet-20241022
  
  # 查看可用模型
  python security_cli.py model list
  
  # 切换模型
  python security_cli.py model set claude-opus-4-1-20250805
  
  # 查看当前模型
  python security_cli.py model current
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # 扫描命令
    scan_parser = subparsers.add_parser('scan', help='扫描目录中的安全漏洞')
    scan_parser.add_argument('target', help='要扫描的目标目录路径')
    scan_parser.add_argument('--model', default=DEFAULT_CLAUDE_MODEL,
                           help=f'要使用的Claude模型 (默认: {DEFAULT_CLAUDE_MODEL})')
    scan_parser.add_argument('--exclude-dirs', nargs='*', default=[],
                           help='要排除的目录列表')
    scan_parser.add_argument('--timeout', type=int, default=20,
                           help='扫描超时时间（分钟），默认20分钟')
    scan_parser.add_argument('--output-format', choices=['json', 'table', 'summary'],
                           default='table', help='输出格式')
    scan_parser.add_argument('--output-file', help='输出结果到指定文件')
    scan_parser.add_argument('--verbose', '-v', action='store_true',
                           help='显示详细输出')
    
    # 模型管理命令
    model_parser = subparsers.add_parser('model', help='模型管理')
    model_subparsers = model_parser.add_subparsers(dest='model_command', help='模型子命令')
    
    # 列出模型
    list_parser = model_subparsers.add_parser('list', help='列出所有可用模型')
    list_parser.add_argument('--format', choices=['table', 'json'], default='table',
                           help='输出格式')
    
    # 设置模型
    set_parser = model_subparsers.add_parser('set', help='设置当前使用的模型')
    set_parser.add_argument('model_name', help='要设置的模型名称')
    
    # 获取当前模型
    current_parser = model_subparsers.add_parser('current', help='显示当前使用的模型')
    current_parser.add_argument('--format', choices=['name', 'json'], default='name',
                              help='输出格式')
    
    # 验证
    validate_parser = model_subparsers.add_parser('validate', help='验证Claude Code是否可用')
    
    return parser


def handle_scan_command(args):
    """处理扫描命令"""
    try:
        # 验证目标路径
        target_path = Path(args.target).resolve()
        if not target_path.exists():
            print(f"Error: Target path does not exist: {target_path}")
            return EXIT_GENERAL_ERROR
        
        if not target_path.is_dir():
            print(f"Error: Target path is not a directory: {target_path}")
            return EXIT_GENERAL_ERROR
        
        # 初始化扫描器
        scanner = VulnerabilityScanner(
            claude_model=args.model,
            timeout_minutes=args.timeout
        )
        
        # 验证Claude Code是否可用
        claude_ok, claude_error = scanner.validate_claude_available()
        if not claude_ok:
            print(f"Error: Claude Code not available: {claude_error}")
            return EXIT_GENERAL_ERROR
        
        if args.verbose:
            print(f"Starting scan of directory: {target_path}")
            print(f"Using model: {args.model}")
            if args.exclude_dirs:
                print(f"Excluding directories: {args.exclude_dirs}")
            print()
        
        # 运行扫描
        results = scanner.scan_directory(target_path, args.exclude_dirs)
        
        # 输出结果
        if args.output_file:
            output_path = Path(args.output_file)
            with open(output_path, 'w', encoding='utf-8') as f:
                if args.output_format == 'json':
                    import json
                    json.dump(results, f, indent=2, ensure_ascii=False)
                else:
                    # 对于非JSON格式，重定向stdout到文件
                    import contextlib
                    with contextlib.redirect_stdout(f):
                        print_scan_results(results, args.output_format)
            
            if args.verbose:
                print(f"\n扫描结果已保存到: {output_path}")
        else:
            print_scan_results(results, args.output_format)
        
        # Determine exit code based on findings
        findings = results.get('findings', [])
        high_severity_count = len([f for f in findings if f.get('severity', '').upper() == 'HIGH'])
        
        if args.verbose:
            print(f"\nScan completed. Found {len(findings)} potential vulnerabilities, including {high_severity_count} high severity issues.")
        
        return EXIT_GENERAL_ERROR if high_severity_count > 0 else EXIT_SUCCESS
        
    except KeyboardInterrupt:
        print("\nScan interrupted by user")
        return EXIT_GENERAL_ERROR
    except Exception as e:
        print(f"Error during scanning: {str(e)}")
        return EXIT_GENERAL_ERROR


def handle_model_command(args):
    """处理模型管理命令"""
    manager = ClaudeModelManager()
    
    try:
        if args.model_command == 'list':
            models = manager.list_models()
            print_model_list(models, args.format)
            return EXIT_SUCCESS
        
        elif args.model_command == 'set':
            success, message = manager.set_model(args.model_name)
            print(message)
            return EXIT_SUCCESS if success else EXIT_GENERAL_ERROR
        
        elif args.model_command == 'current':
            current_model = manager.get_current_model()
            if args.format == 'json':
                import json
                result = {
                    'current_model': current_model,
                    'description': manager.MODEL_DESCRIPTIONS.get(current_model, '')
                }
                print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print(current_model)
            return EXIT_SUCCESS
        
        elif args.model_command == 'validate':
            success, message = manager.validate_claude_available()
            if success:
                print("Claude Code可用")
                current_model = manager.get_current_model()
                print(f"当前模型: {current_model}")
                return EXIT_SUCCESS
            else:
                print(f"Claude Code不可用: {message}")
                return EXIT_GENERAL_ERROR
        
        else:
            print("Error: No model subcommand specified")
            return EXIT_GENERAL_ERROR
            
    except Exception as e:
        print(f"模型操作失败: {str(e)}")
        return EXIT_GENERAL_ERROR


def main():
    """主函数"""
    parser = create_parser()
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return EXIT_SUCCESS
    
    try:
        if args.command == 'scan':
            return handle_scan_command(args)
        elif args.command == 'model':
            return handle_model_command(args)
        else:
            print(f"未知命令: {args.command}")
            parser.print_help()
            return EXIT_GENERAL_ERROR
    
    except KeyboardInterrupt:
        print("\n操作被用户中断")
        return EXIT_GENERAL_ERROR


if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)