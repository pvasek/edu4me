import type { CSSProperties, ReactNode } from 'react'
import type { ChemIcon } from '../catalog'
import { ChemIconView } from '../ChemIcon'
import '../illustrations.css'

/** Engraved circular medallion holding a ChemIcon, coloured by `--tone` (default: level colour). */
export function Medal({
  icon,
  size = 'md',
  tone,
  children,
}: {
  icon: ChemIcon
  size?: 'sm' | 'md' | 'lg'
  tone?: string
  children?: ReactNode
}) {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 34 : 30
  const style = tone ? ({ '--tone': tone } as CSSProperties) : undefined
  return (
    <span className={`il-medal${size === 'md' ? '' : ` il-medal-${size}`}`} style={style}>
      <ChemIconView name={icon} size={iconSize} />
      {children}
    </span>
  )
}
