import { describe, expect, it } from 'vitest'
import { zemepis } from './index'
import { validateLevel } from '../../core/validate'

describe('zemepis content', () => {
  for (const level of zemepis.levels) {
    it(`${level.id} – ${level.title}`, async () => {
      const content = await level.load()
      expect(validateLevel(level, content)).toEqual([])
    })
  }
})
