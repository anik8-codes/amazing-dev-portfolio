'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { terminalContent as t } from '@/config/terminal';
import { runCommand } from '@/lib/terminal';

interface Line {
  text: string;
  /** Echo of a typed command (rendered after the prompt). */
  cmd?: boolean;
}

const PROMPT = `${t.user}@${t.host} ~ %`;
const welcome = t.welcome.map((text) => ({ text }));

/**
 * The hero's whoami.sh window. Click it to open a centred, typeable terminal (native <dialog>:
 * focus trap and Esc-to-close come free). Commands are interpreted by src/lib/terminal.ts.
 */
export function Terminal({ file, compact = false }: { file: string; compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(welcome);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  function open() {
    dialog.current?.showModal();
    input.current?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = runCommand(value);
    if (value.trim()) setHistory((h) => [...h, value]);
    setCursor(null);
    setValue('');
    setLines((prev) =>
      result.clear
        ? []
        : [...prev, { text: value, cmd: true }, ...result.lines.map((text) => ({ text }))],
    );
    if (result.close) dialog.current?.close();
    if (result.go) {
      if (result.go.startsWith('http')) window.open(result.go, '_blank', 'noopener');
      else {
        dialog.current?.close();
        router.push(result.go);
      }
    }
  }

  function recall(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    if (!history.length) return;
    const last = history.length - 1;
    const next =
      e.key === 'ArrowUp'
        ? Math.max(0, (cursor ?? history.length) - 1)
        : cursor === null || cursor >= last
          ? null
          : cursor + 1;
    setCursor(next);
    setValue(next === null ? '' : (history[next] ?? ''));
  }

  return (
    <figure
      className={`flex flex-col items-center gap-2 ${compact ? 'w-full lg:w-[clamp(170px,16vw,240px)]' : 'w-72'}`}
    >
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="w-full border-3 border-ink bg-white text-left shadow-[6px_6px_0_var(--color-haze)] transition-transform hover:-translate-y-0.5"
      >
        <span className="flex h-[26px] items-center justify-between border-b-3 border-ink px-2 font-display text-pixel-8 uppercase">
          zsh <span className="text-muted normal-case">click to type</span>
        </span>
        <span
          className={`block font-mono ${compact ? 'p-3 text-xs leading-6 whitespace-pre-wrap' : 'p-4 leading-8 whitespace-pre'}`}
        >
          <span className="text-red">→ </span>~ whoami{'\n'}
          <span className="text-muted">{t.whoami[1]}</span>
          {'\n'}
          <span className="text-red">→ </span>~{' '}
          <span className="inline-block h-4 w-2 animate-blink bg-red align-middle" />
        </span>
      </button>
      <figcaption className="text-sm text-muted">{file}</figcaption>

      <dialog
        ref={dialog}
        aria-label="terminal"
        className="m-auto w-[min(92vw,720px)] border-3 border-ink bg-term p-0 text-term-fg shadow-[8px_8px_0_var(--color-red)] backdrop:bg-ink/40"
      >
        <div className="flex h-8 items-center justify-between border-b-3 border-term-fg/20 px-3 font-display text-pixel-8">
          <span>zsh — {file}</span>
          <form method="dialog">
            <button aria-label="close terminal" className="px-1 hover:text-red">
              ✕
            </button>
          </form>
        </div>
        <div
          ref={screen}
          onClick={() => input.current?.focus()}
          className="h-[min(60vh,420px)] overflow-y-auto p-4 font-mono text-sm leading-6"
        >
          <div aria-live="polite">
            {lines.map((l, i) =>
              l.cmd ? (
                <p key={i}>
                  <span className="text-orange">{PROMPT}</span> {l.text}
                </p>
              ) : (
                <p key={i} className="whitespace-pre-wrap text-term-fg/80">
                  {l.text}
                </p>
              ),
            )}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <label htmlFor="term-input" className="shrink-0 text-orange">
              {PROMPT}
            </label>
            <input
              id="term-input"
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={recall}
              data-sfx="type"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent caret-red outline-none"
            />
          </form>
        </div>
      </dialog>
    </figure>
  );
}
