/**
 * Klimatogram – pure logic: climate facts computed from the station normals
 * (statistics, Walter–Lieth dry months, simplified Köppen type, when it rains,
 * continentality, irrigation need) and building a round of tasks. Every answer
 * is computed from data.ts; ambiguous cases (a value close to a boundary) are
 * left out of the tasks that depend on them.
 */
import type { ClimatePlace } from '../../core/types'
import { IN_MONTH, MONTHS, MONTHS_ROMAN, climateStats, czn } from '../../illustrations/geography/charts'
import { parseDecimal, shuffle } from '../shared/util'
import { levelNum } from '../types'
import { BIOMES, STATIONS, STATION_BY_ID, type Station } from './data'
import { LEVELS, type TaskKind } from './levels'

export const ROUND = 10
type Rng = () => number

/** Level number whose set is played; undefined = all levels mixed. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

export const toPlace = (s: Station): ClimatePlace => ({
  name: s.name,
  temp: s.temp,
  precip: s.precip,
  altitude: s.altitude,
  source: s.source,
})

const statsCache = new Map<Station, ReturnType<typeof climateStats>>()
export function statsOf(s: Station) {
  let v = statsCache.get(s)
  if (!v) statsCache.set(s, (v = climateStats(s)))
  return v
}
const sum = (a: number[]) => a.reduce((x, v) => x + v, 0)
const fmtT = (t: number) => `${czn(t, 1)}\u00a0°C`
const fmtP = (p: number) => `${czn(Math.round(p))}\u00a0mm`
const roman = (i: number) => MONTHS_ROMAN[i]

/* ------------------------------------------------------------------ Köppen */

export type Main = 'A' | 'B' | 'C' | 'D' | 'E'
export const MAIN_NAMES: Record<Main, string> = {
  A: 'A – tropické (vlhké) podnebí',
  B: 'B – suché podnebí',
  C: 'C – mírně teplé podnebí',
  D: 'D – boreální (chladné) podnebí',
  E: 'E – polární (sněžné) podnebí',
}

/** Summer half-year: April–September in the north, October–March in the south. */
export const summerMonths = (lat: number) => (lat >= 0 ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 0, 1, 2])
export const winterMonths = (lat: number) => (lat >= 0 ? [9, 10, 11, 0, 1, 2] : [3, 4, 5, 6, 7, 8])

/** Köppen dryness threshold (mm): 20 × mean temperature, +280 with summer rain, +140 with rain all year. */
export function dryThreshold(s: Station, summerShare?: number): number {
  const st = statsOf(s)
  const share = summerShare ?? sum(summerMonths(s.lat).map((i) => s.precip[i])) / Math.max(1e-9, sum(s.precip))
  const add = share >= 0.7 ? 280 : share <= 0.3 ? 0 : 140
  return 20 * st.meanT + add
}

export interface Koppen {
  main: Main
  /** BW (poušť) / BS (step) for B */
  arid?: 'BW' | 'BS'
  /** the BW / BS split is clear-cut */
  aridRobust: boolean
  /** f / s / w for C and D */
  season?: 'f' | 's' | 'w'
  /** false when a value lies close to a boundary (the type then depends on details) */
  robust: boolean
  /** robust apart from the C/D boundary (−3 °C or 0 °C, both are in use) */
  robustExceptCD: boolean
  /** true when the f / s / w letter is clear-cut */
  seasonRobust: boolean
  /** the main type with 0 °C instead of −3 °C as the C/D boundary */
  mainAlt: Main
}

function mainOf(s: Station, cd: number): { main: Main; arid?: 'BW' | 'BS' } {
  const st = statsOf(s)
  const tw = s.temp[st.warmest]
  const tc = s.temp[st.coldest]
  const p = sum(s.precip)
  if (tw < 10) return { main: 'E' }
  const th = dryThreshold(s)
  if (p < th) return { main: 'B', arid: p < th / 2 ? 'BW' : 'BS' }
  if (tc >= 18) return { main: 'A' }
  return { main: tc > cd ? 'C' : 'D' }
}

