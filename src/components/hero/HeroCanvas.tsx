import { Terminal } from '@/components/terminal/Terminal';
import { looks } from '@/assets/sprites';
import { modes } from '@/config/modes';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  figurines,
  intro,
  reels,
  socialSpots,
  terminal,
} from '@/config/hero';
import { socials } from '@/config/socials';
import { HeroFigurines } from './HeroFigurines';
import { HeroCenter } from './HeroCenter';
import { HeroVideo } from './HeroVideo';
import { Placed } from './Placed';
import { ReelWindow } from './ReelWindow';
import { SocialTile } from './SocialTile';
import { VideoWindow } from './VideoWindow';
import styles from './hero.module.css';

// Send only these four sprites' dimensions and URLs to the selector. The whole sprite
// registry (including generated blur placeholders) belongs on the server.
const choices = figurines.map((id) => {
  const image = looks[id].body;
  return {
    id,
    name: modes.find((mode) => mode.id === id)?.name ?? id,
    image: { src: image.src, width: image.width, height: image.height },
  };
});

/** A bounded, balanced canvas on desktop; compact stacked content below 1024px. */
export function HeroCanvas() {
  return (
    <section
      data-swarm-root
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
      <HeroFigurines choices={choices} className={styles.figurines} />
      <div aria-hidden className={styles.focusBackdrop} />
      <span id="read" className="sr-only">
        read mode starts here
      </span>
    </section>
  );
}
