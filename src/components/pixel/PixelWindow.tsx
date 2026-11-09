interface Props {
  /** Shown in the title bar in the pixel font. */
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Square window: 3 px ink frame, 26 px title bar with a pixel close box, 6 px haze offset shadow. */
export function PixelWindow({ title, children, className }: Props) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border-3 border-ink bg-white shadow-[6px_6px_0_var(--color-haze)] ${className ?? ''}`}
    >
      <div className="flex h-[26px] shrink-0 items-center justify-between border-b-3 border-ink px-2">
        <span className="font-display text-pixel-8 uppercase">{title}</span>
        <span aria-hidden className="grid size-3 place-items-center rounded-sm border-2 border-ink">
          <span className="size-1 bg-ink" />
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
