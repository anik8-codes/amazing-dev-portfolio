import * as THREE from 'three/webgpu';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { lore, places } from '@/config/lore';
import { world, type ModelPath, type Piece } from '@/config/world';
import { type Vec2, areaAt, pyramid, scatter, seeded } from './layout';
import { createInput } from './input';
import {
  createBirds,
  createClouds,
  createCoins,
  createMarkers,
  createSign,
  createVillagers,
} from './life';
import { createSun, look, sky, toonify } from './look';
import { createBushes, createGrass, createGround, createWater, grassMask } from './nature';
import { createPhysics } from './physics';
import { createPlayer } from './player';
import { createView } from './view';

export interface WorldEvents {
  onProgress(loaded: number, total: number): void;
  /** The area the player stepped into (a lore slug or 'desk'), or null when they leave. */
  onArea(id: string | null): void;
  onCoin(collected: number, total: number): void;
  /** The story marker the player is next to (index into `places`), or -1. */
  onPoi(index: number): void;
  /** E / Enter / the touch button, while standing in an area. */
  onInteract(id: string): void;
}

/**
 * The /play world (our own engine; techniques studied from Bruno Simon's folio-2025, MIT).
 * WebGPU with an automatic WebGL 2 fallback, Rapier physics, Kenney CC0 models.
 */
