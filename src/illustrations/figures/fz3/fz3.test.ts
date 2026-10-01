import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_FZ3 } from '../fz3'

const MINE = [
  'oersted',
  'solenoid-field',
  'dc-motor',
  'generator',
  'transformer',
  'power-grid',
  'power-plants',
  'nuclear-reactor',
  'solar-system',
  'seasons',
  'star-life-cycle',
  'projectile-motion',
  'circular-motion',
  'momentum-collision',
  'gravity-field',
  'kepler-orbits',
  'torque-balance',
  'spring-pendulum',
  'interference-ripples',
  'standing-waves',
  'doppler-effect',
] as const

describe('physics figures fz3 (levels 7–9)', () => {
  it('registers exactly the fz3 figure ids, all from the catalog', () => {
    expect(Object.keys(FIGURES_FZ3).sort()).toEqual([...MINE].sort())
    for (const id of MINE) {
      expect(FIGURES as readonly string[]).toContain(id)
      expect(typeof FIGURES_FZ3[id]).toBe('function')
    }
  })

  for (const id of MINE) {
    it(`renders ${id} as an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_FZ3[id]!))
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
