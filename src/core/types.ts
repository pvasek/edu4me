/**
 * Content model shared by every course (chemistry is the first one).
 *
 * Text fields typed as `Inline` accept the lightweight markup described in
 * spec/content-guidelines.md: **bold**, *italic*, $H2SO4$ chemistry,
 * ^{sup}, _{sub}, and -> arrows. See src/core/markup.tsx.
 */
export type Inline = string

import type { ChemIcon, FigureId, MoleculeId, SpecimenId } from '../illustrations/catalog'
export type { ChemIcon, FigureId, MoleculeId, SpecimenId }
import type { ExperimentId } from '../lesson/experiments/catalog'
export type { ExperimentId }

export type CalloutVariant = 'tip' | 'warning' | 'fact' | 'remember' | 'mascot'

export type DiagramId =
  | 'bohr' // props: { z: number, ion?: number, label?: string }
  | 'states' // solid / liquid / gas particles
  | 'ph-scale' // props: { marks?: { ph: number, label: string }[] }
  | 'periodic-mini' // props: { highlight?: 'groups' | 'blocks' | 'metals' | 'trends' }
  | 'energy-profile' // props: { kind: 'exo' | 'endo', catalyst?: boolean }
  | 'titration-curve' // props: { kind: 'strong-strong' | 'weak-strong' }
  | 'orbitals' // props: { z: number }
  | 'separation' // props: { method: 'filtration' | 'distillation' | 'chromatography' | 'decantation' | 'evaporation' }
  | 'galvanic' // Daniell cell
  | 'rate-curve' // concentration vs time / collision theory
  | 'lab-safety' // hazard pictograms (GHS)
  | FigureId // named engraved figures, see src/illustrations/catalog.ts

export type Block =
  | { type: 'p'; text: Inline }
  | { type: 'h'; text: Inline }
  | { type: 'list'; items: Inline[]; ordered?: boolean }
  | { type: 'callout'; variant: CalloutVariant; title?: Inline; text: Inline }
  | { type: 'keyterms'; items: { term: Inline; def: Inline }[] }
  | { type: 'formula'; text: Inline; caption?: Inline }
  | { type: 'example'; title?: Inline; problem: Inline; steps: Inline[]; answer: Inline }
  | { type: 'table'; headers: Inline[]; rows: Inline[][]; caption?: Inline }
  | { type: 'elements'; symbols: string[]; caption?: Inline }
  | { type: 'structure'; art: string; caption?: Inline }
  | { type: 'diagram'; id: DiagramId; caption?: Inline; props?: Record<string, unknown> }
  | { type: 'check'; question: Question }
  /** 1–4 molecules as rotatable 3D ball-and-stick models. */
  | { type: 'molecule'; molecules: MoleculeId[]; labels?: Inline[]; caption?: Inline }
  /** Particle-model boxes (element / compound / mixture, states, before → after). */
  | { type: 'particles'; boxes: ParticleBox[]; arrows?: boolean; caption?: Inline }
  /** A balanced equation drawn as particles, e.g. "2H2 + O2 -> 2H2O". */
  | { type: 'reaction'; equation: string; caption?: Inline }
  /** Steps with icons as a flow (→) or a closed cycle. */
  | { type: 'process'; layout: 'flow' | 'cycle'; steps: IconItem[]; caption?: Inline }
  /** Grid of icon cards: examples, uses, "kde to potkáš". */
  | { type: 'iconlist'; items: IconItem[] }
  /** 2–3 columns side by side. */
  | { type: 'compare'; columns: CompareColumn[]; caption?: Inline }
  /** Cards with a big picture on the front; tap to flip and read the back. */
  | { type: 'flipcards'; cards: FlipCard[]; caption?: Inline }
  | { type: 'game'; gameId: GameId; text?: Inline }
  /** An in-lesson micro-experiment ("Vyzkoušej si"): a small interactive picture, see src/lesson/experiments. */
  | { type: 'experiment'; id: ExperimentId; caption?: Inline }
  // ── physics: parametric technical drawings (rendered in src/illustrations/physics/) ──
  /** A graph drawn from data points: motion graphs, heating curves, I–U characteristics, decay… */
  | { type: 'graph'; x: GraphAxis; y: GraphAxis; series: GraphSeries[]; marks?: GraphMark[]; caption?: Inline }
  /** A circuit diagram with standard symbols: a source and a series of parts (parts can be parallel groups). */
  | { type: 'circuit'; source: CircuitSource; parts: CircuitPart[]; caption?: Inline }
  /** A free-body / force diagram: a body with labelled force arrows. */
  | { type: 'forces'; body?: ForceBody; surface?: 'none' | 'ground' | 'incline' | 'water' | 'ceiling'; angle?: number; forces: ForceArrow[]; resultant?: boolean; caption?: Inline }
  /** A ray diagram for a lens or mirror; the image is computed from the imaging equation. */
  | { type: 'rays'; element: 'convex-lens' | 'concave-lens' | 'concave-mirror' | 'convex-mirror' | 'plane-mirror'; focal: number; object: number; height?: number; caption?: Inline }
  /** One or more waves (transverse, longitudinal or standing), optionally with their sum and λ/A marks. */
  /** A Punnett square drawn from the parents' genotypes, e.g. ['Aa', 'Aa'], ['AaBb', 'AaBb'], ['X^{A}X^{a}', 'X^{A}Y']; offspring and ratios are computed. */
  | { type: 'punnett'; parents: [string, string]; traits?: Record<string, Inline>; caption?: Inline }
  /** A family pedigree chart: squares = males, circles = females, filled = affected, dot = carrier. */
  | { type: 'pedigree'; people: PedigreePerson[]; caption?: Inline }
  | { type: 'wave'; kind?: 'transverse' | 'longitudinal' | 'standing'; waves: WaveSpec[]; sum?: boolean; marks?: ('wavelength' | 'amplitude' | 'nodes')[]; caption?: Inline }

