import { describe, expect, it } from 'vitest'
import { parseFormula } from '../../courses/chemie/data/formula'
import { ORGANIC, ORG_CAT_LABEL, type OrganicItem } from './organic'

type Counts = Record<string, number>

/** Atoms of a condensed formula: drop bonds and the ring note, then parse. */
const atomsOf = (f: string): Counts => parseFormula(f.replace(/ \(kruh\)$/, '').replace(/[-=≡]/g, ''))

const ROOT: Record<string, number> = { meth: 1, eth: 2, prop: 3, but: 4, pent: 5, hex: 6, hept: 7, okt: 8, non: 9, dek: 10 }
const ROOTS = Object.keys(ROOT).join('|')
const MULT: Record<string, number> = { '': 1, di: 2, tri: 3, tetra: 4 }
const SUB: Record<string, { C: number; X?: string; N?: number; O?: number; dou?: number }> = {
  methyl: { C: 1 },
  ethyl: { C: 2 },
  propyl: { C: 3 },
  chlor: { C: 0, X: 'Cl' },
  brom: { C: 0, X: 'Br' },
  nitro: { C: 0, N: 1, O: 2, dou: 1 },
}

/**
 * Molecular formula from a Czech name, by counting: carbons from the stems,
 * then H = 2C + 2 + N − X − 2·(rings + π bonds). Independent of the stored formula,
 * so a wrong chain length, suffix or substituent in the name is caught.
 */
function molecularFromName(name: string): Counts {
  let C = 0
  let N = 0
  let O = 0
  let dou = 0
  const X: Counts = {}
  const locs = (s: string) => s.split(',').map(Number)

  let m: RegExpMatchArray | null
  if ((m = name.match(new RegExp(`^kyselina (${ROOTS})an(di)?ová$`)))) {
    const k = m[2] ? 2 : 1
    C = ROOT[m[1]]
    O = 2 * k
    dou = k
  } else if (name === 'kyselina benzoová') {
    C = 7
    O = 2
    dou = 5
  } else if ((m = name.match(new RegExp(`^(${ROOTS})yl-(${ROOTS})anoát$`)))) {
    C = ROOT[m[1]] + ROOT[m[2]]
    O = 2
    dou = 1
  } else if ((m = name.match(new RegExp(`^(di|tri)?(${ROOTS}|fen)ylamin$`)))) {
    const n = MULT[m[1] ?? '']
    C = m[2] === 'fen' ? 6 : n * ROOT[m[2]]
    dou = m[2] === 'fen' ? 4 : 0
    N = 1
  } else if (name === 'fenol') {
    C = 6
    O = 1
    dou = 4
  } else if (name === 'benzaldehyd') {
    C = 7
    O = 1
    dou = 5
  } else {
    // substituent prefixes: 2-methyl, 2,2-dimethyl, 3-ethyl-2-methyl, chlor, nitro …
    let rest = name
    const subRe = /^((\d+(?:,\d+)*)-)?(di|tri|tetra)?(methyl|ethyl|propyl|chlor|brom|nitro)-?/
    while ((m = rest.match(subRe)) && !new RegExp(`^(${ROOTS})(an|en|yn|a-)`).test(rest)) {
      const count = MULT[m[3] ?? '']
      if (m[2]) expect(locs(m[2]).length, `${name}: lokanty u ${m[4]}`).toBe(count)
      const s = SUB[m[4]]
      C += count * s.C
      N += count * (s.N ?? 0)
      O += count * (s.O ?? 0)
      dou += count * (s.dou ?? 0)
      if (s.X) X[s.X] = (X[s.X] ?? 0) + count
      rest = rest.slice(m[0].length)
    }
    if (rest === 'benzen') {
      C += 6
      dou += 4
    } else {
      m = rest.match(
        new RegExp(`^(cyklo)?(${ROOTS})(an|en|yn|-(\\d+)-en|-(\\d+)-yn|a-(\\d+,\\d+)-dien)(ol|al|on|-(\\d+(?:,\\d+)*)-(ol|diol|triol|on))?$`),
      )
      if (!m) throw new Error(`Neznámý název ${name}`)
      const n = ROOT[m[2]]
      C += n
      if (m[1]) dou += 1
      const sat = m[3]
      if (sat === 'en' || m[4]) dou += 1
      if (sat === 'yn' || m[5]) dou += 2
      if (m[6]) dou += 2
      for (const l of [m[4], m[5], ...(m[6] ? locs(m[6]) : [])].filter(Boolean).map(Number)) expect(l).toBeLessThan(n)
      const suffix = m[7] ? (m[9] ?? m[7]) : ''
      const sufLocs = m[8] ? locs(m[8]) : []
      for (const l of sufLocs) expect(l).toBeLessThanOrEqual(n)
      if (suffix === 'ol' || suffix === 'diol' || suffix === 'triol') {
        const k = { ol: 1, diol: 2, triol: 3 }[suffix]
        if (m[8]) expect(sufLocs.length).toBe(k)
        O += k
      } else if (suffix === 'al' || suffix === 'on') {
        O += 1
        dou += 1
      }
    }
  }
  const halogens = Object.values(X).reduce((s, x) => s + x, 0)
  const H = 2 * C + 2 + N - halogens - 2 * dou
  const out: Counts = { C, H }
  if (N) out.N = N
  if (O) out.O = O
  Object.assign(out, X)
  return out
}

