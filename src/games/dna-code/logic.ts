/**
 * Genetický kód – pure molecular genetics: the standard codon table, transcription,
 * translation, anticodons and point mutations. Every answer is computed here.
 */
import { levelNum } from '../types'
import { shuffle } from '../shared/util'
import { AMINO, FAMOUS, LEVELS, type TaskKind } from './levels'

export const ROUND = 10

/** Level number whose set is played; undefined = mix of all sets. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

// ---------------------------------------------------------------- the code

/** RNA bases in the order of the classic codon table. */
export const BASES = ['U', 'C', 'A', 'G'] as const
export type Base = (typeof BASES)[number]

/**
 * The standard genetic code (NCBI translation table 1) in one-letter amino-acid codes,
 * codons ordered UUU, UUC, UUA, UUG, UCU … GGG (first, second, third base in U, C, A, G order).
 */
const TABLE1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG'
const ONE_TO_THREE: Record<string, string> = {
  A: 'Ala', R: 'Arg', N: 'Asn', D: 'Asp', C: 'Cys', Q: 'Gln', E: 'Glu', G: 'Gly', H: 'His', I: 'Ile',
  L: 'Leu', K: 'Lys', M: 'Met', F: 'Phe', P: 'Pro', S: 'Ser', T: 'Thr', W: 'Trp', Y: 'Tyr', V: 'Val', '*': 'Stop',
}
export const STOP = 'Stop'

/** mRNA codon → three-letter amino acid ("Stop" for the three stop codons). */
export const CODE: Record<string, string> = {}
{
  let i = 0
  for (const a of BASES) for (const b of BASES) for (const c of BASES) CODE[a + b + c] = ONE_TO_THREE[TABLE1[i++]]
}
export const ALL_CODONS = Object.keys(CODE)
export const SENSE_CODONS = ALL_CODONS.filter((c) => CODE[c] !== STOP)
export const STOP_CODONS = ALL_CODONS.filter((c) => CODE[c] === STOP)
export const START = 'AUG'

/** "Met" -> "Met (methionin)", "Stop" -> "stop". */
export const aaLabel = (aa: string) => (aa === STOP ? 'stop (konec)' : `${aa} (${AMINO[aa]})`)

// ---------------------------------------------------------------- strands

const DNA_PAIR: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' }
const RNA_PAIR: Record<string, string> = { A: 'U', U: 'A', G: 'C', C: 'G' }
const DNA_TO_RNA: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' }

/** Template strand (written 3'→5') -> mRNA (5'→3'), base by base. */
export const transcribe = (template: string) => [...template].map((b) => DNA_TO_RNA[b]).join('')
/** Coding strand (5'→3') -> mRNA: the same sequence with U instead of T. */
export const codingToMrna = (coding: string) => coding.replace(/T/g, 'U')
/** mRNA (5'→3') -> coding strand (5'→3'). */
export const mrnaToCoding = (mrna: string) => mrna.replace(/U/g, 'T')
/** mRNA (5'→3') -> template strand written 3'→5' under it. */
export const mrnaToTemplate = (mrna: string) => [...mrnaToCoding(mrna)].map((b) => DNA_PAIR[b]).join('')
/** Anticodon of a codon, written 3'→5' so it lines up under the codon. */
export const anticodon = (codon: string) => [...codon].map((b) => RNA_PAIR[b]).join('')

export const codons = (mrna: string, from = 0) => {
  const out: string[] = []
  for (let i = from; i + 3 <= mrna.length; i += 3) out.push(mrna.slice(i, i + 3))
  return out
}

/** Amino acids from `from` in steps of three; stops at the first stop codon (not included) unless `throughStop`. */
export function translate(mrna: string, from = 0, throughStop = false): string[] {
  const out: string[] = []
  for (const c of codons(mrna, from)) {
    const aa = CODE[c]
    if (aa === STOP && !throughStop) break
    out.push(aa)
  }
  return out
}
export const peptide = (aas: string[]) => (aas.length ? aas.join('–') : '(nic)')

