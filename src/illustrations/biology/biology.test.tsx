import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { PedigreePerson } from '../../core/types'
import { alleles } from '../../core/validate'
import { BiologyBlock } from '.'
import { allelesOf, crossOf, czPercent, gametesOf, genotypeLine, phenotypeLine } from './genetics'
import { pedigreeLayout } from './pedigree'

const svgOf = (html: string) => {
  expect(html).toContain('<svg')
  expect(html).toContain('role="img"')
  const label = /aria-label="([^"]+)"/.exec(html)?.[1] ?? ''
  expect(label.length).toBeGreaterThan(30)
  expect(html).not.toMatch(/NaN|undefined|Infinity/)
  return label
}
const g = (gs: string[][]) => gs.map((x) => x.join(''))

describe('genetics', () => {
  it('splits genotypes like the validator', () => {
    for (const t of ['Aa', 'AaBb', 'X^{A}X^{a}', 'X^{A}Y', 'I^{A}i', 'I^{A}I^{B}']) expect(allelesOf(t)).toEqual(alleles(t))
    expect(allelesOf('X^AX^a')).toEqual(['X^{A}', 'X^{a}'])
  })
  it('makes gametes by independent assortment', () => {
    expect(g(gametesOf('Aa'))).toEqual(['A', 'a'])
    expect(g(gametesOf('AaBb'))).toEqual(['AB', 'Ab', 'aB', 'ab'])
    expect(g(gametesOf('X^{A}Y'))).toEqual(['X^{A}', 'Y'])
    expect(g(gametesOf('AABb'))).toEqual(['AB', 'Ab', 'AB', 'Ab'])
  })
  it('monohybrid: 1 : 2 : 1 and 3 : 1, dominant allele first', () => {
    const c = crossOf(['Aa', 'Aa'], { A: 'fialový květ', a: 'bílý květ' })!
    expect(c.cells.map((r) => r.map((x) => x.genotype))).toEqual([['AA', 'Aa'], ['Aa', 'aa']])
    expect(genotypeLine(c)).toBe('1 AA : 2 Aa : 1 aa')
    expect(phenotypeLine(c)).toBe('3 : 1 – 75 % fialový květ, 25 % bílý květ')
  })
  it('dihybrid: 9 : 3 : 3 : 1', () => {
    const c = crossOf(['AaBb', 'AaBb'], { A: 'žlutá', a: 'zelená', B: 'kulatá', b: 'svraštělá' })!
    expect(c.cells.flat()).toHaveLength(16)
    expect(c.phenotypeRatio).toEqual([9, 3, 3, 1])
    expect(c.phenotypes.map((p) => p.label)).toEqual(['žlutá, kulatá', 'žlutá, svraštělá', 'zelená, kulatá', 'zelená, svraštělá'])
    expect(c.genotypeRatio).toEqual([1, 2, 1, 2, 4, 2, 1, 2, 1])
    expect(c.cells[1][2].genotype).toBe('AaBb') // Ab × aB
    expect(crossOf(['AaBb', 'AaBb'])!.phenotypes.map((p) => p.label)).toEqual(['A_B_', 'A_bb', 'aaB_', 'aabb'])
  })
  it('blood groups: codominance of I^{A} and I^{B}', () => {
    const c = crossOf(['I^{A}i', 'I^{B}i'])!
    expect(c.cells[0][0].genotype).toBe('I^{A}I^{B}')
    expect(c.phenotypes.map((p) => p.label)).toEqual(['skupina A', 'skupina B', 'skupina AB', 'skupina 0'])
    expect(c.phenotypeRatio).toEqual([1, 1, 1, 1])
    const ab = crossOf(['I^{A}I^{B}', 'ii'])!
    expect(ab.phenotypes.map((p) => `${czPercent(p.share)} ${p.label}`)).toEqual(['50 % skupina A', '50 % skupina B'])
  })
  it('X-linked: X before Y, males show their X allele', () => {
    const c = crossOf(['X^{A}X^{a}', 'X^{A}Y'], { A: 'zdravé vidění', a: 'barvoslepost' })!
    expect(c.cells.flat().map((x) => x.genotype)).toEqual(['X^{A}X^{A}', 'X^{A}Y', 'X^{A}X^{a}', 'X^{a}Y'])
    expect(phenotypeLine(c)).toBe('2 : 1 : 1 – 50 % dívka, zdravé vidění; 25 % chlapec, zdravé vidění; 25 % chlapec, barvoslepost')
    expect(crossOf(['XX', 'XY'])!.phenotypes.map((p) => p.label)).toEqual(['dívka', 'chlapec'])
  })
  it('test cross: 1 : 1', () => {
    const c = crossOf(['Aa', 'aa'])!
    expect(genotypeLine(c)).toBe('1 Aa : 1 aa')
    expect(phenotypeLine(c)).toBe('1 : 1 – 50 % A_, 50 % aa')
  })
  it('incomplete dominance via genotype traits', () => {
    const c = crossOf(['C^{R}C^{W}', 'C^{R}C^{W}'], { 'C^{R}C^{R}': 'červený', 'C^{R}C^{W}': 'růžový', 'C^{W}C^{W}': 'bílý' })!
    expect(phenotypeLine(c)).toBe('1 : 2 : 1 – 25 % červený, 50 % růžový, 25 % bílý')
  })
  it('refuses crosses that do not pair up', () => {
    expect(crossOf(['AaBb', 'Aa'])).toBeNull()
    expect(crossOf(['Aab', 'Aa'])).toBeNull()
  })
})

