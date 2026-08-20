# 🎰 CRAM ROYALE — Data-Driven Wagers

A cyberpunk casino mock-exam for the **DDW 10.020** final. Answer real mock questions,
wager imaginary chips on your confidence, and climb the leaderboard. The house — and
the exam — always wins. Probably.

Built for a friend who's revising. The gambling is a joke. The questions are not.

## Features

- **71 questions** in the real exam formats — multi-select (with the true −50%/wrong-pick
  penalty), dropdown fill-in-the-blank, numeric (tolerance-checked), matching, jumbled
  ordering, and MCQ.
  - **📝 Mock Exam** — the 21 real mock-final questions, in order, chains intact.
  - **🔮 Predicted Paper** — 50 similar/potential questions mined from the practice bank.
  - **🎲 Full Degen Run** — everything, shuffled.
  - **⚡ Concept Blitz** — multi-select only.
- **The casino** — every question shows a satirical "EXAM ODDS" gauge and a payout
  multiplier. Wager chips; a perfect answer pays out, a wrong one takes your stake.
  Two leaderboards: **Top Score** and **High Rollers** (chips).
- **Cyberpunk UI** — neon glass, glitch title, animated grid floor, procedural
  synthwave soundtrack + SFX (all generated with the Web Audio API — no asset files).
- **Easter eggs** — Konami-code HOUSE MODE, jackpot streaks, random rugpulls, a
  bankruptcy loan-shark, a troll "buy a hint" button, achievements, secret aliases
  (try `sigmoid`), and themed loading quips.
- **PostgreSQL** for questions, players, runs, and leaderboards. Answers are graded
  **server-side** and never sent to the client until you answer.

## Stack

Node + Express · PostgreSQL (`pg`) · vanilla-JS frontend (no build step) · deploys to
Railway with Nixpacks.

## Run locally

You need a PostgreSQL database. The quickest way is Docker:

```bash
docker run -d --name cram_pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cram_royale \
  -p 5433:5432 postgres:16-alpine

# then, in this folder:
npm install
export DATABASE_URL="postgres://postgres:postgres@localhost:5433/cram_royale"   # PowerShell: $env:DATABASE_URL="..."
npm run seed      # loads the 71 questions (also runs automatically on first boot)
npm start         # → http://localhost:3000
```

## Deploy to Railway

The app seeds its own schema + questions on boot, so deployment is just:

```bash
railway login                     # opens a browser (one-time)
railway init                      # create/select a project
railway add --database postgres   # provision Postgres (injects DATABASE_URL)
railway up                        # build & deploy
railway domain                    # get a public URL
```

`DATABASE_URL` is injected automatically once the Postgres plugin is attached — no
config needed. If you ever point the app at Railway's **public** proxy URL instead of
the private one, set `DATABASE_SSL=true`.

> 💸 Railway bills for usage. Deploy when you're ready.

## Environment variables

| var | required | notes |
|-----|----------|-------|
| `DATABASE_URL` | yes | Postgres connection string (Railway injects this). |
| `PORT` | no | defaults to 3000; Railway sets it automatically. |
| `DATABASE_SSL` | no | set `true` only for SSL-required (public proxy) connections. |

---

*chips are imaginary · your exam is not · study anyway*
