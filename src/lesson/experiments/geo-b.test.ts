import { describe, expect, it } from 'vitest'
import * as pw from './pressure-wind.model'
import * as lr from './lapse-rate.model'
import * as fh from './flood-hydrograph.model'
import * as dt from './doubling-time.model'
import * as bd from './birth-death-rates.model'
import * as sl from './sea-level-rise.model'

describe('pressure-wind model', () => {
  it('no pressure difference, no wind; the speed grows with the gradient', () => {
    expect(pw.windSpeed(0)).toBe(0)
    expect(pw.windSpeed(40)).toBeCloseTo(2 * pw.windSpeed(20))
    // 40 hPa over 1 500 km at 50° N: geostrophic ≈ 19 m/s, near the ground ≈ 12 m/s
    expect(pw.windSpeed(40) / pw.SURFACE).toBeGreaterThan(17)
    expect(pw.windSpeed(40) / pw.SURFACE).toBeLessThan(21)
  })
  it('Beaufort scale names', () => {
    expect(pw.beaufort(0)).toEqual({ force: 0, name: 'bezvětří' })
    expect(pw.beaufort(12.4)).toEqual({ force: 6, name: 'silný vítr' })
    expect(pw.beaufort(40).force).toBe(12)
  })
  it('isobars every 5 hPa between the centre and 1 010 hPa, evenly spaced', () => {
    expect(pw.centres(40)).toEqual({ high: 1030, low: 990 })
    const { high, low } = pw.isobars(40)
    expect(high.map(([p]) => p)).toEqual([1010, 1015, 1020, 1025])
    expect(low.map(([p]) => p)).toEqual([1010, 1005, 1000, 995])
    expect(high.map(([, r]) => r)).toEqual([1, 0.75, 0.5, 0.25])
    expect(pw.isobars(0).high).toEqual([])
  })
  const turn = (pts: [number, number][], cx: number, cy: number) => {
    // sign of the cross product radius × motion, summed: > 0 clockwise on screen (y down)
    let s = 0
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      s += (x0 - cx) * (y1 - y0) - (y0 - cy) * (x1 - x0)
    }
    return s
  }
  it('northern hemisphere: clockwise out of a high, anticlockwise into a low (deflection to the right)', () => {
    const out = pw.streamline(0, 0, 0, 10, 80, true)
    const into = pw.streamline(0, 0, 0, 80, 10, true)
    expect(turn(out, 0, 0)).toBeGreaterThan(0)
    expect(turn(into, 0, 0)).toBeLessThan(0)
    // the parcel moving out of the high bends to its right: its heading turns clockwise
    for (let i = 2; i < out.length; i++) {
      const [ax, ay] = [out[i - 1][0] - out[i - 2][0], out[i - 1][1] - out[i - 2][1]]
      const [bx, by] = [out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]]
      expect(ax * by - ay * bx).toBeGreaterThan(0)
    }
    // without rotation: a straight ray across the isobars
    expect(Math.abs(turn(pw.streamline(0, 0, 1, 10, 80, false), 0, 0))).toBeLessThan(1e-9)
  })
  it(`near the ground the wind crosses the isobars at ${pw.CROSS_ANGLE}°`, () => {
    const p = pw.streamline(0, 0, 0, 40, 41, true, 1)
    const [x0, y0] = p[0]
    const [x1, y1] = p[1]
    const radial = Math.hypot(x1, y1) - Math.hypot(x0, y0)
    const along = Math.hypot(x1 - x0, y1 - y0)
    expect((Math.asin(radial / along) * 180) / Math.PI).toBeCloseTo(pw.CROSS_ANGLE, 0)
  })
  it('task: strong wind with rotation on', () => {
    expect(pw.challengeMet(40, true)).toBe(true)
    expect(pw.challengeMet(40, false)).toBe(false)
    expect(pw.challengeMet(30, true)).toBe(false)
  })
})

