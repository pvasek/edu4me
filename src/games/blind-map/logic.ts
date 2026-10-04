/**
 * Slepá mapa – pure logic: tasks per level and the tap check. Answers come from the map data (state and region
 * codes, river names) and the curated features in levels.ts; nothing is typed by hand.
 */
import type { MapHighlight, MapLayer, MapPoint, MapView } from '../../core/types'
import { COUNTRY_NAMES, CZ_REGION_NAMES } from '../../geo/codes'
import { getView, project } from '../../geo/frame'
import type { GeoData } from '../../geo/load'
import { pick, shuffle } from '../shared/util'
import { levelNum } from '../types'
import { countryOf, hitArea, hitFeature, inFrame, regionOf, tolUnits, type LL } from './hit'
import {
  BORDERS,
  BORDER_TYPES,
  CONFLICTS,
  CONTINENTS,
  CZ_CAPITALS,
  CZ_MOUNTAINS,
  CZ_NOTE_20,
  CZ_RIVERS,
  DISPUTED,
  ENCLAVES,
  EUROPE_CAPITALS,
  EUROPE_MOUNTAINS,
  EUROPE_NAME,
  EUROPE_RIVERS,
  EUROPE_TAP,
  MECH_TEXT,
  MICRO,
  TAP_FEATURES,
  WORLD_FEATURES,
  type Capital,
  type Feature,
  type Item,
  type Mech,
  type River,
} from './levels'

export type Rng = () => number
export const LEVELS: Record<number, true> = { 3: true, 7: true, 8: true, 9: true, 11: true }

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
/** A seed from a string (stable numbered places for one task). */
export const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7)

/** Czech name of a state or region code. */
export const nameOf = (code: string) => COUNTRY_NAMES[code] ?? CZ_REGION_NAMES[code] ?? code

/* ------------------------------------------------------------------ targets */

export type Target =
  | { kind: 'state'; code: string }
  | { kind: 'region'; code: string }
  | { kind: 'feature'; id: string; name: string; parts: LL[][] }
  | { kind: 'river'; name: string; data: string[] }

export const targetName = (t: Target) => (t.kind === 'state' || t.kind === 'region' ? nameOf(t.code) : t.name)

/** River lines of the data with one of `names` (lon/lat parts). */
export function riverParts(data: GeoData | undefined, names: string[]): LL[][] {
  if (!data) return []
  const out: LL[][] = []
  for (const r of data.rivers)
    if (names.includes(r.name))
      for (const p of r.parts) {
        const line: LL[] = []
        for (let i = 0; i + 1 < p.length; i += 2) line.push([p[i], p[i + 1]])
        out.push(line)
      }
  return out
}

/** Lines of a line target (features and rivers); [] for areas. */
export function partsOf(t: Target, data: GeoData | undefined): LL[][] {
  if (t.kind === 'feature') return t.parts
  if (t.kind === 'river') return riverParts(data, t.data)
  return []
}

/** A point that stands for the target on the map (for the numbered no-tap places). */
export function anchorOf(t: Target, view: MapView, data: GeoData | undefined): LL | undefined {
  if (t.kind === 'state' || t.kind === 'region') return data?.labels[t.code]
  const H = getView(view).H
  const pts = partsOf(t, data)
    .flat()
    .filter(([lon, lat]) => inFrame(view, lon, lat, H, 30))
  if (!pts.length) return undefined
  if (t.kind === 'feature') {
    const longest = t.parts.reduce((a, b) => (b.length > a.length ? b : a))
    return longest[Math.floor(longest.length / 2)]
  }
  return pts[Math.floor(pts.length / 2)]
}

/* ------------------------------------------------------------------ tasks */

interface Base {
  key: string
  level: number
  eyebrow: string
  text: string
  why: string
  view: MapView
  layers: MapLayer[]
  highlight: MapHighlight[]
  points: MapPoint[]
  /** a line feature shown with the question */
  show?: Target
}
export interface TapTask extends Base {
  type: 'tap'
  target: Target
  /** other features of the set: a tap nearer to one of them does not count */
  others: Target[]
  /** other targets offered as numbered places in the no-tap mode */
  alts: Target[]
}
export interface ChoiceTask extends Base {
  type: 'choice'
  options: { id: string; label: string }[]
  answer: string
  wide?: boolean
}
export type Task = TapTask | ChoiceTask