/** f / s / w: dry summer (s), dry winter (w) or rain all year (f); `margin` widens the boundaries. */
function seasonOf(s: Station, margin = 1): 'f' | 's' | 'w' {
  const su = summerMonths(s.lat).map((i) => s.precip[i])
  const wi = winterMonths(s.lat).map((i) => s.precip[i])
  const dsu = Math.min(...su)
  const wwi = Math.max(...wi)
  const dwi = Math.min(...wi)
  const wsu = Math.max(...su)
  if (dsu < 40 * margin && dsu < (wwi / 3) * margin) return 's'
  if (dwi < (wsu / 10) * margin) return 'w'
  return 'f'
}

const koppenCache = new Map<Station, Koppen>()
export function koppen(s: Station): Koppen {
  let k = koppenCache.get(s)
  if (!k) koppenCache.set(s, (k = koppenOf(s)))
  return k
}

function koppenOf(s: Station): Koppen {
  const st = statsOf(s)
  const tw = s.temp[st.warmest]
  const tc = s.temp[st.coldest]
  const p = sum(s.precip)
  const { main, arid } = mainOf(s, -3)
  const mainAlt = mainOf(s, 0).main
  // the B threshold must not depend on the summer-rain share being close to 70 % / 30 %
  const share = sum(summerMonths(s.lat).map((i) => s.precip[i])) / Math.max(1e-9, p)
  const ths = [dryThreshold(s, share - 0.05), dryThreshold(s, share), dryThreshold(s, share + 0.05)]
  const bClear = ths.every((th) => Math.abs(p / th - 1) >= 0.1 || th <= 0) && new Set(ths.map((th) => p < th)).size === 1
  const awClear = main !== 'B' || ths.every((th) => Math.abs(p / (th / 2) - 1) >= 0.1)
  const robustExceptCD =
    Math.abs(tw - 10) >= 1 &&
    bClear &&
    (main !== 'A' ? true : tc - 18 >= 0.8) &&
    (main === 'C' || main === 'D' ? 18 - tc >= 0.8 : true)
  const robust = robustExceptCD && (main === 'C' || main === 'D' ? main === mainAlt && Math.abs(tc + 3) >= 1 && Math.abs(tc) >= 0.5 : true)
  const season = main === 'C' || main === 'D' ? seasonOf(s) : undefined
  const seasonRobust = season !== undefined && seasonOf(s, 0.8) === season && seasonOf(s, 1.2) === season
  return { main, arid, aridRobust: main === 'B' && awClear, season, robust, robustExceptCD, seasonRobust, mainAlt }
}

/* ------------------------------------------------------------------ water balance */

/** Dry months counted with P < 2T ± `shift` mm (shift tests how clear-cut the count is). */
export const dryMonths = (s: Station, shift = 0) => s.temp.map((t, i) => s.precip[i] < 2 * t + shift)
export const dryCount = (s: Station, shift = 0) => dryMonths(s, shift).filter(Boolean).length
/** The number of dry months does not change when the 2T line moves by 3 mm. */
export const dryClear = (s: Station) => dryCount(s, -3) === dryCount(s, 3)

export type Irrigation = 'none' | 'season' | 'year'
export const IRRIGATION_NAMES: Record<Irrigation, string> = {
  none: 'není potřeba – prší dost po celý rok',
  season: 'jen v suchém období',
  year: 'po celý rok – bez závlah nic neroste',
}
/** Irrigation need from the Walter–Lieth dry months; undefined when it is not clear-cut. */
export function irrigationOf(s: Station): Irrigation | undefined {
  if (!dryClear(s) || koppen(s).main === 'E') return undefined
  const n = dryCount(s)
  if (n === 0) return 'none'
  if (n <= 9) return 'season'
  if (n >= 11) return 'year'
  return undefined
}

/* ------------------------------------------------------------------ tasks */

export interface Option {
  id: string
  label: string
}

