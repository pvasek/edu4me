# Wiring a course into the app

Done for Fyzika; follow the same files (grep `fyzika` to see each one).

## Structure (phase 3)
- [ ] `src/courses/<id>/index.ts` – `Course` with `available: false` until release; `icon`; `album` (`{ kind: 'emblems', title }` unless the course has its own album); per level `symbol`, `emblemName`, colour, stage, lessons; `load` per level file.
- [ ] `src/courses/<id>/content.test.ts` – runs `validateLevel` on every level (copy fyzika's).
- [ ] `src/courses/<id>/progress-ids.json` + `progress-ids.test.ts` – levels, lessons, games of the course (copy fyzika's; never remove an id later).
- [ ] `src/core/registry.ts` – add the course to `COURSES` (replacing a placeholder entry).
- [ ] `src/illustrations/catalog.ts` – new figure ids (grouped, comment per group) and icon ids; empty registries `src/illustrations/figures/<group>.tsx` spread into `figures/index.ts`; icon paths file spread into `ICON_PATHS`.
- [ ] `src/games/registry.ts` – `courses.<id>` levels for reused games (`quickfire`, `swipe`, …) and new games with placeholder components; `GameId` in `core/types.ts`; game `kind` in `ui/GameCard.tsx` if new.
- [ ] `src/lesson/experiments/catalog.ts` + `index.ts` – every experiment id of the syllabus registered, each with a stub `<id>.tsx` that passes `experiments.test.tsx`.
- [ ] New parametric blocks: type in `core/types.ts`, rules in `core/validate.ts` (+ `VISUAL`), a stub renderer wired into `lesson/BlockView.tsx`.
- [ ] `spec/courses/<id>/figures.md` and `games.md` written before agents start.

## Release (phase 6)
- [ ] Every catalog figure has a component (`catalog-complete.test.ts`), every experiment too (`experiments.test.tsx`).
- [ ] `src/illustrations/vignettes/` – a scene per level; `LevelVignette` delegates by `course`.
- [ ] `src/core/badges.ts` – course badges (`course: '<id>'`): first lesson, all lessons, one per level test.
- [ ] Lesson `minutes` in `index.ts` match the written lessons (~1 min per 120 words + quiz).
- [ ] `available: true`.
- [ ] Specs: `README.md`, `spec/README.md` (course files), `spec/roadmap.md`, `spec/architecture.md` (folder tree), `spec/gamification.md` (badges, album/emblems).
- [ ] Full check, visual pass, push, verify the deploy run.
