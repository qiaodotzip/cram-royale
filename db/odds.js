// Server-side guess-odds engine. Uses the answer (server-only) to give an
// accurate breakdown — especially for multi-select partial credit. The returned
// object is safe to send to the client (numbers only, no answer keys).

const factorial = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const fmtInt = (n) => (n === Infinity ? '∞' : Number(n).toLocaleString('en-US'));
const pctStr = (x) => `${(x * 100).toFixed(x >= 0.1 ? 0 : 1)}%`;
const round2 = (x) => Math.round(x * 100) / 100;

// funny (loosely real) comparisons, matched by closest log-odds
const REAL_WORLD = [
  { odds: 2, t: 'flip heads' },
  { odds: 4, t: 'see rain in London today' },
  { odds: 6, t: 'roll a 6 on one die' },
  { odds: 13, t: 'draw the exact card you need' },
  { odds: 20, t: 'get hit by a car this year' },
  { odds: 36, t: 'roll snake eyes' },
  { odds: 120, t: 'be dealt a poker straight' },
  { odds: 750, t: 'get audited by IRAS this year' },
  { odds: 15000, t: 'get struck by lightning in your life' },
  { odds: 300000, t: 'become an astronaut' },
  { odds: 14000000, t: 'win the lottery jackpot' },
];
function realWorldFor(oneIn) {
  if (oneIn === Infinity) return 'win the lottery — possibly twice';
  const target = Math.log(oneIn);
  let best = REAL_WORLD[0], bd = Infinity;
  for (const r of REAL_WORLD) { const d = Math.abs(Math.log(r.odds) - target); if (d < bd) { bd = d; best = r; } }
  return best.t;
}
function verdictFor(type, pFull) {
  if (type === 'numeric' || type === 'text') return 'guessing is not a strategy, king.';
  if (pFull >= 0.5) return 'basically a coin flip — you could genuinely cook.';
  if (pFull >= 0.25) return 'cope is statistically viable.';
  if (pFull >= 0.1) return 'slim. maybe actually read it.';
  if (pFull >= 0.03) return 'grim. a small prayer is advised.';
  return 'the odds are cinematically against you.';
}
function gamblePayout(type, oneIn) {
  if (type === 'numeric' || type === 'text') return 1000; // near-impossible → jackpot
  return Math.min(1500, Math.max(15, Math.round(oneIn * 4)));
}

export function computeOdds(q) {
  const p = q.payload || {};
  const pts = Number(q.points) || 1;
  const A = q.answer || {};
  let oneIn = 4, kind = '', pFull = 0.25, detail = [];

  switch (q.type) {
    case 'mcq':
      oneIn = p.options?.length || 4; kind = `1 of ${oneIn} choices`; pFull = 1 / oneIn; break;

    case 'multiselect': {
      const opts = p.options || [];
      const n = opts.length;
      const correct = new Set(A.correct || []);
      const total = Math.pow(2, n);
      let full = 0, any = 0, sum = 0;
      for (let mask = 0; mask < total; mask++) {
        let hit = 0, wrong = 0;
        for (let i = 0; i < n; i++) if (mask & (1 << i)) { correct.has(opts[i].key) ? hit++ : wrong++; }
        const frac = Math.max(0, hit / (correct.size || 1) - 0.5 * wrong);
        const marks = pts * frac;
        if (Math.abs(frac - 1) < 1e-9) full++;
        if (marks > 1e-9) any++;
        sum += marks;
      }
      oneIn = total; kind = `${n} options → 2^${n} = ${total} combos`;
      pFull = full / total;
      const selectAll = pts * Math.max(0, 1 - 0.5 * (n - correct.size));
      detail = [
        `chance of ANY marks ≈ ${pctStr(any / total)}`,
        `average score if you guess ≈ ${round2(sum / total)} / ${pts}`,
        `tick all ${n} → you score ${round2(selectAll)} / ${pts} (the −50%/wrong tax is brutal)`,
      ];
      break;
    }

    case 'dropdowns':
      oneIn = (p.blanks || []).reduce((a, b) => a * (b.options?.length || 1), 1);
      kind = `${(p.blanks || []).length} blanks, all-or-nothing`; pFull = 1 / oneIn; break;

    case 'matching': {
      const k = (p.left || []).length, m = (p.options || []).length || 1;
      oneIn = Math.pow(m, k); kind = `${k} rows × ${m} options`; pFull = 1 / oneIn; break;
    }
    case 'ordering': {
      const nn = (p.items || []).length; oneIn = factorial(nn); kind = `${nn}! possible orders`; pFull = 1 / oneIn; break;
    }
    case 'numeric': oneIn = Infinity; kind = 'an open real number'; pFull = 0; break;
    case 'text': oneIn = Infinity; kind = 'free text'; pFull = 0; break;
    default: oneIn = 4; pFull = 0.25;
  }

  const headline = oneIn === Infinity ? '≈ 0%' : (pFull >= 0.01 ? pctStr(pFull) : `1 in ${fmtInt(oneIn)}`);
  return {
    headline,
    oneIn: oneIn === Infinity ? null : oneIn,
    kind,
    verdict: verdictFor(q.type, pFull),
    realWorld: realWorldFor(oneIn),
    detail,
    gamblePayout: gamblePayout(q.type, oneIn),
  };
}
