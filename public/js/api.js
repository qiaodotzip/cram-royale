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
  player: (handle) => jpost('/api/player', { handle }),
  questions: (mode) => jget(`/api/questions?mode=${encodeURIComponent(mode)}`),
  check: (payload) => jpost('/api/check', payload),
  leaderboard: () => jget('/api/leaderboard'),
  live: () => jget('/api/live'),
  announcements: (since = 0) => jget(`/api/announcements?since=${since}`),
};
