#!/bin/bash

# Claude Code 漏洞检测系统环境设置脚本
# 自动配置所需的环境变量和conda环境

echo "============================================================"
echo "    Claude Code 漏洞检测系统环境设置"
echo "============================================================"

# 检查conda是否可用
if ! command -v conda &> /dev/null; then
    echo "❌ 错误: conda未安装或不在PATH中"
    echo "请先安装Anaconda或Miniconda"
    exit 1
fi

# 初始化conda
echo "🔧 初始化conda环境..."
source ~/anaconda3/etc/profile.d/conda.sh

# 检查js_vuln_benchmark环境是否存在
if conda env list | grep -q "js_vuln_benchmark"; then
    echo "✅ 找到js_vuln_benchmark环境"
else
    echo "❌ 未找到js_vuln_benchmark环境"
    echo "请先创建此环境或更改脚本中的环境名称"
    exit 1
fi

# 激活环境
echo "🔧 激活js_vuln_benchmark环境..."
conda activate js_vuln_benchmark

# 检查API密钥
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  未设置ANTHROPIC_API_KEY环境变量"
    echo "请设置您的API密钥:"
    read -p "请输入您的Anthropic API密钥: " api_key
    if [ -n "$api_key" ]; then
        export ANTHROPIC_API_KEY="$api_key"
        echo "✅ API密钥已设置"
        
        # 询问是否要保存到配置文件
        read -p "是否要将API密钥保存到 ~/.bashrc? (y/N): " save_key
        if [[ "$save_key" =~ ^[Yy]$ ]]; then
            echo "export ANTHROPIC_API_KEY=\"$api_key\"" >> ~/.bashrc
            echo "✅ API密钥已保存到 ~/.bashrc"
        fi
    else
        echo "❌ 未设置API密钥"
        exit 1
    fi
else
    echo "✅ API密钥已配置"
fi

# 检查Claude Code CLI
echo "🔧 检查Claude Code CLI..."
if command -v claude &> /dev/null; then
    claude_version=$(claude --version 2>/dev/null || echo "unknown")
    echo "✅ Claude Code CLI已安装: $claude_version"
else
    echo "❌ 未找到Claude Code CLI"
    echo "请按照以下步骤安装:"
    echo "1. 访问 https://docs.anthropic.com/en/docs/claude-code"
    echo "2. 按照官方文档安装Claude Code CLI"
    exit 1
fi

# 验证完整环境
echo "🔧 验证环境配置..."
if python security_cli.py model validate; then
    echo "✅ 环境配置验证成功!"
    echo ""
    echo "🎉 环境设置完成!"
    echo ""
    echo "现在您可以使用以下命令:"
    echo "  python security_cli.py scan .                    # 扫描当前目录"
    echo "  python security_cli.py model list               # 查看可用模型"
    echo "  python quick_start.py                          # 运行快速入门向导"
    echo ""
    echo "要在新的终端会话中使用，请运行:"
    echo "  source ~/anaconda3/etc/profile.d/conda.sh"
    echo "  conda activate js_vuln_benchmark"
    echo "  export ANTHROPIC_API_KEY=\"your-api-key\""
else
    echo "❌ 环境验证失败"
    echo "请检查上述错误信息并重试"
    exit 1
fi