import { site } from './site';

/**
 * Content for the hero terminal. The interpreter lives in src/lib/terminal.ts.
 * TODO(content): Aniket to review every line below.
 */
export const terminalContent = {
  user: 'aniket',
  host: 'anik8',
  whoami: [`${site.author.toLowerCase()} — ${site.headline}`, 'cto · devops · creator'],
  /** Virtual files for `ls` / `cat`. */
  files: {
    'about.txt': [
      'from indore. wrote my first code, then kept shipping.',
      'hackathons → cto → now building undrift.',
      'i explain devops, backend & ai in 60-second videos.',
    ],
    'skills.txt': [
      'devops   kubernetes · docker · opentofu · github actions · cloudflare',
      'backend  typescript · node · hono · postgres',
      'ai       llm apps · voice agents',
    ],
    'contact.txt': ['book a call → type `cd book`', 'or find me on → type `socials`'],
  } as Record<string, string[]>,
  /** Directories that `cd` turns into page navigation. */
  dirs: ['quests', 'blog', 'lore', 'learn', 'book', 'now'] as readonly string[],
  welcome: ['welcome to anik8 zsh. type `help` to see commands.'],
} as const;
