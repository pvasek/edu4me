# Geografie – mini-games

Games are listed per course in `src/games/registry.ts` (`courses.zemepis`: level number → what the game trains there). Every listed level has its own content set in the game. Playing without a level mixes all of them. Progress is stored under `zemepis:<gameId>`.

## Level matrix

| Game | id | Kind | Levels (what it trains) |
|---|---|---|---|
| Blesková výzva | `quickfire` | quiz | 1–12: questions from the level's lessons (generic engine) |
| Pravda, nebo lež? | `swipe` | quiz | 1–12: true/false statements from the level's lessons (generic engine) |
| Zeměpisná síť | `coordinates` | map | 1 read the coordinates of a pin on the world map (whole degrees, then degrees and minutes), place a pin at given coordinates, which of two places lies further north/east · 2 the equator, tropics and polar circles: in which heat zone a place lies, where the Sun can stand overhead. Uses `GeoMap` with the graticule. |
| Měřítko mapy | `map-scale` | map | 1 numerical ↔ graphic scale, map distance → real distance and back (cm, m, km), which map is larger-scale, measure with a virtual ruler on a drawn map. Answers computed, tolerance for measuring. |
| Vrstevnice | `contours` | map | 1 the height of a point between contours, the contour interval, which slope is steeper, pick the matching profile · 3 name the landform (vrchol, hřbet, údolí, sedlo, kotlina) from its contours, where a river flows · 9 a generated "tourist map" of Czech-like terrain: the highest point, the steepest path, where water flows. Terrain generated from simple height functions, contours computed (marching squares). |
| Časová pásma | `time-zones` | map | 2 local (solar) time from longitude (15° = 1 h), zone time (UTC offsets of real cities, SEČ/SELČ), flights across zones ("odlétáš v 10:00 SEČ, letíš 9 h, kolik je v Tokiu?"), crossing the date line. Offsets from curated data (whole-hour and the common half-hour zones). |
| Klimatogram | `climate-chart` | quiz | 4 read a climate chart (warmest month, yearly range, dry season, total precipitation), match a chart to its place or biome · 7 which region of the world a chart comes from · 10 climate types (simplified Köppen) and how a chart changed between 1961–1990 and 1991–2020 · 12 water balance: where farming needs irrigation. Uses the `climate` block renderer with real station normals. |
| Slepá mapa | `blind-map` | map | 3 mountain ranges, volcanoes and plate boundaries of the world · 7 states and regions of the continents · 8 states, capitals, rivers and mountains of Europe · 9 Czech regions, regional capitals, rivers and mountains · 11 states, borders and conflict areas. Tap the right place on a `GeoMap`, or name a highlighted state; the answer is checked against the map data. |
| Věková pyramida | `pop-pyramid` | quiz | 5 shape → type of population (progressive, stationary, regressive), read shares, where the baby boom is · 6 pyramid → level of development · 11 demographic transition stage from the pyramid, a projection 20 years ahead · 12 ageing, the dependency ratio, what a pension system faces. Uses the `pyramid` block renderer with real data (UN WPP, ČSÚ). |

## Rules for every geography game

Same as all Q & Why games: mobile first (330 px, one hand), keyboard accessible, Czech only, rounds of 8–12 tasks (1–3 min), immediate kind feedback with a one-line explanation, answers computed or taken from curated data (never invented), uses the shared game kit, `onFinish({ score, max })` exactly once. Place names in Czech exonyms where they exist (Vídeň, Mnichov, Peking), otherwise the local name. Map taps have a fair tolerance on small screens; tiny states are offered as "name it" tasks, not "tap it".

## Experiments (in-lesson, no score)

| Experiment | id | Lesson | The one idea it makes click |
|---|---|---|---|
| Zobrazení mapy | `map-projection` | z1-6 | Switch Mercator ↔ equal-area ↔ Robinson; move a circle of the same real size from the equator to the pole and watch it grow on Mercator. |
| Den a noc na Zemi | `day-night` | z2-2 | Turn the hour slider: the terminator moves, Praha passes from night to day; local time follows the longitude. |
| Výška Slunce a délka dne | `sun-angle` | z2-4, z2-5 | Latitude and date sliders → noon Sun height and day length; polar day appears beyond the polar circle in June. |
| Příliv a odliv | `tides` | z2-6 | Move the Moon around the Earth: the two bulges follow; add the Sun in line → spring tide, at right angles → neap tide. |
| Pohyb litosférických desek | `plate-motion` | z3-1 | Choose apart / together / sideways and the plate types: a ridge, a trench and volcanoes, mountains or a fault appear. |
| Řeka eroduje a ukládá | `river-erosion` | z3-5 | Slope and discharge sliders: when the river erodes, transports or deposits sand, gravel and clay (simplified Hjulström). |
| Tlak a vítr | `pressure-wind` | z4-2 | Change the pressure difference: wind speed grows; switch rotation on to see the deflection to the right (N hemisphere). |
| Teplota a nadmořská výška | `lapse-rate` | z4-3 | Climb a mountain: the temperature falls ≈ 0,65 °C per 100 m; vegetation belts change. |
| Povodňová vlna | `flood-hydrograph` | z4-6, z10-6 | Rain amount and land cover (forest, fields, town) → the hydrograph: peak height and lag time. |
| Doba zdvojnásobení | `doubling-time` | z5-1 | Growth rate % → doubling time (≈ 70 / %); compare Niger, India, Czechia. |
| Porodnost a úmrtnost | `birth-death-rates` | z5-2, z11-1 | Birth and death rate sliders → natural increase and how the pyramid's shape changes over 50 years. |
| Vzestup hladiny moře | `sea-level-rise` | z7-7, z10-7 | Raise the sea level: a low coast and an atoll go under; how many people live below that line. |
| Albedo a teplota Země | `albedo-balance` | z10-2 | Change the albedo (ice, forest, ocean) and the greenhouse strength → the equilibrium temperature of the Earth. |
| Scénáře změny klimatu | `climate-scenario` | z10-4 | Choose when emissions peak and how fast they fall → warming by 2100 (ranges of the IPCC SSP scenarios). |
| Riziko katastrofy | `risk-index` | z10-6 | Hazard, vulnerability and capacity sliders: the same earthquake, very different risk. |
| Hledání místa v GIS | `site-finder` | z10-8 | Switch layers and buffers (river floodplain, slope, roads, protected area) to find where a new school can be built. |
| Energetický mix | `energy-mix` | z12-5 | Set shares of coal, gas, nuclear, solar, wind, water → CO₂ per kWh, import dependence and how steady the supply is. |
