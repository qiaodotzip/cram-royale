// CRAM ROYALE — main app orchestrator.
import { API } from './api.js';
import { Audio } from './audio.js';
import { renderWidget, md } from './render.js';
import {
  confetti, chipRain, glitch, onKonami, Achievements, ACHIEVEMENTS,
  randomLoader, oddsQuip,
} from './eggs.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const MODE_META = {
  mock: { label: '📝 Mock Exam', blurb: 'The 21 real mock-final questions. The genuine article.' },
  predicted: { label: '🔮 Predicted Paper', blurb: 'Similar questions the AI thinks they might ask. Fresh drills.' },
  all: { label: '🎲 Full Degen Run', blurb: 'Everything, shuffled. Maximum chaos, maximum chips.' },
  blitz: { label: '⚡ Concept Blitz', blurb: 'Multi-select only. Fast money, brutal penalties.' },
};

const state = {
  player: null,
  mode: 'mock',
  questions: [],
  index: 0,
  houseMode: false,
  run: null,
  current: null, // active widget controller
  answered: false,
};

// ── boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

function init() {
  wireHud();
  wireLogin();
  wireModes();
  wireExam();
  wireResults();
  wireLeaderboard();

  onKonami(activateHouseMode);

  // any first click starts the audio engine (autoplay policy)
  const kick = () => { Audio.init(); updateSoundBtns(); removeEventListener('pointerdown', kick); };
  addEventListener('pointerdown', kick, { once: true });

  // auto-login returning players
  const saved = localStorage.getItem('cram_handle');
  const savedEmoji = localStorage.getItem('cram_emoji') || '🎰';
  if (saved) { $('#handle-input').value = saved; $('#emoji-input').value = savedEmoji; }

  renderAchievementsGrid();
  show('login');
}

// ── screen switching ─────────────────────────────────────────────────────────
function show(name) {
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
  $('#hud').classList.toggle('hidden', name === 'login');
  window.scrollTo(0, 0);
}

// ── HUD (persistent top bar) ─────────────────────────────────────────────────
function wireHud() {
  $('#btn-music').addEventListener('click', () => { Audio.init(); Audio.toggleMusic(); updateSoundBtns(); });
  $('#btn-sfx').addEventListener('click', () => { Audio.init(); Audio.toggleSfx(); updateSoundBtns(); });
  $('#btn-home').addEventListener('click', () => { Audio.click(); if (confirm('Bail on this run and return to the lobby?')) show('modes'); });
  $('#btn-leaderboard-hud').addEventListener('click', () => { Audio.click(); openLeaderboard(); });
}
function updateSoundBtns() {
  $('#btn-music').textContent = Audio.isMusicOn ? '🎵' : '🔇';
  $('#btn-sfx').textContent = Audio.isSfxOn ? '🔊' : '🔈';
  $('#btn-music').classList.toggle('off', !Audio.isMusicOn);
  $('#btn-sfx').classList.toggle('off', !Audio.isSfxOn);
}
function setChips(n) {
  state.player.chips = Number(n);
  const el = $('#hud-chips');
  el.textContent = `🪙 ${fmt(state.player.chips)}`;
  el.classList.remove('flash-up', 'flash-down'); void el.offsetWidth;
}
function fmt(n) { return Number(n).toLocaleString('en-US'); }

