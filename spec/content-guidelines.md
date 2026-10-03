# Content guidelines

How lessons, questions and level tests are written. Applies to every course; chemistry specifics are at the end.

## Language and tone

- **Czech only** in everything the learner sees. Use correct Czech typography: „uvozovky“, a decimal comma (`22,99`), a non-breaking space where it matters (`10 g`, `25 °C`), an en dash for ranges (`5–7`).
- Address the learner as **ty**, informally but with respect. Talk like a good older sibling who likes chemistry, not like a textbook.
- Audience: **teens 14–18**. Levels 1–2 assume nothing beyond primary-school maths. Later levels can be demanding (gymnázium / A-level), but every new term is explained where it first appears.
- Short sentences. One idea per paragraph. Paragraphs of at most 3–4 sentences.
- Every lesson ties the topic to something real the learner knows: kitchen, sport, phone battery, pool, cooking, cosmetics, the environment.
- Humour is welcome in small doses, mostly in the mascot's lines (`hook`, `callout` variant `mascot`).
- Correctness comes first. Use IUPAC and current Czech school terminology (e.g. *oxidační číslo*, *látkové množství*, *molární koncentrace*, *hydrogen-* prefix, the *-ičitý/-ičný* endings). Where Czech and English terms differ, you may add the English one in brackets the first time, e.g. „elektronegativita (anglicky *electronegativity*)“.

## Inline markup (`Inline` strings)

| Markup | Result | Use for |
|---|---|---|
| `**text**` | **bold** | key terms when they first appear |
| `*text*` | *italic* | emphasis, foreign terms |
| `==text==` | highlighter mark | the one thing to remember in a paragraph (max 1 per section) |
| `$H2SO4$` | H₂SO₄ | **every** chemical formula and equation; digits after a letter or `)` become subscripts automatically |
| `$Fe^{3+}$`, `$SO4^2-$`, `$e^-$` | superscripts | charges. Inside `$…$`, `^` followed by digits/+/- works without braces |
| `$^{14}_{6}C$` | isotope notation | nuclide symbols |
| `^{23}`, `_{x}` | super/subscript | anywhere, e.g. `6,022·10^{23}`, `cm^{3}` |
| `->`, `<=>`, `<-` | →, ⇌, ← | reactions and steps |

Rules:
- Never use `*` for multiplication; use `·` or `×`.
- Coefficients go at the start of a species: `$2H2 + O2 -> 2H2O$`.
- States of matter: `$NaCl(aq)$`, `$H2O(l)$`, `$CO2(g)$`, `$CaCO3(s)$`.
- Oxidation numbers: `$Fe^{III}$` (roman numerals in braces).
- Hydrates: `$CuSO4·5H2O$`.

## Lesson structure (`Lesson` in `src/core/types.ts`)

```
id, title                 – exactly as in the course outline
goals: 2–4 items          – "Po lekci budeš umět…" style, concrete and checkable
hook: 1–3 sentences       – the mascot's opening line: a question, a paradox or an everyday situation
sections: 3–6             – all sections are read on one scrolling page (with a section nav)
summary: 4–7 items        – the takeaways, written as full short sentences
quiz: 6–8 questions       – covering all sections, mixed kinds, rising difficulty
```

Each **section** has a title and 4–14 blocks. Good rhythm for a section:
1. an **opening** paragraph (`p`): the question this section answers, linked to what came before
2. explanation (`p`, `list`, `keyterms`)
3. a visual (`diagram`, `elements`, `table`, `structure`, `formula`, physics blocks)
4. a worked `example` when there is a calculation or a procedure
5. a `callout` (tip, warning, fact, remember or mascot)
6. a **closing** sentence that states what we now know and leads to the next section
7. **one `check` question** at the end of the section (recommended, not required). Checks are *not* shown inline: they are collected into the single end-of-lesson quiz (one per section, in reading order, then the `quiz` questions; 12 questions, or up to 14 so that every section contributes one)

Between the steps runs the **teaching thread** – see the next section. It is what turns a list of facts into an explanation.

## Teaching thread (výkladová nit)

A lesson reads like a good teacher explaining at the board, not like a stack of cards. Every fact, picture and example is **introduced** (why are we looking at this?) and, where it isn't obvious, **interpreted** (what does it show?). The thread is short – it keeps lessons condensed – but it is never missing.

Rules (all courses, every lesson):

