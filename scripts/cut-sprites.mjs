// Cuts every sprite from brand/anik8-looks.png using the crop boxes in docs/brand.md.
// Output: src/assets/sprites/{look}.png, {look}-head.png, run.png (8-frame strip), src/app/icon.png.
// Run: pnpm sprites
import sharp from 'sharp';

const SRC = 'brand/anik8-looks.png';
const OUT = 'src/assets/sprites';

const LOOKS = {
  default: [68, 31, 241, 252],
  hoodie: [271, 31, 451, 252],
  work: [455, 31, 709, 252],
  creator: [709, 31, 923, 252],
  traveler: [931, 31, 1137, 252],
  hackathon: [43, 288, 263, 501],
  formal: [289, 288, 474, 501],
  gamer: [495, 288, 697, 501],
  builder: [732, 288, 920, 501],
  chill: [936, 288, 1146, 501],
};
const RUN_Y = [590, 759];
const RUN_X = [
  [53, 166],
  [195, 311],
  [334, 450],
  [472, 591],
  [613, 729],
  [750, 865],
  [886, 1001],
  [1027, 1136],
];
const TITLE_PILL = [440, 0, 760, 44]; // erased before cutting row 1 (brand.md says y 38; its border runs to ~42)
const HEAD_RATIO = 0.5; // top half of a trimmed look ≈ cap + face (draft; final favicons are hand-pixelled)
const CAP_ROWS = 0.22; // the cap spans the top ~22% of a look; its width sets the head crop

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const [px0, py0, px1, py1] = TITLE_PILL;
for (let y = py0; y < py1; y++)
  for (let x = px0; x < px1; x++) data[(y * info.width + x) * 4 + 3] = 0;
const sheet = () => sharp(data, { raw: info });

/** Keep only the largest 8-connected blob of visible pixels (drops a mic or mug beside the head). */
function keepLargestBlob(px, width, height) {
  const seen = new Int32Array(width * height).fill(-1);
  const sizes = [];
  for (let start = 0; start < width * height; start++) {
    if (seen[start] !== -1 || px[start * 4 + 3] <= 40) continue;
    const id = sizes.length;
    let size = 0;
    const stack = [start];
    seen[start] = id;
    while (stack.length) {
      const i = stack.pop();
      size++;
      const x = i % width;
      const y = (i - x) / width;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = ny * width + nx;
          if (seen[j] === -1 && px[j * 4 + 3] > 40) {
            seen[j] = id;
            stack.push(j);
          }
        }
    }
    sizes.push(size);
  }
  const biggest = sizes.indexOf(Math.max(...sizes));
  for (let i = 0; i < width * height; i++) if (seen[i] !== biggest) px[i * 4 + 3] = 0;
  return px;
}

const crop = ([x0, y0, x1, y1]) =>
  sheet().extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 });
const trimmed = async (box) =>
  sharp(await crop(box).png().toBuffer())
    .trim()
    .png()
    .toBuffer();

for (const [name, box] of Object.entries(LOOKS)) {
  const look = await trimmed(box);
  await sharp(look).toFile(`${OUT}/${name}.png`);
  const { width, height } = await sharp(look).metadata();
  // Head = cap width (+12% each side) × top half, so props beside the face (mic, mug, fist) drop out.
  const { data: px } = await sharp(look).raw().toBuffer({ resolveWithObject: true });
  let capL = width,
    capR = 0;
  for (let y = 0; y < Math.round(height * CAP_ROWS); y++)
    for (let x = 0; x < width; x++) {
      if (px[(y * width + x) * 4 + 3] <= 200) continue;
      capL = Math.min(capL, x);
      capR = Math.max(capR, x);
    }
  const pad = Math.round((capR - capL) * 0.12);
  const left = Math.max(0, capL - pad);
  const headW = Math.min(width, capR + pad + 1) - left;
  const head = await sharp(look)
    .extract({ left, top: 0, width: headW, height: Math.round(height * HEAD_RATIO) })
    .png()
    .toBuffer();
  const { data: hp, info: hi } = await sharp(head).raw().toBuffer({ resolveWithObject: true });
  await sharp(keepLargestBlob(hp, hi.width, hi.height), { raw: hi })
    .png()
    .toBuffer()
    .then((b) => sharp(b).trim().toFile(`${OUT}/${name}-head.png`));
}

// Run cycle: frames keep their shared baseline (no vertical trim) and sit centred in equal cells.
// Cell width rounded up to a multiple of 4, so ¼ and ½ scale give whole-pixel frames (no shimmer).
const cellW = Math.ceil(Math.max(...RUN_X.map(([a, b]) => b - a)) / 4) * 4;
const cellH = RUN_Y[1] - RUN_Y[0];
const frames = await Promise.all(
  RUN_X.map(([a, b]) => crop([a, RUN_Y[0], b, RUN_Y[1]]).png().toBuffer()),
);
await sharp({
  create: {
    width: cellW * frames.length,
    height: cellH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(
    frames.map((input, i) => ({
      input,
      left: i * cellW + Math.floor((cellW - (RUN_X[i][1] - RUN_X[i][0])) / 2),
      top: 0,
    })),
  )
  .png()
  .toFile(`${OUT}/run.png`);

// Default favicon (Creator head). Nearest-neighbour keeps hard pixels. TODO(T08): per-mode favicons.
await sharp(`${OUT}/creator-head.png`)
  .resize(32, 32, { fit: 'contain', kernel: 'nearest', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('src/app/icon.png');

console.log(
  `cut ${Object.keys(LOOKS).length} looks + heads, run strip ${cellW}×${cellH}×${frames.length}, favicon`,
);
