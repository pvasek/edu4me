import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { CircuitPart, CircuitSource } from '../../core/types'
import { CircuitView, ForcesView, GraphView, RaysView, WaveView } from '.'
import { circuitClosed, layoutCircuit, wiresClash } from './circuitLayout'
import { resultantOf } from './ForcesView'
import { seriesPath } from './GraphView'
import { czNum, niceStep, overlaps, ticks } from './kit'
import { imageDistance, imageOf, imageWords, magnification } from './rays'

const svgOf = (html: string) => {
  expect(html).toContain('<svg')
  expect(html).toContain('role="img"')
  const label = /aria-label="([^"]+)"/.exec(html)?.[1] ?? ''
  expect(label.length).toBeGreaterThan(30)
  expect(html).not.toMatch(/NaN|undefined|Infinity/)
  return label
}

describe('nice ticks', () => {
  it('picks 1, 2, 2.5, 5 × 10ⁿ steps', () => {
    expect(niceStep(10, 5)).toBe(2)
    expect(niceStep(100, 5)).toBe(20)
    expect(niceStep(1, 4)).toBe(0.25)
    expect(niceStep(30, 6)).toBe(5)
    expect(niceStep(7, 5)).toBe(2)
    expect(niceStep(0.6, 6)).toBeCloseTo(0.1)
    expect(niceStep(1200, 5)).toBe(250)
  })
  it('lists ticks within the range without float noise', () => {
    expect(ticks(0, 1, 0.1)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
    expect(ticks(-5, 12, 5)).toEqual([-5, 0, 5, 10])
    expect(ticks(-0.5, 0.5, 0.25)).toEqual([-0.5, -0.25, 0, 0.25, 0.5])
  })
  it('formats Czech numbers', () => {
    expect(czNum(2.5)).toBe('2,5')
    expect(czNum(-3)).toBe('−3')
    expect(czNum(0.1 + 0.2)).toBe('0,3')
    expect(czNum(12000)).toBe('12 000')
    expect(czNum(1.5, 2)).toBe('1,50')
  })
})

describe('GraphView', () => {
  it('renders axes, series, marks and a legend', () => {
    const html = renderToStaticMarkup(
      <GraphView
        x={{ label: 't', unit: 's', min: 0, max: 10 }}
        y={{ label: 'v', unit: 'm/s', min: 0, max: 20 }}
        series={[
          { label: 'auto', points: [[0, 0], [5, 15], [10, 15]], area: true },
          { label: 'kolo', points: [[0, 5], [10, 5]], style: 'dashed', tone: 'b' },
          { points: [[0, 0], [2, 3], [4, 8], [6, 12], [8, 13], [10, 13.5]], style: 'smooth', tone: 'c' },
        ]}
        marks={[{ x: 5, y: 15, label: 'v_{max}' }, { x: 8, label: 'stop' }, { y: 10, label: 'limit' }]}
      />,
    )
    const label = svgOf(html)
    expect(label).toContain('Graf závislosti v [m/s] na t [s]')
    expect(html).toContain('ph-legend')
    expect(html).toMatch(/<tspan[^>]*font-size="72%"[^>]*>max<\/tspan>/) // v_{max} as a subscript tspan
  })
  it('has decimal commas on ticks', () => {
    const html = renderToStaticMarkup(
      <GraphView x={{ label: 'U', unit: 'V', min: 0, max: 1.5 }} y={{ label: 'I', unit: 'A', min: 0, max: 0.3 }} series={[{ points: [[0, 0], [1.5, 0.3]] }]} />,
    )
    svgOf(html)
    expect(html).toContain('>0,1<')
    expect(html).not.toContain('ph-legend')
  })
  it('smooth series never overshoots monotone data', () => {
    const d = seriesPath([[0, 100], [50, 50], [100, 0], [150, 0], [200, -40]], true)
    const ys = [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[2]))
    expect(Math.max(...ys)).toBeLessThanOrEqual(100)
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-40)
    // the flat piece stays flat
    expect(d).toContain('C116.7 0 133.3 0 150 0')
  })
})

