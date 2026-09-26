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
sections: 3–6             – each section is one screen of the lesson player
summary: 4–7 items        – the takeaways, written as full short sentences
quiz: 6–8 questions       – covering all sections, mixed kinds, rising difficulty
```

Each **section** has a title and 4–12 blocks. Good rhythm for a section:
1. explanation (`p`, `list`, `keyterms`)
2. a visual (`diagram`, `elements`, `table`, `structure`, `formula`)
3. a worked `example` when there is a calculation or a procedure
4. a `callout` (tip, warning, fact, remember or mascot)
5. **at least one `check` question** at the end of every section, so the learner is active every 2–3 minutes

A section may embed a `game` block pointing at a related mini-game (at most once per lesson).

### Block types

- `p` – paragraph.
- `h` – sub-heading inside a section (rarely needed).
- `list` – bullets, or `ordered: true` for real sequences only.
- `callout` – `tip` (a practical trick), `warning` (typical mistake, safety), `fact` (a surprising real-world fact), `remember` (a rule to memorise), `mascot` (Atomík speaking: humour, encouragement).
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
- `check` – one inline question (see below).
- `game` – `{ gameId, text }`: a card inviting the learner to a mini-game.

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
