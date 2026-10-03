/**
 * Křížení – pure genetics. Gametes, offspring, phenotype ratios, probabilities,
 * linkage, Hardy–Weinberg frequencies and selection are all computed here from
 * the curated genes in levels.ts; nothing about the answers is typed by hand.
 */
import { levelNum } from '../types'
import { mixLevels, parseDecimal, shuffle } from '../shared/util'
import {
  GENES,
  LEVELS,
  QUOTA,
  type Ask,
  type CrossItem,
  type GametesItem,
  type Gene,
  type GeneId,
  type HwEqItem,
  type HwItem,
  type Item,
  type LinkageItem,
  type PoolItem,
  type SelItem,
} from './levels'

export const ROUND = 8

/** Level number whose set is played; undefined = mix of all sets. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

// ---------------------------------------------------------------- numbers

export interface Frac {
  n: number
  d: number
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))
export function frac(n: number, d: number): Frac {
  if (d <= 0 || n < 0 || n > d || !Number.isInteger(n) || !Number.isInteger(d)) throw new Error(`bad fraction ${n}/${d}`)
  const g = gcd(n, d) || 1
  return { n: n / g, d: d / g }
}
export const fracVal = (f: Frac) => f.n / f.d
const fracKey = (f: Frac) => `${f.n}/${f.d}`

/** Czech number with at most `digits` decimals and no trailing zeros: 0.375 -> "0,375", 25 -> "25". */
export function cz(x: number, digits = 2): string {
  const s = (Math.round(x * 10 ** digits) / 10 ** digits).toFixed(digits).replace(/\.?0+$/, '')
  return (s === '-0' ? '0' : s).replace('.', ',')
}
/** 0.1875 -> "18,75 %" */
export const pct = (x: number, digits = 2) => `${cz(x * 100, digits)} %`
/** 3/16 -> "3/16 (18,75 %)", 0 -> "0 %", 1 -> "100 %". */
export function fmtFrac(f: Frac): string {
  if (f.n === 0) return '0 %'
  if (f.n === f.d) return '100 %'
  return `${f.n}/${f.d} (${pct(fracVal(f))})`
}

// ---------------------------------------------------------------- genotypes

const ALLELE_RE = /[A-Za-z](?:\^\{[^}]*\})?/g

/** "I^{A}iDd" -> ["I^{A}", "i", "D", "d"] */
export function alleleTokens(s: string): string[] {
  const clean = s.replace(/\s/g, '')
  const m = clean.match(ALLELE_RE) ?? []
  if (m.join('') !== clean) throw new Error(`Neplatný zápis genotypu: ${s}`)
  return m
}

/** One locus = two alleles in canonical order. */
export type Pair = [string, string]
export type Genotype = Pair[]

const rank = (gene: Gene, allele: string) => {
  const i = gene.alleles.indexOf(allele)
  if (i < 0) throw new Error(`Alela ${allele} nepatří genu`)
  return i
}
export const sortPair = (pair: string[], gene: Gene): Pair => [...pair].sort((a, b) => rank(gene, a) - rank(gene, b)) as Pair
export const pairKey = (p: Pair) => p.join('')
export const genoKey = (g: Genotype) => g.map(pairKey).join('')

export const genesOf = (ids: readonly GeneId[]): Gene[] => ids.map((id) => GENES[id])

/** Reads "AaBb" into one canonical pair per gene; throws when the alleles do not fit the genes. */
export function parseGenotype(s: string, genes: Gene[]): Genotype {
  const loci: string[][] = genes.map(() => [])
  for (const t of alleleTokens(s)) {
    const i = genes.findIndex((g, k) => g.alleles.includes(t) && loci[k].length < 2)
    if (i < 0) throw new Error(`Alela ${t} v ${s} nepatří k žádnému genu`)
    loci[i].push(t)
  }
  if (loci.some((l) => l.length !== 2)) throw new Error(`Genotyp ${s} nemá dvě alely každého genu`)
  return loci.map((l, i) => sortPair(l, genes[i]))
}

/** Gametes: one allele of every gene, every combination once (all equally likely when genes assort independently). */
export function gametes(g: Genotype): string[][] {
  let out: string[][] = [[]]
  for (const pair of g) {
    const alleles = pair[0] === pair[1] ? [pair[0]] : [...pair]
    out = out.flatMap((pre) => alleles.map((a) => [...pre, a]))
  }
  return out
}
export const gameteKey = (g: string[]) => g.join('')

