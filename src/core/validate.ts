import type { Block, Lesson, LevelContent, LevelOutline, Question } from './types'
import { BY_SYMBOL } from '../courses/chemie/data/elements'
import { CHEM_ICONS, FIGURES, MOLECULES, SPECIMENS } from '../illustrations/catalog'
import { parseFormula } from '../courses/chemie/data/formula'
import { EXPERIMENTS } from '../lesson/experiments/catalog'
import { COUNTRY_NAMES, CZ_REGION_NAMES } from '../geo/codes'

const ICONS = new Set<string>(CHEM_ICONS)
const SPECS = new Set<string>(SPECIMENS)
const VISUAL = new Set<string>(['flipcards', 'diagram', 'molecule', 'particles', 'reaction', 'process', 'iconlist', 'compare', 'elements', 'structure', 'graph', 'circuit', 'forces', 'rays', 'wave', 'experiment', 'punnett', 'pedigree', 'map', 'climate', 'pyramid'])
const CIRCUIT_KINDS = new Set<string>(['resistor', 'lamp', 'switch', 'switch-open', 'ammeter', 'voltmeter', 'ohmmeter', 'diode', 'diode-reverse', 'led', 'capacitor', 'coil', 'motor', 'fuse', 'breaker', 'rheostat', 'ldr', 'thermistor', 'bell', 'wire'])
const MOLS = new Set<string>(MOLECULES)
const MAP_VIEWS = new Set<string>(['world', 'europe', 'central-europe', 'czechia', 'africa', 'asia', 'middle-east', 'north-america', 'latin-america', 'oceania', 'arctic', 'antarctica'])
const MAP_LAYERS = new Set<string>(['graticule', 'graticule-labels', 'tropics', 'rivers', 'lakes', 'plates', 'regions', 'timezones', 'names'])

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
      if (!s.icon) at(`section ${si + 1} "${s.title}" has no icon`)
      else if (!ICONS.has(s.icon)) at(`section ${si + 1}: unknown icon ${s.icon}`)
      if (!s.blocks.some((b) => VISUAL.has(b.type))) at(`section ${si + 1} "${s.title}" has no visual block`)
      s.blocks.forEach((b, bi) => checkBlock(b, (m) => at(`section ${si + 1} block ${bi + 1}: ${m}`)))
    })
    lesson.quiz.forEach((q, qi) => checkQuestion(q, (m) => at(`quiz ${qi + 1}: ${m}`)))
    for (const t of visibleStrings(lesson)) {
      const m = LESSON_ID.exec(t)
      if (m) at(`lesson id "${m[0]}" shown to the learner – refer to the lesson by its title: "${t.slice(0, 60)}"`)
    }
  }
  for (const t of visibleStrings(content.boss)) {
    const m = LESSON_ID.exec(t)
    if (m) errs.push(`boss: lesson id "${m[0]}" shown to the learner – use the lesson title`)
  }
  if (content.boss.length < 10) errs.push(`boss has ${content.boss.length} questions (want 10–12)`)
  content.boss.forEach((q, qi) => checkQuestion(q, (m) => errs.push(`boss ${qi + 1}: ${m}`)))
  return errs
}

