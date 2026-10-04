import { describe, expect, it } from 'vitest'
import { FIGURES } from '../catalog'
import { FIGURE_GROUPS, GROUP_FIGURES, type FigureGroup } from './lazy'

describe('lazy figure groups', () => {
  it('every catalog figure belongs to exactly one group', () => {
    const all = Object.values(GROUP_FIGURES).flat()
    expect(new Set(all).size).toBe(all.length)
    expect([...all].sort()).toEqual([...FIGURES].sort())
  })
  for (const g of Object.keys(FIGURE_GROUPS) as FigureGroup[])
    it(`${g}: GROUP_FIGURES matches the group's registry`, async () => {
      const registry = await FIGURE_GROUPS[g]()
      expect(Object.keys(registry).sort()).toEqual([...GROUP_FIGURES[g]].sort())
    })
})
