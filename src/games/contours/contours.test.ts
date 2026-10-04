import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { LANDFORMS, LEVELS } from './levels'
import {
  ROUND,
  betweenTask,
  buildTask,
  checkNumber,
  climbTask,
  crossingsAlong,
  heightsAlong,
  highestTask,
  intervalTask,
  landformAt,
  landformTask,
  makeRound,
  onContourTask,
  profileTask,
  steepPartTask,
  steeperTask,
  streamDirTask,
  streamLineTask,
  waterTask,
  type ChoiceTask,
  type Task,
} from './logic'
import { chooseInterval, contours, dist, distToLine, heightAt, isoLines, polyLength, sample, seeded, type Terrain } from './terrain'

const N = 12
/** Terrain generation is CPU-heavy; allow time on a busy machine. */
const T = 120_000
const seeds = Array.from({ length: N }, (_, k) => 1000 + k * 7919)
const markOf = (t: Task, label: string) => t.marks.find((m) => m.label === label)!
const h = (t: Task, p: { x: number; y: number }) => heightAt(t.map.terrain, p.x, p.y)

function validChoice(t: ChoiceTask) {
  const ids = t.options.map((o) => o.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(new Set(t.options.map((o) => o.label)).size).toBe(ids.length)
  expect(ids.filter((id) => id === t.answer)).toHaveLength(1)
  expect(t.why.length).toBeGreaterThan(20)
}

describe('terrain engine', () => {
  const cone: Terrain = { w: 320, h: 260, base: 100, tx: 0, ty: 0, bumps: [{ x: 160, y: 130, a: 200, sx: 50, sy: 50, rot: 0 }] }

  it('marching squares draw closed circles around a round hill', () => {
    const g = sample(cone)
    const lines = isoLines(g, 200)
    expect(lines).toHaveLength(1)
    expect(lines[0].closed).toBe(true)
    // 100 + 200·exp(−r²/2σ²) = 200 → r = σ·√(2 ln 2)
    const r = 50 * Math.sqrt(2 * Math.log(2))
    for (const p of lines[0].pts) expect(Math.abs(dist(p, { x: 160, y: 130 }) - r)).toBeLessThan(1)
  }, T)

  it('chooses a sensible interval and marks every fifth contour as index', () => {
    expect(chooseInterval(400, 500)).toBe(5)
    expect(chooseInterval(400, 600)).toBe(10)
    expect(chooseInterval(400, 800)).toBe(20)
    const g = sample(cone)
    const cs = contours(g, chooseInterval(g.min, g.max))
    expect(cs.filter((c) => c.index).every((c) => c.level % 50 === 0)).toBe(true)
  }, T)

  it('classifies landforms from the curvature', () => {
    expect(landformAt(cone, { x: 160, y: 130 })).toBe('vrchol')
    expect(landformAt({ ...cone, bumps: [{ ...cone.bumps[0], a: -200 }] }, { x: 160, y: 130 })).toBe('kotlina')
    expect(landformAt({ ...cone, tx: 1, bumps: [] }, { x: 160, y: 130 })).toBe('svah')
  }, T)
})

describe('contours level 1 tasks are unambiguous', () => {
  it('on-contour: the marker lies on the answer contour', () => {
    for (const s of seeds) {
      const t = onContourTask(seeded(s))
      validChoice(t)
      expect(Math.abs(h(t, markOf(t, 'X')) - Number(t.answer))).toBeLessThan(t.map.interval / 4)
    }
  }, T)

  it('between: the height lies well inside the answer interval', () => {
    for (const s of seeds) {
      const t = betweenTask(seeded(s))
      validChoice(t)
      const z = h(t, markOf(t, 'X'))
      const lo = Number(t.answer)
      expect(z).toBeGreaterThan(lo + 0.25 * t.map.interval)
      expect(z).toBeLessThan(lo + 0.75 * t.map.interval)
    }
  }, T)

  it('interval: two labelled contours 5 intervals apart are on the map', () => {
    for (const s of seeds) {
      const t = intervalTask(seeded(s))
      validChoice(t)
      const i = Number(t.answer)
      expect(i).toBe(t.map.interval)
      const vals = t.map.labels.map((l) => Number(l.text))
      expect(vals.some((v) => vals.includes(v + 5 * i))).toBe(true)
    }
  }, T)

  it('steeper: the steeper bar crosses at least twice as many contours', () => {
    for (const s of seeds) {
      const t = steeperTask(seeded(s))
      validChoice(t)
      const bar = (l: string) => t.segs.find((x) => x.label === l)!.pts
      const slope = (l: string) => Math.abs(h(t, bar(l)[1]) - h(t, bar(l)[0])) / polyLength(bar(l))
      const other = t.answer === 'A' ? 'B' : 'A'
      expect(polyLength(bar('A'))).toBeCloseTo(polyLength(bar('B')), 6)
      expect(crossingsAlong(t.map.terrain, bar(t.answer), t.map.interval)).toBeGreaterThanOrEqual(2 * crossingsAlong(t.map.terrain, bar(other), t.map.interval))
      expect(slope(t.answer)).toBeGreaterThan(1.5 * slope(other))
    }
  }, T)

  it('profile: the right profile follows A → B and differs clearly from the others', () => {
    for (const s of seeds) {
      const t = profileTask(seeded(s))
      validChoice(t)
      const ab = t.segs[0].pts
      const right = heightsAlong(t.map.terrain, ab, 48)
      expect(t.options.find((o) => o.id === t.answer)!.profile).toEqual(right)
      const [lo, hi] = t.range!
      for (const o of t.options.filter((x) => x.id !== t.answer)) {
        const diff = o.profile!.reduce((a, v, k) => a + Math.abs(v - right[k]), 0) / right.length
        expect(diff / (hi - lo)).toBeGreaterThan(0.1)
      }
    }
  }, T)
})

describe('contours level 3 tasks are unambiguous', () => {
  for (const form of LANDFORMS)
    it(`landform ${form}: the marker really is a ${form}`, () => {
      for (const s of seeds.slice(0, 8)) {
        const t = landformTask(form, seeded(s))
        validChoice(t)
        expect(t.answer).toBe(form)
        expect(landformAt(t.map.terrain, markOf(t, 'X'))).toBe(form)
      }
    }, T)

  it('stream-dir: the answer end is clearly lower', () => {
    for (const s of seeds) {
      const t = streamDirTask(seeded(s))
      validChoice(t)
      const other = t.answer === 'A' ? 'B' : 'A'
      expect(h(t, markOf(t, other)) - h(t, markOf(t, t.answer))).toBeGreaterThanOrEqual(4 * t.map.interval)
    }
  }, T)

  it('stream-line: only the answer line runs along a valley', () => {
    for (const s of seeds) {
      const t = streamLineTask(seeded(s))
      validChoice(t)
      const mid = (pts: { x: number; y: number }[]) => pts[Math.floor(pts.length / 2)]
      for (const seg of t.segs) {
        const form = landformAt(t.map.terrain, seg.pts.length === 2 ? { x: (seg.pts[0].x + seg.pts[1].x) / 2, y: (seg.pts[0].y + seg.pts[1].y) / 2 } : mid(seg.pts))
        if (seg.label === t.answer) expect(form).toBe('údolí')
        else expect(form).not.toBe('údolí')
      }
    }
  }, T)
})

describe('contours level 9 tasks are unambiguous', () => {
  it('highest: the answer summit is at least two contours above the others', () => {
    for (const s of seeds.slice(0, 8)) {
      const t = highestTask(seeded(s))
      validChoice(t)
      const top = h(t, markOf(t, t.answer))
      for (const m of t.marks.filter((x) => x.label !== t.answer)) expect(top - h(t, m)).toBeGreaterThanOrEqual(2 * t.map.interval)
    }
  }, T)

  it('steep-part: the answer section is clearly the steepest', () => {
    for (const s of seeds.slice(0, 8)) {
      const t = steepPartTask(seeded(s))
      validChoice(t)
      const slope = (k: number) => {
        const hs = heightsAlong(t.map.terrain, [t.marks[k], t.marks[k + 1]], 40)
        return hs.slice(1).reduce((a, z, j) => a + Math.abs(z - hs[j]), 0) / dist(t.marks[k], t.marks[k + 1])
      }
      const sl = [0, 1, 2].map(slope)
      const k = 'ABC'.indexOf(t.answer[0])
      for (const j of [0, 1, 2].filter((x) => x !== k)) expect(sl[k]).toBeGreaterThan(1.4 * sl[j])
    }
  }, T)

  it('climb: the hut lies on its contour and the answer is summit − contour', () => {
    for (const s of seeds.slice(0, 8)) {
      const t = climbTask(seeded(s))
      const hut = t.map.hut!
      const level = Number(t.why.match(/vrstevnici (\d+)/)![1])
      expect(Math.abs(h(t, hut) - level)).toBeLessThan(t.map.interval / 4)
      expect(level % t.map.interval).toBe(0)
      const top = t.map.spots[0]
      expect(Math.abs(h(t, top) - top.z)).toBeLessThan(1)
      expect(t.answer).toBe(top.z - level)
      expect(checkNumber(`${t.answer} m`, t).kind).toBe('ok')
      expect(checkNumber(String(t.answer + t.map.interval), t).kind).toBe('wrong')
    }
  }, T)

  it('water: the drop runs downhill to the named stream of the answer', () => {
    for (const s of seeds.slice(0, 8)) {
      const t = waterTask(seeded(s))
      validChoice(t)
      const path = t.reveal[0].pts
      expect(h(t, path[path.length - 1])).toBeLessThan(h(t, path[0]) - 1.5 * t.map.interval)
      // the path ends at a drawn stream
      expect(Math.min(...t.map.streams.map((st) => distToLine(path[path.length - 1], st)))).toBeLessThan(8)
    }
  }, T)
})

describe('contours rounds', () => {
  it('has a set for every level in the registry', () => {
    expect(Object.keys(LEVELS).map(Number)).toEqual(Object.keys(GAME_BY_ID.contours.courses.zemepis!).map(Number))
    for (const kinds of Object.values(LEVELS)) expect(kinds).toHaveLength(ROUND)
  }, T)

  it('a level-3 round asks about six different landforms', () => {
    const specs = makeRound(3, 42)
    const forms = specs.filter((s) => s.kind === 'landform').map((s) => s.form)
    expect(new Set(forms).size).toBe(forms.length)
  }, T)

  it('mixed rounds cover all levels', () => {
    const specs = makeRound(undefined, 7)
    expect(specs).toHaveLength(ROUND)
    expect(new Set(specs.map((s) => s.level))).toEqual(new Set([1, 3, 9]))
  }, T)

  for (const level of [1, 3, 9])
    it(`level ${level}: a whole round builds valid tasks without duplicates`, () => {
      const tasks = makeRound(level, 2024 + level).map(buildTask)
      expect(tasks).toHaveLength(ROUND)
      expect(new Set(tasks.map((t) => t.key)).size).toBe(ROUND)
      for (const t of tasks) {
        expect(t.level).toBe(level)
        expect(t.map.lines.length).toBeGreaterThan(4)
        if (t.type === 'choice') validChoice(t)
      }
    }, T)
})
