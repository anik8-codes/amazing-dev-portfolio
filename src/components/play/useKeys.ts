'use client';

import { useEffect, useRef } from 'react';

export interface Keys {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
}

const MAP: Record<string, keyof Keys> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
};

/** Live keyboard state for movement (a ref, so reading it never re-renders). */
export function useKeys() {
  const keys = useRef<Keys>({ up: false, down: false, left: false, right: false, run: false });
  useEffect(() => {
    const set = (on: boolean) => (e: KeyboardEvent) => {
      const k = MAP[e.code];
      const t = e.target as HTMLElement | null;
      if (!k || t?.closest('input, textarea, [contenteditable]')) return;
      keys.current[k] = on;
      if (on && k !== 'run') e.preventDefault();
    };
    const down = set(true);
    const up = set(false);
    const reset = () =>
      Object.keys(keys.current).forEach((k) => (keys.current[k as keyof Keys] = false));
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
    };
  }, []);
  return keys;
}
