# Reproducing RQ1

This guide describes the exact workflow for reproducing the RQ1 evaluation once the ArenaJS dataset is available.

## 1. Prepare the Environment

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install the JavaScript obfuscation helper used by ForgeJS:

```bash
cd ForgeJS/node_tools/obfuscator
npm install
cd ../../..
```

## 2. Configure Model Endpoints

```bash
cp .env.example .env
```

Set API keys and endpoint URLs in `.env`. The default model list is defined in `scripts/run_rq1.py` and `JudgeJS/config/model_endpoints.json`.

## 3. Place ArenaJS

Place the released dataset under:

```text
ArenaJS/data/
ArenaJS/projects/
ArenaJS/augmented_projects/
```

The runner checks for all requested CSV files before executing model calls.

## 4. Run the Full RQ1 Evaluation

```bash
python scripts/run_rq1.py
```

The default run evaluates:

- Models: GPT-5, GPT-5-Mini, GPT-5-Codex, DeepSeek, Gemini-2.5-Pro, Gemini-Flash, Claude-4.5-Sonnet
- Variants: original, noise, obfuscated, noise_obfuscated, prompt_injection
- Sample count: 1,437 rows per variant

## 5. Run a Sanity Check

Before spending API budget, inspect the commands:

```bash
python scripts/run_rq1.py --dry-run --no-env-check
```

Run one small slice:

```bash
python scripts/run_rq1.py \
  --models gpt-5-2025-08-07 \
  --variants original \
  --sample-size 10
```

## 6. Resume or Recompute

Resume an interrupted run:

```bash
python scripts/run_rq1.py
```

Rebuild summary tables from existing checkpoints without new model calls:

```bash
python scripts/run_rq1.py --skip-detection
```

## 7. Outputs

```text
results/rq1/rq1_summary.csv
results/rq1/rq1_table.md
JudgeJS/evaluation/checkpoints/
```

`rq1_summary.csv` contains one row per model, variant, split, and granularity. `rq1_table.md` is a readable table for inspection.
