import * as THREE from 'three/webgpu';
import { lowerLeg, makeAvatar, type Outfit, upperLeg } from './avatar-model';
import { damp } from './layout';

const { clamp, lerp, smoothstep } = THREE.MathUtils;

export type Footstep = -1 | 0 | 1;

export function createCharacter(outfit: Outfit, scale: number, offset = 0) {
  const { root, hips, chest, neck, limbs } = makeAvatar(outfit);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  root.scale.setScalar(scale);
  let phase = offset;
  let time = offset * 8;
  let stride = 0;
  let sprint = 0;
  let airborne = 0;
  let rise = 0;

  function update(dt: number, distance: number, grounded = true, verticalSpeed = 0): Footstep {
    const speed = dt > 0 ? distance / dt : 0;
    const run = smoothstep(speed, 2.8, 7);
    const step = lerp(0.64, 0.75, smoothstep(speed, 1.6, 2.8)) + 0.67 * run;
    time += dt;
    stride = damp(stride, grounded ? smoothstep(speed, 0.12, 1.55) : 0, 13, dt);
    sprint = damp(sprint, run, 8, dt);
    airborne = damp(airborne, grounded ? 0 : 1, 13, dt);
    rise = damp(rise, clamp(verticalSpeed / 7, -1, 1), 10, dt);
    let footstep: Footstep = 0;
    if (grounded) {
      const nextPhase = phase + (distance * 0.9) / (step * scale);
      if (nextPhase >= 1) footstep = -1;
      else if (phase < 0.5 && nextPhase >= 0.5) footstep = 1;
      phase = nextPhase % 1;
    }

    const motion = reducedMotion.matches ? 0 : 1;
    const beat = phase * Math.PI * 2;
    const sway = Math.sin(beat) * stride;
    const twist = Math.cos(beat) * stride;
    const breath = Math.sin(time * 2.1) * (1 - stride) * (1 - airborne) * motion;
    const stance = lerp(0.55, 0.32, sprint);
    hips.position.x = 0.012 * sway * motion;
    hips.position.y =
      0.417 - stride * (0.041 + 0.013 * sprint + 0.017 * Math.cos(beat * 2 - 0.4)) + 0.003 * breath;
    chest.rotation.set(
      0.012 + stride * lerp(0.048, 0.2, sprint) + airborne * 0.09,
      -0.12 * twist * motion,
      -0.062 * sway * motion,
    );
    neck.rotation.set(
      -chest.rotation.x * 0.58 - rise * airborne * 0.12,
      0.08 * twist * motion + 0.12 * Math.sin(time * 0.8) * (1 - stride) * motion,
      0.036 * sway * motion,
    );

    for (const { side, shoulder, elbow, thigh, knee, ankle } of limbs) {
      const cycle = (phase + (side > 0 ? 0.5 : 0)) % 1;
      const swing = clamp((cycle - stance) / (1 - stance), 0, 1);
      const inStance = cycle < stance;
      const reach = inStance ? 1 - (2 * cycle) / stance : lerp(-1, 1, smoothstep(swing, 0, 1));
      const lift = Math.sin(swing * Math.PI);
      const roll = inStance
        ? 0.25 * smoothstep(cycle / stance, 0.67, 1) -
          0.12 * (1 - smoothstep(cycle / stance, 0, 0.19))
        : lerp(0.25, -0.12, smoothstep(swing, 0, 1));
      const pitch = roll * stride;
      // During stance the target recedes by the distance travelled over that part of the cycle.
      const z = (reach * stride * step * stance) / 1.8;
      const y =
        0.046 +
        lift * stride * lerp(0.062, 0.126, sprint) +
        Math.max(0.043 * -pitch, 0.083 * pitch);

      // Solve hip and knee against the ankle target. The stance foot stays at ground
      // height while the chest moves above it, and the ankle rolls through toe-off.
      const ankleZ = lerp(z, side * 0.073 + 0.06 * rise, airborne);
      const down = hips.position.y - lerp(y, 0.118 + 0.043 * rise + 0.027 * side, airborne);
      const length = Math.min(Math.hypot(down, ankleZ), upperLeg + lowerLeg - 0.001);
      const bend = Math.acos(
        clamp((length ** 2 - upperLeg ** 2 - lowerLeg ** 2) / (2 * upperLeg * lowerLeg), -1, 1),
      );
      thigh.rotation.x =
        -Math.atan2(ankleZ, down) -
        Math.atan2(lowerLeg * Math.sin(bend), upperLeg + lowerLeg * Math.cos(bend));
      knee.rotation.x = bend;
      ankle.rotation.x = lerp(pitch, 0.22, airborne) - thigh.rotation.x - bend;
      ankle.rotation.y = side * 0.11;

      const swingBack = Math.cos(cycle * Math.PI * 2);
      shoulder.rotation.set(
        swingBack * stride * lerp(0.35, 0.68, sprint) * (side > 0 ? 0.92 : 1) -
          airborne * (0.4 - side * 0.15) -
          0.05,
        side * 0.065,
        side * (0.13 + 0.03 * breath + 0.11 * airborne),
      );
      elbow.rotation.x =
        -0.14 - stride * (0.14 + 0.55 * sprint + 0.14 * (1 - swingBack)) - 0.42 * airborne;
    }
    return footstep;
  }

  update(0, 0);
  return {
    root,
    update,
    dispose() {
      root.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
    },
  };
}
