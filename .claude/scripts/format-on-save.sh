#!/usr/bin/env bash
# PostToolUse hook: auto-format files after Edit/Write operations
# Receives tool result JSON on stdin with the edited file path

set -euo pipefail

# Extract file path from the tool result JSON
FILE_PATH=$(echo "$CLAUDE_TOOL_INPUT" | grep -oP '"file_path"\s*:\s*"([^"]*)"' | head -1 | sed 's/.*"\([^"]*\)"/\1/')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format files prettier can handle
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md|*.html|*.yaml|*.yml)
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
    ;;
esac
