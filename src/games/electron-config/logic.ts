import { BY_Z } from '../../courses/chemie/data/elements'
import { AUFBAU_ORDER, CAPACITY, electronConfig, type SubshellType } from '../../courses/chemie/data/electronConfig'
import { pick } from '../shared/util'

export type Spin = 'u' | 'd'
/** One orbital box: its electrons' spins (valid boxes hold [], ['u'], ['u','d']). */
export type Orbital = Spin[]
export interface SubshellFill {
  n: number
  l: SubshellType
  orbitals: Orbital[]
}
export type Filling = SubshellFill[]

export type Rule = 'count' | 'pauli' | 'aufbau' | 'exception' | 'hund'
export type Verdict = { ok: true } | { ok: false; rule: Rule; message: string; where?: string }

export const keyOf = (s: { n: number; l: SubshellType }) => `${s.n}${s.l}`
const EXCEPTIONS = new Set([24, 29])
/** 4p is the last subshell needed for Z <= 36. */
const LAST_INDEX = AUFBAU_ORDER.findIndex((s) => s.n === 4 && s.l === 'p')

/** Subshells shown for element z: all up to its highest one in Aufbau order, plus one more as a decoy. */
export function subshellsFor(z: number): { n: number; l: SubshellType }[] {
  const cfg = electronConfig(z)
  const last = Math.max(...cfg.map((s) => AUFBAU_ORDER.findIndex((a) => a.n === s.n && a.l === s.l)))
  return AUFBAU_ORDER.slice(0, Math.min(LAST_INDEX, last + 1) + 1)
}

export function emptyFilling(z: number): Filling {
  return subshellsFor(z).map((s) => ({ ...s, orbitals: Array.from({ length: CAPACITY[s.l] / 2 }, () => []) }))
}

/** Tap on a box: empty → ↑ → ↑↓ → empty. */
export function tapOrbital(o: Orbital): Orbital {
  if (o.length === 0) return ['u']
  if (o.length === 1) return [o[0], o[0] === 'u' ? 'd' : 'u']
  return []
}

export const countOf = (s: SubshellFill) => s.orbitals.reduce((a, o) => a + o.length, 0)
export const totalOf = (f: Filling) => f.reduce((a, s) => a + countOf(s), 0)

/** The correct filling (ground state), with Hund's rule applied: all ↑ first, then ↓. */
export function solution(z: number): Filling {
  const cfg = electronConfig(z)
  return emptyFilling(z).map((s) => {
    const e = cfg.find((c) => c.n === s.n && c.l === s.l)?.e ?? 0
    const k = s.orbitals.length
    return { ...s, orbitals: s.orbitals.map((_, i) => (i < e - k ? ['u', 'd'] : i < e ? ['u'] : [])) as Orbital[] }
  })
}

/** Plain Aufbau prediction without the Cr/Cu exception. */
function aufbauCounts(z: number): Record<string, number> {
  const out: Record<string, number> = {}
  let left = z
  for (const s of AUFBAU_ORDER) {
    if (left <= 0) break
    const e = Math.min(CAPACITY[s.l], left)
    out[keyOf(s)] = e
    left -= e
  }
  return out
}

const el = (n: number) => (n === 1 ? 'elektron' : n >= 2 && n <= 4 ? 'elektrony' : 'elektronů')
const nameOf = (z: number) => BY_Z[z].name

/**
 * Checks a filling against Pauli, Aufbau (with the Cr/Cu exceptions)
 * and Hund. Messages are Czech, in <Md> markup, and name the broken rule.
 */
