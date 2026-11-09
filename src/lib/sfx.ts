/**
 * Sound effects, synthesised with the Web Audio API (no audio library, ~0 KB of assets except
 * the click). Ideas carried over from Aniket's previous portfolio: soft noise "whoosh" on hover,
 * click.mp3 on click, rising arpeggio when sound turns on. Pixel-game extras: coin on START,
 * key ticks in the terminal.
 *
 * Rules (requirements §5): off by default, nothing plays before the visitor turns it on with a
 * click, the choice is remembered, and every sound has a visual twin (hover lift, button press).
 */
type Sfx = 'hover' | 'click' | 'type' | 'start' | 'on' | 'off';

const KEY = 'sound';
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let whoosh: AudioBuffer | null = null;
let click: AudioBuffer | null = null;

export function soundOn(): boolean {
  try {
    return localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // private mode: still works for this page view
  }
  listeners.forEach((l) => l());
  play(on ? 'on' : 'off', true);
}

export function subscribeSound(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function audio(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  if (!click) {
    click = ctx.createBuffer(1, 1, ctx.sampleRate); // placeholder until the file decodes
    fetch('/sounds/click.mp3')
      .then((r) => r.arrayBuffer())
      .then((b) => ctx!.decodeAudioData(b))
      .then((buf) => (click = buf))
      .catch(() => {});
  }
  return ctx;
}

/** Short pink-noise burst, built once (from the previous portfolio's hover sound). */
function whooshBuffer(a: AudioContext): AudioBuffer {
  if (whoosh) return whoosh;
  const size = Math.floor(a.sampleRate * 0.1);
  whoosh = a.createBuffer(1, size, a.sampleRate);
  const out = whoosh.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; // prettier-ignore
  for (let i = 0; i < size; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.08;
    b6 = w * 0.115926;
  }
  return whoosh;
}

/** One enveloped oscillator note. */
function note(
  a: AudioContext,
  freq: number,
  at: number,
  len: number,
  vol: number,
  type: OscillatorType,
) {
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(vol, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, at + len);
  osc.connect(gain).connect(a.destination);
  osc.start(at);
  osc.stop(at + len + 0.02);
}

/** Play an effect if sound is on (`force` = play anyway, for the toggle's own feedback). */
export function play(kind: Sfx, force = false) {
  if (!force && !soundOn()) return;
  try {
    const a = audio();
    const t = a.currentTime;
    switch (kind) {
      case 'hover': {
        const src = a.createBufferSource();
        src.buffer = whooshBuffer(a);
        const band = a.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 1600;
        band.Q.value = 0.6;
        const gain = a.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        src.connect(band).connect(gain).connect(a.destination);
        src.start(t);
        break;
      }
      case 'click': {
        const src = a.createBufferSource();
        src.buffer = click;
        src.connect(a.destination);
        src.start(t);
        break;
      }
      case 'type':
        note(a, 1800 + Math.random() * 400, t, 0.02, 0.025, 'square');
        break;
      case 'start': // 8-bit coin: B5 → E6
        note(a, 988, t, 0.08, 0.06, 'square');
        note(a, 1319, t + 0.08, 0.35, 0.06, 'square');
        break;
      case 'on': // C5 E5 G5 C6
        [523, 659, 784, 1047].forEach((f, i) => note(a, f, t + i * 0.06, 0.08, 0.1, 'sine'));
        break;
      case 'off': // G5 → C5
        [784, 523].forEach((f, i) => note(a, f, t + i * 0.08, 0.1, 0.07, 'sine'));
        break;
    }
  } catch {
    // Sound is decoration; never break the page over it.
  }
}
