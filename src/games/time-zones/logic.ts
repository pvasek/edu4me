/**
 * Časová pásma – pure logic: local solar time from longitude, zone time from UTC offsets, flights and the
 * date line. Every answer is computed here from levels.ts (offsets, longitudes, flight times).
 */
import type { MapPoint, MapRoute } from '../../core/types'
import { pick, shuffle } from '../shared/util'
import { levelNum } from '../types'
import { CITIES, FLIGHTS, TOWNS, WEEKDAYS, WEEKDAY_IN, type City } from './levels'

export type Rng = () => number
export const LEVELS: Record<number, true> = { 2: true }

export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

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

/* ------------------------------------------------------------------ time arithmetic */

const NB = ' '
const DAY = 24 * 60

/** "6:05" from minutes after midnight (wrapped into one day). */
export function hm(min: number): string {
  const m = ((Math.round(min) % DAY) + DAY) % DAY
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}
/** Day shift of a time in minutes: −1, 0, +1 … */
export const dayShift = (min: number) => Math.floor(Math.round(min) / DAY)

/** "UTC+5:30", "UTC−5", "UTC" */
export function utcText(off: number): string {
  if (off === 0) return 'UTC'
  const a = Math.abs(off)
  const h = Math.floor(a)
  const m = Math.round((a - h) * 60)
  return `UTC${off > 0 ? '+' : '−'}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`
}

/** Parses "14:30", "14.30", "14,30", "14 30", "1430", "9" → minutes after midnight; null when it is not a time. */
export function parseTime(input: string): number | null {
  const s = input.trim().replace(/\s*h(od)?\.?$/i, '')
  let m = s.match(/^(\d{1,2})\s*[:.,h ]\s*(\d{2})$/)
  if (!m) m = s.match(/^(\d{1,2})(\d{2})$/)
  if (m) {
    const h = Number(m[1])
    const mi = Number(m[2])
    if (h > 24 || mi > 59) return null
    return (h % 24) * 60 + mi
  }
  const h = s.match(/^(\d{1,2})$/)
  if (h && Number(h[1]) <= 24) return (Number(h[1]) % 24) * 60
  return null
}
/** Parses a whole number of minutes ("24", "24 min"). */
export function parseMinutes(input: string): number | null {
  const s = input.trim().replace(/\s*min(ut)?\.?$/i, '').replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(s)) return null
  return Number(s)
}

/** Local solar time difference in minutes between two longitudes (east is later): 1° = 4 min. */
export const solarDiff = (lonFrom: number, lonTo: number) => (lonTo - lonFrom) * 4

/** Converts a clock time between two UTC offsets (hours). */
export const convert = (min: number, offFrom: number, offTo: number) => min + (offTo - offFrom) * 60

/* ------------------------------------------------------------------ tasks */

export type Season = 'jan' | 'jul'
export const SEASON_TEXT: Record<Season, string> = { jan: 'v lednu', jul: 'v červenci' }
export const off = (c: City, s: Season) => c[s]
/** "12:00 SEČ" for Prague, otherwise "12:00 místního času". */
const clock = (c: City, s: Season, min: number) => `${hm(min)}${c.name === 'Praha' ? NB + (s === 'jan' ? 'SEČ' : 'SELČ') : ' místního času'}`

interface Base {
  key: string
  eyebrow: string
  text: string
  why: string
  points: MapPoint[]
  routes: MapRoute[]
}
export interface ChoiceTask extends Base {
  type: 'choice'
  options: { id: string; label: string }[]
  answer: string
}
export interface TimeTask extends Base {
  type: 'time'
  /** minutes after midnight */
  answer: number
}
export interface MinutesTask extends Base {
  type: 'minutes'
  answer: number
  /** accepted difference, minutes */
  tol: number
}
export type Task = ChoiceTask | TimeTask | MinutesTask

function choice(right: string, wrong: string[], rng: Rng) {
  const w: string[] = []
  for (const x of wrong) if (x !== right && !w.includes(x)) w.push(x)
  const labels = shuffle([right, ...w.slice(0, 3)], rng)
  return { options: labels.map((l, k) => ({ id: String(k), label: l })), answer: String(labels.indexOf(right)) }
}
const cityPt = (c: City): MapPoint => ({ lat: c.lat, lon: c.lon, label: c.name, kind: 'city' })
const byName = (n: string) => CITIES.find((c) => c.name === n)!

const merText = (lon: number) => (lon === 0 ? 'Nultý poledník' : `Poledník ${Math.abs(lon)}°${NB}${lon > 0 ? 'v.' : 'z.'}${NB}d.`)
const lonWord = (lon: number) => (lon === 0 ? 'nultém poledníku (Greenwich)' : `poledníku ${Math.abs(lon)}°${NB}${lon > 0 ? 'v.' : 'z.'}${NB}d.`)

