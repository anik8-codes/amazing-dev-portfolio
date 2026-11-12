import { site } from '@/config/site';
import { ogCard, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = `Résumé of ${site.author} (${site.name})`;
export const size = ogSize;
export const contentType = 'image/png';

export default function OgImage() {
  return ogCard({ title: `${site.author} · Résumé`, subtitle: site.headline });
}