describe('lapse-rate model', () => {
  it('0,65 °C per 100 m', () => {
    expect(lr.tempAt(20, lr.BASE_ALT)).toBe(20)
    expect(lr.tempAt(20, lr.BASE_ALT + 1000)).toBeCloseTo(13.5)
    // Sněžka is ≈ 9 °C colder than the lowland at 200 m
    expect(lr.tempAt(10, lr.TOP_ALT)).toBeCloseTo(10 - 1403 * 0.0065)
  })
  it('Krkonoše vegetation belts in order', () => {
    expect(lr.beltAt(300).id).toBe('listnate')
    expect(lr.beltAt(600).id).toBe('smisene')
    expect(lr.beltAt(1000).id).toBe('smrkove')
    expect(lr.beltAt(1300).id).toBe('kosodrevina')
    expect(lr.beltAt(1603).id).toBe('hole')
  })
  it('task: 8 °C below, freezing at ≈ 1 430 m', () => {
    expect(lr.challengeMet(8, 1430)).toBe(true)
    expect(lr.challengeMet(8, 1300)).toBe(false)
    expect(lr.challengeMet(10, 1430)).toBe(false)
  })
})

describe('flood-hydrograph model', () => {
  it('SCS runoff: nothing below the initial loss, never more than the rain', () => {
    expect(fh.runoff(20, 60)).toBe(0)
    for (const p of [30, 60, 120]) for (const cn of [60, 78, 90]) expect(fh.runoff(p, cn)).toBeLessThan(p)
    expect(fh.runoff(60, 90)).toBeGreaterThan(fh.runoff(60, 78))
  })
  it('the volume under the wave equals the runoff', () => {
    const h = fh.hydrograph(80, 'mesto')
    const vol = h.series.reduce((s, [, q]) => s + (q - fh.BASE) * fh.DT * 3600, 0)
    expect(vol / (fh.AREA * 1000)).toBeCloseTo(h.runoffMm, 0)
  })
  it('town: higher and earlier peak; forest: lower and later', () => {
    const [les, pole, mesto] = (['les', 'pole', 'mesto'] as const).map((c) => fh.hydrograph(60, c))
    expect(mesto.peak).toBeGreaterThan(pole.peak)
    expect(pole.peak).toBeGreaterThan(les.peak)
    expect(mesto.lag).toBeLessThan(pole.lag)
    expect(pole.lag).toBeLessThan(les.lag)
  })
  it('more rain → higher peak', () => {
    expect(fh.hydrograph(100, 'pole').peak).toBeGreaterThan(fh.hydrograph(50, 'pole').peak)
  })
  it('task: with 80 mm only the forest keeps the river in its bed', () => {
    expect(fh.challengeMet(80, 'les')).toBe(true)
    expect(fh.challengeMet(80, 'pole')).toBe(false)
    expect(fh.challengeMet(60, 'les')).toBe(false)
  })
})

describe('doubling-time model', () => {
  it('exact doubling time and the rule of 70', () => {
    expect(dt.doublingTime(2)).toBeCloseTo(35.0, 1)
    expect(dt.factor(2, dt.doublingTime(2))).toBeCloseTo(2)
    expect(dt.ruleOf70(3.5)).toBe(20)
    expect(dt.doublingTime(0)).toBe(Infinity)
    for (const r of [0.5, 1, 2, 3, 4]) expect(Math.abs(dt.doublingTime(r) / dt.ruleOf70(r) - 1)).toBeLessThan(0.02)
  })
  it('countries: Niger ≈ 21 years, Indie ≈ 77 years', () => {
    expect(dt.doublingTime(dt.COUNTRIES.niger.r)).toBeCloseTo(21.3, 1)
    expect(dt.doublingTime(dt.COUNTRIES.indie.r)).toBeCloseTo(77.4, 1)
    expect(dt.countryOf(0.9)).toBe('indie')
    expect(dt.countryOf(1.5)).toBe('')
  })
  it('task: 35 years ↔ 2 %', () => {
    expect(dt.challengeMet(2)).toBe(true)
    expect(dt.challengeMet(1.9)).toBe(false)
  })
})

