#!/usr/bin/env python3
"""
Claude模型管理工具
支持列出可用模型、切换模型、查看当前模型等功能
"""

import os
import json
import argparse
import subprocess
from typing import List, Dict, Any, Tuple, Optional


class ClaudeModelManager:
    """Claude模型管理器"""
    
    # 可用的Claude模型列表
    AVAILABLE_MODELS = [
        'claude-opus-4-1-20250805',
        'claude-3-5-sonnet-20241022', 
        'claude-3-5-sonnet-20240620',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
    ]
    
    # 模型描述
    MODEL_DESCRIPTIONS = {
        'claude-opus-4-1-20250805': 'Claude Opus 4.1 - 最新最强大的模型，适用于复杂的安全审计',
        'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet - 平衡性能和速度，适合日常扫描',
        'claude-3-5-sonnet-20240620': 'Claude 3.5 Sonnet (早期版本)',
        'claude-3-opus-20240229': 'Claude 3 Opus - 强大的推理能力',
        'claude-3-sonnet-20240229': 'Claude 3 Sonnet - 平衡的性能',
        'claude-3-haiku-20240307': 'Claude 3 Haiku - 快速响应，适合简单扫描'
    }
    
    def __init__(self):
        """初始化模型管理器"""
        pass
    
    def _find_claude_command(self) -> Optional[str]:
        """查找claude命令的完整路径"""
        # 首先尝试which命令
        try:
            result = subprocess.run(['which', 'claude'], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                path = result.stdout.strip()
                if path and os.path.isfile(path):
                    return path
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        # 检查常见的conda环境路径
        possible_paths = [
            '/data_hdd/lx20/anaconda3/envs/js_vuln_benchmark/bin/claude',
            os.path.expanduser('~/anaconda3/envs/js_vuln_benchmark/bin/claude'),
            'claude'  # 最后尝试直接使用命令名
        ]
        
        for path in possible_paths:
            if os.path.isfile(path) and os.access(path, os.X_OK):
                return path
        
        # 如果都找不到，返回None
        return None
    
    def get_current_model(self) -> str:
        """获取当前使用的模型"""
        # 优先从环境变量获取
        model = os.environ.get('CLAUDE_MODEL')
        if model:
            return model
        
        # 尝试从claude命令获取
        try:
            claude_path = self._find_claude_command()
            if claude_path:
                env = os.environ.copy()
                result = subprocess.run(
                    [claude_path, 'model'],
                    capture_output=True,
                    text=True,
                    timeout=10,
                    env=env
                )
            if result.returncode == 0:
                # 解析输出获取当前模型
                output = result.stdout.strip()
                if 'model as' in output:
                    # 提取模型名称
                    model_name = output.split('model as')[1].strip().strip('[]')
                    return model_name
        except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
            pass
        
        # 默认模型
        return 'claude-opus-4-1-20250805'
    
    def set_model(self, model_name: str) -> Tuple[bool, str]:
        """设置Claude模型
        
        Args:
            model_name: 模型名称
            
        Returns:
            (成功标志, 消息)的元组
        """
        if model_name not in self.AVAILABLE_MODELS:
            return False, f"未知的模型: {model_name}。可用模型: {', '.join(self.AVAILABLE_MODELS)}"
        
        try:
            # 查找claude命令路径
            claude_path = self._find_claude_command()
            if not claude_path:
                return False, "Claude Code未安装或不在PATH中"
            
            # 使用claude命令设置模型
            env = os.environ.copy()
            result = subprocess.run(
                [claude_path, 'model', model_name],
                capture_output=True,
                text=True,
                timeout=30,
                env=env
            )
            
            if result.returncode == 0:
                return True, f"成功切换到模型: {model_name}"
            else:
                error_msg = result.stderr or result.stdout or "未知错误"
                return False, f"切换模型失败: {error_msg}"
        
        except subprocess.TimeoutExpired:
            return False, "切换模型超时"
        except FileNotFoundError:
            return False, "Claude Code未安装或不在PATH中"
        except Exception as e:
            return False, f"切换模型时发生错误: {str(e)}"
    
    def list_models(self) -> List[Dict[str, str]]:
        """列出所有可用模型
        
        Returns:
            模型信息列表
        """
        current_model = self.get_current_model()
        
        models = []
        for model in self.AVAILABLE_MODELS:
            models.append({
                'name': model,
                'description': self.MODEL_DESCRIPTIONS.get(model, ''),
                'current': model == current_model
            })
        
        return models
    
    def validate_claude_available(self) -> Tuple[bool, str]:
        """验证Claude Code是否可用"""
        try:
            # 查找claude命令路径
            claude_path = self._find_claude_command()
            if not claude_path:
                return False, "Claude Code未安装或不在PATH中"
            
            env = os.environ.copy()
            result = subprocess.run(
                [claude_path, '--version'],
                capture_output=True,
                text=True,
                timeout=10,
                env=env
            )
            
            if result.returncode == 0:
                # 检查API密钥
                api_key = os.environ.get('ANTHROPIC_API_KEY', '')
                if not api_key:
                    return False, "未设置ANTHROPIC_API_KEY环境变量"
                return True, ""
            else:
                return False, f"Claude Code执行失败: {result.stderr or result.stdout}"
        
        except subprocess.TimeoutExpired:
            return False, "Claude Code命令超时"
        except FileNotFoundError:
            return False, "Claude Code未安装或不在PATH中"
        except Exception as e:
            return False, f"检查Claude Code失败: {str(e)}"


def print_model_list(models: List[Dict[str, str]], format_type: str = 'table'):
    """打印模型列表
    
    Args:
        models: 模型信息列表
        format_type: 输出格式 ('table', 'json')
    """
    if format_type == 'json':
        print(json.dumps(models, indent=2, ensure_ascii=False))
    else:
        print("可用的Claude模型:")
        print("=" * 80)
        
        for model in models:
            status = "[当前]" if model['current'] else "      "
            print(f"{status} {model['name']}")
            if model['description']:
                print(f"       {model['description']}")
            print()


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Claude模型管理器')
    
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # 列出模型命令
    list_parser = subparsers.add_parser('list', help='列出所有可用模型')
    list_parser.add_argument('--format', choices=['table', 'json'], default='table',
                           help='输出格式')
    
    # 设置模型命令  
    set_parser = subparsers.add_parser('set', help='设置当前使用的模型')
    set_parser.add_argument('model', help='要设置的模型名称')
    
    # 获取当前模型命令
    current_parser = subparsers.add_parser('current', help='显示当前使用的模型')
    current_parser.add_argument('--format', choices=['name', 'json'], default='name',
                              help='输出格式')
    
    # 验证命令
    validate_parser = subparsers.add_parser('validate', help='验证Claude Code是否可用')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = ClaudeModelManager()
    
    try:
        if args.command == 'list':
            models = manager.list_models()
            print_model_list(models, args.format)
        
        elif args.command == 'set':
            success, message = manager.set_model(args.model)
            if success:
                print(message)
            else:
                print(f"错误: {message}")
                exit(1)
        
        elif args.command == 'current':
            current_model = manager.get_current_model()
            if args.format == 'json':
                result = {
                    'current_model': current_model,
                    'description': manager.MODEL_DESCRIPTIONS.get(current_model, '')
                }
                print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print(current_model)
        
        elif args.command == 'validate':
            success, message = manager.validate_claude_available()
            if success:
                print("Claude Code可用")
                current_model = manager.get_current_model()
                print(f"当前模型: {current_model}")
            else:
                print(f"Claude Code不可用: {message}")
                exit(1)
                
    except KeyboardInterrupt:
        print("\n操作被用户中断")
        exit(1)
    except Exception as e:
        print(f"操作失败: {str(e)}")
        exit(1)


if __name__ == '__main__':
    main()