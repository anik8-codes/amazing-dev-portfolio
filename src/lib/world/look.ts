import * as THREE from 'three/webgpu';
import {
  Fn,
  color,
  float,
  max,
  mix,
  normalWorld,
  positionWorld,
  rangeFogFactor,
  texture,
  uniform,
  vec3,
  vec4,
  viewportUV,
} from 'three/tsl';

/*
 * The world's look, in one place. Every surface uses `toon()`: flat colour, a soft shadow band
 * that tints toward violet instead of going grey, cast shadows in the same tint, a little bounce
 * light from the grass under things, and distance fog that fades into the sky gradient.
 */

export const palette = {
  light: new THREE.Color('#fff0e0'),
  shadow: new THREE.Color('#7b5cff'),
  bounce: new THREE.Color('#9ccf4a'),
  skyTop: new THREE.Color('#9fdcff'),
  skyEdge: new THREE.Color('#d4c6ff'),
  water: new THREE.Color('#43b6e8'),
  waterDeep: new THREE.Color('#2a7fd4'),
  grass: new THREE.Color('#8dc63f'),
  grassDark: new THREE.Color('#4f9a2b'),
  sand: new THREE.Color('#f3d9a4'),
  leaves: new THREE.Color('#5fb63c'),
};

/** A colour as a vec3 uniform (linear RGB), so it multiplies cleanly with other vec3 nodes. */
const rgb = (c: THREE.Color) => uniform(new THREE.Vector3(c.r, c.g, c.b));

/** Shared uniforms (the light direction follows the sun object in the engine). */
export const look = {
  lightDir: uniform(new THREE.Vector3(-0.5, 0.8, 0.35).normalize()),
  lightColor: rgb(palette.light),
  lightIntensity: uniform(1.15),
  shadowColor: rgb(palette.shadow),
  shadowStrength: uniform(0.55),
  bounceColor: rgb(palette.bounce),
  fogNear: uniform(45),
  fogFar: uniform(110),
};

/** Screen-space sky: the same gradient is the background and the fog colour, so the horizon melts. */
export const sky = mix(
  color(palette.skyTop),
  color(palette.skyEdge),
  viewportUV.y.oneMinus().mul(1.2).clamp(0, 1),
);

type Vec3Node = THREE.Node<'vec3'>;
type FloatNode = THREE.Node<'float'>;

interface ToonOptions {
  /** Base colour: a node (vertex colours, gradients), a texture (Kenney colormap) or a flat colour. */
  colorNode?: Vec3Node;
  map?: THREE.Texture | null;
  /** Cut-out alpha (leaves); fragments below 0.5 are discarded. */
  alpha?: FloatNode;
  base?: THREE.Color;
  /** Extra darkening 0–1 (e.g. grass roots). */
  shade?: FloatNode;
  /** Override the normal (grass blades use straight up). */
  normal?: Vec3Node;
  side?: THREE.Side;
  bounce?: boolean;
}

/** The world material. */
export function toon({
  colorNode,
  alpha,
  map,
  base,
  shade,
  normal,
  side,
  bounce = true,
}: ToonOptions = {}): THREE.MeshLambertNodeMaterial {
  const material = new THREE.MeshLambertNodeMaterial();
  material.side = side ?? THREE.FrontSide;

  // catch the shadow-map term as a number and apply it ourselves (tinted, not grey)
  const caught = float(1).toVar();
  // (typed as `() => Node`, but three calls it with the shadow term)
  material.receivedShadowNode = Fn(([shadow]: [ReturnType<typeof vec4>]) => {
    caught.mulAssign(shadow.r);
    return float(1);
  }) as unknown as () => THREE.Node;

  material.outputNode = Fn(() => {
    const b = base ?? palette.grass;
    const baseColor = (colorNode ?? (map ? texture(map).rgb : vec3(b.r, b.g, b.b))).toVar();
    const n = (normal ?? normalWorld).toVar();
    const lit = baseColor.mul(look.lightColor).mul(look.lightIntensity).toVar();

    if (bounce) {
      // faces pointing down, close to the ground, pick up the grass colour
      const down = n.y.negate().clamp(0, 1);
      const near = float(1.5).sub(positionWorld.y.max(0)).div(1.5).clamp(0, 1);
      lit.assign(mix(lit, look.bounceColor.mul(baseColor).mul(1.6), down.mul(near).mul(0.5)));
    }

    // core shadow: a soft band as faces turn away from the sun
    const core = n.dot(look.lightDir).smoothstep(0.35, -0.2);
    const cast = caught.oneMinus();
    let amount = max(core, cast);
    if (shade) amount = max(amount, shade);
    const shadowed = baseColor.mul(look.shadowColor).mul(1.1);
    lit.assign(mix(lit, shadowed, amount.clamp(0, 1).mul(look.shadowStrength)));

    // distance fog into the sky
    if (alpha) alpha.lessThan(0.5).discard();
    const fog = rangeFogFactor(look.fogNear, look.fogFar);
    return vec4(mix(lit, sky, fog), 1);
  })();
  return material;
}

/** Swap every material in a loaded model for `toon()`, keeping its colormap. */
export function toonify(
  root: THREE.Object3D,
  cache = new Map<THREE.Texture | null, THREE.Material>(),
) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const old = mesh.material as THREE.MeshStandardMaterial;
    const map = old.map ?? null;
    if (map) map.colorSpace = THREE.SRGBColorSpace;
    let m = cache.get(map);
    if (!m) {
      m = toon({ map, base: old.color?.clone() });
      cache.set(map, m);
    }
    mesh.material = m;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

/** Sun: a directional light whose shadow box follows the camera's focus point. */
export function createSun(scene: THREE.Scene) {
  const sun = new THREE.DirectionalLight('#ffffff', 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = sun.shadow.camera;
  s.left = s.bottom = -34;
  s.right = s.top = 34;
  s.near = 1;
  s.far = 120;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.05;
  scene.add(sun, sun.target);
  const offset = new THREE.Vector3().copy(look.lightDir.value).multiplyScalar(50);
  return {
    follow(focus: THREE.Vector3) {
      sun.position.copy(focus).add(offset);
      sun.target.position.copy(focus);
    },
  };
}
