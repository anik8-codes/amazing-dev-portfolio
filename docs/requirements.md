# anik8 site — requirements (v2)

Status: draft, 9 Nov 2026. Decisions marked **[decide]** are open (see the last section).

## 1. What we're building

A personal site for Aniket Singh (anik8) that works as three things at once:

- **A fast, readable site** — portfolio, blog, lore, booking. Ranks well on Google _and_ in AI answers.
- **A playable 3D "lore" world** (Bruno Simon–style) you enter by pressing START.
- **A live DevOps showcase** — the site's own infra, pipeline and numbers are public and part of the story.

Brand base: the anik8 brand system built on 8 Nov 2026 (Canva "anik8 Brand Guidelines", GitHub README).
Minimal, white, pixel-exact, with micro-interactions and sound as the "juice".

## 2. Principles

1. **Two modes, one site.** READ mode is the default and must be fast and complete on its own. PLAY mode (3D) is optional and loads only when asked.
2. **Content first, zero JS by default.** Pages ship HTML/CSS; interactivity is opt-in per component.
3. **Brand rules are hard rules.** White background, Press Start 2P wordmark/headlines, real sprites at 1×/2×/3× only (never smoothed or redrawn), one red accent per screen, text labels instead of logo walls.
4. **Everything is code.** Content in MDX, infra in Terraform/OpenTofu, deploys in CI. No click-ops.
5. **Accessible and calm by default.** Reduced-motion and sound-off paths are first-class, not afterthoughts.

## 3. Recommended stack

### Frontend

