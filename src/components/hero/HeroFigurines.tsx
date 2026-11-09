'use client';

import { useState } from 'react';
import { figurineHint } from '@/config/hero';
import { defaultModeId } from '@/config/modes';
import { Figurine, type FigurineChoice } from './Figurine';

/** Small inline character row; selecting a look stays on the landing page. */
export function HeroFigurines({
  className,
  choices,
}: {
  className?: string;
  choices: readonly FigurineChoice[];
}) {
  const [selected, setSelected] = useState(defaultModeId);
  return (
    <div className={className} role="group" aria-label={figurineHint.label}>
      <p className="sr-only">{figurineHint.text}</p>
      {choices.map((choice) => (
        <Figurine
          key={choice.id}
          choice={choice}
          selected={choice.id === selected}
          onSelect={() => setSelected(choice.id)}
        />
      ))}
    </div>
  );
}
