# JudgeJS

JudgeJS is the SecJS RQ1 evaluation framework. It runs LLM-based vulnerability detection on full JavaScript project pairs and computes project-level and function-level metrics.

## Inputs

JudgeJS expects ArenaJS data under `../ArenaJS/`:

- `../ArenaJS/data/<variant>_dataset.csv`
- `../ArenaJS/projects/<owner>_<repo>_<CVE-ID>/{vulnerable,fixed}/`
- `../ArenaJS/augmented_projects/<variant>/...` for robustness variants

The dataset will be released separately after paper acceptance.

## Single Evaluation

```bash
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

Recompute metrics from saved model outputs:

```bash
python evaluation/checkpoint_utils.py recompute \
  --dataset-type original \
  --model gpt-5-2025-08-07
```

## RQ1 Runner

Use the repository-level runner for the full RQ1 protocol:

```bash
python ../scripts/run_rq1.py
```

It iterates over the configured models and five dataset variants, then writes:

- `../results/rq1/rq1_summary.csv`
- `../results/rq1/rq1_table.md`

For artifact evaluation, prefer the repository-level runner because it records a consistent output layout across models and variants.

## Model Configuration

Model endpoints are configured in `config/model_endpoints.json`. API keys are read from environment variables declared by `api_key_env`.

Example:

```json
{
  "gpt-5-2025-08-07": {
    "api_base": "${OPENAI_API_BASE}",
    "api_key_env": "OPENAI_API_KEY"
  }
}
```

Never commit real API keys.
