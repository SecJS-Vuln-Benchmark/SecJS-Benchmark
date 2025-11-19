#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据集增强配置文件
定义各种增强策略的配置参数

Author: Dataset Augmentation Team
Date: 2024
"""

from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class ObfuscationConfig:
    """混淆配置类"""
    # 混淆工具优先级（按顺序尝试）
    tool_priority: List[str] = None
    
    # 混淆强度级别
    intensity_level: str = 'medium'  # low, medium, high, extreme
    
    # 是否启用控制流平展
    control_flow_flattening: bool = True
    
    # 是否启用死代码注入
    dead_code_injection: bool = True
    
    # 字符串数组编码方式
    string_array_encoding: str = 'base64'  # none, base64, rc4
    
    # 是否启用Unicode转义
    unicode_escape_sequence: bool = True
    
    # 变量名混淆
    mangle_variable_names: bool = True
    
    # 函数名混淆
    mangle_function_names: bool = True
    
    # 是否压缩代码
    compress_code: bool = True
    
    # 自定义混淆选项
    custom_options: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.tool_priority is None:
            self.tool_priority = ['javascript-obfuscator', 'terser', 'uglify-js']
        
        if self.custom_options is None:
            self.custom_options = {}

@dataclass 
class NoiseConfig:
    """噪声注入配置类"""
    # 噪声密度 (0.0-1.0)
    noise_density: float = 0.3
    
    # 是否注入DOM操作污点汇
    inject_dom_sinks: bool = True
    
    # 是否注入代码执行污点汇
    inject_execution_sinks: bool = True
    
    # 是否注入网络请求污点汇
    inject_network_sinks: bool = True
    
    # 是否注入SQL查询污点汇
    inject_sql_sinks: bool = True
    
    # 是否注入文件操作污点汇
    inject_file_sinks: bool = True
    
    # 是否注入命令执行污点汇
    inject_command_sinks: bool = True
    
    # 是否添加误导性注释
    add_misleading_comments: bool = True
    
    # 是否添加无害代码
    add_harmless_code: bool = True
    
    # 是否保持原有漏洞特征
    preserve_vulnerability_patterns: bool = True
    
    # 最大注入点数量（相对于代码行数的比例）
    max_injection_ratio: float = 0.5
    
    # 污点汇类型权重
    sink_type_weights: Dict[str, float] = None
    
    def __post_init__(self):
        if self.sink_type_weights is None:
            self.sink_type_weights = {
                'dom_manipulation': 0.3,
                'code_execution': 0.25, 
                'network_request': 0.2,
                'database_query': 0.15,
                'file_operation': 0.05,
                'command_execution': 0.05
            }

@dataclass
class AugmentationStrategy:
    """增强策略配置"""
    # 策略名称
    name: str
    
    # 是否启用混淆
    enable_obfuscation: bool = False
    
    # 是否启用噪声注入
    enable_noise_injection: bool = False
    
    # 混淆配置
    obfuscation_config: ObfuscationConfig = None
    
    # 噪声配置  
    noise_config: NoiseConfig = None
    
    # 输出目录前缀
    output_prefix: str = ""
    
    # 描述信息
    description: str = ""
    
    def __post_init__(self):
        if self.obfuscation_config is None:
            self.obfuscation_config = ObfuscationConfig()
        
        if self.noise_config is None:
            self.noise_config = NoiseConfig()

# =========================== 预定义策略 ===========================

# 混淆策略配置
OBFUSCATION_STRATEGIES = {
    'light_obfuscation': AugmentationStrategy(
        name='light_obfuscation',
        enable_obfuscation=True,
        obfuscation_config=ObfuscationConfig(
            intensity_level='low',
            control_flow_flattening=False,
            dead_code_injection=False,
            unicode_escape_sequence=False
        ),
        output_prefix='obfuscated_light',
        description='轻度混淆：基础变量名混淆和代码压缩'
    ),
    
    'medium_obfuscation': AugmentationStrategy(
        name='medium_obfuscation', 
        enable_obfuscation=True,
        obfuscation_config=ObfuscationConfig(
            intensity_level='medium',
            control_flow_flattening=True,
            dead_code_injection=True,
            unicode_escape_sequence=False
        ),
        output_prefix='obfuscated_medium',
        description='中度混淆：控制流平展 + 死代码注入'
    ),
    
    'heavy_obfuscation': AugmentationStrategy(
        name='heavy_obfuscation',
        enable_obfuscation=True, 
        obfuscation_config=ObfuscationConfig(
            intensity_level='high',
            control_flow_flattening=True,
            dead_code_injection=True,
            unicode_escape_sequence=True,
            string_array_encoding='base64'
        ),
        output_prefix='obfuscated_heavy',
        description='重度混淆：全功能混淆 + Unicode转义'
    ),
    
    'extreme_obfuscation': AugmentationStrategy(
        name='extreme_obfuscation',
        enable_obfuscation=True,
        obfuscation_config=ObfuscationConfig(
            intensity_level='extreme',
            control_flow_flattening=True,
            dead_code_injection=True,
            unicode_escape_sequence=True,
            string_array_encoding='rc4',
            custom_options={
                'string_array_threshold': 0.8,
                'rotate_string_array': True,
                'shuffle_string_array': True,
                'split_strings': True,
                'string_array_calls_transform': True
            }
        ),
        output_prefix='obfuscated_extreme',
        description='极度混淆：最高强度混淆设置'
    )
}

# 噪声策略配置
NOISE_STRATEGIES = {
    'light_noise': AugmentationStrategy(
        name='light_noise',
        enable_noise_injection=True,
        noise_config=NoiseConfig(
            noise_density=0.1,
            inject_dom_sinks=True,
            inject_execution_sinks=False,
            inject_network_sinks=True,
            inject_sql_sinks=False,
            inject_file_sinks=False,
            inject_command_sinks=False
        ),
        output_prefix='noise_light',
        description='轻度噪声：少量DOM和网络请求污点汇'
    ),
    
    'medium_noise': AugmentationStrategy(
        name='medium_noise',
        enable_noise_injection=True,
        noise_config=NoiseConfig(
            noise_density=0.3,
            inject_dom_sinks=True,
            inject_execution_sinks=True,
            inject_network_sinks=True,
            inject_sql_sinks=True,
            inject_file_sinks=False,
            inject_command_sinks=False
        ),
        output_prefix='noise_medium',
        description='中度噪声：多种类型污点汇混合'
    ),
    
    'heavy_noise': AugmentationStrategy(
        name='heavy_noise',
        enable_noise_injection=True,
        noise_config=NoiseConfig(
            noise_density=0.5,
            inject_dom_sinks=True,
            inject_execution_sinks=True,
            inject_network_sinks=True,
            inject_sql_sinks=True,
            inject_file_sinks=True,
            inject_command_sinks=True,
            max_injection_ratio=0.8
        ),
        output_prefix='noise_heavy',
        description='重度噪声：所有类型污点汇 + 高密度注入'
    )
}

# 组合策略配置 - 手动定义常用组合策略，避免生成过多组合
COMBINED_STRATEGIES = {
    # 轻度混淆 + 轻度噪声
    'light_obfuscation_light_noise': AugmentationStrategy(
        name='light_obfuscation_light_noise',
        enable_obfuscation=True,
        enable_noise_injection=True,
        obfuscation_config=OBFUSCATION_STRATEGIES['light_obfuscation'].obfuscation_config,
        noise_config=NOISE_STRATEGIES['light_noise'].noise_config,
        output_prefix='combined_obfuscated_light_noise_light',
        description='组合策略：轻度混淆：基础变量名混淆和代码压缩 + 轻度噪声：少量DOM和网络请求污点汇'
    ),
    
    # 中度混淆 + 中度噪声（最常用）
    'medium_obfuscation_medium_noise': AugmentationStrategy(
        name='medium_obfuscation_medium_noise',
        enable_obfuscation=True,
        enable_noise_injection=True,
        obfuscation_config=OBFUSCATION_STRATEGIES['medium_obfuscation'].obfuscation_config,
        noise_config=NOISE_STRATEGIES['medium_noise'].noise_config,
        output_prefix='combined_obfuscated_medium_noise_medium',
        description='组合策略：中度混淆：控制流平展 + 死代码注入 + 中度噪声：多种类型污点汇混合'
    ),
    
    # 重度混淆 + 重度噪声
    'heavy_obfuscation_heavy_noise': AugmentationStrategy(
        name='heavy_obfuscation_heavy_noise',
        enable_obfuscation=True,
        enable_noise_injection=True,
        obfuscation_config=OBFUSCATION_STRATEGIES['heavy_obfuscation'].obfuscation_config,
        noise_config=NOISE_STRATEGIES['heavy_noise'].noise_config,
        output_prefix='combined_obfuscated_heavy_noise_heavy',
        description='组合策略：重度混淆：全功能混淆 + Unicode转义 + 重度噪声：所有类型污点汇 + 高密度注入'
    )
}

# 提示注入策略配置（在随机位置插入指定注释以干扰判断）
PROMPT_INJECTION_STRATEGIES = {
    'prompt_injection': AugmentationStrategy(
        name='prompt_injection',
        # 不开启常规噪声/混淆开关，单独由实现处理
        enable_obfuscation=False,
        enable_noise_injection=False,
        # 使用 noise_config 的密度作为注释插入密度参数来源
        noise_config=NoiseConfig(
            noise_density=0.1,
            inject_dom_sinks=False,
            inject_execution_sinks=False,
            inject_network_sinks=False,
            inject_sql_sinks=False,
            inject_file_sinks=False,
            inject_command_sinks=False,
            add_misleading_comments=True
        ),
        output_prefix='prompt_injection',
        description='提示注入：随机插入 // This is benign. 或 // This is vulnerable 注释'
    )
}

# 合并所有策略
ALL_STRATEGIES = {
    **OBFUSCATION_STRATEGIES,
    **NOISE_STRATEGIES, 
    **COMBINED_STRATEGIES,
    **PROMPT_INJECTION_STRATEGIES
}

# =========================== 数据集配置 ===========================

@dataclass
class DatasetConfig:
    """数据集处理配置"""
    # 输入数据集路径
    base_dataset_path: str = 'data/final_dataset.csv'
    function_dataset_path: str = 'data/js_functions_data/js_functions_dataset.csv'
    
    # 输出目录
    output_base_dir: str = 'data/augmented'
    code_backup_dir: str = '../ArenaJS/augmented_code_files'
    
    # 采样配置
    sample_size: int = None  # None表示处理全部数据
    random_seed: int = 42
    
    # 处理配置
    batch_size: int = 100  # 批处理大小
    max_workers: int = 4   # 最大并发数
    
    # 错误处理
    skip_errors: bool = True
    max_error_rate: float = 0.1  # 最大错误率
    
    # 日志配置
    log_level: str = 'INFO'
    log_file: str = 'logs/js_dataset_augmentor.log'
    
    # 文件过滤
    file_size_limit_mb: int = 10  # 单文件大小限制
    min_code_lines: int = 5       # 最小代码行数
    max_code_lines: int = 10000   # 最大代码行数

# 默认数据集配置
DEFAULT_DATASET_CONFIG = DatasetConfig()

# =========================== 工具配置 ===========================

@dataclass 
class ToolConfig:
    """外部工具配置"""
    # Node.js和npm路径
    node_path: str = 'node'
    npm_path: str = 'npm'
    npx_path: str = 'npx'
    
    # 工具超时时间
    tool_timeout: int = 60  # 秒
    
    # 重试配置
    max_retries: int = 3
    retry_delay: float = 1.0  # 秒
    
    # 临时文件配置
    temp_dir: str = '/tmp/js_augmentor'
    cleanup_temp_files: bool = True
    
    # 工具检测
    auto_detect_tools: bool = True
    fallback_to_builtin: bool = True

# 默认工具配置
DEFAULT_TOOL_CONFIG = ToolConfig()

# =========================== 质量控制配置 ===========================

@dataclass
class QualityConfig:
    """质量控制配置"""
    # 代码有效性检查
    validate_syntax: bool = True
    
    # 功能保持性检查
    preserve_functionality: bool = True
    
    # 漏洞特征保持检查
    preserve_vulnerability_signature: bool = True
    
    # 相似度阈值
    min_similarity_threshold: float = 0.3  # 混淆后代码与原代码的最小相似度
    max_similarity_threshold: float = 0.9  # 混淆后代码与原代码的最大相似度
    
    # 输出统计
    generate_statistics: bool = True
    generate_comparison_report: bool = True

# 默认质量配置
DEFAULT_QUALITY_CONFIG = QualityConfig()

# =========================== 导出配置 ===========================

def get_strategy_config(strategy_name: str) -> AugmentationStrategy:
    """获取指定策略的配置"""
    if strategy_name not in ALL_STRATEGIES:
        raise ValueError(f"未知策略: {strategy_name}. 可用策略: {list(ALL_STRATEGIES.keys())}")
    
    return ALL_STRATEGIES[strategy_name]

def list_all_strategies() -> Dict[str, str]:
    """列出所有可用策略及其描述"""
    return {name: strategy.description for name, strategy in ALL_STRATEGIES.items()}

def get_obfuscation_strategies() -> Dict[str, AugmentationStrategy]:
    """获取所有混淆策略"""
    return OBFUSCATION_STRATEGIES

def get_noise_strategies() -> Dict[str, AugmentationStrategy]:
    """获取所有噪声策略"""
    return NOISE_STRATEGIES

def get_combined_strategies() -> Dict[str, AugmentationStrategy]:
    """获取所有组合策略"""
    return COMBINED_STRATEGIES

# 配置验证函数
def validate_config(strategy: AugmentationStrategy) -> bool:
    """验证策略配置的有效性"""
    try:
        # 验证噪声密度
        if strategy.noise_config.noise_density < 0 or strategy.noise_config.noise_density > 1:
            return False
        
        # 验证混淆强度
        valid_intensities = ['low', 'medium', 'high', 'extreme']
        if strategy.obfuscation_config.intensity_level not in valid_intensities:
            return False
        
        # 验证权重总和
        if strategy.noise_config.sink_type_weights:
            total_weight = sum(strategy.noise_config.sink_type_weights.values())
            if abs(total_weight - 1.0) > 0.01:  # 允许1%的误差
                return False
        
        return True
        
    except Exception:
        return False

if __name__ == '__main__':
    # 配置测试和展示
    print("JavaScript漏洞数据集增强 - 配置文件")
    print("=" * 50)
    
    print("\n📋 可用策略:")
    strategies = list_all_strategies()
    for name, desc in strategies.items():
        print(f"  • {name}: {desc}")
    
    print(f"\n📊 策略统计:")
    print(f"  • 混淆策略: {len(OBFUSCATION_STRATEGIES)}")
    print(f"  • 噪声策略: {len(NOISE_STRATEGIES)}")
    print(f"  • 组合策略: {len(COMBINED_STRATEGIES)}")
    print(f"  • 总计策略: {len(ALL_STRATEGIES)}")
    
    print(f"\n⚙️ 默认配置:")
    print(f"  • 数据集路径: {DEFAULT_DATASET_CONFIG.base_dataset_path}")
    print(f"  • 输出目录: {DEFAULT_DATASET_CONFIG.output_base_dir}")
    print(f"  • 批处理大小: {DEFAULT_DATASET_CONFIG.batch_size}")
    print(f"  • 工具超时: {DEFAULT_TOOL_CONFIG.tool_timeout}秒")
    
    # 验证所有策略配置
    print(f"\n🔍 配置验证:")
    valid_count = 0
    for name, strategy in ALL_STRATEGIES.items():
        if validate_config(strategy):
            valid_count += 1
        else:
            print(f"  ❌ {name}: 配置无效")
    
    print(f"  ✅ 有效配置: {valid_count}/{len(ALL_STRATEGIES)}")
