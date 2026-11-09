import { looks } from '@/assets/sprites';
import { ControllerButton } from '@/components/pixel/ControllerButton';
import { Sprite } from '@/components/pixel/Sprite';
import { currentQuest as q } from '@/config/quests';
import { StatusChip } from './StatusChip';
import { ProjectPreview } from './ProjectPreview';

/** The featured "current" project at the top of Projects: what's being built right now. */
export function CurrentQuestCard() {
  return (
    <article className="relative grid gap-8 overflow-hidden rounded-3xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-haze)] sm:p-8 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 font-display text-pixel-8 text-white uppercase">
            current quest
          </span>
          <StatusChip status={q.status} />
        </div>
        <div>
          <h3 className="text-3xl font-bold sm:text-4xl">{q.title}</h3>
          <p className="mt-1 text-lg text-muted">{q.tagline}</p>
        </div>
        <ul aria-label={q.featuresLabel} className="flex flex-col gap-3">
          {q.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 bg-ink" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="pt-1">
          <ControllerButton letter="A" href={q.href}>
            {q.liveLabel}
          </ControllerButton>
        </div>
        <a
          className="w-fit text-sm text-muted underline underline-offset-4"
          href={q.details.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {q.details.label} ↗
        </a>
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-6">
        <ProjectPreview preview={q.preview} />
        <figure className="flex items-center justify-center gap-4">
          <p className="relative rounded-xl border-2 border-ink bg-white px-3 py-2 font-display text-pixel-8 uppercase">
            new quest unlocked!
            <span
              aria-hidden
              className="absolute -bottom-2 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-ink bg-white"
            />
          </p>
          <Sprite src={looks.builder.body} alt="anik8 in builder gear" scale={1} />
        </figure>
      </div>
    </article>
  );
}
