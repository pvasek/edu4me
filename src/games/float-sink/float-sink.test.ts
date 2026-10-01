import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LEVELS, LIQUIDS, MATERIALS } from './levels'
import {
  CLOSE,
  ROUND,
  buoyantForce,
  checkNumber,
  densityGcm3,
  makeRound,
  outcomeOf,
  playedLevel,
  submergedFraction,
  type NumberTask,
  type Task,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('float-sink physics', () => {
  it('uses real table densities', () => {
    expect(LIQUIDS.water.rho).toBe(1000)
    expect(LIQUIDS.mercury.rho).toBeCloseTo(13546, -1)
    expect(MATERIALS.ice.rho).toBe(917)
    expect(MATERIALS.aluminium.rho).toBe(2700)
    expect(MATERIALS.iron.rho).toBeCloseTo(7870, -1)
    expect(MATERIALS.gold.rho).toBeCloseTo(19300, -2)
  })

  it('compares densities', () => {
    expect(outcomeOf(MATERIALS.ice.rho, LIQUIDS.water.rho)).toBe('plave')
    expect(outcomeOf(MATERIALS.iron.rho, LIQUIDS.water.rho)).toBe('klesne')
    expect(outcomeOf(MATERIALS.iron.rho, LIQUIDS.mercury.rho)).toBe('plave')
    expect(outcomeOf(MATERIALS.gold.rho, LIQUIDS.mercury.rho)).toBe('klesne')
    expect(outcomeOf(MATERIALS.egg.rho, LIQUIDS.water.rho)).toBe('klesne')
    expect(outcomeOf(MATERIALS.egg.rho, LIQUIDS.deadsea.rho)).toBe('plave')
    expect(outcomeOf(1025, 1025)).toBe('vznasi')
  })

  it('computes Archimedes, density and the submerged part', () => {
    expect(buoyantForce(0.0002, 1000)).toBeCloseTo(2, 9)
    expect(buoyantForce(0.002, 920)).toBeCloseTo(18.4, 9)
    expect(densityGcm3(108, 40)).toBeCloseTo(2700, 9)
    expect(submergedFraction(917, 1025)).toBeCloseTo(0.8946, 3) // iceberg ~ 90 %
    expect(submergedFraction(7870, 13546)).toBeCloseTo(0.581, 3)
    expect(submergedFraction(2700, 1000)).toBe(1)
  })
})

function validate(t: Task) {
  expect(t.text.length).toBeGreaterThan(20)
  expect(t.explain.length).toBeGreaterThan(20)
  expect(t.body.rho).toBeGreaterThan(0)
  // the outcome is always the physics of the shown body and liquid
  if (t.kind !== 'capacity') expect(outcomeOf(t.body.rho, t.liquid.rho), t.key).toBe(t.outcome)
  if (t.answer === 'predict') {
    expect(t.options).toContain(t.outcome)
    if (t.outcome !== 'vznasi') expect(Math.abs(t.body.rho / t.liquid.rho - 1), t.key).toBeGreaterThanOrEqual(CLOSE - 1e-9)
  } else {
    expect(t.value).toBeGreaterThan(0)
    expect(t.tol).toBeGreaterThan(0)
    expect(checkNumber(String(t.value), t).kind).toBe('ok')
    expect(checkNumber(String(t.value).replace('.', ','), t).kind).toBe('ok')
    expect(checkNumber(String(t.value + t.tol * 1.5), t).kind).toBe('wrong')
    if (t.kind === 'fraction') {
      expect(t.value).toBeCloseTo(submergedFraction(t.body.rho, t.liquid.rho) * 100, 6)
      expect(t.value).toBeLessThan(100)
    }
    if (t.kind === 'buoyancy') {
      const m = t.text.match(/\*\*([\d,]+) (dm|cm)\^\{3\}\*\*/)!
      const V = Number(m[1].replace(',', '.')) / (m[2] === 'dm' ? 1000 : 1e6)
      expect(t.value).toBeCloseTo(buoyantForce(V, t.liquid.rho), 6)
    }
  }
}

describe('float-sink rounds', () => {
  it('has content for exactly the registry levels', () => {
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(Object.keys(GAME_BY_ID['float-sink'].courses.fyzika!).map(Number).sort((a, b) => a - b))
    for (const set of Object.values(LEVELS)) expect(Object.values(set.mix).reduce((a, b) => a + b!, 0)).toBe(ROUND)
    expect(playedLevel('l3')).toBe(3)
    expect(playedLevel('l2')).toBeUndefined()
  })

  for (const lv of Object.keys(LEVELS).map(Number)) {
    it(`L${lv}: rounds have ${ROUND} distinct valid tasks for many seeds`, () => {
      const outcomes = new Set<string>()
      for (let seed = 1; seed < 80; seed++) {
        const round = makeRound(lv, rng(seed))
        expect(round).toHaveLength(ROUND)
        expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
        expect(round.every((t) => t.level === lv)).toBe(true)
        round.forEach(validate)
        round.forEach((t) => outcomes.add(t.outcome))
      }
      expect(outcomes).toEqual(new Set(['plave', 'vznasi', 'klesne']))
    })
  }

  it('mixes both levels in free play, level 1 first', () => {
    const round = makeRound(undefined, rng(5))
    expect(round).toHaveLength(ROUND)
    expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
    expect(round.slice(0, 5).every((t) => t.level === 1)).toBe(true)
    expect(round.slice(5).every((t) => t.level === 3)).toBe(true)
  })

  it('checks numbers with comma, dot and unit', () => {
    const t = makeRound(3, rng(2)).find((x): x is NumberTask => x.answer === 'number')!
    expect(checkNumber('abc', t).kind).toBe('invalid')
    expect(checkNumber(`${String(t.value).replace('.', ',')} ${t.unit}`, t).kind).toBe('ok')
  })
})
