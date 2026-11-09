'use client';

import { useEffect } from 'react';

/**
 * Starts the swarm rebuild when the head script asked for it (html[data-swarm]). The engine is
 * imported only then. Removing data-swarm (skip, timeout or done) aborts and reveals the page.
 */
export function SwarmBuild() {
  useEffect(() => {
    const html = document.documentElement;
    const root = document.querySelector<HTMLElement>('[data-swarm-root]');
    if (!html.dataset.swarm || !root) return;
    let disposed = false;
    const controller = new AbortController();
    const watch = new MutationObserver(() => {
      if (!html.dataset.swarm) controller.abort();
    });
    watch.observe(html, { attributes: true, attributeFilter: ['data-swarm'] });
    void document.fonts.ready
      .then(() => import('@/lib/swarm-build'))
      .then(({ runSwarm }) =>
        controller.signal.aborted ? undefined : runSwarm(root, controller.signal),
      )
      .finally(() => {
        if (!disposed) delete html.dataset.swarm;
      });
    return () => {
      disposed = true;
      watch.disconnect();
      controller.abort();
    };
  }, []);
  return null;
}
