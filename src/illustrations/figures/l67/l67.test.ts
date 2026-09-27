import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_L67 } from '../l67'

const MINE = [
  'redox-transfer',
  'electrolysis',
  'li-ion-battery',
  'fuel-cell',
  'corrosion',
  'hess-cycle',
  'maxwell-boltzmann',
  'equilibrium-seesaw',
  'buffer-action',
  'blast-furnace',
  'haber-process',
  'contact-process',
  'ostwald-process',
  'limestone-cycle',
  'carbon-allotropes',
  'flame-tests',
  'halogen-colors',
  'nitrogen-cycle',
  'carbon-cycle',
  'aluminium-electrolysis',
] as const

describe('level 6–7 figures', () => {
  it('registers exactly the level 6–7 figure ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_L67).sort()).toEqual([...MINE].sort())
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id)
      expect(typeof FIGURES_L67[id]).toBe('function')
    }
  })

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_L67[id]!))
      expect(html).toContain('<svg')
      expect(html).toContain('role="img"')
      const label = /aria-label="([^"]*)"/.exec(html)?.[1] ?? ''
      expect(label.length).toBeGreaterThan(40)
      // Czech description (diacritics present)
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/)
      // no NaN / undefined leaked into the drawing
      expect(html).not.toMatch(/NaN|undefined/)
    })
  }
})
