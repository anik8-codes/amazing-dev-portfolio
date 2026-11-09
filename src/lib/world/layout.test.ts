import { describe, expect, it } from 'vitest';
import { areaAt, damp, groundHeight, pyramid, scatter, seeded, shoreRadius, turn } from './layout';

describe('island shape', () => {
  it('is flat inland and under water past the coast', () => {
    expect(groundHeight(0, 0, 60)).toBe(0);
    expect(groundHeight(80, 0, 60)).toBeLessThan(-2.9);
    expect(shoreRadius(1, 60)).toBeGreaterThan(53);
  });
});

describe('scatter', () => {
  it('is deterministic and keeps clear of areas', () => {
    const avoid = [{ at: [0, 0] as const, radius: 10 }];
    const a = scatter(40, 7, 60, avoid);
    expect(a).toEqual(scatter(40, 7, 60, avoid));
    expect(a).toHaveLength(40);
    expect(a.every(([x, z]) => Math.hypot(x, z) > 12)).toBe(true);
  });
});

describe('areaAt', () => {
  const areas = [
    { id: 'a', at: [0, 0] as const, radius: 5 },
    { id: 'b', at: [6, 0] as const, radius: 5 },
  ];
  it('picks the nearest covering area, or none', () => {
    expect(areaAt(areas, 1, 0)?.id).toBe('a');
    expect(areaAt(areas, 5, 0)?.id).toBe('b');
    expect(areaAt(areas, 0, 20)).toBeNull();
  });
});

describe('helpers', () => {
  it('builds a pyramid of n(n+1)/2 bricks', () => {
    expect(pyramid(4, 1, [0, 0])).toHaveLength(10);
  });
  it('turns the short way round', () => {
    expect(turn(3, -3)).toBeCloseTo(2 * Math.PI - 6);
  });
  it('damps toward the target', () => {
    expect(damp(0, 10, 5, 1)).toBeGreaterThan(9.9);
  });
});

describe('seeded', () => {
  it('repeats for the same seed', () => {
    const a = seeded(7);
    const b = seeded(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
