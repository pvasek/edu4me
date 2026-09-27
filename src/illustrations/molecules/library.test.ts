import { describe, expect, it } from 'vitest'
import { MOLECULES } from '../catalog'
import { parseFormula } from '../../courses/chemie/data/formula'
import { chargeOf, findMolecule, getMolecule, signature, stripCharge } from './library'
import { vdist } from './geometry'

function allowed(el: string, charge: number): number[] {
  switch (el) {
    case 'H':
      return [1]
    case 'C':
      return charge ? [3] : [4]
    case 'N':
      return charge > 0 ? [4] : charge < 0 ? [2] : [3]
    case 'O':
      return charge > 0 ? [3] : charge < 0 ? [1] : [2]
    case 'F':
    case 'Cl':
    case 'Br':
    case 'I':
      return [1]
    case 'S':
      return [2, 4, 6]
    case 'P':
      return [3, 5]
    case 'B':
      return [3]
    case 'Be':
      return [2]
    case 'Xe':
      return [2, 4, 6]
    default:
      return []
  }
}

describe('molecule library', () => {
  it.each(MOLECULES.map((id) => [id]))('%s is complete and chemically sane', (id) => {
    const m = getMolecule(id)
    expect(m.name).toBeTruthy()
    // atom counts match the formula
    const want = parseFormula(stripCharge(m.formula))
    const got: Record<string, number> = {}
    for (const a of m.atoms) got[a.el] = (got[a.el] ?? 0) + 1
    expect(got).toEqual(want)
    // net charge matches the formula
    expect(m.charge).toBe(chargeOf(m.formula))
    // valence
    const sum = m.atoms.map(() => 0)
    for (const b of m.bonds) {
      sum[b.a] += b.order
      sum[b.b] += b.order
    }
    m.atoms.forEach((a, i) => {
      const ok = allowed(a.el, a.charge ?? 0).map((v) => v - (a.radical ?? 0))
      expect(ok, `${id}: atom ${i} ${a.el} has bond sum ${sum[i]}`).toContain(sum[i])
    })
    // geometry: bonded 0.7–2.8 Å, non-bonded ≥ 0.9 Å
    const bonded = new Set(m.bonds.map((b) => `${Math.min(b.a, b.b)}-${Math.max(b.a, b.b)}`))
    for (const b of m.bonds) {
      const d = vdist(m.atoms[b.a].p, m.atoms[b.b].p)
      expect(d, `${id}: bond ${b.a}-${b.b}`).toBeGreaterThan(0.7)
      expect(d, `${id}: bond ${b.a}-${b.b}`).toBeLessThan(2.8)
    }
    for (let i = 0; i < m.atoms.length; i++)
      for (let j = i + 1; j < m.atoms.length; j++) {
        if (bonded.has(`${i}-${j}`)) continue
        expect(vdist(m.atoms[i].p, m.atoms[j].p), `${id}: atoms ${i} ${m.atoms[i].el} / ${j} ${m.atoms[j].el}`).toBeGreaterThan(0.9)
      }
  })

  it('cis/trans but-2-ene differ in the methyl distance', () => {
    const d = (id: 'cis-but-2-ene' | 'trans-but-2-ene') => {
      const m = getMolecule(id)
      const cs = m.atoms.map((a, i) => [a, i] as const).filter(([a]) => a.el === 'C')
      const methyls = cs.filter(([, i]) => !m.bonds.some((b) => b.order === 2 && (b.a === i || b.b === i)))
      return vdist(methyls[0][0].p, methyls[1][0].p)
    }
    expect(d('cis-but-2-ene')).toBeLessThan(3.3)
    expect(d('trans-but-2-ene')).toBeGreaterThan(3.7)
  })

  it('finds molecules by id, formula and element counts', () => {
    expect(findMolecule('H2O')?.id).toBe('H2O')
    expect(findMolecule('C2H5OH')?.id).toBe('ethanol')
    expect(findMolecule('C2H6O')?.id).toBe('ethanol')
    expect(findMolecule('C6H12O6')?.id).toBe('glucose')
    expect(findMolecule('SO4^2-')?.id).toBe('SO4^2-')
    expect(findMolecule('H3O^+')?.id).toBe('H3O+')
    expect(findMolecule('OH^-')?.id).toBe('OH-')
    expect(findMolecule('NaCl')).toBeUndefined()
    expect(signature('H3O+')).toBe(signature('H3O^+'))
  })
})
