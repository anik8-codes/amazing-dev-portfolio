import { jobs } from '@/config/experience';
import { jobMd } from '@/lib/llms';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

/** Markdown twin of the experience page, for AI assistants (GEO). */
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = jobs.find((x) => x.slug === slug)!;
  return new Response(jobMd(j), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
