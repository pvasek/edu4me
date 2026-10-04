import { describe, expect, it } from 'vitest'
import * as dn from './day-night.model'
import * as mp from './map-projection.model'
import { loadView } from '../../geo/load'
import * as sun from './sun-angle.model'
import * as tide from './tides.model'
import * as plate from './plate-motion.model'
import * as river from './river-erosion.model'

describe('sun-angle model', () => {
  it('declination: 0° at the equinoxes, ±23,5° at the solstices, smooth in between', () => {
    expect(sun.declination(sun.MAR21)).toBeCloseTo(0, 6)
    expect(sun.declination(sun.SEP23)).toBeCloseTo(0, 6)
    expect(sun.declination(sun.JUN21)).toBeCloseTo(23.5, 6)
    expect(sun.declination(sun.DEC21)).toBeCloseTo(-23.5, 6)
    // 1 May: about +15°
    expect(sun.declination(120)).toBeGreaterThan(14)
    expect(sun.declination(120)).toBeLessThan(16.5)
    for (let d = 1; d < 365; d++) expect(Math.abs(sun.declination(d) - sun.declination(d - 1))).toBeLessThan(0.5)
  })
  it('noon height: Praha 40° at the equinox, 63,5° in June, 16,5° in December', () => {
    expect(sun.noonHeight(50, 0)).toBe(40)
    expect(sun.noonHeight(50, 23.5)).toBeCloseTo(63.5)
    expect(sun.noonHeight(50, -23.5)).toBeCloseTo(16.5)
    expect(sun.noonHeight(23.5, 23.5)).toBe(90)
    expect(sun.noonSide(23.5, 23.5)).toBe('zenit')
    expect(sun.noonSide(-30, -23.5)).toBe('sever')
    expect(sun.noonSide(50, 23.5)).toBe('jih')
  })
  it('day length: 12 h at the equinox and on the equator, about 16 h in Praha in June', () => {
    for (const lat of [-60, -20, 0, 35, 50, 80]) expect(sun.dayLength(lat, 0)).toBeCloseTo(12, 6)
    for (const d of [-23.5, 0, 10, 23.5]) expect(sun.dayLength(0, d)).toBeCloseTo(12, 6)
    expect(sun.dayLength(50, 23.5)).toBeGreaterThan(16)
    expect(sun.dayLength(50, 23.5)).toBeLessThan(16.4)
    expect(sun.dayLength(50, 23.5) + sun.dayLength(50, -23.5)).toBeCloseTo(24, 6)
    const { rise, set } = sun.sunTimes(50, 23.5)
    expect(rise + set).toBeCloseTo(24)
  })
  it('polar day and night start exactly at the polar circle on the solstices', () => {
    expect(sun.dayKind(66.5, 23.5)).toBe('polarni-den')
    expect(sun.dayKind(66, 23.5)).toBe('den-a-noc')
    expect(sun.dayKind(66.5, -23.5)).toBe('polarni-noc')
    expect(sun.dayKind(-70, 23.5)).toBe('polarni-noc')
    expect(sun.dayKind(-70, -23.5)).toBe('polarni-den')
    expect(sun.dayLength(80, 23.5)).toBe(24)
    expect(sun.dayLength(80, -23.5)).toBe(0)
    expect(sun.dayKind(90, 0)).toBe('den-a-noc')
  })
  it('formats dates, times and latitudes in Czech', () => {
    expect(sun.dateText(0)).toBe('1. ledna')
    expect(sun.dateText(sun.JUN21)).toBe('21. června')
    expect(sun.dateText(sun.SEP23)).toBe('23. září')
    expect(sun.dateText(364)).toBe('31. prosince')
    expect(sun.hm(16.1667)).toBe('16 h 10 min')
    expect(sun.clock(3.9167)).toBe('3:55')
    expect(sun.latText(66.5)).toBe('66,5° s. š.')
    expect(sun.latText(-23.5)).toBe('23,5° j. š.')
    expect(sun.latText(0)).toBe('0° (rovník)')
  })
  it('the challenge is the polar circle on 21 June', () => {
    expect(sun.challengeMet(66.5, sun.JUN21)).toBe(true)
    expect(sun.challengeMet(67, sun.JUN21)).toBe(false)
    expect(sun.challengeMet(66.5, sun.JUN21 + 5)).toBe(false)
  })
  it('a low Sun heats less', () => {
    expect(sun.heating(90)).toBeCloseTo(1)
    expect(sun.heating(30)).toBeCloseTo(0.5)
    expect(sun.heating(-5)).toBe(0)
  })
})