function choice(right: string, wrong: string[], rng: Rng) {
  const w: string[] = []
  for (const x of wrong) if (x !== right && !w.includes(x)) w.push(x)
  const labels = shuffle([right, ...w.slice(0, 3)], rng)
  return { options: labels.map((l, k) => ({ id: String(k), label: l })), answer: String(labels.indexOf(right)) }
}
/** One line about a feature: its note, how it formed, or its age. */
export function featureWhy(f: Feature): string {
  if (f.note) return f.note
  if (f.mechWhy) return `${f.name}: ${f.mechWhy}`
  if (f.age) return `${f.name}: ${f.age === 'old' ? 'staré pohoří, vyvrásněné v prvohorách a dnes zarovnané' : 'mladé pohoří, vyvrásněné v třetihorách'}.`
  return `${f.name}.`
}
const feat = (f: Feature): Target => ({ kind: 'feature', id: f.id, name: f.name, parts: f.parts })
const riv = (r: River): Target => ({ kind: 'river', name: r.name, data: r.data })
const H3: MapLayer[] = ['plates']

/* ---- level 3 */

export function tapFeatureTask(f: Feature, level: number, pool: Feature[], layers: MapLayer[], rng: Rng): TapTask {
  const same = pool.filter((x) => x.view === f.view && x.id !== f.id)
  return {
    type: 'tap',
    key: 'f:' + f.id,
    level,
    eyebrow: f.kind === 'volcano' ? 'Sopky' : 'Pohoří',
    text: `Ťukni na ${f.acc}.`,
    why: featureWhy(f),
    view: f.view,
    layers,
    highlight: [],
    points: [],
    target: feat(f),
    others: same.map(feat),
    alts: shuffle(same, rng).slice(0, 3).map(feat),
  }
}

export function nameFeatureTask(f: Feature, level: number, pool: Feature[], layers: MapLayer[], rng: Rng): ChoiceTask {
  const wrong = shuffle(pool.filter((x) => x.kind === f.kind && x.name !== f.name), rng).map((x) => x.name)
  return {
    type: 'choice',
    key: 'f:' + f.id,
    level,
    eyebrow: f.kind === 'volcano' ? 'Sopky' : 'Pohoří',
    text: f.kind === 'volcano' ? 'Která sopka je vyznačená?' : 'Které pohoří je vyznačené?',
    why: featureWhy(f),
    view: f.view,
    layers,
    highlight: [],
    points: [],
    show: feat(f),
    ...choice(f.name, wrong, rng),
  }
}

export function mechTask(f: Feature, rng: Rng): ChoiceTask {
  const m = f.mech!
  const wrong = (Object.keys(MECH_TEXT) as Mech[]).filter((k) => k !== m).map((k) => MECH_TEXT[k])
  return {
    type: 'choice',
    key: 'f:' + f.id,
    level: 3,
    eyebrow: 'Desky a sopky',
    text: f.kind === 'volcano' ? `Proč je u sopky ${f.name} sopečná činnost? Pomůžou hranice desek.` : `Jak vzniklo pohoří ${f.name}? Pomůžou hranice desek.`,
    why: f.mechWhy!,
    view: f.view,
    layers: H3,
    highlight: [],
    points: f.kind === 'volcano' ? [{ lat: f.parts[0][0][1], lon: f.parts[0][0][0], label: f.name, kind: 'volcano' }] : [],
    show: f.kind === 'range' ? feat(f) : undefined,
    ...choice(MECH_TEXT[m], wrong, rng),
    wide: true,
  }
}

