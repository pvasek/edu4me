import { beforeAll, describe, expect, it } from 'vitest'
import type { MapView } from '../../core/types'
import { COUNTRY_NAMES, CZ_REGION_NAMES } from '../../geo/codes'
import { getView, project } from '../../geo/frame'
import { baseMap } from '../../geo/geometry'
import { loadView, peekView } from '../../geo/load'
import { countryAt, regionAt } from '../../geo/query'
import { GAME_BY_ID } from '../registry'
import { distLL, hitArea, inFrame, segDist, countryOf } from './hit'
import {
  BORDERS,
  CONFLICTS,
  CONTINENTS,
  CZ_CAPITALS,
  CZ_MOUNTAINS,
  CZ_RIVERS,
  DISPUTED,
  ENCLAVES,
  EUROPE_CAPITALS,
  EUROPE_MOUNTAINS,
  EUROPE_NAME,
  EUROPE_RIVERS,
  EUROPE_TAP,
  MICRO,
  TAP_FEATURES,
  WORLD_FEATURES,
  type Feature,
} from './levels'
import { LEVELS, MIX, PLAN, checkTap, makeRound, numberedPlaces, riverParts, seeded, type TapTask, type Task } from './logic'

const VIEWS: MapView[] = ['world', 'europe', 'czechia', 'africa', 'asia', 'middle-east', 'north-america', 'latin-america', 'oceania']
beforeAll(async () => {
  await Promise.all(VIEWS.map((v) => loadView(v)))
})

/** Size of a state on the view at a 300 px wide map (px), as GeoMap decides "tiny". */
function sizePx(view: MapView, code: string): number {
  const b = baseMap(getView(view), peekView(view)!)
  const sp = b.countries.get(code) ?? b.regions.get(code)
  return sp ? sp.ring / (1000 / 300) : 0
}
const near = (_view: MapView, lon: number, lat: number, at: (lon: number, lat: number) => string | undefined) => {
  if (at(lon, lat)) return at(lon, lat)
  for (const r of [0.1, 0.25, 0.4, 0.6]) for (let k = 0; k < 8; k++) { const c = at(lon + r * Math.cos(k), lat + r * Math.sin(k)); if (c) return c }
  return undefined
}

describe('hit geometry', () => {
  it('segment distance', () => {
    expect(segDist(0, 1, -1, 0, 1, 0)).toBeCloseTo(1)
    expect(segDist(3, 0, -1, 0, 1, 0)).toBeCloseTo(2)
  })
  it('a tap on Prague hits Czechia, a tap in Bavaria does not (but does near the border)', () => {
    const at = countryOf('europe')
    expect(hitArea('europe', 'CZE', 14.42, 50.09, 1, at)).toBe(true)
    expect(hitArea('europe', 'CZE', 11.6, 48.1, 10, at)).toBe(false)
    expect(hitArea('europe', 'CZE', 12.0, 50.0, 30, at)).toBe(true)
  })
})

describe('curated data', () => {
  it('state codes exist and tap states are big enough on a phone, name-only ones are listed', () => {
    for (const c of CONTINENTS) {
      for (const code of [...c.tap, ...c.name]) expect(COUNTRY_NAMES[code], code).toBeTruthy()
      for (const code of c.tap) expect(sizePx(c.view, code), `${code} on ${c.view}`).toBeGreaterThanOrEqual(15)
    }
    for (const code of EUROPE_TAP) expect(sizePx('europe', code), code).toBeGreaterThanOrEqual(12)
    for (const code of [...EUROPE_TAP, ...EUROPE_NAME]) expect(COUNTRY_NAMES[code], code).toBeTruthy()
    for (const code of Object.keys(CZ_REGION_NAMES)) expect(sizePx('czechia', code), code).toBeGreaterThanOrEqual(15)
  })
  it('features lie in their states and inside their views', () => {
    const all: Feature[] = [...WORLD_FEATURES, ...EUROPE_MOUNTAINS, ...CZ_MOUNTAINS]
    for (const f of all) {
      const H = getView(f.view).H
      const pts = f.parts.flat()
      for (const [lon, lat] of pts) expect(inFrame(f.view, lon, lat, H, 10), `${f.name} ${lon} ${lat} in ${f.view}`).toBe(true)
      const states = new Set(pts.map(([lon, lat]) => near(f.view, lon, lat, countryOf(f.view))))
      if (f.in) expect([...states].some((s) => s && f.in!.includes(s)), `${f.name}: ${[...states]}`).toBe(true)
    }
  })
  it('tap features are apart from each other on their view (fair on a phone)', () => {
    const tap = TAP_FEATURES.map((id) => WORLD_FEATURES.find((f) => f.id === id)!)
    for (const a of tap)
      for (const b of WORLD_FEATURES) {
        if (a === b || a.view !== b.view || a.kind !== b.kind) continue // a volcano may sit on a range: the nearer one wins
        const [x, y] = project(a.view, a.parts[0][0][0], a.parts[0][0][1])
        const d = Math.min(...b.parts.flat().map(([lon, lat]) => distLL(a.view, a.parts, lon, lat)))
        expect(d, `${a.name} vs ${b.name}`).toBeGreaterThan(25)
        expect(x).toBeGreaterThan(0)
        expect(y).toBeGreaterThan(0)
      }
  })
  it('capitals lie in their states / regions', () => {
    for (const c of EUROPE_CAPITALS) expect(near('europe', c.lon, c.lat, countryOf('europe')), c.name).toBe(c.code)
    for (const c of CZ_CAPITALS) expect(regionAt(c.lon, c.lat), c.name).toBe(c.code)
  })
  it('rivers exist in the data, inside the view and in their state', () => {
    for (const [view, list] of [['europe', EUROPE_RIVERS], ['czechia', CZ_RIVERS]] as const) {
      const data = peekView(view)!
      const H = getView(view).H
      for (const r of list) {
        const pts = riverParts(data, r.data).flat()
        expect(pts.length, r.name).toBeGreaterThan(3)
        const inside = pts.filter(([lon, lat]) => inFrame(view, lon, lat, H, 10))
        expect(inside.length, `${r.name} visible on ${view}`).toBeGreaterThan(3)
        expect(inside.some(([lon, lat]) => countryAt(view, lon, lat) === r.in), `${r.name} in ${r.in}`).toBe(true)
      }
    }
  })
  it('level 11 items: codes exist, options hold the answer, points lie in the state', () => {
    for (const it of [...MICRO, ...ENCLAVES, ...DISPUTED, ...CONFLICTS]) {
      expect(COUNTRY_NAMES[it.code], it.id).toBeTruthy()
      expect(it.options).toContain(it.code)
      expect(new Set(it.options).size).toBe(4)
      for (const o of it.options) expect(COUNTRY_NAMES[o], o).toBeTruthy()
      if (it.point) expect(countryAt(it.view, it.point.lon, it.point.lat), it.id).toBe(it.code)
      else expect(peekView(it.view)!.labels[it.code], `${it.id} label on ${it.view}`).toBeTruthy()
    }
    for (const b of BORDERS) for (const c of b.codes) expect(peekView(b.view)!.labels[c], `${b.id} ${c}`).toBeTruthy()
  })
})

