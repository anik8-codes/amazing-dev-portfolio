import * as THREE from 'three/webgpu';
import { damp } from './layout';

/**
 * Camera: a long lens (25°) at a fixed three-quarter angle, so the world reads like a diorama.
 * It eases after the player; drag anywhere to pan the map freely (the camera stays there until
 * you move again), scroll or pinch to zoom, and it pulls back a little when you run.
 */
export function createView(dom: HTMLElement, signal: AbortSignal) {
  const camera = new THREE.PerspectiveCamera(25, 1, 1, 400);
  const phi = Math.PI * 0.28; // from straight down
  const theta = Math.PI * 0.25; // around the island
  const focus = new THREE.Vector3();
  const target = new THREE.Vector3();
  let tracking = true;
  let zoom = 1; // 0 = close, 1 = far: starts wide and swoops in
  let zoomTarget = 0.52;
  let speedPull = 0;

  // screen directions on the ground plane (used for camera-relative movement and panning)
  const forward = new THREE.Vector3(-Math.sin(theta), 0, -Math.cos(theta));
  const right = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));

  const radius = () => THREE.MathUtils.lerp(16, 80, zoom * zoom) + speedPull;

  // drag to pan, wheel / pinch to zoom
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  dom.addEventListener(
    'pointerdown',
    (e) => {
      if ((e.target as HTMLElement).closest('[data-ui]')) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dom.setPointerCapture(e.pointerId);
    },
    { signal },
  );
  dom.addEventListener(
    'pointermove',
    (e) => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const before = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [c, d] = [...pointers.values()];
        const after = Math.hypot(c!.x - d!.x, c!.y - d!.y);
        if (pinch) zoomTarget = THREE.MathUtils.clamp(zoomTarget - (after - before) * 0.004, 0, 1);
        pinch = after;
        return;
      }
      const perPixel = (2 * radius() * Math.tan(THREE.MathUtils.degToRad(12.5))) / dom.clientHeight;
      const dx = (e.clientX - last.x) * perPixel;
      const dy = (e.clientY - last.y) * perPixel;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      tracking = false;
      target.addScaledVector(right, -dx).addScaledVector(forward, dy / Math.cos(phi));
    },
    { signal },
  );
  const up = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  dom.addEventListener('pointerup', up, { signal });
  dom.addEventListener('pointercancel', up, { signal });
  dom.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomTarget = THREE.MathUtils.clamp(zoomTarget + e.deltaY * 0.0008, 0, 1);
    },
    { signal, passive: false },
  );

  const offset = new THREE.Vector3();
  return {
    camera,
    focus,
    forward,
    right,
    /** How far the camera is from what it's looking at (fog scales with this). */
    get distance() {
      return radius();
    },
    /** Snap straight to a point (spawn). */
    jump(p: THREE.Vector3) {
      target.copy(p);
      focus.copy(p);
    },
    /** Follow the player again (called when they move). */
    track() {
      tracking = true;
    },
    resize(w: number, h: number) {
      camera.aspect = w / h;
      // narrow screens: step back so the same width of world stays in view
      camera.fov = w < h ? 34 : 25;
      camera.updateProjectionMatrix();
    },
    update(dt: number, player: THREE.Vector3, speed: number) {
      if (tracking) target.set(player.x, 0, player.z);
      focus.x = damp(focus.x, target.x, 5, dt);
      focus.z = damp(focus.z, target.z, 5, dt);
      zoom = damp(zoom, zoomTarget, 6, dt);
      speedPull = damp(speedPull, Math.min(speed, 12) * 0.6, 2, dt);
      offset.setFromSphericalCoords(radius(), phi, theta);
      camera.position.copy(focus).add(offset);
      camera.lookAt(focus.x, 0.6, focus.z);
    },
  };
}

export type View = ReturnType<typeof createView>;
