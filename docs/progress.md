# Where the site is (10 Nov 2026)

A snapshot of what's built, how the pieces fit, and what's still open. Scope lives in
[requirements.md](requirements.md); build order and done-checks in [roadmap.md](roadmap.md).

## Pages

| route                         | what it is                                                        |
| ----------------------------- | ----------------------------------------------------------------- |
| `/`                           | READ mode home: hero canvas, then every home section (below)      |
| `/experience/<slug>/`         | one page per job: titles held, everything done, tech used, photos |
| `/play/`                      | PLAY mode: the 3D island of Aniket's story                        |
| `/kit/`                       | design-system sheet (noindex)                                     |
| `/build.json`, `/sitemap.xml` | build info for `/infra`, sitemap                                  |

## Home, top to bottom

1. **Hero** (`src/components/hero/`, content in `src/config/hero.ts`, `hud.ts`, `socials.ts`): HUD, pixel wordmark, name and headline, A/B buttons, intro + reels, figurines, cartridges, social app icons, typeable `whoami.sh` terminal (`src/lib/terminal.ts`).
2. **Experience** (`src/components/experience/`, `src/config/experience.ts`): one pinned chapter per company, newest first: company heading + website/LinkedIn, the title ladder (promotions), what I did, tech chips with real logos, and the place it happened as a duotone illustration on layered hills. The runner moves along the road at the bottom as you scroll.
3. **Projects** (`src/components/sections/QuestLog.tsx`, `src/config/quests.ts`): current quest + project cards.
4. **Player 1** (`src/components/github/`): flip card (GitHub picture → portrait) and the GitHub contribution graph with streaks, drawn at build time.
5. **Skills** (`src/components/skills/`, `src/config/skills.ts`): 106 skills in 8 categories, each a logo tile that opens a card with a take, GitHub numbers and where it was used at work.
6. Broadcast, logs, high scores, CONTINUE?, footer.

## PLAY mode (`/play/`)

- `src/components/play/PlayGame.tsx`: overlay: loading, read-mode exit, timeline, chapter + "found" cards (cookie jar included), scroll/swipe-to-walk, chapter list.
- `World.tsx` lays everything out from `src/config/lore.ts` (chapters + places); `Player.tsx` moves the 3D figure (`models/Avatar.tsx`) with eased velocity, smooth turning and colliders; `Nature.tsx` grows the island; `models/` holds every prop.
- Add a life detail: one line in `places` in `src/config/lore.ts` (model, position, optional story). New prop shapes go in `models/life.tsx` + `models/registry.tsx`.

## Data scripts (run, then commit the output)

| script                | writes                                          | from                                                  |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| `pnpm sprites`        | `src/assets/sprites/*` + favicon                | `brand/anik8-looks.png`                               |
| `pnpm scenes`         | `src/assets/scenes/*-{1,2}.png`                 | `media/scenes/*` (credits: `media/scenes/CREDITS.md`) |
| `pnpm tech-icons`     | `public/tech/*.svg`, `src/data/tech-icons.json` | Iconify "logos" + simple-icons (CC0)                  |
| `pnpm tech-stats`     | `src/data/github-tech.json`                     | public repos of `anik8-codes`                         |
| `pnpm github-profile` | `src/data/github-profile.json`                  | GitHub GraphQL (contributions, stars, followers)      |

## Checks

`pnpm check` · `pnpm lint` · `pnpm test` (unit, pure logic in `src/lib/`) · `pnpm knip` · `pnpm build` · `pnpm test:e2e` (Playwright + axe on `/`, `/kit`, an experience page and `/play`). CI runs the same plus gitleaks, Lighthouse budgets and a link check.

## Open

- **Content:** LinkedIn + Instagram posts and photos per chapter (needs the data exports), which hackathons were wins or mentoring, job photos, the draft takes in `skills.ts`, reels and the intro video.
- **Pages linked but not built:** quests, blog, lore, learn, book, now, infra.
- **Infra:** Cloudflare account + domain for the deploy (T04/T05); decision 12 (JS budget).