function checkBlock(b: Block, err: (m: string) => void) {
  if (b.type === 'check') checkQuestion(b.question, err)
  if (b.type === 'elements') for (const s of b.symbols) if (!BY_SYMBOL[s]) err(`unknown element ${s}`)
  if (b.type === 'diagram' && !DIAGRAMS.has(b.id)) err(`unknown diagram ${b.id}`)
  if (b.type === 'experiment' && !(EXPERIMENTS as readonly string[]).includes(b.id)) err(`unknown experiment ${b.id}`)
  if (b.type === 'table') b.rows.forEach((r, i) => r.length !== b.headers.length && err(`table row ${i + 1} has ${r.length} cells, headers ${b.headers.length}`))
  if (b.type === 'example' && b.steps.length === 0) err('example without steps')
  if (b.type === 'molecule') for (const m of b.molecules) if (!MOLS.has(m)) err(`unknown molecule ${m}`)
  if (b.type === 'iconlist' || b.type === 'process')
    for (const it of b.type === 'iconlist' ? b.items : b.steps) if (!ICONS.has(it.icon)) err(`unknown icon ${it.icon}`)
  if (b.type === 'flipcards')
    for (const c of b.cards) {
      if (!c.art && !c.icon) err(`flip card "${c.title}" needs art or icon`)
      if (c.art && !SPECS.has(c.art)) err(`unknown specimen ${c.art}`)
      if (c.icon && !ICONS.has(c.icon)) err(`unknown icon ${c.icon}`)
    }
  if (b.type === 'compare') for (const c of b.columns) if (c.icon && !ICONS.has(c.icon)) err(`unknown icon ${c.icon}`)
  if (b.type === 'particles')
    for (const box of b.boxes) for (const it of box.items) if (!speciesOk(it.species)) err(`unknown species ${it.species}`)
  if (b.type === 'reaction') {
    const e = checkEquation(b.equation)
    if (e) err(e)
  }
  if (b.type === 'graph') checkGraph(b, err)
  if (b.type === 'punnett') {
    const [p1, p2] = b.parents.map(alleles)
    if (!p1.length || !p2.length || p1.length % 2 || p2.length % 2) err(`punnett: genotypes must be pairs of alleles, got ${b.parents.join(' × ')}`)
    else if (p1.length !== p2.length) err('punnett: both parents need the same number of genes')
    else if (p1.length > 4) err('punnett: at most two genes (a 4 × 4 square)')
  }
  if (b.type === 'pedigree') {
    const ids = new Set(b.people.map((p) => p.id))
    if (b.people.length < 3 || b.people.length > 18) err(`pedigree: ${b.people.length} people (want 3–18)`)
    for (const p of b.people) for (const par of p.parents ?? []) if (!ids.has(par)) err(`pedigree: ${p.id} has unknown parent ${par}`)
  }
  if (b.type === 'map') checkMap(b, err)
  if (b.type === 'climate') {
    if (b.places.length < 1 || b.places.length > 2) err(`climate: ${b.places.length} places (want 1–2)`)
    for (const pl of b.places) {
      if (pl.temp.length !== 12 || pl.precip.length !== 12) err(`climate ${pl.name}: need 12 monthly values of temp and precip`)
      if (pl.temp.some((t) => !Number.isFinite(t) || t < -60 || t > 45)) err(`climate ${pl.name}: temperature outside −60…45 °C`)
      if (pl.precip.some((r) => !Number.isFinite(r) || r < 0 || r > 2000)) err(`climate ${pl.name}: precipitation outside 0…2000 mm`)
    }
  }
  if (b.type === 'pyramid') {
    if (b.pyramids.length < 1 || b.pyramids.length > 2) err(`pyramid: ${b.pyramids.length} pyramids (want 1–2)`)
    for (const py of b.pyramids) {
      const n = py.male.length
      if (n !== py.female.length) err(`pyramid ${py.label}: male and female need the same number of age groups`)
      if (n < 5 || n > 21) err(`pyramid ${py.label}: ${n} age groups (want 5–21)`)
      if ([...py.male, ...py.female].some((v) => !Number.isFinite(v) || v < 0)) err(`pyramid ${py.label}: shares must be ≥ 0`)
      const sum = [...py.male, ...py.female].reduce((a, v) => a + v, 0)
      if (Math.abs(sum - 100) > 2) err(`pyramid ${py.label}: shares add up to ${sum.toFixed(1)} %, want 100 %`)
    }
  }
  if (b.type === 'circuit') {
    if (!b.parts.length) err('circuit without parts')
    for (const part of b.parts) {
      const comps = 'parallel' in part ? part.parallel.flat() : [part]
      if ('parallel' in part && part.parallel.length < 2) err('parallel group needs 2+ branches')
      for (const c of comps) if (!CIRCUIT_KINDS.has(c.kind)) err(`unknown circuit component ${c.kind}`)
    }
  }
  if (b.type === 'forces') {
    if (!b.forces.length) err('force diagram without forces')
    for (const f of b.forces) if (!Number.isFinite(f.angle) || !(f.size > 0)) err(`bad force arrow ${f.label}`)
    if (b.surface === 'incline' && !(b.angle && b.angle > 0 && b.angle < 90)) err('incline needs an angle between 0 and 90°')
  }
  if (b.type === 'rays') {
    if (!(b.object > 0)) err('rays: object distance must be > 0')
    if (b.element !== 'plane-mirror' && !(b.focal > 0)) err('rays: focal length must be > 0')
    if (b.element !== 'plane-mirror' && Math.abs(b.object - b.focal) < 1e-9 && (b.element === 'convex-lens' || b.element === 'concave-mirror'))
      err('rays: object at the focus has no image – pick another distance')
  }
  if (b.type === 'wave') {
    if (!b.waves.length) err('wave block without waves')
    for (const w of b.waves) if (!(w.amplitude > 0) || !(w.wavelength > 0)) err('wave needs amplitude > 0 and wavelength > 0')
  }
  for (const t of texts(b)) checkMarkup(t, err)
}

