'use client';

import { useState } from 'react';
import { figurineHint, figurines } from '@/config/hero';
import { defaultModeId } from '@/config/modes';
import { Figurine } from './Figurine';

/** Small inline character row; selecting a look stays on the landing page. */
export function HeroFigurines({ className }: { className?: string }) {
  const [selected, setSelected] = useState(defaultModeId);
  return (
    <div className={className} role="group" aria-label={figurineHint.label}>
      <p className="sr-only">{figurineHint.text}</p>
      {figurines.map((look) => (
        <Figurine
          key={look}
          look={look}
          selected={look === selected}
          onSelect={() => setSelected(look)}
        />
      ))}
    </div>
  );
}
