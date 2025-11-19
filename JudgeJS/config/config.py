"""
配置文件，用于存储项目设置
"""

import os

# 数据集相关配置
DATA_CONFIG = {
    "raw_data_dir": "data/raw",
    "processed_data_dir": "data/processed",
    "github_token": "",  # 需要填入GitHub Token
    "max_files_per_repo": 50,
    "max_repos": 10,
    "timeout": 30,
    "vuln_types": [
        "XSS",
        "SQL_Injection",
        "Command_Injection",
        "Path_Traversal",
        "Prototype_Pollution",
        "Insecure_Deserialization",
        "CSRF",
        "SSRF",
        "JWT_Vulnerabilities",
        "NoSQL_Injection"
    ],
    # 新增：支持的数据集类型
        "dataset_types": {
        "original": {
            "name": "原始数据集",
            "path": "../ArenaJS/data/original_dataset.csv",
            "projects_dir": "../ArenaJS/projects",
            "description": "未经处理的原始JavaScript漏洞数据集"
        },
        "obfuscated": {
            "name": "混淆数据集",
            "path": "../ArenaJS/data/obfuscated_dataset.csv",
            "projects_dir": "../ArenaJS/augmented_projects/obfuscated",
            "description": "经过代码混淆处理的数据集，用于测试模型对混淆代码的检测能力"
        },
        "noise": {
            "name": "噪声数据集",
            "path": "../ArenaJS/data/noise_dataset.csv",
            "projects_dir": "../ArenaJS/augmented_projects/noise",
            "description": "注入污点汇但无污点源的噪声数据集，用于测试模型误判率"
        },
        "noise_obfuscated": {
            "name": "噪声+混淆数据集",
            "path": "../ArenaJS/data/noise_obfuscated_dataset.csv",
            "projects_dir": "../ArenaJS/augmented_projects/noise_obfuscated",
            "description": "同时包含噪声注入和代码混淆的组合数据集，用于综合鲁棒性测试"
        },
        "prompt_injection": {
            "name": "提示注入数据集",
            "path": "../ArenaJS/data/prompt_injection_dataset.csv",
            "projects_dir": "../ArenaJS/augmented_projects/prompt_injection",
            "description": "在随机位置插入注释以干扰模型判断的数据集"
        }
    },
    # 默认使用的数据集类型
    "default_dataset_type": "original"
}

# 评估相关配置
EVAL_CONFIG = {
    "output_dir": "evaluation/results",
    "metrics": ["precision", "recall", "f1", "accuracy"],
    "split_ratio": {
        "train": 0.7,
        "test": 0.2,
        "val": 0.1
    }
}

# LLM相关配置
LLM_CONFIG = {
    "api_base": "https://sg.uiuiapi.com/v1",
    "api_key": os.environ.get("OPENAI_API_KEY", ""),
    "timeout": 60,
    "max_retries": 3,
    "temperature": 0.0,
    "models": [
        {
            "name": "deepseek-chat",
            "api_base": "https://sg.uiuiapi.com/v1",
            "api_key": "sk-twSzMg0U0sTIAZNbs6cI71dxcIVl9cCCNIYUA1K94xBOYOOs",
            "max_tokens": 4096
        },
        {
            "name": "deepseek-ai/DeepSeek-V3.1",
            "api_base": "https://sg.uiuiapi.com/v1",  # 可为此模型单独设置
            "api_key": "sk-twSzMg0U0sTIAZNbs6cI71dxcIVl9cCCNIYUA1K94xBOYOOs",  # ModelScope Token
            "max_tokens": 4096
        },
        {

            "api_base": "https://api-inference.modelscope.cn/v1",  # 可为此模型单独设置
            "api_key": "ms-70bfcba6-6225-4049-9f52-d1a017c4259c",  # 使用相同的ModelScope Token进行测试
            "max_tokens": 4096
        },
        {
            "name": "gpt-4",
            "api_base": "https://api.openai.com/v1",  # 可为此模型单独设置
            "api_key": "",  # 需要填入API Key
            "max_tokens": 8192
        }
    ]
}


# 语义相似度与共识评估阈值配置
SIMILARITY_CONFIG = {
    # Rouge-L F1 判定阈值
    "rouge_threshold": 0.34,
    # TF-IDF 余弦相似度阈值
    "cosine_threshold": 0.84,
    # SBERT 相似度缩放与阈值（cos*scale）
    "bert_scale": 5.0,
    # 若需修改，亦可通过环境变量 BERT_SIMILARITY_THRESHOLD 覆盖
    "bert_threshold": float(os.environ.get("BERT_SIMILARITY_THRESHOLD", "3.5")),
}

CONSENSUS_CONFIG = {
    # 多模型共识阈值 Cons(x) >= theta 视为真实漏洞
    "consensus_threshold": float(os.environ.get("CONSENSUS_THRESHOLD", "0.8"))
}

