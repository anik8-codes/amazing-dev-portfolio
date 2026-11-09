/** A pixel-art bitmap as text rows: `X` = filled cell, anything else = empty. */
export type PixelGrid = readonly string[];

export interface Run {
  x: number;
  y: number;
  w: number;
}

/** Collapse each row's filled cells into horizontal runs, so an SVG needs one rect per run. */
export function toRuns(grid: PixelGrid): Run[] {
  const runs: Run[] = [];
  grid.forEach((row, y) => {
    for (const m of row.matchAll(/X+/g)) runs.push({ x: m.index, y, w: m[0].length });
  });
  return runs;
}
