'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { B, C, Label, S, mat } from './kit';

const WHEEL = '#1f2126';

function Wheel({ p, r = 0.35, w = 0.18 }: { p: [number, number, number]; r?: number; w?: number }) {
  return (
    <group position={p} rotation={[0, 0, Math.PI / 2]}>
      <C a={[r, r, w, 14]} c={WHEEL} />
      <C a={[r * 0.45, r * 0.45, w + 0.02, 10]} c="#c9ccd2" />
    </group>
  );
}

/** Indore street-food cart: poha, jalebi, a striped umbrella and a hand-painted sign. */
export function PohaCart() {
  return (
    <group>
      <B p={[0, 0.85, 0]} s={[2.2, 0.15, 1.1]} c="#b0743a" />
      <B p={[0, 0.5, 0]} s={[2, 0.6, 1]} c="#2f8f8f" />
      <Wheel p={[-0.7, 0.32, 0.6]} r={0.3} />
      <Wheel p={[0.7, 0.32, 0.6]} r={0.3} />
      <C p={[-0.45, 1.05, 0]} a={[0.42, 0.48, 0.2, 14]} c="#c0c4c8" />
      <S p={[-0.45, 1.18, 0]} rad={0.36} c="#f2c230" detail={1} />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.45 + (i - 1) * 0.28, 1.0, (i % 2) * 0.18]}
          rotation={[Math.PI / 2, 0, i]}
          material={mat('#ff8a1f')}
          castShadow
        >
          <torusGeometry args={[0.12, 0.04, 6, 14]} />
        </mesh>
      ))}
      <C p={[0, 1.6, -0.3]} a={[0.03, 0.03, 1.6, 4]} c="#59606b" />
      <C p={[0, 2.4, -0.3]} a={[0.05, 1.3, 0.45, 8]} c="#d62828" />
      <C p={[0, 2.4, -0.3]} r={[0, Math.PI / 8, 0]} a={[0.05, 1.31, 0.44, 8]} c="#fff7e6" />
      <Label
        text={'POHA · JALEBI'}
        w={1.8}
        h={0.38}
        p={[0, 0.55, 0.51]}
        bg="#fff7e6"
        fg="#d62828"
      />
    </group>
  );
}

/** Community stage: platform, banner, a laptop on a table, Google-coloured balloons. */
export function Stage({ text = 'HELLO, WORLD' }: { text?: string }) {
  const balloons = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <group>
      <B p={[0, 0.25, 0]} s={[5, 0.5, 3]} c="#3b3f58" />
      <B p={[0, 2, -1.4]} s={[5, 3, 0.15]} c="#1d1630" />
      <Label text={text} w={4.2} h={0.9} p={[0, 2.4, -1.31]} bg="#1d1630" fg="#ffffff" pixel />
      <B p={[0.6, 0.95, 0.3]} s={[1.2, 0.08, 0.7]} c="#b0743a" />
      <B p={[0.6, 0.72, 0.3]} s={[0.08, 0.4, 0.08]} c="#59606b" />
      <B p={[0.6, 1.0, 0.3]} s={[0.6, 0.03, 0.4]} c="#c9ccd2" />
      <B p={[0.6, 1.18, 0.12]} r={[-0.3, 0, 0]} s={[0.6, 0.38, 0.03]} c="#7fc3e6" glow />
      <group ref={ref}>
        {balloons.map((c, i) => (
          <group key={c} position={[-2 + i * 0.5, 3.8 + (i % 2) * 0.4, -1]}>
            <S rad={0.28} c={c} detail={1} />
            <C p={[0, -0.7, 0]} a={[0.006, 0.006, 1.1, 3]} c="#59606b" shadow={false} />
          </group>
        ))}
      </group>
    </group>
  );
}

