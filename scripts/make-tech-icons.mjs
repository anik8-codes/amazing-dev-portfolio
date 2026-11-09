// Writes one SVG per technology to public/tech/<id>.svg from src/config/tech.ts, and records
// which ones are single-colour near-black (they get inverted in dark mode) in
// src/data/tech-icons.json. Sources: Iconify "logos" (CC0) and simple-icons (CC0).
// Run: pnpm tech-icons
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import logos from '@iconify-json/logos/icons.json' with { type: 'json' };
import * as si from 'simple-icons';
import { tech, techSlug } from '../src/config/tech.ts';

const OUT = 'public/tech';
const lum = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** A logo is "mono dark" if every colour it uses is near-black: invisible on a dark page. */
const monoDark = (svg) => {
  const colours = [...svg.matchAll(/(?:fill|stop-color|stroke)="(#[0-9a-fA-F]{3,6})"/g)].map(
    (m) => m[1],
  );
  const grey = (c) => {
    const h = c.replace('#', '');
    const full = h.length === 3 ? [...h].map((x) => x + x).join('') : h;
    const v = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return Math.max(...v) - Math.min(...v) < 40;
  };
  return colours.length > 0 && colours.every((c) => lum(c) < 64 && grey(c));
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const meta = {};
const missing = [];

for (const [id, t] of Object.entries(tech)) {
  if (!t.icon) continue;
  const [set, name] = t.icon.split(':');
  let svg;
  if (set === 'logos') {
    const icon = logos.icons[name] ?? logos.icons[logos.aliases?.[name]?.parent];
    if (!icon) {
      missing.push(t.icon);
      continue;
    }
    const w = icon.width ?? logos.width ?? 256;
    const h = icon.height ?? logos.height ?? 256;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${icon.body}</svg>`;
  } else {
    const key = `si${name[0].toUpperCase()}${name.slice(1)}`;
    const icon = si[key];
    if (!icon) {
      missing.push(t.icon);
      continue;
    }
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;
  }
  const file = `${techSlug(id)}.svg`;
  writeFileSync(`${OUT}/${file}`, svg);
  meta[id] = { file, mono: monoDark(svg) };
}

writeFileSync('src/data/tech-icons.json', JSON.stringify(meta, null, 2) + '\n');
console.log(`${Object.keys(meta).length} icons → ${OUT}`);
if (missing.length) {
  console.error(`missing: ${missing.join(', ')}`);
  process.exit(1);
}
