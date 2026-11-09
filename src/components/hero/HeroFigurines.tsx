'use client';

import { useState } from 'react';
import { figurineHint, figurines } from '@/config/hero';
import { defaultModeId } from '@/config/modes';
import { Figurine } from './Figurine';
import { Placed } from './Placed';

/** Keeps character selection local to the hero, without links or route changes. */
export function HeroFigurines({ className }: { className: string }) {
  const [selected, setSelected] = useState(defaultModeId);

  return (
    <div className={className} role="group" aria-label={figurineHint.label}>
      <Placed pos={figurineHint.pos} className="self-center">
        <p className="w-24 text-sm text-muted xl:w-auto">{figurineHint.text}</p>
      </Placed>
      {figurines.map((f) => (
        <Placed key={f.look} pos={f.pos}>
          <Figurine
            look={f.look}
            selected={f.look === selected}
            onSelect={() => setSelected(f.look)}
          />
        </Placed>
      ))}
    </div>
  );
}
