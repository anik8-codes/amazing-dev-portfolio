import * as THREE from 'three/webgpu';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = [number, number, number];
export type Outfit =
  'default' | 'hoodie' | 'creator' | 'traveler' | 'hackathon' | 'formal' | 'builder' | 'gamer';

const skin = '#e5a269';
const beard = '#312018';
const hair = '#231a1b';
const cream = '#fff4e2';
const red = '#d62828';
const denim = '#344567';
const outfits: Record<Outfit, string> = {
  default: '#6b5184',
  hoodie: '#41364d',
  creator: '#e7dbdc',
  traveler: '#de9a32',
  hackathon: '#3b3349',
  formal: '#343544',
  builder: '#e48632',
  gamer: '#675187',
};

const ball = new THREE.SphereGeometry(1, 12, 8);
const box = new RoundedBoxGeometry(2, 2, 2, 2, 0.32);
const softBox = new RoundedBoxGeometry(2, 2, 2, 2, 0.57);
const shirt = softBox.clone();
const shirtVertices = shirt.getAttribute('position');
for (let i = 0; i < shirtVertices.count; i++) {
  shirtVertices.setX(i, shirtVertices.getX(i) * (0.96 + shirtVertices.getY(i) * 0.065));
}
const ring = new THREE.TorusGeometry(1, 0.12, 6, 24);
const headShape = new THREE.SphereGeometry(1, 32, 24);
const headRadius: Point = [0.127, 0.139, 0.111];
const crown = new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
const frontPanel = new THREE.SphereGeometry(1, 12, 12, 0.66, 1.82, 0, Math.PI / 2);

function headPoint(point: Point, offset = 0): Point {
  return point.map(
    (n, i) => Math.sign(n) * Math.pow(Math.abs(n), 0.85) * (headRadius[i]! + offset),
  ) as Point;
}

const headVertices = headShape.getAttribute('position');
for (let i = 0; i < headVertices.count; i++) {
  headVertices.setXYZ(
    i,
    ...headPoint([headVertices.getX(i), headVertices.getY(i), headVertices.getZ(i)]),
  );
}
headShape.computeVertexNormals();

/** An open surface with a regular grid, used to wrap the beard around the jaw. */
function surface(columns: number, rows: number, point: (u: number, v: number) => Point) {
  const vertices = [];
  const indices = [];
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= columns; x++) {
      vertices.push(...point(x / columns, y / rows));
      if (x === columns || y === rows) continue;
      const a = y * (columns + 1) + x;
      const b = a + columns + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const beardLine = [-0.62, -0.68, -0.66, -0.55, -0.37, -0.17, 0.03, 0.12, 0.13];
const jaw = surface(32, 8, (u, v) => {
  const lon = (u - 0.5) * (3.75 - 0.73 * Math.sin(v * Math.PI));
  const column = Math.abs(u - 0.5) * 16;
  const i = Math.floor(column);
  const top = THREE.MathUtils.lerp(beardLine[i]!, beardLine[i + 1] ?? beardLine[i]!, column - i);
  const lat = THREE.MathUtils.lerp(-1.565, top, v);
  return headPoint(
    [Math.sin(lon) * Math.cos(lat), Math.sin(lat), Math.cos(lon) * Math.cos(lat)],
    0.004,
  );
});

function tube(points: Point[], thickness: number) {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    12,
    thickness,
    5,
  );
}

