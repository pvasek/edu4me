import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { FigureId } from '../../catalog'
import { FIGURES } from '../../catalog'
import { FIGURES_L12 } from '../l12'
import { SOLUBILITY, interp } from './SolubilityCurve'

const IDS: FigureId[] = [
  'lab-equipment',
  'bunsen-burner',
  'heating-test-tube',
  'meniscus',
  'mixture-types',
  'water-treatment',
  'fire-triangle',
  'air-composition',
  'solubility-curve',
  'dissolving',
  'rutherford-experiment',
  'atom-scale',
  'hydrogen-isotopes',
  'half-life',
  'shells-vs-orbitals',
  'orbital-shapes',
]

describe('level 1–2 figures', () => {
  it('registers every id of this group, and only catalog ids', () => {
    for (const id of IDS) {
      expect(FIGURES).toContain(id)
      expect(FIGURES_L12[id], id).toBeTypeOf('function')
    }
    for (const id of Object.keys(FIGURES_L12)) expect(IDS).toContain(id)
  })

  for (const id of IDS) {
    it(`${id} renders an accessible image`, () => {
      const html = renderToStaticMarkup(createElement(FIGURES_L12[id]!))
      expect(html).toContain('role="img"')
      const m = html.match(/role="img"[^>]*aria-label="([^"]+)"|aria-label="([^"]+)"[^>]*role="img"/)
      expect(m, id).not.toBeNull()
      const label = m![1] ?? m![2]
      expect(label.length).toBeGreaterThan(40)
      // Czech label
      expect(label).toMatch(/[áéěíóúůýčďňřšťž]/i)
      // no unresolved values
      expect(html).not.toMatch(/NaN|undefined/)
    })
  }

  it('solubility curve passes exactly through the lesson table', () => {
    expect(interp(SOLUBILITY.kno3, 20)).toBeCloseTo(31.6)
    expect(interp(SOLUBILITY.kno3, 60)).toBeCloseTo(110)
    expect(interp(SOLUBILITY.nacl, 40)).toBeCloseTo(36.6)
    expect(interp(SOLUBILITY.sugar, 100)).toBeCloseTo(487)
    // monotone between points
    for (let t = 0; t < 100; t++) expect(interp(SOLUBILITY.kno3, t + 1)).toBeGreaterThanOrEqual(interp(SOLUBILITY.kno3, t))
  })
})
