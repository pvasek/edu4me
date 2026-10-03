# Architecture

## Stack

- **Vite + React 19 + TypeScript** (strict), React Router (hash routing so that deep links work on GitHub Pages without server rewrites).
- No UI framework: plain CSS with design tokens (`src/ui/theme.css`), co-located component CSS.
- Fonts are self-hosted through `@fontsource` packages: no external requests at runtime.
- **Vitest** for unit tests, including a content validator that checks every lesson against the rules.
- **GitHub Actions → GitHub Pages**: `.github/workflows/deploy.yml` runs tests, builds and deploys on every push to `main`. The build uses a relative `base: './'`, so it works under `https://<user>.github.io/<repo>/`.

## Folder structure

```
spec/                      product & design specification (this folder)
src/
  main.tsx, App.tsx        entry, routes, theme sync
  core/
    types.ts               content model shared by all courses
    markup.tsx             inline markup (**bold**, $H2SO4$, ^{sup}, ->)
    check.ts               answer checking (tolerant numbers, formulas, diacritics)
    progress.ts            local progress store: XP, streak, lessons, games, album
    progressMerge.ts       schema migration + conflict-free merge of two progress copies
    persistence/           local storage, sync engine, remote backends (Google Drive) – see spec/persistence.md
    badges.ts              badge definitions
    registry.ts            list of courses
    validate.ts            content rules used by tests
    questionPool.ts        collects questions for quiz games
    useLevelContent.ts     lazy loading of level content
  ui/                      theme, header, mascot, element tile, icons, path map, confetti…
  lesson/                  block renderer, question view, quiz runner
  diagrams/                SVG diagrams used in lessons (bohr, ph-scale, galvanic, …)
  games/
    registry.ts            game metadata + lazy components
    types.ts               GameProps / GameResult contract
    shared/                periodic table, ion and nomenclature data
    <game-id>/index.tsx    one folder per game
  pages/                   Home, Course map, Level, Lesson, Level test, Games, Game shell, Profile
  courses/
    chemie/
      index.ts             outline: levels, lessons, colours, games, lazy loaders
      levels/l1.ts … l9.ts full lesson content per level (one JS chunk each)
      data/                elements, electron configuration, formula parser
    fyzika/
      index.ts             outline: 12 levels, 80 lessons, emblems (units/constants)
      levels/l1.ts … l12.ts
```

## Routes

| Path | Page |
|---|---|
| `#/` | Home: greeting, continue card, stats, courses |
| `#/c/chemie`, `#/c/fyzika` | Course atlas: all levels with their lessons |
| `#/c/chemie/l/l3` | Level: lesson path, level test, level games |
| `#/c/chemie/l/l3/l3-2` | Lesson: one scrolling page (read) → one quiz → results |
| `#/c/chemie/l/l3/vyzva` | Level test |
| `#/c/chemie/hry` | All mini-games |
| `#/c/chemie/hry/balance?uroven=l4` | Game shell (intro → play → results) |
| `#/profil` | Profile: rank, badges, emblem collections, element album, save & sync, settings |

## Content model

See `src/core/types.ts` and [content-guidelines.md](content-guidelines.md). In short: a `Lesson` has goals, a hook, sections of `Block`s and a quiz of `Question`s; a level file exports `LevelContent` (`lessons` + `boss`). Content is plain TypeScript data, so it is type-checked, diffable and needs no CMS. Each level is its own chunk, loaded on demand.

## Games

A game is a React component `({ levelId, onFinish }) => JSX` registered in `src/games/registry.ts`. The shell (`pages/GamePage.tsx`) handles the intro, the difficulty/level selection, error boundaries, results, stars and XP. A game only has to play one round and call `onFinish({ score, max, collected? })`.

## How to…

**Add a lesson or edit content**: edit `src/courses/chemie/levels/lN.ts`, keep ids in sync with `index.ts`, run `npm test` (the validator lists any rule violations).

**Add a game**: create `src/games/<id>/index.tsx`, add the id to `GameId` in `core/types.ts`, register metadata (with `courses: { <courseId>: { <level number>: 'what it trains' } }`) and the lazy import in `games/registry.ts`, and document it in `spec/courses/<course>/games.md`. A game may serve several courses; it gets `courseId` in its props. Game progress is stored under `gameKey(courseId, gameId)` (chemistry keeps un-prefixed ids).

**Add a course**: follow the project skill `.claude/skills/new-course/SKILL.md` (syllabus first, then structure, building blocks, lessons, wiring); its `references/wiring-checklist.md` lists every file to touch.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests + content validation
npm run build      # production build in dist/
```
