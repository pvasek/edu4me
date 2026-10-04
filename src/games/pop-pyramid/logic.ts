/**
 * Věková pyramida – pure logic: the type of a pyramid, shares, strong and weak
 * generations, war losses, migration, the stage of the demographic transition, the
 * dependency ratio, projections, and building a round. Every answer is computed from
 * the UN WPP 2024 data in data.ts; borderline cases are left out of the tasks.
 */
import type { PyramidSpec } from '../../core/types'
import { ageLabels, czn, pyramidStats } from '../../illustrations/geography/charts'
import { parseDecimal, shuffle } from '../shared/util'
import { levelNum } from '../types'
import { INCOME, POPULATIONS, POP_BY_ID, SOURCE, type Population } from './data'
import { COHORTS, FUTURE, LEVELS, MIGRANTS, WARS, type TaskKind } from './levels'

export const ROUND = 10
export const STEP = 5 as const
export const AGES = ageLabels(STEP, 18)
type Rng = () => number

/** Level number whose set is played; undefined = all levels mixed. */
export function playedLevel(levelId?: string): number | undefined {
  const n = levelNum(levelId)
  return n !== undefined && LEVELS[n] ? n : undefined
}

export const label = (p: Population) => `${p.name} ${p.year}${p.projection ? ' (projekce)' : ''}`
export const toSpec = (p: Population): PyramidSpec => ({
  label: label(p),
  male: p.male,
  female: p.female,
  source: SOURCE + (p.projection ? ', střední varianta projekce' : ''),
})
const statsCache = new Map<Population, ReturnType<typeof pyramidStats>>()
export function statsOf(p: Population) {
  let s = statsCache.get(p)
  if (!s) statsCache.set(p, (s = pyramidStats(p, STEP)))
  return s
}
const tot = (p: Population) => p.male.map((m, i) => m + p.female[i])
const pct = (x: number) => `${czn(x, 1)}\u00a0%`

/** Populations of 2023 (estimates), without the two Gulf states shaped by immigration. */
const CURRENT = POPULATIONS.filter((p) => p.year === 2023 && !MIGRANTS.includes(p.id))

/* ------------------------------------------------------------------ type */

export type PyrType = 'progresivni' | 'stacionarni' | 'regresivni'
export const TYPE_NAMES: Record<PyrType, string> = {
  progresivni: 'progresivní (rostoucí)',
  stacionarni: 'stacionární (ustálený)',
  regresivni: 'regresivní (stárnoucí)',
}

/**
 * Base-to-parents ratio: the mean share of the groups 0–14 per 5-year group divided by
 * the mean of the groups 25–44 (the parents' generation).
 */
export function baseRatio(p: Pick<Population, 'male' | 'female'>): number {
  const t = p.male.map((m, i) => m + p.female[i])
  const kids = (t[0] + t[1] + t[2]) / 3
  const parents = (t[5] + t[6] + t[7] + t[8]) / 4
  return kids / parents
}

/** Type of the pyramid; undefined when the shape is between two types. */
export function typeOf(p: Pick<Population, 'male' | 'female'>): PyrType | undefined {
  const r = baseRatio(p)
  if (r >= 1.4) return 'progresivni'
  if (r >= 0.9 && r <= 1.15) return 'stacionarni'
  if (r <= 0.82) return 'regresivni'
  return undefined
}

/* ------------------------------------------------------------------ demographic transition */

export const STAGE_NAMES: Record<number, string> = {
  1: '1. fáze – vysoká porodnost i úmrtnost',
  2: '2. fáze – úmrtnost klesá, porodnost zůstává vysoká',
  3: '3. fáze – porodnost klesá',
  4: '4. fáze – nízká porodnost i úmrtnost',
  5: '5. fáze – porodnost nižší než úmrtnost',
}