/** Bake each rigid piece as a single mesh with vertex colours for the details. */
function sculpt(parent: THREE.Group, material: THREE.Material, shadows = true) {
  const pieces: THREE.BufferGeometry[] = [];
  const color = new THREE.Color();
  return {
    add(
      source: THREE.BufferGeometry,
      tint: string,
      at: Point,
      scale: Point = [1, 1, 1],
      tilt = 0,
      yaw = 0,
    ) {
      const geo = new THREE.BufferGeometry();
      const vertices = source.index ? source.toNonIndexed() : source;
      geo.setAttribute('position', vertices.getAttribute('position').clone());
      geo.setAttribute('normal', vertices.getAttribute('normal').clone());
      if (vertices !== source) vertices.dispose();
      geo
        .scale(...scale)
        .rotateZ(tilt)
        .rotateY(yaw)
        .translate(...at);
      color.set(tint);
      const count = geo.getAttribute('position').count;
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) color.toArray(colors, i * 3);
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      pieces.push(geo);
    },
    finish() {
      const merged = mergeGeometries(pieces);
      for (const piece of pieces) piece.dispose();
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = shadows;
      mesh.receiveShadow = true;
      parent.add(mesh);
    },
  };
}

type Sculpt = ReturnType<typeof sculpt>;

export function joint(parent: THREE.Group, x: number, y: number, z = 0) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  parent.add(group);
  return group;
}

const brim = new RoundedBoxGeometry(2, 2, 2, 3, 0.75);
const smile = tube(
  [
    [-0.043, -0.048, 0.103],
    [-0.023, -0.06, 0.112],
    [0.004, -0.065, 0.114],
    [0.03, -0.056, 0.111],
    [0.046, -0.042, 0.103],
  ],
  0.01,
);
const teeth = tube(
  [
    [-0.032, -0.05, 0.112],
    [-0.01, -0.058, 0.122],
    [0.012, -0.057, 0.122],
    [0.035, -0.048, 0.112],
  ],
  0.004,
);
const sides = [-1, 1] as const;
const moustaches = sides.map((s) =>
  tube(
    [
      [s * 0.05, -0.04, 0.102],
      [s * 0.025, -0.032, 0.117],
      [s * 0.008, -0.036, 0.12],
    ],
    0.0065,
  ),
);
const capMark = tube(
  [
    [-0.03, 0.117],
    [-0.016, 0.137],
    [0, 0.141],
    [0.017, 0.133],
    [0.031, 0.115],
  ].map(([x, y]) => [
    x!,
    y!,
    -0.003 + 0.135 * Math.sqrt(1 - (x! / 0.144) ** 2 - ((y! - 0.077) / 0.106) ** 2),
  ]),
  0.004,
);
const temples = sides.map((s) =>
  tube(
    [
      [s * 0.09, 0.021, 0.115],
      [s * 0.127, 0.02, 0.066],
      [s * 0.133, 0.018, 0.016],
    ],
    0.003,
  ),
);
const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 });

