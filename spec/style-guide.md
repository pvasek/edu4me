# Style guide – "Encyclopedia"

The visual language of edu4me, chosen from the 24 variants in [design/style-lab.html](design/style-lab.html) (**variant 15, Encyclopedia**), with "vintage colour pops" added so it stays playful for teenagers. All values live as CSS custom properties in `src/ui/theme.css`. **Never hard-code a colour or font in a component**; use a token. Changing the whole look means editing that one file.

## Personality

An antique scientific encyclopedia that has come alive. Parchment pages, ink-blue engraving lines, italic Garamond headings, double-ruled frames and hatched shading give it the calm authority of an old reference book. Antique plate colours (madder red, ochre, sage, teal ink, plum), handwritten margin notes (Caveat), a friendly engraved mascot and lively animation keep it playful.

- Scholarly but warm; playful, never childish (audience 14–18).
- Every screen has **one** loud thing (the current level node, the primary button, the element tile); the rest stays quiet.
- Chemistry itself is the decoration: element tiles, atoms, flasks, apparatus drawn like engravings, pH and flame colours.

## Colour

| Token | Light (parchment) | Dark (night study) | Use |
|---|---|---|---|
| `--paper` | `#f3ecdb` | `#141a29` | page background, with a paper grain and vignette |
| `--surface` | `#faf5e8` | `#1c2336` | cards, inputs |
| `--surface-2/3` | aged paper | ink navy | tracks, hover, secondary panels |
| `--ink` | `#1f2a44` ink blue | `#efe6d2` cream | text |
| `--ink-soft`, `--muted` | | | secondary text, captions |
| `--edge` | ink blue | parchment | outlines (1.5 px) |
| `--line` | `#d5c7a4` | `#36415e` | hairlines, dotted paths |
| `--accent` | `#a8561a` ochre | `#e3a45e` | primary actions, eyebrows, the mascot |
| `--blue --green --yellow --violet --pink --teal` | antique inks | lighter inks | secondary accents |
| `--good / --bad / --warn` (+ `-soft`) | | | feedback only. Never decorative |
| `--highlight` | `#f0d58a` | | `==marker==` text highlight |
| `--hatch` | ink at 13 % | cream at 10 % | engraving hatch lines (`.hatch`) |
| `--cat-*` + `--cat-ink` | antique plate tints | same | periodic-table categories; text is always `--cat-ink` |
| `--on-level` | `#fffaf0` | same | text on level colours |

**Level colours** are mid-dark vintage inks in course order: madder `#b8483a`, burnt orange `#bd6a26`, mustard `#9c7a12`, sage `#56834a`, teal `#2c7a72`, slate blue `#3f6699`, indigo `#555a9e`, plum `#7a5290`, rose `#a84d6c`. They are set in the course outline and exposed as `--level` on level pages.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display | **Cormorant Garamond** 600/700 + italic | headings (h1/h2 italic), element symbols, big numbers |
| Body | **Karla** | running text and UI; 17–18 px, line height 1.6–1.7 |
| Hand | **Caveat** | margin notes, mascot speech, "zapiš si to!" |
| Mono | **JetBrains Mono** | Z numbers, structural formulas, answer inputs, counters |

All fonts are self-hosted via `@fontsource` and support Czech diacritics.

Scale: h1 clamp(36–56 px) italic, h2 clamp(28–38) italic, h3 24, body 17–18, small 14, eyebrow 12 caps with 0.18em tracking.

## Shape and depth

- Outlines: `1.5px solid var(--edge)`. Frames get the **double rule** (`--double-rule` inset shadow) like a book plate.
- Small radii: `--r-sm` 4, `--r` 6, `--r-lg` 10. Pills only for chips.
- Depth: a soft ink offset shadow (`--shadow-hard` = 3px 3px 0 at 22 % ink). Buttons move toward the shadow when pressed.
- Shading: engraving hatches (`.hatch`, SVG `<pattern>` of thin diagonal lines) instead of gradients.
- Ornaments: `.fleuron` double-rule divider for major breaks; handwritten notes in the margin.

## Motion

One animation system for the whole app: **[Motion](https://motion.dev) (`motion/react`)**, with shared presets in `src/ui/motion.ts`.

| Use | Tool | Preset |
|---|---|---|
| Page entrance | `<Page>` (`ui/anim.tsx`) | `fadeUp` + stagger of children |
| Lesson steps and quiz questions | `AnimatePresence mode="wait"` | `slide` with a direction (forward/back) |
| Lesson blocks, summaries, lists | stagger container | `stagger()` + `rise` |
| Nodes, tiles, badges, stars, rewards | | `popIn`, `spring.bouncy` |
| Right answer / wrong answer | `animate` keyframes | `bump` / `shake` |
| Cards and buttons you can tap | `whileHover` / `whileTap` | `pressable`, `spring.snappy` |
| Progress bars, rings, path lines | animated width / `pathLength` | `spring.gentle`, `ease.inOut` |
| Numbers (XP, counts) | `<CountUp>` | `animate()` |
| Diagrams | `motion.path` `pathLength` draw-in on `whileInView` | `ease`, `popIn` |
| Game pieces | `layout`, `drag`, `AnimatePresence` | the same presets |

Rules:
- Plain CSS only for hover colour changes and **infinite ambient loops** (orbiting electrons, the pulsing current node, bubbling liquids).
- Every animated element is fully readable in its final state; animation only brings it there.
- Durations 150–500 ms; springs over linear easing. One celebratory moment per result screen (confetti + stars).
- `<MotionConfig reducedMotion="user">` wraps the app, and a global CSS rule stops keyframe animations for people who prefer reduced motion.

## Components (in `src/ui` and `theme.css`)

- `.btn` + `.btn-primary / -good / -ghost / -sm / -lg / -block`.
- `.card` (outlined + hard shadow) and `.card-flat` (hairline, no shadow) for secondary panels.
- `.chip` for XP, streak, tags; `.progress > span` bars (colour via `--bar`).
- `<Mascot mood>` – Atomík, the atom mascot, drawn like an engraving (hatched nucleus). Moods: happy, think, wow, sad, cheer, sleep. `<MascotSays>` adds a speech bubble.
- `<ElementTile symbol size>` – periodic-table tile coloured by category.
- `<Icon name>` – 24 px stroke icons (2 px stroke), filled for flame/bolt/star/heart/play.
- `.note` – handwritten annotation in the accent colour.

## Layout

- Mobile first. Everything must work at **360 px** wide, with 16 px side gutters.
- Content width: `--maxw` 1100 px for pages, `--readw` 68ch for lesson text.
- Tap targets ≥ 44 px. Primary actions sit at the bottom of the lesson player, within thumb reach on phones.
- Use flex/grid `gap`, never margins between siblings.

## Voice in the UI

Czech, informal *ty*, short. Buttons say what happens: „Pokračovat“, „Zkontrolovat“, „Hrát znovu“. Feedback is warm but specific: „Správně! Sodík má jeden valenční elektron.“ Never shame a mistake.

## Accessibility

- Text contrast ≥ 4.5:1 in both themes (the tokens are chosen for this).
- Visible focus ring (`--blue`, 3 px).
- Every interactive game element is reachable by keyboard; colour is never the only signal (icons + text on feedback).
- SVG diagrams have `role="img"` and an `aria-label`.
