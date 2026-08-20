// Thin fetch wrappers around the CRAM // S07 API.
async function jpost(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
}
async function jget(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export const API = {
  player: (handle) => jpost('/api/player', { handle }),               // → { player, existed }
  questions: (mode) => jget(`/api/questions?mode=${encodeURIComponent(mode)}`),
  check: (payload) => jpost('/api/check', payload),                    // {questionId,response,handle,mode,gambled}
  leaderboard: () => jget('/api/leaderboard'),
  live: () => jget('/api/live'),
  meta: () => jget('/api/meta'),
  announcements: (since = 0) => jget(`/api/announcements?since=${since}`),
  titles: (handle) => jget(`/api/titles?handle=${encodeURIComponent(handle)}`),
  buyTitle: (handle, id) => jpost('/api/titles/buy', { handle, id }),
  equipTitle: (handle, id) => jpost('/api/titles/equip', { handle, id }),
  achievements: (handle) => jget(`/api/achievements?handle=${encodeURIComponent(handle)}`),
  claimAchievement: (handle, id) => jpost('/api/achievements/claim', { handle, id }),
  mockFinish: (handle, score, maxScore) => jpost('/api/mock/finish', { handle, score, maxScore }),
};
