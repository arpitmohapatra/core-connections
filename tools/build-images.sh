#!/usr/bin/env bash
# Builds every responsive image the site ships from the raw source photography.
#
# Why this exists: the source files in "photos for website/" and "in clinic photos/"
# are 1.5-15 MB each, up to 6000x4000, and are gitignored (they live only on this
# machine). This script rotates, crops and downsamples a curated selection of them
# into assets/img/, which IS committed. Re-run it any time the source photos change.
#
# Requires only macOS `sips` (ships with the OS) and `cwebp` (brew install webp).
# No ImageMagick, no Node, no Python image libs.
#
# Rotation note: none of the source JPEGs carry an EXIF orientation tag (verified
# with `sips -g orientation`), but several were shot with the phone/camera turned
# on its side. The ROTATE column below was set by opening each file and eyeballing
# it - it is not derived from metadata. If a new photo is added, preview it first
# (`sips -g pixelWidth -g pixelHeight file.jpg` plus an actual look) before guessing.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_A="$ROOT/photos for website"
SRC_B="$ROOT/in clinic photos"
OUT="$ROOT/assets/img"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CWEBP="${CWEBP_BIN:-cwebp}"
command -v sips >/dev/null || { echo "sips not found (macOS only)"; exit 1; }
command -v "$CWEBP" >/dev/null || { echo "cwebp not found (brew install webp)"; exit 1; }

# ---------------------------------------------------------------------------
# process_image SRC DEST_BASENAME ROTATE_DEG CROP WIDTHS
#   SRC             absolute path to the source photo
#   DEST_BASENAME   output path under assets/img, no extension (e.g. "team/heather")
#   ROTATE_DEG      clockwise degrees to rotate before anything else (0 if upright)
#   CROP            "none" | "portrait" (4:5 center crop) | "square" (1:1 center crop)
#   WIDTHS          space-separated list of output widths, e.g. "480 960 1600"
# ---------------------------------------------------------------------------
process_image() {
  local src="$1" dest="$2" rotate="$3" crop="$4" widths="$5"
  local out_dir; out_dir="$OUT/$(dirname "$dest")"
  mkdir -p "$out_dir"

  local base; base="$(basename "$dest")"
  local work_full="$WORK/${base}-full.jpg"
  cp "$src" "$work_full"

  if [ "$rotate" != "0" ]; then
    # Never rotate a file onto itself in one sips invocation - write to a
    # fresh path and swap it in, so a truncated/no-op write can't slip through.
    local rotated="$WORK/${base}-rotated.jpg"
    sips -r "$rotate" "$work_full" --out "$rotated" >/dev/null
    mv "$rotated" "$work_full"
  fi

  if [ "$crop" != "none" ]; then
    local cw ch
    case "$crop" in
      portrait) cw=2000; ch=2500 ;;
      square)   cw=2000; ch=2000 ;;
    esac
    # Cover-fit: resample by whichever dimension guarantees BOTH dims end up
    # >= target after the resize, so the following crop trims real content
    # instead of sips padding the shortfall with black bars.
    local sw sh
    sw=$(sips -g pixelWidth "$work_full" | awk '/pixelWidth/{print $2}')
    sh=$(sips -g pixelHeight "$work_full" | awk '/pixelHeight/{print $2}')
    local resampled="$WORK/${base}-resampled.jpg"
    if awk -v sw="$sw" -v sh="$sh" -v cw="$cw" -v ch="$ch" 'BEGIN{exit !(sw*ch > sh*cw)}'; then
      sips --resampleHeight "$ch" "$work_full" --out "$resampled" >/dev/null
    else
      sips --resampleWidth "$cw" "$work_full" --out "$resampled" >/dev/null
    fi
    mv "$resampled" "$work_full"
    local cropped="$WORK/${base}-cropped.jpg"
    sips --cropToHeightWidth "$ch" "$cw" "$work_full" --out "$cropped" >/dev/null
    mv "$cropped" "$work_full"
  fi

  for w in $widths; do
    local jpg="$OUT/${dest}-${w}.jpg"
    local webp="$OUT/${dest}-${w}.webp"
    sips --resampleWidth "$w" "$work_full" --out "$jpg" >/dev/null
    "$CWEBP" -quiet -q 82 "$jpg" -o "$webp"
  done

  echo "  built ${dest}-{${widths// /,}}.{jpg,webp}"
}

echo "Building images into $OUT"
echo

echo "Hero"
process_image "$SRC_A/20240213_132448.jpg" "hero/home" 0 none "480 960 1600 2400"

echo "Team headshots (portrait crop)"
process_image "$SRC_A/Heather in therapy room.jpg"            "team/heather"    0  portrait "480 800"
process_image "$SRC_A/Monate 10 - headshot.jpeg"               "team/monate"     0  portrait "480 800"
process_image "$SRC_A/Sue holding spine (landscape).JPG"       "team/sue"        0  portrait "480 800"
process_image "$SRC_A/Galia - Headshot (portrait).jpeg"        "team/galia"      270 portrait "480 800"
process_image "$SRC_A/Pratyusha - Edited Headshot.jpg"          "team/pratyusha"  0  portrait "480 800"
process_image "$SRC_A/Kelly - Headshot.jpeg"                    "team/kelly"      270 portrait "480 800"

echo "Service photography"
process_image "$SRC_A/DSC06522.jpeg"                            "service/pelvic-health"   0 none "480 960 1600"
process_image "$SRC_A/20240213_135045.jpg"                      "service/prenatal"        0 none "480 960 1600"
process_image "$SRC_A/Kelly + pt (vestibular rehab) (Portrait)4.jpeg" "service/vestibular" 0 portrait "480 800"
process_image "$SRC_A/Monate & Heather - Pessary explanation.JPG"     "service/pessary"    0 none "480 960 1600"
process_image "$SRC_A/Pratyusha + cupping back (male).jpeg"     "service/cupping"         0 none "480 960 1600"
process_image "$SRC_A/Monate - hypopressives (landscape).jpeg"  "service/hypopressives"   0 none "480 960 1600"
process_image "$SRC_A/Galia - Yoga - cross legged (landscape).jpeg" "service/physioyoga"  0 none "480 960 1600"

echo "About / story"
process_image "$SRC_A/Monate & Heather.JPG"                     "about/our-story"         0 none "480 960 1600"
process_image "$SRC_A/DSC06492.jpeg"                             "about/philosophy"        0 none "480 960 1600"

echo "Contact / location"
process_image "$SRC_A/CLINIC - Close up.JPG"                    "contact/exterior-sign"   90 none "480 960 1600"

echo "Stat band (photo-overlay, per client reference)"
process_image "$SRC_A/20240213_133944.jpg"                      "hero/stat-band"          0 none "640 1200 2000"

echo
du -sh "$OUT" | sed 's/^/Total output size: /'
