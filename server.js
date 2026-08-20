// CRAM // S07 — Express server. Serves the static HUD frontend and a JSON API.
// Answers are graded server-side so they never ship to the client.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initSchema, loginOrCreate, getPlayer, bumpAnswered, addCurrency, touchPlayer,
  buyTitle, equipTitle, getQuestionsRaw, getFullQuestion, topGrinders, liveStats,
  addAnnouncement, getAnnouncements, pool,
} from './db/db.js';
import { seedQuestions, questionCount } from './db/seed.js';
import { gradeAnswer, isMilestone } from './db/grader.js';
import { computeOdds } from './db/odds.js';
import { TITLES, titleName } from './db/titles.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function boot() {
  await initSchema();
  if ((await questionCount()) === 0) { console.log('Seeding questions…'); await seedQuestions(); }
  console.log(`📚 ${await questionCount()} questions loaded.`);
}
const clean = (s, max = 24) => String(s || '').trim().slice(0, max);

// ── API ──────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// login or create a player by name → { player, existed }
app.post('/api/player', async (req, res) => {
  try {
    const name = clean(req.body?.handle);
    if (!name) return res.status(400).json({ error: 'name required' });
    res.json(await loginOrCreate(name));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// questions for a mode: answers stripped, guess-odds attached
app.get('/api/questions', async (req, res) => {
  try {
    const mode = clean(req.query.mode || 'grind', 12);
    const raw = await getQuestionsRaw(mode);
    const questions = raw.map((q) => { const odds = computeOdds(q); const { answer, ...rest } = q; return { ...rest, odds }; });
    res.json({ mode, questions });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// check one answer (+ grind bookkeeping, milestones, and gamble payouts)
app.post('/api/check', async (req, res) => {
  try {
    const { questionId, response } = req.body || {};
    const handle = clean(req.body?.handle);
    const mode = clean(req.body?.mode || 'grind', 12);
    const gambled = !!req.body?.gambled;
    const q = await getFullQuestion(clean(questionId, 40));
    if (!q) return res.status(404).json({ error: 'unknown question' });

    const verdict = gradeAnswer(q, response);
    let answered = null, milestone = null, currency = null, gambleWin = false, gamblePayout = 0;

    if (handle && mode === 'grind') {
      const row = await bumpAnswered(handle, verdict.correct);
      answered = row ? Number(row.answered) : null;
      const activeTitle = titleName(row?.title);
      if (answered != null && isMilestone(answered)) {
        await addAnnouncement(handle, activeTitle, 'milestone', answered, null);
        milestone = answered;
      }
      if (gambled && verdict.correct) {
        const odds = computeOdds(q);
        gamblePayout = odds.gamblePayout;
        currency = await addCurrency(handle, gamblePayout);
        await addAnnouncement(handle, activeTitle, 'gamble', null, odds.headline);
        gambleWin = true;
      }
    } else if (handle) { await touchPlayer(handle); }

    res.json({
      correct: verdict.correct, fraction: verdict.fraction, pointsAwarded: verdict.pointsAwarded,
      correctAnswer: verdict.correctAnswer, explanation: verdict.explanation,
      answered, milestone, gambled, gambleWin, gamblePayout, currency,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// grind leaderboard (ranked by volume answered)
app.get('/api/leaderboard', async (_req, res) => {
  try {
    const rows = await topGrinders(25);
    res.json({ rows: rows.map((r) => ({ handle: r.handle, answered: Number(r.answered), correct: Number(r.correct), title: titleName(r.title) })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/live', async (_req, res) => {
  try { res.json(await liveStats()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const since = Math.max(0, parseInt(req.query.since, 10) || 0);
    const rows = await getAnnouncements(since, 15);
    res.json({ rows: rows.map((r) => ({ id: r.id, handle: r.handle, title: r.title, kind: r.kind, milestone: r.milestone != null ? Number(r.milestone) : null, detail: r.detail })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── titles shop ──────────────────────────────────────────────────────────────
app.get('/api/titles', async (req, res) => {
  try {
    const p = await getPlayer(clean(req.query.handle));
    res.json({ catalog: TITLES, balance: p ? p.currency : 0, owned: p ? p.titles : [], active: p ? p.title : null });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/titles/buy', async (req, res) => {
  try {
    const handle = clean(req.body?.handle); const id = clean(req.body?.id, 20);
    if (!handle) return res.status(400).json({ error: 'name required' });
    res.json(await buyTitle(handle, id));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/titles/equip', async (req, res) => {
  try {
    const handle = clean(req.body?.handle); const id = req.body?.id ? clean(req.body.id, 20) : null;
    if (!handle) return res.status(400).json({ error: 'name required' });
    res.json(await equipTitle(handle, id));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
boot()
  .then(() => app.listen(PORT, () => console.log(`\n▚ CRAM // S07 live on http://localhost:${PORT}\n`)))
  .catch((e) => { console.error('Boot failed:', e); process.exit(1); });

process.on('SIGTERM', () => pool.end().then(() => process.exit(0)));
