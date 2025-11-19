# 测试项目

这是一个包含安全漏洞的示例项目，用于测试Claude Code漏洞检测系统。

## 已知漏洞

1. **SQL注入** - vulnerable_app.py 第17行
2. **XSS跨站脚本** - vulnerable_app.py 第27行  
3. **路径遍历** - vulnerable_app.py 第34行
4. **命令注入** - vulnerable_app.py 第41行
5. **硬编码机密** - vulnerable_app.py 第10-11行