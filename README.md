# SecJS – JavaScript Vulnerability Benchmark

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-brightgreen)](https://secjs-vuln-benchmark.github.io/SecJS-Benchmark/)

SecJS is the first systematic benchmark that combines a large-scale JavaScript vulnerability dataset (ArenaJS) with two automation frameworks:
- **ForgeJS** – fully automated data generation and augmentation
- **JudgeJS** – standardized LLM-based vulnerability evaluation

The project targets reproducible research on JavaScript security analysis, LLM robustness, and benchmark-driven tool comparison.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SecJS-Vuln-Benchmark/SecJS-Benchmark.git
cd SecJS-Benchmark

# Install dependencies (example)
pip install -r requirements.txt
```

### Run JudgeJS evaluations
```bash
python main.py --model gpt-4 --dataset original
python analyze_stats.py
```

### Run ForgeJS data generation
```bash
python generate_dataset.py --strategy noise
python generate_dataset.py --strategy all
```

## 📊 ArenaJS Dataset
- **1,852** original OSS projects (vulnerable + fixed pairs)
- **9,188** total project instances after augmentation
- **5** dataset variants: Original, Noise, Obfuscated, Noise+Obfuscated, Prompt-Injection
- **30+** CWE categories spanning injection, auth/z, crypto, code execution, and web security

## 🏗 Core Components
- **ForgeJS**: Converts real-world CVEs into reproducible projects, applies four augmentation strategies, and emits function-level ground truth in ~7 hours for the full corpus (≈13.6s/project).
- **JudgeJS**: Normalizes LLM prompts, enforces JSON outputs, matches predictions at project/function granularity, and reports Precision, Recall, F1, VD-S, Macro/Weighted F1.
- **ArenaJS**: Curated benchmark bundle with metadata, code snapshots, and vulnerability annotations ready for downstream research.

## 📈 Efficiency Highlights
- **JudgeJS throughput**: 35.55 seconds per project on average; end-to-end evaluation of 10 models × 5 datasets ≈ 43 days.
- **Token footprint**: ~6,085 tokens/project (5,491 input + 594 output); 317.2M tokens for the full evaluation campaign.
- **ForgeJS generation**: 7 hours for the entire corpus, 5–10× faster than manual triage with function-level ground truth precision.

## 📚 Documentation
- [Live demo (GitHub Pages)](https://secjs-vuln-benchmark.github.io/SecJS-Benchmark/)
- [GitHub setup guide](GITHUB_SETUP.md)
- [Evaluation framework (SecJS-Eval)](评测框架SecJS-Eval.md)

## 🤝 Contributing
Issues and pull requests are welcome. Please describe the motivation, dataset slice, and evaluation setting for every contribution.

## 📄 License
Released under the MIT License – see [`LICENSE`](LICENSE).

## 📌 Project Status
The repository currently hosts documentation and the public landing page. Data dumps and code artifacts will be uploaded in phases.
