import { hud } from './hud';

export const arcadeExit = {
  title: 'continue?',
  play: { label: 'Enter PLAY', href: '/play/' },
  book: { ...hud.book, label: 'Book a call' },
  socialLabels: { github: 'GitHub', youtube: 'YouTube' } as Readonly<Record<string, string>>,
} as const;
