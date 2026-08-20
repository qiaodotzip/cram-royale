// CRAM // S07 — app orchestrator.
import { API } from './api.js';
import { Audio } from './audio.js';
import { renderWidget, md } from './render.js';
import { burst, glitch, onKonami, randomLoader, guessOdds } from './eggs.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => Number(n).toLocaleString('en-US');

const MILESTONES_HINT = 'right or wrong, it counts. next milestone incoming.';

const state = {
  player: null,
  mode: 'grind',
  queue: [],
  mockList: [],
  mockIdx: 0,
  current: null,
  currentQ: null,
  answered: false,
  mock: null,
  lastAnnId: null,   // null = uninitialised (first poll seeds it silently)
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  // first pointer starts the audio context (autoplay policy)
  addEventListener('pointerdown', () => Audio.init(), { once: true });

  wireHome();
  wirePlay();
  wireBoard();
  wireStatic();
  onKonami(() => { document.body.classList.toggle('crt'); glitch(500); });

  const saved = localStorage.getItem('cram_name');
  if (saved) $('#name-input').value = saved;

  // live feed polling (runs everywhere)
  refreshLive(); setInterval(refreshLive, 15000);
  pollAnnouncements(true); setInterval(() => pollAnnouncements(false), 9000);

  show('home');
}

function show(name) {
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
  window.scrollTo(0, 0);
}

// ── home ─────────────────────────────────────────────────────────────────────
function wireHome() {
  $$('#screen-home .hud-btn').forEach((b) => {
    b.addEventListener('mouseenter', () => Audio.hover());
    b.addEventListener('click', () => onMenu(b.dataset.action));
  });
  $('#name-form').addEventListener('submit', (e) => { e.preventDefault(); onMenu('grind'); });
}

async function ensurePlayer() {
  const name = $('#name-input').value.trim();
  if (!name) {
    const f = $('#name-input');
    f.focus(); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
    Audio.wrong();
    return null;
  }
  if (state.player && state.player.handle.toLowerCase() === name.toLowerCase()) return state.player;
  const p = await API.player(name).catch((e) => { alert(e.message); return null; });
  if (p) { state.player = p; localStorage.setItem('cram_name', p.handle); }
  return p;
}

async function onMenu(action) {
  Audio.click();
  if (action === 'leaderboard') return openBoard();
  if (action === 'info') return show('info');
  const p = await ensurePlayer();
  if (!p) return;
  if (action === 'grind') startGrind();
  if (action === 'mock') startMock();
}

// ── loaders ──────────────────────────────────────────────────────────────────
function showLoader() { $('#loader-text').textContent = randomLoader(); $('#loader').classList.add('show'); }
function hideLoader() { $('#loader').classList.remove('show'); }

// ── grind ────────────────────────────────────────────────────────────────────
async function startGrind() {
  state.mode = 'grind'; showLoader();
  try {
    const { questions } = await API.questions('grind');
    if (!questions.length) throw new Error('no questions');
    state.pool = questions;
    state.queue = shuffle(questions);
    $('#play-mode').textContent = 'GRIND';
    setTimeout(() => { hideLoader(); show('play'); nextGrind(); }, 500);
  } catch (e) { hideLoader(); alert('could not load: ' + e.message); }
}
function nextGrind() {
  if (!state.queue.length) state.queue = shuffle(state.pool);
  renderQuestion(state.queue.shift());
}

// ── mock ─────────────────────────────────────────────────────────────────────
async function startMock() {
  state.mode = 'mock'; showLoader();
  try {
    const { questions } = await API.questions('mock');
    if (!questions.length) throw new Error('no mock questions');
    state.mockList = questions; state.mockIdx = 0;
    state.mock = { score: 0, max: questions.reduce((a, q) => a + Number(q.points), 0), correct: 0, total: questions.length };
    $('#play-mode').textContent = 'MOCK';
    setTimeout(() => { hideLoader(); show('play'); renderQuestion(state.mockList[0]); }, 500);
  } catch (e) { hideLoader(); alert('could not load: ' + e.message); }
}