// ── login ────────────────────────────────────────────────────────────────────
function wireLogin() {
  $$('.emoji-pick').forEach((b) => b.addEventListener('click', () => {
    $('#emoji-input').value = b.textContent; Audio.click();
    $$('.emoji-pick').forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
  }));
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    Audio.init(); Audio.lockin();
    const handle = $('#handle-input').value.trim();
    const emoji = $('#emoji-input').value.trim() || '🎰';
    if (!handle) return;
    checkSecretHandle(handle);
    try {
      const p = await API.player(handle, emoji);
      state.player = p;
      localStorage.setItem('cram_handle', p.handle);
      localStorage.setItem('cram_emoji', p.emoji);
      setChips(p.chips);
      $('#modes-greeting').innerHTML = `Welcome, <b>${p.emoji} ${escapeHtml(p.handle)}</b>. You\'re holding <b>🪙 ${fmt(p.chips)}</b>.`;
      confetti(60);
      show('modes');
    } catch (err) { alert('Could not start: ' + err.message); }
  });
  $('#btn-view-lb-login').addEventListener('click', () => { Audio.click(); openLeaderboard(); });
}
function checkSecretHandle(h) {
  const k = h.toLowerCase();
  const eggs = {
    sigmoid: () => { confetti(150); banner('σ THE SIGMOID APPROVES σ'); },
    house: activateHouseMode, thehouse: activateHouseMode,
    allin: () => banner('🎲 born to gamble'),
    ddw: () => banner('📊 Data-Driven Wagers™'),
    neo: () => { glitch(800); banner('there is no spoon (only β)'); },
  };
  if (eggs[k]) setTimeout(eggs[k], 300);
}

// ── modes ────────────────────────────────────────────────────────────────────
function wireModes() {
  $$('.mode-card').forEach((c) => {
    c.addEventListener('mouseenter', () => Audio.hover());
    c.addEventListener('click', () => { Audio.deal(); startRun(c.dataset.mode); });
  });
  $('#btn-modes-lb').addEventListener('click', () => { Audio.click(); openLeaderboard(); });
  $('#btn-achievements').addEventListener('click', () => { Audio.click(); $('#achv-modal').classList.add('open'); renderAchievementsGrid(); });
  $('#achv-close').addEventListener('click', () => { Audio.click(); $('#achv-modal').classList.remove('open'); });
}

async function startRun(mode) {
  state.mode = mode;
  $('#loader-text').textContent = randomLoader();
  $('#loader').classList.add('show');
  try {
    const { questions } = await API.questions(mode);
    if (!questions.length) throw new Error('no questions for this mode');
    state.questions = questions;
    state.index = 0;
    state.run = {
      score: 0, maxScore: questions.reduce((a, q) => a + Number(q.points), 0),
      correct: 0, total: questions.length, chipsDelta: 0, streak: 0,
      startTime: Date.now(), answers: [], buyAttempts: 0,
    };
    setTimeout(() => { $('#loader').classList.remove('show'); show('exam'); renderQuestion(); }, 650);
  } catch (err) {
    $('#loader').classList.remove('show');
    alert('Could not load: ' + err.message);
  }
}

// ── exam screen ──────────────────────────────────────────────────────────────
function wireExam() {
  $('#wager-slider').addEventListener('input', onWagerChange);
  $$('.wager-quick').forEach((b) => b.addEventListener('click', () => {
    Audio.click();
    const v = b.dataset.amt;
    const max = maxWager();
    $('#wager-slider').value = v === 'max' ? max : Math.min(Number(v), max);
    onWagerChange();
    if (v === 'max' && max > 0) Achievements.unlock('all_in');
  }));
  $('#btn-lockin').addEventListener('click', submitAnswer);
  $('#btn-buy').addEventListener('click', buyAnswer);
  // #btn-next lives inside the dynamically-rendered result panel; it is wired
  // in applyResult() each time the panel is built.
}

function maxWager() { return Math.max(0, Math.min(Number(state.player.chips), 100000)); }

