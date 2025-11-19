#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
代码漏洞数据集生成器 - 第三步：提取函数级信息（语言无关版本）
"""

import os
import sys
import json
import re
import pandas as pd
from typing import List, Dict, Any, Tuple
from pathlib import Path
import logging

class CodeFunctionExtractor:
    """语言无关的代码函数提取器"""
    
    def __init__(self):
        # 设置日志
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def extract_functions_from_code(self, code: str, file_path: str) -> List[Dict[str, Any]]:
        """从代码中提取函数信息（语言无关版本）"""
        # 对压缩/混淆或超大单行文件直接跳过，避免正则在超长文本上卡顿
        try:
            if self.is_minified_or_large(file_path, code):
                return []
        except Exception:
            pass
        return self.extract_functions_language_agnostic(code, file_path)
    
    def extract_functions_language_agnostic(self, code: str, file_path: str) -> List[Dict[str, Any]]:
        """语言无关的函数提取方法"""
        functions = []
        
        if not code or not code.strip():
            return functions
        
        # 获取文件扩展名来判断语言类型
        file_ext = Path(file_path).suffix.lower() if file_path else ''

        # 对 .vue 先提取 <script> ... </script> 内容，减少模板/样式噪声
        original_code = code
        if file_ext == '.vue':
            try:
                script_blocks = re.findall(r'<script[^>]*>([\s\S]*?)</script>', code, flags=re.IGNORECASE)
                if script_blocks:
                    code = '\n\n'.join(script_blocks)
            except Exception:
                pass
        
        # 定义不同语言的函数模式
        language_patterns = {
            # JavaScript/TypeScript
            '.js': [
                r'(?:function\s+(\w+)\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*(?:const|let|var|function)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?function\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:function\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            '.ts': [
                r'(?:function\s+(\w+)\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*(?:const|let|var|function)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?function\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:function\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            '.tsx': [
                r'(?:function\s+(\w+)\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*(?:const|let|var|function)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?function\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:function\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            '.vue': [
                r'(?:function\s+(\w+)\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*(?:const|let|var|function)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(\w+)\s*[:=]\s*(?:async\s*)?function\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*/\*)',
                r'(?:function\s*\([^)]*\)\s*\{)(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            # Python
            '.py': [
                r'def\s+(\w+)\s*\([^)]*\)\s*:(.*?)(?=\n\s*def|\n\s*$|\n\s*#)',
                r'class\s+(\w+)\s*\([^)]*\)\s*:(.*?)(?=\n\s*class|\n\s*$|\n\s*#)',
                r'async\s+def\s+(\w+)\s*\([^)]*\)\s*:(.*?)(?=\n\s*async\s+def|\n\s*def|\n\s*$|\n\s*#)',
            ],
            # Java
            '.java': [
                r'(?:public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *\{?[^\{]*\{?(.*?)(?=\n\s*(?:public|private|protected|static|\s)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'class\s+(\w+)\s*\{?(.*?)(?=\n\s*class|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            # C/C++
            '.c': [
                r'(?:int|void|char|float|double|long|short|unsigned|signed)\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*(?:int|void|char|float|double|long|short|unsigned|signed)|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            '.cpp': [
                r'(?:int|void|char|float|double|long|short|unsigned|signed|std::\w+)\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*(?:int|void|char|float|double|long|short|unsigned|signed|std::\w+)|\n\s*$|\n\s*//|\n\s*/\*)',
                r'class\s+(\w+)\s*\{?(.*?)(?=\n\s*class|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            # PHP
            '.php': [
                r'function\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*function|\n\s*$|\n\s*//|\n\s*/\*)',
                r'class\s+(\w+)\s*\{?(.*?)(?=\n\s*class|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            # Ruby
            '.rb': [
                r'def\s+(\w+)\s*(?:\([^)]*\))?\s*(.*?)(?=\n\s*def|\n\s*end|\n\s*$|\n\s*#)',
                r'class\s+(\w+)\s*(?:<[^>]*>)?\s*(.*?)(?=\n\s*class|\n\s*end|\n\s*$|\n\s*#)',
            ],
            # Go
            '.go': [
                r'func\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*func|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
            # Rust
            '.rs': [
                r'fn\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*fn|\n\s*$|\n\s*//|\n\s*/\*)',
                r'impl\s+(\w+)\s*\{?(.*?)(?=\n\s*impl|\n\s*$|\n\s*//|\n\s*/\*)',
            ],
        }
        
        # 选择对应的语言模式，如果没有匹配则使用通用模式
        patterns = language_patterns.get(file_ext, [
            # 通用模式：尝试匹配各种函数定义
            r'(?:function|def|func|fn)\s+(\w+)\s*\([^)]*\)\s*\{?(.*?)(?=\n\s*(?:function|def|func|fn)|\n\s*$|\n\s*//|\n\s*#|\n\s*/\*)',
            r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*(?:const|let|var|function)|\n\s*$|\n\s*//|\n\s*#|\n\s*/\*)',
            r'(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{?(.*?)(?=\n\s*\w+|\n\s*$|\n\s*//|\n\s*#|\n\s*/\*)',
            r'class\s+(\w+)\s*\{?(.*?)(?=\n\s*class|\n\s*$|\n\s*//|\n\s*#|\n\s*/\*)',
        ])
        
        lines = code.split('\n')
        
        # 针对 JS/TS/TSX/Vue 增强：匹配类方法/对象方法（无 function 关键字）
        if file_ext in {'.js', '.ts', '.tsx', '.vue'}:
            patterns = patterns + [
                # 类方法或对象方法：public/private/protected/static/async 可选
                r'(?:^|\n)\s*(?:public|private|protected|static|async)?\s*(?:get|set\s+)?(\w+)\s*\([^)]*\)\s*\{(.*?)(?=\n\s*(?:[A-Za-z_][\w]*\s*\(|public|private|protected|static|async|constructor\s*\(|\}|$))'
            ]

        reserved_keywords = {
            'if', 'for', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally',
            'with', 'do', 'else', 'return', 'break', 'continue'
        }

        for pattern in patterns:
            matches = re.finditer(pattern, code, re.DOTALL | re.MULTILINE)
            
            for match in matches:
                num_groups = len(match.groups() or [])
                if num_groups >= 2:
                    func_name = match.group(1) or 'anonymous'
                    func_code = match.group(2) or ''
                elif num_groups == 1:
                    # 仅有函数体捕获（匿名函数/方法）
                    func_name = 'anonymous'
                    func_code = match.group(1) or ''
                else:
                    continue
                
                # 过滤保留字误匹配，例如 if(...) { ... }
                if func_name and func_name.lower() in reserved_keywords:
                    continue

                if func_code:
                    # 计算精确的行号
                    # 若是 .vue，基于提取后的 script 内容计算行号；否则直接使用原始代码
                    line_src = code if file_ext != '.vue' else code
                    start_line, end_line = self.calculate_line_numbers(line_src, match.start(), match.end())
                    
                    functions.append({
                        'function_name': func_name,
                        'function_type': 'function',
                        'start_line': start_line,
                        'end_line': end_line,
                        'code': func_code.strip(),
                        'file_path': file_path,
                        'parent_class': ''
                    })
        
        return functions

    def is_minified_or_large(self, file_path: str, code: str) -> bool:
        """判定是否为压缩/混淆或超大文件：
        - 文件名包含 .min.js 或 .min.
        - 行数极少但总长度很大（典型压缩单行）
        - 最大行长度过大
        - 总长度超过阈值
        """
        if not code:
            return False
        path_lower = (file_path or '').lower()
        if path_lower.endswith('.min.js') or '.min.' in path_lower:
            return True
        lines = code.split('\n')
        num_lines = len(lines)
        total_len = len(code)
        max_line_len = max((len(l) for l in lines), default=0)
        # 典型压缩：极少换行但长度巨大，或单行特别长
        if (num_lines <= 3 and total_len >= 100_000) or max_line_len >= 20_000:
            return True
        # 超大文件保护
        if total_len >= 1_000_000:
            return True
        return False
    
    def calculate_line_numbers(self, code: str, start_pos: int, end_pos: int) -> Tuple[int, int]:
        """计算精确的行号范围"""
        lines = code.split('\n')
        current_pos = 0
        start_line = 1
        end_line = 1
        
        for i, line in enumerate(lines):
            line_length = len(line) + 1  # +1 for newline
            if current_pos <= start_pos < current_pos + line_length:
                start_line = i + 1
            if current_pos <= end_pos <= current_pos + line_length:
                end_line = i + 1
                break
            current_pos += line_length
        
        return start_line, end_line
    
    def compute_changed_hunks_and_lines(self, before_text: str, after_text: str) -> Tuple[List[int], str, str]:
        """计算文件级变更的行号与变更代码片段（非代码文件或未提取到函数时的兜底）。
        返回: (changed_lines, before_hunks_str, after_hunks_str)
        """
        try:
            import difflib
            before_lines = before_text.splitlines()
            after_lines = after_text.splitlines()
            sm = difflib.SequenceMatcher(None, before_lines, after_lines)
            changed_lines: List[int] = []
            before_hunks = []
            after_hunks = []
            for tag, i1, i2, j1, j2 in sm.get_opcodes():
                if tag in ('replace', 'delete'):
                    # 记录原文件中被替换/删除的行号
                    changed_lines.extend(list(range(i1 + 1, i2 + 1)))
                    if i1 != i2:
                        before_hunks.append('\n'.join(before_lines[i1:i2]))
                if tag in ('replace', 'insert'):
                    # 记录新文件中新增/替换的片段
                    if j1 != j2:
                        after_hunks.append('\n'.join(after_lines[j1:j2]))
            # 合并片段，用换行和分隔符拼接，避免太长
            before_hunks_str = ('\n---\n').join(before_hunks)[:8000]
            after_hunks_str = ('\n---\n').join(after_hunks)[:8000]
            return sorted(list(set(changed_lines))), before_hunks_str, after_hunks_str
        except Exception:
            # 失败时返回整文件摘要
            return [], before_text[:4000], after_text[:4000]

    def create_file_scope_change_record(self, file_path: str, before_text: str, after_text: str) -> Dict[str, Any]:
        """基于文件级差异创建一个伪函数记录，用于非代码或未能提取函数的情况。"""
        changed_lines, before_hunks_str, after_hunks_str = self.compute_changed_hunks_and_lines(before_text, after_text)
        start_line = changed_lines[0] if changed_lines else 1
        end_line = changed_lines[-1] if changed_lines else max(len(before_text.splitlines()), 1)
        return {
            'function_name': '__file_scope__',
            'function_type': 'file',
            'start_line': start_line,
            'end_line': end_line,
            'vulnerable_code': before_hunks_str or before_text[:4000],
            'fixed_code': after_hunks_str or after_text[:4000],
            'file_path': file_path,
            'has_vulnerability': True,  # 文件级别变化也应该标记为有漏洞
            'vulnerability_type': 'File_Level_Change',
            'vulnerability_lines': changed_lines,
            'vulnerability_description': 'File-level change detected (non-code or no functions)',
            'reasoning': f'File-level change detected with {len(changed_lines)} changed lines: {changed_lines}',
            'code_change_size': abs(len(after_text) - len(before_text)),
            'line_change_size': abs(len(after_text.splitlines()) - len(before_text.splitlines()))
        }

    def analyze_vulnerability_in_function(self, func_code: str, vulnerability_type: str) -> Dict[str, Any]:
        """分析函数中的漏洞（语言无关版本）"""
        result = {
            'has_vulnerability': False,
            'vulnerability_type': 'None',
            'line_numbers': [],
            'vulnerability_description': '',
            'reasoning': ''
        }
        
        # 语言无关的漏洞检测模式
        vulnerability_patterns = {
            'XSS': [
                r'innerHTML\s*=\s*[^;]+',  # innerHTML赋值
                r'outerHTML\s*=\s*[^;]+',  # outerHTML赋值
                r'document\.write\s*\([^)]+\)',  # document.write
                r'eval\s*\([^)]+\)',  # eval函数
                r'setTimeout\s*\([^,]+,\s*[^)]+\)',  # setTimeout with code
                r'setInterval\s*\([^,]+,\s*[^)]+\)',  # setInterval with code
            ],
            'SQL_Injection': [
                r'execute\s*\([^)]+\)',  # SQL执行
                r'query\s*\([^)]+\)',  # 查询执行
                r'exec\s*\([^)]+\)',  # 执行SQL
            ],
            'Code_Injection': [
                r'eval\s*\([^)]+\)',  # eval
                r'Function\s*\([^)]+\)',  # Function构造函数
                r'setTimeout\s*\([^,]+,\s*[^)]+\)',  # setTimeout
                r'setInterval\s*\([^,]+,\s*[^)]+\)',  # setInterval
            ],
            'Prototype_Pollution': [
                r'__proto__\s*=',  # 直接设置__proto__
                r'prototype\s*=',  # 直接设置prototype
                r'Object\.setPrototypeOf\s*\([^)]+\)',  # setPrototypeOf
                r'Object\.create\s*\([^)]+\)',  # Object.create
            ],
            'Path_Traversal': [
                r'fs\.readFile\s*\([^)]+\)',  # 文件读取
                r'fs\.writeFile\s*\([^)]+\)',  # 文件写入
                r'path\.join\s*\([^)]+\)',  # 路径拼接
            ],
            'Command_Injection': [
                r'child_process\.exec\s*\([^)]+\)',  # 命令执行
                r'child_process\.spawn\s*\([^)]+\)',  # 进程生成
                r'exec\s*\([^)]+\)',  # 执行命令
            ]
        }
        
        # 检测漏洞
        detected_vulnerabilities = []
        vulnerable_lines = []
        
        for vuln_type, patterns in vulnerability_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, func_code, re.IGNORECASE)
                for match in matches:
                    # 计算行号
                    line_num = self.get_line_number(func_code, match.start())
                    vulnerable_lines.append(line_num)
                    
                    detected_vulnerabilities.append({
                        'type': vuln_type,
                        'line': line_num,
                        'code': match.group(0),
                        'description': self.get_vulnerability_description(vuln_type, match.group(0))
                    })
        
        if detected_vulnerabilities:
            result['has_vulnerability'] = True
            result['vulnerability_type'] = detected_vulnerabilities[0]['type']
            result['line_numbers'] = sorted(list(set(vulnerable_lines)))
            result['vulnerability_description'] = detected_vulnerabilities[0]['description']
            result['reasoning'] = self.generate_reasoning(detected_vulnerabilities)
        
        return result
    
    def get_line_number(self, code: str, position: int) -> int:
        """获取指定位置的行号"""
        lines = code.split('\n')
        current_pos = 0
        
        for i, line in enumerate(lines):
            line_length = len(line) + 1  # +1 for newline
            if current_pos <= position < current_pos + line_length:
                return i + 1
            current_pos += line_length
        
        return 1
    
    def get_vulnerability_description(self, vuln_type: str, code: str) -> str:
        """获取漏洞描述"""
        descriptions = {
            'XSS': f'发现潜在的XSS漏洞，代码直接操作DOM: {code.strip()}',
            'SQL_Injection': f'发现潜在的SQL注入漏洞: {code.strip()}',
            'Code_Injection': f'发现潜在的代码注入漏洞: {code.strip()}',
            'Prototype_Pollution': f'发现潜在的原型污染漏洞: {code.strip()}',
            'Path_Traversal': f'发现潜在的路径遍历漏洞: {code.strip()}',
            'Command_Injection': f'发现潜在的命令注入漏洞: {code.strip()}'
        }
        
        return descriptions.get(vuln_type, f'发现潜在的{vuln_type}漏洞: {code.strip()}')
    
    def generate_reasoning(self, vulnerabilities: List[Dict]) -> str:
        """生成详细的推理原因"""
        if not vulnerabilities:
            return ''
        
        vuln = vulnerabilities[0]
        reasoning = f"发现潜在的{vuln['type']}漏洞，第{vuln['line']}行存在安全风险。"
        reasoning += f"代码片段: {vuln['code']}。"
        
        # 添加具体的风险说明
        risk_descriptions = {
            'XSS': '这可能导致恶意脚本在用户浏览器中执行，窃取用户信息或进行其他恶意操作。',
            'SQL_Injection': '这可能导致数据库被恶意查询，泄露敏感数据或破坏数据完整性。',
            'Code_Injection': '这可能导致恶意代码在服务器上执行，造成系统安全风险。',
            'Prototype_Pollution': '这可能导致对象原型链被污染，影响应用程序的正常运行。',
            'Path_Traversal': '这可能导致访问系统敏感文件，泄露系统信息。',
            'Command_Injection': '这可能导致恶意命令在服务器上执行，造成系统安全风险。'
        }
        
        reasoning += risk_descriptions.get(vuln['type'], '这可能导致安全风险。')
        
        return reasoning
    
    def extract_functions_from_project(self, project_path: str, target_file_path: str = None) -> List[Dict[str, Any]]:
        """从完整项目中提取所有代码函数（语言无关版本）"""
        functions = []
        
        if not os.path.exists(project_path):
            self.logger.warning(f"项目路径不存在: {project_path}")
            return functions
        
        project_root = Path(project_path)
        
        # 查找所有代码文件（支持多种语言）
        code_files = []
        code_extensions = [
            '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue', '**/*.mjs', '**/*.cjs',  # JavaScript/TypeScript
            '**/*.py',  # Python
            '**/*.java',  # Java
            '**/*.c', '**/*.cpp', '**/*.cc', '**/*.cxx', '**/*.h', '**/*.hpp',  # C/C++
            '**/*.php',  # PHP
            '**/*.rb',  # Ruby
            '**/*.go',  # Go
            '**/*.rs',  # Rust
            '**/*.cs',  # C#
            '**/*.swift',  # Swift
            '**/*.kt',  # Kotlin
            '**/*.scala',  # Scala
            '**/*.pl',  # Perl
            '**/*.sh',  # Shell
        ]
        
        for ext in code_extensions:
            code_files.extend(project_root.glob(ext))
        
        self.logger.info(f"在项目 {project_path} 中找到 {len(code_files)} 个代码文件")
        
        for code_file in code_files:
            try:
                # 跳过node_modules等目录
                if any(skip_dir in str(code_file) for skip_dir in ['node_modules', '.git', '.svn', 'vendor', '__pycache__']):
                    continue
                
                with open(code_file, 'r', encoding='utf-8', errors='ignore') as f:
                    code_content = f.read()
                
                if not code_content.strip():
                    continue
                
                # 获取相对于项目根的路径
                relative_path = str(code_file.relative_to(project_root))
                
                # 如果指定了目标文件，只处理该文件
                if target_file_path and relative_path != target_file_path:
                    continue
                
                # 提取函数
                file_functions = self.extract_functions_from_code(code_content, relative_path)
                
                # 为每个函数添加项目信息
                for func in file_functions:
                    func['project_path'] = project_path
                    func['absolute_file_path'] = str(code_file)
                    func['relative_file_path'] = relative_path
                    func['file_size'] = len(code_content)
                
                functions.extend(file_functions)
                
            except Exception as e:
                self.logger.error(f"处理文件 {code_file} 时出错: {e}")
                continue
        
        return functions
    
    def find_vulnerable_functions_improved(self, vulnerable_code: str, fixed_code: str, file_path: str) -> List[Dict[str, Any]]:
        """改进的漏洞函数检测：先找变化行，再映射到函数（语言无关版本）"""
        vulnerable_functions = []
        
        if not vulnerable_code or not fixed_code:
            return vulnerable_functions
        
        try:
            # 对压缩/混淆或超大文件，直接走文件级别记录，避免正则提取卡顿
            if self.is_minified_or_large(file_path, vulnerable_code) or self.is_minified_or_large(file_path, fixed_code):
                changed_lines = self.get_changed_line_numbers(vulnerable_code, fixed_code)
                print(f"[DEBUG] {file_path} 为压缩/混淆或超大文件，跳过函数提取，改为文件级别对比")
                file_scope_record = self.create_file_scope_change_record(file_path, vulnerable_code, fixed_code)
                if changed_lines:
                    file_scope_record['vulnerability_lines'] = changed_lines
                    file_scope_record['reasoning'] = f"全局代码变化行: {changed_lines}"
                return [file_scope_record]
            
            # 第一步：使用difflib找出所有变化的行号
            changed_lines = self.get_changed_line_numbers(vulnerable_code, fixed_code)
            print(f"[DEBUG] 检测到变化行号: {changed_lines}")
            
            if not changed_lines:
                print(f"[DEBUG] 未检测到任何代码变化")
                return vulnerable_functions
            
            # 第二步：提取所有函数
            all_vulnerable_funcs = self.extract_functions_from_code(vulnerable_code, file_path)
            all_fixed_funcs = self.extract_functions_from_code(fixed_code, file_path)
            
            print(f"[DEBUG] 提取到 {len(all_vulnerable_funcs)} 个漏洞函数，{len(all_fixed_funcs)} 个修复函数")
            
            # 第三步：找出包含变化行的函数
            affected_vulnerable_funcs = self.find_functions_containing_lines(all_vulnerable_funcs, changed_lines)
            affected_fixed_funcs = self.find_functions_containing_lines(all_fixed_funcs, changed_lines)
            
            print(f"[DEBUG] 包含变化行的函数: 漏洞版本 {len(affected_vulnerable_funcs)} 个，修复版本 {len(affected_fixed_funcs)} 个")
            
            # 第四步：创建修复函数的映射
            fixed_func_map = {}
            for func in all_fixed_funcs:
                key = f"{func.get('function_name', 'anonymous')}_{func.get('start_line', 0)}"
                fixed_func_map[key] = func
            
            # 第五步：分析每个受影响的函数
            for v_func in affected_vulnerable_funcs:
                func_name = v_func.get('function_name', 'anonymous')
                start_line = v_func.get('start_line', 0)
                end_line = v_func.get('end_line', start_line)
                key = f"{func_name}_{start_line}"
                
                print(f"[DEBUG] 分析受影响的函数: {func_name} (行 {start_line}-{end_line})")
                
                # 找出该函数范围内的变化行
                func_changed_lines = [line for line in changed_lines if start_line <= line <= end_line]
                print(f"[DEBUG] 函数 {func_name} 内的变化行: {func_changed_lines}")
                
                # 检查是否存在对应的修复后函数
                if key in fixed_func_map:
                    f_func = fixed_func_map[key]
                    
                    # 比较函数代码
                    v_code = self.normalize_code(v_func.get('code', ''))
                    f_code = self.normalize_code(f_func.get('code', ''))
                    
                    print(f"[DEBUG] 函数 {func_name} 原始代码长度: 漏洞版本={len(v_func.get('code', ''))}, 修复版本={len(f_func.get('code', ''))}")
                    print(f"[DEBUG] 函数 {func_name} 标准化后长度: 漏洞版本={len(v_code)}, 修复版本={len(f_code)}")
                    
                    # 如果标准化后相同，但原始代码不同，说明只是格式差异
                    if v_code == f_code and v_func.get('code', '') != f_func.get('code', ''):
                        print(f"[DEBUG] 函数 {func_name} 标准化后相同，但原始代码不同，可能是格式差异")
                        # 使用原始代码进行比较
                        v_code_raw = v_func.get('code', '')
                        f_code_raw = f_func.get('code', '')
                        if v_code_raw != f_code_raw:
                            print(f"[DEBUG] 确认函数 {func_name} 有变化（原始代码比较）")
                            
                            vulnerability_info = self.analyze_vulnerability_in_function(
                                v_func.get('code', ''), 'Unknown'
                            )
                            
                            vulnerable_function = {
                                'function_name': func_name,
                                'function_type': v_func.get('function_type', 'function'),
                                'start_line': start_line,
                                'end_line': end_line,
                                'vulnerable_code': v_func.get('code', ''),
                                'fixed_code': f_func.get('code', ''),
                                'file_path': file_path,
                                'has_vulnerability': True,  # 如果函数被检测为变化，则标记为有漏洞
                                'vulnerability_type': vulnerability_info['vulnerability_type'] if vulnerability_info['has_vulnerability'] else 'Code_Change',
                                'vulnerability_lines': func_changed_lines,  # 使用精确的变化行号
                                'vulnerability_description': vulnerability_info['vulnerability_description'] if vulnerability_info['has_vulnerability'] else f'函数代码发生变化，可能包含安全修复',
                                'reasoning': f"函数包含 {len(func_changed_lines)} 行变化: {func_changed_lines}",
                                'code_change_size': abs(len(v_code_raw) - len(f_code_raw)),
                                'line_change_size': len(func_changed_lines)
                            }
                            
                            vulnerable_functions.append(vulnerable_function)
                    elif v_code != f_code:
                        print(f"[DEBUG] 确认函数 {func_name} 有变化（标准化代码比较）")
                        
                        vulnerability_info = self.analyze_vulnerability_in_function(
                            v_func.get('code', ''), 'Unknown'
                        )
                        
                        vulnerable_function = {
                            'function_name': func_name,
                            'function_type': v_func.get('function_type', 'function'),
                            'start_line': start_line,
                            'end_line': end_line,
                            'vulnerable_code': v_func.get('code', ''),
                            'fixed_code': f_func.get('code', ''),
                            'file_path': file_path,
                            'has_vulnerability': True,  # 如果函数被检测为变化，则标记为有漏洞
                            'vulnerability_type': vulnerability_info['vulnerability_type'] if vulnerability_info['has_vulnerability'] else 'Code_Change',
                            'vulnerability_lines': func_changed_lines,  # 使用精确的变化行号
                            'vulnerability_description': vulnerability_info['vulnerability_description'] if vulnerability_info['has_vulnerability'] else f'函数代码发生变化，可能包含安全修复',
                            'reasoning': f"函数包含 {len(func_changed_lines)} 行变化: {func_changed_lines}",
                            'code_change_size': abs(len(v_code) - len(f_code)),
                            'line_change_size': len(func_changed_lines)
                        }
                        
                        vulnerable_functions.append(vulnerable_function)
                    else:
                        print(f"[DEBUG] 函数 {func_name} 代码完全相同")
                else:
                    print(f"[DEBUG] 函数 {func_name} 在修复版本中未找到，可能被删除")
                    # 函数被删除的情况
                    vulnerability_info = self.analyze_vulnerability_in_function(
                        v_func.get('code', ''), 'Unknown'
                    )
                    
                    vulnerable_function = {
                        'function_name': func_name,
                        'function_type': v_func.get('function_type', 'function'),
                        'start_line': start_line,
                        'end_line': end_line,
                        'vulnerable_code': v_func.get('code', ''),
                        'fixed_code': '',
                        'file_path': file_path,
                        'has_vulnerability': True,
                        'vulnerability_type': 'Function Removed',
                        'vulnerability_lines': func_changed_lines,
                        'vulnerability_description': '整个函数在修复时被删除',
                        'reasoning': f"函数被删除，原包含变化行: {func_changed_lines}",
                        'code_change_size': len(v_func.get('code', '')),
                        'line_change_size': len(func_changed_lines)
                    }
                    
                    vulnerable_functions.append(vulnerable_function)
            
            # 第六步：检查是否有变化行不在任何函数内（全局代码变化）
            global_changed_lines = [line for line in changed_lines 
                                  if not any(start_line <= line <= end_line 
                                           for start_line, end_line in 
                                           [(f.get('start_line', 0), f.get('end_line', 0)) 
                                            for f in all_vulnerable_funcs])]
            
            if global_changed_lines:
                print(f"[DEBUG] 发现全局代码变化行: {global_changed_lines}")
                # 创建文件级别的变化记录
                file_scope_record = self.create_file_scope_change_record(
                    file_path, vulnerable_code, fixed_code
                )
                file_scope_record['vulnerability_lines'] = global_changed_lines
                file_scope_record['reasoning'] = f"全局代码变化行: {global_changed_lines}"
                vulnerable_functions.append(file_scope_record)
        
        except Exception as e:
            self.logger.error(f"改进的漏洞函数检测出错: {e}")
            import traceback
            traceback.print_exc()
        
        return vulnerable_functions
    
    def get_changed_line_numbers(self, before_text: str, after_text: str) -> List[int]:
        """使用difflib获取所有变化的行号"""
        try:
            import difflib
            before_lines = before_text.splitlines()
            after_lines = after_text.splitlines()
            sm = difflib.SequenceMatcher(None, before_lines, after_lines)
            changed_lines = []
            
            for tag, i1, i2, j1, j2 in sm.get_opcodes():
                if tag in ('replace', 'delete'):
                    # 记录原文件中被替换/删除的行号（从1开始）
                    changed_lines.extend(list(range(i1 + 1, i2 + 1)))
                if tag in ('replace', 'insert'):
                    # 记录新文件中新增/替换的行号（从1开始）
                    changed_lines.extend(list(range(j1 + 1, j2 + 1)))
            
            return sorted(list(set(changed_lines)))
        except Exception as e:
            self.logger.error(f"获取变化行号时出错: {e}")
            return []
    
    def find_functions_containing_lines(self, functions: List[Dict[str, Any]], target_lines: List[int]) -> List[Dict[str, Any]]:
        """找出包含指定行号的所有函数"""
        affected_functions = []
        
        for func in functions:
            start_line = func.get('start_line', 0)
            end_line = func.get('end_line', start_line)
            
            # 检查函数范围是否包含任何目标行
            if any(start_line <= line <= end_line for line in target_lines):
                affected_functions.append(func)
        
        return affected_functions
    
    def normalize_code(self, code: str) -> str:
        """标准化代码，去除空格、换行符等格式差异"""
        if not code:
            return ""
        # 去除多余空格和换行符，保留基本结构
        normalized = re.sub(r'\s+', ' ', code.strip())
        # 去除注释
        normalized = re.sub(r'//.*?$', '', normalized, flags=re.MULTILINE)
        normalized = re.sub(r'/\*.*?\*/', '', normalized, flags=re.DOTALL)
        normalized = re.sub(r'#.*?$', '', normalized, flags=re.MULTILINE)  # Python注释
        # 标准化模板字符串中的变量引用，保留 ${} 结构但去除内部空格
        normalized = re.sub(r'\$\{\s*([^}]+)\s*\}', r'${\1}', normalized)
        return normalized

def process_vulnerability_dataset(input_file: str, output_file: str):
    """处理漏洞数据集，提取函数级信息（适应js_commit_info.py输出）"""
    print("=" * 60)
    print("函数级漏洞信息提取")
    print("=" * 60)
    
    # 读取数据集
    df = pd.read_csv(input_file)
    print(f"[INFO] 读取 {len(df)} 条记录")
    
    # 可选：读取第一步抓取的数据，用于字段并集合并（取并集）
    nvd_map: Dict[str, Dict[str, Any]] = {}
    try:
        nvd_csv = "data/js_cve_dataset.csv"
        if os.path.exists(nvd_csv):
            nvd_df = pd.read_csv(nvd_csv)
            for _, nrow in nvd_df.iterrows():
                cid = str(nrow.get('cve_id', '') or '')
                if cid:
                    nvd_map[cid] = nrow.to_dict()
            print(f"[INFO] 载入NVD聚合数据: {len(nvd_map)} 条")
    except Exception as e:
        print(f"[WARN] 读取NVD聚合数据失败: {e}")
    
    # 创建函数提取器
    extractor = CodeFunctionExtractor()
    
    # 处理每条记录
    function_records = []
    # 记录每个提交在每个文件中被修改的函数数量，用于事后计算 ONEFUNC
    commit_file_func_counts: Dict[Tuple[str, str], int] = {}
    
    # 打标签的辅助函数
    def compute_function_label(func: Dict[str, Any], all_changed_funcs: List[Dict[str, Any]], file_path_val: str, cve_summary_val: str) -> Tuple[str, str]:
        try:
            changed_count = len(all_changed_funcs) if all_changed_funcs is not None else 0
            file_base = Path(file_path_val).name if file_path_val else ''
            func_name = func.get('function_name') or ''
            summary_lower = (cve_summary_val or '').lower()
            func_name_lower = func_name.lower() if isinstance(func_name, str) else ''
            file_base_lower = file_base.lower()
            mentioned = False
            mention_reason = ''
            if func_name_lower and func_name_lower != 'anonymous' and func_name_lower in summary_lower:
                mentioned = True
                mention_reason = f"function '{func_name}' mentioned in CVE summary"
            elif file_base_lower and file_base_lower in summary_lower:
                mentioned = True
                mention_reason = f"file '{file_base}' mentioned in CVE summary"
            # NVDCHECK: 唯一修改函数 且 NVD 描述明确提及 函数名 或 文件名
            if changed_count == 1 and mentioned:
                return 'NVDCHECK', f"{mention_reason}; only one modified function in file"
            # ONEFUNC: 该文件仅有一个函数发生修改
            if changed_count == 1:
                return 'ONEFUNC', 'only one modified function in file'
            # 其他情况归为可疑
            return 'SUSPICIOUS', 'multiple modified functions or not explicitly mentioned by NVD'
        except Exception:
            return 'SUSPICIOUS', 'labeling failed due to exception'
    
    for idx, row in df.iterrows():
        if idx % 10 == 0:
            print(f"处理进度: {idx}/{len(df)}")
        
        def safe_str_path(val):
            # 将 NaN/float/None 转换为空字符串，保证是字符串
            if pd.isna(val):
                return ''
            if isinstance(val, (float, int)):
                return ''
            return str(val)

        cve_id = safe_str_path(row.get('cve_id', ''))
        file_path = safe_str_path(row.get('file_path', ''))
        vulnerable_code_path = safe_str_path(row.get('vulnerable_code_path', ''))
        fixed_code_path = safe_str_path(row.get('fixed_code_path', ''))
        vulnerable_project_path = safe_str_path(row.get('vulnerable_project_path', ''))
        fixed_project_path = safe_str_path(row.get('fixed_project_path', ''))
        
        print(f"  处理CVE: {cve_id}, 文件: {file_path}")
        
        try:
            # 方法1: 从单个文件代码中提取函数（如果有保存的代码文件）
            vulnerable_functions_from_file = []
            if vulnerable_code_path and isinstance(vulnerable_code_path, str) and os.path.exists(vulnerable_code_path):
                with open(vulnerable_code_path, 'r', encoding='utf-8', errors='ignore') as f:
                    vulnerable_code = f.read()
                
                fixed_code = ''
                if fixed_code_path and isinstance(fixed_code_path, str) and os.path.exists(fixed_code_path):
                    with open(fixed_code_path, 'r', encoding='utf-8', errors='ignore') as f:
                        fixed_code = f.read()
                
                # 通过对比找出有漏洞的函数
                vulnerable_functions_from_file = extractor.find_vulnerable_functions_improved(
                    vulnerable_code, fixed_code, file_path
                )

                # 若未提取到函数，但确有前后文本，生成文件级伪函数记录（非JS/资源文件也能比较）
                if not vulnerable_functions_from_file and vulnerable_code and fixed_code:
                    file_scope_record = extractor.create_file_scope_change_record(
                        file_path, vulnerable_code, fixed_code
                    )
                    vulnerable_functions_from_file = [file_scope_record]
                
                print(f"    从单个文件中找到 {len(vulnerable_functions_from_file)} 个有漏洞的函数")
            
            # 方法2: 从完整项目中提取函数（如果有下载的完整项目）
            vulnerable_functions_from_project = []
            fixed_functions_from_project = []
            
            if vulnerable_project_path and isinstance(vulnerable_project_path, str) and os.path.exists(vulnerable_project_path):
                # 从漏洞版本项目中提取目标文件的函数
                vulnerable_functions_from_project = extractor.extract_functions_from_project(
                    vulnerable_project_path, file_path
                )
                print(f"    从漏洞项目中找到 {len(vulnerable_functions_from_project)} 个函数")
            
            if fixed_project_path and isinstance(fixed_project_path, str) and os.path.exists(fixed_project_path):
                # 从修复版本项目中提取目标文件的函数
                fixed_functions_from_project = extractor.extract_functions_from_project(
                    fixed_project_path, file_path
                )
                print(f"    从修复项目中找到 {len(fixed_functions_from_project)} 个函数")
            
            # 合并两种方法的结果
            all_vulnerable_functions = vulnerable_functions_from_file
            
            # 如果从完整项目中也提取到了函数，进行额外的分析
            if vulnerable_functions_from_project and fixed_functions_from_project:
                # 创建修复后函数的映射
                fixed_func_map = {}
                for func in fixed_functions_from_project:
                    key = f"{func.get('function_name', 'anonymous')}_{func.get('start_line', 0)}"
                    fixed_func_map[key] = func
                
                # 分析项目级别的函数变化
                for v_func in vulnerable_functions_from_project:
                    func_name = v_func.get('function_name', 'anonymous')
                    start_line = v_func.get('start_line', 0)
                    key = f"{func_name}_{start_line}"
                    
                    # 检查是否已经在文件级分析中发现
                    already_found = any(
                        f['function_name'] == func_name and f['start_line'] == start_line
                        for f in vulnerable_functions_from_file
                    )
                    
                    if not already_found:
                        # 如果文件级分析没有发现，但项目级分析发现了变化
                        if key in fixed_func_map:
                            f_func = fixed_func_map[key]
                            v_code = v_func.get('code', '').strip()
                            f_code = f_func.get('code', '').strip()
                            
                            if v_code != f_code:
                                # 发现新的有漏洞函数
                                vulnerability_info = extractor.analyze_vulnerability_in_function(
                                    v_code, row.get('vulnerability_classification', 'Unknown')
                                )
                                
                                vulnerable_function = {
                                    'function_name': func_name,
                                    'function_type': v_func.get('function_type', 'function'),
                                    'start_line': start_line,
                                    'end_line': v_func.get('end_line', start_line),
                                    'vulnerable_code': v_code,
                                    'fixed_code': f_code,
                                    'file_path': file_path,
                                    'has_vulnerability': vulnerability_info['has_vulnerability'],
                                    'vulnerability_type': vulnerability_info['vulnerability_type'],
                                    'vulnerability_lines': vulnerability_info['line_numbers'],
                                    'vulnerability_description': vulnerability_info['vulnerability_description'],
                                    'reasoning': vulnerability_info['reasoning'],
                                    'code_change_size': abs(len(v_code) - len(f_code)),
                                    'line_change_size': abs(len(v_code.split('\n')) - len(f_code.split('\n')))
                                }
                                
                                all_vulnerable_functions.append(vulnerable_function)

                # 若项目级两侧都有内容但未识别到函数变化，做文件级兜底
                if not all_vulnerable_functions:
                    # 读取两个项目对应文件的原始文本
                    try:
                        vuln_abs = None
                        fix_abs = None
                        for f in extractor.extract_functions_from_project(vulnerable_project_path, file_path):
                            vuln_abs = f.get('absolute_file_path')
                            break
                        for f in extractor.extract_functions_from_project(fixed_project_path, file_path):
                            fix_abs = f.get('absolute_file_path')
                            break
                        if vuln_abs and fix_abs and os.path.exists(vuln_abs) and os.path.exists(fix_abs):
                            with open(vuln_abs, 'r', encoding='utf-8', errors='ignore') as vf:
                                vtxt = vf.read()
                            with open(fix_abs, 'r', encoding='utf-8', errors='ignore') as ff:
                                ftxt = ff.read()
                            if vtxt and ftxt:
                                file_scope_record = extractor.create_file_scope_change_record(file_path, vtxt, ftxt)
                                all_vulnerable_functions.append(file_scope_record)
                    except Exception:
                        pass
            
            # 记录该提交-文件的变化函数数量（用于 ONEFUNC 事后判断）
            commit_sha_val = safe_str_path(row.get('commit_sha', ''))
            if commit_sha_val:
                commit_file_func_counts[(commit_sha_val, file_path)] = len(all_vulnerable_functions)

            # 为每个发现的有漏洞函数创建记录
            for func in all_vulnerable_functions:
                # 计算函数标签
                function_label, function_label_reason = compute_function_label(
                    func,
                    all_vulnerable_functions,
                    file_path,
                    row.get('summary', '')
                )
                # NVD并集：预先准备（按cve_id左连接）
                nvd_row = nvd_map.get(cve_id, {})
                nvd_code_link = nvd_row.get('code_link', '') if isinstance(nvd_row, dict) else ''
                nvd_project_type = nvd_row.get('project_type', 'Unknown') if isinstance(nvd_row, dict) else 'Unknown'
                nvd_project_name = nvd_row.get('project_name', '') if isinstance(nvd_row, dict) else ''
                
                # 合并链接（并集去重）
                def merge_links(a: str, b: str) -> str:
                    parts = []
                    for s in (a, b):
                        if s and isinstance(s, str):
                            parts.extend([p.strip() for p in s.split(';') if p.strip()])
                    # 去重保持顺序
                    seen = set()
                    uniq = []
                    for p in parts:
                        if p not in seen:
                            seen.add(p)
                            uniq.append(p)
                    return '; '.join(uniq)
                
                code_link_commit = row.get('code_link', '')
                code_link_merged = merge_links(code_link_commit, nvd_code_link)
                
                project_type_commit = row.get('project_type', 'unknown')
                project_type_merged = project_type_commit if project_type_commit and project_type_commit.lower() != 'unknown' else (nvd_project_type or 'unknown')
                
                project_name_commit = row.get('project_name', '')
                project_name_merged = project_name_commit or nvd_project_name
                
                source_commit = row.get('source', '')
                source_merged = merge_links(source_commit, 'nvd_api' if nvd_row else '')
                
                function_record = {
                    'cve_id': cve_id,
                    'vulnerability_classification': row.get('vulnerability_classification', 'Unknown'),
                    'cvss_score': row.get('cvss_score', 'N/A'),
                    'severity': row.get('severity', 'UNKNOWN'),
                    'publish_date': row.get('publish_date', 'N/A'),
                    'summary': row.get('summary', ''),
                    'code_link': code_link_commit,
                    'project_name': project_name_commit,
                    'cwe_id': row.get('cwe_id', 'N/A'),
                    'source': source_commit,
                    'project_type': project_type_commit,
                    'commit_sha': row.get('commit_sha', ''),
                    'reasoning': row.get('reasoning', ''),
                    
                    # 来自NVD与并集
                    'nvd_code_link': nvd_code_link,
                    'code_link_merged': code_link_merged,
                    'nvd_project_type': nvd_project_type,
                    'project_type_merged': project_type_merged,
                    'nvd_project_name': nvd_project_name,
                    'project_name_merged': project_name_merged,
                    'source_merged': source_merged,
                    
                    # 文件信息
                    'file_path': file_path,
                    'vulnerable_code_path': vulnerable_code_path,
                    'fixed_code_path': fixed_code_path,
                    'vulnerable_project_path': vulnerable_project_path,
                    'fixed_project_path': fixed_project_path,
                    
                    # 函数级信息
                    'function_name': func.get('function_name', 'anonymous'),
                    'function_type': func.get('function_type', 'function'),
                    'function_start_line': func.get('start_line', 1),
                    'function_end_line': func.get('end_line', 1),
                    'vulnerable_function_code': func.get('vulnerable_code', ''),
                    'fixed_function_code': func.get('fixed_code', ''),
                    'function_label': function_label,
                    'function_label_reason': function_label_reason,
                    'changed_functions_count': len(all_vulnerable_functions),
                    
                    # 漏洞信息
                    'has_vulnerability': func.get('has_vulnerability', False),
                    'function_vulnerability_type': func.get('vulnerability_type', 'Unknown'),
                    'vulnerability_lines': func.get('vulnerability_lines', []),
                    'vulnerability_description': func.get('vulnerability_description', ''),
                    'function_reasoning': func.get('reasoning', ''),
                    
                    # 统计信息
                    'vulnerable_code_lines': row.get('vulnerable_code_lines', 0),
                    'fixed_code_lines': row.get('fixed_code_lines', 0),
                    'code_changes': row.get('code_changes', 0),
                    'function_code_size': len(func.get('vulnerable_code', '')),
                    'function_change_size': func.get('code_change_size', 0),
                    'function_line_changes': func.get('line_change_size', 0),
                    'vulnerability_count': count_vulnerabilities_in_function(func.get('vulnerable_code', ''))
                }
                
                function_records.append(function_record)
            
            if not all_vulnerable_functions:
                print(f"    警告: 未找到任何有漏洞的函数")
        
        except Exception as e:
            print(f"[ERROR] 处理第 {idx} 条记录时出错: {e}")
            continue
    
    # 事后打 ONEFUNC 标签：如果同一提交下所有文件的修改函数总数为1
    commit_total_changed: Dict[str, int] = {}
    for (commit_sha_key, file_key), cnt in commit_file_func_counts.items():
        commit_total_changed[commit_sha_key] = commit_total_changed.get(commit_sha_key, 0) + max(int(cnt), 0)

    if commit_total_changed:
        for rec in function_records:
            sha = rec.get('commit_sha', '')
            if sha and commit_total_changed.get(sha, 0) == 1:
                rec['function_label'] = 'ONEFUNC'
                rec['function_label_reason'] = 'commit modifies only one function (global)'

    # 保存结果
    if function_records:
        result_df = pd.DataFrame(function_records)
        
        # 合并同仓库：按 project_name_merged 优先，否则按 project_name
        def first_non_empty(*vals):
            for v in vals:
                if isinstance(v, str) and v.strip():
                    return v
            return ''
        
        def merge_semicolon_strings(a: str, b: str = '') -> str:
            joined = '; '.join([s for s in [a, b] if isinstance(s, str) and s.strip()])
            if not joined:
                return ''
            parts = [p.strip() for p in joined.split(';') if p.strip()]
            seen = set()
            uniq = []
            for p in parts:
                if p not in seen:
                    seen.add(p)
                    uniq.append(p)
            return '; '.join(uniq)
        
        def merge_semicolon_series(series):
            out = ''
            for x in series:
                out = merge_semicolon_strings(out, str(x))
            return out
        
        def breakdown(series) -> str:
            counts = {}
            for x in series:
                key = str(x)
                if not key:
                    continue
                counts[key] = counts.get(key, 0) + 1
            # 排序：降序，再字母
            items = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
            return '; '.join([f"{k}:{v}" for k, v in items])
        
        def numeric_stats(series) -> Dict[str, Any]:
            try:
                s = pd.to_numeric(series, errors='coerce').dropna()
                if s.empty:
                    return {
                        'sum': 0,
                        'mean': 0,
                        'median': 0,
                        'min': 0,
                        'max': 0
                    }
                return {
                    'sum': float(s.sum()),
                    'mean': float(s.mean()),
                    'median': float(s.median()),
                    'min': float(s.min()),
                    'max': float(s.max())
                }
            except Exception:
                return {'sum': 0, 'mean': 0, 'median': 0, 'min': 0, 'max': 0}
        
        def parse_date_safe(x: str):
            try:
                x = str(x)
                if not x or x == 'N/A':
                    return None
                return pd.to_datetime(x, errors='coerce')
            except Exception:
                return None
        
        # 准备分组键
        group_key = result_df.get('project_name_merged') if 'project_name_merged' in result_df.columns else None
        if group_key is None or group_key.fillna('').eq('').all():
            group_key = result_df['project_name'].fillna('')
        result_df['__group'] = group_key
        gb = result_df.groupby('__group', dropna=False)
        
        # 文本去重合并（不按分号切分，原样拼接）
        def merge_unique_texts(series, sep=' || '):
            seen = set()
            uniq = []
            for x in series:
                s = str(x)
                if not s or s == 'N/A':
                    continue
                if s not in seen:
                    seen.add(s)
                    uniq.append(s)
            return sep.join(uniq)

        # 构建每仓库一行的丰富聚合
        repo_rows = []
        for group_name, g in gb:
            row: Dict[str, Any] = {}
            row['project_name_group'] = group_name if isinstance(group_name, str) else ''
            row['project_name_merged'] = first_non_empty(*(g.get('project_name_merged', g.get('project_name', '')) if isinstance(g.get('project_name_merged'), pd.Series) else []))
            
            # 基本信息并集
            row['cve_ids'] = merge_semicolon_series(g['cve_id']) if 'cve_id' in g else ''
            row['n_cves'] = int(g['cve_id'].nunique()) if 'cve_id' in g else 0
            
            # 链接与来源
            row['code_link_merged'] = merge_semicolon_series(g['code_link_merged']) if 'code_link_merged' in g else merge_semicolon_series(g.get('code_link', pd.Series([], dtype=str)))
            row['n_code_links'] = len([p for p in row['code_link_merged'].split(';') if p.strip()]) if row['code_link_merged'] else 0
            # sources优先取source_merged，否则取source，均按分号合并且去重
            if 'source_merged' in g:
                row['sources'] = merge_semicolon_series(g['source_merged'])
            else:
                row['sources'] = merge_semicolon_series(g.get('source', pd.Series([], dtype=str)))
            
            # 项目类型与名称
            row['project_type_merged'] = first_non_empty(*(g.get('project_type_merged', g.get('project_type', '')) if isinstance(g.get('project_type_merged'), pd.Series) else []))
            row['project_type_breakdown'] = breakdown(g.get('project_type_merged', g.get('project_type', pd.Series([], dtype=str))))
            row['nvd_project_type'] = first_non_empty(*(g.get('nvd_project_type', pd.Series([], dtype=str)))) if 'nvd_project_type' in g else ''
            row['nvd_project_name'] = first_non_empty(*(g.get('nvd_project_name', pd.Series([], dtype=str)))) if 'nvd_project_name' in g else ''
            
            # 严重性、分类与CWE
            row['severity_breakdown'] = breakdown(g.get('severity', pd.Series([], dtype=str)))
            row['vulnerability_classification_breakdown'] = breakdown(g.get('vulnerability_classification', pd.Series([], dtype=str)))
            row['cwe_ids'] = merge_semicolon_series(g.get('cwe_id', pd.Series([], dtype=str)))
            
            # 文件、函数与标签
            row['files'] = merge_semicolon_series(g.get('file_path', pd.Series([], dtype=str)))
            row['n_files'] = int(g['file_path'].nunique()) if 'file_path' in g else 0
            row['function_names'] = merge_semicolon_series(g.get('function_name', pd.Series([], dtype=str)))
            row['n_function_records'] = int(len(g))
            row['n_unique_functions'] = int(g['function_name'].nunique()) if 'function_name' in g else int(len(g))
            row['n_vulnerable_functions'] = int(g.get('has_vulnerability', pd.Series([], dtype=bool)).sum()) if 'has_vulnerability' in g else 0
            row['function_label_breakdown'] = breakdown(g.get('function_label', pd.Series([], dtype=str)))
            row['function_vulnerability_type_breakdown'] = breakdown(g.get('function_vulnerability_type', pd.Series([], dtype=str)))
            
            # 代码与变更统计
            stats_code = numeric_stats(g.get('function_code_size', pd.Series([], dtype=float)))
            stats_change = numeric_stats(g.get('function_change_size', pd.Series([], dtype=float)))
            stats_lines = numeric_stats(g.get('function_line_changes', pd.Series([], dtype=float)))
            row['function_code_size_sum'] = stats_code['sum']
            row['function_code_size_mean'] = stats_code['mean']
            row['function_code_size_median'] = stats_code['median']
            row['function_code_size_min'] = stats_code['min']
            row['function_code_size_max'] = stats_code['max']
            row['function_change_size_sum'] = stats_change['sum']
            row['function_change_size_mean'] = stats_change['mean']
            row['function_change_size_median'] = stats_change['median']
            row['function_change_size_min'] = stats_change['min']
            row['function_change_size_max'] = stats_change['max']
            row['function_line_changes_sum'] = stats_lines['sum']
            row['function_line_changes_mean'] = stats_lines['mean']
            row['function_line_changes_median'] = stats_lines['median']
            row['function_line_changes_min'] = stats_lines['min']
            row['function_line_changes_max'] = stats_lines['max']
            row['vulnerability_count_sum'] = int(pd.to_numeric(g.get('vulnerability_count', pd.Series([], dtype=float)), errors='coerce').fillna(0).sum()) if 'vulnerability_count' in g else 0
            
            # commit 与日期
            row['commit_shas'] = merge_semicolon_series(g.get('commit_sha', pd.Series([], dtype=str)))
            row['n_commits'] = int(g.get('commit_sha', pd.Series([], dtype=str)).nunique()) if 'commit_sha' in g else 0
            dates = g.get('publish_date', pd.Series([], dtype=str)).apply(parse_date_safe) if 'publish_date' in g else pd.Series([], dtype='datetime64[ns]')
            if isinstance(dates, pd.Series) and not dates.dropna().empty:
                row['publish_date_first'] = str(dates.dropna().min().date())
                row['publish_date_last'] = str(dates.dropna().max().date())
            else:
                row['publish_date_first'] = ''
                row['publish_date_last'] = ''
            
            # 完整项目与代码文件路径（并集）
            row['vulnerable_project_paths'] = merge_semicolon_series(g.get('vulnerable_project_path', pd.Series([], dtype=str)))
            row['fixed_project_paths'] = merge_semicolon_series(g.get('fixed_project_path', pd.Series([], dtype=str)))
            row['vulnerable_code_paths'] = merge_semicolon_series(g.get('vulnerable_code_path', pd.Series([], dtype=str)))
            row['fixed_code_paths'] = merge_semicolon_series(g.get('fixed_code_path', pd.Series([], dtype=str)))
            
            # 代表性摘要/summary（选择第一条非空）
            # 根据需求，最终结果中去除 summary_sample 列
            # row['summary_sample'] = first_non_empty(*list(g.get('summary', pd.Series([], dtype=str))))
            row['summaries_merged'] = merge_unique_texts(g.get('summary', pd.Series([], dtype=str)))
            
            # 生成有问题的行号范围和函数名称
            vulnerable_line_ranges = []
            vulnerable_function_names = []
            
            for _, func_row in g.iterrows():
                # 检查是否有漏洞
                if func_row.get('has_vulnerability', False):
                    func_name = func_row.get('function_name', '')
                    if func_name:
                        if func_name == '__file_scope__':
                            # 文件级别变化，添加说明
                            vulnerable_function_names.append('__file_scope__')
                        else:
                            vulnerable_function_names.append(func_name)
                    
                    # 获取行号范围
                    start_line = func_row.get('function_start_line', 0)
                    end_line = func_row.get('function_end_line', 0)
                    if start_line and end_line and start_line > 0 and end_line > 0:
                        if start_line == end_line:
                            line_range = str(start_line)
                        else:
                            line_range = f"{start_line}-{end_line}"
                        vulnerable_line_ranges.append(line_range)
                    
                    # 如果有具体的漏洞行号，也添加
                    vuln_lines = func_row.get('vulnerability_lines', [])
                    if vuln_lines and isinstance(vuln_lines, list):
                        for line in vuln_lines:
                            if line not in vulnerable_line_ranges:
                                vulnerable_line_ranges.append(str(line))
            
            # 去重并排序
            vulnerable_line_ranges = sorted(list(set(vulnerable_line_ranges)), key=lambda x: int(x.split('-')[0]) if '-' in x else int(x))
            vulnerable_function_names = sorted(list(set(vulnerable_function_names)))
            
            row['vulnerable_line_ranges'] = ','.join(vulnerable_line_ranges)
            row['vulnerable_function_names'] = ','.join(vulnerable_function_names)
            
            repo_rows.append(row)
        
        repo_summary_df = pd.DataFrame(repo_rows)

        # 去重与同类合并：统一列名并移除冗余
        def coalesce(row, *keys):
            for k in keys:
                v = row.get(k, '')
                if isinstance(v, str) and v.strip():
                    return v
            return ''

        if not repo_summary_df.empty:
            # 统一字段
            repo_summary_df['project_name'] = repo_summary_df.apply(lambda r: coalesce(r, 'project_name_merged', 'project_name_group'), axis=1)
            repo_summary_df['project_type'] = repo_summary_df.apply(lambda r: coalesce(r, 'project_type_merged'), axis=1)
            repo_summary_df['code_links'] = repo_summary_df.apply(lambda r: coalesce(r, 'code_link_merged'), axis=1)
            # 保留 sources 字段（已经在聚合阶段构造），不再从 coalesce 覆盖
            if 'sources' not in repo_summary_df.columns:
                repo_summary_df['sources'] = repo_summary_df.apply(lambda r: coalesce(r, 'source_merged'), axis=1)

            # 移除重复/冗余列
            drop_cols = [
                'project_name_group', 'project_name_merged',
                'project_type_merged', 'nvd_project_type', 'nvd_project_name',
                'code_link_merged', 'source_merged', 'summary_sample',
                # 用户要求从最终结果中移除的列
                'function_vulnerability_type_breakdown',
                'function_code_size_sum', 'function_code_size_mean', 'function_code_size_median', 'function_code_size_min', 'function_code_size_max',
                'function_change_size_sum', 'function_change_size_mean', 'function_change_size_median', 'function_change_size_min', 'function_change_size_max',
                'function_line_changes_sum', 'function_line_changes_mean', 'function_line_changes_median', 'function_line_changes_min', 'function_line_changes_max',
                'vulnerability_count_sum', 'n_commits', 'publish_date_first', 'vulnerable_project_paths', 'fixed_project_paths',
                # 用户要求删除的计数列
                'n_cves', 'n_files', 'n_function_records', 'n_unique_functions', 'n_vulnerable_functions'
            ]
            repo_summary_df = repo_summary_df.drop(columns=[c for c in drop_cols if c in repo_summary_df.columns], errors='ignore')

            # 设定列顺序（仅对存在的列生效）
            preferred_order = [
                'project_name', 'project_type',
                'cve_ids',
                'code_links', 'n_code_links', 'sources',
                'severity_breakdown', 'vulnerability_classification_breakdown', 'cwe_ids',
                'files', 'function_names',
                'function_label_breakdown',
                'commit_shas', 'publish_date_last',
                'vulnerable_code_paths', 'fixed_code_paths',
                'summaries_merged',
                'vulnerable_line_ranges', 'vulnerable_function_names'
            ]
            existing_cols = [c for c in preferred_order if c in repo_summary_df.columns]
            remaining_cols = [c for c in repo_summary_df.columns if c not in existing_cols]
            repo_summary_df = repo_summary_df[existing_cols + remaining_cols]
        
        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # 明细与仓库聚合两份输出
        result_df.to_csv(output_file, index=False, encoding='utf-8')
        # 最终Benchmark结果保存到 data 目录，并命名为 final_dataset.csv
        final_repo_output = 'data/final_dataset.csv'
        os.makedirs(os.path.dirname(final_repo_output), exist_ok=True)
        repo_summary_df.to_csv(final_repo_output, index=False, encoding='utf-8')
        
        print(f"[OK] 函数级数据集已保存到: {output_file}")
        print(f"[OK] 最终仓库聚合数据已保存到: {final_repo_output}")
        print(f"[STATS] 数据集统计:")
        print(f"   - 总函数数: {len(result_df)}")
        print(f"   - 包含漏洞的函数: {len(result_df[result_df['has_vulnerability'] == True])}")
        print(f"   - 涉及CVE数: {result_df['cve_id'].nunique()}")
        print(f"   - 涉及仓库数: {result_df['project_name'].nunique()}")
        print(f"   - 涉及文件数: {result_df['file_path'].nunique()}")
        
        # 显示项目类型分布
        print(f"\n[INFO] 项目类型分布:")
        project_types = result_df['project_type'].value_counts()
        for project_type, count in project_types.items():
            print(f"   - {project_type}: {count}")
        
        # 显示漏洞分类分布
        print(f"\n[INFO] CVE漏洞分类分布:")
        cve_vuln_types = result_df['vulnerability_classification'].value_counts()
        for vuln_type, count in cve_vuln_types.head(10).items():
            print(f"   - {vuln_type}: {count}")
        
        # 显示函数级漏洞类型分布
        print(f"\n[INFO] 函数级漏洞类型分布:")
        func_vuln_types = result_df[result_df['has_vulnerability'] == True]['function_vulnerability_type'].value_counts()
        for vuln_type, count in func_vuln_types.items():
            print(f"   - {vuln_type}: {count}")
        
        # 显示函数类型分布
        print(f"\n[INFO] 函数类型分布:")
        func_types = result_df['function_type'].value_counts()
        for func_type, count in func_types.items():
            print(f"   - {func_type}: {count}")
        
        # 显示统计信息
        print(f"\n[INFO] 代码统计:")
        print(f"   - 平均函数代码大小: {result_df['function_code_size'].mean():.1f} 字符")
        print(f"   - 平均函数修改大小: {result_df['function_change_size'].mean():.1f} 字符")
        print(f"   - 平均函数行数变化: {result_df['function_line_changes'].mean():.1f} 行")
        print(f"   - 平均漏洞数量/函数: {result_df['vulnerability_count'].mean():.1f}")
        
        # 保存详细的CVE-函数映射
        cve_func_mapping = result_df.groupby('cve_id').agg({
            'function_name': 'count',
            'has_vulnerability': 'sum',
            'project_name': 'first',
            'vulnerability_classification': 'first'
        }).rename(columns={'function_name': 'total_functions', 'has_vulnerability': 'vulnerable_functions'})
        
        mapping_file = output_file.replace('.csv', '_cve_function_mapping.csv')
        cve_func_mapping.to_csv(mapping_file, encoding='utf-8')
        print(f"   - CVE-函数映射已保存: {mapping_file}")
    
    else:
        print("[EMPTY] 没有提取到任何函数")



def count_vulnerabilities_in_function(func_code):
    """统计函数中的漏洞数量"""
    vulnerability_patterns = [
        r'innerHTML\s*=',
        r'outerHTML\s*=',
        r'document\.write\s*\(',
        r'eval\s*\(',
        r'setTimeout\s*\([^,]*,\s*[^)]*\)',
        r'setInterval\s*\([^,]*,\s*[^)]*\)',
        r'__proto__\s*=',
        r'prototype\s*=',
        r'fs\.readFile\s*\(',
        r'fs\.writeFile\s*\(',
        r'child_process\.exec\s*\(',
        r'child_process\.spawn\s*\('
    ]
    
    count = 0
    for pattern in vulnerability_patterns:
        matches = re.findall(pattern, func_code, re.IGNORECASE)
        count += len(matches)
    
    return count

def build_minimal_dataset_from_backup(backup_root: str = "../ArenaJS/code_files", output_csv: str = "data/js_vulnerability_dataset_recovered.csv") -> str:
    """当第二步CSV缺失时，从已保存的代码备份目录中恢复最小数据集。

    规则：
    - 遍历 `backup_root` 下的仓库目录。
    - 以同名前缀成对匹配 `*_vulnerable.js` 与 `*_fixed.js`。
    - 生成满足第三步最小需求的记录行，仅填充关键字段，其余置空/Unknown。

    返回生成的CSV路径；若无可用配对则返回空字符串。
    """
    try:
        root_path = Path(backup_root)
        if not root_path.exists():
            print(f"[RECOVER] 备份目录不存在: {backup_root}")
            return ""

        records = []

        for repo_dir in sorted([p for p in root_path.iterdir() if p.is_dir()]):
            repo_dir_name = repo_dir.name
            # 尝试从下划线分割还原 owner/repo（不严格，仅为展示/聚合用）
            if "_" in repo_dir_name:
                parts = repo_dir_name.split("_", 1)
                recovered_project_name = f"{parts[0]}/{parts[1]}"
            else:
                recovered_project_name = repo_dir_name

            # 收集 vulnerable/fixed 文件
            vulnerable_map = {}
            fixed_map = {}
            for file in repo_dir.glob("*.js"):
                fname = file.name
                if fname.endswith("_vulnerable.js"):
                    base = fname[: -len("_vulnerable.js")]
                    vulnerable_map[base] = str(file)
                elif fname.endswith("_fixed.js"):
                    base = fname[: -len("_fixed.js")]
                    fixed_map[base] = str(file)

            # 成对匹配
            common_bases = sorted(set(vulnerable_map.keys()) & set(fixed_map.keys()))
            for base in common_bases:
                vulnerable_code_path = vulnerable_map[base]
                fixed_code_path = fixed_map[base]

                record = {
                    'cve_id': '',
                    'vulnerability_classification': 'Unknown',
                    'cvss_score': 'N/A',
                    'severity': 'UNKNOWN',
                    'publish_date': 'N/A',
                    'summary': '',
                    'code_link': '',
                    'project_name': recovered_project_name,
                    'cwe_id': 'N/A',
                    'source': 'backup_scan',

                    # 关键字段
                    'file_path': f"{base}.js",
                    'vulnerable_code_path': vulnerable_code_path,
                    'fixed_code_path': fixed_code_path,
                    'commit_sha': '',
                    'project_type': 'unknown',
                    'reasoning': 'Recovered from backup directory',

                    # 完整项目（未知）
                    'vulnerable_project_path': '',
                    'fixed_project_path': '',

                    # 统计占位
                    'vulnerable_code_lines': 0,
                    'fixed_code_lines': 0,
                    'code_changes': 0
                }
                records.append(record)

        if not records:
            print("[RECOVER] 未在备份目录中找到成对的 *_vulnerable.js 与 *_fixed.js 文件，无法恢复最小数据集")
            return ""

        # 保存恢复的数据集
        os.makedirs(Path(output_csv).parent, exist_ok=True)
        pd.DataFrame(records).to_csv(output_csv, index=False, encoding='utf-8')
        print(f"[RECOVER] 已从备份恢复最小数据集: {output_csv} (共 {len(records)} 条)")
        return output_csv

    except Exception as e:
        print(f"[RECOVER] 从备份恢复最小数据集失败: {e}")
        return ""

def main():
    """主函数"""
    print("\n==== Code Function Extractor ====")
    print("==== Step 3: Extract Functions from Source Files (Language-Agnostic) ====\n")
    
    # 检查输入文件
    input_file = "data/js_vulnerability_dataset.csv"
    if not os.path.exists(input_file):
        print(f"[WARN] 未找到第二步输出: {input_file}")
        print("[INFO] 尝试从 `../ArenaJS/code_files` 恢复最小数据集以继续第三步…")
        recovered = build_minimal_dataset_from_backup()
        if not recovered or not os.path.exists(recovered):
            print("[FAIL] 恢复失败。请先运行第二步生成数据，或确认备份目录中存在成对代码文件。")
            return
        input_file = recovered
    
    # 处理数据集
    output_file = "data/js_functions_data/js_functions_dataset.csv"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    process_vulnerability_dataset(input_file, output_file)

if __name__ == "__main__":
    main() 