interface Base {
  key: string
  kind: TaskKind
  level: number
  /** question, Czech, inline markup */
  text: string
  /** one-line explanation shown after answering */
  why: string
  /** 1–2 stations drawn */
  stations: string[]
  /** what the chart hides while the task is open */
  hideName: boolean
  hideStats: boolean
  hideDry: boolean
  /** months outlined after answering, per station */
  marks?: number[][]
}
export interface ChoiceTask extends Base {
  mode: 'choice'
  options: Option[]
  answer: string
}
export interface MonthTask extends Base {
  mode: 'month'
  /** accepted months (0–11) */
  answer: number[]
}
export interface NumberTask extends Base {
  mode: 'number'
  value: number
  tol: number
  unit: string
  digits: number
}
export type Task = ChoiceTask | MonthTask | NumberTask

const pickFrom = <T,>(arr: readonly T[], rng: Rng): T | undefined => (arr.length ? arr[Math.floor(rng() * arr.length)] : undefined)

/**
 * Two stations nobody would mix up: different main types (under both C/D conventions)
 * and clearly different numbers (mean temperature, yearly total, yearly range).
 */
export function clearlyDifferent(a: Station, b: Station): boolean {
  const ka = koppen(a)
  const kb = koppen(b)
  const ma = new Set([ka.main, ka.mainAlt])
  if (ma.has(kb.main) || ma.has(kb.mainAlt)) return false
  const sa = statsOf(a)
  const sb = statsOf(b)
  const d = Math.abs(sa.meanT - sb.meanT) / 5 + Math.abs(Math.log((sa.totalP + 20) / (sb.totalP + 20))) + Math.abs(sa.range - sb.range) / 10
  return d >= 1.2
}

/** n distractor stations clearly different in climate from `s` and from each other, with distinct `label`s. */
function distractors(s: Station, pool: Station[], n: number, rng: Rng, label: (x: Station) => string | undefined): Station[] | undefined {
  const out: Station[] = []
  const labels = new Set([label(s)])
  for (const x of shuffle(pool, rng)) {
    const l = label(x)
    if (!l || labels.has(l) || !clearlyDifferent(s, x) || out.some((o) => !clearlyDifferent(o, x))) continue
    out.push(x)
    labels.add(l)
    if (out.length === n) return out
  }
  return undefined
}

const placeLine = (s: Station) => `${s.name} (${s.country})`

function uniqueExtreme(values: number[], dir: 1 | -1, margin: number): number | undefined {
  const order = values.map((v, i) => [v * dir, i] as const).sort((a, b) => b[0] - a[0])
  return order[0][0] - order[1][0] >= margin ? order[0][1] : undefined
}

