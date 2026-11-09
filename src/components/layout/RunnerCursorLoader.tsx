'use client';

import { useEffect, useState, type ComponentType } from 'react';

/** The cursor's animation and pixel-bed code are only needed after a mouse starts moving. */
export function RunnerCursorLoader() {
  const [Cursor, setCursor] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (window.self !== window.top) return;
    let disposed = false;
    const start = () => {
      if (
        !matchMedia('(pointer: fine)').matches ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;
      window.removeEventListener('pointermove', start);
      void import('./RunnerCursor').then(({ RunnerCursor }) => {
        if (!disposed) setCursor(() => RunnerCursor);
      });
    };
    window.addEventListener('pointermove', start, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener('pointermove', start);
    };
  }, []);
  return Cursor ? <Cursor /> : null;
}
