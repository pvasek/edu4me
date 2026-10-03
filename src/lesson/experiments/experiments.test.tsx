import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EXPERIMENTS } from './catalog'
import { EXPERIMENT_COMPONENTS } from '.'

describe('experiments', () => {
  it('every catalog id has a component', () => {
    expect(EXPERIMENTS.filter((id) => !EXPERIMENT_COMPONENTS[id])).toEqual([])
  })
  for (const id of EXPERIMENTS)
    it(`${id} renders with a Czech label`, async () => {
      const mod = await import(`./${id}.tsx`)
      const html = renderToStaticMarkup(createElement(mod.default))
      expect(html).toMatch(/role="img"/)
      expect(html).toMatch(/aria-label="[^"]*[áčďéěíňóřšťúůýž][^"]*"/)
    })
})
