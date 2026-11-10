<p align="center">
  <img src="brand/anik8-run.gif" alt="anik8 run cycle, pixel art" width="160" />
</p>

# anik8 — a pixel-game portfolio

Personal site of **Aniket Singh (anik8)**: DevOps, backend & AI engineer.

**Live:** [anik8.codes](https://anik8.codes/) · **Code:** [MIT](LICENSE) · **Personal assets:** [separate terms](ASSETS_LICENSE.md)

It's three things in one repo:

- **READ mode**: experience pages, project case studies, GitHub activity, skills, FAQ, and contact links, styled as a white pixel game.
- **Virtual workspace**: a 3D desk embedded in the home page, with camera presets and a resume viewer.
- **PLAY mode**: an optional 3D island with walking, running, jumping, physics, and story markers.

The home page also includes video windows, inline character selectors, a typeable terminal, light/dark themes, and optional sound and music. Animations respect reduced-motion preferences.

## Stack

| Area                  | Technologies                                                         |
| --------------------- | -------------------------------------------------------------------- |
| Application           | Next.js 16 App Router, React 19, TypeScript                          |
| Styling               | Tailwind CSS v4, CSS Modules, native scroll-driven animations        |
| 3D                    | Three.js, WebGPU with WebGL 2 fallback, Rapier physics               |
| Content               | Typed TypeScript configs, build-time JSON data, local media and PDF  |
| Audio                 | Web Audio API; off by default                                        |
| Hosting               | Static export on Cloudflare Pages                                    |
| Delivery              | GitHub Actions, production/preview Pages deployments, release-please |
| Tests                 | Vitest, Playwright, axe, Lighthouse CI, offline link checks          |
| Quality               | ESLint, Prettier, knip, gitleaks, actionlint, zizmor                 |
| Tooling               | Node.js 24, pnpm                                                     |
| Infrastructure source | OpenTofu for Cloudflare; provisioning is a separate setup step       |

The application uses plain Three.js. React Three Fiber, Howler, and MDX are not part of its current runtime. Current implementation and pending work: [docs/progress.md](docs/progress.md).

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
src/data/        generated build-time data
src/assets/      sprites, profile images, and scene art
public/          models, textures, video, resume, and static files
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

When personalizing a fork, start with `src/config/` and replace Aniket's personal assets, recordings, written content, and resume with your own. Configure your own hosting account and credentials.

The virtual office adapts Henry Heffernan's MIT-licensed work: [credits](public/office/CREDITS.md), [licence](public/office/LICENSE.txt). PLAY uses Kenney CC0 models and techniques studied from Bruno Simon's MIT-licensed portfolio. Other sources: [scene credits](media/scenes/CREDITS.md), [project screenshots](docs/project-sources.md).

## Delivery and performance

GitHub Actions checks types, lint, unused code, unit tests, secrets, browser accessibility, links, and Lighthouse before deployment. Stable Chrome audits each configured page three times. Existing performance gates include LCP ≤ 2 seconds, CLS ≤ 0.05, TBT ≤ 200 ms, and a provisional 160 KiB script-transfer budget.

Automatic Cloudflare deployment uses the Actions secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` (Pages Edit permission for the hosting account). Fork pull requests do not deploy with repository secrets.
