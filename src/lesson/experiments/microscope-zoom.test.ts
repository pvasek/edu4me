import { describe, expect, it } from 'vitest'
import { STEPS, cellsNear, scaleBar, seesNucleus, specimenOutline, visible } from './microscope-zoom.model'

describe('microscope-zoom model', () => {
  it('magnification = eyepiece × objective, the first step is a 10× hand lens', () => {
    expect(STEPS.map((s) => s.mag)).toEqual([10, 40, 100, 400])
    for (const s of STEPS.slice(1)) expect(s.ocular! * s.objective!).toBe(s.mag)
    expect(STEPS[0].objective).toBeNull()
  })
  it('the field of view shrinks as the objective grows (≈ 4,5 mm → 0,45 mm)', () => {
    expect(STEPS[1].field).toBe(4500)
    expect(STEPS[2].field).toBe(1800)
    expect(STEPS[3].field).toBe(450)
    for (let i = 1; i < STEPS.length; i++) expect(STEPS[i].field).toBeLessThan(STEPS[i - 1].field)
  })
  it('a hand lens shows only the piece of skin, cells appear at 40×', () => {
    expect(visible('cibule', 10)).toEqual(['vzorek'])
    expect(visible('cibule', 40)).toContain('bunky')
    expect(visible('cibule', 40)).toContain('stena')
    expect(visible('lice', 40)).toContain('membrana')
    expect(visible('lice', 40)).not.toContain('stena')
  })
  it('onion nuclei show at 100×, the smaller cheek nuclei only at 400×', () => {
    expect(seesNucleus('cibule', 40)).toBe(false)
    expect(seesNucleus('cibule', 100)).toBe(true)
    expect(seesNucleus('lice', 100)).toBe(false)
    expect(seesNucleus('lice', 400)).toBe(true)
    expect(visible('cibule', 400)).toContain('jaderko')
  })
  it('more magnification never hides a structure', () => {
    for (const s of ['cibule', 'lice'] as const)
      for (let i = 1; i < STEPS.length; i++)
        for (const x of visible(s, STEPS[i - 1].mag)) expect(visible(s, STEPS[i].mag)).toContain(x)
  })
  it('scale bar is 1, 2 or 5 × 10ⁿ µm and about a quarter of the field', () => {
    expect(STEPS.map((s) => scaleBar(s.field))).toEqual([2000, 1000, 200, 100])
  })
  it('the slide holds a sensible number of cells in each field', () => {
    for (const s of ['cibule', 'lice'] as const) {
      const hi = cellsNear(s, STEPS[3].field / 2).length
      expect(hi).toBeGreaterThanOrEqual(3)
      expect(hi).toBeLessThan(40)
      expect(cellsNear(s, STEPS[1].field / 2).length).toBeLessThan(2500)
      expect(specimenOutline(s).length).toBeGreaterThan(10)
    }
  })
  it('is deterministic', () => {
    expect(cellsNear('lice', 900)).toEqual(cellsNear('lice', 900))
  })
})
