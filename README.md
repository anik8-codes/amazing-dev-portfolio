<p align="center">
  <img src="brand/anik8-run.gif" alt="anik8 run cycle, pixel art" width="160" />
</p>

# amazing-dev-portfolio

Personal site of **Aniket Singh (anik8)**: devops, backend & ai — explained in 60 seconds.

It's three things in one repo:

- **READ mode**: a fast static site (quests, blog, lore, booking) styled as a white, pixel-exact game.
- **PLAY mode**: an optional 3D lore world you enter by pressing START.
- **A live DevOps showcase**: the site's own infra, pipeline and numbers are public.

## Stack

Next.js (App Router, static export) · TypeScript · Tailwind CSS v4 · MDX · Three.js / React Three Fiber (PLAY mode) · Howler · Cloudflare Pages, Workers (Hono), D1, KV, R2, Turnstile · OpenTofu · GitHub Actions · pnpm

## Run it

```sh
nvm use          # Node 24 (.nvmrc)
pnpm install
pnpm dev         # http://localhost:3000
```

| script          | does                         |
| --------------- | ---------------------------- |
| `pnpm dev`      | dev server                   |
| `pnpm build`    | static site into `out/`      |
| `pnpm preview`  | serve `out/` locally         |
| `pnpm check`    | typecheck                    |
| `pnpm lint`     | ESLint                       |
| `pnpm test`     | unit tests (Vitest)          |
| `pnpm format`   | Prettier                     |
| `pnpm test:e2e` | Playwright + axe smoke tests |
| `pnpm knip`     | unused files / exports       |

## Layout

```
src/app/         routes (each folder is a URL)
src/config/      site data and copy, so components never hard-code content
src/components/  UI grouped by feature; pixel/ is the brand kit
src/lib/         pure logic, with tests next to it
src/content/     MDX posts and quests
worker/          Hono API on Cloudflare Workers
infra/           OpenTofu for Cloudflare
media/           source clips and encode scripts
docs/            requirements, brand spec, roadmap
```

## Docs

- [docs/progress.md](docs/progress.md): what's built today and how it fits together

- [docs/requirements.md](docs/requirements.md): what the site is
- [docs/brand.md](docs/brand.md): tokens, fonts, sprites
- [docs/roadmap.md](docs/roadmap.md): build order
- [CONTRIBUTING.md](CONTRIBUTING.md): how to send a change

## Licence

Code: [MIT](LICENSE). Art, sprites, music, video and writing: all rights reserved, see [ASSETS_LICENSE.md](ASSETS_LICENSE.md).
