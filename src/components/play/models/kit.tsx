'use client';

import { useEffect, useMemo } from 'react';
import { CanvasTexture, MeshStandardMaterial, SRGBColorSpace } from 'three';

type V3 = [number, number, number];

/** One shared material per colour: hundreds of props, a handful of materials. */
const cache = new Map<string, MeshStandardMaterial>();
export function mat(color: string, emissive = false) {
  const key = `${color}${emissive ? '!' : ''}`;
  let m = cache.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      roughness: 0.85,
      metalness: 0,
      ...(emissive ? { emissive: color, emissiveIntensity: 1.4 } : {}),
    });
    cache.set(key, m);
  }
  return m;
}

interface Part {
  p?: V3;
  r?: V3;
  c: string;
  glow?: boolean;
  shadow?: boolean;
}

/** Box. */
export function B({ p, r, s, c, glow, shadow = true }: Part & { s: V3 }) {
  return (
    <mesh position={p} rotation={r} material={mat(c, glow)} castShadow={shadow} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  );
}

/** Cylinder (radius top, radius bottom, height, segments). */
export function C({
  p,
  r,
  a,
  c,
  glow,
  shadow = true,
}: Part & { a: [number, number, number, number?] }) {
  return (
    <mesh position={p} rotation={r} material={mat(c, glow)} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[a[0], a[1], a[2], a[3] ?? 12]} />
    </mesh>
  );
}

/** Sphere (radius, detail 0 = chunky low-poly). */
export function S({
  p,
  r,
  rad,
  c,
  glow,
  detail = 1,
  shadow = true,
}: Part & { rad: number; detail?: number }) {
  return (
    <mesh position={p} rotation={r} material={mat(c, glow)} castShadow={shadow} receiveShadow>
      <icosahedronGeometry args={[rad, detail]} />
    </mesh>
  );
}

/** Font stacks from next/font (src/app/fonts.ts). */
const cssFont = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--font-${name}`).trim() ||
  'sans-serif';

/** A flat painted sign: text drawn into a canvas once (pixel font for `pixel`). */
export function Label({
  text,
  w,
  h,
  p,
  r,
  bg = '#fffaf0',
  fg = '#1d1630',
  pixel = false,
}: {
  text: string;
  w: number;
  h: number;
  p?: V3;
  r?: V3;
  bg?: string;
  fg?: string;
  pixel?: boolean;
}) {
  const texture = useMemo(() => {
    const px = 128;
    const c = document.createElement('canvas');
    c.width = Math.round(w * px);
    c.height = Math.round(h * px);
    const g = c.getContext('2d')!;
    g.fillStyle = bg;
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const lines = text.split('\n');
    const size = Math.min(c.height / (lines.length * 1.5), pixel ? 44 : 60);
    g.font = pixel ? `${size}px ${cssFont('press-start')}` : `800 ${size}px ${cssFont('manrope')}`;
    lines.forEach((l, i) =>
      g.fillText(
        l,
        c.width / 2,
        c.height / 2 + (i - (lines.length - 1) / 2) * size * 1.4,
        c.width * 0.92,
      ),
    );
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [text, w, h, bg, fg, pixel]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={p} rotation={r}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
