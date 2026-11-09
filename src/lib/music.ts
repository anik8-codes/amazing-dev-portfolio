/**
 * Background music: a short original chiptune loop, played live with the Web Audio API (no
 * audio file). Am – F – C – G at 92 bpm: square-wave bass, a triangle arpeggio, soft noise hats,
 * all through a low-pass filter so it sits quietly behind the page.
 *
 * Off by default and only ever started by a click (requirements §5); it keeps playing across
 * page changes because the module outlives them.
 */
const BPM = 92;
const STEP = 60 / BPM / 4; // sixteenth notes
// chord roots (MIDI) and the arpeggio over each, one bar per chord
const BARS = [
  { root: 45, arp: [57, 60, 64, 69] }, // Am
  { root: 41, arp: [53, 57, 60, 65] }, // F
  { root: 48, arp: [55, 60, 64, 67] }, // C
  { root: 43, arp: [55, 59, 62, 67] }, // G
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 1, 2];
const BASS = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0];

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let timer = 0;
let step = 0;
let nextAt = 0;
let playing = false;

function tone(type: OscillatorType, freq: number, at: number, dur: number, vol: number) {
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(out!);
  o.start(at);
  o.stop(at + dur + 0.02);
}

function hat(at: number, vol: number) {
  const len = Math.floor(ctx!.sampleRate * 0.03);
  const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx!.createBufferSource();
  const g = ctx!.createGain();
  g.gain.value = vol;
  src.buffer = buf;
  src.connect(g).connect(out!);
  src.start(at);
}

/** Schedule notes a little ahead of time so timing stays tight even if the tab is busy. */
function schedule() {
  while (nextAt < ctx!.currentTime + 0.12) {
    const bar = BARS[Math.floor(step / 16) % BARS.length]!;
    const s = step % 16;
    tone('triangle', hz(bar.arp[ARP[s]!]!), nextAt, STEP * 1.6, 0.16);
    if (BASS[s]) tone('square', hz(bar.root), nextAt, STEP * 2.2, 0.07);
    if (s % 4 === 2) hat(nextAt, 0.05);
    nextAt += STEP;
    step++;
  }
}

export function musicPlaying() {
  return playing;
}

export function subscribeMusic(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Start or stop the loop (call from a click). */
export function setMusic(on: boolean) {
  if (on === playing) return;
  playing = on;
  if (on) {
    ctx ??= new AudioContext();
    void ctx.resume();
    out = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2400;
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2); // fade in
    out.connect(lp).connect(ctx.destination);
    nextAt = ctx.currentTime + 0.05;
    timer = window.setInterval(schedule, 25);
  } else if (ctx && out) {
    const g = out;
    g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15); // fade out
    window.clearInterval(timer);
    window.setTimeout(() => g.disconnect(), 800);
  }
  listeners.forEach((l) => l());
}