/** A BAJA off-road buggy: tube roll cage, seat, chunky tyres. */
export function Buggy() {
  return (
    <group>
      <B p={[0, 0.65, 0]} s={[1.4, 0.2, 2.6]} c="#ff8a1f" />
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <C p={[x, 1.3, -0.2]} a={[0.05, 0.05, 1.3, 6]} c="#d62828" />
          <C p={[x, 1.25, 0.6]} r={[0.5, 0, 0]} a={[0.05, 0.05, 1.3, 6]} c="#d62828" />
        </group>
      ))}
      <C p={[0, 1.95, -0.2]} r={[0, 0, Math.PI / 2]} a={[0.05, 0.05, 1.25, 6]} c="#d62828" />
      <B p={[0, 0.95, -0.3]} s={[0.6, 0.5, 0.15]} c="#1f2126" />
      <B p={[0, 0.8, 0]} s={[0.6, 0.12, 0.6]} c="#1f2126" />
      {[-0.85, 0.85].map((x) =>
        [-0.95, 0.95].map((z) => <Wheel key={`${x}${z}`} p={[x, 0.45, z]} r={0.45} w={0.35} />),
      )}
      <B p={[0, 0.85, 1.3]} s={[0.9, 0.08, 0.05]} c="#ffffff" />
    </group>
  );
}

/** TEDx: the round red carpet, the big red letters on black, one spotlight. */
export function Tedx() {
  return (
    <group>
      <C p={[0, 0.06, 0]} a={[2.2, 2.2, 0.12, 32]} c="#d62828" />
      <B p={[0, 1.6, -1.6]} s={[4, 2.6, 0.15]} c="#141414" />
      <Label text={'TEDxIPSA'} w={3.4} h={0.9} p={[0, 1.8, -1.51]} bg="#141414" fg="#e62b1e" />
      <C p={[2.3, 1.2, 0.6]} a={[0.04, 0.04, 2.4, 6]} c="#59606b" />
      <C p={[2.3, 2.45, 0.6]} r={[0.6, 0, 0.6]} a={[0.15, 0.25, 0.4, 10]} c="#ffd34d" glow />
    </group>
  );
}

/** A stack of books and a graduation cap. */
export function Books() {
  const books = ['#4f7cac', '#d62828', '#ffb000', '#2f8f8f', '#6d5aa8'];
  return (
    <group>
      {books.map((c, i) => (
        <B
          key={c}
          p={[(i % 2) * 0.12, 0.13 + i * 0.26, 0]}
          r={[0, i * 0.25, 0]}
          s={[1.4, 0.24, 1]}
          c={c}
        />
      ))}
      <B p={[0, 1.5, 0]} r={[0, 0.5, 0]} s={[1, 0.06, 1]} c="#1d1630" />
      <C p={[0, 1.38, 0]} a={[0.3, 0.3, 0.2, 10]} c="#1d1630" />
      <C p={[0.42, 1.3, 0.3]} a={[0.015, 0.015, 0.4, 4]} c="#ffd34d" shadow={false} />
    </group>
  );
}

/** The room the remote internship happened in: desk, glowing monitor, chair, mug, plant. */
export function DeskRoom() {
  return (
    <group>
      <B p={[0, 0.06, 0]} s={[4.4, 0.12, 3.4]} c="#d8b48a" />
      <B p={[0, 1.7, -1.65]} s={[4.4, 3.4, 0.1]} c="#e8dcf5" />
      <B p={[-2.15, 1.7, 0]} s={[0.1, 3.4, 3.4]} c="#dccdf0" />
      <B p={[0.5, 2.4, -1.58]} s={[1.1, 0.8, 0.03]} c="#ffb000" />
      <B p={[0, 0.85, -1]} s={[2.4, 0.08, 1]} c="#3b2f2a" />
      {[-1.1, 1.1].map((x) => (
        <B key={x} p={[x, 0.45, -1]} s={[0.08, 0.8, 0.9]} c="#3b2f2a" />
      ))}
      <B p={[0, 1.4, -1.25]} s={[1.2, 0.72, 0.06]} c="#1f2126" />
      <B p={[0, 1.4, -1.21]} s={[1.08, 0.6, 0.02]} c="#7f6bff" glow />
      <B p={[0, 0.97, -1.15]} s={[0.12, 0.2, 0.08]} c="#1f2126" />
      <B p={[0, 0.91, -0.75]} s={[0.8, 0.03, 0.26]} c="#e9edf2" />
      <C p={[0.8, 0.98, -0.8]} a={[0.07, 0.07, 0.16, 10]} c="#d62828" />
      <B p={[0, 0.55, 0.1]} s={[0.6, 0.1, 0.6]} c="#2f8f8f" />
      <B p={[0, 0.95, 0.38]} s={[0.6, 0.8, 0.1]} c="#2f8f8f" />
      <C p={[0, 0.3, 0.1]} a={[0.04, 0.04, 0.5, 6]} c="#59606b" />
      <C p={[-1.6, 0.3, -1.1]} a={[0.22, 0.18, 0.5, 10]} c="#b5533c" />
      <S p={[-1.6, 0.85, -1.1]} rad={0.4} c="#4caf50" detail={0} />
    </group>
  );
}