export interface PedigreePerson {
  id: string
  sex: 'm' | 'f'
  affected?: boolean
  carrier?: boolean
  /** short label under the symbol, e.g. "babička" or a genotype "Aa" */
  label?: Inline
  /** ids of the mother and father (both must be in the chart) */
  parents?: [string, string]
}

export type Tone = 'a' | 'b' | 'c' | 'd'

export interface GraphAxis {
  /** quantity symbol or name, e.g. "t" or "čas" */
  label: Inline
  /** unit shown in the axis label, e.g. "s" */
  unit?: string
  min: number
  max: number
  /** tick spacing (default: a sensible step) */
  step?: number
}
export interface GraphSeries {
  label?: Inline
  /** [x, y] points in axis units, in order of x (a line through them) */
  points: [number, number][]
  style?: 'line' | 'dashed' | 'dots' | 'smooth'
  tone?: Tone
  /** shade the area under the line (e.g. distance under a v–t graph) */
  area?: boolean
}
/** An annotation: x+y = labelled point, only x = vertical guide, only y = horizontal guide. */
export interface GraphMark {
  x?: number
  y?: number
  label: Inline
}

export type CircuitComponentKind =
  | 'resistor' | 'lamp' | 'switch' | 'switch-open' | 'ammeter' | 'voltmeter' | 'ohmmeter'
  | 'diode' | 'diode-reverse' | 'led' | 'capacitor' | 'coil' | 'motor' | 'fuse' | 'breaker' | 'rheostat' | 'ldr' | 'thermistor' | 'bell' | 'wire'
export interface CircuitComponent {
  kind: CircuitComponentKind
  /** short label, e.g. "R₁", "Ž", "2 Ω" */
  label?: string
}
/** A series element, or a parallel group whose branches are series lists. */
export type CircuitPart = CircuitComponent | { parallel: CircuitComponent[][] }
export interface CircuitSource {
  kind: 'cell' | 'battery' | 'dc' | 'ac'
  label?: string
}

export type ForceBody = 'box' | 'ball' | 'car' | 'person' | 'point' | 'plane' | 'boat' | 'skydiver' | 'lamp' | 'satellite'
export interface ForceArrow {
  /** e.g. "F_{G}", "F_{t}", "N" */
  label: Inline
  /** direction in degrees: 0 = right, 90 = up, 180 = left, 270 = down (on an incline: relative to the horizontal) */
  angle: number
  /** relative length (1–5), or newtons when all arrows use the same scale */
  size: number
  tone?: Tone
  /** where the arrow starts (default: the centre of the body) */
  from?: 'center' | 'bottom' | 'top' | 'left' | 'right'
}

