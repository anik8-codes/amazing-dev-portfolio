import type { Look } from '@/assets/sprites';
import { site } from './site';

export interface LoreChapter {
  slug: string;
  /** Shown big on the station sign. */
  year: string;
  title: string;
  place: string;
  /** What happened, one short line each. */
  lines: string[];
  /** anik8's outfit in that era (portrait on the chapter card). */
  look: Look;
  /** Landmark behind the station (masks from `pnpm scenes`). */
  scene?: 'rajwada' | 'india-gate' | 'desk';
  links?: { label: string; href: string }[];
}

/**
 * Aniket's story, oldest → newest: the road through the /play world. Each chapter is a station.
 * Sources: 2026 resume + LinkedIn export (Oct 2026).
 * TODO(content): add LinkedIn + Instagram posts per chapter once Aniket shares the data exports.
 */
export const lore: readonly LoreChapter[] = [
  {
    slug: 'indore',
    year: '2022',
    title: 'player 1 spawns',
    place: 'indore · ips academy',
    lines: [
      'started b.tech in computer science (ai & ml) at ips academy, indore',
      'first real lines of code, first all-nighters',
    ],
    look: 'default',
    scene: 'rajwada',
  },
  {
    slug: 'gdsc',
    year: '2023',
    title: 'joined the guild',
    place: 'gdsc ips academy',
    lines: [
      'core team at google developer student clubs',
      'workshops, events, and learning in public with other devs',
    ],
    look: 'hoodie',
  },
  {
    slug: 'side-quests',
    year: '2024',
    title: 'side quests everywhere',
    place: 'indore',
    lines: [
      'algorithm developer for team baja saeindia',
      'core team for tedx ipsa; technical team at the ips ies tech club',
      'iit madras bs in data science: foundation level done',
    ],
    look: 'hackathon',
  },
  {
    slug: 'first-job',
    year: '2024',
    title: 'first real job',
    place: 'botmartz it solutions · remote',
    lines: [
      'python developer & data analysis intern',
      'shipped astroshala, a rag chatbot on flask + vector databases',
      'became tech lead for gdg ipsa: built and ran its website and tools',
    ],
    look: 'work',
    scene: 'desk',
  },
  {
    slug: 'hackathons',
    year: '2024 →',
    title: 'the hackathon arena',
    place: 'india, one weekend at a time',
    lines: [
      'hack the mountains 5.0, hackindore, smart india hackathon, isro bharatiya antariksh',
      'won hackwave with fyrebit',
      'walk the banners: one per hackathon',
    ],
    look: 'hackathon',
  },
  {
    slug: 'qualimatrix',
    year: '2025',
    title: 'shipped straight to prod',
    place: 'qualimatrix technologies · indore',
    lines: [
      'built the jobs flow of skill access, frontend to backend',
      'emotion recognition, whisper speech-to-text, an ai question generator',
      'my promptfoo work got funded by its creator',
    ],
    look: 'builder',
    scene: 'rajwada',
  },
  {
    slug: 'unjob',
    year: '2025',
    title: 'zero to 45,000 users',
    place: 'unjob.ai · noida',
    lines: [
      'software development lead, then project lead',
      'mvp to production for 45,000+ users; led the dev team',
      'won hackwave with fyrebit; open source in wagtail, asyncapi, alchemyst',
    ],
    look: 'creator',
    scene: 'india-gate',
    links: [{ label: 'unjob.ai', href: 'https://unjob.ai' }],
  },
  {
    slug: 'maxcode',
    year: '2026',
    title: 'chief technical officer',
    place: 'maxcode it solutions · indore',
    lines: [
      'running engineering: my digital india, maxivo, and the aws they run on',
      'built the tedx ipsa 2026 platform: 10,000+ users a day at peak',
      'teaching cloud & devops from zero to 100 as @careerswithaniket',
    ],
    look: 'formal',
    links: [{ label: 'maxcode', href: 'https://www.maxcodeitsolutions.com/' }],
  },
  {
    slug: 'next',
    year: 'next',
    title: 'to be continued',
    place: 'wherever this goes',
    lines: ['got a quest for me? book a call and let’s build it.'],
    look: 'chill',
    links: [{ label: 'book a call', href: site.booking }],
  },
];

/** Something you can walk up to: tells one small story. */
interface Poi {
  title: string;
  text: string;
  /** Special interaction in the card. */
  kind?: 'cookies';
  link?: { label: string; href: string };
}

export interface Place {
  /** Chapter slug it belongs to; position is relative to that chapter's place on the island. */
  chapter: string;
  at: [x: number, z: number];
  poi: Poi;
}

/**
 * The little stories hidden around the island (a floating marker each). TODO(content): Aniket to add more of these (they're the fun
 * part): anything you bought, learned, ate, won, broke or shipped.
 */
