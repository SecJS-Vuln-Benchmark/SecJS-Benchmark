#!/bin/bash

# Claude Code 漏洞检测系统快速运行脚本
# 自动设置环境并运行扫描

# Set ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL in your shell or .env file.
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "ANTHROPIC_API_KEY is not set" >&2
  exit 1
fi

# 运行命令
python security_cli.py "$@"
