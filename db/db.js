// PostgreSQL access layer. Railway injects DATABASE_URL when a Postgres plugin
// is attached; locally we point at the Docker container (see .env.example).
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('\n[FATAL] DATABASE_URL is not set.');
  console.error('  • Local: run the Postgres container and export DATABASE_URL (see README).');
  console.error('  • Railway: attach a Postgres plugin — it injects DATABASE_URL automatically.\n');
  process.exit(1);
}

// SSL: Railway's internal network needs none; the public proxy does. Opt in with
// DATABASE_SSL=true (or a sslmode=require in the URL).
const needsSsl = process.env.DATABASE_SSL === 'true' || /sslmode=require/.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  max: 10,
});

export const query = (text, params) => pool.query(text, params);

// ── schema ───────────────────────────────────────────────────────────────────
export async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS players (
      id         SERIAL PRIMARY KEY,
      handle     TEXT UNIQUE NOT NULL,
      emoji      TEXT DEFAULT '🎰',
      chips      BIGINT DEFAULT 1000,
      created_at TIMESTAMPTZ DEFAULT now(),
      last_seen  TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS questions (
      id          TEXT PRIMARY KEY,
      source      TEXT NOT NULL,
      part        INT,
      seq         INT,
      topic       TEXT,
      points      NUMERIC,
      type        TEXT,
      exam_odds   NUMERIC,
      stem        TEXT,
      code        TEXT,
      payload     JSONB,
      answer      JSONB,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS runs (
      id            SERIAL PRIMARY KEY,
      player_id     INT REFERENCES players(id) ON DELETE CASCADE,
      handle        TEXT,
      mode          TEXT,
      score         NUMERIC,
      max_score     NUMERIC,
      correct_count INT,
      total_count   INT,
      chips_delta   BIGINT,
      duration_ms   BIGINT,
      accuracy      NUMERIC,
      created_at    TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS answers_log (
      id          SERIAL PRIMARY KEY,
      run_id      INT REFERENCES runs(id) ON DELETE CASCADE,
      question_id TEXT,
      correct     BOOLEAN,
      points      NUMERIC,
      wager       BIGINT,
      payout      BIGINT,
      created_at  TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_runs_score ON runs (score DESC);
    CREATE INDEX IF NOT EXISTS idx_players_chips ON players (chips DESC);
  `);
}

// ── players ──────────────────────────────────────────────────────────────────
export async function getOrCreatePlayer(handle, emoji = '🎰') {
  handle = String(handle || '').trim().slice(0, 24);
  if (!handle) throw new Error('handle required');
  const { rows } = await query(
    `INSERT INTO players (handle, emoji) VALUES ($1, $2)
     ON CONFLICT (handle) DO UPDATE SET last_seen = now()
     RETURNING id, handle, emoji, chips`,
    [handle, emoji]
  );
  return rows[0];
}

export async function adjustChips(handle, delta) {
  const { rows } = await query(
    `UPDATE players SET chips = GREATEST(0, chips + $2), last_seen = now()
     WHERE handle = $1 RETURNING chips`,
    [handle, Math.round(delta)]
  );
  return rows[0]?.chips ?? null;
}

export async function setChips(handle, value) {
  const { rows } = await query(
    `UPDATE players SET chips = GREATEST(0, $2) WHERE handle = $1 RETURNING chips`,
    [handle, Math.round(value)]
  );
  return rows[0]?.chips ?? null;
}

// ── questions ────────────────────────────────────────────────────────────────
// Never selects the `answer` column — that stays server-side.
export async function getQuestionsForClient(mode) {
  let where = '';
  const params = [];
  if (mode === 'mock') where = `WHERE source = 'mock'`;
  else if (mode === 'predicted') where = `WHERE source = 'predicted'`;
  else if (mode === 'blitz') where = `WHERE type = 'multiselect'`;
  // 'all' → no filter
  // Order by the original sequence (seq), NOT by part — this preserves the real
  // mock order Q1…Q21 and keeps chained questions (e.g. the Q17→Q21 linreg chain)
  // contiguous. 'all' mode is shuffled server-side afterwards.
  const { rows } = await query(
    `SELECT id, source, part, seq, topic, points, type, exam_odds, stem, code, payload
     FROM questions ${where} ORDER BY seq`,
    params
  );
  return rows;
}

export async function getFullQuestion(id) {
  const { rows } = await query(`SELECT * FROM questions WHERE id = $1`, [id]);
  return rows[0] || null;
}

// ── runs & leaderboard ───────────────────────────────────────────────────────
export async function recordRun(run) {
  const { rows } = await query(
    `INSERT INTO runs (player_id, handle, mode, score, max_score, correct_count,
                       total_count, chips_delta, duration_ms, accuracy)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, created_at`,
    [run.playerId, run.handle, run.mode, run.score, run.maxScore, run.correctCount,
     run.totalCount, run.chipsDelta, run.durationMs, run.accuracy]
  );
  return rows[0];
}

export async function topScores(mode, limit = 20) {
  const useMode = ['mock', 'predicted', 'all', 'blitz'].includes(mode);
  const params = useMode ? [mode, limit] : [limit];
  const where = useMode ? 'WHERE mode = $1' : '';
  const lim = useMode ? '$2' : '$1';
  const { rows } = await query(
    `SELECT r.handle, p.emoji, r.mode, r.score, r.max_score, r.accuracy,
            r.duration_ms, r.created_at
     FROM runs r LEFT JOIN players p ON p.id = r.player_id
     ${where}
     ORDER BY r.score DESC, r.accuracy DESC, r.duration_ms ASC
     LIMIT ${lim}`,
    params
  );
  return rows;
}

export async function topChips(limit = 20) {
  const { rows } = await query(
    `SELECT handle, emoji, chips FROM players ORDER BY chips DESC, last_seen DESC LIMIT $1`,
    [limit]
  );
  return rows;
}
