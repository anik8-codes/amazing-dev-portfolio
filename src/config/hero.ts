import type { Look } from '@/assets/sprites';

/**
 * Where things sit on the desktop canvas, in px on a 1600 px wide canvas (y from the top of the
 * canvas, below the HUD). x scales with the viewport; y and sizes do not. Below the `lg`
 * breakpoint the canvas becomes a stacked mobile layout and these are ignored.
 */
export interface Pos {
  x: number;
  y: number;
  /** Tilt in degrees. */
  r?: number;
  /** Position the item by its centre rather than its top-left corner. */
  centered?: boolean;
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
export const CANVAS_HEIGHT = 728;

// Local media for the preview; move to R2 when the media bucket is connected.
export const reels: readonly Reel[] = [
  {
    title: 'open dots',
    caption: 'Open Dots',
    file: 'open-dots.mp4',
    w: 160,
    pos: { x: 48, y: 108, r: -3 },
    video: {
      src: '/media/hero/open-dots.mp4',
      poster: '/media/hero/open-dots-poster.webp',
      label: 'Open Dots reel with Aniket',
      width: 540,
      height: 960,
    },
  },
];

export const terminal = { file: 'whoami.sh', pos: { x: 1280, y: 412, r: 2 } } as const;

export const figurines: readonly Look[] = ['creator', 'gamer', 'builder', 'chill'];
export const figurineHint = {
  label: 'character mode',
  text: 'pick a look',
} as const;

/** Three mirrored pairs around the wordmark, plus one centred beneath it. */
export const socialSpots: Record<string, Pos> = {
  github: { x: 410, y: 80, r: -5, centered: true },
  x: { x: 1190, y: 80, r: 5, centered: true },
  instagram: { x: 345, y: 320, r: -4, centered: true },
  youtube: { x: 1255, y: 320, r: 4, centered: true },
  medium: { x: 410, y: 548, r: -5, centered: true },
  threads: { x: 1190, y: 548, r: 5, centered: true },
  facebook: { x: 800, y: 680, r: 0, centered: true },
};

export const center = {
  top: 286,
  start: { label: 'press start', href: '/play', caption: '3D world · sound on · ~6 MB' },
} as const;

export const intro = {
  title: 'intro.mp4',
  top: 16,
  w: 384,
  video: {
    src: '/media/hero/intro.mp4',
    poster: '/media/hero/intro-poster.webp',
    label: 'Meet Aniket Singh',
    width: 576,
    height: 324,
  },
} as const;