// ---------------------------------------------------------------- mutations

export type MutationKind = 'silent' | 'missense' | 'nonsense' | 'frameshift'
export const MUTATION_LABEL: Record<MutationKind, string> = {
  silent: 'Tichá – bílkovina se nezmění',
  missense: 'Záměna smyslu – jedna aminokyselina je jiná',
  nonsense: 'Nesmyslná – předčasný stop, bílkovina je kratší',
  frameshift: 'Posun čtecího rámce – od mutace jiné aminokyseliny',
}
export const MUTATION_KINDS: MutationKind[] = ['silent', 'missense', 'nonsense', 'frameshift']

/** Kind of a mutation from the two mRNAs (both read from their first base, which is the start codon). */
export function classify(orig: string, mut: string): MutationKind {
  if ((mut.length - orig.length) % 3 !== 0) return 'frameshift'
  const a = translate(orig)
  const b = translate(mut)
  if (b.length < a.length) return 'nonsense'
  if (a.join() === b.join()) return 'silent'
  return 'missense'
}

export interface Mutation {
  mrna: string
  /** Index of the changed base in the mutated mRNA (insertion: the new base; deletion: where it was). */
  pos: number
  type: 'sub' | 'ins' | 'del'
  from?: string
  to?: string
}

/** An open reading frame: AUG, `n` sense codons (no AUG among them), a stop codon. */
export function makeOrf(n: number, rng: () => number): string {
  const inner = SENSE_CODONS.filter((c) => c !== START)
  let s = START
  for (let i = 0; i < n; i++) s += inner[Math.floor(rng() * inner.length)]
  return s + STOP_CODONS[Math.floor(rng() * STOP_CODONS.length)]
}

/** Every single-base substitution, insertion and deletion inside codons 2…n (not the start or the stop). */
export function allMutations(orf: string): Mutation[] {
  const out: Mutation[] = []
  const last = orf.length - 3
  for (let p = 3; p < last; p++) {
    for (const b of BASES) {
      if (b !== orf[p]) out.push({ mrna: orf.slice(0, p) + b + orf.slice(p + 1), pos: p, type: 'sub', from: orf[p], to: b })
      out.push({ mrna: orf.slice(0, p) + b + orf.slice(p), pos: p, type: 'ins', to: b })
    }
    out.push({ mrna: orf.slice(0, p) + orf.slice(p + 1), pos: p, type: 'del', from: orf[p] })
  }
  return out
}

/** A random ORF with a mutation of the wanted kind (substitution for the first three, insertion/deletion for frameshift). */
export function makeMutation(kind: MutationKind, rng: () => number, codonsInside = 4): { orf: string; m: Mutation } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const orf = makeOrf(codonsInside, rng)
    const fits = allMutations(orf).filter(
      (m) =>
        (kind === 'frameshift' ? m.type !== 'sub' && translate(m.mrna).join() !== translate(orf).join() : m.type === 'sub') &&
        classify(orf, m.mrna) === kind,
    )
    // a frameshift is clearer in the middle (codon 2 or 3), so it changes several amino acids
    const pool = kind === 'frameshift' ? fits.filter((m) => m.pos < 9) : fits
    if (pool.length) return { orf, m: pool[Math.floor(rng() * pool.length)] }
  }
  throw new Error(`no ${kind} mutation found`)
}

// ---------------------------------------------------------------- tasks

export interface Strand {
  /** Label, e.g. "DNA – matricové vlákno". */
  label: string
  /** End labels left and right, e.g. ["3′", "5′"]. */
  ends: [string, string]
  seq: string
  /** Positions to highlight (mutated base). */
  mark?: number[]
  /** Group in codons from this index (for mRNA). */
  frame?: number
}

