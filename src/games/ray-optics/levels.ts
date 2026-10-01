/**
 * Paprsky – tasks per level (spec/courses/fyzika/games.md).
 *
 *   5  odraz, lom, obraz v čočce a zrcadle kvalitativně (f5-2, f5-3, f5-4):
 *      najdi obraz tažením, urči jeho vlastnosti, natoč odražený paprsek, směr lomu
 *   12 zobrazovací rovnice 1/a + 1/a′ = 1/f a zvětšení Z = −a′/a (f12-2):
 *      spočítej a′, Z, f, φ; najdi obraz na lavici v centimetrech
 *
 * All answers come from logic.ts.
 */
import { shuffle } from '../shared/util'
import {
  ELEMENT_NAME,
  MEDIA,
  beforeWord,
  bendOf,
  criticalAngle,
  dioptres,
  focalFrom,
  fmt,
  imageOf,
  isConverging,
  isMirror,
  propsOf,
  propsText,
  refractionAngle,
  signedF,
  zone,
  type Bend,
  type Element,
  type Medium,
  type Props,
  type Scene,
} from './logic'

type Rng = () => number

interface Base {
  key: string
  level: number
  prompt: string
  explain: string
}

export interface LocateTask extends Base {
  kind: 'locate'
  scene: Scene
  /** Numbers on the bench in cm (level 12) or just F/2F marks (level 5). */
  cm: boolean
}
export interface PropsTask extends Base {
  kind: 'props'
  scene: Scene
  answer: Props | null
}
export interface CalcTask extends Base {
  kind: 'calc'
  scene: Scene
  ask: 'ap' | 'Z' | 'f' | 'phi'
  answer: number
  unit: 'cm' | 'D' | ''
  /** Symbol in front of the input (inline markup). */
  symbol: string
  /** Draw a neutral element until answered (the kind of lens / mirror is what is asked). */
  hideElement?: boolean
}
export interface ReflectTask extends Base {
  kind: 'reflect'
  /** Angle of incidence from the normal, degrees. */
  alpha: number
  /** Which angle the prompt gives: from the normal or from the mirror surface. */
  given: 'normal' | 'surface'
}
export interface RefractTask extends Base {
  kind: 'refract'
  m1: Medium
  m2: Medium
  alpha: number
  answer: Bend
}

export type Task = LocateTask | PropsTask | CalcTask | ReflectTask | RefractTask
export type Kind = Task['kind']

const pick = <T,>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]

/** Level 5 tolerance for dragging the image (fractions of |a′|, |y′| and f). */
export const TOL5 = { x: 0.2, y: 0.35, f: 0.3 }
/** Level 12: tighter. */
export const TOL12 = { x: 0.1, y: 0.2, f: 0.15 }
/** Reflection: ± degrees. */
export const ANGLE_TOL = 3

// ------------------------------------------------------------------ level 5 scenes (f = 1)

const A_CONV = [3, 2.5, 2, 1.6, 1.5, 0.6, 0.5]
const A_DIV = [0.5, 1, 1.5, 2, 2.5, 3]
const H5 = 0.8

const scene5 = (el: Element, a: number): Scene => ({ el, f: signedF(el, 1), a, h: H5 })

function why5(s: Scene): string {
  const p = propsOf(imageOf(s.f, s.a))
  if (!isConverging(s.el)) {
    return `${s.el === 'rozptylka' ? 'Rozptylka' : 'Vypuklé zrcadlo'} paprsky rozbíhá; protnou se jen jejich prodloužení, a tak je obraz vždy ${propsText(p)}.`
  }
  if (!p) return 'Předmět je v ohnisku: paprsky vycházejí rovnoběžně, nikde se neprotnou, obraz nevznikne.'
  const where = p.real ? 'paprsky se skutečně protnou' : 'protnou se jen prodloužení paprsků'
  return `Předmět je ${zone(s)}: ${where}, obraz je ${propsText(p)}.`
}

const locate5 = (rng: Rng): LocateTask => {
  const el = pick<Element>(['spojka', 'spojka', 'duté', 'rozptylka', 'vypuklé'], rng)
  const a = pick(isConverging(el) ? A_CONV : A_DIV, rng)
  const s = scene5(el, a)
  return {
    kind: 'locate',
    level: 5,
    key: `locate-${el}-${a}`,
    scene: s,
    cm: false,
    prompt: `**${capital(ELEMENT_NAME[el])}**: přetáhni šipku obrazu tam, kde obraz vznikne.`,
    explain: why5(s),
  }
}

