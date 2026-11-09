'use client';

import { B, C, Label } from './kit';

const STONE = '#8a7f75';
const CREAM = '#f1e6cf';
const MAROON = '#7d2a2a';
const SAND = '#e0ad7e';

/** Rajwada, Indore: stone base with the great wooden gate, cream storeys with maroon balconies. */
export function Rajwada() {
  const storeys = [0, 1, 2, 3];
  return (
    <group>
      <B p={[0, 1, 0]} s={[6, 2, 2.6]} c={STONE} />
      <B p={[0, 0.9, 1.31]} s={[1.6, 1.8, 0.04]} c="#5b3a22" />
      <C p={[0, 1.8, 1.31]} r={[Math.PI / 2, 0, 0]} a={[0.8, 0.8, 0.05, 16]} c="#5b3a22" />
      {storeys.map((i) => {
        const y = 2.45 + i * 0.95;
        const w = 5.6 - i * 0.5;
        return (
          <group key={i} position={[0, y, 0]}>
            <B s={[w, 0.9, 2.2 - i * 0.1]} c={CREAM} />
            <B p={[0, -0.47, 0.05]} s={[w + 0.2, 0.08, 2.4 - i * 0.1]} c={MAROON} />
            {Array.from({ length: 6 - i }, (_, k) => (
              <B
                key={k}
                p={[(k - (5 - i) / 2) * (w / (6.2 - i)), 0.02, 1.1 - i * 0.05]}
                s={[0.36, 0.5, 0.18]}
                c={MAROON}
              />
            ))}
          </group>
        );
      })}
      {[-2, 2].map((x) => (
        <group key={x} position={[x, 6.4, 0]}>
          <B s={[1, 0.8, 1]} c={CREAM} />
          <C p={[0, 0.55, 0]} a={[0.1, 0.65, 0.4, 8]} c={MAROON} />
        </group>
      ))}
      <C p={[0, 6.1, 0]} a={[0.02, 0.02, 1.6, 4]} c="#5b3a22" />
      <B p={[0.25, 6.75, 0]} s={[0.5, 0.3, 0.02]} c="#ff8a1f" />
    </group>
  );
}

/** India Gate: two piers, the arch beam, stepped attic and the shallow dome on top. */
export function IndiaGate() {
  return (
    <group>
      <B p={[0, 0.15, 0]} s={[5.4, 0.3, 2.4]} c="#cbb6a0" />
      <B p={[-1.75, 2.5, 0]} s={[1.6, 4.4, 2]} c={SAND} />
      <B p={[1.75, 2.5, 0]} s={[1.6, 4.4, 2]} c={SAND} />
      <B p={[0, 4.95, 0]} s={[5.2, 0.5, 2.1]} c={SAND} />
      <B p={[0, 5.3, 0]} s={[5.6, 0.2, 2.3]} c="#c9946a" />
      <B p={[0, 5.75, 0]} s={[4.4, 0.7, 1.8]} c={SAND} />
      <B p={[0, 6.3, 0]} s={[3, 0.4, 1.4]} c={SAND} />
      <C p={[0, 6.6, 0]} a={[0.55, 0.75, 0.3, 16]} c="#c9946a" />
      <Label text="INDIA" w={1.6} h={0.36} p={[0, 5.78, 0.91]} bg={SAND} fg="#7d5a3c" />
    </group>
  );
}

/** A red-brick two-storey college block with its name over the door. */
export function College({ text = 'COLLEGE' }: { text?: string }) {
  return (
    <group>
      <B p={[0, 1.6, 0]} s={[7, 3.2, 3]} c="#b5533c" />
      <B p={[0, 3.3, 0]} s={[7.3, 0.2, 3.3]} c="#efe4d2" />
      {[0.9, 2.3].map((y) =>
        [-2.6, -1.3, 1.3, 2.6].map((x) => (
          <B key={`${x}${y}`} p={[x, y, 1.51]} s={[0.7, 0.8, 0.04]} c="#bcd7e8" />
        )),
      )}
      <B p={[0, 1, 1.51]} s={[1.2, 2, 0.06]} c="#5b3a22" />
      <Label text={text} w={3} h={0.5} p={[0, 2.5, 1.54]} bg="#efe4d2" fg="#7d2a2a" />
      <C p={[3.8, 2.6, 1.6]} a={[0.03, 0.03, 5.2, 4]} c="#59606b" />
      <B p={[4.2, 4.9, 1.6]} s={[0.8, 0.5, 0.02]} c="#ff8a1f" />
    </group>
  );
}

/** Noida skyline: three glass towers, with a big counter on the tallest. */
export function Towers({ text }: { text?: string }) {
  const towers: [number, number, number, string][] = [
    [-2.4, 7, 2.2, '#7fb3d5'],
    [0, 10, 2.6, '#5d8fb8'],
    [2.6, 6, 2, '#9cc9d9'],
  ];
  return (
    <group>
      {towers.map(([x, h, w, c]) => (
        <group key={x} position={[x, 0, 0]}>
          <B p={[0, h / 2, 0]} s={[w, h, w]} c={c} />
          {Array.from({ length: Math.floor(h / 0.9) }, (_, i) => (
            <B
              key={i}
              p={[0, 0.6 + i * 0.9, w / 2 + 0.01]}
              s={[w * 0.82, 0.08, 0.02]}
              c="#e9f4fa"
              shadow={false}
            />
          ))}
        </group>
      ))}
      {text && (
        <Label text={text} w={2.3} h={0.8} p={[0, 8.6, 1.32]} bg="#1d1630" fg="#ffd34d" pixel />
      )}
    </group>
  );
}

/** A small modern office with a teal awning and a name sign. */
export function Office({ text = 'OFFICE' }: { text?: string }) {
  return (
    <group>
      <B p={[0, 1.8, 0]} s={[6, 3.6, 3.4]} c="#f5f5f2" />
      <B p={[0, 1.8, 1.71]} s={[5.2, 2.4, 0.04]} c="#9fd3dd" />
      {[-1.3, 0, 1.3].map((x) => (
        <B key={x} p={[x, 1.8, 1.74]} s={[0.06, 2.4, 0.04]} c="#f5f5f2" shadow={false} />
      ))}
      <B p={[0, 3.25, 2]} s={[6.2, 0.15, 0.8]} c="#2f8f8f" />
      <Label text={text} w={3.2} h={0.5} p={[0, 3.62, 1.72]} bg="#2f8f8f" fg="#ffffff" />
    </group>
  );
}

/** The CTO's office: dark glass, a name sign, and a door marked CTO. */
export function CtoOffice({ text = 'MAXCODE' }: { text?: string }) {
  return (
    <group>
      <B p={[0, 2.4, 0]} s={[6.4, 4.8, 3.6]} c="#2b2f3a" />
      {[1.1, 2.5, 3.9].map((y) => (
        <B key={y} p={[0, y, 1.81]} s={[5.6, 0.9, 0.04]} c="#7fc3e6" glow={y === 3.9} />
      ))}
      <B p={[0, 0.9, 1.84]} s={[1.3, 1.8, 0.05]} c="#e9edf2" />
      <Label text="CTO" w={0.8} h={0.3} p={[0, 1.45, 1.88]} bg="#e9edf2" fg="#1d1630" pixel />
      <Label text={text} w={3.4} h={0.6} p={[0, 4.6, 1.85]} bg="#d62828" fg="#ffffff" pixel />
    </group>
  );
}
