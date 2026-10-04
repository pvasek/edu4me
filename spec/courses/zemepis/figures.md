# Zeměpis – named figures

Named figures are engraved SVG components used by the `diagram` block (`{ type: 'diagram', id }`). Ids live in `src/illustrations/catalog.ts`, components in `src/illustrations/figures/<group>/`, each group registered in `figures/<group>.tsx` and lazily in `figures/lazy.ts`. Style: `spec/illustration-guide.md` (processes as `StepFilm`, comparisons as `StepStrip`).

**Maps are not figures.** Anything that is a real map of the world, a continent, Europe or Czechia with highlighted states, regions, points, routes or latitude bands is a `map` block (real Natural Earth data, `src/geo/`). Climate charts are `climate` blocks, population pyramids are `pyramid` blocks, line graphs are `graph` blocks. A figure that needs a real coastline as its background (ocean currents, the Gulf Stream, the Czech watersheds) draws it with the `GeoMap` component from `src/geo/` instead of hand-drawn outlines.

## Reused from other courses

| id | Course | Used in |
|---|---|---|
| `seasons` | fyzika | Earth's orbit and the seasons (z2-4) |
| `moon-phases`, `eclipses` | fyzika | Moon and tides (z2-6) |
| `solar-system` | fyzika | Earth in the solar system (z2-1) |
| `earth-magnetism` | fyzika | compass, magnetic vs geographic north (z1-5) |
| `earth-layers`, `plate-boundaries`, `world-plates`, `rock-cycle` | biologie | the structure of the Earth, plates (z3-1, z3-2, z10-5) |
| `soil-profile` | biologie | soils (z3-7) |
| `water-cycle` | biologie | water on Earth (z4-5, z10-1) |
| `biomes`, `forest-storeys`, `succession` | biologie | biomes (z4-7, z7) |
| `geological-timescale`, `fossil-formation` | biologie | the age of mountains (z3-3) |
| `greenhouse-effect`, `ozone-layer`, `carbon-cycle`, `acid-rain` | chemie | climate and the atmosphere (z4-1, z4-7, z10-3, z9-6) |
| `power-plants` | fyzika | energy sources (z6-3, z12-5) |
| `human-migration` | biologie | the peopling of the Earth (z5-3) |
| `plastic-lifecycle` | chemie | circular economy (z12-7) |

## gz1 – levels 1–2 (maps, the Earth in space)

| id | Must show |
|---|---|
| `geo-spheres` | The landscape sphere (krajinná sféra) as overlapping spheres: litosféra, atmosféra, hydrosféra, pedosféra, biosféra and the human (socioekonomická) sphere, with one example of a link between two of them. |
| `globe-grid` | A globe with poles, equator, the prime meridian (Greenwich), a few meridians and parallels; labels poledník, rovnoběžka, rovník, nultý poledník, severní/jižní pól, východní/západní polokoule. |
| `latitude-longitude` | How latitude and longitude are measured: a cut through the Earth with the angle φ from the equator at the centre, and a view from above the pole with the angle λ from the prime meridian; a point P with its coordinates (e.g. Praha 50° s. š., 14° v. d.). |
| `map-generalisation` | The same area at three scales (1 : 10 000, 1 : 100 000, 1 : 1 000 000): buildings → town block → dot; graphic scale bars under each. |
| `map-symbols` | A small topographic map with its legend: point (church, peak, spring), line (road, railway, river, border) and area symbols (forest, water, built-up area). |
| `contour-hill` | A hill drawn in 3D above its contour map and the profile along a line; contour interval 20 m; the steep side has dense contours. |
| `contour-landforms` | Contour patterns of a peak, a ridge (hřbet), a valley (údolí, contours point upstream), a saddle (sedlo) and a steep vs a gentle slope, each with a small 3D sketch. |
| `compass-rose` | The 8 cardinal and intermediate directions in Czech (S, SV, V, JV, J, JZ, Z, SZ) and an azimuth of 60° measured clockwise from north. |
| `orientation-sun` | Finding the directions without a compass: the Sun at noon in the south (in Czechia), the shadow of a stick at noon points north, sunrise in the east; the trap that moss "always grows on the north side" is unreliable. |
| `trail-marks` | KČT tourist marks: the red, blue, green and yellow stripe signs, a signpost with destinations and times, a local trail mark and a turn mark. |
| `projection-surfaces` | Three projection surfaces touching a globe: cylinder (válcové), cone (kuželové), plane (azimutální), with the resulting grid of meridians and parallels under each. |
| `mercator-sizes` | Greenland and Africa on a Mercator map vs on an equal-area map; the real areas (2,2 vs 30,4 million km²) written next to them. Uses real outlines (`GeoMap`). |
| `gps-trilateration` | Position from distances: three circles from three satellites meet in one point; a fourth satellite for the clock; labels in Czech. |
| `gis-layers` | Stacked transparent layers (relief, water, roads, buildings, land use) above a combined map; arrows "vrstvy → mapa". |
| `earth-shape-evidence` | Three evidences of a round Earth: a ship's hull disappearing first behind the horizon, the round shadow of the Earth on the Moon during a lunar eclipse, a photo-like view from space. |
| `eratosthenes` | Eratosthenes' measurement: Syene (Sun in the zenith, a well), Alexandria (shadow, 7,2°), distance 5 000 stadií, parallel sun rays, the angle at the Earth's centre. |
| `day-night` | The rotating Earth lit from one side: the terminator, the day and night halves, the direction of rotation (west → east), where the Sun rises; Czechia marked. |
| `local-time` | The Earth seen from above the North Pole with 24 sectors of 15°; noon on the meridian facing the Sun; 15° = 1 h, 1° = 4 min. |
| `date-line` | The date line (datová hranice) along 180° with its bends; crossing it to the west adds a day, to the east subtracts one; two calendars on its sides. |
| `sun-rays-latitude` | The same bundle of sun rays falling at the equator (steep, small area, hot) and near the pole (low, large area, cold). |
| `solstice-light` | The Earth on 21 June and on 21 December side by side: the tilted axis, the Sun overhead at a tropic, polar day and polar night inside the polar circles, the length of day at 50° N. |
| `heat-zones` | The Earth with the tropics (23,5°) and polar circles (66,5°) and the zones between them: tropický, mírné (2) a polární (2) pásy, with their names. |
| `tides` | The Moon pulling two tidal bulges; high and low tide at a coast; spring tide (Sun, Moon and Earth in line) vs neap tide (at right angles). |

