import Link from 'next/link';

interface Props {
  /** A = primary (red), B = secondary (white). */
  letter: 'A' | 'B';
  href: string;
  children: React.ReactNode;
  /** Sound for SoundLayer, e.g. "start" for the coin. */
  sfx?: string;
  className?: string;
}

const looks = {
  A: { button: 'bg-red text-white', key: 'bg-white text-red' },
  B: { button: 'bg-white text-ink', key: 'bg-ink text-white' },
} as const;

/** Controller-style link button: ink frame, 6 px ink shadow that collapses when pressed. */
export function ControllerButton({ letter, href, sfx, children, className }: Props) {
  const look = looks[letter];
  return (
    <Link
      href={href}
      data-sfx={sfx}
      className={`inline-flex items-center gap-4 border-3 border-ink px-6 py-3 text-2xl font-bold shadow-[6px_6px_0_var(--color-ink)] transition-[translate,box-shadow] duration-75 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none motion-reduce:transition-none ${look.button} ${className ?? ''}`}
    >
      <span
        aria-hidden
        className={`grid size-9 shrink-0 place-items-center rounded-full font-display text-pixel-8 ${look.key}`}
      >
        {letter}
      </span>
      {children}
    </Link>
  );
}
