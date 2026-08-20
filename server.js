// CRAM ROYALE — Express server. Serves the static cyberpunk frontend and a small
// JSON API. Answer-checking and the chip economy are authoritative here so the
// client can't cheat the leaderboard (well — not trivially; it's a study game).
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initSchema, getOrCreatePlayer, adjustChips, setChips,
  getQuestionsForClient, getFullQuestion, recordRun, topScores, topChips, pool,
} from './db/db.js';
import { seedQuestions, questionCount } from './db/seed.js';
import { gradeAnswer, settleWager, payoutMultiplier } from './db/grader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const STARTING_CHIPS = 1000;

// ── boot: ensure schema + seed ───────────────────────────────────────────────
async function boot() {
  await initSchema();
  const n = await questionCount();
  if (n === 0) {
    console.log('Seeding questions (table was empty)…');
    await seedQuestions();
  }
  console.log(`📚 ${await questionCount()} questions loaded.`);
}

// ── helpers ──────────────────────────────────────────────────────────────────
const clean = (s, max = 24) => String(s || '').trim().slice(0, max);

// ── API ──────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// register / fetch a player
app.post('/api/player', async (req, res) => {
  try {
    const handle = clean(req.body?.handle);
    const emoji = clean(req.body?.emoji || '🎰', 4);
    if (!handle) return res.status(400).json({ error: 'handle required' });
    const player = await getOrCreatePlayer(handle, emoji);
    res.json({ ...player, startingChips: STARTING_CHIPS });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// questions for a mode (never includes answers)
app.get('/api/questions', async (req, res) => {
  try {
    const mode = clean(req.query.mode || 'mock', 12);
    let rows = await getQuestionsForClient(mode);
    // attach the display multiplier and a shuffled-but-stable order for 'all'
    rows = rows.map((q) => ({ ...q, multiplier: payoutMultiplier(q) }));
    if (mode === 'all') rows = shuffle(rows);
    res.json({ mode, questions: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// check one answer + settle the wager
app.post('/api/check', async (req, res) => {
  try {
    const { questionId, response, handle } = req.body || {};
    const wager = Math.max(0, Math.floor(Number(req.body?.wager) || 0));
    const streak = Math.max(0, Math.floor(Number(req.body?.streak) || 0));
    const q = await getFullQuestion(clean(questionId, 40));
    if (!q) return res.status(404).json({ error: 'unknown question' });

    const verdict = gradeAnswer(q, response);
    let chipsDelta = 0, newBalance = null, casino = null;

    if (handle) {
      const h = clean(handle);
      // don't let a player wager more than they hold
      const player = await getOrCreatePlayer(h);
      const stake = Math.min(wager, Number(player.chips));
      casino = settleWager(q, verdict.fraction, stake, streak);
      chipsDelta = casino.net;
      newBalance = await adjustChips(h, chipsDelta);
    }

    res.json({
      correct: verdict.correct,
      fraction: verdict.fraction,
      pointsAwarded: verdict.pointsAwarded,
      correctAnswer: verdict.correctAnswer,
      explanation: verdict.explanation,
      multiplier: payoutMultiplier(q),
      chipsDelta, newBalance,
      jackpot: casino?.jackpot || false,
      rugpull: casino?.rugpull || false,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// persist a completed run for the leaderboard
app.post('/api/run', async (req, res) => {
  try {
    const b = req.body || {};
    const handle = clean(b.handle);
    if (!handle) return res.status(400).json({ error: 'handle required' });
    const player = await getOrCreatePlayer(handle);
    const row = await recordRun({
      playerId: player.id, handle, mode: clean(b.mode, 12),
      score: Number(b.score) || 0, maxScore: Number(b.maxScore) || 0,
      correctCount: Number(b.correctCount) || 0, totalCount: Number(b.totalCount) || 0,
      chipsDelta: Math.round(Number(b.chipsDelta) || 0),
      durationMs: Math.round(Number(b.durationMs) || 0),
      accuracy: Number(b.accuracy) || 0,
    });
    // rank on the score board for this mode
    const board = await topScores(clean(b.mode, 12), 500);
    const rank = board.findIndex((r) => r.handle === handle && Number(r.score) === (Number(b.score) || 0)) + 1;
    res.json({ id: row.id, rank: rank || null, boardSize: board.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// leaderboards
app.get('/api/leaderboard', async (req, res) => {
  try {
    const board = clean(req.query.board || 'score', 8);
    if (board === 'chips') return res.json({ board, rows: await topChips(20) });
    // 'global' (the default) shows every run across all modes. A specific game
    // mode ('mock'|'predicted'|'all'|'blitz') filters to that mode only.
    const mode = clean(req.query.mode || 'global', 12);
    res.json({ board: 'score', mode, rows: await topScores(mode, 20) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// small chip adjustment for easter-egg flourishes (loan shark, buy-the-answer…)
// clamped and reason-logged; there's no real money so this stays lenient.
app.post('/api/chips', async (req, res) => {
  try {
    const handle = clean(req.body?.handle);
    if (!handle) return res.status(400).json({ error: 'handle required' });
    const delta = Math.max(-100000, Math.min(100000, Math.round(Number(req.body?.delta) || 0)));
    const newBalance = await adjustChips(handle, delta);
    res.json({ newBalance });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// bankruptcy bailout: top up to the pity floor
app.post('/api/bailout', async (req, res) => {
  try {
    const handle = clean(req.body?.handle);
    if (!handle) return res.status(400).json({ error: 'handle required' });
    const player = await getOrCreatePlayer(handle);
    if (Number(player.chips) > 50) return res.json({ newBalance: player.chips, granted: false });
    const newBalance = await setChips(handle, 250);
    res.json({ newBalance, granted: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// SPA fallback
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
boot()
  .then(() => app.listen(PORT, () => console.log(`\n🎰 CRAM ROYALE live on http://localhost:${PORT}\n`)))
  .catch((e) => { console.error('Boot failed:', e); process.exit(1); });

process.on('SIGTERM', () => pool.end().then(() => process.exit(0)));
