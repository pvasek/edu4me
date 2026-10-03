import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { GENES, LEVELS, QUOTA, type CrossItem } from './levels'
import {
  ALL_SAME,
  CHI_CRIT,
  allGenotypes,
  allPhenotypes,
  checkNumber,
  crossSquare,
  distribution,
  fmtFrac,
  frac,
  gameteOptions,
  gametes,
  genesOf,
  generationsTo,
  hwAnswer,
  hwChi,
  linkageAnswer,
  linkedGametes,
  makeRound,
  makeTask,
  parseGenotype,
  pickItems,
  playedLevel,
  ratioText,
  selectOnce,
  selectionPath,
  solveAsk,
  wrongCells,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const cross = (genes: CrossItem['genes'], parents: [string, string], noun?: string): CrossItem => ({
  type: 'cross',
  id: 'x',
  group: 'x',
  genes,
  parents,
  noun,
  intro: '',
  asks: [{ kind: 'ratio' }],
})
const ratio = (c: CrossItem) => ratioText(distribution(c).phenotypes.map((p) => p.count))
const prob = (c: CrossItem, phen: string) => solveAsk(c, { kind: 'prob', phen }).answer

describe('punnett genetics', () => {
  it('parses genotypes into canonical pairs', () => {
    expect(parseGenotype('aA', genesOf(['hrach-barva']))).toEqual([['A', 'a']])
    expect(parseGenotype('iI^{A}Dd', genesOf(['abo', 'rh']))).toEqual([
      ['I^{A}', 'i'],
      ['D', 'd'],
    ])
    expect(parseGenotype('X^{d}Y', genesOf(['barvoslepost']))).toEqual([['X^{d}', 'Y']])
    expect(() => parseGenotype('A', genesOf(['hrach-barva']))).toThrow()
    expect(() => parseGenotype('AaC', genesOf(['hrach-barva']))).toThrow()
  })

  it('makes gametes with one allele of each gene', () => {
    const g = (s: string, ids: Parameters<typeof genesOf>[0]) => gametes(parseGenotype(s, genesOf(ids))).map((x) => x.join(''))
    expect(g('Aa', ['hrach-barva'])).toEqual(['A', 'a'])
    expect(g('AA', ['hrach-barva'])).toEqual(['A'])
    expect(g('AaBb', ['hrach-barva', 'hrach-tvar'])).toEqual(['AB', 'Ab', 'aB', 'ab'])
    expect(g('AaBB', ['hrach-barva', 'hrach-tvar'])).toEqual(['AB', 'aB'])
    expect(g('X^{D}X^{d}', ['barvoslepost'])).toEqual(['X^{D}', 'X^{d}'])
    expect(g('X^{D}Y', ['barvoslepost'])).toEqual(['X^{D}', 'Y'])
  })

  it('gives Mendel’s ratios', () => {
    expect(ratio(cross(['hrach-barva'], ['Aa', 'Aa']))).toBe('3 : 1')
    expect(ratio(cross(['hrach-barva'], ['Aa', 'aa']))).toBe('1 : 1')
    expect(ratio(cross(['hrach-barva'], ['AA', 'aa']))).toBe(ALL_SAME)
    expect(ratio(cross(['nocenka'], ['Aa', 'Aa']))).toBe('1 : 2 : 1')
    expect(distribution(cross(['hrach-barva'], ['Aa', 'Aa'])).genotypes).toEqual([
      { geno: 'AA', count: 1 },
      { geno: 'Aa', count: 2 },
      { geno: 'aa', count: 1 },
    ])
    const di = cross(['hrach-barva', 'hrach-tvar'], ['AaBb', 'AaBb'], 'semena')
    expect(ratio(di)).toBe('9 : 3 : 3 : 1')
    expect(distribution(di).phenotypes.map((p) => p.phen)).toEqual([
      'žlutá, kulatá semena',
      'žlutá, svraštělá semena',
      'zelená, kulatá semena',
      'zelená, svraštělá semena',
    ])
    expect(ratio(cross(['hrach-barva', 'hrach-tvar'], ['AaBb', 'aabb']))).toBe('1 : 1 : 1 : 1')
    expect(ratio(cross(['hrach-barva', 'hrach-tvar'], ['AaBb', 'Aabb']))).toBe('3 : 3 : 1 : 1')
    expect(prob(di, 'zelená, svraštělá semena')).toEqual(frac(1, 16))
    expect(prob(di, 'žlutá, kulatá semena')).toEqual(frac(9, 16))
  })

  it('handles codominant blood groups and Rh', () => {
    const c = cross(['abo'], ['I^{A}i', 'I^{B}i'])
    expect(prob(c, 'krevní skupina 0')).toEqual(frac(1, 4))
    expect(prob(c, 'krevní skupina AB')).toEqual(frac(1, 4))
    expect(prob(cross(['abo'], ['I^{A}I^{B}', 'ii']), 'krevní skupina 0')).toEqual(frac(0, 1))
    expect(prob(cross(['abo'], ['I^{A}I^{B}', 'I^{A}i']), 'krevní skupina A')).toEqual(frac(1, 2))
    const rh = cross(['abo', 'rh'], ['I^{A}iDd', 'I^{B}idd'])
    expect(crossSquare(rh).cells.flat()).toHaveLength(8)
    expect(prob(rh, 'krevní skupina 0, Rh−')).toEqual(frac(1, 8))
    expect(prob(cross(['abo', 'rh'], ['I^{A}I^{B}Dd', 'iiDd']), 'krevní skupina A, Rh+')).toEqual(frac(3, 8))
  })

  it('handles X-linked traits, also among sons or daughters only', () => {
    const c = cross(['barvoslepost'], ['X^{D}X^{d}', 'X^{D}Y'])
    expect(prob(c, 'barvoslepý syn')).toEqual(frac(1, 4))
    expect(solveAsk(c, { kind: 'cond', among: 'son', phen: 'barvoslepý syn', text: '' }).answer).toEqual(frac(1, 2))
    expect(prob(c, 'barvoslepá dcera')).toEqual(frac(0, 1))
    const m = cross(['octomilka-oci'], ['X^{w}X^{w}', 'X^{W}Y'])
    expect(solveAsk(m, { kind: 'cond', among: 'son', phen: 'sameček s bílýma očima', text: '' }).answer).toEqual(frac(1, 1))
    expect(solveAsk(m, { kind: 'cond', among: 'daughter', phen: 'samička s bílýma očima', text: '' }).answer).toEqual(frac(0, 1))
    const carrier = cross(['barvoslepost'], ['X^{D}X^{D}', 'X^{d}Y'])
    expect(solveAsk(carrier, { kind: 'cond', among: 'daughter', geno: 'X^{D}X^{d}', text: '' }).answer).toEqual(frac(1, 1))
    expect(prob(cross(['pohlavi'], ['XX', 'XY']), 'chlapec')).toEqual(frac(1, 2))
  })

  it('formats fractions', () => {
    expect(fmtFrac(frac(3, 16))).toBe('3/16 (18,75 %)')
    expect(fmtFrac(frac(0, 4))).toBe('0 %')
    expect(fmtFrac(frac(4, 4))).toBe('100 %')
  })

  it('lists gametes and the tempting wrong ones', () => {
    const o = gameteOptions({ genes: ['hrach-barva', 'hrach-tvar'], genotype: 'AaBB' })
    expect(o.correct).toEqual(['AB', 'aB'])
    expect(o.wrong).toContain('AaB')
    expect(o.wrong).toContain('Ab')
    const x = gameteOptions({ genes: ['hemofilie'], genotype: 'X^{H}X^{h}' })
    expect(x.correct).toEqual(['X^{H}', 'X^{h}'])
    expect(x.wrong).toContain('Y')
  })

  it('computes linkage', () => {
    expect(linkedGametes(17, 'cis')).toEqual({ AB: 41.5, ab: 41.5, Ab: 8.5, aB: 8.5 })
    expect(linkageAnswer({ r: 17, phase: 'cis', target: 'recomb' })).toBe(17)
    expect(linkageAnswer({ r: 20, phase: 'trans', target: 'AB' })).toBe(10)
    expect(linkageAnswer({ r: 10, phase: 'cis', target: 'AB' })).toBe(45)
  })

  it('computes Hardy–Weinberg and selection', () => {
    expect(hwAnswer({ given: { oneIn: 2500 }, ask: 'carriers' }).value).toBeCloseTo(3.92, 6)
    expect(hwAnswer({ given: { oneIn: 10000 }, ask: 'carriers' }).value).toBeCloseTo(1.98, 6)
    expect(hwAnswer({ given: { recPct: 16 }, ask: 'p' }).value).toBeCloseTo(0.6, 9)
    expect(hwAnswer({ given: { counts: [360, 480, 160] }, ask: 'p' }).value).toBeCloseTo(0.6, 9)
    expect(hwAnswer({ given: { q: 0.3 }, ask: 'dom' }).value).toBeCloseTo(91, 9)
    expect(hwChi([490, 420, 90]).chi).toBeCloseTo(0, 9)
    expect(selectOnce(0.5, 0)).toBeCloseTo(1 / 3, 9)
    expect(selectOnce(0.4, 0.5)).toBeCloseTo(0.32 / 0.92, 9)
    expect(selectOnce(0.3, 1)).toBeCloseTo(0.3, 9)
    // complete selection: q_n = q0 / (1 + n q0)
    const path = selectionPath(0.5, 0, 8)
    expect(path[8]).toBeCloseTo(0.1, 9)
    expect(generationsTo(0.5, 0.1)).toBeCloseTo(8, 9)
  })

  it('checks typed numbers with tolerance', () => {
    const q = { kind: 'number' as const, prompt: '', value: 1 / 3, tol: 0.01, unit: '' as const, hint: '' }
    expect(checkNumber('0,33', q).kind).toBe('ok')
    expect(checkNumber('0.35', q).kind).toBe('wrong')
    expect(checkNumber('33 %', q).kind).toBe('ok')
    expect(checkNumber('x', q).kind).toBe('invalid')
  })
})

describe('punnett level data', () => {
  it('has a set for every level in the registry, and the quotas fill a round of 8', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(Object.keys(GAME_BY_ID.punnett.courses.biologie!).map(Number).sort())
    for (const [lv, q] of Object.entries(QUOTA)) {
      expect(Object.values(q).reduce((a, b) => a + b, 0), `L${lv}`).toBe(8)
      for (const [group, n] of Object.entries(q)) expect(LEVELS[Number(lv)].filter((x) => x.group === group).length, `L${lv} ${group}`).toBeGreaterThanOrEqual(n + 1)
    }
  })

  it('gene tables list every genotype once, in canonical order', () => {
    for (const [id, g] of Object.entries(GENES)) {
      const keys = Object.keys(g.phen)
      const expected: string[] = []
      g.alleles.forEach((a, i) => g.alleles.slice(i).forEach((b) => expected.push(a + b)))
      // YY does not exist
      expect(keys, id).toEqual(expected.filter((k) => k !== 'YY'))
    }
  })

  it('item ids are unique and every item makes a valid task', () => {
    const all = Object.values(LEVELS).flat()
    expect(new Set(all.map((x) => x.id)).size).toBe(all.length)
    for (const [lv, set] of Object.entries(LEVELS)) {
      for (const item of set) {
        for (let seed = 1; seed <= 12; seed++) {
          const t = makeTask(item, Number(lv), rng(seed))
          expect(t.intro.length, item.id).toBeGreaterThan(10)
          expect(t.explain.length, item.id).toBeGreaterThan(10)
          if (t.q.kind === 'choice') {
            expect(t.q.options.length, item.id).toBe(item.type === 'hweq' ? 2 : 4)
            expect(new Set(t.q.options).size, item.id).toBe(t.q.options.length)
            expect(t.q.answer, item.id).toBeGreaterThanOrEqual(0)
            expect(t.q.answer, item.id).toBeLessThan(t.q.options.length)
          }
          if (t.q.kind === 'multi') {
            expect(new Set(t.q.options).size, item.id).toBe(t.q.options.length)
            expect(t.q.answer.length, item.id).toBeGreaterThan(0)
            expect(t.q.answer.length, item.id).toBeLessThan(t.q.options.length)
          }
          if (t.q.kind === 'number') expect(Number.isFinite(t.q.value), item.id).toBe(true)
          if (t.fill) {
            const f = t.fill
            expect(f.cells.length).toBe(f.rows.length)
            const blanks = f.cells.flatMap((row, r) => row.filter((_, c) => f.blanks[r][c]))
            expect(blanks.length, item.id).toBeGreaterThan(0)
            expect(blanks.length, item.id).toBeLessThanOrEqual(4)
            for (const g of blanks) expect(f.palette, `${item.id} ${g}`).toContain(g)
            expect(f.palette.length).toBeLessThanOrEqual(6)
            expect(wrongCells(f, f.cells)).toEqual([])
          }
        }
      }
    }
  })

  it('every ask of a cross names a real phenotype or genotype', () => {
    for (const item of Object.values(LEVELS).flat()) {
      if (item.type !== 'cross') continue
      const phens = allPhenotypes(item)
      const genos = allGenotypes(item.genes)
      for (const p of item.parents) expect(() => parseGenotype(p, genesOf(item.genes)), item.id).not.toThrow()
      for (const ask of item.asks) {
        if ('phen' in ask && ask.phen) expect(phens, `${item.id} ${ask.phen}`).toContain(ask.phen)
        if ('geno' in ask && ask.geno) expect(genos, `${item.id} ${ask.geno}`).toContain(ask.geno)
      }
    }
  })

  it('the equilibrium tasks are far from the 5 % threshold, generation counts are whole numbers', () => {
    for (const item of Object.values(LEVELS).flat()) {
      if (item.type === 'hweq') {
        const { chi } = hwChi(item.counts)
        expect(chi < 1 || chi > 10, item.id).toBe(true)
        expect(CHI_CRIT).toBe(3.84)
      }
      if (item.type === 'sel' && item.ask !== 'q1') {
        expect(item.w).toBe(0)
        const n = generationsTo(item.q0, item.ask.target)
        expect(Math.abs(n - Math.round(n)), item.id).toBeLessThan(1e-9)
      }
    }
  })
})

