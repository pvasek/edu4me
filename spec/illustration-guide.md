# Illustration guide

Q & Why should feel like an **illustrated scientific encyclopedia that became a game**. Most ideas are explained by a picture: a technical schema, an engraved apparatus, a rotating molecule, a particle scene, a process cycle or an icon grid. Text supports the pictures, not the other way round.

All visual assets are listed in `src/illustrations/catalog.ts` (icons, molecules, figures). Content may only use those ids; renderers must implement every one.

## Visual language

- **Engraving line art.** Ink-blue outlines (`var(--edge)` / `var(--ink)`), 1.5 px main strokes, 0.8–1 px detail strokes. Rounded joins and caps.
- **Hatching instead of gradients.** Shading, liquids, metal and glass use diagonal or cross hatching (SVG `<pattern>` of thin lines in `var(--hatch)` or the object's colour at 30–50 %). Use `useId()` for unique pattern ids.
- **Vintage plate colours** for fills: level colours, `--cat-*` tints, `--accent`, `--blue`, `--green`, `--yellow`, `--violet`, `--pink`, `--teal`. Subject colours (flames, indicators, CPK atom colours) may be literal.
- **CPK atom colours** (used everywhere a specific atom is drawn): H `#f4f1ea` (with ink outline), C `#3b3b3b`, N `#3d6fd1`, O `#d9493b`, S `#e0b43a`, P `#e88b35`, Cl `#4fae5a`, F `#8fcf6b`, Br `#8c3a2b`, I `#6b3f8f`, Na `#8a63c9`, K `#7a4fb3`, Ca `#6b8c7a`, Mg `#5c9a6b`, Fe `#b86a3c`, Cu `#c7773d`, Zn `#8a93a3`, Al `#a3a8b3`, Si `#c2a36b`, others `#b3a58f`. Atoms get a small engraved highlight (crescent hatch), not a glossy gradient.
- **Labels** in italic `var(--font-display)` (Cormorant) 14–18 px, with thin leader lines; numbers and formulas in `var(--font-mono)` or through `<Md>`. Czech only.
- **Figure frame.** Figures sit on the page inside the lesson's `b-diagram` figure; don't draw your own frame. Keep an inner margin so labels never touch the edge.
- **Size.** `viewBox`-based, `width: 100%`, sensible `max-width` (usually 520–720 px), must read at 330 px wide (drop or wrap secondary labels under 420 px with a container query or a compact variant).
- **Accessible.** `role="img"` + a Czech `aria-label` describing the content.
- **Theme.** Works on parchment and on the night-study dark theme: only tokens for ink/paper; fills that must stay light (glass, water) use `var(--surface)` / `var(--info-soft)` mixes.

## Motion (Motion library, presets in `src/ui/motion.ts`)

Illustrations **come alive when they scroll into view** (`whileInView`, `viewport={{ once: true }}`) and then stay complete and readable:
- lines and arrows draw in with `pathLength`,
- parts pop in with `popIn` / `stagger()`,
- processes run once (a drop falls, gas bubbles rise, electrons hop, a flame flickers),
- small ambient loops are allowed with CSS keyframes (bubbles, flames, orbiting electrons, jiggling particles),
- interactive where it teaches: hover/tap a part to highlight it and show its label; drag to rotate molecules; a "Přehrát znovu" button for processes.
Respect reduced motion (global CSS rule + `MotionConfig reducedMotion="user"`).

## Steps: one picture that changes, or a strip without animation

A process shown in steps is always built with the shared components in `src/illustrations/sequence/StepFigure.tsx` – never with ad-hoc panels and chained delays (on a phone stacked panels mean the animation plays where the learner isn't looking).

| Situation | Component | Behaviour |
|---|---|---|
| One scene changing over time (enzyme + substrate, a reaction mechanism, dissolving, decay, electron transfer) | `StepFilm` | ONE stage; frames replace each other in place. Numbered title + one-sentence caption, step segments (tap to jump), ‹ ›, Přehrát / Pauza / Přehrát znovu. Autoplays once when ≥ 60 % is visible, pauses off-screen; tap the picture for the next step. Reduced motion: no autoplay. |
| Variants or states compared side by side (isomers, allotropes, protein structure levels, two methods) | `StepStrip` | All panels numbered and fully drawn, no step-by-step animation; `phoneColumns={2}` for small panels. |
| A single picture with an animation | the figure itself + `ReplayButton` | Allowed only if the figure fits a phone screen (≤ ~600 px tall at 390 px) and the animation finishes in ≤ ~2.5 s. Longer or taller reveals are shortened or turned into a `StepFilm`. |

Rules for film frames: every frame uses the same viewBox and layout (so the change reads as one picture), no delays chained across steps, a frame's own entrance ≤ ~1.2 s. A figure hosting a film passes `interactive` to its kit `Figure` (the film carries `role="img"` and the description itself, because it contains buttons).

## Card detail view

Card sets (`iconlist` cards, `process` steps) open in the shared `CardViewer` (`src/ui/CardViewer.tsx`) when tapped: full-screen sheet on phones (swipe left/right between cards, swipe down to close), centered dialog on wide screens; always-visible close, counter, ‹ › and dots; keys ← → Esc. New card-like blocks use the same viewer instead of their own. On phones `iconlist` shows one column of compact horizontal cards; the big view is one tap away.

## Asset types

| Block | Renderer | Use it for |
|---|---|---|
| `diagram` with a figure id | `src/illustrations/figures/*` | technical schemas, apparatus, industrial processes, cycles, biological structures |
| `molecule` | `src/illustrations/molecules/MoleculeView.tsx` | 1–4 molecules as rotatable 3D ball-and-stick models (auto-rotate slowly, drag to rotate) |
| `particles` | `src/illustrations/particles/ParticleScene.tsx` | particle-model boxes: element / compound / mixture, states of matter, solutions, before → after |
| `reaction` | `src/illustrations/particles/ReactionView.tsx` | any balanced equation drawn as molecules with coefficients, atom-count check below |
| `process` | `src/illustrations/blocks/Process.tsx` | 3–7 steps with icons as a flow (→) or a closed cycle |
| `iconlist` | `src/illustrations/blocks/IconList.tsx` | uses, examples, safety rules, "kde to potkáš" |
| `compare` | `src/illustrations/blocks/Compare.tsx` | 2–3 things side by side (exo vs endo, σ vs π, DNA vs RNA) |
| section `icon` | `ChemIcon` | every lesson section title |
| level vignettes | `src/illustrations/vignettes/LevelVignette.tsx` | course atlas (inside each level plate header) and level hero |

## Density rule for lessons

- Every section has **at least one visual** block, and most sections two.
- Prefer a visual over a paragraph: lists of examples become `iconlist`, sequences become `process`, contrasts become `compare`, reactions get a `reaction` picture, structures get a `molecule`.
- Paragraphs stay short (≤ 3 sentences). A section should not have two paragraphs in a row without a visual, callout, example or check between them.
