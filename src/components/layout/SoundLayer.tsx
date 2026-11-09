'use client';

import { useEffect } from 'react';
import { play } from '@/lib/sfx';

const TARGET = 'a, button, [data-sfx]';

/**
 * One set of page-wide listeners that give every link and button its sound, so no other
 * component needs audio code. Mark an element `data-sfx="start"` for the coin, `"type"` for
 * key ticks, `"none"` to stay silent. Renders nothing.
 */
export function SoundLayer() {
  useEffect(() => {
    let hovered: Element | null = null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element).closest(TARGET);
      if (!el || el === hovered || el.getAttribute('data-sfx') === 'none') return;
      hovered = el;
      play('hover');
    };
    const onOut = (e: PointerEvent) => {
      if (hovered && !hovered.contains(e.relatedTarget as Node | null)) hovered = null;
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest(TARGET);
      const kind = el?.getAttribute('data-sfx');
      if (!el || kind === 'none' || kind === 'type') return;
      play(kind === 'start' ? 'start' : 'click');
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as Element).closest('[data-sfx="type"]');
      if (typing && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace'))
        play('type');
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return null;
}
