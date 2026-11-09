import type { StaticImageData } from 'next/image';
import type { Look } from '@/assets/sprites';
import { SelectionCorners } from '@/components/pixel/SelectionCorners';
import { Sprite } from '@/components/pixel/Sprite';

export interface FigurineChoice {
  id: Look;
  name: string;
  image: Pick<StaticImageData, 'src' | 'width' | 'height'>;
}

interface Props {
  choice: FigurineChoice;
  selected: boolean;
  onSelect: () => void;
}

/** An inline mode selector; selecting a look never navigates away from home. */
export function Figurine({ choice, selected, onSelect }: Props) {
  const { name, image } = choice;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${name} mode`}
      aria-pressed={selected}
      className="block cursor-pointer transition-transform hover:-translate-y-0.5"
    >
      <SelectionCorners selected={selected} className="flex flex-col items-center gap-1">
        <Sprite src={image} alt="" scale={0.25} eager />
        <span className="font-display text-pixel-8 uppercase">{name}</span>
      </SelectionCorners>
    </button>
  );
}
