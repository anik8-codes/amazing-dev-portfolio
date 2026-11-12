'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { looks } from '@/assets/sprites';
import { Sprite } from '@/components/pixel/Sprite';
import { lore, places } from '@/config/lore';
import { setSound, soundOn, subscribeSound } from '@/lib/sfx';
import type { WorldHandle } from '@/lib/world/engine';
import { Joystick } from './Joystick';

const pill =
  'pointer-events-auto rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5';
const card =
  'pointer-events-auto w-full rounded-3xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-haze)]';

const OFFICE = '/#workspace';

/**
 * /play: an open island where every chapter of Aniket's story is a place. The engine
 * (src/lib/world) is plain three.js + Rapier, loaded only here. This shell owns everything
 * else: loading, the way back, the chapter card for wherever you're standing, coins, the
 * chapter list (also the fallback when 3D can't run) and touch controls.
 */
export function PlayGame() {
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<WorldHandle | null>(null);
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [area, setArea] = useState<string | null>(null);
  const [coins, setCoins] = useState<[number, number]>([0, 0]);
  const [listOpen, setListOpen] = useState(false);
  const [poi, setPoi] = useState(-1);
  const [cookies, setCookies] = useState<'accepted' | 'rejected' | null>(null);
  const [sunset, setSunset] = useState(false);
  const sound = useSyncExternalStore(subscribeSound, soundOn, () => false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const controller = new AbortController();
    const { style } = document.documentElement;
    const prev = style.overflow;
    style.overflow = 'hidden';
    import('@/lib/world/engine')
      .then(({ createWorld }) =>
        createWorld(el, controller.signal, {
          onProgress: (n, total) => setProgress(n / total),
          onArea: setArea,
          onCoin: (n, total) => setCoins([n, total]),
          onPoi: setPoi,
          onInteract: (id) => {
            if (id === 'desk') router.push(OFFICE);
          },
        }),
      )
      .then((h) => {
        if (controller.signal.aborted) return;
        handle.current = h;
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (!controller.signal.aborted) {
          console.error(e);
          setStatus('error');
        }
      });
    return () => {
      style.overflow = prev;
      controller.abort();
      handle.current = null;
    };
  }, [router]);

  const index = lore.findIndex((c) => c.slug === area);
  const chapter = index >= 0 ? lore[index] : undefined;
  const spot = poi >= 0 ? places[poi]?.poi : undefined;

  return (
    <div className="fixed inset-0 z-[70] bg-white text-ink">
      <div ref={host} className="absolute inset-0" />
      <h1 className="sr-only">anik8 · play: walk around my story</h1>

      {/* top: way back, coins, chapter list */}
      <div
        data-ui
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6"
      >
        <Link href="/" className={pill}>
          ← back to site
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {status === 'ready' && (
            <>
              <p className={`${pill} hover:translate-y-0`} aria-live="polite">
                coins {coins[0]}/{coins[1]}
              </p>
              <button
                type="button"
                aria-pressed={sunset}
                onClick={() => {
                  handle.current?.setSunset(!sunset);
                  setSunset(!sunset);
                }}
                className={`${pill} aria-pressed:bg-panel`}
              >
                sunset
              </button>
              <button
                type="button"
                aria-label="world sound"
                aria-pressed={sound}
                data-sfx="none"
                onClick={() => {
                  setSound(!sound);
                  handle.current?.setSound(!sound);
                }}
                className={`${pill} aria-pressed:bg-panel`}
              >
                sound {sound ? 'on' : 'off'}
              </button>
            </>
          )}
          <button
            type="button"
            aria-expanded={listOpen}
            aria-controls="chapters"
            onClick={() => setListOpen((o) => !o)}
            className={pill}
          >
            chapters · {lore.length}
          </button>
        </div>
      </div>

      {(listOpen || status === 'error') && (
        <nav
          id="chapters"
          data-ui
          aria-label="chapters"
          className="absolute top-20 right-4 bottom-4 w-[min(92vw,340px)] overflow-y-auto rounded-3xl border-2 border-ink bg-white p-4 shadow-[6px_6px_0_var(--color-haze)] sm:right-6"
        >
          {status === 'error' && (
            <div className="mb-3 flex flex-col gap-2 text-sm text-muted">
              <p>the 3D world didn&apos;t load, so here&apos;s the story as a list.</p>
              <button
                type="button"
                onClick={() => location.reload()}
                className="w-fit rounded-full border-2 border-ink px-3 py-1 font-semibold text-ink"
              >
                try again
              </button>
            </div>
          )}
          <ol className="flex flex-col gap-1">
            {lore.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => {
                    handle.current?.teleport(c.slug);
                    setListOpen(false);
                  }}
                  className={`w-full rounded-2xl px-3 py-2 text-left hover:bg-panel ${c.slug === area ? 'bg-panel' : ''}`}
                >
                  <span className="font-display text-pixel-8 text-muted uppercase">{c.year}</span>
                  <span className="block font-semibold">{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <a
            href="/play/audio/CREDITS.txt"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-muted underline underline-offset-4"
          >
            sound credits
          </a>
        </nav>
      )}

      {/* bottom: the place you're in, or how to play */}
      <div
        data-ui
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4 sm:p-6"
      >
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
        {spot ? null : chapter ? (
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
                  {chapter.year} · chapter {index + 1}/{lore.length}
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
        ) : area === 'desk' ? (
          <article aria-live="polite" className={`${card} max-w-sm`}>
            <p className="font-display text-pixel-8 text-red uppercase">my setup</p>
            <h2 className="mt-2 text-2xl font-extrabold">where the work happens</h2>
            <p className="mt-1 text-muted">step inside the desk I build everything on.</p>
            <Link
              href={OFFICE}
              className="mt-3 inline-block rounded-full bg-red px-4 py-2 text-sm font-semibold text-white"
            >
              go inside → <span className="hidden sm:inline">(E)</span>
            </Link>
          </article>
        ) : (
          status === 'ready' && (
            <p className="hidden rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_var(--color-ink)] sm:block">
              wasd to walk · shift to run · space to jump · drag to orbit · scroll to zoom
            </p>
          )
        )}
      </div>

      {status === 'ready' && (
        <Joystick
          onStick={(x, y) => handle.current?.setStick(x, y)}
          onJump={() => handle.current?.press('jump')}
        />
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          <div className="flex w-[min(80vw,360px)] flex-col items-center gap-5 text-center">
            <p className="font-display text-pixel-16 uppercase">loading world</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-track">
              <div
                className="h-full rounded-full bg-orange transition-[width]"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <Link
              href="/"
              className="text-sm font-semibold underline decoration-2 underline-offset-4"
            >
              back to the site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
