/* eslint-disable @next/next/no-img-element -- static export: photos are served as-is */
import type { Photo } from '@/config/experience';
import styles from './experience.module.css';

/**
 * Polaroid-style photos scattered in 3D (each tilted on its own axes and pushed to its own
 * depth). On the roadmap they also drift with scroll by depth, so near photos move more.
 * Hover straightens a photo and brings it forward. No photo yet = a labelled placeholder.
 */
const poses = [
  { x: '0%', y: '6%', rz: -8, ry: 18, rx: 6, z: 40 },
  { x: '40%', y: '0%', rz: 6, ry: -14, rx: 4, z: 0 },
  { x: '6%', y: '48%', rz: 4, ry: 12, rx: -6, z: 90 },
  { x: '46%', y: '44%', rz: -5, ry: -20, rx: -4, z: 20 },
];

export function PhotoCollage({ photos, label }: { photos: readonly Photo[]; label: string }) {
  const paired = photos.length === 2;
  return (
    <ul
      aria-label={`photos: ${label}`}
      className={`${styles.collage} ${paired ? styles.pair : ''}`}
    >
      {photos.slice(0, poses.length).map((p, i) => {
        const pose = poses[i]!;
        return (
          <li
            key={p.caption}
            className={styles.photo}
            style={
              {
                left: paired ? undefined : pose.x,
                top: paired ? undefined : pose.y,
                '--rz': `${pose.rz}deg`,
                '--ry': `${pose.ry}deg`,
                '--rx': `${pose.rx}deg`,
                '--z': `${pose.z}px`,
                '--drift': `${16 + pose.z * 0.6}px`,
              } as React.CSSProperties
            }
          >
            <figure className="flex flex-col gap-2 rounded-md bg-white p-2 pb-3 shadow-xl ring-1 ring-haze">
              {p.src ? (
                <img
                  src={p.src}
                  alt={p.caption}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={{
                    aspectRatio: p.width && p.height ? `${p.width} / ${p.height}` : '4 / 3',
                  }}
                  className="w-full rounded-sm object-cover"
                />
              ) : (
                <span className="grid aspect-[4/3] w-full place-items-center rounded-sm bg-[repeating-linear-gradient(135deg,var(--color-panel)_0_10px,var(--color-white)_10px_20px)] font-display text-pixel-8 text-muted uppercase">
                  photo soon
                </span>
              )}
              <figcaption className="truncate text-xs text-muted">{p.caption}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