/** Main-chain groups separated by top-level bonds, reversed (the same molecule written backwards). */
function reversed(f: string): string {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of f) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (depth === 0 && '-=≡'.includes(ch)) {
      parts.push(cur, ch)
      cur = ''
    } else cur += ch
  }
  parts.push(cur)
  // directional groups read backwards: -COO- becomes -OOC-, -OH becomes HO- …
  const FLIP: Record<string, string> = { COO: 'OOC', OOC: 'COO', COOH: 'HOOC', HOOC: 'COOH', CHO: 'OHC', OH: 'HO', HO: 'OH', NH2: 'H2N' }
  return parts
    .reverse()
    .map((p) => FLIP[p] ?? p)
    .join('')
}

const byName = (it: OrganicItem) => [it.name, it] as const

describe('organic nomenclature items (level 8)', () => {
  it('has at least 40 items with unique names and formulas, all categories used', () => {
    expect(ORGANIC.length).toBeGreaterThanOrEqual(40)
    expect(new Set(ORGANIC.map((i) => i.name)).size).toBe(ORGANIC.length)
    expect(new Set(ORGANIC.map((i) => i.formula)).size).toBe(ORGANIC.length)
    for (const cat of Object.keys(ORG_CAT_LABEL)) expect(ORGANIC.filter((i) => i.cat === cat).length, cat).toBeGreaterThanOrEqual(3)
  })

  it.each(ORGANIC.map(byName))('%s: formula parses to the listed molecular formula', (_, it) => {
    expect(atomsOf(it.formula)).toEqual(parseFormula(it.molecular))
  })

  it.each(ORGANIC.map(byName))('%s: the name gives the same molecular formula', (_, it) => {
    expect(molecularFromName(it.name)).toEqual(parseFormula(it.molecular))
  })

  it.each(ORGANIC.map(byName))('%s: three distinct wrong names and formulas', (_, it) => {
    expect(it.wrongNames.length).toBe(3)
    expect(new Set(it.wrongNames).size).toBe(3)
    expect(it.wrongNames).not.toContain(it.name)
    expect(it.wrongFormulas.length).toBe(3)
    expect(new Set(it.wrongFormulas).size).toBe(3)
    for (const w of it.wrongFormulas) {
      expect(() => atomsOf(w), w).not.toThrow()
      // not the same molecule written the same way or backwards
      expect(w).not.toBe(it.formula)
      expect(w).not.toBe(reversed(it.formula))
    }
  })

  it('a wrong formula is never the stored formula of an item with that name, and vice versa', () => {
    const formulaOf = new Map(ORGANIC.map((i) => [i.name, i.formula]))
    const nameOf = new Map(ORGANIC.flatMap((i) => [[i.formula, i.name], [reversed(i.formula), i.name]]))
    for (const it of ORGANIC) {
      for (const w of it.wrongNames) expect(formulaOf.get(w), `${it.name}: ${w}`).not.toBe(it.formula)
      for (const w of it.wrongFormulas) expect(nameOf.get(w), `${it.name}: ${w}`).not.toBe(it.name)
    }
  })

  it('the name checker catches typical mistakes', () => {
    expect(molecularFromName('2-methylbutan')).toEqual({ C: 5, H: 12 })
    expect(molecularFromName('buta-1,3-dien')).toEqual({ C: 4, H: 6 })
    expect(molecularFromName('propan-1,2,3-triol')).toEqual({ C: 3, H: 8, O: 3 })
    expect(molecularFromName('ethyl-ethanoát')).toEqual({ C: 4, H: 8, O: 2 })
    expect(molecularFromName('kyselina butanová')).not.toEqual(atomsOf('CH3-CH2-COOH'))
    expect(molecularFromName('cyklohexan')).toEqual({ C: 6, H: 12 })
    expect(molecularFromName('chlorbenzen')).toEqual({ C: 6, H: 5, Cl: 1 })
    expect(reversed('CH3-CH(CH3)-CH2-CH3')).toBe('CH3-CH2-CH(CH3)-CH3')
    expect(reversed('CH3-COO-CH2-CH3')).toBe('CH3-CH2-OOC-CH3')
  })
})
