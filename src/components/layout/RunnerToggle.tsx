'use client';

import { useSyncExternalStore } from 'react';
import { motion } from '@/config/motion';
import { companionOn, setCompanion, subscribeCompanion } from '@/lib/companion';

export function RunnerToggle() {
  const on = useSyncExternalStore(subscribeCompanion, companionOn, () => true);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setCompanion(!on)}
      className="w-fit border-2 border-ink bg-white px-3 py-2 text-sm font-semibold hover:bg-panel"
    >
      {motion.runner}: {on ? motion.on : motion.off}
    </button>
  );
}