/** Stage of the demographic transition from the birth and death rates; undefined when borderline. */
export function stageOf(p: Population): number | undefined {
  const { cbr, cdr } = p
  if (cbr === undefined || cdr === undefined) return undefined
  // 30–35 ‰ with fast-falling fertility (Ethiopia, Nigeria) is between stages 2 and 3 (lesson z11-1 counts 31 ‰ and falling as stage 3): left out
  if (cbr >= 35 && cdr <= 15) return 2
  if (cbr >= 15 && cbr <= 25 && cbr - cdr >= 5) return 3
  if (cbr <= 13 && cbr - cdr >= 1) return 4
  if (cdr - cbr >= 1) return 5
  return undefined
}

/* ------------------------------------------------------------------ helpers */

/** Index of the age group of people born in `from`–`to` in the year of `p` (one 5-year group), or undefined. */
export function cohortGroup(p: Population, from: number, to: number): number | undefined {
  const youngest = p.year - to
  if (to - from !== 4 || youngest < 0 || youngest % 5 !== 0) return undefined
  const g = youngest / 5
  return g < 17 ? g : undefined
}

/** Men per 100 women in a group. */
export const sexRatio = (p: Population, g: number) => (100 * p.male[g]) / p.female[g]

/* ------------------------------------------------------------------ tasks */

export interface Option {
  id: string
  label: string
}
interface Base {
  key: string
  kind: TaskKind
  level: number
  text: string
  why: string
  /** populations drawn while the task is open */
  pops: string[]
  /** populations drawn after answering (e.g. with the projection) */
  after?: string[]
  hideName: boolean
  /** age groups outlined after answering, per drawn population */
  marks?: number[][]
}
export interface ChoiceTask extends Base {
  mode: 'choice'
  options: Option[]
  answer: string
}
export interface NumberTask extends Base {
  mode: 'number'
  value: number
  tol: number
  unit: string
  digits: number
}
export type Task = ChoiceTask | NumberTask

const groupOptions = (answer: number, others: number[], rng: Rng): Option[] =>
  [answer, ...shuffle(others, rng).slice(0, 3)].sort((a, b) => a - b).map((g) => ({ id: String(g), label: `${AGES[g]} let` }))

