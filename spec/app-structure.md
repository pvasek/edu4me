# How a course works in the app

The app's view of a course: what the units are, what each one contains, where it is stored, how it is loaded and what progress it saves. For *what* a course teaches see its syllabus (`spec/courses/<id>/syllabus.md`); for *how* lessons are written see [content-guidelines.md](content-guidelines.md).

## The tree

```
Course                      src/courses/<id>/index.ts            e.g. Biologie
├─ Level (úroveň) × 9–12    same file (LevelOutline)             e.g. l7 Dědičnost a evoluce
│  ├─ Lesson (lekce) × 5–8  outline in index.ts, content in levels/lN.ts
│  │  ├─ goals, hook        "Po této lekci budeš umět…", Kvído's opening question
│  │  ├─ Section × 3–6      title + blocks, read on one scrolling page
│  │  │  └─ Block × 4–14    p, figure, table, experiment, check, …
│  │  ├─ summary            the takeaways
│  │  └─ quiz               6–8 questions (+ the sections' checks)
│  └─ Level test (Závěrečná výzva)  levels/lN.ts → boss: 10–12 questions
├─ Mini-games               src/games/<id>/, listed per course and level in src/games/registry.ts
└─ Collection (album)       elements (chemistry) or one emblem per level (physics, biology)
```

## The units

| Unit | Defined in | Shown as | Saved progress |
|---|---|---|---|
| **Course** (`Course`) | `src/courses/<id>/index.ts`, registered in `src/core/registry.ts` (`COURSES`) | card on Home; the course overview (atlas) `#/c/<id>`: every level as a plate with its lessons, test and progress | – (sums of its lessons and levels) |
| **Level** (`LevelOutline`) | same file: id `l1…`, number, title, subtitle, stage (ZŠ 6. třída … maturita), colour, emblem `symbol`, the lesson outlines, `load()` | a plate in the overview: vignette, lesson list, level test row, "Začít / Pokračovat" | `levels["<course>:<level>"]` = best level-test score, set when the test is passed |
| **Lesson outline** (`LessonOutline`) | `index.ts`: id (`b7-2`), title, icon, minutes | a row in the level plate | – |
| **Lesson content** (`Lesson`) | `src/courses/<id>/levels/lN.ts`, key = the lesson id | `#/c/<id>/l/<level>/<lesson>`: read → quiz → results | `lessons["<course>:<lesson>"]` = best score, completion date; XP |
| **Section** (`LessonSection`) | inside the lesson: title, icon, blocks | a part of the one scrolling page, listed in the section nav at the top | – |
| **Block** (`Block`) | inside a section, `{ type: … }` | see the table below | – |
| **Quiz** | the lesson's `quiz` + its sections' `check` blocks | one quiz after reading: 12–14 questions (`src/lesson/lessonQuiz.ts`) | part of the lesson score |
| **Level test** | `boss` in `levels/lN.ts` | `#/c/<id>/l/<level>/vyzva`; pass mark 70 % | level record, level badge, the level's emblem/element |
| **Mini-game** | `src/games/<id>/`, metadata + `courses: { <id>: { <level>: 'what it trains' } }` in `src/games/registry.ts` | the course's games page `#/c/<id>/hry`, and `game` blocks inside lessons | `games["<course>:<game>"]` (chemistry: bare id): best, stars, plays |

Ids (course, level, lesson, game) are permanent: saved progress refers to them. Each course lists them in `progress-ids.json`, and a test fails if one disappears.

## What a lesson can contain (block types)

| Purpose | Blocks |
|---|---|
| Text and the teaching thread | `p` (paragraph), `h` (subheading), `callout` (tip, warning, fact, remember, Kvído), `keyterms`, `list` |
| Worked material | `example` (worked example), `formula`, `table` |
| Pictures (named) | `diagram` with a figure id: a drawn figure from `src/illustrations/figures/` (≈ 280, one lazy chunk per group) or a parametrised diagram (`src/diagrams/`) |
| Pictures drawn from data | chemistry: `elements`, `structure`, `molecule`, `particles`, `reaction`; physics: `graph`, `circuit`, `forces`, `rays`, `wave`; biology: `punnett`, `pedigree` |
| Picture summaries | `process` (steps), `iconlist`, `compare` (two columns), `flipcards` |
| Interaction | `experiment` ("Vyzkoušej si": a control and a live result, `src/lesson/experiments/`), `game` (link to a mini-game at the right level), `check` (a question; collected into the quiz, not shown inline) |

Rules for using them (order, an introducing sentence before every block, one visual per section, checks per section) are in [content-guidelines.md](content-guidelines.md).

## How it is loaded

1. `src/core/registry.ts` imports every course's `index.ts`: the outlines are small and always loaded (home, overview, badges).
2. Opening a lesson or level test calls the level's `load()`: `levels/lN.ts` is its own chunk, so a level's text is downloaded only when needed.
3. Inside a lesson, each figure group, experiment and mini-game is a separate lazy chunk (`figures/lazy.ts`, `experiments/index.ts`, `games/registry.ts`).
4. Content is plain TypeScript data: type-checked, validated by tests (`src/core/validate.ts` + `checkFlow` for the teaching thread), no CMS or server.

## Where progress is stored

One `ProgressState` (`src/core/progress.ts`) in the browser's `localStorage`, optionally synced to Google Drive: see [persistence.md](persistence.md). XP, ranks, streaks, badges and collections: [gamification.md](gamification.md).
