'use client';

import { useEffect, useRef, useState } from 'react';
import { continueScreen as c } from '@/config/scores';

/** Runs once, only while visible and the tab is active. No timer under reduced motion. */
export function Countdown() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(c.count);

  useEffect(() => {
    if (!root.current) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let remaining = c.count;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || calm.matches || remaining === 0) return;
      timer = setTimeout(() => {
        remaining -= 1;
        setCount(remaining);
        schedule();
      }, 1000);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        schedule();
      },
      { threshold: 0.5 },
    );
    observer.observe(root.current);
    document.addEventListener('visibilitychange', schedule);
    calm.addEventListener('change', schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', schedule);
      calm.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <div ref={root} className="mt-8">
      <p
        aria-hidden
        className="font-display text-[64px] leading-none text-red tabular-nums sm:text-[96px]"
      >
        {count}
      </p>
      <p
        role="status"
        className="mx-auto mt-6 min-h-12 max-w-md font-display text-pixel-8 uppercase"
      >
        {count === 0 ? c.finished : ''}
      </p>
    </div>
  );
}
