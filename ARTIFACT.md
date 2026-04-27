# Artifact Overview

This artifact is designed to support the RQ1 evaluation in the SecJS paper.

## What This Artifact Provides

- Source code for collecting JavaScript CVE metadata and associated GitHub patch information.
- Source code for constructing full-project vulnerable/fixed pairs and augmented variants.
- A full-project LLM evaluation harness for RQ1.
- Scripts for producing RQ1 summary tables from raw model outputs.
- Configuration templates for model endpoints and API keys.

## What This Artifact Does Not Include Yet

- The ArenaJS dataset files.
- Raw RQ1 model outputs generated during the paper experiments.
- Experiments outside the RQ1 scope.

The dataset will be released after paper acceptance because it contains full upstream open-source project snapshots and requires final packaging with license metadata.

## Expected Evaluation Flow

1. Install Python and Node.js dependencies.
2. Place ArenaJS under `ArenaJS/`.
3. Configure model endpoints through `.env`.
4. Run `python scripts/run_rq1.py`.
5. Inspect `results/rq1/rq1_summary.csv` and `results/rq1/rq1_table.md`.

## Reproducibility Notes

- RQ1 evaluates vulnerable and fixed project snapshots for each dataset row.
- Checkpoints are stored under `JudgeJS/evaluation/checkpoints/` so interrupted model runs can resume.
- The RQ1 summary script can recompute tables from existing checkpoints without issuing new model calls.
- All API keys are read from environment variables.
