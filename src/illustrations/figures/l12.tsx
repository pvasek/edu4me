import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import BunsenBurner from './l12/BunsenBurner'
import LabEquipment from './l12/LabEquipment'

/** Figures for levels 1–2 (engraved technical plates, see spec/illustration-guide.md). */
export const FIGURES_L12: Partial<Record<FigureId, ComponentType>> = {
  'lab-equipment': LabEquipment,
  'bunsen-burner': BunsenBurner,
}
