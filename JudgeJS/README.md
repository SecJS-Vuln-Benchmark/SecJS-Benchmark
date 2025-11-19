# JudgeJS – LLM Evaluation Framework

JudgeJS provides a reproducible evaluation harness for vulnerability detection with large language models (LLMs). It normalizes prompts, validates JSON outputs, and aggregates metrics at both project and function granularity.

## Features

- Multi-model adapters (OpenAI, Anthropic, Google, DeepSeek, Grok, etc.)
- Project-level and function-level judging with equivalence-aware CWE checks
- Robust checkpointing to resume long evaluation campaigns
- Rich metrics: Precision/Recall/F1, VD-S, Macro/Weighted F1, similarity scores

## Quick Start

```bash
# Project-level evaluation
python project_detection.py --dataset original --model gpt-4 --sample-size 10

# Evaluate an augmented dataset
python project_detection.py --dataset obfuscated --model deepseek-ai/DeepSeek-V3.1

# CLI help
python project_detection.py --help
```

### Common Arguments

- `--dataset` – `original`, `noise`, `obfuscated`, `noise_obfuscated`, `prompt_injection`
- `--model` – Model identifier (matching `config/config.py` or `model_endpoints.json`)
- `--sample-size` – Number of samples to process
- `--force-restart` / `--force-continue` – Override checkpoint prompts
- `--only-errors` – Re-run failed samples only

## Configuration

- `config/config.py` stores dataset paths, similarity thresholds, and default LLM settings.
- `DATA_CONFIG["dataset_types"]` points to `../ArenaJS/` CSVs and project folders.
- `LLM_CONFIG` or `config/model_endpoints.json` define API keys, endpoints, and timeouts.
- `SIMILARITY_CONFIG` and `CWE_EQUIVALENCE_GROUPS` control scoring behavior.

## Outputs (`checkpoints/`)

- `{model}_{dataset}_results.csv` – Raw per-sample predictions
- `{model}_{dataset}_checkpoint.json` – Progress + retry metadata
- `{model}_{dataset}_metrics.json` – Aggregated metrics

## Requirements

- Python 3.8+
- pandas, scikit-learn, sentence-transformers, rouge-score
- Access to the configured LLM APIs

Ensure that the ArenaJS datasets are downloaded to `../ArenaJS/` before running JudgeJS.