// ── render a question ────────────────────────────────────────────────────────
function renderQuestion(q) {
  state.answered = false;
  state.currentQ = q;

  const rp = $('#result-panel'); rp.classList.add('hidden'); rp.innerHTML = '';
  $('#odds-panel').classList.remove('hidden');
  $('#btn-confirm').classList.remove('hidden');
  $('#btn-confirm').disabled = false;

  // top bar
  if (state.mode === 'grind') {
    $('#play-counter').textContent = `ANSWERED · ${fmt(state.player.answered || 0)}`;
    $('#play-progressbar').style.width = `${(((state.player.answered || 0) % 25) / 25) * 100}%`;
  } else {
    $('#play-counter').textContent = `Q ${state.mockIdx + 1} / ${state.mockList.length}`;
    $('#play-progressbar').style.width = `${(state.mockIdx / state.mockList.length) * 100}%`;
  }

  // header
  $('#q-id').textContent = String(q.seq).padStart(3, '0');
  $('#q-topic').textContent = q.topic;
  $('#q-points').textContent = `${q.points} PT${Number(q.points) === 1 ? '' : 'S'}`;
  const src = $('#q-source');
  src.textContent = q.source === 'mock' ? 'MOCK' : 'PREDICTED';
  src.className = 'q-source ' + (q.source === 'mock' ? 'mock' : '');

  // body
  state.current = renderWidget(q, () => {});
  const body = $('#q-body'); body.innerHTML = '';
  body.append(el('div', 'q-stem', md(q.stem)));
  const widgetOwnsCode = q.type === 'dropdowns' && q.code && /⟨/.test(q.code);
  if (q.code && !widgetOwnsCode) { const pre = document.createElement('pre'); pre.className = 'md-pre'; pre.textContent = q.code; body.append(pre); }
  body.append(state.current.el);
  if (state.current.focus) setTimeout(() => state.current.focus(), 40);

  // guess odds
  const o = guessOdds(q);
  $('#odds-value').textContent = o.label;
  $('#odds-kind').textContent = o.kind;
  $('#odds-verdict').textContent = o.verdict;
  $('#odds-note').textContent = o.note;

  Audio.next();
}

// ── confirm / grade ──────────────────────────────────────────────────────────
async function confirmAnswer() {
  if (state.answered) return;
  const q = state.currentQ;
  const response = state.current.getResponse();
  const blank = response == null ||
    (Array.isArray(response) && response.length === 0) ||
    (typeof response === 'object' && !Array.isArray(response) && Object.values(response).every((v) => !v));
  if (blank && !confirm('nothing selected — lock in a blank answer?')) return;

  state.answered = true;
  $('#btn-confirm').disabled = true;
  Audio.select();
  try {
    const res = await API.check({ questionId: q.id, response, handle: state.player.handle, mode: state.mode });
    applyResult(q, res);
  } catch (e) { state.answered = false; $('#btn-confirm').disabled = false; alert('check failed: ' + e.message); }
}

