import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_FZ2 } from '../fz2'

const MINE = [
  'heat-transfer',
  'four-stroke-engine',
  'heat-pump',
  'sound-wave',
  'ear-anatomy',
  'echo-sonar',
  'eclipses',
  'moon-phases',
  'reflection-law',
  'curved-mirrors',
  'refraction',
  'total-internal-reflection',
  'eye-anatomy',
  'vision-defects',
  'prism-dispersion',
  'color-mixing',
  'em-spectrum',
  'field-lines-charges',
  'resistance-wire',
  'home-wiring',
  'pn-diode',
] as const

describe('physics figures, levels 4–6 (fz2)', () => {
  it('registers exactly the fz2 figure ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_FZ2).sort()).toEqual([...MINE].sort())
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id)
      expect(typeof FIGURES_FZ2[id]).toBe('function')
    }
  })

  it('draws the four-stroke engine as a step film', () => {
    const html = renderToStaticMarkup(createElement(FIGURES_FZ2['four-stroke-engine']!))
    expect(html).toContain('sf-film')
    expect(html.match(/aria-label="Krok \d"/g)?.length).toBe(4)
  })

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_FZ2[id]!))
      expect(html).toContain('<svg')
      expect(html).toContain('role="img"')
      const m = /role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/.exec(html)
      const label = m?.[1] ?? m?.[2] ?? ''
      expect(label.length).toBeGreaterThan(40)
      expect(label).toMatch(/[áčďéěíňóřšťúůýž]/)
      expect(html).not.toMatch(/NaN|undefined|Infinity/)
    })
  }
})
