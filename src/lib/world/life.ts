import * as THREE from 'three/webgpu';
import { color, mix, rangeFogFactor, texture, vec4 } from 'three/tsl';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import type { Outfit } from './avatar-model';
import { createCharacter } from './character';
import { type Vec2, damp, seeded, turn } from './layout';
import { look, sky, toon } from './look';

/** Clouds drifting slowly across the sky, wrapping round the island. */
export function createClouds(
  gltf: GLTF,
  count: number,
  scale: readonly [number, number],
  seed: number,
) {
  const rand = seeded(seed);
  const group = new THREE.Group();
  const clouds = Array.from({ length: count }, () => {
    const c = gltf.scene.clone();
    const s = scale[0] + rand() * (scale[1] - scale[0]);
    c.scale.set(s, s * 0.6, s);
    // high enough to stay out of the camera's way; their shadows still drift over the island
    c.position.set((rand() - 0.5) * 160, 40 + rand() * 8, (rand() - 0.5) * 160);
    c.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    group.add(c);
    return { c, speed: 0.6 + rand() * 0.8 };
  });
  return {
    group,
    update(dt: number) {
      for (const { c, speed } of clouds) {
        c.position.x += speed * dt;
        if (c.position.x > 90) c.position.x = -90;
      }
    },
  };
}

/** Coins to collect: they spin and bob; walk through one and it's yours. */
export function createCoins(
  gltf: GLTF,
  points: readonly Vec2[],
  scale: number,
  onCollect: (n: number) => void,
) {
  const group = new THREE.Group();
  const coins = points.map(([x, z], i) => {
    const c = gltf.scene.clone();
    c.scale.setScalar(scale);
    c.position.set(x, 1, z);
    c.rotation.y = i;
    group.add(c);
    return { c, taken: false, t: i };
  });
  let got = 0;
  return {
    group,
    update(dt: number, player: THREE.Vector3) {
      for (const coin of coins) {
        if (coin.taken) continue;
        coin.t += dt;
        coin.c.rotation.y += dt * 2.5;
        coin.c.position.y = 1 + Math.sin(coin.t * 2) * 0.2;
        if (Math.hypot(player.x - coin.c.position.x, player.z - coin.c.position.z) < 1.4) {
          coin.taken = true;
          coin.c.visible = false;
          onCollect(++got);
        }
      }
    },
  };
}

/**
 * Villagers wear the other brand looks and stroll between places with their own pace.
 */
export function createVillagers(scale: number, count: number, spots: readonly Vec2[]) {
  const rand = seeded(77);
  const outfits: readonly Outfit[] = [
    'hoodie',
    'creator',
    'traveler',
    'hackathon',
    'formal',
    'builder',
    'gamer',
  ];
  const group = new THREE.Group();
  const people = Array.from({ length: count }, (_, i) => {
    const avatar = createCharacter(
      outfits[i % outfits.length]!,
      scale * (0.85 + rand() * 0.2),
      (i * 0.618) % 1,
    );
    const home = spots[Math.floor(rand() * spots.length)]!;
    avatar.root.position.set(home[0] + (rand() - 0.5) * 8, 0, home[1] + (rand() - 0.5) * 8);
    group.add(avatar.root);
    return {
      avatar,
      goal: null as Vec2 | null,
      wait: rand() * 4,
      heading: 0,
      pace: 1.65 + (i % 4) * 0.2,
      speed: 0,
    };
  });
  return {
    group,
    dispose() {
      for (const { avatar } of people) avatar.dispose();
    },
    update(dt: number) {
      for (const p of people) {
        const { root, update } = p.avatar;
        p.wait -= dt;
        if (!p.goal && p.wait <= 0) {
          const s = spots[Math.floor(rand() * spots.length)]!;
          p.goal = [s[0] + (rand() - 0.5) * 10, s[1] + (rand() - 0.5) * 10];
        }
        let distance = 0;
        if (p.goal) {
          const dx = p.goal[0] - root.position.x;
          const dz = p.goal[1] - root.position.z;
          const d = Math.hypot(dx, dz);
          if (d < 0.15) {
            p.goal = null;
            p.speed = 0;
            p.wait = 2 + rand() * 6;
          } else {
            p.speed = damp(p.speed, Math.min(p.pace, d * 2.5), 6, dt);
            distance = Math.min(d, p.speed * dt);
            root.position.x += (dx / d) * distance;
            root.position.z += (dz / d) * distance;
            p.heading += turn(p.heading, Math.atan2(dx, dz)) * Math.min(1, dt * 6);
            root.rotation.y = p.heading;
          }
        }
        update(dt, distance);
      }
    },
  };
}

