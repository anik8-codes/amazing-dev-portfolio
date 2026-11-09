'use client';

import { useSyncExternalStore } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
});

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 10_000);
  return () => clearInterval(id);
};

/** Live India time ("IST 14:56"). The server renders a placeholder; the browser fills it in. */
export function IstClock() {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(Date.now()),
    () => '--:--',
  );
  return (
    <span className="text-muted tabular-nums">
      IST <time>{time}</time>
    </span>
  );
}