1. **Open every section with a `p`** that sets up the question of the section and connects it to the previous one or to the hook („Teď už víme, co síla je. Jenže sílu nevidíme – tak podle čeho ji poznáme?“).
2. **No two content blocks in a row without a sentence between them.** Content blocks are everything except `p`, `h`, `callout`, `check` and `game`. Before a list, table, figure, formula or example comes a `p` saying what to look at or why („Kolik je vlastně jeden newton? Tady je pár orientačních hodnot – od jablka až po raketu:“). A callout does not count as a bridge.
3. **Say why, not only what.** Before a formula or a rule, one sentence of intuition (why it makes sense). After a surprising result, one sentence of meaning („Hmotnost zůstává stejná – proto astronauti na Měsíci poskakují.“).
4. **Name the contrast or the trap** when two ideas are easy to confuse („Pozor, tady se chybuje nejčastěji: hmotnost a tíhová síla spolu souvisí, ale nejsou to stejné veličiny.“).
5. **Close every section** (before its `check`) with one sentence: what we can do now and what comes next. The last section points to the next lesson.
6. **Bridges are 1–2 sentences.** They carry meaning (a question, a reason, a contrast, a consequence) – never filler like „V této části se naučíme…“ or a repeat of the heading. No new facts hide in bridges; facts belong to the explanation.
7. **A bridge links back and names what comes next concretely.** It picks up the thread of the text just before it and says plainly what the next block is about. Never a vague allusion the reader has to decode: not „Zkusme to na situaci, kterou znáš z každého nákupu.“, but „U kopnutí do míče je to jasné. Zkusme ale situaci, kde druhé těleso není hned vidět: zvedáš ze země tašku s nákupem.“
8. **Refer to other lessons by their title**, never by id: „v lekci „Grafy pohybu““, not „v lekci f2-2“. Learners never see ids (the validator rejects them).
9. Worked examples say *why* a step is done when it isn't obvious („Nejdřív převedeme gramy na kilogramy, protože g je v N/kg.“).

Target proportions: explanation and bridges (`p`) are about **30 % of the words** of a lesson; a lesson grows by about a fifth to a third compared with a bare list of facts (the f2-3 pilot: 1 461 → 1 907 words, prose 16 % → 36 %). Rules 1 and 2 are checked automatically for every lesson (`checkFlow` in `src/core/validate.ts`, run by `src/core/flow.test.ts`).

Before / after (fyzika f2-3):

```
before:  formula → example → compare → table → example
after:   p „Na každý kilogram připadá asi 10 N…“ → formula
         → p „Vyzkoušej si to na věci, kterou nosíš každý den.“ → example
         → p „Pozor, tady se chybuje nejčastěji…“ → compare
         → p „Číslo g totiž není všude stejné…“ → table
         → p „Co to znamená pro astronauta na Měsíci? Spočítejme to.“ → example
         → p „Tíhovou sílu už umíme spočítat. Zbývá ji umět nakreslit.“ → check
```

A section may embed a `game` block pointing at a related mini-game (at most once per lesson).

### Block types

- `p` – paragraph.
- `h` – sub-heading inside a section (rarely needed).
- `list` – bullets, or `ordered: true` for real sequences only.
- `callout` – `tip` (a practical trick), `warning` (typical mistake, safety), `fact` (a surprising real-world fact), `remember` (a rule to memorise), `mascot` (Kvído speaking: humour, encouragement).
- `keyterms` – term/definition pairs; use when 2+ new terms appear together.
- `formula` – a centred, large display of an equation or formula, with an optional caption.
- `example` – worked example: `problem`, numbered `steps`, and the final `answer`. Show units in each step.
- `table` – small tables (up to ~6 columns). Cells use inline markup.
- `elements` – a row of periodic-table tiles, e.g. `symbols: ['Li','Na','K']`. Elements shown here are added to the learner's element album.
- `structure` – a monospace drawing of a structural formula. Use `—` or `-` for single bonds, `=` for double, `≡` for triple, `|` for vertical bonds. Keep it under 40 columns and at most 9 lines. Example:

  ```
      H   H
      |   |
  H — C — C — O — H
      |   |
      H   H
  ```
