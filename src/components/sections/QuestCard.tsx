import type { Quest, Rarity } from '@/config/quests';
import { StatusChip } from './StatusChip';
import { ProjectPreview } from './ProjectPreview';

/** Colour lives on the strip + square (decorative); label text stays ink for AA contrast. */
const rarity: Record<Rarity, { label: string; bar: string }> = {
  legendary: { label: 'legendary', bar: 'bg-orange' },
  rare: { label: 'rare', bar: 'bg-lavender' },
  common: { label: 'common', bar: 'bg-haze' },
};

/** One project in the quest log: rarity strip, status, pitch, result, stack as text tags. */
export function QuestCard({ quest }: { quest: Quest }) {
  const r = rarity[quest.rarity];
  return (
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border-2 border-ink bg-white p-5 pl-7 shadow-[6px_6px_0_var(--color-haze)] transition-transform hover:-translate-y-0.5">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-2 ${r.bar}`} />
      {quest.preview && <ProjectPreview preview={quest.preview} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`flex items-center gap-2 font-display text-pixel-8 uppercase`}>
          <span aria-hidden className={`size-2 ${r.bar}`} />
          {r.label}
        </span>
        {quest.status && <StatusChip status={quest.status} />}
      </div>
      <h3 className="text-xl font-bold">
        {quest.href ? (
          <a href={quest.href} target="_blank" rel="noopener noreferrer" className="hover:text-red">
            {quest.title}
          </a>
        ) : (
          quest.title
        )}
      </h3>
      <p className="text-muted">{quest.pitch}</p>
      {quest.result && (
        <p className="font-display text-pixel-8 uppercase">
          reward: <span className="text-red">{quest.result}</span>
        </p>
      )}
      {quest.publishedStats && quest.evidence && (
        <div className="rounded-xl border-2 border-haze p-3">
          <dl className="flex flex-wrap gap-x-6 gap-y-3">
            {quest.publishedStats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-muted">{stat.label}</dt>
                <dd className="text-lg font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted">
            <a
              className="underline underline-offset-4"
              href={quest.evidence.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {quest.evidence.label}
            </a>
            {' · '}
            {quest.evidence.checked}
          </p>
        </div>
      )}
      {quest.stack.length > 0 && (
        <ul aria-label="stack" className="mt-auto flex flex-wrap gap-2">
          {quest.stack.map((t) => (
            <li
              key={t}
              className="rounded-full border-2 border-haze px-2.5 py-0.5 text-xs font-semibold text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
