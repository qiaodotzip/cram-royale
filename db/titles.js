// Gambling-themed titles you buy with currency earned from winning gambles.
export const TITLES = [
  { id: 'lucky',      name: 'HOT HAND',      price: 60,   blurb: 'the deck loves you today.' },
  { id: 'degen',      name: 'DEGEN',         price: 100,  blurb: 'one more question, bro.' },
  { id: 'allin',      name: 'ALL-IN',        price: 150,  blurb: 'chips pushed, no regrets.' },
  { id: 'snakeeyes',  name: 'SNAKE EYES',    price: 180,  blurb: 'double or nothing.' },
  { id: 'counter',    name: 'CARD SHARK',    price: 240,  blurb: "you've counted every card." },
  { id: 'highroller', name: 'HIGH ROLLER',   price: 350,  blurb: 'the minimums bore you.' },
  { id: 'bookie',     name: 'PIT BOSS',      price: 500,  blurb: 'you set the lines now.' },
  { id: 'whale',      name: 'WHALE',         price: 750,  blurb: 'the casino sends a car.' },
  { id: 'house',      name: 'THE HOUSE',     price: 1000, blurb: 'you always win.' },
  { id: 'mademan',    name: 'KINGPIN',       price: 1500, blurb: 'untouchable. you run the floor.' },
];

// Earned (not bought) by finishing a mock paper, keyed by letter grade.
export const GRADE_TITLES = {
  A: { id: 'grade_a', name: 'ACED IT',     grade: 'A', earned: true },
  B: { id: 'grade_b', name: 'DISTINCTION', grade: 'B', earned: true },
  C: { id: 'grade_c', name: 'CLUTCH PASS', grade: 'C', earned: true },
  D: { id: 'grade_d', name: 'SURVIVOR',    grade: 'D', earned: true },
  F: { id: 'grade_f', name: 'COOKED',      grade: 'F', earned: true },
};
export const GRADE_TITLE_LIST = Object.values(GRADE_TITLES);

// letter grade from a mock score fraction
export function gradeFor(fraction) {
  if (fraction >= 0.8) return 'A';
  if (fraction >= 0.65) return 'B';
  if (fraction >= 0.5) return 'C';
  if (fraction >= 0.35) return 'D';
  return 'F';
}

export const TITLE_MAP = Object.fromEntries([...TITLES, ...GRADE_TITLE_LIST].map((t) => [t.id, t]));
export const titleName = (id) => TITLE_MAP[id]?.name || null;
