import type { Metadata } from 'next';
import { PlayGame } from '@/components/play/PlayGame';

export const metadata: Metadata = {
  title: 'play · anik8',
  description:
    "Walk through Aniket Singh's story in a small 3D world: every chapter from Indore to CTO.",
};

/** PLAY mode (requirements §6). Everything 3D loads only on this page. */
export default function Play() {
  return <PlayGame />;
}