- `diagram` – a built-in interactive/illustrated diagram. Available ids and props:
  - `bohr` `{ z: number, ion?: number }` – shell model of an atom or ion (Z ≤ 20 looks best)
  - `states` – particles in a solid, liquid and gas (animated)
  - `ph-scale` `{ marks?: [{ ph: number, label: string }] }` – pH 0–14 with the universal-indicator colours
  - `periodic-mini` `{ highlight?: 'groups' | 'blocks' | 'metals' | 'trends' }`
  - `energy-profile` `{ kind: 'exo' | 'endo', catalyst?: boolean }`
  - `titration-curve` `{ kind: 'strong-strong' | 'weak-strong' }`
  - `orbitals` `{ z: number }` – box diagram of the electron configuration
  - `separation` `{ method: 'filtration' | 'distillation' | 'chromatography' | 'decantation' | 'evaporation' }`
  - `galvanic` – Daniell cell (Zn/Cu)
  - `rate-curve` – concentration against time, with a collision-theory note
  - `lab-safety` – GHS hazard pictograms with Czech labels
- **Visual blocks** (see [illustration-guide.md](illustration-guide.md); ids only from `src/illustrations/catalog.ts`):
  - `diagram` with a **figure id** (e.g. `{ type: 'diagram', id: 'blast-furnace', caption: '…' }`): engraved technical schemas, no props.
  - `molecule` – `{ molecules: ['H2O', 'NH3', 'CH4'], labels?: ['lomená', 'pyramida', 'tetraedr'] }` rotatable 3D models.
  - `particles` – `{ boxes: [{ label, items: [{ species: 'H2O', count: 6 }], state?: 'solid'|'liquid'|'gas'|'solution', note? }], arrows? }` particle-model boxes; `arrows: true` draws → between boxes (before → after).
  - `reaction` – `{ equation: '2H2 + O2 -> 2H2O' }`: must be balanced (validated); drawn as molecules with coefficients.
  - `process` – `{ layout: 'flow' | 'cycle', steps: [{ icon, title, text? }] }` 3–7 steps.
  - `iconlist` – `{ items: [{ icon, title, text? }] }` 3–8 cards.
  - `compare` – `{ columns: [{ title, icon?, tone?, points: [...] }] }` 2–3 columns.
