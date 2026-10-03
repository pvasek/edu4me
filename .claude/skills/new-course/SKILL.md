---
name: new-course
description: Build a new Q & Why course (school subject) end to end, the way Chemie and Fyzika were built. Use whenever the user wants a new class, course or subject ("nový kurz", "nový předmět", "add biology", "create a maths course"), or wants an existing course's syllabus rebuilt. Covers curriculum research (ZŠ 2. stupeň → gymnázium / pre-university), the syllabus, the course structure, lessons with the teaching thread, visuals, in-lesson experiments, mini-games and wiring the course into the app.
---

# Build a new course

A course is built in this order, and every phase finishes before the next one starts. **Always start from the syllabus.** Lesson ids become permanent the moment they ship (saved progress refers to them), so the structure has to be right before any lesson is written.

| Phase | Output | Gate |
|---|---|---|
| 1. Curriculum research | notes: what Czech schools and pre-university exams require | sources listed |
| 2. Syllabus | `spec/courses/<id>/syllabus.md` | user approves the level table |
| 3. Course structure | `src/courses/<id>/index.ts` + specs for figures and games | tsc clean, ids final |
| 4. Shared building blocks | figures, icons, games, experiments, vignettes (parallel agents) | catalog tests pass |
| 5. Lessons | `src/courses/<id>/levels/lN.ts` (one agent per level) | validator + teaching thread pass |
| 6. Wiring and release | course visible in the app, specs updated | full check, visual check, deploy |

Read first: `CLAUDE.md`, `spec/README.md`, `spec/content-guidelines.md` (especially **Teaching thread** and **Experiments**), `spec/illustration-guide.md`, and one finished course as the model: `spec/courses/fyzika/syllabus.md` + `src/courses/fyzika/` (the most recent and complete).

## 1. Curriculum research

Scope is always **from 2. stupeň ZŠ (6. třída, age 12) to the level before university** (gymnázium, maturita, university entrance).

Collect, with WebSearch (official PDFs on rvp.cz are often blocked from this container, so use search snippets, NPI pages and textbook tables of contents):
- **RVP ZV** – the subject's vzdělávací obor, expected outcomes for 6.–9. ročník. Check for the newest revision (the 2026 revision is valid from 28 Aug 2026) and NPI model ŠVP.
- **RVP G** – the subject's thematic areas and outcomes for gymnázium; the **maturita** topics where they exist.
- **International cross-check** – Cambridge IGCSE (age 14–16) and A-level / AP / IB (pre-university), so nothing a student abroad learns is missing.
- Other courses of the app that overlap (e.g. atoms in chemistry and physics, statistics in maths and biology): decide which course teaches what, and from which angle.

## 2. Syllabus (`spec/courses/<id>/syllabus.md`)

Use the template in [references/syllabus-template.md](references/syllabus-template.md). It must contain:
- **Sources table** – each curriculum, what it covers, how it is used.
- **Audit** – topics the Czech curriculum lacks or under-teaches but a pre-university student needs: **add them**. Name what was added and why.
- **Ordering principles** (5–8 numbered rules): prerequisites first, observe → measure → explain, spiral (ZŠ qualitatively, gymnázium again quantitatively), maths only when the maths course/age allows it, the hardest abstractions last. Reorder the official topics where the official order breaks a dependency.
- **Levels at a glance** – 9–12 levels, 5–8 lessons each, stage (ZŠ 6–9, G1–G4), the level's emblem (what the level test awards), the games per level.
- **Detailed syllabus** – every lesson with its id and the bullet list of required content. Lesson ids: `<letter><level>-<n>` (e.g. `b3-2`); level ids `l1…lN`.
- Level tests, and coordination with the other courses.