export const AGE_TEXT = { young: 'mladé pohoří (alpínsko-himálajské vrásnění)', old: 'staré pohoří (vrásnění v prvohorách)' } as const
export function ageTask(f: Feature, rng: Rng): ChoiceTask {
  const a = f.age!
  const opts = shuffle([AGE_TEXT.young, AGE_TEXT.old], rng)
  return {
    type: 'choice',
    key: 'f:' + f.id,
    level: 3,
    eyebrow: 'Mladá a stará pohoří',
    text: `Je vyznačené pohoří ${f.name} mladé, nebo staré?`,
    why:
      a === 'young'
        ? `Pohoří ${f.name} se vyvrásnilo v třetihorách a zvedá se dodnes: vysoké, ostré štíty, časté zemětřesení.`
        : `Pohoří ${f.name} se vyvrásnilo v prvohorách; eroze ho za stovky milionů let snížila a zaoblila.`,
    view: f.view,
    layers: H3,
    highlight: [],
    points: [],
    show: feat(f),
    options: opts.map((l, k) => ({ id: String(k), label: l })),
    answer: String(opts.indexOf(AGE_TEXT[a])),
    wide: true,
  }
}

/* ---- states and regions */

export function tapStateTask(code: string, view: MapView, pool: string[], level: number, rng: Rng, text?: string, why?: string): TapTask {
  const region = code.startsWith('CZ-')
  return {
    type: 'tap',
    key: 's:' + code,
    level,
    eyebrow: region ? 'Kraje Česka' : 'Státy',
    text: text ?? `Ťukni na ${region ? 'kraj' : 'stát'}: ${nameOf(code)}.`,
    why: why ?? `Tady leží ${nameOf(code)}.`,
    view,
    layers: region ? ['regions'] : [],
    highlight: [],
    points: [],
    target: region ? { kind: 'region', code } : { kind: 'state', code },
    others: [],
    alts: shuffle(pool.filter((c) => c !== code), rng)
      .slice(0, 3)
      .map((c) => (region ? { kind: 'region' as const, code: c } : { kind: 'state' as const, code: c })),
  }
}

export function nameStateTask(code: string, view: MapView, pool: string[], level: number, rng: Rng, text?: string, why?: string, optCodes?: string[]): ChoiceTask {
  const region = code.startsWith('CZ-')
  const wrong = (optCodes ?? shuffle(pool, rng)).filter((c) => c !== code).map(nameOf)
  return {
    type: 'choice',
    key: 's:' + code,
    level,
    eyebrow: region ? 'Kraje Česka' : 'Státy',
    text: text ?? `Který ${region ? 'kraj' : 'stát'} je vyznačený?`,
    why: why ?? `Vyznačený ${region ? 'kraj' : 'stát'}: ${nameOf(code)}.`,
    view,
    layers: region ? ['regions'] : [],
    highlight: [{ codes: [code], tone: 'b' }],
    points: [],
    ...choice(nameOf(code), wrong, rng),
  }
}

/* ---- capitals */

export function capitalNameTask(c: Capital, pool: Capital[], view: MapView, level: number, rng: Rng): ChoiceTask {
  const region = c.code.startsWith('CZ-')
  const wrong = shuffle(pool.filter((x) => x.name !== c.name), rng).map((x) => x.name)
  return {
    type: 'choice',
    key: 'c:' + c.name,
    level,
    eyebrow: region ? 'Krajská města' : 'Hlavní města',
    text: region ? 'Které krajské město je vyznačené?' : 'Které hlavní město je vyznačené?',
    why: `${nameOf(c.code)} – ${region ? 'krajské' : 'hlavní'} město: ${c.name}.${c.code === 'CZ-10' ? ' ' + CZ_NOTE_20 : ''}`,
    view,
    layers: region ? ['regions', 'rivers'] : [],
    highlight: [],
    points: [{ lat: c.lat, lon: c.lon, kind: 'capital' }],
    ...choice(c.name, wrong, rng),
  }
}

export function capitalTapTask(c: Capital, pool: string[], view: MapView, level: number, rng: Rng): TapTask {
  const region = c.code.startsWith('CZ-')
  return tapStateTask(
    c.code,
    view,
    pool,
    level,
    rng,
    region ? `Ťukni na kraj, jehož krajským městem je ${c.name}.` : `Ťukni na stát, jehož hlavním městem je ${c.name}.`,
    `${nameOf(c.code)} – ${region ? 'krajské' : 'hlavní'} město: ${c.name}.`,
  )
}

