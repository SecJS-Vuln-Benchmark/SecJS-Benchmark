# SecJS – JavaScript Vulnerability Benchmark

> Live demo: [SecJS Benchmark Site](https://secjs-vuln-benchmark.github.io/SecJS-Benchmark/)

SecJS is a modular benchmark for large-scale JavaScript vulnerability research. It ships with three tightly coupled components:

- **ForgeJS** – automated data collection, labeling, and augmentation
- **JudgeJS** – standardized LLM evaluation pipeline
- **ArenaJS** – curated dataset bundles with all variants

## Repository Layout

```
SecJS/
├── ForgeJS/                # Dataset generation pipeline
├── JudgeJS/                # Evaluation framework
└── ArenaJS/                # Downloaded datasets (CSV + projects)
```

### ForgeJS

```
ForgeJS/
├── main.py                 # Orchestrates the four-stage pipeline
├── js_cve_scraper.py       # CVE harvesting
├── js_commit_info.py       # GitHub clone + diff extraction
├── js_function_extractor.py# Function-level labeling
├── augmentation_config.py  # Noise/obfuscation strategy config
├── data/                   # Generated CSV artifacts
└── node_tools/             # JavaScript tooling (obfuscators, etc.)
```

### JudgeJS

```
JudgeJS/
├── project_detection.py    # Entry point for full-project evaluation
├── evaluation/             # Metrics + checkpoint utilities
├── models/                 # LLM adapters
├── utils/                  # Project loaders and helpers
├── config/                 # Dataset + model configuration
└── checkpoints/            # Evaluation progress snapshots
```

### ArenaJS

ArenaJS is a storage directory for downloadable artifacts:

- `data/` – dataset CSV files (original + augmented variants)
- `projects/` – vulnerable/fixed project pairs
- `augmented_projects/` – project-level noise/obfuscation outputs

See [ArenaJS/README.md](ArenaJS/README.md) for download instructions.

## Quick Start

### 1. Prepare the dataset

Download the ArenaJS bundles and place them into:

- CSV files → `SecJS/ArenaJS/data/`
- Project sources → `SecJS/ArenaJS/projects/`
- Augmented projects → `SecJS/ArenaJS/augmented_projects/`

### 2. Run ForgeJS

```bash
cd SecJS/ForgeJS

# End-to-end pipeline
python main.py --start 2022-01-01 --end 2022-03-31

# Only run augmentation
python main.py --only-augmentation --augment-strategies obfuscated

# List available strategies
python main.py --list-strategies
```

### 3. Run JudgeJS

```bash
cd SecJS/JudgeJS

# Project-level evaluation
python project_detection.py --dataset original --model gpt-4 --sample-size 10

# Show CLI help
python project_detection.py --help
```

## Dependencies

### Python

```bash
pip install pandas requests tqdm beautifulsoup4 scikit-learn \
            sentence-transformers rouge-score
```

### Node.js (required for augmentation)

```bash
npm install -g javascript-obfuscator terser uglify-js
```

## Configuration

- ForgeJS writes outputs to `ForgeJS/data/` and reads projects from `../ArenaJS/projects/`.
- JudgeJS configuration lives in `JudgeJS/config/config.py` (dataset paths, model settings, similarity thresholds).
- Model endpoints can also be stored in `JudgeJS/config/model_endpoints.json`.

## ArenaJS Snapshot

- **1,852** original OSS projects (paired vulnerable/fixed versions)
- **9,188** total instances across variants
- **5** dataset variants: Original, Noise, Obfuscated, Noise+Obfuscated, Prompt-Injection
- **30+** CWE families represented

## License

Code is distributed under the MIT License. Dataset contents inherit the upstream project licenses—please review the terms before redistribution.

## Contributing

Issues and pull requests are welcome. Please describe the dataset slice, augmentation strategy, and evaluation settings for reproducibility.


