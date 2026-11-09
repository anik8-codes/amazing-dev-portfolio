'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { sprites } from '@/assets/sprites';
import { Bed } from '@/components/pixel/Bed';
import { initialClock, stepRunner } from '@/lib/runner';
import { companionOn, subscribeCompanion } from '@/lib/companion';

const SCALE = 0.25; // ¼ of the source pixels: 30 × 42 px, Neko-sized
const FOLLOW = 7; // how quickly he closes the gap (higher = snappier)
const MAX_SPEED = 520; // px per second
const STOP = 3; // px: closer than this counts as arrived
const STRIDE = 7; // px travelled per animation frame (legs match the ground)
const OFFSET = { x: 14, y: 4 }; // sit below-right of the pointer so it stays visible

const { run } = sprites;
const FRAME_W = run.frameWidth * SCALE;
const FRAME_H = run.src.height * SCALE;

/**
 * Neko-style follower (requirements §4a, roadmap T09). Eases toward the pointer, legs advance
 * with distance travelled, flips to face where he runs; pants when tired, and goes to bed
 * (tucked in, z's) when idle. Only `transform` and `background-position` change, once per frame, on whole pixels.
 * Off on touch screens and under prefers-reduced-motion. Moods: src/lib/runner.ts.
 * TODO(art): real tired/sleep frames in brand/anik8-looks.png would replace the effects below.
 */
export function RunnerCursor() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const on = useSyncExternalStore(subscribeCompanion, companionOn, () => true);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !still.matches);
    update();
    fine.addEventListener('change', update);
    still.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      still.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const node = root.current;
    const sprite = body.current;
    if (!enabled || !on || !node || !sprite) return;

    let target: { x: number; y: number } | null = null;
    let x = 0;
    let y = 0;
    let facing = 1;
    let travelled = 0;
    let last = performance.now();
    let clock = initialClock(last);
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (!target) {
        x = e.clientX - 60; // first appearance: just behind the pointer
        y = e.clientY + OFFSET.y;
        node.hidden = false;
      }
      target = { x: e.clientX + OFFSET.x, y: e.clientY + OFFSET.y };
    };

    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (target) {
        const dx = target.x - x;
        const dy = target.y - y;
        const dist = Math.hypot(dx, dy);
        const moving = dist > STOP;
        if (moving) {
          // Exponential ease toward the target, capped at a top speed.
          let step = dist * (1 - Math.exp((-FOLLOW * dt) / 1000));
          step = Math.min(step, (MAX_SPEED * dt) / 1000, dist);
          x += (dx / dist) * step;
          y += (dy / dist) * step;
          travelled += step;
          if (Math.abs(dx) > 1.5) facing = dx < 0 ? -1 : 1;
        }
        clock = stepRunner(clock, moving, now, dt);
        const frame = clock.state === 'run' ? Math.floor(travelled / STRIDE) % run.frames : 0;
        sprite.style.backgroundPositionX = `${-frame * FRAME_W}px`;
        node.dataset.state = clock.state;
        node.style.transform = `translate3d(${Math.round(x - FRAME_W / 2)}px, ${Math.round(y - FRAME_H)}px, 0)`;
        sprite.style.scale = `${facing} 1`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, on]);

  if (!enabled || !on) return null;
  return (
    <div
      ref={root}
      hidden
      aria-hidden
      data-state="idle"
      className="group pointer-events-none fixed top-0 left-0 z-[60] will-change-transform"
      style={{ width: FRAME_W, height: FRAME_H }}
    >
      {/* Body. Tired: pants. Asleep: hidden — the bed takes over. */}
      <div className="size-full group-data-[state=sleep]:hidden group-data-[state=tired]:animate-pant">
        <div
          ref={body}
          className="size-full bg-no-repeat [image-rendering:pixelated]"
          style={{
            backgroundImage: `url(${run.src.src})`,
            backgroundSize: `${run.src.width * SCALE}px ${FRAME_H}px`,
          }}
        />
      </div>

      {/* Tired: two sweat drops. */}
      <span className="absolute -top-1 -right-1 hidden gap-1 group-data-[state=tired]:flex">
        <span className="size-1 animate-sweat bg-mist" />
        <span className="size-1 animate-sweat bg-mist [animation-delay:0.45s]" />
      </span>

      {/* Asleep: tucked into bed where he stopped, z's rising from his head. */}
      <Bed className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 group-data-[state=sleep]:block" />
      <span className="absolute -top-1 -left-2 hidden font-display text-pixel-8 text-muted group-data-[state=sleep]:block">
        <span className="absolute animate-zzz">z</span>
        <span className="absolute animate-zzz [animation-delay:0.8s]">z</span>
        <span className="absolute animate-zzz [animation-delay:1.6s]">z</span>
      </span>
    </div>
  );
}
