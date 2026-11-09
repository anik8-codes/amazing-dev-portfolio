/** One calendar day: [ISO date, contributions, level 0-4]. */
export type Day = readonly [string, number, number];

export interface CalendarStats {
  total: number;
  /** Longest run of consecutive days with at least one contribution. */
  longestStreak: number;
  /** Run ending on the last day (or the day before, if today has none yet). */
  currentStreak: number;
  best: { date: string; count: number };
}

export function calendarStats(weeks: readonly (readonly Day[])[]): CalendarStats {
  const days = weeks.flat();
  let longest = 0;
  let run = 0;
  let best = { date: '', count: 0 };
  for (const [date, count] of days) {
    run = count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (count > best.count) best = { date, count };
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]![1] > 0) current++;
    else if (i === days.length - 1)
      continue; // today may not have commits yet
    else break;
  }
  return {
    total: days.reduce((n, d) => n + d[1], 0),
    longestStreak: longest,
    currentStreak: current,
    best,
  };
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Month label for each week column where a new month starts (GitHub-style). */
export function monthLabels(weeks: readonly (readonly Day[])[]) {
  const labels: { col: number; label: string }[] = [];
  let last = -1;
  weeks.forEach((w, col) => {
    const first = w[0];
    if (!first) return;
    const m = Number(first[0].slice(5, 7)) - 1;
    if (m !== last) {
      if (col > 0 || w.length === 7) labels.push({ col, label: MONTHS[m]! });
      last = m;
    }
  });
  // drop a label squeezed in right before the next one
  return labels.filter((l, i) => !labels[i + 1] || labels[i + 1]!.col - l.col >= 3);
}
