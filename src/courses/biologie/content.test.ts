import { describe, expect, it } from 'vitest'
import { biologie } from './index'
import { validateLevel } from '../../core/validate'

describe('biologie content', () => {
  for (const level of biologie.levels) {
    it(`${level.id} – ${level.title}`, async () => {
      const content = await level.load()
      expect(validateLevel(level, content)).toEqual([])
    })
  }
})