describe('punnett rounds', () => {
  it('picks the level from the level id, mix otherwise', () => {
    expect(playedLevel('l7')).toBe(7)
    expect(playedLevel('l10')).toBe(10)
    expect(playedLevel('l8')).toBeUndefined()
    expect(playedLevel(undefined)).toBeUndefined()
  })

  it('deals 8 distinct tasks per level following the quota', () => {
    for (const lv of Object.keys(LEVELS).map(Number)) {
      for (let seed = 1; seed < 20; seed++) {
        const items = pickItems(lv, rng(seed))
        expect(items).toHaveLength(8)
        expect(new Set(items.map((x) => x.id)).size).toBe(8)
        for (const [g, n] of Object.entries(QUOTA[lv])) expect(items.filter((x) => x.group === g)).toHaveLength(n)
        const round = makeRound(lv, rng(seed))
        expect(round.every((t) => t.level === lv)).toBe(true)
      }
    }
  })

  it('mixes all levels without a level', () => {
    const seen = new Set<number>()
    for (let seed = 1; seed < 10; seed++) {
      const r = makeRound(undefined, rng(seed))
      expect(r).toHaveLength(8)
      expect(new Set(r.map((t) => t.id)).size).toBe(8)
      r.forEach((t) => seen.add(t.level))
    }
    expect([...seen].sort((a, b) => a - b)).toEqual([7, 10, 12])
  })
})