function makeHead(head: THREE.Group, outfit: Outfit) {
  const shape = sculpt(head, material);
  const isBuilder = outfit === 'builder';
  shape.add(headShape, skin, [0, 0, 0]);
  shape.add(jaw, beard, [0, 0, 0]);
  shape.add(ball, hair, [0, 0.046, -0.053], [0.129, 0.112, 0.077]);
  for (const side of sides) {
    shape.add(ball, skin, [side * 0.126, -0.012, 0.008], [0.02, 0.03, 0.019]);
    shape.add(ball, '#af6547', [side * 0.137, -0.012, 0.022], [0.008, 0.015, 0.004]);
    shape.add(ball, hair, [side * 0.111, 0.061, 0.035], [0.02, 0.048, 0.044], side * 0.18);
  }
  shape.add(ball, hair, [-0.043, 0.08, 0.092], [0.068, 0.026, 0.028], 0.35);
  shape.add(ball, hair, [0.055, 0.079, 0.09], [0.045, 0.026, 0.025], -0.26);
  shape.add(crown, isBuilder ? '#e1d9cb' : red, [0, 0.077, -0.006], [0.143, 0.104, 0.133]);
  if (!isBuilder) {
    shape.add(frontPanel, cream, [0, 0.077, -0.006], [0.144, 0.106, 0.135]);
  }
  shape.add(brim, isBuilder ? cream : red, [0, 0.077, 0.099], [0.124, 0.011, 0.082]);
  shape.add(ball, isBuilder ? '#ded3c4' : red, [0, 0.181, -0.006], [0.015, 0.007, 0.015]);
  shape.add(ball, '#df935e', [0, -0.01, 0.113], [0.021, 0.025, 0.025]);
  shape.add(smile, '#401f1b', [0, 0, 0]);
  shape.finish();

  // Small face details receive world shadows without casting onto the eyes and mouth.
  const detail = sculpt(head, material, false);
  const frames = '#ede2ca';
  for (const [index, side] of sides.entries()) {
    const x = side * 0.055;
    detail.add(ball, '#fff0db', [x, 0.022, 0.105], [0.022, 0.01, 0.004], side * 0.05);
    detail.add(ball, '#2f201a', [x, 0.023, 0.108], [0.0085, 0.008, 0.003]);
    detail.add(ball, '#fff6e7', [x - 0.003, 0.025, 0.111], [0.0024, 0.0024, 0.001]);
    detail.add(ball, hair, [x, 0.049, 0.101], [0.028, 0.006, 0.009], side * -0.12);
    detail.add(ring, frames, [x, 0.022, 0.117], [0.037, 0.031, 0.026], side * 0.02, side * -0.16);
    detail.add(temples[index]!, frames, [0, 0, 0]);
    detail.add(moustaches[index]!, beard, [0, 0, 0]);
    if (outfit === 'gamer') {
      detail.add(softBox, '#28243a', [side * 0.14, 0.012, 0.002], [0.022, 0.054, 0.04]);
      detail.add(softBox, '#8b7bb0', [side * 0.158, 0.012, 0.002], [0.01, 0.037, 0.029]);
    }
  }
  detail.add(ball, frames, [0, 0.024, 0.119], [0.023, 0.003, 0.004]);
  detail.add(teeth, cream, [0, 0, 0]);
  if (!isBuilder) detail.add(capMark, red, [0, 0, 0]);
  detail.finish();
}

function clothes(top: Sculpt, outfit: Outfit, color: string) {
  if (outfit === 'default') {
    for (const side of [-1, 1]) {
      top.add(ball, '#292533', [side * 0.028, 0.17, 0.068], [0.017, 0.017, 0.009]);
    }
    top.add(ball, cream, [0, 0.143, 0.073], [0.043, 0.032, 0.009]);
    for (const side of [-1, 1]) {
      top.add(ball, '#292533', [side * 0.017, 0.148, 0.08], [0.01, 0.01, 0.004], side * 0.3);
    }
    top.add(ball, '#292533', [0, 0.135, 0.082], [0.006, 0.004, 0.002]);
  }
  if (outfit === 'hoodie' || outfit === 'creator' || outfit === 'gamer') {
    top.add(ball, color, [0, 0.196, -0.048], [0.077, 0.062, 0.049]);
    for (const side of [-1, 1]) {
      top.add(box, cream, [side * 0.024, 0.164, 0.073], [0.003, 0.037, 0.003], side * 0.06);
    }
  }
  if (outfit === 'creator') {
    top.add(box, red, [0, 0.106, 0.074], [0.036, 0.023, 0.007]);
    top.add(ball, cream, [0, 0.106, 0.081], [0.009, 0.01, 0.003]);
  }
  if (outfit === 'traveler') {
    top.add(box, '#493747', [0, 0.131, -0.088], [0.09, 0.09, 0.038]);
    for (const side of [-1, 1]) {
      top.add(box, '#493747', [side * 0.069, 0.135, 0.067], [0.014, 0.092, 0.012], side * -0.12);
    }
  }
  if (outfit === 'hackathon') {
    for (const side of [-1, 1]) {
      top.add(box, '#768be7', [side * 0.018, 0.154, 0.073], [0.004, 0.055, 0.003], side * -0.3);
    }
    top.add(box, cream, [0, 0.09, 0.079], [0.022, 0.027, 0.005]);
    top.add(box, '#768be7', [0, 0.091, 0.085], [0.012, 0.004, 0.002]);
  }
  if (outfit === 'formal') {
    top.add(box, cream, [0, 0.145, 0.067], [0.034, 0.073, 0.011]);
    for (const side of [-1, 1]) {
      top.add(box, '#4a485b', [side * 0.034, 0.155, 0.078], [0.014, 0.062, 0.008], side * -0.33);
    }
  }
  if (outfit === 'builder') {
    for (const side of [-1, 1]) {
      top.add(box, cream, [side * 0.061, 0.136, 0.068], [0.012, 0.092, 0.009]);
    }
  }
}

