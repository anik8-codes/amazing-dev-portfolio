import type { Look } from '@/assets/sprites';

/**
 * Where things sit on the desktop canvas, in px on a 1600 px wide canvas (y from the top of the
 * canvas, below the HUD). x scales with the viewport; y and sizes do not. Below the `xl`
 * breakpoint the canvas becomes a stacked mobile layout and these are ignored.
 */
export interface Pos {
  x: number;
  y: number;
  /** Tilt in degrees. */
  r?: number;
}

export interface VideoAsset {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
}

export interface Reel {
  title: string;
  caption: string;
  file: string;
  views?: string;
  /** Window size on desktop, px. */
  w: number;
  video: VideoAsset;
  pos: Pos;
}

export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 920;

// Local media for the preview; move to R2 when the media bucket is connected.
export const reels: readonly Reel[] = [
  {
    title: 'open dots',
    caption: 'Open Dots',
    file: 'open-dots.mp4',
    w: 196,
    pos: { x: 56, y: 150, r: -2 },
    video: {
      src: '/media/hero/open-dots.mp4',
      poster: '/media/hero/open-dots-poster.webp',
      label: 'Open Dots reel with Aniket',
      width: 540,
      height: 960,
    },
  },
];

export const terminal = { file: 'whoami.sh', pos: { x: 56, y: 570, r: 1 } } as const;

export const figurines: readonly { look: Look; pos: Pos }[] = [
  { look: 'creator', pos: { x: 280, y: 330 } },
  { look: 'gamer', pos: { x: 1260, y: 400 } },
  { look: 'chill', pos: { x: 300, y: 740 } },
  { look: 'builder', pos: { x: 1360, y: 650 } },
];

export const figurineHint = {
  label: 'character mode',
  text: 'tap a figure to switch mode ↙',
  pos: { x: 1260, y: 360 },
} as const;

export const cartridges: readonly { label: string; href: string; pos: Pos }[] = [
  { label: 'quests', href: '/quests', pos: { x: 260, y: 48, r: 8 } },
  { label: 'lore', href: '/lore', pos: { x: 1460, y: 480, r: -6 } },
  { label: 'blog', href: '/blog', pos: { x: 140, y: 790, r: -10 } },
];

/** One position per entry in src/config/socials.ts, matched by id. */
export const socialSpots: Record<string, Pos> = {
  x: { x: 1200, y: 52, r: -6 },
  instagram: { x: 1420, y: 100, r: 6 },
  youtube: { x: 360, y: 500, r: 4 },
  github: { x: 1440, y: 280, r: -4 },
  medium: { x: 1260, y: 210, r: 5 },
  threads: { x: 1460, y: 820, r: -5 },
  facebook: { x: 52, y: 820, r: 6 },
};

export const center = {
  top: 24,
  start: { label: 'press start', href: '/play', caption: '3D world · sound on · ~6 MB' },
  read: { label: 'read mode', href: '#read', caption: 'fast site · 0 loading' },
} as const;

export const intro = {
  title: 'intro',
  w: 576,
  video: {
    src: '/media/hero/intro.mp4',
    poster: '/media/hero/intro-poster.webp',
    label: 'Meet Aniket Singh',
    width: 576,
    height: 324,
  },
} as const;
