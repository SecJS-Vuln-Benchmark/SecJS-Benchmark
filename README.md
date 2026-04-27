# SecJS

SecJS builds and evaluates JavaScript vulnerability datasets for LLM security evaluation. It supports the RQ1 evaluation workflow used in the SecJS paper.

Dataset files are not committed to this repository. Build them locally with `ForgeJS/` or place the released `ArenaJS` dataset under the expected paths.

## Repository Layout

```text
SecJS/
|-- ForgeJS/   # CVE collection, GitHub patch resolution, snapshot download, dataset construction
|-- ArenaJS/   # Dataset workspace consumed by evaluation code
|-- JudgeJS/   # LLM vulnerability detection and metric aggregation
|-- scripts/   # Repository-level experiment runners
|-- results/   # Generated evaluation outputs
`-- README.md
```

Main modules:

- `ForgeJS/`: collects JavaScript-related CVEs from NVD and Mend.io, resolves GitHub repositories and fixing commits, downloads vulnerable/fixed project snapshots, extracts labels, and prepares dataset CSV files.
- `ArenaJS/`: stores dataset CSV files, vulnerable/fixed project snapshots, and robustness variants. This directory is mostly a placeholder until the dataset is built or released.
- `JudgeJS/`: runs model-based vulnerability detection on full JavaScript projects and computes project-level and function-level metrics.
- `JudgeJS/claude-code-security-review/`: bundled Claude Code Security Reviewer tooling used for security analysis experiments and PR-level evaluation.

## Artifact Scope

This artifact provides:

- Source code for collecting JavaScript CVE metadata and GitHub patch information.
- Source code for constructing full-project vulnerable/fixed pairs.
- A full-project LLM evaluation harness for RQ1.
- Scripts for producing RQ1 summary tables from raw model outputs.
- Configuration templates for model endpoints and API keys.

This artifact does not currently include:

- Packaged `ArenaJS` dataset files.
- Raw RQ1 model outputs from the paper experiments.
- Experiments outside the RQ1 scope.

The dataset is expected to be released separately because it contains full upstream open-source project snapshots and needs license metadata packaging.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
```

For dataset construction, these environment variables are useful:

```bash
export NVD_API_KEY=<your-nvd-key>              # optional, raises NVD rate limits
export GITHUB_TOKENS=<token1,token2,...>       # optional but recommended
```

Without GitHub tokens, GitHub API calls use the unauthenticated rate limit.

For JavaScript obfuscation helpers:

```bash
cd ForgeJS/node_tools/obfuscator
npm install
cd ../../..
```

## Security Notes

Do not commit API keys, access tokens, private endpoint URLs, generated `.env` files, model outputs containing secrets, or private dataset snapshots.

If a secret is accidentally committed:

1. Revoke or rotate the secret immediately.
2. Remove it from the repository.
3. Audit logs and generated artifacts that may contain the secret.

SecJS evaluates vulnerable open-source project snapshots. Use the artifact in isolated research environments and avoid running untrusted project code unless necessary.

## Build The Dataset

Run the ForgeJS pipeline:

```bash
cd ForgeJS
python main.py --start 2022-01-01 --end 2025-08-10
```

The pipeline:

1. Collects JavaScript-related CVE metadata from NVD and Mend.io.
2. Resolves GitHub repositories and patch commits.
3. Retrieves paired vulnerable and fixed project snapshots.
4. Extracts file/function-level labels.
5. Prepares dataset outputs for evaluation.

Main outputs:

```text
ForgeJS/data/js_cve_dataset.csv
ForgeJS/data/js_vulnerability_dataset.csv
ForgeJS/data/final_dataset.csv
ArenaJS/projects/<owner>_<repo>_<CVE-ID>/vulnerable/
ArenaJS/projects/<owner>_<repo>_<CVE-ID>/fixed/
```

Prepare the dataset path expected by JudgeJS:

```bash
mkdir -p ../ArenaJS/data
cp data/final_dataset.csv ../ArenaJS/data/original_dataset.csv
cd ..
```

Minimum usable dataset layout:

```text
ArenaJS/
|-- data/
|   `-- original_dataset.csv
`-- projects/
    `-- <owner>_<repo>_<CVE-ID>/
        |-- vulnerable/
        `-- fixed/
```

Full expected layout after the released dataset is placed:

```text
ArenaJS/
|-- data/
|   |-- original_dataset.csv
|   |-- noise_dataset.csv
|   |-- obfuscated_dataset.csv
|   |-- noise_obfuscated_dataset.csv
|   `-- prompt_injection_dataset.csv
|-- projects/
|   `-- <owner>_<repo>_<CVE-ID>/
|       |-- vulnerable/
|       `-- fixed/
`-- augmented_projects/
    |-- noise/
    |-- obfuscated/
    |-- noise_obfuscated/
    `-- prompt_injection/
