import { Component, type ComponentType, type ReactNode } from 'react'
import type { DiagramId } from '../core/types'
import Bohr from './Bohr'
import EnergyProfile from './EnergyProfile'
import Galvanic from './Galvanic'
import LabSafety from './LabSafety'
import Orbitals from './Orbitals'
import PeriodicMini from './PeriodicMini'
import PhScale from './PhScale'
import RateCurve from './RateCurve'
import Separation from './Separation'
import States from './States'
import TitrationCurve from './TitrationCurve'
import { Fallback, type DiagramProps } from './util'
import { FIGURE_COMPONENTS } from '../illustrations/figures'
import './diagrams.css'

/** One component per diagram id (see DiagramId in src/core/types.ts). */
/** Parametrised diagrams; named figures come from src/illustrations/figures. */
export const DIAGRAMS: Partial<Record<DiagramId, ComponentType<DiagramProps>>> = {
  bohr: Bohr,
  states: States,
  'ph-scale': PhScale,
  'periodic-mini': PeriodicMini,
  'energy-profile': EnergyProfile,
  'titration-curve': TitrationCurve,
  orbitals: Orbitals,
  separation: Separation,
  galvanic: Galvanic,
  'rate-curve': RateCurve,
  'lab-safety': LabSafety,
}

class Guard extends Component<{ id: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error(`Diagram "${this.props.id}" failed to render`, error)
  }
  render() {
    return this.state.failed ? <Fallback id={this.props.id} /> : this.props.children
  }
}

/**
 * Renders a lesson diagram. The lesson renderer wraps it in a <figure> with
 * the caption. Unknown ids or invalid props render a small fallback note.
 */
export function Diagram({ id, props }: { id: DiagramId; props?: Record<string, unknown> }) {
  const Fig = Object.prototype.hasOwnProperty.call(FIGURE_COMPONENTS, id) ? FIGURE_COMPONENTS[id as keyof typeof FIGURE_COMPONENTS] : undefined
  if (Fig)
    return (
      <Guard id={id} key={id}>
        <Fig />
      </Guard>
    )
  const C = Object.prototype.hasOwnProperty.call(DIAGRAMS, id) ? DIAGRAMS[id] : undefined
  if (!C) return <Fallback id={String(id)} reason="obrázek se připravuje" />
  const safe = props && typeof props === 'object' && !Array.isArray(props) ? props : {}
  return (
    <Guard id={id} key={id}>
      <C props={safe} />
    </Guard>
  )
}

export default Diagram