function taskOf(kind: TaskKind, level: number, pool: Station[], rng: Rng, used: Set<string>, seen: Map<string, number>): Task | undefined {
  const fresh = (ids: string[]) => ids.every((id) => (seen.get(id) ?? 0) < 1)
  const candidates = shuffle(pool, rng).filter((s) => fresh([s.id]) && !used.has(`${kind}:${s.id}`))
  const hide = { hideName: true, hideStats: false, hideDry: false }
  const base = (s: Station, extra: Partial<Base> = {}) => ({ key: `${kind}:${s.id}`, kind, level, stations: [s.id], ...hide, ...extra })

  switch (kind) {
    case 'warmest':
    case 'coldest':
    case 'wettest': {
      for (const s of candidates) {
        const vals = kind === 'wettest' ? s.precip : s.temp
        const i = uniqueExtreme(vals, kind === 'coldest' ? -1 : 1, kind === 'wettest' ? 5 : 0.3)
        if (i === undefined) continue
        const what = kind === 'warmest' ? 'nejtepleji' : kind === 'coldest' ? 'nejchladněji' : 'nejvíc srážek'
        const text =
          kind === 'wettest'
            ? `Ve kterém měsíci tu spadne **nejvíc srážek**? Klepni na měsíc.`
            : `Ve kterém měsíci je tu **${what}**? Klepni na měsíc.`
        const why =
          kind === 'wettest'
            ? `Nejvyšší sloupec je ${roman(i)} (${MONTHS[i]}): ${fmtP(s.precip[i])}. Je to ${placeLine(s)}.`
            : `Teplotní křivka je ${kind === 'warmest' ? 'nejvýš' : 'nejníž'} ${IN_MONTH[i]} (${roman(i)}): ${fmtT(s.temp[i])}. Je to ${placeLine(s)}.`
        return { ...base(s, { marks: [[i]] }), mode: 'month', text, why, answer: [i] }
      }
      return undefined
    }
    case 'range': {
      const s = candidates.find((x) => statsOf(x).range >= 3)
      if (!s) return undefined
      const st = statsOf(s)
      return {
        ...base(s, { marks: [[st.warmest, st.coldest]] }),
        mode: 'number',
        text: 'Jaká je tu **roční amplituda teploty** (rozdíl mezi nejteplejším a nejchladnějším měsícem)? Odečti z grafu.',
        why: `${MONTHS_ROMAN[st.warmest]}: ${fmtT(s.temp[st.warmest])}, ${MONTHS_ROMAN[st.coldest]}: ${fmtT(s.temp[st.coldest])} → ${czn(s.temp[st.warmest], 1)} − ${s.temp[st.coldest] < 0 ? `(${czn(s.temp[st.coldest], 1)})` : czn(s.temp[st.coldest], 1)} = ${fmtT(st.range)}.${st.range >= 20 ? ' Velká amplituda je znakem pevninského (kontinentálního) podnebí.' : st.range <= 8 ? ' Malá amplituda: moře nebo tropy vyrovnávají teplotu.' : ''} Je to ${placeLine(s)}.`,
        value: st.range,
        tol: 1.5,
        unit: '°C',
        digits: 1,
      }
    }
    case 'dry': {
      const s = candidates.find((x) => dryClear(x))
      if (!s) return undefined
      const d = dryMonths(s)
      const n = dryCount(s)
      const list = d.map((b, i) => (b ? roman(i) : '')).filter(Boolean)
      return {
        ...base(s, { hideDry: true, marks: [d.map((b, i) => (b ? i : -1)).filter((i) => i >= 0)] }),
        mode: 'number',
        text: 'Kolik měsíců v roce je tu **suchých**? Suchý je měsíc, ve kterém teplotní křivka leží nad sloupcem srážek (10 °C ↔ 20 mm).',
        why: n
          ? `Suché měsíce (srážky < 2 × teplota): ${list.join(', ')} – celkem ${n}. Je to ${placeLine(s)}.`
          : `Žádný: sloupce srážek jsou vždy nad teplotní křivkou. Je to ${placeLine(s)}.`,
        value: n,
        tol: 0,
        unit: 'měs.',
        digits: 0,
      }
    }
    case 'total': {
      for (const s of candidates) {
        const total = statsOf(s).totalP
        const r = (x: number) => (x >= 300 ? Math.round(x / 50) * 50 : x >= 60 ? Math.round(x / 10) * 10 : Math.max(5, Math.round(x / 5) * 5))
        const factors = shuffle([0.3, 0.5, 2, 3.5], rng).slice(0, 3)
        const vals = [r(total), ...factors.map((f) => r(total * f))]
        if (new Set(vals).size < 4) continue
        const sorted = [...vals].sort((a, b) => a - b)
        if (sorted.some((v, i) => i > 0 && v < sorted[i - 1] * 1.3)) continue
        return {
          ...base(s, { hideStats: true }),
          mode: 'choice',
          text: 'Kolik srážek tu spadne **za celý rok**? Sečti v duchu sloupce (stačí odhad).',
          why: `Součet dvanácti měsíců je ${fmtP(total)} (≐ ${czn(vals[0])} mm). Je to ${placeLine(s)}.`,
          options: sorted.map((v) => ({ id: String(v), label: `asi ${czn(v)} mm` })),
          answer: String(vals[0]),
        }
      }
      return undefined
    }
    case 'place':
    case 'region': {
      for (const s of candidates) {
        const label = kind === 'place' ? placeLine : (x: Station) => x.region
        const ds = distractors(s, pool.length >= 12 ? pool : STATIONS, 3, rng, label)
        if (!ds) continue
        const opts = shuffle([s, ...ds], rng).map((x) => ({ id: x.id, label: label(x) }))
        return {
          ...base(s),
          mode: 'choice',
          text: kind === 'place' ? 'Ke kterému místu patří tento klimatogram?' : 'Ze které oblasti světa je tento klimatogram?',
          why: `Je to ${placeLine(s)} – ${s.region}: ${fmtT(statsOf(s).meanT)} a ${fmtP(statsOf(s).totalP)} za rok${koppen(s).robust ? `, ${MAIN_NAMES[koppen(s).main].slice(4)}` : ''}.`,
          options: opts,
          answer: s.id,
        }
      }
      return undefined
    }
    case 'biome': {
      for (const s of candidates) {
        if (!s.biome) continue
        const others = shuffle(
          BIOMES.filter((b) => b !== s.biome),
          rng,
        ).slice(0, 3)
        const opts = shuffle([s.biome, ...others], rng).map((b) => ({ id: b, label: b }))
        return {
          ...base(s),
          mode: 'choice',
          text: 'Který **krajinný pás** odpovídá tomuto podnebí?',
          why: `Je to ${placeLine(s)}: ${s.biome}. ${biomeWhy(s)}`,
          options: opts,
          answer: s.biome,
        }
      }
      return undefined
    }
    case 'hemisphere': {
      for (const s of candidates) {
        const st = statsOf(s)
        if (st.range < 5) continue
        const south = [10, 11, 0, 1].includes(st.warmest)
        const north = [4, 5, 6, 7].includes(st.warmest)
        if (!south && !north) continue
        return {
          ...base(s, { marks: [[st.warmest]] }),
          mode: 'choice',
          text: 'Leží toto místo na **severní**, nebo **jižní** polokouli?',
          why: `Nejtepleji je ${IN_MONTH[st.warmest]} (${roman(st.warmest)}), ${south ? 'léto je tedy kolem prosince až února – jižní polokoule' : 'léto je tedy v červnu až srpnu – severní polokoule'}. Je to ${placeLine(s)}.`,
          options: [
            { id: 'N', label: 'severní polokoule' },
            { id: 'S', label: 'jižní polokoule' },
          ],
          answer: south ? 'S' : 'N',
        }
      }
      return undefined
    }
    case 'koppen': {
      for (const s of candidates) {
        const k = koppen(s)
        if (!k.robust) continue
        return {
          ...base(s),
          mode: 'choice',
          text: 'Do kterého **podnebného typu** (podle Köppena, zjednodušeně) patří toto místo?',
          why: `${koppenWhy(s)} Je to ${placeLine(s)}.`,
          options: (Object.keys(MAIN_NAMES) as Main[]).map((m) => ({ id: m, label: MAIN_NAMES[m] })),
          answer: k.main,
        }
      }
      return undefined
    }
    case 'season': {
      for (const s of candidates) {
        const k = koppen(s)
        if (!k.season || !k.seasonRobust || !k.robustExceptCD || !(['C', 'D'] as Main[]).includes(k.mainAlt)) continue
        const su = summerMonths(s.lat)
        return {
          ...base(s),
          mode: 'choice',
          text: 'Kdy tu **prší**? Porovnej sloupce v létě a v zimě.',
          why: `${seasonWhy(s, k.season)} Je to ${placeLine(s)} (léto = ${roman(su[0])}–${roman(su[5])}).`,
          options: [
            { id: 'f', label: 'po celý rok (f)' },
            { id: 's', label: 'hlavně v zimě, léto je suché (s)' },
            { id: 'w', label: 'hlavně v létě, zima je suchá (w)' },
          ],
          answer: k.season,
        }
      }
      return undefined
    }
    case 'ocean':
    case 'irrig-pair': {
      const pairs: [Station, Station][] = []
      for (const a of candidates)
        for (const b of pool) {
          if (a.id === b.id || !fresh([b.id]) || used.has(`${kind}:${b.id}:${a.id}`)) continue
          if (kind === 'ocean') {
            if (!a.coastal || Math.sign(a.lat) !== Math.sign(b.lat) || Math.abs(a.lat - b.lat) > 12) continue
            if (statsOf(b).range - statsOf(a).range < 10) continue
          } else {
            if (!dryClear(a) || !dryClear(b) || koppen(a).main === 'E' || koppen(b).main === 'E' || dryCount(b) - dryCount(a) < 3) continue
          }
          pairs.push([a, b]) // a = the answer for 'ocean' (smaller range); b for 'irrig-pair' (more dry months)
        }
      const pair = pickFrom(pairs, rng)
      if (!pair) return undefined
      const [a, b] = pair
      const swap = rng() < 0.5
      const shown = swap ? [b, a] : [a, b]
      const answerSt = kind === 'ocean' ? a : b
      const answer = shown[0] === answerSt ? 'A' : 'B'
      const why =
        kind === 'ocean'
          ? `Amplituda: ${shown.map((x, i) => `${'AB'[i]} = ${fmtT(statsOf(x).range)}`).join(', ')}. Moře vyrovnává teploty: menší rozdíl mezi létem a zimou má přímořské (oceánské) podnebí. A = ${shown[0].name}, B = ${shown[1].name}.`
          : `Suchých měsíců: ${shown.map((x, i) => `${'AB'[i]} = ${dryCount(x)}`).join(', ')}. Kde teplotní křivka dlouho leží nad srážkami, výpar převyšuje srážky a pole je třeba zavlažovat. A = ${shown[0].name}, B = ${shown[1].name}.`
      return {
        key: `${kind}:${a.id}:${b.id}`,
        kind,
        level,
        stations: shown.map((x) => x.id),
        hideName: true,
        hideStats: false,
        hideDry: kind === 'irrig-pair',
        mode: 'choice',
        text:
          kind === 'ocean'
            ? 'Obě místa leží v podobné zeměpisné šířce. Které z nich má **přímořské (oceánské)** podnebí?'
            : 'Kde bude zemědělství víc potřebovat **zavlažování**?',
        why,
        options: [
          { id: 'A', label: 'místo A' },
          { id: 'B', label: 'místo B' },
        ],
        answer,
      }
    }
    case 'irrigation': {
      for (const s of candidates) {
        const irr = irrigationOf(s)
        if (!irr) continue
        const n = dryCount(s)
        return {
          ...base(s, { hideDry: true, marks: [dryMonths(s).map((b, i) => (b ? i : -1)).filter((i) => i >= 0)] }),
          mode: 'choice',
          text: 'Potřebuje tu zemědělství **zavlažování**? Hledej měsíce, kdy teplotní křivka leží nad sloupci srážek.',
          why: `${n === 0 ? 'Žádný měsíc není suchý' : `Suchých měsíců je ${n}`}: ${IRRIGATION_NAMES[irr]}. Je to ${placeLine(s)}.`,
          options: (Object.keys(IRRIGATION_NAMES) as Irrigation[]).map((id) => ({ id, label: IRRIGATION_NAMES[id] })),
          answer: irr,
        }
      }
      return undefined
    }
  }
}

