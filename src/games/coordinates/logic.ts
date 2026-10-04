/**
 * Zeměpisná síť – pure logic: Czech coordinate notation, the tasks of both levels and their answers.
 * Answers are computed from the curated coordinates in levels.ts (never typed by hand).
 */
import type { MapLayer, MapView } from '../../core/types'
import { getView } from '../../geo/frame'
import { inFrame, type LL } from '../blind-map/hit'
import { pick, shuffle } from '../shared/util'
import { levelNum } from '../types'
import { NEAR, POLAR, POLAR_CIRCLE, SUN_DATES, TROPIC, WORLD, ZONE_NAME, type Place, type Zone } from './levels'

export type Rng = () => number

export const LEVELS: Record<number, true> = { 1: true, 2: true }
export const ROUND = 10

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

/** Small seeded generator (mulberry32) so rounds are reproducible in tests. */
export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------------------------------------------ notation */

const NB = ' '

/** Whole degrees and minutes of an absolute value, rounded to the nearest minute. */
export function degMin(v: number): [number, number] {
  const tm = Math.round(Math.abs(v) * 60)
  return [Math.floor(tm / 60), tm % 60]
}

function deg(v: number, minutes: boolean): string {
  if (!minutes) return `${Math.round(Math.abs(v))}°`
  const [d, m] = degMin(v)
  return `${d}°${NB}${String(m).padStart(2, '0')}′`
}

/** "50° s. š." / "50° 05′ s. š." / "0°" (Czech style, non-breaking spaces). */
export function latText(lat: number, minutes = false): string {
  const zero = minutes ? Math.round(Math.abs(lat) * 60) === 0 : Math.round(Math.abs(lat)) === 0
  if (zero) return '0°'
  return `${deg(lat, minutes)}${NB}${lat > 0 ? 's.' : 'j.'}${NB}š.`
}
/** "14° v. d." / "14° 25′ v. d." / "0°" / "180°". */
export function lonText(lon: number, minutes = false): string {
  const r = minutes ? Math.round(Math.abs(lon) * 60) / 60 : Math.round(Math.abs(lon))
  if (r === 0) return '0°'
  if (r === 180) return '180°'
  return `${deg(lon, minutes)}${NB}${lon > 0 ? 'v.' : 'z.'}${NB}d.`
}
export const coordText = (lat: number, lon: number, minutes = false) => `${latText(lat, minutes)}, ${lonText(lon, minutes)}`

/** Heat zone of a latitude. */
export function zoneOf(lat: number): Zone {
  if (Math.abs(lat) <= TROPIC) return 'tropical'
  if (lat >= POLAR_CIRCLE) return 'polar-n'
  if (lat <= -POLAR_CIRCLE) return 'polar-s'
  return lat > 0 ? 'temperate-n' : 'temperate-s'
}
/** Can the Sun stand in the zenith at noon? Only between the tropics. */
export const zenithPossible = (lat: number) => Math.abs(lat) <= TROPIC
/** Beyond a polar circle (polar day and polar night happen there). */
export const beyondPolarCircle = (lat: number) => Math.abs(lat) >= POLAR_CIRCLE
/** Smallest distance in degrees of latitude from the equator, tropics and polar circles. */
export const lineMargin = (lat: number) => Math.min(...[0, TROPIC, -TROPIC, POLAR_CIRCLE, -POLAR_CIRCLE].map((l) => Math.abs(lat - l)))

/* ------------------------------------------------------------------ tasks */

export interface Pin {
  lat: number
  lon: number
  label?: string
}
interface Base {
  key: string
  level: number
  eyebrow: string
  text: string
  why: string
  view: MapView
  layers: MapLayer[]
  /** pins shown while the task is asked */
  pins: Pin[]
  /** pins added after the answer */
  reveal: Pin[]
}
export interface ChoiceTask extends Base {
  type: 'choice'
  options: { id: string; label: string }[]
  answer: string
  /** one option per row (long labels) */
  wide?: boolean
}
export interface PlaceTask extends Base {
  type: 'place'
  /** the asked position (whole degrees) */
  target: { lat: number; lon: number }
  /** tolerance in degrees of latitude at the target (and at least TAP_PX screen px) */
  tolDeg: number
  /** numbered places for the no-tap alternative: [lon, lat], the right one is `cands[candAnswer]` */
  cands: LL[]
  candAnswer: number
}
export type Task = ChoiceTask | PlaceTask

