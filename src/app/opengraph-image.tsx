import { ImageResponse } from 'next/og';
import { WORDMARK } from '@/components/pixel/grids';
import { site } from '@/config/site';

export const dynamic = 'force-static';
export const alt = `${site.author} (${site.name}): ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CELL = 18;
const INK = '#1d1630';
const RED = '#d62828';

/** Share card for every page (brand: white, pixel wordmark with the red offset copy). */
export default function OgImage() {
  const cells = WORDMARK.flatMap((row, y) =>
    [...row].flatMap((c, x) => (c === 'X' ? [{ x, y }] : [])),
  );
  const layer = (color: string, offset: number) =>
    cells.map((c) => (
      <div
        key={`${color}${c.x}-${c.y}`}
        style={{
          position: 'absolute',
          left: c.x * CELL + offset,
          top: c.y * CELL + offset,
          width: CELL,
          height: CELL,
          background: color,
        }}
      />
    ));
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 88,
        background: '#ffffff',
        color: INK,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: WORDMARK[0]!.length * CELL + CELL / 2,
          height: WORDMARK.length * CELL + CELL / 2,
        }}
      >
        {layer(RED, CELL / 2)}
        {layer(INK, 0)}
      </div>
      <div style={{ marginTop: 56, fontSize: 64, fontWeight: 700 }}>{site.author}</div>
      <div style={{ marginTop: 8, fontSize: 40, color: '#6b6480' }}>{site.headline}</div>
      <div style={{ marginTop: 40, fontSize: 28, color: RED }}>
        {site.url.replace('https://', '')}
      </div>
    </div>,
    size,
  );
}
