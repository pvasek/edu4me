/**
 * Content model shared by every course (chemistry is the first one).
 *
 * Text fields typed as `Inline` accept the lightweight markup described in
 * spec/content-guidelines.md: **bold**, *italic*, $H2SO4$ chemistry,
 * ^{sup}, _{sub}, and -> arrows. See src/core/markup.tsx.
 */
export type Inline = string

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
  | { type: 'game'; gameId: GameId; text?: Inline }

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
  games: GameId[]
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