/** Zygote from two gametes. */
export const fuse = (egg: string[], sperm: string[], genes: Gene[]): Genotype => genes.map((gene, i) => sortPair([egg[i], sperm[i]], gene))

export function phenotypeOf(g: Genotype, genes: Gene[], noun?: string): string {
  const parts = g.map((pair, i) => {
    const p = genes[i].phen[pairKey(pair)]
    if (p === undefined) throw new Error(`Genotyp ${pairKey(pair)} nemá fenotyp`)
    return p
  })
  return parts.join(', ') + (noun ? ` ${noun}` : '')
}

/** Order of a genotype in a list: per gene the index of its key in `phen` (canonical order). */
const genoRank = (g: Genotype, genes: Gene[]) => g.map((pair, i) => Object.keys(genes[i].phen).indexOf(pairKey(pair)))
const cmpRank = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}
export const isSon = (g: Genotype) => g.some((p) => p.includes('Y'))

export interface Cell {
  geno: string
  phen: string
  son: boolean
}
export interface Square {
  /** ♀ gametes (rows) and ♂ gametes (columns), as written. */
  rows: string[]
  cols: string[]
  cells: Cell[][]
}

export function crossSquare(item: Pick<CrossItem, 'genes' | 'parents' | 'noun'>): Square {
  const genes = genesOf(item.genes)
  const [m, f] = item.parents.map((p) => parseGenotype(p, genes))
  const eggs = gametes(m)
  const sperm = gametes(f)
  return {
    rows: eggs.map(gameteKey),
    cols: sperm.map(gameteKey),
    cells: eggs.map((e) =>
      sperm.map((s) => {
        const g = fuse(e, s, genes)
        return { geno: genoKey(g), phen: phenotypeOf(g, genes, item.noun), son: isSon(g) }
      }),
    ),
  }
}

export interface Distribution {
  total: number
  /** Genotypes in canonical order with their number of cells. */
  genotypes: { geno: string; count: number }[]
  /** Phenotypes in order of first appearance among the sorted genotypes (dominant first). */
  phenotypes: { phen: string; count: number }[]
}

export function distribution(item: Pick<CrossItem, 'genes' | 'parents' | 'noun'>): Distribution {
  const genes = genesOf(item.genes)
  const sq = crossSquare(item)
  const flat = sq.cells.flat()
  const byGeno = new Map<string, { count: number; phen: string; rank: number[] }>()
  for (const c of flat) {
    const e = byGeno.get(c.geno)
    if (e) e.count++
    else byGeno.set(c.geno, { count: 1, phen: c.phen, rank: genoRank(parseGenotype(c.geno, genes), genes) })
  }
  const sorted = [...byGeno.entries()].sort((a, b) => cmpRank(a[1].rank, b[1].rank))
  const phen = new Map<string, number>()
  for (const [, v] of sorted) phen.set(v.phen, (phen.get(v.phen) ?? 0) + v.count)
  return {
    total: flat.length,
    genotypes: sorted.map(([geno, v]) => ({ geno, count: v.count })),
    phenotypes: [...phen.entries()].map(([p, count]) => ({ phen: p, count })),
  }
}

export const ALL_SAME = 'všichni stejní'
/** [6, 2] -> "3 : 1"; a single class -> "všichni stejní". */
export function ratioText(counts: number[]): string {
  if (counts.length === 1) return ALL_SAME
  const g = counts.reduce((a, b) => gcd(a, b))
  return counts.map((c) => c / g).join(' : ')
}

/** Every phenotype the genes of a cross can show (for checking that an ask names a real one). */
export function allPhenotypes(item: Pick<CrossItem, 'genes' | 'noun'>): string[] {
  const genes = genesOf(item.genes)
  let combos: string[][] = [[]]
  for (const g of genes) combos = combos.flatMap((pre) => [...new Set(Object.values(g.phen))].map((p) => [...pre, p]))
  return combos.map((c) => c.join(', ') + (item.noun ? ` ${item.noun}` : ''))
}

/** Every genotype of the genes, canonical, in canonical order (Y twice is impossible and skipped). */
export function allGenotypes(geneIds: readonly GeneId[]): string[] {
  const genes = genesOf(geneIds)
  let combos: string[][] = [[]]
  for (const g of genes) combos = combos.flatMap((pre) => Object.keys(g.phen).map((k) => [...pre, k]))
  return combos.map((c) => c.join(''))
}

export interface AskResult {
  prompt: string
  answer: Frac | string
  explain: string
}