describe('rays math', () => {
  it('convex lens: object at 2F gives a real, inverted image of the same size at 2F', () => {
    const i = imageOf('convex-lens', 10, 20)
    expect(i.ai).toBeCloseTo(20)
    expect(i.m).toBeCloseTo(-1)
    expect(imageWords(i)).toEqual(['skutečný', 'převrácený', 'stejně velký'])
  })
  it('convex lens: between F and 2F → real, inverted, enlarged, beyond 2F', () => {
    const i = imageOf('convex-lens', 10, 15)
    expect(i.ai).toBeCloseTo(30)
    expect(i.m).toBeCloseTo(-2)
    expect(imageWords(i)).toEqual(['skutečný', 'převrácený', 'zvětšený'])
  })
  it('convex lens: far away → real, reduced, near F′', () => {
    const i = imageOf('convex-lens', 10, 100)
    expect(i.ai).toBeCloseTo(11.11, 2)
    expect(imageWords(i)).toEqual(['skutečný', 'převrácený', 'zmenšený'])
  })
  it('convex lens: inside F → virtual, upright, enlarged (magnifying glass)', () => {
    const i = imageOf('convex-lens', 10, 5)
    expect(i.ai).toBeCloseTo(-10)
    expect(i.m).toBeCloseTo(2)
    expect(imageWords(i)).toEqual(['zdánlivý', 'přímý', 'zvětšený'])
  })
  it('convex lens: object in the focus → no image', () => {
    expect(imageDistance(10, 10)).toBe(Infinity)
    expect(imageOf('convex-lens', 10, 10).exists).toBe(false)
    expect(magnification(10, 10)).toBe(Infinity)
  })
  it('concave lens always gives a virtual, upright, reduced image', () => {
    for (const a of [3, 10, 40]) {
      const i = imageOf('concave-lens', 10, a)
      expect(i.ai).toBeLessThan(0)
      expect(imageWords(i)).toEqual(['zdánlivý', 'přímý', 'zmenšený'])
    }
    expect(imageOf('concave-lens', 10, 10).ai).toBeCloseTo(-5)
  })
  it('mirrors', () => {
    const c = imageOf('concave-mirror', 10, 30)
    expect(c.ai).toBeCloseTo(15)
    expect(imageWords(c)).toEqual(['skutečný', 'převrácený', 'zmenšený'])
    const v = imageOf('convex-mirror', 10, 10)
    expect(v.ai).toBeCloseTo(-5)
    expect(imageWords(v)).toEqual(['zdánlivý', 'přímý', 'zmenšený'])
    const p = imageOf('plane-mirror', 0, 7)
    expect(p.ai).toBe(-7)
    expect(p.m).toBe(1)
    expect(imageWords(p)).toEqual(['zdánlivý', 'přímý', 'stejně velký'])
  })
})

describe('RaysView', () => {
  const cases: [Parameters<typeof RaysView>[0], string][] = [
    [{ element: 'convex-lens', focal: 10, object: 20 }, 'stejně velký'],
    [{ element: 'convex-lens', focal: 10, object: 15 }, 'zvětšený'],
    [{ element: 'convex-lens', focal: 10, object: 5 }, 'zdánlivý'],
    [{ element: 'convex-lens', focal: 10, object: 200 }, 'zmenšený'],
    [{ element: 'convex-lens', focal: 10, object: 10.5 }, 'zvětšený'],
    [{ element: 'concave-lens', focal: 10, object: 25 }, 'zdánlivý'],
    [{ element: 'concave-mirror', focal: 10, object: 30 }, 'skutečný'],
    [{ element: 'concave-mirror', focal: 10, object: 6 }, 'zdánlivý'],
    [{ element: 'convex-mirror', focal: 10, object: 20 }, 'zmenšený'],
    [{ element: 'plane-mirror', focal: 0, object: 20, height: 2 }, 'stejně velký'],
  ]
  it.each(cases)('renders %o', (props, word) => {
    const html = renderToStaticMarkup(<RaysView {...props} />)
    const label = svgOf(html)
    expect(label).toContain(word)
    expect(html).toContain('ph-chip')
  })
})

