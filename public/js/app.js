// CRAM // S07 — app orchestrator.
import { API } from './api.js';
import { Audio } from './audio.js';
import { renderWidget, md } from './render.js';
import { burst, glitch, onKonami, randomLoader } from './eggs.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => Number(n).toLocaleString('en-US');

const TYPE_LABELS = {
  mcq: 'MCQ', multiselect: 'MULTI-SELECT', dropdowns: 'DROPDOWN',
  numeric: 'NUMERIC', matching: 'MATCHING', ordering: 'ORDERING', text: 'TEXT',
};

function loadOptions() {
  try { return { weeks: null, types: null, order: 'random', ...JSON.parse(localStorage.getItem('cram_opts') || '{}') }; }
  catch { return { weeks: null, types: null, order: 'random' }; }
}

const state = {
  player: null, mode: 'grind',
  pool: [], queue: [], orderMode: 'random', mockList: [], mockIdx: 0,
  current: null, currentQ: null, answered: false, mock: null,
  lastAnnId: null, annQueue: [], bannerBusy: false, boardTimer: null,
  options: loadOptions(), allQuestions: null, meta: null,
};
function saveOptions() { localStorage.setItem('cram_opts', JSON.stringify(state.options)); }

document.addEventListener('DOMContentLoaded', init);

function init() {
  // start the audio engine on the first real interaction (pointer OR keyboard)
  const kick = () => { Audio.init(); };
  addEventListener('pointerdown', kick, { once: true });
  addEventListener('keydown', kick, { once: true });

  wireHome(); wirePlay(); wireOverlays(); wireStatic(); wireOptions();
  onKonami(() => { document.body.classList.toggle('crt'); glitch(500); });
  syncSfx(Audio.isSfxOn);

  const saved = localStorage.getItem('cram_name');
  if (saved) $('#name-input').value = saved;

  refreshLive(); setInterval(refreshLive, 15000);
  pollAnnouncements(true); setInterval(() => pollAnnouncements(false), 9000);
  show('home');
}

function show(name) {
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
  window.scrollTo(0, 0);
}

// ── player / login ───────────────────────────────────────────────────────────
function setPlayer(p) {
  state.player = p;
  localStorage.setItem('cram_name', p.handle);
  $('#name-input').value = p.handle;
  setCurrency(p.currency || 0);
  refreshClaimable(); // light up the vault dot if there's currency waiting
}
function setCurrency(n) {
  if (state.player) state.player.currency = Number(n);
  $('#home-currency').textContent = fmt(n);
  $('#play-currency').textContent = fmt(n);
}

// Resolve a usable player, showing the in-theme "account exists" popup when a
// returning name is entered. Returns the player, or null if aborted.
async function ensurePlayer() {
  const name = $('#name-input').value.trim();
  if (!name) {
    if (state.player) return state.player; // already logged in this session
    if (!$('#screen-home').classList.contains('active')) { show('home'); banner('put your name in first ▚'); }
    nudgeName(); return null;
  }
  if (state.player && state.player.handle.toLowerCase() === name.toLowerCase()) return state.player;
  let res;
  try { res = await API.player(name); } catch (e) { banner(`✕ ${e.message}`); return null; }
  if (res.existed) {
    const ok = await loginPopup(res.player.handle);
    if (!ok) { $('#name-input').value = ''; nudgeName(); return null; }
  }
  setPlayer(res.player);
  return res.player;
}
function nudgeName() { const f = $('#name-input'); f.focus(); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); Audio.wrong(); }

let popupResolve = null;
function loginPopup(name) {
  $('#popup-name').textContent = name;
  $('#login-popup').classList.add('open');
  Audio.select();
  return new Promise((resolve) => { popupResolve = resolve; });
}

