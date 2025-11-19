#!/usr/bin/env python3
import os
import sys

try:
    from anthropic import Anthropic
except Exception as e:
    print("PING_ERR: anthropic sdk not available:", repr(e))
    sys.exit(1)

def main() -> int:
    try:
        client = Anthropic(base_url=os.environ.get("ANTHROPIC_BASE_URL"))
        resp = client.messages.create(
            model=os.environ.get("CLAUDE_MODEL", "claude-3-haiku-20240307"),
            max_tokens=8,
            messages=[{"role": "user", "content": "hello"}],
        )
        print("PING_OK", bool(getattr(resp, "id", None)))
        return 0
    except Exception as e:
        print("PING_ERR:", repr(e))
        return 1

if __name__ == "__main__":
    sys.exit(main())