const props5 = (rng: Rng): PropsTask => {
  const el = pick<Element>(['spojka', 'spojka', 'duté', 'duté', 'rozptylka', 'vypuklé'], rng)
  const a = pick(isConverging(el) ? [...A_CONV, 1, 2, 1] : A_DIV, rng)
  const s = scene5(el, a)
  return {
    kind: 'props',
    level: 5,
    key: a === 1 && isConverging(el) ? 'props-focus' : `props-${el}-${isConverging(el) ? zone(s) : 'any'}`,
    scene: s,
    answer: propsOf(imageOf(s.f, s.a)),
    prompt: `**${capital(ELEMENT_NAME[el])}**, předmět stojí ${isConverging(el) ? zone(s) : beforeWord(el)}. Jaký bude obraz?`,
    explain: why5(s),
  }
}

const reflect5 = (rng: Rng): ReflectTask => {
  const alpha = 5 * Math.round((15 + rng() * 60) / 5)
  const given = rng() < 0.5 ? 'normal' : 'surface'
  const g = given === 'normal' ? `Úhel dopadu je α = ${alpha}°.` : `Paprsek svírá s rovinou zrcadla úhel ${90 - alpha}°.`
  return {
    kind: 'reflect',
    level: 5,
    key: `reflect-${alpha}-${given}`,
    alpha,
    given,
    prompt: `${g} Natoč odražený paprsek.`,
    explain:
      given === 'normal'
        ? `Zákon odrazu: úhel odrazu se rovná úhlu dopadu, α′ = α = ${alpha}°, na druhé straně kolmice.`
        : `Úhly měříme od kolmice: α = 90° − ${90 - alpha}° = ${alpha}°. Podle zákona odrazu je α′ = ${alpha}°.`,
  }
}

const REFRACT_CASES: { m1: Medium; m2: Medium; alpha: number; bend: Bend }[] = (() => {
  const out: { m1: Medium; m2: Medium; alpha: number; bend: Bend }[] = []
  for (const m1 of MEDIA)
    for (const m2 of MEDIA) {
      if (m1 === m2) continue
      for (const alpha of [0, 20, 30, 40, 50, 60, 70]) {
        const crit = criticalAngle(m1.n, m2.n)
        if (crit !== null && Math.abs(alpha - crit) < 6) continue
        out.push({ m1, m2, alpha, bend: bendOf(m1.n, m2.n, alpha) })
      }
    }
  return out
})()

const refract5 = (rng: Rng): RefractTask => {
  const want = rng() < 0.08 ? 'straight' : pick<Bend>(['toward', 'away', 'total'], rng)
  const c = pick(
    REFRACT_CASES.filter((x) => x.bend === want),
    rng,
  )
  const beta = refractionAngle(c.m1.n, c.m2.n, c.alpha)
  const denser = c.m2.n > c.m1.n
  let explain: string
  if (c.bend === 'straight') explain = `Paprsek dopadá kolmo (úhel dopadu 0°), a proto směr nezmění, jen ${denser ? 'zpomalí' : 'zrychlí'}.`
  else if (c.bend === 'total')
    explain = `Světlo jde do opticky řidšího prostředí pod úhlem ${c.alpha}°, větším než mezní úhel ${fmt(criticalAngle(c.m1.n, c.m2.n)!, 1)}° – celé se odrazí zpět.`
  else
    explain = `${capital(c.m2.name)} je opticky ${denser ? 'hustší' : 'řidší'} než ${c.m1.name} (n = ${fmt(c.m2.n)} ${denser ? '>' : '<'} ${fmt(c.m1.n)}), světlo ${denser ? 'zpomalí a láme se ke kolmici' : 'zrychlí a láme se od kolmice'} (úhel lomu asi ${Math.round(beta!)}°).`
  return {
    kind: 'refract',
    level: 5,
    key: `refract-${c.m1.name}-${c.m2.name}-${c.alpha}`,
    m1: c.m1,
    m2: c.m2,
    alpha: c.alpha,
    answer: c.bend,
    prompt: `Paprsek přechází z ${gen(c.m1)} do ${gen(c.m2)}, úhel dopadu je ${c.alpha}°. Co udělá na rozhraní?`,
    explain,
  }
}

const GEN: Record<string, string> = { vzduch: 'vzduchu', voda: 'vody', sklo: 'skla', diamant: 'diamantu' }
const gen = (m: Medium) => GEN[m.name]

// ------------------------------------------------------------------ level 12 scenes (cm)

const F12 = [5, 8, 10, 12, 15, 20, 25, 30, 40, 50]
const R12 = [0.4, 0.5, 0.6, 0.75, 1.25, 1.5, 2, 2.5, 3, 4]

