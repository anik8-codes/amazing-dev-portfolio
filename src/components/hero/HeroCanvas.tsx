import { Terminal } from '@/components/terminal/Terminal';
import { CANVAS_HEIGHT, CANVAS_WIDTH, intro, reels, socialSpots, terminal } from '@/config/hero';
import { socials } from '@/config/socials';
import { HeroFigurines } from './HeroFigurines';
import { HeroCenter } from './HeroCenter';
import { HeroVideo } from './HeroVideo';
import { Placed } from './Placed';
import { ReelWindow } from './ReelWindow';
import { SocialTile } from './SocialTile';
import { VideoWindow } from './VideoWindow';
import styles from './hero.module.css';

/** A bounded, balanced canvas on desktop; compact stacked content below 1024px. */
export function HeroCanvas() {
  return (
    <section
      aria-label="anik8 canvas"
      className={styles.canvas}
      style={
        {
          '--canvas-w': `${CANVAS_WIDTH}px`,
          '--canvas-h': `${CANVAS_HEIGHT}px`,
          '--intro-w': `${intro.w}px`,
          '--intro-top': `${intro.top}px`,
        } as React.CSSProperties
      }
    >
      <div className={`${styles.introPlacement} ${styles.videoPlacement}`}>
        <VideoWindow title={intro.title}>
          <HeroVideo video={intro.video} preview />
        </VideoWindow>
      </div>
      <HeroCenter />
      <ul aria-label="find me on" className={styles.socials}>
        {socials.map((s) => (
          <li key={s.id} className="contents">
            <Placed pos={socialSpots[s.id] ?? { x: 0, y: 0 }} className={styles.socialPlacement}>
              <SocialTile social={s} />
            </Placed>
          </li>
        ))}
      </ul>
      <div id="reels" role="region" aria-label="reels" className={styles.media}>
        {reels.map((reel) => (
          <Placed key={reel.title} pos={reel.pos} className={styles.videoPlacement}>
            <ReelWindow reel={reel} />
          </Placed>
        ))}
        <Placed pos={terminal.pos} className={styles.terminalPlacement}>
          <Terminal file={terminal.file} compact />
        </Placed>
      </div>
      <HeroFigurines className={styles.figurines} />
      <div aria-hidden className={styles.focusBackdrop} />
      <span id="read" className="sr-only">
        read mode starts here
      </span>
    </section>
  );
}