const family: PedigreePerson[] = [
  { id: 'gf', sex: 'm', label: 'dědeček' },
  { id: 'gm', sex: 'f', carrier: true, label: 'babička' },
  { id: 'son', sex: 'm', affected: true, parents: ['gm', 'gf'] },
  { id: 'dau', sex: 'f', carrier: true, parents: ['gm', 'gf'] },
  { id: 'dau2', sex: 'f', parents: ['gm', 'gf'] },
  { id: 'wife', sex: 'f' },
  { id: 'hus', sex: 'm' },
  { id: 'k1', sex: 'f', parents: ['wife', 'son'] },
  { id: 'k2', sex: 'm', parents: ['wife', 'son'] },
  { id: 'k3', sex: 'm', affected: true, parents: ['dau', 'hus'] },
  { id: 'k4', sex: 'f', parents: ['dau', 'hus'] },
  { id: 'k5', sex: 'm', parents: ['dau', 'hus'] },
]

describe('pedigree layout', () => {
  const lay = pedigreeLayout(family)
  const at = Object.fromEntries(lay.nodes.map((n) => [n.id, n]))
  it('puts founders in generation I and married-in partners beside their spouse', () => {
    expect(lay.gens).toBe(3)
    expect([at.gf.gen, at.gm.gen, at.son.gen, at.wife.gen, at.hus.gen, at.k3.gen]).toEqual([0, 0, 1, 1, 1, 2])
    expect(at.gf.x).toBeLessThan(at.gm.x) // male left in the founders' couple
    expect(Math.abs(at.wife.x - at.son.x)).toBe(1)
    expect(Math.abs(at.hus.x - at.dau.x)).toBe(1)
  })
  it('never overlaps and keeps families together', () => {
    for (let gen = 0; gen < lay.gens; gen++) {
      const xs = lay.nodes.filter((n) => n.gen === gen).map((n) => n.x).sort((a, b) => a - b)
      for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(1)
    }
    // the son's children are all left of the daughter's children
    expect(Math.max(at.k1.x, at.k2.x)).toBeLessThan(Math.min(at.k3.x, at.k4.x, at.k5.x))
  })
  it('centres every couple over its children', () => {
    for (const c of lay.couples) {
      const xs = c.children.map((id) => at[id].x)
      expect(c.mid).toBeGreaterThanOrEqual(Math.min(...xs) - 0.5)
      expect(c.mid).toBeLessThanOrEqual(Math.max(...xs) + 0.5)
    }
    const top = lay.couples.find((c) => c.father === 'gf')!
    expect(top.mid).toBeCloseTo((at.son.x + at.dau2.x) / 2)
  })
})

describe('BiologyBlock', () => {
  it('draws a Punnett square with ratios', () => {
    const html = renderToStaticMarkup(<BiologyBlock block={{ type: 'punnett', parents: ['Aa', 'Aa'], traits: { A: 'fialový květ', a: 'bílý květ' } }} />)
    const label = svgOf(html)
    expect(label).toContain('křížení Aa × Aa')
    expect(label).toContain('75 % fialový květ')
    expect(html).toContain('fenotyp')
    expect(html.match(/class="bio-tint"/g)?.length).toBe(4 + 2) // cells + key swatches
  })
  it('draws a 4 × 4 square with superscripts', () => {
    const html = renderToStaticMarkup(<BiologyBlock block={{ type: 'punnett', parents: ['AaX^{B}X^{b}', 'AaX^{B}Y'] }} />)
    svgOf(html)
    expect(html).toMatch(/<tspan[^>]*font-size="72%"[^>]*>B<\/tspan>/)
    expect(html).toContain('♀')
    expect(html).toContain('♂')
  })
  it('draws a pedigree with symbols, numerals and labels', () => {
    const html = renderToStaticMarkup(<BiologyBlock block={{ type: 'pedigree', people: family }} />)
    const label = svgOf(html)
    expect(label).toContain('Rodokmen: 3 generace, 12 osob (6 mužů, 6 žen)')
    expect(label).toContain('Postižení: muž (II. generace)')
    expect(label).toContain('Přenašeči: babička (I. generace)')
    expect(html).toContain('>III<')
    expect(html).toContain('dědeček')
    expect(html.match(/class="bio-dot"/g)?.length).toBe(2 + 1) // carriers + key
  })
})
