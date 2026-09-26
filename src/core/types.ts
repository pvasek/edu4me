/**
 * Content model shared by every course (chemistry is the first one).
 *
 * Text fields typed as `Inline` accept the lightweight markup described in
 * spec/content-guidelines.md: **bold**, *italic*, $H2SO4$ chemistry,
 * ^{sup}, _{sub}, and -> arrows. See src/core/markup.tsx.
 */
export type Inline = string

import type { ChemIcon, FigureId, MoleculeId } from '../illustrations/catalog'
export type { ChemIcon, FigureId, MoleculeId }

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
  | { type: 'game'; gameId: GameId; text?: Inline }

export interface IconItem {
  icon: ChemIcon
  title: Inline
  text?: Inline
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
  /** Each section is one "page" of the lesson player. */
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
  /** Element symbol used as the level "badge" on the map. */
  symbol: string
  lessons: LessonOutline[]
  load: () => Promise<LevelContent>
}

export interface Course {
  id: string
  title: string
  tagline: string
  color: string
  available: boolean
  levels: LevelOutline[]
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
