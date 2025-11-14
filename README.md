# SecJS - JavaScript漏洞检测基准测试

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-brightgreen)](https://secjs.github.io/js-vuln-benchmark/)

**首个系统化的JavaScript漏洞检测基准测试框架与数据集**

SecJS提供了完整的JavaScript漏洞检测评估框架和高质量数据集，包含ForgeJS数据生成框架和JudgeJS评估框架，支持多模型、多数据集的全面评估。

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/SecJS/js-vuln-benchmark.git
cd js-vuln-benchmark

# 安装依赖
pip install -r requirements.txt
```

### 使用JudgeJS进行评估

```bash
# 运行评估
python main.py --model gpt-4 --dataset original

# 查看评估结果
python analyze_stats.py
```

### 使用ForgeJS生成数据

```bash
# 生成数据集
python generate_dataset.py --strategy noise

# 应用多种增强策略
python generate_dataset.py --strategy all
```

## 📊 数据集

**ArenaJS数据集**包含：
- **1,852** 个原始项目
- **9,188** 个总项目实例
- **5** 种数据集变体（Original, Noise, Obfuscated, Noise+Obfuscation, Prompt Injection）
- **30+** 种CWE漏洞类型

## 🏗️ 核心组件

### ForgeJS - 数据生成框架
全自动化数据生成框架，支持多种数据增强策略，7小时完成1,852个项目的生成，效率提升5-10倍。

### JudgeJS - 评估框架
标准化评估框架，支持项目级和函数级评估，提供Precision、Recall、F1、VD-S等多项指标。

### ArenaJS - 数据集
大规模数据集，包含1,852个原始项目和4种增强变体，总计9,188个项目实例。

## 📈 性能统计

- **JudgeJS评估效率**：单项目评估平均35.55秒，总评估时间约43天（10模型×5数据集）
- **ForgeJS生成效率**：7小时完成1,852个项目的完整生成流程，平均13.6秒/项目
- **Token消耗**：单项目约6,085 tokens，总评估消耗317.2M tokens

## 📚 文档

- [在线演示网站](https://secjs.github.io/js-vuln-benchmark/)
- [GitHub设置指南](GITHUB_SETUP.md)
- [评估框架文档](评测框架SecJS-Eval.md)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

本项目采用MIT许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为本项目做出贡献的研究者和开发者。

---

**注意**：代码和数据集正在准备中，将陆续发布。