export interface Task {
  kind: TaskKind
  level: number
  /** Eyebrow. */
  title: string
  /** What to do (Md). */
  prompt: string
  /** Strands shown above the answer. */
  strands: Strand[]
  /** Typed answer (transcription): the base sequence; else options. */
  answer: string | number
  options?: string[]
  /** Codon table: show it for this task, and codons to highlight after the answer. */
  table: boolean
  highlight: string[]
  /** One line after the answer (Md). */
  explain: string
  /** Hint after a first wrong typed answer. */
  hint?: string
}

const pickOne = <T,>(arr: readonly T[], rng: () => number) => arr[Math.floor(rng() * arr.length)]

function transcribeTask(level: number, rng: () => number, coding: boolean): Task {
  const mrna = makeOrf(2, rng).slice(0, 9) // AUG + 2 codons
  // start mostly with AUG, sometimes from the middle of a gene
  const seq = rng() < 0.5 ? mrna : codons(makeOrf(3, rng)).slice(1, 4).join('')
  if (coding) {
    const dna = mrnaToCoding(seq)
    return {
      kind: 'transcribe-coding',
      level,
      title: 'Přepis (transkripce)',
      prompt: 'Tohle je **kódující** vlákno DNA. Napiš mRNA, která vznikne přepisem.',
      strands: [{ label: 'DNA – kódující vlákno', ends: ['5′', '3′'], seq: dna, frame: 0 }],
      answer: seq,
      table: false,
      highlight: [],
      explain: `mRNA má stejné pořadí bází jako kódující vlákno, jen místo T je U: ${dna} → ${seq}.`,
      hint: 'Kódující vlákno se čte stejně jako mRNA – jen T nahraď U.',
    }
  }
  const template = mrnaToTemplate(seq)
  return {
    kind: 'transcribe-template',
    level,
    title: 'Přepis (transkripce)',
    prompt: 'Tohle je **matricové** vlákno DNA (čte se 3′→5′). Napiš mRNA, která podle něj vznikne.',
    strands: [{ label: 'DNA – matricové vlákno', ends: ['3′', '5′'], seq: template, frame: 0 }],
    answer: seq,
    table: false,
    highlight: [],
    explain: `Ke každé bázi matrice se páruje komplementární: A→U, T→A, G→C, C→G. Vznikne ${seq}.`,
    hint: 'Páruj komplementárně: A–U, T–A, G–C, C–G. V RNA není T.',
  }
}

/** Codons one base away from `codon` that code for something else (the tempting wrong answers). */
const neighbours = (codon: string) =>
  [0, 1, 2].flatMap((p) => BASES.filter((b) => b !== codon[p]).map((b) => codon.slice(0, p) + b + codon.slice(p + 1)))

function aaOptions(right: string, near: string[], rng: () => number): string[] {
  const wrong = shuffle([...new Set(near.map((c) => CODE[c]))].filter((a) => a !== right), rng)
  const more = shuffle(Object.keys(AMINO).filter((a) => a !== right && !wrong.includes(a)), rng)
  return shuffle([right, ...[...wrong, ...more].slice(0, 3)], rng)
}

function codonTask(level: number, rng: () => number): Task {
  const codon = rng() < 0.15 ? pickOne(STOP_CODONS, rng) : pickOne(SENSE_CODONS, rng)
  const aa = CODE[codon]
  const opts = aaOptions(aa, neighbours(codon), rng)
  const same = ALL_CODONS.filter((c) => CODE[c] === aa)
  return {
    kind: 'codon',
    level,
    title: 'Kodon',
    prompt: `Co znamená kodon **${codon}**? Najdi ho v tabulce: 1. báze vlevo, 2. nahoře, 3. v buňce.`,
    strands: [{ label: 'mRNA', ends: ['5′', '3′'], seq: codon, frame: 0 }],
    answer: opts.indexOf(aa),
    options: opts.map(aaLabel),
    table: true,
    highlight: [codon],
    explain:
      aa === STOP
        ? `${codon} je stop kodon (${STOP_CODONS.join(', ')}) – žádná tRNA k němu nepasuje a překlad končí.`
        : `${codon} = ${aaLabel(aa)}.${same.length > 1 ? ` Kód je degenerovaný: ${aa} kódují ${same.length} kodony (${same.join(', ')}).` : ' Je to jediný kodon pro tuto aminokyselinu.'}`,
  }
}

