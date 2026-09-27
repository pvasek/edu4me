# Roadmap

## v0.1: Chemistry course (this release)

- [x] Concept, architecture, style guide, content guidelines, gamification spec
- [x] Chemistry syllabus aligned with RVP ZV, RVP G, IGCSE and A-level/AP
- [x] App shell: home, course map, level pages, lesson player, level tests, profile
- [x] All 54 lessons fully written, with quizzes and 9 level tests
- [x] 14 mini-games, 11 lesson diagrams
- [x] XP, ranks, streaks, 26 badges, element album, export/import of progress
- [x] Light and dark theme, mobile first
- [x] GitHub Pages deployment through GitHub Actions

## v0.2: Illustrated encyclopedia (this release)

- [x] Illustration system (`spec/illustration-guide.md`, `src/illustrations/catalog.ts`)
- [x] 106 engraved chemistry icons; icon on every lesson and every section
- [x] 103 molecules as rotatable 3D ball-and-stick models
- [x] Particle scenes (states, mixtures, solutions, before → after) and particle-drawn equations with atom ledgers
- [x] 71 engraved technical figures (apparatus, industrial processes, cycles, biomolecules) + 9 level vignettes
- [x] All 54 lessons rewritten picture-first: ≥ 1 visual per section (validated), ~⅓ less paragraph text
- [x] Every game has its own content for each level it supports (see games.md level matrix)
- [x] Course atlas with full per-level detail; 2D game stages for all games

## Next

- Split the figure library into per-level chunks (the lesson bundle is ~160 kB gzip).

- **Review pass by a chemistry teacher** of all content (typos, terminology, difficulty balance).
- Spaced-repetition review mode built from the question pool.
- Offline support (PWA: manifest + service worker) so the app works on the bus.
- Glossary ("Slovníček") generated from all `keyterms` blocks, with search.
- Printable summary sheets per level.
- Sound effects (optional, off by default).
- Accessibility audit with a screen reader.

## Future courses

1. **Fyzika**: mechanics, energy, electricity, optics, modern physics.
2. **Biologie**: cell, genetics, human body, ecology.
3. **Matematika**: functions, equations, geometry, probability.

Each course reuses the engine; the spec folder gets `spec/courses/<id>/` with its own syllabus and games.
