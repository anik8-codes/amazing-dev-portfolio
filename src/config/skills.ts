import type { TechName } from './tech';

interface Skill {
  id: TechName;
  /** Aniket's one-line take, shown when the skill is tapped. */
  take: string;
}

interface SkillGroup {
  /** Sub-heading inside the category card; omit for a single unnamed group. */
  name?: string;
  skills: readonly Skill[];
}

export interface Category {
  name: string;
  groups: readonly SkillGroup[];
}

/**
 * Everything Aniket builds with, by category (sources: his 2026 resume, public repos and the
 * MaxCode codebases). Stats come from src/data/github-tech.json (`pnpm tech-stats`) and
 * src/config/experience.ts.
 * TODO(content): every `take` is a draft for Aniket to rewrite or approve.
 */
export const categories: readonly Category[] = [
  {
    name: 'frontend',
    groups: [
      {
        name: 'core',
        skills: [
          { id: 'html', take: "the web's real api. learn it before any framework." },
          { id: 'css', take: 'layout is a superpower most devs skip.' },
          { id: 'javascript', take: 'where it all started. still the duct tape of the web.' },
          { id: 'typescript', take: 'non-negotiable now. types are free documentation.' },
        ],
      },
      {
        name: 'frameworks',
        skills: [
          { id: 'react', take: 'the default. thinking in components clicked here.' },
          { id: 'next.js', take: 'my go-to for anything with a url.' },
          { id: 'react native', take: 'one codebase, two stores. mvvm keeps it sane.' },
          { id: 'vue', take: 'friendly and fast. built components for it in the open.' },
          { id: 'angular', take: 'opinionated and complete. great for big teams.' },
          { id: 'svelte', take: 'compiler magic. less code, same result.' },
        ],
      },
      {
        name: 'styling & motion',
        skills: [
          { id: 'tailwind', take: 'fastest way from idea to ui.' },
          { id: 'shadcn/ui', take: 'components you own, not a dependency you fight.' },
          { id: 'motion', take: 'motion is ux. used with taste, never for show.' },
          { id: 'three.js', take: "where the fun lives. this site's 3d world runs on it." },
        ],
      },
      {
        name: 'state & tooling',
        skills: [
          { id: 'redux', take: 'useful at scale; most apps need less state than they think.' },
          { id: 'tanstack query', take: 'server state is not client state. this fixed that.' },
          { id: 'zod', take: 'validate at the edges, trust types inside.' },
          { id: 'vite', take: 'dev server so fast you forget it exists.' },
        ],
      },
    ],
  },
  {
    name: 'backend',
    groups: [
      {
        name: 'node',
        skills: [
          { id: 'node.js', take: 'one language front to back. still my default runtime.' },
          { id: 'express', take: 'where i learned http. small, honest, everywhere.' },
          { id: 'rest apis', take: 'boring, predictable contracts beat clever ones.' },
          { id: 'websockets', take: 'for when the ui must feel alive.' },
        ],
      },
      {
        name: 'python',
        skills: [
          { id: 'python', take: 'my second home: data, ai and quick scripts.' },
          { id: 'flask', take: 'first python api i shipped. small and honest.' },
          { id: 'fastapi', take: "flask's grown-up sibling: async, typed, docs for free." },
          { id: 'django', take: 'batteries included. contributed to wagtail on it.' },
        ],
      },
    ],
  },
  {
    name: 'databases',
    groups: [
      {
        name: 'sql',
        skills: [
          { id: 'sql', take: 'the one query language that never goes out of date.' },
          { id: 'postgresql', take: 'the boring choice that wins. i moved unjob onto it.' },
          { id: 'mysql', take: 'solid workhorse; postgres just does more.' },
          { id: 'sqlite', take: 'a whole database in one file. perfect for tools and tests.' },
          { id: 'rds', take: "managed postgres/mysql: backups and failover i don't babysit." },
          { id: 'prisma', take: 'types from schema to query. migrations without fear.' },
          { id: 'supabase', take: 'postgres with batteries. ships an mvp in a weekend.' },
        ],
      },
      {
        name: 'nosql',
        skills: [
          { id: 'mongodb', take: 'great for prototypes. relational data wants a relational db.' },
          { id: 'dynamodb', take: 'design the keys first; then it scales without thinking.' },
          { id: 'redis', take: 'cache, queue, rate limit. one tool, many jobs.' },
        ],
      },
    ],
  },
  {
    name: 'aws',
    groups: [
      {
        name: 'compute',
        skills: [
          { id: 'ec2', take: 'the raw box. still the escape hatch for anything odd.' },
          { id: 'ecs', take: 'containers without managing servers. our services run here.' },
          { id: 'ecr', take: 'private image registry, scanned on push.' },
          { id: 'aws lambda', take: 'pay-per-run workers. perfect for bursty ai jobs.' },
          { id: 'autoscaling', take: 'scale on real load, not on hope.' },
        ],
      },
      {
        name: 'storage & cdn',
        skills: [
          { id: 's3', take: 'the bucket under everything: uploads, sites, backups.' },
          { id: 'cloudfront', take: 'cdn in front of s3 and apis. fast everywhere.' },
        ],
      },
      {
        name: 'networking',
        skills: [
          { id: 'vpc', take: 'subnets, security groups, no surprises.' },
          { id: 'alb', take: 'one front door for many services.' },
          { id: 'api gateway', take: 'http apis for lambdas, with auth and throttling.' },
          { id: 'route 53', take: 'dns as code. every domain we run lives here.' },
          { id: 'acm', take: 'free tls certs that renew themselves.' },
        ],
      },
      {
        name: 'messaging',
        skills: [
          { id: 'sqs', take: "queues absorb spikes so the app doesn't fall over." },
          { id: 'sns', take: 'fan-out notifications to whoever is listening.' },
          { id: 'ses', take: 'transactional email at pennies.' },
          { id: 'eventbridge', take: 'schedules and events without a cron server.' },
        ],
      },
      {
        name: 'security',
        skills: [
          { id: 'iam', take: 'learn it first. every outage story starts with a policy.' },
          { id: 'secrets manager', take: 'secrets live here, never in the repo.' },
          { id: 'ssm', take: 'config as parameters, versioned and audited.' },
          { id: 'kms', take: 'encryption keys you control.' },
        ],
      },
      {
        name: 'observability & cost',
        skills: [
          { id: 'cloudwatch', take: 'logs, metrics, alarms: the first place i look.' },
          { id: 'cost explorer', take: 'every architecture choice is a cost choice.' },
        ],
      },
    ],
  },
  {
    name: 'cloud & devops',
    groups: [
      {
        name: 'infra',
        skills: [
          { id: 'linux', take: 'every server is linux. get comfy in the terminal.' },
          { id: 'nginx', take: 'the quiet hero in front of half the internet.' },
          { id: 'docker', take: "containers or it didn't ship." },
          { id: 'kubernetes', take: "powerful, but earn it. day one doesn't need it." },
          { id: 'terraform', take: "if it's not in code, it doesn't exist. no click-ops." },
          { id: 'pulumi', take: 'infra in a real language when hcl runs out of road.' },
        ],
      },
      {
        name: 'ci & testing',
        skills: [
          { id: 'git', take: 'small commits, clear messages, nothing lost.' },
          { id: 'github actions', take: 'every repo gets a pipeline. ci lives next to the code.' },
          { id: 'jest', take: 'tests are how you change code without fear.' },
          { id: 'vitest', take: "jest's speed-run cousin. my default now." },
          { id: 'playwright', take: 'real browsers, real clicks. catches what unit tests miss.' },
        ],
      },
      {
        name: 'observability',
        skills: [
          { id: 'prometheus', take: "you can't fix what you can't see." },
          { id: 'grafana', take: 'dashboards people actually open.' },
        ],
      },
      {
        name: 'hosting',
        skills: [
          { id: 'google cloud', take: 'cloud run made shipping my promptfoo fork easy.' },
          { id: 'vercel', take: 'fastest path from git push to prod for next.js.' },
          { id: 'netlify', take: 'static sites with zero fuss.' },
          { id: 'cloudflare', take: 'this site runs here: edge, cheap, fast.' },
          { id: 'cloudflare workers', take: 'code at the edge, cold starts near zero.' },
        ],
      },
    ],
  },
  {
    name: 'ai & ml',
    groups: [
      {
        name: 'data & ml',
        skills: [
          {
            id: 'data science',
            take: 'pandas, notebooks, iit madras foundations. where ai began.',
          },
          { id: 'power bi', take: 'turning tables into decisions.' },
          {
            id: 'deep learning',
            take: 'pytorch experiments: emotion recognition, polyp detection.',
          },
          { id: 'opencv', take: 'the eyes behind every vision project.' },
        ],
      },
      {
        name: 'llms',
        skills: [
          { id: 'llm apps', take: 'turning models into products. prompts are code; test them.' },
          { id: 'langchain', take: 'great glue; know what it does under the hood.' },
          { id: 'vector dbs', take: 'the memory behind rag. chunking matters more than the db.' },
          { id: 'amazon bedrock', take: 'managed models in our own aws. powers my digital india.' },
          { id: 'whisper', take: 'speech to text that just works. built a pipeline on it.' },
          { id: 'promptfoo', take: 'evals or vibes. my fork got funded by its creator.' },
        ],
      },
    ],
  },
  {
    name: 'payments',
    groups: [
      {
        skills: [
          { id: 'razorpay', take: 'the india default. upi, cards and subscriptions in one place.' },
          { id: 'phonepe', take: 'upi at scale. what indian users already trust.' },
          { id: 'stripe', take: 'payments done right. the docs are the gold standard.' },
          { id: 'paddle', take: 'merchant of record: global tax handled for you.' },
          { id: 'dodo payments', take: 'merchant of record built for indie saas.' },
        ],
      },
    ],
  },
  {
    name: 'auth',
    groups: [
      {
        skills: [
          { id: 'oauth', take: "never store a password you don't have to." },
          { id: 'google sign-in', take: 'one tap beats any signup form.' },
          { id: 'next-auth', take: 'auth inside next.js with providers in minutes.' },
          { id: 'clerk', take: "auth is a product. don't build it twice." },
          { id: 'cognito', take: 'aws-native user pools; we run it in production.' },
          { id: 'auth0', take: 'enterprise sso without the pain.' },
          { id: 'firebase auth', take: 'fastest auth for a mobile mvp.' },
          { id: 'supabase auth', take: 'auth that sits right next to your postgres.' },
          { id: 'jwt', take: 'stateless sessions: short expiry, rotate keys, verify everything.' },
        ],
      },
    ],
  },
];