/** Local solar time on another meridian (typed answer). Meridians are whole multiples of 5°. */
export function solarTask(rng: Rng): TimeTask {
  for (;;) {
    const from = pick([0, 15, 15, -75, 30, 120], rng)
    let to = Math.round((rng() * 340 - 170) / 5) * 5
    if (Math.abs(to - from) < 10 || Math.abs(to - from) > 150) continue
    const start = pick([9 * 60, 10 * 60, 12 * 60, 12 * 60, 14 * 60], rng)
    const diff = solarDiff(from, to)
    const ans = start + diff
    if (ans < 0 || ans >= DAY) continue
    to = to === 0 ? 0 : to
    const dir = to > from ? 'východně' : 'západně'
    const dlon = Math.abs(to - from)
    const h = Math.floor(Math.abs(diff) / 60)
    const mi = Math.abs(diff) % 60
    return {
      type: 'time',
      key: `solar:${from}:${to}`,
      eyebrow: 'Místní sluneční čas',
      text: `Na ${lonWord(from)} je ${hm(start)} místního slunečního času. Kolik je místního slunečního času na ${lonWord(to)}?`,
      why: `${merText(to)} leží o ${dlon}° ${dir}; ${dlon}° · 4 min = ${Math.abs(diff)} min${h ? ` = ${h} h${mi ? ` ${mi} min` : ''}` : ''}. Na východě je později, na západě dříve: ${hm(start)} ${diff > 0 ? '+' : '−'} ${Math.abs(diff)} min = ${hm(ans)}.`,
      points: [],
      routes: [
        { points: [{ lat: -60, lon: from }, { lat: 72, lon: from }], tone: 'b', label: `${merText(from).replace('Poledník ', '')}: ${hm(start)}` },
        { points: [{ lat: -60, lon: to }, { lat: 72, lon: to }], tone: 'a', style: 'dashed', label: `${merText(to).replace('Poledník ', '')}: ?` },
      ],
      answer: ans,
    }
  }
}

/** How many minutes earlier the Sun rises (or noon comes) in one Czech town than in another. */
export function townTask(rng: Rng): MinutesTask {
  for (;;) {
    const [a, b] = shuffle(TOWNS, rng)
    const d = Math.abs(a.lon - b.lon)
    if (d < 1.5) continue
    const east = a.lon > b.lon ? a : b
    const west = east === a ? b : a
    const min = d * 4
    return {
      type: 'minutes',
      key: `town:${[a.name, b.name].sort().join('|')}`,
      eyebrow: 'Místní čas v Česku',
      text: `O kolik minut dříve nastává místní poledne ${east.loc} (${degText(east.lon)}) než ${west.loc} (${degText(west.lon)})?`,
      why: `Rozdíl délek je ${fmtDec(d)}°; 1° = 4 min, takže ${fmtDec(d)} · 4 ≐ ${Math.round(min)} min. Na východě je Slunce nejvýš dřív.`,
      points: [],
      routes: [],
      answer: Math.round(min),
      tol: 1,
    }
  }
}
function degText(lon: number): string {
  const tm = Math.round(lon * 60)
  return `${Math.floor(tm / 60)}°${NB}${String(tm % 60).padStart(2, '0')}′${NB}v.${NB}d.`
}
const fmtDec = (x: number) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',')

/** Day words. */
const DAY_REL = (s: number) => (s === 0 ? 'téhož dne' : s === 1 ? 'následujícího dne' : s === -1 ? 'předchozího dne' : s > 0 ? `o ${s} dny později` : `o ${-s} dny dříve`)
const withDay = (min: number) => `${hm(min)} ${DAY_REL(dayShift(min))}`

