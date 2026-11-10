import { ogCard, ogSize } from '@/lib/og';
import { site } from '@/config/site';

export const dynamic = 'force-static';
export const alt = `${site.author} (${site.name}): ${site.headline}`;
export const size = ogSize;
export const contentType = 'image/png';

export default function OgImage() {
  return ogCard({ title: site.author, subtitle: site.headline });
}