export const TAP_PX = 14
const GRID: MapLayer[] = ['graticule', 'graticule-labels']

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const ns = (lat: number) => (lat >= 0 ? 'severně' : 'jižně')
const ew = (lon: number) => (lon >= 0 ? 'východně' : 'západně')
const rLat = (v: number) => Math.round(v)

function options(right: string, wrong: string[], rng: Rng): { options: { id: string; label: string }[]; answer: string } {
  const labels = shuffle([right, ...wrong.slice(0, 3)], rng)
  return { options: labels.map((l, k) => ({ id: String(k), label: l })), answer: String(labels.indexOf(right)) }
}
function distinct(right: string, cands: string[]): string[] {
  const out: string[] = []
  for (const c of cands) if (c !== right && !out.includes(c)) out.push(c)
  return out
}

/** Places that read well on the world map: away from the equator and the prime meridian (flips differ). */
export const READ_POOL = WORLD.filter((p) => Math.abs(p.lat) >= 5 && Math.abs(p.lon) >= 5)

/** Level 1: read the whole-degree coordinates of a pin on the world map. */
export function readTask(p: Place, rng: Rng): ChoiceTask {
  const la = rLat(p.lat)
  const lo = rLat(p.lon)
  const right = coordText(la, lo)
  const wrong = shuffle(
    distinct(right, [
      coordText(-la, lo),
      coordText(la, -lo),
      Math.abs(lo) <= 90 ? coordText(lo, la) : coordText(la + (la > 0 ? -15 : 15), lo),
      coordText(-la, -lo),
      coordText(la, lo + (lo > 0 ? -20 : 20)),
    ]),
    rng,
  )
  return {
    type: 'choice',
    key: 'read:' + p.name,
    level: 1,
    eyebrow: 'Přečti souřadnice',
    text: 'Jaké zeměpisné souřadnice má místo se špendlíkem? (zaokrouhleno na celé stupně)',
    why: `Špendlík: ${p.name}, ${Math.abs(la)}° ${ns(la)} od rovníku a ${Math.abs(lo)}° ${ew(lo)} od nultého poledníku. Šířka se píše první.`,
    view: 'world',
    layers: GRID,
    pins: [{ lat: p.lat, lon: p.lon }],
    reveal: [{ lat: p.lat, lon: p.lon, label: p.name }],
    ...options(right, wrong, rng),
    wide: true,
  }
}

/** Level 1: degrees and minutes on a finer grid near home. */
export function readDmTask(p: (typeof NEAR)[number], rng: Rng): ChoiceTask {
  const right = coordText(p.lat, p.lon, true)
  const [ld, lm] = degMin(p.lat)
  const [od, om] = degMin(p.lon)
  const mk = (a: number, am: number, b: number, bm: number) => coordText(a + am / 60, b + bm / 60, true)
  // decimal digits read as minutes (50,09° → "50° 09′"): the classic mistake
  const decLat = Math.round((p.lat - Math.floor(p.lat)) * 100)
  const decLon = Math.round((p.lon - Math.floor(p.lon)) * 100)
  const cands = [
    decLat !== lm && decLat < 60 && Math.abs(decLat - lm) >= 3 ? mk(ld, decLat, od, decLon < 60 ? decLon : om) : '',
    lm !== om ? mk(ld, om, od, lm) : '',
    mk(ld + 1, lm, od, om),
    mk(ld, lm, od - 1, om),
    mk(ld - 1, lm, od + 1, om),
  ].filter(Boolean)
  const wrong = distinct(right, cands)
  return {
    type: 'choice',
    key: 'dm:' + p.name,
    level: 1,
    eyebrow: 'Stupně a minuty',
    text: `Které souřadnice má ${p.name}? Rovnoběžky a poledníky jsou na mapě po ${p.view === 'czechia' ? '1°' : '2°'}.`,
    why: `1° = 60′. ${p.name} leží ${lm}′ severně od rovnoběžky ${ld}° a ${om}′ východně od poledníku ${od}°: ${right}`,
    view: p.view,
    layers: GRID,
    pins: [{ lat: p.lat, lon: p.lon, label: p.name }],
    reveal: [],
    ...options(right, shuffle(wrong, rng), rng),
    wide: true,
  }
}