function renderQuestion() {
  state.answered = false;
  // reset panels FIRST so a stale result from the previous question can never
  // flash under a freshly-rendered question
  const rp = $('#result-panel');
  rp.classList.add('hidden'); rp.innerHTML = '';
  $('#wager-panel').classList.remove('hidden');

  const q = state.questions[state.index];
  state.current = renderWidget(q, () => {});
  Audio.deal();

  // header
  const partName = ['', 'PART 1', 'PART 2', 'PART 3'][q.part] || '';
  $('#q-progress').textContent = `Q${state.index + 1} / ${state.questions.length}`;
  $('#q-part').textContent = partName;
  $('#q-topic').textContent = q.topic;
  $('#q-points').textContent = `${q.points} pt${Number(q.points) === 1 ? '' : 's'}`;
  $('#q-source').textContent = q.source === 'mock' ? '★ REAL MOCK' : '🔮 PREDICTED';
  $('#q-source').className = 'q-source ' + (q.source === 'mock' ? 'real' : 'pred');
  const pct = ((state.index) / state.questions.length) * 100;
  $('#exam-progressbar').style.width = `${pct}%`;

  // body
  const body = $('#q-body'); body.innerHTML = '';
  body.append(el('div', 'q-stem', md(q.stem)));
  // The dropdowns widget renders q.code itself (with inline <select>s) when the
  // code carries ⟨blank⟩ markers — don't also render a static copy.
  const widgetOwnsCode = q.type === 'dropdowns' && q.code && /⟨/.test(q.code);
  if (q.code && !widgetOwnsCode) body.append(elPre(q.code));
  body.append(state.current.el);
  if (state.current.focus) setTimeout(() => state.current.focus(), 50);

  // gambling panel
  const odds = state.houseMode ? 100 : Number(q.exam_odds);
  $('#odds-value').textContent = `${odds}%`;
  $('#odds-fill').style.width = `${odds}%`;
  $('#odds-quip').textContent = state.houseMode ? 'HOUSE MODE: the fix is in' : oddsQuip(Number(q.exam_odds));
  $('#mult-value').textContent = `${q.multiplier.toFixed(2)}×`;

  const slider = $('#wager-slider');
  slider.max = maxWager(); slider.value = Math.min(50, maxWager());
  onWagerChange();

  // reset panels
  $('#wager-panel').classList.remove('hidden');
  $('#result-panel').classList.add('hidden');
  $('#btn-lockin').disabled = false;
  $('#btn-buy').disabled = false;
  $('#buy-cost').textContent = fmt(buyCost());
}

function onWagerChange() {
  const w = Number($('#wager-slider').value);
  const q = state.questions[state.index];
  const win = Math.round(w * (q.multiplier - 1));
  $('#wager-amount').textContent = fmt(w);
  $('#wager-win').textContent = `+${fmt(win)}`;
  $('#wager-lose').textContent = `-${fmt(w)}`;
}

async function submitAnswer() {
  if (state.answered) return;
  const q = state.questions[state.index];
  const response = state.current.getResponse();
  if (response == null || (Array.isArray(response) && response.length === 0) ||
      (typeof response === 'object' && !Array.isArray(response) && Object.values(response).every((v) => !v))) {
    if (!confirm('You haven\'t answered. Lock in a blank (and lose your wager if you bet)?')) return;
  }
  state.answered = true;
  const wager = Number($('#wager-slider').value);
  if (wager >= maxWager() && wager > 0) Achievements.unlock('all_in');
  $('#btn-lockin').disabled = true; $('#btn-buy').disabled = true;
  Audio.lockin();

  try {
    const res = await API.check({
      questionId: q.id, response, handle: state.player.handle,
      wager, streak: state.run.streak,
    });
    applyResult(q, res, wager);
  } catch (err) {
    state.answered = false; $('#btn-lockin').disabled = false;
    alert('Check failed: ' + err.message);
  }
}

