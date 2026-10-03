import { describe, expect, it } from 'vitest'
import { MAX_GEN, START_DARK, darkShare, mothHistory, survival } from './peppered-moth.model'

describe('peppered-moth model', () => {
  it('the moth that matches the bark survives better', () => {
    const clean = survival(0)
    expect(clean.light).toBeGreaterThan(clean.dark)
    const sooty = survival(1)
    expect(sooty.dark).toBeGreaterThan(sooty.light)
    expect(survival(0.5).light).toBeCloseTo(survival(0.5).dark)
  })
  it('dark is dominant: CC and Cc are dark', () => {
    expect(darkShare(0)).toBe(0)
    expect(darkShare(0.5)).toBeCloseTo(0.75)
    expect(darkShare(1)).toBe(1)
  })
  it('starts rare and has MAX_GEN + 1 values', () => {
    const h = mothHistory(0.2)
    expect(h).toHaveLength(MAX_GEN + 1)
    expect(h[0]).toBeCloseTo(START_DARK)
  })
  it('on clean bark dark moths dwindle; with no difference nothing changes', () => {
    const h = mothHistory(0)
    expect(h[10]).toBeLessThan(0.01)
    for (const f of mothHistory(0.5)) expect(f).toBeCloseTo(START_DARK)
  })
  it('on sooty bark dark moths take over within about 10 generations', () => {
    expect(mothHistory(1)[10]).toBeGreaterThan(0.5)
    expect(mothHistory(0.85)[10]).toBeGreaterThan(0.5)
    expect(mothHistory(0.6)[10]).toBeLessThan(0.5)
    // monotonic rise, never above 100 %
    const h = mothHistory(1)
    for (let g = 1; g < h.length; g++) {
      expect(h[g]).toBeGreaterThan(h[g - 1])
      expect(h[g]).toBeLessThanOrEqual(1)
    }
  })
})