// ── home menu ────────────────────────────────────────────────────────────────
function wireHome() {
  $$('#screen-home .hud-btn').forEach((b) => {
    b.addEventListener('mouseenter', () => Audio.hover());
    b.addEventListener('click', () => onMenu(b.dataset.action));
  });
  $('#name-form').addEventListener('submit', (e) => { e.preventDefault(); onMenu('grind'); });
  $('#home-chip').addEventListener('click', async () => { Audio.click(); if (await ensurePlayer()) openVault(); });
  $('#home-sfx').addEventListener('click', () => { Audio.init(); syncSfx(Audio.toggleSfx()); });
}
async function onMenu(action) {
  Audio.click();
  if (action === 'leaderboard') return openBoard();
  if (action === 'info') return show('info');
  if (action === 'options') return openOptions();
  const p = await ensurePlayer(); if (!p) return;
  if (action === 'grind') startGrind();
  if (action === 'mock') $('#mock-popup').classList.add('open'); // choose AI vs actual
}

// keep both SFX toggles (home + play) in sync
function syncSfx(on) {
  const label = on ? '◧ SFX' : '◨ MUTE';
  const h = $('#home-sfx'); if (h) h.textContent = label;
  const p = $('#btn-sfx'); if (p) p.textContent = label;
}

// ── loaders ──────────────────────────────────────────────────────────────────
function showLoader() { $('#loader-text').textContent = randomLoader(); $('#loader').classList.add('show'); }
function hideLoader() { $('#loader').classList.remove('show'); }

// ── grind / mock ─────────────────────────────────────────────────────────────
async function getGrindQuestions() {
  if (!state.allQuestions) { const { questions } = await API.questions('grind'); state.allQuestions = questions; }
  return state.allQuestions;
}
function filterPool(all) {
  const { weeks, types } = state.options;
  let pool = all.filter((q) => (!weeks || weeks.includes(q.week)) && (!types || types.includes(q.type)));
  if (!pool.length) pool = all.slice(); // never leave them with an empty grind
  return pool;
}
async function startGrind() {
  state.mode = 'grind'; showLoader();
  try {
    const all = await getGrindQuestions();
    if (!all.length) throw new Error('no questions');
    let pool = filterPool(all);
    state.orderMode = state.options.order;
    if (state.orderMode === 'week') pool = pool.slice().sort((a, b) => a.week - b.week || a.seq - b.seq);
    else pool = shuffle(pool);
    state.pool = pool; state.queue = pool.slice();
    $('#play-mode').textContent = 'GRIND';
    setTimeout(() => { hideLoader(); show('play'); nextGrind(); }, 480);
  } catch (e) { hideLoader(); banner('✕ ' + e.message); }
}
function nextGrind() {
  if (!state.queue.length) state.queue = state.orderMode === 'week' ? state.pool.slice() : shuffle(state.pool);
  renderQuestion(state.queue.shift());
}

