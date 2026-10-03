import { describe, expect, it } from 'vitest'
import { ISO, LYSIS_VOLUME, osmosis, relVolume, tonicity } from './osmosis-cell.model'

describe('osmosis-cell model', () => {
  it('about 0,9 % NaCl is isotonic, less is hypotonic, more hypertonic', () => {
    expect(tonicity(ISO)).toBe('iso')
    expect(tonicity(0.85)).toBe('iso')
    expect(tonicity(0.95)).toBe('iso')
    expect(tonicity(0.8)).toBe('hypo')
    expect(tonicity(0)).toBe('hypo')
    expect(tonicity(1)).toBe('hyper')
    expect(tonicity(3)).toBe('hyper')
  })
  it('water flows towards the saltier side', () => {
    expect(osmosis('rbc', 0.3).water).toBe('in')
    expect(osmosis('rbc', 0.9).water).toBe('none')
    expect(osmosis('plant', 2).water).toBe('out')
  })
  it('volume follows Boyle–van ’t Hoff: smaller in hypertonic, larger in hypotonic', () => {
    expect(relVolume('rbc', 0.9)).toBe(1)
    expect(relVolume('rbc', 1.8)).toBeCloseTo(0.4 + 0.6 * 0.5)
    expect(relVolume('rbc', 0.6)).toBeGreaterThan(1)
    expect(relVolume('rbc', 0)).toBe(Infinity)
  })
  it('a red blood cell swells, bursts below about 0,4 %, or crenates', () => {
    expect(osmosis('rbc', 0.9).state).toBe('normal')
    expect(osmosis('rbc', 0.6).state).toBe('swollen')
    expect(osmosis('rbc', 0.45).state).toBe('swollen')
    expect(osmosis('rbc', 0.4).state).toBe('lysis')
    expect(osmosis('rbc', 0).state).toBe('lysis')
    expect(osmosis('rbc', 0).volume).toBe(LYSIS_VOLUME)
    expect(osmosis('rbc', 2).state).toBe('crenated')
  })
  it('a plant cell never bursts: turgor, flaccid, plasmolysis', () => {
    expect(osmosis('plant', 0)).toMatchObject({ state: 'turgid', volume: 1 })
    expect(osmosis('plant', 0.9).state).toBe('flaccid')
    const p = osmosis('plant', 2.5)
    expect(p.state).toBe('plasmolysis')
    expect(p.volume).toBeLessThan(0.6)
  })
})
