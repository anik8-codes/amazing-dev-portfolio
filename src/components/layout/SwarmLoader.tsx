import { LLM_SOURCES } from '@/lib/swarm';
import { SwarmBuild } from './SwarmBuild';
import styles from './swarm.module.css';

// show the name of whichever AI tool sent the visit (the head script sets the id)
const greet =
  `[data-src]{display:none}` +
  LLM_SOURCES.map((l) => `html[data-swarm=${l.id}] [data-src=${l.id}]{display:inline}`).join('');

/**
 * Intro on the first page of a visit: the page starts blank and a swarm of agents rebuilds it
 * (src/lib/swarm-build.ts). `swarmScript` in the layout head decides if it plays: once per
 * session, never under reduced motion or without JS. Visitors sent by an AI tool get a hello.
 */
export function SwarmLoader() {
  return (
    <>
      <style>{greet}</style>
      <p aria-hidden className={styles.pill}>
        <span className={styles.llm}>
          hi!{' '}
          {LLM_SOURCES.map((l) => (
            <span key={l.id} data-src={l.id}>
              {l.name}
            </span>
          ))}{' '}
          sent you here.{' '}
        </span>
        agents are rebuilding this page · click or esc to skip
      </p>
      <SwarmBuild />
    </>
  );
}
