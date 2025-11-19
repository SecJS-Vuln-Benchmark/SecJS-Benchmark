"""
辅助工具模块
"""

import os
import json
import logging
import re
from typing import List, Dict, Any, Optional
import pandas as pd
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def format_code_for_display(code: str, line_numbers: List[int] = None) -> str:
    """
    格式化代码以供显示，可以高亮特定行
    
    Args:
        code: 代码内容
        line_numbers: 需要高亮的行号列表
        
    Returns:
        格式化后的代码
    """
    if line_numbers is None:
        line_numbers = []
        
    lines = code.split('\n')
    result = []
    
    for i, line in enumerate(lines):
        line_num = i + 1
        if line_num in line_numbers:
            result.append(f"[VULNERABILITY] {line_num}: {line}")
        else:
            result.append(f"{line_num}: {line}")
    
    return '\n'.join(result)


def extract_json_from_response(response: str) -> Optional[Dict[str, Any]]:
    """
    从LLM响应中提取JSON数据
    
    Args:
        response: LLM响应
        
    Returns:
        提取的JSON数据，失败时返回None
    """
    # 尝试匹配Markdown格式的JSON代码块
    json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
    matches = re.findall(json_pattern, response)
    
    if matches:
        # 使用找到的第一个JSON代码块
        json_str = matches[0]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # 尝试从整个响应中解析JSON
    try:
        # 删除任何非JSON前缀和后缀
        cleaned_response = re.sub(r'^[^{]*', '', response)
        cleaned_response = re.sub(r'[^}]*$', '', cleaned_response)
        return json.loads(cleaned_response)
    except json.JSONDecodeError:
        pass
    
    return None


def prepare_summary_report(results_dir: str) -> pd.DataFrame:
    """
    准备评估结果汇总报告
    
    Args:
        results_dir: 结果目录路径
        
    Returns:
        汇总报告数据框
    """
    # 加载汇总结果
    summary_path = os.path.join(results_dir, "summary_results.json")
    if not os.path.exists(summary_path):
        logger.error("汇总结果文件不存在，无法生成报告")
        return pd.DataFrame()
        
    with open(summary_path, "r", encoding="utf-8") as f:
        results = json.load(f)
    
    # 准备数据框
    data = []
    
    for result in results:
        model_name = result["model_name"]
        binary_metrics = result["binary_metrics"]
        multi_class_metrics = result["multi_class_metrics"].get("macro_avg", {})
        
        data.append({
            "Model": model_name,
            "Binary Precision": binary_metrics["precision"],
            "Binary Recall": binary_metrics["recall"],
            "Binary F1": binary_metrics["f1"],
            "Binary Accuracy": binary_metrics["accuracy"],
            "Multi-class Precision": multi_class_metrics.get("precision", 0),
            "Multi-class Recall": multi_class_metrics.get("recall", 0),
            "Multi-class F1": multi_class_metrics.get("f1", 0)
        })
    
    return pd.DataFrame(data)


def compare_model_results(results_dir: str, model1: str, model2: str) -> Dict[str, Any]:
    """
    比较两个模型的评估结果
    
    Args:
        results_dir: 结果目录路径
        model1: 模型1名称
        model2: 模型2名称
        
    Returns:
        比较结果
    """
    model1_path = os.path.join(results_dir, f"{model1}_results.json")
    model2_path = os.path.join(results_dir, f"{model2}_results.json")
    
    if not os.path.exists(model1_path) or not os.path.exists(model2_path):
        logger.error(f"模型结果文件不存在，无法比较")
        return {}
    
    with open(model1_path, "r", encoding="utf-8") as f:
        model1_results = json.load(f)
        
    with open(model2_path, "r", encoding="utf-8") as f:
        model2_results = json.load(f)
    
    # 二分类指标差异
    binary_metrics_diff = {}
    for metric in ["precision", "recall", "f1", "accuracy"]:
        model1_value = model1_results["binary_metrics"][metric]
        model2_value = model2_results["binary_metrics"][metric]
        diff = model1_value - model2_value
        binary_metrics_diff[metric] = {
            "model1": model1_value,
            "model2": model2_value,
            "diff": diff,
            "better": model1 if diff > 0 else model2 if diff < 0 else "equal"
        }
    
    # 多分类指标差异（宏平均）
    multi_class_metrics_diff = {}
    for metric in ["precision", "recall", "f1"]:
        model1_value = model1_results["multi_class_metrics"]["macro_avg"][metric]
        model2_value = model2_results["multi_class_metrics"]["macro_avg"][metric]
        diff = model1_value - model2_value
        multi_class_metrics_diff[metric] = {
            "model1": model1_value,
            "model2": model2_value,
            "diff": diff,
            "better": model1 if diff > 0 else model2 if diff < 0 else "equal"
        }
    
    return {
        "model1": model1,
        "model2": model2,
        "binary_metrics_diff": binary_metrics_diff,
        "multi_class_metrics_diff": multi_class_metrics_diff
    }


def find_detection_failures(results_dir: str, model_name: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    找出检测失败的案例
    
    Args:
        results_dir: 结果目录路径
        model_name: 模型名称
        
    Returns:
        检测失败的案例
    """
    model_path = os.path.join(results_dir, f"{model_name}_results.json")
    
    if not os.path.exists(model_path):
        logger.error(f"模型结果文件不存在")
        return {}
    
    with open(model_path, "r", encoding="utf-8") as f:
        model_results = json.load(f)
    
    detailed_results = model_results["detailed_results"]
    
    # 找出假阳性和假阴性案例
    false_positives = []
    false_negatives = []
    
    for result in detailed_results:
        ground_truth = result["ground_truth"]["has_vulnerability"]
        prediction = result["prediction"]["has_vulnerability"]
        
        if ground_truth is False and prediction is True:
            false_positives.append(result)
        elif ground_truth is True and prediction is False:
            false_negatives.append(result)
    
    return {
        "false_positives": false_positives,
        "false_negatives": false_negatives
    }


if __name__ == "__main__":
    # 测试辅助功能
    code = """function displayUserInput(input) {
    document.getElementById('output').innerHTML = input;
}

function processForm() {
    const userInput = document.getElementById('userInput').value;
    displayUserInput(userInput);
}"""
    
    highlighted_code = format_code_for_display(code, [2])
    print(highlighted_code) 