export function validateFilling(z: number, filling: Filling): Verdict {
  const total = totalOf(filling)
  if (total < z) {
    return { ok: false, rule: 'count', message: `Zatím máš ${total} ${el(total)}, ale ${nameOf(z).toLowerCase()} jich má ${z}. Přidej ještě ${z - total}.` }
  }
  if (total > z) {
    return { ok: false, rule: 'count', message: `Máš ${total} ${el(total)}, ale ${nameOf(z).toLowerCase()} jich má jen ${z}. Odeber ${total - z}.` }
  }

  for (const s of filling) {
    for (const o of s.orbitals) {
      if (o.length > 2 || (o.length === 2 && o[0] === o[1])) {
        return {
          ok: false,
          rule: 'pauli',
          where: keyOf(s),
          message: `**Pauliho princip:** v jednom orbitalu (${keyOf(s)}) mohou být nejvýš dva elektrony, a to s opačným spinem ↑↓.`,
        }
      }
    }
  }

  const expected = Object.fromEntries(electronConfig(z).map((s) => [keyOf(s), s.e]))
  const have = Object.fromEntries(filling.map((s) => [keyOf(s), countOf(s)]))
  const keys = filling.map(keyOf)
  const matches = (want: Record<string, number>) => keys.every((k) => (want[k] ?? 0) === (have[k] ?? 0))

  if (!matches(expected)) {
    if (EXCEPTIONS.has(z) && matches(aufbauCounts(z))) {
      const why =
        z === 24
          ? 'napůl zaplněná podslupka 3d je stabilnější, takže jeden elektron ze 4s přeskočí do 3d: $3d^{5} 4s^{1}$'
          : 'úplně zaplněná podslupka 3d je stabilnější, takže jeden elektron ze 4s přeskočí do 3d: $3d^{10} 4s^{1}$'
      return {
        ok: false,
        rule: 'exception',
        where: '3d',
        message: `**Skoro!** Podle výstavbového principu je to správně, ale ${nameOf(z).toLowerCase()} je výjimka: ${why}.`,
      }
    }
    for (let i = 0; i < filling.length; i++) {
      const s = filling[i]
      if (countOf(s) >= CAPACITY[s.l]) continue
      const later = filling.slice(i + 1).find((t) => countOf(t) > 0)
      if (later && !(EXCEPTIONS.has(z) && keyOf(s) === '4s')) {
        const note = keyOf(s) === '4s' && keyOf(later) === '3d' ? ' Pozor, 4s má nižší energii než 3d, a proto se zaplňuje dřív.' : ''
        return {
          ok: false,
          rule: 'aufbau',
          where: keyOf(s),
          message: `**Výstavbový princip:** elektrony obsazují orbitaly od nejnižší energie. Nejdřív zaplň ${keyOf(s)}, teprve potom ${keyOf(later)}.${note}`,
        }
      }
    }
    const wrong = keys.find((k) => (expected[k] ?? 0) !== (have[k] ?? 0)) ?? '3d'
    return {
      ok: false,
      rule: 'aufbau',
      where: wrong,
      message: `**Výstavbový princip:** v podslupce ${wrong} má být ${expected[wrong] ?? 0} ${el(expected[wrong] ?? 0)}.`,
    }
  }

  for (const s of filling) {
    if (s.orbitals.length < 2) continue
    const paired = s.orbitals.some((o) => o.length === 2)
    const empty = s.orbitals.some((o) => o.length === 0)
    if (paired && empty) {
      return {
        ok: false,
        rule: 'hund',
        where: keyOf(s),
        message: `**Hundovo pravidlo:** v ${keyOf(s)} nejdřív dej do každého orbitalu po jednom elektronu se stejným spinem, teprve potom je páruj.`,
      }
    }
    const singles = new Set(s.orbitals.filter((o) => o.length === 1).map((o) => o[0]))
    if (singles.size > 1) {
      return {
        ok: false,
        rule: 'hund',
        where: keyOf(s),
        message: `**Hundovo pravidlo:** nespárované elektrony v ${keyOf(s)} mají mít stejný spin (všechny ↑).`,
      }
    }
  }
  return { ok: true }
}

/** Markup like "1s^{2} 2s^{2} 2p^{3}" for whatever the player has placed. */
export function fillingMarkup(f: Filling): string {
  return f
    .filter((s) => countOf(s) > 0)
    .map((s) => `${keyOf(s)}^{${countOf(s)}}`)
    .join(' ')
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const T1 = range(3, 10)
const T2 = range(11, 18)
const T3 = range(19, 30).filter((z) => !EXCEPTIONS.has(z))
const T4 = range(31, 36)

export interface EcTarget {
  z: number
  bonus: boolean
}

/** Four elements per round, easier first; higher levels end with Cr or Cu as a bonus. */
export function pickTargets(level: number, rng: () => number = Math.random): EcTarget[] {
  if (level <= 2) {
    const c = pick(T3, rng)
    const d = pick([...T3, ...T4].filter((z) => z !== c), rng)
    return [pick(T1, rng), pick(T2, rng), c, d].map((z) => ({ z, bonus: false }))
  }
  return [
    { z: pick(T1, rng), bonus: false },
    { z: pick(T2, rng), bonus: false },
    { z: pick([...T3, ...T4], rng), bonus: false },
    { z: pick([24, 29], rng), bonus: true },
  ]
}

export function ecPoints(attempt: number, bonus: boolean): number {
  const p = attempt === 1 ? 100 : attempt === 2 ? 60 : attempt === 3 ? 30 : 0
  return bonus ? Math.round(p * 1.5) : p
}
