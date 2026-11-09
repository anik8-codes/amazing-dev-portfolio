import { WORDMARK } from './grids';
import { PixelSvg } from './PixelSvg';

interface Props {
  /** Cell size in px (brand.md: 4 nav, 12 README, 16 hero, 20 deck). CSS can resize it further. */
  cell?: 4 | 8 | 12 | 16 | 20;
  className?: string;
}

/** The anik8 wordmark: ink cells with a red copy half a cell down-right. Never live text. */
export function Wordmark({ cell = 16, className }: Props) {
  return (
    <PixelSvg
      grid={WORDMARK}
      cell={cell}
      fill="var(--color-ink)"
      shadow="var(--color-red)"
      label="anik8"
      className={className}
    />
  );
}
