# ArenaJS Dataset

ArenaJS is the dataset used by SecJS RQ1. The dataset package is not included in this repository and will be released after paper acceptance.

This directory is kept as a placeholder so the evaluation code has a stable path.

Expected layout after release:

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

Each CSV row contains project metadata, CWE labels, vulnerable files, vulnerable functions, line ranges, and denoising labels such as `ONEFUNC` and `NVDCHECK`. `projects/` stores the paired vulnerable and fixed full-project snapshots. `augmented_projects/` stores the project-level robustness variants.

Use `ForgeJS/` to regenerate or inspect the collection and construction pipeline.
