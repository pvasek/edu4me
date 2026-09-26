import { describe, expect, it } from 'vitest'
import { KW, SYSTEMS, hendersonHasselbalch, protonsLost, solvePh } from './equilibrium'

const close = (a: number, b: number, d = 0.01) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThan(d)
const ka = (pk: number) => 10 ** -pk

/** Textbook quadratic for a weak monoprotic acid HA of concentration c (water neglected). */
const quadratic = (pKa: number, c: number) => {
  const k = ka(pKa)
  return -Math.log10((-k + Math.sqrt(k * k + 4 * k * c)) / 2)
}

describe('weak acids and bases (exact solve)', () => {
  it('acetic acid matches the lesson values', () => {
    close(solvePh(0, { ac: 0.1 }), 2.88) // l6: pH ≈ 2,88
    close(solvePh(0, { ac: 0.01 }), 3.38, 0.02) // l6 check: 3,38
    close(solvePh(0, { ac: 1 }), 2.38) // vinegar ≈ 2,4
  })

  it('agrees with the exact quadratic where water does not matter', () => {
    for (const c of [1, 0.1, 0.01, 0.001]) close(solvePh(0, { ac: c }), quadratic(4.76, c), 1e-4)
  })

  it('is better than the approximation for very dilute acid, and never above 7', () => {
    const c = 1e-5
    const exact = solvePh(0, { ac: c })
    const approx = 0.5 * (4.76 - Math.log10(c))
    expect(exact - approx).toBeGreaterThan(0.1) // ½(pKa − log c) = 4,88 is wrong here
    // Charge balance: [H3O+] = [CH3COO−] + [OH−]
    const h = 10 ** -exact
    const a = c * protonsLost(SYSTEMS.ac, h)
    close(h, a + KW / h, 1e-12)
    expect(solvePh(0, { ac: 1e-10 })).toBeLessThan(7)
    close(solvePh(0, { ac: 1e-10 }), 7, 0.01)
  })

  it('ammonia and salts hydrolyse as expected', () => {
    close(solvePh(0, { am: 0.1 }), 11.12) // pOH = ½(4,75 + 1)
    close(solvePh(0.1, { am: 0.1 }), 5.12) // NH4Cl
    close(solvePh(-0.1, { ac: 0.1 }), 8.88) // CH3COONa
  })

  it('bicarbonate alone sits between its two pKa (amphoteric)', () => {
    close(solvePh(-0.1, { co2: 0.1 }), (6.1 + 10.33) / 2, 0.03)
  })

  it("hydrogen sulfate: second proton of H2SO4 is weak (HSO4− carries the charge, no strong ions)", () => {
    // 0,05 M H2SO4: [H+] = 0,05 + x, x from Ka2 = (0,05 + x)·x / (0,05 − x)
    const k = ka(1.99)
    const c = 0.05
    const x = (-(c + k) + Math.sqrt((c + k) ** 2 + 4 * k * c)) / 2
    close(solvePh(0, { so4: c }), -Math.log10(c + x), 1e-4)
    close(solvePh(0, { so4: c }), 1.24, 0.01)
  })
})

describe('buffers', () => {
  it('Henderson–Hasselbalch values from the lesson', () => {
    close(solvePh(-0.2, { ac: 0.3 }), 5.06) // 0,10 HA + 0,20 A−
    close(solvePh(-0.5, { ac: 0.55 }), 5.76) // 0,050 HA + 0,50 A−
    close(solvePh(0.1, { am: 0.3 }), 9.55) // 0,20 NH3 + 0,10 NH4Cl
    close(solvePh(-0.1, { ac: 0.2 }), 4.76)
    close(hendersonHasselbalch(4.76, 0.2, 0.1), 5.06)
  })

  it('a buffer resists added acid, water does not', () => {
    // 1 dm3 with 0,10 mol CH3COOH + 0,10 mol CH3COONa, then 0,010 mol HCl
    const before = solvePh(-0.1, { ac: 0.2 })
    const after = solvePh(-0.1 + 0.01, { ac: 0.2 })
    close(after, 4.67)
    expect(before - after).toBeLessThan(0.1)
    close(solvePh(0) - solvePh(0.01), 5, 1e-6)
  })

  it('blood: HCO3− : CO2 = 20 : 1 with pKa 6,1 gives pH 7,4', () => {
    close(solvePh(-0.024, { co2: 0.024 + 0.0012 }), 7.4)
    close(solvePh(-0.024, { co2: 0.0252 }), hendersonHasselbalch(6.1, 20, 1), 0.02)
  })

  it('pH decreases monotonically as strong acid is added', () => {
    let prev = Infinity
    for (let s = -0.15; s <= 0.15; s += 0.005) {
      const p = solvePh(s, { ac: 0.1, am: 0.05, co2: 0.02 })
      expect(p).toBeLessThan(prev)
      prev = p
    }
  })
})
