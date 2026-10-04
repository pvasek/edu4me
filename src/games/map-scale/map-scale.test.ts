import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { CLASS_SCALES, PURPOSES } from './levels'
import {
  LEVELS,
  MAP_H,
  MAP_W,
  ROUND,
  RULER_CM,
  barLabels,
  checkNumber,
  cmEqualsTask,
  convert,
  denominatorTask,
  dist,
  fmt,
  largerTask,
  makeRound,
  mapDistance,
  parseNum,
  purposeTask,
  realDistance,
  routeCm,
  rulerTask,
  scaleText,
  seeded,
  toMapTask,
  toRealTask,
} from './logic'

describe('map-scale conversions', () => {
  it('converts map ↔ real distances', () => {
    expect(realDistance(4, 50_000, 'km')).toBeCloseTo(2, 9)
    expect(realDistance(1, 50_000, 'm')).toBeCloseTo(500, 9)
    expect(realDistance(3.5, 10_000, 'm')).toBeCloseTo(350, 9)
    expect(mapDistance(3, 'km', 25_000)).toBeCloseTo(12, 9)
    expect(mapDistance(750, 'm', 25_000)).toBeCloseTo(3, 9)
    expect(convert(2, 'km', 'cm')).toBe(200_000)
  })

  it('formats Czech numbers and scales', () => {
    expect(fmt(50_000)).toBe('50 000')
    expect(fmt(1603)).toBe('1 603')
    expect(fmt(2.5)).toBe('2,5')
    expect(fmt(0.25)).toBe('0,25')
    expect(scaleText(25_000)).toBe('1 : 25 000')
  })

  it('parses answers with spaces, commas and units', () => {
    expect(parseNum('2,5')).toBe(2.5)
    expect(parseNum('2.5 km')).toBe(2.5)
    expect(parseNum('50 000')).toBe(50_000)
    expect(parseNum('1 : 50 000')).toBe(50_000)
    expect(parseNum('500 m')).toBe(500)
    expect(parseNum('abc')).toBeNull()
  })

  it('computes the answers of the number tasks', () => {
    expect(cmEqualsTask(50_000)).toMatchObject({ answer: 500, unit: 'm' })
    expect(cmEqualsTask(1_000_000)).toMatchObject({ answer: 10, unit: 'km' })
    expect(cmEqualsTask(50_000).why).toBe('1 cm na mapě = 50 000 cm = 500 m.')
    expect(denominatorTask(200_000).answer).toBe(200_000)
    expect(toRealTask(50_000, 4)).toMatchObject({ answer: 2, unit: 'km' })
    expect(toRealTask(10_000, 3)).toMatchObject({ answer: 300, unit: 'm' })
    expect(toMapTask(25_000, 3).answer).toBe(3)
    expect(toMapTask(25_000, 3).text).toContain('750 m')
  })

  it('checks with tolerance and flags unit mix-ups', () => {
    const t = toRealTask(50_000, 4)
    expect(checkNumber('2', t).kind).toBe('ok')
    expect(checkNumber('2,0 km', t).kind).toBe('ok')
    expect(checkNumber('2000', t)).toMatchObject({ kind: 'wrong', units: true })
    expect(checkNumber('3', t)).toMatchObject({ kind: 'wrong', units: false })
    expect(checkNumber('x', t).kind).toBe('invalid')
  })
})

describe('map-scale choice tasks', () => {
  it('larger scale = smaller denominator', () => {
    expect(largerTask(10_000, 200_000, 'detail').answer).toBe('a')
    expect(largerTask(10_000, 200_000, 'area').answer).toBe('b')
    expect(largerTask(500_000, 25_000, 'detail').answer).toBe('b')
  })

  it('every purpose has exactly one fitting option', () => {
    PURPOSES.forEach((p, i) => {
      const t = purposeTask(i, seeded(i + 1))
      expect(t.options.map((o) => o.id).sort()).toEqual(Object.keys(CLASS_SCALES).sort())
      expect(t.answer).toBe(p.cls)
    })
  })

  it('scale bars label their 1-cm segments', () => {
    expect(barLabels({ segCm: 50_000 })).toEqual(['0', '500', '1 000', '1 500', '2 000 m'])
    expect(barLabels({ segCm: 200_000 })).toEqual(['0', '2', '4', '6', '8\u00a0km'])
    expect(barLabels({ segCm: 25_000 })).toEqual(['0', '250', '500', '750', '1 000 m'])
  })
})

describe('map-scale ruler', () => {
  it('places the points inside the map and the route within the ruler', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const rng = seeded(seed)
      const t = rulerTask(50_000, seed % 2 === 0, rng)
      const pts = [t.map.a, t.map.b, ...(t.map.via ? [t.map.via] : [])]
      for (const p of pts) {
        expect(p.x).toBeGreaterThan(0.5)
        expect(p.x).toBeLessThan(MAP_W - 0.5)
        expect(p.y).toBeGreaterThan(0.5)
        expect(p.y).toBeLessThan(MAP_H - 0.5)
      }
      // each measured segment fits on the ruler
      if (t.map.via) {
        expect(dist(t.map.a, t.map.via)).toBeLessThanOrEqual(RULER_CM)
        expect(dist(t.map.via, t.map.b)).toBeLessThanOrEqual(RULER_CM)
      } else expect(dist(t.map.a, t.map.b)).toBeLessThanOrEqual(RULER_CM)
      expect(t.cm).toBeCloseTo(routeCm(t.map), 9)
      expect(t.answer).toBeCloseTo(realDistance(t.cm, 50_000, 'km'), 9)
    }
  })

  it('accepts a reading within ±2 mm and rejects 5 mm off', () => {
    const t = rulerTask(25_000, false, seeded(7))
    const at = (cm: number) => String(realDistance(cm, 25_000, t.unit))
    expect(checkNumber(at(t.cm + 0.18), t).kind).toBe('ok')
    expect(checkNumber(at(t.cm - 0.18), t).kind).toBe('ok')
    expect(checkNumber(at(t.cm + 0.5), t).kind).toBe('wrong')
  })
})

describe('map-scale rounds', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID['map-scale'].courses.zemepis!).map(Number))
  })

  it('builds valid rounds without duplicates', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const r = makeRound(seeded(seed))
      expect(r.length).toBe(ROUND)
      expect(new Set(r.map((t) => t.key)).size).toBe(ROUND)
      for (const t of r) {
        expect(t.text.length).toBeGreaterThan(10)
        expect(t.why.length).toBeGreaterThan(10)
        if (t.type === 'choice') {
          const ids = t.options.map((o) => o.id)
          expect(new Set(ids).size).toBe(ids.length)
          expect(ids.filter((id) => id === t.answer).length).toBe(1)
          expect(new Set(t.options.map((o) => o.label)).size).toBe(ids.length)
        } else {
          expect(Number.isFinite(t.answer) && t.answer > 0).toBe(true)
          expect(checkNumber(String(t.answer).replace('.', ','), t).kind).toBe('ok')
        }
      }
    }
  })
})