/** Zone time in another city at the same moment. */
export function zoneTask(rng: Rng, used: Set<string>): ChoiceTask {
  for (let k = 0; ; k++) {
    const s: Season = rng() < 0.5 ? 'jan' : 'jul'
    const a = rng() < 0.6 ? byName('Praha') : pick(CITIES, rng)
    const b = pick(CITIES, rng)
    if (a === b || off(a, s) === off(b, s)) continue
    const key = `zone:${a.name}:${b.name}`
    if (used.has(key) && k < 50) continue
    const start = pick([8, 9, 10, 12, 15, 18, 20], rng) * 60
    const ans = convert(start, off(a, s), off(b, s))
    const other: Season = s === 'jan' ? 'jul' : 'jan'
    const sameDay = (m: number) => (dayShift(m) === 0 ? hm(m) : withDay(m))
    const right = sameDay(ans)
    const wrong = [
      sameDay(start - (off(b, s) - off(a, s)) * 60),
      sameDay(convert(start, off(a, other), off(b, other))),
      sameDay(ans + 60),
      sameDay(ans - 60),
      sameDay(ans + 30),
    ]
    const utc = start - off(a, s) * 60
    return {
      type: 'choice',
      key,
      eyebrow: 'Pásmový čas',
      text: `${SEASON_TEXT[s][0].toUpperCase() + SEASON_TEXT[s].slice(1)} je ${a.loc} ${clock(a, s, start)}. Kolik je ve stejnou chvíli ${b.loc}?`,
      why: `${a.name} má ${SEASON_TEXT[s]} ${utcText(off(a, s))}, ${b.name} ${utcText(off(b, s))}. Přes UTC: ${hm(start)} → ${hm(utc)} UTC → ${right}.`,
      points: [cityPt(a), cityPt(b)],
      routes: [],
      ...choice(right, wrong, rng),
    }
  }
}

/** Flight puzzle: departure in local time, flight time, local time at arrival (with the day). */
export function flightTask(f: (typeof FLIGHTS)[number], rng: Rng): ChoiceTask {
  const [an, bn, dur] = f
  const a = byName(an)
  const b = byName(bn)
  const s: Season = rng() < 0.5 ? 'jan' : 'jul'
  const dep = pick([8, 10, 13, 16, 22], rng) * 60
  const arrive = convert(dep + dur * 60, off(a, s), off(b, s))
  const right = withDay(arrive)
  const wrong = [
    withDay(dep + dur * 60),
    withDay(dep + dur * 60 - (off(b, s) - off(a, s)) * 60),
    withDay(arrive + 24 * 60 * (dayShift(arrive) === 0 ? 1 : -Math.sign(dayShift(arrive)))),
    withDay(arrive + 60),
  ]
  const utcDep = dep - off(a, s) * 60
  return {
    type: 'choice',
    key: `flight:${an}:${bn}`,
    eyebrow: 'Let přes časová pásma',
    text: `${SEASON_TEXT[s][0].toUpperCase() + SEASON_TEXT[s].slice(1)} odlétáš ${FROM[a.name]} v ${clock(a, s, dep)}, let trvá ${dur} h. Kolik bude ${b.loc} při přistání?`,
    why: `Odlet ${hm(dep)} (${utcText(off(a, s))}) = ${hm(utcDep)} UTC${dayShift(utcDep) ? ` ${DAY_REL(dayShift(utcDep))}` : ''}; + ${dur} h = ${hm(utcDep + dur * 60)} UTC${dayShift(utcDep + dur * 60) ? ` ${DAY_REL(dayShift(utcDep + dur * 60))}` : ''}; ${b.name} má ${utcText(off(b, s))}: ${right}.`,
    points: [cityPt(a), cityPt(b)],
    routes: [{ points: [a, b].map((c) => ({ lat: c.lat, lon: c.lon })), tone: 'b', style: 'dashed', arrow: true }],
    ...choice(right, wrong, rng),
  }
}
/** "z Prahy" etc. for the departure city (genitive forms of the curated cities). */
export const FROM: Record<string, string> = {
  Praha: 'z Prahy',
  Londýn: 'z Londýna',
  'New York': 'z New Yorku',
  Tokio: 'z Tokia',
  Sydney: 'ze Sydney',
  Auckland: 'z Aucklandu',
  Peking: 'z Pekingu',
}

/** Crossing the date line by ship (or plane): which day is it on the other side? */
export function datelineTask(rng: Rng): ChoiceTask {
  const day = Math.floor(rng() * 7)
  const west = rng() < 0.5 // westwards: from America to Asia → one day later
  const ans = (day + (west ? 1 : 6)) % 7
  const wrongs = [day, (day + (west ? 6 : 1)) % 7, (day + 2) % 7, (day + 5) % 7].map((d) => WEEKDAYS[d])
  const route = west
    ? { text: 'z Aljašky na Čukotku (na západ)', from: { lat: 65.6, lon: -168.1 }, to: { lat: 66.1, lon: 169.8 } }
    : { text: 'ze Samoy na Havajské ostrovy (na východ)', from: { lat: -13.8, lon: 172.1 }, to: { lat: 21.3, lon: -157.9 } }
  return {
    type: 'choice',
    key: `date:${west ? 'w' : 'e'}:${day}`,
    eyebrow: 'Datová hranice',
    text: `Pluješ lodí ${route.text} a ${WEEKDAY_IN[day]} v poledne překročíš datovou hranici. Jaký den je hned za ní?`,
    why: west
      ? `Na západ přes datovou hranici se datum posune o den dopředu: ${WEEKDAYS[day]} → ${WEEKDAYS[ans]}. Hodiny ukazují pořád asi poledne.`
      : `Na východ přes datovou hranici se datum posune o den zpět: ${WEEKDAYS[day]} → ${WEEKDAYS[ans]}. Ten den zažiješ dvakrát.`,
    points: [],
    routes: [{ points: [route.from, route.to], tone: 'b', style: 'dashed', arrow: true }],
    ...choice(WEEKDAYS[ans], wrongs, rng),
  }
}

