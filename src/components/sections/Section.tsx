import styles from './home-motion.module.css';

interface Props {
  id: string;
  /** Game-style stage label, e.g. "1-2". */
  stage: string;
  title: string;
  /** One line under the title. */
  kicker?: string;
  className?: string;
  children: React.ReactNode;
}

/** Shell for every home section: "WORLD 1-2" label, pixel h2, kicker, content. */
export function Section({ id, stage, title, kicker, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${styles.world} px-4 py-20 xl:px-8 xl:py-28 ${className ?? ''}`}
    >
      <div aria-hidden className={styles.scenery}>
        <div className={styles.sky} />
        <div className={styles.skyline} />
        <div className={styles.props} />
      </div>
      <div className={`${styles.sectionInner} mx-auto max-w-6xl`}>
        <p className="font-display text-pixel-8 text-muted uppercase">world {stage}</p>
        <h2
          id={`${id}-title`}
          className="mt-3 font-display text-pixel-16 uppercase sm:text-pixel-24"
        >
          {title}
        </h2>
        {kicker && <p className="mt-4 max-w-xl text-lg text-muted">{kicker}</p>}
        <div className={`${styles.content} mt-12`}>{children}</div>
      </div>
    </section>
  );
}