const countLine = (d: Distribution) => d.phenotypes.map((p) => `${p.count}× ${p.phen}`).join('; ')

/** Czech "z" / "ze" before a number ("ze 4", "z 8"). */
export const zOf = (n: number) => `${/^(2|3|4|6|7|1[2-47])$/.test(String(n)) || /^(2|3|4|6|7)\d\d$/.test(String(n)) ? 'ze' : 'z'} ${n}`
const nCells = (x: number) => `${x} ${x === 1 ? 'políčko' : x >= 2 && x <= 4 ? 'políčka' : 'políček'}`
/** "1 ze 4 políček", "3 z 8 políček" */
const kOf = (k: number, T: number) => `${k} ${zOf(T)} políček`
/** 1000 -> "1 000" */
export const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')

/** Answer and one-line explanation of an ask about a cross. */
export function solveAsk(item: CrossItem, ask: Ask): AskResult {
  const d = distribution(item)
  const cells = crossSquare(item).cells.flat()
  const T = d.total
  switch (ask.kind) {
    case 'ratio': {
      const r = ratioText(d.phenotypes.map((p) => p.count))
      return {
        prompt: 'V jakém poměru budou fenotypy potomků? (dominantní fenotyp první)',
        answer: r,
        explain: `Ve čtverci ${T >= 2 && T <= 4 ? 'jsou' : 'je'} ${nCells(T)}: ${countLine(d)} → ${r === ALL_SAME ? 'všichni potomci mají stejný fenotyp' : r}.`,
      }
    }
    case 'prob': {
      const k = cells.filter((c) => c.phen === ask.phen).length
      const f = frac(k, T)
      return {
        prompt: ask.text ?? `Jaká je pravděpodobnost fenotypu „${ask.phen}“?`,
        answer: f,
        explain:
          k === 0
            ? `„${ask.phen}“ není v žádném políčku čtverce, takže pravděpodobnost je 0.`
            : `„${ask.phen}“: ${kOf(k, T)} → ${fmtFrac(f)}.`,
      }
    }
    case 'geno': {
      const k = cells.filter((c) => c.geno === ask.geno).length
      const f = frac(k, T)
      return {
        prompt: ask.text,
        answer: f,
        explain: `Genotyp ${ask.geno}: ${kOf(k, T)} → ${fmtFrac(f)}.`,
      }
    }
    case 'cond': {
      const among = cells.filter((c) => (ask.among === 'son' ? c.son : !c.son))
      const k = among.filter((c) => (ask.phen ? c.phen === ask.phen : c.geno === ask.geno)).length
      const f = frac(k, among.length)
      const who = ask.among === 'son' ? 'políčka se Y (synové)' : 'políčka XX (dcery)'
      return {
        prompt: ask.text,
        answer: f,
        explain: `Počítají se jen ${who}: ${kOf(k, among.length)} → ${fmtFrac(f)}. Mezi všemi dětmi by to bylo ${fmtFrac(frac(k, T))}.`,
      }
    }
  }
}

// ---------------------------------------------------------------- linkage

/** Gamete frequencies (in %) of a dihybrid with linked genes A and B, r = % recombination. */
export function linkedGametes(r: number, phase: 'cis' | 'trans'): Record<'AB' | 'Ab' | 'aB' | 'ab', number> {
  const par = (100 - r) / 2
  const rec = r / 2
  return phase === 'cis' ? { AB: par, ab: par, Ab: rec, aB: rec } : { Ab: par, aB: par, AB: rec, ab: rec }
}

/** % of test-cross offspring in the asked class (offspring phenotypes copy the dihybrid's gametes). */
export function linkageAnswer(item: Pick<LinkageItem, 'r' | 'phase' | 'target'>): number {
  const g = linkedGametes(item.r, item.phase)
  if (item.target === 'recomb') return item.phase === 'cis' ? g.Ab + g.aB : g.AB + g.ab
  return g[item.target]
}

// ---------------------------------------------------------------- populations

/** p and q from what a Hardy–Weinberg task gives. */
export function hwFreqs(given: HwItem['given']): { p: number; q: number } {
  let q: number
  if ('oneIn' in given) q = Math.sqrt(1 / given.oneIn)
  else if ('recPct' in given) q = Math.sqrt(given.recPct / 100)
  else if ('q' in given) q = given.q
  else {
    const [AA, Aa, aa] = given.counts
    q = (2 * aa + Aa) / (2 * (AA + Aa + aa))
  }
  return { p: 1 - q, q }
}