describe('birth-death-rates model', () => {
  it('starting pyramids sum to 100 %', () => {
    for (const s of Object.values(bd.STARTS)) expect(bd.total(s)).toBeCloseTo(100, 0)
  })
  it('calibration: the first step has the crude rates of the sliders', () => {
    const p = bd.startPyramid('cesko')
    const P = bd.total(p)
    const { f, k } = bd.calibrate(p, 7.7, 10.3)
    const s = bd.step(p, f, k)
    expect(s.births / 5 / P * 1000).toBeCloseTo(7.7, 3)
    expect(s.deaths / 5 / P * 1000).toBeCloseTo(10.3, 3)
    // and the fertility it implies is the real one (ČSÚ 2024: 1,37 children per woman)
    expect(bd.tfr(f)).toBeCloseTo(1.37, 1)
    expect(bd.tfr(bd.calibrate(bd.startPyramid('niger'), 41, 9).f)).toBeGreaterThan(5.5)
  })
  it('more births, more people; more deaths, fewer', () => {
    const base = bd.total(bd.project('cesko', 10, 10))
    expect(bd.total(bd.project('cesko', 15, 10))).toBeGreaterThan(base)
    expect(bd.total(bd.project('cesko', 10, 15))).toBeLessThan(base)
  })
  it('momentum: b = d today is not a stable population', () => {
    // Česko is old: deaths grow and mothers get fewer → it shrinks
    expect(bd.total(bd.project('cesko', 10.3, 10.3))).toBeLessThan(bd.STARTS.cesko.pop * 0.95)
  })
  it('shapes: Niger today young, Česko ageing; a low birth rate turns a pyramid into an urn', () => {
    expect(bd.shapeOf(bd.STARTS.niger).shape).toBe('progresivni')
    expect(bd.shapeOf(bd.STARTS.cesko).shape).toBe('regresivni')
    expect(bd.shapeOf(bd.project('niger', 41, 9)).shape).toBe('progresivni')
    expect(bd.shapeOf(bd.project('niger', 9, 9)).shape).toBe('regresivni')
    expect(bd.shapeOf(bd.project('cesko', 20, 10)).shape).toBe('progresivni')
  })
  it('task: same population after 50 years (reachable with the slider for both starts)', () => {
    const hit = (s: bd.Start) => {
      for (let b = 50; b <= 500; b++) if (bd.challengeMet(s, b / 10, bd.STARTS[s].d)) return true
      return false
    }
    expect(hit('cesko')).toBe(true)
    expect(hit('niger')).toBe(true)
    expect(bd.challengeMet('cesko', 7.7, 10.3)).toBe(false)
  })
})

describe('sea-level-rise model', () => {
  it('profiles: today the land is dry, higher seas cover more of it', () => {
    expect(sl.floodedShare(sl.COAST, 0)).toBe(0)
    expect(sl.floodedShare(sl.ATOLL, 0)).toBe(0)
    let prev = 0
    for (const h of [0.5, 1, 2, 3]) {
      const f = sl.floodedShare(sl.ATOLL, h)
      expect(f).toBeGreaterThanOrEqual(prev)
      prev = f
    }
    // an atoll is lower than the coast with its hills
    expect(sl.floodedShare(sl.ATOLL, 1)).toBeGreaterThan(sl.floodedShare(sl.COAST, 1))
    expect(sl.floodedShare(sl.ATOLL, 3)).toBe(1)
    expect(sl.heightAt(sl.COAST, 96)).toBe(0)
  })
  it('time frame and people', () => {
    expect(sl.when(0)).toBe('dnes')
    expect(sl.when(0.2)).toBe('2050')
    expect(sl.when(0.6)).toBe('2100')
    expect(sl.when(1)).toBe('2100')
    expect(sl.when(1.5)).toBe('pozdeji')
    expect(sl.people(1)).toBe('přes 230 mil.')
    expect(sl.people(2)).toBe('přes 267 mil.')
    expect(sl.challengeMet(1)).toBe(true)
  })
})
