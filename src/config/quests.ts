export type Rarity = 'legendary' | 'rare' | 'common';
export type QuestStatus = 'shipped' | 'in progress' | 'stealth';

export interface Quest {
  slug: string;
  title: string;
  /** One line: what it is. */
  pitch: string;
  /** The number or outcome that matters. */
  result?: string;
  rarity: Rarity;
  status?: QuestStatus;
  /** Tech as text labels (brand: no logo walls). */
  stack: string[];
  href?: string;
  preview?: { src: string; alt: string; width: number; height: number };
  /** Public platform claims, distinct from Aniket's own contribution/results. */
  publishedStats?: { value: string; label: string }[];
  evidence?: { href: string; label: string; checked: string };
}

/** Featured project and its live link, supplied by Aniket. */
const featuredQuest = {
  slug: 'undrift',
  title: 'Undrift',
  pitch:
    'observability and automatic fixes for api drift, including changes in meaning that a structural diff misses.',
  result: 'current quest',
  rarity: 'legendary',
  status: 'in progress',
  stack: [],
  href: 'https://undrift.anik8.me',
  preview: {
    src: '/projects/undrift.webp',
    alt: 'Undrift landing page with its API observability dashboard preview',
    width: 1440,
    height: 810,
  },
} satisfies Quest;

/** Home projects in Aniket's requested order. More details and projects will follow. */
export const quests: readonly Quest[] = [
  featuredQuest,
  {
    slug: 'unjob',
    title: 'Unjob.ai',
    pitch:
      'on-demand creative services: book video editors, designers and ai specialists, with an expert assigned instantly.',
    result: '45,000+ users during my tenure',
    rarity: 'legendary',
    status: 'shipped',
    stack: ['next.js', 'node.js', 'postgresql', 'aws'],
    href: 'https://unjob.ai',
    preview: {
      src: '/projects/unjob.webp',
      alt: 'Unjob landing page with creative services and its current seasonal promotion',
      width: 1440,
      height: 810,
    },
    publishedStats: [{ value: '200K+', label: 'users' }],
    evidence: { href: 'https://unjob.ai', label: 'platform reports', checked: '10 Nov 2026' },
  },
  {
    slug: 'launchday',
    title: 'Launchday',
    pitch:
      'an ai launchpad for websites, logos and social posts, with lead capture, bookings and a showcase directory.',
    rarity: 'rare',
    status: 'shipped',
    // TODO(content): confirm the implementation stack with Aniket.
    stack: [],
    href: 'https://thelaunchday.ai',
    preview: {
      src: '/projects/launchday.webp',
      alt: 'Launchday landing page with its AI website creation prompt and website previews',
      width: 1440,
      height: 810,
    },
    publishedStats: [
      { value: '1,000+', label: 'websites created' },
      { value: '4.9★', label: 'average rating' },
      { value: '98%', label: 'customer satisfaction' },
    ],
    evidence: {
      href: 'https://thelaunchday.ai',
      label: 'platform reports',
      checked: '10 Nov 2026',
    },
  },
];

/** The spotlight project at the top of Projects. */
export const currentQuest = {
  ...featuredQuest,
  tagline: featuredQuest.pitch,
  liveLabel: 'visit live site',
  featuresLabel: 'how it works',
  features: [
    'learns dependency behavior from real traffic, in-process with no proxy hop',
    'detects structural, semantic and availability drift',
    'heals confident changes, flags uncertainty and validates applied fixes',
  ],
  details: {
    href: 'https://undrift.anik8.me/newsletter/the-silent-200',
    label: 'read the product update',
  },
};
