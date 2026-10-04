import { beforeAll, describe, expect, it } from 'vitest'
import { loadView } from '../../geo/load'
import { countryAt } from '../../geo/query'
import { GAME_BY_ID } from '../registry'
import { CITIES, FLIGHTS } from './levels'
import {
  LEVELS,
  checkTyped,
  convert,
  datelineTask,
  dayShift,
  flightTask,
  hm,
  makeRound,
  offsetTask,
  parseMinutes,
  parseTime,
  seeded,
  solarDiff,
  utcText,
  type Task,
} from './logic'

beforeAll(async () => {
  await loadView('world')
})

const sp = (s: string) => s.replace(/ /g, ' ')

describe('time arithmetic', () => {
  it('15° = 1 h, 1° = 4 min', () => {
    expect(solarDiff(0, 15)).toBe(60)
    expect(solarDiff(15, -30)).toBe(-180)
    expect(solarDiff(12.195, 18.2625)).toBeCloseTo(24.27, 2) // Aš → Ostrava ≐ 24 min
  })
  it('zone time through UTC', () => {
    // Praha 10:00 SEČ (UTC+1) → Tokio (UTC+9) = 18:00
    expect(hm(convert(600, 1, 9))).toBe('18:00')
    // Praha 12:00 SELČ (UTC+2) → New York in July (UTC−4) = 6:00
    expect(hm(convert(720, 2, -4))).toBe('6:00')
    // Praha 12:00 SEČ → Nové Dillí (UTC+5:30) = 16:30
    expect(hm(convert(720, 1, 5.5))).toBe('16:30')
    expect(dayShift(convert(22 * 60, 1, 9))).toBe(1)
    expect(dayShift(convert(60, 1, -5))).toBe(-1)
  })
  it('flight from Prague to Tokyo: 10:00 SEČ + 13 h = 7:00 next day', () => {
    // 10:00 SEČ = 9:00 UTC, + 13 h = 22:00 UTC = 7:00 next day in Tokyo
    const m = convert(10 * 60 + 13 * 60, 1, 9)
    expect(hm(m)).toBe('7:00')
    expect(dayShift(m)).toBe(1)
  })
  it('formats offsets', () => {
    expect(utcText(0)).toBe('UTC')
    expect(utcText(5.5)).toBe('UTC+5:30')
    expect(utcText(5.75)).toBe('UTC+5:45')
    expect(utcText(-3)).toBe('UTC−3')
    expect(utcText(3.5)).toBe('UTC+3:30')
  })
  it('parses typed times and minutes', () => {
    expect(parseTime('14:30')).toBe(870)
    expect(parseTime('14.30')).toBe(870)
    expect(parseTime('14,30')).toBe(870)
    expect(parseTime('1430')).toBe(870)
    expect(parseTime('9')).toBe(540)
    expect(parseTime('9:05')).toBe(545)
    expect(parseTime('25:00')).toBeNull()
    expect(parseTime('abc')).toBeNull()
    expect(parseMinutes('24 min')).toBe(24)
    expect(parseMinutes('x')).toBeNull()
  })
})

describe('curated data', () => {
  it('offsets: summer time only one hour more, in the right hemisphere', () => {
    for (const c of CITIES) {
      const d = c.jul - c.jan
      if (c.lat > 0) expect([0, 1], c.name).toContain(d)
      else expect([0, -1], c.name).toContain(d)
      expect(Number.isInteger(c.jan * 4), c.name).toBe(true) // whole hours, halves or quarters
    }
    const praha = CITIES.find((c) => c.name === 'Praha')!
    expect([praha.jan, praha.jul]).toEqual([1, 2])
  })
  it('every city lies in its state on the world map', () => {
    for (const c of CITIES) {
      if (c.code === 'SGP') continue
      let at = countryAt('world', c.lon, c.lat)
      for (let k = 0; !at && k < 8; k++) at = countryAt('world', c.lon + 0.3 * Math.cos(k), c.lat + 0.3 * Math.sin(k))
      expect(at, c.name).toBe(c.code)
    }
  })
  it('flights use known cities', () => {
    for (const [a, b] of FLIGHTS) {
      expect(CITIES.some((c) => c.name === a)).toBe(true)
      expect(CITIES.some((c) => c.name === b)).toBe(true)
    }
  })
})

function valid(t: Task) {
  expect(t.text.length).toBeGreaterThan(10)
  expect(t.why.length).toBeGreaterThan(10)
  expect(t.text).not.toMatch(/undefined|NaN/)
  expect(t.why).not.toMatch(/undefined|NaN/)
  if (t.type === 'choice') {
    expect(t.options.length).toBeGreaterThanOrEqual(3)
    expect(new Set(t.options.map((o) => o.label)).size).toBe(t.options.length)
    expect(t.options.some((o) => o.id === t.answer)).toBe(true)
  } else {
    expect(Number.isFinite(t.answer)).toBe(true)
    const shown = t.type === 'time' ? hm(t.answer) : String(t.answer)
    expect(checkTyped(t, shown).kind).toBe('ok')
  }
}

describe('tasks', () => {
  it('flight answers are computed through UTC', () => {
    for (let s = 1; s <= 40; s++) {
      const f = FLIGHTS[s % FLIGHTS.length]
      const t = flightTask(f, seeded(s))
      const right = sp(t.options.find((o) => o.id === t.answer)!.label)
      const a = CITIES.find((c) => c.name === f[0])!
      const b = CITIES.find((c) => c.name === f[1])!
      const season = t.text.startsWith('V lednu') ? 'jan' : 'jul'
      const dep = Number(sp(t.text).match(/v (\d+):00/)![1]) * 60
      const arr = dep + f[2] * 60 + (b[season] - a[season]) * 60
      expect(right.startsWith(hm(arr) + ' ')).toBe(true)
    }
  })
  it('date line: westwards one day later, eastwards one day earlier', () => {
    for (let s = 1; s <= 30; s++) {
      const t = datelineTask(seeded(s))
      const right = t.options.find((o) => o.id === t.answer)!.label
      expect(t.why).toContain('→ ' + right)
    }
  })
  it('offset tasks give the legal offset of the month', () => {
    for (let s = 1; s <= 20; s++)
      for (const c of CITIES) {
        const t = offsetTask(c, seeded(s))
        const right = t.options.find((o) => o.id === t.answer)!.label
        expect(right).toBe(utcText(t.text.includes('v lednu') ? c.jan : c.jul))
      }
  })
  it('registry levels match the content', () => {
    expect(Object.keys(GAME_BY_ID['time-zones'].courses.zemepis ?? {}).map(Number)).toEqual(Object.keys(LEVELS).map(Number))
  })
  for (const level of [2, undefined])
    it(`level ${level ?? 'mix'}: 8–12 valid tasks, no duplicates`, () => {
      for (let s = 1; s <= 60; s++) {
        const r = makeRound(level, seeded(s))
        expect(r.length).toBeGreaterThanOrEqual(8)
        expect(r.length).toBeLessThanOrEqual(12)
        expect(new Set(r.map((t) => t.key)).size).toBe(r.length)
        r.forEach(valid)
      }
    })
})
