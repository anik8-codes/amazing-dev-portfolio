import * as THREE from 'three/webgpu';
import {
  Fn,
  cameraPosition,
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
} from 'three/tsl';

/*
 * Direct sunlight, cool shadows and the matching sky and fog. Terrain and vegetation share
 * these uniforms with the scene lights used by the imported glTF materials.
 */

export const palette = {
  light: new THREE.Color('#fff0e0'),
  shadow: new THREE.Color('#698098'),
  bounce: new THREE.Color('#8da35d'),
  skyTop: new THREE.Color('#559bd4'),
  skyEdge: new THREE.Color('#bed5df'),
  water: new THREE.Color('#407d80'),
  waterDeep: new THREE.Color('#254f68'),
  grass: new THREE.Color('#839755'),
  grassDark: new THREE.Color('#4c6237'),
  sand: new THREE.Color('#c9b395'),
  leaves: new THREE.Color('#69894d'),
};

/** A colour as a vec3 uniform (linear RGB), so it multiplies cleanly with other vec3 nodes. */
const rgb = (c: THREE.Color) => uniform(new THREE.Vector3(c.r, c.g, c.b));

/** Shared uniforms (the light direction follows the sun object in the engine). */
export const look = {
  focus: uniform(new THREE.Vector3()),
  lightDir: uniform(new THREE.Vector3()),
  lightColor: rgb(palette.light),
  lightIntensity: uniform(1.15),
  shadowColor: rgb(palette.shadow),
  shadowStrength: uniform(0.78),
  bounceColor: rgb(palette.bounce),
  fogNear: uniform(45),
  fogFar: uniform(110),
};

const zenith = rgb(palette.skyTop);
export const sky = rgb(palette.skyEdge);
const sunColor = rgb(new THREE.Color('#fff6dd'));
const day = new THREE.Vector3(-0.82, 0.85, -0.38).normalize();
const dusk = new THREE.Vector3(-0.82, 0.11, -0.58).normalize();
const duskSky = new THREE.Color('#465e8b');
const duskHorizon = new THREE.Color('#db9674');
const duskLight = new THREE.Color('#ffb579');
const duskShadow = new THREE.Color('#566883');
const dayDisk = new THREE.Color('#fff6dd');
const duskDisk = new THREE.Color('#ffca83');

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
  material.fog = false; // outputNode already blends with the horizon

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
    const core = n.dot(look.lightDir).smoothstep(-0.2, 0.65).oneMinus();
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

/** Keep glTF materials so each artifact retains its normals, roughness and metalness. */
export function enableModelShadows(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

/** Sun: a directional light whose shadow box follows the camera's focus point. */
export function createSun(scene: THREE.Scene) {
  const sun = new THREE.DirectionalLight('#ffffff', 2.2);
  const fill = new THREE.HemisphereLight('#c7dcff', '#6b533c', 1.05);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = sun.shadow.camera;
  s.left = s.bottom = -29;
  s.right = s.top = 29;
  s.near = 1;
  s.far = 120;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.025;
  const atmosphere = new THREE.MeshBasicNodeMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  atmosphere.colorNode = Fn(() => {
    const ray = positionWorld.sub(cameraPosition).normalize();
    const towardSun = ray.dot(look.lightDir);
    const gradient = mix(sky, zenith, ray.y.max(0).pow(0.52));
    const halo = towardSun.max(0).pow(18).mul(0.38);
    const disk = towardSun.smoothstep(0.99945, 0.99965);
    return mix(gradient, sunColor, halo.max(disk));
  })();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(175, 32, 16), atmosphere);
  dome.renderOrder = -1;
  dome.frustumCulled = false;
  scene.add(sun, sun.target, fill, dome);
  const tone = new THREE.Color();
  let amount = 0;
  let target = 0;
  const updateColor = (start: THREE.Color, end: THREE.Color, out: THREE.Vector3) => {
    tone.copy(start).lerp(end, amount);
    out.set(tone.r, tone.g, tone.b);
  };
  function lightScene() {
    look.lightDir.value.copy(day).lerp(dusk, amount).normalize();
    updateColor(palette.light, duskLight, look.lightColor.value);
    updateColor(palette.shadow, duskShadow, look.shadowColor.value);
    updateColor(palette.skyTop, duskSky, zenith.value);
    updateColor(palette.skyEdge, duskHorizon, sky.value);
    updateColor(dayDisk, duskDisk, sunColor.value);
    look.lightIntensity.value = 1.19 - amount * 0.12;
    sun.color.setRGB(look.lightColor.value.x, look.lightColor.value.y, look.lightColor.value.z);
    sun.intensity = 2.2 - amount * 0.72;
    fill.intensity = 1.05 - amount * 0.38;
  }
  lightScene();
  return {
    setSunset(on: boolean) {
      target = Number(on);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        amount = target;
        lightScene();
      }
    },
    follow(dt: number, focus: THREE.Vector3, camera: THREE.Camera) {
      if (amount !== target) {
        amount = THREE.MathUtils.damp(amount, target, 3, dt);
        if (Math.abs(amount - target) < 0.001) amount = target;
        lightScene();
      }
      sun.position.copy(focus).addScaledVector(look.lightDir.value, 62);
      sun.target.position.copy(focus);
      dome.position.copy(camera.position);
      look.focus.value.copy(focus);
    },
  };
}
