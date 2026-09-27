import { it, expect } from 'vitest'
import { FIGURES } from '../catalog'
import { FIGURE_COMPONENTS } from '.'
it('all figures implemented', () => {
  const missing = FIGURES.filter((f) => !FIGURE_COMPONENTS[f])
  expect(missing).toEqual([])
})
