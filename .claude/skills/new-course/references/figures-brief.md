# Brief: drawing one group of named figures (Q & Why)

You draw engraved SVG figures for the <course> course, group **<group>** (levels <a>–<b>), in /home/user/edu4me (Vite + React + TS + Motion `motion/react`).

Read first: `CLAUDE.md`; `spec/illustration-guide.md` incl. the "Steps" rules (processes as `StepFilm`, comparisons as `StepStrip` from `src/illustrations/sequence/StepFigure.tsx`; single pictures finish animating in ≤ 2.5 s and fit a phone screen); `spec/courses/<course>/figures.md` section **<group>** (your ids and what each must show); `src/illustrations/catalog.ts`; `src/illustrations/figures/index.ts`; the most recent finished group for style (e.g. `src/illustrations/figures/fz4/` + `fz4.tsx` + its test). Grep the lesson files for your ids and read the captions so each figure shows what the text says.

You own `src/illustrations/figures/<group>/` (kit, one component per figure, css, test) and the registry `src/illustrations/figures/<group>.tsx`. Don't edit other files. Keep helper files in your own scratchpad subfolder; nothing temporary in `src/`.

Rules: Czech labels with correct notation (decimal comma); the level colour from `--level` as the accent; `role="img"` + a Czech aria-label (> 40 characters, with diacritics); readable at 330 px (narrow layout where needed); theme tokens only (dark mode); subject-correct geometry and data.

Verify: `npx vitest run src/illustrations` (catalog-complete may list other groups' ids, never yours); `npx tsc --noEmit -p tsconfig.json`; render every figure headlessly at 390 px and 700 px, light and dark (static markup or a scratch Vite build + playwright-core, executablePath `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) and fix overlaps, clipping and wrong content. Don't commit. Report in ≤ 150 words.
