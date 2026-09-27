#!/usr/bin/env bash
# Desktop + mobile screenshots of local pages for visual QA.
# Usage: scripts/shot.sh <route> [<route>...]   e.g. scripts/shot.sh / /modules /about
set -euo pipefail
BASE="${BASE:-http://localhost:4321}"
OUT="${OUT:-/tmp/onnoy-shots}"
mkdir -p "$OUT"
for route in "$@"; do
  name=$(echo "$route" | sed 's#^/##; s#/#_#g'); [[ -z "$name" ]] && name=index
  google-chrome --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
    --window-size=1400,3400 --virtual-time-budget=4000 \
    --screenshot="$OUT/$name-desktop.png" "$BASE$route" 2>/dev/null
  google-chrome --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
    --window-size=390,2600 --virtual-time-budget=4000 \
    --screenshot="$OUT/$name-mobile.png" "$BASE$route" 2>/dev/null
  echo "$route -> $OUT/$name-{desktop,mobile}.png"
done