describe('tides model', () => {
  it('spring tide at new and full Moon, neap tide at the quarters', () => {
    expect(tide.amplitude(0, true)).toBeCloseTo(1.46)
    expect(tide.amplitude(tide.MONTH / 2, true)).toBeCloseTo(1.46)
    expect(tide.amplitude(tide.MONTH / 4, true)).toBeCloseTo(0.54)
    expect(tide.amplitude((3 * tide.MONTH) / 4, true)).toBeCloseTo(0.54)
    expect(tide.tideKind(0, true)).toBe('skocny')
    expect(tide.tideKind(15, true)).toBe('skocny')
    expect(tide.tideKind(7.5, true)).toBe('hluchy')
    expect(tide.tideKind(4, true)).toBe('mezi')
    expect(tide.tideKind(7.5, false)).toBe('jen-mesic')
    expect(tide.amplitude(7.5, false)).toBe(1)
  })
  it('two bulges: highest under the Moon and opposite it, lowest at right angles', () => {
    for (const d of [0, 3, 7.5, 11, 20]) {
      const th = tide.moonAngle(d)
      expect(tide.height(th, d, false)).toBeCloseTo(1)
      expect(tide.height(th + 180, d, false)).toBeCloseTo(1)
      expect(tide.height(th + 90, d, false)).toBeCloseTo(-1)
    }
    // with the Sun, the bulge stays near the Moon at a neap tide
    const off = (((tide.bulgeAngle(7.38, true) - tide.moonAngle(7.38)) % 180) + 180) % 180
    expect(Math.min(off, 180 - off)).toBeLessThan(1)
  })
  it('a harbour has two high and two low tides in a lunar day', () => {
    let highs = 0
    const step = tide.LUNAR_DAY / 400
    for (let t = step; t < tide.LUNAR_DAY; t += step) {
      const a = tide.harbour(t - step, 0, false)
      const b = tide.harbour(t, 0, false)
      const c = tide.harbour(t + step, 0, false)
      if (b > a && b >= c) highs++
    }
    expect(highs).toBe(1) // t = 0 and t = 24 h 50 min are the other high, at the ends
    expect(tide.harbour(0, 0, false)).toBeCloseTo(1)
    expect(tide.harbour(tide.LUNAR_DAY / 2, 0, false)).toBeCloseTo(1)
    expect(tide.harbour(tide.LUNAR_DAY / 4, 0, false)).toBeCloseTo(-1)
  })
  it('phases of the Moon', () => {
    expect(tide.phase(0)).toBe('nov')
    expect(tide.phase(7.5)).toBe('prvni-ctvrt')
    expect(tide.phase(15)).toBe('uplnek')
    expect(tide.phase(22)).toBe('posledni-ctvrt')
    expect(tide.phase(4)).toBe('dorusta')
    expect(tide.phase(18)).toBe('ubyva')
    expect(tide.challengeMet(7.5, true)).toBe(true)
    expect(tide.challengeMet(7.5, false)).toBe(false)
  })
})

