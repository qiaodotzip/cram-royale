// Server-side grading. The client never sees an `answer` field; it POSTs a
// response here and gets back a verdict + (on demand) the explanation.

function normText(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^["'`]+|["'`]+$/g, '');
}

// grade a response → { correct, fraction, pointsAwarded, correctAnswer }
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
      // Real DDW rule: credit the fraction of corrects, −50% of the question per
      // wrong pick, floored at 0.
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

// Is `n` a milestone worth a live announcement? 10, then every 25.
export function isMilestone(n) {
  return n === 10 || (n >= 25 && n % 25 === 0);
}
