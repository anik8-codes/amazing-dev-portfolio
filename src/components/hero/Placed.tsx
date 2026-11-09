import { CANVAS_WIDTH, type Pos } from '@/config/hero';

interface Props {
  pos: Pos;
  /** Hide below the xl breakpoint (decorative props that have no mobile slot). */
  desktopOnly?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Pins its child onto the hero canvas at xl+ (absolute, x as % of the canvas, tilted).
 * Below xl it is a normal flow item, so the mobile layout needs no extra markup.
 */
export function Placed({ pos, desktopOnly, className, children }: Props) {
  return (
    <div
      className={`shrink-0 snap-start xl:absolute xl:top-(--y) xl:left-(--x) xl:rotate-(--r) ${desktopOnly ? 'hidden xl:block' : ''} ${className ?? ''}`}
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
