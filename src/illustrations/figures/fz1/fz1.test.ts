import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_FZ1 } from '../fz1'

const MINE = [
  'measuring-instruments',
  'vernier-caliper',
  'displacement-volume',
  'density-column',
  'brownian-motion',
  'thermometer-scales',
  'thermal-expansion',
  'electroscope',
  'magnet-field',
  'earth-magnetism',
  'center-of-gravity',
  'lever-types',
  'pulley-systems',
  'hydraulic-press',
  'hydrostatic-pressure',
  'archimedes-principle',
  'float-sink',
  'barometer',
  'pendulum-energy',
  'calorimeter-mixing',
] as const

describe('physics figures fz1 (levels 1–3)', () => {
  it('registers exactly the fz1 figure ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_FZ1).sort()).toEqual([...MINE].sort())
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id)
      expect(typeof FIGURES_FZ1[id]).toBe('function')
    }
  })

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_FZ1[id]!))
      expect(html).toContain('<svg')
      expect(html).toContain('role="img"')
      // the image description (a StepFilm's buttons carry short labels of their own)
      const m = /role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/.exec(html)
      const label = m?.[1] ?? m?.[2] ?? ''
      expect(label.length).toBeGreaterThan(40)
      // Czech description (diacritics present)
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/)
      // no NaN / undefined leaked into the drawing
      expect(html).not.toMatch(/NaN|undefined/)
    })
  }
})