function applyResult(q, res) {
  state.current.lock();
  state.current.reveal(res.correctAnswer, state.current.getResponse());
  $('#btn-confirm').classList.add('hidden');
  $('#odds-panel').classList.add('hidden');

  const verdict = res.correct ? 'CORRECT' : (res.fraction > 0 ? 'PARTIAL' : 'WRONG');
  const vclass = res.correct ? 'v-correct' : (res.fraction > 0 ? 'v-partial' : 'v-wrong');
  // Explanation shown when NOT fully correct (the point of the grinder), plus a
  // small "why" toggle when correct.
  const showExplain = !res.correct;
  const last = state.mode === 'mock' ? state.mockIdx + 1 >= state.mockList.length : false;
  const nextLabel = state.mode === 'mock' ? (last ? 'SEE RESULTS' : 'NEXT') : 'NEXT';

  const rp = $('#result-panel');
  rp.innerHTML = `
    <div class="verdict ${vclass}">${verdict}</div>
    <div class="result-line">${res.pointsAwarded} / ${q.points} pts${state.mode === 'grind' && res.answered != null ? ` · answered ${fmt(res.answered)}` : ''}</div>
    ${showExplain ? `<div class="explanation">${md(res.explanation)}</div>`
                  : `<button id="why-btn" class="mini-btn" style="margin-bottom:12px">WHY? ▾</button><div id="why-box" class="explanation" style="display:none">${md(res.explanation)}</div>`}
    <button id="btn-next" class="hud-btn primary"><span class="btn-bar"></span><span class="btn-label">${nextLabel}</span><span class="btn-arrow">▶</span></button>
  `;
  rp.classList.remove('hidden');
  $('#btn-next').addEventListener('click', goNext);
  const why = $('#why-btn');
  if (why) why.addEventListener('click', () => { const b = $('#why-box'); const open = b.style.display !== 'none'; b.style.display = open ? 'none' : 'block'; why.textContent = open ? 'WHY? ▾' : 'WHY? ▴'; Audio.click(); });

  // sfx
  if (res.correct) Audio.correct(); else Audio.wrong();

  // grind bookkeeping
  if (state.mode === 'grind') {
    if (res.answered != null) {
      state.player.answered = res.answered;
      $('#play-counter').textContent = `ANSWERED · ${fmt(res.answered)}`;
      $('#play-progressbar').style.width = `${((res.answered % 25) / 25) * 100}%`;
    }
    if (res.milestone) celebrateMilestone(res.milestone);
  }
  // mock bookkeeping
  if (state.mode === 'mock') {
    state.mock.score += res.pointsAwarded;
    if (res.correct) state.mock.correct++;
  }
}

function goNext() {
  Audio.click();
  if (state.mode === 'grind') return nextGrind();
  if (state.mockIdx + 1 < state.mockList.length) { state.mockIdx++; renderQuestion(state.mockList[state.mockIdx]); }
  else finishMock();
}

function celebrateMilestone(n) {
  burst(120);
  Audio.milestone();
  toast(`YOU HIT <span class="who">${n}</span> QUESTIONS ▚ keep grinding`, 'mine');
  // remember: don't double-toast our own announcement when the poll returns it
  state._justCelebrated = n;
}

// ── mock summary ─────────────────────────────────────────────────────────────
function finishMock() {
  const m = state.mock;
  const pct = Math.round((m.score / (m.max || 1)) * 100);
  $('#sum-score').textContent = `${round1(m.score)} / ${m.max}`;
  $('#sum-pct').textContent = `${pct}%`;
  $('#sum-correct').textContent = `${m.correct} / ${m.total}`;
  $('#sum-msg').textContent = pct >= 70 ? 'sharp. clock discipline on Friday and you\'re set.'
    : pct >= 50 ? 'passable. now go grind the weak spots.'
    : 'rough — but it\'s a mock. go grind, it\'s literally free reps.';
  if (pct >= 70) { burst(120); Audio.milestone(); }
  show('summary');
}

// ── leaderboard ──────────────────────────────────────────────────────────────
let boardTimer = null;
function wireBoard() {
  $('#btn-board-refresh').addEventListener('click', () => { Audio.click(); loadBoard(); });
  $('#btn-board-back').addEventListener('click', () => { Audio.click(); stopBoardTimer(); show('home'); });
}
function openBoard() { show('board'); loadBoard(); stopBoardTimer(); boardTimer = setInterval(loadBoard, 15000); }
function stopBoardTimer() { if (boardTimer) { clearInterval(boardTimer); boardTimer = null; } }
async function loadBoard() {
  const body = $('#board-body');
  if (!body.children.length) body.innerHTML = '<div class="board-loading">reading the board…</div>';
  try {
    const { rows } = await API.leaderboard();
    if (!rows.length) { body.innerHTML = '<div class="board-empty">no grinders yet. be the first — hit START GRIND.</div>'; return; }
    body.innerHTML = rows.map((r, i) => {
      const me = state.player && r.handle === state.player.handle ? ' me' : '';
      const top = i === 0 ? ' top' : '';
      const rank = ['01', '02', '03'][i] || String(i + 1).padStart(2, '0');
      const acc = Number(r.answered) ? Math.round((Number(r.correct) / Number(r.answered)) * 100) : 0;
      return `<div class="board-row${top}${me}"><span class="board-rank">${rank}</span><span class="board-name">${escapeHtml(r.handle)}</span><span class="board-val"><b>${fmt(r.answered)}</b> answered <span class="board-sub2">· ${acc}% acc</span></span></div>`;
    }).join('');
  } catch (e) { body.innerHTML = `<div class="board-empty">board offline: ${e.message}</div>`; }
}