/** Chi-square of observed genotype counts against Hardy–Weinberg expectations (p from the counts). */
export function hwChi(counts: [number, number, number]): { p: number; q: number; expected: [number, number, number]; chi: number } {
  const N = counts[0] + counts[1] + counts[2]
  const { p, q } = hwFreqs({ counts })
  const expected: [number, number, number] = [p * p * N, 2 * p * q * N, q * q * N]
  const chi = counts.reduce((s, o, i) => s + (o - expected[i]) ** 2 / expected[i], 0)
  return { p, q, expected, chi }
}
/** Critical value of chi-square for 1 degree of freedom at 5 %. */
export const CHI_CRIT = 3.84

/** q after one generation of selection against aa with fitness w (AA and Aa: 1). */
export function selectOnce(q: number, w: number): number {
  const p = 1 - q
  return (p * q + w * q * q) / (1 - (1 - w) * q * q)
}
/** q over generations 0..n. */
export function selectionPath(q0: number, w: number, n: number): number[] {
  const out = [q0]
  for (let i = 0; i < n; i++) out.push(selectOnce(out[out.length - 1], w))
  return out
}
/** Generations of complete selection (w = 0) until q falls from q0 to qt: n = 1/qt − 1/q0. */
export const generationsTo = (q0: number, qt: number) => 1 / qt - 1 / q0

// ---------------------------------------------------------------- tasks

export interface FillSpec {
  rowLabel: string
  colLabel: string
  rows: string[]
  cols: string[]
  /** Under the gamete: its frequency (gene pool squares). */
  rowSub?: string[]
  colSub?: string[]
  /** Relative widths/heights of the rows and columns (gene pool squares). */
  weights?: number[]
  cells: string[][]
  blanks: boolean[][]
  /** Genotypes offered for the blank cells. */
  palette: string[]
  /** Phenotype of every cell (crosses), to tint the finished square. */
  phen?: string[][]
}

export type Question =
  | { kind: 'choice'; prompt: string; options: string[]; answer: number }
  | { kind: 'multi'; prompt: string; options: string[]; answer: number[] }
  | { kind: 'number'; prompt: string; value: number; tol: number; unit: '%' | '' | 'gen'; hint: string }

export interface Task {
  id: string
  level: number
  /** Eyebrow, e.g. "Jeden gen". */
  title: string
  /** Context (Md). */
  intro: string
  /** "♀ Aa × ♂ aa" (Md), when two parents are crossed. */
  cross?: string
  fill?: FillSpec
  q: Question
  /** One line shown after the answer (Md). */
  explain: string
  /** q over generations, for the selection chart. */
  path?: number[]
}

/** 3–4 answer options around a fraction: traps first, then other plausible values; sorted ascending. */
export function fracOptions(answer: Frac, denoms: number[], traps: Frac[], rng: () => number): { options: string[]; answer: number } {
  const pool = new Map<string, Frac>()
  const add = (f: Frac) => pool.set(fracKey(f), f)
  for (const d of [...denoms, 4]) for (let k = 0; k <= d; k++) add(frac(k, d))
  pool.delete(fracKey(answer))
  const trapKeys = new Set(traps.map(fracKey).filter((k) => k !== fracKey(answer) && pool.has(k)))
  const rest = shuffle(
    [...pool.values()].filter((f) => !trapKeys.has(fracKey(f))),
    rng,
  ).sort((a, b) => Math.abs(fracVal(a) - fracVal(answer)) - Math.abs(fracVal(b) - fracVal(answer)))
  // the trap(s), then a random pick of the nearer half of the rest
  const near = shuffle(rest.slice(0, Math.max(4, Math.ceil(rest.length / 2))), rng)
  const chosen = [...[...trapKeys].map((k) => pool.get(k)!), ...near].slice(0, 3)
  const all = [answer, ...chosen].sort((a, b) => fracVal(a) - fracVal(b))
  return { options: all.map(fmtFrac), answer: all.findIndex((f) => fracKey(f) === fracKey(answer)) }
}

const RATIOS_1 = [ALL_SAME, '1 : 1', '3 : 1', '1 : 2 : 1', '1 : 1 : 1 : 1']
const RATIOS_2 = ['9 : 3 : 3 : 1', '1 : 1 : 1 : 1', '3 : 3 : 1 : 1', '3 : 1', '1 : 2 : 1', ALL_SAME]

