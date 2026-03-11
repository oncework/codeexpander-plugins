#!/usr/bin/env bash
# Select a plugin and run its dev server (make dev).
# Usage: ./select-plugin-dev.sh [plugin-name]
#   e.g. ./select-plugin-dev.sh plugin-text
#   or   make dev PLUGIN=plugin-html

set -e
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# List @codeexpander/plugin-* packages that have a "dev" script (exclude plugin-types)
PLUGINS=()
for dir in packages/plugin-*/; do
  name=$(basename "$dir")
  [[ "$name" == "plugin-types" ]] && continue
  if [[ -f "$dir/package.json" ]] && grep -q '"dev":' "$dir/package.json" 2>/dev/null; then
    PLUGINS+=("@codeexpander/$name")
  fi
done

if [[ ${#PLUGINS[@]} -eq 0 ]]; then
  echo "No plugins with dev script found."
  exit 1
fi

# Optional: plugin name from argument or PLUGIN env (e.g. make dev PLUGIN=plugin-html)
TARGET="$1"
[[ -z "$TARGET" ]] && TARGET="$PLUGIN"

if [[ -n "$TARGET" ]]; then
  # Normalize: plugin-text or @codeexpander/plugin-text
  if [[ "$TARGET" != @* ]]; then
    TARGET="@codeexpander/$TARGET"
  fi
  for p in "${PLUGINS[@]}"; do
    if [[ "$p" == "$TARGET" ]]; then
      echo "Starting dev server for $p ..."
      exec pnpm --filter "$p" run dev
    fi
  done
  echo "Unknown plugin: $TARGET"
  echo "Available: ${PLUGINS[*]}"
  exit 1
fi

# Interactive select
echo "Select a plugin to run (pnpm run dev):"
echo ""
select pkg in "${PLUGINS[@]}"; do
  if [[ -n "$pkg" ]]; then
    echo ""
    echo "Starting dev server for $pkg ..."
    exec pnpm --filter "$pkg" run dev
  fi
done
