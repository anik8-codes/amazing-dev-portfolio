/**
 * Player input: WASD / arrows, Shift to run, Space to jump, E or Enter to interact, plus a
 * virtual stick and buttons that the touch overlay drives through `setStick` / `press`.
 */
export function createInput(signal: AbortSignal) {
  const keys = new Set<string>();
  const stick = { x: 0, y: 0 };
  let jumpQueued = false;
  let interactQueued = false;

  const map: Record<string, string> = {
    KeyW: 'up',
    ArrowUp: 'up',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
    ShiftLeft: 'run',
    ShiftRight: 'run',
  };
  const typing = (e: KeyboardEvent) =>
    e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);

  addEventListener(
    'keydown',
    (e) => {
      if (typing(e) || e.metaKey || e.ctrlKey) return;
      const k = map[e.code];
      if (k) {
        keys.add(k);
        if (k !== 'run') e.preventDefault();
      }
      if (e.code === 'Space') {
        jumpQueued = true;
        e.preventDefault();
      }
      if (e.code === 'KeyE' || e.code === 'Enter') interactQueued = true;
    },
    { signal },
  );
  addEventListener('keyup', (e) => keys.delete(map[e.code] ?? ''), { signal });
  addEventListener('blur', () => keys.clear(), { signal });

  return {
    /** Movement in screen terms: x right, y up, length ≤ 1. */
    move() {
      let x = stick.x + (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      let y = stick.y + (keys.has('up') ? 1 : 0) - (keys.has('down') ? 1 : 0);
      const l = Math.hypot(x, y);
      if (l > 1) {
        x /= l;
        y /= l;
      }
      return { x, y };
    },
    get running() {
      return keys.has('run') || Math.hypot(stick.x, stick.y) > 0.92;
    },
    takeJump() {
      const j = jumpQueued;
      jumpQueued = false;
      return j;
    },
    takeInteract() {
      const i = interactQueued;
      interactQueued = false;
      return i;
    },
    setStick(x: number, y: number) {
      stick.x = x;
      stick.y = y;
    },
    press(button: 'jump' | 'interact') {
      if (button === 'jump') jumpQueued = true;
      else interactQueued = true;
    },
  };
}

export type Input = ReturnType<typeof createInput>;
