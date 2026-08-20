# ▚ CRAM // S07 — DDW question grinder

A HUD/FUI-styled practice tool for the **DDW 10.020** final. Put your name in, then
grind questions. It's practice — right or wrong doesn't matter, reps do.

Built for friends who are revising. The humour is a joke. The questions are not.

## What it does

- **START GRIND** (the main mode) — an endless question grinder pulled from the real
  mock **plus** a bank of predicted questions (71 total). Every answer bumps your count
  on the **leaderboard**, which ranks purely by *volume answered* — correctness doesn't
  affect your rank, because it's practice.
- **MOCK PAPER** (side mode) — the real mock paper in order. No leaderboard, just a
  score summary at the end.
- **Live FOMO** — when anyone hits a milestone (10, then every 25) a global
  announcement fires: *"stef just hit 50 questions"*. Plus a live "N grinding now".
- **GUESS ODDS** — before you answer, it computes your odds of getting it right by
  *pure guessing* (e.g. 4 multi-select options → 1-in-16) with a snarky verdict. It's
  comedy, not advice.
- **Get it wrong → it explains why.** That's the actual point.
- Every question format the exam uses: multi-select (with the true −50%/wrong-pick
  penalty), dropdown fill-in-the-blank, numeric (tolerance-checked), matching, jumbled
  ordering, MCQ. Answers are graded **server-side** and never shipped to the client.

## Look & feel

Light HUD / FUI aesthetic — mono + red accent, corner brackets, registration marks,
technical labels, industrial type (Chakra Petch / Share Tech Mono). SFX only, no music.
Fully responsive.

## Stack

Node + Express · PostgreSQL (`pg`) · vanilla-JS frontend (no build step) · Nixpacks → Railway.

## Run locally

Needs PostgreSQL. Quickest way is Docker:

```bash
docker run -d --name cram_pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cram_royale \
  -p 5433:5432 postgres:16-alpine

npm install
export DATABASE_URL="postgres://postgres:postgres@localhost:5433/cram_royale"   # PowerShell: $env:DATABASE_URL="..."
npm run seed      # loads the 71 questions (also runs automatically on first boot)
npm start         # → http://localhost:3000
```

## Deploy to Railway

The app creates its schema + seeds its questions on boot, so once `DATABASE_URL` is
present it just works.

### Option A — Dashboard, from the private repo (recommended)

1. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → pick
   `cram-royale`. Railway auto-detects Node (Nixpacks) and runs `npm start`.
2. **+ New → Database → PostgreSQL**.
3. Open the **app service → Variables → New Variable** and add a *reference*:
   `DATABASE_URL = ${{Postgres.DATABASE_URL}}` (Railway autocompletes the `${{ … }}`).
4. It redeploys, seeds on boot, and you can **Generate Domain** under Settings → Networking.

Auto-deploys on every `git push`.

### Option B — CLI

```bash
railway login                     # opens a browser (one-time)
railway init --name cram-royale
railway add --database postgres
railway up --detach
railway variables --set "DATABASE_URL=\${{Postgres.DATABASE_URL}}"   # NOT auto-linked across services
railway domain
```

> ⚠️ Railway does **not** auto-inject `DATABASE_URL` into the app service — add the
> reference variable. Set `DATABASE_SSL=true` only if you use the public proxy URL.
>
> 💸 Railway bills for usage. Deploy when you're ready.

## Environment variables

| var | required | notes |
|-----|----------|-------|
| `DATABASE_URL` | yes | Postgres connection string (Railway injects this via the reference var). |
| `PORT` | no | defaults to 3000; Railway sets it automatically. |
| `DATABASE_SSL` | no | `true` only for SSL-required (public proxy) connections. |

---

*it's practice. right or wrong doesn't matter. only the grind counts.*
