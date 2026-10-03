import { describe, expect, it } from 'vitest'
import { CO2_AIR, CO2_SAT, LIGHT_SAT, MAX_RATE, T_DEAD, co2Cap, lightCap, photosynthesisRate, tempCap } from './photosynthesis-rate.model'

describe('photosynthesis-rate model', () => {
  it('light and CO₂ rise in proportion, then level off', () => {
    expect(lightCap(0)).toBe(0)
    expect(lightCap(LIGHT_SAT / 2)).toBeCloseTo(0.5)
    expect(lightCap(LIGHT_SAT)).toBe(1)
    expect(lightCap(100)).toBe(1)
    expect(co2Cap(0)).toBe(0)
    expect(co2Cap(CO2_AIR)).toBeCloseTo(CO2_AIR / CO2_SAT)
    expect(co2Cap(0.2)).toBe(1)
  })
  it('temperature: zero near 0 °C, optimum 25–30 °C, denatured above ~40 °C', () => {
    expect(tempCap(0)).toBe(0)
    expect(tempCap(15)).toBeGreaterThan(tempCap(10))
    // Q10 ≈ 2 below the optimum: 15 °C gives roughly half of 25 °C
    expect(tempCap(15)).toBeGreaterThan(0.3)
    expect(tempCap(15)).toBeLessThan(0.55)
    expect(tempCap(25)).toBe(1)
    expect(tempCap(30)).toBe(1)
    expect(tempCap(35)).toBeLessThan(1)
    expect(tempCap(40)).toBeLessThan(0.5)
    expect(tempCap(T_DEAD)).toBe(0)
    expect(tempCap(50)).toBe(0)
  })
  it('the rate is set by the factor in shortest supply (Blackman)', () => {
    const lowLight = photosynthesisRate(30, 0.08, 20)
    expect(lowLight.limiting).toEqual(['light'])
    expect(lowLight.rate).toBeCloseTo(MAX_RATE * 0.5)
    const lowCo2 = photosynthesisRate(100, 0.03, 25)
    expect(lowCo2.limiting).toEqual(['co2'])
    expect(lowCo2.rate).toBeCloseTo(MAX_RATE * 0.3)
    // more light does not help when CO₂ limits
    expect(photosynthesisRate(80, 0.03, 25).rate).toBeCloseTo(lowCo2.rate)
    const cold = photosynthesisRate(100, 0.2, 8)
    expect(cold.limiting).toEqual(['temp'])
  })
  it('in weak light, warming does not speed it up', () => {
    expect(photosynthesisRate(10, 0.1, 15).rate).toBeCloseTo(photosynthesisRate(10, 0.1, 28).rate)
  })
  it('nothing limits when all three are saturated; nothing happens in the dark or when too hot', () => {
    expect(photosynthesisRate(80, 0.15, 27)).toMatchObject({ rate: MAX_RATE, limiting: [] })
    expect(photosynthesisRate(0, 0.1, 25).rate).toBe(0)
    expect(photosynthesisRate(100, 0.2, 47).rate).toBe(0)
  })
  it('reports ties', () => {
    expect(photosynthesisRate(30, 0.05, 25).limiting).toEqual(['light', 'co2'])
  })
})
