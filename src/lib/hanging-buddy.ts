const DROP = 110;
const W = 90;
const STRETCH = 260;

/** Load the bungee physics only when its footer enters the viewport. */
export function animateHangingBuddy(el: HTMLElement) {
  const img = el.querySelector<HTMLElement>('[data-buddy-body]');
  const line = el.querySelector<SVGLineElement>('line');
  if (!el || !img || !line) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const p = { x: 0, y: 0 }; // offset from the rest position
  const v = { x: 0, y: 0 };
  const grab = { x: 0, y: 0 };
  let dragging = false;
  let last = performance.now();
  let frame = 0;
  let visible = false;

  const draw = (t: number) => {
    const dt = Math.min((t - last) / 1000, 1 / 30);
    last = t;
    if (!dragging) {
      const sway = Math.sin(t / 700) * 4;
      v.x += (180 * (sway - p.x) - 7 * v.x) * dt;
      v.y += (180 * -p.y - 7 * v.y) * dt;
      p.x += v.x * dt;
      p.y += v.y * dt;
    }
    const len = Math.hypot(p.x, DROP + p.y);
    const tilt = Math.atan2(-p.x, DROP + p.y);
    const strain = Math.min(1, Math.max(0, (len - STRETCH) / 120));
    img.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${tilt}rad)`;
    line.setAttribute('x2', String(W / 2 + p.x));
    line.setAttribute('y2', String(DROP + p.y));
    line.style.stroke = strain > 0 ? 'var(--color-red)' : '';
    line.setAttribute('stroke-width', String(2.5 - strain));
    frame = requestAnimationFrame(draw);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(draw);
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    sync();
  });
  observer.observe(el);
  document.addEventListener('visibilitychange', sync);

  const local = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left - W / 2, y: e.clientY - r.top - DROP - 40 };
  };
  const down = (e: PointerEvent) => {
    e.preventDefault();
    img.setPointerCapture(e.pointerId);
    const at = local(e);
    grab.x = p.x - at.x;
    grab.y = p.y - at.y;
    v.x = v.y = 0;
    dragging = true;
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const at = local(e);
    let x = at.x + grab.x;
    let y = at.y + grab.y;
    const d = Math.hypot(x, y);
    if (d > STRETCH) {
      const k = (STRETCH + (d - STRETCH) * 0.3) / d; // rubber band
      x *= k;
      y *= k;
    }
    const dt = Math.max((performance.now() - last) / 1000, 1 / 120);
    v.x = (x - p.x) / dt;
    v.y = (y - p.y) / dt;
    p.x = x;
    p.y = y;
  };
  const up = () => {
    dragging = false;
    v.x = Math.max(-1600, Math.min(1600, v.x));
    v.y = Math.max(-1600, Math.min(1600, v.y));
  };
  img.addEventListener('pointerdown', down);
  img.addEventListener('pointermove', move);
  img.addEventListener('pointerup', up);
  img.addEventListener('pointercancel', up);

  // every 8–16 s he bounces by himself
  let bounce = 0;
  const later = () => {
    bounce = window.setTimeout(
      () => {
        if (visible && !dragging && !document.hidden) v.y += 900;
        later();
      },
      8000 + Math.random() * 8000,
    );
  };
  later();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.clearTimeout(bounce);
    img.removeEventListener('pointerdown', down);
    img.removeEventListener('pointermove', move);
    img.removeEventListener('pointerup', up);
    img.removeEventListener('pointercancel', up);
  };
}
