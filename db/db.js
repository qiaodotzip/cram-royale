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
      emoji      TEXT DEFAULT '',
      answered   BIGINT DEFAULT 0,
      correct    BIGINT DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS announcements (
      id         SERIAL PRIMARY KEY,
      handle     TEXT,
      emoji      TEXT,
      milestone  BIGINT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_players_answered ON players (answered DESC);
    CREATE INDEX IF NOT EXISTS idx_ann_id ON announcements (id DESC);
  `);
}

// ── players ──────────────────────────────────────────────────────────────────
export async function getOrCreatePlayer(handle, emoji = '') {
  handle = String(handle || '').trim().slice(0, 24);
  if (!handle) throw new Error('name required');
  const { rows } = await query(
    `INSERT INTO players (handle, emoji) VALUES ($1, $2)
     ON CONFLICT (handle) DO UPDATE SET last_seen = now(),
       emoji = COALESCE(NULLIF(EXCLUDED.emoji, ''), players.emoji)
     RETURNING id, handle, emoji, answered, correct`,
    [handle, emoji]
  );
  return rows[0];
}

// Increment a grinder's answered count (and correct tally). Returns the new
// answered total so the caller can check for milestones.
export async function bumpAnswered(handle, wasCorrect) {
  const { rows } = await query(
    `UPDATE players
       SET answered = answered + 1,
           correct  = correct + $2,
           last_seen = now()
     WHERE handle = $1
     RETURNING answered, correct`,
    [handle, wasCorrect ? 1 : 0]
  );
  return rows[0] || null;
}

export async function touchPlayer(handle) {
  await query(`UPDATE players SET last_seen = now() WHERE handle = $1`, [handle]);
}

// ── questions (never selects the `answer` column) ────────────────────────────
export async function getQuestionsForClient(mode) {
  const where = mode === 'mock' ? `WHERE source = 'mock'` : ''; // grind = everything
  const { rows } = await query(
    `SELECT id, source, part, seq, topic, points, type, exam_odds, stem, code, payload
     FROM questions ${where} ORDER BY seq`
  );
  return rows;
}

export async function getFullQuestion(id) {
  const { rows } = await query(`SELECT * FROM questions WHERE id = $1`, [id]);
  return rows[0] || null;
}

// ── leaderboard (grind: rank by # answered) ──────────────────────────────────
export async function topGrinders(limit = 25) {
  const { rows } = await query(
    `SELECT handle, emoji, answered, correct
       FROM players
      WHERE answered > 0
      ORDER BY answered DESC, correct DESC, last_seen ASC
      LIMIT $1`,
    [limit]
  );
  return rows;
}

// ── live FOMO ────────────────────────────────────────────────────────────────
export async function liveStats() {
  const { rows } = await query(`
    SELECT
      (SELECT count(*)::int FROM players WHERE last_seen > now() - interval '3 minutes') AS grinding,
      (SELECT COALESCE(sum(answered), 0)::bigint FROM players) AS total_answered,
      (SELECT count(*)::int FROM players) AS players
  `);
  return rows[0];
}

export async function addAnnouncement(handle, emoji, milestone) {
  const { rows } = await query(
    `INSERT INTO announcements (handle, emoji, milestone) VALUES ($1,$2,$3) RETURNING id`,
    [handle, emoji, milestone]
  );
  return rows[0].id;
}

export async function getAnnouncements(sinceId = 0, limit = 15) {
  const { rows } = await query(
    `SELECT id, handle, emoji, milestone, created_at
       FROM announcements
      WHERE id > $1
      ORDER BY id DESC
      LIMIT $2`,
    [sinceId, limit]
  );
  return rows;
}