describe('circuit layout', () => {
  const src: CircuitSource = { kind: 'battery', label: 'U = 4,5 V' }
  const check = (parts: CircuitPart[], narrow: boolean) => {
    const lay = layoutCircuit(src, parts, narrow)
    const boxes = [lay.source.box, ...(lay.source.lbox ? [lay.source.lbox] : [])]
    for (const c of lay.comps) {
      if (c.kind !== 'wire') boxes.push(c.box)
      if (c.lbox) boxes.push(c.lbox)
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) expect(overlaps(boxes[i], boxes[j]), `boxes ${i} and ${j} overlap`).toBe(false)
    expect(wiresClash(lay.wires)).toBe(false)
    for (const b of boxes) {
      expect(b.x).toBeGreaterThanOrEqual(lay.box.x - 0.01)
      expect(b.y).toBeGreaterThanOrEqual(lay.box.y - 0.01)
      expect(b.x + b.w).toBeLessThanOrEqual(lay.box.x + lay.box.w + 0.01)
      expect(b.y + b.h).toBeLessThanOrEqual(lay.box.y + lay.box.h + 0.01)
    }
    return lay
  }
  const nested: CircuitPart[] = [
    { kind: 'switch', label: 'S' },
    { kind: 'ammeter' },
    {
      parallel: [
        [{ kind: 'lamp', label: 'Ž_{1}' }],
        [{ kind: 'resistor', label: 'R_{1}' }, { kind: 'led' }, { kind: 'ammeter', label: 'A_{2}' }],
        [{ kind: 'voltmeter', label: 'V' }],
      ],
    },
    { kind: 'fuse', label: 'P' },
    { parallel: [[{ kind: 'motor', label: 'M' }], [{ kind: 'capacitor', label: 'C' }, { kind: 'coil', label: 'L' }], []] },
    { kind: 'rheostat', label: 'R_{2}' },
    { kind: 'ldr', label: 'R_{F}' },
    { kind: 'thermistor', label: 'R_{T}' },
    { kind: 'bell', label: 'Z' },
    { kind: 'diode', label: 'D' },
  ]
  it('lays nested parallel groups without overlaps (wide and narrow)', () => {
    for (const narrow of [false, true]) {
      const lay = check(nested, narrow)
      expect(lay.comps.length).toBe(16)
      const sides = new Set(lay.comps.map((c) => c.side))
      expect(sides.has('top') && sides.has('right')).toBe(true)
      expect(lay.junctions.length).toBe(4 + 4)
      // wraps long series lists so a phone plate is not too wide
      if (narrow) expect(lay.box.w).toBeLessThan(420)
    }
  })
  it('detects crossing wires', () => {
    expect(wiresClash([[[0, 5], [10, 5]], [[5, 0], [5, 10]]])).toBe(true)
    expect(wiresClash([[[0, 0], [10, 0]], [[10, 0], [10, 10]], [[5, 0], [5, 10]]])).toBe(false) // corner + T-junction
    expect(wiresClash([[[0, 0], [10, 0]], [[6, 0], [20, 0]]])).toBe(true)
  })
  it('keeps small circuits on the top side', () => {
    const lay = check([{ kind: 'lamp', label: 'Ž' }], false)
    expect(lay.comps[0].side).toBe('top')
    expect(lay.flows.length).toBe(1)
  })
  it('knows when the circuit is closed', () => {
    expect(circuitClosed(src, [{ kind: 'lamp' }, { kind: 'switch-open' }])).toBe(false)
    expect(circuitClosed(src, [{ parallel: [[{ kind: 'lamp' }, { kind: 'switch-open' }], [{ kind: 'lamp' }]] }])).toBe(true)
    expect(circuitClosed(src, [{ kind: 'capacitor' }])).toBe(false)
    expect(circuitClosed({ kind: 'ac' }, [{ kind: 'capacitor' }])).toBe(true)
  })
  it('renders every symbol', () => {
    const html = renderToStaticMarkup(<CircuitView source={src} parts={nested} />)
    const label = svgOf(html)
    expect(label).toContain('paralelně')
    expect(label).toContain('fotorezistor')
    for (const s of ['cell', 'dc', 'ac'] as const) svgOf(renderToStaticMarkup(<CircuitView source={{ kind: s }} parts={[{ kind: 'lamp' }, { kind: 'switch-open' }]} />))
  })
})

