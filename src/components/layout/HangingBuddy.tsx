'use client';

import { useEffect, useRef } from 'react';
import { looks } from '@/assets/sprites';

const DROP = 110; // cable length at rest (px)
const W = 90; // sprite width (half of the 180 px source)
const STRETCH = 260; // past this the cable goes red and resists

/**
 * anik8 bungee-hanging upside down from a network cable. Grab him and fling: a damped spring
 * pulls him back, the cable turns red when stretched, and now and then he bounces on his own.
 * Static under reduced motion. (Idea from shishir24.in's hanging figure; our own code and art.)
 */
export function HangingBuddy() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const cable = useRef<SVGLineElement>(null);

  useEffect(() => {
    const el = root.current;
    const img = body.current;
    const line = cable.current;
    if (!el || !img || !line) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const p = { x: 0, y: 0 }; // offset from the rest position
    const v = { x: 0, y: 0 };
    const grab = { x: 0, y: 0 };
    let dragging = false;
    let last = performance.now();
    let frame = 0;

    const draw = (t: number) => {
      const dt = Math.min((t - last) / 1000, 1 / 30);
      last = t;
      if (!dragging) {
        const sway = Math.sin(t / 700) * 4;
        v.x += (180 * (sway - p.x) - 7 * v.x) * dt;
        v.y += (180 * -p.y - 7 * v.y) * dt;
        p.x += v.x * dt;
        p.y += v.y * dt;
      }
      const len = Math.hypot(p.x, DROP + p.y);
      const tilt = Math.atan2(-p.x, DROP + p.y);
      const strain = Math.min(1, Math.max(0, (len - STRETCH) / 120));
      img.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${tilt}rad)`;
      line.setAttribute('x2', String(W / 2 + p.x));
      line.setAttribute('y2', String(DROP + p.y));
      line.style.stroke = strain > 0 ? 'var(--color-red)' : '';
      line.setAttribute('stroke-width', String(2.5 - strain));
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left - W / 2, y: e.clientY - r.top - DROP - 40 };
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      img.setPointerCapture(e.pointerId);
      const at = local(e);
      grab.x = p.x - at.x;
      grab.y = p.y - at.y;
      v.x = v.y = 0;
      dragging = true;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const at = local(e);
      let x = at.x + grab.x;
      let y = at.y + grab.y;
      const d = Math.hypot(x, y);
      if (d > STRETCH) {
        const k = (STRETCH + (d - STRETCH) * 0.3) / d; // rubber band
        x *= k;
        y *= k;
      }
      const dt = Math.max((performance.now() - last) / 1000, 1 / 120);
      v.x = (x - p.x) / dt;
      v.y = (y - p.y) / dt;
      p.x = x;
      p.y = y;
    };
    const up = () => {
      dragging = false;
      v.x = Math.max(-1600, Math.min(1600, v.x));
      v.y = Math.max(-1600, Math.min(1600, v.y));
    };
    img.addEventListener('pointerdown', down);
    img.addEventListener('pointermove', move);
    img.addEventListener('pointerup', up);
    img.addEventListener('pointercancel', up);

    // every 8–16 s he bounces by himself
    let bounce = 0;
    const later = () => {
      bounce = window.setTimeout(
        () => {
          if (!dragging && !document.hidden) v.y += 900;
          later();
        },
        8000 + Math.random() * 8000,
      );
    };
    later();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(bounce);
      img.removeEventListener('pointerdown', down);
      img.removeEventListener('pointermove', move);
      img.removeEventListener('pointerup', up);
      img.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute top-0 right-[6vw] hidden md:block"
      style={{ width: W, height: DROP + 120 }}
    >
      <svg className="absolute inset-0 overflow-visible text-ink" width={W} height={DROP}>
        <line
          ref={cable}
          x1={W / 2}
          y1={0}
          x2={W / 2}
          y2={DROP}
          stroke="currentColor"
          strokeWidth={2.5}
        />
        <rect x={W / 2 - 5} y={-4} width={10} height={8} rx={1.5} fill="currentColor" />
      </svg>
      {/* the wrapper swings from the cable end; the sprite inside is flipped upside down */}
      <div
        ref={body}
        className="pointer-events-auto absolute left-0 cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ top: DROP - 6, transformOrigin: '50% 0' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dragged by pointer, needs a plain img */}
        <img
          src={looks.hoodie.body.src}
          alt=""
          width={W}
          height={(W * looks.hoodie.body.height) / looks.hoodie.body.width}
          draggable={false}
          className="-scale-y-100 [image-rendering:pixelated]"
        />
      </div>
    </div>
  );
}
