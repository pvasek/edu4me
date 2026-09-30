import { describe, expect, it } from 'vitest'
import { fyzika } from './index'
import { validateLevel } from '../../core/validate'

describe('fyzika content', () => {
  for (const level of fyzika.levels) {
    it(`${level.id} – ${level.title}`, async () => {
      const content = await level.load()
      expect(validateLevel(level, content)).toEqual([])
    })
  }
})
