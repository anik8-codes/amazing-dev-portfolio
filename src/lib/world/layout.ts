export type Vec2 = readonly [number, number];

/** Deterministic pseudo-random numbers (mulberry32), so the island is the same on every load. */
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
interface Circle {
  at: Vec2;
  radius: number;
}

/** The coastline: the island radius wobbles with the angle so it isn't a perfect circle. */
export function shoreRadius(angle: number, radius: number): number {
  return radius + 3 * Math.sin(3 * angle) + 2 * Math.sin(5 * angle + 1) + Math.sin(9 * angle + 2);
}

/** Ground height: flat land, a sandy slope at the coast, then under the water. */
export function groundHeight(x: number, z: number, radius: number): number {
  const shore = shoreRadius(Math.atan2(z, x), radius);
  const d = Math.hypot(x, z) - shore;
  if (d < -8) return 0;
  const t = Math.min(1, (d + 8) / 14); // 0 at 8 m inland → 1 at 6 m out to sea
  return -3 * t * t * (3 - 2 * t);
}

/** How close a point is to being sand (0 inland → 1 at the water line). */
export function sandiness(x: number, z: number, radius: number): number {
  const d = Math.hypot(x, z) - shoreRadius(Math.atan2(z, x), radius);
  return Math.min(1, Math.max(0, (d + 9) / 6));
}

/** Seeded points on land, at least `gap` metres clear of every circle in `avoid`. */
export function scatter(
  count: number,
  seed: number,
  radius: number,
  avoid: readonly Circle[],
  gap = 2,
): Vec2[] {
  const rand = seeded(seed);
  const out: Vec2[] = [];
  for (let tries = 0; out.length < count && tries < count * 50; tries++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * (shoreRadius(a, radius) - 10);
    const p: Vec2 = [Math.cos(a) * r, Math.sin(a) * r];
    const clear = avoid.every((c) => Math.hypot(p[0] - c.at[0], p[1] - c.at[1]) > c.radius + gap);
    if (clear) out.push(p);
  }
  return out;
}

/** The area the player is standing in (the nearest one whose radius covers the point). */
export function areaAt<T extends Circle>(areas: readonly T[], x: number, z: number): T | null {
  let best: T | null = null;
  let bestD = Infinity;
  for (const a of areas) {
    const d = Math.hypot(x - a.at[0], z - a.at[1]);
    if (d < a.radius && d < bestD) {
      best = a;
      bestD = d;
    }
  }
  return best;
}

/** Brick positions for a pyramid `rows` high, centred on `at` (x, y, z of each brick centre). */
export function pyramid(rows: number, size: number, at: Vec2): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let row = 0; row < rows; row++) {
    const n = rows - row;
    for (let i = 0; i < n; i++) {
      out.push([at[0] + (i - (n - 1) / 2) * size * 1.02, size / 2 + row * size, at[1]]);
    }
  }
  return out;
}

/** Shortest signed turn from angle a to angle b (radians, -π..π). */
export function turn(a: number, b: number): number {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

/** Frame-rate independent ease toward a target (k ≈ how many "halvings" per second). */
export function damp(current: number, target: number, k: number, dt: number): number {
  return target + (current - target) * Math.exp(-k * dt);
}
