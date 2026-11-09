/* eslint-disable @next/next/no-img-element -- static export: tiny SVGs served as-is */
import { tech, type Tech, type TechName } from '@/config/tech';
import icons from '@/data/tech-icons.json';

const files: Record<string, { file: string; mono: boolean } | undefined> = icons;

/**
 * A technology's mark: its real logo (public/tech/<id>.svg from `pnpm tech-icons`), or a short
 * text badge where no logo exists. Near-black logos are inverted in dark mode (globals.css
 * `.mono-logo`). Decorative: the name is always shown as text next to it.
 */
export function TechMark({ id, className }: { id: TechName; className?: string }) {
  const t: Tech = tech[id];
  const icon = files[id];
  if (icon) {
    return (
      <img
        src={`/tech/${icon.file}`}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={`object-contain ${icon.mono ? 'mono-logo' : ''} ${className ?? ''}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`grid place-items-center font-mono text-[10px] leading-none font-bold tracking-tight text-ink ${className ?? ''}`}
    >
      {t.abbr ?? t.label.slice(0, 3).toUpperCase()}
    </span>
  );
}
