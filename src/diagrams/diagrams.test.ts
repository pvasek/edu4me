import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { DiagramId } from '../core/types'
import { DIAGRAMS, Diagram } from './index'
import { assignLanes, equivalenceVolume, shellsFor, titrationPH } from './math'

const ALL_IDS: DiagramId[] = [
  'bohr',
  'states',
  'ph-scale',
  'periodic-mini',
  'energy-profile',
  'titration-curve',
  'orbitals',
  'separation',
  'galvanic',
  'rate-curve',
  'lab-safety',
]

const SAMPLE: Partial<Record<DiagramId, Record<string, unknown>[]>> = {
  bohr: [{ z: 11 }, { z: 17, ion: -1 }, { z: 26, ion: 2 }, { z: 118 }],
  states: [{}],
  'ph-scale': [{}, { marks: [{ ph: 7, label: 'voda' }] }, { marks: [] }],
  'periodic-mini': [{}, { highlight: 'groups' }, { highlight: 'blocks' }, { highlight: 'metals' }, { highlight: 'trends' }],
  'energy-profile': [{ kind: 'exo' }, { kind: 'endo', catalyst: true }],
  'titration-curve': [{ kind: 'strong-strong' }, { kind: 'weak-strong' }],
  orbitals: [{ z: 1 }, { z: 8 }, { z: 24 }, { z: 118 }],
  separation: ['filtration', 'distillation', 'chromatography', 'decantation', 'evaporation'].map((method) => ({ method })),
  galvanic: [{}],
  'rate-curve': [{}],
  'lab-safety': [{}],
}

const INVALID: [DiagramId, Record<string, unknown>][] = [
  ['bohr', {}],
  ['bohr', { z: 0 }],
  ['bohr', { z: 'Na' }],
  ['bohr', { z: 8, ion: 9 }],
  ['ph-scale', { marks: 'x' }],
  ['ph-scale', { marks: [{ ph: 20, label: 'x' }] }],
  ['periodic-mini', { highlight: 'colors' }],
  ['energy-profile', {}],
  ['energy-profile', { kind: 'exo', catalyst: 'yes' }],
  ['titration-curve', { kind: 'weak-weak' }],
  ['orbitals', { z: 3.5 }],
  ['separation', { method: 'centrifuge' }],
]

const render = (id: DiagramId, props?: Record<string, unknown>) => renderToStaticMarkup(createElement(Diagram, { id, props }))

describe('diagram registry', () => {
  it('maps every DiagramId to a component', () => {
    expect(Object.keys(DIAGRAMS).sort()).toEqual([...ALL_IDS].sort())
    for (const id of ALL_IDS) expect(typeof DIAGRAMS[id]).toBe('function')
  })

  it('renders every diagram with valid props', () => {
    for (const id of ALL_IDS)
      for (const props of SAMPLE[id] ?? []) {
        const html = render(id, props)
        expect(html, `${id} ${JSON.stringify(props)}`).not.toContain('dg-fallback')
        expect(html).toMatch(/role="(img|group)"/)
        expect(html).toMatch(/aria-label="[^"]{10,}"/)
      }
  })

  it('renders a fallback for invalid props or unknown ids', () => {
    for (const [id, props] of INVALID) expect(render(id, props), `${id} ${JSON.stringify(props)}`).toContain('dg-fallback')
    expect(render('nope' as DiagramId)).toContain('dg-fallback')
  })

  it('shows the right content', () => {
    expect(render('bohr', { z: 11 })).toContain('p⁺ = 11')
    expect(render('bohr', { z: 11 })).toContain('n⁰ = 12')
    expect(render('galvanic')).toContain('1,10 V')
    expect(render('ph-scale')).toContain('čistič odpadů')
    expect(render('orbitals', { z: 8 })).toContain('nepárové elektrony: 2')
    expect(render('lab-safety')).toContain('Nebezpečné pro životní prostředí')
  })
})

describe('shells', () => {
  it('uses the 2-8-8-2 model up to Z = 20', () => {
    expect(shellsFor(1)).toEqual([1])
    expect(shellsFor(11)).toEqual([2, 8, 1])
    expect(shellsFor(11, 1)).toEqual([2, 8])
    expect(shellsFor(17, -1)).toEqual([2, 8, 8])
    expect(shellsFor(20)).toEqual([2, 8, 8, 2])
  })
  it('groups the Aufbau configuration by n for heavier atoms', () => {
    expect(shellsFor(26)).toEqual([2, 8, 14, 2])
    expect(shellsFor(26, 2)).toEqual([2, 8, 14])
    expect(shellsFor(29)).toEqual([2, 8, 18, 1])
    expect(shellsFor(35, -1)).toEqual([2, 8, 18, 8])
    expect(shellsFor(118)?.reduce((a, b) => a + b, 0)).toBe(118)
  })
  it('rejects impossible input', () => {
    expect(shellsFor(0)).toBeNull()
    expect(shellsFor(8, 9)).toBeNull()
  })
})

describe('titration maths', () => {
  it('strong acid + strong base', () => {
    expect(titrationPH('strong-strong', 0)).toBeCloseTo(1, 3)
    expect(titrationPH('strong-strong', equivalenceVolume())).toBeCloseTo(7, 3)
    // 1 cm³ excess NaOH in 51 cm³: pOH = -log(0.1/51)
    expect(titrationPH('strong-strong', 26)).toBeCloseTo(14 + Math.log10(0.1 / 51), 2)
  })
  it('weak acid + strong base', () => {
    expect(titrationPH('weak-strong', 0)).toBeCloseTo(2.88, 1)
    expect(titrationPH('weak-strong', 12.5)).toBeCloseTo(4.76, 1)
    expect(titrationPH('weak-strong', 25)).toBeCloseTo(8.72, 1)
  })
  it('is monotonic', () => {
    for (const kind of ['strong-strong', 'weak-strong'] as const) {
      let prev = -Infinity
      for (let v = 0; v <= 50; v += 0.5) {
        const ph = titrationPH(kind, v)
        expect(ph).toBeGreaterThan(prev)
        prev = ph
      }
    }
  })
})

describe('label lanes', () => {
  it('separates overlapping labels and keeps the rest in lane 0', () => {
    const p = assignLanes(
      [
        { x: 50, w: 60 },
        { x: 60, w: 40 },
        { x: 200, w: 40 },
      ],
      0,
      400,
    )
    expect(p[0].lane).toBe(0)
    expect(p[1].lane).toBe(1)
    expect(p[2].lane).toBe(0)
  })
})
