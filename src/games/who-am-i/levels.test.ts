import { describe, expect, it } from 'vitest'
import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { parseFormula } from '../../courses/chemie/data/formula'
import { normalize } from '../shared/util'
import { GAME_BY_ID } from '../registry'
import { COMPOUNDS, LEVELS, type Subject } from './levels'
import { answerOptions, matchAnswer, pickSubjects, suggestAnswers } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const levels = Object.keys(LEVELS).map(Number)

/** Does `text` give away one of the subject's names? */
function leaks(s: Subject, raw: string): string | null {
  const text = normalize(raw.replace(/\$/g, ''))
  const names = [s.name, ...(s.aliases ?? [])].map(normalize)
  for (const n of names) {
    if (!n.includes(' ') && n.length > 4) {
      if (new RegExp(`(^|[^a-z])${n.slice(0, -1)}`).test(text)) return n
    } else if (new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z])`).test(text)) return n
    // "kyselina octová": the distinctive word must not appear either
    const words = n.split(' ').filter((w) => w.length > 4 && !['kyselina', 'kyseliny', 'vitamin', 'vitamín'].includes(w))
    if (n.includes(' ')) for (const w of words) if (text.includes(w.slice(0, -1))) return w
  }
  // the shell names "(K, L, M, N)" are not the symbol of potassium
  const noShells = raw.replace(/\([KLMN](, [KLMN])*\)|vrstvě K/g, '')
  if (s.kind === 'element' && new RegExp(`(^|[^A-Za-z])${s.id}(?![a-z])`).test(noShells)) return s.id
  return null
}

describe('who-am-i level sets', () => {
  it('has a set for every level listed in the registry', () => {
    expect(levels).toEqual(Object.keys(GAME_BY_ID['who-am-i'].levels).map(Number))
  })

  for (const lv of levels) {
    describe(`level ${lv}`, () => {
      const set = LEVELS[lv]
      it('has at least 15 distinct subjects with 5 hints each', () => {
        expect(set.length).toBeGreaterThanOrEqual(15)
        expect(new Set(set.map((s) => s.id)).size).toBe(set.length)
        for (const s of set) {
          expect(s.hints, s.name).toHaveLength(5)
          for (const h of s.hints) {
            expect(h.label.length).toBeGreaterThan(0)
            expect(h.text.length).toBeGreaterThan(4)
          }
          expect(new Set(s.hints.map((h) => h.text)).size).toBe(5)
        }
      })
      it('hints never contain the answer’s name', () => {
        for (const s of set) for (const h of s.hints) expect(leaks(s, h.text), `${s.name}: ${h.text}`).toBeNull()
      })
      it('generates a round of 5 different subjects with 4 answer options', () => {
        for (let seed = 1; seed <= 20; seed++) {
          const r = pickSubjects(lv, 5, rng(seed))
          expect(r).toHaveLength(5)
          expect(new Set(r.map((x) => x.subject.id)).size).toBe(5)
          for (const x of r) {
            expect(x.level).toBe(lv)
            const opts = answerOptions(x, rng(seed))
            expect(opts).toHaveLength(4)
            expect(new Set(opts.map((o) => o.id)).size).toBe(4)
            expect(opts.filter((o) => o.id === x.subject.id)).toHaveLength(1)
          }
        }
      })
      it('accepts the typed answer without diacritics', () => {
        for (const s of set) {
          const plain = normalize(s.name)
          expect(matchAnswer(plain, s.kind)?.id, s.name).toBe(s.id)
          expect(suggestAnswers(plain.slice(0, Math.max(2, plain.length - 2)), s.kind).map((a) => a.id), s.name).toContain(s.id)
        }
      })
    })
  }

  it('element levels guess elements, levels 8 and 9 compounds', () => {
    for (const lv of [2, 3, 7]) for (const s of LEVELS[lv]) expect(BY_SYMBOL[s.id]?.name).toBe(s.name)
    for (const lv of [8, 9]) for (const s of LEVELS[lv]) expect(s.kind).toBe('compound')
  })

  it('level 2 hints describe particles correctly', () => {
    const cl = LEVELS[2].find((s) => s.id === 'Cl')!.hints.map((h) => h.text)
    expect(cl).toContain('Mám 7 valenčních elektronů.')
    expect(cl).toContain('Elektrony mám ve 3 vrstvách (K, L, M): 2, 8, 7.')
    expect(cl).toContain('V jádře mého nejběžnějšího izotopu je 18 neutronů.')
    expect(cl).toContain('Najdeš mě ve 3. periodě a 17. skupině, mám protonové číslo 17.')
  })

  it('level 3 bond types follow the ΔX limits from lesson l3-1', () => {
    const bond = (id: string) => LEVELS[3].find((s) => s.id === id)!.hints[1].text
    expect(bond('Na')).toBe('S chlorem tvořím vazbu iontovou (ΔX = 2,23).')
    expect(bond('H')).toBe('S chlorem tvořím vazbu polární kovalentní (ΔX = 0,96).')
    expect(bond('Br')).toContain('nepolární')
  })

  it('compound formulas are valid', () => {
    for (const s of COMPOUNDS) {
      expect(s.formula, s.name).toBeDefined()
      if (!s.formula!.startsWith('$')) continue
      const f = s.formula!.replace(/\$/g, '').replace(/_\{n\}/, '').replace(/-/g, '')
      expect(() => parseFormula(f), s.name).not.toThrow()
    }
    expect(parseFormula('C2H5OH')).toEqual({ C: 2, H: 6, O: 1 })
  })

  it('matches aliases and trivial names', () => {
    expect(matchAnswer('acetylen', 'compound')?.id).toBe('ethyn')
    expect(matchAnswer('hroznovy cukr', 'compound')?.id).toBe('glukoza')
    expect(matchAnswer('KYSELINA OCTOVA', 'compound')?.id).toBe('kyselina-octova')
    expect(matchAnswer('dna', 'compound')?.id).toBe('dna')
    expect(matchAnswer('sodik', 'element')?.id).toBe('Na')
    expect(suggestAnswers('gly', 'compound').map((a) => a.id)).toEqual(expect.arrayContaining(['glycerol', 'glycin', 'glykogen']))
  })

  it('mixes all levels without a level or with an unsupported one', () => {
    for (const lv of [undefined, 4]) {
      const r = pickSubjects(lv, 5, rng(2))
      expect(r).toHaveLength(5)
      expect(new Set(r.map((x) => x.level)).size).toBe(5)
    }
  })
})
