import { describe, expect, it } from 'vitest'
import { isCorrect, parseNumber } from './check'
import type { Question } from './types'

describe('isCorrect', () => {
  it('accepts Czech decimal comma within tolerance', () => {
    const q: Question = { kind: 'number', q: 'M(H2O)?', answer: 18.02, unit: 'g/mol' }
    expect(isCorrect(q, { kind: 'number', value: '18' })).toBe(true)
    expect(isCorrect(q, { kind: 'number', value: '18,02' })).toBe(true)
    expect(isCorrect(q, { kind: 'number', value: '19' })).toBe(false)
  })
  it('compares formulas case-sensitively ignoring spaces', () => {
    const q: Question = { kind: 'text', q: 'Vzorec', accept: ['H2SO4'], caseSensitive: true }
    expect(isCorrect(q, { kind: 'text', value: ' H2 SO4 ' })).toBe(true)
    expect(isCorrect(q, { kind: 'text', value: 'h2so4' })).toBe(false)
  })
  it('compares words ignoring case and diacritics', () => {
    const q: Question = { kind: 'text', q: 'Název', accept: ['oxid uhličitý'] }
    expect(isCorrect(q, { kind: 'text', value: 'Oxid Uhlicity' })).toBe(true)
  })
  it('checks order and match', () => {
    const o: Question = { kind: 'order', q: '', items: ['a', 'b', 'c'] }
    expect(isCorrect(o, { kind: 'order', order: [0, 1, 2] })).toBe(true)
    expect(isCorrect(o, { kind: 'order', order: [1, 0, 2] })).toBe(false)
    const m: Question = { kind: 'match', q: '', pairs: [['a', '1'], ['b', '2']] }
    expect(isCorrect(m, { kind: 'match', pairs: { 0: 0, 1: 1 } })).toBe(true)
    expect(isCorrect(m, { kind: 'match', pairs: { 0: 1, 1: 0 } })).toBe(false)
  })
  it('parses numbers', () => {
    expect(parseNumber('6,022e23')).toBeCloseTo(6.022e23)
    expect(parseNumber('abc')).toBeNull()
  })
})
