# Claude Code 漏洞检测系统使用手册

## 目录
1. [概述](#概述)
2. [安装与配置](#安装与配置)
3. [快速开始](#快速开始)
4. [功能详解](#功能详解)
5. [输出格式](#输出格式)
6. [高级用法](#高级用法)
7. [最佳实践](#最佳实践)
8. [常见问题](#常见问题)
9. [API参考](#api参考)

## 概述

Claude Code 漏洞检测系统是一个基于AI的代码安全审计工具，使用Anthropic的Claude模型来识别代码中的安全漏洞。该系统提供了智能的、上下文感知的安全分析，能够检测传统静态分析工具难以发现的复杂漏洞。

### 主要功能

- 🔍 **智能漏洞检测**: 基于AI的深度语义理解
- 📁 **目录扫描**: 支持对整个项目或指定目录进行扫描
- 🔄 **模型切换**: 支持多种Claude模型，平衡准确性和速度
- 📊 **多种输出格式**: JSON、表格、摘要三种输出格式
- ⚙️ **灵活配置**: 支持排除目录、自定义超时等选项
- 🎯 **低误报**: AI驱动的过滤减少噪音

### 支持的漏洞类型

- SQL注入、命令注入、XSS等注入攻击
- 身份验证和授权绕过
- 加密弱点和硬编码机密
- 路径遍历和文件操作漏洞
- 反序列化和代码执行漏洞
- 业务逻辑缺陷

## 安装与配置

### 系统要求

- Python 3.8+
- Claude Code CLI工具
- Anthropic API密钥

### 安装步骤

1. **安装Claude Code CLI**
   ```bash
   # 按照Anthropic官方文档安装Claude Code
   # https://docs.anthropic.com/en/docs/claude-code
   ```

2. **配置API密钥**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

3. **克隆项目**
   ```bash
   git clone https://github.com/anthropics/claude-code-security-review.git
   cd claude-code-security-review
   ```

4. **安装依赖**
   ```bash
   pip install -r claudecode/requirements.txt
   ```

5. **验证安装**
   ```bash
   python security_cli.py model validate
   ```

## 快速开始

### 基本扫描

扫描当前目录：
```bash
python security_cli.py scan .
```

扫描指定目录：
```bash
python security_cli.py scan /path/to/your/project
```

### 查看可用模型

```bash
python security_cli.py model list
```

### 切换模型

```bash
python security_cli.py model set claude-3-5-sonnet-20241022
```

### 保存结果

```bash
python security_cli.py scan . --output-file results.json
```

## 功能详解

### 1. 漏洞扫描功能

#### 基本语法
```bash
python security_cli.py scan <目标目录> [选项]
```

#### 常用选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--model` | 指定Claude模型 | claude-opus-4-1-20250805 |
| `--exclude-dirs` | 排除的目录列表 | [] |
| `--timeout` | 超时时间(分钟) | 20 |
| `--output-format` | 输出格式 | table |
| `--output-file` | 输出文件路径 | - |
| `--verbose` | 详细输出 | False |

#### 示例用法

**排除特定目录：**
```bash
python security_cli.py scan . --exclude-dirs node_modules .git __pycache__
```

**使用不同模型：**
```bash
python security_cli.py scan . --model claude-3-5-sonnet-20241022
```

**自定义超时时间：**
```bash
python security_cli.py scan . --timeout 30
```

**详细输出：**
```bash
python security_cli.py scan . --verbose
```

### 2. 模型管理功能

#### 列出可用模型
```bash
python security_cli.py model list

# JSON格式输出
python security_cli.py model list --format json
```

#### 切换模型
```bash
python security_cli.py model set claude-opus-4-1-20250805
```

#### 查看当前模型
```bash
python security_cli.py model current

# JSON格式输出
python security_cli.py model current --format json
```

#### 验证环境
```bash
python security_cli.py model validate
```

### 3. 可用的Claude模型

| 模型名称 | 特点 | 适用场景 |
|----------|------|----------|
| claude-opus-4-1-20250805 | 最新最强大 | 复杂项目，高精度要求 |
| claude-3-5-sonnet-20241022 | 平衡性能 | 日常扫描，平衡速度和精度 |
| claude-3-opus-20240229 | 强推理能力 | 复杂逻辑漏洞检测 |
| claude-3-sonnet-20240229 | 通用平衡 | 中等规模项目 |
| claude-3-haiku-20240307 | 快速响应 | 快速扫描，大型项目 |

## 输出格式

系统支持三种输出格式，详细说明请参考 [输出格式文档](docs/output_format.md)。

### JSON格式（机器可读）
```bash
python security_cli.py scan . --output-format json
```

### 表格格式（人类可读）
```bash
python security_cli.py scan . --output-format table
```

### 摘要格式（概览）
```bash
python security_cli.py scan . --output-format summary
```

## 高级用法

### 1. 批量扫描多个项目

创建批量扫描脚本：

```bash
#!/bin/bash
# batch_scan.sh

projects=(
    "/path/to/project1"
    "/path/to/project2" 
    "/path/to/project3"
)

for project in "${projects[@]}"; do
    echo "扫描项目: $project"
    python security_cli.py scan "$project" \
        --output-format json \
        --output-file "results_$(basename $project).json"
done
```

### 2. CI/CD集成

在GitHub Actions中使用：

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r claudecode/requirements.txt
    
    - name: Run security scan
      env:
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      run: |
        python security_cli.py scan . \
          --output-format json \
          --output-file security_results.json
    
    - name: Upload results
      uses: actions/upload-artifact@v3
      with:
        name: security-scan-results
        path: security_results.json
```

### 3. 结果后处理

使用jq处理JSON结果：

```bash
# 只显示高危漏洞
python security_cli.py scan . --output-format json | \
  jq '.findings[] | select(.severity=="HIGH")'

# 按严重性分组统计
python security_cli.py scan . --output-format json | \
  jq '.findings | group_by(.severity) | map({severity: .[0].severity, count: length})'

# 提取所有漏洞文件列表
python security_cli.py scan . --output-format json | \
  jq -r '.findings[].file' | sort | uniq
```

### 4. 性能优化

对于大型项目，可以采用以下策略：

**使用更快的模型：**
```bash
python security_cli.py scan . --model claude-3-haiku-20240307
```

**排除不必要的目录：**
```bash
python security_cli.py scan . --exclude-dirs \
  node_modules .git __pycache__ dist build target .venv venv
```

**增加超时时间：**
```bash
python security_cli.py scan . --timeout 60
```

## 最佳实践

### 1. 扫描策略

**开发阶段：**
- 使用快速模型进行日常检查
- 关注新引入的代码变更
- 集成到IDE或预提交钩子

**代码审查阶段：**
- 使用高精度模型
- 扫描完整的变更集
- 结合人工审查

**发布前检查：**
- 使用最强大的模型
- 全面扫描整个项目
- 设置更长的超时时间

### 2. 目录排除建议

建议排除以下类型的目录：

```bash
--exclude-dirs \
  node_modules \
  .git \
  __pycache__ \
  .pytest_cache \
  dist \
  build \
  target \
  .venv \
  venv \
  .env \
  logs \
  tmp \
  temp \
  vendor \
  third_party
```

### 3. 结果处理

**建立基线：**
```bash
# 首次扫描建立基线
python security_cli.py scan . --output-file baseline.json

# 后续对比变化
python security_cli.py scan . --output-file current.json
# 使用工具对比 baseline.json 和 current.json
```

**优先级处理：**
1. 首先处理HIGH严重性漏洞
2. 关注confidence > 0.9的发现
3. 优先处理认证和授权相关漏洞

## 常见问题

### Q1: 扫描速度太慢怎么办？

**A1:** 
- 使用更快的模型如`claude-3-haiku-20240307`
- 排除不必要的目录和文件
- 将大项目拆分为多个子目录分别扫描

### Q2: 出现大量误报怎么办？

**A2:**
- Claude模型已内置误报过滤，通常误报率较低
- 检查是否使用了合适的模型
- 对于特定项目，可以自定义过滤规则

### Q3: 如何处理超时问题？

**A3:**
```bash
# 增加超时时间
python security_cli.py scan . --timeout 60

# 或者拆分扫描
python security_cli.py scan src --timeout 30
python security_cli.py scan tests --timeout 30
```

### Q4: API密钥配置问题？

**A4:**
```bash
# 检查环境变量
echo $ANTHROPIC_API_KEY

# 临时设置
export ANTHROPIC_API_KEY="your-key"

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.bashrc
```

### Q5: 如何解读置信度分数？

**A5:**
- 0.9-1.0: 确定的漏洞，建议立即修复
- 0.8-0.9: 高可能性漏洞，建议优先处理
- 0.7-0.8: 需要进一步分析的可疑代码
- <0.7: 系统不会报告（过滤掉）

## API参考

### VulnerabilityScanner类

```python
from claudecode.vulnerability_scanner import VulnerabilityScanner

# 初始化扫描器
scanner = VulnerabilityScanner(
    claude_model='claude-opus-4-1-20250805',
    timeout_minutes=20
)

# 扫描目录
results = scanner.scan_directory(
    target_path=Path('/path/to/project'),
    exclude_dirs=['node_modules', '.git']
)
```

### ClaudeModelManager类

```python
from claudecode.model_manager import ClaudeModelManager

# 初始化模型管理器
manager = ClaudeModelManager()

# 获取当前模型
current_model = manager.get_current_model()

# 设置模型
success, message = manager.set_model('claude-3-5-sonnet-20241022')

# 列出可用模型
models = manager.list_models()
```

### 输出格式化

```python
from claudecode.vulnerability_scanner import print_scan_results

# 打印结果
print_scan_results(results, 'table')
print_scan_results(results, 'json')
print_scan_results(results, 'summary')
```

## 更新日志

### v1.0.0 (最新)
- 新增独立的目录扫描功能
- 添加模型切换支持
- 提供多种输出格式
- 完善的命令行界面
- 详细的文档和示例

## 许可证

本项目采用MIT许可证，详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎贡献代码和建议！请参考原项目的贡献指南。

## 支持

如有问题或建议，请：
1. 查看本文档的常见问题部分
2. 在GitHub上提交Issue
3. 参考Claude Code官方文档