/** A pile of gold coins on a pedestal: the funded promptfoo work. */
export function Coins() {
  return (
    <group>
      <C p={[0, 0.35, 0]} a={[0.7, 0.8, 0.7, 10]} c="#efe4d2" />
      {Array.from({ length: 7 }, (_, i) => (
        <C
          key={i}
          p={[(i % 3) * 0.12 - 0.12, 0.76 + i * 0.07, ((i * 5) % 3) * 0.06]}
          a={[0.3, 0.3, 0.06, 16]}
          c="#ffc83d"
        />
      ))}
    </group>
  );
}

/** A gold cup on a podium. */
export function Trophy() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <group>
      <B p={[0, 0.4, 0]} s={[1.2, 0.8, 1.2]} c="#efe4d2" />
      <group ref={ref} position={[0, 0.8, 0]}>
        <C p={[0, 0.1, 0]} a={[0.25, 0.32, 0.2, 10]} c="#ffc83d" />
        <C p={[0, 0.35, 0]} a={[0.06, 0.06, 0.3, 8]} c="#ffc83d" />
        <C p={[0, 0.75, 0]} a={[0.38, 0.14, 0.55, 14]} c="#ffc83d" />
        {[-0.42, 0.42].map((x) => (
          <mesh key={x} position={[x, 0.8, 0]} material={mat('#ffc83d')} castShadow>
            <torusGeometry args={[0.13, 0.035, 6, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Server racks with blinking LEDs: the AWS behind everything. */
export function Servers() {
  const leds = useRef<Group>(null);
  useFrame(({ clock }) => {
    leds.current?.children.forEach((c, i) => {
      c.visible = Math.sin(clock.elapsedTime * (3 + (i % 5)) + i) > -0.2;
    });
  });
  return (
    <group>
      {[-1.1, 0, 1.1].map((x) => (
        <B key={x} p={[x, 1.3, 0]} s={[1, 2.6, 1]} c="#2b2f3a" />
      ))}
      <group ref={leds}>
        {[-1.1, 0, 1.1].flatMap((x) =>
          [0.5, 0.9, 1.3, 1.7, 2.1].map((y) => (
            <B
              key={`${x}${y}`}
              p={[x - 0.3 + ((y * 10) % 3) * 0.15, y, 0.51]}
              s={[0.08, 0.05, 0.02]}
              c={y > 1.5 ? '#3cff8a' : '#ff9a3c'}
              glow
              shadow={false}
            />
          )),
        )}
      </group>
      <B p={[0, 2.75, 0]} s={[3.4, 0.1, 1.2]} c="#ff9900" />
    </group>
  );
}

/** The new bike: a street motorcycle in red with a glowing headlight. */
export function Bike() {
  return (
    <group>
      <group rotation={[0, 0, 0]}>
        <Wheel p={[0, 0.42, 0.85]} r={0.42} w={0.16} />
        <Wheel p={[0, 0.42, -0.85]} r={0.42} w={0.16} />
      </group>
      <B p={[0, 0.75, 0]} s={[0.2, 0.25, 1.4]} c="#3a3d44" />
      <B p={[0, 1.0, 0.3]} s={[0.42, 0.32, 0.7]} c="#d62828" />
      <B p={[0, 1.02, -0.4]} s={[0.34, 0.12, 0.7]} c="#1f2126" />
      <C p={[0, 1.05, 0.85]} r={[0.35, 0, 0]} a={[0.04, 0.04, 0.8, 6]} c="#9aa0a8" />
      <C p={[0, 1.42, 0.98]} r={[0, 0, Math.PI / 2]} a={[0.03, 0.03, 0.8, 6]} c="#1f2126" />
      <S p={[0, 1.25, 1.08]} rad={0.11} c="#fff3c4" glow detail={1} />
      <C p={[0.18, 0.6, -0.6]} r={[1.4, 0, 0]} a={[0.06, 0.06, 0.6, 8]} c="#9aa0a8" />
    </group>
  );
}

/** A giant iPhone Pro on a stand, slowly turning: titanium edge, glowing screen, three lenses. */
export function Phone() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.8;
  });
  return (
    <group>
      <C p={[0, 0.2, 0]} a={[0.7, 0.8, 0.4, 16]} c="#efe4d2" />
      <group ref={ref} position={[0, 1.7, 0]}>
        <B s={[1.2, 2.5, 0.16]} c="#c7c0b8" />
        <B p={[0, 0, 0.081]} s={[1.08, 2.38, 0.01]} c="#ff8a5b" glow />
        <B p={[0, 1.02, 0.088]} s={[0.36, 0.1, 0.01]} c="#111111" shadow={false} />
        <B p={[-0.3, 0.85, -0.1]} s={[0.5, 0.5, 0.06]} c="#a59d94" />
        {[
          [-0.42, 0.97],
          [-0.18, 0.97],
          [-0.3, 0.74],
        ].map(([x = 0, y = 0]) => (
          <C
            key={`${x}${y}`}
            p={[x, y, -0.14]}
            r={[Math.PI / 2, 0, 0]}
            a={[0.09, 0.09, 0.05, 14]}
            c="#1b1b1f"
          />
        ))}
      </group>
    </group>
  );
}

/** Creator corner: ring light on a tripod, a phone mounted in the middle. */
export function RingLight() {
  return (
    <group>
      {[-0.6, 0, 0.6].map((x, i) => (
        <C
          key={x}
          p={[x * 0.5, 0.55, i === 1 ? -0.3 : 0.2]}
          r={[i === 1 ? -0.4 : 0.3, 0, x * 0.6]}
          a={[0.025, 0.025, 1.2, 4]}
          c="#1f2126"
        />
      ))}
      <C p={[0, 1.5, 0]} a={[0.03, 0.03, 1.6, 4]} c="#1f2126" />
      <mesh position={[0, 2.4, 0]} material={mat('#fff6d8', true)}>
        <torusGeometry args={[0.55, 0.06, 8, 32]} />
      </mesh>
      <B p={[0, 2.4, 0.02]} s={[0.22, 0.42, 0.04]} c="#1f2126" />
      <B p={[0, 2.4, 0.045]} s={[0.18, 0.36, 0.01]} c="#7fc3e6" glow />
    </group>
  );
}

/** A cookie jar. The cookies are real; the tracking isn't. */
export function CookieJar() {
  return (
    <group>
      <C p={[0, 0.35, 0]} a={[0.9, 1, 0.7, 12]} c="#efe4d2" />
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 18, 1, true]} />
        <meshStandardMaterial color="#cfeefb" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <group
          key={i}
          position={[((i % 3) - 1) * 0.28, 0.82 + Math.floor(i / 3) * 0.16, (i % 2) * 0.15 - 0.05]}
          rotation={[0.3 * i, 0, 0.4]}
        >
          <C a={[0.2, 0.2, 0.06, 12]} c="#c98b4a" />
          <B p={[0.05, 0.035, 0.05]} s={[0.05, 0.02, 0.05]} c="#3b2316" shadow={false} />
          <B p={[-0.07, 0.035, -0.03]} s={[0.05, 0.02, 0.05]} c="#3b2316" shadow={false} />
        </group>
      ))}
      <C p={[0, 1.95, 0]} a={[0.64, 0.64, 0.12, 18]} c="#d62828" />
      <S p={[0, 2.08, 0]} rad={0.1} c="#d62828" detail={0} />
      <Label
        text={'ACCEPT\nCOOKIES?'}
        w={1.2}
        h={0.6}
        p={[0, 0.45, 1.01]}
        bg="#fff7e6"
        fg="#1d1630"
        pixel
      />
    </group>
  );
}

