#!/bin/bash

# Claude Code 漏洞检测系统快速运行脚本
# 自动设置环境并运行扫描

# 设置环境变量
export ANTHROPIC_API_KEY="sk-twSzMg0U0sTIAZNbs6cI71dxcIVl9cCCNIYUA1K94xBOYOOs"
export ANTHROPIC_BASE_URL="https://sg.uiuiapi.com"

# 初始化conda
source ~/anaconda3/etc/profile.d/conda.sh
conda activate js_vuln_benchmark

# 运行命令
python security_cli.py "$@"