/* ---- rivers and mountains */

export function riverTapTask(r: River, pool: River[], view: MapView, level: number, layers: MapLayer[], rng: Rng): TapTask {
  const others = pool.filter((x) => x.name !== r.name)
  return {
    type: 'tap',
    key: 'r:' + r.name,
    level,
    eyebrow: 'Řeky',
    text: `Ťukni na řeku ${r.acc}.`,
    why: r.note,
    view,
    layers,
    highlight: [],
    points: [],
    target: riv(r),
    others: others.map(riv),
    alts: shuffle(others, rng).slice(0, 3).map(riv),
  }
}
export function riverNameTask(r: River, pool: River[], view: MapView, level: number, layers: MapLayer[], rng: Rng): ChoiceTask {
  return {
    type: 'choice',
    key: 'r:' + r.name,
    level,
    eyebrow: 'Řeky',
    text: 'Která řeka je vyznačená?',
    why: r.note,
    view,
    layers,
    highlight: [],
    points: [],
    show: riv(r),
    ...choice(r.name, shuffle(pool, rng).map((x) => x.name), rng),
  }
}

/* ---- level 11 */

export function itemTask(it: Item, eyebrow: string, rng: Rng): ChoiceTask {
  return {
    type: 'choice',
    key: 'i:' + it.id,
    level: 11,
    eyebrow,
    text: it.text,
    why: it.why,
    view: it.view,
    layers: [],
    highlight: it.point ? [] : [{ codes: [it.code], tone: 'b' }],
    points: it.point ? [{ ...it.point, kind: 'place' }] : [],
    ...choice(nameOf(it.code), it.options.map(nameOf), rng),
  }
}

/** Whether a state is curated as tappable on a view (big enough on a phone). */
export function tappable(view: MapView, code: string): boolean {
  if (view === 'europe') return EUROPE_TAP.includes(code)
  return CONTINENTS.some((c) => c.view === view && c.tap.includes(code))
}

export function conflictTask(it: Item, rng: Rng, tap: boolean): Task {
  if (tap && tappable(it.view, it.code)) {
    const pool = it.options.filter((c) => tappable(it.view, c))
    return tapStateTask(it.code, it.view, pool, 11, rng, `${it.text} Ťukni na ten stát.`, it.why.startsWith(nameOf(it.code)) ? it.why : `${nameOf(it.code)}. ${it.why}`)
  }
  return { ...itemTask(it, 'Konflikty', rng), text: `${it.text}${it.text.endsWith('?') ? '' : ' Který vyznačený stát to je?'}`, why: it.why.startsWith(nameOf(it.code)) ? it.why : `${nameOf(it.code)}. ${it.why}` }
}

export function borderTask(b: (typeof BORDERS)[number], rng: Rng): ChoiceTask {
  const right = BORDER_TYPES[b.type]
  return {
    type: 'choice',
    key: 'b:' + b.id,
    level: 11,
    eyebrow: 'Hranice',
    text: `Jaký typ hranice to je? (${nameOf(b.codes[0])} – ${nameOf(b.codes[1])})`,
    why: b.why,
    view: b.view,
    layers: [],
    highlight: [
      { codes: [b.codes[0]], tone: 'b' },
      { codes: [b.codes[1]], tone: 'c' },
    ],
    points: [],
    ...choice(right, Object.values(BORDER_TYPES), rng),
    wide: true,
  }
}

/* ------------------------------------------------------------------ rounds */

type Gen = (rng: Rng, used: Set<string>) => Task | undefined | '' // '' or undefined: nothing left to ask

