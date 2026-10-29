#!/bin/sh
# Render brochure/trifold.html to a 2-page US Letter landscape PDF with Brave (headless).
# Usage: brochure/build-pdf.sh   (run from anywhere)
set -e
cd "$(dirname "$0")"
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
"$BRAVE" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 \
  --print-to-pdf="$PWD/core-connections-trifold.pdf" "file://$PWD/trifold.html"
echo "wrote $PWD/core-connections-trifold.pdf"
