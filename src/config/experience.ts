import type { StaticImageData } from 'next/image';
import gate1 from '@/assets/scenes/india-gate-1.png';
import gate2 from '@/assets/scenes/india-gate-2.png';
import rajwada1 from '@/assets/scenes/rajwada-1.png';
import rajwada2 from '@/assets/scenes/rajwada-2.png';
import type { Look } from '@/assets/sprites';
import type { TechName } from './tech';

export interface Photo {
  /** Path under /public, e.g. '/experience/unjob/team.jpg'. Omit to show a placeholder. */
  src?: string;
  caption: string;
  width?: number;
  height?: number;
}

/** One title held at a company. Several = a promotion ladder, newest first. */
export interface Role {
  title: string;
  /** ISO month, e.g. '2025-06'. */
  start: string;
  /** ISO month, or null while it's the current title. */
  end: string | null;
}

export interface Job {
  /** URL of the detail page: /experience/<slug>/. */
  slug: string;
  company: string;
  /** Company website. */
  website?: string;
  /** Company LinkedIn page. */
  linkedin?: string;
  place: string;
  /** e.g. full-time, internship. */
  kind: string;
  /** Titles held here, newest first (intern → lead shows as a ladder). */
  roles: readonly Role[];
  /** One line about the company / the work. */
  summary: string;
  /** What I did: one achievement per line. */
  shipped: string[];
  /** Tech used, shown as logo chips (src/config/tech.ts). */
  stack: TechName[];
  /** The look anik8 wore in that era. */
  look: Look;
  /** Photos from that time. TODO(content): Aniket to send real photos (4 per job is ideal). */
  photos: Photo[];
  environment?: { href: string; label: string; caption: string };
  /**
   * Where the work happened, as a duotone illustration: silhouette + shading masks from
   * `pnpm scenes`, painted in theme colours (credits: media/scenes/CREDITS.md).
   */
  scene?: {
    tones: readonly [StaticImageData, StaticImageData];
    label: string;
    alt: string;
  };
}

const placeholders = (where: string): Photo[] => [
  { caption: `${where} · photo 1` },
  { caption: `${where} · photo 2` },
  { caption: `${where} · photo 3` },
  { caption: `${where} · photo 4` },
];

/** The full span at a company: first title's start → current title's end. */
export const span = (job: Job) => ({
  start: job.roles[job.roles.length - 1]!.start,
  end: job.roles[0]!.end,
});

/**
 * Experience, NEWEST FIRST (Aniket: the latest is the best). Facts from Aniket's LinkedIn
 * export (Oct 2026) and resume; wording fresh for this site.
 */
export const jobs: readonly Job[] = [
  {
    slug: 'maxcode',
    company: 'MaxCode IT Solutions',
    website: 'https://www.maxcodeitsolutions.com/',
    linkedin: 'https://www.linkedin.com/company/maxcode-it-solutions/',
    place: 'indore',
    kind: 'full-time',
    roles: [{ title: 'Chief Technical Officer', start: '2026-05', end: null }],
    summary: 'running engineering: the products, the platform and the cloud they run on.',
    shipped: [
      'leading My Digital India: ai website, logo and post generation on aws lambda + bedrock',
      'building Maxivo, a centralised cms and social media management platform',
      'owning the cloud: aws infrastructure as code with terraform, ci/cd on github actions',
      'billing, lead capture and the workers behind them, from design to production',
    ],
    stack: [
      'next.js',
      'typescript',
      'aws lambda',
      'amazon bedrock',
      'ecs',
      'dynamodb',
      's3',
      'cognito',
      'terraform',
      'github actions',
      'razorpay',
      'paddle',
      'dodo payments',
    ],
    look: 'formal',
    photos: [
      {
        src: '/experience/maxcode/working.webp',
        caption: 'at my desk · MaxCode',
        width: 720,
        height: 1280,
      },
      {
        src: '/experience/maxcode/diwali.webp',
        caption: 'Diwali at MaxCode',
        width: 720,
        height: 1280,
      },
    ],
  },
  {
    slug: 'unjob',
    company: 'Unjob.ai',
    website: 'https://unjob.ai',
    place: 'noida · hybrid',
    kind: 'full-time',
    roles: [
      { title: 'Project Lead', start: '2025-09', end: '2026-05' },
      { title: 'Software Development Lead', start: '2025-07', end: '2025-09' },
    ],
    summary: 'an ai freelancer marketplace, built from zero to 45,000+ users.',
    shipped: [
      'took the platform from mvp to production: 45,000+ users across web and mobile',
      'went from individual contributor to leading the dev team; mentored junior developers',
      'oversaw the gig marketplace, a student counselling chatbot and the admin dashboards',
      'set up how we ship: scrum calls, test-db checks, review and approval before production',
      'led the mongodb → postgresql migration for consistency, faster queries and reliability',
      'locked down production credentials and streamlined pr reviews',
    ],
    stack: [
      'next.js',
      'react',
      'typescript',
      'node.js',
      'postgresql',
      'mongodb',
      'tailwind',
      'aws',
      'vercel',
    ],
    look: 'builder',
    photos: placeholders('unjob.ai'),
    scene: {
      tones: [gate1, gate2],
      label: 'noida · ncr',
      alt: 'illustration of India Gate, New Delhi',
    },
  },
  {
    slug: 'qualimatrix',
    company: 'Qualimatrix Technologies',
    website: 'https://www.qualimatrix.tech/',
    linkedin: 'https://www.linkedin.com/company/qualimatrix/',
    place: 'indore · on-site',
    kind: 'internship',
    roles: [{ title: 'Associate Software Developer Intern', start: '2025-03', end: '2025-06' }],
    summary: 'built across skill access, the flagship product: jobs, ai, ml and llm evals.',
    shipped: [
      'built the job creation and application flow in skill access, frontend and backend',
      'integrated an ai question generator: mcqs, true/false and short answers',
      'facial emotion recognition with pytorch, opencv and efficientnet',
      'a speech-to-text pipeline on whisper and faster-whisper with json output',
      'customised promptfoo for llm evals on google cloud run; the work got funded by its creator',
      'ui and logic improvements to the lms and erp products, documented end to end',
    ],
    stack: [
      'react',
      'next.js',
      'node.js',
      'mongodb',
      'python',
      'deep learning',
      'opencv',
      'whisper',
      'promptfoo',
      'google cloud',
    ],
    look: 'hoodie',
    photos: placeholders('qualimatrix'),
    scene: {
      tones: [rajwada1, rajwada2],
      label: 'indore · rajwada',
      alt: 'illustration of Rajwada palace, Indore',
    },
  },
  {
    slug: 'botmartz',
    company: 'Botmartz IT Solutions',
    website: 'https://www.botmartz.com/',
    linkedin: 'https://www.linkedin.com/company/botmartz-it-solutions/',
    place: 'indore · remote',
    kind: 'internship',
    roles: [{ title: 'Python Developer & Data Analysis Intern', start: '2024-09', end: '2025-02' }],
    summary: 'first real-world ai: a rag chatbot, python backends and data.',
    shipped: [
      'built and deployed astroshala, a RAG chatbot on flask + vector databases',
      'wrote backend services in flask and fastapi',
      'managed data with sql and built power bi dashboards the business could act on',
    ],
    stack: ['python', 'flask', 'fastapi', 'vector dbs', 'sql', 'power bi', 'mongodb', 'postgresql'],
    look: 'work',
    photos: placeholders('botmartz'),
    environment: {
      href: '/office/',
      label: 'enter virtual environment',
      caption: 'remote · step inside my home workspace',
    },
  },
];
