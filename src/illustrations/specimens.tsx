import type { ComponentType } from 'react'
import type { SpecimenId } from './catalog'
import { Specimen } from './figures/l12/kit'
import * as Lab from './figures/l12/LabEquipment'

/** One drawing per specimen id (drawn in the engraving style of the level 1 plates). */
export const SPECIMEN_DRAWINGS: Record<SpecimenId, ComponentType> = {
  beaker: Lab.Beaker,
  'erlenmeyer-flask': Lab.Erlenmeyer,
  'test-tube': Lab.TestTube,
  'graduated-cylinder': Lab.Cylinder,
  pipette: Lab.Pipette,
  burette: Lab.Burette,
  funnel: Lab.Funnel,
  burner: Lab.Burner,
  stand: Lab.Stand,
  mortar: Lab.Mortar,
  'evaporating-dish': Lab.Dish,
  'watch-glass': Lab.WatchGlass,
  'wash-bottle': Lab.WashBottle,
  'test-tube-holder': Lab.TubeHolder,
  'glass-rod': Lab.GlassRod,
  'wire-gauze': Lab.WireGauze,
}

export function SpecimenView({ id }: { id: SpecimenId }) {
  const D = SPECIMEN_DRAWINGS[id]
  return (
    <Specimen>
      <D />
    </Specimen>
  )
}
