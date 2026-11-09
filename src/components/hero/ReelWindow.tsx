import { PixelWindow } from '@/components/pixel/PixelWindow';
import type { Reel } from '@/config/hero';
import { HeroVideo } from './HeroVideo';

/** One supporting reel, with a real poster and user-initiated playback. */
export function ReelWindow({ reel }: { reel: Reel }) {
  const label = [reel.file, reel.views].filter(Boolean).join(' · ');
  return (
    <figure
      className="flex w-60 flex-col items-center gap-2 xl:w-(--w)"
      style={{ '--w': `${reel.w}px` } as React.CSSProperties}
    >
      <PixelWindow title={reel.title} className="w-full">
        <HeroVideo video={reel.video} />
      </PixelWindow>
      <figcaption className="text-center text-sm text-muted">
        {reel.caption}
        <span className="sr-only"> · {label}</span>
      </figcaption>
    </figure>
  );
}
