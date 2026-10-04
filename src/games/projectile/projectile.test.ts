import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { BODIES, LEVELS, MIX } from './levels'
import {
  ANGLE_MAX,
  ANGLE_MIN,
  MAX_SHOTS,
  PER_TASK,
  SHOT_POINTS,
  V_MAX,
  V_MIN,
  apex,
  checkOrbit,
  cz,
  explainOrbit,
  explainThrow,
  heightAt,
  makeRound,
  makeThrow,
  missText,
  orbitFate,
  orbitalVelocity,
  playedLevel,
  rangeOnGround,
  shoot,
  taskKey,
  throwPoints,
  type ThrowTask,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const g = 9.81

describe('projectile physics', () => {
  it('computes the textbook formulas', () => {
    // range on flat ground d = v² sin 2α / g
    expect(rangeOnGround({ angle: 45, v: 20 }, g)).toBeCloseTo(400 / g, 6)
    expect(rangeOnGround({ angle: 30, v: 20 }, g)).toBeCloseTo((400 * Math.sin(Math.PI / 3)) / g, 6)
    // complementary angles give the same range
    expect(rangeOnGround({ angle: 30, v: 15 }, g)).toBeCloseTo(rangeOnGround({ angle: 60, v: 15 }, g), 6)
    // horizontal throw d = v √(2h/g)
    expect(rangeOnGround({ angle: 0, v: 10 }, g, 20)).toBeCloseTo(10 * Math.sqrt(40 / g), 6)
    // apex h = v² sin² α / 2g
    expect(apex({ angle: 90, v: 10 }, g)).toBeCloseTo(100 / (2 * g), 6)
    expect(heightAt({ angle: 45, v: 20 }, g, 0, rangeOnGround({ angle: 45, v: 20 }, g))).toBeCloseTo(0, 6)
  })

  it('knows the orbital velocities', () => {
    expect(orbitalVelocity(BODIES.zeme) / 1000).toBeCloseTo(7.9, 1)
    expect(orbitalVelocity(BODIES.mesic) / 1000).toBeCloseTo(1.68, 2)
    expect(orbitalVelocity(BODIES.mars) / 1000).toBeCloseTo(3.55, 2)
    expect(orbitalVelocity(BODIES.jupiter) / 1000).toBeCloseTo(41.6, 1)
    expect(checkOrbit('1,68', BODIES.mesic).kind).toBe('ok')
    expect(checkOrbit('1.7', BODIES.mesic).kind).toBe('ok')
    expect(checkOrbit('1,8', BODIES.mesic).kind).toBe('wrong')
    expect(checkOrbit('abc', BODIES.mesic).kind).toBe('invalid')
    expect(orbitFate(BODIES.zeme, 5000)).toBe('fall')
    expect(orbitFate(BODIES.zeme, 7900)).toBe('circle')
    expect(orbitFate(BODIES.zeme, 9000)).toBe('ellipse')
    expect(orbitFate(BODIES.zeme, 11200)).toBe('escape')
    expect(explainOrbit(BODIES.mesic)).toContain('≐ 1\u00a0677 m/s = 1,68 km/s')
  })

  it('uses the real g values', () => {
    expect(BODIES.zeme.g).toBe(9.81)
    expect(BODIES.mesic.g).toBe(1.62)
    expect(BODIES.mars.g).toBe(3.71)
    expect(BODIES.jupiter.g).toBe(24.79)
  })

  it('formats Czech numbers', () => {
    expect(cz(12.5)).toBe('12,5')
    expect(cz(12)).toBe('12')
    expect(cz(-0.5)).toBe('−0,5')
    expect(cz(1678.4, 0)).toBe('1 678')
  })

  it('scores fewer shots higher', () => {
    expect(throwPoints(true, 1, 20)).toBe(120)
    expect(throwPoints(true, 2, 0)).toBe(SHOT_POINTS[1])
    expect(throwPoints(false, 1, 20)).toBe(0)
    for (let i = 1; i < SHOT_POINTS.length; i++) expect(SHOT_POINTS[i]).toBeLessThan(SHOT_POINTS[i - 1])
    expect(SHOT_POINTS).toHaveLength(MAX_SHOTS)
    expect(PER_TASK).toBe(120)
  })
})

describe('projectile targets', () => {
  const kinds = ['horizontal', 'ground', 'platform'] as const
  for (const body of Object.keys(BODIES) as (keyof typeof BODIES)[]) {
    for (const kind of kinds) {
      it(`${kind} on ${body}: the stored solution hits, reachable with the sliders`, () => {
        for (let seed = 1; seed <= 60; seed++) {
          const t = makeThrow(kind, body, 8, rng(seed))
          const s = t.solution
          expect(s.angle).toBeGreaterThanOrEqual(ANGLE_MIN)
          expect(s.angle).toBeLessThanOrEqual(ANGLE_MAX)
          expect(s.v).toBeGreaterThanOrEqual(V_MIN)
          expect(s.v).toBeLessThanOrEqual(V_MAX)
          expect(Math.round(s.v * 2)).toBe(s.v * 2) // reachable with 0,5 m/s steps
          const shot = shoot(t, s)
          expect(shot.outcome, JSON.stringify(t)).toBe('hit')
          expect(shot.end.x).toBeCloseTo(t.target.x, 6)
          expect(shot.path[0]).toEqual({ x: 0, y: t.h0 })
          if (kind === 'horizontal') expect(t.fixedAngle).toBe(0)
          expect(explainThrow(t, s)).toMatch(/^(Vodorovný|Šikmý) vrh: .+ m.*\.$/)
        }
      })
    }
  }

  it('reports misses: short, long, into the wall', () => {
    const t: ThrowTask = makeThrow('ground', 'zeme', 8, rng(3))
    const short = shoot(t, { ...t.solution, v: t.solution.v - 4 })
    expect(short.outcome).toBe('short')
    expect(missText(t, short)).toMatch(/blíž než střed cíle\. Přidej rychlost/)
    const long = shoot(t, { ...t.solution, v: t.solution.v + 4 })
    expect(long.outcome).toBe('long')
    const p = makeThrow('platform', 'zeme', 8, rng(5))
    const flat = shoot(p, { angle: 10, v: p.solution.v })
    expect(['wall', 'short']).toContain(flat.outcome)
    if (flat.outcome === 'wall') {
      expect(flat.end.x).toBeCloseTo(p.target.x - p.target.w, 6)
      expect(flat.end.y).toBeLessThan(p.target.y)
      expect(missText(p, flat)).toContain('stěny')
    }
  })

  it('accepts a hit anywhere within the target width', () => {
    const t = makeThrow('ground', 'zeme', 8, rng(9))
    // find a nearby launch that lands inside the target but not in the centre
    let found = false
    for (let dv = -1; dv <= 1; dv += 0.5) {
      const s = shoot(t, { angle: t.solution.angle, v: t.solution.v + dv })
      if (Math.abs(s.end.x - t.target.x) <= t.target.w) {
        expect(s.outcome).toBe('hit')
        found = true
      } else expect(s.outcome).not.toBe('hit')
    }
    expect(found).toBe(true)
  })
})

describe('projectile rounds', () => {
  it('has a plan for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID.projectile.courses.fyzika!).map(Number))
    expect(LEVELS[8].every((p) => p.body === 'zeme' && p.kind !== 'orbit')).toBe(true)
    expect(LEVELS[9].every((p) => p.body !== 'zeme')).toBe(true)
    expect(LEVELS[9].some((p) => p.kind === 'orbit')).toBe(true)
    expect(MIX.some((p) => p.body === 'zeme') && MIX.some((p) => p.body !== 'zeme')).toBe(true)
  })

  it('picks the level from the level id, mix otherwise', () => {
    expect(playedLevel('l8')).toBe(8)
    expect(playedLevel('l9')).toBe(9)
    expect(playedLevel('l2')).toBeUndefined()
    expect(playedLevel()).toBeUndefined()
  })

  for (const lv of [8, 9, undefined]) {
    it(`${lv ?? 'mix'}: 8 distinct, solvable tasks`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const r = makeRound(lv, rng(seed))
        expect(r).toHaveLength(8)
        expect(new Set(r.map(taskKey)).size).toBe(8)
        for (const t of r) {
          if (lv) expect(t.level).toBe(lv)
          if (t.kind === 'throw') expect(shoot(t, t.solution).outcome).toBe('hit')
          else expect(t.answer).toBeCloseTo(orbitalVelocity(t.body), 6)
        }
      }
    })
  }
})
