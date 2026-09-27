import { BY_Z } from '../../courses/chemie/data/elements'
import {
  AUFBAU_ORDER,
  CAPACITY,
  configMarkup,
  electronConfig,
  shorthandMarkup,
  type Subshell,
  type SubshellType,
} from '../../courses/chemie/data/electronConfig'
import { pickLevel, shuffle } from '../shared/util'
import { LEVELS, PLANS, type EcTarget } from './levels'

export type { EcTarget }

export type Spin = 'u' | 'd'
/** One orbital box: its electrons' spins (valid boxes hold [], ['u'], ['u','d']). */
export type Orbital = Spin[]
export interface SubshellFill {
  n: number
  l: SubshellType
  orbitals: Orbital[]
}
export type Filling = SubshellFill[]

export type Rule = 'count' | 'pauli' | 'aufbau' | 'exception' | 'ion' | 'hund'
export type Verdict = { ok: true } | { ok: false; rule: Rule; message: string; where?: string }

/** A target is an element (its Z) or an ion. */
export type TargetLike = number | EcTarget

export const keyOf = (s: { n: number; l: SubshellType }) => `${s.n}${s.l}`
const EXCEPTIONS = new Set([24, 29])
/** 4p is the last subshell needed for Z <= 36. */
const LAST_INDEX = AUFBAU_ORDER.findIndex((s) => s.n === 4 && s.l === 'p')
const aufbauIndex = (s: { n: number; l: SubshellType }) => AUFBAU_ORDER.findIndex((a) => a.n === s.n && a.l === s.l)
const L_ORDER: SubshellType[] = ['s', 'p', 'd', 'f']

const asTarget = (t: TargetLike): EcTarget => (typeof t === 'number' ? { z: t, charge: 0, bonus: false } : t)
const chargeOf = (t: TargetLike) => asTarget(t).charge ?? 0

/** Number of electrons of the atom or ion. */
export const electronsOf = (t: TargetLike) => asTarget(t).z - chargeOf(t)

/**
 * Ground-state configuration of an atom or ion (in filling order).
 * Anions get extra electrons by the Aufbau principle; cations lose them from the
 * subshell with the highest n first (so 4s empties before 3d, lesson l2-5).
 */
export function targetConfig(t: TargetLike): Subshell[] {
  const { z } = asTarget(t)
  const q = chargeOf(t)
  if (q <= 0) return electronConfig(z - q)
  const cfg = electronConfig(z).map((s) => ({ ...s }))
  let left = q
  while (left > 0) {
    const from = cfg
      .filter((s) => s.e > 0)
      .sort((a, b) => b.n - a.n || L_ORDER.indexOf(b.l) - L_ORDER.indexOf(a.l))[0]
    const k = Math.min(from.e, left)
    from.e -= k
    left -= k
  }
  return cfg.filter((s) => s.e > 0)
}

/** Subshells shown for a target: all up to its highest one in Aufbau order, plus one more as a decoy. */
export function subshellsFor(t: TargetLike): { n: number; l: SubshellType }[] {
  const last = Math.max(...targetConfig(t).map(aufbauIndex))
  return AUFBAU_ORDER.slice(0, Math.min(LAST_INDEX, last + 1) + 1)
}

