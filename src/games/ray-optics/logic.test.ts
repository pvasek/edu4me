import { describe, expect, it } from 'vitest'
import {
  bendOf,
  criticalAngle,
  dioptres,
  focalFrom,
  focalFromPower,
  fmt,
  imageOf,
  imagePoint,
  nearImage,
  parseNum,
  principalRays,
  propsOf,
  propsText,
  refractionAngle,
  within,
  type Ray,
  type Scene,
  type View,
} from './logic'

const V: View = { x0: -400, x1: 400, y0: -100, y1: 100 }

/** Where two rays' final segments (real or extended) cross. */
function cross(r1: Ray, r2: Ray) {
  const line = (r: Ray) => {
    const s = r.segs[1]
    return { p: s.from, d: { x: s.to.x - s.from.x, y: s.to.y - s.from.y } }
  }
  const a = line(r1)
  const b = line(r2)
  const den = a.d.x * b.d.y - a.d.y * b.d.x
  const t = ((b.p.x - a.p.x) * b.d.y - (b.p.y - a.p.y) * b.d.x) / den
  return { x: a.p.x + a.d.x * t, y: a.p.y + a.d.y * t }
}

describe('imaging equation (Czech sign convention)', () => {
  it('object at 2f of a converging lens: real, inverted, same size at 2f', () => {
    const img = imageOf(10, 20)
    expect(img.ap).toBeCloseTo(20)
    expect(img.Z).toBeCloseTo(-1)
    expect(propsText(propsOf(img))).toBe('skutečný, stejně velký, převrácený')
  })
  it('object beyond 2f: real, smaller; between f and 2f: real, bigger', () => {
    expect(propsOf(imageOf(10, 30))).toEqual({ real: true, size: 'zmenšený', inverted: true })
    const img = imageOf(10, 15)
    expect(img.ap).toBeCloseTo(30)
    expect(img.Z).toBeCloseTo(-2)
    expect(propsOf(img)).toEqual({ real: true, size: 'zvětšený', inverted: true })
  })
  it('object inside the focus: virtual, upright, magnified (magnifying glass)', () => {
    const img = imageOf(10, 5)
    expect(img.ap).toBeCloseTo(-10)
    expect(img.Z).toBeCloseTo(2)
    expect(propsOf(img)).toEqual({ real: false, size: 'zvětšený', inverted: false })
  })
  it('object in the focus: no image', () => {
    expect(imageOf(10, 10)).toEqual({ ap: null, Z: null })
    expect(propsOf(imageOf(10, 10))).toBeNull()
    expect(propsText(null)).toBe('obraz nevznikne')
  })
  it('diverging lens and convex mirror: always virtual, upright, smaller', () => {
    for (const a of [2, 5, 10, 30, 100]) {
      const img = imageOf(-10, a)
      expect(img.ap!).toBeLessThan(0)
      expect(img.ap!).toBeGreaterThan(-10)
      expect(propsOf(img)).toEqual({ real: false, size: 'zmenšený', inverted: false })
    }
  })
  it('f from a and a′, optical power in dioptres', () => {
    expect(focalFrom(15, 30)).toBeCloseTo(10)
    expect(focalFrom(30, -7.5)).toBeCloseTo(-10)
    expect(dioptres(25)).toBeCloseTo(4)
    expect(dioptres(-50)).toBeCloseTo(-2)
    expect(focalFromPower(-2.5)).toBeCloseTo(-40)
  })
  it('mirror images sit in front (real) or behind (virtual) the mirror', () => {
    expect(imagePoint({ el: 'duté', f: 10, a: 30, h: 1 })!.x).toBeCloseTo(-15)
    expect(imagePoint({ el: 'duté', f: 10, a: 5, h: 1 })!.x).toBeCloseTo(10)
    expect(imagePoint({ el: 'spojka', f: 10, a: 30, h: 1 })!.x).toBeCloseTo(15)
    expect(imagePoint({ el: 'vypuklé', f: -10, a: 10, h: 1 })!.x).toBeCloseTo(5)
  })
})

