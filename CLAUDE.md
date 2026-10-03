# Q & Why – notes for Claude

Czech learning app for teens, formerly edu4me (Vite + React 19 + TS, deployed to GitHub Pages). Courses: Chemie, Fyzika. The spec in `spec/` is the source of truth; read the relevant file before changing anything it covers (`spec/README.md` lists them).

## Writing or editing lessons (any course)

Follow **spec/content-guidelines.md** in full, especially **"Teaching thread (výkladová nit)"**:
- A lesson reads like a teacher explaining, not a stack of facts. Every section opens with a paragraph that sets up its question and links to what came before.
- Every list, table, figure, formula and example is introduced by a short `p` (what to look at, why). Two content blocks never follow each other without a sentence between them.
- Say why, not only what. Name the common trap. Close each section with one sentence that leads to the next.
- Bridges are 1–2 meaningful sentences that link back to the previous text and name the next thing concretely (no vague allusions). Keep lessons condensed: no filler.

Other must-reads for content: the course syllabus `spec/courses/<course>/syllabus.md` (order and scope), `spec/illustration-guide.md` (visuals), `spec/courses/<course>/figures.md` and `games.md`.

Checks: `npx vitest run src/courses src/core` (validator + `checkFlow` teaching-thread rules for every lesson; one level: `npx vitest run src/core/flow.test.ts -t "chemie l4\."`), `npx tsc --noEmit -p tsconfig.json`.

## Code

- Figures: `src/illustrations/figures/<group>/`, ids in `src/illustrations/catalog.ts`; every catalog id needs a component (`catalog-complete.test.ts`).
- Games: `src/games/<id>/`, registered per course in `src/games/registry.ts`.
- Brand: logo and wordmark in `src/assets/brand/` (true vector SVGs; a cream wordmark for dark mode), favicon in `public/`. Storage keys keep the old `edu4me-` prefix on purpose: renaming them would lose saved progress.
- Progress ids are permanent: see `src/courses/<course>/progress-ids.json` and `spec/persistence.md`.
- Full check before pushing: `npx tsc --noEmit -p tsconfig.json && npx vitest run && npx vite build`. Pushing to `main` deploys.
