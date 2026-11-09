# amazing-dev-portfolio — agent guide

Personal site of Aniket Singh (anik8): a fast READ-mode site (portfolio, blog, lore, booking) plus an optional PLAY-mode 3D world, styled as a white, pixel-exact game. Open source; the site's own infra is part of the showcase.

## Where things are

- **Code layout** (same pattern as ramxcodes/sleek-portfolio) → `src/app/` routes · `src/config/` site data and copy (components never hard-code content) · `src/components/<area>/` UI grouped by feature (`pixel/` = brand kit) · `src/lib/` pure logic with tests next to it · `src/content/` MDX.

- **What to build** → `docs/requirements.md` (single source of truth for scope). Read the section a task names before touching code.
- **How it looks** → `docs/brand.md` (tokens, fonts, sprites, wordmark grid). Read it before any UI work.
- **What to do next** → `docs/roadmap.md` (ordered tasks, each with a done-check). Work one task at a time.
- **Raw brand art** → `brand/` (character sheet, portrait, run cycle). Source files; generated assets go to `src/assets/` or `public/`.

## Stack

Next.js App Router (static export, Server Components by default, `'use client'` only where interactive) · Tailwind v4 with brand tokens · MDX content · Three.js/R3F lazy-loaded on `/play` · Howler for audio · Cloudflare (Pages, Workers + Hono, D1, KV, R2, Turnstile) · OpenTofu for infra · GitHub Actions · pnpm.

## Hard rules

- **Brand:** white background everywhere; Press Start 2P for display only, sizes in multiples of 8; clean sans for reading text; one red accent per screen; tech named in text labels.
- **Pixel-exact:** sprites render with `image-rendering: pixelated` at 1×, 2× or 3× of the source pixels; every new sprite is cut from `brand/anik8-looks.png`.
- **Server-first:** components are Server Components; add `'use client'` only when a component is interactive, and keep it as a small leaf. JS budget: client JS budget per content page — TODO(decision-12): Next.js runtime alone is ~135 KB gz, so the old 60 KB cap no longer holds.
- **Calm by default:** every animation has a `prefers-reduced-motion` static state; sound starts only after a user click and has a visible twin.
- **Free-first:** pick the free tool or free tier listed in requirements §13; propose anything paid as a decision for Aniket.
- **Secrets:** values live in `.env` (git-ignored) and CI/Cloudflare secrets; the repo holds `.env.example` only. OpenTofu plan and state files stay out of git.

## Workflow

1. Pick the task (`/next` or `/task <id>`), read its requirement and brand sections.
2. Build the thinnest working slice first (tracer bullet), then fill in.
3. Verify: `pnpm check`, `pnpm lint`, `pnpm build` pass; for UI, look at it in the browser at desktop and 390 px width.
4. Tick the task's box in `docs/roadmap.md` and note anything deferred under it.

A task is **done** when its done-check in the roadmap holds and step 3 is green.

## Commits

Conventional Commits, enforced by commitlint: `type(scope): summary` in lowercase imperative, e.g. `feat(hero): add mode figurines`. Scopes: `hero`, `modes`, `scroll`, `blog`, `quests`, `play`, `audio`, `api`, `infra`, `ci`, `repo`, `brand`, `seo`. One logical change per commit. Commit only when Aniket asks. No AI attribution anywhere: no `Co-Authored-By` trailers, no "Generated with …" footers in commits, PRs or issues.

## Open decisions

Listed in requirements §11. Use the current default and leave a `TODO(decision-N)` comment where a choice is pending: body font → Manrope; code licence → MIT, art/music/posts → all rights reserved.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