/** Places for "tap the coordinates": they have a continent view. */
export const PLACE_POOL = WORLD.filter((p) => p.view)

/** Level 1: tap the position with given whole-degree coordinates on a continent map. */
export function placeTask(p: Place, rng: Rng): PlaceTask {
  const view = p.view!
  const la = rLat(p.lat)
  const lo = rLat(p.lon)
  const H = getView(view).H
  const target: LL = [lo, la]
  const variants: LL[] = shuffle(
    [
      [lo, -la],
      [-lo, la],
      [lo + 15, la],
      [lo - 15, la],
      [lo, la + 15],
      [lo, la - 15],
      [lo + 10, la - 10],
      [lo - 10, la + 10],
    ],
    rng,
  )
  const cands: LL[] = [target]
  for (const v of variants) {
    if (cands.length >= 4) break
    if (Math.abs(v[1]) > 85 || !inFrame(view, v[0], v[1], H, 40)) continue
    if (cands.some((c) => Math.abs(c[0] - v[0]) + Math.abs(c[1] - v[1]) < 8)) continue
    cands.push(v)
  }
  const order = shuffle(cands, rng)
  return {
    type: 'place',
    key: 'place:' + p.name,
    level: 1,
    eyebrow: 'Najdi místo',
    text: `Ťukni na místo ${coordText(la, lo)}`,
    why: `Hledané místo leží ${Math.abs(la)}° ${la >= 0 ? 'na sever' : 'na jih'} od rovníku a ${lo === 0 ? 'na nultém poledníku' : `${Math.abs(lo)}° ${lo > 0 ? 'na východ' : 'na západ'} od nultého poledníku`}; je tam ${p.name}.`,
    view,
    layers: GRID,
    pins: [],
    reveal: [{ lat: la, lon: lo, label: p.name }],
    target: { lat: la, lon: lo },
    tolDeg: 3,
    cands: order,
    candAnswer: order.indexOf(target),
  }
}

export type Dir = 'north' | 'south' | 'east' | 'west'
const DIR_WORD: Record<Dir, string> = { north: 'severněji', south: 'jižněji', east: 'východněji', west: 'západněji' }

/** Which of two places lies further in a direction (null when the pair is not fair for it). */
export function further(a: Place, b: Place, dir: Dir): Place | null {
  if (dir === 'north' || dir === 'south') {
    if (Math.abs(a.lat - b.lat) < 2) return null
    const n = a.lat > b.lat ? a : b
    return dir === 'north' ? n : n === a ? b : a
  }
  const d = a.lon - b.lon
  if (Math.abs(d) < 3 || Math.abs(d) > 150) return null
  const e = d > 0 ? a : b
  return dir === 'east' ? e : e === a ? b : a
}

/** Level 1: which of two places lies further north / south / east / west – from the coordinates alone. */
export function compareTask(a: Place, b: Place, dir: Dir, rng: Rng): ChoiceTask {
  const right = further(a, b, dir)
  if (!right) throw new Error(`unfair pair ${a.name} ${b.name} ${dir}`)
  const lab = (p: Place) => `${p.name}: ${coordText(p.lat, p.lon, true)}`
  const ordered = shuffle([a, b], rng)
  const lat = dir === 'north' || dir === 'south'
  const sameSide = lat ? Math.sign(a.lat) === Math.sign(b.lat) : Math.sign(a.lon) === Math.sign(b.lon)
  const other = right === a ? b : a
  let why: string
  if (lat) {
    why =
      Math.sign(a.lat) !== Math.sign(b.lat)
        ? `Severní šířka je vždy severněji než jižní: ${right.name} (${latText(right.lat, true)}) leží ${dir === 'north' ? 'severněji' : 'jižněji'}.`
        : a.lat > 0
          ? `Na severní polokouli platí: čím víc stupňů s. š., tím severněji. ${right.name} (${latText(right.lat, true)}) leží ${DIR_WORD[dir]} než ${other.name}.`
          : `Pozor, jižní polokoule: čím víc stupňů j. š., tím jižněji. ${right.name} (${latText(right.lat, true)}) leží ${DIR_WORD[dir]} než ${other.name}.`
  } else {
    why = !sameSide
      ? `Východní délka je na východ od nultého poledníku, západní na západ: ${right.name} (${lonText(right.lon, true)}) leží ${DIR_WORD[dir]}.`
      : a.lon > 0
        ? `Na východní polokouli: čím víc stupňů v. d., tím východněji. ${right.name} (${lonText(right.lon, true)}) leží ${DIR_WORD[dir]}.`
        : `Na západní polokouli: čím víc stupňů z. d., tím západněji. ${right.name} (${lonText(right.lon, true)}) leží ${DIR_WORD[dir]}.`
  }
  const opts = ordered.map((p, k) => ({ id: String(k), label: lab(p) }))
  return {
    type: 'choice',
    key: `cmp:${[a.name, b.name].sort().join('|')}`,
    level: 1,
    eyebrow: 'Porovnej podle souřadnic',
    text: `Které místo leží ${DIR_WORD[dir]}? Rozhodni jen podle souřadnic.`,
    why,
    view: 'world',
    layers: GRID,
    pins: [],
    reveal: [a, b].map((p) => ({ lat: p.lat, lon: p.lon, label: p.name })),
    options: opts,
    answer: String(ordered.indexOf(right)),
    wide: true,
  }
}

