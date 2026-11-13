import { site } from '@/config/site';
import { ogCard, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = `PLAY mode in ${site.author}'s 3D portfolio`;
export const size = ogSize;
export const contentType = 'image/png';

export default function OgImage() {
  return ogCard({ title: 'PLAY mode', subtitle: `Explore ${site.author}'s story in 3D` });
}
