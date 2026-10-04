import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { ClimatePlace, PyramidSpec } from '../../core/types'
import { ClimateView } from './ClimateView'
import { PyramidView } from './PyramidView'
import { ageLabels, climateAxes, climateLabel, climateStats, czn, isDryMonth, precipUnits, pyramidAxis, pyramidStats, unitsToPrecip } from './charts'

// ČHMÚ normal 1991–2020 (Klementinum) and Jakutsk 1991–2020, as in the climate-chart game data
const praha: ClimatePlace = {
  name: 'Praha-Klementinum',
  temp: [1.8, 2.9, 6.5, 11.7, 16.2, 19.7, 21.6, 21.1, 16.2, 11, 6.3, 2.8],
  precip: [18.1, 16.2, 26.3, 24.7, 58.1, 68.6, 67.4, 61.9, 33.9, 29.8, 26.2, 22.6],
  source: 'normál 1991–2020',
}
const jakutsk: ClimatePlace = {
  name: 'Jakutsk',
  altitude: 98,
  temp: [-36.9, -32.9, -19.1, -3.7, 8, 17, 19.9, 15.6, 6.4, -6.9, -25.9, -37],
  precip: [10, 9, 6, 8, 20, 30, 40, 37, 30, 19, 17, 9],
}
const bombaj: ClimatePlace = {
  name: 'Bombaj',
  temp: [24.6, 25.3, 27.6, 28.8, 30.2, 29.3, 27.9, 27.8, 27.9, 29, 28, 25.8],
  precip: [0.2, 0.2, 0.1, 0.1, 7.3, 526.3, 919.9, 560.8, 383.5, 91.3, 11, 1.6],
}

const svgLabels = (html: string) => {
  expect(html).toContain('role="img"')
  expect(html).not.toMatch(/NaN|undefined|Infinity/)
  return [...html.matchAll(/aria-label="([^"]+)"/g)].map((m) => m[1])
}

describe('Czech numbers', () => {
  it('uses a decimal comma, a real minus and spaces in thousands', () => {
    expect(czn(10.43, 1)).toBe('10,4')
    expect(czn(-5)).toBe('−5')
    expect(czn(-0.04, 1)).toBe('0,0')
    expect(czn(2362)).toBe('2 362')
    expect(czn(486)).toBe('486')
  })
})

describe('klimatogram helpers', () => {
  it('computes the yearly mean, total, extremes and range', () => {
    const s = climateStats(praha)
    expect(s.meanT).toBe(11.5)
    expect(s.totalP).toBe(454)
    expect(s.warmest).toBe(6)
    expect(s.coldest).toBe(0)
    expect(s.range).toBe(19.8)
    expect(s.wettest).toBe(5)
    expect(s.driest).toBe(1)
  })
  it('marks dry months with the Walter–Lieth rule P < 2T', () => {
    expect(isDryMonth(20, 30)).toBe(true)
    expect(isDryMonth(20, 50)).toBe(false)
    expect(isDryMonth(-5, 0)).toBe(false)
    expect(climateStats(bombaj).dry).toEqual([true, true, true, true, true, false, false, false, false, false, true, true])
    expect(climateStats(jakutsk).dryCount).toBe(1) // June: 30 mm < 2 × 17 °C
  })
  it('compresses precipitation above 100 mm ten times', () => {
    expect(precipUnits(40)).toBe(20)
    expect(precipUnits(100)).toBe(50)
    expect(precipUnits(300)).toBe(60)
    for (const p of [0, 35, 100, 260, 900]) expect(unitsToPrecip(precipUnits(p))).toBeCloseTo(p)
  })
  it('extends the axis below zero and above for big bars', () => {
    const a = climateAxes([jakutsk])
    expect(a.lo).toBe(-40)
    expect(a.tHi).toBe(20)
    expect(a.top).toBe(20)
    expect(a.tTicks).toEqual([-40, -30, -20, -10, 0, 10, 20])
    expect(a.compressed).toBe(false)
    const b = climateAxes([bombaj])
    expect(b.lo).toBe(0)
    expect(b.tHi).toBe(40)
    expect(b.top).toBe(100) // 920 mm → 50 + 820/20 = 91 → 100
    expect(b.pTicks.at(-1)).toEqual([100, 1100])
    expect(b.compressed).toBe(true)
    // two places share the axes
    expect(climateAxes([praha, jakutsk])).toMatchObject({ lo: -40, tHi: 30 })
  })
  it('describes the chart in Czech', () => {
    const l = climateLabel(praha)
    expect(l).toContain('Klimatogram Praha-Klementinum')
    expect(l).toContain('průměrná roční teplota 11,5 °C')
    expect(l).toContain('roční srážky 454 mm')
    expect(l).toContain('nejteplejší červenec (21,6 °C)')
  })
})

