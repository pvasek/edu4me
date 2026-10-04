import { describe, expect, it } from 'vitest'
import { climateStats } from '../../illustrations/geography/charts'
import { GAME_BY_ID } from '../registry'
import { STATIONS, STATION_BY_ID } from './data'
import { LEVELS } from './levels'
import { ROUND, checkNumber, dryCount, irrigationOf, koppen, makeRound, playedLevel, type NumberTask } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const st = (id: string) => STATION_BY_ID[id]

describe('climate-chart data', () => {
  it('has a content set for every level the registry lists', () => {
    const listed = Object.keys(GAME_BY_ID['climate-chart'].courses.zemepis ?? {}).map(Number)
    expect(Object.keys(LEVELS).map(Number).sort((a, b) => a - b)).toEqual(listed)
  })

  it('has about 30 stations with 12 plausible monthly values, unique ids and names', () => {
    expect(STATIONS.length).toBeGreaterThanOrEqual(28)
    expect(new Set(STATIONS.map((s) => s.id)).size).toBe(STATIONS.length)
    expect(new Set(STATIONS.map((s) => s.name)).size).toBe(STATIONS.length)
    for (const s of STATIONS) {
      expect(s.temp).toHaveLength(12)
      expect(s.precip).toHaveLength(12)
      for (const t of s.temp) expect(t > -50 && t < 40, s.id).toBe(true)
      for (const p of s.precip) expect(p >= 0 && p < 1000, s.id).toBe(true)
      expect(s.ref).toMatch(/^https:\/\//)
      expect(s.source).toMatch(/1991–2020/)
    }
  })

  it('matches the yearly values of the source tables (transcription check)', () => {
    // [station, yearly mean °C or null, yearly total mm] as printed in the source table
    const yearly: [string, number | null, number][] = [
      ['manaus', 27.4, 2362],
      ['praha', 11.5, 454],
      ['brno', 10.3, 522],
      ['snezka', 1.4, 1091],
      ['singapur', null, 2113],
      ['kahira', 22.5, 25],
      ['reykjavik', 5.1, 876],
      ['alice-springs', null, 275],
      ['new-york', null, 1258],
      ['chicago', 10.7, 962],
      ['tokio', null, 1598],
      ['ulanbatar', 0.2, 273],
      ['verchojansk', null, 182],
    ]
    for (const [id, t, p] of yearly) {
      const s = climateStats(st(id))
      if (t !== null) expect(Math.abs(s.meanT - t), id).toBeLessThanOrEqual(0.1)
      expect(Math.abs(s.totalP - p), id).toBeLessThanOrEqual(2)
    }
  })
})

describe('climate-chart logic', () => {
  it('classifies the textbook examples (simplified Köppen)', () => {
    expect(koppen(st('manaus')).main).toBe('A')
    expect(koppen(st('singapur')).main).toBe('A')
    expect(koppen(st('kahira'))).toMatchObject({ main: 'B', arid: 'BW', robust: true })
    expect(koppen(st('alice-springs'))).toMatchObject({ main: 'B', arid: 'BW' })
    expect(koppen(st('niamey'))).toMatchObject({ main: 'B', arid: 'BS' })
    expect(koppen(st('praha'))).toMatchObject({ main: 'C', season: 'f' })
    expect(koppen(st('londyn'))).toMatchObject({ main: 'C', season: 'f', robust: true })
    expect(koppen(st('reykjavik'))).toMatchObject({ main: 'C', robust: true })
    expect(koppen(st('rim'))).toMatchObject({ main: 'C', season: 's' })
    expect(koppen(st('kapske-mesto'))).toMatchObject({ main: 'C', season: 's' })
    expect(koppen(st('moskva'))).toMatchObject({ main: 'D', robust: true })
    expect(koppen(st('jakutsk')).main).toBe('D')
    expect(koppen(st('utqiagvik'))).toMatchObject({ main: 'E', robust: true })
    // borderline places stay out of the type tasks
    expect(koppen(st('snezka')).robust).toBe(false) // warmest month 9,9 °C
    expect(koppen(st('brno')).robust).toBe(false) // coldest −0,4 °C: C or D by convention
    expect(koppen(st('peking')).robust).toBe(false)
    // Klementinum: 454 mm with 69 % in the summer half lies at the Köppen dryness threshold
    expect(koppen(st('praha')).robust).toBe(false)
  })

  it('counts dry months the Walter–Lieth way and judges irrigation', () => {
    expect(dryCount(st('kahira'))).toBe(12)
    expect(dryCount(st('singapur'))).toBe(0)
    expect(irrigationOf(st('kahira'))).toBe('year')
    expect(irrigationOf(st('singapur'))).toBe('none')
    expect(irrigationOf(st('rim'))).toBe('season')
    expect(irrigationOf(st('praha'))).toBeUndefined() // April is a borderline month
  })

  it('accepts numbers with a comma, a unit or a minus sign', () => {
    const t = { mode: 'number', value: 19.8, tol: 1.5, unit: '°C', digits: 1 } as NumberTask
    expect(checkNumber('19,8', t).kind).toBe('ok')
    expect(checkNumber('21 °C', t).kind).toBe('ok')
    expect(checkNumber('22', t).kind).toBe('wrong')
    expect(checkNumber('hodně', t).kind).toBe('invalid')
  })

  for (const lv of [...Object.keys(LEVELS).map(Number), undefined]) {
    it(`level ${lv ?? 'mix'}: every round has ${ROUND} valid tasks without duplicates`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const tasks = makeRound(lv, rng(seed))
        expect(tasks.length).toBeGreaterThanOrEqual(8)
        expect(tasks.length).toBeLessThanOrEqual(12)
        expect(new Set(tasks.map((t) => t.key)).size).toBe(tasks.length)
        const ids = tasks.flatMap((t) => t.stations)
        expect(new Set(ids).size).toBe(ids.length)
        for (const t of tasks) {
          expect(t.text.length).toBeGreaterThan(10)
          expect(t.why.length).toBeGreaterThan(10)
          for (const id of t.stations) expect(STATION_BY_ID[id]).toBeDefined()
          if (lv !== undefined) expect(t.level).toBe(lv)
          if (t.mode === 'choice') {
            expect(t.options.map((o) => o.id)).toContain(t.answer)
            expect(new Set(t.options.map((o) => o.id)).size).toBe(t.options.length)
            expect(new Set(t.options.map((o) => o.label)).size).toBe(t.options.length)
          }
          if (t.mode === 'month') expect(t.answer.every((m) => m >= 0 && m < 12)).toBe(true)
          if (t.mode === 'number') expect(Number.isFinite(t.value)).toBe(true)
        }
      }
    }, 30000)
  }

  it('plays the level of the lesson, or mixes in free play', () => {
    expect(playedLevel('l4')).toBe(4)
    expect(playedLevel('l5')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })
})
