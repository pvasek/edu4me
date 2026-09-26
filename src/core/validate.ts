import type { Block, LevelContent, LevelOutline, Question } from './types'
import { BY_SYMBOL } from '../courses/chemie/data/elements'
import { CHEM_ICONS, FIGURES, MOLECULES } from '../illustrations/catalog'
import { parseFormula } from '../courses/chemie/data/formula'

const ICONS = new Set<string>(CHEM_ICONS)
const MOLS = new Set<string>(MOLECULES)

const DIAGRAMS = new Set<string>([...FIGURES, 'bohr', 'states', 'ph-scale', 'periodic-mini', 'energy-profile', 'titration-curve', 'orbitals', 'separation', 'galvanic', 'rate-curve', 'lab-safety'])

/** Returns a list of human-readable problems; empty = valid. */
export function validateLevel(outline: LevelOutline, content: LevelContent): string[] {
  const errs: string[] = []
  const ids = outline.lessons.map((l) => l.id)
  for (const id of ids) if (!content.lessons[id]) errs.push(`missing lesson ${id}`)
  for (const id of Object.keys(content.lessons)) if (!ids.includes(id)) errs.push(`unexpected lesson ${id}`)

  for (const [id, lesson] of Object.entries(content.lessons)) {
    const at = (s: string) => errs.push(`${id}: ${s}`)
    if (lesson.id !== id) at(`id field "${lesson.id}" does not match key`)
    if (lesson.goals.length < 2) at('needs at least 2 goals')
    if (lesson.sections.length < 3) at('needs at least 3 sections')
    if (lesson.summary.length < 3) at('needs at least 3 summary items')
    if (lesson.quiz.length < 6 || lesson.quiz.length > 9) at(`quiz has ${lesson.quiz.length} questions (want 6–8)`)
    if (!lesson.quiz.some((q) => q.kind === 'tf')) at('quiz needs at least one tf question')
    const kinds = new Set(lesson.quiz.map((q) => q.kind))
    if (kinds.size < 3) at('quiz should mix at least 3 question kinds')
    lesson.sections.forEach((s, si) => {
      if (!s.blocks.some((b) => b.type === 'check')) at(`section ${si + 1} "${s.title}" has no check question`)
      if (s.icon && !ICONS.has(s.icon)) at(`section ${si + 1}: unknown icon ${s.icon}`)
      s.blocks.forEach((b, bi) => checkBlock(b, (m) => at(`section ${si + 1} block ${bi + 1}: ${m}`)))
    })
    lesson.quiz.forEach((q, qi) => checkQuestion(q, (m) => at(`quiz ${qi + 1}: ${m}`)))
  }
  if (content.boss.length < 10) errs.push(`boss has ${content.boss.length} questions (want 10–12)`)
  content.boss.forEach((q, qi) => checkQuestion(q, (m) => errs.push(`boss ${qi + 1}: ${m}`)))
  return errs
}

function checkBlock(b: Block, err: (m: string) => void) {
  if (b.type === 'check') checkQuestion(b.question, err)
  if (b.type === 'elements') for (const s of b.symbols) if (!BY_SYMBOL[s]) err(`unknown element ${s}`)
  if (b.type === 'diagram' && !DIAGRAMS.has(b.id)) err(`unknown diagram ${b.id}`)
  if (b.type === 'table') b.rows.forEach((r, i) => r.length !== b.headers.length && err(`table row ${i + 1} has ${r.length} cells, headers ${b.headers.length}`))
  if (b.type === 'example' && b.steps.length === 0) err('example without steps')
  if (b.type === 'molecule') for (const m of b.molecules) if (!MOLS.has(m)) err(`unknown molecule ${m}`)
  if (b.type === 'iconlist' || b.type === 'process')
    for (const it of b.type === 'iconlist' ? b.items : b.steps) if (!ICONS.has(it.icon)) err(`unknown icon ${it.icon}`)
  if (b.type === 'compare') for (const c of b.columns) if (c.icon && !ICONS.has(c.icon)) err(`unknown icon ${c.icon}`)
  if (b.type === 'particles')
    for (const box of b.boxes) for (const it of box.items) if (!speciesOk(it.species)) err(`unknown species ${it.species}`)
  if (b.type === 'reaction') {
    const e = checkEquation(b.equation)
    if (e) err(e)
  }
  for (const t of texts(b)) checkMarkup(t, err)
}

function checkQuestion(q: Question, err: (m: string) => void) {
  if (!q.q.trim()) err('empty question')
  if (!q.explain) err('missing explain')
  switch (q.kind) {
    case 'choice':
      if (q.options.length < 2) err('choice needs options')
      if (q.answer < 0 || q.answer >= q.options.length) err('choice answer out of range')
      break
    case 'multi':
      if (!q.answers.length || q.answers.some((a) => a < 0 || a >= q.options.length)) err('multi answers out of range')
      break
    case 'text':
      if (!q.accept.length) err('text needs accept')
      break
    case 'order':
      if (q.items.length < 3) err('order needs 3+ items')
      break
    case 'match':
      if (q.pairs.length < 3) err('match needs 3+ pairs')
      break
    case 'number':
      if (!Number.isFinite(q.answer)) err('number answer not finite')
      break
  }
  checkMarkup(q.q, err)
}

function texts(b: Block): string[] {
  switch (b.type) {
    case 'p':
    case 'h':
      return [b.text]
    case 'list':
      return b.items
    case 'callout':
      return [b.text, b.title ?? '']
    case 'formula':
      return [b.text]
    case 'example':
      return [b.problem, b.answer, ...b.steps]
    default:
      return []
  }
}

function checkMarkup(t: string, err: (m: string) => void) {
  const dollars = (t.match(/\$/g) ?? []).length
  if (dollars % 2) err(`unbalanced $ in "${t.slice(0, 60)}"`)
  const bold = (t.match(/\*\*/g) ?? []).length
  if (bold % 2) err(`unbalanced ** in "${t.slice(0, 60)}"`)
}

function speciesOk(sp: string) {
  if (MOLS.has(sp) || BY_SYMBOL[sp]) return true
  try {
    parseFormula(sp)
    return true
  } catch {
    return false
  }
}

/** Equation must parse and balance: "2H2 + O2 -> 2H2O". Returns an error or null. */
export function checkEquation(eq: string): string | null {
  const parts = eq.split(/->|<=>|→|⇌/)
  if (parts.length !== 2) return `equation needs one arrow: ${eq}`
  const side = (t: string) => {
    const tot: Record<string, number> = {}
    for (const raw of t.split(' + ')) {
      const m = raw.trim().match(/^(\d*)\s*(.+)$/)
      if (!m) throw new Error(raw)
      const k = m[1] ? Number(m[1]) : 1
      const formula = m[2].replace(/\((s|l|g|aq)\)$/, '')
      for (const [el, n] of Object.entries(parseFormula(MOLS.has(formula) ? formula : formula))) tot[el] = (tot[el] ?? 0) + n * k
    }
    return tot
  }
  try {
    const a = side(parts[0])
    const b = side(parts[1])
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const k of keys) if ((a[k] ?? 0) !== (b[k] ?? 0)) return `equation not balanced for ${k}: ${eq}`
    return null
  } catch (e) {
    return `equation does not parse: ${eq} (${(e as Error).message})`
  }
}
