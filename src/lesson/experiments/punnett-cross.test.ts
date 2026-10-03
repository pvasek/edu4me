import { describe, expect, it } from 'vitest'
import { GENOTYPES, combine, gametes, genotypeRatio, offspring, phenotypeRatio, punnett } from './punnett-cross.model'

describe('punnett-cross model', () => {
  it('gametes carry one allele each, zygotes are written dominant first', () => {
    expect(gametes('Aa')).toEqual(['A', 'a'])
    expect(combine('a', 'A')).toBe('Aa')
    expect(combine('a', 'a')).toBe('aa')
  })
  it('Aa × Aa gives 1 : 2 : 1 and 3 : 1 (a quarter white)', () => {
    const p = punnett('Aa', 'Aa')
    expect(p.cells).toEqual([
      ['AA', 'Aa'],
      ['Aa', 'aa'],
    ])
    expect(genotypeRatio(p.counts)).toEqual([1, 2, 1])
    expect(phenotypeRatio(p.counts)).toEqual([3, 1])
    expect(p.white).toBe(0.25)
  })
  it('test cross Aa × aa gives 1 : 1; AA × aa gives only Aa', () => {
    expect(phenotypeRatio(punnett('Aa', 'aa').counts)).toEqual([1, 1])
    expect(genotypeRatio(punnett('Aa', 'aa').counts)).toEqual([0, 1, 1])
    const p = punnett('AA', 'aa')
    expect(genotypeRatio(p.counts)).toEqual([0, 1, 0])
    expect(phenotypeRatio(p.counts)).toEqual([1, 0])
    expect(phenotypeRatio(punnett('aa', 'aa').counts)).toEqual([0, 1])
  })
  it('only Aa × Aa makes a quarter of the offspring white', () => {
    for (const m of GENOTYPES)
      for (const f of GENOTYPES) expect(punnett(m, f).white === 0.25).toBe(m === 'Aa' && f === 'Aa')
  })
  it('20 offspring in exactly the expected proportions, the same every time', () => {
    const kids = offspring('Aa', 'Aa')
    expect(kids).toHaveLength(20)
    expect(kids.filter((g) => g === 'aa')).toHaveLength(5)
    expect(kids.filter((g) => g === 'Aa')).toHaveLength(10)
    expect(offspring('Aa', 'Aa')).toEqual(kids)
    // shuffled, not sorted
    expect(kids.slice(0, 5)).not.toEqual(['AA', 'AA', 'AA', 'AA', 'AA'])
  })
})
