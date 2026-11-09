import type { Reel } from '@/config/hero';
import { HeroVideo } from './HeroVideo';
import { VideoWindow } from './VideoWindow';
import styles from './hero.module.css';

/** Supporting reel uses the same Mac-style frame and focus behavior as the intro. */
export function ReelWindow({ reel }: { reel: Reel }) {
  const label = [reel.file, reel.views].filter(Boolean).join(' · ');
  return (
    <figure className={styles.reel} style={{ '--reel-w': `${reel.w}px` } as React.CSSProperties}>
      <VideoWindow title={reel.file}>
        <HeroVideo video={reel.video} />
      </VideoWindow>
      <figcaption className="text-center text-xs text-muted">
        {reel.caption}
        <span className="sr-only"> · {label}</span>
      </figcaption>
    </figure>
  );
}
