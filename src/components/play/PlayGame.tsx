'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { looks } from '@/assets/sprites';
import { Sprite } from '@/components/pixel/Sprite';
import { lore, places } from '@/config/lore';
import { getTheme, subscribeTheme } from '@/lib/theme';
import { paletteFor } from './palette';
import type { PlayerApi } from './Player';

const World = dynamic(() => import('./World'), { ssr: false });

/** Points of interest, in the same order World places their markers. */
const pois = places.flatMap((p) => (p.poi ? [p.poi] : []));

const subscribeCalm = (cb: () => void) => {
  const m = matchMedia('(prefers-reduced-motion: reduce)');
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
let webglCache: boolean | undefined;
const hasWebGL = () => {
  if (webglCache === undefined) {
    try {
      const c = document.createElement('canvas');
      webglCache = !!(c.getContext('webgl2') ?? c.getContext('webgl'));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
};
const noop = () => () => {};

const pill =
  'pointer-events-auto rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5';
const card =
  'pointer-events-auto w-full rounded-3xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-haze)]';

/**
 * /play: anik8's story as a walkable 3D island. This client shell owns everything that isn't
 * WebGL: loading screen, "back to read mode", the timeline, the chapter and point-of-interest
 * cards (including the cookie jar), scroll/swipe-to-walk, and an accessible chapter list.
 * Without WebGL it falls back to the list alone.
 */
export function PlayGame() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as const);
  const calm = useSyncExternalStore(
    subscribeCalm,
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
  const webgl = useSyncExternalStore(noop, hasWebGL, () => null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(-1);
  const [poi, setPoi] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [cookies, setCookies] = useState<'accepted' | 'rejected' | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const api = useRef<PlayerApi | null>(null);

  // the page itself never scrolls: wheel and swipes walk the road instead
  useEffect(() => {
    const { style } = document.documentElement;
    const prev = style.overflow;
    style.overflow = 'hidden';
    let touchY: number | null = null;
    const walk = (delta: number) => {
      const a = api.current;
      if (a) a.scrollTo(a.progress() + delta * 0.0009);
    };
    const wheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest('nav, article')) return;
      walk(e.deltaY);
    };
    const start = (e: TouchEvent) => (touchY = e.touches[0]?.clientY ?? null);
    const move = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY === null || y === undefined) return;
      walk((touchY - y) * 2.5);
      touchY = y;
    };
    window.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    return () => {
      style.overflow = prev;
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', move);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const chapter = active >= 0 ? lore[active] : undefined;
  const spot = poi >= 0 ? pois[poi] : undefined;

  return (
    <div className="fixed inset-0 z-[70] bg-white text-ink">
      {webgl && (
        <div className="absolute inset-0">
          <World
            palette={paletteFor(theme)}
            active={active}
            poi={poi}
            calm={calm}
            api={api}
            onChapter={setActive}
            onPoi={setPoi}
            onProgress={setProgress}
            onReady={onReady}
          />
        </div>
      )}

      {/* top bar: way back, timeline, chapter list */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6">
        <Link href="/" className={pill}>
          ← read mode
        </Link>
        <h1 className="sr-only">anik8 · play mode: walk through my story</h1>
        {ready && (
          <div
            aria-hidden
            className="pointer-events-none hidden w-[min(46vw,520px)] rounded-full border-2 border-ink bg-white px-4 py-2 shadow-[3px_3px_0_var(--color-ink)] md:block"
          >
            <div className="relative h-1.5 rounded-full bg-track">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-red"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-display text-[8px] text-muted uppercase">
              {['2022', '2023', '2024', '2025', '2026', 'next'].map((y) => (
                <span key={y}>{y}</span>
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          aria-expanded={listOpen}
          aria-controls="chapters"
          onClick={() => setListOpen((o) => !o)}
          className={pill}
        >
          chapters {active >= 0 ? `${active + 1}/${lore.length}` : `· ${lore.length}`}
        </button>
      </div>

      {(listOpen || webgl === false) && (
        <nav
          id="chapters"
          aria-label="chapters"
          className="absolute top-20 right-4 bottom-4 w-[min(92vw,340px)] overflow-y-auto rounded-3xl border-2 border-ink bg-white p-4 shadow-[6px_6px_0_var(--color-haze)] sm:right-6"
        >
          {webgl === false && (
            <p className="mb-3 text-sm text-muted">
              this browser can&apos;t run the 3D world, so here&apos;s the story as a list.
            </p>
          )}
          <ol className="flex flex-col gap-1">
            {lore.map((c, i) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => {
                    api.current?.teleport(i);
                    setActive(i);
                    setListOpen(false);
                  }}
                  className={`w-full rounded-2xl px-3 py-2 text-left hover:bg-panel ${i === active ? 'bg-panel' : ''}`}
                >
                  <span className="font-display text-pixel-8 text-muted uppercase">{c.year}</span>
                  <span className="block font-semibold">{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        {/* the chapter you're in */}
        {chapter ? (
          <article aria-live="polite" className={`${card} max-w-md`}>
            <div className="flex items-end gap-4">
              <Sprite
                src={looks[chapter.look].body}
                alt={`anik8 in the ${chapter.look} look`}
                scale={0.25}
                className="shrink-0"
              />
              <div>
                <p className="font-display text-pixel-8 text-red uppercase">
                  {chapter.year} · chapter {active + 1}/{lore.length}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">{chapter.title}</h2>
                <p className="text-sm text-muted">{chapter.place}</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {chapter.lines.map((l) => (
                <li key={l} className="flex gap-2.5">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-red" />
                  {l}
                </li>
              ))}
            </ul>
            {chapter.links && (
              <p className="mt-3 flex flex-wrap gap-2">
                {chapter.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold hover:bg-ink hover:text-white"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </p>
            )}
          </article>
        ) : (
          ready &&
          !spot && (
            <p className="rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_var(--color-ink)]">
              scroll to walk through time
              <span className="hidden sm:inline"> · wasd to roam · shift to run</span> · tap to walk
            </p>
          )
        )}

        {/* the thing you're standing next to */}
        {spot && (
          <article aria-live="polite" className={`${card} max-w-sm`}>
            <p className="font-display text-pixel-8 text-orange uppercase">◆ found</p>
            <h2 className="mt-2 text-xl font-extrabold">{spot.title}</h2>
            <p className="mt-1">{spot.text}</p>
            {spot.kind === 'cookies' && (
              <div className="mt-3">
                {cookies ? (
                  <p className="font-semibold">
                    {cookies === 'accepted'
                      ? 'enjoy. still zero tracking, just chocolate chips.'
                      : "rejected, respectfully. here's a cookie anyway 🍪"}
                  </p>
                ) : (
                  <p className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCookies('accepted')}
                      className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white"
                    >
                      accept all
                    </button>
                    <button
                      type="button"
                      onClick={() => setCookies('rejected')}
                      className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold"
                    >
                      reject
                    </button>
                  </p>
                )}
              </div>
            )}
            {spot.link && (
              <a
                href={spot.link.href}
                className="mt-3 inline-block rounded-full bg-red px-4 py-1.5 text-sm font-semibold text-white"
              >
                {spot.link.label} →
              </a>
            )}
          </article>
        )}
      </div>

      {/* loading screen */}
      {webgl !== false && !ready && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          <div className="flex w-[min(80vw,360px)] flex-col items-center gap-5 text-center">
            <p className="font-display text-pixel-16 uppercase">loading world</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-track">
              <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-orange" />
            </div>
            <Link
              href="/"
              className="text-sm font-semibold underline decoration-2 underline-offset-4"
            >
              skip to read mode
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
