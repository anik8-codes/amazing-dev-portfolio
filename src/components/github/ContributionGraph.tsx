import type { Day } from '@/lib/github';
import { monthLabels } from '@/lib/github';
import styles from './github.module.css';

/** Level 0-4 → GitHub greens; text colour chosen per level for contrast. */
const LEVEL = [
  { bg: 'var(--color-panel)', fg: 'transparent' },
  { bg: '#9be9a8', fg: '#1d1630' },
  { bg: '#40c463', fg: '#1d1630' },
  { bg: '#2e7d40', fg: '#ffffff' },
  { bg: '#216e39', fg: '#ffffff' },
];

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * GitHub-style contribution calendar with the count inside every day. Built at build time (no
 * JS): it opens scrolled to the latest weeks (rtl scroller trick), fades out on the left, and
 * shows "N contributions on <date>" on hover. The full summary is in `label` and the caption.
 */
export function ContributionGraph({
  weeks,
  label,
}: {
  weeks: readonly (readonly Day[])[];
  label: string;
}) {
  const days = weeks.flat();
  const total = days.reduce((n, d) => n + d[1], 0);
  const first = days[0]?.[0];
  const last = days[days.length - 1]?.[0];
  return (
    <figure className="flex flex-col gap-3">
      <div role="region" aria-label={label} tabIndex={0} className={styles.scroller}>
        <div
          className={styles.calendar}
          style={{ '--weeks': weeks.length } as React.CSSProperties}
          aria-hidden
        >
          {monthLabels(weeks).map((m) => (
            <span key={m.col} className={styles.month} style={{ gridColumn: m.col + 1 }}>
              {m.label[0]!.toUpperCase() + m.label.slice(1)}
            </span>
          ))}
          {weeks.map((week, col) =>
            week.map(([date, count, level]) => {
              const row = new Date(`${date}T00:00:00Z`).getUTCDay();
              const l = LEVEL[level] ?? LEVEL[0]!;
              return (
                <span
                  key={date}
                  className={`${styles.day} ${col >= weeks.length - 5 ? styles.edge : ''}`}
                  data-tip={`${count} contribution${count === 1 ? '' : 's'} on ${dateLabel(date)}`}
                  style={{ gridColumn: col + 1, gridRow: row + 2, background: l.bg, color: l.fg }}
                >
                  {count > 0 ? count : ''}
                </span>
              );
            }),
          )}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>
          {total.toLocaleString('en-IN')} contributions
          {first && last ? `, ${dateLabel(first)} – ${dateLabel(last)}` : ''}. Source:{' '}
          <a
            href="https://github.com/anik8-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-1 underline-offset-4 hover:text-ink"
          >
            GitHub
          </a>
          .
        </span>
        <span aria-hidden className="flex items-center gap-1.5">
          less
          {LEVEL.map((l, i) => (
            <span key={i} className="size-4 rounded-[4px]" style={{ background: l.bg }} />
          ))}
          more
        </span>
      </figcaption>
    </figure>
  );
}
