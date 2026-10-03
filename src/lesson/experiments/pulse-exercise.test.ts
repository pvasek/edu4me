import { describe, expect, it } from 'vitest'
import { EXERCISE_S, FITNESS, REST_BAND, curve, rateAt, recoveryTime, restRate, steadyRate } from './pulse-exercise.model'

describe('pulse-exercise model', () => {
  it('realistic resting rates: a trained heart beats slower', () => {
    expect(restRate('netrenovany')).toBeGreaterThanOrEqual(65)
    expect(restRate('netrenovany')).toBeLessThanOrEqual(85)
    expect(restRate('trenovany')).toBeLessThan(restRate('netrenovany'))
  })
  it('the harder the activity the faster the heart, never over ~200 /min', () => {
    for (const f of ['netrenovany', 'trenovany'] as const) {
      const r = FITNESS[f].rate
      expect(r.klid).toBeLessThan(r.chuze)
      expect(r.chuze).toBeLessThan(r.beh)
      expect(r.beh).toBeLessThan(r.sprint)
      expect(r.sprint).toBeLessThanOrEqual(205)
    }
    expect(steadyRate('beh', 'trenovany')).toBeLessThan(steadyRate('beh', 'netrenovany'))
  })
  it('rises towards the steady rate during exercise and falls back after it', () => {
    expect(rateAt(0, 'beh', 'netrenovany')).toBe(75)
    expect(rateAt(EXERCISE_S, 'beh', 'netrenovany')).toBeCloseTo(165, 0)
    expect(rateAt(EXERCISE_S + 60, 'beh', 'netrenovany')).toBeLessThan(rateAt(EXERCISE_S, 'beh', 'netrenovany'))
    const c = curve('sprint', 'trenovany')
    for (let i = 1; i < c.length; i++) {
      if (c[i][0] <= EXERCISE_S) expect(c[i][1]).toBeGreaterThanOrEqual(c[i - 1][1])
      else expect(c[i][1]).toBeLessThanOrEqual(c[i - 1][1])
    }
  })
  it('the trained heart recovers faster (first minute drop ~ 40–60 vs ~ 20–30 /min)', () => {
    const drop = (f: 'netrenovany' | 'trenovany') => rateAt(EXERCISE_S, 'sprint', f) - rateAt(EXERCISE_S + 60, 'sprint', f)
    expect(drop('trenovany')).toBeGreaterThan(40)
    expect(drop('netrenovany')).toBeGreaterThan(15)
    expect(drop('netrenovany')).toBeLessThan(35)
    for (const a of ['chuze', 'beh', 'sprint'] as const)
      expect(recoveryTime(a, 'trenovany')).toBeLessThan(recoveryTime(a, 'netrenovany'))
  })
  it('recovery time lands within the rest band', () => {
    const t = recoveryTime('beh', 'netrenovany')
    expect(rateAt(EXERCISE_S + t, 'beh', 'netrenovany') - restRate('netrenovany')).toBeCloseTo(REST_BAND, 5)
    expect(recoveryTime('klid', 'trenovany')).toBe(0)
  })
})
