import { describe, expect, it } from 'vitest'
import { GAME_BY_ID } from '../registry'
import { ITEMS, LEVELS, MIX_PLAN, labelOf, planFor } from './data'
import { buildRounds } from './rounds'

describe('functional groups: levels', () => {
  it('has a content plan for exactly the registry levels', () => {
    expect(Object.keys(LEVELS).map(Number).sort()).toEqual(Object.keys(GAME_BY_ID['functional-groups'].levels).map(Number).sort())
  })

  it('unsupported level or free play mixes', () => {
    expect(planFor(undefined)).toBe(MIX_PLAN)
    expect(planFor(3)).toBe(MIX_PLAN)
  })

  it('L8 has no biomolecules, L9 is mostly biomolecules', () => {
    for (let i = 0; i < 20; i++) {
      const l8 = buildRounds(8)
      expect(l8).toHaveLength(10)
      expect(l8.some((r) => r.item.kind === 'bio')).toBe(false)
      const l9 = buildRounds(9)
      expect(l9).toHaveLength(10)
      expect(l9.filter((r) => r.item.kind === 'bio').length).toBeGreaterThanOrEqual(8)
      expect(l9.some((r) => r.item.kind === 'example')).toBe(false)
      const mix = buildRounds(undefined)
      expect(mix).toHaveLength(10)
      expect(mix.some((r) => r.item.kind === 'bio')).toBe(true)
      expect(mix.some((r) => r.item.kind === 'example')).toBe(true)
    }
  })

  it('every round has 4 distinct options containing the answer', () => {
    for (const lv of [8, 9, undefined]) {
      for (const r of buildRounds(lv)) {
        expect(new Set(r.options).size).toBe(4)
        expect(r.options).toContain(r.item.answer)
        expect(new Set(r.options.map(labelOf)).size).toBe(4)
      }
    }
  })

  it('item ids are unique', () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length)
  })
})
