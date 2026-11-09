import { ControllerButton } from '@/components/pixel/ControllerButton';
import { Wordmark } from '@/components/pixel/Wordmark';
import { center } from '@/config/hero';
import { site } from '@/config/site';
import styles from './hero.module.css';

/** Name and actions sit below the independent intro window, leaving a clear centre. */
export function HeroCenter() {
  const buttons = [{ letter: 'A', ...center.start }] as const;
  return (
    <div
      className={styles.center}
      style={{ '--center-top': `${center.top}px` } as React.CSSProperties}
    >
      <h1 className="flex flex-col items-center gap-3">
        <Wordmark cell={12} className={styles.wordmark} />
        <span className="font-display text-pixel-16 uppercase">{site.author}</span>
      </h1>
      <p className="text-xl font-medium">{site.headline}</p>
      <div className="mt-1 flex flex-wrap justify-center gap-5">
        {buttons.map((b) => (
          <div key={b.letter} className="flex flex-col items-center gap-2">
            <ControllerButton
              letter={b.letter}
              href={b.href}
              sfx={b.letter === 'A' ? 'start' : undefined}
              compact
            >
              {b.label}
            </ControllerButton>
            <span className="text-xs text-muted">{b.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
