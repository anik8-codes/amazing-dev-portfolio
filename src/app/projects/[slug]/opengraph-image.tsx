import { quests } from '@/config/quests';
import { ogCard, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = 'project by Aniket Singh (anik8)';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return quests.map((q) => ({ slug: q.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = quests.find((x) => x.slug === slug)!;
  return ogCard({ title: q.title, subtitle: q.pitch });
}