function biomeWhy(s: Station): string {
  const st = statsOf(s)
  switch (s.biome) {
    case 'tropický deštný les':
      return `Celý rok horko a za rok spadne ${fmtP(st.totalP)} srážek; dlouhé suché období tu není.`
    case 'savana':
      return `Horko celý rok, ale ${st.dryCount} měsíců sucha: období dešťů a období sucha se střídají.`
    case 'poušť a polopoušť':
      return `Za rok jen ${fmtP(st.totalP)} srážek – téměř všechny měsíce jsou suché.`
    case 'středomořské křoviny a lesy':
      return 'Léto je suché a teplé až horké, prší hlavně v zimě.'
    case 'step':
      return `Málo srážek (${fmtP(st.totalP)}), mrazivá zima a teplé léto.`
    case 'listnatý a smíšený les':
      return 'Chladná zima, teplé léto a srážky po celý rok.'
    case 'tajga':
      return `Dlouhá mrazivá zima (${fmtT(s.temp[st.coldest])}), krátké teplé léto.`
    case 'tundra':
      return `Ani nejteplejší měsíc nemá přes 10 °C (${fmtT(s.temp[st.warmest])}) – stromy tu nerostou.`
    default:
      return ''
  }
}

function koppenWhy(s: Station): string {
  const k = koppen(s)
  const st = statsOf(s)
  const tw = fmtT(s.temp[st.warmest])
  const tc = fmtT(s.temp[st.coldest])
  switch (k.main) {
    case 'E':
      return `Ani nejteplejší měsíc nemá 10 °C (${tw}) → E.`
    case 'B':
      return `Srážek je méně (${fmtP(st.totalP)}), než by se při teplotě ${fmtT(st.meanT)} vypařilo (≐ ${fmtP(dryThreshold(s))}) → B${k.aridRobust ? (k.arid === 'BW' ? ', poušť (BW)' : ', step (BS)') : ''}.`
    case 'A':
      return `I nejchladnější měsíc má aspoň 18 °C (${tc}) a srážek je dost → A.`
    case 'C':
      return `Nejchladnější měsíc ${tc} je nad −3 °C a pod 18 °C, nejteplejší ${tw} je nad 10 °C → C.`
    case 'D':
      return `Nejchladnější měsíc ${tc} je pod −3 °C, nejteplejší ${tw} nad 10 °C → D.`
  }
}

