// CRAM // S07 — Express server. Serves the static HUD frontend and a small JSON
// API. Answers are graded server-side so they never ship to the client.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initSchema, getOrCreatePlayer, bumpAnswered, touchPlayer,
  getQuestionsForClient, getFullQuestion, topGrinders, liveStats,
  addAnnouncement, getAnnouncements, pool,
} from './db/db.js';
import { seedQuestions, questionCount } from './db/seed.js';
import { gradeAnswer, isMilestone } from './db/grader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function boot() {
  await initSchema();
  if ((await questionCount()) === 0) {
    console.log('Seeding questions (table was empty)…');
    await seedQuestions();
  }
  console.log(`📚 ${await questionCount()} questions loaded.`);
}

const clean = (s, max = 24) => String(s || '').trim().slice(0, max);

// ── API ──────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// register / fetch a player by name
app.post('/api/player', async (req, res) => {
  try {
    const handle = clean(req.body?.handle);
    const emoji = clean(req.body?.emoji || '', 4);
    if (!handle) return res.status(400).json({ error: 'name required' });
    res.json(await getOrCreatePlayer(handle, emoji));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// questions for a mode (never includes answers). grind = all, mock = the paper.
app.get('/api/questions', async (req, res) => {
  try {
    const mode = clean(req.query.mode || 'grind', 12);
    res.json({ mode, questions: await getQuestionsForClient(mode) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// check one answer. In grind mode it also increments the answered counter and
// may fire a milestone announcement.
app.post('/api/check', async (req, res) => {
  try {
    const { questionId, response, handle } = req.body || {};
    const mode = clean(req.body?.mode || 'grind', 12);
    const q = await getFullQuestion(clean(questionId, 40));
    if (!q) return res.status(404).json({ error: 'unknown question' });

    const verdict = gradeAnswer(q, response);
    let answered = null, milestone = null;

    if (handle && mode === 'grind') {
      const row = await bumpAnswered(clean(handle), verdict.correct);
      answered = row ? Number(row.answered) : null;
      if (answered != null && isMilestone(answered)) {
        const p = await getOrCreatePlayer(clean(handle));
        await addAnnouncement(p.handle, p.emoji, answered);
        milestone = answered;
      }
    } else if (handle) {
      await touchPlayer(clean(handle));
    }

    res.json({
      correct: verdict.correct,
      fraction: verdict.fraction,
      pointsAwarded: verdict.pointsAwarded,
      correctAnswer: verdict.correctAnswer,
      explanation: verdict.explanation,
      answered, milestone,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// grind leaderboard: ranked by questions answered
app.get('/api/leaderboard', async (_req, res) => {
  try { res.json({ rows: await topGrinders(25) }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// live FOMO: how many are grinding, total answered
app.get('/api/live', async (_req, res) => {
  try { res.json(await liveStats()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// new milestone announcements since a given id
app.get('/api/announcements', async (req, res) => {
  try {
    const since = Math.max(0, parseInt(req.query.since, 10) || 0);
    res.json({ rows: await getAnnouncements(since, 15) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// SPA fallback
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
boot()
  .then(() => app.listen(PORT, () => console.log(`\n▚ CRAM // S07 live on http://localhost:${PORT}\n`)))
  .catch((e) => { console.error('Boot failed:', e); process.exit(1); });

process.on('SIGTERM', () => pool.end().then(() => process.exit(0)));
