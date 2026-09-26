/** Electron configuration by the Aufbau (Madelung) order, with common exceptions. */
export type SubshellType = 's' | 'p' | 'd' | 'f'
export interface Subshell {
  n: number
  l: SubshellType
  e: number
}

export const CAPACITY: Record<SubshellType, number> = { s: 2, p: 6, d: 10, f: 14 }

/** Filling order 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p */
export const AUFBAU_ORDER: { n: number; l: SubshellType }[] = [
  [1, 's'], [2, 's'], [2, 'p'], [3, 's'], [3, 'p'], [4, 's'], [3, 'd'], [4, 'p'], [5, 's'], [4, 'd'],
  [5, 'p'], [6, 's'], [4, 'f'], [5, 'd'], [6, 'p'], [7, 's'], [5, 'f'], [6, 'd'], [7, 'p'],
].map(([n, l]) => ({ n: n as number, l: l as SubshellType }))

/** Elements whose ground state differs from the simple Aufbau prediction (moves of electrons between ns and (n-1)d). */
const EXCEPTIONS: Record<number, { from: [number, SubshellType]; to: [number, SubshellType]; count: number }> = {
  24: { from: [4, 's'], to: [3, 'd'], count: 1 }, // Cr 3d5 4s1
  29: { from: [4, 's'], to: [3, 'd'], count: 1 }, // Cu 3d10 4s1
  42: { from: [5, 's'], to: [4, 'd'], count: 1 }, // Mo 4d5 5s1
  46: { from: [5, 's'], to: [4, 'd'], count: 2 }, // Pd 4d10
  47: { from: [5, 's'], to: [4, 'd'], count: 1 }, // Ag 4d10 5s1
  79: { from: [6, 's'], to: [5, 'd'], count: 1 }, // Au 5d10 6s1
}

/** Configuration of a neutral atom, in filling order. */
export function electronConfig(z: number): Subshell[] {
  const out: Subshell[] = []
  let left = z
  for (const { n, l } of AUFBAU_ORDER) {
    if (left <= 0) break
    const e = Math.min(CAPACITY[l], left)
    out.push({ n, l, e })
    left -= e
  }
  const ex = EXCEPTIONS[z]
  if (ex) {
    const from = out.find((s) => s.n === ex.from[0] && s.l === ex.from[1])
    const to = out.find((s) => s.n === ex.to[0] && s.l === ex.to[1])
    if (from && to) {
      from.e -= ex.count
      to.e += ex.count
    }
  }
  return out.filter((s) => s.e > 0)
}

/** "1s2 2s2 2p6" using ^{…} markup so it renders through <Md>. */
export function configMarkup(cfg: Subshell[]): string {
  return cfg.map((s) => `${s.n}${s.l}^{${s.e}}`).join(' ')
}

const NOBLE = [
  { z: 2, sym: 'He' },
  { z: 10, sym: 'Ne' },
  { z: 18, sym: 'Ar' },
  { z: 36, sym: 'Kr' },
  { z: 54, sym: 'Xe' },
  { z: 86, sym: 'Rn' },
]

/** Noble-gas shorthand, e.g. Na -> "[Ne] 3s^{1}". */
export function shorthandMarkup(z: number): string {
  const core = [...NOBLE].reverse().find((g) => g.z < z)
  if (!core) return configMarkup(electronConfig(z))
  const coreKeys = new Set(electronConfig(core.z).map((s) => `${s.n}${s.l}`))
  const rest = electronConfig(z).filter((s) => !coreKeys.has(`${s.n}${s.l}`) || s.e !== CAPACITY[s.l])
  return `[${core.sym}] ${configMarkup(rest)}`
}

/** Number of valence electrons for main-group elements (outer shell s+p). */
export function valenceElectrons(z: number): number {
  const cfg = electronConfig(z)
  const maxN = Math.max(...cfg.map((s) => s.n))
  return cfg.filter((s) => s.n === maxN && (s.l === 's' || s.l === 'p')).reduce((a, s) => a + s.e, 0)
}
