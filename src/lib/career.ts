const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** '2025-06' → 'jun 2025'. */
export function formatMonth(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${y}`;
}

/** Inclusive month count between two ISO months ('2025-03'..'2025-05' = 3). */
function monthsBetween(start: string, end: string): number {
  const [sy = 0, sm = 1] = start.split('-').map(Number);
  const [ey = 0, em = 1] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

/** LinkedIn-style length: '3 mos', '1 yr', '1 yr 6 mos'. `end` null = until `now`. */
export function duration(start: string, end: string | null, now: Date = new Date()): string {
  const to = end ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const total = Math.max(1, monthsBetween(start, to));
  const y = Math.floor(total / 12);
  const m = total % 12;
  const yr = y ? `${y} yr${y > 1 ? 's' : ''}` : '';
  const mo = m ? `${m} mo${m > 1 ? 's' : ''}` : '';
  return [yr, mo].filter(Boolean).join(' ');
}