// ── options screen ───────────────────────────────────────────────────────────
function wireOptions() {
  $('#btn-opt-grind').addEventListener('click', async () => { Audio.click(); const p = await ensurePlayer(); if (p) startGrind(); });
  $('#btn-opt-back').addEventListener('click', () => { Audio.click(); show('home'); });
  $$('#opt-order .tg').forEach((b) => b.addEventListener('click', () => {
    Audio.click(); state.options.order = b.dataset.order; saveOptions(); renderOrderToggle();
  }));
}
function renderOrderToggle() {
  $$('#opt-order .tg').forEach((b) => b.classList.toggle('on', b.dataset.order === state.options.order));
}
async function openOptions() {
  show('options'); renderOrderToggle();
  try {
    const [meta, all] = await Promise.all([API.meta(), getGrindQuestions()]);
    state.meta = meta;
    if (!state.options.weeks) state.options.weeks = meta.weeks.map((w) => w.week);
    if (!state.options.types) state.options.types = meta.types.map((t) => t.type);
    renderWeekChips(meta.weeks); renderTypeChips(meta.types); updateOptCount();
  } catch (e) { $('#opt-weeks').textContent = 'offline: ' + e.message; }
}
function renderWeekChips(weeks) {
  const row = $('#opt-weeks'); row.innerHTML = '';
  const allOn = state.options.weeks.length === weeks.length;
  row.append(chip('ALL', allOn, 'all', () => {
    state.options.weeks = allOn ? [] : weeks.map((w) => w.week);
    if (!state.options.weeks.length) state.options.weeks = []; // none selected
    saveOptions(); renderWeekChips(weeks); updateOptCount();
  }));
  weeks.forEach((w) => {
    const on = state.options.weeks.includes(w.week);
    row.append(chip(`W${w.week}`, on, '', () => { toggle(state.options.weeks, w.week); saveOptions(); renderWeekChips(weeks); updateOptCount(); }, w.n));
  });
}
function renderTypeChips(types) {
  const row = $('#opt-types'); row.innerHTML = '';
  const allOn = state.options.types.length === types.length;
  row.append(chip('ALL', allOn, 'all', () => {
    state.options.types = allOn ? [] : types.map((t) => t.type);
    saveOptions(); renderTypeChips(types); updateOptCount();
  }));
  types.forEach((t) => {
    const on = state.options.types.includes(t.type);
    row.append(chip(TYPE_LABELS[t.type] || t.type.toUpperCase(), on, '', () => { toggle(state.options.types, t.type); saveOptions(); renderTypeChips(types); updateOptCount(); }, t.n));
  });
}
function chip(label, on, extra, onClick, count) {
  const b = document.createElement('button'); b.type = 'button';
  b.className = `opt-chip ${extra} ${on ? 'on' : ''}`.trim();
  b.innerHTML = `${label}${count != null ? `<span class="c-n">${count}</span>` : ''}`;
  b.addEventListener('click', () => { Audio.hover(); onClick(); });
  return b;
}
function toggle(arr, v) { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
function updateOptCount() {
  const all = state.allQuestions || [];
  const n = filterPool(all).length;
  const noneSelected = (state.options.weeks && !state.options.weeks.length) || (state.options.types && !state.options.types.length);
  $('#opt-count').textContent = noneSelected ? '0 selected → grind falls back to everything' : `${n} questions in the grind pool`;
}

async function startMock(mode = 'mock') {
  $('#mock-popup').classList.remove('open');
  state.mode = mode; showLoader();
  try {
    const { questions } = await API.questions(mode);
    if (!questions.length) throw new Error('no mock questions');
    state.mockList = questions; state.mockIdx = 0;
    state.mock = { score: 0, max: questions.reduce((a, q) => a + Number(q.points), 0), correct: 0, total: questions.length };
    $('#play-mode').textContent = mode === 'actual' ? 'MOCK · ACTUAL' : 'MOCK · AI';
    setTimeout(() => { hideLoader(); show('play'); renderQuestion(state.mockList[0]); }, 480);
  } catch (e) { hideLoader(); banner('✕ ' + e.message); }
}

// ── render a question ────────────────────────────────────────────────────────
function renderQuestion(q) {
  state.answered = false; state.currentQ = q;
  const rp = $('#result-panel'); rp.classList.add('hidden'); rp.innerHTML = '';
  $('#odds-panel').classList.remove('hidden');
  $('#btn-confirm').classList.remove('hidden'); $('#btn-confirm').disabled = false;
  $('#btn-gamble').disabled = false; $('#btn-gamble').style.display = ''; // gamble in every mode

  if (state.mode === 'grind') {
    $('#play-counter').textContent = `ANSWERED · ${fmt(state.player.answered || 0)}`;
    $('#play-progressbar').style.width = `${(((state.player.answered || 0) % 25) / 25) * 100}%`;
  } else {
    $('#play-counter').textContent = `Q ${state.mockIdx + 1} / ${state.mockList.length}`;
    $('#play-progressbar').style.width = `${(state.mockIdx / state.mockList.length) * 100}%`;
  }

  $('#q-id').textContent = String(q.seq).padStart(3, '0');
  $('#q-topic').textContent = q.topic;
  $('#q-points').textContent = `${q.points} PT${Number(q.points) === 1 ? '' : 'S'}`;
  const src = $('#q-source');
  src.textContent = q.source === 'mock' ? 'MOCK' : q.source === 'actual' ? 'ACTUAL' : 'PREDICTED';
  src.className = 'q-source ' + (q.source === 'mock' || q.source === 'actual' ? 'mock' : '');

  state.current = renderWidget(q, () => {});
  const body = $('#q-body'); body.innerHTML = '';
  // actual paper: the real exam screenshots ARE the question
  if (q.images && q.images.length) {
    const iw = el('div', 'q-images');
    q.images.forEach((src) => { const img = document.createElement('img'); img.src = src; img.className = 'q-image'; img.loading = 'lazy'; img.alt = 'exam question'; iw.append(img); });
    body.append(iw);
  }
  body.append(el('div', 'q-stem', md(q.stem)));
  const widgetOwnsCode = q.type === 'dropdowns' && q.code && /⟨/.test(q.code);
  if (q.code && !widgetOwnsCode) { const pre = document.createElement('pre'); pre.className = 'md-pre'; pre.textContent = q.code; body.append(pre); }
  body.append(state.current.el);
  if (state.current.focus) setTimeout(() => state.current.focus(), 40);

  // guess odds (from server)
  const o = q.odds || {};
  $('#odds-value').textContent = o.headline || '—';
  $('#odds-kind').textContent = o.kind || '';
  $('#odds-verdict').textContent = o.verdict || '';
  $('#odds-real').textContent = o.realWorld ? `you're likelier to ${o.realWorld}, tbh` : '';
  const dl = $('#odds-detail'); dl.innerHTML = (o.detail || []).map((d) => `<li>${d}</li>`).join('');
  $('#btn-gamble').innerHTML = `🎲 I'LL&nbsp;GAMBLE${o.gamblePayout ? ` <span style="opacity:.7">· ◈${o.gamblePayout}</span>` : ''}`;

  Audio.next();
}

// ── confirm / gamble ─────────────────────────────────────────────────────────
async function confirmAnswer() {
  if (state.answered) return;
  const response = state.current.getResponse();
  const blank = response == null || (Array.isArray(response) && response.length === 0) ||
    (typeof response === 'object' && !Array.isArray(response) && Object.values(response).every((v) => !v));
  if (blank && !confirm('nothing selected — lock in a blank answer?')) return;
  submit(response, false);
}
function gambleAnswer() {
  if (state.answered) return;
  Audio.select(); glitch(200);
  const response = state.current.randomFill ? state.current.randomFill() : state.current.getResponse();
  submit(response, true);
}
async function submit(response, gambled) {
  state.answered = true;
  $('#btn-confirm').disabled = true; $('#btn-gamble').disabled = true;
  Audio.select();
  try {
    const res = await API.check({ questionId: state.currentQ.id, response, handle: state.player.handle, mode: state.mode, gambled });
    applyResult(state.currentQ, res, gambled);
  } catch (e) { state.answered = false; $('#btn-confirm').disabled = false; $('#btn-gamble').disabled = false; banner('✕ ' + e.message); }
}

function applyResult(q, res, gambled) {
  state.current.lock();
  state.current.reveal(res.correctAnswer, state.current.getResponse());
  $('#btn-confirm').classList.add('hidden'); $('#odds-panel').classList.add('hidden');

  const verdict = res.correct ? 'CORRECT' : (res.fraction > 0 ? 'PARTIAL' : 'WRONG');
  const vclass = res.correct ? 'v-correct' : (res.fraction > 0 ? 'v-partial' : 'v-wrong');
  const showExplain = !res.correct;
  const last = state.mode === 'mock' && state.mockIdx + 1 >= state.mockList.length;
  const nextLabel = state.mode === 'mock' ? (last ? 'SEE RESULTS' : 'NEXT') : 'NEXT';

  let gambleLine = '';
  if (gambled && res.gambleWin) gambleLine = `<div class="gamble-win">🎲 GAMBLE PAID OUT — <b>+◈${fmt(res.gamblePayout)}</b> <span style="opacity:.65">(${Math.round(res.fraction * 100)}% of the marks)</span></div>`;
  else if (gambled) gambleLine = `<div class="gamble-lose">🎲 zero marks, zero payout. the house wins.</div>`;

  const rp = $('#result-panel');
  rp.innerHTML = `
    <div class="verdict ${vclass}">${verdict}</div>
    <div class="result-line">${res.pointsAwarded} / ${q.points} pts${state.mode === 'grind' && res.answered != null ? ` · answered ${fmt(res.answered)}` : ''}</div>
    ${gambleLine}
    ${showExplain ? `<div class="explanation">${md(res.explanation)}</div>`
                  : `<button id="why-btn" class="mini-btn" style="margin-bottom:12px">WHY? ▾</button><div id="why-box" class="explanation" style="display:none">${md(res.explanation)}</div>`}
    <button id="btn-next" class="hud-btn primary"><span class="btn-bar"></span><span class="btn-label">${nextLabel}</span><span class="btn-arrow">▶</span></button>
  `;
  rp.classList.remove('hidden');
  $('#btn-next').addEventListener('click', goNext);
  const why = $('#why-btn');
  if (why) why.addEventListener('click', () => { const b = $('#why-box'); const open = b.style.display !== 'none'; b.style.display = open ? 'none' : 'block'; why.textContent = open ? 'WHY? ▾' : 'WHY? ▴'; Audio.click(); });

  if (res.correct) Audio.correct(); else Audio.wrong();

  // currency + gamble payout apply in every mode now
  if (res.currency != null) setCurrency(res.currency);
  if (res.gambleWin) {
    burst(120); Audio.milestone();
    enqueueBanner(`<span class="glyph">◈</span> YOU GAMBLED &amp; WON <span class="big">+${fmt(res.gamblePayout)}</span> <span class="a-tag">${Math.round(res.fraction * 100)}% HIT</span>`);
  }

  // grind-only: the live answered counter + milestone announcements
  if (state.mode === 'grind') {
    if (res.answered != null) {
      state.player.answered = res.answered;
      $('#play-counter').textContent = `ANSWERED · ${fmt(res.answered)}`;
      $('#play-progressbar').style.width = `${((res.answered % 25) / 25) * 100}%`;
    }
    if (res.milestone) { burst(120); Audio.milestone(); enqueueBanner(`<span class="glyph">▚</span> YOU HIT <span class="big">${res.milestone}</span> QUESTIONS <span class="a-tag">KEEP GRINDING</span>`); }
  }
  if (state.mode !== 'grind' && state.mock) { state.mock.score += res.pointsAwarded; if (res.correct) state.mock.correct++; }
  if (res.claimable != null) setClaimDot(res.claimable); // any mode can unlock achievements
}

function goNext() {
  Audio.click();
  if (state.mode === 'grind') return nextGrind();
  if (state.mockIdx + 1 < state.mockList.length) { state.mockIdx++; renderQuestion(state.mockList[state.mockIdx]); }
  else finishMock();
}

// ── mock summary ─────────────────────────────────────────────────────────────
function finishMock() {
  const m = state.mock; const pct = Math.round((m.score / (m.max || 1)) * 100);
  $('#sum-score').textContent = `${round1(m.score)} / ${m.max}`;
  $('#sum-pct').textContent = `${pct}%`;
  $('#sum-correct').textContent = `${m.correct} / ${m.total}`;
  $('#sum-msg').textContent = pct >= 70 ? 'sharp. clock discipline on Friday and you\'re set.'
    : pct >= 50 ? 'passable. now go grind the weak spots.' : 'rough — but it\'s a mock. go grind, it\'s free reps.';
  if (pct >= 70) { burst(120); Audio.milestone(); }
  show('summary');
}

// ── leaderboard overlay ──────────────────────────────────────────────────────
function openBoard() {
  $('#board-overlay').classList.add('open'); loadBoard();
  clearInterval(state.boardTimer); state.boardTimer = setInterval(loadBoard, 5000);
}
function closeBoard() { $('#board-overlay').classList.remove('open'); clearInterval(state.boardTimer); }
async function loadBoard() {
  const body = $('#board-body');
  if (!body.children.length) body.innerHTML = '<div class="board-loading">reading the board…</div>';
  try {
    const { rows } = await API.leaderboard();
    if (!rows.length) { body.innerHTML = '<div class="board-empty">no grinders yet. be the first — START GRIND.</div>'; return; }
    body.innerHTML = rows.map((r, i) => {
      const me = state.player && r.handle === state.player.handle ? ' me' : '';
      const top = i === 0 ? ' top' : '';
      const rank = String(i + 1).padStart(2, '0');
      const badge = r.title ? `<span class="title-badge">${escapeHtml(r.title)}</span>` : '';
      return `<div class="board-row${top}${me}"><span class="board-rank">${rank}</span><span class="board-name">${badge}${escapeHtml(r.handle)}</span><span class="board-val"><b>${fmt(r.correct)}</b> correct</span></div>`;
    }).join('');
  } catch (e) { body.innerHTML = `<div class="board-empty">board offline: ${e.message}</div>`; }
}

// ── the vault (achievements + titles) ────────────────────────────────────────
async function openVault(tab = 'ach') {
  $('#shop-overlay').classList.add('open');
  switchVaultTab(tab);
  await Promise.all([loadAchievements(), loadTitles()]);
}
function closeVault() { $('#shop-overlay').classList.remove('open'); }
function switchVaultTab(tab) {
  $$('.vault-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  $('#vault-ach').classList.toggle('hidden', tab !== 'ach');
  $('#vault-titles').classList.toggle('hidden', tab !== 'titles');
}

async function loadTitles() {
  const grid = $('#shop-grid'); if (!grid.children.length) grid.innerHTML = '<div class="board-loading">loading titles…</div>';
  try {
    const data = await API.titles(state.player.handle);
    setCurrency(data.balance); $('#shop-balance').textContent = fmt(data.balance);
    grid.innerHTML = data.catalog.map((t) => {
      const owned = data.owned.includes(t.id); const equipped = data.active === t.id;
      const btn = equipped ? `<button class="t-btn equipped" data-equip="${t.id}">EQUIPPED</button>`
        : owned ? `<button class="t-btn owned" data-equip="${t.id}">EQUIP</button>`
        : `<button class="t-btn" data-buy="${t.id}">BUY</button>`;
      return `<div class="shop-item ${owned ? '' : 'locked'}"><span class="t-name">${t.name}</span><span class="t-blurb">${t.blurb}</span><div class="t-row"><span class="t-price">${owned ? 'owned' : '◈ ' + t.price}</span>${btn}</div></div>`;
    }).join('');
    grid.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => buyTitle(b.dataset.buy)));
    grid.querySelectorAll('[data-equip]').forEach((b) => b.addEventListener('click', () => equipTitle(b.dataset.equip)));
  } catch (e) { grid.innerHTML = `<div class="board-empty">shop offline: ${e.message}</div>`; }
}
async function buyTitle(id) {
  Audio.click();
  const r = await API.buyTitle(state.player.handle, id).catch((e) => ({ ok: false, reason: e.message }));
  if (r.ok) { setCurrency(r.currency); burst(60); Audio.correct(); banner('✓ title acquired'); loadTitles(); loadAchievements(); }
  else if (r.reason === 'broke') { banner('✕ not enough ◈ — win gambles or claim achievements'); Audio.wrong(); }
  else banner('✕ ' + (r.reason || 'nope'));
}
async function equipTitle(id) {
  Audio.click();
  const p = await API.equipTitle(state.player.handle, id).catch(() => null);
  if (p) { state.player.title = p.title; banner(p.title ? '✓ title equipped' : '✓ title removed'); loadTitles(); }
}