## gz2 – level 3 (relief)

| id | Must show |
|---|---|
| `continental-drift` | Pangea 250 million years ago → today in four stages (StepFilm), with Wegener's evidence (matching coasts, fossils). |
| `earthquake-focus` | A fault with the focus (ohnisko, hypocentrum) underground, the epicentre (epicentrum) above it, seismic waves spreading; a seismograph trace. |
| `volcano-types` | Stratovolcano (vrstevnatá sopka), shield volcano (štítová) and cinder cone in section: magma chamber, vent, crater, lava and ash layers; an example of each (Vesuv, Mauna Loa, Komorní hůrka). |
| `hotspot-chain` | A plate moving over a fixed hot spot: a chain of volcanic islands getting older away from it (Havaj). |
| `tsunami` | A subduction earthquake lifting the sea floor; a long low wave in the open ocean that grows high near the coast (StepFilm). |
| `folding-faulting` | Folds (vrása: antiklinála, synklinála) from compression and faults from tension: hrást (horst) and příkopová propadlina (graben), with arrows of the forces. |
| `weathering-types` | Mechanical (frost wedging in a crack), chemical (limestone dissolved by water with CO₂) and biological weathering (roots, lichens). |
| `karst` | A karst landscape in section: ponor (sinkhole stream), propast, cave with stalaktity and stalagmity, underground river, vyvěračka; Macocha as the example. |
| `river-course` | A river from source to mouth: upper course (V-shaped valley, waterfalls, erosion), middle course (meanders), lower course (deposition, floodplain, delta or estuary). |
| `meander` | A meander in plan and in section: erosion on the outer bank, deposition on the inner bank, the oxbow lake (slepé rameno) formed when the neck is cut (StepFilm). |
| `glacial-valley` | A V-shaped river valley turned into a U-shaped glacial valley; kar (cirque), moraines, a hanging valley, a fjord when the sea floods it. |
| `wind-landforms` | Wind erosion and deposition: a barchan dune with the wind direction, a rock pedestal, loess (spraš) deposited downwind. |
| `coastal-erosion` | Cliff (klif) erosion: wave-cut notch, cave → arch (skalní brána) → stack (skalní věž) → stump (StepFilm); a beach and a spit (kosa) from longshore drift. |
| `coast-types` | Coast types side by side: fjord, ria, lagoon (laguna with a sand bar), delta, coral reef; one sentence each. |
| `coral-atoll` | The formation of an atoll (Darwin): fringing reef → barrier reef → atoll as the volcanic island sinks (StepFilm). |
| `soil-erosion` | Soil erosion on a slope (rills, washed-out soil) and protection: contour ploughing, terraces, grass strips, windbreaks (větrolamy). |

