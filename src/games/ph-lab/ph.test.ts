import { describe, expect, it } from 'vitest'
import {
  MISSIONS,
  REAGENTS,
  REAGENT_BY_ID,
  add,
  equivalentConc,
  indicatorColor,
  meterReading,
  phFromNet,
  phOf,
  pickMissions,
  scoreMission,
  solution,
  water,
} from './ph'

const close = (a: number, b: number, d = 0.01) => expect(Math.abs(a - b)).toBeLessThan(d)

describe('pH of strong acid/base mixtures', () => {
  it('pure water is neutral', () => {
    close(phOf(water()), 7, 1e-9)
  })

  it('0.1 M HCl has pH 1, 0.1 M NaOH has pH 13', () => {
    close(phOf(solution(100, 0.1)), 1)
    close(phOf(solution(100, -0.1)), 13)
  })

  it('1 cm³ of 0.1 M HCl in 100 cm³ water gives pH ≈ 3', () => {
    const s = add(water(), 0.1, 1)
    expect(s.volume).toBe(101)
    close(phOf(s), 3.004, 0.001)
  })

  it('neutralises exactly at equivalence', () => {
    let s = solution(100, 0.01) // 1 mmol H3O+
    s = add(s, -0.1, 10) // 1 mmol OH-
    close(phOf(s), 7, 1e-6)
    expect(s.nH).toBeCloseTo(0.001, 12)
    expect(s.nOH).toBeCloseTo(0.001, 12)
  })

  it('one cm³ short / over the equivalence jumps far', () => {
    const under = add(solution(100, 0.01), -0.1, 9)
    const over = add(solution(100, 0.01), -0.1, 11)
    close(phOf(under), 3.04, 0.01)
    close(phOf(over), 10.96, 0.01)
  })

  it('dilution raises pH by 1 per tenfold dilution', () => {
    const s = add(solution(10, 0.01), 0, 90)
    close(phOf(s), 3, 1e-3)
  })

  it('respects the water limit: dilute acid never goes above 7', () => {
    const ph = phFromNet(1e-12, 1000) // 1e-12 M HCl
    expect(ph).toBeLessThan(7)
    close(ph, 7, 0.01)
    const ph8 = phFromNet(1e-8, 1000) // the classic 1e-8 M HCl -> pH 6.98, not 8
    close(ph8, 6.98, 0.01)
    const b8 = phFromNet(-1e-8, 1000)
    close(b8, 7.02, 0.01)
  })

  it('is accurate for strong bases (no cancellation)', () => {
    close(phFromNet(-1, 1000), 14, 1e-6)
    close(phFromNet(-1e-3, 1000), 11, 1e-6)
  })

  it('household samples reproduce their typical pH', () => {
    for (const r of REAGENTS.filter((x) => x.kind !== 'water')) {
      close(phOf(solution(50, r.conc)), r.ph, 1e-6)
    }
    close(phOf(solution(50, equivalentConc(8.3))), 8.3, 1e-6)
  })

  it('distilled water does not change the amounts', () => {
    const s = add(add(water(), 0.1, 1), REAGENT_BY_ID.voda.conc, 10)
    expect(s.nH).toBeCloseTo(1e-4, 12)
    expect(s.volume).toBe(111)
  })
})

describe('universal indicator colour', () => {
  it('matches the stops and interpolates', () => {
    expect(indicatorColor(7)).toBe('#4caf50')
    expect(indicatorColor(1)).toBe('#d7263d')
    expect(indicatorColor(-3)).toBe(indicatorColor(0))
    expect(indicatorColor(20)).toBe(indicatorColor(14))
    expect(indicatorColor(7.5)).toMatch(/^#[0-9a-f]{6}$/)
    expect(indicatorColor(7.5)).not.toBe(indicatorColor(7))
  })
})

describe('missions', () => {
  it('meter reads one decimal', () => {
    expect(meterReading(10.996)).toBe(11)
  })

  it('every par-1 mission is solvable with a single addition', () => {
    for (const m of MISSIONS.filter((x) => x.par === 1)) {
      const ok = REAGENTS.some((r) => [1, 10].some((ml) => scoreMission(m, phOf(add(m.start, r.conc, ml)), 1).inRange))
      expect(ok, m.id).toBe(true)
    }
  })

  it('the dilution mission is solvable in par additions', () => {
    const m = MISSIONS.find((x) => x.id === 'dilute')!
    let s = m.start
    for (let i = 0; i < m.par; i++) s = add(s, 0, 10)
    expect(scoreMission(m, phOf(s), m.par).total).toBe(10)
  })

  it('scores accuracy and efficiency', () => {
    const m = MISSIONS.find((x) => x.id === 'acid-3')!
    expect(scoreMission(m, 3.0, 1).total).toBe(10)
    expect(scoreMission(m, 3.0, 3).total).toBe(9)
    expect(scoreMission(m, 3.0, 20).total).toBe(7)
    expect(scoreMission(m, 7.0, 0).total).toBe(0)
    const near = scoreMission(m, 3.6, 1)
    expect(near.inRange).toBe(false)
    expect(near.accuracy).toBeGreaterThan(0)
    expect(near.efficiency).toBe(0)
  })

  it('picks one mission per category', () => {
    const ms = pickMissions(() => 0.99)
    expect(ms.map((m) => m.category)).toEqual(['acid', 'base', 'neutral', 'special'])
  })
})
