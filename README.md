# SecJS: JavaScript Vulnerability Benchmark for LLM Evaluation

SecJS is the artifact repository for a JavaScript vulnerability benchmark and evaluation framework. The current public release is intentionally scoped to the paper's RQ1 evaluation: measuring how well LLMs detect vulnerabilities in full JavaScript project pairs.

The benchmark dataset itself is not included in this repository. It will be released after paper acceptance. This repository provides the benchmark construction code, the RQ1 evaluation framework, and the scripts needed to reproduce the RQ1 tables once ArenaJS is available.

## Artifact Status

| Component | Status | Notes |
| --- | --- | --- |
| ForgeJS data collection and construction code | Available | CVE collection, project retrieval, function labeling, augmentation |
| JudgeJS RQ1 evaluation code | Available | Full-project LLM evaluation and metric aggregation |
| RQ1 reproduction script | Available | `scripts/run_rq1.py` |
| ArenaJS dataset files | Pending release | Will be provided after paper acceptance |
| Experiments outside RQ1 | Not included | This public artifact is scoped to RQ1 |

## Repository Layout

```text
SecJS/
├── ArenaJS/                 # Dataset placeholder and expected layout
├── ForgeJS/                 # Dataset collection/construction pipeline
├── JudgeJS/                 # RQ1 model evaluation and metrics
├── scripts/run_rq1.py       # Main RQ1 reproduction entry point
├── requirements.txt         # Python dependencies
└── .env.example             # Environment variable template
```

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
```

Edit `.env` and set the API keys for the models you plan to evaluate. API keys are loaded from environment variables only and should never be committed.

Install the Node.js obfuscation helper used by ForgeJS:

```bash
cd ForgeJS/node_tools/obfuscator
npm install
cd ../../..
```

## Dataset Placement

After the ArenaJS release, place the dataset under `ArenaJS/`:

```text
ArenaJS/
├── data/
│   ├── original_dataset.csv
│   ├── noise_dataset.csv
│   ├── obfuscated_dataset.csv
│   ├── noise_obfuscated_dataset.csv
│   └── prompt_injection_dataset.csv
├── projects/
│   └── <owner>_<repo>_<CVE-ID>/
│       ├── vulnerable/
│       └── fixed/
└── augmented_projects/
    ├── noise/
    ├── obfuscated/
    ├── noise_obfuscated/
    └── prompt_injection/
```

Until the dataset is released, `scripts/run_rq1.py --dry-run` can be used to inspect the commands without executing API calls.

## Reproduce RQ1

Run the full RQ1 protocol:

```bash
python scripts/run_rq1.py
```

Run a smaller slice:

```bash
python scripts/run_rq1.py \
  --models gpt-5-2025-08-07 \
  --variants original \
  --sample-size 50
```

Aggregate existing checkpoints without issuing model API calls:

```bash
python scripts/run_rq1.py --skip-detection
```

Outputs:

- `results/rq1/rq1_summary.csv`: machine-readable summary
- `results/rq1/rq1_table.md`: paper-style Markdown table
- `JudgeJS/evaluation/checkpoints/`: raw per-sample model outputs and checkpoints

See [REPRODUCING_RQ1.md](REPRODUCING_RQ1.md) for the full step-by-step protocol.

## Build or Inspect the Dataset Pipeline

ForgeJS provides the code used to collect and construct ArenaJS:

```bash
cd ForgeJS
python main.py --start 2022-01-01 --end 2025-08-10
python main.py --only-augmentation --augment-strategies noise obfuscated combined prompt_injection
```

Set `NVD_API_KEY` for higher NVD API rate limits. Without it, ForgeJS uses public API access.

## Metrics

JudgeJS reports:

- Project-level Precision, Recall, F1, VD-S
- Function-level Precision, Recall, F1, VD-S
- Full split and denoised split results

The denoised split is derived from function-label metadata (`ONEFUNC` or `NVDCHECK`) in the ArenaJS CSV files.

## Citation

Use [CITATION.cff](CITATION.cff) for citation metadata. The paper title and bibliographic details can be updated after acceptance.

## License

Framework code is released under the Apache License 2.0. Dataset contents inherit the licenses of their upstream open-source projects and will be distributed separately after paper acceptance.
