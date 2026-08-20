// Seeds the questions table from the data modules. Idempotent: upserts by id.
// Also derives each question's course WEEK from its topic (used by the options
// screen to filter the grind pool). Run with `npm run seed`.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSchema, query, pool } from './db.js';
import { mockQuestions } from '../data/mock-questions.js';
import { predictedQuestions } from '../data/predicted-questions.js';

// Map a topic string to its DDW week. Order matters — more specific first.
export function weekFor(topic = '') {
  const t = topic.toLowerCase();
  if (/sigmoid|logistic/.test(t)) return 11;
  if (/confusion/.test(t)) return 11;
  if (/predict_class|build_model|one-vs-all/.test(t)) return 11;
  if (/concept · logistic|concept · confusion/.test(t)) return 11;
  if (/normal/.test(t)) return 10;
  if (/linear regression|multiple linear|polynomial|numpy|gradient|\bcost\b|regression metrics|\bmse\b|\br²\b|\br2\b/.test(t)) return 10;
  if (/pandas|dataframe|series/.test(t)) return 9;
  if (/plot|visualis|visualiz|boxplot|iqr/.test(t)) return 9;
  if (/state|sm_search/.test(t)) return 8;
  if (/graph|topolog|\bbfs\b|\bdfs\b|\bdag\b/.test(t)) return 6;
  if (/oop|abstract|inherit|super|dispatch|method resolution|vocabulary|composition/.test(t)) return 5;
  if (/heap|complexity/.test(t)) return 3;
  if (/recursion|code trace/.test(t)) return 3;
  if (/sort|inversion|swap|big-o/.test(t)) return 2;
  return 10;
}

export async function seedQuestions() {
  await initSchema();
  const all = [...mockQuestions, ...predictedQuestions];
  for (const q of all) {
    const week = q.week ?? weekFor(q.topic);
    await query(
      `INSERT INTO questions (id, source, part, seq, topic, points, type, exam_odds, week,
                              stem, code, payload, answer, explanation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         source=$2, part=$3, seq=$4, topic=$5, points=$6, type=$7, exam_odds=$8, week=$9,
         stem=$10, code=$11, payload=$12, answer=$13, explanation=$14`,
      [q.id, q.source, q.part, q.seq, q.topic, q.points, q.type, q.examOdds, week,
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

const invokedDirectly = process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  seedQuestions()
    .then((n) => { console.log(`✅ Seeded ${n} questions.`); return pool.end(); })
    .then(() => process.exit(0))
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); });
}
