import { describe, expect, it } from 'vitest'
import {
  BLEACH_DHW,
  DEATH_DHW,
  MMM,
  algaeShare,
  challengeMet,
  coralState,
  daysTo,
  deadShare,
  dhw,
  outcome,
} from './coral-bleaching.model'

describe('coral-bleaching model', () => {
  it('only warming of at least 1 °C over the usual maximum adds heat stress', () => {
    expect(dhw(MMM, 60)).toBe(0)
    expect(dhw(MMM + 0.5, 60)).toBe(0)
    expect(dhw(MMM + 1, 28)).toBeCloseTo(4)
    expect(dhw(MMM + 2, 28)).toBeCloseTo(8)
  })
  it('a cool or normal sea keeps the coral healthy for any time', () => {
    for (const t of [24, 26, 28, MMM, MMM + 0.5]) {
      expect(coralState(t, 84)).toBe('zdravy')
      expect(outcome(t, 84)).toBe('bez-zmeny')
    }
  })
  it('2 °C warmer: bleached after about two weeks, dying after about four', () => {
    expect(daysTo(MMM + 2, BLEACH_DHW)).toBe(14)
    expect(daysTo(MMM + 2, DEATH_DHW)).toBe(28)
    expect(coralState(MMM + 2, 7)).toBe('bledne')
    expect(coralState(MMM + 2, 20)).toBe('vybeleny')
    expect(outcome(MMM + 2, 20)).toBe('zotavi')
    expect(coralState(MMM + 2, 35)).toBe('odumira')
    expect(outcome(MMM + 2, 35)).toBe('cast-uhyne')
    expect(challengeMet(MMM + 2, 28)).toBe(true)
    expect(challengeMet(MMM + 2, 14)).toBe(false)
    expect(challengeMet(MMM + 3, 28)).toBe(false)
  })
  it('the hotter the sea, the faster it bleaches; very long heat kills the coral', () => {
    expect(daysTo(MMM + 4, BLEACH_DHW)).toBeLessThan(daysTo(MMM + 2, BLEACH_DHW))
    expect(coralState(MMM + 5, 84)).toBe('mrtvy')
    expect(outcome(MMM + 5, 84)).toBe('uhyne')
  })
  it('algae leave gradually, death rises monotonically', () => {
    let prevA = 2
    let prevD = -1
    for (let d = 0; d <= 30; d += 0.5) {
      expect(algaeShare(d)).toBeLessThanOrEqual(prevA)
      expect(deadShare(d)).toBeGreaterThanOrEqual(prevD)
      prevA = algaeShare(d)
      prevD = deadShare(d)
    }
    expect(algaeShare(BLEACH_DHW)).toBeLessThan(0.6)
    expect(algaeShare(DEATH_DHW)).toBe(0)
    expect(deadShare(DEATH_DHW)).toBe(0)
  })
})