export async function createWorld(host: HTMLElement, signal: AbortSignal, events: WorldEvents) {
  const renderer = new THREE.WebGPURenderer({ antialias: true });
  await renderer.init();
  if (signal.aborted) {
    renderer.dispose();
    throw new DOMException('aborted', 'AbortError');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.backgroundNode = sky;
  scene.add(new THREE.AmbientLight('#ffffff', 0.4));
  const sun = createSun(scene);

  // ---- models
  const paths = new Set<ModelPath>([
    world.character.model,
    world.bricks.model,
    world.scatter.trees.model,
    world.scatter.coins.model,
    world.scatter.clouds.model,
    ...world.props.map((p) => p.model),
    ...world.areas.flatMap((a) => a.pieces.map((p) => p.model)),
  ]);
  const loader = new GLTFLoader();
  const models = new Map<ModelPath, GLTF>();
  let loaded = 0;
  events.onProgress(0, paths.size + 1);
  await Promise.all(
    [...paths].map(async (p) => {
      models.set(p, await loader.loadAsync(`/play/models/${p}.glb`));
      events.onProgress(++loaded, paths.size + 1);
    }),
  );
  const physics = await createPhysics(world.islandRadius);
  events.onProgress(++loaded, paths.size + 1);
  if (signal.aborted) {
    physics.dispose();
    renderer.dispose();
    throw new DOMException('aborted', 'AbortError');
  }

  // villagers copy the character's original materials, so build them before toonifying
  const character = models.get(world.character.model)!;
  const spots: Vec2[] = world.areas.map((a) => a.at);
  const villagers = createVillagers(character, world.character.scale, world.npcs, spots);
  const cache = new Map();
  for (const gltf of models.values()) toonify(gltf.scene, cache);

  // ---- ground, sea, grass
  const clearings = [
    ...world.areas.map((a) => ({ at: a.at, radius: a.radius * 0.9 })),
    { at: [0, 0] as Vec2, radius: 7 },
  ];
  const mask = grassMask(world.islandRadius, clearings);
  scene.add(createGround(world.islandRadius, mask), createWater(world.islandRadius));
  const grass = createGrass(mask);
  scene.add(grass.mesh);

  // ---- places
  const place = (p: Piece) => {
    const obj = models.get(p.model)!.scene.clone();
    obj.scale.setScalar(p.scale ?? 1);
    obj.rotation.y = (p.rot ?? 0) * Math.PI * 2;
    obj.position.set(p.at[0], 0, p.at[1]);
    scene.add(obj);
    obj.updateMatrixWorld(true);
    if (p.body === 'static') physics.addBox(new THREE.Box3().setFromObject(obj));
  };
  world.props.forEach(place);
  world.areas.forEach((a) => a.pieces.forEach(place));

  const chapters = new Map(lore.map((c) => [c.slug, c]));
  const signs = world.areas.map((a) => {
    const c = chapters.get(a.id);
    const s = createSign(c ? [c.year, c.title] : ['my setup', 'press E to go in'], a.at, 7.5);
    scene.add(s.sprite);
    return { id: a.id, ...s };
  });

  // ---- trees and bushes (instanced), clear of the places
  const avoid = [
    ...clearings.map((c) => ({ at: c.at, radius: c.radius + 3 })),
    { at: world.bricks.at, radius: 5 },
    ...world.props.map((p) => ({ at: p.at, radius: (p.scale ?? 1) * 4 })),
  ];
  const t = world.scatter.trees;
  const rand = seeded(t.seed);
  const treeAt = scatter(t.count, t.seed, world.islandRadius, avoid, 2);
  const matrices = treeAt.map(([x, z]) => {
    const s = t.scale[0] + rand() * (t.scale[1] - t.scale[0]);
    physics.addPost(x, z, 0.12 * s, 2 * s);
    return new THREE.Matrix4().compose(
      new THREE.Vector3(x, 0, z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * 7),
      new THREE.Vector3(s, s, s),
    );
  });
  scene.add(instanced(models.get(t.model)!.scene, matrices));
  scene.add(
    createBushes(
      scatter(world.scatter.bushes.count, world.scatter.bushes.seed, world.islandRadius, [
        ...avoid,
        ...treeAt.map((at) => ({ at, radius: 1 })),
      ]),
    ),
  );

  // ---- bricks to knock over
  const brick = models.get(world.bricks.model)!.scene;
  for (const [x, y, z] of pyramid(world.bricks.rows, world.bricks.size, world.bricks.at)) {
    const holder = new THREE.Group();
    const b = brick.clone();
    b.position.y = -world.bricks.size / 2; // model pivot is at its base
    holder.add(b);
    holder.position.set(x, y, z);
    scene.add(holder);
    const h = world.bricks.size / 2;
    physics.addDynamicBox(holder, [h, h, h]);
  }

  // ---- life
  const c = world.scatter.clouds;
  const clouds = createClouds(models.get(c.model)!, c.count, c.scale, c.seed);
  const coinSpots = scatter(
    world.scatter.coins.count,
    world.scatter.coins.seed,
    world.islandRadius,
    avoid,
  );
  const coins = createCoins(
    models.get(world.scatter.coins.model)!,
    coinSpots,
    world.scatter.coins.scale,
    (n) => events.onCoin(n, coinSpots.length),
  );
  const birds = createBirds(world.birds);
  const areaById = new Map<string, { at: Vec2 }>(world.areas.map((a) => [a.id, a]));
  const markers = createMarkers(
    places.map((p) => {
      const home = areaById.get(p.chapter)?.at ?? [0, 0];
      return [home[0] + p.at[0] * 0.9, home[1] + p.at[1] * 0.9] as Vec2;
    }),
  );
  scene.add(markers.group);
  scene.add(clouds.group, coins.group, birds.group, villagers.group);
  events.onCoin(0, coinSpots.length);

  // ---- player, camera, input
  const spawn = new THREE.Vector3(world.spawn[0], 0, world.spawn[1]);
  const player = createPlayer(character, world.character.scale, physics, spawn);
  scene.add(player.root);
  const input = createInput(signal);
  const view = createView(renderer.domElement, signal);
  view.jump(spawn);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h, false);
    view.resize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ---- loop
  let area: string | null = null;
  let poi = -1;
  let last = performance.now();
  let time = 0;
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    player.update(dt, input, view);
    physics.step(dt);
    view.update(dt, player.position, player.speed);
    sun.follow(view.focus);
    grass.follow(view.focus);
    // fog starts just past the focus point and ends well behind it, at any zoom
    look.fogNear.value = view.distance * 1.1;
    look.fogFar.value = view.distance * 3.2;
    clouds.update(dt);
    coins.update(dt, player.position);
    villagers.update(dt);
    birds.update(dt);

    const here = areaAt(world.areas, player.position.x, player.position.z)?.id ?? null;
    if (here !== area) {
      area = here;
      events.onArea(area);
    }
    for (const s of signs) s.update(time, s.id === area);
    const near = markers.update(time, player.position);
    if (near !== poi) {
      poi = near;
      events.onPoi(poi);
    }
    if (input.takeInteract() && area) events.onInteract(area);

    renderer.render(scene, view.camera);
  });

  signal.addEventListener(
    'abort',
    () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      physics.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
    { once: true },
  );

  return {
    setStick: input.setStick,
    press: input.press,
    /** Jump to an area (from the chapter list). */
    teleport(id: string) {
      const a = world.areas.find((x) => x.id === id);
      if (!a) return;
      // land on the edge of the place, on the side facing the island centre
      const d = Math.hypot(a.at[0], a.at[1]) || 1;
      const k = (a.radius * 0.75) / d;
      player.teleport(a.at[0] - a.at[0] * k, a.at[1] - a.at[1] * k);
      view.track();
    },
  };
}

export type WorldHandle = Awaited<ReturnType<typeof createWorld>>;

/** One InstancedMesh per sub-mesh of `src`, placed at every matrix. */
function instanced(src: THREE.Object3D, matrices: THREE.Matrix4[]) {
  const group = new THREE.Group();
  src.updateMatrixWorld(true);
  const m = new THREE.Matrix4();
  src.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const inst = new THREE.InstancedMesh(mesh.geometry, mesh.material, matrices.length);
    matrices.forEach((M, i) => inst.setMatrixAt(i, m.multiplyMatrices(M, mesh.matrixWorld)));
    inst.castShadow = true;
    inst.receiveShadow = true;
    group.add(inst);
  });
  return group;
}