describe('plate-motion model', () => {
  it('each motion offers only real combinations', () => {
    expect(plate.pairFor('od-sebe', 'op')).toBe('oo')
    expect(plate.pairFor('k-sobe', 'op')).toBe('op')
    expect(plate.pairFor('podel', 'pp')).toBe('oba')
  })
  it('the right landforms form at each boundary', () => {
    expect(plate.boundary('od-sebe', 'oo').forms).toMatch(/hřbet/)
    expect(plate.boundary('od-sebe', 'pp').forms).toMatch(/propadlina/)
    expect(plate.boundary('k-sobe', 'op').forms).toMatch(/příkop.*sopečné/)
    expect(plate.boundary('k-sobe', 'oo').forms).toMatch(/ostrovní oblouk/)
    expect(plate.boundary('k-sobe', 'pp').forms).toMatch(/vrásové/)
    expect(plate.boundary('podel', 'oba').forms).toBe('zlom')
  })
  it('no volcanoes where continents collide or plates slide past each other', () => {
    expect(plate.boundary('k-sobe', 'pp').volcanoes).toBe(false)
    expect(plate.boundary('podel', 'oba').volcanoes).toBe(false)
    expect(plate.hasVolcanoes('k-sobe', 'op', 1)).toBe(false) // the slab is not deep yet
    expect(plate.hasVolcanoes('k-sobe', 'op', 5)).toBe(true)
    expect(plate.hasVolcanoes('od-sebe', 'oo', 0)).toBe(true)
  })
  it('5 cm a year is 50 km per million years; the challenge is the Andes', () => {
    expect(plate.shiftKm(10)).toBe(500)
    expect(plate.challengeMet('k-sobe', 'op', 6)).toBe(true)
    expect(plate.challengeMet('k-sobe', 'oo', 6)).toBe(false)
    expect(plate.challengeMet('k-sobe', 'op', 1)).toBe(false)
  })
})

describe('river-erosion model', () => {
  it('sand is the easiest to erode, clay harder than gravel', () => {
    const e = river.GRAINS.map(river.erodeAt)
    expect(river.erodeAt('pisek')).toBe(Math.min(...e))
    expect(river.erodeAt('pisek')).toBeGreaterThan(0.15)
    expect(river.erodeAt('pisek')).toBeLessThan(0.3)
    expect(river.erodeAt('jil')).toBeGreaterThan(river.erodeAt('sterk'))
    expect(river.erodeAt('jil')).toBeGreaterThan(1.5)
  })
  it('settling: gravel drops first, clay only in still water', () => {
    expect(river.settleAt('sterk')).toBeGreaterThan(river.settleAt('pisek'))
    expect(river.settleAt('jil')).toBeLessThan(0.001)
    for (const g of river.GRAINS) expect(river.settleAt(g)).toBeLessThan(river.erodeAt(g))
  })
  it('more water and a steeper bed → faster flow, in a realistic range', () => {
    expect(river.velocity(50, 1)).toBeCloseTo(0.48, 2)
    expect(river.velocity(100, 1)).toBeGreaterThan(river.velocity(50, 1))
    expect(river.velocity(50, 5)).toBeGreaterThan(river.velocity(50, 1))
    expect(river.velocity(0.5, 0.05)).toBeLessThan(0.05)
    expect(river.velocity(500, 20)).toBeGreaterThan(river.erodeAt('jil'))
  })
  it('erosion, transport and deposition by velocity', () => {
    expect(river.work('pisek', 0.5)).toBe('eroze')
    expect(river.work('sterk', 0.5)).toBe('ukladani')
    expect(river.work('jil', 0.5)).toBe('transport')
    expect(river.work('pisek', 0.1)).toBe('transport')
    expect(river.work('pisek', 0.03)).toBe('ukladani')
    expect(river.work('sterk', 1)).toBe('transport')
    expect(river.challengeMet(1.36)).toBe(true)
    expect(river.challengeMet(1)).toBe(false)
    expect(river.challengeMet(2)).toBe(false)
  })
  it('the challenge can be reached with the slider stops', () => {
    const ok = river.Q_STEPS.some((q) => river.S_STEPS.some((s) => river.challengeMet(river.velocity(q, s))))
    expect(ok).toBe(true)
  })
})

