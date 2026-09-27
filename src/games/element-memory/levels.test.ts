import { describe, expect, it } from 'vitest'
import { BY_SYMBOL } from '../../courses/chemie/data/elements'
import { GAME_BY_ID } from '../registry'
import { binary, PARTNER, ELEMENT_NOM, type BinaryPartner } from '../shared/nomenclature'
import { LEVELS, MIX } from './levels'
import { dealRound, faceFont, memoryScore, plain, playedLevel } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Identity of a card face: the element tile plus the normalised text. */
const faceKey = (text: string, el?: string) => `${el ?? ''}|${plain(text).toLowerCase()}`

describe('element-memory level sets', () => {
  it('has a set for every level in the registry and nothing else', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(Object.keys(GAME_BY_ID['element-memory'].levels).map(Number).sort())
  })

  for (const [lv, L] of Object.entries(LEVELS)) {
    describe(`L${lv}`, () => {
      it('has at least 16 pairs and rounds of 6–8 pairs', () => {
        expect(L.pairs.length).toBeGreaterThanOrEqual(16)
        expect(L.size).toBeGreaterThanOrEqual(6)
        expect(L.size).toBeLessThanOrEqual(8)
      })
      it('never repeats a card face (on either side), so every match is unambiguous', () => {
        const seen = new Set<string>()
        for (const p of L.pairs) {
          for (const k of [faceKey(p.a, p.el), faceKey(p.b)]) {
            expect(seen.has(k), `duplicate face ${k}`).toBe(false)
            seen.add(k)
          }
        }
      })
      it('uses known element symbols and non-empty texts', () => {
        for (const p of L.pairs) {
          expect(plain(p.a).length).toBeGreaterThan(0)
          expect(plain(p.b).length).toBeGreaterThan(0)
          for (const s of [...(p.syms ?? []), ...(p.el ? [p.el] : [])]) expect(BY_SYMBOL[s], s).toBeDefined()
          if (p.el) expect(p.syms).toContain(p.el)
        }
      })
      it('keeps card texts short enough for a card at 360 px', () => {
        for (const p of L.pairs) {
          for (const t of [p.a, p.b]) {
            expect(plain(t).length, t).toBeLessThanOrEqual(46)
            // cqi = % of card width: long cards are ~100 px wide at 360 px, short ones ~76 px
            expect(faceFont(t), t).toBeGreaterThanOrEqual(L.long ? 12 : 15)
          }
        }
      })
    })
  }

  it('faces stay unique across all levels (mixed rounds)', () => {
    const seen = new Map<string, string>()
    for (const [lv, L] of Object.entries(LEVELS)) {
      for (const p of L.pairs) {
        for (const k of [faceKey(p.a, p.el), faceKey(p.b)]) {
          expect(seen.get(k), `${k} in L${lv} and ${seen.get(k)}`).toBeUndefined()
          seen.set(k, `L${lv}`)
        }
      }
    }
  })

  it('L2 pairs symbols with their Czech names', () => {
    for (const p of LEVELS[2].pairs) {
      expect(p.el).toBe(p.a)
      expect(p.b).toBe(BY_SYMBOL[p.a].name)
    }
  })

  it('L3 names of binary compounds agree with nomenclature.ts', () => {
    let checked = 0
    for (const p of LEVELS[3].pairs) {
      const f = p.a.replace(/\$/g, '')
      const noun = p.b.split(' ')[0]
      const partner = (Object.keys(PARTNER) as BinaryPartner[]).find((k) => PARTNER[k].noun === noun)
      if (!partner) continue // peroxides, carbides and trivial names
      const el = f.match(/^[A-Z][a-z]?/)![0]
      expect(ELEMENT_NOM[el], `stem for ${el}`).toBeDefined()
      const hit = [1, 2, 3, 4, 5, 6, 7, 8].map((ox) => binary(el, ox, partner)).find((c) => c.formula === f)
      expect(hit, `nomenclature cannot build ${f}`).toBeDefined()
      expect(p.b).toBe(hit!.name)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(25)
  })
})

describe('element-memory rounds', () => {
  it('picks the level set from the level id, mix otherwise', () => {
    expect(playedLevel('l5')).toBe(5)
    expect(playedLevel(undefined)).toBeUndefined()
    expect(playedLevel('l1')).toBeUndefined()
    expect(dealRound('l1', rng(3)).level).toBe('mix')
  })

  it('deals complete pairs of the right size for every level', () => {
    for (const [lv, L] of Object.entries(LEVELS)) {
      for (let seed = 1; seed < 20; seed++) {
        const r = dealRound(`l${lv}`, rng(seed))
        expect(r.level).toBe(Number(lv))
        expect(r.cards).toHaveLength(L.size * 2)
        expect(Object.keys(r.pairs)).toHaveLength(L.size)
        for (const key of Object.keys(r.pairs)) {
          expect(r.cards.filter((c) => c.pair === key).map((c) => c.side).sort()).toEqual(['a', 'b'])
        }
        expect(new Set(r.cards.map((c) => c.id)).size).toBe(r.cards.length)
      }
    }
  })

  it('weights level 2 towards tricky symbols', () => {
    const r = dealRound('l2', rng(7))
    const tricky = Object.values(r.pairs).filter((p) => LEVELS[2].prefer!.includes(p.el!))
    expect(tricky.length).toBeGreaterThanOrEqual(3)
  })

  it('mixes levels without clashing elements or topics', () => {
    for (let seed = 1; seed < 60; seed++) {
      const r = dealRound(undefined, rng(seed))
      const ps = Object.values(r.pairs)
      expect(r.level).toBe('mix')
      expect(ps).toHaveLength(MIX.size)
      const levels = new Set(ps.map((p) => p.key.split(':')[0]))
      expect(levels.size).toBe(MIX.size)
      expect(levels.has('8') && levels.has('9')).toBe(false)
      const syms = ps.flatMap((p) => p.syms)
      expect(new Set(syms).size).toBe(syms.length)
    }
  })

  it('scores by moves', () => {
    expect(memoryScore(6, 6)).toBe(100)
    expect(memoryScore(9, 6)).toBe(100)
    expect(memoryScore(11, 6)).toBe(90)
    expect(memoryScore(100, 6)).toBe(10)
  })

  it('strips markup for labels', () => {
    expect(plain('$SO4^{2-}$')).toBe('SO42-')
    expect(plain('*m*(látky)')).toBe('m(látky)')
    expect(faceFont('Na')).toBe(30)
    expect(faceFont('kyselina chlorovodíková')).toBeLessThan(13)
  })
})
