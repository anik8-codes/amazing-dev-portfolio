'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { Look } from '@/assets/sprites';
import { B, C, S } from './kit';

/** Live motion state the Player writes every frame and the rig reads. */
export interface Motion {
  /** 0 = standing, 1 = full run. Eased, so starts and stops are smooth. */
  speed: number;
  /** Walk-cycle phase, advanced by distance travelled (feet never slide). */
  phase: number;
}

const SKIN = '#c98b5e';
const HAIR = '#1b1410';
const BEARD = '#2b1d15';
const CAP = '#f4f1ea';
const RED = '#d62828';
const FRAME = '#59606b';
const JEANS = '#33467a';
const SHOE = '#f4f4f2';
const SOLE = '#c9c9c9';
const WATCH = '#ff7a1a';

/** Tee / jacket colour per era look (src/config/lore.ts). */
const TOP: Record<Look, string> = {
  default: '#6d5aa8',
  hoodie: '#8d939d',
  work: '#2f6f73',
  creator: '#ececec',
  traveler: '#b36a3a',
  hackathon: '#26272e',
  formal: '#25304a',
  gamer: '#3f3a8c',
  builder: '#ff8a1f',
  chill: '#7fc8a9',
};

/** One leg, pivoting at the hip. */
function Leg({ x, legRef }: { x: number; legRef: React.RefObject<Group | null> }) {
  return (
    <group ref={legRef} position={[x, 0.78, 0]}>
      <B p={[0, -0.3, 0]} s={[0.22, 0.6, 0.26]} c={JEANS} />
      <B p={[0, -0.66, 0.06]} s={[0.24, 0.12, 0.38]} c={SHOE} />
      <B p={[0, -0.73, 0.06]} s={[0.25, 0.04, 0.4]} c={SOLE} />
    </group>
  );
}

/** One arm, pivoting at the shoulder. The left wrist wears the orange watch. */
function Arm({
  x,
  top,
  watch,
  armRef,
}: {
  x: number;
  top: string;
  watch?: boolean;
  armRef: React.RefObject<Group | null>;
}) {
  return (
    <group ref={armRef} position={[x, 1.32, 0]}>
      <B p={[0, -0.14, 0]} s={[0.18, 0.3, 0.22]} c={top} />
      <B p={[0, -0.4, 0]} s={[0.15, 0.26, 0.17]} c={SKIN} />
      {watch && <B p={[0, -0.47, 0]} s={[0.17, 0.06, 0.19]} c={WATCH} />}
      <S p={[0, -0.57, 0]} rad={0.09} c={SKIN} detail={0} />
    </group>
  );
}

/**
 * anik8 as a 3D toy figure, built from his sprite's colours: red-white cap, round glasses,
 * beard, panda tee, jeans, white sneakers, orange watch. The top changes with the era's look.
 * The rig animates itself from `motion`: a walk/run cycle that blends with speed, a slight
 * forward lean, and idle breathing + head turns when standing.
 */