const free = <T>(xs: T[], key: (x: T) => string, used: Set<string>) => xs.filter((x) => !used.has(key(x)))
const byId = (id: string) => WORLD_FEATURES.find((f) => f.id === id)!
const RANGES = WORLD_FEATURES.filter((f) => f.kind === 'range')
const CZ_REG = Object.keys(CZ_REGION_NAMES)
const EU_ALL = [...EUROPE_TAP, ...EUROPE_NAME]
const EU_RIVER_LAYERS: MapLayer[] = ['rivers']
const CZ_LAYERS: MapLayer[] = ['regions', 'rivers']

function pickFree<T>(xs: T[], key: (x: T) => string, used: Set<string>, rng: Rng): T | undefined {
  const f = free(xs, key, used)
  return f.length ? pick(f, rng) : undefined
}

const GEN: Record<string, Gen> = {
  // level 3
  tapRange: (rng, used) => {
    const f = pickFree(TAP_FEATURES.map(byId).filter((x) => x.kind === 'range'), (x) => 'f:' + x.id, used, rng)
    return f && tapFeatureTask(f, 3, WORLD_FEATURES, H3, rng)
  },
  tapVolcano: (rng, used) => {
    const f = pickFree(TAP_FEATURES.map(byId).filter((x) => x.kind === 'volcano'), (x) => 'f:' + x.id, used, rng)
    return f && tapFeatureTask(f, 3, WORLD_FEATURES, H3, rng)
  },
  nameF: (rng, used) => {
    const f = pickFree(WORLD_FEATURES, (x) => 'f:' + x.id, used, rng)
    return f && nameFeatureTask(f, 3, WORLD_FEATURES, H3, rng)
  },
  mech: (rng, used) => {
    const f = pickFree(WORLD_FEATURES.filter((x) => x.mech), (x) => 'f:' + x.id, used, rng)
    return f && mechTask(f, rng)
  },
  age: (rng, used) => {
    const f = pickFree(RANGES.filter((x) => x.age), (x) => 'f:' + x.id, used, rng)
    return f && ageTask(f, rng)
  },
  // level 7
  tapS7: (rng, used) => {
    const c = pick(CONTINENTS, rng)
    const code = pickFree(c.tap, (x) => 's:' + x, used, rng)
    return code && tapStateTask(code, c.view, c.tap, 7, rng, `Ťukni na stát ${c.region}: ${nameOf(code)}.`)
  },
  nameS7: (rng, used) => {
    const c = pick(CONTINENTS, rng)
    const code = pickFree([...c.tap, ...c.name], (x) => 's:' + x, used, rng)
    return code && nameStateTask(code, c.view, [...c.tap, ...c.name], 7, rng)
  },
  // level 8
  tapS8: (rng, used) => {
    const code = pickFree(EUROPE_TAP, (x) => 's:' + x, used, rng)
    return code && tapStateTask(code, 'europe', EUROPE_TAP, 8, rng)
  },
  nameS8: (rng, used) => {
    const code = pickFree(EU_ALL, (x) => 's:' + x, used, rng)
    return code && nameStateTask(code, 'europe', EU_ALL, 8, rng)
  },
  capName8: (rng, used) => {
    const c = pickFree(EUROPE_CAPITALS, (x) => 'c:' + x.name, used, rng)
    return c && capitalNameTask(c, EUROPE_CAPITALS, 'europe', 8, rng)
  },
  capTap8: (rng, used) => {
    const c = pickFree(
      EUROPE_CAPITALS.filter((x) => EUROPE_TAP.includes(x.code)),
      (x) => 's:' + x.code,
      used,
      rng,
    )
    return c && capitalTapTask(c, EUROPE_TAP, 'europe', 8, rng)
  },
  riverTap8: (rng, used) => {
    const r = pickFree(EUROPE_RIVERS, (x) => 'r:' + x.name, used, rng)
    return r && riverTapTask(r, EUROPE_RIVERS, 'europe', 8, EU_RIVER_LAYERS, rng)
  },
  riverName8: (rng, used) => {
    const r = pickFree(EUROPE_RIVERS, (x) => 'r:' + x.name, used, rng)
    return r && riverNameTask(r, EUROPE_RIVERS, 'europe', 8, EU_RIVER_LAYERS, rng)
  },
  mountTap8: (rng, used) => {
    const f = pickFree(EUROPE_MOUNTAINS, (x) => 'f:' + x.id, used, rng)
    return f && tapFeatureTask(f, 8, EUROPE_MOUNTAINS, [], rng)
  },
  mountName8: (rng, used) => {
    const f = pickFree(EUROPE_MOUNTAINS, (x) => 'f:' + x.id, used, rng)
    return f && nameFeatureTask(f, 8, EUROPE_MOUNTAINS, [], rng)
  },
  // level 9
  regTap: (rng, used) => {
    const code = pickFree(CZ_REG, (x) => 's:' + x, used, rng)
    return code && { ...tapStateTask(code, 'czechia', CZ_REG, 9, rng), layers: CZ_LAYERS }
  },
  regName: (rng, used) => {
    const code = pickFree(CZ_REG, (x) => 's:' + x, used, rng)
    return code && { ...nameStateTask(code, 'czechia', CZ_REG, 9, rng), layers: CZ_LAYERS }
  },
  capName9: (rng, used) => {
    const c = pickFree(CZ_CAPITALS, (x) => 'c:' + x.name, used, rng)
    return c && capitalNameTask(c, CZ_CAPITALS, 'czechia', 9, rng)
  },
  capTap9: (rng, used) => {
    const c = pickFree(CZ_CAPITALS, (x) => 's:' + x.code, used, rng)
    return c && { ...capitalTapTask(c, CZ_REG, 'czechia', 9, rng), layers: CZ_LAYERS }
  },
  riverTap9: (rng, used) => {
    const r = pickFree(CZ_RIVERS, (x) => 'r:' + x.name, used, rng)
    return r && riverTapTask(r, CZ_RIVERS, 'czechia', 9, CZ_LAYERS, rng)
  },
  riverName9: (rng, used) => {
    const r = pickFree(CZ_RIVERS, (x) => 'r:' + x.name, used, rng)
    return r && riverNameTask(r, CZ_RIVERS, 'czechia', 9, CZ_LAYERS, rng)
  },
  mountTap9: (rng, used) => {
    const f = pickFree(CZ_MOUNTAINS, (x) => 'f:' + x.id, used, rng)
    return f && tapFeatureTask(f, 9, CZ_MOUNTAINS, CZ_LAYERS, rng)
  },
  mountName9: (rng, used) => {
    const f = pickFree(CZ_MOUNTAINS, (x) => 'f:' + x.id, used, rng)
    return f && nameFeatureTask(f, 9, CZ_MOUNTAINS, CZ_LAYERS, rng)
  },
  // level 11
  micro: (rng, used) => {
    const it = pickFree(MICRO, (x) => 'i:' + x.id, used, rng)
    return it && itemTask(it, 'Mikrostáty', rng)
  },
  enclave: (rng, used) => {
    const it = pickFree(ENCLAVES, (x) => 'i:' + x.id, used, rng)
    return it && itemTask(it, 'Enklávy a exklávy', rng)
  },
  disputed: (rng, used) => {
    const it = pickFree(DISPUTED, (x) => 'i:' + x.id, used, rng)
    return it && itemTask(it, 'Sporná území', rng)
  },
  conflict: (rng, used) => {
    const it = pickFree(CONFLICTS, (x) => 's:' + x.code, used, rng) // tap and name variants share the state key
    if (!it || used.has('i:' + it.id)) return undefined
    const t = conflictTask(it, rng, rng() < 0.5)
    return t.type === 'choice' ? { ...t, key: 's:' + it.code } : t
  },
  border: (rng, used) => {
    const b = pickFree(BORDERS, (x) => 'b:' + x.id, used, rng)
    return b && borderTask(b, rng)
  },
}