function ratioOptions(answer: string, loci: number, rng: () => number) {
  const domain = loci === 1 ? RATIOS_1 : RATIOS_2
  const others = shuffle(
    domain.filter((r) => r !== answer),
    rng,
  ).slice(0, 3)
  const options = shuffle([answer, ...others], rng)
  return { options, answer: options.indexOf(answer) }
}

/** Genotypes offered for the blank cells: the right ones plus other genotypes of the same genes (6 chips at most, canonical order). */
function palette(item: CrossItem, blanksGeno: string[], rng: () => number, max = 6): string[] {
  const all = allGenotypes(item.genes)
  const need = new Set(blanksGeno)
  const extra = shuffle(
    all.filter((g) => !need.has(g)),
    rng,
  ).slice(0, Math.max(0, max - need.size))
  const chosen = new Set([...need, ...extra])
  return all.filter((g) => chosen.has(g))
}

function pickBlanks(rows: number, cols: number, rng: () => number, max = 4): boolean[][] {
  const n = rows * cols
  if (n <= max) return Array.from({ length: rows }, () => Array(cols).fill(true))
  const idx = new Set(shuffle([...Array(n).keys()], rng).slice(0, max))
  return Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => idx.has(r * cols + c)))
}

const parentLine = (item: CrossItem) => `♀ ${item.parents[0]} × ♂ ${item.parents[1]}`

function crossTask(item: CrossItem, level: number, rng: () => number): Task {
  const sq = crossSquare(item)
  const blanks = pickBlanks(sq.rows.length, sq.cols.length, rng)
  const blankGenos = sq.cells.flatMap((row, r) => row.filter((_, c) => blanks[r][c]).map((x) => x.geno))
  const ask = item.asks[Math.floor(rng() * item.asks.length)]
  const res = solveAsk(item, ask)
  const T = sq.rows.length * sq.cols.length
  let q: Question
  if (typeof res.answer === 'string') {
    const o = ratioOptions(res.answer, item.genes.length, rng)
    q = { kind: 'choice', prompt: res.prompt, ...o }
  } else {
    const traps: Frac[] = [frac(res.answer.d - res.answer.n, res.answer.d)]
    let denoms = [T]
    if (ask.kind === 'cond') {
      const cells = sq.cells.flat()
      const k = cells.filter((c) => (ask.among === 'son' ? c.son : !c.son)).filter((c) => (ask.phen ? c.phen === ask.phen : c.geno === ask.geno)).length
      traps.unshift(frac(k, T))
      denoms = [T, cells.filter((c) => (ask.among === 'son' ? c.son : !c.son)).length]
    }
    q = { kind: 'choice', prompt: res.prompt, ...fracOptions(res.answer, denoms, traps, rng) }
  }
  const title =
    item.genes.length === 2 ? 'Dva geny' : item.group === 'abo' ? 'Krevní skupiny' : item.genes.some((g) => GENES[g].alleles.includes('Y')) ? 'Pohlaví a X' : 'Jeden gen'
  return {
    id: item.id,
    level,
    title,
    intro: item.intro,
    cross: parentLine(item),
    fill: {
      rowLabel: '♀',
      colLabel: '♂',
      rows: sq.rows,
      cols: sq.cols,
      cells: sq.cells.map((r) => r.map((c) => c.geno)),
      phen: sq.cells.map((r) => r.map((c) => c.phen)),
      blanks,
      palette: palette(item, blankGenos, rng),
    },
    q,
    explain: res.explain,
  }
}

/** Gametes a parent makes and the tempting wrong ones (an allele it lacks, two alleles of one gene). */
export function gameteOptions(item: Pick<GametesItem, 'genes' | 'genotype'>): { correct: string[]; wrong: string[] } {
  const genes = genesOf(item.genes)
  const g = parseGenotype(item.genotype, genes)
  const correct = gametes(g).map(gameteKey)
  // every one-allele-per-gene combination of the alleles the genes have
  let combos: string[][] = [[]]
  for (const gene of genes) combos = combos.flatMap((pre) => gene.alleles.map((a) => [...pre, a]))
  const wrongCombos = combos.map(gameteKey).filter((k) => !correct.includes(k))
  // both alleles of a heterozygous gene in one gamete (the classic mistake)
  const doubled = g.map((_, i) => g.map((p, j) => (j === i ? pairKey(p) : p[0])).join(''))
  return { correct, wrong: [...new Set([...doubled, ...wrongCombos])].filter((k) => !correct.includes(k)) }
}

