#!/usr/bin/env python3
"""
Claude Code 漏洞检测系统快速入门脚本
"""

import os
import sys
from pathlib import Path

def print_header():
    """打印欢迎信息"""
    print("=" * 60)
    print("    Claude Code 漏洞检测系统")
    print("    AI驱动的智能代码安全审计工具")
    print("=" * 60)
    print()

def check_environment():
    """检查环境配置"""
    print("🔍 检查环境配置...")
    
    # 检查Python版本
    if sys.version_info < (3, 8):
        print("❌ Python版本过低，需要Python 3.8+")
        return False
    print(f"✅ Python版本: {sys.version.split()[0]}")
    
    # 检查API密钥
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ 未设置ANTHROPIC_API_KEY环境变量")
        print("   请运行: export ANTHROPIC_API_KEY='your-api-key'")
        return False
    print("✅ API密钥已配置")
    
    # 检查Claude Code CLI
    try:
        import subprocess
        result = subprocess.run(['claude', '--version'], 
                              capture_output=True, timeout=10)
        if result.returncode == 0:
            print("✅ Claude Code CLI已安装")
        else:
            print("❌ Claude Code CLI未正确安装")
            return False
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ 未找到Claude Code CLI")
        print("   请按照官方文档安装: https://docs.anthropic.com/en/docs/claude-code")
        return False
    
    return True

def show_quick_examples():
    """显示快速示例"""
    print("\n🚀 快速开始:")
    print("-" * 40)
    
    examples = [
        ("扫描当前目录", "python security_cli.py scan ."),
        ("查看可用模型", "python security_cli.py model list"),
        ("切换到快速模型", "python security_cli.py model set claude-3-haiku-20240307"),
        ("扫描并保存结果", "python security_cli.py scan . --output-file results.json"),
        ("排除特定目录", "python security_cli.py scan . --exclude-dirs node_modules .git"),
        ("查看详细帮助", "python security_cli.py --help")
    ]
    
    for desc, cmd in examples:
        print(f"  {desc}:")
        print(f"    {cmd}")
        print()

def interactive_demo():
    """交互式演示"""
    print("🎯 交互式演示:")
    print("-" * 40)
    
    while True:
        print("\n请选择一个操作:")
        print("1. 扫描当前目录")
        print("2. 查看可用模型")
        print("3. 查看当前模型")
        print("4. 验证环境配置")
        print("5. 退出")
        
        try:
            choice = input("\n请输入选项编号 (1-5): ").strip()
            
            if choice == '1':
                print("\n执行命令: python security_cli.py scan . --output-format summary")
                os.system("python security_cli.py scan . --output-format summary")
                
            elif choice == '2':
                print("\n执行命令: python security_cli.py model list")
                os.system("python security_cli.py model list")
                
            elif choice == '3':
                print("\n执行命令: python security_cli.py model current")
                os.system("python security_cli.py model current")
                
            elif choice == '4':
                print("\n执行命令: python security_cli.py model validate")
                os.system("python security_cli.py model validate")
                
            elif choice == '5':
                print("再见！")
                break
                
            else:
                print("无效选项，请重新选择")
                
        except KeyboardInterrupt:
            print("\n\n再见！")
            break

def main():
    """主函数"""
    print_header()
    
    # 检查环境
    if not check_environment():
        print("\n❌ 环境检查失败，请解决上述问题后重试")
        sys.exit(1)
    
    print("\n✅ 环境检查通过！")
    
    # 显示示例
    show_quick_examples()
    
    # 询问是否进入交互模式
    try:
        response = input("是否进入交互式演示模式？(y/N): ").strip().lower()
        if response in ['y', 'yes', '是']:
            interactive_demo()
        else:
            print("\n📖 更多详细信息请查看:")
            print("  - 使用手册: USER_MANUAL.md")
            print("  - 输出格式说明: docs/output_format.md")
            print("  - 在线帮助: python security_cli.py --help")
            
    except KeyboardInterrupt:
        print("\n\n再见！")

if __name__ == '__main__':
    main()