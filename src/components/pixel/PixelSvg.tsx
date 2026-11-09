import { toRuns, type PixelGrid } from '@/lib/pixel-grid';

interface Props {
  grid: PixelGrid;
  /** Size of one cell in px. */
  cell: number;
  /** CSS colour (use a token var). */
  fill: string;
  /** Optional second copy offset half a cell down-right (the wordmark's red shadow). */
  shadow?: string;
  /** Accessible name; omit for decorative art (then it is hidden from screen readers). */
  label?: string;
  className?: string;
}

/** Renders any PixelGrid as crisp SVG rects: the base of Wordmark, Heart and future pixel motifs. */
export function PixelSvg({ grid, cell, fill, shadow, label, className }: Props) {
  const runs = toRuns(grid);
  const pad = shadow ? 0.5 : 0;
  const w = (grid[0]?.length ?? 0) + pad;
  const h = grid.length + pad;
  const rects = runs.map((r) => (
    <rect key={`${r.x},${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
  ));
  return (
    <svg
      className={className}
      width={w * cell}
      height={h * cell}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {shadow && (
        <g fill={shadow} transform="translate(0.5 0.5)">
          {rects}
        </g>
      )}
      <g fill={fill}>{rects}</g>
    </svg>
  );
}
