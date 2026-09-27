import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES, type FigureId } from '../../catalog'
import { FIGURE_COMPONENTS } from '../index'
import { FIGURES_L35 } from '../l35'

const IDS: FigureId[] = [
  'vsepr-shapes',
  'ionic-lattice',
  'metallic-bond',
  'hydrogen-bonds',
  'bond-type-scale',
  'polarity',
  'hybridization',
  'resonance',
  'conservation-of-mass',
  'mole-bridge',
  'mole-scale',
  'dilution',
  'limiting-reagent',
  'reaction-types',
  'neutralization',
  'indicator-colors',
  'acid-rain',
  'salt-preparation',
]

describe('level 3–5 figures', () => {
  it('registers exactly the level 3–5 ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_L35).sort()).toEqual([...IDS].sort())
    for (const id of IDS) {
      expect((FIGURES as readonly string[]).includes(id)).toBe(true)
      expect(typeof FIGURES_L35[id]).toBe('function')
      expect(FIGURE_COMPONENTS[id]).toBe(FIGURES_L35[id])
    }
  })

  for (const id of IDS) {
    it(`${id} renders an accessible svg`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_L35[id]!))
      expect(html).toContain('<svg')
      expect(html).toContain('role="img"')
      const labels = [...html.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1])
      expect(labels.length).toBeGreaterThan(0)
      for (const l of labels) {
        expect(l.length).toBeGreaterThan(40)
        // Czech description
        expect(l).toMatch(/[áčďéěíňóřšťúůýž]/)
      }
      expect(html).not.toMatch(/\bNaN\b/)
      expect(html).not.toContain('undefined')
    })
  }
})
