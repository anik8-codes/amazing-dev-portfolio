import { quests } from '@/config/quests';
import { questMd } from '@/lib/llms';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return quests.map((q) => ({ slug: q.slug }));
}

/** Markdown twin of the project page, for AI assistants (GEO). */
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = quests.find((x) => x.slug === slug)!;
  return new Response(questMd(q), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
