/* eslint-disable @next/next/no-img-element -- screenshots are pre-optimized for static hosting */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RoleLadder } from '@/components/experience/RoleLadder';
import { TechChips } from '@/components/experience/TechChips';
import { jobs, span } from '@/config/experience';
import { quests } from '@/config/quests';
import { site } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbs, pageMeta, projectLd } from '@/lib/seo';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return quests.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const q = quests.find((x) => x.slug === slug);
  return q
    ? pageMeta({
        title: `${q.title} · project by Aniket Singh (anik8)`,
        description: `${q.title}: ${q.pitch}`,
        path: `/projects/${q.slug}/`,
        markdown: `/projects/${q.slug}/index.md`,
      })
    : {};
}

const months = (start: string, end: string | null) => {
  const [y0, m0] = start.split('-').map(Number);
  const to = end
    ? end.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  const n = (to[0]! - y0!) * 12 + (to[1]! - m0!);
  return n >= 12
    ? `${Math.floor(n / 12)} yr ${n % 12 ? `${n % 12} mo` : ''}`.trim()
    : `${n} months`;
};

/** One project: what it is, the facts at a glance, how it works, and the work done on it. */
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const i = quests.findIndex((q) => q.slug === slug);
  const q = quests[i];
  if (!q) notFound();
  const job = q.job ? jobs.find((j) => j.slug === q.job) : undefined;
  const prev = quests[i - 1];
  const next = quests[i + 1];

  const facts = [
    job && { label: 'role', value: job.roles[0]!.title },
    job && { label: 'at', value: job.company },
    job && { label: 'duration', value: months(span(job).start, span(job).end) },
    q.year && { label: 'year', value: q.year },
    q.status && { label: 'status', value: q.status },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 xl:py-16">
      <JsonLd data={projectLd(q)} />
      <JsonLd
        data={breadcrumbs([
          { name: 'projects', path: '/#projects' },
          { name: q.title, path: `/projects/${q.slug}/` },
        ])}
      />
      <Link href="/#projects" prefetch={false} className="w-fit text-muted hover:text-ink">
        ← all projects
      </Link>

      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">project</p>
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">{q.title}</h1>
        <p className="max-w-2xl text-lg text-muted">{q.pitch}</p>
        {q.href && (
          <a
            href={q.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded-full bg-red px-5 py-2.5 font-semibold text-white shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5"
          >
            visit {q.href.replace(/^https?:\/\//, '')} ↗
          </a>
        )}
      </header>

      {q.preview && (
        <img
          src={q.preview.src}
          alt={q.preview.alt}
          width={q.preview.width}
          height={q.preview.height}
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full rounded-2xl border border-haze"
        />
      )}

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-haze py-6 sm:grid-cols-3 md:grid-cols-5">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                {f.label}
              </dt>
              <dd className="mt-1 font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {q.publishedStats && (
        <section aria-labelledby="numbers" className="flex flex-col gap-4">
          <h2 id="numbers" className="font-display text-pixel-16 uppercase">
            numbers
          </h2>
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {q.publishedStats.map((s) => (
              <div key={s.label}>
                <dd className="text-3xl font-extrabold">{s.value}</dd>
                <dt className="text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
          {q.evidence && (
            <p className="text-xs text-muted">
              source:{' '}
              <a href={q.evidence.href} className="underline underline-offset-4">
                {q.evidence.label}
              </a>
              , checked {q.evidence.checked}
            </p>
          )}
        </section>
      )}

      {q.features && (
        <section aria-labelledby="how" className="flex flex-col gap-4">
          <h2 id="how" className="font-display text-pixel-16 uppercase">
            how it works
          </h2>
          <ul className="flex max-w-3xl flex-col gap-3 text-lg">
            {q.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden className="mt-3 size-2 shrink-0 rounded-full bg-red" />
                {f}
              </li>
            ))}
          </ul>
          {q.update && (
            <a href={q.update.href} className="w-fit text-muted underline underline-offset-4">
              {q.update.label} ↗
            </a>
          )}
        </section>
      )}

      {job && (
        <section aria-labelledby="did" className="flex flex-col gap-5">
          <h2 id="did" className="font-display text-pixel-16 uppercase">
            what i did
          </h2>
          <RoleLadder roles={job.roles} />
          <ul className="flex max-w-3xl flex-col gap-3 text-lg">
            {job.shipped.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden className="mt-3 size-2 shrink-0 rounded-full bg-red" />
                {s}
              </li>
            ))}
          </ul>
          <Link
            prefetch={false}
            href={`/experience/${job.slug}/`}
            className="w-fit text-muted underline underline-offset-4"
          >
            more about my time at {job.company} →
          </Link>
        </section>
      )}

      {(job || q.stack.length > 0) && (
        <section aria-labelledby="stack" className="flex flex-col gap-4">
          <h2 id="stack" className="font-display text-pixel-16 uppercase">
            stack
          </h2>
          {job ? (
            <TechChips names={job.stack} />
          ) : (
            <p className="font-mono text-sm text-muted">{q.stack.join(' · ')}</p>
          )}
        </section>
      )}

      <nav
        aria-label="other projects"
        className="grid gap-4 border-t-2 border-haze pt-8 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            prefetch={false}
            href={`/projects/${prev.slug}/`}
            className="rounded-2xl border-2 border-ink p-4 hover:bg-panel"
          >
            <span className="text-sm text-muted">← previous</span>
            <span className="block font-semibold">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            prefetch={false}
            href={`/projects/${next.slug}/`}
            className="rounded-2xl border-2 border-ink p-4 text-right hover:bg-panel"
          >
            <span className="text-sm text-muted">next →</span>
            <span className="block font-semibold">{next.title}</span>
          </Link>
        )}
      </nav>
      <p className="sr-only">
        {q.title} is a project by {site.author}.
      </p>
    </article>
  );
}