function applyResult(q, res, wager) {
  state.current.lock();
  state.current.reveal(res.correctAnswer, state.current.getResponse());

  // scoring
  state.run.score += res.pointsAwarded;
  if (res.correct) { state.run.correct++; state.run.streak++; } else { state.run.streak = 0; }
  if (res.newBalance != null) {
    const delta = Number(res.newBalance) - Number(state.player.chips);
    state.run.chipsDelta += delta;
    animateChips(Number(state.player.chips), Number(res.newBalance));
  }

  // achievements
  if (res.correct) Achievements.unlock('first_blood');
  if (res.chipsDelta >= 500) Achievements.unlock('high_roller');
  if (res.jackpot) Achievements.unlock('jackpot');
  if (res.rugpull) Achievements.unlock('rugged');

  // sfx + fx
  if (res.rugpull) { glitch(700); Audio.rugpull(); }
  else if (res.jackpot) { confetti(160); chipRain(50); Audio.jackpot(); }
  else if (res.correct) { Audio.correct(); if (res.chipsDelta > 0) Audio.coin(); confetti(40); }
  else { Audio.wrong(); }

  // result card
  const rp = $('#result-panel');
  const verdict = res.correct ? 'CORRECT' : (res.fraction > 0 ? 'PARTIAL' : 'WRONG');
  const vclass = res.correct ? 'v-correct' : (res.fraction > 0 ? 'v-partial' : 'v-wrong');
  const chipsLine = res.chipsDelta === 0 ? 'No wager placed.'
    : res.chipsDelta > 0 ? `<span class="up">🪙 +${fmt(res.chipsDelta)} chips</span>`
    : `<span class="down">🪙 ${fmt(res.chipsDelta)} chips</span>`;
  const flags = [
    res.jackpot ? '<span class="flag jackpot">🎰 JACKPOT STREAK</span>' : '',
    res.rugpull ? '<span class="flag rug">📉 RUGPULLED — the house took half</span>' : '',
  ].join('');
  rp.innerHTML = `
    <div class="verdict ${vclass}">${verdict}</div>
    <div class="result-line">+${res.pointsAwarded} / ${q.points} pts &nbsp;·&nbsp; ${chipsLine}</div>
    ${flags ? `<div class="flags">${flags}</div>` : ''}
    <div class="explanation">${md(res.explanation)}</div>
    <button id="btn-next" class="btn btn-next">${state.index + 1 < state.questions.length ? 'NEXT ▶' : 'SEE RESULTS ▶'}</button>
  `;
  $('#wager-panel').classList.add('hidden');
  rp.classList.remove('hidden');
  $('#btn-next').addEventListener('click', nextQuestion);
  $('#exam-progressbar').style.width = `${((state.index + 1) / state.questions.length) * 100}%`;

  state.run.answers.push({ id: q.id, correct: res.correct, points: res.pointsAwarded, wager, payout: res.chipsDelta });

  // bankruptcy check
  if (Number(state.player.chips) <= 0) setTimeout(loanShark, 900);
}

function animateChips(from, to) {
  setChips(to);
  const el = $('#hud-chips');
  el.classList.add(to >= from ? 'flash-up' : 'flash-down');
}

function nextQuestion() {
  Audio.click();
  if (state.index + 1 < state.questions.length) { state.index++; renderQuestion(); }
  else finishRun();
}

// ── buy-the-answer (troll) ───────────────────────────────────────────────────
function buyCost() { return 150 + state.run.buyAttempts * 150; }
async function buyAnswer() {
  if (state.answered) return;
  Achievements.unlock('buyer');
  const cost = buyCost();
  if (Number(state.player.chips) < cost) { banner('💸 you\'re too broke to cheat'); Audio.wrong(); return; }
  if (!confirm(`Buy a hint for 🪙 ${fmt(cost)} chips? (No refunds. The house has… a sense of humour.)`)) return;
  state.run.buyAttempts++;
  Audio.deal();
  const nb = await API.chips(state.player.handle, -cost).then((r) => r.newBalance).catch(() => null);
  if (nb != null) { animateChips(Number(state.player.chips), Number(nb)); state.run.chipsDelta -= cost; }
  const trolls = [
    'The answer was inside you all along. 🫶',
    'Hint: it\'s one of the options. Probably.',
    'Our records indicate you should have studied. 📚',
    'ERROR 402: knowledge requires payment we cannot provide.',
    'The house has taken your chips and wishes you luck. 🎩',
    'Hint purchased. Hint value: emotional damage.',
  ];
  // 1-in-4 it actually helps a little
  if (Math.random() < 0.25) {
    banner('🕳️ …fine. It\'s NOT the most "obvious" option.');
  } else {
    banner('🕳️ ' + trolls[Math.floor(Math.random() * trolls.length)]);
  }
  $('#buy-cost').textContent = fmt(buyCost());
}

