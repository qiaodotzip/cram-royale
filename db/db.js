// PostgreSQL access layer. Railway injects DATABASE_URL when a Postgres plugin
// is attached; locally we point at the Docker container (see .env.example).
import pg from 'pg';
import { TITLE_MAP } from './titles.js';
import { ACH_MAP } from './achievements.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('\n[FATAL] DATABASE_URL is not set.');
  console.error('  • Local: run the Postgres container and export DATABASE_URL (see README).');
  console.error('  • Railway: attach a Postgres plugin — it injects DATABASE_URL automatically.\n');
  process.exit(1);
}

const needsSsl = process.env.DATABASE_SSL === 'true' || /sslmode=require/.test(connectionString);
export const pool = new Pool({ connectionString, ssl: needsSsl ? { rejectUnauthorized: false } : false, max: 10 });
export const query = (text, params) => pool.query(text, params);

// ── schema ───────────────────────────────────────────────────────────────────
export async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS players (
      id          SERIAL PRIMARY KEY,
      handle      TEXT UNIQUE NOT NULL,
      answered    BIGINT DEFAULT 0,
      correct     BIGINT DEFAULT 0,
      currency    BIGINT DEFAULT 0,
      gambles_won BIGINT DEFAULT 0,
      title       TEXT,
      titles      TEXT[] DEFAULT '{}',
      claimed     TEXT[] DEFAULT '{}',
      created_at  TIMESTAMPTZ DEFAULT now(),
      last_seen   TIMESTAMPTZ DEFAULT now()
    );
    -- safe migrations for DBs created before these columns existed
    ALTER TABLE players ADD COLUMN IF NOT EXISTS gambles_won BIGINT DEFAULT 0;
    ALTER TABLE players ADD COLUMN IF NOT EXISTS claimed TEXT[] DEFAULT '{}';

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY, source TEXT NOT NULL, part INT, seq INT, topic TEXT,
      points NUMERIC, type TEXT, exam_odds NUMERIC, week INT, stem TEXT, code TEXT,
      images TEXT[], payload JSONB, answer JSONB, explanation TEXT
    );
    ALTER TABLE questions ADD COLUMN IF NOT EXISTS images TEXT[];

    CREATE TABLE IF NOT EXISTS announcements (
      id         SERIAL PRIMARY KEY,
      handle     TEXT,
      title      TEXT,
      kind       TEXT DEFAULT 'milestone',
      milestone  BIGINT,
      detail     TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_players_answered ON players (answered DESC);
    CREATE INDEX IF NOT EXISTS idx_ann_id ON announcements (id DESC);
  `);
}

const shape = (r) => r && ({
  handle: r.handle, answered: Number(r.answered), correct: Number(r.correct),
  currency: Number(r.currency), gambles_won: Number(r.gambles_won || 0),
  title: r.title, titles: r.titles || [], claimed: r.claimed || [],
});

// ── players ──────────────────────────────────────────────────────────────────
export async function findPlayer(name) {
  const { rows } = await query(`SELECT * FROM players WHERE lower(handle) = lower($1)`, [String(name || '').trim()]);
  return rows[0] ? shape(rows[0]) : null;
}

// Returns { player, existed }. Case-insensitive: same name = same account (login).
export async function loginOrCreate(name) {
  name = String(name || '').trim().slice(0, 24);
  if (!name) throw new Error('name required');
  const existing = await findPlayer(name);
  if (existing) { await touchPlayer(existing.handle); return { player: existing, existed: true }; }
  const { rows } = await query(
    `INSERT INTO players (handle) VALUES ($1)
     ON CONFLICT (handle) DO UPDATE SET last_seen = now() RETURNING *`, [name]);
  return { player: shape(rows[0]), existed: false };
}

export async function getPlayer(handle) {
  const { rows } = await query(`SELECT * FROM players WHERE handle = $1`, [handle]);
  return shape(rows[0]);
}

export async function bumpAnswered(handle, wasCorrect) {
  const { rows } = await query(
    `UPDATE players SET answered = answered + 1, correct = correct + $2, last_seen = now()
     WHERE handle = $1 RETURNING answered, correct, title`,
    [handle, wasCorrect ? 1 : 0]);
  return rows[0] || null;
}
export async function addCurrency(handle, delta) {
  const { rows } = await query(
    `UPDATE players SET currency = GREATEST(0, currency + $2), last_seen = now()
     WHERE handle = $1 RETURNING currency`, [handle, Math.round(delta)]);
  return rows[0] ? Number(rows[0].currency) : null;
}
export async function touchPlayer(handle) { await query(`UPDATE players SET last_seen = now() WHERE handle = $1`, [handle]); }
export async function bumpGamblesWon(handle) { await query(`UPDATE players SET gambles_won = gambles_won + 1 WHERE handle = $1`, [handle]); }

// ── achievements ─────────────────────────────────────────────────────────────
export async function claimAchievement(handle, id) {
  const a = ACH_MAP[id];
  if (!a) throw new Error('unknown achievement');
  const p = await getPlayer(handle);
  if (!p) throw new Error('unknown player');
  if (p.claimed.includes(id)) return { ok: false, reason: 'claimed', ...p };
  const current = a.metric === 'titles' ? p.titles.length : Number(p[a.metric] || 0);
  if (current < a.target) return { ok: false, reason: 'locked', ...p };
  const { rows } = await query(
    `UPDATE players SET currency = currency + $2, claimed = array_append(claimed, $3)
     WHERE handle = $1 RETURNING *`, [handle, a.reward, id]);
  return { ok: true, reward: a.reward, ...shape(rows[0]) };
}

// ── titles ───────────────────────────────────────────────────────────────────
export async function buyTitle(handle, id) {
  const t = TITLE_MAP[id];
  if (!t) throw new Error('unknown title');
  const p = await getPlayer(handle);
  if (!p) throw new Error('unknown player');
  if (p.titles.includes(id)) return { ok: false, reason: 'owned', ...p };
  if (p.currency < t.price) return { ok: false, reason: 'broke', ...p };
  const { rows } = await query(
    `UPDATE players SET currency = currency - $2, titles = array_append(titles, $3),
       title = COALESCE(title, $3)
     WHERE handle = $1 RETURNING *`, [handle, t.price, id]);
  return { ok: true, ...shape(rows[0]) };
}
export async function equipTitle(handle, id) {
  const p = await getPlayer(handle);
  if (!p) throw new Error('unknown player');
  const val = id && p.titles.includes(id) ? id : null; // null = unequip
  const { rows } = await query(`UPDATE players SET title = $2 WHERE handle = $1 RETURNING *`, [handle, val]);
  return shape(rows[0]);
}

// ── questions (server keeps the answer to compute odds, then strips it) ──────
export async function getQuestionsRaw(mode) {
  // grind = everything EXCEPT the image-based actual paper (it duplicates the mock)
  let where = `WHERE source <> 'actual'`;
  if (mode === 'mock') where = `WHERE source = 'mock'`;
  else if (mode === 'actual') where = `WHERE source = 'actual'`;
  const { rows } = await query(
    `SELECT id, source, part, seq, topic, points, type, week, stem, code, images, payload, answer
     FROM questions ${where} ORDER BY seq`);
  return rows;
}

// distinct weeks and question types with counts (for the options screen)
export async function getMeta() {
  const weeks = (await query(`SELECT week, count(*)::int AS n FROM questions GROUP BY week ORDER BY week`)).rows;
  const types = (await query(`SELECT type, count(*)::int AS n FROM questions GROUP BY type ORDER BY type`)).rows;
  return { weeks, types };
}
export async function getFullQuestion(id) {
  const { rows } = await query(`SELECT * FROM questions WHERE id = $1`, [id]);
  return rows[0] || null;
}

// ── leaderboard ──────────────────────────────────────────────────────────────
export async function topGrinders(limit = 25) {
  const { rows } = await query(
    `SELECT handle, answered, correct, title FROM players
      WHERE answered > 0 ORDER BY correct DESC, answered DESC, last_seen ASC LIMIT $1`, [limit]);
  return rows;
}
export async function liveStats() {
  const { rows } = await query(`
    SELECT (SELECT count(*)::int FROM players WHERE last_seen > now() - interval '3 minutes') AS grinding,
           (SELECT COALESCE(sum(answered),0)::bigint FROM players) AS total_answered,
           (SELECT count(*)::int FROM players) AS players`);
  return rows[0];
}

// ── announcements ────────────────────────────────────────────────────────────
export async function addAnnouncement(handle, title, kind, milestone, detail) {
  const { rows } = await query(
    `INSERT INTO announcements (handle, title, kind, milestone, detail) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [handle, title, kind, milestone, detail]);
  return rows[0].id;
}
export async function getAnnouncements(sinceId = 0, limit = 15) {
  const { rows } = await query(
    `SELECT id, handle, title, kind, milestone, detail, created_at
       FROM announcements WHERE id > $1 ORDER BY id DESC LIMIT $2`, [sinceId, limit]);
  return rows;
}