describe('pyramid helpers', () => {
  // 18 groups: 0–14 = 50 %, 15–64 = 49 %, 65+ = 1 %
  const half = [10, 8, 7, 6, 5, 4, 3, 2, 1.5, 1, 1, 0.5, 0.5, 0.2, 0.1, 0.1, 0.05, 0.05]
  const young: PyramidSpec = { label: 'A', male: half, female: half }
  it('labels the age groups with an open last group', () => {
    expect(ageLabels(5, 18)[0]).toBe('0–4')
    expect(ageLabels(5, 18)[17]).toBe('85+')
    expect(ageLabels(10, 9)).toEqual(['0–9', '10–19', '20–29', '30–39', '40–49', '50–59', '60–69', '70–79', '80+'])
  })
  it('computes shares and the dependency ratio', () => {
    const s = pyramidStats(young, 5)
    expect(s.young).toBe(50)
    expect(s.old).toBe(1)
    expect(s.work).toBe(49)
    expect(s.dependency).toBeCloseTo((51 / 49) * 100, 1)
    expect(s.largest).toBe(0)
  })
  it('gives two pyramids one symmetric % axis', () => {
    const a = pyramidAxis([young, { male: [3, 4, 4.2], female: [3, 4, 4] }])
    expect(a.max).toBe(10)
    expect(a.ticks[0]).toBe(0)
    expect(a.ticks.at(-1)).toBe(10)
    expect(pyramidAxis([{ male: [3, 4, 4.2], female: [3, 4, 4] }]).max).toBe(6)
  })
})

describe('renderers', () => {
  it('draws one and two klimatogramy with labels, legend and source', () => {
    const one = renderToStaticMarkup(<ClimateView places={[praha]} />)
    const [label] = svgLabels(one)
    expect(label).toContain('Klimatogram Praha-Klementinum')
    expect(one).toContain('XII')
    expect(one).toContain('Zdroj: normál 1991–2020')
    expect(one).toContain('454\u00a0mm')
    expect(one).not.toContain('suché období') // no dry month at Klementinum
    expect(renderToStaticMarkup(<ClimateView places={[bombaj]} />)).toContain('suché období')
    const two = renderToStaticMarkup(<ClimateView places={[jakutsk, bombaj]} names={['Místo A', 'Místo B']} stats={false} dry={false} />)
    const labels = svgLabels(two).filter((l) => l.startsWith('Klimatogram'))
    expect(labels).toHaveLength(2)
    expect(labels[0]).toContain('Místo A')
    expect(two).not.toContain('Jakutsk')
    expect(two).toContain('10× zhuštěné')
    expect(two).not.toContain('suché období')
    expect(two).toContain('−40')
  })
  it('draws one and two pyramids', () => {
    const cz: PyramidSpec = {
      label: 'Česko 2023',
      source: 'OSN, WPP 2024',
      male: [2.54, 2.72, 2.71, 2.72, 2.53, 2.7, 3.41, 3.51, 3.75, 4.43, 3.69, 3.16, 2.74, 2.76, 2.51, 1.89, 1.0, 0.59],
      female: [2.42, 2.59, 2.57, 2.58, 2.43, 2.56, 3.18, 3.28, 3.5, 4.17, 3.51, 3.1, 2.82, 3.1, 3.14, 2.71, 1.67, 1.32],
    }
    const one = renderToStaticMarkup(<PyramidView step={5} pyramids={[cz]} />)
    const [label] = svgLabels(one)
    expect(label).toContain('Věková pyramida Česko 2023')
    expect(label).toContain('nejpočetnější skupina 45–49 let')
    expect(one).toContain('85+')
    expect(one).toContain('muži')
    expect(one).toContain('ženy')
    const two = renderToStaticMarkup(<PyramidView step={5} pyramids={[cz, { ...cz, label: 'Jiný' }]} />)
    expect(svgLabels(two).filter((l) => l.startsWith('Věková'))).toHaveLength(2)
  })
})
