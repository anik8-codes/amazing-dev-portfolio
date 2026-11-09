/** Pure helpers for the /play world: layout and movement maths, unit-tested without WebGL. */

export type Vec2 = readonly [x: number, z: number];

/** Distance between stations along the road (world units, ~metres). */
const STATION_GAP = 18;

/** Stations wind forward (towards −z) so walking ahead = moving forward in time. */
export function stationPositions(count: number): Vec2[] {
  return Array.from(
    { length: count },
    (_, i) => [Math.sin(i * 1.1) * 6, -i * STATION_GAP] as const,
  );
}

/** The island: an ellipse around all stations, with room to wander. */
export function islandFor(stations: readonly Vec2[]) {
  const zs = stations.map((s) => s[1]);
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  return { cx: 0, cz, rx: 26, rz: (Math.max(...zs) - Math.min(...zs)) / 2 + 16 };
}

/** Keep a point inside the island's walkable area (90% of the ellipse). */
export function clampToIsland(
  [x, z]: Vec2,
  island: { cx: number; cz: number; rx: number; rz: number },
): Vec2 {
  const dx = (x - island.cx) / (island.rx * 0.9);
  const dz = (z - island.cz) / (island.rz * 0.9);
  const d = Math.hypot(dx, dz);
  return d <= 1
    ? [x, z]
    : [island.cx + (dx / d) * island.rx * 0.9, island.cz + (dz / d) * island.rz * 0.9];
}

/** Index of the closest station within `radius`, or −1. */
export function nearestStation([x, z]: Vec2, stations: readonly Vec2[], radius = 3.2): number {
  let best = -1;
  let bestD = radius;
  stations.forEach(([sx, sz], i) => {
    const d = Math.hypot(x - sx, z - sz);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/** Deterministic pseudo-random numbers (mulberry32), so scenery is the same on every load. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Collider {
  x: number;
  z: number;
  r: number;
}

/** Push a point out of every circle it's inside (cheap, good enough for walking around props). */
export function collide([x, z]: Vec2, colliders: readonly Collider[], body = 0.35): Vec2 {
  let px = x;
  let pz = z;
  for (const c of colliders) {
    const dx = px - c.x;
    const dz = pz - c.z;
    const d = Math.hypot(dx, dz);
    const min = c.r + body;
    if (d < min) {
      const k = d > 1e-4 ? min / d : 0;
      px = d > 1e-4 ? c.x + dx * k : c.x + min;
      pz = d > 1e-4 ? c.z + dz * k : pz;
    }
  }
  return [px, pz];
}

/** Ease a value towards a target, frame-rate independent (`rate` per second). */
export function approach(current: number, target: number, rate: number, dt: number) {
  return target + (current - target) * Math.exp(-rate * dt);
}

/** Shortest signed angle from a to b, for smooth turning. */
export function angleDelta(a: number, b: number) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

/** Index of the last station the player has reached walking down the road (for outfits). */
export function eraIndex(z: number, stations: readonly Vec2[]): number {
  let i = 0;
  stations.forEach(([, sz], k) => {
    if (z <= sz + STATION_GAP / 2) i = k;
  });
  return i;
}
