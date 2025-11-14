# GitHub Setup Guide

Use this checklist to reproduce the public repository and GitHub Pages site.

## 1. Create / Sign in to GitHub
1. Visit https://github.com/signup
2. Register the account `SecJS-Vuln-Benchmark` (or another name if already taken)
3. Verify your email address

## 2. Create the repository
1. Go to https://github.com/new
2. Repository name: `SecJS-Benchmark`
3. Description: `The first JavaScript vulnerability detection benchmark framework and dataset`
4. Visibility: **Public**
5. Do *not* initialize with a README (we already have one locally)
6. Click **Create repository**

## 3. Push local content
```bash
# From the project root
git remote set-url origin https://github.com/SecJS-Vuln-Benchmark/SecJS-Benchmark.git
# or: git remote add origin ... (if the remote does not exist)
git push -u origin master
```

## 4. Enable GitHub Pages
1. Open `Settings → Pages`
2. Source: **Deploy from a branch**
3. Branch: `master` (or `main`), Folder: `/docs`
4. Click **Save**
5. Wait 5–10 minutes for the first build to finish

The site will be available at:
```
https://secjs-vuln-benchmark.github.io/SecJS-Benchmark/
```

## 5. Optional automation via API
If you prefer scripting, call the GitHub REST API:
```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <TOKEN>" \
  https://api.github.com/repos/SecJS-Vuln-Benchmark/SecJS-Benchmark/pages \
  -d '{"source":{"branch":"master","path":"/docs"}}'
```

## 6. Next steps
- Upload dataset archives and code as they become public
- Tag releases once milestones are ready
- Update `docs/index.html` whenever stats or instructions change