async function loadAchievements() {
  const grid = $('#ach-grid'); if (!grid.children.length) grid.innerHTML = '<div class="board-loading">loading…</div>';
  try {
    const data = await API.achievements(state.player.handle);
    setCurrency(data.balance); $('#shop-balance').textContent = fmt(data.balance);
    setClaimDot(data.claimable);
    grid.innerHTML = data.list.map((a) => {
      const pct = Math.min(100, Math.round((a.current / a.target) * 100));
      const cls = a.claimed ? 'done' : (a.unlocked ? 'claimable' : '');
      const btn = a.claimed ? `<button class="ach-btn claimed" disabled>✓ CLAIMED</button>`
        : a.unlocked ? `<button class="ach-btn" data-claim="${a.id}">CLAIM ◈${a.reward}</button>`
        : `<button class="ach-btn locked" disabled>◈${a.reward}</button>`;
      return `<div class="ach-item ${cls}">
        <div class="ach-top"><span class="ach-name">${a.name}</span></div>
        <span class="ach-blurb">${a.blurb}</span>
        <div class="ach-bar"><span style="width:${pct}%"></span></div>
        <div class="ach-foot"><span class="ach-prog">${fmt(a.current)} / ${fmt(a.target)}</span>${btn}</div>
      </div>`;
    }).join('');
    grid.querySelectorAll('[data-claim]').forEach((b) => b.addEventListener('click', () => claimAch(b.dataset.claim)));
  } catch (e) { grid.innerHTML = `<div class="board-empty">offline: ${e.message}</div>`; }
}
async function claimAch(id) {
  const r = await API.claimAchievement(state.player.handle, id).catch((e) => ({ ok: false, reason: e.message }));
  if (r.ok) { setCurrency(r.currency); burst(100); Audio.milestone(); banner(`✓ claimed +◈${fmt(r.reward)}`); loadAchievements(); loadTitles(); }
  else banner('✕ ' + (r.reason || 'nope'));
}

