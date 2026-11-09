import type { Role } from '@/config/experience';
import { duration, formatMonth } from '@/lib/career';

/**
 * Titles held at one company, newest first. A single title is one line; a promotion shows as a
 * ladder (e.g. project lead ↑ intern) joined by a rule, like a grouped LinkedIn entry.
 */
export function RoleLadder({ roles }: { roles: readonly Role[] }) {
  return (
    <ol className="flex max-w-lg flex-col border-l-4 border-ink pl-4">
      {roles.map((r, i) => (
        <li key={`${r.title}-${r.start}`} className={i ? 'mt-3' : ''}>
          {i > 0 && (
            <p
              aria-hidden
              className="-mt-1 mb-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase"
            >
              ↑ promoted from
            </p>
          )}
          <p className="text-lg font-bold">
            {r.title}
            {r.end === null && <span className="text-red"> · now</span>}
          </p>
          <p className="text-sm text-muted">
            {formatMonth(r.start)} — {r.end ? formatMonth(r.end) : 'present'} ·{' '}
            {duration(r.start, r.end)}
          </p>
        </li>
      ))}
    </ol>
  );
}