- Every section may set `icon` (a `ChemIcon`) shown next to its title – set it on every section.
- `check` – a question about this section; it becomes part of the end-of-lesson quiz (see below).
- `game` – `{ gameId, text }`: a card inviting the learner to a mini-game.
- `experiment` – `{ id, caption? }`: an in-lesson micro-experiment („Vyzkoušej si“), see [Experiments](#experiments-vyzkoušej-si) below.

### Physics drawings (parametric blocks)

Five blocks draw physics pictures from data (renderers in `src/illustrations/physics/`, types in `src/core/types.ts`, checked by `src/core/validate.ts`). All take an optional `caption`; labels accept inline markup (`F_{G}`, `v_{max}`, `m^{2}`); numbers are shown with a decimal comma. Tones `a`–`d`: `a` is the level colour, then ochre, teal and pink; when a tone is omitted, items cycle through them.

- `graph` – axes `x`/`y` (`label`, `unit`, `min`, `max`, optional `step`; nice ticks otherwise), `series` of `[x, y]` points in order of x (`style: 'line' | 'dashed' | 'dots' | 'smooth'`, `tone`, `area: true` shades the area under the line), optional `marks` (x+y = labelled point, only x = vertical guide, only y = horizontal guide). Two or more labelled series get a legend. All points must lie inside the axes.

  ```ts
  { type: 'graph', x: { label: 't', unit: 's', min: 0, max: 10 }, y: { label: 'v', unit: 'm/s', min: 0, max: 20 },
    series: [{ label: 'auto', points: [[0, 0], [4, 16], [8, 16], [10, 0]], area: true },
             { label: 'cyklista', points: [[0, 6], [10, 6]], style: 'dashed' }],
    marks: [{ x: 4, y: 16, label: 'v_{max}' }], caption: 'Plocha pod grafem rychlosti je dráha.' }
  ```
- `circuit` – `source` (`'cell' | 'battery' | 'dc' | 'ac'`, optional `label` such as `'4,5 V'`) and `parts` in series, clockwise from the + terminal. A part is a component `{ kind, label? }` (`resistor`, `lamp`, `switch`, `switch-open`, `ammeter`, `voltmeter`, `ohmmeter`, `diode`, `led`, `capacitor`, `coil`, `motor`, `fuse`, `rheostat`, `ldr`, `thermistor`, `bell`, `wire`) or a parallel group `{ parallel: [[…], […]] }` whose 2+ branches are series lists (an empty branch is a plain wire). A voltmeter is drawn as a branch parallel to the part it measures. Long circuits wrap onto the right and bottom side automatically; closed circuits show moving current dots. Keep labels short (`R_{1}`, `Ž`, `2 Ω`).

  ```ts
  { type: 'circuit', source: { kind: 'battery', label: '4,5 V' },
    parts: [{ kind: 'switch', label: 'S' }, { kind: 'ammeter' },
            { parallel: [[{ kind: 'lamp', label: 'Ž_{1}' }], [{ kind: 'lamp', label: 'Ž_{2}' }], [{ kind: 'voltmeter' }]] }] }
  ```
- `forces` – a `body` (`box` default, `ball`, `car`, `person`, `point`, `plane`, `boat`, `skydiver`, `lamp`, `satellite`) on a `surface` (`none` default, `ground`, `incline` with `angle` in degrees, `water`, `ceiling` for a hanging body) with `forces`: `{ label, angle, size, tone?, from? }`. `angle` is the direction in degrees (0 right, 90 up, 180 left, 270 down) – always relative to the horizontal, also on an incline. The incline rises to the right, so the normal force points at `90 + angle` and "down the slope" is `180 + angle`. `size` sets the arrow length (all arrows share one scale). `from` is the anchor (`center` default, `top`, `bottom`, `left`, `right` of the body; `bottom` is the contact point). `resultant: true` adds the vector sum as a dashed arrow `F_{v}`, or "rovnováha" when the forces cancel.

  ```ts
  { type: 'forces', body: 'box', surface: 'incline', angle: 30, resultant: true,
    forces: [{ label: 'F_{G}', angle: 270, size: 4 }, { label: 'N', angle: 120, size: 3.46, from: 'bottom' },
             { label: 'F_{t}', angle: 30, size: 1.2, from: 'bottom' }] }
  ```
- `rays` – `element` (`convex-lens`, `concave-lens`, `concave-mirror`, `convex-mirror`, `plane-mirror`), `focal` (|f|, positive; ignored for a plane mirror), `object` (distance a > 0, not equal to f for a converging element) and optional `height`. The image is computed from 1/a + 1/a′ = 1/f and drawn with the three principal rays (virtual extensions dashed); a legend under the picture names the image (skutečný/zdánlivý, převrácený/přímý, zvětšený/zmenšený) and shows a, f, a′ and Z. Far objects or images are drawn with a broken axis.

  ```ts
  { type: 'rays', element: 'convex-lens', focal: 10, object: 15, caption: 'Předmět mezi F a 2F: obraz je skutečný, převrácený a zvětšený.' }
  ```
- `wave` – `kind` (`transverse` default, `longitudinal`, `standing`), `waves`: `{ amplitude, wavelength, phase?, label?, tone? }` (the picture is 2,5 × the longest wavelength wide, so only ratios matter), `sum: true` draws each wave thin and their sum bold (interference), `marks`: `'wavelength'`, `'amplitude'`, `'nodes'` (defaults: λ and A for a single transverse wave, nodes for a standing wave). Longitudinal waves show zhuštění/zředění; waves travel gently (still with reduced motion).

  ```ts
  { type: 'wave', sum: true, waves: [{ amplitude: 1, wavelength: 4, label: 'vlnění 1' },
                                     { amplitude: 1, wavelength: 4, phase: 0.5, label: 'vlnění 2' }],
    caption: 'Vlnění s opačnou fází se vyruší.' }
  ```

Two more blocks draw genetics from data the same way (renderers in `src/illustrations/biology/`, pure logic in `genetics.ts` and `pedigree.ts`; same caption, markup, tones and dark-mode rules):

- `punnett` – `parents: [rodič 1, rodič 2]` as genotypes in markup: `'Aa'`, `'AaBb'` (at most two genes, both parents the same number), `'X^{A}X^{a}'` × `'X^{A}Y'` (sex chromosomes), `'I^{A}i'` × `'I^{B}i'` (blood groups). Gametes are computed (one gene → 2, two genes → 4 by independent assortment); parent 1 stands on the left, parent 2 on top, ♀/♂ are added when the cross involves X and Y. Cells show the offspring genotype (dominant allele first, X before Y), shaded by phenotype, and a key below gives the genotype ratio („1 AA : 2 Aa : 1 aa“) and the phenotype ratio („3 : 1 – 75 % fialový květ, 25 % bílý květ“). Optional `traits` name the phenotypes; keys are looked up in this order: the gene's genotype (`'Aa'`, `'C^{R}C^{W}'` – use it for incomplete dominance), the allele that shows (`'A'`, `'a'`, `'I^{A}'`, `'X^{a}'` or just `'a'` for an X allele), and `'XX'` / `'XY'` to rename „dívka“ / „chlapec“ (e.g. „samice“ / „samec“). A capital allele is dominant over a small one; two different capital alleles are codominant (I^{A}I^{B} → „skupina AB“; blood groups are named automatically). An X-linked male shows the allele on his single X. Without `traits` the shorthand A_, aa, A_B_ is shown, so name the traits whenever the learner should read the result in words. Write trait names as short nouns or adjectives that work after a percentage („bílý květ“, „barvoslepost“); in a cross with X they follow the sex („dívka, zdravé vidění“).

  ```ts
  { type: 'punnett', parents: ['X^{A}X^{a}', 'X^{A}Y'], traits: { A: 'zdravé vidění', a: 'barvoslepost' },
    caption: 'Matka přenašečka a zdravý otec: barvoslepý může být jen syn.' }
  ```
- `pedigree` – `people`: 3–18 people `{ id, sex: 'm' | 'f', affected?, carrier?, label?, parents?: [motherId, fatherId] }`, at most 4 generations. Generations and positions are computed from the parent links: people without parents start generation I, unless they had children with someone from the family (then they stand beside that partner); couples are joined by a line, siblings hang from a common sibship line, two families joined by a marriage stand side by side. Square = male, circle = female, filled (level colour) = affected, dot = carrier; roman numerals mark the generations and a key under the chart explains the symbols. Keep `label` short (one word or a genotype like `X^{a}Y`) – long labels widen the whole chart. List people generation by generation and siblings in birth order; the order in the data is the order in the picture.

  ```ts
  { type: 'pedigree', caption: 'Barvoslepost v rodině: nemocný je dědeček i vnuk, matka je přenašečka.',
    people: [{ id: 'd', sex: 'm', affected: true, label: 'dědeček' }, { id: 'b', sex: 'f', label: 'babička' },
             { id: 'm', sex: 'f', carrier: true, parents: ['b', 'd'], label: 'matka' }, { id: 'o', sex: 'm', label: 'otec' },
             { id: 's', sex: 'm', affected: true, parents: ['m', 'o'], label: 'syn' }, { id: 'c', sex: 'f', parents: ['m', 'o'], label: 'dcera' }] }
  ```

### Experiments („Vyzkoušej si“)

`{ type: 'experiment', id, caption? }` puts a small interactive picture right into the lesson text, in a dashed frame labelled „Vyzkoušej si“. The learner moves one or two sliders and immediately sees what happens. Ids come from `src/lesson/experiments/catalog.ts`; each is a lazy-loaded component `src/lesson/experiments/<id>.tsx` built from the shared kit (`kit.tsx`: `Experiment` layout, `Control` slider, `Choice` buttons, `Readout`), with its physics as a pure, unit-tested function in `<id>.model.ts`.

| id | lesson | the learner sets → sees |
|---|---|---|
| `density-float` | f1-4 | mass m and volume V of a block (and the liquid: voda, slaná voda, olej) → ρ = m / V; the block floats (submerged by ρ / ρ_kapaliny), hovers (within ±0,02 g/cm³) or sinks |
| `ohm-law` | f6-3 | voltage U and resistance R → the ammeter shows I = U / R, the lamp glows with P = U · I and the current dots run faster |

When to use one:
- **One idea, one or two controls, an immediate visible effect, about 30 seconds.** A small `Choice` (e.g. the liquid) is fine as an extra; more controls turn it into a game.
- **Only where moving a value teaches something a static picture can't**: a relation (ρ = m / V, I = U / R) or a threshold (plave / vznáší se / klesne). If a `graph`, `diagram` or physics drawing shows it just as well, use that instead.
- **Place it where the idea is taught**, right after the explanation or formula it makes tangible, never collected at the end of the lesson. One per lesson is usually enough.
- **An optional „Úkol“**: one short challenge sentence with a checkable target („Nastav proud přesně 0,5 A.“); the box turns green while it is met.
- **No scoring, no XP, no saved progress.** An experiment is part of the reading; competition belongs to the `game` block.
- **Teaching thread:** `experiment` is a content block. Before it, a `p` says what to try and why. If another content block follows, a `p` after it says what the learner should have noticed („Všiml sis? …“). A concept from a later lesson shown in the experiment is named with its lesson („výkon P = U · I, lekce f6-5“), usually in the `caption`.
- The picture follows the [illustration guide](illustration-guide.md): Czech labels, decimal comma, units with a space, theme tokens only (dark mode), readable at 330 px, native range inputs (keyboard), `role="img"` with a Czech `aria-label` describing the current state; with reduced motion there is no ambient animation and changes jump instead of gliding.

## Questions

Kinds: `choice`, `multi`, `tf`, `number`, `text`, `order`, `match`.

- Every question has an `explain` that says **why**, in 1–2 sentences. It is shown after answering, whether the answer was right or wrong.
- `choice`: 3–4 options, exactly one correct, all plausible. Options are shuffled, so never write "všechny výše uvedené" or "A i B". `answer` is the index in the array as written.
- `multi`: 4–5 options, 2–3 correct.
- `tf`: a crisp statement. Balance true and false across a quiz.
- `number`: give `unit` when there is one, and `tolerance` (absolute) when rounding matters. The default tolerance is 1 % of the answer. Learners may type a decimal comma.
- `text`: short answers only (a symbol, a formula, a one- or two-word name). List all acceptable variants in `accept`. For formulas set `caseSensitive: true`. Without it, answers are compared ignoring case and diacritics.
- `order`: 3–6 items, listed in the correct order (they are shuffled for the learner).
- `match`: 3–5 pairs, written as `[left, right]` in the correct pairing.
- Numbers in the question text use a decimal comma. Relative atomic masses are rounded as in Czech school tables (H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, S 32, Cl 35,5, K 39, Ca 40, Fe 56, Cu 63,5), unless the lesson says otherwise.

**Lesson quiz**: 6–8 questions using at least 4 different kinds, including at least one `tf` (the Pravda/lež game draws from these). Questions must be answerable from the lesson.

**Level test (`boss`)**: 10–12 questions across all lessons of the level, a little harder, mixing kinds. No copies of the lesson quiz questions.

## Chemistry specifics

- Follow the order in `spec/courses/chemie/syllabus.md`. Never use a concept before the lesson that introduces it. When you have to mention something from a later level, say so ("podrobněji v úrovni 6").
- Safety: whenever an experiment or substance is mentioned, include the relevant safety note (goggles, fume hood, "never add water to acid": *nejdřív voda, potom kyselina*).
- Home experiments are welcome, but only with safe household materials (vinegar, baking soda, red cabbage juice, salt, sugar).
- Mnemonics are encouraged (e.g. the "KOCHNa" order, the oxide endings -ný, -natý, -itý, -ičitý, -ičný, -ový, -istý, -ičelý).

## Example (abridged)

```ts
{
  id: 'l2-3',
  title: 'Protonové číslo, nukleonové číslo a izotopy',
  goals: ['Z protonového a nukleonového čísla spočítat počet protonů, neutronů a elektronů', 'Vysvětlit, co jsou izotopy'],
  hook: 'Uhlík v tvé tužce a uhlík v diamantu mají stejný počet protonů. Ale víš, že i uhlíky se mezi sebou liší váhou?',
  sections: [
    {
      title: 'Dvě čísla, která o atomu řeknou všechno',
      blocks: [
        { type: 'p', text: '**Protonové číslo** $Z$ udává počet protonů v jádře. Právě ono určuje, o jaký prvek jde.' },
        { type: 'formula', text: '$A = Z + N$', caption: 'nukleonové číslo = protony + neutrony' },
        { type: 'example', problem: 'Kolik neutronů má atom $^{23}_{11}Na$?', steps: ['$A = 23$, $Z = 11$', '$N = A − Z = 23 − 11$'], answer: '$N = 12$ neutronů' },
        { type: 'check', question: { kind: 'number', q: 'Kolik neutronů má $^{35}_{17}Cl$?', answer: 18, explain: '$N = 35 − 17 = 18$.' } },
      ],
    },
  ],
  summary: ['Protonové číslo $Z$ určuje prvek.', '…'],
  quiz: [ /* 6–8 questions */ ],
}
```