function setClaimDot(n) {
  const has = Number(n) > 0;
  $('#home-chip').classList.toggle('has-claim', has);
  $('#play-chip').classList.toggle('has-claim', has);
  const dot = $('#ach-tab-dot'); if (dot) dot.classList.toggle('hidden', !has);
}
async function refreshClaimable() {
  if (!state.player) return;
  try { setClaimDot((await API.achievements(state.player.handle)).claimable); } catch {}
}

// ── live feed + announcements (big banner) ───────────────────────────────────
async function refreshLive() {
  try {
    const s = await API.live();
    $('#live-count').textContent = `${s.grinding} grinding now`;
    $('#live-total').textContent = `${fmt(s.total_answered)} answered all-time`;
    const bo = $('#board-online'); if (bo) bo.textContent = `${s.grinding} online`;
  } catch {}
}
async function pollAnnouncements(first) {
  try {
    const { rows } = await API.announcements(state.lastAnnId ?? 0);
    if (!rows.length) { if (first && state.lastAnnId == null) state.lastAnnId = 0; return; }
    const maxId = Math.max(...rows.map((r) => r.id));
    if (first || state.lastAnnId == null) { state.lastAnnId = maxId; buildTicker(rows); return; }
    const fresh = maxId > state.lastAnnId;
    rows.slice().reverse().forEach((r) => {
      if (r.id <= state.lastAnnId) return;
      if (state.player && r.handle === state.player.handle) return; // own → shown inline already
      enqueueBanner(announcementHtml(r));
    });
    state.lastAnnId = Math.max(state.lastAnnId, maxId);
    buildTicker(rows);
    // someone just hit a milestone/gamble → their rank likely moved; refresh now
    if (fresh && $('#board-overlay').classList.contains('open')) loadBoard();
  } catch {}
}
function announcementHtml(r) {
  const badge = r.title ? `<span class="title-badge">${escapeHtml(r.title)}</span>` : '';
  if (r.kind === 'gamble') return `<span class="glyph">🎲</span> ${badge}<span class="who">${escapeHtml(r.handle)}</span> GAMBLED &amp; LANDED A <span class="big">${escapeHtml(r.detail || '')}</span> SHOT <span class="a-tag">+◈</span>`;
  return `<span class="glyph">▚</span> ${badge}<span class="who">${escapeHtml(r.handle)}</span> HIT <span class="big">${r.milestone}</span> QUESTIONS`;
}
function buildTicker(rows) {
  const track = $('#ticker-track');
  if (!rows || !rows.length) { track.textContent = 'no milestones yet — be the first to hit 10. grind now ▚'; track.classList.remove('scroll'); return; }
  const parts = rows.slice(0, 10).map((r) => r.kind === 'gamble'
    ? `<span class="who">${escapeHtml(r.handle)}</span> gambled ${escapeHtml(r.detail || '')}`
    : `<span class="who">${escapeHtml(r.handle)}</span> hit <span class="hit">${r.milestone}</span>`);
  const line = parts.join('  ▚  ') + '  ▚  ';
  track.innerHTML = line + line; track.classList.add('scroll');
}

