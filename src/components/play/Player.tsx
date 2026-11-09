'use client';

import { useFrame } from '@react-three/fiber';
import { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Vector3, type CatmullRomCurve3, type DirectionalLight, type Group } from 'three';
import type { Look } from '@/assets/sprites';
import {
  angleDelta,
  approach,
  clampToIsland,
  collide,
  eraIndex,
  nearestStation,
  type Collider,
  type Vec2,
} from '@/lib/play';
import { Avatar, type Motion } from './models/Avatar';
import type { Keys } from './useKeys';

const WALK = 3.6; // units per second
const RUN = 7;
const ACCEL = 7; // how quickly speed eases in / out
const TURN = 9; // how quickly he turns to face where he goes
const STEP = 1.9; // walk-cycle radians per unit travelled
const CAMERA = new Vector3(0, 6.2, 10);
const POI_RADIUS = 3;

export interface PlayerApi {
  /** Jump straight to a station (chapter list, keyboard users). */
  teleport: (i: number) => void;
  /** Walk to a point on the ground (tap / click). */
  walkTo: (x: number, z: number) => void;
  /** Scroll mode: walk to a point along the road, 0 = 2022 … 1 = what's next. */
  scrollTo: (t: number) => void;
  /** Where on the road (0–1) he is now. */
  progress: () => number;
}

interface Props {
  road: CatmullRomCurve3;
  stations: readonly Vec2[];
  looks: readonly Look[];
  island: { cx: number; cz: number; rx: number; rz: number };
  colliders: readonly Collider[];
  pois: readonly Vec2[];
  keys: React.RefObject<Keys>;
  calm: boolean;
  ref: React.Ref<PlayerApi>;
  onChapter: (i: number) => void;
  onPoi: (i: number) => void;
  onProgress: (t: number) => void;
  sun: number;
}

/**
 * anik8 in the world, as a 3D figure. Input sets a desired velocity (keys), a destination (tap)
 * or a point on the road (scroll); the actual velocity eases towards it so walking starts and
 * stops smoothly, and he turns gradually to face his direction. Props push him around them.
 * The camera and the sun follow; the outfit changes with the era he has walked into.
 */
export function Player(props: Props) {
  const { road, stations, looks, island, colliders, pois, keys, calm, ref } = props;
  const { onChapter, onPoi, onProgress, sun } = props;
  const rig = useRef<Group>(null);
  const light = useRef<DirectionalLight>(null);
  const motion = useRef<Motion>({ speed: 0, phase: 0 });
  const pos = useRef(new Vector3(stations[0]![0], 0, stations[0]![1] + 7));
  const vel = useRef(new Vector3());
  const heading = useRef(Math.PI);
  const target = useRef<Vec2 | null>(null);
  const report = useRef({ chapter: -2, poi: -2, progress: -1, started: false });
  const [era, setEra] = useState(0);
  const samples = useMemo(() => road.getSpacedPoints(300), [road]);

  useImperativeHandle(
    ref,
    () => ({
      teleport: (i) => {
        const s = stations[i];
        if (!s) return;
        pos.current.set(s[0], 0, s[1] + 2.4);
        vel.current.set(0, 0, 0);
        target.current = null;
      },
      walkTo: (x, z) => {
        target.current = clampToIsland([x, z], island);
      },
      scrollTo: (t) => {
        const p = road.getPointAt(Math.max(0, Math.min(1, t)));
        target.current = [p.x, p.z];
      },
      progress: () => Math.max(0, report.current.progress),
    }),
    [stations, island, road],
  );

  useFrame(({ camera, scene }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const k = keys.current;
    if (!report.current.started) {
      report.current.started = true;
      camera.position.copy(pos.current).add(CAMERA);
      if (light.current) scene.add(light.current.target);
    }

    // desired velocity from keys, else from the destination (tap or scroll)
    let dx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    let dz = (k.down ? 1 : 0) - (k.up ? 1 : 0);
    let want = k.run ? RUN : WALK;
    if (dx || dz) {
      target.current = null;
      const l = Math.hypot(dx, dz);
      dx /= l;
      dz /= l;
    } else if (target.current) {
      const vx = target.current[0] - pos.current.x;
      const vz = target.current[1] - pos.current.z;
      const d = Math.hypot(vx, vz);
      if (d < 0.2) {
        target.current = null;
        want = 0;
      } else {
        dx = vx / d;
        dz = vz / d;
        want = Math.min(RUN, Math.max(WALK * 0.6, d * 1.4)); // run when far, slow to arrive
      }
    } else want = 0;

    vel.current.x = approach(vel.current.x, dx * want, ACCEL, dt);
    vel.current.z = approach(vel.current.z, dz * want, ACCEL, dt);
    const speed = Math.hypot(vel.current.x, vel.current.z);
    if (speed > 0.01) {
      const next = clampToIsland(
        collide(
          [pos.current.x + vel.current.x * dt, pos.current.z + vel.current.z * dt],
          colliders,
        ),
        island,
      );
      pos.current.set(next[0], 0, next[1]);
      if (speed > 0.25) {
        const face = Math.atan2(vel.current.x, vel.current.z);
        heading.current += angleDelta(heading.current, face) * (1 - Math.exp(-TURN * dt));
      }
    }
    motion.current.speed = Math.min(1, speed / RUN);
    motion.current.phase += speed * dt * STEP;

    if (rig.current) {
      rig.current.position.copy(pos.current);
      rig.current.rotation.y = heading.current;
    }

    // camera + sun follow
    camera.position.lerp(pos.current.clone().add(CAMERA), calm ? 1 : 1 - Math.exp(-3.5 * dt));
    camera.lookAt(camera.position.x, 1.2, camera.position.z - CAMERA.z - 1);
    if (light.current) {
      light.current.position.set(pos.current.x + 8, 16, pos.current.z + 6);
      light.current.target.position.set(pos.current.x, 0, pos.current.z);
    }

    // report: chapter, point of interest, place on the timeline, era outfit
    const here: Vec2 = [pos.current.x, pos.current.z];
    const chapter = nearestStation(here, stations, 4);
    if (chapter !== report.current.chapter) onChapter((report.current.chapter = chapter));
    const poi = nearestStation(here, pois, POI_RADIUS);
    if (poi !== report.current.poi) onPoi((report.current.poi = poi));
    let bi = 0;
    let bd = Infinity;
    samples.forEach((p, i) => {
      const d = (p.x - here[0]) ** 2 + (p.z - here[1]) ** 2;
      if (d < bd) [bd, bi] = [d, i];
    });
    const t = bi / (samples.length - 1);
    if (Math.abs(t - report.current.progress) > 0.004) onProgress((report.current.progress = t));
    const e = eraIndex(pos.current.z, stations);
    if (e !== era) setEra(e);
  });

  return (
    <>
      <directionalLight
        ref={light}
        castShadow
        intensity={sun}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <group ref={rig}>
        <Avatar look={looks[era] ?? 'default'} motion={motion} calm={calm} />
      </group>
    </>
  );
}
