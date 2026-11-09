import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { sourceFrom, swarmScript } from './swarm';

describe('sourceFrom', () => {
  it('spots AI referrers and utm tags', () => {
    expect(sourceFrom('https://chatgpt.com/', '')).toBe('chatgpt');
    expect(sourceFrom('', '?utm_source=perplexity.ai')).toBe('perplexity');
    expect(sourceFrom('https://claude.ai/chat/1', '')).toBe('claude');
  });
  it('ignores everyone else', () => {
    expect(sourceFrom('https://www.google.com/', '')).toBeNull();
    expect(sourceFrom('', '')).toBeNull();
  });
});

describe('swarm intro eligibility', () => {
  function visit(pathname: string, reduced = false, visited = false) {
    const dataset: Record<string, string> = {};
    const storage = new Map(visited ? [['swarm', '1']] : []);
    const timers: { callback: () => void; delay: number }[] = [];
    runInNewContext(swarmScript, {
      document: { documentElement: { dataset }, referrer: '' },
      location: { pathname, search: '' },
      sessionStorage: {
        getItem: (key: string) => storage.get(key),
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      matchMedia: () => ({ matches: reduced }),
      setTimeout: (callback: () => void, delay: number) => timers.push({ callback, delay }),
      addEventListener() {},
      removeEventListener() {},
    });
    return { dataset, storage, timers };
  }

  it('leaves content pages alone without consuming the home intro', () => {
    for (const path of ['/experience/botmartz/', '/projects/undrift/', '/resume/', '/play/']) {
      const page = visit(path);
      expect(page.dataset.swarm).toBeUndefined();
      expect(page.storage.has('swarm')).toBe(false);
    }
  });

  it.each(['/', '/index.html'])('bounds the home decoration on %s', (path) => {
    const page = visit(path);
    expect(page.dataset.swarm).toBe('build');
    expect(page.timers[0]?.delay).toBeLessThanOrEqual(4500);
    page.timers[0]?.callback();
    expect(page.dataset.swarm).toBeUndefined();
  });

  it('skips the intro for reduced motion and repeat visits', () => {
    expect(visit('/', true).dataset.swarm).toBeUndefined();
    expect(visit('/', false, true).dataset.swarm).toBeUndefined();
  });
});
