# Security Policy

SecJS evaluates vulnerable open-source project snapshots. Use the artifact in isolated research environments and avoid running untrusted project code unless necessary.

## Secrets

Do not commit API keys, access tokens, or private endpoint URLs. JudgeJS reads model credentials from `.env` or environment variables. `.env` is ignored by git.

If a secret is accidentally committed:

1. Revoke or rotate the secret immediately.
2. Remove it from the repository.
3. Audit any logs or generated artifacts that may contain the secret.

## Reporting Issues

For security-sensitive issues in the artifact code or packaging, please open a private report through the repository hosting platform when available. For non-sensitive bugs, use a normal issue.
