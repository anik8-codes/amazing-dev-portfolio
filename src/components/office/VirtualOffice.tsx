'use client';

import { useEffect, useRef, useState } from 'react';
import { office } from '@/config/office';
import { resume } from '@/config/resume';
import type { OfficeHandle, OfficeView } from '@/lib/office/runtime';

/** Only this route imports the 3D engine. Home retains a plain link to enter. */
export function VirtualOffice() {
  const hostRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<OfficeHandle | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loaded, setLoaded] = useState(0);
  const [view, setView] = useState<OfficeView>('desk');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const controller = new AbortController();
    import('@/lib/office/runtime')
      .then(({ createOffice }) =>
        createOffice(host, controller.signal, (n) => {
          if (!controller.signal.aborted) setLoaded(n);
        }),
      )
      .then((instance) => {
        if (controller.signal.aborted) {
          instance.dispose();
          return;
        }
        officeRef.current = instance;
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => {
      controller.abort();
      officeRef.current?.dispose();
      officeRef.current = null;
    };
  }, [attempt]);

  function changeView(next: OfficeView) {
    setView(next);
    officeRef.current?.setView(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label={office.title}>
        {office.views.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={status !== 'ready'}
            aria-pressed={view === item.id}
            onClick={() => changeView(item.id)}
            className="rounded-lg border-2 border-ink bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50 aria-pressed:bg-ink aria-pressed:text-white"
          >
            {item.label}
          </button>
        ))}
        <a href="/resume/" className="ml-auto text-sm font-semibold underline underline-offset-4">
          {resume.open}
        </a>
      </div>
      <div className="relative isolate h-[65svh] min-h-[400px] overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[6px_6px_0_var(--color-haze)] md:h-[72svh]">
        <div ref={hostRef} role="region" aria-label={office.title} className="absolute inset-0" />
        <div
          aria-live="polite"
          className={
            status === 'ready'
              ? 'sr-only'
              : 'absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white p-6 text-center'
          }
        >
          {status === 'loading' && (
            <>
              <p>
                {office.loading} · {Math.round((loaded / office.assets.length) * 100)}%
              </p>
              <progress
                value={loaded}
                max={office.assets.length}
                aria-label={office.loading}
                className="w-48 accent-red"
              />
            </>
          )}
          {status === 'ready' && office.ready}
          {status === 'error' && (
            <>
              <p className="max-w-md">{office.error}</p>
              <a href="/resume/" className="font-semibold underline">
                {resume.title} →
              </a>
              <button
                type="button"
                className="rounded-lg border-2 border-ink px-4 py-2"
                onClick={() => {
                  setLoaded(0);
                  setStatus('loading');
                  setView('desk');
                  setAttempt((n) => n + 1);
                }}
              >
                {office.retry}
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-muted">{office.help}</p>
    </div>
  );
}
