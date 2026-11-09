'use client';

import type { ThreeEvent } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D, type CatmullRomCurve3 } from 'three';
import { seeded, type Collider } from '@/lib/play';
import type { Palette } from './palette';

type Island = { cx: number; cz: number; rx: number; rz: number };
type Item = { x: number; z: number; s: number; r: number; c: string };

/** Distance from a point to the road, using pre-sampled road points. */
const roadDistance = (x: number, z: number, samples: readonly [number, number][]) =>
  Math.min(...samples.map(([sx, sz]) => Math.hypot(x - sx, z - sz)));

/** Deterministic scatter that keeps clear of the road and of every prop. */
function scatter(
  island: Island,
  samples: readonly [number, number][],
  colliders: readonly Collider[],
  count: number,
  seed: number,
  colors: readonly string[],
  minRoad: number,
  scale: [number, number],
) {
  const rnd = seeded(seed);
  const out: Item[] = [];
  let tries = 0;
  while (out.length < count && tries++ < count * 30) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.9;
    const x = island.cx + Math.cos(a) * island.rx * d;
    const z = island.cz + Math.sin(a) * island.rz * d;
    if (roadDistance(x, z, samples) < minRoad) continue;
    if (colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + 1)) continue;
    out.push({
      x,
      z,
      s: scale[0] + rnd() * (scale[1] - scale[0]),
      r: rnd() * Math.PI * 2,
      c: colors[Math.floor(rnd() * colors.length)]!,
    });
  }
  return out;
}

function Instanced({
  items,
  y,
  children,
}: {
  items: Item[];
  y: (s: number) => number;
  children: React.ReactNode;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new Object3D();
    const color = new Color();
    items.forEach((it, i) => {
      o.position.set(it.x, y(it.s), it.z);
      o.scale.setScalar(it.s);
      o.rotation.set(0, it.r, 0);
      o.updateMatrix();
      ref.current?.setMatrixAt(i, o.matrix);
      ref.current?.setColorAt(i, color.set(it.c));
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    }
  }, [items, y]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow receiveShadow>
      {children}
    </instancedMesh>
  );
}

interface Props {
  island: Island;
  road: CatmullRomCurve3;
  colliders: readonly Collider[];
  palette: Palette;
  onGround: (e: ThreeEvent<MouseEvent>) => void;
}

/** The island and everything growing on it, plus the sea around it. */
export function Nature({ island, road, colliders, palette, onGround }: Props) {
  const samples = useMemo(
    () => road.getSpacedPoints(160).map((p) => [p.x, p.z] as [number, number]),
    [road],
  );
  const trees = useMemo(
    () => scatter(island, samples, colliders, 90, 11, palette.trees, 3.4, [0.8, 1.5]),
    [island, samples, colliders, palette],
  );
  const blossoms = useMemo(
    () => scatter(island, samples, colliders, 40, 17, palette.blossoms, 2.6, [0.5, 0.9]),
    [island, samples, colliders, palette],
  );
  const flowers = useMemo(
    () => scatter(island, samples, colliders, 220, 29, palette.flowers, 1.4, [0.7, 1.2]),
    [island, samples, colliders, palette],
  );
  const tufts = useMemo(
    () => scatter(island, samples, colliders, 320, 41, [palette.tuft], 1.3, [0.6, 1.3]),
    [island, samples, colliders, palette],
  );
  const rocks = useMemo(
    () => scatter(island, samples, colliders, 36, 53, ['#c9c3bb', '#b3aca3'], 2, [0.5, 1]),
    [island, samples, colliders],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[island.cx, -0.45, island.cz]} receiveShadow>
        <circleGeometry args={[Math.max(island.rx, island.rz) * 2.6, 48]} />
        <meshStandardMaterial color={palette.water} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* beach ring, then grass */}
      <mesh
        position={[island.cx, -0.3, island.cz]}
        scale={[island.rx * 1.06, 1, island.rz * 1.04]}
        receiveShadow
      >
        <cylinderGeometry args={[1, 1.05, 0.5, 48]} />
        <meshStandardMaterial color={palette.sand} />
      </mesh>
      <mesh
        position={[island.cx, -0.25, island.cz]}
        scale={[island.rx, 1, island.rz]}
        receiveShadow
        onClick={onGround}
      >
        <cylinderGeometry args={[1, 1, 0.5, 48]} />
        <meshStandardMaterial color={palette.grass} />
      </mesh>

      <Instanced items={trees} y={(s) => 1.7 * s}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading />
      </Instanced>
      <Instanced items={trees.map((t) => ({ ...t, c: '#7a5236' }))} y={(s) => 0.5 * s}>
        <cylinderGeometry args={[0.13, 0.2, 1, 6]} />
        <meshStandardMaterial flatShading />
      </Instanced>
      <Instanced items={blossoms} y={(s) => 0.45 * s}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial flatShading />
      </Instanced>
      <Instanced items={flowers} y={() => 0.12}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial />
      </Instanced>
      <Instanced items={tufts} y={() => 0.12}>
        <coneGeometry args={[0.12, 0.35, 4]} />
        <meshStandardMaterial flatShading />
      </Instanced>
      <Instanced items={rocks} y={(s) => 0.15 * s}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial flatShading />
      </Instanced>
    </group>
  );
}
