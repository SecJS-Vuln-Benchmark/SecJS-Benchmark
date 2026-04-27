# ForgeJS

ForgeJS contains the data collection and benchmark construction pipeline used by SecJS. It is included so readers can inspect and rerun the dataset-building process even though the packaged ArenaJS dataset is released separately.

## Pipeline

1. Collect JavaScript-related CVE metadata from NVD and Mend.io.
2. Resolve GitHub repositories and patch commits.
3. Retrieve paired vulnerable and fixed project snapshots.
4. Extract file/function-level labels.
5. Generate robustness variants: noise, obfuscation, noise + obfuscation, and prompt injection.

## Usage

```bash
# Full collection and construction pipeline
python main.py --start 2022-01-01 --end 2025-08-10

# Augmentation only, after original data has been built
python main.py --only-augmentation \
  --augment-strategies noise obfuscated combined prompt_injection

# List available augmentation strategies
python main.py --list-strategies
```

## Environment

Set `NVD_API_KEY` to use authenticated NVD API requests. If it is not set, ForgeJS uses public NVD API access.

Generated files are written to `ForgeJS/data/` and project snapshots are written under `../ArenaJS/`.

Large generated CSV files and project snapshots are ignored by git.
