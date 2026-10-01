import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { fyzika } from '../../courses/fyzika'
import { PHYSICS_LABELS, PhysicsVignette } from './PhysicsVignette'
import { LevelVignette } from './LevelVignette'

describe('physics level vignettes', () => {
  it('has a Czech label for each of the 12 levels', () => {
    expect(PHYSICS_LABELS).toHaveLength(12)
    expect(fyzika.levels).toHaveLength(12)
    fyzika.levels.forEach((l, i) => expect(PHYSICS_LABELS[i].startsWith(l.title), l.title).toBe(true))
  })

  it('renders all 12 scenes as labelled engraved plates', () => {
    const seen = new Set<string>()
    for (const l of fyzika.levels) {
      const html = renderToStaticMarkup(createElement(PhysicsVignette, { level: l.number, size: 132, color: l.color }))
      expect(html).toContain('role="img"')
      expect(html).toContain(`aria-label="${PHYSICS_LABELS[l.number - 1]}"`)
      expect(PHYSICS_LABELS[l.number - 1]).toMatch(/[áčďéěíňóřšťúůýž]/i)
      expect(html).toContain('viewBox="0 0 200 200"')
      expect(html.length, `level ${l.number}`).toBeGreaterThan(2000)
      expect(html).not.toMatch(/NaN|undefined/)
      seen.add(html.replace(/pi|pl|px/g, ''))
    }
    expect(seen.size).toBe(12)
  })

  it('LevelVignette delegates to the physics scenes', () => {
    const html = renderToStaticMarkup(createElement(LevelVignette, { course: 'fyzika', level: 5 }))
    expect(html).toContain(`aria-label="${PHYSICS_LABELS[4]}"`)
  })
})
