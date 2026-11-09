import { office } from '@/config/office';
import { VirtualOffice } from './VirtualOffice';
import styles from './workspace.module.css';

/** An inline, scroll-expanded workspace. All 3D work waits until this section approaches. */
export function WorkspaceSection() {
  return (
    <section id={office.id} aria-labelledby="workspace-title" className={styles.section}>
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-20 pb-6 xl:px-8">
        <h2 id="workspace-title" className="font-display text-pixel-16 uppercase sm:text-pixel-24">
          {office.title}
        </h2>
        <p className="max-w-xl text-lg text-muted">{office.description}</p>
        <p className={styles.hint}>{office.scrollHint}</p>
      </header>
      <div className={styles.track}>
        <div className={styles.sticky}>
          <div className={styles.frame}>
            <VirtualOffice />
          </div>
        </div>
      </div>
    </section>
  );
}
