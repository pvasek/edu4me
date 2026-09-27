import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FIGURES } from '../../catalog'
import { FIGURES_L89 } from '../l89'

/** Figure ids owned by the level 8–9 figure group. */
const IDS = [
  'fractional-distillation',
  'homologous-series',
  'isomers',
  'addition-mechanism',
  'substitution-mechanism',
  'polymer-chain',
  'esterification',
  'micelle',
  'glucose-ring',
  'photosynthesis-respiration',
  'peptide-bond',
  'protein-structure',
  'lipid-bilayer',
  'enzyme-lock-key',
  'dna-helix',
  'protein-synthesis',
  'greenhouse-effect',
  'ozone-layer',
  'plastic-lifecycle',
] as const

describe('level 8–9 figures', () => {
  it('registers every figure of the group and only catalogued ids', () => {
    for (const id of IDS) expect(FIGURES_L89[id], id).toBeTypeOf('function')
    for (const id of Object.keys(FIGURES_L89)) expect(FIGURES as readonly string[]).toContain(id)
    expect(Object.keys(FIGURES_L89).sort()).toEqual([...IDS].sort())
  })

  it.each(IDS)('%s renders on the server with role="img" and a Czech aria-label', (id) => {
    const C = FIGURES_L89[id]!
    const html = renderToStaticMarkup(createElement(C))
    expect(html).toContain('role="img"')
    const label = /aria-label="([^"]+)"/.exec(html)?.[1] ?? ''
    expect(label.length).toBeGreaterThan(60)
    // Czech text: diacritics present
    expect(label).toMatch(/[áčďéěíňóřšťúůýž]/i)
    expect(html).toContain('<svg')
    expect(html).not.toContain('NaN')
  })
})
