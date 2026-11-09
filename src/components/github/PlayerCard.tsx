/* eslint-disable @next/next/no-img-element -- pre-sized static portraits, no optimizer server */
import avatar from '@/assets/profile/avatar.png';
import portrait from '@/assets/profile/portrait.jpg';
import { site } from '@/config/site';
import styles from './github.module.css';

interface Props {
  login: string;
  stats: { label: string; value: string }[];
}

/**
 * A trading-card style profile: the GitHub picture on the front, the headphones portrait from
 * the old portfolio on the back. Flips on hover or keyboard focus (CSS only); reduced motion
 * shows the front only.
 */
export function PlayerCard({ login, stats }: Props) {
  return (
    <a
      href={`https://github.com/${login}`}
      target="_blank"
      rel="me noopener noreferrer"
      aria-label={`${site.author} on GitHub (opens in a new tab)`}
      className={styles.card}
    >
      <span className={styles.inner}>
        <span className={`${styles.face} ${styles.front}`}>
          <span className="flex items-center justify-between font-display text-pixel-8 uppercase">
            <span>player 1</span>
            <span className="text-muted">github</span>
          </span>
          <span className="mt-3 block overflow-hidden rounded-2xl bg-panel">
            <img
              src={avatar.src}
              width={avatar.width}
              height={avatar.height}
              loading="lazy"
              decoding="async"
              alt=""
              className="aspect-square w-full [image-rendering:pixelated]"
            />
          </span>
          <span className="mt-4 block text-2xl font-extrabold">{site.author}</span>
          <span className="block text-sm text-muted">@{login} · cto @ maxcode</span>
          <span className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <span key={s.label} className="rounded-xl bg-panel px-3 py-2">
                <span className="block text-lg font-extrabold tabular-nums">{s.value}</span>
                <span className="block text-xs text-muted">{s.label}</span>
              </span>
            ))}
          </span>
        </span>
        <span aria-hidden className={`${styles.face} ${styles.back}`}>
          <img
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            loading="lazy"
            decoding="async"
            alt=""
            className="size-full object-cover"
          />
          <span className="absolute inset-x-4 bottom-4 rounded-xl bg-term/80 px-3 py-2 font-display text-pixel-8 text-term-fg uppercase">
            alt skin unlocked
          </span>
        </span>
      </span>
    </a>
  );
}
