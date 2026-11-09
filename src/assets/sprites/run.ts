import strip from './run.png';

/** A separate entry point keeps the full looks registry out of scroll/cursor bundles. */
export const run = { src: strip, frames: 8, frameWidth: strip.width / 8 } as const;
