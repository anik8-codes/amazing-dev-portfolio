import { expect, test } from 'vitest';
import { BED_BLANKET, BED_FRAME, BED_PILLOW, HEART, WORDMARK } from '../components/pixel/grids';
import { toRuns } from './pixel-grid';

test('brand grids have the sizes in docs/brand.md', () => {
  expect(WORDMARK).toHaveLength(7);
  for (const row of WORDMARK) expect(row).toHaveLength(39);
  expect(HEART).toHaveLength(6);
  for (const row of HEART) expect(row).toHaveLength(7);
});

test('runs cover exactly the filled cells', () => {
  expect(toRuns(['.XX.X', 'XXXXX'])).toEqual([
    { x: 1, y: 0, w: 2 },
    { x: 4, y: 0, w: 1 },
    { x: 0, y: 1, w: 5 },
  ]);
  for (const grid of [WORDMARK, HEART]) {
    const filled = grid.join('').split('X').length - 1;
    expect(toRuns(grid).reduce((n, r) => n + r.w, 0)).toBe(filled);
  }
});

test('bed layers stack: same 28 × 14 size', () => {
  for (const grid of [BED_FRAME, BED_PILLOW, BED_BLANKET]) {
    expect(grid).toHaveLength(14);
    for (const row of grid) expect(row).toHaveLength(28);
  }
});
