import { describe, expect, it } from 'vitest'
import * as ab from './albedo-balance.model'
import * as cs from './climate-scenario.model'
import * as em from './energy-mix.model'
import * as ri from './risk-index.model'
import * as sf from './site-finder.model'

describe('albedo-balance model', () => {
  it('today: α = 0,30 and ε ≈ 0,61 give ≈ 15 °C', () => {
    expect(ab.EPS_EARTH).toBeCloseTo(0.61, 2)
    expect(ab.temperature(0.3, ab.EPS_EARTH)).toBeGreaterThan(14)
    expect(ab.temperature(0.3, ab.EPS_EARTH)).toBeLessThan(16)
  })
  it('without the greenhouse effect ≈ −18 °C (255 K)', () => {
    expect(ab.temperature(0.3, 1)).toBeCloseTo(-18.6, 0)
    expect(ab.greenhouseWarming(0.3, ab.EPS_EARTH)).toBeCloseTo(33, 0)
  })
  it('energy balance: absorbed = εσT⁴', () => {
    const T = ab.temperature(0.42, 0.7) + ab.K0
    expect(0.7 * ab.SIGMA * T ** 4).toBeCloseTo(ab.absorbed(0.42), 6)
    expect(ab.incoming()).toBeCloseTo(340.25, 2)
    expect(ab.reflected(0.3) + ab.absorbed(0.3)).toBeCloseTo(ab.incoming(), 9)
  })
  it('more albedo → colder, stronger greenhouse (lower ε) → warmer', () => {
    expect(ab.temperature(0.5, 0.61)).toBeLessThan(ab.temperature(0.3, 0.61))
    expect(ab.temperature(0.3, 0.55)).toBeGreaterThan(ab.temperature(0.3, 0.61))
  })
  it('task: 0 °C without greenhouse only for a very dark Earth (α ≤ 0,07)', () => {
    expect(ab.challengeMet(0.07, 1)).toBe(true)
    expect(ab.challengeMet(0.08, 1)).toBe(false)
    expect(ab.challengeMet(0.05, 0.9)).toBe(false)
  })
})

describe('climate-scenario model', () => {
  const p = (peak: number, fall: number, growth: cs.Growth = 'pomaly'): cs.Pathway => ({ peak, fall, growth })
  it('AR6 Table SPM.1 values, ordered', () => {
    expect(cs.SCENARIOS.map((s) => s.best)).toEqual([1.4, 1.8, 2.7, 3.6, 4.4])
    for (const s of cs.SCENARIOS) expect(s.low < s.best && s.best < s.high).toBe(true)
    const cum = cs.SCENARIOS.map((s) => cs.SCENARIO_CUMULATIVE[s.id])
    for (let i = 1; i < cum.length; i++) expect(cum[i]).toBeGreaterThan(cum[i - 1])
  })
  it('the pathway: E0 in 2025, growth to the peak, linear fall to zero', () => {
    expect(cs.emissionsAt(p(2040, 0.02), 2025)).toBe(cs.E0)
    expect(cs.emissionsAt(p(2040, 0.02), 2040)).toBeCloseTo(cs.E0 * Math.exp(0.15))
    expect(cs.emissionsAt(p(2040, 0.02), 2065)).toBeCloseTo(cs.E0 * Math.exp(0.15) * 0.5)
    expect(cs.emissionsAt(p(2040, 0.02), 2095)).toBe(0)
    expect(cs.zeroYear(p(2040, 0.02))).toBe(2090)
    expect(cs.zeroYear(p(2040, 0.01))).toBeNull()
  })
  it('every scenario is reachable', () => {
    expect(cs.nearestScenario(p(2025, 0.06)).id).toBe('ssp119')
    expect(cs.nearestScenario(p(2030, 0.03)).id).toBe('ssp126')
    expect(cs.nearestScenario(p(2035, 0.01)).id).toBe('ssp245')
    expect(cs.nearestScenario(p(2100, 0)).id).toBe('ssp370')
    expect(cs.nearestScenario(p(2100, 0, 'rychly')).id).toBe('ssp585')
  })
  it('later peak or slower fall → never a lower scenario', () => {
    const idx = (q: cs.Pathway) => cs.SCENARIOS.indexOf(cs.nearestScenario(q))
    for (let peak = 2025; peak < 2100; peak += 5) expect(idx(p(peak + 5, 0.02))).toBeGreaterThanOrEqual(idx(p(peak, 0.02)))
    for (let f = 0.06; f > 0; f -= 0.005) expect(idx(p(2040, f - 0.005))).toBeGreaterThanOrEqual(idx(p(2040, f)))
  })
  it('task: below 2 °C only with an early peak and a fast fall', () => {
    expect(cs.challengeMet(p(2030, 0.03))).toBe(true)
    expect(cs.challengeMet(p(2030, 0.01))).toBe(false)
    expect(cs.challengeMet(p(2060, 0.06))).toBe(false)
  })
})

