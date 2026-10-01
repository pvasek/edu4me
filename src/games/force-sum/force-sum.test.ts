import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import {
  ANGLE_TOL,
  LEVEL_NUMBERS,
  ROUND,
  angleDiff,
  balancing,
  checkNumber,
  component,
  directionChoices,
  inclineParts,
  judgeVector,
  makeRound,
  parseAngle,
  playedLevel,
  resultant,
  slotsFor,
  sumVec,
  tolerance,
  toVec,
  type Task,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('force-sum physics', () => {
  it('adds collinear forces', () => {
    const r = resultant([
      { mag: 300, angle: 0 },
      { mag: 120, angle: 0 },
      { mag: 250, angle: 180 },
    ])
    expect(r.mag).toBeCloseTo(170, 9)
    expect(r.angle).toBeCloseTo(0, 9)
    expect(resultant([{ mag: 50, angle: 90 }, { mag: 50, angle: 270 }]).mag).toBeCloseTo(0, 9)
  })

  it('adds perpendicular forces with Pythagoras (3-4-5)', () => {
    const r = resultant([
      { mag: 3, angle: 0 },
      { mag: 4, angle: 90 },
    ])
    expect(r.mag).toBeCloseTo(5, 9)
    expect(r.angle).toBeCloseTo(53.13, 2)
  })

  it('uses the law of cosines for forces at an angle', () => {
    const r = resultant([
      { mag: 200, angle: 0 },
      { mag: 100, angle: 60 },
    ])
    expect(r.mag).toBeCloseTo(Math.sqrt(200 ** 2 + 100 ** 2 + 2 * 200 * 100 * Math.cos(Math.PI / 3)), 9)
  })

  it('balancing force closes the polygon', () => {
    const fs = [
      { mag: 60, angle: 10 },
      { mag: 80, angle: 110 },
    ]
    const b = balancing(fs)
    const s = sumVec([...fs, b])
    expect(Math.abs(s.x)).toBeLessThan(1e-9)
    expect(Math.abs(s.y)).toBeLessThan(1e-9)
    expect(angleDiff(b.angle, resultant(fs).angle)).toBeCloseTo(180, 9)
  })

  it('resolves components and the incline', () => {
    expect(component({ mag: 100, angle: 30 }, 'x')).toBeCloseTo(86.60, 2)
    expect(component({ mag: 100, angle: 30 }, 'y')).toBeCloseTo(50, 9)
    const p = inclineParts(20, 30)
    expect(p.weight).toBeCloseTo(196.2, 9)
    expect(p.par).toBeCloseTo(98.1, 9)
    expect(p.perp).toBeCloseTo(169.91, 2)
    expect(toVec({ mag: 10, angle: 90 }).x).toBe(0)
  })

  it('checks numbers with ±2 % tolerance, comma or dot and a unit', () => {
    expect(tolerance(100)).toBeCloseTo(2, 9)
    expect(tolerance(0)).toBeCloseTo(0.05, 9)
    expect(checkNumber('98,1', 98.1).kind).toBe('ok')
    expect(checkNumber('96.5', 98.1).kind).toBe('ok')
    expect(checkNumber('95', 98.1).kind).toBe('wrong')
    expect(checkNumber('98 N', 98.1).kind).toBe('ok')
    expect(checkNumber('2,04 kN', 2.04).kind).toBe('ok')
    expect(checkNumber('abc', 1).kind).toBe('invalid')
    expect(parseAngle('-90')).toBe(270)
    expect(parseAngle('45,5°')).toBe(45.5)
  })

  it('judges magnitude and direction', () => {
    const a = { mag: 50, angle: 233.13 }
    expect(judgeVector(50, 235, a)).toBe('ok')
    expect(judgeVector(50, 233.13 + ANGLE_TOL + 1, a)).toBe('wrong-dir')
    expect(judgeVector(40, 233, a)).toBe('wrong-mag')
    expect(judgeVector(40, 10, a)).toBe('wrong-both')
    // zero resultant: direction does not matter
    expect(judgeVector(0, null, { mag: 0, angle: 0 })).toBe('ok')
    // 359° and 1° are 2° apart
    expect(judgeVector(5, 359, { mag: 5, angle: 1 })).toBe('ok')
  })

  it('direction choices contain the answer once and are clearly different', () => {
    for (let seed = 1; seed < 200; seed++) {
      const r = rng(seed)
      const correct = r() * 360
      const ch = directionChoices(correct, [{ mag: 1, angle: 0 }], r)
      expect(ch).toHaveLength(4)
      expect(ch.filter((c) => angleDiff(c, correct) <= ANGLE_TOL)).toHaveLength(1)
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) expect(angleDiff(ch[i], ch[j])).toBeGreaterThanOrEqual(25)
    }
  })
})

