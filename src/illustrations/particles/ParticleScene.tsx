import type { ParticleBox } from '../../core/types'

/** STUB – replaced by the molecule agent. */
export function ParticleScene({ boxes }: { boxes: ParticleBox[]; arrows?: boolean }) {
  return <div className="mono">{boxes.map((b) => b.label).join(' | ')}</div>
}
