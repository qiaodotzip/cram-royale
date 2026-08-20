// Achievements — accomplishments that pay out ◈ currency when claimed (once).
// Each has a `metric` read off the player and a `target` to reach.
export const ACHIEVEMENTS = [
  { id: 'first',    name: 'FIRST BLOOD',     blurb: 'answer your first question',  reward: 25,   metric: 'answered',    target: 1 },
  { id: 'ten',      name: 'WARMING UP',      blurb: 'answer 10 questions',         reward: 50,   metric: 'answered',    target: 10 },
  { id: 'fifty',    name: 'ON A HEATER',     blurb: 'answer 50 questions',         reward: 120,  metric: 'answered',    target: 50 },
  { id: 'century',  name: 'CENTURY CLUB',    blurb: 'answer 100 questions',        reward: 250,  metric: 'answered',    target: 100 },
  { id: 'grind250', name: 'NO LIFE',         blurb: 'answer 250 questions',        reward: 600,  metric: 'answered',    target: 250 },
  { id: 'sharp25',  name: 'SHARPSHOOTER',    blurb: 'get 25 questions right',      reward: 120,  metric: 'correct',     target: 25 },
  { id: 'sharp100', name: "DEAN'S LIST",     blurb: 'get 100 questions right',     reward: 350,  metric: 'correct',     target: 100 },
  { id: 'gmb1',     name: "BEGINNER'S LUCK", blurb: 'win your first gamble',       reward: 60,   metric: 'gambles_won', target: 1 },
  { id: 'gmb5',     name: 'HOUSE MONEY',     blurb: 'win 5 gambles',               reward: 220,  metric: 'gambles_won', target: 5 },
  { id: 'drip1',    name: 'FRESH DRIP',      blurb: 'own your first title',        reward: 80,   metric: 'titles',      target: 1 },
  { id: 'drip3',    name: 'FULL WARDROBE',   blurb: 'own 3 titles',                reward: 250,  metric: 'titles',      target: 3 },
  { id: 'dripAll',  name: 'THE COLLECTION',  blurb: 'own every title',             reward: 1000, metric: 'titles',      target: 10 },
];
export const ACH_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// current value of a metric for a player
function metricValue(p, metric) {
  if (metric === 'titles') return (p.titles || []).length;
  return Number(p[metric] || 0);
}

// evaluate all achievements against a player → display + claim state
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

// how many are unlocked but not yet claimed (drives the "claim me" dot)
export function claimableCount(p) {
  const claimed = p.claimed || [];
  return ACHIEVEMENTS.filter((a) => metricValue(p, a.metric) >= a.target && !claimed.includes(a.id)).length;
}
