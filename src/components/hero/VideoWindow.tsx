import styles from './hero.module.css';

/** Mac-style video chrome; traffic lights are decorative, native video controls remain real. */
export function VideoWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-hero-video-window className={styles.videoWindow}>
      <div className={styles.titlebar}>
        <span aria-hidden className={styles.traffic}>
          <span className={styles.close} />
          <span className={styles.minimize} />
          <span className={styles.maximize} />
        </span>
        <span className={styles.filename} title={title}>
          {title}
        </span>
        <span aria-hidden />
      </div>
      {children}
    </div>
  );
}
