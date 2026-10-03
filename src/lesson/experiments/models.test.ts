import { describe, expect, it } from 'vitest'
import { HOVER_TOLERANCE, LIQUIDS, floatInLiquid } from './density-float.model'
import { FULL_GLOW_W, ohmLaw } from './ohm-law.model'

describe('density-float model', () => {
  it('computes ρ = m / V in g/cm³', () => {
    expect(floatInLiquid(60, 100, 1).rho).toBeCloseTo(0.6)
    expect(floatInLiquid(270, 100, 1).rho).toBeCloseTo(2.7)
  })
  it('a lighter block floats, submerged by ρ / ρ_kapaliny', () => {
    const r = floatInLiquid(60, 100, LIQUIDS.voda.rho)
    expect(r.state).toBe('float')
    expect(r.submerged).toBeCloseTo(0.6)
    // in oil the same block sinks deeper
    expect(floatInLiquid(60, 100, LIQUIDS.olej.rho).submerged).toBeCloseTo(0.6 / 0.92)
  })
  it('a denser block sinks and is fully under the surface', () => {
    expect(floatInLiquid(150, 100, 1)).toMatchObject({ state: 'sink', submerged: 1 })
  })
  it(`hovers within ±${HOVER_TOLERANCE} g/cm³, edges included`, () => {
    expect(floatInLiquid(100, 100, 1).state).toBe('hover')
    expect(floatInLiquid(98, 100, 1).state).toBe('hover')
    expect(floatInLiquid(102, 100, 1).state).toBe('hover')
    expect(floatInLiquid(97, 100, 1).state).toBe('float')
    expect(floatInLiquid(103, 100, 1).state).toBe('sink')
    expect(floatInLiquid(100, 100, 1).submerged).toBe(1)
  })
  it('judges by the density shown (rounded to 0,01), so readout and state agree', () => {
    // 49 / 50 = 0,98 exactly; 245 / 250 = 0,98; 0,9796 is shown as 0,98 → hovers too
    expect(floatInLiquid(245, 250, 1).state).toBe('hover')
    expect(floatInLiquid(0.9796 * 125, 125, 1).state).toBe('hover')
  })
  it('depends on the liquid', () => {
    expect(floatInLiquid(103, 100, LIQUIDS.slana.rho).state).toBe('hover')
    expect(floatInLiquid(92, 100, LIQUIDS.olej.rho).state).toBe('hover')
    expect(floatInLiquid(100, 100, LIQUIDS.olej.rho).state).toBe('sink')
  })
})

describe('ohm-law model', () => {
  it('I = U / R', () => {
    expect(ohmLaw(6, 12).I).toBe(0.5)
    expect(ohmLaw(12, 24).I).toBe(0.5)
    expect(ohmLaw(4.5, 15).I).toBeCloseTo(0.3)
    expect(ohmLaw(0, 20).I).toBe(0)
  })
  it('doubling U doubles I, doubling R halves it', () => {
    expect(ohmLaw(8, 20).I).toBeCloseTo(2 * ohmLaw(4, 20).I)
    expect(ohmLaw(8, 40).I).toBeCloseTo(ohmLaw(8, 20).I / 2)
  })
  it('P = U · I', () => {
    expect(ohmLaw(6, 12).P).toBeCloseTo(3)
    expect(ohmLaw(12, 2).P).toBeCloseTo(72)
  })
  it('the lamp glow grows with P, is 0 without current and capped at 1', () => {
    expect(ohmLaw(0, 10).glow).toBe(0)
    expect(ohmLaw(6, 20).glow).toBeLessThan(ohmLaw(6, 10).glow)
    expect(ohmLaw(12, 2).glow).toBe(1)
    expect(ohmLaw(Math.sqrt(FULL_GLOW_W * 10), 10).glow).toBeCloseTo(1)
  })
})
