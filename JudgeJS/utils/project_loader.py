#!/usr/bin/env python3
"""
项目级数据加载器
用于加载完整的JavaScript项目（包括vulnerable和fixed版本）
"""

import os
import json
from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
import pandas as pd

class ProjectLoader:
    """完整项目加载器，支持加载vulnerable和fixed两个版本"""
    
    def __init__(self, projects_base_dir: str):
        """
        初始化项目加载器
        
        Args:
            projects_base_dir: 项目根目录（如 ../ArenaJS/projects）
        """
        self.projects_base_dir = Path(projects_base_dir)
        
    def get_project_path(self, project_name: str, version: str = "vulnerable") -> Optional[Path]:
        """
        获取项目路径
        
        Args:
            project_name: 项目名称（如 1j01_mind-map_CVE-2022-4581）
            version: 版本类型 ("vulnerable" 或 "fixed")
            
        Returns:
            项目路径，如果不存在返回None
        """
        project_path = self.projects_base_dir / project_name / version
        return project_path if project_path.exists() else None
    
    def list_files(self, project_path: Path, max_depth: int = 3) -> List[str]:
        """
        递归列出项目中的所有文件
        
        Args:
            project_path: 项目路径
            max_depth: 最大递归深度
            
        Returns:
            相对路径的文件列表
        """
        files = []
        
        def _scan_dir(current_path: Path, current_depth: int):
            if current_depth > max_depth:
                return
            
            try:
                for item in current_path.iterdir():
                    if item.is_file():
                        # 计算相对路径
                        rel_path = item.relative_to(project_path)
                        files.append(str(rel_path))
                    elif item.is_dir() and not item.name.startswith('.'):
                        _scan_dir(item, current_depth + 1)
            except PermissionError:
                pass
        
        _scan_dir(project_path, 0)
        return sorted(files)
    
    def read_file_content(self, project_path: Path, file_path: str) -> Optional[str]:
        """
        读取文件内容
        
        Args:
            project_path: 项目路径
            file_path: 文件相对路径
            
        Returns:
            文件内容，读取失败返回None
        """
        full_path = project_path / file_path
        if not full_path.exists():
            return None
        
        try:
            # 尝试多种编码
            for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'gbk']:
                try:
                    with open(full_path, 'r', encoding=encoding) as f:
                        return f.read()
                except UnicodeDecodeError:
                    continue
            return None
        except Exception:
            return None
    
    def get_project_structure(self, project_path: Path) -> str:
        """
        生成项目文件结构的文本表示
        
        Args:
            project_path: 项目路径
            
        Returns:
            文件结构的字符串表示
        """
        files = self.list_files(project_path)
        
        # 按目录层级组织
        structure = []
        structure.append(f"{project_path.name}/")
        
        # 使用特殊键存储文件列表，避免与真实目录名冲突（如目录名恰好为 'files'）
        FILES_KEY = "__files__"
        dirs = {}
        for file_path in files:
            parts = Path(file_path).parts
            current_dict = dirs
            
            # 构建目录树
            for i, part in enumerate(parts[:-1]):
                if part not in current_dict:
                    current_dict[part] = {}
                current_dict = current_dict[part]
            
            # 添加文件
            if FILES_KEY not in current_dict or not isinstance(current_dict.get(FILES_KEY), list):
                current_dict[FILES_KEY] = []
            current_dict[FILES_KEY].append(parts[-1])
        
        def _format_structure(d: dict, indent: str = "  ") -> List[str]:
            lines = []
            for key in sorted(d.keys()):
                if key == FILES_KEY:
                    value = d.get(FILES_KEY, [])
                    for file in sorted(value):
                        lines.append(f"{indent}├── {file}")
                else:
                    value = d[key]
                    # 目录
                    lines.append(f"{indent}├── {key}/")
                    if isinstance(value, dict):
                        lines.extend(_format_structure(value, indent + "  "))
            return lines
        
        structure.extend(_format_structure(dirs))
        return "\n".join(structure)
    
    def get_source_files_content(self, project_path: Path, max_files: int = 10) -> str:
        """
        获取主要源代码文件的内容
        
        Args:
            project_path: 项目路径
            max_files: 最大文件数量
            
        Returns:
            格式化的源代码内容
        """
        files = self.list_files(project_path)
        
        # 筛选源代码文件
        source_extensions = {'.js', '.ts', '.jsx', '.tsx', '.vue', '.json', '.html', '.htm'}
        source_files = [f for f in files if Path(f).suffix.lower() in source_extensions]
        
        # 优先级排序：主要文件优先
        priority_files = []
        other_files = []
        
        for file_path in source_files:
            file_name = Path(file_path).name.lower()
            if any(keyword in file_name for keyword in [
                'index', 'main', 'app', 'server', 'package.json', 'config'
            ]):
                priority_files.append(file_path)
            else:
                other_files.append(file_path)
        
        # 取前max_files个文件
        selected_files = (priority_files + other_files)[:max_files]
        
        content_parts = []
        for file_path in selected_files:
            content = self.read_file_content(project_path, file_path)
            if content:
                # 限制文件大小
                if len(content) > 5000:
                    content = content[:5000] + "\n... (文件内容已截断)"
                
                content_parts.append(f"=== {file_path} ===")
                content_parts.append(content)
                content_parts.append("")
        
        return "\n".join(content_parts)
    
    def load_project_for_analysis(self, project_name: str, version: str = "vulnerable") -> Optional[Dict[str, Any]]:
        """
        加载项目用于安全分析
        
        Args:
            project_name: 项目名称
            version: 版本类型
            
        Returns:
            包含项目信息的字典，加载失败返回None
        """
        project_path = self.get_project_path(project_name, version)
        if not project_path:
            return None
        
        # 提取项目基本信息
        parts = project_name.split('_')
        if len(parts) >= 3:
            owner_repo = '_'.join(parts[:-1])
            cve_id = parts[-1]
        else:
            owner_repo = project_name
            cve_id = "Unknown"
        
        # 尝试读取package.json获取描述
        package_json_content = self.read_file_content(project_path, "package.json")
        description = "JavaScript项目"
        if package_json_content:
            try:
                package_data = json.loads(package_json_content)
                description = package_data.get("description", description)
            except json.JSONDecodeError:
                pass
        
        return {
            "project_name": project_name,
            "owner_repo": owner_repo,
            "cve_id": cve_id,
            "version": version,
            "project_path": str(project_path),
            "project_description": description,
            "file_structure": self.get_project_structure(project_path),
            "source_files": self.get_source_files_content(project_path),
            "total_files": len(self.list_files(project_path))
        }
    
    def compare_versions(self, project_name: str) -> Optional[Dict[str, Any]]:
        """
        比较vulnerable和fixed版本的差异
        
        Args:
            project_name: 项目名称
            
        Returns:
            包含版本对比信息的字典
        """
        vulnerable_data = self.load_project_for_analysis(project_name, "vulnerable")
        fixed_data = self.load_project_for_analysis(project_name, "fixed")
        
        if not vulnerable_data or not fixed_data:
            return None
        
        return {
            "project_name": project_name,
            "vulnerable": vulnerable_data,
            "fixed": fixed_data,
            "has_both_versions": True
        }
