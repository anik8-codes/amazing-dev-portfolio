/* eslint-disable @next/next/no-img-element -- pre-sized static sprites need no image runtime */
import type { StaticImageData } from 'next/image';

/** Brand rule: render at exact halves or whole multiples of the source pixels. */
export type SpriteScale = 0.25 | 0.5 | 1 | 2 | 3;

interface Props {
  src: StaticImageData;
  alt: string;
  scale?: SpriteScale;
  /** Load immediately (above-the-fold sprites); default is lazy. */
  eager?: boolean;
  className?: string;
}

/** A sprite cut from brand/anik8-looks.png (pnpm sprites), drawn with hard pixel edges. */
export function Sprite({ src, alt, scale = 1, eager, className }: Props) {
  return (
    <img
      src={src.src}
      alt={alt}
      width={Math.round(src.width * scale)}
      height={Math.round(src.height * scale)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`[image-rendering:pixelated] ${className ?? ''}`}
    />
  );
}
