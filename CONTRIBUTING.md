# Contributing

This is a personal site, so most changes come from me. Bug reports, typo fixes and small improvements are welcome.

## Setup

```sh
nvm use
pnpm install   # also installs the git hooks
pnpm dev
```

Optional but recommended: `brew install gitleaks` so the pre-commit hook can scan for secrets locally (CI scans regardless).

## Making a change

1. Open an issue first for anything bigger than a fix.
2. Branch from `main`.
3. Keep to the rules in [AGENTS.md](AGENTS.md) and [docs/brand.md](docs/brand.md): brand tokens only, pixel-exact sprites, client JS only where something is interactive, reduced-motion support.
4. Before pushing: `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm build`.
5. Open a PR. It is squash-merged, so the **PR title** becomes the commit.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), checked by commitlint on every commit:

```
type(scope): summary in lowercase imperative
```

- types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore`
- scopes: `hero` `modes` `scroll` `blog` `quests` `play` `audio` `api` `infra` `ci` `repo` `brand` `seo`
- example: `feat(hero): add mode figurines`

## Git hooks

| hook         | runs                                             |
| ------------ | ------------------------------------------------ |
| `commit-msg` | commitlint                                       |
| `pre-commit` | Prettier + ESLint on staged files, then gitleaks |
| `pre-push`   | typecheck + unit tests                           |

CI runs the same checks, so skipping hooks with `--no-verify` won't get a change merged.

## Licence

By contributing you agree your code is released under the [MIT licence](LICENSE). Art, music and writing are not open for contribution; see [ASSETS_LICENSE.md](ASSETS_LICENSE.md).