function validate(t: Task) {
  expect(t.text.length).toBeGreaterThan(10)
  if (t.kind === 'resultant' || t.kind === 'balance') {
    for (const f of t.forces) {
      expect(f.mag).toBeGreaterThan(0)
      expect(f.angle).toBeGreaterThanOrEqual(0)
      expect(f.angle).toBeLessThan(360)
    }
    const r = resultant(t.forces)
    if (t.kind === 'resultant') {
      expect(t.answer.mag).toBeCloseTo(r.mag, 5)
      if (r.mag > 1e-6) expect(angleDiff(t.answer.angle, r.angle)).toBeLessThan(0.6)
      expect(t.choices).toHaveLength(4)
      if (t.answer.mag > 0) expect(t.choices.filter((c) => angleDiff(c, t.answer.angle) <= ANGLE_TOL)).toHaveLength(1)
    } else {
      expect(t.answer.mag).toBeGreaterThan(0)
      const closed = sumVec([...t.forces, t.answer])
      expect(Math.hypot(closed.x, closed.y)).toBeLessThan(t.answer.mag * 0.01)
      if (t.axisOnly) expect([0, 90, 180, 270]).toContain(t.answer.angle)
    }
    if (t.level === 2) expect(Number.isInteger(t.answer.mag)).toBe(true)
  } else if (t.kind === 'component') {
    expect(t.answer).toBeCloseTo(component(t.force, t.axis), 5)
    expect(t.answer).toBeGreaterThan(0)
  } else {
    const p = inclineParts(t.mass, t.alpha)
    const k = t.unit === 'kN' ? 1000 : 1
    expect(t.answer).toBeCloseTo((t.part === 'par' ? p.par : p.perp) / k, 5)
    expect(t.answer).toBeLessThan(t.weight)
  }
}

describe('force-sum rounds', () => {
  it('has content for exactly the registry levels', () => {
    expect([...LEVEL_NUMBERS]).toEqual(Object.keys(GAME_BY_ID['force-sum'].courses.fyzika!).map(Number).sort((a, b) => a - b))
    expect(playedLevel('l8')).toBe(8)
    expect(playedLevel('l5')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })

  for (const lv of LEVEL_NUMBERS) {
    it(`L${lv}: every slot generates valid tasks for many seeds`, () => {
      const slots = slotsFor(lv)
      expect(slots.length).toBeGreaterThanOrEqual(ROUND)
      for (const s of slots) for (let seed = 1; seed < 60; seed++) validate(s.build(rng(seed * 7 + lv)))
    })

    it(`L${lv}: rounds have ${ROUND} distinct tasks of the level and mix task types`, () => {
      for (let seed = 1; seed < 40; seed++) {
        const round = makeRound(lv, rng(seed))
        expect(round).toHaveLength(ROUND)
        expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
        expect(round.every((t) => t.level === lv)).toBe(true)
        expect(new Set(round.map((t) => t.kind)).size).toBeGreaterThanOrEqual(2)
        round.forEach(validate)
      }
    })
  }

  it('mixes both levels in free play', () => {
    const round = makeRound(undefined, rng(3))
    expect(round).toHaveLength(ROUND)
    expect(new Set(round.map((t) => t.key)).size).toBe(ROUND)
    expect(round.filter((t) => t.level === 2)).toHaveLength(ROUND / 2)
    expect(round.filter((t) => t.level === 8)).toHaveLength(ROUND / 2)
  })
})