- **Next.js** (App Router, latest stable) with `output: 'export'` — static HTML on Cloudflare Pages; Server Components by default, MDX, native `sitemap.ts`/`robots.ts`, `next/font`. Changed from Astro on 9 Nov 2026 (Aniket's call).
- **Client components** (`'use client'`) only where needed (3D world, ⌘K palette, guestbook, likes).
- **Tailwind CSS v4** with brand tokens as CSS variables (ink, pixel red, XP orange, lavender, mist, haze, white).
- **Fonts:** Press Start 2P (self-hosted woff2, sizes in multiples of 8) for display; system mono / JetBrains Mono for body.
- **Motion:** CSS + View Transitions API first; **Motion** (motion.dev) inside client components only. No Lenis/GSAP unless a specific scene needs it.

### 3D / audio

- **Three.js + React Three Fiber + drei + @react-three/rapier** (physics), lazy-loaded on `/play` only.
- Sprites as billboards with `NearestFilter` (keeps pixels crisp). Models from Blender → glTF + meshopt; textures KTX2.
- **Howler.js** for music + SFX (audio sprites, mobile unlock, fades). Assets on Cloudflare R2.

### Backend

- **Cloudflare Workers + Hono** for the small API: likes, views, guestbook, contact, newsletter signup.
- **Cloudflare D1** (SQLite) for counters/guestbook, **KV** for cache, **R2** for audio/3D/media.
- **Turnstile** on every form. Contact delivery: Resend email (+ optional Telegram bot).

### Integrations

- **Cal.com**: inline embed + floating "Book a call"; webhook → Telegram/email. Event types set up fresh.
- **Analytics:** Umami (self-hosted or cloud **[decide]**) for traffic + events; Cloudflare Web Analytics for RUM/Core Web Vitals; Google Search Console + Bing Webmaster for search.
- **Errors/uptime:** Sentry (free tier) + Upptime (GitHub Actions status page).

### Infra / DevOps (the showcase)

- **Cloudflare**: DNS, Pages/Workers, D1, R2, KV — all in **OpenTofu/Terraform**, state remote, applied from CI (never commit plan files).
- **GitHub Actions**: typecheck, lint, unit (Vitest), e2e smoke (Playwright), a11y (axe), link check, **Lighthouse CI budgets**, preview deploy per PR, prod deploy on `main`.
- **Renovate** for dependency updates.

### Starting point

Built **from scratch** in a new repo. Nothing is carried over from the old portfolio (`products/Portfolio`) — no code, no content, no config. Every page, post and case study is written fresh for the new brand.

## 4. Information architecture (pages)

- **`/` Home** — the "anik8 canvas" hero (section 4a). Below: current quest (Undrift), XP stats, latest posts, featured quests, "Book a call".

### 4a. Home hero — "anik8 canvas"

**Format** (kept from the heyclicky reference): an open canvas with floating video windows around a big centred title, a one-line pitch and two buttons, then a large intro video below. **Everything placed on the canvas is anik8's own** — no macOS chrome, stickers, folders or kaomoji.

Refero references used: Obscura (pixel display font + clean sans for reading, one loud colour), Playdate (one hero object — a handheld), Desktop.fm (restraint, let objects carry the page).

**Top bar = game HUD**

- Left: pixel wordmark · quests · blog · lore · learn.
- Centre: the current mode's pixel head + mode name (this is also the favicon).
- Right: hearts (lives), `XP 7,780`, sound toggle, IST clock, red "book a call".

**Canvas**

- White with a faint pixel grid (32 px squares at low opacity).
- **Pixel windows** (square corners, 3 px ink frame, pixel close box, soft offset shadow) holding muted looping reels and demos. Label under each = file name + views, e.g. `k8s_in_60s.mp4 · 1.2M views`, `undrift_demo.mp4`, `day_as_cto.mp4 · 340k views`, `system_design.mp4 · 860k views`. Click opens the full video.
- **`whoami.sh`** terminal window (DevOps side).
- **Mode figurines:** 4–5 of the 10 looks stand around the canvas at 1×. Tapping one switches the mode (selected one gets red corners). Hint: "tap a figure to switch mode".
- **Cartridges as navigation:** `QUESTS`, `LORE`, `BLOG` game cartridges link to those pages.
- **"anik8 boy" handheld:** white handheld with ink D-pad and red A/B; its screen plays the run cycle. Pressing its A = PRESS START.
- **Server rack:** tiny rack with blinking LEDs and live uptime (`prod · 99.98%`).
- **Creator badge:** red "11.9k players" tag (follower count).
- **Running-me cursor:** the run-cycle sprite trails the pointer (real cursor stays visible; off on touch and reduced motion).

**Centre**

- Mode chip: `◀ MODE 4/10 · CREATOR ▶`.
- Pixel wordmark (Press Start 2P grid).
- Pitch in clean sans: "devops, backend & ai — explained in 60 seconds." (changes per mode).
- Two controller buttons with ink offset shadow: **(A) press start** (red) and **(B) read mode** (white). Captions: "3D world · sound on · ~6 MB" / "fast site · 0 loading".
- Below: wide pixel window "▶ PLAY INTRO" (intro video).

**Modes (10 looks)** — switching changes: favicon + HUD head, tab title (`anik8 · creator mode`), the pitch line, which reels float in the windows, and the A-button target.

1. Default → about · 2. Hoodie → blog · 3. Work mode → quests · 4. Creator → reels · 5. Traveler → lore · 6. Hackathon → wins · 7. Formal → book a call · 8. Gamer → 3D world · 9. Builder → live infra · 10. Chill → now + guestbook.

- Hidden tab: favicon turns to the Chill head with "zzz", title "come back, player 1".
- Mode is shareable via `#creator` etc.; ← → / 1–0 switch modes from the keyboard.

**Hero mode review (10 Nov 2026):** Gamer, Creator, Builder and Chill are inline character selectors on the landing page, not separate pages. Clicking a figurine updates its selected corners and pressed state without navigation or a URL change. These four looks do not require dedicated routes. The explicit PRESS START button remains the entry to the optional 3D world.

**Interactions:** windows, figurines, cartridges and the handheld are draggable; click brings to front; hover lifts 2 px; select blip on grab/drop when sound is on. Positions reset on reload.

**Mobile:** title, pitch and buttons first; windows become a swipe strip; figurines become a mode row; no dragging.

**Type:** Press Start 2P for display only; a clean sans (e.g. Manrope) for pitch, buttons and labels — **[decide]** (the brand guide currently says mono for body).

**Media:** reels as 5–8 s muted loops (WebM + MP4, ≤ 1.5 MB, poster first, lazy, on R2); reduced motion shows posters.

**Content needed from you:** 4–5 reels + view counts, intro video, a pitch line per mode, and where each mode's A button goes.

Mockup: `docs/mockups/hero-v3.png` (9 Nov 2026; striped windows are reel placeholders).

**Hero changes from Aniket's review (9 Nov 2026), these override the mockup:** centre shows the wordmark, the full name **Aniket Singh** and the headline "devops, backend & ai engineer" (not "explained in 60 seconds"); no mode chip and no follower badge; the intro video sits in the first screen under the buttons, with 2 floating reels around it; GitHub, X, YouTube and Instagram are clickable tiles placed around the canvas; `whoami.sh` opens a typeable terminal (help, whoami, ls, cat, cd, socials, open, …); the running-me cursor chases the pointer Neko-style, gets tired after a long run and falls asleep when idle.

**Latest hero review (9 Nov 2026):** the real intro video sits **above** the wordmark, full name, headline and buttons. One supporting reel shows Aniket working at MaxCode; remove the second/vlog window, handheld and uptime rack. Scatter the social icons farther toward the edges to keep the centre clear. Videos show posters and play on request. MaxCode's experience chapter and detail page use the supplied desk and Diwali photos; more photos will follow.

**Supporting reel correction (9 Nov 2026):** use the supplied Drive video, `open-dots.mp4`, in the hero's supporting window. It replaces the working-at-MaxCode clip; keep the central intro and MaxCode experience photos.

**Hover and photo review (9 Nov 2026):** match Hey Clicky's playback behavior: the central intro loops muted while visible; hover starts the active video with audio after browser user activation, and leaving the supporting reel pauses it. Only one video plays at a time; the intro resumes muted after leaving the reel. Native controls provide tap/keyboard playback and mute. Reduced motion keeps posters until explicit playback; offscreen or hidden-tab videos pause. This media behavior is an exception to the click-only site-SFX default in §5. Experience photos belong **only on the read-more pages**, for every company; the home roadmap keeps its illustrations and character art.

**Latest hero layout review (10 Nov 2026):** remove the Quests/Blog/Learn navigation and all hero cartridges; keep Projects and Resume in the HUD. Compact the desktop hero from 920 px to 728 px, bounded to 1600 px wide, with the canvas layout from 1024 px. Intro remains above the name, with a smaller supporting reel and terminal on opposing outer edges. Arrange the seven socials in three mirrored pairs around the wordmark and one centred below; the four inline character selectors become a compact row. Both video players use Mac-style traffic lights and filename bars. Hover anywhere on a window starts its existing playback behavior and keeps that card sharp above a slight viewport backdrop blur; keyboard focus gets the same treatment. Native controls remain usable; no modal, blocked background clicks or extra focus trap. Preserve reduced-motion states and a compact mobile layout.

- **`/play`** — the 3D lore world (section 6).
- **`/lore`** — about, told as levels (Indore → first code → hackathons → CTO → now) + character select (10 looks = 10 facets).
- **`/quests`** + **`/quests/[slug]`** — projects as case studies: problem, architecture diagram, stack (text, no logos), results, links. Written fresh (start with Undrift, Kyte, AI voice receptionist, AI website builder, OSS).
- **`/blog`** + **`/blog/[slug]`** — posts, series, tags, RSS/Atom, reading-progress XP bar, hearts (likes), TOC, copyable code blocks, related posts, `.md` twin of every post.
- **`/learn`** — free resources: cloud-devops-zero-to-100, kube-from-zero, @careerswithaniket series.
- **`/inventory`** — uses/stack/gear.
- **`/now`** — what I'm doing this month.
- **`/book`** — Cal.com event types (30-min chat, mentorship, consulting **[decide]**).
- **`/guestbook`** — sign in with GitHub, leave a message, pixel-heart reactions.
- **`/stats`** — public "high scores": visitors, top posts, likes, uptime, Lighthouse scores, AI-referral traffic.
- **`/infra`** — how this site is built and deployed: live diagram, last deploy SHA/time, pipeline status.
- **`/resume`** — HTML + PDF. Aniket's 10 Nov review: reuse the old portfolio's PDF iframe viewer, with direct open/download fallbacks; make it discoverable in main navigation and footer. Serve the original PDF locally (the old GitHub Pages URL is broken; its source moved to `anik8-codes/Aniket-CV-25`).
- **Home `#workspace` — my setup** — Aniket's revised 10 Nov review: the virtual environment is embedded directly after Experience, separate from Botmartz. Botmartz uses its Gandhi Hall illustration. The desk loads automatically as the section approaches; a scroll-driven sticky frame expands to fill the viewport, then releases into Projects. No enter button or separate workspace page. Keep natural wheel/touch page scrolling, keyboard-accessible camera presets and a continue-to-projects link. Reduced motion and unsupported browsers use a static full-width section. Pause rendering offscreen/hidden, and keep direct resume access if WebGL fails. Reuse Henry Heffernan's MIT-licensed models and adapted screen/camera code with visible credit/full licence; the local monitor opens Aniket's resume. Legacy `/office/` links redirect to `/#workspace`; `/office/screen/` is only an internal monitor surface.
- **`/404`** — "GAME OVER · CONTINUE?" with the run cycle.
- **Global:** ⌘K command palette, terminal easter egg, sound toggle, footer with socials.

### 4b. Home below the hero — "scroll = run"

As you scroll, the run-cycle sprite runs along a ground line at the bottom of the viewport (scroll position picks the frame, so scrolling _is_ running). Every section is a stretch of the same level, with layered pixel parallax behind it.

**Parallax system**

- 3–4 pixel layers per section (far sky with clouds → mid hills/Indore skyline → near props → ground tiles), each moving at a different scroll speed, like a classic side-scroller.
- Built with **CSS scroll-driven animations** (`animation-timeline: view()` / `scroll()`) — native, no JS. Browsers without support get the static layout.
- **GSAP ScrollTrigger** (now free) only for the one or two pinned sequences that need it. No smooth-scroll hijacking.
- Only `transform` and `opacity` animate; sprites move in whole pixels; everything is static under reduced motion.

**Sections, in order**

1. **Hero** — anik8 canvas (4a).
2. **Current quest** — Undrift spotlight: pinned for a moment while the sprite walks up to a quest board; status, what it does, live demo link.
3. **Experience — "Levels"** — pinned horizontal side-scroller: vertical scroll moves the level sideways. Each role/milestone is a **checkpoint flag** (year · role · company · what I shipped · XP gained). The sprite changes look per stage (Hackathon look at hackathon wins, Formal at CTO, etc.). Parallax background shifts from Indore skyline → startup office → cloud servers.
4. **Projects — "Quest log"** — quest cards with rarity (common / rare / legendary), status chip (shipped · in progress · stealth), stack as text tags, key result. Scroll effect: cards stack and fan out (sticky stacking). Hover: 2 px lift + pixel shine sweep. Click: the card morphs into the case-study page (View Transitions).
5. **Creator — "Broadcast"** — infinite strip of reel windows; scroll speed skews/accelerates the strip; tap opens the reel.
6. **Inventory** — skills/tools as item slots that fill in one by one as the section enters.
7. **Logs** — latest blog posts, each with reading time and hearts.
8. **High scores** — live counters (visitors, reels views, uptime, Lighthouse) that roll up on view.
9. **"CONTINUE?" screen** — arcade continue countdown (10…9…) with the "book a call" button; at 0 it shows "GAME OVER — just kidding, say hi".
10. **Footer** — ground tiles; the sprite stops and idles; socials and RSS.

**Current home scope (Aniket's review, 9 Nov 2026):** remove Broadcast, Logs and High scores from the landing page. Keep hero → experience → my setup → projects → GitHub/player 1 → skills → CONTINUE → footer. Projects contains exactly three entries, in order: **Undrift** (`https://undrift.anik8.me`), **Unjob.ai** (`https://unjob.ai`), **Launchday.ai** (`https://thelaunchday.ai`). Undrift remains the featured current quest; its button goes directly to the supplied live site. More project details and entries will follow from Aniket.

**Performance:** sections below the fold lazy-load their art; total parallax art ≤ 400 KB; no layout shift; 60 fps on a mid-range laptop.

## 5. Micro-interactions & sound

- Buttons "press" 2px down with the red pixel shadow; pixel-heart likes with a burst.
- Page transitions via View Transitions (pixel dissolve / wipe), audio player persists across pages.
- Reading progress = orange XP bar; finishing a post fills it with a level-up chime.
- Running-you cursor and mode-changing favicons (section 4a).
- Typing whoami terminal on home; blinking red cursor.
- ⌘K palette with blip sounds; Konami code unlocks a secret look.
- **Sound system:** global mute toggle (persisted); nothing plays until the first click; music only in `/play` and after PRESS START; short SFX for hover/click/like/level-up; every sound has a visual equivalent.
- **Music source** — chiptune loop, original or licensed **[decide]**.

## 6. The 3D lore world (`/play`)

- A small floating island diorama; you walk the run-cycle sprite (WASD/arrows, touch joystick on mobile).
- Stations, each linking to a READ page:
  - **Spawn (Indore)** → `/lore`
  - **Quest board** → `/quests`
  - **Library** → `/blog`
  - **DevOps factory** — containers riding conveyor belts through build → test → deploy, fed by the real CI status → `/infra`
  - **Arcade** — music/SFX jukebox
  - **Portal** → `/book`
- NPCs speak lore lines in pixel speech bubbles; an "Ask anik8" NPC can come later (AI assistant).
- Loading screen with XP bar; "Skip to READ mode" always visible.
- Budgets: first interactive < 4 s on mid-range laptop; total download < 8 MB; 60 fps desktop / 30 fps mobile; pause when the tab is hidden; low-power mode on weak GPUs.

## 7. SEO & GEO

- **Technical:** sitemap, robots, canonical URLs, one `<h1>` per page, descriptive alt text, fast CWV.
- **Structured data:** `Person` (with `sameAs` to GitHub, LinkedIn, X, Instagram, YouTube), `WebSite`, `BlogPosting`, `BreadcrumbList`, `SoftwareSourceCode`/`CreativeWork` for quests, `FAQPage` where natural.
- **OG images:** generated at build per page in the brand style (Satori + Press Start 2P).
- **GEO (AI answers):** `llms.txt` + `llms-full.txt`, a Markdown twin of every page, answer-first intros, clear author entity, consistent handles everywhere, robots policy for AI crawlers **[decide]**, AI-referral tracking in analytics.
- **Entity consistency:** one name, one handle set, one canonical domain across site, README, socials **[decide]**.

## 8. Analytics & events

- Page views, referrers (incl. chatgpt.com, perplexity.ai, gemini), countries, devices.
- Events: `press_start`, `play_station_visit`, `post_read_complete`, `heart`, `book_open`, `book_confirmed` (Cal webhook), `guestbook_sign`, `sound_toggle`, `cmdk_open`.
- Funnels: home → book confirmed; blog → newsletter.
- Public subset on `/stats`.

## 9. Non-functional requirements

- **Performance (READ mode):** LCP < 2.0 s on 4G, CLS < 0.05, INP < 200 ms, JS budget per content page per decision 12, Lighthouse ≥ 95 in all four categories — enforced in CI.
- **Accessibility:** WCAG 2.2 AA, keyboard-first, focus states in brand style, `prefers-reduced-motion` respected, captions/visual cues for audio. Mist (#B3A5D1) and Lavender (#8B7BB0) fail AA as body text on white → use #6B6480 for text.
- **Security:** CSP, Turnstile on forms, rate limits on API, no secrets in repo, Dependabot/Renovate alerts.
- **Reliability:** status page, error tracking, rollback = redeploy previous build.
- **Content workflow:** write MDX → open PR → preview URL → merge = live.

## 10. Phases

- **P0 Foundation (1 week)** — public repo + open-source hygiene (section 12), Next.js + Tailwind tokens + fonts, CI/CD, OpenTofu for Cloudflare (DNS, Pages, R2, D1), domain cut-over, analytics, Search Console.
- **P1 READ mode MVP (2 weeks) → launch** — home, lore, quests (first 4–5 written fresh), blog (first 2–3 posts), book, inventory, now, resume, 404, SEO/GEO base, OG images, RSS.
- **P2 Juice (1–2 weeks)** — micro-interactions, sound system, ⌘K, likes/views/guestbook (Workers + D1), `/stats`, `/infra`.
- **P3 PLAY mode (3–4 weeks)** — the 3D lore world.
- **P4 Extras** — "Ask anik8" AI NPC, newsletter.

## 11. Open decisions

1. ~~**Primary domain:** `anik8.me` or `anik8.codes`?~~ **Decided 9 Nov 2026: `anik8.codes`.** `anik8.me` 301-redirects to it (redirect not in `infra/` yet).
2. **Music:** compose (BeepBox/FamiStudio), commission, or license?
3. ~~**Sound default:**~~ **Decided 9 Nov 2026: off until the visitor turns it on** (HUD toggle, remembered).
4. **Handles:** settle on one X handle (`@anik8codes` vs `@codewithanik8`).
5. **AI crawlers:** allow (better GEO) or block training bots only?
6. ~~**Dark mode:**~~ **Decided 9 Nov 2026: add dark mode.** Follows the OS by default, HUD toggle, remembered; same tokens with night values (brand.md).
7. **Booking types** to offer on `/book`.
8. **Umami:** self-host (DevOps showcase) or Umami Cloud?
9. **Commit style:** plain Conventional Commits (`feat(hero): …`, recommended for open source) or keep the `Aniket/feat: …` prefix used in team repos?
10. **Licences:** MIT for code is easy; sprites, character art, music and posts should stay **all rights reserved** or **CC BY-NC 4.0** so the persona can't be reused.
11. **Body font:** clean sans (e.g. Manrope) vs. mono, as in the brand guide.
12. **JS budget:** Next.js ships ~135 KB gz of runtime on every page (measured 9 Nov 2026, Next 16.4), so the old 60 KB cap can't hold. Pick a new cap for CI (e.g. runtime + ≤ 20 KB of our own JS per page).

## 12. Open source & repo hygiene

The repo will be public, so it has to be pleasant to read and safe to fork.

**Commits**

- **Conventional Commits** (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`), scopes by area (`hero`, `blog`, `play`, `infra`, `api`).
- **Husky** git hooks:
  - `commit-msg` → **commitlint** (`@commitlint/config-conventional`) rejects messy messages.
  - `pre-commit` → **lint-staged**: Prettier + ESLint on staged files only (fast).
  - `pre-push` → typecheck (`tsc --noEmit`) + unit tests.
- CI re-runs the same checks, so hooks can't be skipped with `--no-verify`.
- **Squash merges**; the PR title must be a Conventional Commit (checked by a free GitHub Action).
- **release-please** (free GitHub Action) writes `CHANGELOG.md`, bumps the version and tags releases from the commit history.

**Repo files:** `README` (with preview GIF), `LICENSE`(s) per decision 10, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue + PR templates, `CODEOWNERS`, `.editorconfig`, `.nvmrc`.

**Safety:** **gitleaks** secret scanning in pre-commit and CI; `.env.example` only, real secrets in GitHub/Cloudflare secrets; Renovate for updates; branch protection on `main` (PR + green CI required). Never commit plan files or state.

**Structure (single repo, no monorepo tooling until needed):** `src/` (Next.js site), `worker/` (Hono API), `infra/` (OpenTofu), `media/` (source clips + scripts), `docs/`.

## 13. Free-first tooling

Use free tools and free tiers first; pay only when a limit is actually hit.

**Media**

- **Video:** short loops self-hosted on **Cloudflare R2** (10 GB free, no egress fees); full videos stay on YouTube/Instagram and are linked or lazy-embedded. No paid video CDN.
- **Encoding:** **ffmpeg** script in the repo (and a GitHub Action) turns a source clip into WebM + MP4 loop + poster at the right size.
- **Images:** pre-sized at build time (static export has no runtime image optimizer); AVIF/WebP via a sharp script when needed.
- **Pixel art / favicons:** **LibreSprite** or **Piskel** (free); Aseprite optional.
- **Music:** **BeepBox** or **FamiStudio** (free) for chiptune; **jsfxr / ChipTone** (free) for sound effects; **Howler.js** (MIT) to play them.
- **3D:** **Blender** (free) + **gltf-transform** (free) for compression; **Three.js / R3F** (MIT).
- **Share images:** **Satori** (free) generates OG images at build time.
- **Fonts:** Press Start 2P and Manrope (both SIL OFL, free).

**Services (free tiers)**

- **Hosting/API/data:** Cloudflare Pages + Workers + D1 + KV + R2 + Turnstile + Web Analytics.
- **CI:** GitHub Actions (free for public repos).
- **Analytics:** Cloudflare Web Analytics + Umami Cloud hobby tier (or self-host later).
- **Booking:** Cal.com free plan.
- **Email:** Resend free tier (contact form, low volume).
- **Errors/uptime:** Sentry developer tier; **Upptime** status page (runs on GitHub Actions).
- **Blog comments:** **Giscus** (GitHub Discussions) — free, no database.
- **Newsletter:** Buttondown free tier (or Resend audiences).
- **Search:** Google Search Console + Bing Webmaster.

**Code quality & CI (all free / OSS, adopted 9 Nov 2026)**

- **knip**: unused files, exports and dependencies (`pnpm knip`, runs in CI).
- **actionlint** + **zizmor**: workflow syntax and GitHub Actions security; every action is pinned to a commit SHA and Renovate keeps the pins current.
- **gitleaks** (pre-commit + CI), **lychee** (offline link check), **Playwright + axe** (smoke + a11y), **Lighthouse CI** (budgets), **act** (run workflows locally in Docker).

**Only paid item:** the domain.
