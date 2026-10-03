import type { Block } from '../../core/types'

type BiologyBlockData = Extract<Block, { type: 'punnett' | 'pedigree' }>

/** Parametric biology drawings (Punnett squares, pedigrees). Placeholder until drawn. */
export function BiologyBlock({ block }: { block: BiologyBlockData }) {
  return <div role="img" aria-label={block.type === 'punnett' ? `Křížení ${block.parents.join(' × ')}` : 'Rodokmen'} />
}
