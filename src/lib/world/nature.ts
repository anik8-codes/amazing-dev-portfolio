import * as THREE from 'three/webgpu';
import {
  Fn,
  atan,
  attribute,
  cameraPosition,
  float,
  mix,
  mod,
  positionWorld,
  rangeFogFactor,
  sin,
  texture,
  time,
  uniform,
  uv,
  vec2,
  vec3,
  vertexIndex,
} from 'three/tsl';
import { type Vec2, groundHeight, sandiness, seeded } from './layout';
import { look, palette, sky, toon } from './look';

const col = (c: THREE.Color) => vec3(c.r, c.g, c.b);

/**
 * Where grass grows, as a texture over the whole map (R: 1 = grass, 0 = sand / plazas / sea).
 * The same numbers colour the ground, so blades and ground always agree.
 */
export function grassMask(radius: number, clearings: readonly { at: Vec2; radius: number }[]) {
  const size = 256;
  const extent = radius + 24; // half-width in metres
  const data = new Uint8Array(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = ((i + 0.5) / size - 0.5) * extent * 2;
      const z = ((j + 0.5) / size - 0.5) * extent * 2;
      let g = 1 - sandiness(x, z, radius) * 1.6;
      for (const c of clearings) {
        const d = Math.hypot(x - c.at[0], z - c.at[1]) / c.radius;
        g = Math.min(g, Math.max(0, d * 1.6 - 0.9));
      }
      const k = (j * size + i) * 4;
      data[k] = Math.round(Math.max(0, Math.min(1, g)) * 255);
      data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  const toUv = (xz: THREE.Node<'vec2'>) => xz.div(extent * 2).add(0.5);
  return { tex, toUv, extent };
}

type Mask = ReturnType<typeof grassMask>;

/** The island: a big subdivided plane pushed down at the coast, grass → sand by the mask. */
export function createGround(radius: number, mask: Mask) {
  const size = mask.extent * 2;
  const geo = new THREE.PlaneGeometry(size, size, 220, 220);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) pos.setY(i, groundHeight(pos.getX(i), pos.getZ(i), radius));
  geo.computeVertexNormals();

  const grassAmount = texture(mask.tex, mask.toUv(positionWorld.xz)).r;
  const patches = sin(positionWorld.x.mul(0.21))
    .mul(sin(positionWorld.z.mul(0.17)))
    .mul(0.5)
    .add(0.5);
  const grass = mix(col(palette.grassDark), col(palette.grass), patches.mul(0.6).add(0.2));
  const material = toon({ colorNode: mix(col(palette.sand), grass, grassAmount), bounce: false });
  const mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true;
  return mesh;
}

/** Sea: deep → shallow by distance to the coast, with foam lines rolling in. */
export function createWater(radius: number) {
  const geo = new THREE.PlaneGeometry(900, 900);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = Fn(() => {
    const p = positionWorld.xz;
    const a = atan(p.y, p.x);
    const shore = float(radius)
      .add(sin(a.mul(3)).mul(3))
      .add(sin(a.mul(5).add(1)).mul(2))
      .add(sin(a.mul(9).add(2)));
    const d = p.length().sub(shore); // metres past the coastline
    const shallow = d.sub(2).div(30).clamp(0, 1);
    const base = mix(col(palette.water), col(palette.waterDeep), shallow).toVar();
    // foam: bands that move toward the beach and fade out at sea
    const band = sin(d.mul(1.3).add(time.mul(1.6)))
      .mul(0.5)
      .add(0.5);
    const foam = band.step(0.92).mul(d.sub(-1).div(14).oneMinus().clamp(0, 1));
    const edge = d.add(3.5).div(2.5).oneMinus().clamp(0, 1); // white line on the sand
    base.assign(mix(base, vec3(1, 1, 1), foam.max(edge).mul(0.85)));
    return mix(base, sky, rangeFogFactor(look.fogNear, look.fogFar));
  })();
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = -0.55;
  return mesh;
}

/**
 * Grass: one triangle per blade on a grid that wraps around the focus point, so it never ends.
 * Each blade turns to the camera, sways in the wind and is darker at the root.
 */
