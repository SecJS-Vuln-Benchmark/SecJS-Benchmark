# ArenaJS Dataset

ArenaJS is the large-scale JavaScript vulnerability corpus that powers SecJS. Each entry contains both the vulnerable and the fixed project snapshot, plus metadata for CWE labels, files, and functions.

## Overview

- **1,852** real OSS projects (paired vulnerable/fixed versions)
- **9,188** total project instances after augmentation
- **5** dataset variants:
  - Original
  - Noise
  - Obfuscated
  - Noise + Obfuscated
  - Prompt-Injection
- **30+** CWE categories

## Download Instructions

Because the dataset is large, please download it separately and place the files in the following structure:

```
SecJS/
├── ArenaJS/
│   ├── data/
│   │   ├── original_dataset.csv
│   │   ├── noise_dataset.csv
│   │   ├── obfuscated_dataset.csv
│   │   ├── noise_obfuscated_dataset.csv
│   │   └── prompt_injection_dataset.csv
│   ├── projects/
│   │   └── [project_name]/
│   │       ├── vulnerable/
│   │       └── fixed/
│   └── augmented_projects/
│       ├── noise/
│       ├── obfuscated/
│       ├── noise_obfuscated/
│       └── prompt_injection/
```

### Steps

1. **CSV files** – copy every dataset CSV into `SecJS/ArenaJS/data/`.
2. **Project sources** (optional but required for full project evaluation) – place each project into `SecJS/ArenaJS/projects/` with `vulnerable/` and `fixed/` subfolders. Naming convention: `[owner]_[repo]_[CVE-ID]`.
3. **Augmented projects** (optional) – copy per-strategy project outputs into `SecJS/ArenaJS/augmented_projects/` under their respective strategy directory.

### File Content

- CSV files include project metadata, CWE labels, file paths, and function annotations.
- Project folders contain full JavaScript projects for both vulnerable and fixed revisions.
- Augmented projects apply noise, obfuscation, or injected prompts at the project level.

## Usage

- **ForgeJS** consumes `ArenaJS/data/` for CSV-level augmentation and regeneration.
- **JudgeJS** reads from `ArenaJS/projects/` (and `ArenaJS/augmented_projects/`) when constructing prompts for LLM evaluation.

## License

ArenaJS redistributes code from the original OSS projects. Please respect each project's license when using or publishing the dataset.