## gz3 – level 4 (weather, climate, water, biomes)

| id | Must show |
|---|---|
| `atmosphere-layers` | Troposphere (to ≈ 12 km, weather), stratosphere (ozone layer), mesosphere, thermosphere with altitudes and the temperature curve; planes, Everest, a weather balloon and the ISS as references. |
| `weather-station` | A meteorological station: the white screen with thermometers (2 m), rain gauge, anemometer and wind vane on a mast (10 m), barometer, sunshine recorder; what each measures. |
| `cloud-types` | Clouds by height: cirrus (high), altocumulus (medium), stratus and cumulus (low), cumulonimbus through all levels with an anvil; Czech names. |
| `pressure-wind` | High (tlaková výše, H) and low pressure (tlaková níže, N) with isobars; wind blowing from high to low, deflected by the Earth's rotation; rising air and clouds in the low, sinking air and clear sky in the high. |
| `weather-fronts` | Cold front (studená fronta: steep, cumulonimbus, showers) and warm front (teplá fronta: gentle, layered clouds, long rain) in section, with the front symbols used on maps. |
| `synoptic-map` | A simple synoptic map of Europe: H and N centres, isobars, a cold, a warm and an occluded front with their symbols; how to read it. Uses `GeoMap` for the coastline. |
| `tropical-cyclone` | A hurricane in section and from above: the eye, the eye wall, spiral rain bands, rotation direction in the northern hemisphere; names by region (hurikán, tajfun, cyklon). |
| `global-circulation` | The three-cell model: Hadley, Ferrel and polar cells; the ITCZ, subtropical highs (deserts), the westerlies, the trade winds (pasáty), polar easterlies. |
| `monsoon` | The South Asian monsoon: summer (wet sea wind towards the hot land, rain) vs winter (dry wind from the cold land). |
| `altitude-zones` | Altitudinal zonation of a mountain (Alps or Andes): forest belts, the tree line, alpine meadows, snow line; −0,65 °C per 100 m as a side scale. |
| `water-distribution` | Water on Earth: 97 % salt water, 3 % fresh; of the fresh water ≈ 69 % ice, ≈ 30 % groundwater, ≈ 1 % surface water (rivers, lakes, the atmosphere). |
| `ocean-currents` | Main warm (red) and cold (blue) ocean currents on a world map (`GeoMap`): Golfský proud, Labradorský, Kalifornský, Humboldtův (Peruánský), Benguelský, Kuro-šio, the West Wind Drift. |
| `river-basin` | A river system: pramen, přítok, soutok, hlavní tok, ústí; povodí bounded by the rozvodí (watershed); one basin shaded. |
| `lake-origins` | Lakes by origin: tectonic (Bajkal), glacial (Černé jezero), volcanic crater (Maar), oxbow (slepé rameno), artificial reservoir (přehradní nádrž); a small section of each. |
| `groundwater` | Groundwater in section: infiltration, the water table (hladina podzemní vody), an aquifer between impermeable layers, a spring (pramen), a well (studna). |
| `glacier-parts` | A valley glacier: accumulation zone (above the snow line) and ablation zone, crevasses, moraines (lateral, medial, terminal), meltwater; arrows of ice flow. |
| `biome-climate` | The Whittaker diagram: mean annual temperature vs precipitation, with the biomes as areas (tundra, tajga, listnatý les, step, poušť, savana, tropický deštný les). |

## gz4 – levels 5–7 (people, economy, regions)

