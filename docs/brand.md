# anik8 brand — build reference

The visual rules for code. Source of truth for the look is the Canva "anik8 Brand Guidelines" deck; this file is its implementation spec.

## Colour tokens

Define these once as CSS custom properties (Tailwind v4 `@theme`); components use tokens, never raw hex.

| token              | hex       | use                                                                        |
| ------------------ | --------- | -------------------------------------------------------------------------- |
| `--color-white`    | `#ffffff` | background, always                                                         |
| `--color-ink`      | `#1d1630` | text, wordmark, frames, button shadows                                     |
| `--color-red`      | `#d62828` | the one accent: wordmark shadow, hearts, primary button, selection corners |
| `--color-orange`   | `#ff7a1a` | XP bars and XP-only highlights                                             |
| `--color-lavender` | `#8b7bb0` | secondary graphics (folders, outlines)                                     |
| `--color-mist`     | `#b3a5d1` | soft accents, never body text                                              |
| `--color-haze`     | `#e7e3ef` | borders, grid lines, dividers                                              |
| `--color-muted`    | `#6b6480` | secondary text (passes AA on white)                                        |
| `--color-panel`    | `#f6f4fa` | placeholder/inset surfaces                                                 |

Sparkle squares use `#e4dff0`, `#d9d1ea`, `#f3c6c6`.

**Dark theme** (decision 6): the same token names get black-based values under `[data-theme='dark']` in `src/app/globals.css`. `white` stays "page background" and `ink` stays "text", so components need no dark-mode code. Red is lifted to `#f04848` in dark because `#d62828` fails AA on the night background. `--color-term` stays dark in both themes.

**Exception:** social app icons (`src/config/socials.ts`) use each platform's own brand colours. Those are third-party marks, the only raw hex outside the token list.

## Type

- **Display:** Press Start 2P (OFL, self-hosted via `next/font/google`). Headlines, labels, mode names, wordmark. Font sizes are multiples of 8 so every font-pixel is the same size.
- **Reading:** Manrope (OFL, self-hosted via `next/font/google`) for body, buttons, captions. (Decision 11 pending — Manrope is the default.)
- **Code:** system mono (`ui-monospace, SFMono-Regular, Menlo, monospace`).

## Wordmark

Lowercase `anik8` drawn from the Press Start 2P pixel grid below (39 × 7 cells), ink cells plus the same cells in red offset by half a cell down-right. Render as SVG `<rect>`s or a CSS grid, never as live text, so it is identical on every device.

```
...................XX...XX.......XXXX..
........................XX......XX...X.
.XXXXX..XXXXXX....XXX...XX...XX.XXX..X.
.....XX.XX...XX....XX...XX..XX...XXXX..
.XXXXXX.XX...XX....XX...XXXXX...X..XXXX
XX...XX.XX...XX....XX...XX..XX..X....XX
.XXXXXX.XX...XX..XXXXXX.XX...XX..XXXXX.
```

Cell sizes in use: 4 px (nav), 16 px (hero), 20 px (deck covers). The live README header uses the same grid at 12 px.

## Pixel motifs

- **Heart:** 7 × 6 grid `.XX.XX. / XXXXXXX / XXXXXXX / .XXXXX. / ..XXX.. / ...X...`; full = red, empty = `#e4dff0`; five hearts, four full.
- **XP bar:** `#efecf5` track, orange fill, small `XP` label in muted.
- **Pixel window:** square corners, 3 px ink frame, 26 px title bar with Press Start 2P title and a pixel × box, 6 px offset shadow in haze.
- **Controller button:** ink 3 px border, 6 px ink offset shadow that collapses on press; round letter key (A red-on-white / B white-on-ink).
- **Selection corners:** red L-brackets, 6 px thick, around the selected item.
- **Grid canvas:** 32 px haze grid lines at ~35 % opacity.

## Sprites

Cut every sprite from `brand/anik8-looks.png` (1200 × 800, transparent). Crop boxes (x0, y0, x1, y1), then trim to the alpha bounding box:

- Looks, row 1 (erase the title pill `440,0 → 760,38` first): default `68,31,241,252` · hoodie `271,31,451,252` · work `455,31,709,252` · creator `709,31,923,252` · traveler `931,31,1137,252`
- Looks, row 2: hackathon `43,288,263,501` · formal `289,288,474,501` · gamer `495,288,697,501` · builder `732,288,920,501` · chill `936,288,1146,501`
- Run cycle (y `590 → 759`): `53–166`, `195–311`, `334–450`, `472–591`, `613–729`, `750–865`, `886–1001`, `1027–1136`

Render at 1×, 2× or 3× with `image-rendering: pixelated`; downscale only by exact halves.

## Modes

Ten looks = ten modes (requirements §4a): 1 default · 2 hoodie · 3 work · 4 creator · 5 traveler · 6 hackathon · 7 formal · 8 gamer · 9 builder · 10 chill. Each mode has a 32 × 32 favicon of that look's head (hand-pixelled in LibreSprite/Piskel; generated crops are drafts).

## Sprites wanted (cursor runner moods)

The cursor runner (`src/components/layout/RunnerCursor.tsx`) needs poses the sheet does not have yet. Make them **in the same style as the run cycle**: same character, outfit (default look: cap, glasses, purple tee, jeans), outline, shading, palette and **height (169 px)**, facing **right**, on a transparent background, with a shared baseline.

| mood  | frames | pose                                                                            |
| ----- | ------ | ------------------------------------------------------------------------------- |
| idle  | 2      | standing relaxed, arms at sides; frame 2 = tiny breath (shoulders 1–2 px up)    |
| tired | 2      | bent forward, both hands on stomach, mouth open panting; frame 2 = chest heaves |

Deliver as `brand/anik8-moves.png` (one row: idle 1, idle 2, tired 1, tired 2, ~120 px apart) and add their x ranges here, like the run cycle. `pnpm sprites` will then cut them, and the runner swaps them in for the current stand-ins (run frame 1 + pixel sweat). Sleep is already covered: a pixel bed prop with the default-look head tucked in.
