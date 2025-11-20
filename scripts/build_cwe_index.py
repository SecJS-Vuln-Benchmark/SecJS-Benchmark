#!/usr/bin/env python3
"""Build a CWE index and extract full code samples.

Usage:
  python scripts/build_cwe_index.py --output-root docs/cwe_samples --index docs/cwe_index.json

The script scans every CSV inside dataset/data/*_dataset.csv, parses CWE ids,
collects metadata for each vulnerable sample, copies the vulnerable/fixed code
into the output tree, and writes a JSON index describing all samples grouped by
CWE.
"""

import argparse
import csv
import json
import os
import re
import shutil
import sys
from collections import defaultdict
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "dataset" / "data"
CSV_GLOB = "*_dataset.csv"

SLUG_RE = re.compile(r"[^a-zA-Z0-9]+")

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = SLUG_RE.sub("-", value)
    return value.strip("-") or "sample"


def cwe_filename(value: str) -> str:
    """Return a filesystem-safe filename for CWE ids."""
    safe = re.sub(r"[^a-zA-Z0-9_-]+", "_", value.strip().lower())
    return safe or "cwe"


def parse_multi(value: str) -> list:
    if not value:
        return []
    parts = re.split(r"[;,]", value)
    return [p.strip() for p in parts if p.strip()]


def parse_paths(value: str) -> list:
    if not value:
        return []
    parts = [p.strip() for p in value.split(";") if p.strip()]
    return parts


def resolve_path(rel: str) -> Optional[Path]:
    """Resolve relative path, with fallback to dataset/ prefix."""
    candidates = [
        ROOT / rel,
        ROOT / "dataset" / rel.lstrip("/"),
    ]
    for cand in candidates:
        if cand.exists():
            return cand
    return None


def copy_file(src: Path, dest: Path) -> str:
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return os.fspath(dest.relative_to(ROOT))


def build_index(output_root: Path) -> tuple[dict, dict]:
    copied_cache: dict[Path, str] = {}
    index = defaultdict(list)
    csv_files = sorted(DATA_DIR.glob(CSV_GLOB))
    if not csv_files:
        raise SystemExit(f"No dataset CSVs found under {DATA_DIR}")

    for csv_file in csv_files:
        with csv_file.open(newline='', encoding='utf-8') as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                cwes = parse_multi(row.get('cwe_ids', ''))
                if not cwes:
                    continue
                vuln_paths = parse_paths(row.get('vulnerable_code_paths', ''))
                fixed_paths = parse_paths(row.get('fixed_code_paths', ''))
                if not vuln_paths and not fixed_paths:
                    continue
                project = row.get('project_name', 'unknown-project')
                project_slug = slugify(project)
                dataset_variant = csv_file.stem.replace('_dataset', '')
                cve_ids = row.get('cve_ids', '').strip()
                summary = row.get('summaries_merged', '').strip()
                commit_shas = row.get('commit_shas', '').strip()
                publish_date = row.get('publish_date_last', '').strip()
                severity = row.get('severity_breakdown', '').strip()
                project_type = row.get('project_type', '').strip()

                file_entries = []
                max_len = max(len(vuln_paths), len(fixed_paths))
                for idx in range(max_len):
                    vuln_src = resolve_path(vuln_paths[idx]) if idx < len(vuln_paths) else None
                    fixed_src = resolve_path(fixed_paths[idx]) if idx < len(fixed_paths) else None

                    copied_vuln = None
                    copied_fixed = None

                    if vuln_src and vuln_src.exists():
                        if vuln_src in copied_cache:
                            copied_vuln = copied_cache[vuln_src]
                        else:
                            dest = output_root / project_slug / f"sample_{idx}_vuln{vuln_src.suffix}"
                            copied_vuln = copy_file(vuln_src, dest)
                            copied_cache[vuln_src] = copied_vuln
                    if fixed_src and fixed_src.exists():
                        if fixed_src in copied_cache:
                            copied_fixed = copied_cache[fixed_src]
                        else:
                            dest = output_root / project_slug / f"sample_{idx}_fixed{fixed_src.suffix}"
                            copied_fixed = copy_file(fixed_src, dest)
                            copied_cache[fixed_src] = copied_fixed

                    if copied_vuln or copied_fixed:
                        file_entries.append({
                            "vulnerable_path": copied_vuln,
                            "fixed_path": copied_fixed,
                            "original_vulnerable": os.fspath(vuln_src) if vuln_src else None,
                            "original_fixed": os.fspath(fixed_src) if fixed_src else None,
                        })

                if not file_entries:
                    continue

                entry_metadata = {
                    "project": project,
                    "dataset": dataset_variant,
                    "project_type": project_type,
                    "cve_ids": cve_ids,
                    "commit_shas": commit_shas,
                    "publish_date": publish_date,
                    "severity": severity,
                    "summary": summary,
                    "files": file_entries,
                }

                for cwe in cwes:
                    index[cwe].append(entry_metadata)
    return index, copied_cache


def write_cwe_shards(index: dict, manifest_path: Path, shard_root: Path) -> None:
    shard_root.mkdir(parents=True, exist_ok=True)
    manifest = {}

    for cwe, entries in sorted(index.items()):
        shard_name = f"{cwe_filename(cwe)}.json"
        shard_path = shard_root / shard_name
        with shard_path.open('w', encoding='utf-8') as fh:
            json.dump(entries, fh, ensure_ascii=False, separators=(',', ':'))
        manifest[cwe] = {
            "count": len(entries),
            "file": os.fspath(shard_path.relative_to(ROOT)),
        }

    with manifest_path.open('w', encoding='utf-8') as fh:
        json.dump(manifest, fh, ensure_ascii=False, separators=(',', ':'))


def main() -> None:
    parser = argparse.ArgumentParser(description="Build CWE index and extract code samples")
    parser.add_argument("--output-root", default="docs/cwe_samples", help="Directory to store extracted code")
    parser.add_argument("--index", default="docs/cwe_index.json", help="Path to write the JSON index")
    parser.add_argument("--index-dir", default="docs/cwe_index", help="Directory to store per-CWE JSON shards")
    args = parser.parse_args()

    output_root = (ROOT / args.output_root).resolve()
    index_path = (ROOT / args.index).resolve()
    shard_root = (ROOT / args.index_dir).resolve()

    output_root.mkdir(parents=True, exist_ok=True)
    index, copied = build_index(output_root)
    index_path.parent.mkdir(parents=True, exist_ok=True)
    write_cwe_shards(index, index_path, shard_root)

    print(f"Indexed {len(index)} CWE groups → {index_path} (shards under {shard_root})")
    print(f"Copied {len(copied)} unique files into {output_root}")

if __name__ == "__main__":
    main()
