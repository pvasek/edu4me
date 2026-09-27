import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { chargeTally, glyphFor, parseEquation, tally } from './species'
import { ParticleScene } from './ParticleScene'
import { ReactionView } from './ReactionView'

describe('species glyphs', () => {
  it('uses library molecules', () => {
    expect(glyphFor('H2O').atoms.map((a) => a.el).sort()).toEqual(['H', 'H', 'O'])
    expect(glyphFor('C2H5OH').atoms).toHaveLength(9)
    expect(glyphFor('glucose').atoms).toHaveLength(24)
  })

  it.each([
    ['Na^+', 'Na', 1],
    ['Cl^-', 'Cl', -1],
    ['Mg^2+', 'Mg', 2],
    ['Fe^{3+}', 'Fe', 3],
    ['Cl-', 'Cl', -1],
    ['Na', 'Na', 0],
  ])('ion / atom %s → one %s sphere with charge %i', (sp, el, q) => {
    const g = glyphFor(sp)
    expect(g.atoms.map((a) => a.el)).toEqual([el])
    expect(g.charge).toBe(q)
  })

  it.each([
    ['SO4^2-', 5, -2],
    ['NH4+', 5, 1],
    ['NH4^+', 5, 1],
    ['OH-', 2, -1],
    ['OH^-', 2, -1],
    ['NO3^-', 4, -1],
    ['PO4^3-', 5, -3],
  ])('polyatomic ion %s has %i atoms and charge %i', (sp, n, q) => {
    const g = glyphFor(sp)
    expect(g.atoms).toHaveLength(n)
    expect(g.charge).toBe(q)
  })

  it('builds clusters for unknown formulas', () => {
    expect(glyphFor('NaCl').atoms.map((a) => a.el).sort()).toEqual(['Cl', 'Na'])
    expect(glyphFor('CaCO3').atoms).toHaveLength(5)
    expect(glyphFor('Ca(OH)2').atoms).toHaveLength(5)
    expect(glyphFor('C8H18').atoms).toHaveLength(26)
    expect(glyphFor('PH3').atoms).toHaveLength(4)
    expect(glyphFor('Al2O3').atoms).toHaveLength(5)
    expect(glyphFor('CuSO4·5H2O').atoms.length).toBe(21)
  })
})

describe('equations', () => {
  it('parses coefficients, states and arrows', () => {
    const e = parseEquation('2H2(g) + O2(g) -> 2H2O(l)')!
    expect(e.reversible).toBe(false)
    expect(e.left.map((t) => [t.coef, t.species, t.state])).toEqual([
      [2, 'H2', 'g'],
      [1, 'O2', 'g'],
    ])
    expect(e.right[0]).toMatchObject({ coef: 2, species: 'H2O', state: 'l', text: '2H2O(l)' })
    expect(parseEquation('N2 + 3H2 <=> 2NH3')!.reversible).toBe(true)
  })

  it('tallies atoms and charges', () => {
    const e = parseEquation('2H2 + O2 -> 2H2O')!
    expect(tally(e)).toEqual([
      { el: 'H', left: 4, right: 4 },
      { el: 'O', left: 2, right: 2 },
    ])
    expect(chargeTally(e)).toBeNull()
    const n = parseEquation('H3O^+ + OH^- -> 2H2O')!
    expect(tally(n)).toEqual([
      { el: 'H', left: 4, right: 4 },
      { el: 'O', left: 2, right: 2 },
    ])
    expect(chargeTally(n)).toEqual({ left: 0, right: 0 })
    const bad = parseEquation('H2 + O2 -> H2O')!
    expect(tally(bad).find((r) => r.el === 'O')).toEqual({ el: 'O', left: 2, right: 1 })
  })
})

describe('renderers', () => {
  it('render on the server without crashing', () => {
    const html = renderToString(
      createElement(ParticleScene, {
        arrows: true,
        boxes: [
          { label: 'led', items: [{ species: 'H2O', count: 12 }], state: 'solid' },
          { label: 'voda', items: [{ species: 'H2O', count: 14 }], state: 'liquid' },
          { label: 'pára', items: [{ species: 'H2O', count: 8 }], state: 'gas' },
          { label: 'solanka', items: [{ species: 'Na^+', count: 5 }, { species: 'Cl^-', count: 5 }], state: 'solution' },
        ],
      }),
    )
    expect(html).toContain('pt-jar')
    expect(html).toContain('pt-q')
    const rx = renderToString(createElement(ReactionView, { equation: 'CH4 + 2O2 -> CO2 + 2H2O' }))
    expect(rx).toContain('pt-ledger')
    expect(rx).toContain('✓')
  })
})
