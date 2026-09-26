# Chemie – mini-games

14 games in four families. Each round lasts 1–3 minutes and gives 10–50 XP. Games that take a `levelId` adapt their content to the chosen level ("Obtížnost podle úrovně" on the intro screen).

| Game | Family | Levels | Trains | Scoring |
|---|---|---|---|---|
| **Najdi prvek** (`periodic-find`) | Periodická tabulka | 2, 7 | orientation in the table, names ↔ symbols, groups/periods | 10 rounds, time bonus |
| **Pexeso prvků** (`element-memory`) | Periodická tabulka | 2 | symbols ↔ Czech names | fewer moves = more points |
| **Kdo jsem?** (`who-am-i`) | Periodická tabulka | 2, 7 | element properties, position, fun facts | fewer hints = more points |
| **Postav atom** (`build-atom`) | Stavebnice | 2 | protons, neutrons, electrons; isotopes; ions | 6 tasks |
| **Zaplň orbitaly** (`electron-config`) | Stavebnice | 2 | Aufbau, Pauli, Hund; Cr/Cu exceptions | 4 elements, explains the broken rule |
| **Iontová skládačka** (`ion-builder`) | Stavebnice | 3, 5 | charge balance, cross rule, salt formulas | 8 tasks, combo streak |
| **Názvoslovný trenažér** (`naming`) | Kvízy | 3, 5, 7 | Czech inorganic nomenclature both ways | 10 questions, streak bonus |
| **Vyčísli rovnici** (`balance`) | Stavebnice | 4, 6 | balancing equations incl. redox | 6 equations, minimal coefficients required |
| **Molární hmotnost** (`molar-mass`) | Kvízy | 4 | computing M from a formula | 8 formulas, ±0,5 g/mol, time bonus |
| **Blesková výzva** (`quickfire`) | Kvízy | all | recall of anything learned | 60 s, one-tap answers, combo multiplier |
| **Pravda, nebo lež?** (`swipe`) | Kvízy | all | true/false statements from lesson quizzes | 12 cards, swipe or keys |
| **pH laboratoř** (`ph-lab`) | Virtuální laboratoř | 5 | pH, neutralisation, indicator colours, dilution | 4 missions, accuracy |
| **Titrace** (`titration`) | Virtuální laboratoř | 5 | titration technique and calculation | endpoint precision + correct concentration |
| **Funkční skupiny** (`functional-groups`) | Kvízy | 8, 9 | recognising organic functional groups and classes | 10 rounds, time bonus |

The quiz games (`quickfire`, `swipe`) draw their questions from the lesson quizzes and level tests (`src/core/questionPool.ts`), so they grow automatically with the content.

## Design rules for games

- Starts immediately; the shell handles intro and results.
- Tactile feedback: pop on correct, shake on wrong, always with text and an icon, never colour alone.
- Works with touch, mouse and keyboard, at 360 px wide.
- Honest chemistry: the pH lab computes real pH from moles; the titration curve is computed, not drawn by hand; equations are verified by an atom counter in tests.

## Ideas for more games

- **Reakce ano/ne**: will this metal displace that one? (reactivity series)
- **Plamenové zkoušky**: match flame colours to metal ions.
- **Molekulová stavebnice 3D**: build molecules and see the VSEPR shape.
- **Detektiv v laborce**: identify an unknown substance from tests (precipitates, indicators, flame).
- **Závod izomerů**: draw as many isomers of C₅H₁₂ / C₄H₁₀O as possible.
- **Organická syntéza**: chain reactions to get from ethene to ethyl acetate.
