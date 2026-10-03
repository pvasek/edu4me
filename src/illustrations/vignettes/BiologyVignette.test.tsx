import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { biologie } from '../../courses/biologie'
import { BIOLOGY_LABELS, BiologyVignette } from './BiologyVignette'
import { LevelVignette } from './LevelVignette'

describe('biology level vignettes', () => {
  it('has a Czech label for each of the 12 levels', () => {
    expect(BIOLOGY_LABELS).toHaveLength(12)
    expect(biologie.levels).toHaveLength(12)
    biologie.levels.forEach((l, i) => expect(BIOLOGY_LABELS[i].startsWith(l.title), l.title).toBe(true))
  })

  it('renders all 12 scenes as labelled engraved plates', () => {
    const seen = new Set<string>()
    for (const l of biologie.levels) {
      const html = renderToStaticMarkup(createElement(BiologyVignette, { level: l.number, size: 132, color: l.color }))
      expect(html).toContain('role="img"')
      expect(html).toContain(`aria-label="${BIOLOGY_LABELS[l.number - 1]}"`)
      expect(BIOLOGY_LABELS[l.number - 1]).toMatch(/[áčďéěíňóřšťúůýž]/i)
      expect(html).toContain('viewBox="0 0 200 200"')
      expect(html.length, `level ${l.number}`).toBeGreaterThan(2000)
      expect(html).not.toMatch(/NaN|undefined/)
      seen.add(html.replace(/bi|bl|bx/g, ''))
    }
    expect(seen.size).toBe(12)
  })

  it('LevelVignette delegates to the biology scenes', () => {
    const html = renderToStaticMarkup(createElement(LevelVignette, { course: 'biologie', level: 12 }))
    expect(html).toContain(`aria-label="${BIOLOGY_LABELS[11]}"`)
  })
})
