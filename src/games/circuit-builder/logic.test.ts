import { describe, expect, it } from 'vitest'
import {
  amm,
  applyChange,
  arrangements,
  brightest,
  checkGoal,
  effectOn,
  fill,
  fmt,
  label,
  lamp,
  par,
  parseNum,
  power,
  reading,
  relation,
  res,
  resistance,
  ser,
  slot,
  solve,
  sw,
  volt,
  wire,
  within,
  type Circuit,
} from './logic'

describe('circuit solver', () => {
  it('series: resistances add, same current everywhere', () => {
    const c: Circuit = { ue: 12, ri: 0, net: ser(amm(), res('R1', 4), res('R2', 2)) }
    const s = solve(c)
    expect(s.R).toBe(6)
    expect(s.I).toBeCloseTo(2)
    expect(reading(c, s, 'A')).toBeCloseTo(2)
    expect(s.part.get('R1')!.U).toBeCloseTo(8)
    expect(s.part.get('R2')!.U).toBeCloseTo(4)
  })

  it('parallel: 1/R = 1/R1 + 1/R2, currents split, voltage shared', () => {
    const c: Circuit = { ue: 12, ri: 0, net: ser(amm(), par(res('R1', 4), res('R2', 6))) }
    const s = solve(c)
    expect(s.R).toBeCloseTo(2.4)
    expect(s.I).toBeCloseTo(5)
    expect(s.part.get('R1')!.I).toBeCloseTo(3)
    expect(s.part.get('R2')!.I).toBeCloseTo(2)
    expect(s.part.get('R2')!.U).toBeCloseTo(12)
  })

  it('source with internal resistance: U = U_e − R_i·I', () => {
    const c: Circuit = { ue: 12, ri: 1, net: par(ser(res('R1', 2), par(res('R2', 6), res('R3', 3))), volt()) }
    const s = solve(c)
    expect(s.R).toBeCloseTo(4)
    expect(s.I).toBeCloseTo(12 / 5)
    expect(reading(c, s, 'V')).toBeCloseTo(12 - 2.4)
    // Kirchhoff I: currents into the branch point = currents out
    expect(s.part.get('R2')!.I + s.part.get('R3')!.I).toBeCloseTo(s.I)
    // Kirchhoff II: around the loop the voltages add up to U_e
    expect(1 * s.I + s.part.get('R1')!.U + s.part.get('R2')!.U).toBeCloseTo(12)
  })

  it('short circuit current is U_e / R_i', () => {
    const c: Circuit = { ue: 4.5, ri: 0.5, net: amm() }
    expect(solve(c).I).toBeCloseTo(9)
  })

  it('open switch and voltmeter in series stop the current; the gap gets the whole voltage', () => {
    const open: Circuit = { ue: 6, ri: 0, net: ser(sw('S', false), lamp('Z1', 6)) }
    const s = solve(open)
    expect(s.I).toBe(0)
    expect(s.part.get('S')!.U).toBeCloseTo(6)
    const v: Circuit = { ue: 6, ri: 0, net: ser(volt(), lamp('Z1', 6)) }
    expect(reading(v, solve(v), 'V')).toBeCloseTo(6)
    expect(power(solve(v), 'Z1')).toBe(0)
  })

  it('a wire in parallel shorts the lamp', () => {
    const c: Circuit = { ue: 6, ri: 0, net: ser(lamp('Z1', 6), par(lamp('Z2', 6), wire())) }
    const s = solve(c)
    expect(resistance(c.net)).toBe(6)
    expect(power(s, 'Z2')).toBe(0)
    expect(power(s, 'Z1')).toBeCloseTo(6)
  })

  it('dead short without internal resistance does not produce NaN powers', () => {
    const c: Circuit = { ue: 6, ri: 0, net: par(lamp('Z1', 6), wire()) }
    const s = solve(c)
    expect(s.short).toBe(true)
    expect(power(s, 'Z1')).toBe(0)
  })
})

describe('brightness and changes', () => {
  it('series lamps: bigger resistance shines brighter; parallel: smaller', () => {
    expect(brightest({ ue: 6, ri: 0, net: ser(lamp('Z1', 2), lamp('Z2', 4)) })).toBe('Z2')
    expect(brightest({ ue: 6, ri: 0, net: par(lamp('Z1', 2), lamp('Z2', 4)) })).toBe('Z1')
    expect(brightest({ ue: 6, ri: 0, net: ser(lamp('Z1', 6), lamp('Z2', 6)) })).toBe('same')
    expect(brightest({ ue: 6, ri: 0, net: ser(lamp('Z3', 6), par(lamp('Z1', 6), lamp('Z2', 6))) })).toBe('Z3')
  })

  it('lamp burning out / switch opening', () => {
    const series: Circuit = { ue: 6, ri: 0, net: ser(lamp('Z1', 6), lamp('Z2', 6)) }
    expect(effectOn(series, { burnt: 'Z1' }, 'Z2')).toBe('off')
    const parallel: Circuit = { ue: 6, ri: 0, net: par(lamp('Z1', 6), ser(sw(), lamp('Z2', 6))) }
    expect(effectOn(parallel, { open: 'S' }, 'Z1')).toBe('same')
    expect(effectOn(parallel, { open: 'S' }, 'Z2')).toBe('off')
    const mixed: Circuit = { ue: 6, ri: 0, net: ser(lamp('Z1', 6), par(lamp('Z2', 6), lamp('Z3', 6))) }
    expect(effectOn(mixed, { burnt: 'Z3' }, 'Z2')).toBe('brighter')
    expect(effectOn(mixed, { burnt: 'Z3' }, 'Z1')).toBe('dimmer')
    const withRi: Circuit = { ue: 12, ri: 2, net: par(lamp('Z1', 6), lamp('Z2', 6)) }
    expect(effectOn(withRi, { burnt: 'Z1' }, 'Z2')).toBe('brighter')
    expect(power(solve(applyChange(withRi, { burnt: 'Z1' })), 'Z1')).toBe(0)
  })

  it('relation finds series/parallel neighbours', () => {
    const n = ser(lamp('Z1', 6), par(lamp('Z2', 6), ser(sw(), lamp('Z3', 6))))
    expect(relation(n, 'Z1', 'Z2')).toBe('ser')
    expect(relation(n, 'Z2', 'Z3')).toBe('par')
    expect(relation(n, 'S', 'Z3')).toBe('ser')
  })
})

