import { expect, test } from 'vitest';
import {
  angleDelta,
  approach,
  clampToIsland,
  collide,
  eraIndex,
  islandFor,
  nearestStation,
  seeded,
  stationPositions,
} from './play';

const stations = stationPositions(4);

test('stations march forward in time along −z', () => {
  expect(stations.map((s) => s[1])).toEqual([-0, -18, -36, -54]);
});

test('island contains every station; clamp pulls stray points back inside', () => {
  const island = islandFor(stations);
  for (const s of stations) expect(clampToIsland(s, island)).toEqual(s);
  const [x, z] = clampToIsland([100, island.cz], island);
  expect(x).toBeCloseTo(island.rx * 0.9);
  expect(z).toBeCloseTo(island.cz);
});

test('nearest station only within radius', () => {
  expect(nearestStation([stations[2]![0] + 1, stations[2]![1]], stations)).toBe(2);
  expect(nearestStation([50, 50], stations)).toBe(-1);
});

test('seeded random is repeatable', () => {
  const a = seeded(7);
  const b = seeded(7);
  expect([a(), a(), a()]).toEqual([b(), b(), b()]);
});

test('collide pushes the player out of props, leaves free space alone', () => {
  const c = [{ x: 0, z: 0, r: 1 }];
  const [x, z] = collide([0.5, 0], c, 0.5);
  expect(x).toBeCloseTo(1.5);
  expect(z).toBeCloseTo(0);
  expect(collide([5, 5], c)).toEqual([5, 5]);
});

test('approach eases without overshoot; angleDelta takes the short way round', () => {
  const v = approach(0, 10, 5, 0.1);
  expect(v).toBeGreaterThan(0);
  expect(v).toBeLessThan(10);
  expect(approach(0, 10, 5, 100)).toBeCloseTo(10);
  expect(angleDelta(Math.PI * 0.9, -Math.PI * 0.9)).toBeCloseTo(Math.PI * 0.2);
});

test('era follows how far down the road you are', () => {
  expect(eraIndex(2, stations)).toBe(0);
  expect(eraIndex(-20, stations)).toBe(1);
  expect(eraIndex(-80, stations)).toBe(3);
});
