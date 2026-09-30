# Roadmap

## v0.1: Chemistry course (this release)

- [x] Concept, architecture, style guide, content guidelines, gamification spec
- [x] Chemistry syllabus aligned with RVP ZV, RVP G, IGCSE and A-level/AP
- [x] App shell: home, course map, level pages, lesson player, level tests, profile
- [x] All lessons fully written, with quizzes and 9 level tests
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
- [x] All lessons rewritten picture-first: ≥ 1 visual per section (validated), ~⅓ less paragraph text
- [x] Every game has its own content for each level it supports (see games.md level matrix)
- [x] Course atlas with full per-level detail; 2D game stages for all games

## v0.3 (done)

- [x] Lessons are one scrolling page (section nav + reading progress) followed by one quiz
- [x] Compact course atlas: level nodes between plates, engraving in the plate header
- [x] Syllabus revision 2 (curriculum audit against RVP ZV/G, IGCSE, A-level/AP): 9 new lessons (nuclear chemistry, VSEPR + hybridisation, electrolysis + Faraday, entropy + Gibbs, tests for ions and gases, polymers, spectroscopy, metabolism, energy + climate), 63 lessons in total; deeper coverage of existing lessons; 17 new figures

## v0.4: Physics course

- [x] Physics syllabus from RVP ZV (2026 revision), RVP G, IGCSE 0625 and A-level/AP, reordered so every lesson builds on the previous ones (12 levels, 80 lessons)
- [x] Multi-course engine: games registered per course, course-aware header, home, atlas, level pages, badges and albums (elements for chemistry, units/constants for physics)
- [x] Parametric physics blocks drawn from data: `graph`, `circuit`, `forces`, `rays`, `wave`
- [x] 83 named physics figures, 37 physics icons, 12 level vignettes
- [x] 8 physics mini-games (unit conversion, motion graphs, force sum, float/sink, energy chain, circuit builder, ray optics, projectile) + quickfire and swipe

## Next

- Split the figure library into per-level chunks (the lesson bundle is ~160 kB gzip).

- **Review pass by a chemistry and a physics teacher** of all content (typos, terminology, difficulty balance).
- Spaced-repetition review mode built from the question pool.
- Offline support (PWA: manifest + service worker) so the app works on the bus.
- Glossary ("Slovníček") generated from all `keyterms` blocks, with search.
- Printable summary sheets per level.
- Sound effects (optional, off by default).
- Accessibility audit with a screen reader.

## Future courses

1. **Biologie**: cell, genetics, human body, ecology.
2. **Matematika**: functions, equations, geometry, probability.

Each course reuses the engine; the spec folder gets `spec/courses/<id>/` with its own syllabus and games.