describe('principal rays meet in the image', () => {
  const scenes: Scene[] = [
    { el: 'spojka', f: 10, a: 30, h: 4 },
    { el: 'spojka', f: 10, a: 15, h: 4 },
    { el: 'spojka', f: 10, a: 6, h: 4 },
    { el: 'rozptylka', f: -10, a: 20, h: 4 },
    { el: 'duté', f: 10, a: 25, h: 4 },
    { el: 'duté', f: 10, a: 5, h: 4 },
    { el: 'vypuklé', f: -10, a: 15, h: 4 },
  ]
  for (const s of scenes) {
    it(`${s.el} f=${s.f} a=${s.a}`, () => {
      const rays = principalRays(s, V)
      expect(rays).toHaveLength(3)
      const img = imagePoint(s)!
      for (const [i, j] of [
        [0, 1],
        [0, 2],
        [1, 2],
      ]) {
        const p = cross(rays[i], rays[j])
        expect(p.x).toBeCloseTo(img.x, 6)
        expect(p.y).toBeCloseTo(img.y, 6)
      }
      const virtual = imageOf(s.f, s.a).ap! < 0
      expect(rays.every((r) => r.segs.some((g) => g.virtual) === virtual)).toBe(true)
      // light always travels away from the element on the correct side
      for (const r of rays) {
        const out = r.segs[1]
        if (s.el === 'spojka' || s.el === 'rozptylka') expect(out.to.x).toBeGreaterThan(0)
        else expect(out.to.x).toBeLessThan(0)
      }
    })
  }
  it('object in the focus: two rays leave parallel, no focal ray', () => {
    const rays = principalRays({ el: 'spojka', f: 10, a: 10, h: 4 }, V)
    expect(rays).toHaveLength(2)
    expect(rays.some((r) => r.segs.some((g) => g.virtual))).toBe(false)
  })
})

describe('reflection and refraction', () => {
  it('bends towards the normal into an optically denser medium', () => {
    expect(bendOf(1, 1.33, 40)).toBe('toward')
    expect(bendOf(1.5, 1, 30)).toBe('away')
    expect(bendOf(1.5, 1, 0)).toBe('straight')
    expect(bendOf(1.33, 1, 60)).toBe('total')
    expect(refractionAngle(1, 1.5, 30)!).toBeCloseTo(19.47, 1)
    expect(refractionAngle(1.5, 1, 60)).toBeNull()
    expect(criticalAngle(1.5, 1)!).toBeCloseTo(41.81, 1)
    expect(criticalAngle(1, 1.5)).toBeNull()
  })
})

describe('answers', () => {
  it('parses Czech numbers with signs and units', () => {
    expect(parseNum('−6,67')).toBeCloseTo(-6.67)
    expect(parseNum('+4 D')).toBe(4)
    expect(parseNum('30 cm')).toBe(30)
    expect(parseNum('0.25')).toBe(0.25)
    expect(parseNum('x')).toBeNull()
  })
  it('±2 % tolerance and sign matters', () => {
    expect(within(26.7, 26.667)).toBe(true)
    expect(within(-26.7, 26.667)).toBe(false)
    expect(within(-0.33, -1 / 3)).toBe(true)
  })
  it('dragged marker must be on the right side and near the image', () => {
    const s: Scene = { el: 'spojka', f: 1, a: 3, h: 0.7 }
    expect(nearImage(s, { x: 1.5, y: -0.35 }).ok).toBe(true)
    expect(nearImage(s, { x: 1.6, y: -0.3 }).ok).toBe(true)
    expect(nearImage(s, { x: 1.5, y: 0.35 }).ok).toBe(false)
    expect(nearImage(s, { x: -1.5, y: -0.35 }).ok).toBe(false)
    expect(nearImage(s, { x: 3, y: -0.35 }).ok).toBe(false)
  })
  it('formats', () => {
    expect(fmt(-6.6667)).toBe('−6,67')
    expect(fmt(26.667)).toBe('26,7')
    expect(fmt(4)).toBe('4')
  })
})
