import type { MoleculeId } from '../catalog'

/** STUB – replaced by the molecule agent. */
export function MoleculeView({ molecules }: { molecules: MoleculeId[]; labels?: string[] }) {
  return <div className="mono">{molecules.join(', ')}</div>
}