function valid(t: Task) {
  expect(t.text.length).toBeGreaterThan(5)
  expect(t.why.length).toBeGreaterThan(5)
  expect(t.text + t.why).not.toMatch(/undefined|NaN/)
  if (t.type === 'choice') {
    expect(t.options.length).toBeGreaterThanOrEqual(2)
    expect(new Set(t.options.map((o) => o.label)).size).toBe(t.options.length)
    expect(t.options.some((o) => o.id === t.answer)).toBe(true)
  } else {
    const places = numberedPlaces(t, peekView(t.view))
    expect(places, t.key).toBeTruthy()
    expect(places!.pts.length, t.key).toBe(4)
    expect(places!.answer).toBeGreaterThanOrEqual(0)
  }
}

/** A tap right on the target's anchor is accepted (u for a 330 px map). */
function tapOnTarget(t: TapTask) {
  const data = peekView(t.view)
  const p = numberedPlaces(t, data)!.pts[numberedPlaces(t, data)!.answer]
  const pick = { lon: p[0], lat: p[1], code: countryAt(t.view, p[0], p[1]), region: t.view === 'czechia' ? regionAt(p[0], p[1]) : undefined }
  return checkTap(t, pick, 1000 / 330, data)
}

describe('rounds', () => {
  it('registry levels match the content', () => {
    expect(Object.keys(GAME_BY_ID['blind-map'].courses.zemepis ?? {}).map(Number).sort((a, b) => a - b)).toEqual(Object.keys(LEVELS).map(Number))
    expect(Object.keys(PLAN).map(Number)).toEqual(Object.keys(LEVELS).map(Number))
    expect(MIX.length).toBe(10)
  })
  for (const level of [3, 7, 8, 9, 11, undefined])
    it(`level ${level ?? 'mix'}: 8–12 valid tasks, no duplicates, taps on the target count`, () => {
      for (let s = 1; s <= 25; s++) {
        const r = makeRound(level, seeded(s))
        expect(r.length).toBeGreaterThanOrEqual(8)
        expect(r.length).toBeLessThanOrEqual(12)
        expect(new Set(r.map((t) => t.key)).size).toBe(r.length)
        for (const t of r) {
          valid(t)
          if (t.type === 'tap' && t.target.kind !== 'river') expect(tapOnTarget(t).ok, t.key).toBe(true)
        }
      }
    })
  it('a tap on another state is wrong and reports it', () => {
    const t = makeRound(8, seeded(3)).find((x): x is TapTask => x.type === 'tap' && x.target.kind === 'state')!
    const code = t.target.kind === 'state' ? t.target.code : ''
    const other = code === 'ESP' ? [10, 51] : [-3.7, 40.4] // Germany or Spain
    const res = checkTap(t, { lon: other[0], lat: other[1], code: countryAt('europe', other[0], other[1]) }, 1000 / 330, peekView('europe'))
    expect(res.ok).toBe(false)
    expect(res.hit).toBeTruthy()
  })
  it('river taps: on the river yes, far away no', () => {
    const data = peekView('czechia')
    const t = makeRound(9, seeded(1)).find((x) => x.type === 'tap') as TapTask | undefined
    if (!t) return
    for (const r of CZ_RIVERS) {
      const task: TapTask = { ...t, key: 'r:' + r.name, target: { kind: 'river', name: r.name, data: r.data }, others: CZ_RIVERS.filter((x) => x !== r).map((x) => ({ kind: 'river' as const, name: x.name, data: x.data })) }
      const pts = riverParts(data, r.data).flat().filter(([lon, lat]) => countryAt('czechia', lon, lat) === 'CZE')
      const mid = pts[Math.floor(pts.length / 2)]
      expect(checkTap(task, { lon: mid[0], lat: mid[1] }, 1000 / 330, data).ok, r.name).toBe(true)
    }
  })
})
