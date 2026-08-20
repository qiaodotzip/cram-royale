// Procedural audio — synthwave loop + casino SFX, all generated with the Web
// Audio API so there are zero asset files and nothing to violate a strict CSP.
// Everything is gated behind the first user gesture (autoplay policy).

let ctx = null;
let master, musicGain, sfxGain;
let musicOn = true, sfxOn = true, started = false;
let schedulerTimer = null;

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // midi → Hz

function ensure() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
  musicGain = ctx.createGain(); musicGain.gain.value = 0.0; musicGain.connect(master);
  sfxGain = ctx.createGain(); sfxGain.gain.value = 0.9; sfxGain.connect(master);
}

// ── a single synth voice ─────────────────────────────────────────────────────
function voice(freq, t, dur, { type = 'sawtooth', gain = 0.2, dest, glideTo, filter } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(filter, t);
    o.connect(f); node = f;
  }
  node.connect(g);
  g.connect(dest || sfxGain);
  o.start(t); o.stop(t + dur + 0.05);
  return o;
}

function noise(t, dur, { gain = 0.2, dest, hp = 2000 } = {}) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(dest || sfxGain);
  src.start(t); src.stop(t + dur);
}

// ── the synthwave loop ───────────────────────────────────────────────────────
// A slow minor progression (Am–F–C–G) with an arpeggio, pad and soft drums.
const BPM = 96;
const STEP = 60 / BPM / 2; // eighth notes
const PROG = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [48, 52, 55], // C
  [55, 59, 62], // G
];
let step16 = 0, nextTime = 0;

function scheduleStep(bar, s, t) {
  const chord = PROG[bar % PROG.length];
  // pad on the downbeat of each bar
  if (s === 0) {
    chord.forEach((n) => voice(NOTE(n + 12), t, STEP * 8, {
      type: 'sawtooth', gain: 0.045, dest: musicGain, filter: 1400,
    }));
  }
  // bass every quarter
  if (s % 2 === 0) {
    voice(NOTE(chord[0] - 12), t, STEP * 1.6, { type: 'square', gain: 0.10, dest: musicGain, filter: 800 });
  }
  // arpeggio
  const arpNote = chord[s % chord.length] + 24;
  voice(NOTE(arpNote), t, STEP * 0.9, { type: 'triangle', gain: 0.05, dest: musicGain });
  // drums: kick on 0/4, hat on odd
  if (s % 4 === 0) voice(90, t, 0.14, { type: 'sine', gain: 0.22, dest: musicGain, glideTo: 45 });
  if (s % 2 === 1) noise(t, 0.03, { gain: 0.03, dest: musicGain, hp: 6000 });
}

function scheduler() {
  const ahead = 0.2;
  while (nextTime < ctx.currentTime + ahead) {
    const bar = Math.floor(step16 / 8);
    scheduleStep(bar, step16 % 8, nextTime);
    nextTime += STEP;
    step16 = (step16 + 1) % 32;
  }
}

// ── public API ───────────────────────────────────────────────────────────────
export const Audio = {
  init() {
    ensure();
    if (ctx.state === 'suspended') ctx.resume();
    if (!started) {
      started = true;
      nextTime = ctx.currentTime + 0.1;
      schedulerTimer = setInterval(scheduler, 25);
      this.setMusic(musicOn);
    }
  },
  setMusic(on) {
    musicOn = on; ensure();
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(on ? 0.5 : 0.0, ctx.currentTime + 0.4);
    return musicOn;
  },
  toggleMusic() { return this.setMusic(!musicOn); },
  setSfx(on) { sfxOn = on; return sfxOn; },
  toggleSfx() { sfxOn = !sfxOn; if (sfxOn) this.click(); return sfxOn; },
  get isMusicOn() { return musicOn; },
  get isSfxOn() { return sfxOn; },

  // ── SFX ──
  _guard() { if (!ctx || !sfxOn) return false; if (ctx.state === 'suspended') ctx.resume(); return true; },
  click() { if (!this._guard()) return; const t = ctx.currentTime; voice(660, t, 0.05, { type: 'square', gain: 0.12 }); },
  hover() { if (!this._guard()) return; const t = ctx.currentTime; voice(880, t, 0.03, { type: 'sine', gain: 0.04 }); },
  deal() { if (!this._guard()) return; const t = ctx.currentTime; noise(t, 0.06, { gain: 0.10, hp: 3000 }); voice(520, t, 0.05, { type: 'square', gain: 0.06 }); },
  lockin() {
    if (!this._guard()) return; const t = ctx.currentTime;
    voice(300, t, 0.18, { type: 'sawtooth', gain: 0.14, glideTo: 600, filter: 1800 });
    noise(t, 0.12, { gain: 0.06, hp: 1200 });
  },
  coin(n = 4) {
    if (!this._guard()) return; const t = ctx.currentTime;
    for (let i = 0; i < n; i++) voice(1200 + i * 180, t + i * 0.05, 0.08, { type: 'triangle', gain: 0.10 });
  },
  correct() {
    if (!this._guard()) return; const t = ctx.currentTime;
    [0, 4, 7, 12].forEach((iv, i) => voice(NOTE(72 + iv), t + i * 0.07, 0.22, { type: 'triangle', gain: 0.12 }));
  },
  wrong() {
    if (!this._guard()) return; const t = ctx.currentTime;
    voice(200, t, 0.35, { type: 'sawtooth', gain: 0.14, glideTo: 70, filter: 900 });
    voice(196, t, 0.35, { type: 'square', gain: 0.06 });
  },
  jackpot() {
    if (!this._guard()) return; const t = ctx.currentTime;
    const scale = [72, 76, 79, 84, 88, 91, 96];
    scale.forEach((n, i) => voice(NOTE(n), t + i * 0.06, 0.3, { type: 'square', gain: 0.13 }));
    for (let i = 0; i < 10; i++) voice(1500 + Math.random() * 1500, t + 0.4 + i * 0.04, 0.1, { type: 'triangle', gain: 0.08 });
  },
  rugpull() {
    if (!this._guard()) return; const t = ctx.currentTime;
    voice(500, t, 0.6, { type: 'sawtooth', gain: 0.16, glideTo: 40, filter: 700 });
    noise(t + 0.05, 0.5, { gain: 0.10, hp: 500 });
  },
  achievement() {
    if (!this._guard()) return; const t = ctx.currentTime;
    [76, 81, 88].forEach((n, i) => voice(NOTE(n), t + i * 0.09, 0.4, { type: 'triangle', gain: 0.12 }));
  },
  glitch() {
    if (!this._guard()) return; const t = ctx.currentTime;
    for (let i = 0; i < 6; i++) noise(t + i * 0.03, 0.02, { gain: 0.08, hp: 1000 + Math.random() * 4000 });
  },
};
