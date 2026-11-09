import { expect, test } from 'vitest';
import { RUNNER_TIMING as T, initialClock, stepRunner, type RunnerClock } from './runner';

/** Run the machine for `ms` in 16 ms frames. */
function play(c: RunnerClock, moving: boolean, from: number, ms: number) {
  let clock = c;
  for (let now = from; now < from + ms; now += 16) clock = stepRunner(clock, moving, now, 16);
  return clock;
}

test('a short dash ends idle, a long run ends tired', () => {
  const short = play(play(initialClock(0), true, 0, 500), false, 500, 16);
  expect(short.state).toBe('idle');
  const long = play(play(initialClock(0), true, 0, T.tiredAfterRun + 100), false, 2000, 16);
  expect(long.state).toBe('tired');
});

test('tired → idle → sleep, and any move wakes him', () => {
  let c = play(initialClock(0), true, 0, T.tiredAfterRun + 100);
  c = play(c, false, 2000, T.tiredFor + 50);
  expect(c.state).toBe('idle');
  c = play(c, false, 5000, T.sleepAfterIdle + 50);
  expect(c.state).toBe('sleep');
  c = stepRunner(c, true, 20000, 16);
  expect(c.state).toBe('run');
});
