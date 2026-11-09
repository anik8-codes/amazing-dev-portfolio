'use client';

import { useRef, useState } from 'react';

const SIZE = 112;

/** Touch controls (only on coarse pointers): a thumb stick bottom-left and a jump button. */
export function Joystick({
  onStick,
  onJump,
}: {
  onStick: (x: number, y: number) => void;
  onJump: () => void;
}) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const update = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect();
    let x = (e.clientX - r.left - r.width / 2) / (SIZE / 2);
    let y = (e.clientY - r.top - r.height / 2) / (SIZE / 2);
    const l = Math.hypot(x, y);
    if (l > 1) {
      x /= l;
      y /= l;
    }
    setKnob({ x, y });
    onStick(x, -y);
  };
  const end = () => {
    setKnob({ x: 0, y: 0 });
    onStick(0, 0);
  };

  return (
    <div data-ui className="hidden pointer-coarse:block">
      <div
        ref={base}
        role="presentation"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e);
        }}
        onPointerMove={(e) => e.buttons && update(e)}
        onPointerUp={end}
        onPointerCancel={end}
        className="absolute bottom-6 left-6 touch-none rounded-full border-2 border-ink bg-white/70"
        style={{ width: SIZE, height: SIZE }}
      >
        <span
          className="absolute top-1/2 left-1/2 size-12 rounded-full bg-ink"
          style={{
            translate: `calc(-50% + ${knob.x * (SIZE / 2 - 24)}px) calc(-50% + ${knob.y * (SIZE / 2 - 24)}px)`,
          }}
        />
      </div>
      <button
        type="button"
        onPointerDown={onJump}
        aria-label="jump"
        className="absolute right-6 bottom-6 size-16 touch-none rounded-full border-2 border-ink bg-red font-display text-pixel-8 text-white uppercase shadow-[3px_3px_0_var(--color-ink)]"
      >
        jump
      </button>
    </div>
  );
}
