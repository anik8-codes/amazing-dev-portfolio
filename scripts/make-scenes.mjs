// Turns source photos in media/scenes/ into duotone illustration masks for the experience
// chapters: crop → cut the sky/background out → a 1-bit silhouette + a banded greyscale
// shading mask. The page paints them in theme colours, so they blend in light and dark.
// Output: src/assets/scenes/<name>-1.png (silhouette) and <name>-2.png (shading).
// Run: pnpm scenes. Credits for every source: media/scenes/CREDITS.md.
import sharp from 'sharp';

const SRC = 'media/scenes';
const OUT = 'src/assets/scenes';
const WIDTH = 640; // output mask width
const WORK = 160; // silhouette detail: simplified at this width
const SHADE_WORK = 300; // shading detail: photo softened at this width before banding
const LEVELS = 5; // flat shading bands, like a printed two-colour illustration

/**
 * Make background pixels transparent: flood-fill from the given image edges through pixels
 * that pass `isBackground`, never stepping across a jump bigger than `maxStep` (so it stops at
 * the subject's outline instead of leaking into it).
 */
function keyFromEdges(px, w, h, edges, isBackground, maxStep = 22) {
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const i = y * w + x;
    if (!seen[i] && isBackground(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) {
      seen[i] = 1;
      stack.push(i);
    }
  };
  if (edges.includes('top')) for (let x = 0; x < w; x++) push(x, 0);
  if (edges.includes('left')) for (let y = 0; y < h; y++) push(0, y);
  if (edges.includes('right')) for (let y = 0; y < h; y++) push(w - 1, y);
  if (edges.includes('bottom')) for (let x = 0; x < w; x++) push(x, h - 1);
  while (stack.length) {
    const i = stack.pop();
    px[i * 4 + 3] = 0;
    const x = i % w;
    const y = (i - x) / w;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (seen[j]) continue;
      const step =
        Math.abs(px[j * 4] - px[i * 4]) +
        Math.abs(px[j * 4 + 1] - px[i * 4 + 1]) +
        Math.abs(px[j * 4 + 2] - px[i * 4 + 2]);
      if (step <= maxStep && isBackground(px[j * 4], px[j * 4 + 1], px[j * 4 + 2])) {
        seen[j] = 1;
        stack.push(j);
      }
    }
  }
  return px;
}

/** Bright, low-saturation pixels: overcast sky or a studio backdrop. */
const paleNeutral = (min) => (r, g, b) =>
  Math.min(r, g, b) >= min && Math.max(r, g, b) - Math.min(r, g, b) <= 26;

