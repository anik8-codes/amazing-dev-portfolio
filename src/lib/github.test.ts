import { expect, test } from 'vitest';
import { calendarStats, monthLabels, type Day } from './github';

const d = (date: string, count: number): Day => [date, count, count ? 1 : 0];

test('streaks, total and best day', () => {
  const weeks = [
    [d('2026-01-01', 1), d('2026-01-02', 3), d('2026-01-03', 0), d('2026-01-04', 2)],
    [d('2026-01-05', 5), d('2026-01-06', 1), d('2026-01-07', 0)],
  ];
  // last day has 0: current streak counts back from the day before
  expect(calendarStats(weeks)).toEqual({
    total: 12,
    longestStreak: 3,
    currentStreak: 3,
    best: { date: '2026-01-05', count: 5 },
  });
});

test('month labels mark where a month starts', () => {
  const week = (start: string): Day[] => [d(start, 0)];
  const labels = monthLabels([
    week('2026-01-04'),
    week('2026-01-11'),
    week('2026-01-18'),
    week('2026-02-01'),
    week('2026-02-08'),
    week('2026-02-15'),
    week('2026-03-01'),
  ]);
  expect(labels.map((l) => l.label)).toEqual(['feb', 'mar']);
});