| id | Must show |
|---|---|
| `demographic-transition` | The demographic transition model: birth and death rate lines over 5 stages and the total population curve; example countries for each stage. |
| `push-pull` | Migration between two places: push factors (war, poverty, drought) and pull factors (work, safety, family) with obstacles (borders, cost) in between. |
| `settlement-hierarchy` | Settlement hierarchy as a pyramid: samota, vesnice, město, velkoměsto, metropole, megalopole; number of settlements vs size and the range of services. |
| `urban-zones` | A simplified city: the centre (CBD), the old inner city, industrial zone, housing estates (sídliště), suburbs, satellite towns, commuting arrows. |
| `urbanisation-stages` | The four stages: urbanizace, suburbanizace, desurbanizace, reurbanizace – where people move in each (StepStrip). |
| `state-forms` | Forms of government (monarchy, republic) and state structure (unitary, federal) as four simple schemes with examples (Spojené království, Česko, Německo, USA). |
| `economic-sectors` | Shares of employment in the primary, secondary and tertiary sector in a low-income, a middle-income and a high-income country (stacked bars). |
| `farming-systems` | Intensive vs extensive farming, plantation, nomadic herding, shifting cultivation: a small scene and one line each. |
| `mining-types` | Open-pit (povrchový) vs underground (hlubinný) mining in section; reclamation (rekultivace) of an old pit (Most, lake Most). |
| `industry-location` | A factory with arrows to its location factors: raw materials, energy, labour, market, transport, government incentives; old (coal) vs new (hi-tech) industry. |
| `transport-modes` | Road, rail, water, air and pipeline transport compared: speed, cost per tonne, capacity, emissions (bars). |
| `panama-canal` | The Panama Canal in section: the locks lifting ships to Gatun Lake and back down, 82 km, saving the trip round Cape Horn. |
| `supply-chain` | The global journey of a smartphone: raw materials (Congo, Chile), components (Japan, Korea, Taiwan), assembly (China, India), design and sale (USA, Europe). Uses `GeoMap`. |
| `sahel-transect` | A north–south transect of Africa: Sahara → Sahel → savanna → tropical rainforest, with rainfall, vegetation and the shifting ITCZ. |
| `himalaya-section` | The India–Asia collision: the Indian plate pushing under the Eurasian plate, the Himalaya and the Tibetan plateau rising. |
| `deforestation` | Amazon deforestation: the "fishbone" pattern along roads, cattle pasture, soy fields, the cycle forest → pasture → degraded land. |
| `polar-compare` | The Arctic (frozen ocean surrounded by continents) vs Antarctica (ice-covered continent surrounded by ocean) in section, with ice thickness. |

## gz5 – levels 8–9 (Europe, Czechia, fieldwork)

| id | Must show |
|---|---|
| `gulf-stream` | Why western Europe is mild: the Gulf Stream and North Atlantic Drift carrying warm water; Bergen vs a place in Labrador at the same latitude with their January temperatures. Uses `GeoMap`. |
| `eu-institutions` | The main EU institutions and what each does: Evropská rada, Rada EU, Evropská komise, Evropský parlament (elected by citizens), Soudní dvůr EU; who elects whom. |
| `europe-relief` | A relief profile across Europe from the Atlantic over the Alps (Mont Blanc) to the North European Plain and the Urals; main mountain ranges labelled. |
| `czech-watersheds` | Czechia on three seas: the basins of Labe (North Sea), Odra (Baltic) and Morava–Dunaj (Black Sea), the main watershed, Klepý (Hora tří moří). Uses `GeoMap`. |
| `czech-geomorphology` | Czechia's two geological systems: Český masiv (old, worn down) and Západní Karpaty (young, folded), with the main units (Krkonoše, Šumava, Českomoravská vrchovina, Beskydy, Polabí). Uses `GeoMap`. |
| `czech-profile` | A relief profile across Czechia (Šumava → Brdy → Praha → Polabí → Krkonoše, Sněžka 1 603 m) with heights. |
| `czech-protected` | Categories of protected areas: národní park, CHKO, národní přírodní rezervace, přírodní památka; the 4 national parks with their year of founding. |
| `suburbanisation-prague` | Prague's hinterland: people moving from the city to satellite villages, daily commuting, new satellite estates, traffic. |
| `fieldwork-cycle` | The fieldwork investigation cycle: otázka → hypotéza → plán a sběr dat → zpracování (mapa, graf) → závěr → prezentace, back to a new question. |
| `land-use-transect` | A transect from the town centre to the countryside: land use along the line (shops, flats, houses, industry, fields, forest), as recorded in fieldwork. |

## gz6 – level 10 (Earth systems, hazards)