function anticodonTask(level: number, rng: () => number): Task {
  const codon = pickOne(SENSE_CODONS, rng)
  const right = anticodon(codon)
  // the classic slip: pairing as in DNA (A–T)
  const dnaLike = [...codon].map((b) => ({ A: 'T', U: 'A', G: 'C', C: 'G' })[b]).join('')
  const reversed = [...right].reverse().join('')
  const cands = [...new Set([right, dnaLike, reversed, codon])]
  // fill up with a one-base change of the right anticodon if two of them coincide
  for (const n of shuffle(neighbours(right), rng)) {
    if (cands.length >= 4) break
    if (!cands.includes(n)) cands.push(n)
  }
  const opts = shuffle(cands.slice(0, 4), rng)
  return {
    kind: 'anticodon',
    level,
    title: 'Antikodon tRNA',
    prompt: `Který antikodon tRNA (zapsaný 3′→5′) se páruje s kodonem **${codon}**?`,
    strands: [{ label: 'mRNA', ends: ['5′', '3′'], seq: codon, frame: 0 }],
    answer: opts.indexOf(right),
    options: opts,
    table: false,
    highlight: [codon],
    explain: `Antikodon je komplementární a protisměrný: pod ${codon} (5′→3′) leží ${right} (3′→5′). tRNA nese ${aaLabel(CODE[codon])}. V RNA je U, nikdy T.`,
  }
}

function peptideOptions(right: string[], wrong: string[][], rng: () => number): { options: string[]; answer: number } {
  const r = peptide(right)
  const set = [r]
  for (const w of wrong) {
    const p = peptide(w)
    if (!set.includes(p) && set.length < 4) set.push(p)
  }
  // make sure there are four: change one amino acid to a neighbour-codon one
  const aas = Object.keys(AMINO)
  for (let k = 0; set.length < 4 && k < 50; k++) {
    const copy = [...right]
    const i = 1 + Math.floor(rng() * Math.max(1, copy.length - 1))
    copy[Math.min(i, copy.length - 1)] = pickOne(aas, rng)
    const p = peptide(copy)
    if (!set.includes(p)) set.push(p)
  }
  const options = shuffle(set, rng)
  return { options, answer: options.indexOf(r) }
}

/**
 * Typical misreadings of the table, applied to codon `i` (or every codon after the start):
 * first and second base swapped (row and column mixed up), or the codon read backwards.
 */
function misread(mrna: string, from: number, how: 'swap' | 'reverse', only?: number): string[] {
  return codons(mrna, from).map((c, k) => {
    if (k === 0 || CODE[c] === STOP || (only !== undefined && k !== only)) return CODE[c]
    const read = how === 'swap' ? c[1] + c[0] + c[2] : [...c].reverse().join('')
    return CODE[read] === STOP ? CODE[c] : CODE[read]
  }).slice(0, translate(mrna, from).length)
}

function translateTask(level: number, rng: () => number): Task {
  const mrna = makeOrf(3, rng) // AUG + 3 + stop
  const right = translate(mrna)
  const k1 = 1 + Math.floor(rng() * 3)
  const k2 = 1 + ((k1 + Math.floor(rng() * 2)) % 3)
  const o = peptideOptions(right, [misread(mrna, 0, 'swap', k1), misread(mrna, 0, 'reverse'), misread(mrna, 0, 'swap', k2), translate(mrna, 0, true).filter((a) => a !== STOP)], rng)
  return {
    kind: 'translate',
    level,
    title: 'Překlad (translace)',
    prompt: 'Přelož mRNA do bílkoviny. Čti po trojicích od 5′ konce, stop kodon už aminokyselinu nepřidá.',
    strands: [{ label: 'mRNA', ends: ['5′', '3′'], seq: mrna, frame: 0 }],
    answer: o.answer,
    options: o.options,
    table: true,
    highlight: codons(mrna),
    explain: `${codons(mrna).join(' ')} → ${peptide(right)}, poslední kodon ${mrna.slice(-3)} je stop.`,
  }
}

