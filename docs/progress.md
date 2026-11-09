# Where the site is (10 Nov 2026)

A snapshot of what's built, how the pieces fit, and what's still open. Scope lives in
[requirements.md](requirements.md); build order and done-checks in [roadmap.md](roadmap.md).

## Pages

| route                         | what it is                                                          |
| ----------------------------- | ------------------------------------------------------------------- |
| `/`                           | READ mode home: hero canvas, then every home section (below)        |
| `/experience/<slug>/`         | one page per job: titles held, everything done, tech used, photos   |
| `/play/`                      | PLAY mode: an open 3D island, one place per chapter of the story    |
| `/projects/<slug>/`           | one page per project: facts, numbers, how it works, work done       |
| `/llms.txt`, `/index.md`      | the site as Markdown for AI assistants (GEO); also `/llms-full.txt` |
| `/kit/`                       | design-system sheet (noindex)                                       |
| `/build.json`, `/sitemap.xml` | build info for `/infra`, sitemap                                    |

## Home, top to bottom

0. **Swarm intro** (`src/components/layout/SwarmLoader.tsx`, engine `src/lib/swarm-build.ts`): once per session on `/`, named cursor agents trace boxes around the already-visible hero (our own take on Joel Califa's Swarm). The intro never hides content or delays reading, and ends within 4.5 seconds. Visitors sent by an AI assistant (ChatGPT, Perplexity, …) get a hello. Click/Esc skips; off under reduced motion and without JS.
1. **Hero** (`src/components/hero/`, content in `src/config/hero.ts`, `hud.ts`, `socials.ts`): HUD, pixel wordmark, name and headline, A/B buttons, intro + reels, figurines, cartridges, social app icons, typeable `whoami.sh` terminal (`src/lib/terminal.ts`).
2. **Experience** (`src/components/experience/`, `src/config/experience.ts`): one pinned chapter per company, newest first: company heading + website/LinkedIn, the title ladder (promotions), what I did, tech chips with real logos, and the place it happened as a duotone illustration on layered hills. The runner moves along the road at the bottom as you scroll.
3. **Projects** (`src/components/sections/QuestLog.tsx`, `src/config/quests.ts`): compact cards (screenshot, name, one line, year · stack) linking to `/projects/<slug>/`.
4. **Player 1** (`src/components/github/`): flip card (GitHub picture → portrait) and the GitHub contribution graph with streaks, drawn at build time.
5. **Skills** (`src/components/skills/`, `src/config/skills.ts`): 106 skills in 8 categories, each a logo tile that opens a card with a take, GitHub numbers and where it was used at work.
6. **FAQ** (`src/config/faq.ts`, answers built from the other configs, plus FAQPage JSON-LD), CONTINUE?, footer (with the hanging anik8 and "for agents" links).

## PLAY mode (`/play/`)

Our own engine in `src/lib/world/` (plain three.js on WebGPU with a WebGL 2 fallback, Rapier physics), techniques studied from Bruno Simon's folio-2025 (MIT). Models: Kenney CC0 kits in `public/play/models/`.

- `look.ts`: the toon material (soft shadow band tinted violet, bounce light, fog into a sky gradient) and the sun.
- `nature.ts`: island ground, sea with foam, endless wind-blown grass, leaf-card bushes.
- `player.ts` + `physics.ts`: character controller (walk, run, jump, push bricks), colliders.
- `view.ts`: long-lens follow camera, drag to pan, scroll/pinch to zoom.
- `life.ts`: clouds, coins, villagers, birds, chapter signs, story markers.
- Layout lives in `src/config/world.ts`; the stories in `places` (`src/config/lore.ts`).

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

## Site-wide

- **Swarm intro** on the first home visit, **music** (an original Web Audio chiptune, off by default), **SEO/GEO**: per-page canonical + Open Graph, a generated share card, Person/WebSite JSON-LD, `robots.txt`, `llms.txt`.
- **Loading:** sprites and pre-optimized screenshots use native images with reserved dimensions. The hero poster is preloaded; route prefetching is disabled for the main navigation, game button, experience links and project cards. Cursor code loads on the first mouse movement; footer physics load only when visible. Only the selected hero sprites' URLs and dimensions reach its client selector.

## Open

- **Content:** LinkedIn + Instagram posts and photos per chapter (needs the data exports), which hackathons were wins or mentoring, job photos, the draft takes in `skills.ts`, reels and the intro video.
- **Pages linked but not built:** blog, lore, learn, now, infra.
- **PLAY:** Aniket's own character (KayKit CC0 base, recoloured) and in-game quests (ride the bike, coins, bricks, every chapter).
- **Infra:** Cloudflare account + domain for the deploy (T04/T05); decision 12 (JS budget).
