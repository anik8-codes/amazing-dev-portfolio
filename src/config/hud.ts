import { site } from './site';
/** Top bar (requirements §4a → Top bar = game HUD). */
export const hud = {
  nav: [
    { label: 'projects', href: '/#projects' },
    { label: 'resume', href: '/resume/' },
  ],
  book: { label: 'book a call', href: site.booking },
} as const;