| id | Must show |
|---|---|
| `system-model` | A system: inputs, stores, flows (transfers), outputs; positive feedback (amplifies) and negative feedback (dampens) loops with examples. |
| `drainage-basin-system` | The drainage basin as a system: precipitation, interception, infiltration, percolation, throughflow, groundwater flow, surface runoff, evapotranspiration, channel flow. |
| `radiation-budget` | The Earth's energy budget: 100 units of incoming sunlight, ≈ 30 reflected (clouds, ice, surface: albedo), ≈ 70 absorbed, outgoing long-wave radiation, the greenhouse return. |
| `el-nino` | The Pacific in section: normal conditions (trade winds, warm water and rain in the west, cold upwelling off Peru) vs El Niño (weak trade winds, warm water east, rain in Peru, drought in Australia). |
| `jet-stream` | The polar jet stream around the North Pole with Rossby waves; cold air south of a trough, warm air north of a ridge; a stuck wave and a heatwave. |
| `ice-core` | An ice core: annual layers, trapped air bubbles; CO₂ and temperature over 800 000 years read from it (simplified curves). |
| `climate-feedbacks` | Feedback loops of warming: ice–albedo, permafrost methane, water vapour (positive); more plant growth (negative). |
| `subduction-zone` | An ocean plate sliding under a continental plate: trench (příkop), deep earthquakes along the plate, magma rising to a volcanic arc (Andes or Japan). |
| `seismic-waves` | P waves (longitudinal, fastest), S waves (transverse, not through liquids), surface waves (most damaging); arrival times on a seismogram. |
| `hazard-risk` | Risk = hazard × vulnerability (÷ capacity): the same earthquake in a rich and a poor city; what lowers vulnerability. |
| `disaster-cycle` | The disaster risk management cycle: prevence → připravenost → reakce → obnova (cycle). |
| `storm-hydrograph` | A storm hydrograph: rainfall bars, the discharge curve, peak rainfall, peak discharge, lag time, rising and falling limb; urban vs forested basin. |
| `desertification` | Desertification: overgrazing, deforestation, drought and soil erosion turning a dry savanna into desert; ways to stop it (the Great Green Wall). |
| `sea-level-causes` | Why the sea rises: thermal expansion of water, melting glaciers and ice sheets (not floating sea ice); numbers since 1900. |
| `remote-sensing` | How a satellite sees: sunlight reflected differently by water, vegetation, soil and towns; visible and infrared bands; a false-colour image with vegetation in red. |
| `gis-overlay` | GIS analysis: overlay of layers and a buffer zone around a river, giving areas suitable for building (StepFilm). |

## gz7 – levels 11–12 (population, cities, geopolitics, global economy)

| id | Must show |
|---|---|
| `migration-models` | Migration theory: Ravenstein's laws (most migrants move short distances, step migration, towards big cities) and the gravity model (flow grows with size, falls with distance). |
| `urban-models` | Urban models side by side: concentric zones (Burgess), sectors (Hoyt), multiple nuclei (Harris–Ullman); one line on what each explains and its limits. |
| `gentrification` | Gentrification of an inner-city district in four steps: decline, artists and students, renovation and cafés, high rents and displacement (StepStrip). |
| `von-thunen` | Von Thünen's rings around a market town: intensive farming, forest, grain, livestock; why land use changes with distance (transport cost). |
| `cultural-diffusion` | Types of diffusion: relocation (with migrants) and expansion – contagious and hierarchical (from big cities down); examples. |
| `border-types` | Borders: natural (river, mountains), geometric (straight lines in Africa and North America), cultural; an enclave and an exclave. |
| `state-shapes` | State shapes: compact (Polsko), elongated (Chile), fragmented (Indonésie), perforated (Jihoafrická republika with Lesotho), prorupt (Thajsko); consequences of each. |
| `un-system` | The UN system: General Assembly, Security Council (5 permanent members with veto), Secretariat, the International Court of Justice and the main agencies (UNICEF, WHO, UNESCO, UNHCR). |
| `weber-triangle` | Weber's location triangle: two raw-material sites and the market; the factory moves towards the heaviest transport cost (weight-losing vs weight-gaining industry). |
| `smile-curve` | The value chain "smile curve": research and design and brand and service earn most, assembly earns least; where countries sit on it. |
| `core-periphery` | Core, semi-periphery and periphery (Wallerstein, simplified): flows of raw materials, products, profits and people between them. |
| `virtual-water` | Virtual water: litres of water behind 1 kg of beef, 1 kg of wheat, a cup of coffee, a T-shirt, a smartphone (bars, real orders of magnitude). |
| `dam-impacts` | A big dam and its effects: electricity, flood control and irrigation vs flooded villages and valleys, sediment trapped, fish blocked, conflicts downstream. |
| `energy-transition` | The energy transition: from coal, oil and gas to renewables and nuclear; storage, grids; shares in the world and in Czechia (simplified). |
| `circular-economy` | Linear (take–make–throw) vs circular economy (design, use, repair, reuse, recycle). |
| `planetary-boundaries` | The planetary boundaries wheel: nine boundaries (climate change, biodiversity, land use, freshwater, nitrogen and phosphorus, ocean acidification, ozone, aerosols, novel entities) with the safe zone and the ones crossed. |
| `sdg-wheel` | The 17 Sustainable Development Goals as a numbered wheel with short Czech names (no official logos). |
| `scenario-fan` | Thinking in scenarios: a fan of possible futures from today to 2050 (population or temperature), widening uncertainty, what decides which path. |
