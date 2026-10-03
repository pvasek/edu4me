# Brief: in-lesson experiments (Q & Why)

An experiment is the `experiment` block (`{ type: 'experiment', id, caption? }`): a small interactive picture inside the lesson, with one or two controls, that makes ONE idea click. It is not a game: no score, no XP. Rules: `spec/content-guidelines.md`, "Experiments". Examples to copy: `src/lesson/experiments/density-float.tsx`, `ohm-law.tsx`.

Use one when moving a control shows a relationship better than a static picture can (a proportion, a threshold, a balance, a cause and effect), e.g. density ↔ floating, U and R → I, concentration → pH colour, slope of a line ↔ its equation, population ↔ resources.

Build: add the id to `src/lesson/experiments/catalog.ts`; `src/lesson/experiments/<id>.tsx` with a default export using the kit (`Experiment`, `Control`, `Readout`; extend the kit generically if needed); pure logic exported and unit-tested; register it lazily in `index.ts`. The SVG has `role="img"` and a Czech aria-label describing the current state; Czech labels, decimal comma; theme tokens only; readable at 330 px; native range inputs (keyboard); reduced motion respected. An optional "Úkol" challenge („Nastav … tak, aby …“) shows "Hotovo!" when met.

Place it in its lesson where the idea is taught: a `p` before it (what to try, why) and, if a content block follows, a sentence after it (what to notice). Verify: `npx vitest run src/lesson src/core/flow.test.ts`, the course content test for that level, tsc, and screenshots at 390 px and 900 px, light and dark, after moving the sliders programmatically.
