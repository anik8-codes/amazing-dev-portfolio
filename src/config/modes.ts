import { site } from './site';
import type { Look } from '@/assets/sprites';

export interface Mode {
  id: Look;
  name: string;
  /** Future A-button destination; figurines themselves never navigate. */
  target: string;
  /** Pitch line under the wordmark. TODO(content): one per mode from Aniket. */
  pitch?: string;
}

/** The 10 looks = 10 modes, in brand order. Keys 1–0 map to this order (T08). */
export const modes: readonly Mode[] = [
  { id: 'default', name: 'default', target: '/lore' },
  { id: 'hoodie', name: 'hoodie', target: '/blog' },
  { id: 'work', name: 'work mode', target: '/quests' },
  { id: 'creator', name: 'creator', target: '/#reels' },
  { id: 'traveler', name: 'traveler', target: '/lore' },
  { id: 'hackathon', name: 'hackathon', target: '/quests' },
  { id: 'formal', name: 'formal', target: site.booking },
  { id: 'gamer', name: 'gamer', target: '/#main' },
  { id: 'builder', name: 'builder', target: '/#projects' },
  { id: 'chill', name: 'chill', target: '/#read' },
];

/** Initial hero selection. Matches docs/mockups/hero-v3.png. */
export const defaultModeId: Look = 'creator';