export function Avatar({
  look,
  motion,
  calm,
}: {
  look: Look;
  motion: React.RefObject<Motion>;
  calm: boolean;
}) {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const top = TOP[look];

  useFrame(({ clock }) => {
    const { speed, phase } = motion.current;
    const t = clock.elapsedTime;
    const swing = Math.sin(phase);
    const legAmp = 0.15 + speed * 0.6;
    const walking = speed > 0.02;
    if (
      legL.current &&
      legR.current &&
      armL.current &&
      armR.current &&
      body.current &&
      head.current
    ) {
      legL.current.rotation.x = walking ? swing * legAmp : 0;
      legR.current.rotation.x = walking ? -swing * legAmp : 0;
      armL.current.rotation.x = walking ? -swing * legAmp * 0.9 : 0;
      armR.current.rotation.x = walking ? swing * legAmp * 0.9 : 0;
      const breathe = calm ? 0 : Math.sin(t * 2.2) * 0.012 * (1 - speed);
      armL.current.rotation.z = 0.08 + (calm ? 0 : Math.sin(t * 2.2) * 0.03 * (1 - speed));
      armR.current.rotation.z = -armL.current.rotation.z;
      body.current.position.y = walking ? Math.abs(Math.cos(phase)) * 0.06 * speed : breathe;
      body.current.rotation.x = speed * 0.12;
      head.current.rotation.y = calm || walking ? 0 : Math.sin(t * 0.6) * 0.25;
    }
  });

  return (
    <group ref={body}>
      <Leg x={-0.13} legRef={legL} />
      <Leg x={0.13} legRef={legR} />

      {/* torso */}
      <B p={[0, 1.07, 0]} s={[0.6, 0.58, 0.34]} c={top} />
      {look === 'default' && (
        // the panda on the tee
        <group position={[0, 1.08, 0.172]}>
          <C a={[0.12, 0.12, 0.01, 16]} r={[Math.PI / 2, 0, 0]} c="#f7f7f5" shadow={false} />
          <C
            p={[-0.1, 0.1, 0]}
            a={[0.045, 0.045, 0.012, 10]}
            r={[Math.PI / 2, 0, 0]}
            c="#1a1a1a"
            shadow={false}
          />
          <C
            p={[0.1, 0.1, 0]}
            a={[0.045, 0.045, 0.012, 10]}
            r={[Math.PI / 2, 0, 0]}
            c="#1a1a1a"
            shadow={false}
          />
          <B p={[-0.045, 0.01, 0.008]} s={[0.04, 0.03, 0.005]} c="#1a1a1a" shadow={false} />
          <B p={[0.045, 0.01, 0.008]} s={[0.04, 0.03, 0.005]} c="#1a1a1a" shadow={false} />
        </group>
      )}
      {look === 'formal' && (
        <B p={[0, 1.13, 0.172]} s={[0.12, 0.42, 0.01]} c="#f4f4f2" shadow={false} />
      )}

      <Arm x={-0.39} top={top} watch armRef={armL} />
      <Arm x={0.39} top={top} armRef={armR} />

      {/* head */}
      <group ref={head} position={[0, 1.36, 0]}>
        <B p={[0, 0.08, 0]} s={[0.16, 0.12, 0.16]} c={SKIN} />
        <B p={[0, 0.38, 0]} s={[0.52, 0.5, 0.46]} c={SKIN} />
        {/* beard + moustache */}
        <B p={[0, 0.22, 0.05]} s={[0.54, 0.2, 0.42]} c={BEARD} />
        <B p={[0, 0.31, 0.235]} s={[0.24, 0.05, 0.02]} c={BEARD} />
        <B p={[0, 0.26, 0.236]} s={[0.12, 0.03, 0.02]} c="#f2e9e4" />
        {/* hair at the sides + ears */}
        <B p={[-0.265, 0.45, -0.04]} s={[0.04, 0.22, 0.34]} c={HAIR} />
        <B p={[0.265, 0.45, -0.04]} s={[0.04, 0.22, 0.34]} c={HAIR} />
        <B p={[-0.28, 0.38, 0.02]} s={[0.04, 0.1, 0.08]} c={SKIN} />
        <B p={[0.28, 0.38, 0.02]} s={[0.04, 0.1, 0.08]} c={SKIN} />
        {/* eyes + round glasses */}
        <B p={[-0.11, 0.42, 0.232]} s={[0.05, 0.06, 0.01]} c="#151515" shadow={false} />
        <B p={[0.11, 0.42, 0.232]} s={[0.05, 0.06, 0.01]} c="#151515" shadow={false} />
        {[-0.11, 0.11].map((x) => (
          <mesh key={x} position={[x, 0.42, 0.245]} castShadow={false}>
            <torusGeometry args={[0.085, 0.014, 6, 16]} />
            <meshStandardMaterial color={FRAME} roughness={0.4} metalness={0.4} />
          </mesh>
        ))}
        <B p={[0, 0.43, 0.245]} s={[0.06, 0.018, 0.018]} c={FRAME} shadow={false} />
        {/* cap: white crown, red front panel and brim */}
        <B p={[0, 0.66, -0.02]} s={[0.56, 0.16, 0.5]} c={CAP} />
        <B p={[0, 0.69, 0.235]} s={[0.4, 0.13, 0.02]} c={RED} />
        <B p={[0, 0.59, 0.36]} s={[0.5, 0.04, 0.26]} c={RED} />
        <B p={[0, 0.75, -0.02]} s={[0.46, 0.04, 0.44]} c={CAP} />
      </group>
    </group>
  );
}