export const places: readonly Place[] = [
  // 2022 · indore
  {
    chapter: 'indore',
    at: [-10, -3],
    poi: {
      title: 'rajwada, indore',
      text: 'home city. seven storeys of holkar history in the middle of the old market.',
    },
  },
  {
    chapter: 'indore',
    at: [9, -3],
    poi: {
      title: 'ips academy',
      text: 'b.tech cse (ai & ml), 2022 → 2026. where the first all-nighters happened.',
    },
  },
  {
    chapter: 'indore',
    at: [5, 4],
    poi: {
      title: 'poha + jalebi',
      text: "indore's official breakfast. fuel for every 8 am lecture.",
    },
  },
  // 2023 · gdsc
  {
    chapter: 'gdsc',
    at: [7.5, -1],
    poi: {
      title: 'gdsc core team',
      text: 'first workshops, first stage, first time teaching code to a room full of people.',
    },
  },
  // 2024 · side quests
  {
    chapter: 'side-quests',
    at: [-7.5, 1],
    poi: {
      title: 'team baja saeindia',
      text: 'algorithm developer for an off-road buggy. code that has to survive mud.',
    },
  },
  {
    chapter: 'side-quests',
    at: [7.5, -2],
    poi: {
      title: 'tedx ipsa',
      text: 'core team, 2024. later built the tedx ipsa 2026 platform for 10,000+ users a day.',
    },
  },
  {
    chapter: 'side-quests',
    at: [6, 4],
    poi: {
      title: 'iit madras bs',
      text: 'data science foundation level done, alongside b.tech. math, stats, python.',
    },
  },
  // 2024 · first job
  {
    chapter: 'first-job',
    at: [-8.5, -1],
    poi: {
      title: 'botmartz, from my room',
      text: 'remote internship: shipped astroshala, a rag chatbot on flask + vector dbs, from this desk.',
    },
  },
  // hackathon arena. TODO(content): Aniket to confirm which were wins / mentoring, add the rest + photos.
  {
    chapter: 'hackathons',
    at: [-5, 2],
    poi: {
      title: 'hackwave: winners',
      text: 'won with fyrebit: fashion search that compares products across every store at once.',
    },
  },
  {
    chapter: 'hackathons',
    at: [-8, -3],
    poi: {
      title: 'hack the mountains 5.0',
      text: 'mlh hackathon at marwadi university, gujarat, sep 2024, with team tier3hackers.',
    },
  },
  {
    chapter: 'hackathons',
    at: [7, -4],
    poi: { title: 'hackindore', text: 'home-town hackathon with team algobusters.' },
  },
  {
    chapter: 'hackathons',
    at: [8, 2],
    poi: {
      title: 'smart india hackathon',
      text: 'prototypes for real problem statements: maitri ai, energy dashboard, a camera-scanner dashboard, waste management.',
    },
  },
  {
    chapter: 'hackathons',
    at: [-9, 4],
    poi: {
      title: 'isro bharatiya antariksh hackathon',
      text: 'space-tech problem statements, 2025.',
    },
  },
  {
    chapter: 'hackathons',
    at: [2.5, -7],
    poi: { title: 'singapore india hackathon', text: 'idea round, 2026.' },
  },
  // 2025 · qualimatrix
  {
    chapter: 'qualimatrix',
    at: [8.5, -2],
    poi: {
      title: 'qualimatrix technologies',
      text: 'built the jobs flow of skill access, whisper speech-to-text and emotion recognition.',
    },
  },
  {
    chapter: 'qualimatrix',
    at: [-6, 1],
    poi: {
      title: 'promptfoo, funded',
      text: 'customised promptfoo for llm evals on cloud run, and its creator funded the work.',
    },
  },
  // 2025 · unjob
  {
    chapter: 'unjob',
    at: [-10, -3],
    poi: { title: 'delhi ncr', text: 'moved up north for unjob.ai. india gate on the weekends.' },
  },
  {
    chapter: 'unjob',
    at: [10, -5],
    poi: {
      title: 'zero to 45,000 users',
      text: 'took unjob.ai from mvp to production, then led the dev team as project lead.',
    },
  },
  // 2026 · maxcode
  {
    chapter: 'maxcode',
    at: [-9, -2],
    poi: {
      title: 'chief technical officer',
      text: 'running engineering at maxcode it solutions: my digital india, maxivo, and the platform.',
    },
  },
  {
    chapter: 'maxcode',
    at: [8.5, -3],
    poi: {
      title: 'the aws behind it all',
      text: 'lambda, ecs, dynamodb, cognito, bedrock. all in terraform, all through github actions.',
    },
  },
  {
    chapter: 'maxcode',
    at: [5, 3],
    poi: { title: 'new bike', text: 'just bought it. the commute got a lot more fun.' },
  },
  {
    chapter: 'maxcode',
    at: [-4.5, 4.5],
    poi: { title: 'new iphone pro', text: 'the latest upgrade. most of my reels are shot on it.' },
  },
  {
    chapter: 'maxcode',
    at: [9, 3],
    poi: {
      title: '@careerswithaniket',
      text: 'devops, backend & ai, explained in 60 seconds. the camera is always on.',
    },
  },
  // next
  {
    chapter: 'next',
    at: [-5.5, 1],
    poi: {
      title: 'accept cookies?',
      text: 'this world tracks nothing. these cookies are just cookies.',
      kind: 'cookies',
    },
  },
  {
    chapter: 'next',
    at: [6, 0],
    poi: {
      title: 'currently learning',
      text: 'kubernetes deep-dives, ai agents, and system design at scale.',
    },
  },
  {
    chapter: 'next',
    at: [0, -7],
    poi: {
      title: "what's next?",
      text: 'got a quest for me? step through and book a call.',
      link: { label: 'book a call', href: site.booking },
    },
  },
];
