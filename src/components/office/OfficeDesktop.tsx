'use client';

import { useState } from 'react';
import { ResumeViewer } from '@/components/resume/ResumeViewer';
import { office } from '@/config/office';
import styles from './office.module.css';

/** Local monitor desktop; resume rendering reuses the old portfolio's PDF iframe approach. */
export function OfficeDesktop() {
  const [open, setOpen] = useState(false);
  const d = office.desktop;
  return (
    <section className={styles.desktop} aria-label={d.title}>
      <header className="flex items-center justify-between gap-4 border-b-2 border-ink bg-white px-6 py-4">
        <span className="font-display text-pixel-16">{d.title}</span>
        <a href="/resume/" target="_top" className="font-semibold underline underline-offset-4">
          {d.full}
        </a>
      </header>
      {open ? (
        <div className="m-6 flex min-h-0 flex-1 flex-col gap-4 rounded-xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-haze)]">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold">{d.file}</h1>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border-2 border-ink px-4 py-2"
            >
              {d.close}
            </button>
          </div>
          <ResumeViewer compact />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 p-12 text-center">
          <h1 className="font-display text-pixel-32 uppercase">{d.heading}</h1>
          <p className="text-2xl">{d.subtitle}</p>
          <p className="max-w-xl text-lg text-muted">{d.note}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border-3 border-ink bg-white px-10 py-8 text-2xl font-bold shadow-[6px_6px_0_var(--color-ink)]"
          >
            ▤ {d.open}
          </button>
        </div>
      )}
    </section>
  );
}
