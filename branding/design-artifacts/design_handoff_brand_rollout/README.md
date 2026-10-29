# Handoff: Brand rollout — Core Connections + Ottawa Pessary Clinic

## Overview
Apply the finalized brand identity (new logo lockups, favicons/app icons, brand colours, patterns and logo motion) to the existing static website in the `core-connections-new` repo:
- **Core Connections Physiotherapy** — root pages (`index.html`, `home.html`, `about.html`, `services.html`, `team.html`, `fees.html`, `contact.html`, `directions.html`, `conditions.html`, `approach.html`, `careers.html`, `telehealth.html`, `signage-mockup.html`), styles in `css/style.css`, `css/splash.css`.
- **Ottawa Pessary Clinic** — `pessary/index.html`, `pessary/visit.html`, styles in `css/pessary.css`.

Scope is **brand only**: logos, favicons, colour tokens that the logos introduce, the brand pattern and motion. Do **not** change page layout, copy, or body/heading fonts (Fraunces/Inter on CC, DM Serif Display/Figtree on OPC) unless asked.

## About the design files
`Brand Guidelines.dc.html` is an HTML **design reference** (open it in a browser; it needs `support.js` beside it). It documents how the brand should look and behave. Don't ship it. Recreate the decisions in the site's existing plain HTML/CSS/JS.

The SVGs in `assets/brand/` **are production assets**: copy them into the repo as-is. The repo already has a `brand/` folder with these files; overwrite it with this set, and delete `brand/opc-pattern-leaves*.svg` (unused concept).

## Fidelity
High-fidelity. Logo files are final, with outlined type (no font dependency). Use exact hex values below.

## 1. Logo replacement

### Core Connections — header & footer (every root page)
Current markup (header ~line 36, footer ~line 156/194):
```html
<span class="brand-lockup"><img class="brand-lockup__mark" src="images/logo-mark.svg" alt="" width="45" height="34"><span class="brand-lockup__text"><b>Core Connections</b><span>Physiotherapy</span></span></span>
```
Replace with a single SVG lockup (the wordmark is now outlined Urbanist; no live text):
```html
<span class="brand-lockup"><img src="brand/cc-logo-horizontal.svg" alt="Core Connections Physiotherapy" width="190" height="35"></span>
```
- Header: height **36px** desktop, **30px** ≤ 720px; width auto. Aspect ratio is 5.36:1.
- Footer (dark ground `--color-primary-dark`): use `brand/cc-logo-horizontal-reverse.svg`.
- In `css/style.css` (lines ~306–336), drop `.brand-lockup__mark` / `__text` rules; keep `.brand-lockup{display:inline-flex;align-items:center;line-height:0}` and add `.brand-lockup img{height:36px;width:auto;display:block}` + mobile override.
- Keep the surrounding `<a>` and its `aria-label`. If the img sits inside a labelled link, `alt=""` is fine; otherwise use the alt above.
- `images/logo-mark.svg` can be replaced by `brand/cc-mark.svg` anywhere the mark appears alone (e.g. `splash.css` / splash screen).

### Ottawa Pessary Clinic — header & footer (`pessary/*.html`)
Current (line 66):
```html
<a class="brand" href="index.html" aria-label="Ottawa Pessary Clinic, home"><img src="logo-mark.svg" width="44" height="44" alt=""><span><b>Ottawa Pessary Clinic</b><small>Opening January 2027</small></span></a>
```
Replace with:
```html
<a class="brand" href="index.html" aria-label="Ottawa Pessary Clinic, home"><img src="../brand/opc-arc-logo-horizontal.svg" alt="" width="150" height="47"><small>Opening January 2027</small></a>
```
- Logo height **46px** desktop, **38px** ≤ 720px (aspect 3.19:1).
- Keep "Opening January 2027" as live text: `.brand small` stays as is but sits to the right of the logo, separated by a 1px `--line` vertical rule with 12px padding each side. Hide the `<small>` ≤ 520px.
- In `css/pessary.css` line 31–32: change `.brand img` to `height:46px;width:auto`; remove `.brand b` rule.
- Footer: the `<h2>Ottawa Pessary Clinic</h2>` heading in the first column becomes `<img src="../brand/opc-arc-logo-horizontal-reverse.svg" alt="Ottawa Pessary Clinic" height="44">`.
- Replace `pessary/logo-mark.svg` with `brand/opc-arc-mark.svg` contents (or point references to it).

### Hero illustration (optional but recommended)
`pessary/index.html` hero has a hand-built `<svg class="rings">` (navy ring + sage core). Replace it with the animated mark at ~320px wide:
```html
<img class="hero-mark" src="../brand/opc-arc-mark-animated.svg" alt="" width="320" height="284">
```

### Cross-links
Where each site links to the other ("In collaboration with Core Connections Physiotherapy", the `.top` bar and the `nav a.back` button), you may add the partner's mark at 20px height before the link text. Minimum sizes are below.

## 2. Usage rules (enforce in CSS)
- **Clear space** = x on all sides, where x = ⅓ of the mark's height. For a 36px CC lockup that's 12px; for a 46px OPC lockup that's ~15px.
- **Minimum size**: CC lockup 140px wide, OPC lockup 120px wide, either mark alone 20px. Below that, use the mark only.
- Never stretch, rotate, recolour, add shadows to, or place a logo on busy photography. On dark grounds use the `-reverse` files; for single-colour output use `-mono`.
- Co-branding: equal mark height, 1px divider, at least 2x between lockups.