async function scene({ file, crop, edges, isBackground, maxStep, paint, out }) {
  let img = sharp(`${SRC}/${file}`).extract(crop);
  if (paint) img = sharp(await img.png().toBuffer()).composite(paint);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  keyFromEdges(data, info.width, info.height, edges, isBackground, maxStep);
  const cut = await sharp(data, { raw: info }).png().toBuffer();
  // Flatten into a two-tone illustration, like layered flat landscape art:
  //   1) silhouette: every visible pixel, simplified at WORK px wide;
  //   2) shadows: only the darkest big shapes (arches, cornices, deep windows), found at an
  //      even coarser DARK_WORK px so texture never survives.
  // Each mask is scaled up with a soft resample + threshold (smooth vector-like edges) and saved
  // as 1-bit black/white; the page fills them with theme colours (SceneArt.tsx).
  const trimmed = await sharp(cut).trim().png().toBuffer();
  const { width: tw, height: th } = await sharp(trimmed).metadata();
  const height = Math.round((th * WIDTH) / tw);
  const name = out.replace(/\.png$/, '');

  async function mask(work, pick, file) {
    const { data: px, info } = await sharp(trimmed)
      .resize({ width: work, kernel: 'lanczos3' })
      .median(3)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const keep = pick(px);
    const gray = Buffer.alloc(info.width * info.height);
    for (let i = 0, j = 0; i < px.length; i += 4, j++) gray[j] = keep(i) ? 255 : 0;
    const big = await sharp(gray, { raw: { width: info.width, height: info.height, channels: 1 } })
      .median(3) // drop isolated specks while the mask is still small
      .resize(WIDTH, height, { kernel: 'cubic' })
      .blur(2.4)
      .threshold(128)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const step = big.info.channels; // sharp may hand back 1 or 3 channels here
    const bw = Buffer.alloc(WIDTH * height);
    for (let j = 0; j < bw.length; j++) bw[j] = big.data[j * step];
    await sharp(bw, { raw: { width: WIDTH, height, channels: 1 } })
      .png({ palette: true, colours: 2, compressionLevel: 9 })
      .toFile(`${OUT}/${file}`);
  }

  // Silhouette (1-bit): every visible pixel.
  await mask(WORK, (px) => (i) => px[i + 3] > 128, `${name}-1.png`);

  // Shading (greyscale, 5 flat bands): the photo's own light and shadow, inverted so dark
  // areas paint the dark tone. Softened and banded so it reads as illustration, not photo.
  const alpha = await sharp(trimmed).extractChannel(3).resize(WIDTH, height).raw().toBuffer();
  const shade = await sharp(trimmed)
    .flatten({ background: '#ffffff' })
    .resize(SHADE_WORK, null, { kernel: 'lanczos3' })
    .greyscale()
    .normalise()
    .negate({ alpha: false })
    .median(3)
    .resize(WIDTH, height, { kernel: 'cubic' })
    .blur(1.6)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bands = Buffer.alloc(WIDTH * height);
  for (let j = 0; j < bands.length; j++) {
    const v = shade.data[j * shade.info.channels];
    const level = Math.min(LEVELS - 1, Math.floor((v / 256) * LEVELS)); // 0..LEVELS-1
    bands[j] = alpha[j] > 128 ? Math.round((level / (LEVELS - 1)) * 255) : 0;
  }
  await sharp(bands, { raw: { width: WIDTH, height, channels: 1 } })
    .png({ palette: true, colours: LEVELS, compressionLevel: 9 })
    .toFile(`${OUT}/${name}-2.png`);
  console.log(`${out} ← ${file}`);
}

/** Our own screen for the borrowed desk: a dark terminal with a few lines of "code". */
const screen = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="170" height="130">
  <rect width="170" height="130" fill="#1d1630"/>
  <rect x="14" y="16" width="70" height="8" fill="#ff7a1a"/><rect x="14" y="34" width="110" height="8" fill="#e7e3ef"/>
  <rect x="14" y="52" width="90" height="8" fill="#e7e3ef"/><rect x="14" y="70" width="120" height="8" fill="#b3a5d1"/>
  <rect x="14" y="88" width="60" height="8" fill="#e7e3ef"/><rect x="14" y="106" width="14" height="10" fill="#d62828"/>
</svg>`);
/** Neutral patch to cover the tiny maker badges on the monitor and the PC. */
const patch = (w, h) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#d9d9d9"/></svg>`,
  );

await scene({
  file: 'india-gate.jpg',
  crop: { left: 800, top: 40, width: 980, height: 1200 },
  edges: ['top', 'left', 'right'],
  isBackground: paleNeutral(175),
  out: 'india-gate.png',
});
await scene({
  file: 'rajwada.jpg',
  crop: { left: 560, top: 20, width: 1080, height: 1230 },
  edges: ['top', 'left', 'right'],
  isBackground: paleNeutral(200),
  out: 'rajwada.png',
});
/** Clear blue sky: blue clearly above red, and bright enough. */
const blueSky = (r, g, b) => b > 150 && b - r > 40;

await scene({
  file: 'gandhi-hall.jpg',
  crop: { left: 0, top: 0, width: 1600, height: 2133 },
  edges: ['top', 'right'],
  isBackground: blueSky,
  maxStep: 40,
  out: 'gandhi-hall.png',
});
await scene({
  file: 'desk-henry.png',
  crop: { left: 60, top: 40, width: 1180, height: 790 },
  edges: ['top', 'left', 'right', 'bottom'],
  isBackground: paleNeutral(150),
  maxStep: 14,
  paint: [
    { input: screen, left: 438, top: 50 }, // monitor screen (crop-relative)
    { input: patch(56, 14), left: 420, top: 172 }, // badge on the monitor bezel
    { input: patch(60, 12), left: 410, top: 202 }, // badge on the PC case
  ],
  out: 'desk.png',
});