/** Random scene in centimetres with a sensible image (|a′| ≤ 5|f|). */
export function scene12(rng: Rng, el: Element = pick(['spojka', 'spojka', 'rozptylka', 'duté', 'duté', 'vypuklé'], rng), niceAp = false): Scene {
  for (;;) {
    const absF = pick(F12, rng)
    const a = Math.max(2, Math.round(absF * pick(R12, rng)))
    const f = signedF(el, absF)
    const img = imageOf(f, a)
    if (img.ap === null || Math.abs(img.ap) > 5 * absF || Math.abs(img.ap) < 0.25 * absF) continue
    if (Math.abs(img.Z!) > 5 || Math.abs(img.Z!) < 0.15) continue
    // a′ given in the prompt must be exact to one decimal place
    if (niceAp && Math.abs(img.ap * 10 - Math.round(img.ap * 10)) > 1e-9) continue
    return { el, f, a, h: 1 }
  }
}

const cm = (x: number) => `${fmt(x)} cm`
/** Number in a formula: negative values in parentheses. */
const par = (x: number) => (x < 0 ? `(${fmt(x)})` : fmt(x))
const elIn = (s: Scene) => (isMirror(s.el) ? (s.el === 'duté' ? 'Duté zrcadlo' : 'Vypuklé zrcadlo') : s.el === 'spojka' ? 'Spojka' : 'Rozptylka')
const whereImg = (s: Scene, ap: number) => (ap > 0 ? (isMirror(s.el) ? 'skutečný obraz před zrcadlem' : 'skutečný obraz za čočkou') : isMirror(s.el) ? 'zdánlivý obraz za zrcadlem' : 'zdánlivý obraz před čočkou')
const given12 = (s: Scene) => `${elIn(s)} má ohniskovou vzdálenost f = ${cm(s.f)}, předmět stojí a = ${cm(s.a)} ${beforeWord(s.el)}.`
const apLine = (s: Scene, ap: number) => `a′ = a · f / (a − f) = ${fmt(s.a)} · ${par(s.f)} / (${fmt(s.a)} − ${par(s.f)}) cm = ${cm(ap)}`

const calcAp = (rng: Rng): CalcTask => {
  const s = scene12(rng)
  const ap = imageOf(s.f, s.a).ap!
  return {
    kind: 'calc',
    level: 12,
    key: `ap-${s.el}-${s.f}-${s.a}`,
    scene: s,
    ask: 'ap',
    answer: ap,
    unit: 'cm',
    symbol: 'a′',
    prompt: `${given12(s)} Urči a′ (i se znaménkem).`,
    explain: `Z 1/a + 1/a′ = 1/f: ${apLine(s, ap)}. ${ap > 0 ? 'Kladné' : 'Záporné'} a′ znamená ${whereImg(s, ap)}.`,
  }
}

const calcZ = (rng: Rng): CalcTask => {
  const s = scene12(rng)
  const { ap, Z } = imageOf(s.f, s.a)
  const p = propsOf({ ap, Z })!
  return {
    kind: 'calc',
    level: 12,
    key: `Z-${s.el}-${s.f}-${s.a}`,
    scene: s,
    ask: 'Z',
    answer: Z!,
    unit: '',
    symbol: 'Z',
    prompt: `${given12(s)} Urči příčné zvětšení Z.`,
    explain: `${apLine(s, ap!)}, Z = −a′ / a = −${par(ap!)} / ${fmt(s.a)} = ${fmt(Z!)}: obraz je ${p.inverted ? 'převrácený' : 'přímý'} a ${p.size === 'zvětšený' ? `${fmt(Math.abs(Z!))}× zvětšený` : p.size === 'zmenšený' ? `zmenšený (|Z| < 1)` : 'stejně velký'}.`,
  }
}

const calcF = (rng: Rng): CalcTask => {
  const s = scene12(rng, undefined, true)
  const ap = imageOf(s.f, s.a).ap!
  const word = isMirror(s.el) ? 'zrcadlem' : 'čočkou'
  const imgText = ap > 0 ? `Ostrý obraz se zachytí na stínítku ${cm(ap)} ${isMirror(s.el) ? 'před zrcadlem' : 'za čočkou'} (a′ = ${cm(ap)}).` : `Vznikne zdánlivý obraz ${cm(-ap)} ${isMirror(s.el) ? 'za zrcadlem' : 'před čočkou'} (a′ = ${cm(ap)}).`
  const f = focalFrom(s.a, ap)
  return {
    kind: 'calc',
    level: 12,
    key: `f-${s.el}-${s.f}-${s.a}`,
    scene: s,
    ask: 'f',
    answer: f,
    unit: 'cm',
    symbol: 'f',
    hideElement: true,
    prompt: `Předmět stojí ${cm(s.a)} před ${word}. ${imgText} Urči ohniskovou vzdálenost f.`,
    explain: `f = a · a′ / (a + a′) = ${fmt(s.a)} · ${par(ap)} / (${fmt(s.a)} + ${par(ap)}) cm = ${cm(f)}; ${f > 0 ? (isMirror(s.el) ? 'kladné f má duté zrcadlo' : 'kladné f má spojka') : isMirror(s.el) ? 'záporné f má vypuklé zrcadlo' : 'záporné f má rozptylka'}.`,
  }
}

