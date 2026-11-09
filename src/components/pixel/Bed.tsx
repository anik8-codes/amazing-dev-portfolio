import { looks } from '@/assets/sprites';
import { BED_BLANKET, BED_FRAME, BED_PILLOW } from './grids';
import { PixelSvg } from './PixelSvg';
import { Sprite } from './Sprite';

const CELL = 2; // 28 × 14 cells → 56 × 28 px, sized to the ¼-scale runner

/** Side-view pixel bed with anik8's head on the pillow and the blanket up to his chin. */
export function Bed({ className }: { className?: string }) {
  const layer = 'absolute inset-0';
  return (
    <div aria-hidden className={`relative h-[28px] w-[56px] ${className ?? ''}`}>
      <PixelSvg grid={BED_FRAME} cell={CELL} fill="var(--color-ink)" className={layer} />
      <PixelSvg grid={BED_PILLOW} cell={CELL} fill="var(--color-sparkle-2)" className={layer} />
      {/* Head between pillow and blanket = tucked in. Cut from the sheet, never redrawn. */}
      <Sprite
        src={looks.default.head}
        alt=""
        scale={0.25}
        className="absolute -top-[12px] left-[3px]"
      />
      <PixelSvg grid={BED_BLANKET} cell={CELL} fill="var(--color-lavender)" className={layer} />
    </div>
  );
}
