'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { CatmullRomCurve3, Vector3, type Mesh } from 'three';
import { lore, places } from '@/config/lore';
import { islandFor, stationPositions, type Collider, type Vec2 } from '@/lib/play';
import { mat } from './models/kit';
import { models } from './models/registry';
import { Nature } from './Nature';
import type { Palette } from './palette';
import { Player, type PlayerApi } from './Player';
import { Road } from './Road';
import { Station } from './Station';
import { useKeys } from './useKeys';

interface Props {
  palette: Palette;
  active: number;
  poi: number;
  calm: boolean;
  api: React.RefObject<PlayerApi | null>;
  onChapter: (i: number) => void;
  onPoi: (i: number) => void;
  onProgress: (t: number) => void;
  onReady: () => void;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

/** A spinning gem over something you can walk up to; it turns red when you're there. */
function Marker({ at, near, calm }: { at: Vec2; near: boolean; calm: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || calm) return;
    ref.current.rotation.y = clock.elapsedTime * 1.6;
    ref.current.position.y = 2.6 + Math.sin(clock.elapsedTime * 2.4) * 0.15;
  });
  return (
    <mesh
      ref={ref}
      position={[at[0], 2.6, at[1]]}
      material={mat(near ? '#ff3b3b' : '#ffd34d', true)}
    >
      <octahedronGeometry args={[0.22, 0]} />
    </mesh>
  );
}

/**
 * Everything in world space: stations, the island, the road curve, each place with its
 * collider, and a marker for every point of interest (same order as `places.filter(p => p.poi)`).
 */
function useLayout() {
  return useMemo(() => {
    const stations = stationPositions(lore.length);
    const island = islandFor(stations);
    const first = stations[0]!;
    const last = stations[stations.length - 1]!;
    const road = new CatmullRomCurve3([
      new Vector3(first[0], 0, first[1] + 10),
      ...stations.map(([x, z]) => new Vector3(x, 0, z)),
      new Vector3(last[0], 0, last[1] - 8),
    ]);
    const world = places.map((p) => {
      const s = stations[lore.findIndex((c) => c.slug === p.chapter)] ?? [0, 0];
      return { ...p, x: s[0] + p.at[0], z: s[1] + p.at[1], station: s };
    });
    const colliders: Collider[] = world
      .filter((p) => models[p.model].radius > 0)
      .map((p) => ({ x: p.x, z: p.z, r: models[p.model].radius }));
    // markers float on the road side of their prop, so tall buildings never hide them
    const poiAt = world
      .filter((p) => p.poi)
      .map((p): Vec2 => {
        const r = models[p.model].radius;
        const dx = p.station[0] - p.x;
        const dz = p.station[1] - p.z;
        const d = Math.hypot(dx, dz) || 1;
        return [p.x + (dx / d) * (r + 0.6), p.z + (dz / d) * (r + 0.6)];
      });
    return { stations, island, road, world, colliders, poiAt };
  }, []);
}

/** The /play scene. Loaded on demand (next/dynamic), so three.js never touches READ mode. */
export default function World(props: Props) {
  const { palette, active, poi, calm, api, onChapter, onPoi, onProgress, onReady } = props;
  const { stations, island, road, world, colliders, poiAt } = useLayout();
  const keys = useKeys();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 42, near: 0.1, far: 260 }}
      aria-hidden
      className="touch-none"
    >
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.sky, 34, 95]} />
      <hemisphereLight args={[palette.sky, palette.grass, palette.ambient]} />
      <Suspense fallback={null}>
        <Nature
          island={island}
          road={road}
          colliders={colliders}
          palette={palette}
          onGround={(e) => {
            e.stopPropagation();
            api.current?.walkTo(e.point.x, e.point.z);
          }}
        />
        <Road curve={road} color={palette.road} edge={palette.roadEdge} />
        {lore.map((chapter, i) => (
          <Station
            key={chapter.slug}
            chapter={chapter}
            at={stations[i]!}
            active={i === active}
            palette={palette}
          />
        ))}
        {world.map((p, i) => {
          const { C } = models[p.model];
          return (
            <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.rot ?? 0, 0]}>
              <C text={p.text} />
            </group>
          );
        })}
        {poiAt.map((at, i) => (
          <Marker key={i} at={at} near={i === poi} calm={calm} />
        ))}
        <Player
          ref={api}
          road={road}
          stations={stations}
          looks={lore.map((c) => c.look)}
          island={island}
          colliders={colliders}
          pois={poiAt}
          keys={keys}
          calm={calm}
          onChapter={onChapter}
          onPoi={onPoi}
          onProgress={onProgress}
          sun={palette.sun}
        />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