function seasonWhy(s: Station, season: 'f' | 's' | 'w'): string {
  const su = summerMonths(s.lat).map((i) => s.precip[i])
  const wi = winterMonths(s.lat).map((i) => s.precip[i])
  if (season === 's') return `Nejsušší letní měsíc má jen ${fmtP(Math.min(...su))}, nejdeštivější zimní ${fmtP(Math.max(...wi))}: suché léto (s).`
  if (season === 'w') return `Nejsušší zimní měsíc má jen ${fmtP(Math.min(...wi))}, nejdeštivější letní ${fmtP(Math.max(...su))}: suchá zima (w).`
  return `I nejsušší měsíc má ${fmtP(Math.min(...s.precip))}: prší po celý rok (f).`
}

/* ------------------------------------------------------------------ round */

export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const levels = level !== undefined && LEVELS[level] ? [level] : shuffle(Object.keys(LEVELS).map(Number), rng)
  const next = new Map(levels.map((l) => [l, 0]))
  const used = new Set<string>()
  const seen = new Map<string, number>()
  const out: Task[] = []
  for (let guard = 0; out.length < ROUND && guard < ROUND * 8; guard++) {
    const lv = levels[out.length % levels.length]
    const set = LEVELS[lv]
    const k = next.get(lv)!
    next.set(lv, k + 1)
    const pool = set.pool ? set.pool.map((id) => STATION_BY_ID[id]) : STATIONS
    const t = taskOf(set.plan[k % set.plan.length], lv, pool, rng, used, seen)
    if (!t) continue
    used.add(t.key)
    for (const id of t.stations) seen.set(id, (seen.get(id) ?? 0) + 1)
    out.push(t)
  }
  return out
}

/* ------------------------------------------------------------------ checking */

export type NumCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

export function checkNumber(input: string, t: NumberTask): NumCheck {
  const value = parseDecimal(input.replace(/°\s*C|mm|měs\.?|měsíc[ůe]?/gi, '').replace(/[  ]/g, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - t.value) <= t.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}
