import type { Social } from '@/config/socials';

/**
 * A clickable app icon: the platform's real logo in its own colours, rounded like a phone app,
 * with the name as a small label underneath (brand: tech named in text).
 */
export function SocialTile({ social }: { social: Social }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="me noopener noreferrer"
      className="group flex flex-col items-center gap-1.5"
    >
      <span
        className="grid size-14 place-items-center rounded-2xl shadow-lg ring-1 ring-haze transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105"
        style={{ background: social.bg, color: social.fg }}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="currentColor">
          <path d={social.icon} />
        </svg>
      </span>
      <span className="text-xs font-medium text-muted">
        {social.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