# CWE 等价类分组（同类近似CWE命中即视为类型匹配），可按需扩充
CWE_EQUIVALENCE_GROUPS = {
    # XSS 家族（跨站脚本）
    # CAPEC: Cross-Site Scripting -> https://capec.mitre.org/data/definitions/63.html
    "xss": [
        "CWE-79",  # Cross-site Scripting (XSS)
        "CWE-80",  # Improper Neutralization of Script-Related HTML Tags
        "CWE-83",  # Improper Neutralization of Script in Attributes (XSS)
    ],
    # SQL 注入
    # CAPEC: SQL Injection -> https://capec.mitre.org/data/definitions/66.html
    "sqli": [
        "CWE-89",  # SQL Injection
        "CWE-564", # SQL Injection: Hibernate (framework-specific)
    ],
    # NoSQL 注入
    "nosqli": [
        "CWE-943", # Improper Neutralization of Special Elements in Data Query Language
    ],
    # LDAP 注入
    "ldap-injection": [
        "CWE-90",
    ],
    # CSRF（跨站请求伪造）
    "csrf": [
        "CWE-352",
    ],
    # 路径遍历/文件路径控制
    # CAPEC: Path Traversal -> https://capec.mitre.org/data/definitions/126.html
    "path-traversal": [
        "CWE-22",  # Path Traversal
        "CWE-23",  # Relative Path Traversal
        "CWE-36",  # Absolute Path Traversal
        "CWE-73",  # External Control of File Name or Path
    ],
    # 命令注入（系统命令）
    # CAPEC: OS Command Injection -> https://capec.mitre.org/data/definitions/248.html
    "cmd-injection": [
        "CWE-78",  # OS Command Injection
        "CWE-77",  # Command Injection
    ],
    # 代码注入/动态执行
    "code-injection": [
        "CWE-94",  # Code Injection
        "CWE-95",  # Improper Neutralization in Dynamically Evaluated Code
        "CWE-97",  # Improper Neutralization in Server-Side Includes
        "CWE-96",  # Static Code Injection (directives in statically saved code)
    ],
    # SSRF（服务端请求伪造）
    "ssrf": [
        "CWE-918",
    ],
    # 模板注入 / 表达式注入
    "template-injection": [
        "CWE-917",  # Expression Language Injection
    ],
    # 反序列化问题
    "deserialization": [
        "CWE-502",
    ],
    # 原型污染（JS 生态）
    "prototype-pollution": [
        "CWE-1321",
    ],
    # 开放重定向
    "open-redirect": [
        "CWE-601",
    ],
    # XXE（外部实体注入）
    "xxe": [
        "CWE-611",
        "CWE-776", # Improper Restriction of Recursive Entity References in DTDs
    ],
    # 认证/鉴权相关（按近似类分组）
    "authn": [
        "CWE-287", # Improper Authentication
        "CWE-306", # Missing Authentication for Critical Function
    ],
    "authz": [
        "CWE-284", # Improper Access Control
        "CWE-285", # Improper Authorization
        "CWE-639", # IDOR: Authorization Bypass Through User-Controlled Key
        "CWE-862", # Missing Authorization
        "CWE-863", # Incorrect Authorization
    ],
    # 凭据/密钥/加密弱点
    "credentials": [
        "CWE-798", # Hard-coded Credentials
        "CWE-522", # Insufficiently Protected Credentials
    ],
    "crypto-weak": [
        "CWE-327", # Broken or Risky Crypto Algorithm
        "CWE-328", # Use of Weak Hash
        "CWE-321", # Hard-coded Crypto Key
        "CWE-330", # Insufficiently Random Values
    ],
    # CORS / 跨域策略问题
    "cors": [
        "CWE-942", # Permissive Cross-domain Policy with Untrusted Domains
    ],
    # 文件上传
    "file-upload": [
        "CWE-434", # Unrestricted File Upload
    ],
    # 泛化净化/编码（按需启用）
    "sanitization": [
        "CWE-707",
        "CWE-116", # Improper Encoding or Escaping of Output
    ],
    # XPath / XQuery 注入
    "xpath-injection": [
        "CWE-643", # Improper Neutralization in XPath Expression
    ],
    # Header 注入 / 响应拆分
    "header-injection": [
        "CWE-113", # HTTP Response Splitting
        "CWE-93",  # CRLF Injection
    ],
    # HTTP 请求走私
    "http-request-smuggling": [
        "CWE-444", # Inconsistent Interpretation of HTTP Requests
    ],
    # 文件包含（LFI/RFI）
    "file-inclusion": [
        "CWE-98",  # PHP Include/Require Filename Control
        "CWE-829", # Inclusion of Functionality from Untrusted Control Sphere
    ],
    # 点击劫持
    "clickjacking": [
        "CWE-1021", # Improper Restriction of Rendered UI Layers or Frames
    ],
    # 会话管理问题
    "session-management": [
        "CWE-384", # Session Fixation
        "CWE-613", # Insufficient Session Expiration
    ],
    # 敏感信息泄露 / 明文传输 / 存储
    "data-exposure": [
        "CWE-200", # Exposure of Sensitive Information
        "CWE-319", # Cleartext Transmission of Sensitive Information
        "CWE-311", # Missing Encryption of Sensitive Data
    ],
    # 正则拒绝服务（ReDoS）
    "redos": [
        "CWE-1333", # Inefficient Regular Expression Complexity
    ],
    # JWT 类问题（签名/真实性校验不足）
    "jwt": [
        "CWE-347", # Improper Verification of Cryptographic Signature
        "CWE-345", # Insufficient Verification of Data Authenticity
    ],
    # 输入校验通用母类（用于自然语言映射回落，不作宽松等价）
    "input-validation": [
        "CWE-20",  # Improper Input Validation
    ],
}

# 提示词统一迁移到 claude-code-security-review/claudecode/prompts.py