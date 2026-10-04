#!/usr/bin/env bash
# Shrink everything in images/ so the site stays quick.
#
#   npm run optimize-images
#
# Requires ImageMagick (`convert`). The single-file production build inlines
# every photo, so keep the files small: JPG max 1100px wide, PNG max 900px.

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick (convert) not found — install it first: sudo apt install imagemagick" >&2
  exit 1
fi

shopt -s nullglob
count=0

for file in images/*.jpg images/*.jpeg images/*.JPG images/*.JPEG; do
  tmp="${file%.*}.tmp.jpg"
  convert "$file" -resize '1100x>' -strip -interlace Plane -sampling-factor 4:2:0 -quality 78 "$tmp"
  mv "$tmp" "$file"
  echo "optimised $(basename "$file") → $(identify -format '%wx%h %b' "$file")"
  count=$((count + 1))
done

for file in images/*.png images/*.PNG; do
  tmp="${file%.*}.tmp.png"
  convert "$file" -resize '900x>' -strip -quality 92 "$tmp"
  mv "$tmp" "$file"
  echo "optimised $(basename "$file") → $(identify -format '%wx%h %b' "$file")"
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "No photos found in images/ — drop some in and run again."
else
  echo "Done. $count file(s) optimised. Rebuild with: npm run build"
fi