export function createGrass(mask: Mask) {
  const per = 230;
  const span = 52;
  const count = per * per;
  const rand = seeded(42);
  const position = new Float32Array(count * 3 * 2);
  const random = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = ((i % per) / per - 0.5) * span + (rand() - 0.5) * (span / per);
    const z = (Math.floor(i / per) / per - 0.5) * span + (rand() - 0.5) * (span / per);
    const r = rand();
    for (let v = 0; v < 3; v++) {
      position[i * 6 + v * 2] = x;
      position[i * 6 + v * 2 + 1] = z;
      random[i * 3 + v] = r;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 2));
  geo.setAttribute('random', new THREE.BufferAttribute(random, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);

  const center = uniform(new THREE.Vector2());
  const corner = vertexIndex.mod(3);
  const tip = corner.equal(0).select(float(1), float(0));
  const amount = float(0).toVar();

  const material = toon({
    colorNode: mix(col(palette.grassDark), col(palette.grass).mul(1.15), tip),
    normal: vec3(0, 1, 0),
    shade: tip.oneMinus().mul(0.5),
    bounce: false,
    side: THREE.DoubleSide,
  });
  material.positionNode = Fn(() => {
    const p = attribute<'vec2'>('position', 'vec2');
    const half = span / 2;
    // wrap the blade into the square around the focus point
    const rel = mod(p.sub(center).add(half), span).sub(half);
    const world = rel.add(center);
    amount.assign(texture(mask.tex, mask.toUv(world)).r);
    const h = attribute<'float'>('random', 'float').mul(0.45).add(0.4).mul(amount).mul(0.6);
    // triangle: tip (0,1), left (-1,0), right (1,0), facing the camera
    const side = corner.equal(1).select(float(-1), corner.equal(2).select(float(1), float(0)));
    const angle = atan(world.y.sub(cameraPosition.z), world.x.sub(cameraPosition.x));
    const w = amount.mul(0.075);
    const offset = vec2(angle.sin().negate(), angle.cos()).mul(side.mul(w));
    const sway = sin(time.mul(1.8).add(world.x.mul(0.35)).add(world.y.mul(0.22)))
      .mul(0.5)
      .add(0.6)
      .mul(tip)
      .mul(h)
      .mul(0.35);
    return vec3(
      world.x.add(offset.x).add(sway),
      tip.mul(h),
      world.y.add(offset.y).add(sway.mul(0.4)),
    );
  })();
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  mesh.receiveShadow = true;
  return {
    mesh,
    follow(focus: THREE.Vector3) {
      center.value.set(focus.x, focus.z);
    },
  };
}

/** A soft round leaf blob, drawn once (alpha in red). */
function leafTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const rand = seeded(9);
  g.fillStyle = '#fff';
  for (let i = 0; i < 9; i++) {
    g.beginPath();
    g.ellipse(14 + rand() * 36, 14 + rand() * 36, 9 + rand() * 6, 6 + rand() * 4, rand() * 3, 0, 7);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/**
 * Bushes: each is ~40 leaf cards scattered over a sphere, with normals pointing out from the
 * centre so the whole clump shades like one soft ball. One instanced mesh for all of them.
 */
export function createBushes(points: readonly Vec2[], seed = 1) {
  const rand = seeded(seed);
  const cards: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 40; i++) {
    const plane = new THREE.PlaneGeometry(0.9, 0.9);
    plane.rotateZ(rand() * 7);
    plane.rotateY(rand() * 7);
    plane.rotateX(rand() * 7);
    const dir = new THREE.Vector3(rand() - 0.5, rand() * 0.8 - 0.2, rand() - 0.5).normalize();
    plane.translate(dir.x * 0.8, dir.y * 0.8 + 0.6, dir.z * 0.8);
    const n = plane.attributes.normal!;
    const p = plane.attributes.position!;
    for (let v = 0; v < n.count; v++) {
      const out = new THREE.Vector3(p.getX(v), p.getY(v) - 0.6, p.getZ(v)).normalize();
      n.setXYZ(v, out.x, out.y, out.z);
    }
    cards.push(plane);
  }
  const geo = mergeGeometries(cards);
  const material = toon({
    colorNode: mix(col(palette.grassDark), col(palette.leaves), uv().y.mul(0.4).add(0.5)),
    alpha: texture(leafTexture(), uv()).r,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.InstancedMesh(geo, material, points.length);
  const m = new THREE.Matrix4();
  points.forEach(([x, z], i) => {
    const s = 1 + rand() * 1.1;
    m.compose(
      new THREE.Vector3(x, 0, z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * 7),
      new THREE.Vector3(s, s * (0.8 + rand() * 0.3), s),
    );
    mesh.setMatrixAt(i, m);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Merge plain geometries with the same attributes (positions, normals, uvs). */
function mergeGeometries(list: THREE.BufferGeometry[]) {
  const out = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'uv'] as const) {
    const size = list[0]!.attributes[name]!.itemSize;
    const total = list.reduce((n, g) => n + g.attributes[name]!.count, 0);
    const arr = new Float32Array(total * size);
    let o = 0;
    for (const g of list) {
      arr.set(g.attributes[name]!.array as Float32Array, o);
      o += g.attributes[name]!.count * size;
    }
    out.setAttribute(name, new THREE.BufferAttribute(arr, size));
  }
  const idx: number[] = [];
  let base = 0;
  for (const g of list) {
    for (const i of g.index!.array) idx.push(i + base);
    base += g.attributes.position!.count;
  }
  out.setIndex(idx);
  return out;
}
