// Light effects + the guess-odds analyzer. HUD-themed, minimal.
import { Audio } from './audio.js';

// ── data-burst (monochrome + red, fits the HUD look) ─────────────────────────
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
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
    cctx.globalAlpha = Math.min(1, p.life / 26); cctx.fillStyle = p.color;
    cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * (p.sq ? 1 : 0.4));
    cctx.restore();
  }
  if (particles.length) raf = requestAnimationFrame(tick);
  else { cancelAnimationFrame(raf); raf = null; }
}
const HUD = ['#16171b', '#e2342f', '#9a9b9f', '#ffffff'];
export function burst(n = 90, x = innerWidth / 2, y = innerHeight / 2) {
  ensureCanvas();
  for (let i = 0; i < n; i++) particles.push({
    x, y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 1) * 15 - 3, g: 0.4,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5,
    size: 4 + Math.random() * 7, color: HUD[i % HUD.length], sq: Math.random() < 0.5, life: 80 + Math.random() * 30,
  });
  if (!raf) tick();
}

// ── screen glitch ────────────────────────────────────────────────────────────
export function glitch(ms = 400) {
  document.body.classList.add('glitching'); Audio.glitch();
  setTimeout(() => document.body.classList.remove('glitching'), ms);
}

// ── Konami → CRT scanline toggle (tiny secret) ───────────────────────────────
export function onKonami(cb) {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
    if (i === seq.length) { i = 0; cb(); }
  });
}

// ── loading quips ────────────────────────────────────────────────────────────
export const LOADERS = [
  'CALIBRATING SIGMOID…', 'NORMALIZING FEATURE VECTOR…', 'BUILDING MAX-HEAP OF REGRETS…',
  'COMPUTING P(PASS | VIBES)…', 'TRANSPOSING ERROR — FIRST, ALWAYS…', 'SEEDING THE GRIND…',
  'RETICULATING β COEFFICIENTS…', 'INDUCING FOMO…',
];
export const randomLoader = () => LOADERS[Math.floor(Math.random() * LOADERS.length)];

// ── the guess-odds analyzer (the reinterpreted "gambling") ───────────────────
// Computes P(full marks by pure guessing) from question STRUCTURE only — never
// touches the answer, so nothing leaks. Returns display bits + a funny verdict.
export function guessOdds(q) {
  const p = q.payload || {};
  let combos = 1, kind = '';
  switch (q.type) {
    case 'mcq': combos = (p.options?.length || 4); kind = `1 of ${combos} choices`; break;
    case 'multiselect': {
      const n = p.options?.length || 4;
      combos = Math.pow(2, n); kind = `${n} options → 2^${n} = ${combos} combos`; break;
    }
    case 'dropdowns': combos = (p.blanks || []).reduce((a, b) => a * (b.options?.length || 1), 1); kind = `${(p.blanks || []).length} blanks`; break;
    case 'matching': {
      const k = (p.left || []).length, m = (p.options || []).length || 1;
      combos = Math.pow(m, k); kind = `${k} rows × ${m} options`; break;
    }
    case 'ordering': { const n = (p.items || []).length; combos = factorial(n); kind = `${n}! orderings`; break; }
    case 'numeric': combos = Infinity; kind = 'infinite real numbers'; break;
    case 'text': combos = Infinity; kind = 'free text'; break;
    default: combos = 4;
  }
  const pct = combos === Infinity ? 0 : 1 / combos;
  return {
    pct,                                   // 0..1
    oneIn: combos,                         // Infinity for numeric/text
    kind,
    label: combos === Infinity ? '≈ 0%' : (pct >= 0.01 ? `${(pct * 100).toFixed(pct >= 0.1 ? 0 : 1)}%` : `1 in ${fmt(combos)}`),
    verdict: verdictFor(q, pct),
    note: noteFor(q),
  };
}
function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function fmt(n) { return n === Infinity ? '∞' : Number(n).toLocaleString('en-US'); }

function verdictFor(q, pct) {
  if (q.type === 'numeric' || q.type === 'text') return 'guessing is not a strategy, king.';
  if (pct >= 0.5) return 'basically a coin flip — you could genuinely cook.';
  if (pct >= 0.25) return 'one-in-a-few. cope is statistically viable.';
  if (pct >= 0.1) return 'slim. maybe actually read the question.';
  if (pct >= 0.02) return 'grim. a small prayer is advised.';
  return 'better odds finding parking at SUTD, tbh.';
}
function noteFor(q) {
  if (q.type === 'multiselect') return 'ticking all of them trips the −50%-per-wrong tax → usually a clean 0.';
  if (q.type === 'ordering') return 'yes, that number is real. good luck.';
  if (q.type === 'numeric') return 'a scientific calculator and actual maths are your only friends here.';
  if (q.type === 'dropdowns') return 'each blank multiplies your suffering.';
  return '';
}
