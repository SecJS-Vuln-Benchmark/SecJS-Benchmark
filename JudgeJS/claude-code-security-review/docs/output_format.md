# Claude Code 漏洞检测系统输出格式说明

## 概述

Claude Code 漏洞检测系统支持多种输出格式，以满足不同使用场景的需求。本文档详细说明了各种输出格式的结构和内容。

## 输出格式类型

系统支持以下三种主要输出格式：

1. **JSON格式** - 机器可读，适合程序处理和API集成
2. **表格格式** - 人类可读，适合命令行查看
3. **摘要格式** - 简洁概览，适合快速了解结果

## JSON格式输出

### 基本结构

```json
{
  "findings": [
    {
      "file": "path/to/vulnerable_file.py",
      "line": 42,
      "severity": "HIGH",
      "category": "sql_injection", 
      "description": "用户输入未经参数化就传递到SQL查询",
      "exploit_scenario": "攻击者可以通过使用SQL注入载荷操纵参数来提取数据库内容",
      "recommendation": "使用参数化查询或预准备语句",
      "confidence": 0.95
    }
  ],
  "analysis_summary": {
    "files_reviewed": 150,
    "high_severity": 2,
    "medium_severity": 5,
    "low_severity": 3,
    "review_completed": true
  },
  "filtering_summary": {
    "total_original_findings": 15,
    "excluded_findings": 5,
    "kept_findings": 10,
    "filter_analysis": {},
    "excluded_findings_details": []
  }
}
```

### 字段详细说明

#### findings 数组
每个发现包含以下字段：

- **file** (string): 漏洞所在的文件路径，相对于扫描根目录
- **line** (integer): 漏洞所在的行号，-1表示整个文件
- **severity** (string): 漏洞严重性等级
  - `HIGH`: 高危，直接可利用的漏洞
  - `MEDIUM`: 中危，需要特定条件但有重大影响
  - `LOW`: 低危，防御深度问题或较低影响
- **category** (string): 漏洞类别，如：
  - `sql_injection`: SQL注入
  - `command_injection`: 命令注入
  - `xss`: 跨站脚本攻击
  - `path_traversal`: 路径遍历
  - `hardcoded_secret`: 硬编码机密
  - `auth_bypass`: 身份验证绕过
  - `privilege_escalation`: 权限提升
  - `crypto_weakness`: 加密弱点
- **description** (string): 漏洞的简短描述
- **exploit_scenario** (string): 具体的攻击场景和利用方法
- **recommendation** (string): 修复建议
- **confidence** (float): 置信度分数 (0.0-1.0)
  - 0.9-1.0: 确定的利用路径
  - 0.8-0.9: 清晰的漏洞模式
  - 0.7-0.8: 需要特定条件的可疑模式

#### analysis_summary 对象
扫描过程的统计信息：

- **files_reviewed** (integer): 已审查的文件数量
- **high_severity** (integer): 高危漏洞数量
- **medium_severity** (integer): 中危漏洞数量  
- **low_severity** (integer): 低危漏洞数量
- **review_completed** (boolean): 是否完成完整审查

#### filtering_summary 对象（可选）
过滤统计信息：

- **total_original_findings** (integer): 原始发现总数
- **excluded_findings** (integer): 被排除的发现数量
- **kept_findings** (integer): 保留的发现数量
- **excluded_findings_details** (array): 被排除发现的详细信息

### 示例完整JSON输出

```json
{
  "findings": [
    {
      "file": "src/auth/login.py",
      "line": 45,
      "severity": "HIGH",
      "category": "sql_injection",
      "description": "用户名参数直接拼接到SQL查询中，未进行参数化",
      "exploit_scenario": "攻击者可以在用户名字段输入SQL注入载荷如 \"admin'; DROP TABLE users; --\" 来执行任意SQL命令",
      "recommendation": "使用参数化查询：cursor.execute('SELECT * FROM users WHERE username = %s', (username,))",
      "confidence": 0.92
    },
    {
      "file": "src/utils/file_handler.py", 
      "line": 23,
      "severity": "MEDIUM",
      "category": "path_traversal",
      "description": "文件路径未经验证直接传递给open()函数",
      "exploit_scenario": "攻击者可以使用../../../etc/passwd等路径遍历序列来读取系统敏感文件",
      "recommendation": "使用os.path.realpath()和os.path.commonpath()验证路径在允许的目录内",
      "confidence": 0.85
    }
  ],
  "analysis_summary": {
    "files_reviewed": 27,
    "high_severity": 1,
    "medium_severity": 1, 
    "low_severity": 0,
    "review_completed": true
  }
}
```

## 表格格式输出

表格格式提供人类友好的命令行显示：

```
漏洞扫描结果:
================================================================================

1. 文件: src/auth/login.py
   行号: 45
   严重性: HIGH
   类别: sql_injection
   描述: 用户名参数直接拼接到SQL查询中，未进行参数化
   建议: 使用参数化查询：cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
   置信度: 0.92
   利用场景: 攻击者可以在用户名字段输入SQL注入载荷如 "admin'; DROP TABLE users; --" 来执行任意SQL命令

2. 文件: src/utils/file_handler.py
   行号: 23
   严重性: MEDIUM
   类别: path_traversal
   描述: 文件路径未经验证直接传递给open()函数
   建议: 使用os.path.realpath()和os.path.commonpath()验证路径在允许的目录内
   置信度: 0.85
   利用场景: 攻击者可以使用../../../etc/passwd等路径遍历序列来读取系统敏感文件
```

## 摘要格式输出

摘要格式提供简洁的统计信息：

```
扫描摘要:
========================================
已审查文件: 27
高危漏洞: 1
中危漏洞: 1
低危漏洞: 0
总计发现: 2
扫描完成: 是
```

## 输出文件保存

### JSON文件保存
当指定 `--output-file result.json` 时，JSON格式的结果会保存到文件：

```bash
python security_cli.py scan /path/to/project --output-file result.json
```

### 其他格式文件保存
表格和摘要格式也可以保存到文件：

```bash
python security_cli.py scan /path/to/project --output-format table --output-file result.txt
```

## 错误输出格式

当扫描失败时，系统会输出错误信息：

```json
{
  "error": "扫描过程中发生错误: Claude Code执行失败"
}
```

## 使用建议

### 选择合适的输出格式

1. **自动化处理**: 使用JSON格式，便于解析和集成
2. **人工审查**: 使用表格格式，便于阅读和分析
3. **快速概览**: 使用摘要格式，快速了解整体情况

### 输出重定向和处理

```bash
# 保存JSON结果并用jq美化显示
python security_cli.py scan . --output-format json | jq .

# 只显示高危漏洞
python security_cli.py scan . --output-format json | jq '.findings[] | select(.severity=="HIGH")'

# 统计各类漏洞数量
python security_cli.py scan . --output-format json | jq '.findings | group_by(.category) | map({category: .[0].category, count: length})'
```

## 退出码

系统使用以下退出码表示扫描结果：

- **0**: 扫描成功，未发现高危漏洞
- **1**: 扫描成功，但发现高危漏洞
- **2**: 配置错误或扫描失败

这样可以在脚本中根据退出码决定后续操作：

```bash
if python security_cli.py scan .; then
    echo "扫描通过，未发现高危漏洞"
else
    echo "发现高危漏洞或扫描失败"
    exit 1
fi
```