// ── loan shark (bankruptcy) ──────────────────────────────────────────────────
function loanShark() {
  Achievements.unlock('degenerate');
  glitch(500);
  const m = $('#shark-modal');
  m.classList.add('open');
  $('#shark-yes').onclick = async () => {
    Audio.coin(); m.classList.remove('open');
    const r = await API.bailout(state.player.handle).catch(() => null);
    if (r?.newBalance != null) { animateChips(Number(state.player.chips), Number(r.newBalance)); banner('🦈 "Pleasure doing business." +250 chips'); }
  };
  $('#shark-no').onclick = () => { Audio.click(); m.classList.remove('open'); banner('🪙 broke and proud'); };
}

// ── results ──────────────────────────────────────────────────────────────────
async function finishRun() {
  const r = state.run;
  const acc = r.total ? r.correct / r.total : 0;
  const durationMs = Date.now() - r.startTime;

  // end-of-run achievements
  if (acc >= 0.9) Achievements.unlock('actuary');
  if (r.score >= 40) Achievements.unlock('scholar');
  if (state.mode === 'all') Achievements.unlock('full_send');
  if (Number(state.player.chips) === 0) Achievements.unlock('no_ragrets');

  $('#res-score').textContent = `${r.score.toFixed(r.score % 1 ? 1 : 0)} / ${r.maxScore}`;
  $('#res-pct').textContent = `${Math.round((r.score / (r.maxScore || 1)) * 100)}%`;
  $('#res-correct').textContent = `${r.correct} / ${r.total}`;
  $('#res-acc').textContent = `${Math.round(acc * 100)}%`;
  $('#res-chips').textContent = `${r.chipsDelta >= 0 ? '+' : ''}${fmt(r.chipsDelta)}`;
  $('#res-chips').className = 'res-big ' + (r.chipsDelta >= 0 ? 'up' : 'down');
  $('#res-balance').textContent = `🪙 ${fmt(state.player.chips)}`;
  $('#res-grade').textContent = gradeFor(r.score / (r.maxScore || 1));
  $('#res-msg').textContent = resultMessage(acc, r.chipsDelta);

  if (acc >= 0.7) { confetti(160); Audio.jackpot(); } else { Audio.correct(); }

  show('results');

  // submit to leaderboard
  try {
    const sub = await API.run({
      handle: state.player.handle, mode: state.mode,
      score: r.score, maxScore: r.maxScore, correctCount: r.correct, totalCount: r.total,
      chipsDelta: r.chipsDelta, durationMs, accuracy: acc,
    });
    $('#res-rank').textContent = sub.rank ? `#${sub.rank} on the ${MODE_META[state.mode].label} board` : 'ranked!';
  } catch { $('#res-rank').textContent = ''; }
}

function gradeFor(f) {
  if (f >= 0.9) return 'S';
  if (f >= 0.8) return 'A';
  if (f >= 0.67) return 'B';
  if (f >= 0.5) return 'C';
  if (f >= 0.3) return 'D';
  return 'F';
}
function resultMessage(acc, chips) {
  if (acc >= 0.9) return 'Dean\'s List behaviour. Friday is yours.';
  if (acc >= 0.7) return 'Solidly on track. Keep the clock discipline.';
  if (acc >= 0.5) return 'Passable. Work the error log and run it back.';
  if (chips > 0) return 'Bad exam, good gambler. Priorities?';
  return 'The house always wins. So does studying. Run it back.';
}

function wireResults() {
  $('#btn-again').addEventListener('click', () => { Audio.click(); show('modes'); });
  $('#btn-res-lb').addEventListener('click', () => { Audio.click(); openLeaderboard(); });
  $('#btn-share').addEventListener('click', shareResult);
}
function shareResult() {
  const r = state.run;
  const txt = `I scored ${r.score}/${r.maxScore} (${Math.round((r.score / (r.maxScore || 1)) * 100)}%) and ${r.chipsDelta >= 0 ? 'won' : 'lost'} ${fmt(Math.abs(r.chipsDelta))} chips on CRAM ROYALE 🎰 #DDW`;
  navigator.clipboard?.writeText(txt).then(() => banner('📋 copied to clipboard')).catch(() => banner(txt));
  Audio.coin();
}

