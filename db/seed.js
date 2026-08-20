// Seeds the questions table from the data modules. Idempotent: upserts by id.
// Run with `npm run seed`. Also runs automatically on server boot if the table
// is empty.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSchema, query, pool } from './db.js';
import { mockQuestions } from '../data/mock-questions.js';
import { predictedQuestions } from '../data/predicted-questions.js';

export async function seedQuestions() {
  await initSchema();
  const all = [...mockQuestions, ...predictedQuestions];
  for (const q of all) {
    await query(
      `INSERT INTO questions (id, source, part, seq, topic, points, type, exam_odds,
                              stem, code, payload, answer, explanation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         source=$2, part=$3, seq=$4, topic=$5, points=$6, type=$7, exam_odds=$8,
         stem=$9, code=$10, payload=$11, answer=$12, explanation=$13`,
      [q.id, q.source, q.part, q.seq, q.topic, q.points, q.type, q.examOdds,
       q.stem, q.code, JSON.stringify(q.payload), JSON.stringify(q.answer), q.explanation]
    );
  }
  const { rows } = await query('SELECT count(*)::int AS n FROM questions');
  return rows[0].n;
}

export async function questionCount() {
  const { rows } = await query('SELECT count(*)::int AS n FROM questions');
  return rows[0].n;
}

// Allow running directly: `node db/seed.js`
const invokedDirectly = process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  seedQuestions()
    .then((n) => { console.log(`✅ Seeded ${n} questions.`); return pool.end(); })
    .then(() => process.exit(0))
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); });
}
