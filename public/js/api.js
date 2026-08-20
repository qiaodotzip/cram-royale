// Thin fetch wrappers around the CRAM ROYALE API.
async function jpost(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
}
async function jget(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export const API = {
  player: (handle, emoji) => jpost('/api/player', { handle, emoji }),
  questions: (mode) => jget(`/api/questions?mode=${encodeURIComponent(mode)}`),
  check: (payload) => jpost('/api/check', payload),
  run: (payload) => jpost('/api/run', payload),
  leaderboard: (board, mode) => jget(`/api/leaderboard?board=${board}${mode ? `&mode=${mode}` : ''}`),
  chips: (handle, delta) => jpost('/api/chips', { handle, delta }),
  bailout: (handle) => jpost('/api/bailout', { handle }),
};
