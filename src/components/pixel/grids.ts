import type { PixelGrid } from '@/lib/pixel-grid';

/** Lowercase `anik8` on the Press Start 2P grid (docs/brand.md, 39 × 7). */
export const WORDMARK: PixelGrid = [
  '...................XX...XX.......XXXX..',
  '........................XX......XX...X.',
  '.XXXXX..XXXXXX....XXX...XX...XX.XXX..X.',
  '.....XX.XX...XX....XX...XX..XX...XXXX..',
  '.XXXXXX.XX...XX....XX...XXXXX...X..XXXX',
  'XX...XX.XX...XX....XX...XX..XX..X....XX',
  '.XXXXXX.XX...XX..XXXXXX.XX...XX..XXXXX.',
];

/** Life heart (docs/brand.md, 7 × 6). */
export const HEART: PixelGrid = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];

/*
 * Bed for the sleeping cursor runner: side view, 28 × 14 cells, drawn in three layers so the
 * head sprite can sit between pillow and blanket (= tucked in). Same size, stacked in order.
 */
export const BED_FRAME: PixelGrid = [
  'XX..........................',
  'XX..........................',
  'XX..........................',
  'XX..........................',
  'XX..........................',
  'XX........................XX',
  'XX........................XX',
  'XX........................XX',
  'XX........................XX',
  'XX........................XX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XX........................XX',
  'XX........................XX',
];

export const BED_PILLOW: PixelGrid = [
  '............................',
  '............................',
  '............................',
  '............................',
  '............................',
  '...XXXXX....................',
  '..XXXXXXX...................',
  '..XXXXXXX...................',
  '..XXXXXXX...................',
  '..XXXXXXX...................',
  '............................',
  '............................',
  '............................',
  '............................',
];

export const BED_BLANKET: PixelGrid = [
  '............................',
  '............................',
  '............................',
  '............................',
  '...........XXXXXXXXXXXX.....',
  '.........XXXXXXXXXXXXXXXX...',
  '.......XXXXXXXXXXXXXXXXXXX..',
  '......XXXXXXXXXXXXXXXXXXXX..',
  '......XXXXXXXXXXXXXXXXXXXX..',
  '......XXXXXXXXXXXXXXXXXXXX..',
  '............................',
  '............................',
  '............................',
  '............................',
];