export const upperLeg = 0.192;
export const lowerLeg = 0.185;

export function makeAvatar(outfit: Outfit) {
  const root = new THREE.Group();
  const hips = joint(root, 0, 0.404);
  const chest = joint(hips, 0, 0);
  const top = sculpt(chest, material);
  const color = outfits[outfit];
  const pants = outfit === 'formal' ? color : denim;
  top.add(box, pants, [0, 0.012, 0], [0.109, 0.055, 0.063]);
  top.add(shirt, color, [0, 0.127, 0], [0.115, 0.12, 0.069]);
  top.add(ball, skin, [0, 0.251, 0], [0.042, 0.047, 0.041]);
  clothes(top, outfit, color);
  top.finish();

  const neck = joint(chest, 0, 0.25);
  makeHead(joint(neck, 0, 0.122, 0.005), outfit);
  const sleeves =
    outfit === 'default' || outfit === 'hackathon' || outfit === 'builder' ? 0.063 : 0.115;
  const limbs = [-1, 1].map((side) => {
    const shoulder = joint(chest, side * 0.123, 0.204);
    const arm = sculpt(shoulder, material);
    arm.add(ball, skin, [0, -0.074, 0], [0.036, 0.084, 0.038]);
    arm.add(
      softBox,
      outfit === 'builder' ? outfits.hackathon : color,
      [0, 0.018 - sleeves, 0],
      [0.047, sleeves, 0.051],
    );
    arm.finish();

    const elbow = joint(shoulder, 0, -0.128);
    const hand = sculpt(elbow, material);
    hand.add(ball, sleeves > 0.1 ? color : skin, [0, -0.05, 0], [0.033, 0.071, 0.034]);
    hand.add(ball, skin, [0, -0.123, 0.003], [0.035, 0.044, 0.033]);
    hand.add(ball, skin, [-side * 0.02, -0.119, 0.021], [0.015, 0.028, 0.015], side * -0.2);
    if (outfit === 'default' && side === 1) {
      hand.add(box, '#d88343', [0, -0.093, 0], [0.034, 0.012, 0.034]);
      hand.add(box, '#302a31', [side * 0.028, -0.093, 0.01], [0.011, 0.017, 0.018]);
    }
    hand.finish();

    const thigh = joint(hips, side * 0.061, 0);
    const upper = sculpt(thigh, material);
    upper.add(softBox, pants, [0, -upperLeg * 0.43, 0], [0.051, 0.116, 0.056]);
    upper.finish();
    const knee = joint(thigh, 0, -upperLeg);
    const shin = sculpt(knee, material);
    shin.add(softBox, pants, [0, -lowerLeg * 0.43, 0], [0.043, 0.108, 0.045]);
    shin.finish();

    const ankle = joint(knee, 0, -lowerLeg);
    const shoe = sculpt(ankle, material);
    const dress = outfit === 'formal';
    shoe.add(softBox, dress ? '#4e3a37' : cream, [0, -0.004, 0.028], [0.047, 0.037, 0.079]);
    shoe.add(softBox, dress ? '#29272b' : '#c8c1be', [0, -0.037, 0.028], [0.048, 0.009, 0.08]);
    shoe.add(softBox, dress ? '#4e3a37' : '#d6bcd5', [0, 0.019, -0.014], [0.041, 0.025, 0.037]);
    shoe.finish();
    return { side, shoulder, elbow, thigh, knee, ankle };
  });

  return { root, hips, chest, neck, limbs };
}
