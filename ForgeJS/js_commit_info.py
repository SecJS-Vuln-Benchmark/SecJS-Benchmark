#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JavaScript漏洞数据集生成器 - 第二步：提取GitHub提交信息和源代码
获取CVE相关的GitHub提交信息，提取修复前后的代码，并保存到本地文件
"""

import os
import sys
import json
import time
import requests
import pandas as pd
from datetime import datetime
from urllib.parse import urlparse
import re
from pathlib import Path
import logging
import hashlib

# 配置选项（效率优化默认更激进）
DOWNLOAD_COMPLETE_PROJECTS = True  # 是否下载完整项目（已开启；若本地已存在将自动复用）
MAX_PROJECT_SIZE_MB = 50  # 最大项目大小(MB)，超过此大小跳过下载
DOWNLOAD_TIMEOUT_SECONDS = 180  # 下载超时时间(秒)
EXTRACT_TIMEOUT_SECONDS = 120  # 解压超时时间(秒)

# 运行范围与策略
ONLY_GITHUB_CODELINK = True        # 仅处理包含 github.com 的记录
START_INDEX = 0                    # 起始下标（便于分片处理）
MAX_CVES = None                    # 处理的最大CVE数量（None 表示不限制）
SKIP_PROCESSED_COMMITS = True      # 已在输出中出现过的 commit 直接跳过
USE_RAW_CONTENT_ENDPOINT = True    # 直接走 raw.githubusercontent.com，减少一次API跳转
ENABLE_DEEP_CLASSIFICATION = True  # 开启深度分类，提升项目类型判定准确度

# 断点续跑（从已有输出CSV的最后一个CVE之后开始）
RESUME_FROM_OUTPUT = True

# 每个项目的最大处理时长（秒），超过则跳过该项目
PROJECT_PROCESS_TIMEOUT_SECONDS = 60

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/js_commit_info.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class GitHubCommitExtractor:
    """GitHub提交信息提取器"""
    
    def __init__(self):
        """初始化提取器"""
        # GitHub API配置（从环境变量或外部文件读取，避免硬编码令牌）
        token_env = os.environ.get("GITHUB_TOKENS", "")
        tokens = [token.strip() for token in token_env.split(",") if token.strip()]

        token_file = os.environ.get("GITHUB_TOKENS_FILE")
        if not tokens and token_file and Path(token_file).exists():
            try:
                with open(token_file, "r", encoding="utf-8") as tf:
                    tokens = [
                        line.strip() for line in tf.readlines()
                        if line.strip() and not line.strip().startswith("#")
                    ]
            except Exception as exc:
                logger.warning("Failed to load GitHub tokens from %s: %s", token_file, exc)

        self.github_tokens = tokens
        if not self.github_tokens:
            logger.warning(
                "No GitHub personal access tokens detected. "
                "Requests will be limited to the unauthenticated rate limit (60 req/hour)."
            )
        self.current_token_index = 0
        self.rate_limit_remaining = 5000
        self.rate_limit_reset = 0
        # 已处理提交缓存（由主程序注入/初始化）
        self.processed_commit_shas = set()
        
        # HTTP会话
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'JavaScript-Vulnerability-Dataset'
        })
        
        # 创建必要的目录
        self._setup_directories()
        
        # 统计信息
        self.stats = {
            'total_cves': 0,
            'processed_cves': 0,
            'successful_extractions': 0,
            'failed_extractions': 0,
            'total_commits': 0,
            'total_files': 0,
            'saved_files': 0,
            'api_requests': 0,
            'rate_limit_hits': 0,
            'downloaded_projects': 0,
            'project_download_errors': 0,
            'project_download_skipped_large': 0
        }
        
        # 错误记录
        self.errors = []
        
        logger.info("GitHub提交信息提取器初始化完成")
    
    def _setup_directories(self):
        """创建必要的目录结构"""
        self.base_output_dir = Path("../ArenaJS/code_files")
        self.base_output_dir.mkdir(parents=True, exist_ok=True)
        
        # 创建完整项目保存目录
        self.projects_output_dir = Path("../ArenaJS/projects")
        self.projects_output_dir.mkdir(parents=True, exist_ok=True)
        
        # 创建日志目录
        Path("logs").mkdir(exist_ok=True)
        
        logger.info(f"代码文件输出目录: {self.base_output_dir}")
        logger.info(f"完整项目输出目录: {self.projects_output_dir}")
    
    def _log_error(self, error_type, message, cve_id="", url=""):
        """记录错误信息"""
        error_record = {
            'timestamp': datetime.now().isoformat(),
            'type': error_type,
            'message': message,
            'cve_id': cve_id,
            'url': url
        }
        self.errors.append(error_record)
        logger.error(f"[{error_type}] {message} (CVE: {cve_id})")
    
    def _update_stats(self, key, increment=1):
        """更新统计信息"""
        if key in self.stats:
            self.stats[key] += increment
    
    def _print_progress(self, current, total, prefix="处理中"):
        """打印处理进度"""
        if current % 5 == 0 or current == total:
            percentage = (current / total * 100) if total > 0 else 0
            print(f"\r{prefix}: {current}/{total} ({percentage:.1f}%)", end="", flush=True)
            if current == total:
                print()  # 换行
    
    def make_github_request(self, url):
        """发送GitHub API请求（增强版错误处理）"""
        self._update_stats('api_requests')
        
        headers = {
            'Authorization': f'token {self.github_tokens[self.current_token_index]}',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'JavaScript-Vulnerability-Dataset'
        }
        
        logger.debug(f"API请求: {url}")
        
        max_retries = 3
        for retry in range(max_retries):
            try:
                response = self.session.get(url, headers=headers, timeout=30)
                
                # 检查速率限制
                if 'X-RateLimit-Remaining' in response.headers:
                    self.rate_limit_remaining = int(response.headers['X-RateLimit-Remaining'])
                    if self.rate_limit_remaining < 100:
                        logger.warning(f"API限制剩余: {self.rate_limit_remaining}")
                
                if 'X-RateLimit-Reset' in response.headers:
                    self.rate_limit_reset = int(response.headers['X-RateLimit-Reset'])
                
                # 处理不同的响应状态
                if response.status_code == 200:
                    return response
                elif response.status_code == 403:
                    if self.rate_limit_remaining == 0:
                        self._update_stats('rate_limit_hits')
                        logger.warning("API限制达到，切换token")
                        self.current_token_index = (self.current_token_index + 1) % len(self.github_tokens)
                        time.sleep(5)
                        return self.make_github_request(url)
                    else:
                        logger.error(f"API访问被拒绝: {response.status_code}")
                        return None
                elif response.status_code == 404:
                    logger.debug(f"资源未找到: {url}")
                    return None
                elif response.status_code == 422:
                    logger.warning(f"API请求格式错误 (422): {url}")
                    return None
                elif response.status_code == 409:
                    logger.warning(f"Git数据冲突 (409): {url}")
                    return None
                elif response.status_code in [502, 503]:
                    if retry < max_retries - 1:
                        wait_time = (retry + 1) * 2
                        logger.warning(f"GitHub服务临时不可用 ({response.status_code})，{wait_time}秒后重试...")
                        time.sleep(wait_time)
                        continue
                    else:
                        logger.error(f"GitHub服务持续不可用: {response.status_code}")
                        return None
                else:
                    logger.error(f"API请求失败: {response.status_code} - {url}")
                    return None
                        
            except requests.exceptions.Timeout:
                if retry < max_retries - 1:
                    logger.warning(f"API请求超时，重试 {retry + 1}/{max_retries}: {url}")
                    time.sleep(2)
                    continue
                else:
                    logger.error(f"API请求持续超时: {url}")
                    return None
            except requests.exceptions.ConnectionError:
                if retry < max_retries - 1:
                    logger.warning(f"网络连接错误，重试 {retry + 1}/{max_retries}: {url}")
                    time.sleep(3)
                    continue
                else:
                    logger.error(f"网络连接持续失败: {url}")
                    return None
            except Exception as e:
                if retry < max_retries - 1:
                    logger.warning(f"API请求异常，重试 {retry + 1}/{max_retries}: {e}")
                    time.sleep(1)
                    continue
                else:
                    logger.error(f"API请求持续异常: {e}")
                    return None
        
        return None
    
    def download_complete_project(self, repo, commit_sha, cve_id):
        """下载完整项目的两个版本（修复前后）。如已存在对应目录且非空，则复用并跳过下载。"""
        try:
            clean_repo_name = repo.replace('/', '_').replace('\\', '_').replace(':', '_').replace('?', '_').replace('<', '_').replace('>', '_').replace('|', '_').replace('"', '_').replace('*', '_')

            # 目标目录
            project_dir = self.projects_output_dir / f"{clean_repo_name}_{cve_id}"
            vulnerable_dir = project_dir / "vulnerable"
            fixed_dir = project_dir / "fixed"

            # 目录是否已有内容
            def _has_any_files(d: Path) -> bool:
                try:
                    return d.exists() and any(d.rglob('*.*'))
                except Exception:
                    return False

            # 如已存在两个版本且非空，直接复用
            if _has_any_files(vulnerable_dir) and _has_any_files(fixed_dir):
                logger.info(f"    完整项目已存在，跳过下载: {project_dir}")
                try:
                    return str(vulnerable_dir.relative_to(Path.cwd())), str(fixed_dir.relative_to(Path.cwd()))
                except ValueError:
                    return str(vulnerable_dir), str(fixed_dir)

            # 创建项目目录
            project_dir.mkdir(parents=True, exist_ok=True)

            # 获取父提交SHA（修复前版本）
            commit_url = f"https://api.github.com/repos/{repo}/commits/{commit_sha}"
            commit_response = self.make_github_request(commit_url)

            if not commit_response or commit_response.status_code != 200:
                logger.warning(f"无法获取提交详情用于下载项目: {repo}#{commit_sha}")
                return None, None

            commit_data = commit_response.json()
            parents = commit_data.get('parents', [])

            if not parents:
                logger.debug(f"提交没有父提交，无法下载修复前版本: {repo}#{commit_sha}")
                return None, None

            parent_sha = parents[0]['sha']

            # 下载修复前版本（vulnerable）
            vulnerable_success = self._download_project_archive(repo, parent_sha, vulnerable_dir, cve_id)

            # 下载修复后版本（fixed）
            fixed_success = self._download_project_archive(repo, commit_sha, fixed_dir, cve_id)

            if vulnerable_success and fixed_success:
                self._update_stats('downloaded_projects')
                logger.info(f"    成功下载完整项目: {project_dir}")
                try:
                    return str(vulnerable_dir.relative_to(Path.cwd())), str(fixed_dir.relative_to(Path.cwd()))
                except ValueError:
                    return str(vulnerable_dir), str(fixed_dir)
            else:
                self._update_stats('project_download_errors')
                return None, None

        except Exception as e:
            self._update_stats('project_download_errors')
            logger.error(f"下载完整项目时出错: {e}")
            return None, None
    
    def _download_project_archive(self, repo, commit_sha, output_dir, cve_id):
        """下载指定commit的项目压缩包并解压（优化版）"""
        try:
            # GitHub API下载archive
            archive_url = f"https://api.github.com/repos/{repo}/zipball/{commit_sha}"
            
            logger.debug(f"下载项目archive: {archive_url}")
            
            # 添加下载超时和进度提示
            import time
            start_time = time.time()
            response = self.session.get(archive_url, 
                                      headers={'Authorization': f'token {self.github_tokens[self.current_token_index]}'},
                                      timeout=(30, 120),  # 连接超时30秒，读取超时120秒
                                      stream=True)
            
            if response.status_code != 200:
                logger.warning(f"无法下载项目archive: {archive_url}, 状态码: {response.status_code}")
                return False
            
            # 检查文件大小
            content_length = response.headers.get('content-length')
            if content_length:
                size_mb = int(content_length) / (1024 * 1024)
                if size_mb > MAX_PROJECT_SIZE_MB:
                    logger.warning(f"项目过大 ({size_mb:.1f}MB > {MAX_PROJECT_SIZE_MB}MB)，跳过下载: {repo}@{commit_sha}")
                    # 记录统计与错误
                    self._update_stats('project_download_skipped_large')
                    try:
                        self._log_error('project_too_large', f'项目过大 ({size_mb:.1f}MB > {MAX_PROJECT_SIZE_MB}MB)，跳过下载: {repo}@{commit_sha}', cve_id)
                    except Exception:
                        pass
                    return False
                logger.info(f"      下载大小: {size_mb:.1f}MB")
            
            # 创建输出目录
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # 保存zip文件
            zip_file = output_dir / f"{commit_sha[:8]}.zip"
            
            # 流式下载以节省内存
            with open(zip_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            download_time = time.time() - start_time
            logger.info(f"      下载完成，耗时: {download_time:.1f}秒")
            
            # 解压文件（添加超时保护）
            import zipfile
            import signal
            
            def timeout_handler(signum, frame):
                raise TimeoutError("解压超时")
            
            try:
                # 设置解压超时（60秒）
                if hasattr(signal, 'SIGALRM'):  # Unix系统
                    signal.signal(signal.SIGALRM, timeout_handler)
                    signal.alarm(60)
                
                with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                    # 安全解压，处理路径长度问题
                    self._safe_extract_zip(zip_ref, output_dir, repo)
                
                if hasattr(signal, 'SIGALRM'):
                    signal.alarm(0)  # 取消超时
                    
            except (TimeoutError, OSError) as e:
                logger.error(f"解压失败: {e}")
                # 清理不完整的解压文件
                try:
                    import shutil
                    if output_dir.exists():
                        shutil.rmtree(output_dir, ignore_errors=True)
                except:
                    pass
                return False
            finally:
                # 删除zip文件以节省空间
                try:
                    zip_file.unlink()
                except:
                    pass
            
            logger.debug(f"成功解压项目到: {output_dir}")
            return True
            
        except Exception as e:
            logger.error(f"下载/解压项目时出错: {e}")
            # 清理失败的下载
            try:
                import shutil
                if output_dir.exists():
                    shutil.rmtree(output_dir, ignore_errors=True)
            except:
                pass
            return False
    
    def _safe_extract_zip(self, zip_ref, output_dir, repo):
        """安全解压ZIP文件，处理长路径问题"""
        import os
        import shutil
        
        # Windows路径长度限制
        max_path_length = 240 if os.name == 'nt' else 4096
        
        extracted_files = 0
        skipped_files = 0
        total_files = len(zip_ref.namelist())
        
        logger.info(f"      解压 {total_files} 个文件...")
        
        for member in zip_ref.namelist():
            try:
                # 构建目标路径
                target_path = output_dir / member
                
                # 检查路径长度
                if len(str(target_path)) > max_path_length:
                    # 截断路径
                    path_parts = Path(member).parts
                    if len(path_parts) > 1:
                        # 保留前几层和文件名
                        keep_parts = path_parts[:2] + path_parts[-1:]
                        if len(path_parts) > 3:
                            keep_parts = path_parts[:1] + ('...',) + path_parts[-1:]
                        member = str(Path(*keep_parts))
                        target_path = output_dir / member
                    
                    # 如果还是太长，跳过
                    if len(str(target_path)) > max_path_length:
                        skipped_files += 1
                        if skipped_files < 5:  # 只记录前几个
                            logger.debug(f"跳过长路径文件: {member}")
                        continue
                
                # 确保目录存在
                target_path.parent.mkdir(parents=True, exist_ok=True)
                
                # 解压文件
                if not member.endswith('/'):  # 不是目录
                    with zip_ref.open(member) as source, open(target_path, 'wb') as target:
                        shutil.copyfileobj(source, target)
                    extracted_files += 1
                
                # 进度提示
                if extracted_files % 100 == 0:
                    logger.debug(f"      已解压: {extracted_files}/{total_files}")
                    
            except Exception as e:
                skipped_files += 1
                if skipped_files < 5:
                    logger.debug(f"跳过文件 {member}: {e}")
                continue
        
        logger.info(f"      解压完成: {extracted_files} 个文件，跳过: {skipped_files} 个")
        
        # 查找并整理解压后的目录结构
        self._organize_extracted_files(output_dir)
    
    def _organize_extracted_files(self, output_dir):
        """整理解压后的文件结构"""
        try:
            # 查找解压后的目录（通常是repo-name-commit格式）
            extracted_dirs = [d for d in output_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]
            
            if extracted_dirs:
                # 如果只有一个主目录，将其内容移动到根目录
                extracted_dir = extracted_dirs[0]
                temp_items = list(extracted_dir.iterdir())
                
                # 移动文件，避免路径冲突
                for item in temp_items:
                    try:
                        new_path = output_dir / item.name
                        if new_path.exists():
                            # 如果存在重名，添加前缀
                            new_path = output_dir / f"dup_{item.name}"
                        item.rename(new_path)
                    except Exception as e:
                        logger.debug(f"移动文件失败 {item}: {e}")
                        continue
                
                # 删除空的原始目录
                try:
                    extracted_dir.rmdir()
                except:
                    pass
                    
        except Exception as e:
            logger.debug(f"整理文件结构时出错: {e}")
    
    def extract_repo_from_url(self, url):
        """从GitHub URL中提取仓库信息（增强版）"""
        if not url or 'github.com' not in url:
            logger.debug(f"无效URL: {url}")
            return None
        
        logger.debug(f"解析GitHub URL: {url}")
        
        # 清理URL
        url = url.strip()
        if url.startswith('http://'):
            url = url.replace('http://', 'https://')
        
        # 匹配不同的GitHub URL格式
        patterns = [
            r'github\.com/([^/]+)/([^/]+)',
            r'github\.com/([^/]+)/([^/]+)/commit/([a-f0-9]+)',
            r'github\.com/([^/]+)/([^/]+)/pull/(\d+)',
            r'github\.com/([^/]+)/([^/]+)/issues/(\d+)',
            r'github\.com/([^/]+)/([^/]+)/tree/',
            r'github\.com/([^/]+)/([^/]+)/blob/'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                owner = match.group(1)
                repo = match.group(2)
                
                # 清理仓库名称
                if repo.endswith('.git'):
                    repo = repo[:-4]
                
                repo_path = f"{owner}/{repo}"
                logger.debug(f"提取到仓库: {repo_path}")
                return repo_path
        
        logger.warning(f"无法从URL提取仓库信息: {url}")
        return None
    
    def save_code_to_file(self, code_content, cve_id, repo_name, file_path, is_fixed=False):
        """保存代码到本地文件（增强错误处理）"""
        if not code_content:
            return None
        
        try:
            # 清理仓库名称，避免文件系统不支持的字符
            clean_repo_name = repo_name.replace('/', '_').replace('\\', '_').replace(':', '_').replace('?', '_').replace('<', '_').replace('>', '_').replace('|', '_').replace('"', '_').replace('*', '_')
            
            # 创建目录结构，增加错误处理
            repo_dir = self.base_output_dir / clean_repo_name
            try:
                repo_dir.mkdir(parents=True, exist_ok=True)
            except PermissionError as e:
                logger.warning(f"创建目录权限不足，尝试使用临时目录: {e}")
                # 使用临时目录
                import tempfile
                temp_dir = Path(tempfile.gettempdir()) / "js_vulnerability_codes" / clean_repo_name
                temp_dir.mkdir(parents=True, exist_ok=True)
                repo_dir = temp_dir
            
            # 生成安全的文件名
            suffix = "_fixed" if is_fixed else "_vulnerable"
            base_filename = Path(file_path).stem
            # 清理文件名中的非法字符
            clean_filename = re.sub(r'[<>:"/\\|?*]', '_', base_filename)
            filename = f"{clean_filename}{suffix}.js"
            output_file = repo_dir / filename
            
            # 确保文件名不会太长（Windows限制）
            if len(str(output_file)) > 250:
                # 截断文件名
                hash_suffix = hashlib.md5(str(output_file).encode()).hexdigest()[:8]
                short_filename = f"{clean_filename[:50]}_{hash_suffix}{suffix}.js"
                output_file = repo_dir / short_filename
            
            # 写入文件，增加重试机制
            max_retries = 3
            for retry in range(max_retries):
                try:
                    with open(output_file, 'w', encoding='utf-8', errors='ignore') as f:
                        f.write(code_content)
                    
                    self._update_stats('saved_files')
                    logger.debug(f"代码已保存: {output_file}")
                    
                    # 返回相对路径
                    try:
                        return str(output_file.relative_to(Path.cwd()))
                    except ValueError:
                        # 如果无法计算相对路径，返回绝对路径
                        return str(output_file)
                        
                except PermissionError as e:
                    if retry < max_retries - 1:
                        logger.warning(f"文件写入权限错误，重试 {retry + 1}/{max_retries}: {e}")
                        time.sleep(0.1)  # 短暂等待
                        continue
                    else:
                        raise e
                except IOError as e:
                    if retry < max_retries - 1:
                        logger.warning(f"文件I/O错误，重试 {retry + 1}/{max_retries}: {e}")
                        time.sleep(0.1)
                        continue
                    else:
                        raise e
                break
            
        except Exception as e:
            error_msg = f"保存文件失败: {str(e)} (errno: {getattr(e, 'errno', 'unknown')})"
            self._log_error('file_save_error', error_msg, cve_id, str(output_file) if 'output_file' in locals() else 'unknown')
            logger.warning(f"文件保存失败，但继续处理: {error_msg}")
        return None
    
    def get_commit_files(self, repo, commit_sha):
        """获取提交中的文件变更（增强版）"""
        url = f"https://api.github.com/repos/{repo}/commits/{commit_sha}"
        logger.debug(f"获取提交文件: {repo}#{commit_sha}")
        
        response = self.make_github_request(url)
        
        if not response or response.status_code != 200:
            logger.warning(f"无法获取提交信息: {repo}#{commit_sha}")
            return []
        
        commit_data = response.json()
        files = commit_data.get('files', [])
        
        js_files = []
        for file_info in files:
            filename = file_info.get('filename', '')
            if self.is_javascript_file(filename):
                js_files.append({
                    'filename': filename,
                    'status': file_info.get('status', ''),
                    'additions': file_info.get('additions', 0),
                    'deletions': file_info.get('deletions', 0),
                    'patch': file_info.get('patch', ''),
                    'raw_url': file_info.get('raw_url', ''),
                    'contents_url': file_info.get('contents_url', '')
                })
        
        self._update_stats('total_files', len(js_files))
        logger.debug(f"找到 {len(js_files)} 个JavaScript文件")
        return js_files
    
    def is_javascript_file(self, filename):
        """检查文件是否是JavaScript文件（增强版）"""
        if not filename:
            return False
        
        filename_lower = filename.lower()
        
        # 标准JavaScript文件扩展名
        js_extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue', '.svelte']
        
        # 检查扩展名
        if any(filename_lower.endswith(ext) for ext in js_extensions):
            return True
        
        # 检查特殊的JavaScript相关文件
        js_patterns = [
            # 配置文件
            'package.json', 'tsconfig.json', 'webpack.config', 'babel.config',
            'rollup.config', 'vite.config', 'jest.config', 'cypress.config',
            '.eslintrc', '.prettierrc', 'next.config', 'nuxt.config',
            
            # 无扩展名的JavaScript文件
            'gulpfile', 'gruntfile', 'rakefile.js', 'makefile.js',
            
            # JavaScript模板文件
            '.ejs', '.hbs', '.handlebars', '.mustache',
            
            # 包含JavaScript的HTML文件（某些情况下）
            'index.html', 'app.html'
        ]
        
        # 检查文件名模式
        for pattern in js_patterns:
            if pattern in filename_lower:
                return True
        
        # 检查路径中的JavaScript相关目录
        js_dirs = ['js/', 'javascript/', 'src/', 'lib/', 'assets/js/', 'public/js/']
        for js_dir in js_dirs:
            if js_dir in filename_lower and filename_lower.endswith(('.js', '.ts')):
                return True
        
        return False
    
    def get_file_content(self, repo, commit_sha, file_path):
        """获取文件内容（增强版）"""
        url = f"https://api.github.com/repos/{repo}/contents/{file_path}?ref={commit_sha}"
        logger.debug(f"获取文件内容: {repo}:{file_path}@{commit_sha}")
        
        response = self.make_github_request(url)
        
        if not response or response.status_code != 200:
            logger.debug(f"无法获取文件内容: {repo}:{file_path}")
            return None, None
        
        file_data = response.json()
        
        # 获取文件内容
        content_url = file_data.get('download_url')
        if not content_url:
            logger.warning(f"文件没有下载URL: {repo}:{file_path}")
            return None, None
        
        content_response = self.make_github_request(content_url)
        if not content_response or content_response.status_code != 200:
            logger.warning(f"无法下载文件内容: {content_url}")
            return None, None
        
        return content_response.text, file_data.get('sha', '')
    
    def get_before_after_code(self, repo, commit_sha, file_path):
        """获取修复前后的代码（增强版）"""
        try:
            logger.debug(f"获取修复前后代码: {repo}:{file_path}@{commit_sha}")
            
            # 获取提交详情
            commit_url = f"https://api.github.com/repos/{repo}/commits/{commit_sha}"
            commit_response = self.make_github_request(commit_url)
            
            if not commit_response or commit_response.status_code != 200:
                logger.warning(f"无法获取提交详情: {repo}#{commit_sha}")
                return None, None
            
            commit_data = commit_response.json()
            parents = commit_data.get('parents', [])
            
            if not parents:
                logger.debug(f"提交没有父提交: {repo}#{commit_sha}")
                return None, None
            
            parent_sha = parents[0]['sha']
            
            # 获取修复前代码（父提交）与修复后代码（当前提交）
            if USE_RAW_CONTENT_ENDPOINT:
                raw_before = f"https://raw.githubusercontent.com/{repo}/{parent_sha}/{file_path}"
                raw_after = f"https://raw.githubusercontent.com/{repo}/{commit_sha}/{file_path}"
                rb = self.make_github_request(raw_before)
                ra = self.make_github_request(raw_after)
                before_content = rb.text if rb and rb.status_code == 200 else None
                after_content = ra.text if ra and ra.status_code == 200 else None
            else:
                before_content, _ = self.get_file_content(repo, parent_sha, file_path)
                after_content, _ = self.get_file_content(repo, commit_sha, file_path)
            
            if before_content and after_content:
                logger.debug(f"成功获取修复前后代码，长度: {len(before_content)} -> {len(after_content)}")
            else:
                logger.warning(f"无法获取完整的修复前后代码")
            
            return before_content, after_content
            
        except Exception as e:
            logger.error(f"获取修复前后代码时出错: {e}")
            return None, None
    
    def determine_project_type(self, repo, file_path, code_content):
        """确定项目类型（前端/后端/全栈）- 增强版"""
        # 优先级1: 精确项目名称匹配
        project_type = self._classify_by_exact_project_name(repo)
        if project_type != 'unknown':
            return project_type
        
        # 优先级2: 文件路径分析
        path_type = self._classify_by_file_path(file_path)
        if path_type != 'unknown':
            return path_type
        
        # 优先级3: 代码内容分析
        content_type = self._classify_by_code_content(code_content, file_path)
        if content_type != 'unknown':
            return content_type
        
        # 优先级4: 仓库名称模式分析
        repo_type = self._classify_by_repo_patterns(repo)
        if repo_type != 'unknown':
            return repo_type
            
        return 'unknown'
    
    def determine_project_type_enhanced(self, repo, file_path, before_content, after_content, cve_data):
        """二次分类：通过更深度的代码分析确定项目类型"""
        logger.debug(f"开始二次分类分析: {repo}:{file_path}")
        
        # 合并前后代码内容进行更全面的分析
        combined_content = ""
        if before_content:
            combined_content += before_content + "\n"
        if after_content:
            combined_content += after_content + "\n"
        
        # 添加CVE描述信息
        summary = cve_data.get('summary', '')
        combined_content += f" {summary} "
        
        # 优先级1: 深度代码内容分析（使用修复前后的代码）
        deep_content_type = self._classify_by_deep_code_analysis(combined_content, file_path, repo)
        if deep_content_type != 'unknown':
            logger.debug(f"深度代码分析结果: {deep_content_type}")
            return deep_content_type
        
        # 优先级2: 依赖分析（从代码中提取import/require）
        dependency_type = self._classify_by_dependencies(combined_content)
        if dependency_type != 'unknown':
            logger.debug(f"依赖分析结果: {dependency_type}")
            return dependency_type
        
        # 优先级3: 文件结构和目录分析
        structure_type = self._classify_by_project_structure(repo, file_path)
        if structure_type != 'unknown':
            logger.debug(f"项目结构分析结果: {structure_type}")
            return structure_type
        
        # 优先级4: CVE描述上下文分析
        context_type = self._classify_by_cve_context(cve_data)
        if context_type != 'unknown':
            logger.debug(f"CVE上下文分析结果: {context_type}")
            return context_type
        
        # 优先级5: 模糊匹配（降低标准）
        fuzzy_type = self._classify_by_fuzzy_matching(repo, file_path, combined_content)
        if fuzzy_type != 'unknown':
            logger.debug(f"模糊匹配结果: {fuzzy_type}")
            return fuzzy_type
        
        logger.debug("所有二次分类方法都无法确定项目类型")
        return 'unknown'
    
    def _classify_by_exact_project_name(self, repo):
        """通过精确的项目名称判断类型"""
        repo_lower = repo.lower()
        
        # 明确的前端项目
        frontend_projects = {
            'react', 'vue', 'angular', 'svelte', 'preact', 'lit', 'stencil', 'qwik',
            'jquery', 'zepto', 'bootstrap', 'foundation', 'bulma', 'semantic-ui',
            'webpack', 'rollup', 'parcel', 'vite', 'babel', 'eslint', 'prettier',
            'three.js', 'd3', 'chart.js', 'leaflet', 'moment', 'lodash', 'axios',
            'redux', 'mobx', 'recoil', 'zustand', 'styled-components', 'emotion',
            'cypress', 'playwright', 'puppeteer', 'storybook', 'electron', 'ionic'
        }
        
        # 明确的后端项目
        backend_projects = {
            'express', 'koa', 'fastify', 'hapi', 'restify', 'nodemon', 'pm2',
            'mongoose', 'sequelize', 'prisma', 'typeorm', 'knex', 'redis',
            'passport', 'jsonwebtoken', 'bcrypt', 'helmet', 'cors', 'multer',
            'socket.io', 'ws', 'bull', 'agenda', 'cron', 'dotenv', 'config',
            'winston', 'pino', 'morgan', 'debug', 'nodemailer', 'sharp'
        }
        
        # 全栈框架
        fullstack_projects = {
            'next.js', 'nuxt', 'remix', 'gatsby', 'meteor', 'sails', 'adonis',
            'nest', 'keystonejs', 'strapi', 'directus', 'ghost'
        }
        
        # 检查项目名称
        for proj in fullstack_projects:
            if proj in repo_lower or repo_lower.endswith(f'/{proj}') or repo_lower.startswith(f'{proj}/'):
                return 'fullstack'
        
        for proj in frontend_projects:
            if proj in repo_lower or repo_lower.endswith(f'/{proj}') or repo_lower.startswith(f'{proj}/'):
                return 'frontend'
        
        for proj in backend_projects:
            if proj in repo_lower or repo_lower.endswith(f'/{proj}') or repo_lower.startswith(f'{proj}/'):
                return 'backend'
        
        return 'unknown'
    
    def _classify_by_file_path(self, file_path):
        """通过文件路径判断类型"""
        path_lower = file_path.lower()
        
        # 前端文件路径模式
        frontend_path_patterns = [
            'src/components/', 'src/pages/', 'src/views/', 'public/', 'static/',
            'assets/', 'styles/', 'css/', 'scss/', 'less/', 'images/', 'img/',
            'client/', 'frontend/', 'web/', 'ui/', 'app/', 'site/', 'www/',
            'packages/app/', 'packages/web/', 'packages/ui/', 'packages/client/'
        ]
        
        # 后端文件路径模式
        backend_path_patterns = [
            'src/server/', 'src/api/', 'src/services/', 'src/controllers/',
            'src/models/', 'src/middleware/', 'src/routes/', 'server/',
            'backend/', 'api/', 'services/', 'controllers/', 'models/',
            'middleware/', 'routes/', 'database/', 'db/', 'config/',
            'packages/server/', 'packages/api/', 'packages/backend/'
        ]
        
        # 检查路径模式
        for pattern in frontend_path_patterns:
            if pattern in path_lower:
                return 'frontend'
        
        for pattern in backend_path_patterns:
            if pattern in path_lower:
                return 'backend'
        
        # 基于文件扩展名
        if file_path.endswith(('.jsx', '.tsx', '.vue', '.svelte')):
            return 'frontend'
        elif file_path.endswith('.html') or '/public/' in path_lower:
            return 'frontend'
        
        return 'unknown'
    
    def _classify_by_code_content(self, code_content, file_path):
        """通过代码内容判断类型"""
        if not code_content:
            return 'unknown'
        
        code_lower = code_content.lower()
        
        # 前端API和DOM操作权重分析
        frontend_indicators = {
            'document': 3, 'window': 3, 'navigator': 2, 'location': 2,
            'localstorage': 3, 'sessionstorage': 3, 'indexeddb': 2,
            'getelementbyid': 3, 'queryselector': 3, 'addeventlistener': 3,
            'onclick': 2, 'onload': 2, 'onchange': 2, 'onsubmit': 2,
            'react': 3, 'vue': 3, 'angular': 3, 'component': 2,
            'usestate': 3, 'useeffect': 3, 'render': 2, 'props': 2,
            'css': 2, 'style': 1, 'class': 1, 'bootstrap': 2, 'tailwind': 2,
            'fetch': 2, 'axios': 2, 'ajax': 2, 'xmlhttprequest': 2,
            'browser': 2, 'client': 1, 'frontend': 3
        }
        
        # 后端API和Node.js权重分析
        backend_indicators = {
            'require': 3, 'module.exports': 3, 'exports': 2, 'process.env': 3,
            '__dirname': 3, '__filename': 3, 'process.argv': 2,
            'express': 3, 'app.get': 3, 'app.post': 3, 'app.listen': 3,
            'req.body': 3, 'res.json': 3, 'res.send': 3, 'next()': 2,
            'middleware': 3, 'router': 2, 'cors': 2, 'helmet': 2,
            'mongoose': 3, 'sequelize': 3, 'prisma': 3, 'database': 2,
            'mongodb': 2, 'mysql': 2, 'postgresql': 2, 'redis': 2,
            'passport': 3, 'jwt': 2, 'bcrypt': 3, 'crypto': 2,
            'fs.readfile': 3, 'fs.writefile': 3, 'path.join': 2,
            'server': 2, 'backend': 3, 'api': 2, 'microservice': 3
        }
        
        # 计算加权分数
        frontend_score = sum(weight for keyword, weight in frontend_indicators.items() if keyword in code_lower)
        backend_score = sum(weight for keyword, weight in backend_indicators.items() if keyword in code_lower)
        
        # 文件扩展名加权
        if file_path.endswith(('.jsx', '.tsx', '.vue', '.svelte')):
            frontend_score += 5
        elif file_path.endswith('.html'):
            frontend_score += 3
        elif file_path.endswith(('.js', '.ts')):
            # 进一步分析JS/TS文件内容
            if any(keyword in code_lower for keyword in ['import react', 'from react', '@angular', 'vue']):
                frontend_score += 3
            elif any(keyword in code_lower for keyword in ['require(', 'module.exports', 'process.env']):
                backend_score += 2
        
        # 设置阈值
        min_score = 3
        
        if frontend_score >= min_score and backend_score >= min_score:
            if abs(frontend_score - backend_score) <= 2:
                return 'fullstack'
            elif frontend_score > backend_score:
                return 'frontend'
            else:
                return 'backend'
        elif frontend_score >= min_score:
            return 'frontend'
        elif backend_score >= min_score:
            return 'backend'
        
        return 'unknown'
    
    def _classify_by_repo_patterns(self, repo):
        """通过仓库名称模式分析项目类型"""
        repo_lower = repo.lower()
        
        # 前端仓库名称模式
        if any(pattern in repo_lower for pattern in [
            'frontend', 'client', 'ui', 'web', 'app', 'dashboard',
            'admin', 'portal', 'website', 'landing', 'gui'
        ]):
            return 'frontend'
        
        # 后端仓库名称模式
        if any(pattern in repo_lower for pattern in [
            'backend', 'server', 'api', 'service', 'microservice',
            'auth', 'gateway', 'database', 'worker', 'daemon'
        ]):
            return 'backend'
        
        return 'unknown'
    
    def _classify_by_deep_code_analysis(self, code_content, file_path, repo):
        """深度代码内容分析 - 二次分类专用"""
        if not code_content:
            return 'unknown'
        
        code_lower = code_content.lower()
        
        # 更精细的前端特征检测
        frontend_strong_indicators = {
            # DOM和浏览器API
            'document.getelementbyid': 5, 'document.queryselector': 5,
            'window.location': 4, 'window.open': 4, 'window.alert': 3,
            'localstorage.setitem': 5, 'sessionstorage.getitem': 5,
            'navigator.useragent': 4, 'history.pushstate': 4,
            
            # 前端框架特有语法
            'usestate(': 5, 'useeffect(': 5, 'componentdidmount': 5,
            'this.state': 4, 'this.props': 4, 'this.setstate': 5,
            'v-if': 5, 'v-for': 5, 'v-model': 5, '@click': 4,
            'ngif': 4, 'ngfor': 4, 'ngmodel': 4, 'component(': 4,
            
            # CSS和样式
            'style.display': 4, 'classlist.add': 4, 'classlist.remove': 4,
            'getstyle': 3, 'setattribute': 3, 'innerhtml': 4,
            
            # 事件处理
            'addeventlistener(': 4, 'onclick': 3, 'onload': 3,
            'preventdefault': 4, 'stoppropagation': 3,
            
            # 构建工具和打包
            'webpack': 3, 'rollup': 3, 'parcel': 3, 'vite': 3,
            'babel': 3, 'typescript': 2,
            
            # 测试工具
            'jest': 2, 'cypress': 3, 'playwright': 3, 'puppeteer': 3
        }
        
        # 更精细的后端特征检测
        backend_strong_indicators = {
            # Node.js核心模块
            'require(\'fs\')': 5, 'require(\'path\')': 5, 'require(\'http\')': 5,
            'require(\'express\')': 5, 'require(\'mongoose\')': 5,
            'process.env': 5, '__dirname': 5, '__filename': 5,
            'module.exports': 5, 'exports.': 4,
            
            # 服务器框架
            'app.get(': 5, 'app.post(': 5, 'app.listen(': 5,
            'router.get(': 4, 'router.post(': 4,
            'req.body': 5, 'req.params': 4, 'req.query': 4,
            'res.json(': 5, 'res.send(': 5, 'res.status(': 4,
            'next()': 4, 'middleware': 3,
            
            # 数据库操作
            'db.collection': 4, 'collection.find': 4, 'collection.insert': 4,
            'model.findone': 4, 'model.save': 4, 'model.create': 4,
            'query.select': 3, 'query.where': 3,
            
            # 服务器功能
            'server.listen': 4, 'createserver': 4, 'http.createserver': 5,
            'authentication': 3, 'authorization': 3, 'session': 3,
            'jwt.sign': 4, 'bcrypt.hash': 4, 'passport': 3,
            
            # 文件和I/O操作
            'fs.readfile': 4, 'fs.writefile': 4, 'fs.exists': 3,
            'path.join': 4, 'path.resolve': 3,
            
            # 日志和监控
            'console.log': 1, 'logger.info': 3, 'logger.error': 3,
            
            # API和微服务
            'microservice': 4, 'api.': 2, 'endpoint': 2,
            'cors': 3, 'helmet': 3, 'ratelimit': 3
        }
        
        # 计算加权分数
        frontend_score = sum(weight for keyword, weight in frontend_strong_indicators.items() 
                           if keyword in code_lower)
        backend_score = sum(weight for keyword, weight in backend_strong_indicators.items() 
                          if keyword in code_lower)
        
        # 文件路径额外加权
        if '/public/' in file_path or '/static/' in file_path or '/assets/' in file_path:
            frontend_score += 3
        elif '/server/' in file_path or '/api/' in file_path or '/backend/' in file_path:
            backend_score += 3
        elif '/routes/' in file_path or '/controllers/' in file_path or '/models/' in file_path:
            backend_score += 2
        elif '/components/' in file_path or '/views/' in file_path or '/pages/' in file_path:
            frontend_score += 2
        
        # 文件扩展名额外加权
        if file_path.endswith(('.jsx', '.tsx', '.vue', '.svelte')):
            frontend_score += 4
        elif file_path.endswith('.html'):
            frontend_score += 3
        
        # 仓库名称额外加权
        repo_lower = repo.lower()
        if any(word in repo_lower for word in ['ui', 'frontend', 'client', 'web', 'app']):
            frontend_score += 2
        elif any(word in repo_lower for word in ['api', 'server', 'backend', 'service']):
            backend_score += 2
        
        # 降低阈值以提高分类率
        min_score = 3
        
        if frontend_score >= min_score and backend_score >= min_score:
            if abs(frontend_score - backend_score) <= 2:
                return 'fullstack'
            elif frontend_score > backend_score:
                return 'frontend'
            else:
                return 'backend'
        elif frontend_score >= min_score:
            return 'frontend'
        elif backend_score >= min_score:
            return 'backend'
        
        return 'unknown'
    
    def _classify_by_dependencies(self, code_content):
        """通过依赖分析进行分类"""
        if not code_content:
            return 'unknown'
        
        code_lower = code_content.lower()
        
        # 提取import和require语句
        import re
        
        # 查找所有import和require语句
        import_patterns = [
            r"import\s+.*?from\s+['\"]([^'\"]+)['\"]",
            r"require\(['\"]([^'\"]+)['\"]\)",
            r"import\s+['\"]([^'\"]+)['\"]"
        ]
        
        dependencies = []
        for pattern in import_patterns:
            matches = re.findall(pattern, code_content, re.IGNORECASE)
            dependencies.extend(matches)
        
        if not dependencies:
            return 'unknown'
        
        frontend_deps = 0
        backend_deps = 0
        
        # 分析依赖类型
        for dep in dependencies:
            dep_lower = dep.lower()
            
            # 前端依赖
            if any(frontend_key in dep_lower for frontend_key in [
                'react', 'vue', 'angular', 'svelte', 'jquery', 'lodash',
                'axios', 'fetch', 'chart', 'three', 'd3', 'leaflet',
                'styled-components', 'emotion', '@mui', 'antd',
                'webpack', 'babel', 'eslint', 'prettier'
            ]):
                frontend_deps += 1
            
            # 后端依赖
            elif any(backend_key in dep_lower for backend_key in [
                'express', 'koa', 'fastify', 'hapi', 'mongoose', 'sequelize',
                'prisma', 'typeorm', 'knex', 'redis', 'mysql', 'postgres',
                'passport', 'bcrypt', 'jwt', 'helmet', 'cors',
                'winston', 'pino', 'nodemailer', 'socket.io'
            ]):
                backend_deps += 1
            
            # Node.js核心模块（后端）
            elif dep_lower in ['fs', 'path', 'http', 'https', 'url', 'os', 'crypto', 'util']:
                backend_deps += 2  # 核心模块权重更高
        
        # 基于依赖比例判断
        if frontend_deps > backend_deps and frontend_deps >= 2:
            return 'frontend'
        elif backend_deps > frontend_deps and backend_deps >= 2:
            return 'backend'
        elif frontend_deps > 0 and backend_deps > 0:
            return 'fullstack'
        
        return 'unknown'
    
    def _classify_by_project_structure(self, repo, file_path):
        """通过项目结构分析进行分类"""
        # 基于文件路径的深度分析
        path_lower = file_path.lower()
        
        # 强前端指示器
        strong_frontend_paths = [
            '/src/components/', '/src/pages/', '/src/views/', '/src/screens/',
            '/public/', '/static/', '/assets/', '/styles/', '/css/',
            '/client/', '/frontend/', '/web/', '/ui/', '/app/src/',
            '/packages/app/', '/packages/web/', '/packages/ui/',
            '/www/', '/html/', '/templates/client/'
        ]
        
        # 强后端指示器  
        strong_backend_paths = [
            '/src/server/', '/src/api/', '/src/services/', '/src/controllers/',
            '/src/models/', '/src/middleware/', '/src/routes/', '/src/database/',
            '/server/', '/backend/', '/api/', '/services/', '/controllers/',
            '/models/', '/middleware/', '/routes/', '/database/', '/db/',
            '/config/', '/migrations/', '/seeds/', '/workers/',
            '/packages/server/', '/packages/api/', '/packages/backend/'
        ]
        
        # 检查强指示器
        for pattern in strong_frontend_paths:
            if pattern in path_lower:
                return 'frontend'
        
        for pattern in strong_backend_paths:
            if pattern in path_lower:
                return 'backend'
        
        # 基于文件扩展名和位置的组合判断
        if file_path.endswith(('.jsx', '.tsx', '.vue', '.svelte')) and '/src/' in path_lower:
            return 'frontend'
        elif file_path.endswith('.js') and any(indicator in path_lower for indicator in ['/routes/', '/controllers/', '/models/']):
            return 'backend'
        
        return 'unknown'
    
    def _classify_by_cve_context(self, cve_data):
        """通过CVE描述上下文进行分类"""
        summary = cve_data.get('summary', '').lower()
        
        if not summary:
            return 'unknown'
        
        # 前端相关上下文
        frontend_contexts = [
            'web browser', 'client-side', 'browser', 'dom', 'html', 'css',
            'javascript execution', 'user interface', 'frontend', 'client application',
            'web application frontend', 'browser rendering', 'cross-site scripting',
            'dom manipulation', 'client script', 'browser security'
        ]
        
        # 后端相关上下文
        backend_contexts = [
            'server-side', 'web server', 'application server', 'backend',
            'server application', 'server script', 'database', 'api server',
            'authentication server', 'server configuration', 'server security',
            'file upload', 'server processing', 'backend service'
        ]
        
        frontend_matches = sum(1 for context in frontend_contexts if context in summary)
        backend_matches = sum(1 for context in backend_contexts if context in summary)
        
        if frontend_matches > backend_matches and frontend_matches >= 1:
            return 'frontend'
        elif backend_matches > frontend_matches and backend_matches >= 1:
            return 'backend'
        elif frontend_matches > 0 and backend_matches > 0:
            return 'fullstack'
        
        return 'unknown'
    
    def _classify_by_fuzzy_matching(self, repo, file_path, code_content):
        """模糊匹配 - 最后的尝试，降低标准"""
        repo_lower = repo.lower()
        path_lower = file_path.lower()
        code_lower = code_content.lower() if code_content else ''
        
        # 极低阈值的关键词匹配
        frontend_weak_signals = [
            'react', 'vue', 'angular', 'ui', 'component', 'frontend', 'client',
            'browser', 'dom', 'html', 'css', 'style', 'web', 'app'
        ]
        
        backend_weak_signals = [
            'server', 'api', 'database', 'backend', 'service', 'express',
            'node', 'require', 'module', 'exports', 'process'
        ]
        
        # 在仓库名、文件路径、代码中寻找任何信号
        all_text = f"{repo_lower} {path_lower} {code_lower}"
        
        frontend_signals = sum(1 for signal in frontend_weak_signals if signal in all_text)
        backend_signals = sum(1 for signal in backend_weak_signals if signal in all_text)
        
        # 非常低的阈值
        if frontend_signals >= 1 and frontend_signals > backend_signals:
            return 'frontend'
        elif backend_signals >= 1 and backend_signals > frontend_signals:
            return 'backend'
        
        return 'unknown'
    
    def process_cve_data(self, cve_data):
        """处理CVE数据，提取GitHub信息（增强版）"""
        results = []
        
        cve_id = cve_data.get('cve_id', '')
        code_links = cve_data.get('code_link', '')
        
        self._update_stats('processed_cves')
        logger.info(f"处理CVE: {cve_id}")
        
        if not code_links or pd.isna(code_links):
            self._log_error('no_code_links', 'CVE没有code_link信息', cve_id)
            return results
        
        # 解析GitHub链接
        github_links = []
        for link in str(code_links).split(';'):
            link = link.strip()
            if 'github.com' in link:
                github_links.append(link)
                logger.debug(f"找到GitHub链接: {link}")
        
        if not github_links:
            self._log_error('no_github_links', f'在code_link中未找到GitHub链接: {code_links}', cve_id)
            return results
        
        logger.info(f"  找到{len(github_links)}个GitHub链接")
        
        # 处理每个GitHub链接
        for i, github_url in enumerate(github_links):
            print(f"    处理链接 {i+1}/{len(github_links)}: {github_url}")
            logger.info(f"  处理GitHub链接: {github_url}")
            
            repo = self.extract_repo_from_url(github_url)
            if not repo:
                self._log_error('invalid_repo_url', f'无法从URL提取仓库信息: {github_url}', cve_id, github_url)
                continue
            
            # 仅处理 github.com 链接（可选加速）
            if ONLY_GITHUB_CODELINK and 'github.com' not in github_url:
                continue

            # 尝试从issues和pull requests中找到相关commit
            commit_sha = self.find_commit_from_issue_or_pr(github_url, repo)
            if not commit_sha:
                # 根据URL类型给出更具体的错误信息
                if '/blob/' in github_url or '/tree/' in github_url:
                    self._log_error('file_link_not_commit', f'链接指向文件/目录而非修复commit: {github_url}', cve_id, github_url)
                elif 'oss-fuzz' in github_url and '.yaml' in github_url:
                    self._log_error('osv_no_fix_info', f'OSV文件中未找到修复commit信息: {github_url}', cve_id, github_url)
                else:
                    self._log_error('no_commit_found', f'无法找到相关提交: {github_url}', cve_id, github_url)
                continue
            
            # 若已处理过该 commit，直接跳过
            if SKIP_PROCESSED_COMMITS and commit_sha in getattr(self, 'processed_commit_shas', set()):
                logger.info(f"    Commit {commit_sha} 已处理（缓存命中），跳过")
                continue

            self._update_stats('total_commits')
            logger.info(f"    找到提交: {commit_sha}")
            
            try:
                # 获取提交文件，并记录项目开始处理时间，用于总时长控制
                import time as _time
                project_start_ts = _time.time()
                files = self.get_commit_files(repo, commit_sha)
                
                if not files:
                    self._log_error('no_js_files', f'提交中没有JavaScript文件: {repo}#{commit_sha}', cve_id, github_url)
                    continue
                
                logger.info(f"    找到{len(files)}个JavaScript文件")
                
                for file_info in files:
                    # 若在同一个项目处理超过阈值，跳过后续文件
                    if _time.time() - project_start_ts > PROJECT_PROCESS_TIMEOUT_SECONDS:
                        logger.warning(f"项目处理超时(>{PROJECT_PROCESS_TIMEOUT_SECONDS}s)，跳过后续处理: {repo}#{commit_sha}")
                        break
                    file_path = file_info['filename']
                    
                    # 获取修复前后的代码
                    before_content, after_content = self.get_before_after_code(repo, commit_sha, file_path)
                    
                    if before_content and after_content:
                        # 保存代码到本地文件
                        vulnerable_file_path = self.save_code_to_file(before_content, cve_id, repo, file_path, False)
                        fixed_file_path = self.save_code_to_file(after_content, cve_id, repo, file_path, True)
                        
                        # 下载完整项目（可配置，仅为第一个文件下载一次）
                        if DOWNLOAD_COMPLETE_PROJECTS and file_info == files[0]:
                            logger.info(f"    下载完整项目: {repo}")
                            vulnerable_project_path, fixed_project_path = self.download_complete_project(repo, commit_sha, cve_id)
                        else:
                            vulnerable_project_path, fixed_project_path = None, None
                        
                        # 确定项目类型（为性能默认关闭深度分析）
                        original_project_type = cve_data.get('project_type', 'Unknown')
                        if ENABLE_DEEP_CLASSIFICATION and original_project_type == 'Unknown':
                            logger.debug(f"      原始分类Unknown，启用深度分析...")
                            project_type = self.determine_project_type_enhanced(repo, file_path, before_content, after_content, cve_data)
                        else:
                            project_type = original_project_type
                        
                        # 确定漏洞类型
                        vulnerability_type = self.determine_vulnerability_type(cve_data)
                        
                        # 生成详细的推理过程
                        detailed_reasoning = self.generate_detailed_reasoning(
                            cve_data, vulnerability_type, file_path, before_content, after_content
                        )
                        
                        # 创建记录（字段名与js_cve_scraper.py保持一致）
                        record = {
                            'cve_id': cve_id,
                            'vulnerability_classification': vulnerability_type,
                            'cvss_score': cve_data.get('cvss_score', 'N/A'),
                            'severity': cve_data.get('severity', 'UNKNOWN'),
                            'publish_date': cve_data.get('publish_date', 'N/A'),
                            'summary': cve_data.get('summary', ''),
                            'code_link': github_url,
                            'project_name': repo,
                            'cwe_id': cve_data.get('cwe_id', 'N/A'),
                            'source': 'github_commit',
                            
                            # 扩展字段
                            'file_path': file_path,
                            'vulnerable_code_path': vulnerable_file_path or '',
                            'fixed_code_path': fixed_file_path or '',
                            'commit_sha': commit_sha,
                            'project_type': project_type,
                            'reasoning': detailed_reasoning,
                            
                            # 完整项目路径
                            'vulnerable_project_path': vulnerable_project_path or '',
                            'fixed_project_path': fixed_project_path or '',
                            
                            # 代码统计信息
                            'vulnerable_code_lines': len(before_content.split('\n')) if before_content else 0,
                            'fixed_code_lines': len(after_content.split('\n')) if after_content else 0,
                            'code_changes': file_info.get('additions', 0) + file_info.get('deletions', 0)
                        }
                        
                        results.append(record)
                        self._update_stats('successful_extractions')
                        logger.info(f"      成功提取代码: {file_path}")
                        
                    else:
                        self._log_error('code_fetch_failed', f'无法获取文件代码: {repo}:{file_path}', cve_id, github_url)
                
            except Exception as e:
                self._log_error('processing_error', f'处理仓库时出错: {str(e)}', cve_id, github_url)
                continue
        
        if results:
            logger.info(f"  CVE {cve_id} 处理完成，提取到{len(results)}个代码样本")
        else:
            self._update_stats('failed_extractions')
            logger.warning(f"  CVE {cve_id} 处理失败，未提取到任何代码样本")
        
        return results
    
    def find_commit_from_issue_or_pr(self, github_url, repo):
        """从issues或pull requests中找到相关的commit"""
        try:
            # 提取issue或PR编号
            if '/issues/' in github_url:
                issue_match = re.search(r'/issues/(\d+)', github_url)
                if issue_match:
                    issue_number = issue_match.group(1)
                    return self.get_commit_from_issue(repo, issue_number)
            
            elif '/pull/' in github_url:
                pr_match = re.search(r'/pull/(\d+)', github_url)
                if pr_match:
                    pr_number = pr_match.group(1)
                    return self.get_commit_from_pr(repo, pr_number)
            
            elif '/commit/' in github_url:
                commit_match = re.search(r'/commit/([a-f0-9]+)', github_url)
                if commit_match:
                    return commit_match.group(1)
            
            # 处理其他类型的GitHub链接
            elif '/blob/' in github_url or '/tree/' in github_url:
                logger.warning(f"链接指向文件或目录，不是代码修复commit: {github_url}")
                return None
                
            elif 'oss-fuzz' in github_url and '.yaml' in github_url:
                logger.info(f"检测到OSS-Fuzz漏洞描述文件，尝试从中提取修复信息: {github_url}")
                return self.extract_commit_from_osv_file(github_url, repo)
            
            else:
                logger.warning(f"未识别的GitHub链接格式: {github_url}")
                return None
            
        except Exception as e:
            print(f"Error finding commit from {github_url}: {e}")
        
        return None
    
    def extract_commit_from_osv_file(self, osv_url, repo):
        """从OSS-Fuzz OSV文件中提取修复commit信息（增强版）"""
        try:
            # 获取OSV YAML文件内容
            response = self.make_github_request(osv_url.replace('/blob/', '/raw/'))
            
            if not response or response.status_code != 200:
                logger.warning(f"无法获取OSV文件内容: {osv_url}")
                return None
            
            content = response.text
            logger.debug(f"OSV文件内容长度: {len(content)}")
            
            # 查找修复相关的commit SHA（更全面的模式）
            commit_patterns = [
                # 直接的commit引用
                r'fix[:\s]*([a-f0-9]{40})',  # fix: abc123...
                r'commit[:\s]*([a-f0-9]{40})',  # commit: abc123...
                r'sha[:\s]*([a-f0-9]{40})',  # sha: abc123...
                r'fixed[:\s]*([a-f0-9]{40})',  # fixed: abc123...
                r'patch[:\s]*([a-f0-9]{40})',  # patch: abc123...
                
                # GitHub URL中的commit
                r'github\.com/[^/]+/[^/]+/commit/([a-f0-9]{40})',
                r'github\.com/[^/]+/[^/]+/pull/\d+/commits/([a-f0-9]{40})',
                
                # YAML格式的commit
                r'commit:\s*([a-f0-9]{40})',
                r'fixed_version:\s*([a-f0-9]{40})',
                r'introduced:\s*([a-f0-9]{40})',
                
                # 任何40位十六进制字符串（作为最后的尝试）
                r'([a-f0-9]{40})',
            ]
            
            found_commits = []
            for pattern in commit_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    if match and len(match) == 40:  # 确保是40位SHA
                        found_commits.append(match)
            
            if found_commits:
                # 去重并返回第一个
                unique_commits = list(set(found_commits))
                commit_sha = unique_commits[0]
                logger.info(f"从OSV文件中找到修复commit: {commit_sha}")
                if len(unique_commits) > 1:
                    logger.debug(f"找到多个commit，使用第一个: {unique_commits}")
                return commit_sha
            
            # 如果没有找到commit SHA，尝试查找GitHub链接
            github_links = re.findall(r'https://github\.com/[^\s\)]+', content)
            for link in github_links:
                if '/commit/' in link:
                    commit_match = re.search(r'/commit/([a-f0-9]{40})', link)
                    if commit_match:
                        commit_sha = commit_match.group(1)
                        logger.info(f"从OSV文件的GitHub链接中找到commit: {commit_sha}")
                        return commit_sha
                elif '/pull/' in link:
                    # 尝试从PR中获取commit
                    logger.debug(f"OSV文件包含PR链接，可能需要进一步处理: {link}")
            
            # 最后的尝试：查找任何可能的修复信息
            if any(keyword in content.lower() for keyword in ['fix', 'patch', 'commit', 'sha']):
                logger.info(f"OSV文件包含修复关键词但未找到具体commit SHA")
            else:
                logger.info(f"OSV文件中未找到修复相关信息")
            
            return None
            
        except Exception as e:
            logger.error(f"解析OSV文件时出错 {osv_url}: {e}")
        return None
    
    def get_commit_from_issue(self, repo, issue_number):
        """从issue中获取相关的commit"""
        try:
            # 获取issue的timeline事件
            url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/timeline"
            response = self.make_github_request(url)
            
            if response and response.status_code == 200:
                timeline = response.json()
                
                # 查找commit相关的event
                for event in timeline:
                    if event.get('event') == 'cross-referenced' and 'commit_id' in event:
                        return event['commit_id']
                    elif event.get('event') == 'referenced' and 'commit_id' in event:
                        return event['commit_id']
            
            # 如果timeline中没有找到，尝试获取issue的comments
            url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
            response = self.make_github_request(url)
            
            if response and response.status_code == 200:
                comments = response.json()
                
                # 在comments中查找commit SHA
                for comment in comments:
                    body = comment.get('body', '')
                    commit_match = re.search(r'([a-f0-9]{40})', body)
                    if commit_match:
                        return commit_match.group(1)
            
        except Exception as e:
            print(f"Error getting commit from issue {issue_number}: {e}")
        
        return None
    
    def get_commit_from_pr(self, repo, pr_number):
        """从pull request中获取相关的commit"""
        try:
            # 获取PR的commits
            url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}/commits"
            response = self.make_github_request(url)
            
            if response and response.status_code == 200:
                commits = response.json()
                
                # 返回最新的commit
                if commits:
                    return commits[-1]['sha']
            
        except Exception as e:
            print(f"Error getting commit from PR {pr_number}: {e}")
        
        return None
    
    def determine_vulnerability_type(self, cve_data):
        """根据CVE信息确定漏洞类型（增强版）"""
        summary = cve_data.get('summary', '').lower()
        classification = cve_data.get('vulnerability_classification', '').lower()
        cwe_id = cve_data.get('cwe_id', '').lower()
        
        logger.debug(f"分析漏洞类型: summary={summary[:100]}, classification={classification}")
        
        # 基于关键词判断漏洞类型，返回详细信息
        if 'xss' in summary or 'cross-site scripting' in summary or 'cwe-79' in cwe_id:
            return 'Cross-site Scripting (XSS)'
        elif 'sql injection' in summary or 'sql' in summary or 'cwe-89' in cwe_id:
            return 'SQL Injection'
        elif 'prototype pollution' in summary or 'cwe-1321' in cwe_id:
            return 'Prototype Pollution'
        elif 'code injection' in summary or 'cwe-94' in cwe_id:
            return 'Code Injection'
        elif 'command injection' in summary or 'cwe-78' in cwe_id:
            return 'Command Injection'
        elif 'authentication bypass' in summary or 'cwe-287' in cwe_id:
            return 'Authentication Bypass'
        elif 'authorization bypass' in summary or 'cwe-862' in cwe_id:
            return 'Authorization Bypass'
        elif 'denial of service' in summary or 'dos' in summary or 'cwe-400' in cwe_id:
            return 'Denial of Service'
        elif 'path traversal' in summary or 'directory traversal' in summary or 'cwe-22' in cwe_id:
            return 'Path Traversal'
        elif 'csrf' in summary or 'cross-site request forgery' in summary or 'cwe-352' in cwe_id:
            return 'Cross-Site Request Forgery (CSRF)'
        elif 'buffer overflow' in summary or 'cwe-119' in cwe_id:
            return 'Buffer Overflow'
        elif 'information disclosure' in summary or 'cwe-200' in cwe_id:
            return 'Information Disclosure'
        elif classification and classification != 'unknown':
            return classification.title()
        else:
            return 'Unknown'

    def generate_detailed_reasoning(self, cve_data, vulnerability_type, file_path, code_before, code_after):
        """生成详细的推理过程"""
        cve_id = cve_data.get('cve_id', '')
        summary = cve_data.get('summary', '')
        severity = cve_data.get('severity', 'UNKNOWN')
        cvss_score = cve_data.get('cvss_score', 'N/A')
        
        reasoning_parts = []
        
        # 1. CVE基本信息
        reasoning_parts.append(f"根据CVE {cve_id}的分析，该漏洞属于{vulnerability_type}类型")
        
        # 2. 严重性信息
        if cvss_score != 'N/A':
            reasoning_parts.append(f"CVSS评分为{cvss_score}，严重性等级为{severity}")
        
        # 3. 文件路径分析
        file_ext = Path(file_path).suffix
        if file_ext in ['.js', '.jsx']:
            reasoning_parts.append("该文件为JavaScript文件")
        elif file_ext in ['.ts', '.tsx']:
            reasoning_parts.append("该文件为TypeScript文件")
        
        # 4. 代码变更分析
        if code_before and code_after:
            before_lines = len(code_before.split('\n'))
            after_lines = len(code_after.split('\n'))
            line_diff = after_lines - before_lines
            
            if line_diff > 0:
                reasoning_parts.append(f"修复过程中增加了{line_diff}行代码")
            elif line_diff < 0:
                reasoning_parts.append(f"修复过程中删除了{abs(line_diff)}行代码")
            else:
                reasoning_parts.append("修复过程中代码行数保持不变，主要是内容修改")
        
        # 5. 漏洞特征分析
        summary_lower = summary.lower()
        if 'input validation' in summary_lower:
            reasoning_parts.append("漏洞涉及输入验证不足")
        if 'sanitization' in summary_lower:
            reasoning_parts.append("漏洞涉及数据清理不当")
        if 'escape' in summary_lower:
            reasoning_parts.append("漏洞涉及转义处理不当")
        if 'filter' in summary_lower:
            reasoning_parts.append("漏洞涉及过滤机制缺陷")
        
        return "；".join(reasoning_parts) + "。"

    def print_statistics(self):
        """打印统计信息"""
        print("\n" + "=" * 60)
        print("📊 处理统计信息")
        print("=" * 60)
        
        stats = self.stats
        print(f"总计:")
        print(f"  - 处理的CVE数: {stats['processed_cves']}")
        print(f"  - 成功提取数: {stats['successful_extractions']}")
        print(f"  - 失败提取数: {stats['failed_extractions']}")
        print(f"  - 成功率: {(stats['successful_extractions'] / max(stats['processed_cves'], 1) * 100):.1f}%")
        
        print(f"\nGitHub API:")
        print(f"  - API请求数: {stats['api_requests']}")
        print(f"  - 限制命中数: {stats['rate_limit_hits']}")
        print(f"  - 找到的提交数: {stats['total_commits']}")
        print(f"  - 处理的文件数: {stats['total_files']}")
        print(f"  - 保存的文件数: {stats['saved_files']}")
        print(f"  - 下载的完整项目数: {stats['downloaded_projects']}")
        print(f"  - 项目下载失败数: {stats['project_download_errors']}")
        
        if self.errors:
            print(f"\n错误统计:")
            error_types = {}
            for error in self.errors:
                error_type = error['type']
                error_types[error_type] = error_types.get(error_type, 0) + 1
            
            for error_type, count in error_types.items():
                print(f"  - {error_type}: {count}")

def main():
    """主函数"""
    print("=" * 60)
    print("JavaScript漏洞数据集生成器 - 第二步")
    print("提取GitHub提交信息和源代码")
    print("=" * 60)
    
    # 检查输入文件
    input_file = "data/js_cve_dataset.csv"
    if not os.path.exists(input_file):
        print(f"❌ 输入文件不存在: {input_file}")
        print("请先运行第一步生成CVE数据")
        return
    
    # 读取CVE数据
    print(f"📖 读取CVE数据: {input_file}")
    try:
        df = pd.read_csv(input_file)
        print(f"✅ 成功加载 {len(df)} 条CVE记录")
    except Exception as e:
        print(f"❌ 读取CVE数据失败: {e}")
        return
    
    # 创建提取器
    print(f"🔧 初始化GitHub提取器...")
    extractor = GitHubCommitExtractor()
    extractor.stats['total_cves'] = len(df)
    
    # 处理CVE数据（增量写入模式）
    print(f"\n🔄 开始处理CVE数据（增量写入）...")

    # 增量写入：准备输出文件与去重索引
    output_file = "data/js_vulnerability_dataset.csv"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    existing_keys = set()
    processed_commit_shas = set()
    header_written = False
    baseline_written = 0
    if os.path.exists(output_file):
        try:
            existing_df = pd.read_csv(output_file)
            if not existing_df.empty:
                header_written = True
                # 用 commit_sha + file_path 作为幂等键，避免重复写入
                def _safe_str(v):
                    try:
                        return '' if pd.isna(v) else str(v)
                    except Exception:
                        return ''
                for _, r in existing_df.iterrows():
                    key = (_safe_str(r.get('commit_sha','')), _safe_str(r.get('file_path','')))
                    existing_keys.add(key)
                baseline_written = len(existing_df)
                if 'commit_sha' in existing_df.columns:
                    processed_commit_shas = set(existing_df['commit_sha'].dropna().astype(str).unique())
        except Exception:
            # 无法读取时，重新写表头
            header_written = False
    
    # 将已处理提交缓存注入提取器，供 process_cve_data 使用
    extractor.processed_commit_shas = processed_commit_shas

    start_time = datetime.now()
    
    new_written = 0

    # 子集范围（切片），便于加速调试或分布式跑
    end_index = len(df) if MAX_CVES is None else min(len(df), START_INDEX + int(MAX_CVES))
    sub_df = df.iloc[int(START_INDEX):int(end_index)]

    for index, row in sub_df.iterrows():
        cve_data = row.to_dict()
        cve_id = cve_data.get('cve_id', 'Unknown')
        
        print(f"\n处理CVE {index+1}/{len(df)}: {cve_id}")
        extractor._print_progress(index + 1, len(df), "总进度")
        
        results = extractor.process_cve_data(cve_data)

        # 增量写入：逐条去重-追加
        if results:
            import csv
            # 计算写入字段顺序（第一次写入时使用）
            fieldnames = list(results[0].keys())
            # 若已有文件但未写过表头（例如之前异常中断新文件为空），则写表头
            write_header_now = not header_written
            with open(output_file, 'a', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                if write_header_now:
                    writer.writeheader()
                    header_written = True
                for rec in results:
                    key = (str(rec.get('commit_sha','')), str(rec.get('file_path','')))
                    if key in existing_keys:
                        continue
                    writer.writerow(rec)
                    existing_keys.add(key)
                    new_written += 1
        
        # 定期显示统计信息
        processed_now = (index + 1)
        if processed_now % 5 == 0 or processed_now == len(sub_df):
            elapsed = datetime.now() - start_time
            rate = processed_now / max(elapsed.total_seconds(), 1e-6) * 60  # CVE/分钟
            print(f"  📈 已处理 {processed_now}/{len(sub_df)} 条CVE，累计记录 {len(existing_keys)}，本次新增 {new_written}")
            print(f"     处理速度: {rate:.1f} CVE/分钟，已用时: {elapsed}")
    
    # 增量模式下，末尾不再整体保存 all_results；仅输出统计和错误报告
    # 若需要，可在此重新读取CSV做汇总统计
    if os.path.exists(output_file):
        try:
            result_df = pd.read_csv(output_file)
            print(f"\n✅ 当前累计数据集: {output_file}")
            print(f"📊 数据集统计:")
            print(f"   - 总记录数: {len(result_df)}")
            if 'project_name' in result_df.columns:
                print(f"   - 涉及仓库数: {result_df['project_name'].nunique()}")
            if 'vulnerability_classification' in result_df.columns:
                print(f"   - 漏洞类型分布:")
                vuln_counts = result_df['vulnerability_classification'].value_counts()
                for vuln_type, count in vuln_counts.head(10).items():
                    print(f"     * {vuln_type}: {count}")
            if 'project_type' in result_df.columns:
                print(f"   - 项目类型分布:")
                project_counts = result_df['project_type'].value_counts()
                for proj_type, count in project_counts.items():
                    print(f"     * {proj_type}: {count}")
            if {'vulnerable_code_lines','fixed_code_lines','code_changes'} <= set(result_df.columns):
                print(f"   - 代码文件统计:")
                print(f"     * 平均漏洞代码行数: {result_df['vulnerable_code_lines'].mean():.1f}")
                print(f"     * 平均修复代码行数: {result_df['fixed_code_lines'].mean():.1f}")
                print(f"     * 平均代码变更数: {result_df['code_changes'].mean():.1f}")
        except Exception as e:
            print(f"⚠️  统计信息读取失败: {e}")

    # 保存错误报告
    if extractor.errors:
        error_file = "logs/extraction_errors.json"
        try:
            with open(error_file, 'w', encoding='utf-8') as f:
                json.dump(extractor.errors, f, ensure_ascii=False, indent=2)
            print(f"   - 错误报告已保存: {error_file}")
        except Exception as e:
            print(f"   - 警告：无法保存错误报告: {e}")
    
    # 打印详细统计
    extractor.print_statistics()
    
    total_time = datetime.now() - start_time
    print(f"\n⏱️  总处理时间: {total_time}")
    print("处理完成!")

if __name__ == "__main__":
    main() 