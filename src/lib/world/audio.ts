import type { Group, Vector3 } from 'three/webgpu';
import type { Footstep } from './character';
import { sandiness, shoreRadius } from './layout';

const assets = ['step-a', 'step-b', 'surf', 'birds', 'brick', 'coin'] as const;
type Sound = (typeof assets)[number];

interface Frame {
  dt: number;
  position: Vector3;
  right: Vector3;
  birds: Group;
  footstep: Footstep;
  grounded: boolean;
}

/** World audio follows the player and is unlocked by an explicit game gesture. */
export function createWorldAudio(radius: number, signal: AbortSignal) {
  const buffers = new Map<Sound, AudioBuffer>();
  let context: AudioContext | undefined;
  let mix: GainNode;
  let surfGain: GainNode;
  let surfPan: StereoPannerNode;
  let enabled = false;
  let visible = !document.hidden;
  let wasGrounded = true;
  let airborne = 0;
  let nextBird = 1.8;
  let lastImpact = -Infinity;

  function sync() {
    if (!context || context.state === 'closed') return;
    const active = enabled && visible;
    mix.gain.setTargetAtTime(active ? 0.78 : 0, context.currentTime, 0.025);
    if (active && context.state !== 'running') void context.resume().catch(() => {});
  }

  function initialize() {
    const ctx = new AudioContext();
    context = ctx;
    mix = ctx.createGain();
    mix.gain.value = 0;
    mix.connect(ctx.destination);
    surfGain = ctx.createGain();
    surfGain.gain.value = 0;
    surfPan = ctx.createStereoPanner();
    surfGain.connect(surfPan).connect(mix);

    for (const name of assets) {
      void fetch(`/play/audio/${name}.mp3`, { signal })
        .then((response) => {
          if (!response.ok) throw new Error(`Could not load world audio: ${name}`);
          return response.arrayBuffer();
        })
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => {
          if (signal.aborted) return;
          buffers.set(name, buffer);
          if (name === 'surf') {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.connect(surfGain);
            source.start();
          }
        })
        .catch(() => {});
    }
  }

  function play(name: Sound, volume: number, pan: number, rate: number, cutoff = 18000) {
    const ctx = context;
    const buffer = buffers.get(name);
    if (!enabled || !visible || ctx?.state !== 'running' || !buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    const filter = ctx.createBiquadFilter();
    filter.frequency.value = cutoff;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    const stereo = ctx.createStereoPanner();
    stereo.pan.value = pan;
    source.connect(filter).connect(gain).connect(stereo).connect(mix);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      stereo.disconnect();
    };
    source.start();
  }

  return {
    setEnabled(on: boolean) {
      if (signal.aborted) return;
      enabled = on;
      try {
        if (on && !context) initialize();
        sync();
      } catch {
        // World interaction stays available if audio output is unavailable.
      }
    },
    setVisible(on: boolean) {
      visible = on;
      sync();
    },
    collect() {
      play('coin', 0.36, 0, 1.05);
    },
    impact(
      at: Readonly<{ x: number; z: number }>,
      force: number,
      listener: Vector3,
      right: Vector3,
    ) {
      if (!context || context.currentTime - lastImpact < 0.11) return;
      const x = at.x - listener.x;
      const z = at.z - listener.z;
      const distance = Math.hypot(x, z);
      if (distance > 25) return;
      lastImpact = context.currentTime;
      const volume = Math.min(0.52, force / 1800) * (1 - distance / 25);
      play(
        'brick',
        volume,
        (x * right.x + z * right.z) / Math.max(1, distance),
        0.84 + Math.random() * 0.19,
        4500,
      );
    },
    update({ dt, position, right, birds, footstep, grounded }: Frame) {
      if (!enabled || !visible || context?.state !== 'running') {
        wasGrounded = grounded;
        airborne = 0;
        return;
      }
      const { x, z } = position;
      const radial = Math.hypot(x, z);
      const shore = shoreRadius(Math.atan2(z, x), radius) - 4;
      const coast = Math.max(0, 1 - Math.abs(shore - radial) / 31);
      const at = context.currentTime;
      surfGain.gain.setTargetAtTime(coast ** 2 * 0.72, at, 0.25);
      surfPan.pan.setTargetAtTime(
        ((x * right.x + z * right.z) / Math.max(1, radial)) * 0.7,
        at,
        0.2,
      );

      if (!grounded) airborne += dt;
      const landed = grounded && !wasGrounded && airborne > 0.18;
      if (grounded) airborne = 0;
      wasGrounded = grounded;
      if (landed || footstep) {
        const sand = sandiness(x, z, radius) > 0.36;
        play(
          footstep > 0 ? 'step-b' : 'step-a',
          landed ? 0.65 : 0.47,
          landed ? 0 : footstep * 0.15,
          (landed ? 0.82 : 1) + Math.random() * 0.14,
          sand ? 7500 : 3600,
        );
      }

      nextBird -= dt;
      if (nextBird > 0) return;
      nextBird = 4 + Math.random() * 5;
      let nearest: Vector3 | undefined;
      let best = 64;
      for (const bird of birds.children) {
        const d = bird.position.distanceTo(position);
        if (d >= best) continue;
        nearest = bird.position;
        best = d;
      }
      if (nearest) {
        const pan = ((nearest.x - x) * right.x + (nearest.z - z) * right.z) / best;
        play(
          'birds',
          0.53 * (1 - best / 64),
          Math.max(-1, Math.min(1, pan)),
          0.94 + Math.random() * 0.14,
        );
      }
    },
    dispose() {
      buffers.clear();
      if (context && context.state !== 'closed') void context.close().catch(() => {});
    },
  };
}