/** The end of the road (for now): a glowing ring you can step through. */
export function Portal() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.4;
  });
  return (
    <group>
      <C p={[0, 0.1, 0]} a={[2, 2.1, 0.2, 24]} c="#3b3f58" />
      <group ref={ref} position={[0, 2.2, 0]}>
        <mesh material={mat('#ff5a8a', true)}>
          <torusGeometry args={[1.6, 0.14, 10, 40]} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <S
            key={i}
            p={[Math.cos((i / 8) * Math.PI * 2) * 1.6, Math.sin((i / 8) * Math.PI * 2) * 1.6, 0]}
            rad={0.12}
            c="#ffd34d"
            glow
            detail={0}
          />
        ))}
      </group>
      <mesh position={[0, 2.2, 0]}>
        <circleGeometry args={[1.45, 40]} />
        <meshBasicMaterial color="#b98cff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/** A wooden park bench. */
export function Bench() {
  return (
    <group>
      <B p={[0, 0.45, 0]} s={[1.6, 0.08, 0.5]} c="#b0743a" />
      <B p={[0, 0.8, -0.22]} s={[1.6, 0.4, 0.06]} c="#b0743a" />
      {[-0.7, 0.7].map((x) => (
        <B key={x} p={[x, 0.22, 0]} s={[0.08, 0.45, 0.45]} c="#3b3f58" />
      ))}
    </group>
  );
}

