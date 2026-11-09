/*
 * Swarm rebuild: the hero starts blank (CSS hides [data-swarm-root] while html[data-swarm] is
 * set), then a few named cursor "agents" take its blocks top to bottom: fly to the block, drag a
 * selection box with a W × H badge, and the block appears (text types in left to right, media
 * sweeps down). Our own take on the idea behind Joel Califa's Swarm. Loaded only when it plays.
 */

const AGENTS = ['next', 'hono', 'tofu', 'd1', 'r2', 'kv', 'pnpm', 'vitest'];
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const ARROW =
  '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 9-7 2-3 7z" fill="var(--color-ink)" stroke="var(--color-white)" stroke-width="1.5" stroke-linejoin="round"/></svg>';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Agent {
  el: HTMLElement;
  x: number;
  y: number;
}

const boxOf = (el: Element): Box => {
  const r = el.getBoundingClientRect();
  return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
};

/** The hero's buildable blocks: small or leaf elements in the first ~screen, top to bottom. */
function blocks(root: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  const screen = innerWidth * innerHeight;
  const walk = (el: Element) => {
    for (const c of el.children) {
      if (!(c instanceof HTMLElement || c instanceof SVGElement)) continue;
      const r = c.getBoundingClientRect();
      // display: contents, sr-only and friends have no box: look inside them
      if (r.width < 4 || r.height < 4) walk(c);
      else if (r.top > innerHeight * 1.1 || r.bottom < 0) continue;
      else if (r.width * r.height > screen * 0.2 && c.children.length) walk(c);
      else if (c instanceof HTMLElement) out.push(c);
    }
  };
  walk(root);
  return out.sort((a, b) => boxOf(a).y - boxOf(b).y || boxOf(a).x - boxOf(b).x);
}

const isText = (el: HTMLElement) =>
  !el.querySelector('img,svg,video,canvas,iframe') && (el.textContent ?? '').trim().length > 0;

/** Rebuild `root` with a swarm. Resolves when done; aborting cleans up and shows everything. */
export async function runSwarm(root: HTMLElement, signal: AbortSignal): Promise<void> {
  const todo = blocks(root);
  const anims: Animation[] = [];
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: `${document.documentElement.scrollHeight}px`,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '100',
  });
  document.body.append(layer);

  const cleanup = () => {
    anims.forEach((a) => a.cancel());
    layer.remove();
    todo.forEach((el) => el.style.removeProperty('visibility'));
  };
  signal.addEventListener('abort', cleanup, { once: true });

  const play = (el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
    const a = el.animate(frames, opts);
    anims.push(a);
    return a.finished.then(
      () => undefined,
      () => undefined,
    );
  };
  const move = (ag: Agent, x: number, y: number, ms: number) => {
    const from = `translate(${ag.x}px,${ag.y}px)`;
    ag.x = x;
    ag.y = y;
    return play(ag.el, [{ transform: from }, { transform: `translate(${x}px,${y}px)` }], {
      duration: ms,
      easing: EASE,
      fill: 'forwards',
    });
  };

  // agents start bunched in the middle of the screen, then fan out
  const cx = scrollX + innerWidth / 2;
  const cy = scrollY + innerHeight / 2;
  const n = Math.min(AGENTS.length, Math.max(3, Math.ceil(todo.length / 3)));
  const agents: Agent[] = AGENTS.slice(0, n).map((name) => {
    const el = document.createElement('div');
    el.innerHTML = `${ARROW}<span style="margin:14px 0 0 -4px;padding:3px 8px;border-radius:999px;background:var(--color-ink);color:var(--color-white);font:600 11px/1 var(--font-sans)">${name}</span>`;
    Object.assign(el.style, { position: 'absolute', left: '0', top: '0', display: 'flex' });
    el.style.transform = `translate(${cx}px,${cy}px)`;
    layer.append(el);
    return { el, x: cx, y: cy };
  });
  await Promise.all(
    agents.map((ag, i) => {
      const a = (i / n) * Math.PI * 2;
      return move(ag, cx + Math.cos(a) * 140, cy + Math.sin(a) * 90, 600);
    }),
  );

  const build = async (ag: Agent, el: HTMLElement) => {
    const b = boxOf(el);
    await move(ag, b.x, b.y, 280 + Math.random() * 320);
    if (signal.aborted) return;

    const sel = document.createElement('div');
    Object.assign(sel.style, {
      position: 'absolute',
      left: `${b.x}px`,
      top: `${b.y}px`,
      border: '1.5px solid var(--color-red)',
      background: 'color-mix(in srgb, var(--color-panel) 75%, transparent)',
    });
    const badge = document.createElement('span');
    badge.textContent = `${Math.round(b.w)} × ${Math.round(b.h)}`;
    Object.assign(badge.style, {
      position: 'absolute',
      left: '50%',
      top: '100%',
      translate: '-50% 6px',
      padding: '2px 6px',
      borderRadius: '4px',
      background: 'var(--color-red)',
      color: '#fff',
      font: '600 10px/1.2 var(--font-mono)',
      whiteSpace: 'nowrap',
    });
    sel.append(badge);
    layer.append(sel);

    const drag = Math.min(650, 250 + Math.sqrt(b.w * b.h) / 2);
    await Promise.all([
      play(
        sel,
        [
          { width: '0px', height: '0px' },
          { width: `${b.w}px`, height: `${b.h}px` },
        ],
        {
          duration: drag,
          easing: EASE,
          fill: 'forwards',
        },
      ),
      move(ag, b.x + b.w, b.y + b.h, drag),
    ]);
    if (signal.aborted) return;

    el.style.visibility = 'visible';
    const text = isText(el);
    const chars = (el.textContent ?? '').trim().length;
    const dur = text ? Math.min(900, 150 + chars * 30) : 380;
    await Promise.all([
      play(
        el,
        text
          ? [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }]
          : [
              { clipPath: 'inset(0 0 100% 0)', opacity: 0.3 },
              { clipPath: 'inset(0 0 0 0)', opacity: 1 },
            ],
        { duration: dur, easing: text ? `steps(${Math.min(32, Math.max(4, chars))})` : 'ease-out' },
      ),
      play(sel, [{ opacity: 1 }, { opacity: 0 }], { duration: dur + 150, fill: 'forwards' }),
    ]);
    sel.remove();
  };

  // each agent keeps taking the next block until the queue is empty
  const queue = [...todo];
  await Promise.all(
    agents.map(async (ag) => {
      for (let el = queue.shift(); el && !signal.aborted; el = queue.shift()) await build(ag, el);
    }),
  );
  if (signal.aborted) return;

  // finale: the swarm scatters off the edges
  await Promise.all(
    agents.map((ag) =>
      Promise.all([
        move(ag, ag.x + (ag.x - cx) * 2, ag.y - innerHeight, 700),
        play(ag.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' }),
      ]),
    ),
  );
  cleanup();
}
