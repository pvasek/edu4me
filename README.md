# Q & Why

**▶ Live: [pvasek.github.io/edu4me](https://pvasek.github.io/edu4me/)**

Playful Czech learning app for teenagers (formerly *edu4me*; the repository and URL keep that name). Four courses:

- **Chemie**: from "what is a substance" to pre-university chemistry, in 9 levels, 63 lessons, 14 mini-games and a periodic table you collect like a sticker album.
- **Fyzika**: from measuring and forces to relativity, quanta and cosmology, in 12 levels, 80 lessons (ZŠ 6. třída → gymnázium / A-level), 10 mini-games and a collection of units and constants.
- **Biologie**: from the cell and microbes through plants, animals and the human body to molecular genetics, physiology and evolution, in 12 levels, 80 lessons (ZŠ 6. třída → gymnázium / A-level), 8 mini-games, 17 in-lesson experiments and a collection of famous model organisms.
- **Zeměpis**: from maps, coordinates and the Earth in space through relief, climate, people and the economy to the world's regions, Europe, Czechia and global challenges, in 12 levels, 85 lessons (ZŠ 6. třída → gymnázium / maturita), real maps from Natural Earth data, klimatograms and population pyramids, 9 mini-games, 17 in-lesson experiments and a collection of Earth's records.

- Runs fully in the browser, deployed on GitHub Pages; progress is saved locally (export/import available).
- Built with Vite, React 19 and TypeScript. No backend, no tracking.
- Designed to host more courses (maths is planned).

## Start

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests + content validation
npm run build   # production build to dist/
```

## Deployment

Pushing to `main` (or the current default branch `claude/chemistry-class-curriculum-l9unrq`) runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages. In the repository settings set **Pages → Source: GitHub Actions** once.

## Documentation

Everything about the product, design and content is in [`spec/`](spec/README.md): concept, architecture, style guide, content guidelines, gamification and the full chemistry and physics syllabi.
