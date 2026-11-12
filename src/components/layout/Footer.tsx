import Link from 'next/link';
import { SocialTile } from '@/components/hero/SocialTile';
import { RunCycle } from '@/components/pixel/RunCycle';
import { hud } from '@/config/hud';
import { site } from '@/config/site';
import { socials } from '@/config/socials';
import { HangingBuddy } from './HangingBuddy';
import { RunnerToggle } from './RunnerToggle';

/** Site footer: socials, links, credits, standing on pixel ground tiles with the runner at rest. */
export function Footer() {
  return (
    <footer
      className="defer-render relative mt-auto pb-8"
      style={{ '--deferred-height': '420px' } as React.CSSProperties}
    >
      <HangingBuddy />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 xl:px-8">
        <ul aria-label="find me on" className="flex flex-wrap gap-5">
          {socials.map((s) => (
            <li key={s.id}>
              <SocialTile social={s} />
            </li>
          ))}
        </ul>
        <RunnerToggle />
        <div className="flex flex-col justify-between gap-6 text-sm text-muted md:flex-row">
          <nav aria-label="footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {[...hud.nav, hud.book].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                data-umami-event={n === hud.book ? 'book_open' : undefined}
                className="hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="flex shrink-0 gap-3 whitespace-nowrap">
            <span>for agents:</span>
            <a href="/llms.txt" className="underline underline-offset-4 hover:text-ink">
              llms.txt
            </a>
            <a href="/index.md" className="underline underline-offset-4 hover:text-ink">
              index.md
            </a>
          </p>
          <p>
            © 2026 {site.author} · code MIT · art & words all rights reserved · built with next.js
            on cloudflare
          </p>
        </div>
      </div>
      <div id="footer-ground" aria-hidden className="relative h-16 bg-ground">
        <RunCycle scale={0.25} still className="absolute -top-[42px] right-6" />
      </div>
    </footer>
  );
}
