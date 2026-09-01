# ▚ CRAM // S07

A HUD/FUI-styled question grinder I built to revise for a data-science &
algorithms final — then over-engineered into a full-stack app with a live
leaderboard, a satirical "odds of guessing right" engine, and a gambling
mini-economy. It's a study tool with a sense of humour: right or wrong doesn't
matter, reps do.

> **Live:** https://cram-royale-production.up.railway.app
> *(a shared demo instance — the leaderboard is public, so names are visible)*

Built as a personal project for a small group of friends who were revising
together. The humour is a bit; the questions and the engineering are real.

## What it does

- **START GRIND** — an endless question grinder drawing from a mock paper plus a
  bank of 100+ practice questions. Every answer bumps your count on the
  **leaderboard**, which ranks purely by *volume answered* — correctness doesn't
  affect rank, because it's practice.
- **MOCK PAPER** — a fixed 21-question paper in order, with a score summary and a
  grade-based title at the end. No leaderboard pressure.
- **Live activity** — when anyone hits a milestone or wins a gamble, a banner
  slides across the top (*"someone just hit 50 questions"*) in real time, plus a
  live "N grinding now" count. A little manufactured FOMO to keep you going.
- **GUESS ODDS** — before you answer, it computes your real odds of getting the
  question right by *pure guessing*, including the full partial-credit breakdown
  for multi-selects (chance of any marks, expected score, what "tick everything"
  actually scores), capped off with a snarky real-world comparison. Comedy, not
  advice.
- **I'LL GAMBLE** — one button auto-submits a random answer. Land it and you win
  **◈ currency** plus a global shout-out; the longer the odds, the bigger the
  payout. Spend currency in a shop of **titles** and unlock more via
  **achievements** — so you can fund the flashiest badge purely by grinding.
- **Get it wrong → it explains why.** That's the actual point.
- **Your name is your account** — no passwords. Re-enter it and you pick up where
  you left off, with an in-theme "continue as …?" confirm.
- Every question format the target exam uses: multi-select (with a true
  −50%-per-wrong-pick penalty), dropdown fill-in-the-blank, numeric
  (tolerance-checked), matching, jumbled ordering, and MCQ.

## Engineering notes

- **Server-authoritative grading.** Correct answers live only on the server and
  are stripped from every question the API sends the client — you can't read the
  key out of the network tab. All scoring, odds, and gamble payouts are computed
  server-side.
- **No build step.** The frontend is hand-written vanilla JS (ES modules), no
  framework and no bundler — just static files and a thin fetch layer.
- **Self-seeding.** On boot the server creates its schema (idempotent
  `ALTER TABLE … IF NOT EXISTS` migrations) and upserts the question set, so a
  fresh database comes up fully populated with no manual step.
- **Procedural audio.** All SFX are synthesized at runtime with the Web Audio
  API (no audio files), gated behind the first user gesture and toggleable.
- A few easter eggs are hidden in there. Konami code does something.

## Look & feel

Light HUD / FUI aesthetic — monospace + red accent, corner brackets,
registration marks, technical labels, industrial type (Chakra Petch / Share Tech
Mono). Fully responsive. SFX only, no music.

## Stack

Node · Express · PostgreSQL (`pg`) · vanilla-JS frontend (no build step).

## Run locally

Needs PostgreSQL. Quickest way is Docker:

```bash
docker run -d --name cram_pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cram_royale \
  -p 5433:5432 postgres:16-alpine

npm install
export DATABASE_URL="postgres://postgres:postgres@localhost:5433/cram_royale"
# PowerShell: $env:DATABASE_URL="postgres://postgres:postgres@localhost:5433/cram_royale"

npm start   # → http://localhost:3000
```

The schema and questions seed automatically on first boot. `npm run seed` reseeds
manually if you want it.

### Environment variables

| var | required | notes |
|-----|----------|-------|
| `DATABASE_URL` | yes | Postgres connection string. |
| `PORT` | no | defaults to `3000`. |
| `DATABASE_SSL` | no | set `true` for SSL-required connections. |

Any Node-friendly host works (the repo includes a Nixpacks config for
container platforms).

## License

MIT — see [LICENSE](LICENSE).

The practice questions are for revision and study only.

---

*it's practice. right or wrong doesn't matter. only the grind counts.*
