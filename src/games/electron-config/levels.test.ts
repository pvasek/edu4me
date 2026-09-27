import { describe, expect, it } from 'vitest'
import { BY_Z } from '../../courses/chemie/data/elements'
import { CAPACITY, configMarkup, electronConfig } from '../../courses/chemie/data/electronConfig'
import { mainIonCharge } from '../periodic-find/levels'
import { GAME_BY_ID } from '../registry'
import { LEVELS } from './levels'
import {
  electronsOf,
  emptyFilling,
  keyOf,
  pickTargets,
  sameAsNoble,
  solution,
  subshellsFor,
  targetConfig,
  targetShorthand,
  validateFilling,
  type EcTarget,
  type Filling,
  type Orbital,
} from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const cfgText = (t: EcTarget) => configMarkup(targetConfig(t))
const full: Orbital = ['u', 'd']
/** Fill a target's board from a {subshell: electrons} map, Hund-style. */
function fillFrom(t: EcTarget, counts: Record<string, number>): Filling {
  return emptyFilling(t).map((s) => {
    const e = counts[keyOf(s)] ?? 0
    const k = s.orbitals.length
    return { ...s, orbitals: s.orbitals.map((_, i) => (i < e - k ? full : i < e ? ['u'] : [])) as Orbital[] }
  })
}

describe('electron-config level sets', () => {
  it('has a set for every level listed in the registry', () => {
    expect(Object.keys(LEVELS)).toEqual(Object.keys(GAME_BY_ID['electron-config'].levels))
  })

  for (const [lv, set] of Object.entries(LEVELS)) {
    it(`level ${lv}: every target validates against electronConfig`, () => {
      expect(set.length).toBeGreaterThanOrEqual(10)
      for (const t of set) {
        const cfg = targetConfig(t)
        expect(cfg.reduce((a, s) => a + s.e, 0), `${t.z}${t.charge}`).toBe(electronsOf(t))
        for (const s of cfg) expect(s.e).toBeLessThanOrEqual(CAPACITY[s.l])
        if (!t.charge) expect(cfg).toEqual(electronConfig(t.z))
        const shown = subshellsFor(t).map(keyOf)
        for (const s of cfg) expect(shown).toContain(keyOf(s))
        expect(validateFilling(t, solution(t)), `${t.z}${t.charge}`).toEqual({ ok: true })
        expect(validateFilling(t, emptyFilling(t)).ok).toBe(false)
      }
    })
  }

  it('level 2 is atoms with Z ≤ 20', () => {
    for (const t of LEVELS[2]) {
      expect(t.charge ?? 0).toBe(0)
      expect(t.z).toBeLessThanOrEqual(20)
    }
  })

  it('level 3 ions of main-group elements reach a noble-gas configuration', () => {
    for (const t of LEVELS[3]) {
      expect(t.charge).toBe(mainIonCharge(BY_Z[t.z]))
      expect(cfgText(t)).toBe(configMarkup(electronConfig(electronsOf(t))))
      expect(sameAsNoble(t), t.name).not.toBeNull()
      expect(t.name).toMatch(/^(kation \S+ý|\S+ový anion)$/)
    }
    const na = LEVELS[3].find((t) => t.z === 11)!
    expect(targetShorthand(na)).toBe('[He] 2s^{2} 2p^{6}')
    const cl = LEVELS[3].find((t) => t.z === 17)!
    expect(targetShorthand(cl)).toBe('[Ne] 3s^{2} 3p^{6}')
  })

  it('level 7: transition metals, their ions (4s empties first) and the Cr/Cu exceptions', () => {
    const find = (z: number, q = 0) => LEVELS[7].find((t) => t.z === z && (t.charge ?? 0) === q)!
    for (const t of LEVELS[7]) expect(t.z >= 21 && t.z <= 30).toBe(true)
    expect(targetShorthand(find(26, 2))).toBe('[Ar] 3d^{6}')
    expect(targetShorthand(find(26, 3))).toBe('[Ar] 3d^{5}')
    expect(targetShorthand(find(29, 2))).toBe('[Ar] 3d^{9}')
    expect(targetShorthand(find(29, 1))).toBe('[Ar] 3d^{10}')
    expect(targetShorthand(find(30, 2))).toBe('[Ar] 3d^{10}')
    expect(targetShorthand(find(24, 3))).toBe('[Ar] 3d^{3}')
    expect(targetShorthand(find(22, 4))).toBe('[Ne] 3s^{2} 3p^{6}')
    expect(find(24).bonus && find(29).bonus).toBe(true)
    expect(LEVELS[7].filter((t) => t.bonus).map((t) => t.z).sort()).toEqual([24, 29])
    for (const t of LEVELS[7].filter((x) => x.charge)) expect(targetConfig(t).some((s) => s.n === 4)).toBe(false)
  })

  it('explains that 4s empties first when an ion is filled like an atom', () => {
    const fe2: EcTarget = LEVELS[7].find((t) => t.z === 26 && t.charge === 2)!
    const likeAtom = fillFrom(fe2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 4 })
    const v = validateFilling(fe2, likeAtom)
    expect(v.ok || v.rule).toBe('ion')
    const right = fillFrom(fe2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '3d': 6 })
    expect(validateFilling(fe2, right).ok).toBe(true)
    const cr = LEVELS[7].find((t) => t.z === 24 && !t.charge)!
    const plain = fillFrom(cr, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 4 })
    expect(validateFilling(cr, plain).ok || (validateFilling(cr, plain) as { rule: string }).rule).toBe('exception')
  })

  it('counts the ion’s electrons, not the atom’s', () => {
    const o2 = LEVELS[3].find((t) => t.z === 8)!
    const v = validateFilling(o2, fillFrom(o2, { '1s': 2, '2s': 2, '2p': 4 }))
    expect(v.ok || v.rule).toBe('count')
    expect(!v.ok && v.message).toContain('10')
  })

  for (const lv of [2, 3, 7]) {
    it(`level ${lv}: generates rounds of 4 distinct targets`, () => {
      for (let s = 1; s <= 30; s++) {
        const r = pickTargets(lv, rng(s))
        expect(r).toHaveLength(4)
        expect(new Set(r.map((t) => `${t.z}|${t.charge}`)).size).toBe(4)
        for (const t of r) expect(LEVELS[lv]).toContain(t)
      }
    })
  }

  it('level 7 rounds end with the Cr/Cu bonus; mixed rounds cover all levels', () => {
    expect(pickTargets(7, rng(3))[3].bonus).toBe(true)
    for (const lv of [undefined, 5]) {
      const r = pickTargets(lv, rng(4))
      expect(r).toHaveLength(4)
      expect(LEVELS[2]).toContain(r[0])
      expect(LEVELS[3]).toContain(r[1])
      expect(LEVELS[7]).toContain(r[2])
      expect(r[3].bonus).toBe(true)
    }
  })
})