export const PLAN: Record<number, string[]> = {
  3: ['tapRange', 'nameF', 'mech', 'tapVolcano', 'age', 'tapRange', 'mech', 'nameF', 'age', 'tapVolcano'],
  7: ['tapS7', 'nameS7', 'tapS7', 'nameS7', 'tapS7', 'nameS7', 'tapS7', 'nameS7', 'tapS7', 'nameS7'],
  8: ['tapS8', 'nameS8', 'capName8', 'riverTap8', 'mountName8', 'capTap8', 'riverName8', 'mountTap8', 'tapS8', 'capName8'],
  9: ['regTap', 'regName', 'capName9', 'riverTap9', 'mountName9', 'capTap9', 'riverName9', 'mountTap9', 'regTap', 'capName9'],
  11: ['micro', 'conflict', 'enclave', 'disputed', 'border', 'micro', 'conflict', 'disputed', 'enclave', 'conflict'],
}
/** Free play: two tasks of every level. */
export const MIX = ['tapRange', 'tapS7', 'regTap', 'micro', 'riverTap8', 'mech', 'nameS7', 'capName9', 'conflict', 'capTap8']

export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const plan = level !== undefined && PLAN[level] ? PLAN[level] : MIX
  const used = new Set<string>()
  const out: Task[] = []
  for (const kind of plan) {
    for (let k = 0; k < 30; k++) {
      const t = GEN[kind](rng, used)
      if (!t || used.has(t.key)) continue
      used.add(t.key)
      out.push(t)
      break
    }
  }
  return out
}

