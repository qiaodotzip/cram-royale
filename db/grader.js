// Server-side grading + casino payout maths. The client never sees an `answer`
// field; it POSTs a response here and gets back a verdict.

// ── normalise a free-text answer for comparison ──────────────────────────────
function normText(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^["'`]+|["'`]+$/g, '');
}

// ── the payout multiplier shown on each question (bigger = riskier) ──────────
// Deterministic: computed identically for display (client) and payout (server).
export function payoutMultiplier(q) {
  const typeBonus = {
    numeric: 0.10, mcq: 0.25, text: 0.30,
    dropdowns: 0.20, matching: 0.35, ordering: 0.55, multiselect: 0.45,
  };
  const m = 1.9 + (Number(q.points) || 1) * 0.06 + (typeBonus[q.type] || 0.2);
  return Math.round(m * 100) / 100;
}

// ── grade a response → { correct, fraction, pointsAwarded, correctAnswer } ───
// fraction ∈ [0,1] drives both partial credit and the gambling payout.
export function gradeAnswer(q, response) {
  const points = Number(q.points) || 0;
  const A = q.answer || {};
  let fraction = 0;
  let correctAnswer = A;

  switch (q.type) {
    case 'numeric': {
      const v = Number(response);
      const tol = A.tolerance ?? 0.01;
      fraction = Number.isFinite(v) && Math.abs(v - A.value) <= tol ? 1 : 0;
      correctAnswer = A.value;
      break;
    }
    case 'text': {
      const accept = (A.accept || []).map(normText);
      fraction = accept.includes(normText(response)) ? 1 : 0;
      correctAnswer = (A.accept || [])[0];
      break;
    }
    case 'mcq': {
      fraction = response === A.correct ? 1 : 0;
      correctAnswer = A.correct;
      break;
    }
    case 'multiselect': {
      const correctSet = A.correct || [];
      const selected = Array.isArray(response) ? response : [];
      const hit = selected.filter((k) => correctSet.includes(k)).length;
      const wrong = selected.filter((k) => !correctSet.includes(k)).length;
      // Real DDW rule: credit the fraction of corrects, then −50% of the
      // question per wrong pick, floored at 0.
      const frac = (hit / (correctSet.length || 1)) - 0.5 * wrong;
      fraction = Math.max(0, frac);
      correctAnswer = correctSet;
      break;
    }
    case 'dropdowns': {
      const blanks = q.payload?.blanks || [];
      const got = blanks.filter((b) => normText(response?.[b.id]) === normText(A[b.id])).length;
      fraction = blanks.length ? got / blanks.length : 0;
      correctAnswer = A;
      break;
    }
    case 'matching': {
      const lefts = q.payload?.left || [];
      const got = lefts.filter((l) => normText(response?.[l.id]) === normText(A[l.id])).length;
      fraction = lefts.length ? got / lefts.length : 0;
      correctAnswer = A;
      break;
    }
    case 'ordering': {
      const order = A.order || [];
      const resp = Array.isArray(response) ? response : (response?.order || []);
      const got = order.filter((id, i) => id === resp[i]).length;
      fraction = order.length ? got / order.length : 0;
      correctAnswer = order;
      break;
    }
    default:
      fraction = 0;
  }

  fraction = Math.max(0, Math.min(1, fraction));
  const correct = fraction >= 0.999;
  const pointsAwarded = Math.round(points * fraction * 100) / 100;
  return { correct, fraction, pointsAwarded, correctAnswer, explanation: q.explanation };
}

// ── casino payout for one wager ──────────────────────────────────────────────
// win big on a perfect answer, lose your stake on a total miss, scale in between.
export function settleWager(q, fraction, wager, streak = 0) {
  wager = Math.max(0, Math.floor(Number(wager) || 0));
  const M = payoutMultiplier(q);
  // net = wager * (fraction * M − 1). fraction 1 → +wager*(M−1); fraction 0 → −wager.
  let net = Math.round(wager * (fraction * M - 1));

  // 🎰 streak bonus: reward correct answers on a hot streak.
  let jackpot = false;
  if (fraction >= 0.999 && streak >= 3) {
    net += 250 + streak * 50;
    jackpot = true;
  }

  // 📉 the house occasionally rugpulls a winner (~6%). Purely for the drama.
  let rugpull = false;
  if (net > 0 && Math.random() < 0.06) {
    net = Math.floor(net / 2);
    rugpull = true;
  }

  return { net, multiplier: M, jackpot, rugpull };
}
