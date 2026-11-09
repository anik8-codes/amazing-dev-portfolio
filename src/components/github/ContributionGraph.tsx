import type { Day } from '@/lib/github';
import { monthLabels } from '@/lib/github';

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 28; // room for weekday labels
const TOP = 18; // room for month labels

/** Level 0-4 → brand tones (lavender ramp; empty days are the panel colour). */
const FILL = [
  'var(--color-panel)',
  'var(--color-sparkle-2)',
  'var(--color-mist)',
  'var(--color-lavender)',
  'var(--color-scene-3)',
];

/**
 * GitHub-style contribution calendar, drawn at build time as one SVG (no JS, no requests).
 * Each column is a week, each row a weekday. The summary is in `label` for screen readers.
 */
export function ContributionGraph({
  weeks,
  label,
}: {
  weeks: readonly (readonly Day[])[];
  label: string;
}) {
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;
  return (
    <div role="region" aria-label="contribution calendar" tabIndex={0} className="overflow-x-auto">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[640px]"
      >
        {monthLabels(weeks).map((m) => (
          <text key={m.col} x={LEFT + m.col * STEP} y={11} fontSize={10} fill="var(--color-muted)">
            {m.label}
          </text>
        ))}
        {(['mon', 'wed', 'fri'] as const).map((d, i) => (
          <text
            key={d}
            x={0}
            y={TOP + (1 + i * 2) * STEP + CELL - 2}
            fontSize={10}
            fill="var(--color-muted)"
          >
            {d}
          </text>
        ))}
        {weeks.map((week, col) =>
          week.map(([date, , level]) => {
            const row = new Date(`${date}T00:00:00Z`).getUTCDay();
            return (
              <rect
                key={date}
                x={LEFT + col * STEP}
                y={TOP + row * STEP}
                width={CELL}
                height={CELL}
                rx={3}
                fill={FILL[level] ?? FILL[0]}
              />
            );
          }),
        )}
      </svg>
    </div>
  );
}
