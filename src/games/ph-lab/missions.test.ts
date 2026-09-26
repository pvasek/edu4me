import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { ENZYMES, LEVELS, enzymeActivity, pickMissions, reagentsFor } from './missions'
import { CAPACITY, meterReading, phOf, pour, scoreMission, type BeakerState, type Mission } from './ph'

const ALL = Object.values(LEVELS).flatMap((l) => l.missions)

/** Smallest number of additions (1 or 10 cm³ of any offered bottle) that solves the mission. */
function solve(m: Mission, limit: number): number | null {
  const moves = reagentsFor(m).flatMap((r) => [1, 10].map((ml) => ({ r, ml })))
  const rec = (s: BeakerState, from: number, n: number, used: Set<string>, k: number): boolean => {
    if (n === k) return scoreMission(m, phOf(s), n, used).inRange
    for (let i = from; i < moves.length; i++) {
      const { r, ml } = moves[i]
      if (s.volume + ml > CAPACITY) continue
      if (rec(pour(s, r, ml), i, n + 1, new Set([...used, r.id]), k)) return true
    }
    return false
  }
  for (let k = 1; k <= limit; k++) if (rec(m.start, 0, 0, new Set(), k)) return k
  return null
}

describe('pH lab levels', () => {
  it('has content for exactly the registry levels', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID['ph-lab'].levels).map(Number))
  })

  it('mission ids are unique and every category has a mission', () => {
    expect(new Set(ALL.map((m) => m.id)).size).toBe(ALL.length)
    for (const [lv, set] of Object.entries(LEVELS)) {
      for (const cat of set.order) expect(set.missions.some((m) => m.category === cat), `${lv}/${cat}`).toBe(true)
      for (const m of set.missions) {
        expect(m.level).toBe(Number(lv))
        expect(set.order).toContain(m.category)
      }
    }
  })

  it('every mission is solvable within its target number of additions', () => {
    for (const m of ALL) expect(solve(m, m.par), m.id).not.toBeNull()
  })

  it('no mission is already solved at the start', () => {
    for (const m of ALL) {
      // Empty beakers cannot be measured; "needs" missions demand a specific addition.
      if (m.start.volume === 0 || m.needs) continue
      const r = meterReading(phOf(m.start))
      expect(r >= m.min && r <= m.max, m.id).toBe(false)
    }
  })

  it('the mission texts state the starting pH the meter shows', () => {
    const shown = (id: string) => meterReading(phOf(ALL.find((m) => m.id === id)!.start))
    expect(shown('pepsin-bolus')).toBe(6.8)
    expect(shown('pepsin-water')).toBe(2.5)
    expect(shown('trypsin-chyme')).toBe(3)
    expect(shown('trypsin-chyme-2')).toBe(2.7)
    expect(shown('alkalosis')).toBe(7.6)
    expect(shown('urine')).toBe(6)
    expect(phOf(ALL.find((m) => m.id === 'acidosis')!.start)).toBeCloseTo(7.17, 1)
    expect(shown('compare-acid')).toBe(4.8)
    expect(phOf(ALL.find((m) => m.id === 'compare-base')!.start)).toBeCloseTo(9.25, 2)
  })

  it('the buffer beats water when 1 cm³ of HCl is added', () => {
    const m = ALL.find((x) => x.id === 'compare-acid')!
    const hcl = reagentsFor(m).find((r) => r.id === 'hcl')!
    const buf = phOf(m.start) - phOf(pour(m.start, hcl, 1))
    const wat = phOf(m.twin!.start) - phOf(pour(m.twin!.start, hcl, 1))
    expect(buf).toBeLessThan(0.05)
    expect(wat).toBeGreaterThan(3.9)
  })

  it('body fluids have their typical pH', () => {
    const ph = (id: string) => LEVELS[9].reagents.find((r) => r.id === id)!.ph
    expect(ph('zaludek')).toBeCloseTo(1.5, 1)
    expect(ph('krev')).toBeCloseTo(7.4, 1)
    expect(ph('sliny')).toBeCloseTo(6.8, 1)
    expect(ph('moc')).toBeCloseTo(6, 1)
    expect(ph('pot')).toBeCloseTo(5.5, 1)
  })

  it('a level round has one mission per category, in order', () => {
    for (const [lv, set] of Object.entries(LEVELS)) {
      for (const r of [0, 0.5, 0.99]) {
        const ms = pickMissions(Number(lv), () => r)
        expect(ms.map((m) => m.category)).toEqual(set.order)
        expect(ms.every((m) => m.level === Number(lv))).toBe(true)
      }
    }
  })

  it('free play and unsupported levels mix all levels', () => {
    for (const lv of [undefined, 7]) {
      const ms = pickMissions(lv, () => 0.4)
      expect(ms).toHaveLength(4)
      expect(new Set(ms.map((m) => m.level))).toEqual(new Set([5, 6, 9]))
      expect(new Set(ms.map((m) => m.id)).size).toBe(4)
    }
  })

  it('enzymes work near their optimum only', () => {
    const [pepsin, amylaza, trypsin] = ENZYMES
    expect(enzymeActivity(pepsin, 2)).toBe(1)
    expect(enzymeActivity(pepsin, 8)).toBeLessThan(0.01)
    expect(enzymeActivity(trypsin, 8)).toBe(1)
    expect(enzymeActivity(trypsin, 2)).toBeLessThan(0.01)
    expect(enzymeActivity(amylaza, 6.8)).toBe(1)
  })
})
