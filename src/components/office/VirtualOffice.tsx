'use client';

import { useEffect, useRef, useState } from 'react';
import { office } from '@/config/office';
import { resume } from '@/config/resume';
import type { OfficeHandle, OfficeView } from '@/lib/office/runtime';
import styles from './workspace.module.css';

/** Inline workspace: import the engine only as it approaches, suspend it when offscreen. */
export function VirtualOffice() {
  const hostRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<OfficeHandle | null>(null);
  const visibleRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loaded, setLoaded] = useState(0);
  const [view, setView] = useState<OfficeView>('desk');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        preload.disconnect();
      },
      { rootMargin: '800px 0px' },
    );
    const visibility = new IntersectionObserver(([entry]) => {
      visibleRef.current = Boolean(entry?.isIntersecting);
      officeRef.current?.setActive(visibleRef.current);
    });
    preload.observe(host);
    visibility.observe(host);
    return () => {
      preload.disconnect();
      visibility.disconnect();
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !shouldLoad) return;
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
        instance.setActive(visibleRef.current);
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
  }, [attempt, shouldLoad]);

  function changeView(next: OfficeView) {
    setView(next);
    officeRef.current?.setView(next);
  }

  return (
    <div className={styles.office}>
      <div ref={hostRef} role="region" aria-label={office.title} className="absolute inset-0" />
      <div className={styles.toolbar} role="group" aria-label={office.title}>
        {office.views.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={status !== 'ready'}
            aria-pressed={view === item.id}
            onClick={() => changeView(item.id)}
            className="rounded-lg border-2 border-ink bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50 aria-pressed:bg-ink aria-pressed:text-white"
          >
            {item.label}
          </button>
        ))}
        <a
          href={resume.href}
          className="px-2 py-2 text-sm font-semibold underline underline-offset-4"
        >
          {resume.view} ↗
        </a>
        <a
          href={office.continue.href}
          className="px-2 py-2 text-sm text-muted underline underline-offset-4"
        >
          {office.continue.label}
        </a>
      </div>
      <div
        aria-live="polite"
        className={
          status === 'ready'
            ? 'sr-only'
            : 'absolute inset-0 z-3 flex flex-col items-center justify-center gap-4 bg-white p-6 text-center'
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
            <a href={resume.href} className="font-semibold underline">
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
      <div className={styles.footer}>
        <p>{office.help}</p>
        <p>
          <a
            href={office.credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {office.credit.label}
          </a>
          {' · '}
          <a href={office.credit.license} className="underline underline-offset-4">
            MIT
          </a>
        </p>
      </div>
    </div>
  );
}
