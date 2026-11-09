// Scans Aniket's public GitHub repos and counts, per technology: repos using it, first year
// used, and stars on those repos. Writes src/data/github-tech.json (committed, so the static
// build never needs the network). Run: pnpm tech-stats   (token: GITHUB_TOKEN or `gh auth token`)
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const USER = 'anik8-codes';
const OUT = 'src/data/github-tech.json';
const token = process.env.GITHUB_TOKEN ?? execSync('gh auth token').toString().trim();

const api = async (path) => {
  const r = await fetch(`https://api.github.com/${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'anik8-site-tech-stats' },
  });
  return r.ok ? r.json() : null;
};
const file = async (repo, path) => {
  const f = await api(`repos/${USER}/${repo}/contents/${path}`);
  return f?.content ? Buffer.from(f.content, 'base64').toString('utf8') : null;
};

/** Package / file / language / topic → tech key used by src/config/tech.ts. */
const NPM = [
  [/^next$/, 'next.js'],
  [/^react$/, 'react'],
  [/^typescript$/, 'typescript'],
  [/^tailwindcss$/, 'tailwind'],
  [/^express$/, 'express'],
  [/^(prisma|@prisma\/client)$/, 'prisma'],
  [/^(mongoose|mongodb)$/, 'mongodb'],
  [/^(pg|postgres|drizzle-orm|@neondatabase\/serverless)$/, 'postgresql'],
  [/^@aws-sdk\/client-bedrock/, 'amazon bedrock'],
  [/^@aws-sdk\/client-lambda$/, 'aws lambda'],
  [/^(@aws-sdk\/|aws-sdk$)/, 'aws'],
  [/^socket\.io/, 'socket.io'],
  [/^three$/, 'three.js'],
  [/^(openai|@[a-z-]+-ai\/sdk|@google\/generative-ai|ai|langchain|@langchain\/)/, 'llm apps'],
  [/^(redis|ioredis|@upstash\/redis)$/, 'redis'],
  [/^(firebase|firebase-admin)$/, 'firebase'],
  [/^@supabase\//, 'supabase'],
  [/^(@reduxjs\/toolkit|redux)$/, 'redux'],
  [/^vue$/, 'vue'],
  [/^svelte$/, 'svelte'],
  [/^@angular\/core$/, 'angular'],
  [/^hono$/, 'hono'],
  [/^(framer-motion|motion|gsap)$/, 'motion'],
  [/^stripe$/, 'stripe'],
  [/^vite$/, 'vite'],
  // a server framework in package.json means the repo runs on node
  [/^(express|hono|fastify|koa|@nestjs\/core|socket\.io)$/, 'node.js'],
];
const PY = [
  [/^flask/i, 'flask'],
  [/^fastapi/i, 'fastapi'],
  [/^django/i, 'django'],
  [/^(numpy|pandas|scikit-learn|sklearn)/i, 'data science'],
  [/^(torch|tensorflow|keras)/i, 'deep learning'],
  [/^(openai|langchain|google-generativeai)/i, 'llm apps'],
  [/^(chromadb|pinecone|faiss|qdrant|weaviate)/i, 'vector dbs'],
  [/^(pymongo|motor)$/i, 'mongodb'],
  [/^(psycopg|sqlalchemy)/i, 'postgresql'],
  [/^boto3/i, 'aws'],
];
const LANG = {
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  Python: 'python',
  'Jupyter Notebook': 'data science',
  HTML: 'html',
  CSS: 'css',
  Java: 'java',
  Shell: 'bash',
  HCL: 'terraform',
  Go: 'go',
};
const ROOT = [
  [/^(Dockerfile|docker-compose\.ya?ml|compose\.ya?ml)$/, 'docker'],
  [/^(k8s|kubernetes|helm|charts)$/, 'kubernetes'],
  [/^(terraform|infra|infrastructure)$/, 'terraform'],
  [/^vercel\.json$/, 'vercel'],
  [/^wrangler\.(toml|jsonc?)$/, 'cloudflare'],
];

const repos = (await api(`users/${USER}/repos?per_page=100&type=owner&sort=created`)).filter(
  (r) => !r.fork,
);
const tech = {};
const add = (key, repo) => {
  const t = (tech[key] ??= { repos: 0, stars: 0, firstYear: 9999, repoNames: [] });
  if (t.repoNames.includes(repo.name)) return;
  t.repos++;
  t.stars += repo.stargazers_count;
  t.firstYear = Math.min(t.firstYear, Number(repo.created_at.slice(0, 4)));
  t.repoNames.push(repo.name);
};

for (const repo of repos) {
  const found = new Set();
  if (LANG[repo.language]) found.add(LANG[repo.language]);
  for (const topic of repo.topics ?? [])
    for (const k of ['react', 'vue', 'svelte', 'angular', 'docker', 'kubernetes', 'terraform'])
      if (topic === k) found.add(k);
  const root = (await api(`repos/${USER}/${repo.name}/contents`)) ?? [];
  const names = Array.isArray(root) ? root.map((f) => f.name) : [];
  for (const n of names) for (const [re, k] of ROOT) if (re.test(n)) found.add(k);
  if (names.includes('.github')) {
    const wf = await api(`repos/${USER}/${repo.name}/contents/.github/workflows`);
    if (Array.isArray(wf) && wf.length) found.add('github actions');
  }
  if (names.includes('package.json')) {
    try {
      const pkg = JSON.parse((await file(repo.name, 'package.json')) ?? '{}');
      for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }))
        for (const [re, k] of NPM) if (re.test(dep)) found.add(k);
    } catch {
      // unparsable package.json: skip it
    }
  }
  if (names.includes('requirements.txt')) {
    for (const line of ((await file(repo.name, 'requirements.txt')) ?? '').split('\n'))
      for (const [re, k] of PY) if (re.test(line.trim())) found.add(k);
  }
  for (const k of found) add(k, repo);
}

const sorted = Object.fromEntries(Object.entries(tech).sort((a, b) => b[1].repos - a[1].repos));
mkdirSync('src/data', { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      user: USER,
      generatedAt: new Date().toISOString().slice(0, 10),
      repos: repos.length,
      stars: repos.reduce((n, r) => n + r.stargazers_count, 0),
      tech: sorted,
    },
    null,
    2,
  ) + '\n',
);
console.log(`scanned ${repos.length} repos → ${Object.keys(sorted).length} technologies → ${OUT}`);