## 3. Colour tokens
### Core Connections (logo colours; the site's existing violet tokens stay)
Add to `:root` in `css/style.css`:
```css
--brand-periwinkle: #5C68A0;      /* mark rings, subtitle */
--brand-periwinkle-deep: #3F4A87; /* wordmark */
--brand-night: #2E3566;           /* reverse ground used in brand assets */
--brand-lime: #8CC63F;            /* the core */
--brand-lime-mist: #EEF5DC;
```
Mist `#F6F4F9`, Ink `#1B1730`. Don't use lime for text.

### Ottawa Pessary Clinic
Existing in `css/pessary.css`: `--navy:#1f2f4d; --teal:#2b6a64; --sage:#7fae9f; --cream:#faf7f2`. Add:
```css
--coral: #D98574;      /* the logo ring; primary booking/CTA accent */
--coral-ink: #2A0F08;  /* text on coral (contrast ≥ 7:1) */
--sage-600: #5B9384;   /* supporting arc */
--sage-light: #9CC3B7; /* arc & descriptor on navy */
--sage-mist: #E4EEEA;  /* panels, pattern ground */
```
Proportion: 60 Cream · 20 Navy · 12 Sage · 8 Coral. Coral is used only for the ring and the primary action. Optionally switch `.btn` (primary) to `background:var(--coral);color:var(--coral-ink);border-color:var(--coral)` with hover `background:#C9705F`. Confirm with the client before changing CTA colour.

## 4. Favicons & app icons
Regenerate from SVG (e.g. `sharp`, `rsvg-convert` or `resvg`):

| Output | Source |
|---|---|
| `favicon.svg` (root) | `brand/cc-mark.svg` |
| `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico` (16+32) | `brand/cc-mark.svg` on transparent |
| `apple-touch-icon.png` 180, `android-chrome-192x192.png`, `android-chrome-512x512.png` | `brand/cc-app-icon.svg` |
| `pessary/favicon.svg` | `brand/opc-arc-mark.svg` |
| `pessary/favicon-32x32.png` | `brand/opc-arc-mark.svg` |
| `pessary/apple-touch-icon.png` 180 | `brand/opc-arc-app-icon.svg` |

Also update the duplicate set in `favicon/` and `site.webmanifest` `theme_color`: CC `#2E3566`, OPC `#1F2F4D`.

## 5. Patterns
Tileable SVGs for decorative backgrounds only, never behind body text:
- CC: `cc-pattern-light.svg` on `#F6F4F9` at `background-size:60px auto`; `cc-pattern-dark.svg` on `#2E3566`.
- OPC: `opc-pattern-light.svg` on `#FAF7F2` at `48px auto`; `opc-pattern-dark.svg` on `#1F2F4D`.

Suggested spots: CC footer or `section` hero panels, OPC `section.dark` (`#visit-flow`) and footer. Example:
```css
footer{background:#1F2F4D url(../brand/opc-pattern-dark.svg) center/48px auto repeat}
```

## 6. Motion
Animated SVGs are self-contained (CSS inside the SVG) and respect `prefers-reduced-motion` (they show the final frame).
- **CC "Converge"** (`cc-logo-animated.svg`, `cc-mark-animated.svg`): rings rotate −120°→0 and scale .55→1 over 1.6s `cubic-bezier(.2,.8,.2,1)`, staggered 120ms; core pops at 0.95s (`cubic-bezier(.3,1.7,.5,1)`); wordmark slides 14px in at 1.25s, subtitle +200ms; idle core pulse 8% every 4s.
- **OPC "Hold and breathe"** (`opc-arc-logo-animated.svg`, `opc-arc-mark-animated.svg`): sage arc rises 14px over 1.1s; coral ring draws clockwise from 12 o'clock at 0.55s over 1.4s; text slides in at 1.5s / 1.7s; idle ring breathes 6% on an 8s cycle.

Use animated files in **one place per site** only (splash/hero). Header logos stay static. Animations replay on each page load because they run inside `<img>`.

## Assets
All in `assets/brand/` (copy to repo `brand/`):
- `cc-mark(-reverse|-mono|-animated).svg`, `cc-logo-horizontal(-reverse|-mono).svg`, `cc-logo-stacked(-reverse).svg`, `cc-logo-animated.svg`, `cc-wordmark.svg`, `cc-app-icon.svg`, `cc-logo-construction.svg` (reference), `cc-pattern-light/dark.svg`
- `opc-arc-mark(-reverse|-mono|-animated).svg`, `opc-arc-logo-horizontal(-reverse|-mono).svg`, `opc-arc-logo-stacked(-reverse).svg`, `opc-arc-logo-animated.svg`, `opc-arc-app-icon.svg`, `opc-arc-logo-construction.svg` (reference), `opc-pattern-light/dark.svg`

Logo specs: wordmarks are Urbanist ExtraBold lowercase (−2% tracking) over Urbanist SemiBold caps, tracked so both lines share the same ink width. CC mark is 1.32× the text block height with a 0.26× gap; OPC mark is 1.42× with a 0.24× gap.

## Files
- `Brand Guidelines.dc.html` — full visual guidelines (open locally with `support.js`)
- `assets/brand/*.svg` — production logo, icon, pattern and motion files

## Checklist
- [ ] Copy SVGs to `brand/`, remove `opc-pattern-leaves*`
- [ ] Swap CC header/footer lockups on all root pages + CSS cleanup
- [ ] Swap OPC header/footer lockups on both pessary pages + CSS cleanup
- [ ] Replace OPC hero rings with animated mark
- [ ] Add colour tokens
- [ ] Regenerate favicons/app icons + manifests
- [ ] Apply patterns to footers/dark sections
- [ ] Check logo clear space and minimum sizes at 360px, 768px and 1280px widths
