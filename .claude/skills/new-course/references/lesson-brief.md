# Brief: writing the lessons of one level (Q & Why)

Repo /home/user/edu4me (Vite + React + TS). Czech-only learning app for teens. Your level: **<COURSE> level <N> – <title>**, lessons <ids>. Write `src/courses/<course>/levels/l<N>.ts` (exporting default `LevelContent`: `{ lessons: { '<id>': {...}, … }, boss: [...] }`). Only edit that file; other agents write other levels at the same time. Keep helper files in your own scratchpad subfolder. Don't commit.

## Read first
- `CLAUDE.md`; `spec/content-guidelines.md` in full, especially **Teaching thread** and **Experiments**; `spec/illustration-guide.md`.
- `spec/courses/<course>/syllabus.md`: your level's bullets are the REQUIRED content; read the neighbouring levels so you don't teach out of order.
- `src/courses/<course>/index.ts`: lesson ids, titles (must match exactly), icons.
- `src/core/types.ts` (the Block union) and `src/core/validate.ts`.
- A finished level as the model of style and density: `src/courses/fyzika/levels/l2.ts` (lesson `f2-3` is the approved reference for the teaching thread).
- `spec/courses/<course>/figures.md` (figure ids), `games.md` (games of your level), `src/lesson/experiments/catalog.ts` (experiment ids).

## Format (lesson = ONE scrolling page, then ONE quiz)
- 5–6 sections. Every section: `icon`, an opening `p` that sets up the question and links back, at least one visual, a closing sentence leading on, and a `check` question at its end.
- goals 2–4; hook 1–3 sentences (spoken by the guide Kvído); summary 4–7 full sentences; quiz 7–8 questions, ≥ 3 kinds including `tf`, rising difficulty, every question with `explain`.
- **Teaching thread**: before every list, table, figure, formula, experiment or example that follows another content block, a 1–2 sentence `p` (what to look at, why). Say why, name the trap, no filler, no new facts hidden in bridges; bridges link back and name the next thing concretely.
- Every formula or procedure gets a worked `example` (problem → steps with a short "why" → answer with unit). Number questions with `unit` and `tolerance` where it fits.
- Short sentences at ZŠ levels; precise, quantitative, multi-step at gymnázium levels. Real-world hooks everywhere.
- Visuals: named figures (`diagram`), parametric blocks if the course has them, `process`, `iconlist`, `compare`, `flipcards`, `table`, `keyterms`. Only ids from `src/illustrations/catalog.ts`.
- `experiment` block where a control explains better than a picture (ids from the experiments catalog; introduce it with what to try, follow it with what to notice). At most one `game` block per lesson, only games listed for your level.
- `boss`: 12 questions over all lessons of the level, mixed kinds.
- Czech terminology as taught at Czech schools; decimal comma; units with a space; correct typography („“).

## Verify (fix every error in your file)
- `npx vitest run src/courses/<course>/content.test.ts -t "l<N> "` (note the space)
- `npx vitest run src/core/flow.test.ts -t "<course> l<N>\."` (teaching thread)
- `npx tsc --noEmit -p tsconfig.json 2>&1 | grep "levels/l<N>\."` prints nothing
- Re-read each lesson top to bottom as a student: does every sentence lead to the next?

## Report (≤ 150 words)
Section titles per lesson, visuals used most, figures or experiments you wished existed, anything unsure.
