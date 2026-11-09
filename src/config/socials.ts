import { siFacebook, siGithub, siInstagram, siThreads, siX, siYoutube } from 'simple-icons';

export interface Social {
  id: string;
  label: string;
  href: string;
  /** 24 × 24 SVG path (simple-icons, CC0). */
  icon: string;
  /**
   * App-icon colours: tile background (colour or gradient) and glyph colour. These are the
   * platforms' own brand colours, the one place raw hex is allowed (third-party marks).
   */
  bg: string;
  fg: string;
}

/** An ellipse as an SVG path (two arcs). */
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

/**
 * Medium's mark: one circle and two narrowing ellipses (●●|). simple-icons now ships the
 * "Me" app tile instead, which reads wrong inside our own tile.
 */
const MEDIUM_MARK = [
  ellipse(6.77, 12, 6.77, 6.82),
  ellipse(17.58, 12, 3.38, 6.42),
  ellipse(22.81, 12, 1.19, 5.75),
].join('');

const INSTAGRAM_GRADIENT =
  'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)';

// TODO(decision-4): confirm the X handle. TODO(content): confirm the YouTube URL.
export const socials: readonly Social[] = [
  {
    id: 'github',
    label: 'github',
    href: 'https://github.com/anik8-codes',
    icon: siGithub.path,
    bg: '#181717',
    fg: '#ffffff',
  },
  {
    id: 'x',
    label: 'x',
    href: 'https://x.com/anik8codes',
    icon: siX.path,
    bg: '#000000',
    fg: '#ffffff',
  },
  {
    id: 'youtube',
    label: 'youtube',
    href: 'https://youtube.com/@anik8codes',
    icon: siYoutube.path,
    bg: '#ffffff',
    fg: '#FF0000',
  },
  {
    id: 'instagram',
    label: 'instagram',
    href: 'https://instagram.com/careerswithaniket',
    icon: siInstagram.path,
    bg: INSTAGRAM_GRADIENT,
    fg: '#ffffff',
  },
  {
    id: 'threads',
    label: 'threads',
    href: 'https://www.threads.net/@careerswithaniket',
    icon: siThreads.path,
    bg: '#000000',
    fg: '#ffffff',
  },
  {
    id: 'facebook',
    label: 'facebook',
    href: 'https://www.facebook.com/careerswithaniket',
    icon: siFacebook.path,
    bg: '#ffffff',
    fg: '#0866FF',
  },
  {
    id: 'medium',
    label: 'medium',
    href: 'https://medium.com/@aniketsinghn10',
    icon: MEDIUM_MARK,
    bg: '#000000',
    fg: '#ffffff',
  },
];
