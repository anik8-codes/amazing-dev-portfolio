/**
 * Adapted from Henry Heffernan's portfolio-website (MIT, Copyright 2024 Henry Heffernan).
 * Original BakedModel, CameraKeyframes and MonitorScreen geometry; see public/office/LICENSE.txt.
 * Ported to current Three.js with local resume content, on-demand rendering and disposal.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { office } from '@/config/office';

export type OfficeView = 'desk' | 'monitor' | 'room';
export interface OfficeHandle {
  setView: (view: OfficeView) => void;
  dispose: () => void;
}

export async function createOffice(
  host: HTMLElement,
  signal: AbortSignal,
  progress: (loaded: number) => void,
): Promise<OfficeHandle> {
  const scene = new THREE.Scene();
  const cssScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 10, 900000);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;touch-action:none';
  host.append(renderer.domElement);

  const css = new CSS3DRenderer();
  css.domElement.style.cssText =
    'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden';
  host.append(css.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 500, 0);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minDistance = 1800;
  controls.maxDistance = 45000;
  controls.minPolarAngle = Math.PI / 5;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minAzimuthAngle = -Math.PI / 2.5;
  controls.maxAzimuthAngle = Math.PI / 2.5;

  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  let disposed = false;
  let ready = false;
  let frame = 0;
  let transitioning = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targetPos = new THREE.Vector3();
  const targetLook = new THREE.Vector3();
  let previousTime = 0;

  function render() {
    if (disposed || document.hidden) return;
    renderer.render(scene, camera);
    css.render(cssScene, camera);
  }
  function animate(time: number) {
    if (disposed || document.hidden) return;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0.016;
    previousTime = time;
    const alpha = reduced.matches ? 1 : 1 - Math.exp(-8 * delta);
    camera.position.lerp(targetPos, alpha);
    controls.target.lerp(targetLook, alpha);
    controls.update();
    render();
    if (
      camera.position.distanceTo(targetPos) > 0.5 ||
      controls.target.distanceTo(targetLook) > 0.5
    ) {
      frame = requestAnimationFrame(animate);
    } else {
      transitioning = false;
      controls.enabled = true;
      previousTime = 0;
    }
  }
  function setView(view: OfficeView) {
    cancelAnimationFrame(frame);
    // Henry's original positions, with the original responsive monitor adjustment.
    if (view === 'monitor') {
      targetPos.set(
        0,
        950,
        2000 +
          (host.clientHeight / Math.max(host.clientWidth, 1)) * 1200 -
          (host.clientWidth < 768 ? 0 : 600),
      );
      targetLook.set(0, 950, 0);
    } else if (view === 'room') {
      targetPos.set(-20000, 12000, 20000);
      targetLook.set(0, -1000, 0);
    } else {
      targetPos.set(
        0,
        1800,
        5500 + Math.max(0, host.clientHeight / Math.max(host.clientWidth, 1) - 0.7) * 3500,
      );
      targetLook.set(0, 500, 0);
    }
    if (reduced.matches || !ready) {
      camera.position.copy(targetPos);
      controls.target.copy(targetLook);
      controls.update();
      render();
    } else {
      transitioning = true;
      controls.enabled = false;
      frame = requestAnimationFrame(animate);
    }
  }
  function resize() {
    if (disposed) return;
    const { clientWidth: width, clientHeight: height } = host;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    css.setSize(width, height);
    render();
  }
  function visibility() {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (transitioning) {
      previousTime = 0;
      frame = requestAnimationFrame(animate);
    } else render();
  }
  controls.addEventListener('change', render);
  document.addEventListener('visibilitychange', visibility);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    signal.removeEventListener('abort', dispose);
    controls.removeEventListener('change', render);
    controls.dispose();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    });
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    css.domElement.remove();
  }
  signal.addEventListener('abort', dispose, { once: true });
  if (signal.aborted) {
    dispose();
    throw new DOMException('Aborted', 'AbortError');
  }

  try {
    resize();
    setView('desk');
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    let loaded = 0;
    // allSettled ensures late-loading resources are disposed even when another asset fails.
    const results = await Promise.allSettled(
      office.assets.map(async (asset) => {
        const [modelResult, textureResult] = await Promise.allSettled([
          loader.loadAsync(asset.model),
          textureLoader.loadAsync(asset.texture),
        ]);
        const model = modelResult.status === 'fulfilled' ? modelResult.value : undefined;
        const texture = textureResult.status === 'fulfilled' ? textureResult.value : undefined;
        if (signal.aborted || !model || !texture) {
          texture?.dispose();
          model?.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              (Array.isArray(child.material) ? child.material : [child.material]).forEach(
                (m: THREE.Material) => m.dispose(),
              );
            }
          });
          throw new Error('Workspace asset failed to load');
        }
        // BakedModel.ts: preserve the original baked UVs, material and per-mesh 900× scale.
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture });
        textures.push(texture);
        materials.push(material);
        model.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            (Array.isArray(child.material) ? child.material : [child.material]).forEach(
              (m: THREE.Material) => m.dispose(),
            );
            child.scale.setScalar(900);
            child.material = material;
          }
        });
        scene.add(model.scene);
        progress(++loaded);
      }),
    );
    if (results.some((result) => result.status === 'rejected') || signal.aborted)
      throw new Error('Workspace unavailable');

    // MonitorScreen.ts: original 1280×1024 CSS screen and its exact physical transform.
    const screen = document.createElement('iframe');
    screen.src = office.screen.href;
    screen.title = office.screen.title;
    screen.style.cssText =
      'width:1280px;height:1024px;border:0;padding:32px;box-sizing:border-box;background:#1d2e2f;pointer-events:auto;color-scheme:light';
    const surface = new CSS3DObject(screen);
    surface.position.set(0, 950, 255);
    surface.rotation.set(-3 * THREE.MathUtils.DEG2RAD, 0, 0);
    cssScene.add(surface);
    // Original transparent NoBlending plane punches the monitor's window in the WebGL layer.
    const screenMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
      blending: THREE.NoBlending,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1280, 1024), screenMaterial);
    screenMesh.position.copy(surface.position);
    screenMesh.rotation.copy(surface.rotation);
    materials.push(screenMaterial);
    scene.add(screenMesh);
    // Keep the DOM desktop behind the WebGL canvas so room geometry occludes it correctly.
    css.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';
    host.style.pointerEvents = 'auto';
    // Orbit inputs go to the host; actual monitor inputs remain within its iframe.
    controls.disconnect();
    controls.connect(host);
    ready = true;
    render();
    return { setView, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
