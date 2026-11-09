interface Props {
  /** Show the red L-brackets. */
  selected: boolean;
  children: React.ReactNode;
  className?: string;
}

const corner = 'pointer-events-none absolute size-6 border-red';

/** Wraps an item and draws red 6 px L-brackets at its corners when selected (brand.md). */
export function SelectionCorners({ selected, children, className }: Props) {
  return (
    <div className={`relative p-3 ${className ?? ''}`}>
      {children}
      {selected && (
        <>
          <span aria-hidden className={`${corner} top-0 left-0 border-t-6 border-l-6`} />
          <span aria-hidden className={`${corner} top-0 right-0 border-t-6 border-r-6`} />
          <span aria-hidden className={`${corner} bottom-0 left-0 border-b-6 border-l-6`} />
          <span aria-hidden className={`${corner} right-0 bottom-0 border-r-6 border-b-6`} />
        </>
      )}
    </div>
  );
}
