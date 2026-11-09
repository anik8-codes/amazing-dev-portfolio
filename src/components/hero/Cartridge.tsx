import Link from 'next/link';

interface Props {
  label: string;
  href: string;
}

/** A game cartridge that links to a section (QUESTS, LORE, BLOG). */
export function Cartridge({ label, href }: Props) {
  return (
    <Link
      href={href}
      className="flex h-[120px] w-[108px] flex-col items-center gap-3 rounded-t-md rounded-b-xl border-3 border-ink bg-white px-3 pt-4 pb-3 shadow-[6px_6px_0_var(--color-haze)] transition-transform hover:-translate-y-0.5"
    >
      <span className="grid h-12 w-full place-items-center border-3 border-ink font-display text-pixel-8 text-red uppercase">
        {label}
      </span>
      <span aria-hidden className="mt-auto flex gap-1">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="h-2 w-1 bg-ink" />
        ))}
      </span>
    </Link>
  );
}
