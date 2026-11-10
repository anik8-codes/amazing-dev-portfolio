import { jobs } from '@/config/experience';
import { ogCard, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = 'experience of Aniket Singh (anik8)';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = jobs.find((x) => x.slug === slug)!;
  return ogCard({ title: j.company, subtitle: `${j.roles[0]!.title} · ${j.place}` });
}
