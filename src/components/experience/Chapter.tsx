import Link from 'next/link';
import { looks } from '@/assets/sprites';
import { Sprite } from '@/components/pixel/Sprite';
import type { Job } from '@/config/experience';
import { CompanyLinks } from './CompanyLinks';
import { Hills } from './Hills';
import { RoleLadder } from './RoleLadder';
import { SceneArt } from './SceneArt';
import { TechChips } from './TechChips';
import styles from './experience.module.css';

/**
 * One experience chapter: the company as the heading (with its website and LinkedIn), the
 * titles held there (a ladder when promoted), what I did, and the tech used as logo chips.
 * Beside it, the place it happened standing on layered hills. Odd chapters flip sides.
 */
export function Chapter({ job, index }: { job: Job; index: number }) {
  return (
    <article
      aria-labelledby={`chapter-${job.slug}`}
      className={`${styles.chapter} ${index % 2 ? styles.flip : ''}`}
    >
      <Hills seed={index} />

      <div className={styles.copy}>
        <div className="flex flex-col gap-3">
          <h3
            id={`chapter-${job.slug}`}
            className="text-5xl leading-[0.95] font-extrabold tracking-tight text-balance xl:text-6xl"
          >
            {job.company}
          </h3>
          <CompanyLinks job={job} />
        </div>
        <RoleLadder roles={job.roles} />
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">what i did</p>
          <ul className="mt-2 flex max-w-lg flex-col gap-1.5">
            {job.shipped.slice(0, 3).map((s) => (
              <li key={s} className="flex gap-2.5">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <TechChips names={job.stack} />
        <Link
          prefetch={false}
          href={`/experience/${job.slug}/`}
          className="w-fit rounded-full border-2 border-ink bg-white px-5 py-2.5 font-semibold transition hover:-translate-y-0.5 hover:bg-ink hover:text-white"
        >
          read more →
        </Link>
      </div>

      <div className={styles.visual}>
        {job.scene ? (
          <SceneArt tones={job.scene.tones} alt={job.scene.alt} className={styles.scene} />
        ) : (
          <Sprite
            src={looks[job.look].body}
            alt={`anik8 in ${job.look} look`}
            scale={1}
            className={styles.portrait}
          />
        )}
      </div>
    </article>
  );
}