function checkGraph(b: Extract<Block, { type: 'graph' }>, err: (m: string) => void) {
  for (const [name, a] of [['x', b.x] as const, ['y', b.y] as const]) {
    if (!(a.max > a.min)) err(`graph ${name} axis: max must be > min`)
    if (a.step !== undefined && !(a.step > 0 && (a.max - a.min) / a.step <= 40)) err(`graph ${name} axis: step too small`)
  }
  if (!b.series.length) err('graph without series')
  b.series.forEach((sr, i) => {
    if (sr.points.length < 2 && sr.style !== 'dots') err(`graph series ${i + 1} needs 2+ points`)
    for (const [x, y] of sr.points) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) err(`graph series ${i + 1}: non-numeric point`)
      else if (x < b.x.min - 1e-9 || x > b.x.max + 1e-9 || y < b.y.min - 1e-9 || y > b.y.max + 1e-9)
        err(`graph series ${i + 1}: point [${x}, ${y}] outside the axes`)
    }
  })
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

/** Blocks that are not part of the teaching thread (they need a sentence of prose between them). */
const THREAD = new Set<string>(['p', 'h', 'callout', 'check', 'game'])

/**
 * Teaching-thread rules (spec/content-guidelines.md, "Teaching thread"):
 * every section opens with a paragraph, and two content blocks never follow
 * each other without a paragraph between them (callouts don't count as bridges).
 */
export function checkFlow(lesson: Lesson): string[] {
  const errors: string[] = []
  lesson.sections.forEach((s, si) => {
    const where = `${lesson.id} §${si + 1} „${s.title}“`
    if (s.blocks[0]?.type !== 'p') errors.push(`${where}: section must open with a paragraph (p)`)
    let lastContent: string | null = null
    s.blocks.forEach((b, bi) => {
      if (b.type === 'p') lastContent = null
      else if (!THREAD.has(b.type)) {
        if (lastContent) errors.push(`${where}: ${lastContent} → ${b.type} (block ${bi + 1}) needs a bridging paragraph between them`)
        lastContent = b.type
      }
    })
  })
  return errors
}

/** A lesson id such as "f6-5" or "l2-3"; learners never see ids, so text must name lessons by title. */
const LESSON_ID = /(?<![\w'/-])[a-z]\d{1,2}-\d{1,2}(?![\w'-])/

/** Every string a learner can read in a lesson (skips the `id` / `gameId` fields). */
function visibleStrings(v: unknown, key = ''): string[] {
  if (typeof v === 'string') return key === 'id' || key === 'gameId' ? [] : [v]
  if (Array.isArray(v)) return v.flatMap((x) => visibleStrings(x))
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => visibleStrings(x, k))
  return []
}

function checkMap(b: Extract<Block, { type: 'map' }>, err: (m: string) => void) {
  if (!MAP_VIEWS.has(b.view)) err(`map: unknown view ${b.view}`)
  for (const l of b.layers ?? []) {
    if (!MAP_LAYERS.has(l)) err(`map: unknown layer ${l}`)
    if (l === 'regions' && b.view !== 'czechia') err('map: the regions layer exists only on the czechia view')
  }
  for (const h of b.highlight ?? [])
    for (const c of h.codes)
      if (!(c in COUNTRY_NAMES) && !(b.view === 'czechia' && c in CZ_REGION_NAMES)) err(`map: unknown code ${c} (see src/geo/codes.ts)`)
  const ll = (lat: number, lon: number, what: string) => {
    if (!(Math.abs(lat) <= 90) || !(Math.abs(lon) <= 180)) err(`map: ${what} at lat ${lat}, lon ${lon} is not a valid position`)
  }
  for (const p of b.points ?? []) ll(p.lat, p.lon, `point ${p.label ?? ''}`)
  for (const r of b.routes ?? []) {
    if (r.points.length < 2) err('map: a route needs 2+ points')
    for (const p of r.points) ll(p.lat, p.lon, `route ${r.label ?? ''}`)
  }
  for (const band of b.bands ?? []) if (!(band.from < band.to) || Math.abs(band.from) > 90 || Math.abs(band.to) > 90) err(`map: band ${band.label ?? ''} needs −90 ≤ from < to ≤ 90`)
  if (!b.highlight?.length && !b.points?.length && !b.routes?.length && !b.bands?.length && !b.layers?.length) err('map: show something (highlight, points, routes, bands or layers)')
}

/** Alleles of a genotype string: "AaBb" → [A, a, B, b]; "X^{A}Y" → [X^{A}, Y]; "I^{A}i" → [I^{A}, i]. */
export function alleles(genotype: string): string[] {
  return genotype.replace(/\s+/g, '').match(/[A-Za-z](?:\^\{[^}]+\}|\^[A-Za-z0-9+-])?/g) ?? []
}
