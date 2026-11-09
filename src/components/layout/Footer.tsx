import Link from 'next/link';
import { SocialTile } from '@/components/hero/SocialTile';
import { RunCycle } from '@/components/pixel/RunCycle';
import { hud } from '@/config/hud';
import { site } from '@/config/site';
import { socials } from '@/config/socials';
import { RunnerToggle } from './RunnerToggle';

/** Site footer: socials, links, credits, standing on pixel ground tiles with the runner at rest. */
export function Footer() {
  return (
    <footer className="mt-auto pb-8">
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
            {[...hud.nav, { label: 'now', href: '/now' }, hud.book].map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
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