// big sliding banner queue
function enqueueBanner(html) { state.annQueue.push(html); showNextBanner(); }
function showNextBanner() {
  if (state.bannerBusy || !state.annQueue.length) return;
  state.bannerBusy = true;
  const html = state.annQueue.shift();
  const b = $('#announce-banner');
  $('#announce-inner').innerHTML = html;
  b.classList.add('show');
  setTimeout(() => {
    b.classList.remove('show');
    setTimeout(() => { state.bannerBusy = false; showNextBanner(); }, 500);
  }, 4200);
}

// ── overlays / static wiring ─────────────────────────────────────────────────
function wireOverlays() {
  $('#board-close').addEventListener('click', () => { Audio.click(); closeBoard(); });
  $('#shop-close').addEventListener('click', () => { Audio.click(); closeVault(); });
  $('#board-overlay').addEventListener('click', (e) => { if (e.target.id === 'board-overlay') closeBoard(); });
  $('#shop-overlay').addEventListener('click', (e) => { if (e.target.id === 'shop-overlay') closeVault(); });
  $$('.vault-tab').forEach((b) => b.addEventListener('click', () => { Audio.click(); switchVaultTab(b.dataset.tab); }));
  $('#popup-continue').addEventListener('click', () => { Audio.click(); $('#login-popup').classList.remove('open'); popupResolve && popupResolve(true); });
  $('#popup-cancel').addEventListener('click', () => { Audio.click(); $('#login-popup').classList.remove('open'); popupResolve && popupResolve(false); });
}
function wireStatic() {
  $('#btn-info-back').addEventListener('click', () => { Audio.click(); show('home'); });
  $('#btn-sum-grind').addEventListener('click', () => { Audio.click(); startGrind(); });
  $('#btn-sum-home').addEventListener('click', () => { Audio.click(); show('home'); });
  // mock paper choice
  $('#mock-ai').addEventListener('click', () => { Audio.select(); startMock('mock'); });
  $('#mock-actual').addEventListener('click', () => { Audio.select(); startMock('actual'); });
  $('#mock-cancel').addEventListener('click', () => { Audio.click(); $('#mock-popup').classList.remove('open'); });
  $('#mock-popup').addEventListener('click', (e) => { if (e.target.id === 'mock-popup') $('#mock-popup').classList.remove('open'); });
}
function wirePlay() {
  $('#btn-confirm').addEventListener('click', confirmAnswer);
  $('#btn-gamble').addEventListener('click', gambleAnswer);
  $('#btn-board').addEventListener('click', () => { Audio.click(); openBoard(); });
  $('#play-chip').addEventListener('click', () => { Audio.click(); openVault(); });
  $('#btn-exit').addEventListener('click', () => { Audio.click(); show('home'); refreshLive(); }); // no "run" — leave freely
  $('#btn-sfx').addEventListener('click', () => { Audio.init(); syncSfx(Audio.toggleSfx()); });
}

// ── helpers ──────────────────────────────────────────────────────────────────
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function el(tag, cls, html) { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
function round1(n) { return Number.isInteger(n) ? n : Math.round(n * 10) / 10; }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function banner(text) {
  // tiny transient status line (distinct from the big announcement banner)
  let b = $('#mini-banner');
  if (!b) { b = document.createElement('div'); b.id = 'mini-banner'; b.className = 'mini-banner'; document.body.append(b); }
  b.textContent = text; b.classList.add('show');
  clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 2400);
}
