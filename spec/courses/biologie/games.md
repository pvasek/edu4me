# Biologie – mini-games

Games are listed per course in `src/games/registry.ts` (`courses.biologie`: level number → what the game trains there). Every listed level has its own content set in the game. Playing without a level mixes all of them. Progress is stored under `biologie:<gameId>`.

## Level matrix

| Game | id | Kind | Levels (what it trains) |
|---|---|---|---|
| Blesková výzva | `quickfire` | quiz | 1–12: questions from the level's lessons (generic engine) |
| Pravda, nebo lež? | `swipe` | quiz | 1–12: true/false statements from the level's lessons (generic engine) |
| Určovací klíč | `id-key` | quiz | 1 groups of organisms · 2 microorganisms, fungi, lichens · 3 plants and families · 4 invertebrates · 5 vertebrates. A dichotomous key: answer yes/no questions about a drawn organism until it is named; then the reverse (pick the feature that separates two organisms). |
| Stavitel buňky | `cell-builder` | build | 1 plant, animal and bacterial cell · 9 eukaryotic organelles and their functions. Drag organelles into the right cell; match organelle ↔ function; spot what is missing. |
| Mapa těla | `body-map` | build | 6 human organ systems · 11 physiology (hormones, nerves, kidneys, immunity). Place organs on a body outline; trace the path of blood, food, air or a nerve signal. |
| Křížení | `punnett` | lab | 7 one gene, dominance, blood groups · 10 two genes, linkage, X-linked · 12 allele frequencies and selection. Fill in a Punnett square and predict offspring ratios; probabilities computed. |
| Genetický kód | `dna-code` | quiz | 10 transcription, translation and mutations: DNA → mRNA → amino acids with the codon table; what a point mutation changes. |
| Potravní síť | `food-web` | energy | 5 who eats whom among vertebrates · 8 Czech ecosystems and the energy pyramid · 12 populations, communities and energy flow. Build chains and webs; remove a species and predict the consequences. |

## Rules for every biology game

Same as all Q & Why games: mobile first (330 px, one hand), keyboard accessible, Czech only, rounds of 8–12 tasks (1–3 min), immediate kind feedback with a one-line explanation, answers computed or taken from curated data (never invented), uses the shared game kit, `onFinish({ score, max })` exactly once. Organisms are Czech species where possible, with correct Czech and Latin names.