/** Leader of 2–5 bases without AUG and without creating AUG with the start codon. */
function leader(rng: () => number): string {
  for (;;) {
    const n = 2 + Math.floor(rng() * 4)
    let s = ''
    for (let i = 0; i < n; i++) s += pickOne(BASES, rng)
    if (!(s + START).slice(0, -1).includes('AUG') && !(s + 'AU').includes('AUG')) return s
  }
}

function translateStartTask(level: number, rng: () => number): Task {
  const lead = leader(rng)
  const orf = makeOrf(2, rng)
  const tail = pickOne(SENSE_CODONS, rng)
  const mrna = lead + orf + tail
  const start = mrna.indexOf(START)
  const right = translate(mrna, start)
  const noStart = translate(mrna, 0)
  const through = translate(mrna, start, true).filter((a) => a !== STOP)
  const swapped = misread(mrna, start, 'swap')
  const o = peptideOptions(right, [through, noStart, swapped], rng)
  return {
    kind: 'translate-start',
    level,
    title: 'Start a stop',
    prompt: 'Ribozom začíná na prvním start kodonu AUG a končí na stop kodonu. Jaká bílkovina vznikne?',
    strands: [{ label: 'mRNA', ends: ['5′', '3′'], seq: mrna }],
    answer: o.answer,
    options: o.options,
    table: true,
    highlight: codons(mrna, start).slice(0, right.length + 1),
    explain: `Start AUG je na ${start + 1}. bázi; ${codons(mrna, start)
      .slice(0, right.length + 1)
      .join(' ')} → ${peptide(right)}. Báze před startem a za stopem se nepřekládají.`,
  }
}

function describe(orf: string, m: Mutation): string {
  if (m.type === 'sub') return `záměna ${m.from} → ${m.to} na ${m.pos + 1}. bázi`
  if (m.type === 'ins') return `vložení ${m.to} na ${m.pos + 1}. místo`
  return `ztráta ${orf[m.pos]} z ${m.pos + 1}. místa`
}

function mutationTask(level: number, rng: () => number, kind: MutationKind, famous = false): Task {
  let orf: string
  let m: Mutation
  let intro = ''
  if (famous) {
    const f = pickOne(FAMOUS, rng)
    // the famous codon as the 2nd codon of a short gene
    const base = makeOrf(3, rng)
    orf = base.slice(0, 3) + f.from + base.slice(6)
    const p = [0, 1, 2].find((i) => f.from[i] !== f.to[i])!
    m = { mrna: orf.slice(0, 3) + f.to + orf.slice(6), pos: 3 + p, type: 'sub', from: f.from[p], to: f.to[p] }
    intro = `${f.intro} `
  } else ({ orf, m } = makeMutation(kind, rng))
  const real = classify(orf, m.mrna)
  const a = translate(orf)
  const b = translate(m.mrna)
  const ci = Math.floor(m.pos / 3)
  const why: Record<MutationKind, string> = {
    silent: `${codons(orf)[ci]} → ${codons(m.mrna)[ci]}: obojí kóduje ${aaLabel(a[ci])}, protože kód je degenerovaný.`,
    missense: `${codons(orf)[ci]} → ${codons(m.mrna)[ci]}: ${aaLabel(a[ci])} se mění na ${aaLabel(b[ci])}, zbytek bílkoviny zůstává.`,
    nonsense: `${codons(orf)[ci]} → ${codons(m.mrna)[ci]} je stop kodon, překlad skončí předčasně: ${peptide(b)} místo ${peptide(a)}.`,
    frameshift: `${m.type === 'ins' ? 'Vložená' : 'Chybějící'} báze posune čtení trojic: ${peptide(a)} → ${peptide(b)}.`,
  }
  const options = MUTATION_KINDS.map((k) => MUTATION_LABEL[k])
  return {
    kind: 'mutation',
    level,
    title: 'Bodová mutace',
    prompt: `${intro}Co mutace (${describe(orf, m)}) udělá s bílkovinou?`,
    strands: [
      { label: 'mRNA před mutací', ends: ['5′', '3′'], seq: orf, frame: 0, mark: m.type === 'ins' ? [] : [m.pos] },
      { label: 'mRNA po mutaci', ends: ['5′', '3′'], seq: m.mrna, frame: 0, mark: m.type === 'del' ? [] : [m.pos] },
    ],
    answer: MUTATION_KINDS.indexOf(real),
    options,
    table: true,
    highlight: [...new Set([codons(orf)[ci], codons(m.mrna)[ci]])],
    explain: why[real],
  }
}