function taskOf(kind: TaskKind, level: number, rng: Rng, used: Set<string>, seen: Set<string>): Task | undefined {
  const free = (p: Population) => !seen.has(p.id) && !used.has(`${kind}:${p.id}`)
  const cur = shuffle(CURRENT, rng).filter(free)
  const base = (p: Population, extra: Partial<Base> = {}) => ({ key: `${kind}:${p.id}`, kind, level, pops: [p.id], hideName: true, ...extra })

  switch (kind) {
    case 'type': {
      const p = cur.find((x) => typeOf(x))
      if (!p) return undefined
      const ty = typeOf(p)!
      const s = statsOf(p)
      return {
        ...base(p),
        mode: 'choice',
        text: 'Jaký **typ** má tato věková pyramida?',
        why: `Je to ${label(p)}: děti 0–14 let tvoří ${pct(s.young)}, lidé 65+ ${pct(s.old)}. ${typeWhy(ty)}`,
        options: (Object.keys(TYPE_NAMES) as PyrType[]).map((id) => ({ id, label: TYPE_NAMES[id] })),
        answer: ty,
      }
    }
    case 'share': {
      for (const p of cur) {
        const old = rng() < 0.5
        const val = (x: Population) => Math.round(old ? statsOf(x).old : statsOf(x).young)
        const v = val(p)
        const others: number[] = []
        for (const x of shuffle(CURRENT, rng)) {
          const w = val(x)
          if ([v, ...others].every((o) => Math.abs(o - w) >= 5)) others.push(w)
          if (others.length === 3) break
        }
        if (others.length < 3) continue
        const what = old ? 'lidé ve věku **65 a více let**' : 'děti ve věku **0–14 let**'
        return {
          ...base(p, { marks: [old ? [13, 14, 15, 16, 17] : [0, 1, 2]] }),
          mode: 'choice',
          text: `Jakou část obyvatel tvoří ${what}? Sečti v duchu sloupce mužů i žen.`,
          why: `${label(p)}: ${old ? '65+' : '0–14'} let = ${pct(old ? statsOf(p).old : statsOf(p).young)} obyvatel.`,
          options: [v, ...others].sort((a, b) => a - b).map((x) => ({ id: String(x), label: `asi ${x} %` })),
          answer: String(v),
        }
      }
      return undefined
    }
    case 'more': {
      const p = cur.find((x) => Math.abs(statsOf(x).young - statsOf(x).old) >= 2)
      if (!p) return undefined
      const s = statsOf(p)
      const kids = s.young > s.old
      return {
        ...base(p, { marks: [kids ? [0, 1, 2] : [13, 14, 15, 16, 17]] }),
        mode: 'choice',
        text: 'Koho je tu víc: **dětí (0–14 let)**, nebo **seniorů (65+)**?',
        why: `${label(p)}: děti ${pct(s.young)}, senioři ${pct(s.old)}.${kids ? '' : ' Seniorů je víc než dětí – populace stárne.'}`,
        options: [
          { id: 'kids', label: 'víc dětí 0–14' },
          { id: 'old', label: 'víc seniorů 65+' },
        ],
        answer: kids ? 'kids' : 'old',
      }
    }
    case 'cohort': {
      for (const c of shuffle(COHORTS, rng)) {
        const p = POP_BY_ID[c.pop]
        if (!free(p)) continue
        const g = cohortGroup(p, c.from, c.to)
        if (g === undefined) continue
        const others = AGES.map((_, i) => i).filter((i) => Math.abs(i - g) >= 2 && i < 17)
        const t = tot(p)
        return {
          ...base(p, { hideName: false, key: `cohort:${c.pop}:${c.from}`, marks: [[g]] }),
          mode: 'choice',
          text: `${label(p)}: ve které věkové skupině jsou lidé narození v letech ${c.from}–${c.to} – ${c.story}?`,
          why: `V roce ${p.year} jim bylo ${AGES[g]} let. Jejich sloupec má ${pct(t[g])} obyvatel, sousední ${pct(t[g - 1])} a ${pct(t[g + 1])}${c.strength === 'strong' ? ' – vystupuje ven.' : ' – je to zářez.'}`,
          options: groupOptions(g, others, rng),
          answer: String(g),
        }
      }
      return undefined
    }
    case 'war': {
      for (const w of shuffle(WARS, rng)) {
        const p = POP_BY_ID[w.pop]
        if (!free(p)) continue
        const adult = [4, 5, 6, 7, 8, 9, 10, 11, 12]
        const g = adult.reduce((b, i) => (sexRatio(p, i) < sexRatio(p, b) ? i : b), adult[0])
        const others = AGES.map((_, i) => i).filter((i) => i < 13 && sexRatio(p, i) >= 95)
        if (others.length < 3) continue
        return {
          ...base(p, { hideName: false, marks: [[g]] }),
          mode: 'choice',
          text: `${label(p)}: ve které věkové skupině **chybí nejvíc mužů** (sloupec mužů je výrazně kratší než sloupec žen)?`,
          why: `Ve skupině ${AGES[g]} let připadá jen ${czn(Math.round(sexRatio(p, g)))} mužů na 100 žen – ${w.story}.`,
          options: groupOptions(g, others, rng),
          answer: String(g),
        }
      }
      return undefined
    }
    case 'surplus': {
      for (const id of shuffle(MIGRANTS, rng)) {
        const p = POP_BY_ID[id]
        if (!free(p)) continue
        const work = [5, 6, 7, 8, 9, 10]
        const g = work.reduce((b, i) => (sexRatio(p, i) > sexRatio(p, b) ? i : b), work[0])
        return {
          ...base(p, { hideName: false, marks: [[g]] }),
          mode: 'choice',
          text: `${label(p)}: proč je v pyramidě tolik **mužů ve věku 25–54 let**?`,
          why: `Ve skupině ${AGES[g]} let připadá ${czn(Math.round(sexRatio(p, g)))} mužů na 100 žen, u dětí 0–4 jen ${czn(Math.round(sexRatio(p, 0)))}. Rozdíl tedy nevzniká při narození: přistěhovali se dospělí muži za prací.`,
          options: shuffle(
            [
              { id: 'migrace', label: 'přistěhovali se sem za prací' },
              { id: 'porody', label: 'rodí se tu mnohem víc chlapců' },
              { id: 'valka', label: 'ženy zahynuly ve válce' },
              { id: 'dozivani', label: 'muži tu žijí déle než ženy' },
            ],
            rng,
          ),
          answer: 'migrace',
        }
      }
      return undefined
    }
    case 'develop':
    case 'dep-pair': {
      const pairs: [Population, Population][] = []
      for (const a of cur)
        for (const b of cur) {
          if (a.id >= b.id) continue
          if (kind === 'develop') {
            if (INCOME[a.code] === 'low' && INCOME[b.code] === 'high') pairs.push([b, a])
            if (INCOME[b.code] === 'low' && INCOME[a.code] === 'high') pairs.push([a, b])
          } else {
            const d = statsOf(a).dependency - statsOf(b).dependency
            if (Math.abs(d) >= 15) pairs.push(d > 0 ? [a, b] : [b, a])
          }
        }
      if (!pairs.length) return undefined
      const [win, lose] = pairs[Math.floor(rng() * pairs.length)]
      const shown = rng() < 0.5 ? [win, lose] : [lose, win]
      const answer = shown[0] === win ? 'A' : 'B'
      const why =
        kind === 'develop'
          ? `A = ${label(shown[0])}, B = ${label(shown[1])}. Vyspělý stát má málo dětí (${pct(statsOf(win).young)} oproti ${pct(statsOf(lose).young)}) a hodně starých lidí: lidé žijí dlouho a rodiny mají málo dětí.`
          : `Index závislosti: A = ${czn(statsOf(shown[0]).dependency, 1)}, B = ${czn(statsOf(shown[1]).dependency, 1)} dětí a seniorů na 100 lidí ve věku 15–64. A = ${label(shown[0])}, B = ${label(shown[1])}.`
      return {
        key: `${kind}:${win.id}:${lose.id}`,
        kind,
        level,
        pops: shown.map((p) => p.id),
        hideName: true,
        mode: 'choice',
        text:
          kind === 'develop'
            ? 'Která pyramida patří **hospodářsky vyspělému** státu?'
            : 'Kde připadá na lidi v produktivním věku (15–64) **víc závislých** – dětí a seniorů dohromady?',
        why,
        marks: kind === 'dep-pair' ? shown.map(() => [0, 1, 2, 13, 14, 15, 16, 17]) : undefined,
        options: [
          { id: 'A', label: 'pyramida A' },
          { id: 'B', label: 'pyramida B' },
        ],
        answer,
      }
    }
    case 'country': {
      for (const p of cur) {
        const ty = typeOf(p)
        if (!ty) continue
        const others: Population[] = []
        for (const x of shuffle(CURRENT, rng)) {
          const tx = typeOf(x)
          if (!tx || tx === ty || others.some((o) => typeOf(o) === tx)) continue
          others.push(x)
          if (others.length === 2) break
        }
        if (others.length < 2) continue
        return {
          ...base(p),
          mode: 'choice',
          text: 'Kterému státu patří tato pyramida (rok 2023)?',
          why: `Je to ${p.name}: ${TYPE_NAMES[ty]} typ, děti ${pct(statsOf(p).young)}, senioři ${pct(statsOf(p).old)}. ${others.map((o) => `${o.name}: ${TYPE_NAMES[typeOf(o)!].split(' ')[0]}`).join(', ')}.`,
          options: shuffle([p, ...others], rng).map((x) => ({ id: x.id, label: x.name })),
          answer: p.id,
        }
      }
      return undefined
    }
    case 'stage': {
      const p = cur.find((x) => stageOf(x))
      if (!p) return undefined
      const st = stageOf(p)!
      return {
        ...base(p, { hideName: false }),
        mode: 'choice',
        text: `${label(p)}: porodnost ${czn(p.cbr!, 1)} ‰, úmrtnost ${czn(p.cdr!, 1)} ‰. Ve které **fázi demografického přechodu** je tento stát?`,
        why: `${stageWhy(p, st)}`,
        options: Object.entries(STAGE_NAMES).map(([id, l]) => ({ id, label: l })),
        answer: String(st),
      }
    }
    case 'future': {
      for (const id of shuffle(FUTURE, rng)) {
        const p = POP_BY_ID[id]
        const q = POP_BY_ID[id.replace('2023', '2043')]
        if (!free(p) || !q) continue
        const t = tot(p)
        const g = t.slice(0, 13).reduce((b, v, i) => (v > t[b] ? i : b), 0)
        const answer = g + 4
        const others = [g, g + 2, g + 3, g + 5, g + 6].filter((x) => x >= 0 && x < 18 && x !== answer)
        return {
          ...base(p, { hideName: false, after: [p.id, q.id], marks: [[g], [answer]] }),
          mode: 'choice',
          text: `${label(p)}: nejpočetnější skupina do 65 let je ${AGES[g]} let. Ve které skupině budou tito lidé **v roce 2043**?`,
          why: `Za 20 let zestárnou o 20 let, tedy o 4 skupiny po 5 letech: ${AGES[answer]} let. Projekce OSN: dnes ${pct(t[g])}, v roce 2043 ${pct(tot(q)[answer])} obyvatel.`,
          options: groupOptions(answer, others, rng),
          answer: String(answer),
        }
      }
      return undefined
    }
    case 'trend': {
      const year = LEVELS[level].trendYear ?? 2050
      for (const q of shuffle(
        POPULATIONS.filter((x) => x.year === year),
        rng,
      )) {
        const p = POP_BY_ID[`${q.code.toLowerCase()}-2023`]
        if (!p || !free(p)) continue
        const old = rng() < 0.5
        const a = old ? statsOf(p).old : statsOf(p).young
        const b = old ? statsOf(q).old : statsOf(q).young
        if (Math.abs(b - a) < 1) continue
        const up = b > a
        const what = old ? 'lidí ve věku 65+' : 'dětí 0–14 let'
        return {
          ...base(p, { key: `trend:${p.id}`, hideName: false, after: [p.id, q.id], marks: [old ? [13, 14, 15, 16, 17] : [0, 1, 2], old ? [13, 14, 15, 16, 17] : [0, 1, 2]] }),
          mode: 'choice',
          text: `${label(p)}: bude podíl ${what} v roce ${year} **vyšší, nebo nižší** než dnes? Podívej se, které ročníky do té doby dorostou.`,
          why: `Projekce OSN: ${pct(a)} (2023) → ${pct(b)} (${year}). ${up ? (old ? 'Do důchodového věku vstoupí početné ročníky a lidé žijí déle.' : 'Rodí se víc dětí.') : old ? 'Ubude starých lidí.' : 'Rodí se méně dětí, populace stárne.'}`,
          options: [
            { id: 'up', label: 'vyšší' },
            { id: 'down', label: 'nižší' },
          ],
          answer: up ? 'up' : 'down',
        }
      }
      return undefined
    }
    case 'dependency':
    case 'support': {
      const p = cur.find((x) => statsOf(x).old >= (kind === 'support' ? 5 : 0))
      if (!p) return undefined
      const s = statsOf(p)
      const shares = `děti 0–14 let ${pct(s.young)}, lidé 15–64 let ${pct(s.work)}, senioři 65+ ${pct(s.old)}`
      if (kind === 'dependency') {
        const v = Math.round(((s.young + s.old) / s.work) * 1000) / 10
        return {
          ...base(p, { hideName: false }),
          mode: 'number',
          text: `${label(p)}: ${shares}. Spočítej **index ekonomické závislosti** – kolik dětí a seniorů připadá na 100 lidí ve věku 15–64?`,
          why: `(${czn(s.young, 1)} + ${czn(s.old, 1)}) : ${czn(s.work, 1)} · 100 ≐ ${czn(v, 1)}. ${v >= 70 ? 'Na lidi v produktivním věku připadá hodně závislých.' : ''}`.trim(),
          value: v,
          tol: 1.5,
          unit: 'na 100',
          digits: 1,
        }
      }
      const v = Math.round((s.work / s.old) * 10) / 10
      return {
        ...base(p, { hideName: false }),
        mode: 'number',
        text: `${label(p)}: ${shares}. Kolik lidí v produktivním věku (15–64) připadá na **jednoho seniora**?`,
        why: `${czn(s.work, 1)} : ${czn(s.old, 1)} ≐ ${czn(v, 1)}. ${v < 4 ? 'Na důchod jednoho seniora přispívá málo lidí v produktivním věku – důchodový systém je pod tlakem.' : 'Lidí v produktivním věku je zatím na jednoho seniora dost.'}`,
        value: v,
        tol: 0.2,
        unit: 'lidí',
        digits: 1,
      }
    }
  }
}