export interface WaveSpec {
  /** relative amplitude (e.g. 1) */
  amplitude: number
  /** wavelength in the same arbitrary units as the drawing width (the drawing shows ~2–3 wavelengths) */
  wavelength: number
  /** phase shift in wavelengths (0–1) */
  phase?: number
  label?: Inline
  tone?: Tone
}

export interface IconItem {
  icon: ChemIcon
  title: Inline
  text?: Inline
}

export interface FlipCard {
  /** Big engraved drawing on the front (preferred) … */
  art?: SpecimenId
  /** … or an icon when no drawing exists. */
  icon?: ChemIcon
  title: Inline
  /** Text on the back of the card. */
  text: Inline
}

export interface CompareColumn {
  title: Inline
  icon?: ChemIcon
  tone?: 'a' | 'b' | 'c' | 'good' | 'bad'
  points: Inline[]
}

export interface ParticleBox {
  label: Inline
  /** species: a MoleculeId, an element symbol (single atoms) or a simple formula. */
  items: { species: string; count: number }[]
  state?: 'solid' | 'liquid' | 'gas' | 'solution'
  note?: Inline
}

interface QBase {
  q: Inline
  explain?: Inline
}

export type Question =
  | (QBase & { kind: 'choice'; options: Inline[]; answer: number })
  | (QBase & { kind: 'multi'; options: Inline[]; answers: number[] })
  | (QBase & { kind: 'tf'; answer: boolean })
  | (QBase & { kind: 'number'; answer: number; tolerance?: number; unit?: string })
  | (QBase & { kind: 'text'; accept: string[]; caseSensitive?: boolean; placeholder?: string })
  | (QBase & { kind: 'order'; items: Inline[] })
  | (QBase & { kind: 'match'; pairs: [Inline, Inline][] })

export interface LessonSection {
  title: Inline
  /** Icon shown next to the section title. */
  icon?: ChemIcon
  blocks: Block[]
}

export interface Lesson {
  id: string
  title: Inline
  /** "Po této lekci budeš umět…" – 2 to 4 concrete outcomes. */
  goals: Inline[]
  /** Short intro spoken by the mascot. */
  hook: Inline
  /** Sections are read on one scrolling page; `check` blocks feed the end-of-lesson quiz. */
  sections: LessonSection[]
  summary: Inline[]
  /** End-of-lesson quiz, 5–8 questions. */
  quiz: Question[]
}

export interface LevelContent {
  lessons: Record<string, Lesson>
  /** Level test ("Závěrečná výzva"), 10–12 questions across the whole level. */
  boss: Question[]
}

export interface LessonOutline {
  id: string
  title: string
  icon: ChemIcon
  minutes: number
}

export interface LevelOutline {
  id: string
  number: number
  title: string
  subtitle: string
  /** Stage in the real school system, shown as a tag. */
  stage: string
  color: string
  /** Level emblem shown on the map and awarded by the level test: an element symbol (chemistry) or a unit/constant (physics). */
  symbol: string
  /** Name of the emblem when it isn't a chemical element, e.g. "newton". */
  emblemName?: string
  lessons: LessonOutline[]
  load: () => Promise<LevelContent>
}

export interface Course {
  id: string
  title: string
  tagline: string
  color: string
  /** icon used in navigation and on course cards */
  icon?: ChemIcon
  available: boolean
  levels: LevelOutline[]
  /** what the level tests award: chemical elements (album of 118) or the level emblems (units/constants) */
  album?: { kind: 'elements' | 'emblems'; title: string }
}

export type GameId =
  | 'periodic-find'
  | 'element-memory'
  | 'who-am-i'
  | 'build-atom'
  | 'electron-config'
  | 'ion-builder'
  | 'naming'
  | 'balance'
  | 'molar-mass'
  | 'quickfire'
  | 'swipe'
  | 'ph-lab'
  | 'titration'
  | 'functional-groups'
  // physics
  | 'unit-convert'
  | 'motion-graph'
  | 'force-sum'
  | 'float-sink'
  | 'energy-chain'
  | 'circuit-builder'
  | 'ray-optics'
  | 'projectile'
  // biology
  | 'id-key'
  | 'cell-builder'
  | 'body-map'
  | 'punnett'
  | 'dna-code'
  | 'food-web'
