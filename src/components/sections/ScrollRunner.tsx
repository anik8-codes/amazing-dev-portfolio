'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { sprites } from '@/assets/sprites';
import { companionOn, subscribeCompanion } from '@/lib/companion';

const { run } = sprites;
const SCALE = 0.25;
const WIDTH = run.frameWidth * SCALE;
const HEIGHT = run.src.height * SCALE;

/** Scroll events schedule one paint, never a continuously running animation loop. */
export function ScrollRunner() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const on = useSyncExternalStore(subscribeCompanion, companionOn, () => true);

  useEffect(() => {
    const node = root.current;
    const sprite = body.current;
    const start = document.getElementById('projects');
    const ground = document.getElementById('footer-ground');
    if (!on || !node || !sprite || !start || !ground) return;

    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let previous = scrollY;
    let facing = 1;
    let from = 0;
    let to = 0;
    let groundY = 0;

    const paint = () => {
      raf = 0;
      const y = scrollY;
      node.hidden = calm.matches || y < from || y + innerHeight >= groundY;
      if (node.hidden) return;
      if (y !== previous) facing = y < previous ? -1 : 1;
      previous = y;
      const progress = Math.max(0, Math.min(1, (y - from) / Math.max(1, to - from)));
      const x = Math.round(24 + progress * Math.max(0, innerWidth - WIDTH - 48));
      sprite.style.transform = `translate3d(${x}px, 0, 0) scaleX(${facing})`;
      // Frame and position both come from scroll distance: stopping scroll stops the legs.
      sprite.style.backgroundPositionX = `${-(Math.floor((y - from) / 12) % run.frames) * WIDTH}px`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const measure = () => {
      from = start.getBoundingClientRect().top + scrollY - innerHeight / 2;
      groundY = ground.getBoundingClientRect().top + scrollY;
      to = groundY - innerHeight;
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    calm.addEventListener('change', schedule);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      calm.removeEventListener('change', schedule);
      cancelAnimationFrame(raf);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div
      ref={root}
      hidden
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-2 border-t-2 border-ink bg-haze motion-reduce:hidden"
    >
      <div
        ref={body}
        className="absolute bottom-full left-0 bg-no-repeat [image-rendering:pixelated]"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundImage: `url(${run.src.src})`,
          backgroundSize: `${run.src.width * SCALE}px ${HEIGHT}px`,
        }}
      />
    </div>
  );
}
