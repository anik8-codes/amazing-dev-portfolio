import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { PlayGame } from '@/components/play/PlayGame';

export const metadata: Metadata = pageMeta({
  title: 'play · anik8',
  description:
    "Walk through Aniket Singh's story in a small 3D world: every chapter from Indore to CTO.",
  path: '/play/',
});

/** PLAY mode (requirements §6). Everything 3D loads only on this page. */
export default function Play() {
  return <PlayGame />;
}
