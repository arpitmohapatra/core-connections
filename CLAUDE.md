# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static (HTML/CSS/JS, no build step, no framework) marketing site for Core Connections Physiotherapy, deployed to GitHub Pages at `https://arpitmohapatra.github.io/core-connections/`. Eight pages at the repo root: `index.html`, `services.html`, `fees.html`, `team.html`, `about.html`, `contact.html`, `policies.html`, `404.html`. Each page repeats the same header/footer markup inline — there is no templating engine, so shared markup changes (nav links, footer columns, social URLs) must be edited in all eight files.

## Commands

- **Preview locally:** `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/`.
- **Rebuild images after touching source photos:** `bash tools/build-images.sh` (requires macOS `sips`, which ships with the OS, and `cwebp` — `brew install webp`). Re-run any time a new photo is selected or an existing one needs a different crop/rotation.
- No lint, test, or build commands — there's nothing to compile.

## Critical: all paths must be relative

The site is served from a **project subpath** (`/core-connections/`), not domain root. Every `href`, `src`, and manifest path is relative (`assets/css/main.css`, `services.html`, not `/assets/...`). A root-relative path silently resolves to the wrong host (`arpitmohapatra.github.io/assets/...`) and 404s in production while looking fine in some local setups. When adding new links or assets, keep them relative — this has already caused a real bug class once (favicon/manifest paths from the original brand asset delivery were root-relative and had to be rewritten).

## Image pipeline (`tools/build-images.sh`)

Source photography lives in `photos for website/` and `in clinic photos/` at the repo root — **these are gitignored and exist only on the machine that ran the original shoot import**. Nothing under them is ever committed; only the processed output in `assets/img/` (which *is* committed) ships to the site. If those source folders are missing, the build script simply can't run — that's expected on a fresh clone, not a bug.

The script rotates, cover-fit crops, and downsamples a curated list of source photos into responsive `.jpg` + `.webp` pairs at fixed widths. Two things about it are non-obvious:

- **None of the source JPEGs carry an EXIF orientation tag**, but several were shot with the camera turned on its side. The per-file rotation angle in the script was set by opening each photo and eyeballing it, not derived from metadata — confirmed by trial and error (a 90° guess that looked plausible turned out upside-down; the correct angle was 270°). If you add a new source photo, preview it before guessing its rotation.
- `sips` will **pad with black bars instead of cropping** if you resample-then-crop using the wrong dimension as the resample target (e.g. resampling by width when the source is short and wide, then requesting a tall crop). The script picks whichever dimension (width or height) guarantees both target dimensions are available before cropping — don't simplify this back to a single fixed `resampleWidth`.
- The script also never rotates or crops a file onto itself in one `sips` call (write to a fresh temp path, then `mv` it into place). In-place `sips -r` output proved unreliable during development.

## Design tokens

One CSS file, `assets/css/main.css`, using CSS custom properties for light/dark themes (`:root` + `:root[data-theme="dark"]` + a `prefers-color-scheme` media query, all three kept in sync manually — there's no build step to generate them from a single source). Brand accent is periwinkle/indigo (from the clinic's actual logo), with a small green accent reserved for emphasis only. Display font is self-hosted Outfit (`assets/fonts/`, SIL OFL — license text in `assets/fonts/OFL.txt`); body text uses the system font stack. Icons are inlined Tabler icon SVGs (MIT), not a hand-rolled set — copy the `<path>` markup from an existing icon usage rather than drawing new glyphs.

## Content decisions worth knowing before editing

- **Booking link** points to Juvonno (`coreconnections.juvonno.com`), not Jane App. The clinic's own site is inconsistent about this (Jane App is mentioned elsewhere for records storage); Juvonno was chosen as the primary CTA because it's what the live production homepage uses.
- **Per-practitioner weekly hours are intentionally omitted** from `team.html`. The source bios had conflicting/stale hour grids for at least one therapist, and clinic hours change often enough that hardcoding them on a static site goes stale fast — availability is left to the booking link instead.
- Two practitioners (Monate, Kelly) have leave-status notes on `team.html` reflecting real leave dates found on the clinic's live site at the time this was built. These will need to be updated or removed by hand once their status changes — nothing here is date-driven.
- Fee schedule on `fees.html` is the clinic's real 2026 pricing, sourced from their live site. If it needs updating in the future, all six fee tables plus the misc-fees table are separate blocks in that one file.
