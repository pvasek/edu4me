import { describe, expect, it } from 'vitest'
import { BY_SYMBOL, ELEMENTS } from '../../courses/chemie/data/elements'
import { normalize } from '../shared/util'
import { GAME_BY_ID } from '../registry'
import { LEVELS, type FindPrompt } from './levels'
import { makeLevelRounds } from './logic'

function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const levels = Object.keys(LEVELS).map(Number)

/** The answer's name (or its stem for longer names) must not appear in the clue. */
function leaks(p: FindPrompt): boolean {
  const name = normalize(BY_SYMBOL[p.answer].name)
  const stem = name.length > 4 ? name.slice(0, -1) : name
  const text = normalize(p.text.replace(/\$/g, ''))
  const symbol = new RegExp(`(^|[^A-Za-z])${p.answer}(?![a-z])`)
  return text.includes(stem) || symbol.test(p.text)
}

describe('periodic-find level sets', () => {
  it('has a set for every level listed in the registry', () => {
    expect(levels).toEqual(Object.keys(GAME_BY_ID['periodic-find'].levels).map(Number))
  })

  for (const lv of levels) {
    describe(`level ${lv}`, () => {
      const set = LEVELS[lv]
      it('is rich enough for varied replays', () => {
        expect(set.length).toBeGreaterThanOrEqual(25)
        expect(new Set(set.map((p) => p.answer)).size).toBeGreaterThanOrEqual(15)
        expect(new Set(set.map((p) => `${p.kind}|${p.text}`)).size).toBe(set.length)
      })
      it('names real elements', () => {
        for (const p of set) expect(BY_SYMBOL[p.answer], p.text).toBeDefined()
      })
      it('every checkable clue resolves to exactly one element', () => {
        for (const p of set.filter((x) => x.test)) {
          expect(ELEMENTS.filter(p.test!).map((e) => e.symbol), p.text).toEqual([p.answer])
        }
      })
      it('clues never give away the name or symbol', () => {
        for (const p of set.filter((x) => x.kind === 'hint')) expect(leaks(p), `${p.answer}: ${p.text}`).toBe(false)
      })
      it('generates a round of 10 distinct elements from the set', () => {
        for (let s = 1; s <= 20; s++) {
          const r = makeLevelRounds(lv, 10, rng(s))
          expect(r).toHaveLength(10)
          expect(new Set(r.map((x) => x.el.z)).size).toBe(10)
          for (const x of r) {
            expect(x.level).toBe(lv)
            expect(set.some((p) => p.answer === x.el.symbol && p.text === x.text)).toBe(true)
          }
        }
      })
    })
  }

  it('level 2 is fully data-checked and mixes names, symbols and clues', () => {
    expect(LEVELS[2].filter((p) => p.kind === 'hint' && !p.test)).toEqual([])
    const r = makeLevelRounds(2, 10, rng(7))
    expect(r.filter((x) => x.kind === 'name')).toHaveLength(3)
    expect(r.filter((x) => x.kind === 'symbol')).toHaveLength(2)
    expect(r.filter((x) => x.kind === 'hint')).toHaveLength(5)
    for (const x of r) expect(x.el.z <= 20 || ['Fe', 'Cu', 'Zn', 'Br', 'Ag', 'I', 'Au', 'Hg', 'Pb'].includes(x.el.symbol)).toBe(true)
  })

  it('level 3 clues are almost all checkable against the element data', () => {
    const set = LEVELS[3]
    expect(set.filter((p) => p.test).length / set.length).toBeGreaterThan(0.9)
  })

  it('writes the spec examples', () => {
    const texts = (lv: number) => LEVELS[lv].map((p) => `${p.answer}: ${p.text}`)
    expect(texts(2)).toContain('Mg: Prvek s protonovým číslem 12')
    expect(texts(2)).toContain('Mg: Prvek ve 3. periodě a 2. skupině')
    expect(texts(2)).toContain('Ne: Vzácný plyn ve 2. periodě')
    expect(texts(2)).toContain('P: Prvek s 5 valenčními elektrony ve 3. periodě')
    expect(texts(3)).toContain('F: Nejelektronegativnější prvek')
    expect(texts(7)).toContain('N: Plyn, který tvoří 78 % vzduchu')
    expect(texts(9)).toContain('Mg: Prvek ve středu chlorofylu')
  })

  it('mixes all levels without a level or with an unsupported one', () => {
    for (const lv of [undefined, 5, 8]) {
      const r = makeLevelRounds(lv, 10, rng(11))
      expect(r).toHaveLength(10)
      expect(new Set(r.map((x) => x.el.z)).size).toBe(10)
      expect(new Set(r.map((x) => x.level)).size).toBe(levels.length)
    }
  })
})
