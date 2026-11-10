import { Section } from '@/components/sections/Section';
import profile from '@/data/github-profile.json';
import { calendarStats, type Day } from '@/lib/github';
import { ContributionGraph } from './ContributionGraph';
import { PlayerCard } from './PlayerCard';

const weeks = profile.weeks as unknown as Day[][];
const fmt = (n: number) => n.toLocaleString('en-IN');
const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`;
const day = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

/**
 * World 1-3: player 1. The profile card (GitHub picture, flips to the old portfolio portrait)
 * beside the last year of GitHub activity. Data: src/data/github-profile.json
 * (`pnpm github-profile`), refreshed at build time; no runtime calls.
 */
export function GithubSection() {
  const s = calendarStats(weeks);
  return (
    <Section defer id="player" stage="1-3" title="player 1" kicker="the human behind the commits.">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
        <PlayerCard
          login={profile.login}
          stats={[
            { label: 'contributions / yr', value: fmt(profile.contributions) },
            { label: 'public repos', value: fmt(profile.publicRepos) },
            { label: 'stars', value: fmt(profile.stars) },
            { label: 'followers', value: fmt(profile.followers) },
          ]}
        />
        <div className="w-full min-w-0 flex-1 rounded-3xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-haze)] sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-pixel-8 uppercase">github activity</h3>
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-red"
            >
              @{profile.login} ↗
            </a>
          </div>
          <p className="mt-3 text-4xl font-extrabold tabular-nums">
            {fmt(s.total)}
            <span className="ml-2 text-base font-semibold text-muted">
              contributions in the last year
            </span>
          </p>
          <div className="mt-6">
            <ContributionGraph
              weeks={weeks}
              label={`${fmt(s.total)} GitHub contributions in the last year; longest streak ${s.longestStreak} days.`}
            />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['longest streak', days(s.longestStreak)],
              ['current streak', days(s.currentStreak)],
              ['best day', `${s.best.count} · ${day(s.best.date)}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-panel p-3">
                <dd className="text-lg font-extrabold tabular-nums">{v}</dd>
                <dt className="text-xs text-muted">{k}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">updated {profile.generatedAt}</p>
        </div>
      </div>
    </Section>
  );
}
