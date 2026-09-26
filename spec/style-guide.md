# Style guide – "Lab Notebook Pop"

The visual language of edu4me. Chosen from the 24 variants in the style lab (variant 01 *Lab Notebook*, with the periodic-group colours of 09 and the chunky buttons of 06/08 mixed in). All values live as CSS custom properties in `src/ui/theme.css`. **Never hard-code a colour or font in a component**; use a token. Changing the whole look means editing that one file.

## Personality

A scientist's notebook that got decorated with highlighters and stickers. Paper and ink give the calm. Hard offset shadows, bold outlines and bright category colours give the play. Handwritten notes add the voice.

- Playful, not childish (audience 14–18).
- Every screen has **one** loud thing (the current level node, the primary button, the element tile); the rest stays quiet.
- Chemistry is the decoration: element tiles, atoms, flasks, pH colours and flame-test colours instead of generic shapes.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#f6f1e6` | `#1a1c23` | page background (with a 22 px grid, `--paper-grid`) |
| `--surface` | `#fffcf5` | `#23262f` | cards, inputs |
| `--surface-2/3` | warm greys | slate | tracks, hover, secondary panels |
| `--ink` | `#26221e` | `#f1ece2` | text |
| `--ink-soft`, `--muted` | | | secondary text, captions |
| `--edge` | `#26221e` | `#d9d1c3` | outlines (2 px) |
| `--shadow-color` | ink | near-black | hard offset shadows |
| `--accent` | `#e8553d` | `#ff7a5c` | primary actions, eyebrows, the mascot |
| `--blue --green --yellow --violet --pink --teal` | | | secondary accents |
| `--good / --bad / --warn` (+ `-soft`) | | | feedback only. Never decorative |
| `--highlight` | `#ffe86a` | | `==marker==` text highlight |
| `--cat-*` | pastel | same | periodic-table categories; always with `--cat-ink` text |

**Level colours** follow the rainbow in course order (coral, orange, yellow, green, teal, blue, indigo, violet, pink); set per level in the course outline and exposed as `--level` on level pages.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display | **Fraunces** (variable) | headings, element symbols, big numbers, buttons in games. Weight 700–800 |
| Body | **Karla** | all running text, UI. 17 px base, 1.6 line height |
| Hand | **Caveat** | annotations, mascot asides, "sticky notes". Max one or two lines |
| Mono | **JetBrains Mono** | numbers in tables, Z numbers, structural formulas, inputs for answers |

All fonts are self-hosted via `@fontsource` (no external requests) and support Czech diacritics.

Scale: h1 clamp(30–46 px), h2 clamp(24–32), h3 21, body 17, small 14, eyebrow 12 caps with 0.12em tracking.

## Shape and depth

- Outlines: `2px solid var(--edge)`.
- Radius: `--r-sm` 8, `--r` 12, `--r-lg` 20, pills 99.
- Depth: **hard offset shadows** (`--shadow-hard` = 3px 3px 0). Buttons move toward the shadow when pressed (`translate(2px,2px)`), and away on hover.
- Soft shadows (`--shadow-soft`) only for floating layers (toasts, modals).
- Answer options use a thicker bottom border (4 px) that collapses on press, like a physical key.

## Components (in `src/ui` and `theme.css`)

- `.btn` + `.btn-primary / -good / -ghost / -sm / -lg / -block`.
- `.card` (outlined + hard shadow) and `.card-flat` (hairline, no shadow) for secondary panels.
- `.chip` for XP, streak, tags; `.progress > span` bars (colour via `--bar`).
- `<Mascot mood>` – Atomík, the atom mascot. Moods: happy, think, wow, sad, cheer, sleep. `<MascotSays>` adds a speech bubble.
- `<ElementTile symbol size>` – periodic-table tile coloured by category.
- `<Icon name>` – 24 px stroke icons (2 px stroke), filled for flame/bolt/star/heart/play.
- `.note` – handwritten annotation in the accent colour.

## Motion

- Short and springy: 150–350 ms, `cubic-bezier(.3,1.4,.5,1)` for pops.
- Celebrations (lesson complete, level badge) may use confetti or a bounce once. Nothing loops except the mascot's orbits and the slow atom spin.
- Wrong answer: a 300 ms horizontal shake. Right answer: a pop plus a green check.
- Respect `prefers-reduced-motion` (a global rule in theme.css disables animations).

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
