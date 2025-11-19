"""
LLM客户端，用于与OpenAI格式的API进行交互
"""

import os
import json
import logging
import time
from typing import Dict, Any, List, Optional
import requests
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import LLM_CONFIG

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class LLMClient:
    """LLM客户端，用于与OpenAI格式的API进行交互"""
    
    def __init__(self, model_config: Dict[str, Any] = None):
        """
        初始化LLM客户端
        
        Args:
            model_config: 模型配置
        """
        if model_config is None:
            # 使用第一个配置的模型
            model_config = LLM_CONFIG["models"][0]
            
        self.model_name = model_config["name"]
        # 允许每个模型单独设置 api_key 与 api_base；如未设置，则回退到全局配置
        self.api_key = model_config.get("api_key", LLM_CONFIG.get("api_key", ""))
        self.api_base = model_config.get("api_base", LLM_CONFIG.get("api_base", "https://api.openai.com/v1"))
        self.max_tokens = model_config.get("max_tokens", 4096)
        self.temperature = LLM_CONFIG.get("temperature", 0.0)
        # 优先使用model_config中的timeout，否则使用全局配置
        self.timeout = model_config.get("timeout", LLM_CONFIG.get("timeout", 60))
        self.max_retries = model_config.get("max_retries", LLM_CONFIG.get("max_retries", 3))
        
        logger.info(f"初始化LLM客户端，模型: {self.model_name}")
    
    def _format_messages(self, system_prompt: str, user_prompt: str) -> List[Dict[str, str]]:
        """
        格式化消息
        
        Args:
            system_prompt: 系统提示
            user_prompt: 用户提示
            
        Returns:
            格式化后的消息列表
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
            
        messages.append({"role": "user", "content": user_prompt})
        
        return messages
    
    def completion(self, 
                  system_prompt: str, 
                  user_prompt: str,
                  retry_count: int = 0) -> Optional[str]:
        """
        发送请求获取完成结果
        
        Args:
            system_prompt: 系统提示
            user_prompt: 用户提示
            retry_count: 重试计数
            
        Returns:
            完成结果
        """
        messages = self._format_messages(system_prompt, user_prompt)
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        data = {
            "model": self.model_name,
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }

        # 为兼容部分供应商的"推理token"机制，降低推理开销以避免content为空
        # （例如返回 usage.completion_tokens_details.reasoning_tokens 占满，finish_reason=length）
        # 注意：某些API不支持reasoning参数，暂时不添加以避免API错误
        # try:
        #     data.setdefault("reasoning", {"effort": "low", "max_tokens": 0})
        # except Exception:
        #     pass
        
        url = f"{self.api_base}/chat/completions"
        
        try:
            response = requests.post(
                url, 
                headers=headers, 
                json=data,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                # 为了排查空响应问题，增加更健壮的解析与调试日志
                try:
                    result = response.json()
                except Exception as e:
                    logger.error(f"响应JSON解析失败: {str(e)} | 文本: {response.text[:500]}")
                    # 重试
                    if retry_count < self.max_retries:
                        logger.info(f"重试 ({retry_count + 1}/{self.max_retries})...")
                        time.sleep(5 * (2 ** retry_count))
                        return self.completion(system_prompt, user_prompt, retry_count + 1)
                    return None

                # 兼容不同OpenAI兼容API的返回结构
                content = None
                try:
                    if isinstance(result, dict):
                        choices = result.get("choices")
                        if isinstance(choices, list) and len(choices) > 0:
                            choice0 = choices[0] or {}
                            # 优先标准结构
                            msg = choice0.get("message") or {}
                            content = msg.get("content")
                            # 兼容某些提供商使用的text字段
                            if not content:
                                content = choice0.get("text")
                            # 兼容流式聚合结构
                            if not content:
                                delta = choice0.get("delta") or {}
                                content = delta.get("content")
                        # 极端情况：顶层直接给content
                        if not content:
                            content = result.get("content")
                except Exception as e:
                    logger.error(f"解析choices结构异常: {str(e)} | 结果片段: {str(result)[:500]}")

                if content is None or (isinstance(content, str) and content.strip() == ""):
                    # 有些服务商在队列或安全拦截时返回空content但状态200，这里打印片段便于定位
                    logger.warning(f"状态200但返回空内容，响应片段: {str(result)[:500]}")
                    # 空内容也触发一次重试（避免瞬时空回复）
                    if retry_count < self.max_retries:
                        logger.info(f"空内容重试 ({retry_count + 1}/{self.max_retries})...")
                        time.sleep(5 * (2 ** retry_count))
                        return self.completion(system_prompt, user_prompt, retry_count + 1)
                    return None

                return content
            else:
                logger.error(f"API请求失败: {response.status_code} - {response.text}")
                
                # 重试
                if retry_count < self.max_retries:
                    logger.info(f"重试 ({retry_count + 1}/{self.max_retries})...")
                    time.sleep(5 * (2 ** retry_count))  # 增强指数退避：5秒 -> 10秒 -> 20秒
                    return self.completion(system_prompt, user_prompt, retry_count + 1)
                    
                return None
                
        except Exception as e:
            logger.error(f"API请求异常: {str(e)}")
            
            # 重试
            if retry_count < self.max_retries:
                logger.info(f"重试 ({retry_count + 1}/{self.max_retries})...")
                time.sleep(5 * (2 ** retry_count))  # 增强指数退避：5秒 -> 10秒 -> 20秒
                return self.completion(system_prompt, user_prompt, retry_count + 1)
                
            return None
    
    def detect_vulnerability(self, prompt_or_code: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        使用LLM检测JavaScript代码中的漏洞
        
        Args:
            prompt_or_code: 要检测的JavaScript代码或完整的项目级提示
            context: 额外的上下文信息（可选）
            
        Returns:
            检测结果字典
        """
        # 判断是否为完整提示（包含项目信息的长文本）还是单纯代码
        if len(prompt_or_code) > 5000 and "项目信息" in prompt_or_code:
            # 这是完整的项目级提示
            prompt = prompt_or_code
        else:
            # 这是代码片段，需要构建提示
            prompt = self._build_detection_prompt(prompt_or_code, context)
        
        # 强制在system层加入英文输出与格式约束
        system_prompt = (
            "You are a senior JavaScript security auditor."
            " Respond strictly in English for all texts, including explanation."
            " Output valid JSON only when asked, without extra commentary."
        )
        # 增加请求间隔，降低速率限制风险
        time.sleep(3)
        response = self.completion(system_prompt, prompt)
        
        if response is None:
            logger.error("获取LLM响应失败")
            return self._get_default_detection_result()
        
        # 解析响应
        result = self._parse_detection_response(response)
        if result:
            return result
        else:
            return self._get_default_detection_result()
    
    def _build_detection_prompt(self, code: str, context: Dict[str, Any] = None) -> str:
        """
        构建漏洞检测提示词
        
        Args:
            code: JavaScript代码
            context: 上下文信息
            
        Returns:
            构建的提示词
        """
        # 基础提示词模板
        base_prompt = """你是一个专业的JavaScript安全代码审计专家。请仔细分析以下JavaScript代码，识别其中可能存在的安全漏洞。



代码内容：
```javascript
{code}
```

请严格按照以下JSON格式输出你的分析结果：
```json
{{
  "has_vulnerability": true/false,
  "vulnerability_type": "具体的漏洞类型（CWE编号），如CWE-79、CWE-89等，如无漏洞则为None",
  "filename": "具体有漏洞的文件路径，可以是多个文件用分号分隔",
  "function_name": "具体有漏洞的函数名称，如果是全局作用域则填写__file_scope__，多个函数用分号分隔",
  "vulnerable_lines": [行号列表],
  "confidence": 0.0-1.0,
  "explanation": "详细的漏洞分析和解释"
}}
```

要求：
1. 仔细分析代码逻辑和数据流
2. 考虑输入验证、输出编码、权限控制等安全要素
3. 特别注意：如果代码路径包含'fixed'，请更加谨慎评估，确认是否真的存在安全漏洞，而不是已修复的安全实现
4. 如果没有发现漏洞，请明确将has_vulnerability设为false
5. 对于全局作用域的代码（不在任何函数内），function_name填写__file_scope__
6. 如果涉及多个文件或函数，请用分号分隔"""

        # 添加上下文信息
        if context:
            context_info = []
            if context.get('project_name'):
                context_info.append(f"项目名称: {context['project_name']}")
            if context.get('file_path'):
                context_info.append(f"文件路径: {context['file_path']}")
            if context.get('function_name'):
                context_info.append(f"函数名称: {context['function_name']}")
            
            if context_info:
                base_prompt = f"上下文信息：\n{chr(10).join(context_info)}\n\n" + base_prompt
        
        return base_prompt.format(code=code)
    
    def _parse_detection_response(self, response: str) -> Optional[Dict[str, Any]]:
        """
        解析漏洞检测响应
        
        Args:
            response: API响应文本
            
        Returns:
            解析后的检测结果
        """
        try:
            import re
            
            # 记录原始响应用于调试
            logger.debug(f"原始响应: {response}")
            
            # 提取JSON块
            json_pattern = r'```json\s*(.*?)\s*```'
            match = re.search(json_pattern, response, re.DOTALL)
            
            if match:
                json_str = match.group(1)
                logger.debug(f"提取的JSON: {json_str}")
            else:
                # 尝试查找JSON对象
                json_pattern2 = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
                match2 = re.search(json_pattern2, response, re.DOTALL)
                if match2:
                    json_str = match2.group(0)
                    logger.debug(f"找到JSON对象: {json_str}")
                else:
                    # 尝试直接解析
                    json_str = response.strip()
                    logger.debug(f"直接解析: {json_str}")
            
            # 清理JSON字符串
            json_str = json_str.strip()
            
            result = json.loads(json_str)

            # 规范化辅助函数
            def _extract_cwe_from_text(s: str) -> str:
                if not s:
                    return ''
                import re as _re
                m = _re.search(r'(CWE-\d{2,7})', str(s), flags=_re.IGNORECASE)
                return m.group(1).upper() if m else ''

            def _map_natural_to_cwe(label: str) -> str:
                if not label:
                    return ''
                t = str(label).strip().lower()
                t = ' '.join(t.split())
                mapping = {
                    'sql injection': 'CWE-89',
                    'sqli': 'CWE-89',
                    'cross site scripting': 'CWE-79',
                    'cross-site scripting': 'CWE-79',
                    'xss': 'CWE-79',
                    'csrf': 'CWE-352',
                    'cross site request forgery': 'CWE-352',
                    'path traversal': 'CWE-22',
                    'directory traversal': 'CWE-22',
                    'command injection': 'CWE-78',
                    'os command injection': 'CWE-78',
                    'ssrf': 'CWE-918',
                    'server-side request forgery': 'CWE-918',
                    'prototype pollution': 'CWE-1321',
                    'deserialization': 'CWE-502',
                    'insecure deserialization': 'CWE-502',
                    'code injection': 'CWE-94',
                }
                return mapping.get(t, '')

            def _normalize_vuln_type(v: str) -> str:
                if not v:
                    return ''
                cwe = _extract_cwe_from_text(v)
                if cwe:
                    return cwe
                mapped = _map_natural_to_cwe(v)
                return mapped or str(v)

            # 验证和标准化结果（补充可选字段 filename/function_name 用于函数级评估）
            vuln_type_norm = _normalize_vuln_type(result.get("vulnerability_type", "None"))
            filename_val = result.get("filename")
            function_val = result.get("function_name")
            if isinstance(filename_val, str):
                # Top-1: 仅取第一个候选
                filename_val = filename_val.split('\n')[0].split(';')[0].strip()
            else:
                filename_val = ''
            if isinstance(function_val, str):
                function_val = function_val.split('\n')[0].split(';')[0].strip()
            else:
                function_val = ''

            parsed = {
                "has_vulnerability": bool(result.get("has_vulnerability", False)),
                "vulnerability_type": vuln_type_norm or "None",
                "confidence": float(result.get("confidence", 0.0)),
                "explanation": str(result.get("explanation", "")),
                "vulnerable_lines": result.get("vulnerable_lines", []),
                "raw_response": response,
                "filename": filename_val,
                "function_name": function_val,
            }
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON解析失败: {str(e)}")
            logger.error(f"响应内容: {response}")
            # 尝试手动解析关键信息
            return self._manual_parse_response(response)
        except Exception as e:
            logger.error(f"响应解析失败: {str(e)}")
            logger.error(f"响应内容: {response}")
            return self._manual_parse_response(response)
    
    def _manual_parse_response(self, response: str) -> Dict[str, Any]:
        """
        手动解析响应（当JSON解析失败时的备用方案）
        
        Args:
            response: API响应文本
            
        Returns:
            解析后的检测结果
        """
        import re
        
        result = {
            "has_vulnerability": False,
            "vulnerability_type": "None",
            "confidence": 0.0,
            "explanation": "JSON解析失败，使用手动解析",
            "vulnerable_lines": [],
            "raw_response": response
        }
        
        try:
            # 尝试提取关键信息
            if "has_vulnerability" in response.lower():
                if "true" in response.lower():
                    result["has_vulnerability"] = True
                elif "false" in response.lower():
                    result["has_vulnerability"] = False
            
            # 提取漏洞类型
            vuln_types = ["XSS", "SQL Injection", "Command Injection", "Path Traversal", 
                         "Prototype Pollution", "CSRF", "SSRF"]
            for vuln_type in vuln_types:
                if vuln_type.lower() in response.lower():
                    result["vulnerability_type"] = vuln_type
                    break
            
            # 提取explanation字段
            if len(response) > 50:
                result["explanation"] = response[:200] + "..."
            else:
                result["explanation"] = response
                
        except Exception as e:
            logger.warning(f"手动解析也失败: {str(e)}")
        
        return result
    
    def _get_default_detection_result(self) -> Dict[str, Any]:
        """
        获取默认检测结果（当API调用失败时）
        
        Returns:
            默认结果字典
        """
        return {
            "has_vulnerability": False,
            "vulnerability_type": "None",
            "confidence": 0.0,
            "explanation": "API调用失败，无法进行漏洞检测",
            "vulnerable_lines": [],
            "raw_response": ""
        }

    def analyze_vulnerability(self, code: str) -> Dict[str, Any]:
        """
        分析代码中的漏洞（保持向后兼容）
        
        Args:
            code: 代码内容
            
        Returns:
            分析结果
        """
        result = self.detect_vulnerability(code)
        
        # 转换为旧格式以保持兼容性
        return {
            "has_vulnerability": result["has_vulnerability"],
            "vulnerability_type": result["vulnerability_type"],
            "line_numbers": result["vulnerable_lines"],
            "explanation": result["explanation"]
        }


if __name__ == "__main__":
    # 测试LLM客户端
    client = LLMClient()
    
    # 包含XSS漏洞的示例代码
    sample_code = """
    function displayUserInput(input) {
        document.getElementById('output').innerHTML = input;
    }
    
    function processForm() {
        const userInput = document.getElementById('userInput').value;
        displayUserInput(userInput);
    }
    """
    
    result = client.analyze_vulnerability(sample_code)
    print(json.dumps(result, indent=2)) 