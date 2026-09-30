# edu4me

**▶ Live: [pvasek.github.io/edu4me](https://pvasek.github.io/edu4me/)**

Playful Czech learning app for teenagers. Two courses:

- **Chemie**: from "what is a substance" to pre-university chemistry, in 9 levels, 63 lessons, 14 mini-games and a periodic table you collect like a sticker album.
- **Fyzika**: from measuring and forces to relativity, quanta and cosmology, in 12 levels, 80 lessons (ZŠ 6. třída → gymnázium / A-level), 10 mini-games and a collection of units and constants.

- Runs fully in the browser, deployed on GitHub Pages; progress is saved locally (export/import available).
- Built with Vite, React 19 and TypeScript. No backend, no tracking.
- Designed to host more courses (biology and maths are planned).

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