/** A street lantern with a warm glowing top (diya-orange). */
export function Lantern() {
  return (
    <group>
      <C p={[0, 0.9, 0]} a={[0.06, 0.08, 1.8, 6]} c="#3b3f58" />
      <B p={[0, 1.95, 0]} s={[0.36, 0.42, 0.36]} c="#3b3f58" />
      <B p={[0, 1.95, 0]} s={[0.28, 0.34, 0.38]} c="#ffb347" glow />
      <C p={[0, 2.24, 0]} a={[0.02, 0.28, 0.16, 4]} c="#3b3f58" />
    </group>
  );
}

/** A hackathon banner: two poles, a bunting string, the event name on the cloth. */
export function Banner({ text = 'HACKATHON' }: { text?: string }) {
  const flags = ['#d62828', '#ffb000', '#2f8f8f', '#6d5aa8', '#ff7eb6', '#4285f4'];
  return (
    <group>
      {[-1.6, 1.6].map((x) => (
        <C key={x} p={[x, 1.6, 0]} a={[0.06, 0.07, 3.2, 6]} c="#7a5236" />
      ))}
      <B p={[0, 2.2, 0]} s={[3.1, 1.4, 0.05]} c="#1d1630" />
      <Label text={text} w={2.9} h={1.2} p={[0, 2.2, 0.03]} bg="#1d1630" fg="#ffd34d" pixel />
      {flags.map((c, i) => (
        <mesh
          key={c}
          position={[-1.35 + i * 0.54, 3.05 - Math.sin((i / 5) * Math.PI) * 0.12, 0]}
          rotation={[0, 0, Math.PI]}
          material={mat(c)}
        >
          <coneGeometry args={[0.13, 0.28, 3]} />
        </mesh>
      ))}
    </group>
  );
}