const calcPhi = (rng: Rng): CalcTask => {
  const lens = pick<Element>(['spojka', 'rozptylka'], rng)
  const fromF = rng() < 0.5
  const s = scene12(rng, lens, !fromF)
  const phi = dioptres(s.f)
  const ap = imageOf(s.f, s.a).ap!
  return {
    kind: 'calc',
    level: 12,
    key: `phi-${fromF}-${s.el}-${s.f}-${s.a}`,
    scene: s,
    ask: 'phi',
    answer: phi,
    unit: 'D',
    symbol: 'φ',
    hideElement: !fromF,
    prompt: fromF
      ? `${capital(lens)} má ohniskovou vzdálenost f = ${cm(s.f)}. Jaká je její optická mohutnost?`
      : `Předmět stojí ${cm(s.a)} před čočkou a obraz vznikne ve vzdálenosti a′ = ${cm(ap)}. Jaká je optická mohutnost čočky?`,
    explain: fromF
      ? `φ = 1 / f, f musí být v metrech: φ = 1 / ${par(s.f / 100)} m = ${fmt(phi)} D.`
      : `f = a · a′ / (a + a′) = ${cm(s.f)} = ${fmt(s.f / 100)} m, φ = 1 / f = ${fmt(phi)} D${phi < 0 ? ' (rozptylka)' : ' (spojka)'}.`,
  }
}

const locate12 = (rng: Rng): LocateTask => {
  const s = scene12(rng, pick<Element>(['spojka', 'spojka', 'duté', 'rozptylka'], rng))
  return {
    kind: 'locate',
    level: 12,
    key: `locate12-${s.el}-${s.f}-${s.a}`,
    scene: s,
    cm: true,
    prompt: `${given12(s)} Spočítej a přetáhni šipku obrazu na správné místo.`,
    explain: (() => {
      const { ap, Z } = imageOf(s.f, s.a)
      const p = propsOf({ ap, Z })!
      return `${apLine(s, ap!)}, Z = −a′ / a = ${fmt(Z!)}: ${whereImg(s, ap!)}, ${p.size}, ${p.inverted ? 'převrácený' : 'přímý'}.`
    })(),
  }
}

// ------------------------------------------------------------------ levels

export interface LevelSet {
  gens: Partial<Record<string, (rng: Rng) => Task>>
  /** Template name → how many tasks of it a round of this level has. */
  plan: Record<string, number>
  /** Plan when mixed with other levels (free play). */
  mix: Record<string, number>
}

export const ROUND = 10

export const LEVELS: Record<number, LevelSet> = {
  5: {
    gens: { locate: locate5, props: props5, reflect: reflect5, refract: refract5 },
    plan: { locate: 3, props: 3, reflect: 2, refract: 2 },
    mix: { locate: 2, props: 1, reflect: 1, refract: 1 },
  },
  12: {
    gens: { ap: calcAp, Z: calcZ, f: calcF, phi: calcPhi, locate: locate12 },
    plan: { ap: 2, Z: 2, f: 2, phi: 2, locate: 2 },
    mix: { ap: 1, Z: 1, f: 1, phi: 1, locate: 1 },
  },
}

/** A round of ROUND tasks, all keys unique; level undefined = mix of all levels. */
export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const lvls = level !== undefined && LEVELS[level] ? [level] : Object.keys(LEVELS).map(Number)
  const used = new Set<string>()
  const out: Task[] = []
  for (const lv of lvls) {
    const set = LEVELS[lv]
    const plan = lvls.length > 1 ? set.mix : set.plan
    for (const [name, n] of Object.entries(plan)) {
      let made = 0
      for (let tries = 0; made < n && tries < 200; tries++) {
        const t = set.gens[name]!(rng)
        if (used.has(t.key)) continue
        used.add(t.key)
        out.push(t)
        made++
      }
    }
  }
  const round = shuffle(out, rng)
  // Never two tasks of the same kind (and scene) back to back when it can be helped.
  for (let i = 1; i < round.length; i++) {
    if (round[i].kind === round[i - 1].kind) {
      const j = round.findIndex((t, k) => k > i && t.kind !== round[i - 1].kind)
      if (j > 0) [round[i], round[j]] = [round[j], round[i]]
    }
  }
  return round
}

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
