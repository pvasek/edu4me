import type { Block } from '../../core/types'
import { PedigreeView } from './PedigreeView'
import { PunnettView } from './PunnettView'

export { PunnettView, punnettLabel } from './PunnettView'
export { PedigreeView, pedigreeLabel } from './PedigreeView'
export { crossOf, gametesOf, genotypeLine, phenotypeLine } from './genetics'
export { pedigreeLayout } from './pedigree'

type BiologyBlockData = Extract<Block, { type: 'punnett' | 'pedigree' }>

/** Parametric biology drawings: the `punnett` and `pedigree` blocks. */
export function BiologyBlock({ block }: { block: BiologyBlockData }) {
  return block.type === 'punnett' ? <PunnettView parents={block.parents} traits={block.traits} /> : <PedigreeView people={block.people} />
}
