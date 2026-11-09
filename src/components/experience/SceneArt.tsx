import type { StaticImageData } from 'next/image';
import styles from './experience.module.css';

interface Props {
  /** [silhouette, shading] masks from `pnpm scenes`: white = paint. */
  tones: readonly [StaticImageData, StaticImageData];
  alt: string;
  className?: string;
}

/** Silhouette in the light scene tone, shading in the dark one: a duotone that follows the theme. */
const fills = ['var(--color-scene-1)', 'var(--color-scene-3)'];

/**
 * A place as a flat duotone illustration: two stacked luminance masks painted with the theme's
 * scene colours, so it blends into the page in light and dark mode alike.
 */
export function SceneArt({ tones, alt, className }: Props) {
  const [base] = tones;
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${styles.art} ${className ?? ''}`}
      style={{ aspectRatio: `${base.width} / ${base.height}` }}
    >
      {tones.map((t, i) => (
        <span
          key={t.src}
          aria-hidden
          className={styles.tone}
          style={
            {
              maskImage: `url(${t.src})`,
              WebkitMaskImage: `url(${t.src})`,
              background: fills[i],
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