Then **show the user the levels-at-a-glance table** (and the audit's additions) and get a yes before phase 3.

## 3. Course structure

- `src/courses/<id>/index.ts` – the `Course`: id, title, tagline, colour, `icon`, `album` (`elements` for chemistry; `emblems` for others), and the levels with `symbol` + `emblemName`, colour, stage and the lessons (id, icon, title, minutes). Titles here are exact: lesson files must match them.
- `spec/courses/<id>/figures.md` – the named figures per group of 3 levels (what each must show), plus reusable figures from other courses.
- `spec/courses/<id>/games.md` – the level matrix of mini-games (reuse `quickfire` and `swipe` everywhere; reuse other courses' games where they fit; new games only where a real skill is trained).
- Everything in [references/wiring-checklist.md](references/wiring-checklist.md) that can be done before content exists (registry entry with `available: false`, progress ids, content test, empty figure registries, game registrations with placeholders).

## 4. Shared building blocks (parallel agents)

Launch background agents, each owning its own files (never two agents on one file). Write each brief into the scratchpad from the templates in `references/` and give every agent its own scratchpad subfolder for helper files.
- **Figures**: one agent per figure group (`src/illustrations/figures/<group>/` + its registry), see [references/figures-brief.md](references/figures-brief.md).
- **Icons**: new icon ids for the subject (`src/illustrations/catalog.ts` + an icon-paths file).
- **Games**: 2–3 games per agent, see [references/games-brief.md](references/games-brief.md).
- **Experiments**: small in-lesson interactives where a control makes the idea click, see [references/experiments-brief.md](references/experiments-brief.md).
- **Vignettes**: one engraved scene per level (`src/illustrations/vignettes/`).
- **Parametric blocks**: check `src/core/types.ts` first. If the subject needs a drawing type that is data-shaped (like `graph`, `circuit`, `forces` for physics), add one block type with renderer, validator and tests rather than dozens of named figures.

Concurrency limit is 20 agents. Lessons (phase 5) can start as soon as the figure ids exist in the catalog, because lessons reference ids, not drawings.

## 5. Lessons (one agent per level)

Brief: [references/lesson-brief.md](references/lesson-brief.md). The format, in short:
- **Short and dense, with a kind teacher as the glue**: every section opens with a paragraph that sets up its question and links back; every list, table, figure, formula, experiment and example is introduced by 1–2 sentences; traps are named; each section closes with a lead-in to the next.
- **Facts and examples**: every formula or procedure has a worked example; real-world hooks (sport, kitchen, phone, nature, space).
- **Lots of visuals**: at least one per section; named figures, parametric blocks, process / iconlist / compare / flipcards.
- **Experiments in the lesson** where a control explains better than a picture; **mini-games** linked where they train the skill.
- Every section ends with a `check`; 7–8 quiz questions; a 12-question level test.

Agents verify with the content validator and the teaching-thread check (commands in the brief). Commit each level as soon as it passes; never commit a level that is still being written.

## 6. Wiring and release

Finish [references/wiring-checklist.md](references/wiring-checklist.md): `available: true`, badges, album/emblems, vignettes, course in `COURSES`, specs (README, spec/README, roadmap, architecture), recomputed lesson minutes.

Before pushing: `npx tsc --noEmit -p tsconfig.json && npx vitest run && npx vite build`, then a headless visual pass (playwright-core with `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; hash routes need `page.reload()` after `goto`): home, course atlas, a level, two lessons, the level test, the games page, at 390 px and ~1100 px, light and dark. Pushing to `main` deploys; check the GitHub Actions run.

## Lessons learned (don't repeat)

- Lesson ids, level ids and game ids are permanent once shipped; renaming loses learners' progress (`progress-ids.json` tests guard this).
- Physics-style quantities are plain text with `_{}`/`^{}`; `$…$` is chemistry mode only.
- One file per level. A split file (like chemie `l6b.ts`) must be listed explicitly in agent briefs or it gets skipped.
- Agents share the scratchpad: give each its own subfolder, and forbid temporary files in `src/`.
- Bridges must link back to the text just before and name the next thing concretely; a vague allusion confuses (see the rejected example in content-guidelines).
- Vector art means real paths. Never wrap a PNG in an SVG.
- Raster images from generators can carry metadata. Strip it, and prefer drawing in code.
