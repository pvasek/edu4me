import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import BunsenBurner from './l12/BunsenBurner'
import HeatingTestTube from './l12/HeatingTestTube'
import LabEquipment from './l12/LabEquipment'
import Meniscus from './l12/Meniscus'
import MixtureTypes from './l12/MixtureTypes'

/** Figures for levels 1–2 (engraved technical plates, see spec/illustration-guide.md). */
export const FIGURES_L12: Partial<Record<FigureId, ComponentType>> = {
  'lab-equipment': LabEquipment,
  'bunsen-burner': BunsenBurner,
  'heating-test-tube': HeatingTestTube,
  meniscus: Meniscus,
  'mixture-types': MixtureTypes,
}
