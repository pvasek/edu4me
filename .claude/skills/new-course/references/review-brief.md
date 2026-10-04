# Brief: independent subject review of one level (Q & Why)

Repo /home/user/edu4me. Czech learning app for teens. You review **<COURSE> level <N> – <title>** (`src/courses/<course>/levels/l<N>.ts`, lessons <ids>) as a strict Czech **<subject> teacher** would before giving it to a class. You did not write this text. Assume it contains errors: it was written by agents that plan in English and write in Czech, so expect calques and English concepts forced onto Czech terms. Other reviewers work on other levels at the same time.

## What to check, in this order
1. **Czech school terminology.** Every term as Czech textbooks for ZŠ / gymnázium use it, and the right term for the right group or context. Start with the trap list below, but read every sentence: the list is not complete. Spelling of terms (Czech forms, e.g. *chromozom*, *bílkoviny* at ZŠ).
2. **Facts.** Every claim, number, date, name, example and explanation. Watch for oversimplifications that become false ("tepny vedou okysličenou krev"), misconceptions stated as facts, mixed-up causes. Verify anything you are not certain of with WebSearch (Czech sources first).
3. **Questions.** Every quiz, check and level-test question: exactly one defensible answer (or exactly the stated set for `multi`), correct `answer` index, `explain` that is true and matches the answer, no trick wording, numbers that compute.
4. **Figures, experiments and parametric blocks used in this level.** Labels, captions and aria-labels say the same as the lesson and are correct. Open each figure component (ids → `src/illustrations/figures/lazy.ts` → the group folder) and read its texts. If a *drawing* is wrong (not just a label), describe it in the report, don't redraw.
5. **Order and level.** Nothing is used before the lesson that introduces it (see the syllabus); the language fits the stage (ZŠ short and concrete, gymnázium precise).

## How to fix
- Fix clear errors yourself in your level file. Keep the teaching thread intact (`spec/content-guidelines.md`): when you rewrite a sentence, keep its role (opening, bridge, closing).
- Text in figure, experiment or game files: change only with exact small `Edit`s of the wrong string (other reviewers may edit other strings in the same file); never rewrite such a file.
- Don't change ids, lesson titles (they must match `index.ts`) or the structure; don't add or remove lessons.
- When an error has a correct form, fix it. When it is a matter of opinion or school tradition differs, don't change it: list it for the user.
- Write each fix to disk at once.

## Verify
- `npx vitest run src/courses/<course>/content.test.ts -t "l<N> "` and `npx vitest run src/core/flow.test.ts -t "<course> l<N>\."`
- `npx tsc --noEmit -p tsconfig.json` (no errors in files you touched); if you edited a figure, experiment or game, run its tests too.
- Don't commit.

## Report (written as you go)
Create `<scratchpad>/review/<course>/l<N>.md` at the start and update it after every lesson, so an interruption loses nothing and a restarted reviewer knows where to continue (if the file already exists, continue from it). It contains:
- a **coverage table**: one row per lesson and one for the level test (boss): id · all sections read · quiz and checks checked · figures/experiments checked · number of fixes. Every lesson is read completely, top to bottom; no sampling. If something was not finished, the row says so.
- a table of fixes (where · before → after · why);
- "Pro rozhodnutí": debatable points with your recommendation.

Reply in ≤ 120 words: fixes by category (terminology / facts / questions / figures), the worst three, open points, and confirm the coverage table is complete.

## Trap list (extend it whenever a review finds a new trap)
General: decimal comma; a space between number and unit; Czech quotes „…“; English calques (*potravinový řetězec* → *potravní řetězec*; *proteiny* → *bílkoviny* at ZŠ; *rodina* → *čeleď*).

Biology:
- sex cells: animals *vajíčko*, *spermie*; mosses, ferns, algae *vaječná buňka*, *spermatozoid* (zárodečník, pelatka); seed plants *samčí buňky* from the pollen, *vaječná buňka* in the *vajíčko* (ovule) → seed; never *spermie* for a plant
- *plod* (botany) vs *ovoce* (food); *semeno* vs *plod*; *souplodí* (strawberry, raspberry)
- *tepna* / *žíla* by direction (from / to the heart), not by oxygen (plicní tepna carries deoxygenated blood)
- taxonomy ranks: říše, kmen (botany also oddělení), třída, řád, čeleď, rod, druh
- *přírodní výběr*; *producent, konzument, rozkladač (destruent)*; *společenstvo*, *populace*, *ekosystém*
- *pavoukovci* are not insects; *netopýr* and *velryba* are mammals; viruses are not cells
- found in review: *druhový přívlastek* (not druhové jméno); *nespojitá* (not skoková) proměnlivost; *B-lymfocyt*; *krvomíza* in insects; first aid per the current ERC guidelines (2025: call 155 as soon as the person does not respond, check breathing with the dispatcher)

Chemistry:
- Czech systematic names with the right endings (oxid uhličitý, kyselina sírová, hydroxid sodný, síran měďnatý); *oxidační číslo*; *látkové množství* (mol), *molární hmotnost* (g/mol), *relativní atomová hmotnost* (no unit)
- *prvek* / *sloučenina* / *směs*; *atom* / *molekula* / *ion* (*kationt*, *aniont*); *teplota tání / varu* (not bod); *skupenství*; *exotermní / endotermní*
- safety notes as Czech schools teach them (*nejdřív voda, potom kyselina*)
- found in review: *K_v* (not K_w) for the ion product of water; *kataláza*, *glukóza* (-óza); *retardační faktor R_f*; *čiření*; *atomová krystalová mřížka* (not "obří kovalentní"); "·" between two equations reads as multiplication (use ";")

Physics:
- *hmotnost* (kg) vs *tíha*, *tíhová síla* (N); never "váha" for mass in a physics sentence; *teplo* vs *teplota*; *tlak* vs *tlaková síla*; *rychlost* vs *velikost rychlosti*; *elektrické napětí* vs *proud*
- Czech symbols and units (*t* for time, *s* for path at ZŠ, km/h, kWh); *g ≐ 10 N/kg* at ZŠ, 9,81 m/s² at gymnázium; ≐ for rounded results
- misconceptions stated as facts (a "centrifugal force" pushing outward, heavier things falling faster, current "used up" in a bulb)
- found in review: *kmit* (full period) vs *kyv* (half); light is *soustřeďována / rozptylována* (not "sbíhá"); a mirage is gradual *lom*, never *ohyb* (= diffraction); *teplota tání / varu* (not bod); *ekvivalentní dávka* (not dávkový ekvivalent); free-body diagrams must balance and be drawn to scale