/** The legal offset of a city vs. the one its longitude suggests (15° = 1 h). */
export function offsetTask(c: City, rng: Rng): ChoiceTask {
  const s: Season = c.jan === c.jul ? (rng() < 0.5 ? 'jan' : 'jul') : rng() < 0.5 ? 'jan' : 'jul'
  const o = off(c, s)
  const nominal = Math.round(c.lon / 15)
  const right = utcText(o)
  const other = s === 'jan' ? c.jul : c.jan
  const wrong = [utcText(nominal), utcText(other), utcText(-o), utcText(o + 1), utcText(o - 1), utcText(Math.trunc(o))]
  const standard = c.lat > 0 ? c.jan : c.jul
  const dst = o !== standard
  const deg = `${Math.round(Math.abs(c.lon))}°${NB}${c.lon >= 0 ? 'v.' : 'z.'}${NB}d.`
  const base =
    standard !== nominal
      ? `Podle zeměpisné délky (${deg}) by sem patřilo pásmo ${utcText(nominal)}, ale stát má standardní čas ${utcText(standard)}${standard % 1 ? ' (posun o část hodiny)' : ''}: hranice pásem kopírují hranice států.`
      : `${c.name} leží asi na ${deg}, nejblíž ${nominal ? `poledníku ${Math.abs(nominal * 15)}°` : 'nultému poledníku'}: standardní čas ${utcText(standard)}.`
  const why = `${base}${dst ? ` ${SEASON_TEXT[s][0].toUpperCase() + SEASON_TEXT[s].slice(1)} tam platí letní čas, o hodinu víc: ${right}.` : c.jan !== c.jul ? ` ${SEASON_TEXT[s][0].toUpperCase() + SEASON_TEXT[s].slice(1)} letní čas neplatí.` : ''}`
  return {
    type: 'choice',
    key: 'offset:' + c.name,
    eyebrow: 'Posun od UTC',
    text: `Jaký časový posun od UTC platí ${SEASON_TEXT[s]} ${c.loc}?`,
    why,
    points: [cityPt(c)],
    routes: [],
    ...choice(right, wrong, rng),
  }
}

/* ------------------------------------------------------------------ rounds */

type Gen = (rng: Rng, used: Set<string>) => Task
const GEN: Record<string, Gen> = {
  solar: (rng) => solarTask(rng),
  town: (rng) => townTask(rng),
  zone: (rng, used) => zoneTask(rng, used),
  flight: (rng, used) => {
    const free = FLIGHTS.filter((f) => !used.has(`flight:${f[0]}:${f[1]}`))
    return flightTask(pick(free.length ? free : FLIGHTS, rng), rng)
  },
  date: (rng) => datelineTask(rng),
  offset: (rng, used) => {
    const free = CITIES.filter((c) => !used.has('offset:' + c.name))
    return offsetTask(pick(free, rng), rng)
  },
}

export const PLAN = ['solar', 'offset', 'zone', 'town', 'flight', 'zone', 'solar', 'date', 'flight', 'offset']
export const ROUND = PLAN.length

export function makeRound(_level?: number, rng: Rng = Math.random): Task[] {
  const used = new Set<string>()
  const out: Task[] = []
  for (const kind of PLAN) {
    for (let k = 0; k < 40; k++) {
      const t = GEN[kind](rng, used)
      if (used.has(t.key)) continue
      used.add(t.key)
      out.push(t)
      break
    }
  }
  return out
}

/** Checks a typed answer: 'invalid' (not a time / number), 'ok' or 'wrong'. */
export function checkTyped(t: TimeTask | MinutesTask, input: string): { kind: 'invalid' } | { kind: 'ok' | 'wrong'; value: number } {
  if (t.type === 'time') {
    const v = parseTime(input)
    if (v === null) return { kind: 'invalid' }
    return { kind: v === ((t.answer % DAY) + DAY) % DAY ? 'ok' : 'wrong', value: v }
  }
  const v = parseMinutes(input)
  if (v === null) return { kind: 'invalid' }
  return { kind: Math.abs(v - t.answer) <= t.tol ? 'ok' : 'wrong', value: v }
}
