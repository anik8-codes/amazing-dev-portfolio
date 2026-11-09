'use client';

import { useLayoutEffect, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { WORDMARK } from '@/components/pixel/grids';
import type { Model } from '@/config/lore';
import { toRuns } from '@/lib/pixel-grid';
import { mat } from './kit';
import { College, CtoOffice, IndiaGate, Office, Rajwada, Towers } from './landmarks';
import {
  Banner,
  Bench,
  Bike,
  Books,
  Buggy,
  Coins,
  CookieJar,
  DeskRoom,
  Lantern,
  Phone,
  PohaCart,
  Portal,
  RingLight,
  Servers,
  Stage,
  Tedx,
  Trophy,
} from './life';

const CELL = 0.24;

/** The anik8 pixel wordmark, extruded into voxel blocks: ink on top, red shadow behind. */
function Wordmark3D() {
  const runs = toRuns(WORDMARK);
  const ink = useRef<InstancedMesh>(null);
  const red = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new Object3D();
    const w = WORDMARK[0]!.length * CELL;
    const h = WORDMARK.length * CELL;
    runs.forEach((r, i) => {
      o.scale.set(r.w * CELL, CELL, CELL * 1.6);
      o.position.set(-w / 2 + (r.x + r.w / 2) * CELL, h - (r.y + 0.5) * CELL + 0.2, 0);
      o.updateMatrix();
      ink.current?.setMatrixAt(i, o.matrix);
      o.position.x += CELL * 0.5;
      o.position.y -= CELL * 0.5;
      o.position.z -= CELL * 0.6;
      o.updateMatrix();
      red.current?.setMatrixAt(i, o.matrix);
    });
    if (ink.current) ink.current.instanceMatrix.needsUpdate = true;
    if (red.current) red.current.instanceMatrix.needsUpdate = true;
  }, [runs]);
  return (
    <group>
      <instancedMesh
        ref={ink}
        args={[undefined, mat('#1d1630'), runs.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry />
      </instancedMesh>
      <instancedMesh
        ref={red}
        args={[undefined, mat('#d62828'), runs.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry />
      </instancedMesh>
    </group>
  );
}

/** Model → component + collision radius (the player walks around, not through). */
export const models: Record<
  Model,
  { C: (p: { text?: string }) => React.ReactNode; radius: number }
> = {
  rajwada: { C: Rajwada, radius: 3.4 },
  college: { C: College, radius: 3.8 },
  'poha-cart': { C: PohaCart, radius: 1.3 },
  wordmark: { C: Wordmark3D, radius: 0 },
  stage: { C: Stage, radius: 2.7 },
  buggy: { C: Buggy, radius: 1.5 },
  tedx: { C: Tedx, radius: 2.2 },
  books: { C: Books, radius: 0.9 },
  'desk-room': { C: DeskRoom, radius: 2.6 },
  office: { C: Office, radius: 3.3 },
  coins: { C: Coins, radius: 0.9 },
  'india-gate': { C: IndiaGate, radius: 3 },
  towers: { C: Towers, radius: 4 },
  trophy: { C: Trophy, radius: 0.9 },
  'cto-office': { C: CtoOffice, radius: 3.6 },
  servers: { C: Servers, radius: 1.9 },
  bike: { C: Bike, radius: 1 },
  phone: { C: Phone, radius: 0.9 },
  'ring-light': { C: RingLight, radius: 0.7 },
  'cookie-jar': { C: CookieJar, radius: 1.1 },
  portal: { C: Portal, radius: 0 },
  bench: { C: Bench, radius: 0.9 },
  banner: { C: Banner, radius: 1.7 },
  lantern: { C: Lantern, radius: 0.3 },
};