/** A fair comparison pair; tricky pairs (both in the same hemisphere of the compared coordinate) are preferred. */
export function comparePair(rng: Rng, used: Set<string>): ChoiceTask {
  for (let tries = 0; tries < 400; tries++) {
    const dir = pick<Dir>(['north', 'south', 'east', 'west'], rng)
    const [a, b] = shuffle(WORLD, rng)
    if (!further(a, b, dir)) continue
    const lat = dir === 'north' || dir === 'south'
    const same = lat ? Math.sign(a.lat) === Math.sign(b.lat) : Math.sign(a.lon) === Math.sign(b.lon)
    // half the time insist on the southern / western hemisphere trap
    if (tries < 200 && rng() < 0.6 && !(same && (lat ? a.lat < 0 : a.lon < 0))) continue
    const t = compareTask(a, b, dir, rng)
    if (used.has(t.key)) continue
    return t
  }
  throw new Error('no comparison pair')
}

/* ---- level 2 */

const ZONES: Zone[] = ['tropical', 'temperate-n', 'temperate-s', 'polar-n', 'polar-s']

/** World places that lie clearly inside a heat zone (≥ 1° from every line). */
export const ZONE_POOL = WORLD.filter((p) => lineMargin(p.lat) >= 1)

/** Level 2: in which heat zone does a place lie? */
export function zoneTask(p: Place, rng: Rng): ChoiceTask {
  const z = zoneOf(p.lat)
  const near: Zone[] = z === 'tropical' ? ['temperate-n', 'temperate-s', p.lat > 0 ? 'polar-n' : 'polar-s'] : ZONES.filter((x) => x !== z)
  const wrong = shuffle(near, rng).map((x) => ZONE_NAME[x])
  const where =
    z === 'tropical'
      ? `mezi obratníky (${latText(TROPIC, true)} a ${latText(-TROPIC, true)})`
      : z === 'temperate-n'
        ? 'mezi obratníkem Raka a severním polárním kruhem'
        : z === 'temperate-s'
          ? 'mezi obratníkem Kozoroha a jižním polárním kruhem'
          : 'za polárním kruhem'
  return {
    type: 'choice',
    key: 'zone:' + p.name,
    level: 2,
    eyebrow: 'Teplotní pásy',
    text: `Ve kterém teplotním pásu leží ${p.name}?`,
    why: `${p.name} (${latText(p.lat, true)}) leží ${where}, tedy v pásu: ${ZONE_NAME[z]}.`,
    view: 'world',
    layers: ['tropics'],
    pins: [{ lat: p.lat, lon: p.lon, label: p.name }],
    reveal: [],
    ...options(ZONE_NAME[z], wrong, rng),
  }
}

