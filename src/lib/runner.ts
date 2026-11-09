/** Neko-style moods for the cursor runner. */
type RunnerState = 'run' | 'tired' | 'idle' | 'sleep';

export const RUNNER_TIMING = {
  /** Running at least this long (ms) before stopping makes him tired. */
  tiredAfterRun: 1500,
  /** How long the tired pant lasts (ms). */
  tiredFor: 2200,
  /** Idle this long (ms) and he falls asleep. */
  sleepAfterIdle: 6000,
} as const;

export interface RunnerClock {
  state: RunnerState;
  /** When the current state started (ms). */
  since: number;
  /** Continuous running time so far (ms). */
  ranFor: number;
}

export const initialClock = (now: number): RunnerClock => ({
  state: 'idle',
  since: now,
  ranFor: 0,
});

/** Advance the mood one frame. Pure, so it is unit-tested without a browser. */
export function stepRunner(c: RunnerClock, moving: boolean, now: number, dt: number): RunnerClock {
  const t = RUNNER_TIMING;
  if (moving) {
    return c.state === 'run'
      ? { ...c, ranFor: c.ranFor + dt }
      : { state: 'run', since: now, ranFor: dt };
  }
  const elapsed = now - c.since;
  switch (c.state) {
    case 'run':
      return { state: c.ranFor >= t.tiredAfterRun ? 'tired' : 'idle', since: now, ranFor: 0 };
    case 'tired':
      return elapsed >= t.tiredFor ? { state: 'idle', since: now, ranFor: 0 } : c;
    case 'idle':
      return elapsed >= t.sleepAfterIdle ? { state: 'sleep', since: now, ranFor: 0 } : c;
    case 'sleep':
      return c;
  }
}
