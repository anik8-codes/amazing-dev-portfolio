import Link from 'next/link';
import { Wordmark } from '@/components/pixel/Wordmark';
import { hud } from '@/config/hud';
import { MusicToggle, SoundToggle, ThemeToggle } from './HudToggles';
import { IstClock } from './IstClock';

/** Site top bar: wordmark + nav on the left; clock, sound, theme and "book a call" on the right. */
export function Hud() {
  return (
    <header className="sticky top-0 z-50 border-b border-haze bg-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 xl:px-8">
        <Link href="/" prefetch={false} aria-label="anik8 home" className="shrink-0">
          <Wordmark cell={4} className="h-auto w-[118.5px] sm:w-[158px]" />
        </Link>
        <nav
          aria-label="main"
          className="order-last flex w-full flex-wrap gap-x-6 gap-y-2 text-lg md:order-none md:w-auto"
        >
          {hud.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              prefetch={false}
              className="text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <span className="mr-2 hidden lg:inline">
            <IstClock />
          </span>
          <MusicToggle />
          <SoundToggle />
          <ThemeToggle />
          <Link
            href={hud.book.href}
            data-umami-event="book_open"
            className="ml-2 rounded-full bg-red px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {hud.book.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