export function emptyFilling(t: TargetLike): Filling {
  return subshellsFor(t).map((s) => ({ ...s, orbitals: Array.from({ length: CAPACITY[s.l] / 2 }, () => []) }))
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
export function solution(t: TargetLike): Filling {
  const cfg = targetConfig(t)
  return emptyFilling(t).map((s) => {
    const e = cfg.find((c) => c.n === s.n && c.l === s.l)?.e ?? 0
    const k = s.orbitals.length
    return { ...s, orbitals: s.orbitals.map((_, i) => (i < e - k ? ['u', 'd'] : i < e ? ['u'] : [])) as Orbital[] }
  })
}

/** Plain Aufbau prediction for `electrons` electrons (no exceptions, no ion rules). */
function aufbauCounts(electrons: number): Record<string, number> {
  const out: Record<string, number> = {}
  let left = electrons
  for (const s of AUFBAU_ORDER) {
    if (left <= 0) break
    const e = Math.min(CAPACITY[s.l], left)
    out[keyOf(s)] = e
    left -= e
  }
  return out
}

const el = (n: number) => (n === 1 ? 'elektron' : n >= 2 && n <= 4 ? 'elektrony' : 'elektronů')

const ION_SUFFIX = (q: number) => `${Math.abs(q) > 1 ? Math.abs(q) : ''}${q > 0 ? '+' : '-'}`

/** Czech name of the target: "Železo", "Kation železnatý". */
export function targetName(t: TargetLike): string {
  const tt = asTarget(t)
  if (!chargeOf(tt)) return BY_Z[tt.z].name
  const n = tt.name ?? `ion ${BY_Z[tt.z].symbol}`
  return n.charAt(0).toUpperCase() + n.slice(1)
}

/** Symbol with the charge in <Md> markup: "Fe^{2+}". */
export function targetSymbol(t: TargetLike): string {
  const q = chargeOf(t)
  const sym = BY_Z[asTarget(t).z].symbol
  return q ? `${sym}^{${ION_SUFFIX(q)}}` : sym
}

/** "[Ar] 3d^{6}" – noble-gas shorthand for atoms and ions (markup for <Md>). */
export function targetShorthand(t: TargetLike): string {
  if (!chargeOf(t)) return shorthandMarkup(asTarget(t).z)
  const cfg = targetConfig(t)
  const e = electronsOf(t)
  const cores: [number, string][] = [
    [18, 'Ar'],
    [10, 'Ne'],
    [2, 'He'],
  ]
  for (const [cz, sym] of cores) {
    if (cz >= e) continue
    const core = electronConfig(cz)
    if (!core.every((c) => cfg.some((s) => s.n === c.n && s.l === c.l && s.e === c.e))) continue
    const rest = cfg.filter((s) => !core.some((c) => c.n === s.n && c.l === s.l))
    return `[${sym}] ${configMarkup(rest)}`
  }
  return configMarkup(cfg)
}

/** Noble gas with the same configuration (main-group ions), e.g. "argonu". */
export function sameAsNoble(t: TargetLike): string | null {
  const NOBLE: Record<number, string> = { 2: 'helia', 10: 'neonu', 18: 'argonu', 36: 'kryptonu' }
  const e = electronsOf(t)
  if (!chargeOf(t) || !NOBLE[e]) return null
  const same = configMarkup(targetConfig(t)) === configMarkup(electronConfig(e))
  return same ? NOBLE[e] : null
}

/**
 * Checks a filling against Pauli, Aufbau (with the Cr/Cu exceptions and the
 * "4s empties first" rule for cations) and Hund. Messages are Czech, in <Md>
 * markup, and name the broken rule.
 */
export function validateFilling(t: TargetLike, filling: Filling): Verdict {
  const target = asTarget(t)
  const z = target.z
  const q = chargeOf(target)
  const need = electronsOf(target)
  const who = targetName(target).toLowerCase()
  const total = totalOf(filling)
  if (total < need) {
    return { ok: false, rule: 'count', message: `Zatím máš ${total} ${el(total)}, ale ${who} jich má ${need}. Přidej ještě ${need - total}.` }
  }
  if (total > need) {
    return { ok: false, rule: 'count', message: `Máš ${total} ${el(total)}, ale ${who} jich má jen ${need}. Odeber ${total - need}.` }
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

  const expected = Object.fromEntries(targetConfig(target).map((s) => [keyOf(s), s.e]))
  const have = Object.fromEntries(filling.map((s) => [keyOf(s), countOf(s)]))
  const keys = filling.map(keyOf)
  const matches = (want: Record<string, number>) => keys.every((k) => (want[k] ?? 0) === (have[k] ?? 0))
  /** A cation that has emptied 4s while keeping 3d electrons (Fe²⁺ = [Ar] 3d⁶). */
  const emptied4s = q > 0 && !expected['4s'] && (expected['3d'] ?? 0) > 0

  if (!matches(expected)) {
    if (q === 0 && EXCEPTIONS.has(z) && matches(aufbauCounts(z))) {
      const why =
        z === 24
          ? 'napůl zaplněná podslupka 3d je stabilnější, takže jeden elektron ze 4s přeskočí do 3d: $3d^{5} 4s^{1}$'
          : 'úplně zaplněná podslupka 3d je stabilnější, takže jeden elektron ze 4s přeskočí do 3d: $3d^{10} 4s^{1}$'
      return {
        ok: false,
        rule: 'exception',
        where: '3d',
        message: `**Skoro!** Podle výstavbového principu je to správně, ale ${who} je výjimka: ${why}.`,
      }
    }
    if (emptied4s && (have['4s'] ?? 0) > 0) {
      return {
        ok: false,
        rule: 'ion',
        where: '4s',
        message: `**Kationty přechodných kovů:** orbital 4s se plní dřív než 3d, ale při vzniku kationtu se **vyprazdňuje první**, protože má vyšší hlavní kvantové číslo. Atom ${BY_Z[z].symbol} ztratí nejdřív elektrony 4s, teprve potom 3d.`,
      }
    }
    if (!emptied4s) {
      for (let i = 0; i < filling.length; i++) {
        const s = filling[i]
        if (countOf(s) >= CAPACITY[s.l]) continue
        const later = filling.slice(i + 1).find((x) => countOf(x) > 0)
        if (later && !(q === 0 && EXCEPTIONS.has(z) && keyOf(s) === '4s')) {
          const note = keyOf(s) === '4s' && keyOf(later) === '3d' ? ' Pozor, 4s má nižší energii než 3d, a proto se zaplňuje dřív.' : ''
          return {
            ok: false,
            rule: 'aufbau',
            where: keyOf(s),
            message: `**Výstavbový princip:** elektrony obsazují orbitaly od nejnižší energie. Nejdřív zaplň ${keyOf(s)}, teprve potom ${keyOf(later)}.${note}`,
          }
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

const idOf = (t: EcTarget) => `${t.z}|${t.charge ?? 0}`

/**
 * Four targets per round from the level's content set (./levels.ts), easier first.
 * Without a level, or with one the game has no set for, the round mixes all levels
 * and ends with the Cr/Cu bonus.
 */
export function pickTargets(level?: number, rng: () => number = Math.random): EcTarget[] {
  const lv = pickLevel(LEVELS, level)
  const used = new Set<string>()
  const elements = new Set<number>()
  return PLANS[lv ?? 'mix'].map(([from, tags]) => {
    const fits = LEVELS[from].filter((t) => tags.includes(t.tag) && !used.has(idOf(t)))
    const fresh = fits.filter((t) => !elements.has(t.z))
    const t = shuffle(fresh.length ? fresh : fits, rng)[0]
    used.add(idOf(t))
    elements.add(t.z)
    return t
  })
}

export function ecPoints(attempt: number, bonus: boolean): number {
  const p = attempt === 1 ? 100 : attempt === 2 ? 60 : attempt === 3 ? 30 : 0
  return bonus ? Math.round(p * 1.5) : p
}
