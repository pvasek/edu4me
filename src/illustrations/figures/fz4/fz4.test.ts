import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_FZ4 } from '../fz4'

const MINE = [
  'gas-molecules-pressure',
  'heat-engine-cycle',
  'stress-strain',
  'surface-tension',
  'phase-diagram',
  'parallel-plate-field',
  'capacitor',
  'lorentz-force',
  'mass-spectrometer',
  'faraday-lenz',
  'em-wave',
  'double-slit',
  'diffraction-grating',
  'polarization',
  'light-clock',
  'photoelectric-effect',
  'energy-levels',
  'laser-cavity',
  'binding-energy',
  'standard-model',
  'hr-diagram',
  'big-bang-timeline',
] as const

describe('physics figures fz4 (levels 10–12)', () => {
  it('registers exactly the fz4 figure ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_FZ4).sort()).toEqual([...MINE].sort())
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id)
      expect(typeof FIGURES_FZ4[id]).toBe('function')
    }
  })

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_FZ4[id]!))
      expect(html).toContain('<svg')
      expect(html).toContain('role="img"')
      // the image description (a StepFilm's buttons carry short labels of their own)
      const m = /role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/.exec(html)
      const label = m?.[1] ?? m?.[2] ?? ''
      expect(label.length).toBeGreaterThan(40)
      // Czech description (diacritics present)
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/)
      // no NaN / undefined leaked into the drawing
      expect(html).not.toMatch(/NaN|undefined|Infinity/)
    })
  }
})
