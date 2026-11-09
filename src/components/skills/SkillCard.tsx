import { tech, type TechName } from '@/config/tech';
import { githubUser, type SkillFacts } from '@/lib/skills';
import styles from './skills.module.css';
import { TechMark } from './TechMark';

export const cardId = (id: TechName) => `skill-${id.replace(/[^a-z0-9]+/g, '-')}`;

/**
 * The card a skill node opens: logo, the numbers (public repos, stars, first year), where it was
 * used at work, a few repos, and Aniket's take. Native popover: Esc / click outside closes.
 */
export function SkillCard({ id, take, facts }: { id: TechName; take: string; facts: SkillFacts }) {
  const t = tech[id];
  const title = `${cardId(id)}-title`;
  return (
    <div
      id={cardId(id)}
      popover="auto"
      role="dialog"
      aria-labelledby={title}
      className={styles.card}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl border-2 border-haze bg-white">
          <TechMark id={id} className="size-7" />
        </span>
        <h4 id={title} className="text-2xl font-extrabold">
          {t.label}
        </h4>
        <button
          type="button"
          popoverTarget={cardId(id)}
          popoverTargetAction="hide"
          aria-label="close"
          className="ml-auto grid size-8 place-items-center rounded-full hover:bg-panel"
        >
          ✕
        </button>
      </div>

      <blockquote className="mt-5 border-l-4 border-red pl-4 text-lg">
        “{take}”
        <span className="ml-2 align-middle font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          draft
        </span>
      </blockquote>

      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        {[
          ['public repos', facts.repos],
          ['stars', facts.stars],
          ['since', facts.since ?? '—'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-panel p-3">
            <dd className="text-2xl font-extrabold tabular-nums">{v}</dd>
            <dt className="text-xs text-muted">{k}</dt>
          </div>
        ))}
      </dl>

      {facts.usedAt.length > 0 && (
        <p className="mt-4 text-sm">
          <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">used at </span>
          {facts.usedAt.join(' · ')}
        </p>
      )}
      {facts.sampleRepos.length > 0 && (
        <p className="mt-2 text-sm">
          <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">repos </span>
          {facts.sampleRepos.map((r, i) => (
            <span key={r}>
              {i > 0 && ' · '}
              <a
                href={`https://github.com/${githubUser}/${r}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-4 hover:text-red"
              >
                {r}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