```

Each CSV row contains project metadata, CWE labels, vulnerable files, vulnerable functions, line ranges, and denoising labels such as `ONEFUNC` and `NVDCHECK`.

Robustness variants use these target names:

```text
ArenaJS/data/noise_dataset.csv
ArenaJS/data/obfuscated_dataset.csv
ArenaJS/data/noise_obfuscated_dataset.csv
ArenaJS/data/prompt_injection_dataset.csv
ArenaJS/augmented_projects/<variant>/
```

The current public code builds the original dataset path above. The augmentation entry point is present in `ForgeJS/main.py`, but `ForgeJS/js_dataset_augmentor.py` is a placeholder, so variant generation must be completed before using the robustness datasets.

## Run RQ1 Evaluation

Configure model endpoints in `.env` and `JudgeJS/config/model_endpoints.json`. API keys are read from environment variables declared by `api_key_env`.

Example model endpoint entry:

```json
{
  "gpt-5-2025-08-07": {
    "api_base": "${OPENAI_API_BASE}",
    "api_key_env": "OPENAI_API_KEY"
  }
}
```

Inspect commands before spending API budget:

```bash
python scripts/run_rq1.py --dry-run --no-env-check
```

Run one small evaluation on the generated original dataset:

```bash
python scripts/run_rq1.py \
  --models gpt-5-2025-08-07 \
  --variants original \
  --sample-size 10
```

Run all available rows for the original dataset:

```bash
python scripts/run_rq1.py \
  --models gpt-5-2025-08-07 \
  --variants original \
  --sample-size 1437
```

Run the full RQ1 protocol after all requested variant CSV files are available:

```bash
python scripts/run_rq1.py
```

The default RQ1 run evaluates the configured models over these variants:

- `original`
- `noise`
- `obfuscated`
- `noise_obfuscated`
- `prompt_injection`

Resume an interrupted run:

```bash
python scripts/run_rq1.py --variants original
```

Rebuild summary tables from existing checkpoints without new model calls:

```bash
python scripts/run_rq1.py --variants original --skip-detection
```

Outputs:

```text
results/rq1/rq1_summary.csv
results/rq1/rq1_table.md
JudgeJS/evaluation/checkpoints/
```

## JudgeJS Direct Usage

JudgeJS expects ArenaJS data under `../ArenaJS/`:

```text
../ArenaJS/data/<variant>_dataset.csv
../ArenaJS/projects/<owner>_<repo>_<CVE-ID>/{vulnerable,fixed}/
../ArenaJS/augmented_projects/<variant>/
```

Run one evaluation:

```bash
cd JudgeJS
python project_detection.py \
  --dataset-type original \
  --model gpt-5-2025-08-07 \
  --sample-size 1437 \
  --force-restart
```

Resume an interrupted run:

```bash
python project_detection.py \
  --dataset-type original \
  --model gpt-5-2025-08-07 \
  --sample-size 1437 \
  --continue
```

Re-run only failed samples:

```bash
python project_detection.py \
  --dataset-type original \
  --model gpt-5-2025-08-07 \
  --sample-size 1437 \
  --continue \
  --only-errors
```

Recompute metrics from saved model outputs:

```bash
python evaluation/checkpoint_utils.py recompute \
  --dataset-type original \
  --model gpt-5-2025-08-07
```

## Expected Dataset Row Fields

JudgeJS relies on these CSV fields:

- `project_name`: `owner/repo` or `owner_repo`
- `cve_ids`: contains a `CVE-YYYY-NNNN...` identifier
- `vulnerable_code_paths`
- `vulnerable_function_names`
- `function_label_breakdown`: used to derive the denoised split with `ONEFUNC` or `NVDCHECK`

Project directories must match:

```text
ArenaJS/projects/<owner>_<repo>_<CVE-ID>/vulnerable/
ArenaJS/projects/<owner>_<repo>_<CVE-ID>/fixed/
```

## Claude Code Security Reviewer

`JudgeJS/claude-code-security-review/` contains an AI-powered security review tool based on Claude Code. It can analyze code changes, produce security findings, comment on pull requests, and filter likely false positives.

Basic requirements:

- Python 3.8+ for the main security review tool.
- Python 3.9+, Git 2.20+, and GitHub CLI for PR evaluation tooling.
- `ANTHROPIC_API_KEY` for Claude access.
- `GITHUB_TOKEN` is recommended for GitHub API rate limits.

Common local commands:

```bash
cd JudgeJS/claude-code-security-review
pip install -r claudecode/requirements.txt
python security_cli.py model validate
python security_cli.py scan .
python security_cli.py model list
```

Evaluate a single GitHub PR:

```bash
python -m claudecode.evals.run_eval owner/repo#123 --verbose
```

The PR evaluator writes JSON results with runtime metrics, finding counts, and finding details under its output directory.

## License

Framework code is released under Apache License 2.0. Dataset snapshots downloaded by ForgeJS keep the licenses of their upstream open-source projects.