describe('build goals', () => {
  const board: Circuit = { ue: 4.5, ri: 0, net: ser(slot('a'), par(ser(slot('b'), slot('c')), slot('d'))) }
  const Z1 = lamp('Z1', 6)
  const Z2 = lamp('Z2', 6)
  const S = sw()
  const W = wire('W1')

  it('switch controls only Ž2 when it sits in Ž2’s branch', () => {
    const goal = { t: 'switchOnly', lamp: 'Z2' } as const
    expect(checkGoal(fill(board, { a: W, b: S, c: Z2, d: Z1 }), goal).ok).toBe(true)
    expect(checkGoal(fill(board, { a: S, b: W, c: Z2, d: Z1 }), goal).ok).toBe(false)
    // a wire in its own branch shorts both lamps
    expect(checkGoal(fill(board, { a: Z1, b: S, c: Z2, d: W }), goal).ok).toBe(false)
  })

  it('every arrangement is evaluated and some fail', () => {
    const all = arrangements(board, [Z1, Z2, S, W], { t: 'switchAll' })
    expect(all).toHaveLength(24)
    expect(all.some((x) => x.ok)).toBe(true)
    expect(all.some((x) => !x.ok)).toBe(true)
  })

  it('voltmeter in series breaks the circuit; ammeter must share the lamp’s branch', () => {
    const V = volt()
    const r = checkGoal(fill(board, { a: V, b: Z1, c: Z2, d: W }), { t: 'voltSource' })
    expect(r.ok).toBe(false)
    expect(r.why).toMatch(/přerušený|Zkrat/)
    expect(checkGoal(fill(board, { a: W, b: Z1, c: Z2, d: V }), { t: 'voltSource' }).ok).toBe(true)
    const A = amm()
    expect(checkGoal(fill(board, { a: W, b: A, c: Z1, d: Z2 }), { t: 'ammeterOnly', lamp: 'Z1' }).ok).toBe(true)
    expect(checkGoal(fill(board, { a: A, b: W, c: Z1, d: Z2 }), { t: 'ammeterOnly', lamp: 'Z1' }).ok).toBe(false)
  })

  it('independent lamps must be parallel', () => {
    const b3: Circuit = { ue: 4.5, ri: 0, net: ser(slot('a'), par(slot('b'), slot('c'))) }
    expect(checkGoal(fill(b3, { a: W, b: Z1, c: Z2 }), { t: 'independent' }).ok).toBe(true)
    expect(checkGoal(fill(b3, { a: Z1, b: Z2, c: W }), { t: 'independent' }).ok).toBe(false)
  })

  it('empty slot is an open gap', () => {
    expect(checkGoal(fill(board, { a: W, b: Z1, c: Z2 }), { t: 'independent' }).ok).toBe(false)
  })
})

describe('numbers', () => {
  it('parses comma, dot, minus sign and units', () => {
    expect(parseNum('1,5')).toBe(1.5)
    expect(parseNum(' 1.5 A')).toBe(1.5)
    expect(parseNum('−0,25')).toBe(-0.25)
    expect(parseNum('12 Ω')).toBe(12)
    expect(parseNum('abc')).toBeNull()
    expect(parseNum('')).toBeNull()
  })
  it('tolerance is ±2 %', () => {
    expect(within(1.96, 2)).toBe(true)
    expect(within(2.05, 2)).toBe(false)
    expect(within(0.42, 0.4235)).toBe(true)
  })
  it('formats Czech numbers and labels', () => {
    expect(fmt(1.5)).toBe('1,5')
    expect(fmt(2)).toBe('2')
    expect(fmt(-0.333333)).toBe('−0,333')
    expect(fmt(0.30252)).toBe('0,303')
    expect(fmt(13.94)).toBe('13,9')
    expect(fmt(230)).toBe('230')
    expect(fmt(26.667)).toBe('26,7')
    expect(label('Z1')).toBe('Ž₁')
    expect(label('R12')).toBe('R₁₂')
  })
})
