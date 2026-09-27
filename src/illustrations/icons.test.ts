import { describe, expect, it } from 'vitest'
import { CHEM_ICONS } from './catalog'
import { ICON_PATHS } from './icon-paths'

describe('chem icons', () => {
  it('every catalog id has a drawing', () => {
    const missing = CHEM_ICONS.filter((id) => !ICON_PATHS[id] || ICON_PATHS[id].length === 0)
    expect(missing).toEqual([])
  })

  it('has no drawings outside the catalog', () => {
    const known = new Set<string>(CHEM_ICONS)
    expect(Object.keys(ICON_PATHS).filter((id) => !known.has(id))).toEqual([])
  })

  it('every shape has geometry', () => {
    for (const id of CHEM_ICONS) {
      for (const s of ICON_PATHS[id]) {
        if (typeof s === 'string') expect(s.length, id).toBeGreaterThan(3)
        else expect(Boolean(s.d || s.c || s.e), id).toBe(true)
      }
    }
  })
})
