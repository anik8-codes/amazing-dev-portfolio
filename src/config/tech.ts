/**
 * Every technology the site can show (experience chips, skills), keyed by the name used in
 * config. Sources: Aniket's 2026 resume, his public repos and the MaxCode codebases.
 *
 * `icon` picks the logo: 'logos:<name>' (Iconify "logos" set, CC0, full colour) or
 * 'si:<slug>' (simple-icons, CC0). `pnpm tech-icons` writes each to public/tech/<id>.svg.
 * No logo exists for a few things: those show `abbr` as a text badge instead.
 */
export interface Tech {
  label: string;
  icon?: string;
  abbr?: string;
}

export const tech = {
  // languages & web
  html: { label: 'html', icon: 'logos:html-5' },
  css: { label: 'css', icon: 'logos:css-3' },
  javascript: { label: 'javascript', icon: 'logos:javascript' },
  typescript: { label: 'typescript', icon: 'logos:typescript-icon' },
  python: { label: 'python', icon: 'logos:python' },
  sql: { label: 'sql', abbr: 'SQL' },
  // frontend
  react: { label: 'react', icon: 'logos:react' },
  'next.js': { label: 'next.js', icon: 'si:nextdotjs' },
  'react native': { label: 'react native', icon: 'logos:react' },
  redux: { label: 'redux', icon: 'logos:redux' },
  tailwind: { label: 'tailwind', icon: 'logos:tailwindcss-icon' },
  'shadcn/ui': { label: 'shadcn/ui', icon: 'si:shadcnui' },
  motion: { label: 'framer motion', icon: 'logos:framer' },
  'three.js': { label: 'three.js', icon: 'si:threedotjs' },
  vite: { label: 'vite', icon: 'logos:vitejs' },
  'tanstack query': { label: 'tanstack query', icon: 'si:reactquery' },
  zod: { label: 'zod', icon: 'logos:zod' },
  vue: { label: 'vue', icon: 'logos:vue' },
  angular: { label: 'angular', icon: 'logos:angular-icon' },
  svelte: { label: 'svelte', icon: 'logos:svelte-icon' },
  // backend
  'node.js': { label: 'node.js', icon: 'logos:nodejs-icon' },
  express: { label: 'express', icon: 'si:express' },
  websockets: { label: 'websockets', icon: 'logos:websocket' },
  'rest apis': { label: 'rest apis', abbr: 'API' },
  flask: { label: 'flask', icon: 'si:flask' },
  fastapi: { label: 'fastapi', icon: 'logos:fastapi-icon' },
  django: { label: 'django', icon: 'si:django' },
  // databases
  postgresql: { label: 'postgresql', icon: 'logos:postgresql' },
  mysql: { label: 'mysql', icon: 'logos:mysql-icon' },
  sqlite: { label: 'sqlite', icon: 'si:sqlite' },
  mongodb: { label: 'mongodb', icon: 'logos:mongodb-icon' },
  redis: { label: 'redis', icon: 'logos:redis' },
  dynamodb: { label: 'dynamodb', icon: 'logos:aws-dynamodb' },
  rds: { label: 'aws rds', icon: 'logos:aws-rds' },
  prisma: { label: 'prisma', icon: 'si:prisma' },
  supabase: { label: 'supabase', icon: 'logos:supabase-icon' },
  // payments
  razorpay: { label: 'razorpay', icon: 'si:razorpay' },
  phonepe: { label: 'phonepe', icon: 'si:phonepe' },
  stripe: { label: 'stripe', icon: 'si:stripe' },
  paddle: { label: 'paddle', icon: 'si:paddle' },
  'dodo payments': { label: 'dodo payments', abbr: 'DODO' },
  // auth
  oauth: { label: 'oauth 2.0', icon: 'logos:oauth' },
  'google sign-in': { label: 'google sign-in', icon: 'logos:google-icon' },
  'next-auth': { label: 'next-auth', abbr: 'AUTH' },
  clerk: { label: 'clerk', icon: 'logos:clerk-icon' },
  cognito: { label: 'aws cognito', icon: 'logos:aws-cognito' },
  auth0: { label: 'auth0', icon: 'logos:auth0-icon' },
  'firebase auth': { label: 'firebase auth', icon: 'logos:firebase-icon' },
  'supabase auth': { label: 'supabase auth', icon: 'logos:supabase-icon' },
  jwt: { label: 'jwt', icon: 'logos:jwt-icon' },
  // aws
  aws: { label: 'aws', icon: 'logos:aws' },
  ec2: { label: 'ec2', icon: 'logos:aws-ec2' },
  ecs: { label: 'ecs fargate', icon: 'logos:aws-fargate' },
  ecr: { label: 'ecr', icon: 'logos:aws-ecs' },
  'aws lambda': { label: 'lambda', icon: 'logos:aws-lambda' },
  autoscaling: { label: 'auto scaling', icon: 'logos:aws-ec2' },
  s3: { label: 's3', icon: 'logos:aws-s3' },
  cloudfront: { label: 'cloudfront', icon: 'logos:aws-cloudfront' },
  vpc: { label: 'vpc', icon: 'logos:aws-vpc' },
  alb: { label: 'load balancer', icon: 'logos:aws-elb' },
  'api gateway': { label: 'api gateway', icon: 'logos:aws-api-gateway' },
  'route 53': { label: 'route 53', icon: 'logos:aws-route53' },
  acm: { label: 'acm', icon: 'logos:aws-certificate-manager' },
  sqs: { label: 'sqs', icon: 'logos:aws-sqs' },
  sns: { label: 'sns', icon: 'logos:aws-sns' },
  ses: { label: 'ses', icon: 'logos:aws-ses' },
  eventbridge: { label: 'eventbridge', icon: 'logos:aws-eventbridge' },
  iam: { label: 'iam', icon: 'logos:aws-iam' },
  'secrets manager': { label: 'secrets manager', icon: 'logos:aws-secrets-manager' },
  ssm: { label: 'parameter store', icon: 'logos:aws-systems-manager' },
  kms: { label: 'kms', icon: 'logos:aws-kms' },
  cloudwatch: { label: 'cloudwatch', icon: 'logos:aws-cloudwatch' },
  'cost explorer': { label: 'cost explorer', abbr: '$' },
  'amazon bedrock': { label: 'amazon bedrock', abbr: 'BR' },
  // cloud & devops
  linux: { label: 'linux', icon: 'logos:linux-tux' },
  nginx: { label: 'nginx', icon: 'logos:nginx' },
  git: { label: 'git', icon: 'logos:git-icon' },
  'github actions': { label: 'github actions', icon: 'logos:github-actions' },
  docker: { label: 'docker', icon: 'logos:docker-icon' },
  kubernetes: { label: 'kubernetes', icon: 'logos:kubernetes' },
  terraform: { label: 'terraform', icon: 'logos:terraform-icon' },
  pulumi: { label: 'pulumi', icon: 'logos:pulumi-icon' },
  prometheus: { label: 'prometheus', icon: 'logos:prometheus' },
  grafana: { label: 'grafana', icon: 'logos:grafana' },
  jest: { label: 'jest', icon: 'logos:jest' },
  vitest: { label: 'vitest', icon: 'logos:vitest' },
  playwright: { label: 'playwright', icon: 'logos:playwright' },
  'google cloud': { label: 'google cloud', icon: 'logos:google-cloud' },
  vercel: { label: 'vercel', icon: 'si:vercel' },
  netlify: { label: 'netlify', icon: 'logos:netlify-icon' },
  cloudflare: { label: 'cloudflare', icon: 'logos:cloudflare-icon' },
  'cloudflare workers': { label: 'cloudflare workers', icon: 'logos:cloudflare-workers-icon' },
  // ai & data
  'data science': { label: 'pandas', icon: 'logos:pandas-icon' },
  'power bi': { label: 'power bi', icon: 'logos:microsoft-power-bi' },
  'deep learning': { label: 'pytorch', icon: 'logos:pytorch-icon' },
  opencv: { label: 'opencv', icon: 'logos:opencv' },
  'llm apps': { label: 'llm apps', abbr: 'LLM' },
  langchain: { label: 'langchain', icon: 'logos:langchain-icon' },
  'vector dbs': { label: 'vector dbs', abbr: 'VEC' },
  whisper: { label: 'whisper', icon: 'logos:openai-icon' },
  promptfoo: { label: 'promptfoo', abbr: 'EVAL' },
} satisfies Record<string, Tech>;

export type TechName = keyof typeof tech;

/** File name for a tech's icon under public/tech/. */
export const techSlug = (id: string) => id.replace(/[^a-z0-9]+/g, '-');
