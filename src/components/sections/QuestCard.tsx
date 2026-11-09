import Image from 'next/image';
import Link from 'next/link';
import type { Quest } from '@/config/quests';

/**
 * One project, kept small: a screenshot, the name, one line about it, and a quiet line with
 * the year, status and stack (tech named in text). The whole card opens the project page.
 */
export function QuestCard({ quest, now = false }: { quest: Quest; now?: boolean }) {
  const meta = [quest.year, quest.status === 'in progress' ? null : quest.status, ...quest.stack]
    .filter(Boolean)
    .join(' · ');
  const body = (
    <>
      <div className="overflow-hidden rounded-xl border border-haze bg-panel">
        {quest.preview ? (
          <Image
            src={quest.preview.src}
            alt={quest.preview.alt}
            width={quest.preview.width}
            height={quest.preview.height}
            loading="lazy"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 360px"
            className="aspect-[343/180] h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[343/180]" />
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold group-hover:text-red">{quest.title}</h3>
        {now && (
          <span className="flex items-center gap-1.5 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
            <span aria-hidden className="size-1.5 animate-blink rounded-full bg-orange" />
            building now
          </span>
        )}
      </div>
      <p className="line-clamp-1 text-sm text-muted">{quest.pitch}</p>
      {meta && <p className="mt-1 truncate font-mono text-xs text-muted">{meta}</p>}
    </>
  );
  return (
    <article className="group">
      <Link href={`/projects/${quest.slug}/`} className="block">
        {body}
      </Link>
    </article>
  );
}
