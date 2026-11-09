import { HEART } from './grids';
import { PixelSvg } from './PixelSvg';

interface Props {
  /** How many hearts are full. */
  full: number;
  total?: number;
  /** Cell size in px (heart is 7 × 6 cells). */
  cell?: number;
  className?: string;
}

/** Lives: a row of pixel hearts, full = red, empty = sparkle lavender. */
export function Hearts({ full, total = 5, cell = 3, className }: Props) {
  return (
    <span
      role="img"
      aria-label={`${full} of ${total} lives`}
      className={`inline-flex gap-[1em] ${className ?? ''}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <PixelSvg
          key={i}
          grid={HEART}
          cell={cell}
          fill={i < full ? 'var(--color-red)' : 'var(--color-sparkle-1)'}
        />
      ))}
    </span>
  );
}
