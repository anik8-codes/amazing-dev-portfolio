interface Props {
  value: number;
  max: number;
  /** Visible label before the bar. */
  label?: string;
  className?: string;
}

/** Orange XP progress bar on a pale track (brand.md → XP bar). */
export function XpBar({ value, max, label = 'XP', className }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <span className="font-display text-pixel-8 text-muted">{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 w-full bg-track"
      >
        <div className="h-full bg-orange" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
