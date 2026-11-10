'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SoundOffIcon, SoundOnIcon, SunIcon } from '@/components/ui/Icons';
import { musicPlaying, setMusic, subscribeMusic } from '@/lib/music';
import { setSound, soundOn, subscribeSound } from '@/lib/sfx';
import { getTheme, setTheme, subscribeTheme } from '@/lib/theme';

const btn =
  'grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-panel aria-pressed:text-red';

/** Sound on/off. Off by default; the first click is the user gesture browsers require. */
export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, soundOn, () => false);
  return (
    <button
      type="button"
      data-sfx="none"
      aria-pressed={on}
      aria-label="sound"
      data-umami-event="sound_toggle"
      data-umami-event-to={on ? 'off' : 'on'}
      title={on ? 'sound on' : 'sound off'}
      onClick={() => setSound(!on)}
      className={btn}
    >
      {on ? <SoundOnIcon /> : <SoundOffIcon />}
    </button>
  );
}

/** Background music (an original chiptune loop). The bars dance while it plays. */
export function MusicToggle() {
  const on = useSyncExternalStore(subscribeMusic, musicPlaying, () => false);
  return (
    <button
      type="button"
      data-sfx="none"
      aria-pressed={on}
      aria-label="music"
      title={on ? 'pause music' : 'play music'}
      onClick={() => setMusic(!on)}
      className={btn}
    >
      <span aria-hidden className="flex h-4 items-end gap-[3px]">
        {[0.6, 1, 0.75, 0.9].map((h, i) => (
          <span
            key={i}
            className={`w-[3px] origin-bottom rounded-full bg-current ${on ? 'animate-eq' : ''}`}
            style={{ height: `${h * 100}%`, animationDelay: `${i * -0.23}s` }}
          />
        ))}
      </span>
    </button>
  );
}

/** Light / dark. Default follows the OS; the switch spreads as a circle from the button. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as const);
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label="dark mode"
      title={dark ? 'switch to light' : 'switch to dark'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={btn}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