/** Level 2: where can (or cannot) the Sun stand in the zenith? Four places, exactly one differs. */
export function zenithTask(rng: Rng, can: boolean, used: Set<string>): ChoiceTask {
  const inside = shuffle(ZONE_POOL.filter((p) => zenithPossible(p.lat)), rng)
  const outside = shuffle(ZONE_POOL.filter((p) => !zenithPossible(p.lat)), rng)
  const right = (can ? inside : outside).find((p) => !used.has('zen:' + p.name)) ?? (can ? inside : outside)[0]
  const others = (can ? outside : inside).slice(0, 3)
  const all = shuffle([right, ...others], rng)
  return {
    type: 'choice',
    key: 'zen:' + right.name,
    level: 2,
    eyebrow: 'Slunce v nadhlavníku',
    text: can
      ? 'Ve kterém z těchto míst může Slunce v poledne stát přímo v nadhlavníku (zenitu)?'
      : 'Ve kterém z těchto míst Slunce v poledne nikdy nestojí v nadhlavníku (zenitu)?',
    why: can
      ? `Jen mezi obratníky (do ${latText(TROPIC, true)} a ${latText(-TROPIC, true)}). ${right.name} leží na ${latText(right.lat, true)}, ostatní místa jsou za obratníky.`
      : `${right.name} leží na ${latText(right.lat, true)}, tedy za obratníkem; v nadhlavníku je Slunce jen mezi obratníky.`,
    view: 'world',
    layers: ['tropics'],
    pins: all.map((p) => ({ lat: p.lat, lon: p.lon, label: p.name })),
    reveal: [],
    options: all.map((p, k) => ({ id: String(k), label: `${p.name} (${latText(p.lat)})` })),
    answer: String(all.indexOf(right)),
  }
}

const SUN_QS: { key: string; line: string; answer: keyof typeof SUN_DATES; why: string }[] = [
  { key: 'raka', line: 'nad obratníkem Raka', answer: 'june', why: 'V den letního slunovratu (kolem 21. června) je Slunce v nadhlavníku nad obratníkem Raka – nejseverněji, jak to jde.' },
  { key: 'kozoroha', line: 'nad obratníkem Kozoroha', answer: 'december', why: 'Kolem 21. prosince (zimní slunovrat u nás) stojí Slunce v nadhlavníku nad obratníkem Kozoroha.' },
  { key: 'rovnik', line: 'nad rovníkem', answer: 'equinox', why: 'O jarní a podzimní rovnodennosti svítí Slunce kolmo na rovník; den i noc trvají všude asi 12 hodin.' },
  { key: 'praha', line: 'nad Prahou (50° s. š.)', answer: 'never', why: 'Praha leží daleko za obratníkem Raka, Slunce tu nikdy není v nadhlavníku; nejvýš je v červnu, asi 63° nad obzorem.' },
]

/** Level 2: when does the Sun stand in the zenith over a line? */
export function sunDateTask(k: number, rng: Rng): ChoiceTask {
  const q = SUN_QS[k % SUN_QS.length]
  const right = SUN_DATES[q.answer]
  const wrong = Object.values(SUN_DATES).filter((v) => v !== right)
  return {
    type: 'choice',
    key: 'sun:' + q.key,
    level: 2,
    eyebrow: 'Slunce v nadhlavníku',
    text: `Kdy stojí Slunce v poledne v nadhlavníku ${q.line}?`,
    why: q.why,
    view: 'world',
    layers: ['tropics'],
    pins: [],
    reveal: [],
    ...options(right, wrong, rng),
    wide: true,
  }
}
export const SUN_COUNT = SUN_QS.length

/** Level 2: does a place lie beyond the polar circle (polar day in summer, polar night in winter)? */
export function polarTask(p: (typeof POLAR)[number], rng: Rng): ChoiceTask {
  const yes = beyondPolarCircle(p.lat)
  const south = p.lat < 0
  const circle = south ? 'jižním polárním kruhem' : 'severním polárním kruhem'
  const right = yes ? `ano, leží za ${circle}` : `ne, leží ${south ? 'severně' : 'jižně'} od něj`
  const wrong = yes ? `ne, leží ${south ? 'severně' : 'jižně'} od něj` : `ano, leží za ${circle}`
  const opts = shuffle([right, wrong], rng)
  return {
    type: 'choice',
    key: 'polar:' + p.name,
    level: 2,
    eyebrow: 'Polární den a noc',
    text: `Leží ${p.name} (${latText(p.lat, true)}) za ${circle}, takže tam v létě nastává polární den?`,
    why: `${south ? 'Jižní' : 'Severní'} polární kruh leží na ${latText(south ? -POLAR_CIRCLE : POLAR_CIRCLE, true)} ${cap(p.name)} leží na ${latText(p.lat, true)}, tedy ${yes ? 'za ním: polární den tu nastává' : `${south ? 'severně' : 'jižně'} od něj${p.note ? '' : ': Slunce tu každý den zapadne'}`}.${p.note ? ' ' + p.note : ''}`,
    view: p.view,
    layers: ['graticule', 'tropics'],
    pins: [{ lat: p.lat, lon: p.lon, label: p.name }],
    reveal: [],
    options: opts.map((l, k) => ({ id: String(k), label: l })),
    answer: String(opts.indexOf(right)),
    wide: true,
  }
}

