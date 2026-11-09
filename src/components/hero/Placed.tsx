import { CANVAS_WIDTH, type Pos } from '@/config/hero';

interface Props {
  pos: Pos;
  /** Hide below the lg breakpoint (decorative props that have no mobile slot). */
  desktopOnly?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Pins its child onto the hero canvas at lg+ (absolute, x as % of the canvas, tilted).
 * Below lg it is a normal flow item, so the mobile layout needs no extra markup.
 */
export function Placed({ pos, desktopOnly, className, children }: Props) {
  return (
    <div
      className={`shrink-0 snap-start lg:absolute lg:top-(--y) lg:left-(--x) lg:rotate-(--r) ${pos.centered ? 'lg:-translate-x-1/2 lg:-translate-y-1/2' : ''} ${desktopOnly ? 'hidden lg:block' : ''} ${className ?? ''}`}
      style={
        {
          '--x': `${(pos.x / CANVAS_WIDTH) * 100}%`,
          '--y': `${pos.y}px`,
          '--r': `${pos.r ?? 0}deg`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