function gametesTask(item: GametesItem, level: number, rng: () => number): Task {
  const { correct, wrong } = gameteOptions(item)
  const nWrong = Math.max(2, Math.min(wrong.length, 6 - correct.length))
  const doubled = wrong.filter((w) => alleleTokens(w).length > item.genes.length)
  const picked = [...doubled.slice(0, 1), ...shuffle(wrong.filter((w) => !doubled.slice(0, 1).includes(w)), rng)].slice(0, nWrong)
  const options = shuffle([...correct, ...picked], rng)
  return {
    id: item.id,
    level,
    title: 'Gamety',
    intro: item.intro,
    q: {
      kind: 'multi',
      prompt: `Které gamety tvoří jedinec ${item.genotype}? Vyber všechny.`,
      options,
      answer: options.map((o, i) => (correct.includes(o) ? i : -1)).filter((i) => i >= 0),
    },
    explain:
      item.genes.length === 1
        ? `Do gamety jde z páru jen jedna alela: ${correct.join(', ')}.`
        : `Z každého páru jde do gamety jedna alela a geny se kombinují nezávisle: ${correct.join(', ')}.`,
  }
}

function pctOptions(answer: number, cands: number[], rng: () => number, digits = 2) {
  const key = (x: number) => cz(x, digits)
  const seen = new Set([key(answer)])
  const others: number[] = []
  // the task's own traps first, then generic neighbours when traps coincide (p = q = 0,5)
  const fallback = shuffle([answer / 2, answer * 1.5, 100 - answer, 25, 50, 75, 100], rng)
  for (const c of [...shuffle(cands, rng), ...fallback]) {
    if (c < 0 || c > 100 || seen.has(key(c))) continue
    seen.add(key(c))
    others.push(c)
  }
  const all = [answer, ...others.slice(0, 3)].sort((a, b) => a - b)
  return { options: all.map((x) => `${cz(x, digits)} %`), answer: all.indexOf(answer) }
}

function linkageTask(item: LinkageItem, level: number, rng: () => number): Task {
  const a = linkageAnswer(item)
  const r = item.r
  const g = linkedGametes(r, item.phase)
  return {
    id: item.id,
    level,
    title: 'Vazba genů',
    intro: item.intro,
    q: { kind: 'choice', prompt: item.text, ...pctOptions(a, [r / 2, r, (100 - r) / 2, 100 - r, 25, 50], rng) },
    explain: `Gamety dihybrida: AB ${cz(g.AB)} %, Ab ${cz(g.Ab)} %, aB ${cz(g.aB)} %, ab ${cz(g.ab)} % – rekombinantní jsou ${item.phase === 'cis' ? 'Ab a aB' : 'AB a ab'} (celkem ${r} %). Rodič aabb dává jen ab, takže potomci kopírují tyto četnosti.`,
  }
}

function poolTask(item: PoolItem, level: number, rng: () => number): Task {
  const p = item.p
  const q = 1 - p
  const v = { AA: p * p, Aa: 2 * p * q, aa: q * q }
  const blanks = pickBlanks(2, 2, rng)
  let prompt: string
  let ans: number
  let cands: number[]
  let explain: string
  if (item.ask === 'het') {
    prompt = 'Jaká část populace bude heterozygotní (Aa)?'
    ans = v.Aa
    cands = [p * q, p * p, q * q, p, q]
    explain = `Heterozygoti Aa jsou ve dvou políčkách (alela A z vajíčka, nebo ze spermie): 2pq = 2 · ${cz(p)} · ${cz(q)} = ${cz(v.Aa, 4)}, tedy ${pct(v.Aa)}.`
  } else if (item.ask === 'rec') {
    prompt = 'Jaká část populace bude mít recesivní fenotyp (aa)?'
    ans = v.aa
    cands = [q, 2 * p * q, p * q, 2 * q]
    explain = `aa je jediné políčko: q² = ${cz(q)}² = ${cz(v.aa, 4)}, tedy ${pct(v.aa)}.`
  } else {
    prompt = 'Jaká část populace bude mít dominantní fenotyp (AA nebo Aa)?'
    ans = v.AA + v.Aa
    cands = [p, p * p, 2 * p * q, p * p + p * q]
    explain = `Dominantní fenotyp mají AA i Aa: p² + 2pq = 1 − q² = 1 − ${cz(q * q, 4)} = ${cz(ans, 4)}, tedy ${pct(ans)}.`
  }
  const o = pctOptions(ans * 100, cands.map((x) => x * 100), rng)
  return {
    id: item.id,
    level,
    title: 'Genofond',
    intro: item.intro,
    fill: {
      rowLabel: 'vajíčka',
      colLabel: 'spermie',
      rows: ['A', 'a'],
      cols: ['A', 'a'],
      rowSub: [`p = ${cz(p)}`, `q = ${cz(q)}`],
      colSub: [`p = ${cz(p)}`, `q = ${cz(q)}`],
      weights: [p, q],
      cells: [
        ['AA', 'Aa'],
        ['Aa', 'aa'],
      ],
      blanks,
      palette: ['AA', 'Aa', 'aa'],
    },
    q: { kind: 'choice', prompt, ...o },
    explain,
  }
}