const LINES = [
  { name: 'obratník Raka', lat: TROPIC },
  { name: 'obratník Kozoroha', lat: -TROPIC },
  { name: 'severní polární kruh', lat: POLAR_CIRCLE },
  { name: 'jižní polární kruh', lat: -POLAR_CIRCLE },
]

/** Level 2: the latitude of a tropic or polar circle. */
export function lineTask(k: number, rng: Rng): ChoiceTask {
  const l = LINES[k % LINES.length]
  const right = latText(l.lat, true)
  const wrong = distinct(right, [latText(-l.lat, true), latText(Math.sign(l.lat) * (90 - Math.abs(l.lat)), true), latText(Math.sign(l.lat) * (Math.abs(l.lat) > 45 ? 60 : 30), true)])
  return {
    type: 'choice',
    key: 'line:' + l.name,
    level: 2,
    eyebrow: 'Významné rovnoběžky',
    text: `Na jaké zeměpisné šířce leží ${l.name}?`,
    why: `Zemská osa je odkloněná o 23° 26′ od kolmice k rovině oběžné dráhy. Obratníky leží na 23° 26′, polární kruhy na 90° − 23° 26′ = 66° 34′. ${l.name[0].toUpperCase() + l.name.slice(1)}: ${right}`,
    view: 'world',
    layers: ['tropics'],
    pins: [],
    reveal: [],
    ...options(right, wrong, rng),
  }
}
export const LINE_COUNT = LINES.length

/* ------------------------------------------------------------------ rounds */

type Gen = (rng: Rng, used: Set<string>) => Task

function fromPool<P extends { name: string }>(prefix: string, pool: P[], make: (p: P, rng: Rng) => Task): Gen {
  return (rng, used) => {
    const free = pool.filter((p) => !used.has(prefix + p.name))
    return make(pick(free.length ? free : pool, rng), rng)
  }
}

const GEN: Record<string, Gen> = {
  read: fromPool('read:', READ_POOL, readTask),
  dm: fromPool('dm:', NEAR, readDmTask),
  place: fromPool('place:', PLACE_POOL, placeTask),
  cmp: (rng, used) => comparePair(rng, used),
  zone: fromPool('zone:', ZONE_POOL, zoneTask),
  zenCan: (rng, used) => zenithTask(rng, true, used),
  zenNot: (rng, used) => zenithTask(rng, false, used),
  sun: (rng) => sunDateTask(Math.floor(rng() * SUN_COUNT), rng),
  polar: fromPool('polar:', POLAR, polarTask),
  line: (rng) => lineTask(Math.floor(rng() * LINE_COUNT), rng),
}

/** Task mix of a round per level (10 tasks each). */
export const PLAN: Record<number | 'mix', string[]> = {
  1: ['read', 'read', 'dm', 'place', 'cmp', 'read', 'place', 'dm', 'cmp', 'place'],
  2: ['zone', 'line', 'zone', 'zenCan', 'polar', 'sun', 'zone', 'polar', 'zenNot', 'polar'],
  mix: ['read', 'zone', 'place', 'dm', 'zenCan', 'cmp', 'polar', 'place', 'sun', 'zone'],
}

export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const plan = PLAN[level !== undefined && LEVELS[level] ? level : 'mix']
  const used = new Set<string>()
  const out: Task[] = []
  for (const kind of plan) {
    let t: Task | undefined
    for (let k = 0; k < 30; k++) {
      const c = GEN[kind](rng, used)
      if (!used.has(c.key)) {
        t = c
        break
      }
    }
    if (!t) continue
    used.add(t.key)
    out.push(t)
  }
  return out
}

/* ------------------------------------------------------------------ checking a tap */

/** Grade of a tap for a place task: distance (SVG units) against the tolerance radius. */
export function gradePlace(dist: number, tol: number): 'hit' | 'near' | 'miss' {
  if (dist <= tol) return 'hit'
  if (dist <= 2 * tol) return 'near'
  return 'miss'
}
