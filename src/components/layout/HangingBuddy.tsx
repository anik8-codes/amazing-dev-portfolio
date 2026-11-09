'use client';

import { useEffect, useRef } from 'react';
import hoodie from '@/assets/sprites/hoodie.png';

const DROP = 110; // cable length at rest (px)
const W = 90; // sprite width (half of the 180 px source)

/**
 * anik8 bungee-hanging upside down from a network cable. Grab him and fling: a damped spring
 * pulls him back, the cable turns red when stretched, and now and then he bounces on his own.
 * Static under reduced motion. (Idea from shishir24.in's hanging figure; our own code and art.)
 */
export function HangingBuddy() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      void import('@/lib/hanging-buddy').then(({ animateHangingBuddy }) => {
        if (!disposed) cleanup = animateHangingBuddy(el);
      });
    });
    observer.observe(el);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
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
        <line x1={W / 2} y1={0} x2={W / 2} y2={DROP} stroke="currentColor" strokeWidth={2.5} />
        <rect x={W / 2 - 5} y={-4} width={10} height={8} rx={1.5} fill="currentColor" />
      </svg>
      {/* the wrapper swings from the cable end; the sprite inside is flipped upside down */}
      <div
        data-buddy-body
        className="pointer-events-auto absolute left-0 cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ top: DROP - 6, transformOrigin: '50% 0' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dragged by pointer, needs a plain img */}
        <img
          src={hoodie.src}
          alt=""
          width={W}
          height={(W * hoodie.height) / hoodie.width}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="-scale-y-100 [image-rendering:pixelated]"
        />
      </div>
    </div>
  );
}
