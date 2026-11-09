import { Terminal } from '@/components/terminal/Terminal';
import { CANVAS_HEIGHT, cartridges, reels, socialSpots, terminal } from '@/config/hero';
import { socials } from '@/config/socials';
import { Cartridge } from './Cartridge';
import { HeroFigurines } from './HeroFigurines';
import { HeroCenter } from './HeroCenter';
import { Placed } from './Placed';
import { ReelWindow } from './ReelWindow';
import { SocialTile } from './SocialTile';

/** Mobile: a swipe row. Desktop (xl): `contents`, so children are placed straight onto the canvas. */
const strip = 'flex snap-x scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 xl:contents';

/**
 * The "anik8 canvas" hero (requirements §4a). A grid canvas at xl+, a stacked layout below.
 * All content and positions come from src/config. Interactive behavior stays in small client leaves.
 */
export function HeroCanvas() {
  return (
    <section
      aria-label="anik8 canvas"
      className="relative flex flex-col gap-10 py-10 xl:block xl:h-(--h) xl:py-0"
      style={{ '--h': `${CANVAS_HEIGHT}px` } as React.CSSProperties}
    >
      <div className="px-4 xl:px-0">
        <HeroCenter />
      </div>

      <ul aria-label="find me on" className="flex flex-wrap justify-center gap-4 px-4 xl:contents">
        {socials.map((s) => (
          <li key={s.id} className="contents">
            <Placed pos={socialSpots[s.id] ?? { x: 0, y: 0 }}>
              <SocialTile social={s} />
            </Placed>
          </li>
        ))}
      </ul>

      {/* Focusable so keyboard users can scroll the strip on mobile. */}
      <div id="reels" role="region" aria-label="reels" tabIndex={0} className={strip}>
        {reels.map((reel) => (
          <Placed key={reel.title} pos={reel.pos}>
            <ReelWindow reel={reel} />
          </Placed>
        ))}
        <Placed pos={terminal.pos}>
          <Terminal file={terminal.file} />
        </Placed>
      </div>

      <HeroFigurines className={strip} />

      <nav aria-label="sections" className={`${strip} justify-center`}>
        {cartridges.map((c) => (
          <Placed key={c.label} pos={c.pos}>
            <Cartridge label={c.label} href={c.href} />
          </Placed>
        ))}
      </nav>

      <span id="read" className="sr-only">
        read mode starts here
      </span>
    </section>
  );
}
