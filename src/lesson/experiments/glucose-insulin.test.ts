import { describe, expect, it } from 'vitest'
import { DOSE_MAX, HYPO, LIMIT_2H, MINUTES, glucoseCurve, summarize } from './glucose-insulin.model'

const sum = (p: Parameters<typeof glucoseCurve>[0], dose = 0) => summarize(glucoseCurve(p, dose))

describe('glucose-insulin model', () => {
  it('gives one value per minute for 4 hours', () => {
    expect(glucoseCurve('zdravy')).toHaveLength(MINUTES + 1)
  })
  it('healthy: starts about 5, peaks under about 8,5 within an hour, under 7,8 at 2 h, back near fasting', () => {
    const c = glucoseCurve('zdravy')
    const s = summarize(c)
    expect(c[0]).toBeCloseTo(5)
    expect(s.peak).toBeGreaterThan(6.5)
    expect(s.peak).toBeLessThan(8.5)
    expect(s.peakAt).toBeLessThanOrEqual(65)
    expect(s.at2h).toBeLessThan(LIMIT_2H)
    expect(c[MINUTES]).toBeLessThan(5.6)
    expect(s.inNorm).toBe(true)
  })
  it('type 1 without insulin: glucose climbs high and stays high', () => {
    const s = sum('t1', 0)
    expect(s.peak).toBeGreaterThan(12)
    expect(s.at2h).toBeGreaterThan(11)
    expect(s.inNorm).toBe(false)
  })
  it('type 2: fasting ≥ 7 and over 11,1 at 2 h (weak insulin response)', () => {
    const c = glucoseCurve('t2')
    expect(c[0]).toBeGreaterThanOrEqual(7)
    expect(summarize(c).at2h).toBeGreaterThan(11.1)
  })
  it('more insulin → lower glucose; a medium dose keeps type 1 in the norm, too much causes hypoglycaemia', () => {
    for (let d = 1; d <= DOSE_MAX; d++) expect(sum('t1', d).at2h).toBeLessThan(sum('t1', d - 1).at2h)
    const ok = Array.from({ length: DOSE_MAX + 1 }, (_, d) => d).filter((d) => sum('t1', d).inNorm)
    expect(ok.length).toBeGreaterThanOrEqual(3)
    expect(Math.min(...ok)).toBeGreaterThan(2)
    expect(sum('t1', DOSE_MAX).low).toBeLessThan(HYPO)
    expect(sum('t1', DOSE_MAX).inNorm).toBe(false)
  })
  it('the dose only matters for type 1', () => {
    expect(glucoseCurve('zdravy', 10)).toEqual(glucoseCurve('zdravy', 0))
  })
})
