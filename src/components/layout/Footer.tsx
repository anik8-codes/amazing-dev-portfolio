import Link from 'next/link';
import avatar from '@/assets/sprites/default-head.png';
import { RunCycle } from '@/components/pixel/RunCycle';
import { Sprite } from '@/components/pixel/Sprite';
import { Wordmark } from '@/components/pixel/Wordmark';
import { arcadeExit } from '@/config/footer';
import { hud } from '@/config/hud';
import { site } from '@/config/site';
import { socials } from '@/config/socials';
import { RunnerToggle } from './RunnerToggle';

const action =
  'inline-flex min-h-12 items-center gap-2 border-2 bg-white px-3 py-2 text-sm font-extrabold shadow-[3px_3px_0_var(--color-haze)] hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-0.5 active:shadow-none';
const key =
  'grid size-6 shrink-0 place-items-center rounded-full border border-current font-display text-pixel-8';
const navLink =
  'inline-flex min-h-11 items-center gap-1 font-bold hover:underline underline-offset-4';

export function Footer() {
  return (
    <footer
      id="footer"
      className="defer-render mt-auto pb-8"
      style={{ '--deferred-height': '480px' } as React.CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-8 sm:pt-20">
        <div className="border-2 border-haze bg-white shadow-[6px_6px_0_var(--color-haze)]">
          <div className="grid items-center gap-5 bg-pixel-grid px-5 py-7 sm:grid-cols-[1.1fr_0.9fr] sm:gap-8 sm:px-10 sm:py-9">
            <div>
              <Wordmark cell={4} className="mb-6 block h-auto max-w-full" />
              <h2 className="mb-5 font-display text-pixel-24 uppercase sm:text-pixel-32">
                {arcadeExit.title}
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={arcadeExit.play.href}
                  prefetch={false}
                  data-sfx="start"
                  data-umami-event="press_start"
                  className={`${action} border-ink text-ink`}
                >
                  <span className={key} aria-hidden>
                    A
                  </span>
                  {arcadeExit.play.label}
                </Link>
                <a
                  href={arcadeExit.book.href}
                  data-sfx="start"
                  data-umami-event="book_open"
                  className={`${action} border-red text-red`}
                >
                  <span className={key} aria-hidden>
                    B
                  </span>
                  {arcadeExit.book.label}
                </a>
              </div>
            </div>
            <div
              aria-hidden
              className="relative isolate grid min-h-42 place-items-center sm:min-h-48"
            >
              <div className="absolute inset-x-[8%] bottom-2 -z-10 h-5 border-2 border-ink bg-[repeating-linear-gradient(90deg,var(--color-lavender)_0_18px,var(--color-haze)_18px_20px)] shadow-[4px_4px_0_var(--color-haze)]" />
              <div className="mb-3 w-32 -rotate-3 self-end border-3 border-ink bg-lavender p-2 shadow-[6px_5px_0_var(--color-mist),10px_8px_0_var(--color-haze)] sm:w-36 sm:p-3">
                <div className="grid h-20 place-items-center border-3 border-ink bg-panel shadow-[inset_0_0_0_3px_var(--color-haze)]">
                  <Sprite src={avatar} alt="" scale={0.5} />
                </div>
                <div className="mt-1 flex h-5 items-center justify-end gap-1 border-2 border-ink bg-mist px-2">
                  <span className="size-2 rounded-full border border-ink bg-red" />
                  <span className="size-2 rounded-full border border-ink bg-red" />
                </div>
                <div className="mx-auto mt-2 h-1 w-6 bg-ink" />
              </div>
            </div>
          </div>
          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-x-5 border-t-2 border-haze bg-panel px-5 py-2 text-sm sm:px-10"
          >
            {hud.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`${navLink} capitalize`}
              >
                {item.label}
              </Link>
            ))}
            {socials.map((social) => (
              <a key={social.id} href={social.href} className={`${navLink} capitalize`}>
                {arcadeExit.socialLabels[social.id] ?? social.label}
                <span aria-hidden>↗</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
          <RunnerToggle />
          <nav aria-label="Plain text versions" className="flex gap-3">
            <a href="/llms.txt" className="underline underline-offset-4 hover:text-ink">
              llms.txt
            </a>
            <a href="/index.md" className="underline underline-offset-4 hover:text-ink">
              index.md
            </a>
          </nav>
          <p className="max-w-full sm:ml-auto">
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