/** A flock of birds circling over the island, flapping as they go. */
export function createBirds(count: number) {
  const rand = seeded(31);
  const wing = new THREE.BufferGeometry();
  wing.setAttribute(
    'position',
    new THREE.BufferAttribute(
      new Float32Array([
        0, 0, -0.18, 0.53, 0.05, -0.3, 1, 0, -0.52, 0, 0, -0.18, 1, 0, -0.52, 0.52, 0.02, 0.08, 0,
        0, -0.18, 0.52, 0.02, 0.08, 0, 0, 0.19,
      ]),
      3,
    ),
  );
  wing.computeVertexNormals();
  const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  material.colorNode = vec4(
    mix(color('#352e2a'), sky, rangeFogFactor(look.fogNear, look.fogFar).mul(0.7)),
    1,
  );
  const group = new THREE.Group();
  const bodyGeo = new THREE.SphereGeometry(0.19, 7, 5);
  bodyGeo.scale(0.72, 0.55, 2.35);
  const birds = Array.from({ length: count }, () => {
    const bird = new THREE.Group();
    const left = new THREE.Mesh(wing, material);
    const right = new THREE.Mesh(wing, material);
    right.scale.x = -1;
    bird.add(left, right, new THREE.Mesh(bodyGeo, material));
    bird.scale.setScalar(0.5 + rand() * 0.3);
    group.add(bird);
    return {
      bird,
      left,
      right,
      r: 18 + rand() * 30,
      h: 12 + rand() * 9,
      a: rand() * Math.PI * 2,
      speed: (0.12 + rand() * 0.1) * (rand() > 0.3 ? 1 : -1),
      flap: rand() * 10,
      cx: (rand() - 0.5) * 30,
      cz: (rand() - 0.5) * 30,
    };
  });
  return {
    group,
    update(dt: number) {
      for (const b of birds) {
        b.a += b.speed * dt;
        b.flap += dt * 9;
        const x = b.cx + Math.cos(b.a) * b.r;
        const z = b.cz + Math.sin(b.a) * b.r;
        b.bird.position.set(x, b.h + Math.sin(b.flap * 0.15) * 0.8, z);
        b.bird.rotation.y = -b.a + (b.speed > 0 ? 0 : Math.PI);
        b.bird.rotation.z = -b.speed * 1.2;
        const w = Math.sin(b.flap) * 0.7;
        b.left.rotation.z = w;
        b.right.rotation.z = -w;
      }
    },
  };
}

/** A floating sign (canvas text on a sprite) above a place. */
export function createSign(lines: readonly [string, string], at: Vec2, height: number) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  const font = getComputedStyle(document.body).fontFamily || 'sans-serif';
  c.width = 512;
  c.height = 160;
  g.fillStyle = 'rgba(255,255,255,0.94)';
  g.beginPath();
  g.roundRect(8, 8, 496, 144, 36);
  g.fill();
  g.strokeStyle = '#1d1630';
  g.lineWidth = 6;
  g.stroke();
  g.textAlign = 'center';
  g.fillStyle = '#d62828';
  g.font = `800 34px ${font}`;
  g.fillText(lines[0], 256, 64);
  g.fillStyle = '#1d1630';
  g.font = `800 42px ${font}`;
  g.fillText(lines[1].length > 22 ? `${lines[1].slice(0, 21)}…` : lines[1], 256, 118);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false });
  material.colorNode = texture(tex);
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(6.4, 2, 1);
  sprite.position.set(at[0], height, at[1]);
  return {
    sprite,
    update(t: number, near: boolean) {
      sprite.position.y = height + Math.sin(t * 1.5 + at[0]) * 0.15;
      const s = damp(sprite.scale.x, near ? 7.6 : 6.4, 8, 1 / 60);
      sprite.scale.set(s, s / 3.2, 1);
    },
  };
}

/** Story markers: small orange diamonds that float and spin; the nearest one within reach counts. */
export function createMarkers(points: readonly Vec2[]) {
  const geo = new THREE.OctahedronGeometry(0.45);
  const material = toon({ base: new THREE.Color('#ff7a1a'), bounce: false });
  const group = new THREE.Group();
  const meshes = points.map(([x, z]) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, 1.6, z);
    m.scale.y = 1.5;
    m.castShadow = true;
    group.add(m);
    return m;
  });
  return {
    group,
    /** Animate, and return the index of the marker the player is next to (or -1). */
    update(t: number, player: THREE.Vector3) {
      let near = -1;
      let best = 2.6;
      meshes.forEach((m, i) => {
        m.rotation.y = t * 1.6 + i;
        m.position.y = 1.6 + Math.sin(t * 2 + i) * 0.18;
        const d = Math.hypot(player.x - m.position.x, player.z - m.position.z);
        if (d < best) {
          best = d;
          near = i;
        }
      });
      return near;
    },
  };
}
