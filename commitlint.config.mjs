// Conventional Commits with this repo's scopes (AGENTS.md → Commits).
const scopes = [
  'hero',
  'modes',
  'scroll',
  'blog',
  'quests',
  'play',
  'audio',
  'api',
  'infra',
  'ci',
  'repo',
  'brand',
  'seo',
];

// Commits carry only the author's own name: no co-author trailers or "generated with" footers.
const AI_ATTRIBUTION = /^co-authored-by:|generated with \[/im;

const config = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-ai-attribution': ({ raw }) => [
          !AI_ATTRIBUTION.test(raw ?? ''),
          'remove co-author / "generated with" lines',
        ],
      },
    },
  ],
  rules: {
    'scope-enum': [2, 'always', scopes],
    'no-ai-attribution': [2, 'always'],
  },
};

export default config;
