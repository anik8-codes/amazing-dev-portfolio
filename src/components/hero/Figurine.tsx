import { looks, type Look } from '@/assets/sprites';
import { SelectionCorners } from '@/components/pixel/SelectionCorners';
import { Sprite } from '@/components/pixel/Sprite';
import { modes } from '@/config/modes';

interface Props {
  look: Look;
  selected: boolean;
  onSelect: () => void;
}

/** An inline mode selector; selecting a look never navigates away from home. */
export function Figurine({ look, selected, onSelect }: Props) {
  const name = modes.find((m) => m.id === look)?.name ?? look;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${name} mode`}
      aria-pressed={selected}
      className="block cursor-pointer transition-transform hover:-translate-y-0.5"
    >
      <SelectionCorners selected={selected} className="flex flex-col items-center gap-1">
        <Sprite src={looks[look].body} alt="" scale={0.5} eager />
        <span className="font-display text-pixel-8 uppercase">{name}</span>
      </SelectionCorners>
    </button>
  );
}