// ── leaderboard ──────────────────────────────────────────────────────────────
function wireLeaderboard() {
  $('#lb-close').addEventListener('click', () => { Audio.click(); show(state.player ? 'modes' : 'login'); });
  $$('.lb-tab').forEach((t) => t.addEventListener('click', () => {
    Audio.click();
    $$('.lb-tab').forEach((x) => x.classList.remove('active')); t.classList.add('active');
    loadLeaderboard(t.dataset.board);
  }));
}
function openLeaderboard() { show('leaderboard'); $$('.lb-tab').forEach((x, i) => x.classList.toggle('active', i === 0)); loadLeaderboard('score'); }
async function loadLeaderboard(board) {
  const body = $('#lb-body');
  body.innerHTML = '<div class="lb-loading">loading the board…</div>';
  try {
    const data = board === 'chips'
      ? await API.leaderboard('chips')
      : await API.leaderboard('score');
    if (!data.rows.length) { body.innerHTML = '<div class="lb-loading">No entries yet. Be the first degenerate.</div>'; return; }
    body.innerHTML = data.rows.map((r, i) => {
      const me = state.player && r.handle === state.player.handle ? ' me' : '';
      const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}`;
      if (board === 'chips') {
        return `<div class="lb-row${me}"><span class="lb-rank">${medal}</span><span class="lb-name">${r.emoji || '🎰'} ${escapeHtml(r.handle)}</span><span class="lb-val">🪙 ${fmt(r.chips)}</span></div>`;
      }
      return `<div class="lb-row${me}"><span class="lb-rank">${medal}</span><span class="lb-name">${r.emoji || '🎰'} ${escapeHtml(r.handle)}</span><span class="lb-val">${Number(r.score)} pts · ${Math.round(Number(r.accuracy) * 100)}%</span></div>`;
    }).join('');
  } catch (err) { body.innerHTML = `<div class="lb-loading">board offline: ${err.message}</div>`; }
}

// ── HOUSE MODE ───────────────────────────────────────────────────────────────
function activateHouseMode() {
  if (state.houseMode) { chipRain(60); return; }
  state.houseMode = true;
  Achievements.unlock('house_mode');
  document.body.classList.add('house-mode');
  glitch(900); chipRain(80);
  banner('👁️ HOUSE MODE — the odds were always fake. The chips are real to you.');
  if (state.questions.length && $('#screen-exam').classList.contains('active')) {
    $('#odds-value').textContent = '100%'; $('#odds-fill').style.width = '100%';
    $('#odds-quip').textContent = 'HOUSE MODE: the fix is in';
  }
}

// ── achievements grid ────────────────────────────────────────────────────────
function renderAchievementsGrid() {
  const grid = $('#achv-grid'); if (!grid) return;
  const have = Achievements.get();
  grid.innerHTML = Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!have[id];
    return `<div class="achv-cell ${got ? 'got' : 'locked'}"><span class="achv-cell-icon">${got ? a.icon : '❔'}</span><b>${got ? a.name : '???'}</b><span>${got ? a.desc : 'locked'}</span></div>`;
  }).join('');
}

// ── little UI helpers ────────────────────────────────────────────────────────
function el(tag, cls, html) { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function elPre(text) { const p = document.createElement('pre'); p.className = 'md-pre'; p.textContent = text; return p; }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function banner(text) {
  const b = document.createElement('div'); b.className = 'banner'; b.textContent = text;
  document.body.append(b); requestAnimationFrame(() => b.classList.add('show'));
  setTimeout(() => { b.classList.remove('show'); setTimeout(() => b.remove(), 400); }, 2600);
}
