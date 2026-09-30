# Fyzika – mini-games

Games are listed per course in `src/games/registry.ts` (`courses.fyzika`: level number → what the game trains there). Every listed level has its own content set in the game. Playing without a level mixes all of them. Progress is stored under `fyzika:<gameId>`.

## Level matrix

| Game | id | Kind | Levels (what it trains) |
|---|---|---|---|
| Blesková výzva | `quickfire` | quiz | 1–12: choice and true/false questions from the level's lessons (generic engine) |
| Pravda, nebo lež? | `swipe` | quiz | 1–12: true/false statements from the level's lessons (generic engine) |
| Převody jednotek | `unit-convert` | quiz | 1 délka, objem, hmotnost, čas a předpony · 2 rychlost km/h ↔ m/s, síla · 3 tlak, práce, výkon, energie · 6 proud, napětí, odpor, kWh · 8 vědecký zápis a odvozené jednotky |
| Plave, nebo klesne? | `float-sink` | lab | 1 hustota: plave/klesne podle hustoty · 3 vztlaková síla a Archimédův zákon, ponor |
| Graf pohybu | `motion-graph` | motion | 2 přiřaď příběh ke grafu s–t a v–t · 8 rovnoměrně zrychlený pohyb: směrnice a plocha pod grafem |
| Výslednice sil | `force-sum` | motion | 2 síly na jedné přímce, rovnováha · 8 skládání pod úhlem, rozklad do složek, nakloněná rovina |
| Energetický řetězec | `energy-chain` | energy | 3 přeměny mechanické energie · 4 teplo, skupenství a motory · 7 elektrárny a zdroje energie · 10 tepelné stroje a účinnost |
| Stavitel obvodů | `circuit-builder` | circuit | 6 sériové a paralelní zapojení, Ohmův zákon, jas žárovek · 11 Kirchhoffovy zákony, vnitřní odpor zdroje |
| Paprsky | `ray-optics` | optics | 5 odraz, lom, obraz v čočce a zrcadle (kvalitativně) · 12 zobrazovací rovnice a zvětšení |
| Vrh | `projectile` | motion | 8 vodorovný a šikmý vrh: zasáhni cíl úhlem a rychlostí · 9 vrh na Měsíci a planetách, oběžná rychlost |

## Rules for every physics game

- Mobile first, one hand, works at 330 px; keyboard accessible; Czech only.
- Rounds of about 1–3 minutes, 8–12 tasks, immediate kind feedback with a one-line explanation.
- Physics is exact: numbers are computed, not typed in by hand; answers are accepted within a stated tolerance (e.g. ±2 %) and with the correct unit.
- Uses the shared game stage (`GameStage`) and the engraving style; results go through `onFinish({ score, max })`.
