# ForgeJS – Dataset Generation Framework

ForgeJS automates the entire ArenaJS construction pipeline: collecting CVE intelligence, cloning/triaging GitHub projects, extracting vulnerable/fixed snippets, and producing augmented variants.

## Highlights

- **CVE harvesting** via NVD API + Mend.io mirrors  
- **Repository mining** for paired vulnerable/fixed commits  
- **Function-level labeling** with language-agnostic extraction  
- **Augmentation** strategies (noise, obfuscation, combined, prompt injection)

## Usage

```bash
# Full pipeline (steps 1–4)
python main.py --start 2022-01-01 --end 2022-03-31

# Augmentation only
python main.py --only-augmentation --augment-strategies obfuscated

# List strategies
python main.py --list-strategies
```

### Key Arguments

| Category | Flags | Description |
| --- | --- | --- |
| Pipeline | `--start`, `--end` | CVE date window (YYYY-MM-DD) |
|  | `--cvss-min` | Minimum CVSS score |
|  | `--use-api-key` | Whether to use an API key for NVD |
| Augmentation | `--only-augmentation` | Skip collection steps |
|  | `--augment-strategies` | `noise`, `obfuscated`, `combined`, `prompt_injection` |
|  | `--projects-dir` | Source projects (default `../ArenaJS/projects`) |
|  | `--augmented-projects-dir` | Output projects (default `../ArenaJS/augmented_projects`) |

## Outputs (`ForgeJS/data/`)

- `js_cve_dataset.csv` – Raw CVE metadata  
- `js_vulnerability_dataset.csv` – Project-level findings  
- `final_dataset.csv` – Consolidated dataset  
- `obfuscated_dataset.csv`, `noise_dataset.csv`, `noise_obfuscated_dataset.csv`, `prompt_injection_dataset.csv` – Optional augmented variants

## Augmentation Matrix

- **noise** – Inject distraction sinks without true sources  
- **obfuscated** – Apply JavaScript obfuscators/minifiers  
- **combined** – Sequential obfuscation + noise  
- **prompt_injection** – Insert misleading comments/prompts

## Notes

1. Configure a GitHub token if private or rate-limited repositories are required.  
2. Node.js tooling is mandatory for obfuscation.  
3. Long-running jobs support checkpoints/resume to survive interruptions.

## Requirements

- Python 3.8+ (pandas, requests, tqdm, beautifulsoup4, etc.)  
- Node.js with `javascript-obfuscator`, `terser`, `uglify-js`
