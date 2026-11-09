import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { looks } from '@/assets/sprites';
import { CompanyLinks } from '@/components/experience/CompanyLinks';
import { PhotoCollage } from '@/components/experience/PhotoCollage';
import { RoleLadder } from '@/components/experience/RoleLadder';
import { OfficePortal } from '@/components/experience/OfficePortal';
import { TechChips } from '@/components/experience/TechChips';
import { Sprite } from '@/components/pixel/Sprite';
import { jobs } from '@/config/experience';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  return job
    ? { title: `${job.roles[0]!.title} · ${job.company} · anik8`, description: job.summary }
    : {};
}

/** A full "level" page for one job: titles held, everything done, tech used, the photos. */
export default async function ExperiencePage({ params }: Params) {
  const { slug } = await params;
  const i = jobs.findIndex((j) => j.slug === slug);
  const job = jobs[i];
  if (!job) notFound();
  const newer = jobs[i - 1];
  const older = jobs[i + 1];

  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-14 px-4 py-12 xl:py-16">
      <Link href="/#experience" className="w-fit text-muted hover:text-ink">
        ← back to the map
      </Link>

      <header className="flex flex-col gap-8 md:flex-row md:items-end">
        <Sprite src={looks[job.look].body} alt={`anik8 in ${job.look} look`} scale={1} eager />
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
            experience · {job.place} · {job.kind}
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">{job.company}</h1>
          <CompanyLinks job={job} />
          <p className="max-w-2xl text-lg text-muted">{job.summary}</p>
        </div>
      </header>

      <RoleLadder roles={job.roles} />

      {job.environment && <OfficePortal job={job} />}

      <section aria-labelledby="did" className="flex flex-col gap-5">
        <h2 id="did" className="font-display text-pixel-16 uppercase">
          what i did
        </h2>
        <ul className="flex max-w-3xl flex-col gap-3 text-lg">
          {job.shipped.map((s) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden className="mt-3 size-2 shrink-0 rounded-full bg-red" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tech" className="flex flex-col gap-5">
        <h2 id="tech" className="font-display text-pixel-16 uppercase">
          tech used
        </h2>
        <TechChips names={job.stack} />
      </section>

      <section aria-labelledby="moments" className="flex flex-col gap-5">
        <h2 id="moments" className="font-display text-pixel-16 uppercase">
          moments
        </h2>
        <PhotoCollage photos={job.photos} label={job.company} />
      </section>

      <nav
        aria-label="other levels"
        className="grid gap-4 border-t-2 border-haze pt-8 sm:grid-cols-2"
      >
        {newer ? (
          <Link
            href={`/experience/${newer.slug}/`}
            className="rounded-2xl border-2 border-ink p-4 hover:bg-panel"
          >
            <span className="text-sm text-muted">← newer</span>
            <span className="block font-semibold">{newer.company}</span>
          </Link>
        ) : (
          <span />
        )}
        {older && (
          <Link
            href={`/experience/${older.slug}/`}
            className="rounded-2xl border-2 border-ink p-4 text-right hover:bg-panel"
          >
            <span className="text-sm text-muted">older →</span>
            <span className="block font-semibold">{older.company}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
