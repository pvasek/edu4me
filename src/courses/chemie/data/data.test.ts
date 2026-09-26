import { describe, expect, it } from 'vitest'
import { ELEMENTS, BY_SYMBOL, tablePosition } from './elements'
import { electronConfig, shorthandMarkup, valenceElectrons } from './electronConfig'
import { molarMass, parseFormula } from './formula'

describe('elements', () => {
  it('has 118 elements with correct positions', () => {
    expect(ELEMENTS).toHaveLength(118)
    expect(BY_SYMBOL.Fe.group).toBe(8)
    expect(BY_SYMBOL.Hf.group).toBe(4)
    expect(BY_SYMBOL.Rn.group).toBe(18)
    expect(BY_SYMBOL.B.group).toBe(13)
    expect(BY_SYMBOL.Og.period).toBe(7)
    expect(tablePosition(BY_SYMBOL.Ce)).toEqual({ row: 9, col: 4 })
  })
})

describe('electron config', () => {
  it('handles Aufbau and exceptions', () => {
    expect(electronConfig(26).map((s) => `${s.n}${s.l}${s.e}`).join(' ')).toBe('1s2 2s2 2p6 3s2 3p6 4s2 3d6')
    expect(shorthandMarkup(24)).toBe('[Ar] 4s^{1} 3d^{5}')
    expect(shorthandMarkup(11)).toBe('[Ne] 3s^{1}')
    expect(valenceElectrons(17)).toBe(7)
  })
})

describe('formula', () => {
  it('parses groups and hydrates', () => {
    expect(parseFormula('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 })
    expect(parseFormula('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 })
    expect(parseFormula('SO4^2-')).toEqual({ S: 1, O: 4 })
    expect(molarMass('H2O')).toBeCloseTo(18.015, 2)
  })
})
