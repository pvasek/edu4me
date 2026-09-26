import type { ChemIcon } from './catalog'

/** STUB – replaced by the icon agent. */
export function ChemIconView({ name, size = 24, className = '' }: { name: ChemIcon; size?: number; className?: string }) {
  return (
    <svg className={`chem-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" data-icon={name}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
