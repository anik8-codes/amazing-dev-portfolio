/** Top bar (requirements §4a → Top bar = game HUD). */
export const hud = {
  nav: [
    { label: 'quests', href: '/quests' },
    { label: 'blog', href: '/blog' },
    { label: 'lore', href: '/lore' },
    { label: 'learn', href: '/learn' },
    { label: 'resume', href: '/resume/' },
  ],
  book: { label: 'book a call', href: '/book' },
} as const;