/** One task of a kind. `famous` turns a missense task into the sickle-cell story. */
export function makeTask(kind: TaskKind, level: number, rng: () => number = Math.random, extra?: { mutation?: MutationKind; famous?: boolean }): Task {
  switch (kind) {
    case 'transcribe-template':
      return transcribeTask(level, rng, false)
    case 'transcribe-coding':
      return transcribeTask(level, rng, true)
    case 'codon':
      return codonTask(level, rng)
    case 'anticodon':
      return anticodonTask(level, rng)
    case 'translate':
      return translateTask(level, rng)
    case 'translate-start':
      return translateStartTask(level, rng)
    case 'mutation':
      return mutationTask(level, rng, extra?.mutation ?? 'missense', extra?.famous)
  }
}

/** Identity of a task for "no duplicates in a round". */
export const taskKey = (t: Task) => `${t.kind}:${t.strands.map((s) => s.seq).join('/')}`

/**
 * A round: the level's mix of task kinds in the order of levels.ts (easy kinds first),
 * mutations of different kinds (half of the rounds tell the sickle-cell story as the missense one),
 * no task twice.
 */
export function makeRound(level?: number, rng: () => number = Math.random): Task[] {
  const lv = level !== undefined && LEVELS[level] ? level : Number(Object.keys(LEVELS)[0])
  const kinds: TaskKind[] = []
  for (const [k, n] of Object.entries(LEVELS[lv]) as [TaskKind, number][]) for (let j = 0; j < n; j++) kinds.push(k)
  const famous = rng() < 0.5
  const mutKinds: MutationKind[] = famous ? ['missense', ...shuffle(MUTATION_KINDS.filter((k) => k !== 'missense'), rng)] : shuffle(MUTATION_KINDS, rng)
  const out: Task[] = []
  const seen = new Set<string>()
  let mi = 0
  for (const k of kinds) {
    const extra = k === 'mutation' ? { mutation: mutKinds[mi % mutKinds.length], famous: famous && mi === 0 } : undefined
    if (k === 'mutation') mi++
    for (let tries = 0; tries < 30; tries++) {
      const t = makeTask(k, lv, rng, extra)
      if (seen.has(taskKey(t))) continue
      seen.add(taskKey(t))
      out.push(t)
      break
    }
  }
  return out
}

export type TypedCheck = { kind: 'ok' } | { kind: 'wrong'; bad: number[] } | { kind: 'short' }

/** Compares a typed mRNA with the right one base by base. */
export function checkTyped(typed: string, right: string): TypedCheck {
  if (typed.length < right.length) return { kind: 'short' }
  const bad = [...right].map((b, i) => (typed[i] === b ? -1 : i)).filter((i) => i >= 0)
  return bad.length ? { kind: 'wrong', bad } : { kind: 'ok' }
}
