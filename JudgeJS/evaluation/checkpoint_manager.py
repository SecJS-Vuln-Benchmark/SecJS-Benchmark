#!/usr/bin/env python3
"""
断点续传管理器
用于保存和恢复benchmark评估进度
"""

import os
import json
import pandas as pd
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import hashlib
import shutil

logger = logging.getLogger(__name__)

class CheckpointManager:
    """断点续传管理器（支持按模型分别管理）"""
    
    def __init__(self, checkpoint_dir: str = "evaluation/checkpoints", model_name: str = None, dataset_type: str = None):
        """
        初始化断点续传管理器 - 强制要求dataset_type参数
        
        Args:
            checkpoint_dir: 检查点文件存储目录
            model_name: 模型名称，用于创建独立的文件夹
            dataset_type: 数据集类型（必需），用于创建独立的文件
        """
        if not dataset_type:
            raise ValueError("dataset_type is required for CheckpointManager")
        
        self.checkpoint_dir = checkpoint_dir
        self.model_name = model_name
        self.dataset_type = dataset_type
        
        # 如果指定了模型名称，为该模型创建独立的目录
        if model_name:
            # 清理模型名称中的特殊字符，用于文件夹名
            safe_model_name = model_name.replace("/", "_").replace(":", "_").replace(" ", "_")
            self.model_dir = os.path.join(checkpoint_dir, "models", safe_model_name)
            self.results_dir = os.path.join(self.model_dir, "results")
            self.progress_dir = os.path.join(self.model_dir, "progress")
        else:
            # 兼容旧版本，使用全局目录
            self.model_dir = checkpoint_dir
            self.results_dir = os.path.join(checkpoint_dir, "results")
            self.progress_dir = os.path.join(checkpoint_dir, "progress")
        
        # 创建必要的目录
        os.makedirs(self.checkpoint_dir, exist_ok=True)
        os.makedirs(self.results_dir, exist_ok=True)
        os.makedirs(self.progress_dir, exist_ok=True)
        
        # 检查点文件路径 - 每个数据集独立文件
        self.progress_file = os.path.join(self.progress_dir, f"evaluation_progress_{self.dataset_type}.json")
        self.results_csv = os.path.join(self.results_dir, f"evaluation_results_{self.dataset_type}.csv")
        
        # 初始化进度跟踪
        self.progress = self._load_progress()
        
    def _load_progress(self) -> Dict[str, Any]:
        """加载现有进度"""
        if os.path.exists(self.progress_file):
            try:
                with open(self.progress_file, 'r', encoding='utf-8') as f:
                    progress = json.load(f)
                    logger.info(f"加载现有进度: {len(progress.get('completed_samples', []))} 个样本已完成")
                    return progress
            except Exception as e:
                logger.warning(f"加载进度文件失败: {e}")
        
        # 返回默认进度结构
        return {
            "evaluation_id": self._generate_evaluation_id(),
            "start_time": datetime.now().isoformat(),
            "dataset_type": "",
            "model_name": "",
            "total_samples": 0,
            "completed_samples": [],
            "failed_samples": [],
            "current_sample_index": 0,
            "last_updated": datetime.now().isoformat()
        }
    
    def _generate_evaluation_id(self) -> str:
        """生成唯一的评估ID"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"eval_{timestamp}"
    
    def start_evaluation(self, dataset_type: str, model_name: str, total_samples: int) -> str:
        """
        开始新的评估
        
        Args:
            dataset_type: 数据集类型
            model_name: 模型名称
            total_samples: 总样本数
            
        Returns:
            评估ID
        """
        self.progress.update({
            "evaluation_id": self._generate_evaluation_id(),
            "start_time": datetime.now().isoformat(),
            "dataset_type": dataset_type,
            "model_name": model_name,
            "total_samples": total_samples,
            "completed_samples": [],
            "failed_samples": [],
            "current_sample_index": 0,
            "last_updated": datetime.now().isoformat()
        })
        
        # 初始化结果CSV文件
        self._init_results_csv()
        
        # 保存进度
        self._save_progress()
        
        logger.info(f"开始新评估: {self.progress['evaluation_id']} - {dataset_type} - {model_name} - {total_samples} 样本")
        return self.progress['evaluation_id']
    
    def _init_results_csv(self):
        """初始化结果CSV文件"""
        if not os.path.exists(self.results_csv):
            # 创建结果CSV文件头
            columns = [
                'evaluation_id', 'dataset_type', 'model_name', 'sample_index',
                'sample_id', 'has_vulnerability_gt', 'has_vulnerability_pred',
                'vulnerability_type_gt', 'vulnerability_type_pred',
                'filename_pred', 'function_name_pred', 'vulnerable_lines_pred',
                # 相似度数值列（内部存储用，导出 detection 时会删除）
                'cosine_similarity', 'bert_similarity', 'rouge_score',
                # 相似度阈值判定标志（用于汇总相似率）
                'cosine_is_similar', 'bert_is_similar', 'rouge_is_similar',
                # project-level confusion
                'project_confusion', 'project_tp', 'project_tn', 'project_fp', 'project_fn',
                'project_precision', 'project_recall', 'project_f1',
                # function-level confusion
                'function_confusion', 'function_tp', 'function_tn', 'function_fp', 'function_fn',
                'function_precision', 'function_recall', 'function_f1',
                'llm_response', 'processing_time', 'status', 'error_message',
                'timestamp'
            ]
            
            df = pd.DataFrame(columns=columns)
            df.to_csv(self.results_csv, index=False, encoding='utf-8')
            logger.info(f"初始化结果CSV文件: {self.results_csv}")
    
    def save_sample_result(self, sample_data: Dict[str, Any], metrics: Dict[str, Any], 
                          llm_response: str, processing_time: float, status: str = "success", 
                          error_message: str = "") -> bool:
        """
        保存单个样本的评估结果
        
        Args:
            sample_data: 样本数据
            metrics: 评估指标
            llm_response: LLM响应
            processing_time: 处理时间
            status: 处理状态
            error_message: 错误信息
            
        Returns:
            是否保存成功
        """
        try:
            # 准备结果行数据
            # 过滤/清理原始响应（去除 raw_response 字段）
            def _sanitize_llm_response(resp: Any) -> str:
                try:
                    if isinstance(resp, str):
                        s = resp.strip()
                        # 若是JSON对象，尝试删除raw_response键
                        if s.startswith('{') and s.endswith('}'):
                            import json as _json
                            obj = _json.loads(s)
                            if isinstance(obj, dict) and 'raw_response' in obj:
                                obj.pop('raw_response', None)
                                return _json.dumps(obj, ensure_ascii=False)
                        # 非严格JSON时，做正则级别的清理：删除 raw_response 段与代码围栏
                        import re as _re
                        s = _re.sub(r'```[\s\S]*?```', '', s)
                        s = _re.sub(r'"raw_response"\s*:\s*"[\s\S]*?"\s*(,)?', '', s)
                        return s.strip()
                    elif isinstance(resp, dict):
                        obj = dict(resp)
                        obj.pop('raw_response', None)
                        import json as _json
                        return _json.dumps(obj, ensure_ascii=False)
                except Exception:
                    pass
                return str(resp)

            # 构造唯一样本键（index + id）
            sample_index_val = sample_data.get('index', 0)
            sample_id_val = sample_data.get('id', '')
            sample_key = f"{sample_index_val}_{sample_id_val}"

            # 处理并可选截断 llm_response 超长文本，原文另存
            MAX_RESP_LEN = 8000
            llm_resp_sanitized = _sanitize_llm_response(llm_response)
            raw_save_note = ''
            if isinstance(llm_resp_sanitized, str) and len(llm_resp_sanitized) > MAX_RESP_LEN:
                try:
                    raw_dir = os.path.join(self.results_dir, 'raw_responses')
                    os.makedirs(raw_dir, exist_ok=True)
                    safe_id = str(sample_id_val).replace('/', '_').replace(':', '_').replace(' ', '_')
                    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
                    raw_name = f"llm_raw_{sample_index_val}_{safe_id}_{ts}.txt"
                    raw_path = os.path.join(raw_dir, raw_name)
                    with open(raw_path, 'w', encoding='utf-8') as rf:
                        rf.write(str(llm_response))
                    rel_path = os.path.relpath(raw_path, start=self.results_dir)
                    raw_save_note = f" [TRUNCATED saved: {rel_path}]"
                except Exception:
                    pass
                llm_resp_sanitized = llm_resp_sanitized[:MAX_RESP_LEN] + raw_save_note

            result_row = {
                'evaluation_id': self.progress['evaluation_id'],
                'dataset_type': self.dataset_type or self.progress.get('dataset_type', ''),
                'model_name': self.progress['model_name'],
                'sample_index': sample_index_val,
                'sample_id': sample_id_val,
                'has_vulnerability_gt': sample_data.get('has_vulnerability', False),
                'has_vulnerability_pred': metrics.get('has_vulnerability_pred', False),
                'vulnerability_type_gt': sample_data.get('vulnerability_classification', ''),
                'vulnerability_type_pred': metrics.get('vulnerability_type_pred', ''),
                'filename_pred': metrics.get('filename_pred', ''),
                'function_name_pred': metrics.get('function_name_pred', ''),
                'vulnerable_lines_pred': str(metrics.get('vulnerable_lines_pred', [])),
                # similarity + flags
                'cosine_similarity': metrics.get('cosine_similarity', 0.0),
                'bert_similarity': metrics.get('bert_similarity', 0.0),
                'rouge_score': metrics.get('rouge_score', 0.0),
                'cosine_is_similar': metrics.get('cosine_is_similar', False),
                'bert_is_similar': metrics.get('bert_is_similar', False),
                'rouge_is_similar': metrics.get('rouge_is_similar', False),
                # project-level confusion
                'project_confusion': metrics.get('project_confusion', ''),
                'project_tp': metrics.get('project_tp', 0),
                'project_tn': metrics.get('project_tn', 0),
                'project_fp': metrics.get('project_fp', 0),
                'project_fn': metrics.get('project_fn', 0),
                'project_precision': metrics.get('project_precision', 0.0),
                'project_recall': metrics.get('project_recall', 0.0),
                'project_f1': metrics.get('project_f1', 0.0),
                # function-level confusion
                'function_confusion': metrics.get('function_confusion', ''),
                'function_tp': metrics.get('function_tp', 0),
                'function_tn': metrics.get('function_tn', 0),
                'function_fp': metrics.get('function_fp', 0),
                'function_fn': metrics.get('function_fn', 0),
                'function_precision': metrics.get('function_precision', 0.0),
                'function_recall': metrics.get('function_recall', 0.0),
                'function_f1': metrics.get('function_f1', 0.0),
                'llm_response': llm_resp_sanitized,
                'processing_time': processing_time,
                'status': status,
                'error_message': error_message,
                'timestamp': datetime.now().isoformat()
            }
            
            # 写入CSV前：去重同一 sample（以 sample_index + sample_id 判定），进行“替换式写入”
            header_df = pd.read_csv(self.results_csv, nrows=0)
            expected_cols = list(header_df.columns)
            normalized_row = {col: result_row.get(col, '') for col in expected_cols}
            new_row_df = pd.DataFrame([normalized_row], columns=expected_cols)
            import csv as _csv
            try:
                if os.path.exists(self.results_csv):
                    existing_df = pd.read_csv(self.results_csv)
                    if 'sample_index' in existing_df.columns and 'sample_id' in existing_df.columns and len(existing_df) > 0:
                        # 过滤掉相同 sample 的旧记录
                        mask = ~(
                            existing_df['sample_index'].astype(str).eq(str(sample_index_val)) &
                            existing_df['sample_id'].astype(str).eq(str(sample_id_val))
                        )
                        existing_df = existing_df[mask]
                    # 重新拼接并整体写回，保证列顺序
                    combined_df = pd.concat([existing_df, new_row_df], ignore_index=True)
                    combined_df = combined_df[expected_cols]
                    combined_df.to_csv(
                        self.results_csv,
                        mode='w',
                        header=True,
                        index=False,
                        encoding='utf-8',
                        quoting=_csv.QUOTE_ALL,
                        doublequote=True,
                        escapechar='\\',
                        lineterminator='\n'
                    )
                else:
                    # 不存在则创建
                    new_row_df.to_csv(
                        self.results_csv,
                        mode='w',
                        header=True,
                        index=False,
                        encoding='utf-8',
                        quoting=_csv.QUOTE_ALL,
                        doublequote=True,
                        escapechar='\\',
                        lineterminator='\n'
                    )
            except Exception:
                # 回退到追加模式（极端情况下）
                new_row_df.to_csv(
                    self.results_csv,
                    mode='a',
                    header=not os.path.exists(self.results_csv) or os.path.getsize(self.results_csv) == 0,
                    index=False,
                    encoding='utf-8',
                    quoting=_csv.QUOTE_ALL,
                    doublequote=True,
                    escapechar='\\',
                    lineterminator='\n'
                )
            
            # 更新进度
            # 更新进度：成功则从失败列表迁移至已完成；失败则从已完成迁移至失败；并去重
            completed_list = list(self.progress.get('completed_samples', []))
            failed_list = list(self.progress.get('failed_samples', []))
            # 先移除两边的重复项，确保唯一性
            completed_set = dict.fromkeys(completed_list).keys()
            failed_set = dict.fromkeys(failed_list).keys()
            completed_list = list(completed_set)
            failed_list = list(failed_set)

            # 迁移逻辑（以 index+version 作为等价类合并重复项）
            # 解析版本后缀（若无则对该 index 的所有记录做合并）
            sid = str(sample_id_val)
            if sid.endswith('_vulnerable'):
                version_suffix = '_vulnerable'
            elif sid.endswith('_fixed'):
                version_suffix = '_fixed'
            else:
                version_suffix = ''
            key_prefix = f"{sample_index_val}_"

            # 在更新前，先移除已完成/失败列表中对应 index+version 的任何旧键，避免重复
            def _not_same_idx_ver(k: str) -> bool:
                if not isinstance(k, str):
                    return True
                if not k.startswith(key_prefix):
                    return True
                if version_suffix and (not k.endswith(version_suffix)):
                    return True
                return False

            completed_list = [k for k in completed_list if _not_same_idx_ver(k)]
            failed_list = [k for k in failed_list if _not_same_idx_ver(k)]

            # 按当前状态写入
            if status == "success":
                if sample_key not in completed_list:
                    completed_list.append(sample_key)
            else:
                if sample_key not in failed_list:
                    failed_list.append(sample_key)

            self.progress['completed_samples'] = completed_list
            self.progress['failed_samples'] = failed_list
            
            self.progress['current_sample_index'] = sample_index_val + 1
            self.progress['last_updated'] = datetime.now().isoformat()
            
            # 保存进度
            self._save_progress()
            
            logger.info(f"保存样本结果: {sample_key} - {status}")
            return True
            
        except Exception as e:
            logger.error(f"保存样本结果失败: {e}")
            return False
    
    def is_sample_completed(self, sample_index: int, sample_id: str) -> bool:
        """
        检查样本是否已完成
        
        Args:
            sample_index: 样本索引
            sample_id: 样本ID
            
        Returns:
            是否已完成
        """
        sample_key = f"{sample_index}_{sample_id}"
        return sample_key in self.progress['completed_samples']
    
    def get_next_uncompleted_sample(self, dataset: pd.DataFrame) -> Optional[Dict[str, Any]]:
        """
        获取下一个未完成的样本
        
        Args:
            dataset: 数据集
            
        Returns:
            下一个未完成的样本，如果没有则返回None
        """
        for index, row in dataset.iterrows():
            sample_id = str(row.get('id', index))
            if not self.is_sample_completed(index, sample_id):
                return {
                    'index': index,
                    'id': sample_id,
                    'data': row.to_dict()
                }
        return None
    
    def get_progress_summary(self, include_errors_in_remaining: bool = False) -> Dict[str, Any]:
        """获取进度摘要"""
        # 基于 index+version 的成对口径去重统计
        completed_keys = list(dict.fromkeys(self.progress.get('completed_samples', [])))
        failed_keys = list(dict.fromkeys(self.progress.get('failed_samples', [])))

        def _pairs(keys: List[str]) -> set:
            out = set()
            for k in keys:
                if not isinstance(k, str):
                    continue
                try:
                    idx_str, rest = k.split('_', 1)
                    idx = int(idx_str)
                except Exception:
                    continue
                ver = 'vulnerable' if k.endswith('_vulnerable') else ('fixed' if k.endswith('_fixed') else '')
                if ver:
                    out.add((idx, ver))
            return out

        comp_pairs = _pairs(completed_keys)
        fail_pairs = _pairs(failed_keys)
        # 若同一 index+version 同时在失败与完成中，以失败为准
        comp_pairs = {p for p in comp_pairs if p not in fail_pairs}

        total_rows = int(self.progress.get('total_samples', 0) or 0)
        expanded_total_pairs = total_rows * 2
        completed = len(comp_pairs)
        failed = len(fail_pairs)

        if expanded_total_pairs <= 0:
            remaining = 0
            progress_pct = 0.0
        else:
            # 可选：将所有 error/failed 视为 remaining（用于“仅错误重跑”口径）
            if include_errors_in_remaining:
                remaining = max(expanded_total_pairs - completed, 0)
            else:
                remaining = max(expanded_total_pairs - completed - failed, 0)
            progress_pct = min(100.0, (completed / expanded_total_pairs) * 100.0)

        return {
            'evaluation_id': self.progress.get('evaluation_id', ''),
            'dataset_type': self.progress.get('dataset_type', ''),
            'model_name': self.progress.get('model_name', ''),
            'total_samples': total_rows,
            'completed_samples': completed,
            'failed_samples': failed,
            'remaining_samples': remaining,
            'progress_percentage': progress_pct,
            'start_time': self.progress.get('start_time', ''),
            'last_updated': self.progress.get('last_updated', ''),
            'include_errors_in_remaining': bool(include_errors_in_remaining),
        }
    
    def resume_evaluation(self, dataset_type: str, model_name: str) -> bool:
        """
        恢复评估
        
        Args:
            dataset_type: 数据集类型
            model_name: 模型名称
            
        Returns:
            是否成功恢复
        """
        # 查找匹配的进度文件
        if (self.progress['dataset_type'] == dataset_type and 
            self.progress['model_name'] == model_name):
            
            logger.info(f"恢复评估: {self.progress['evaluation_id']}")
            logger.info(f"已完成: {len(self.progress['completed_samples'])} 样本")
            logger.info(f"剩余: {self.progress['total_samples'] - len(self.progress['completed_samples'])} 样本")
            return True
        
        return False
    
    def _save_progress(self):
        """保存进度到文件"""
        try:
            with open(self.progress_file, 'w', encoding='utf-8') as f:
                json.dump(self.progress, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"保存进度失败: {e}")
    
    def cleanup_old_checkpoints(self, max_age_days: int = 7):
        """清理旧的检查点文件"""
        try:
            current_time = datetime.now()
            for filename in os.listdir(self.checkpoint_dir):
                filepath = os.path.join(self.checkpoint_dir, filename)
                if os.path.isfile(filepath):
                    file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
                    age_days = (current_time - file_time).days
                    
                    if age_days > max_age_days:
                        os.remove(filepath)
                        logger.info(f"清理旧检查点文件: {filename}")
        except Exception as e:
            logger.warning(f"清理旧检查点失败: {e}")
    
    def export_results(self, output_path: str = None) -> str:
        """
        导出评估结果
        
        Args:
            output_path: 输出路径，如果为None则使用默认路径
            
        Returns:
            导出文件路径
        """
        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            if self.model_name:
                safe_model_name = self.model_name.replace("/", "_").replace(":", "_").replace(" ", "_")
                output_path = f"evaluation_results_{self.progress['dataset_type']}_{safe_model_name}_{timestamp}.csv"
            else:
                output_path = f"evaluation_results_{self.progress['dataset_type']}_{timestamp}.csv"
        
        try:
            if os.path.exists(self.results_csv):
                shutil.copy2(self.results_csv, output_path)
                logger.info(f"结果已导出到: {output_path}")
                return output_path
            else:
                logger.warning("没有找到结果文件")
                return ""
        except Exception as e:
            logger.error(f"导出结果失败: {e}")
            return ""
    
    @staticmethod
    def get_all_model_checkpoints(checkpoint_dir: str = "evaluation/checkpoints") -> List[Dict[str, Any]]:
        """
        获取所有模型的检查点信息
        
        Args:
            checkpoint_dir: 检查点目录
            
        Returns:
            所有模型的检查点信息列表
        """
        models_dir = os.path.join(checkpoint_dir, "models")
        model_checkpoints = []
        
        if not os.path.exists(models_dir):
            return model_checkpoints
        
        try:
            for model_folder in os.listdir(models_dir):
                model_path = os.path.join(models_dir, model_folder)
                if os.path.isdir(model_path):
                    # 尝试加载该模型的进度
                    progress_file = os.path.join(model_path, "progress", "evaluation_progress.json")
                    if os.path.exists(progress_file):
                        try:
                            with open(progress_file, 'r', encoding='utf-8') as f:
                                progress = json.load(f)
                                model_checkpoints.append({
                                    "model_folder": model_folder,
                                    "model_name": progress.get("model_name", model_folder),
                                    "dataset_type": progress.get("dataset_type", ""),
                                    "total_samples": progress.get("total_samples", 0),
                                    "completed_samples": len(progress.get("completed_samples", [])),
                                    "failed_samples": len(progress.get("failed_samples", [])),
                                    "progress_percentage": (len(progress.get("completed_samples", [])) / progress.get("total_samples", 1) * 100) if progress.get("total_samples", 0) > 0 else 0,
                                    "last_updated": progress.get("last_updated", ""),
                                    "progress_file": progress_file,
                                    "results_file": os.path.join(model_path, "results", "evaluation_results.csv")
                                })
                        except Exception as e:
                            logger.warning(f"读取模型 {model_folder} 的进度失败: {e}")
        except Exception as e:
            logger.error(f"扫描模型检查点失败: {e}")
        
        return model_checkpoints
    
    @staticmethod
    def cleanup_model_checkpoints(checkpoint_dir: str = "evaluation/checkpoints", max_age_days: int = 7):
        """
        清理所有模型的旧检查点文件
        
        Args:
            checkpoint_dir: 检查点目录
            max_age_days: 最大保留天数
        """
        models_dir = os.path.join(checkpoint_dir, "models")
        if not os.path.exists(models_dir):
            return
        
        try:
            current_time = datetime.now()
            for model_folder in os.listdir(models_dir):
                model_path = os.path.join(models_dir, model_folder)
                if os.path.isdir(model_path):
                    # 检查模型文件夹的修改时间
                    folder_time = datetime.fromtimestamp(os.path.getmtime(model_path))
                    age_days = (current_time - folder_time).days
                    
                    if age_days > max_age_days:
                        shutil.rmtree(model_path)
                        logger.info(f"清理旧模型检查点: {model_folder} (已存在 {age_days} 天)")
        except Exception as e:
            logger.warning(f"清理模型检查点失败: {e}")
