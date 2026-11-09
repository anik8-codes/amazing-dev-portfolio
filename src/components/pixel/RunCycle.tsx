import { run } from '@/assets/sprites/run';
import type { SpriteScale } from './Sprite';

interface Props {
  scale?: SpriteScale;
  /** Show frame 1 only (e.g. a motion-trail ghost). */
  still?: boolean;
  /** Accessible name; omit when decorative. */
  label?: string;
  className?: string;
}

/** The 8-frame run cycle as a CSS steps() animation (zero JS). Reduced motion shows frame 1. */
export function RunCycle({ scale = 0.5, still, label, className }: Props) {
  const w = run.frameWidth * scale;
  return (
    <div
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={`${still ? '' : 'animate-run'} bg-no-repeat [image-rendering:pixelated] ${className ?? ''}`}
      style={
        {
          width: w,
          height: run.src.height * scale,
          backgroundImage: `url(${run.src.src})`,
          backgroundSize: `${run.src.width * scale}px 100%`,
          '--run-distance': `-${run.src.width * scale}px`,
        } as React.CSSProperties
      }
    />
  );
}