function typeWhy(ty: PyrType): string {
  if (ty === 'progresivni') return 'Široká základna: dětí je mnohem víc než rodičů, populace roste.'
  if (ty === 'stacionarni') return 'Dětí je zhruba stejně jako rodičů: tvar zvonu. Dětí se už nerodí víc než dřív, růst počtu obyvatel se zpomaluje nebo zastavuje.'
  return 'Základna je užší než střed: dětí je méně než rodičů, populace stárne (tvar urny).'
}

function stageWhy(p: Population, st: number): string {
  const inc = czn(Math.round((p.cbr! - p.cdr!) * 10) / 10, 1)
  if (st === 2) return `Úmrtnost už je nízká, ale porodnost vysoká: přirozený přírůstek ${inc} ‰, obyvatel rychle přibývá.`
  if (st === 3) return `Porodnost klesá, ale je stále vyšší než úmrtnost: přírůstek ${inc} ‰.`
  if (st === 4) return `Porodnost i úmrtnost jsou nízké: přírůstek jen ${inc} ‰.`
  return `Porodnost je nižší než úmrtnost: přirozený přírůstek je záporný (${inc} ‰), obyvatel bez migrace ubývá.`
}

/* ------------------------------------------------------------------ round */

export function makeRound(level?: number, rng: Rng = Math.random): Task[] {
  const levels = level !== undefined && LEVELS[level] ? [level] : shuffle(Object.keys(LEVELS).map(Number), rng)
  const next = new Map(levels.map((l) => [l, 0]))
  const used = new Set<string>()
  const seen = new Set<string>()
  const out: Task[] = []
  for (let guard = 0; out.length < ROUND && guard < ROUND * 8; guard++) {
    const lv = levels[out.length % levels.length]
    const plan = LEVELS[lv].plan
    const k = next.get(lv)!
    next.set(lv, k + 1)
    const t = taskOf(plan[k % plan.length], lv, rng, used, seen)
    if (!t) continue
    used.add(t.key)
    for (const id of t.pops) seen.add(id)
    out.push(t)
  }
  return out
}

/* ------------------------------------------------------------------ checking */

export type NumCheck = { kind: 'invalid' } | { kind: 'ok'; value: number } | { kind: 'wrong'; value: number }

export function checkNumber(input: string, t: NumberTask): NumCheck {
  const value = parseDecimal(input.replace(/%|lidí|na\s*100/gi, '').replace(/[  ]/g, ''))
  if (value === null) return { kind: 'invalid' }
  return Math.abs(value - t.value) <= t.tol + 1e-9 ? { kind: 'ok', value } : { kind: 'wrong', value }
}
