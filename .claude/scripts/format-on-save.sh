#!/usr/bin/env bash
# PostToolUse hook: auto-format files after Edit/Write operations
# Receives tool input JSON on stdin

set -uo pipefail

# Read stdin
INPUT=$(cat)

# Extract file path using node (avoids grep -P locale issues)
FILE_PATH=$(echo "$INPUT" | node -e "
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try { const o = JSON.parse(d); console.log(o.file_path || ''); }
    catch { console.log(''); }
  });
" 2>/dev/null || true)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format files prettier can handle
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md|*.html|*.yaml|*.yml)
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
    ;;
esac
