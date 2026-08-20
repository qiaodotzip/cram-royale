// Silly features, easter eggs and visual flourishes.
import { Audio } from './audio.js';

// ── particle canvas (confetti + chip rain) ───────────────────────────────────
let canvas, cctx, particles = [], raf = null;
function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.id = 'fx-canvas';
  document.body.append(canvas);
  cctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); addEventListener('resize', resize);
}
function tick() {
  cctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.life > 0);
  for (const p of particles) {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot); cctx.globalAlpha = Math.min(1, p.life / 30);
    if (p.emoji) { cctx.font = `${p.size}px serif`; cctx.fillText(p.emoji, 0, 0); }
    else { cctx.fillStyle = p.color; cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); }
    cctx.restore();
  }
  if (particles.length) raf = requestAnimationFrame(tick);
  else { cancelAnimationFrame(raf); raf = null; }
}
const NEON = ['#00f0ff', '#ff2e97', '#b14dff', '#39ff14', '#ffe600'];
export function confetti(n = 120) {
  ensureCanvas();
  for (let i = 0; i < n; i++) particles.push({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight / 2,
    vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 1) * 16 - 4, g: 0.35,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    size: 6 + Math.random() * 8, color: NEON[i % NEON.length], life: 90 + Math.random() * 40,
  });
  if (!raf) tick();
}
export function chipRain(n = 40) {
  ensureCanvas();
  const chips = ['🪙', '💰', '🎰', '💸'];
  for (let i = 0; i < n; i++) particles.push({
    x: Math.random() * innerWidth, y: -30,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3, g: 0.06,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2,
    size: 20 + Math.random() * 16, emoji: chips[i % chips.length], life: 160,
  });
  if (!raf) tick();
}

// ── screen glitch ────────────────────────────────────────────────────────────
export function glitch(ms = 500) {
  document.body.classList.add('glitching');
  Audio.glitch();
  setTimeout(() => document.body.classList.remove('glitching'), ms);
}

// ── Konami code → HOUSE MODE ─────────────────────────────────────────────────
export function onKonami(cb) {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
    if (i === seq.length) { i = 0; cb(); }
  });
}

// ── achievements ─────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = {
  first_blood: { icon: '🎯', name: 'First Blood', desc: 'Answer your first question correctly.' },
  high_roller: { icon: '🤑', name: 'High Roller', desc: 'Win 500+ chips on a single question.' },
  all_in: { icon: '🎲', name: 'All In', desc: 'Go all-in on a wager.' },
  degenerate: { icon: '💀', name: 'Degenerate', desc: 'Go bankrupt. The house always wins.' },
  jackpot: { icon: '🎰', name: 'JACKPOT', desc: 'Hit a 3-answer hot streak.' },
  rugged: { icon: '📉', name: 'Rugged', desc: 'Get rugpulled by the house.' },
  actuary: { icon: '📊', name: 'The Actuary', desc: 'Finish a run with 90%+ accuracy.' },
  house_mode: { icon: '👁️', name: 'Behind the Curtain', desc: 'Discover HOUSE MODE.' },
  full_send: { icon: '🚀', name: 'Full Send', desc: 'Complete a Full Degen Run.' },
  no_ragrets: { icon: '🔥', name: 'No Ragrets', desc: 'Finish a run with exactly 0 chips.' },
  scholar: { icon: '🧠', name: 'Dean\'s List', desc: 'Score 40+ points in a single run.' },
  buyer: { icon: '🕳️', name: 'Buyer Beware', desc: 'Try to buy an answer.' },
};
export const Achievements = {
  key: 'cram_achievements',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch { return {}; } },
  has(id) { return !!this.get()[id]; },
  unlock(id) {
    if (this.has(id) || !ACHIEVEMENTS[id]) return false;
    const s = this.get(); s[id] = Date.now(); localStorage.setItem(this.key, JSON.stringify(s));
    toast(ACHIEVEMENTS[id]); Audio.achievement();
    return true;
  },
};
function toast(a) {
  const t = document.createElement('div');
  t.className = 'achv-toast';
  t.innerHTML = `<span class="achv-icon">${a.icon}</span><span><b>Achievement unlocked</b><br>${a.name} — ${a.desc}</span>`;
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4200);
}

// ── loading quips & odds quips ───────────────────────────────────────────────
export const LOADERS = [
  'Normalizing your feature vector…',
  'Computing P(pass | vibes)…',
  'Shuffling the deck of β coefficients…',
  'Transposing error FIRST, as always…',
  'Consulting the sigmoid oracle…',
  'Building max-heap of your regrets…',
  'Running gradient descent on your GPA…',
  'Checking if R² can be negative (it can)…',
  'Reticulating splines… wait, wrong course…',
  'Bribing the invigilator…',
];
export const randomLoader = () => LOADERS[Math.floor(Math.random() * LOADERS.length)];

export function oddsQuip(odds) {
  if (odds >= 75) return 'basically guaranteed to haunt you Friday';
  if (odds >= 60) return 'the house likes these odds';
  if (odds >= 45) return 'a coin flip with extra steps';
  if (odds >= 30) return 'longshot, but they love a surprise';
  return 'you\'d be unlucky… but you did pick this major';
}