/* ------------------------------------------------------------------ the tap check */

export const TAP_PX = 16
/** tolerance of line features in degrees at the place (the screen px minimum dominates on phones) */
const LINE_DEG = (view: MapView) => (view === 'czechia' ? 0.12 : view === 'europe' ? 1 : 2)

export interface TapResult {
  ok: boolean
  /** the tap fell outside every state / region (the sea, or abroad on the Czech map) */
  sea: boolean
  /** what was tapped instead (a state or region code) */
  hit?: string
}

/** Checks a tap (lon/lat, the codes under it, u = SVG units per CSS px) against a tap task. Data must be loaded. */
export function checkTap(t: TapTask, pick: { lon: number; lat: number; code?: string; region?: string }, u: number, data: GeoData | undefined): TapResult {
  const { target, view } = t
  if (target.kind === 'state') {
    const ok = pick.code === target.code || hitArea(view, target.code, pick.lon, pick.lat, 8 * u, countryOf(view))
    return { ok, sea: !ok && !pick.code, hit: pick.code }
  }
  if (target.kind === 'region') {
    const ok = pick.region === target.code || hitArea(view, target.code, pick.lon, pick.lat, 8 * u, regionOf())
    return { ok, sea: !ok && !pick.region, hit: pick.region }
  }
  const parts = partsOf(target, data)
  const others = t.others.map((o) => partsOf(o, data))
  const r = tolUnits(view, pick.lon, pick.lat, LINE_DEG(view), TAP_PX, u)
  return { ok: hitFeature(view, parts, others, pick.lon, pick.lat, r, 4 * u), sea: false }
}

/** Numbered places for the no-tap mode: the target and up to three others (decoys from state label points if needed). */
export function numberedPlaces(t: TapTask, data: GeoData | undefined): { pts: LL[]; answer: number } | undefined {
  const a = anchorOf(t.target, t.view, data)
  if (!a || !data) return undefined
  const rng = seeded(hash(t.key))
  const H = getView(t.view).H
  const far = (p: LL, list: LL[]) => {
    const [x, y] = project(t.view, p[0], p[1])
    return list.every((q) => {
      const [qx, qy] = project(t.view, q[0], q[1])
      return Math.hypot(x - qx, y - qy) > 60
    })
  }
  const pts: LL[] = [a]
  for (const alt of t.alts) {
    const p = anchorOf(alt, t.view, data)
    if (p && inFrame(t.view, p[0], p[1], H, 30) && far(p, pts)) pts.push(p)
  }
  if (pts.length < 4)
    for (const [, lp] of shuffle(Object.entries(data.labels), rng)) {
      if (pts.length >= 4) break
      if (inFrame(t.view, lp[0], lp[1], H, 30) && far(lp, pts)) pts.push(lp)
    }
  const order = shuffle(pts, rng)
  return { pts: order, answer: order.indexOf(a) }
}