const NUM_HINT = {
  p: 'Nejdřív q z q² (odmocnina), potom p = 1 − q.',
  q: 'Recesivní homozygoti aa tvoří q², takže q = √(podíl aa).',
  carriers: 'q = √(podíl nemocných), p = 1 − q, přenašeči jsou 2pq.',
  dom: 'Dominantní fenotyp mají všichni kromě aa: 1 − q².',
} as const

export function hwAnswer(item: Pick<HwItem, 'given' | 'ask'>): { value: number; unit: '%' | '' } {
  const { p, q } = hwFreqs(item.given)
  switch (item.ask) {
    case 'p':
      return { value: p, unit: '' }
    case 'q':
      return { value: q, unit: '' }
    case 'carriers':
      return { value: 2 * p * q * 100, unit: '%' }
    case 'dom':
      return { value: (1 - q * q) * 100, unit: '%' }
  }
}

function hwTask(item: HwItem, level: number): Task {
  const { p, q } = hwFreqs(item.given)
  const a = hwAnswer(item)
  const counts = 'counts' in item.given ? item.given.counts : null
  const how = counts
    ? `Všech alel je 2 · ${thousands(counts[0] + counts[1] + counts[2])} = ${thousands(2 * (counts[0] + counts[1] + counts[2]))}; alel a je 2 · ${counts[2]} + ${counts[1]} = ${thousands(2 * counts[2] + counts[1])}, takže q = ${cz(q, 3)} a p = ${cz(p, 3)}.`
    : 'q' in item.given
      ? `q = ${cz(q, 3)}, q² = ${cz(q * q, 4)}.`
      : `q = √${cz(q * q, 4)} = ${cz(q, 3)}, p = 1 − q = ${cz(p, 3)}.`
  const result =
    item.ask === 'carriers'
      ? ` Přenašeči: 2pq = ${cz(2 * p * q, 4)}, tedy asi ${cz(a.value, 2)} %.`
      : item.ask === 'dom'
        ? ` Dominantní fenotyp: 1 − q² = ${cz(a.value / 100, 4)}, tedy ${cz(a.value, 2)} %.`
        : ''
  return {
    id: item.id,
    level,
    title: 'Hardyho–Weinbergův zákon',
    intro: item.intro,
    q: {
      kind: 'number',
      prompt: a.unit === '%' ? 'Výsledek v procentech:' : 'Četnost jako desetinné číslo (0 až 1):',
      value: a.value,
      tol: numberTolerance(a.value, a.unit),
      unit: a.unit,
      hint: NUM_HINT[item.ask],
    },
    explain: how + result,
  }
}

/** Accepted deviation: frequencies ±0,01; percentages ±0,1 p. b. under 10 %, else ±0,5 p. b.; generations exact. */
export function numberTolerance(value: number, unit: '%' | '' | 'gen'): number {
  if (unit === 'gen') return 0
  if (unit === '') return 0.01
  return value < 10 ? 0.1 : 0.5
}

function hwEqTask(item: HwEqItem, level: number): Task {
  const { p, q, expected, chi } = hwChi(item.counts)
  const yes = chi < CHI_CRIT
  const options = ['Ano, je v rovnováze', 'Ne, není v rovnováze']
  return {
    id: item.id,
    level,
    title: 'Rovnováha?',
    intro: item.intro,
    q: { kind: 'choice', prompt: 'Spočítej p a očekávané počty p² N, 2pq N, q² N a porovnej je s pozorovanými.', options, answer: yes ? 0 : 1 },
    explain: `p = ${cz(p, 3)}, q = ${cz(q, 3)}; očekává se ${expected.map((e) => cz(e, 1)).join(' : ')} (AA : Aa : aa), pozorováno ${item.counts.join(' : ')}. ${
      yes ? 'Shoduje se (χ² < 3,84), populace je v rovnováze.' : `Rozdíl je velký (χ² = ${cz(chi, 1)} > 3,84), populace v rovnováze není.`
    }`,
  }
}

