import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AirComposition from './l12/AirComposition'
import BunsenBurner from './l12/BunsenBurner'
import Dissolving from './l12/Dissolving'
import FireTriangle from './l12/FireTriangle'
import HeatingTestTube from './l12/HeatingTestTube'
import LabEquipment from './l12/LabEquipment'
import Meniscus from './l12/Meniscus'
import MixtureTypes from './l12/MixtureTypes'
import SolubilityCurve from './l12/SolubilityCurve'
import WaterTreatment from './l12/WaterTreatment'

/** Figures for levels 1–2 (engraved technical plates, see spec/illustration-guide.md). */
export const FIGURES_L12: Partial<Record<FigureId, ComponentType>> = {
  'lab-equipment': LabEquipment,
  'bunsen-burner': BunsenBurner,
  'heating-test-tube': HeatingTestTube,
  meniscus: Meniscus,
  'mixture-types': MixtureTypes,
  'water-treatment': WaterTreatment,
  'fire-triangle': FireTriangle,
  'air-composition': AirComposition,
  'solubility-curve': SolubilityCurve,
  dissolving: Dissolving,
}
