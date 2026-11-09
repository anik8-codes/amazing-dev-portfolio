'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import type { LoreChapter } from '@/config/lore';
import type { Vec2 } from '@/lib/play';
import { B, Label } from './models/kit';
import type { Palette } from './palette';

/** A chapter marker: a wooden signpost by the road and a ring on the ground that lights up. */
export function Station({
  chapter,
  at,
  active,
  palette,
}: {
  chapter: LoreChapter;
  at: Vec2;
  active: boolean;
  palette: Palette;
}) {
  const side = at[0] >= 0 ? -1 : 1;
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current)
      ring.current.scale.setScalar(active ? 1 + Math.sin(clock.elapsedTime * 3) * 0.04 : 1);
  });
  return (
    <group position={[at[0], 0, at[1]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.5, 1.8, 40]} />
        <meshBasicMaterial
          color={active ? palette.red : palette.sign}
          transparent
          opacity={active ? 0.95 : 0.6}
        />
      </mesh>
      <group position={[side * 2.4, 0, 0.6]} rotation={[0, side * 0.35, 0]}>
        {[-1.15, 1.15].map((x) => (
          <B key={x} p={[x, 0.95, 0]} s={[0.14, 1.9, 0.14]} c="#7a5236" />
        ))}
        <B p={[0, 2.25, -0.03]} s={[2.9, 1.45, 0.1]} c="#7a5236" />
        <Label
          text={`${chapter.year.toUpperCase()}\n${chapter.title}`}
          w={2.7}
          h={1.25}
          p={[0, 2.25, 0.03]}
          bg={palette.sign}
          fg={palette.ink}
          pixel
        />
      </group>
    </group>
  );
}
