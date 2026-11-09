import styles from './experience.module.css';

/**
 * Layered hills under each chapter, in the same scene tones: a far ridge, a nearer one, then
 * a soft fade into the page. `seed` shifts the curves so each chapter's land looks different.
 */
export function Hills({ seed = 0 }: { seed?: number }) {
  const s = (n: number) => n + seed * 37;
  const far = `M0 120 C ${s(180)} 40, ${s(360)} 110, ${s(560)} 60 S ${s(900)} 30, ${s(1100)} 80 S 1400 50, 1600 90 L1600 220 L0 220 Z`;
  const near = `M0 170 C ${s(220)} 120, ${s(420)} 175, ${s(640)} 140 S ${s(1000)} 110, ${s(1240)} 150 S 1480 130, 1600 160 L1600 220 L0 220 Z`;
  return (
    <svg aria-hidden viewBox="0 0 1600 220" preserveAspectRatio="none" className={styles.hills}>
      <path d={far} fill="var(--color-scene-1)" />
      <path d={near} fill="var(--color-scene-2)" />
    </svg>
  );
}
