import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { zemepis } from '../../courses/zemepis'
import { GEOGRAPHY_LABELS, GeographyVignette } from './GeographyVignette'
import { LevelVignette } from './LevelVignette'

describe('geography level vignettes', () => {
  it('has a Czech label for each of the 12 levels', () => {
    expect(GEOGRAPHY_LABELS).toHaveLength(12)
    expect(zemepis.levels).toHaveLength(12)
    zemepis.levels.forEach((l, i) => {
      expect(GEOGRAPHY_LABELS[i].startsWith(`${l.title}:`), l.title).toBe(true)
      expect(GEOGRAPHY_LABELS[i].length, l.title).toBeGreaterThan(40)
    })
  })

  it('renders all 12 scenes as labelled engraved plates', () => {
    const seen = new Set<string>()
    for (const l of zemepis.levels) {
      const html = renderToStaticMarkup(createElement(GeographyVignette, { level: l.number, size: 132, color: l.color }))
      expect(html).toContain('role="img"')
      expect(html).toContain(`aria-label="${GEOGRAPHY_LABELS[l.number - 1]}"`)
      expect(GEOGRAPHY_LABELS[l.number - 1]).toMatch(/[áčďéěíňóřšťúůýž]/i)
      expect(html).toContain('viewBox="0 0 200 200"')
      expect(html).toContain(l.color)
      expect(html.length, `level ${l.number}`).toBeGreaterThan(2000)
      expect(html).not.toMatch(/NaN|undefined/)
      seen.add(html.replace(/id="[^"]*"|url\(#[^)]*\)/g, ''))
    }
    expect(seen.size).toBe(12)
  })

  it('uses theme tokens rather than fixed ink colours', () => {
    for (const l of zemepis.levels) {
      const html = renderToStaticMarkup(createElement(GeographyVignette, { level: l.number, color: l.color }))
      const hex = new Set(html.match(/#[0-9a-f]{6}\b/gi) ?? [])
      hex.delete(l.color)
      hex.delete('#fffaf0') // PAPER: snow, highlights, white signs
      expect([...hex], `level ${l.number}`).toEqual([])
    }
  })

  it('LevelVignette delegates to the geography scenes', () => {
    const html = renderToStaticMarkup(createElement(LevelVignette, { course: 'zemepis', level: 9 }))
    expect(html).toContain(`aria-label="${GEOGRAPHY_LABELS[8]}"`)
    expect(html).toContain(zemepis.levels[8].color)
  })
})