describe('map-projection model', () => {
  it('a 1 000 km circle grows towards the pole on Mercator only', () => {
    expect(mp.growth('mercator', 60)).toBeGreaterThan(3.8)
    expect(mp.growth('mercator', 60)).toBeLessThan(4.2)
    expect(mp.growth('mercator', 70)).toBeGreaterThan(8)
    expect(mp.growth('equal-earth', 70)).toBeCloseTo(1, 2)
    const r = mp.growth('robinson', 60)
    expect(r).toBeGreaterThan(1.1)
    expect(r).toBeLessThan(mp.growth('mercator', 60))
  })
  it('Greenland vs Africa: 14× on an equal-area map, much less on Mercator', async () => {
    const w = await loadView('world')
    const shapes = (codes: string[]) => codes.map((c) => w.countries.get(c)?.rings ?? [])
    expect(mp.AFRICA.filter((c) => !w.countries.has(c))).toEqual([])
    const ratio = (k: mp.Kind) => mp.shapesArea(mp.proj(k), shapes(mp.AFRICA)) / mp.shapesArea(mp.proj(k), shapes([mp.GREENLAND]))
    console.log('africa/greenland', mp.KINDS.map((k) => `${k} ${ratio(k).toFixed(2)}`).join(', '))
    expect(mp.challengeMet(ratio('equal-earth'))).toBe(true)
    expect(ratio('mercator')).toBeLessThan(2)
    expect(mp.challengeMet(ratio('mercator'))).toBe(false)
    expect(mp.challengeMet(ratio('robinson'))).toBe(false)
  })
})

describe('day-night model', () => {
  it('15° of longitude is one hour of local time', () => {
    expect(dn.solarTime(12, 0)).toBe(12)
    expect(dn.solarTime(12, 15)).toBe(13)
    expect(dn.solarTime(12, -75)).toBe(7)
    expect(dn.solarTime(23, 30)).toBe(1)
    expect(dn.clock(dn.solarTime(12, 14.42))).toBe('12:58')
    expect(dn.subsolarLon(12)).toBe(0)
    expect(dn.subsolarLon(6)).toBe(90)
    expect(dn.subsolarLon(18)).toBe(-90)
  })
  it('the Sun is overhead at the subsolar point and below the horizon opposite it', () => {
    for (const d of [-23.5, 0, 23.5]) {
      expect(dn.sunHeight(d, dn.subsolarLon(9), 9, d)).toBeCloseTo(90, 6)
      expect(dn.sunHeight(-d, dn.subsolarLon(9) + 180, 9, d)).toBeCloseTo(-90, 6)
    }
  })
  it('the terminator has the Sun on the horizon; the night ring covers the dark pole', () => {
    for (const lon of [-150, -60, 0, 45, 120])
      expect(dn.sunHeight(dn.terminatorLat(lon, 7, 23.5), lon, 7, 23.5)).toBeCloseTo(0, 6)
    const r = dn.nightRing(7, 23.5)
    expect(r[r.length - 1]).toBe(-90)
    expect(dn.isDay(85, 0, 0, 23.5)).toBe(true) // polar day: the Sun at midnight
    expect(dn.isDay(-85, 0, 12, 23.5)).toBe(false) // polar night: no Sun at noon
  })
  it('Praha: day at noon, night at midnight; sunrise about 3:55 local in June, 6:00 in March', () => {
    const [praha] = dn.CITIES
    expect(dn.isDay(praha.lat, praha.lon, 11, 0)).toBe(true)
    expect(dn.isDay(praha.lat, praha.lon, 23, 0)).toBe(false)
    expect(dn.sunriseInPraha(3, 23.5)).toBe(true) // 3:00 UTC = 3:58 local
    expect(dn.sunriseInPraha(3.5, 23.5)).toBe(false)
    expect(dn.sunriseInPraha(5.25, 0)).toBe(true) // 5:15 UTC = 6:13 local, sunrise 6:00
    expect(dn.sunriseInPraha(5, 0)).toBe(false)
    const ok = (decl: number) => Array.from({ length: 96 }, (_, i) => i / 4).filter((t) => dn.sunriseInPraha(t, decl)).length
    for (const d of [-23.5, 0, 23.5]) expect(ok(d)).toBe(1)
  })
})