describe('ForcesView', () => {
  it('draws the resultant or equilibrium', () => {
    const r = resultantOf([
      { label: 'F_{1}', angle: 0, size: 3 },
      { label: 'F_{2}', angle: 90, size: 4 },
    ])
    expect(r.size).toBeCloseTo(5)
    expect(r.angle).toBeCloseTo(53.13, 1)
    const bal = resultantOf([
      { label: 'F_{G}', angle: 270, size: 2 },
      { label: 'N', angle: 90, size: 2 },
    ])
    expect(bal.balanced).toBe(true)

    const html = renderToStaticMarkup(
      <ForcesView body="box" surface="ground" forces={[{ label: 'F_{G}', angle: 270, size: 2 }, { label: 'N', angle: 90, size: 2, from: 'bottom' }]} resultant />,
    )
    expect(svgOf(html)).toContain('rovnováze')
    expect(html).toContain('rovnováha')
  })
  it('renders every body and surface', () => {
    const bodies = ['box', 'ball', 'car', 'person', 'point', 'plane', 'boat', 'skydiver', 'lamp', 'satellite'] as const
    const surfaces = ['none', 'ground', 'incline', 'water', 'ceiling'] as const
    bodies.forEach((body, i) => {
      const surface = surfaces[i % surfaces.length]
      const html = renderToStaticMarkup(
        <ForcesView
          body={body}
          surface={surface}
          angle={30}
          resultant
          forces={[
            { label: 'F_{G}', angle: 270, size: 3 },
            { label: 'F_{t}', angle: 30, size: 1.5, from: 'bottom' },
            { label: 'F', angle: 0, size: 2, from: 'right' },
            { label: 'F_{2}', angle: 0, size: 1 },
          ]}
        />,
      )
      const label = svgOf(html)
      expect(label).toContain('Výslednice')
    })
  })
})

describe('WaveView', () => {
  it('renders transverse, longitudinal, standing and a sum', () => {
    const t = renderToStaticMarkup(<WaveView waves={[{ amplitude: 1, wavelength: 4 }]} />)
    expect(svgOf(t)).toContain('vlnová délka λ')
    const l = renderToStaticMarkup(<WaveView kind="longitudinal" waves={[{ amplitude: 1, wavelength: 4 }]} marks={['wavelength']} />)
    svgOf(l)
    expect(l).toContain('zhuštění')
    expect(l).toContain('zředění')
    const s = renderToStaticMarkup(<WaveView kind="standing" waves={[{ amplitude: 1, wavelength: 4 }]} />)
    svgOf(s)
    expect(s).toContain('uzel')
    expect(s).toContain('kmitna')
    const sum = renderToStaticMarkup(
      <WaveView
        sum
        waves={[
          { amplitude: 1, wavelength: 4, label: 'vlna 1' },
          { amplitude: 0.6, wavelength: 4, phase: 0.5, label: 'vlna 2' },
        ]}
      />,
    )
    expect(svgOf(sum)).toContain('interference')
    expect(sum).toContain('ph-wave-sum')
    expect(sum).toContain('ph-legend')
  })
})