describe('risk-index model', () => {
  it('R = H · V / C', () => {
    expect(ri.risk(7, 9, 2)).toBeCloseTo(31.5)
    expect(ri.risk(7, 2, 8)).toBeCloseTo(1.75)
  })
  it('the same quake: Port-au-Prince is in a much higher class than Christchurch', () => {
    const h = ri.CITIES.haiti
    const n = ri.CITIES.nz
    expect(ri.level(ri.risk(ri.H_QUAKE, h.vulnerability, h.capacity))).toBe('extremni')
    expect(ri.level(ri.risk(ri.H_QUAKE, n.vulnerability, n.capacity))).toBe('nizke')
    expect(ri.collapseShare(31.5)).toBeGreaterThan(ri.collapseShare(1.75) * 2)
  })
  it('log scale 0,1–100', () => {
    expect(ri.scalePos(0.1)).toBe(0)
    expect(ri.scalePos(100)).toBe(1)
    expect(ri.scalePos(Math.sqrt(10))).toBeCloseTo(0.5)
  })
  it('presets are recognised', () => {
    expect(ri.matchingCity(7, 9, 2)).toBe('haiti')
    expect(ri.matchingCity(7, 2, 8)).toBe('nz')
    expect(ri.matchingCity(6, 2, 8)).toBeNull()
  })
  it('task: the same quake with Christchurch-like risk', () => {
    expect(ri.challengeMet(7, 2, 8)).toBe(true)
    expect(ri.challengeMet(7, 3, 8)).toBe(false)
    expect(ri.challengeMet(3, 9, 2)).toBe(false)
  })
})

describe('site-finder model', () => {
  const all = (on: boolean) => Object.fromEntries(sf.LAYERS.map((l) => [l, on])) as Record<sf.LayerId, boolean>
  it('no layer: every cell except the river is suitable', () => {
    const n = sf.countSuitable(sf.suitability({ layers: all(false), riverBuffer: 0, roadMax: 500 }))
    expect(n).toBeGreaterThan(sf.COLS * sf.ROWS * 0.85)
    expect(n).toBeLessThan(sf.COLS * sf.ROWS)
  })
  it('each layer only removes cells (overlay = AND)', () => {
    const base = sf.suitability({ layers: all(false), riverBuffer: 200, roadMax: 150 })
    for (const l of sf.LAYERS) {
      const one = sf.suitability({ layers: { ...all(false), [l]: true }, riverBuffer: 200, roadMax: 150 })
      expect(sf.countSuitable(one)).toBeLessThan(sf.countSuitable(base))
      one.forEach((row, r) => row.forEach((ok, c) => ok && expect(base[r][c]).toBe(true)))
    }
  })
  it('wider river buffer or a stricter road limit never adds cells', () => {
    const n = (rb: number, rm: number) => sf.countSuitable(sf.suitability({ layers: all(true), riverBuffer: rb, roadMax: rm }))
    for (let rb = 0; rb < 300; rb += 50) expect(n(rb + 50, 150)).toBeLessThanOrEqual(n(rb, 150))
    for (let rm = 500; rm > 50; rm -= 50) expect(n(200, rm - 50)).toBeLessThanOrEqual(n(200, rm))
  })
  it('the task has a small answer near the village, and no answer when too strict', () => {
    const s = { layers: all(true), ...sf.TASK }
    const n = sf.countSuitable(sf.suitability(s))
    expect(n).toBeGreaterThanOrEqual(3)
    expect(n).toBeLessThanOrEqual(12)
    expect(sf.challengeMet(s)).toBe(true)
    expect(sf.challengeMet({ ...s, layers: { ...all(true), hluk: false } })).toBe(false)
    expect(sf.challengeMet({ ...s, riverBuffer: 300 })).toBe(false)
  })
  it('slope: 0 at the hilltop, steepest on its flanks', () => {
    const [cx, cy, h, sp] = sf.HILL
    expect(sf.slope([cx, cy])).toBeCloseTo(0)
    expect(sf.slope([cx + sp, cy])).toBeCloseTo((h / sp) * Math.exp(-0.5) * 100)
    expect(sf.slope([cx + sp, cy])).toBeGreaterThan(sf.MAX_SLOPE)
  })
})

