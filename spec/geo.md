# Maps (src/geo)

Real maps for the Zeměpis course: the `map` lesson block, figures that need real coastlines and the map games. No hand-drawn outlines: everything is drawn from open data by one renderer, `GeoMap`.

## Data and licences

| Data | Source | Licence | Used for |
|---|---|---|---|
| Countries 1:50m and 1:10m (admin-0), Czech regions 1:10m (admin-1), rivers and lake centrelines 1:50m / 1:10m (+ 1:10m Europe supplement), lakes 1:50m / 1:10m (+ Europe) | [Natural Earth](https://www.naturalearthdata.com) via github.com/nvkelso/natural-earth-vector (geojson) | public domain | every view |
| Plate boundaries | PB2002 (P. Bird 2003, *An updated digital model of plate boundaries*, G³ 4(3), 1027), GeoJSON by H. Ahlenius, github.com/fraxen/tectonicplates | ODC-BY 1.0: credit "PB2002 (P. Bird, 2003)" | `plates` layer (GeoMap prints the credit under the map and as an SVG `<title>`) |

Not available (2026-10): river basins (HydroBASINS – data.hydrosheds.org) and Czech geomorphological units (AOPK ČR – data.nature.cz) could not be downloaded from the build environment (egress policy). Figures that need them must not invent polygons.

## Views (`src/geo/views.ts`)

Each view has a projection, a focus box that must be visible, a fixed aspect (width / height), a graticule step and the scale, tolerance and quantisation of its data module. The frame and the data clip box are derived in `src/geo/frame.ts`.

| View | Projection | Aspect | Data | Grid |
|---|---|---|---|---|
| `world` | Equal Earth | 2,05 | 1:50m, tol 0,12° | 15° (labels 30°) |
| `europe` | LAEA 15° E, 53° N | 1,15 | 1:50m | 10° |
| `central-europe` | LAEA 15,5° E, 50° N | 1,3 | 1:10m | 2° |
| `czechia` | LAEA 15,45° E, 49,8° N | 1,7 | 1:10m + 14 kraje | 1° |
| `africa` | LAEA 17° E, 2° N | 0,95 | 1:50m | 10° |
| `asia` | LAEA 95° E, 42° N | 1,3 | 1:50m | 10° |
| `middle-east` | LAEA 44° E, 29° N | 1,25 | 1:50m | 5° |
| `north-america` | LAEA 98° W, 45° N | 1,15 | 1:50m | 10° |
| `latin-america` | LAEA 78° W, 10° S | 0,78 | 1:50m | 10° |
| `oceania` | LAEA 160° E, 18° S | 1,45 | 1:50m (crosses 180°) | 10° |
| `arctic` | polar LAEA (0° at the bottom) | 1 | 1:50m, lat ≥ 41° | 10° |
| `antarctica` | polar LAEA (0° at the top) | 1 | 1:50m, lat ≤ −46° | 10° |

Figures may also pass a **custom frame** instead of a view id: `{ center: [lon, lat], bbox: [w, s, e, n], aspect?, title? }` (LAEA around the centre). The data comes from the finest preset whose frame contains it. Ready-made: `FIGURE_FRAMES['north-atlantic']` (Labrador to Norway). Custom frames are not available to the lesson block.

`src/geo/project.ts` also exports Mercator, Natural Earth I and Robinson (forward and inverse) for the projection experiment.

## Layers (`MapLayer`)

`graticule` (lines), `graticule-labels` (Czech: `50° s. š.`, `15° v. d.`), `tropics` (rovník, obratník Raka / Kozoroha at 23° 26′, polar circles at 66° 34′, labelled), `rivers`, `lakes` (large lakes are always drawn: Natural Earth countries include them), `plates`, `regions` (kraje, czechia only), `timezones` (15° stripes, offsets `UTC`, `+1`, `−5` along the top), `names` (Czech names of the highlighted states or regions; with nothing highlighted, every state – or every kraj on czechia with `regions` – that has room).

## GeoMap API (`src/geo/GeoMap.tsx`)

```tsx
<GeoMap view="europe" highlight={[{ codes: ['CZE'], tone: 'a', label: 'Česko' }]} points={[…]} routes={[…]} bands={[…]}
        layers={['rivers', 'names']} selected={['DEU']} interactive onPick={(hit) => …} legend animate>
  {({ project, u }) => <circle cx={project(14.4, 50.1)[0]} … r={4 * u} />}
</GeoMap>
```

- `view`: a `MapView` or a custom frame. The SVG viewBox is 1000 × 1000/aspect; text and symbols are scaled by the rendered width (`u` = viewBox units per CSS px) so they keep their size from 330 px to 760 px. The box keeps its aspect while the data loads (no layout shift).
- `highlight`: country codes (`src/geo/codes.ts`, ADM0_A3) or `CZ-xx` on czechia; tones a–d (a = level colour, b accent, c teal, d pink), tint + hatching. States that would be smaller than ~5 px are drawn as a small circle marker (Vatican, Monaco, San Marino, Liechtenstein, Andorra, Malta, Singapore, Bahrain, most island states on world / continent maps) and named next to it.
- `points`: `capital` double circle, `city` dot, `peak` triangle, `volcano` red cone with a plume, `quake` star, `place` pin; labels placed greedily around the symbol without overlaps.
- `routes`: smooth lines (long legs follow the great circle; split at the edge of the world map), `style: 'dashed'`, `arrow`.
- `bands`: translucent hatched stripes between two latitudes, label at the left edge.
- Legend (HTML, wraps on phones) from the highlight, route and band labels; the plates credit.
- `selected` (outlined codes), `interactive` (hover outline, pointer cursor), `onPick({ lat, lon, code?, region? })` from a tap; `children` drawn on top in viewBox units.
- `role="img"` with a Czech aria label built from the content ("Mapa Evropy: zvýrazněno (státy EU) …; body: Praha; vrstvy: řeky."); `label` overrides it.
- Motion: highlights, bands and markers fade in, solid routes draw in (≤ 1,2 s) when the map scrolls into view; reduced motion or `animate={false}` shows everything at once; `Replayable` replays it.

Pure helpers: `project(view, lon, lat)` → SVG [x, y]; `invert(view, x, y)` → `{ lon, lat }` or null; `viewBox(view)`; `getView` / `resolveView`; after `await loadView(view)`: `countryAt(view, lon, lat)`, `regionAt(lon, lat)`, `labelPoint(code, view?)` (Natural Earth LABEL_X/Y); `peekView(view)` gives the decoded data (countries, regions, lakes, rivers with names) for games.

## Data modules and loading

`src/geo/data/<view>.ts` (one per view) and `plates.ts`, generated, each its own lazily loaded chunk; app code reaches them only through `src/geo/load.ts` (`loadView`, `loadPlates`; a test checks the import graph). The lesson block loads `GeoMap` itself lazily (`src/illustrations/geography/MapBlockView.tsx`). Format (`src/geo/types.ts`): a topology per view (shared borders stored once as arcs, so coasts and borders are told apart and neighbours stay gap-free), coordinates quantised to `q` degrees and stored as zigzag-varint deltas in base64url strings. Total ≈ 380 KB of JS (world ≈ 64 KB, czechia ≈ 12 KB).

River names: Czech exonyms from the table `NAMES_CS` in the build script (Labe, Vltava, Morava, Dyje, Ohře, Sázava, Svratka, Svitava, Úhlava, Lužická Nisa, Kladská Nisa, Odra, Dunaj, Rýn, Visla, Volha, Nil, Amazonka, Jang-c'-ťiang, Chuang-che, Ganga, …); others keep the Natural Earth name. Natural Earth has no Berounka, Jizera, Otava, Lužnice, Opava, Bečva or Jihlava.

## Regenerating

```
node scripts/geo/build-geo.mjs [--cache DIR] [--only world,europe]
```

Node ≥ 22.18 (it imports the TypeScript presets directly), no dependencies; downloads go to the cache folder (default `$TMPDIR/natural-earth-cache`). It rewrites `src/geo/data/*.ts` and `src/geo/codes.ts` (Czech country names: CLDR via `Intl.DisplayNames('cs')`, with the curated overrides in `COUNTRY_CS`). After changing a view preset run it, then `npx vitest run src/geo`.
