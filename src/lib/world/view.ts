import * as THREE from 'three/webgpu';
import { damp } from './layout';

/**
 * Follow camera with ground-level perspective. Drag to orbit, scroll or pinch to zoom.
 */
export function createView(dom: HTMLElement, signal: AbortSignal) {
  const camera = new THREE.PerspectiveCamera(44, 1, 0.15, 420);
  let phi = 1.38;
  let theta = Math.PI * 0.25;
  const focus = new THREE.Vector3();
  const target = new THREE.Vector3();
  let zoom = 0.32;
  let zoomTarget = zoom;
  let speedPull = 0;

  // screen directions on the ground plane (used for camera-relative movement and panning)
  const forward = new THREE.Vector3(-Math.sin(theta), 0, -Math.cos(theta));
  const right = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));

  const radius = () => THREE.MathUtils.lerp(6, 45, zoom * zoom) + speedPull;

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
      theta -= (e.clientX - last.x) * 0.007;
      phi = THREE.MathUtils.clamp(phi + (e.clientY - last.y) * 0.005, 0.55, 1.49);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      forward.set(-Math.sin(theta), 0, -Math.cos(theta));
      right.set(Math.cos(theta), 0, -Math.sin(theta));
    },
    { signal },
  );
  const up = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  dom.addEventListener('pointerup', up, { signal });
  dom.addEventListener('pointercancel', up, { signal });
  dom.addEventListener('lostpointercapture', up, { signal });
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
      target.set(p.x, Math.max(p.y, -1.6) + 1.1, p.z);
      focus.copy(target);
    },
    resize(w: number, h: number) {
      camera.aspect = w / h;
      camera.fov = w < h ? 55 : 44;
      camera.updateProjectionMatrix();
    },
    update(dt: number, player: THREE.Vector3, speed: number) {
      target.set(player.x, Math.max(player.y, -1.6) + 1.1, player.z);
      focus.x = damp(focus.x, target.x, 5, dt);
      focus.y = damp(focus.y, target.y, 6, dt);
      focus.z = damp(focus.z, target.z, 5, dt);
      zoom = damp(zoom, zoomTarget, 6, dt);
      speedPull = damp(speedPull, Math.min(speed, 12) * 0.2, 2, dt);
      offset.setFromSphericalCoords(radius(), phi, theta);
      camera.position.copy(focus).add(offset);
      camera.lookAt(focus);
    },
  };
}

export type View = ReturnType<typeof createView>;