// ── live feed + announcements ────────────────────────────────────────────────
async function refreshLive() {
  try {
    const s = await API.live();
    const g = `${s.grinding} grinding now`;
    const t = `${fmt(s.total_answered)} answered all-time`;
    $('#live-count').textContent = g;
    $('#live-total').textContent = t;
    const pl = $('#play-live'); if (pl) pl.textContent = `◢ ${s.grinding} online`;
  } catch {}
}
async function pollAnnouncements(first) {
  try {
    const { rows } = await API.announcements(state.lastAnnId ?? 0);
    if (!rows.length) { if (first && state.lastAnnId == null) state.lastAnnId = 0; return; }
    const maxId = Math.max(...rows.map((r) => r.id));
    if (first || state.lastAnnId == null) {
      state.lastAnnId = maxId;
      buildTicker(rows);
      return; // don't spam old milestones on load
    }
    // newest last so toasts stack in order
    rows.slice().reverse().forEach((r) => {
      if (r.id <= state.lastAnnId) return;
      const mine = state.player && r.handle === state.player.handle;
      if (mine && state._justCelebrated === Number(r.milestone)) return; // already celebrated inline
      toast(`<span class="who">${escapeHtml(r.handle)}</span> just hit <span class="hit">${r.milestone}</span> questions`, mine ? 'mine' : '');
    });
    state.lastAnnId = Math.max(state.lastAnnId, maxId);
    buildTicker(rows);
  } catch {}
}
function buildTicker(rows) {
  const track = $('#ticker-track');
  if (!rows || !rows.length) { track.textContent = 'no milestones yet — be the first to hit 10. grind now ▚'; track.classList.remove('scroll'); return; }
  const parts = rows.slice(0, 10).map((r) => `<span class="who">${escapeHtml(r.handle)}</span> hit <span class="hit">${r.milestone}</span>`);
  const line = parts.join('  ▚  ') + '  ▚  ';
  track.innerHTML = line + line; // duplicate for seamless loop
  track.classList.add('scroll');
}

// ── static screens ───────────────────────────────────────────────────────────
function wireStatic() {
  $('#btn-info-back').addEventListener('click', () => { Audio.click(); show('home'); });
  $('#btn-sum-grind').addEventListener('click', () => { Audio.click(); startGrind(); });
  $('#btn-sum-home').addEventListener('click', () => { Audio.click(); show('home'); });
}
function wirePlay() {
  $('#btn-confirm').addEventListener('click', confirmAnswer);
  $('#btn-exit').addEventListener('click', () => { Audio.click(); if (confirm('leave this run?')) show('home'); });
  $('#btn-sfx').addEventListener('click', () => { Audio.init(); const on = Audio.toggleSfx(); $('#btn-sfx').textContent = on ? '◧ SFX' : '◨ MUTE'; });
}

// ── helpers ──────────────────────────────────────────────────────────────────
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function el(tag, cls, html) { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function round1(n) { return Number.isInteger(n) ? n : Math.round(n * 10) / 10; }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function toast(html, cls = '') {
  const stack = $('#toast-stack');
  const t = document.createElement('div'); t.className = 'toast ' + cls; t.innerHTML = html;
  stack.append(t); requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4600);
  while (stack.children.length > 4) stack.firstChild.remove();
}
