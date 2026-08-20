// Achievements — accomplishments that pay out ◈ currency when claimed (once).
// Tuned so that SOLVING QUESTIONS alone (answered + correct) funds every title:
// the answered+correct rewards total well over the 4,830 needed to buy all titles.
export const ACHIEVEMENTS = [
  // ── volume: just answer questions ──
  { id: 'first',    name: 'FIRST BLOOD',     blurb: 'answer your first question',  reward: 25,   metric: 'answered',    target: 1 },
  { id: 'ten',      name: 'WARMING UP',       blurb: 'answer 10 questions',         reward: 50,   metric: 'answered',    target: 10 },
  { id: 'q25',      name: 'GETTING SERIOUS',  blurb: 'answer 25 questions',         reward: 80,   metric: 'answered',    target: 25 },
  { id: 'fifty',    name: 'ON A HEATER',      blurb: 'answer 50 questions',         reward: 120,  metric: 'answered',    target: 50 },
  { id: 'q75',      name: 'LOCKED IN',        blurb: 'answer 75 questions',         reward: 180,  metric: 'answered',    target: 75 },
  { id: 'century',  name: 'CENTURY CLUB',     blurb: 'answer 100 questions',        reward: 250,  metric: 'answered',    target: 100 },
  { id: 'q200',     name: 'GRIND ARC',        blurb: 'answer 200 questions',        reward: 450,  metric: 'answered',    target: 200 },
  { id: 'q350',     name: 'TOUCH GRASS?',     blurb: 'answer 350 questions',        reward: 700,  metric: 'answered',    target: 350 },
  { id: 'q500',     name: 'THE MACHINE',      blurb: 'answer 500 questions',        reward: 900,  metric: 'answered',    target: 500 },
  { id: 'q1000',    name: 'ASCENDED',         blurb: 'answer 1000 questions',       reward: 1500, metric: 'answered',    target: 1000 },
  // ── skill: get them right ──
  { id: 'c5',       name: 'FIRST FIVE',       blurb: 'get 5 questions right',       reward: 40,   metric: 'correct',     target: 5 },
  { id: 'sharp25',  name: 'SHARPSHOOTER',     blurb: 'get 25 questions right',      reward: 120,  metric: 'correct',     target: 25 },
  { id: 'c50',      name: 'MARKSMAN',         blurb: 'get 50 questions right',      reward: 220,  metric: 'correct',     target: 50 },
  { id: 'sharp100', name: "DEAN'S LIST",      blurb: 'get 100 questions right',     reward: 380,  metric: 'correct',     target: 100 },
  { id: 'c200',     name: 'THE SCHOLAR',      blurb: 'get 200 questions right',     reward: 650,  metric: 'correct',     target: 200 },
  { id: 'c400',     name: 'THE PROFESSOR',    blurb: 'get 400 questions right',     reward: 1100, metric: 'correct',     target: 400 },
  // ── mock papers ──
  { id: 'mock1',    name: 'EXAM PREP',        blurb: 'finish a mock paper',         reward: 150,  metric: 'mocks_done',  target: 1 },
  { id: 'mock3',    name: 'TRIAL BY FIRE',    blurb: 'finish 3 mock papers',        reward: 350,  metric: 'mocks_done',  target: 3 },
  // ── gambling ──
  { id: 'gmb1',     name: "BEGINNER'S LUCK",  blurb: 'win a full gamble',           reward: 60,   metric: 'gambles_won', target: 1 },
  { id: 'gmb5',     name: 'HOUSE MONEY',      blurb: 'win 5 full gambles',          reward: 200,  metric: 'gambles_won', target: 5 },
  { id: 'gmb15',    name: 'THE FIX IS IN',    blurb: 'win 15 full gambles',         reward: 500,  metric: 'gambles_won', target: 15 },
  // ── collecting titles ──
  { id: 'drip1',    name: 'FRESH DRIP',       blurb: 'own your first title',        reward: 80,   metric: 'titles',      target: 1 },
  { id: 'drip3',    name: 'FULL WARDROBE',    blurb: 'own 3 titles',                reward: 250,  metric: 'titles',      target: 3 },
  { id: 'drip6',    name: 'DECORATED',        blurb: 'own 6 titles',                reward: 500,  metric: 'titles',      target: 6 },
  { id: 'dripAll',  name: 'THE COLLECTION',   blurb: 'own 10 titles',               reward: 1000, metric: 'titles',      target: 10 },
];
export const ACH_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

function metricValue(p, metric) {
  if (metric === 'titles') return (p.titles || []).length;
  return Number(p[metric] || 0);
}

export function evalAchievements(p) {
  const claimed = p.claimed || [];
  return ACHIEVEMENTS.map((a) => {
    const current = metricValue(p, a.metric);
    const unlocked = current >= a.target;
    return {
      id: a.id, name: a.name, blurb: a.blurb, reward: a.reward, target: a.target,
      current: Math.min(current, a.target), unlocked, claimed: claimed.includes(a.id),
    };
  });
}

export function claimableCount(p) {
  const claimed = p.claimed || [];
  return ACHIEVEMENTS.filter((a) => metricValue(p, a.metric) >= a.target && !claimed.includes(a.id)).length;
}
