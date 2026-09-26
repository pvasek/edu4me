import { describe, expect, it } from 'vitest'
import { chemie } from './index'
import { validateLevel } from '../../core/validate'

describe('chemie content', () => {
  for (const level of chemie.levels) {
    it(`${level.id} – ${level.title}`, async () => {
      const content = await level.load()
      expect(validateLevel(level, content)).toEqual([])
    })
  }
})
