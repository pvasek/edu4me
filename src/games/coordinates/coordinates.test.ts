import { beforeAll, describe, expect, it } from 'vitest'
import { getView } from '../../geo/frame'
import { loadView } from '../../geo/load'
import { countryAt } from '../../geo/query'
import type { MapView } from '../../core/types'
import { inFrame } from '../blind-map/hit'
import { GAME_BY_ID } from '../registry'
import { NEAR, POLAR, WORLD } from './levels'
import {
  LEVELS,
  PLAN,
  beyondPolarCircle,
  coordText,
  degMin,
  further,
  gradePlace,
  latText,
  lineMargin,
  lonText,
  makeRound,
  seeded,
  zenithPossible,
  zoneOf,
  type Task,
} from './logic'

const VIEWS: MapView[] = ['world', 'europe', 'central-europe', 'czechia', 'africa', 'asia', 'middle-east', 'north-america', 'latin-america', 'oceania', 'arctic', 'antarctica']
beforeAll(async () => {
  await Promise.all(VIEWS.map((v) => loadView(v)))
})

/** The state at a place, or the one within ~0.3° (coastal cities fall into the sea on simplified coasts). */
function stateNear(view: MapView, lon: number, lat: number): string | undefined {
  const at = countryAt(view, lon, lat)
  if (at) return at
  for (const r of [0.1, 0.2, 0.3])
    for (let k = 0; k < 8; k++) {
      const c = countryAt(view, lon + r * Math.cos((k * Math.PI) / 4), lat + r * Math.sin((k * Math.PI) / 4))
      if (c) return c
    }
  return undefined
}

const sp = (s: string) => s.replace(/\u00a0/g, ' ')

describe('coordinates notation', () => {
  it('writes Czech coordinates', () => {
    expect(sp(coordText(50.0875, 14.4214, true))).toBe('50° 05′ s. š., 14° 25′ v. d.')
    expect(sp(coordText(-33.87, 151.21))).toBe('34° j. š., 151° v. d.')
    expect(sp(coordText(40.7, -74))).toBe('41° s. š., 74° z. d.')
    expect(latText(0)).toBe('0°')
    expect(lonText(-0.1278)).toBe('0°')
    expect(degMin(49.9999)).toEqual([50, 0])
  })
  it('heat zones, zenith and polar circle', () => {
    expect(zoneOf(50)).toBe('temperate-n')
    expect(zoneOf(1.3)).toBe('tropical')
    expect(zoneOf(-34)).toBe('temperate-s')
    expect(zoneOf(78)).toBe('polar-n')
    expect(zoneOf(-77.8)).toBe('polar-s')
    expect(zenithPossible(23.4)).toBe(true)
    expect(zenithPossible(23.5)).toBe(false)
    expect(beyondPolarCircle(66.5039)).toBe(false) // Rovaniemi
    expect(beyondPolarCircle(69.65)).toBe(true) // Tromsø
  })
  it('further north / east', () => {
    const lima = WORLD.find((p) => p.name === 'Lima')!
    const syd = WORLD.find((p) => p.name === 'Sydney')!
    expect(further(lima, syd, 'north')).toBe(lima)
    const rome = WORLD.find((p) => p.name === 'Řím')!
    const madrid = WORLD.find((p) => p.name === 'Madrid')!
    expect(further(rome, madrid, 'east')).toBe(rome)
    expect(further(rome, madrid, 'north')).toBeNull() // only 1,5° apart: not a fair question
  })
  it('grades taps', () => {
    expect(gradePlace(5, 10)).toBe('hit')
    expect(gradePlace(15, 10)).toBe('near')
    expect(gradePlace(25, 10)).toBe('miss')
  })
})

describe('curated places', () => {
  it('every place lies in its state on the map data', () => {
    for (const p of [...WORLD, ...NEAR, ...POLAR]) {
      if (p.code === 'SGP') continue // a city state: a marker on the 1:50m world map
      const v: MapView = 'view' in p && p.view ? p.view : 'world'
      expect(stateNear(v, p.lon, p.lat), `${p.name} on ${v}`).toBe(p.code)
    }
  })
  it('places lie inside their views', () => {
    for (const p of [...WORLD.filter((x) => x.view), ...NEAR, ...POLAR]) expect(inFrame(p.view!, p.lon, p.lat, getView(p.view!).H, 20), p.name).toBe(true)
  })
})

function check(t: Task) {
  expect(t.text.length).toBeGreaterThan(10)
  expect(t.why.length).toBeGreaterThan(10)
  if (t.type === 'choice') {
    expect(t.options.length).toBeGreaterThanOrEqual(2)
    expect(new Set(t.options.map((o) => o.label)).size, t.key).toBe(t.options.length)
    expect(t.options.some((o) => o.id === t.answer)).toBe(true)
  } else {
    expect(t.cands.length).toBe(4)
    expect(t.cands[t.candAnswer]).toEqual([t.target.lon, t.target.lat])
    for (const [lon, lat] of t.cands) expect(inFrame(t.view, lon, lat, getView(t.view).H, 0), t.key).toBe(true)
  }
}

describe('rounds', () => {
  it('registry levels match the content', () => {
    const lv = Object.keys(GAME_BY_ID['coordinates'].courses.zemepis ?? {}).map(Number)
    expect(lv.sort()).toEqual(Object.keys(LEVELS).map(Number).sort())
    expect(Object.keys(PLAN).length).toBe(3)
  })
  for (const level of [1, 2, undefined])
    it(`level ${level ?? 'mix'}: 8–12 valid tasks, no duplicates`, () => {
      for (let s = 1; s <= 40; s++) {
        const r = makeRound(level, seeded(s))
        expect(r.length).toBeGreaterThanOrEqual(8)
        expect(r.length).toBeLessThanOrEqual(12)
        expect(new Set(r.map((t) => t.key)).size).toBe(r.length)
        r.forEach(check)
      }
    })
  it('answers are right', () => {
    for (let s = 1; s <= 30; s++)
      for (const t of makeRound(undefined, seeded(s))) {
        if (t.type !== 'choice') continue
        const right = t.options.find((o) => o.id === t.answer)!.label
        if (t.key.startsWith('read:')) {
          const p = WORLD.find((x) => 'read:' + x.name === t.key)!
          expect(right).toBe(coordText(Math.round(p.lat), Math.round(p.lon)))
        }
        if (t.key.startsWith('zone:')) {
          const p = WORLD.find((x) => 'zone:' + x.name === t.key)!
          expect(lineMargin(p.lat)).toBeGreaterThanOrEqual(1)
        }
        if (t.key.startsWith('dm:')) {
          const p = NEAR.find((x) => 'dm:' + x.name === t.key)!
          expect(right).toBe(coordText(p.lat, p.lon, true))
        }
      }
  })
})
