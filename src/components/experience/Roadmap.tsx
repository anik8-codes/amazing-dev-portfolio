import { sprites } from '@/assets/sprites';
import { Section } from '@/components/sections/Section';
import { jobs, span } from '@/config/experience';
import { Chapter } from './Chapter';
import styles from './experience.module.css';

const { run } = sprites;
const RUN_SCALE = 0.5;

/**
 * World 1-1: experience as scroll chapters (style: Hervé Studio's Badge Factory).
 *
 * Robust by construction: every chapter is its own block in normal page flow. On wide,
 * motion-friendly screens each block is tall and its content is sticky, so chapters pin and
 * hand over one after another; scroll-driven animations only add polish (copy slides in, the
 * place rises, anik8 runs from this chapter's flag to the next). If any of that is missing,
 * the chapters still read top to bottom and nothing ever overlaps. Newest job first. Zero JS.
 */
export function Roadmap() {
  const total = jobs.length;
  const last = Math.max(1, total - 1);
  return (
    <Section
      id="experience"
      stage="1-1"
      title="experience"
      kicker="newest first. scroll the road, or read more on any role."
    >
      <ol className={styles.chapters}>
        {jobs.map((job, i) => (
          <li
            key={job.slug}
            id={`exp-${job.slug}`}
            className={styles.block}
            style={
              {
                '--from': i / last,
                '--to': Math.min(i + 1, last) / last,
              } as React.CSSProperties
            }
          >
            <div className={styles.sticky}>
              <Chapter job={job} index={i} />

              <nav aria-label="experience chapters" className={styles.dots}>
                {jobs.map((other, j) => (
                  <a
                    key={other.slug}
                    href={`#exp-${other.slug}`}
                    aria-label={other.company}
                    aria-current={i === j ? 'step' : undefined}
                    className={styles.dot}
                  />
                ))}
              </nav>

              {/* The road: progress + a flag per job + anik8 running + this chapter's counter. */}
              <div aria-hidden className={styles.road}>
                <div className={styles.roadLine}>
                  <span className={styles.roadFill} />
                  {jobs.map((other, j) => (
                    <span
                      key={other.slug}
                      className={styles.flag}
                      style={{ left: `${(j / last) * 100}%` }}
                    >
                      <span>{span(other).start.slice(0, 4)}</span>
                    </span>
                  ))}
                  <div className={styles.runnerTrack}>
                    <div
                      className={styles.runner}
                      style={
                        {
                          width: run.frameWidth * RUN_SCALE,
                          height: Math.round(run.src.height * RUN_SCALE),
                          backgroundImage: `url(${run.src.src})`,
                          backgroundSize: `${run.src.width * RUN_SCALE}px 100%`,
                          '--strip': `-${run.src.width * RUN_SCALE}px`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
                <p className={styles.counter}>
                  {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