describe('energy-mix model', () => {
  it('Česko 2024 preset sums to 100 % and is mostly nuclear and coal', () => {
    const sum = em.SOURCES.reduce((a, s) => a + em.CZ_2024[s], 0)
    expect(sum).toBeCloseTo(100)
    expect(em.CZ_2024.jadro).toBeGreaterThan(40)
    expect(em.CZ_2024.uhli).toBeGreaterThan(34)
    expect(em.intensity(em.CZ_2024)).toBeGreaterThan(300)
    expect(em.intensity(em.CZ_2024)).toBeLessThan(380)
  })
  it('pure sources give their IPCC AR5 medians', () => {
    const only = (s: em.Source) => em.setShare(em.CZ_2024, s, 100)
    expect(em.intensity(only('uhli'))).toBeCloseTo(820)
    expect(em.intensity(only('vitr'))).toBeCloseTo(11)
    expect(em.importShare(only('plyn'))).toBeCloseTo(100)
    expect(em.dispatchableShare(only('slunce'))).toBeCloseTo(0)
  })
  it('setShare keeps the total at 100 % and the others in proportion', () => {
    const m = em.setShare(em.CZ_2024, 'uhli', 10)
    expect(em.SOURCES.reduce((a, s) => a + m[s], 0)).toBeCloseTo(100)
    expect(m.uhli).toBe(10)
    expect(m.jadro / m.plyn).toBeCloseTo(em.CZ_2024.jadro / em.CZ_2024.plyn)
    const z = em.setShare(em.setShare(em.CZ_2024, 'vitr', 100), 'vitr', 40)
    expect(z.uhli).toBeCloseTo(10)
  })
  it('display shares are whole numbers summing to 100', () => {
    const r = em.roundedShares(em.CZ_2024)
    expect(em.SOURCES.reduce((a, s) => a + r[s], 0)).toBe(100)
    expect(r.jadro).toBe(42)
  })
  it('task: low carbon, enough dispatchable power, limited imports', () => {
    expect(em.challengeMet(em.CZ_2024)).toBe(false)
    // just dropping coal: low carbon, but over 70 % from imported fuel
    const noCoal = em.setShare(em.CZ_2024, 'uhli', 0)
    expect(em.intensity(noCoal)).toBeLessThan(150)
    expect(em.importShare(noCoal)).toBeGreaterThan(70)
    expect(em.challengeMet(noCoal)).toBe(false)
    const ok: em.Mix = { uhli: 0, plyn: 5, jadro: 45, voda: 5, biomasa: 15, vitr: 15, slunce: 15 }
    expect(em.challengeMet(ok)).toBe(true)
    expect(em.challengeMet(em.setShare(em.CZ_2024, 'slunce', 70))).toBe(false)
  })
})
