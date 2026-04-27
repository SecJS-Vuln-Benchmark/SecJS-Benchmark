#!/usr/bin/env python3
"""Run and summarize the RQ1 benchmark evaluation.

RQ1 evaluates LLM vulnerability-detection performance on five ArenaJS
variants. Each sample is evaluated as a vulnerable/fixed project pair, then
aggregated at project and function granularity.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Optional

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[1]
JUDGE_DIR = REPO_ROOT / "JudgeJS"
DEFAULT_VARIANTS = [
    "original",
    "noise",
    "obfuscated",
    "noise_obfuscated",
    "prompt_injection",
]
DEFAULT_MODELS = [
    "gpt-5-2025-08-07",
    "gpt-5-mini-2025-08-07",
    "gpt-5-codex-high",
    "deepseek-chat",
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "claude-sonnet-4-5-20250929",
]


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(REPO_ROOT))
    except ValueError:
        return str(path)


def safe_name(name: str) -> str:
    return name.replace("/", "_").replace(":", "_").replace(" ", "_")


def split_csv(value: Optional[str], default: Iterable[str]) -> List[str]:
    if value is None or not value.strip():
        return list(default)
    return [item.strip() for item in value.split(",") if item.strip()]


def load_model_config(path: Path) -> Dict[str, dict]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def env_value(value: Optional[str]) -> str:
    if not value:
        return ""
    if value.startswith("${") and value.endswith("}"):
        return os.environ.get(value[2:-1], "")
    return value


def ensure_model_env(models: List[str], config_path: Path) -> None:
    configs = load_model_config(config_path)
    missing = []
    for model in models:
        cfg = configs.get(model, {})
        if cfg.get("hidden"):
            continue
        key_env = cfg.get("api_key_env")
        key = os.environ.get(key_env, "") if key_env else cfg.get("api_key", "")
        base = env_value(cfg.get("api_base", ""))
        if not key:
            missing.append(f"{model}: {key_env or 'api_key'}")
        if not base:
            missing.append(f"{model}: api_base")
    if missing:
        details = "\n  - " + "\n  - ".join(missing)
        raise SystemExit(
            "Model endpoint configuration is incomplete.\n\n"
            "Set the missing values in .env, or update "
            "JudgeJS/config/model_endpoints.json. Missing values:" + details
        )


def dataset_csv_path(variant: str) -> Path:
    return REPO_ROOT / "ArenaJS" / "data" / f"{variant}_dataset.csv"


def validate_dataset(variants: List[str]) -> None:
    missing = [str(dataset_csv_path(v).relative_to(REPO_ROOT)) for v in variants if not dataset_csv_path(v).exists()]
    if missing:
        details = "\n  - " + "\n  - ".join(missing)
        raise SystemExit(
            "ArenaJS data files are not present.\n\n"
            "The benchmark dataset will be released after paper acceptance. "
            "After release, place the dataset under ArenaJS/ and rerun this command. "
            "Missing files:" + details
        )


def denoised_indices(variant: str) -> List[int]:
    path = dataset_csv_path(variant)
    df = pd.read_csv(path)
    if "function_label_breakdown" not in df.columns:
        return []
    mask = df["function_label_breakdown"].fillna("").astype(str).str.contains("ONEFUNC|NVDCHECK", regex=True)
    return df.index[mask].astype(int).tolist()


def run_cmd(cmd: List[str], dry_run: bool = False) -> None:
    print("$ " + " ".join(cmd))
    if dry_run:
        return
    subprocess.run(cmd, cwd=str(JUDGE_DIR), check=True)


def run_detection(args: argparse.Namespace, model: str, variant: str) -> None:
    cmd = [
        sys.executable,
        "project_detection.py",
        "--dataset-type",
        variant,
        "--model",
        model,
        "--sample-size",
        str(args.sample_size),
    ]
    if args.force_restart:
        cmd.append("--force-restart")
    else:
        cmd.append("--continue")
    run_cmd(cmd, args.dry_run)

    recompute = [
        sys.executable,
        "evaluation/checkpoint_utils.py",
        "recompute",
        "--dataset-type",
        variant,
        "--model",
        model,
    ]
    run_cmd(recompute, args.dry_run)


def read_results(model: str, variant: str) -> pd.DataFrame:
    path = (
        JUDGE_DIR
        / "evaluation"
        / "checkpoints"
        / "models"
        / safe_name(model)
        / "results"
        / f"evaluation_results_{variant}.csv"
    )
    if not path.exists():
        print(f"Warning: missing checkpoint for model={model}, variant={variant}: {rel(path)}")
        return pd.DataFrame()
    df = pd.read_csv(path)
    if "status" in df.columns:
        df = df[df["status"].astype(str).str.lower() == "success"]
    return df


def prf(tp: int, fp: int, fn: int) -> Dict[str, float]:
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
    vds = fn / (tp + fn) if (tp + fn) else 0.0
    return {
        "precision": precision * 100.0,
        "recall": recall * 100.0,
        "f1": f1 * 100.0,
        "vds": vds * 100.0,
    }


def aggregate(df: pd.DataFrame, level: str, indices: Optional[List[int]] = None) -> Dict[str, float]:
    if df.empty:
        return {
            "tp": 0,
            "tn": 0,
            "fp": 0,
            "fn": 0,
            "precision": 0.0,
            "recall": 0.0,
            "f1": 0.0,
            "vds": 0.0,
            "n": 0,
        }
    work = df.copy()
    if indices is not None:
        wanted = set(indices)
        work = work[work["sample_index"].astype(int).isin(wanted)]
    tp = int(work.get(f"{level}_tp", pd.Series(dtype=int)).fillna(0).astype(int).sum())
    tn = int(work.get(f"{level}_tn", pd.Series(dtype=int)).fillna(0).astype(int).sum())
    fp = int(work.get(f"{level}_fp", pd.Series(dtype=int)).fillna(0).astype(int).sum())
    fn = int(work.get(f"{level}_fn", pd.Series(dtype=int)).fillna(0).astype(int).sum())
    metrics = prf(tp, fp, fn)
    return {"tp": tp, "tn": tn, "fp": fp, "fn": fn, "n": int(len(work)), **metrics}


def summarize(models: List[str], variants: List[str], output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    rows = []
    for model in models:
        for variant in variants:
            df = read_results(model, variant)
            dn_indices = denoised_indices(variant) if dataset_csv_path(variant).exists() else []
            for split, indices in [("full", None), ("denoised", dn_indices)]:
                for level in ["project", "function"]:
                    agg = aggregate(df, level, indices)
                    rows.append(
                        {
                            "model": model,
                            "variant": variant,
                            "split": split,
                            "level": level,
                            **agg,
                        }
                    )

    summary_path = output_dir / "rq1_summary.csv"
    fieldnames = [
        "model",
        "variant",
        "split",
        "level",
        "n",
        "tp",
        "tn",
        "fp",
        "fn",
        "precision",
        "recall",
        "f1",
        "vds",
    ]
    with summary_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    table_path = output_dir / "rq1_table.md"
    with table_path.open("w", encoding="utf-8") as fh:
        fh.write("| Model | Variant | Split | Level | Precision | Recall | F1 | VD-S |\n")
        fh.write("| --- | --- | --- | --- | ---: | ---: | ---: | ---: |\n")
        for row in rows:
            fh.write(
                f"| {row['model']} | {row['variant']} | {row['split']} | {row['level']} | "
                f"{row['precision']:.2f} | {row['recall']:.2f} | {row['f1']:.2f} | {row['vds']:.2f} |\n"
            )

    print(f"RQ1 summary written to {rel(summary_path)}")
    print(f"RQ1 table written to {rel(table_path)}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run and summarize SecJS RQ1 evaluation")
    parser.add_argument("--models", default=",".join(DEFAULT_MODELS), help="Comma-separated model names")
    parser.add_argument("--variants", default=",".join(DEFAULT_VARIANTS), help="Comma-separated dataset variants")
    parser.add_argument("--sample-size", type=int, default=1437, help="Number of dataset rows to evaluate")
    parser.add_argument("--output-dir", default="results/rq1", help="Output directory for RQ1 summaries")
    parser.add_argument("--skip-detection", action="store_true", help="Only aggregate existing checkpoints")
    parser.add_argument("--force-restart", action="store_true", help="Restart the first run for each model/variant")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without executing them")
    parser.add_argument("--no-env-check", action="store_true", help="Skip model API environment validation")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    load_env_file(REPO_ROOT / ".env")
    models = split_csv(args.models, DEFAULT_MODELS)
    variants = split_csv(args.variants, DEFAULT_VARIANTS)

    print("SecJS RQ1 evaluation")
    print(f"Models: {', '.join(models)}")
    print(f"Variants: {', '.join(variants)}")
    print(f"Sample size: {args.sample_size}")
    print(f"Mode: {'aggregate existing checkpoints' if args.skip_detection else 'run detection and aggregate'}")
    print()

    if not args.dry_run:
        validate_dataset(variants)
    else:
        missing = [v for v in variants if not dataset_csv_path(v).exists()]
        if missing:
            print("Dataset files are not present; continuing because --dry-run was set.")
            print()
    if not args.skip_detection and not args.no_env_check:
        ensure_model_env(models, JUDGE_DIR / "config" / "model_endpoints.json")

    if not args.skip_detection:
        print("=== RQ1 detection ===")
        for model in models:
            for variant in variants:
                run_detection(args, model, variant)

    if args.dry_run:
        return

    summarize(models, variants, REPO_ROOT / args.output_dir)


if __name__ == "__main__":
    main()
