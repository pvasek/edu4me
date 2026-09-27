import { useId } from 'react'
import type { ChemIcon } from './catalog'
import { ICON_PATHS, type IconShape } from './icon-paths'

const SOFT_OPACITY = 0.2

/**
 * Engraving-style line icon (24×24 grid, `currentColor`).
 * Every id in `CHEM_ICONS` has a drawing in `icon-paths.ts`.
 */
export function ChemIconView({ name, size = 24, className }: { name: ChemIcon; size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const shapes = ICON_PATHS[name] ?? ICON_PATHS.question
  const hatchId = `ih${uid}`
  const usesHatch = shapes.some((s) => typeof s !== 'string' && s.f === 'hatch')
  return (
    <svg
      className={className ? `chem-icon ${className}` : 'chem-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-icon={name}
    >
      {usesHatch && (
        <defs>
          <pattern id={hatchId} width="2.3" height="2.3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="2.3" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.75" />
          </pattern>
        </defs>
      )}
      {shapes.map((s, i) => renderShape(typeof s === 'string' ? { d: s } : s, i, hatchId))}
    </svg>
  )
}

function renderShape(s: IconShape, key: number, hatchId: string) {
  const props: Record<string, string | number | undefined> = { transform: s.tr }
  if (s.f === 'soft') {
    props.fill = 'currentColor'
    props.fillOpacity = SOFT_OPACITY
    if (!s.s) props.stroke = 'none'
  } else if (s.f === 'solid') {
    props.fill = 'currentColor'
    if (!s.s) props.stroke = 'none'
  } else if (s.f === 'hatch') {
    props.fill = `url(#${hatchId})`
    if (!s.s) props.stroke = 'none'
  }
  if (s.w !== undefined) props.strokeWidth = s.w
  if (s.dash) props.strokeDasharray = s.dash
  if (s.c) return <circle key={key} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} {...props} />
  if (s.e) return <ellipse key={key} cx={s.e[0]} cy={s.e[1]} rx={s.e[2]} ry={s.e[3]} {...props} />
  return <path key={key} d={s.d} {...props} />
}
