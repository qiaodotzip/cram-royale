// SFX only — short, clean UI sounds generated with the Web Audio API. No music.
let ctx = null, sfxGain = null, sfxOn = true;

function ensure() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  sfxGain = ctx.createGain();
  sfxGain.gain.value = 1.0;
  sfxGain.connect(ctx.destination);
}

function tone(freq, t, dur, { type = 'sine', gain = 0.15, glideTo, filter } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (filter) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter; o.connect(f); node = f; }
  node.connect(g); g.connect(sfxGain);
  o.start(t); o.stop(t + dur + 0.03);
}
function noise(t, dur, { gain = 0.12, hp = 2500 } = {}) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(sfxGain);
  src.start(t); src.stop(t + dur);
}

export const Audio = {
  init() { ensure(); if (ctx.state === 'suspended') ctx.resume(); },
  setSfx(on) { sfxOn = on; return sfxOn; },
  toggleSfx() { sfxOn = !sfxOn; if (sfxOn) this.click(); return sfxOn; },
  get isSfxOn() { return sfxOn; },

  // lazily create + resume the context so the first click after any gesture
  // reliably makes sound (autoplay policy is satisfied inside the handler).
  _g() { if (!sfxOn) return false; ensure(); if (ctx.state === 'suspended') ctx.resume(); return true; },
  click()  { if (!this._g()) return; const t = ctx.currentTime; tone(440, t, 0.05, { type: 'square', gain: 0.20 }); noise(t, 0.02, { gain: 0.08, hp: 4000 }); },
  hover()  { if (!this._g()) return; const t = ctx.currentTime; tone(760, t, 0.025, { type: 'sine', gain: 0.07 }); },
  select() { if (!this._g()) return; const t = ctx.currentTime; tone(560, t, 0.06, { type: 'triangle', gain: 0.18 }); },
  next()   { if (!this._g()) return; const t = ctx.currentTime; noise(t, 0.06, { gain: 0.12, hp: 2000 }); tone(300, t, 0.07, { type: 'sawtooth', gain: 0.14, glideTo: 520, filter: 1600 }); },
  correct(){ if (!this._g()) return; const t = ctx.currentTime; [72, 76, 79].forEach((n, i) => tone(440 * Math.pow(2, (n - 69) / 12), t + i * 0.07, 0.20, { type: 'triangle', gain: 0.22 })); },
  wrong()  { if (!this._g()) return; const t = ctx.currentTime; tone(180, t, 0.3, { type: 'sawtooth', gain: 0.22, glideTo: 90, filter: 800 }); },
  milestone(){ if (!this._g()) return; const t = ctx.currentTime; [72, 79, 84, 88].forEach((n, i) => tone(440 * Math.pow(2, (n - 69) / 12), t + i * 0.06, 0.26, { type: 'square', gain: 0.2 })); },
  glitch() { if (!this._g()) return; const t = ctx.currentTime; for (let i = 0; i < 5; i++) noise(t + i * 0.025, 0.025, { gain: 0.1, hp: 1500 + Math.random() * 3000 }); },
};