function selTask(item: SelItem, level: number): Task {
  if (item.ask === 'q1') {
    const q1 = selectOnce(item.q0, item.w)
    const p0 = 1 - item.q0
    const formula =
      item.w === 0
        ? `q₁ = q : (1 + q) = ${cz(item.q0)} : ${cz(1 + item.q0)} = ${cz(q1, 3)}.`
        : `q₁ = (pq + w q²) : (1 − (1 − w) q²) = (${cz(p0 * item.q0, 3)} + ${cz(item.w * item.q0 ** 2, 3)}) : ${cz(1 - (1 - item.w) * item.q0 ** 2, 3)} = ${cz(q1, 3)}.`
    return {
      id: item.id,
      level,
      title: 'Přírodní výběr',
      intro: item.intro,
      q: {
        kind: 'number',
        prompt: 'Četnost q v příští generaci (desetinné číslo):',
        value: q1,
        tol: 0.01,
        unit: '',
        hint: item.w === 0 ? 'Mezi přeživšími (AA, Aa) jsou alely a jen u Aa: q₁ = pq : (p² + 2pq) = q : (1 + q).' : 'Alely a nesou Aa (2pq, plná zdatnost) a aa (q², zdatnost w).',
      },
      explain: `${formula} Recesivní alela ubývá jen pomalu, protože se schovává v heterozygotech.`,
      path: selectionPath(item.q0, item.w, 10),
    }
  }
  const n = generationsTo(item.q0, item.ask.target)
  return {
    id: item.id,
    level,
    title: 'Přírodní výběr',
    intro: item.intro,
    q: { kind: 'number', prompt: 'Počet generací:', value: n, tol: 0, unit: 'gen', hint: 'Z rovnice vyjádři n = 1/q_{n} − 1/q_{0}.' },
    explain: `n = 1/q_{n} − 1/q_{0} = ${cz(1 / item.ask.target)} − ${cz(1 / item.q0)} = ${cz(n)} generací.`,
    path: selectionPath(item.q0, 0, Math.max(10, Math.ceil(n))),
  }
}

/** Turns a level item into a playable task (random choices use `rng`). */
export function makeTask(item: Item, level: number, rng: () => number = Math.random): Task {
  switch (item.type) {
    case 'cross':
      return crossTask(item, level, rng)
    case 'gametes':
      return gametesTask(item, level, rng)
    case 'linkage':
      return linkageTask(item, level, rng)
    case 'pool':
      return poolTask(item, level, rng)
    case 'hw':
      return hwTask(item, level)
    case 'hweq':
      return hwEqTask(item, level)
    case 'sel':
      return selTask(item, level)
  }
}

/** Items of one level for a round: the level's group quotas, in random order. */
export function pickItems(level: number, rng: () => number = Math.random): Item[] {
  const set = LEVELS[level]
  const quota = QUOTA[level]
  const out: Item[] = []
  for (const [group, n] of Object.entries(quota)) out.push(...shuffle(set.filter((x) => x.group === group), rng).slice(0, n))
  return shuffle(out, rng)
}

/** A round: 8 tasks of the level, or of all levels mixed. */
export function makeRound(level?: number, rng: () => number = Math.random): Task[] {
  if (level !== undefined && LEVELS[level]) return pickItems(level, rng).map((it) => makeTask(it, level, rng))
  return mixLevels(LEVELS, ROUND, rng, (x) => x.id).map(({ item, level: lv }) => makeTask(item, lv, rng))
}

export type NumberCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

/** Accepts "0,33", "0.33", "3,9 %", "8"; a "%" given for a frequency is converted (33 % = 0,33). */
export function checkNumber(input: string, q: Extract<Question, { kind: 'number' }>): NumberCheck {
  const hasPct = /%/.test(input)
  let value = parseDecimal(input.replace(/%/g, '').replace(/generac[eíi]?/i, ''))
  if (value === null) return { kind: 'invalid' }
  if (q.unit === '' && hasPct) value /= 100
  return Math.abs(value - q.value) <= q.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}

/** Indices of the wrong cells of a filled square. */
export function wrongCells(fill: FillSpec, answers: (string | null)[][]): [number, number][] {
  const out: [number, number][] = []
  fill.cells.forEach((row, r) =>
    row.forEach((g, c) => {
      if (fill.blanks[r][c] && answers[r][c] !== g) out.push([r, c])
    }),
  )
  return out
}

/** Same set of indices, any order. */
export const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join()
