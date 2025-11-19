#!/usr/bin/env python3
"""
示例Python web应用 - 包含一些常见的安全漏洞用于测试
"""

import sqlite3
import os
from flask import Flask, request, render_template_string

app = Flask(__name__)

# 硬编码的API密钥 - 这是一个安全漏洞
API_KEY = "sk-1234567890abcdef"
DATABASE_PASSWORD = "admin123"

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    # SQL注入漏洞 - 直接拼接用户输入
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchone()
    
    if result:
        return "登录成功"
    else:
        return "登录失败"

@app.route('/search')
def search():
    query = request.args.get('q', '')
    
    # XSS漏洞 - 直接输出用户输入
    template = f"<h1>搜索结果: {query}</h1>"
    return render_template_string(template)

@app.route('/file')
def read_file():
    filename = request.args.get('file')
    
    # 路径遍历漏洞 - 未验证文件路径
    with open(filename, 'r') as f:
        content = f.read()
    return content

@app.route('/exec')
def execute_command():
    cmd = request.args.get('cmd')
    
    # 命令注入漏洞 - 直接执行用户输入
    result = os.system(cmd)
    return f"命令执行结果: {result}"

if __name__ == '__main__':
    # 不安全的配置
    app.run(debug=True, host='0.0.0.0')