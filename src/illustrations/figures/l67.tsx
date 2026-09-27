import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import RedoxTransfer from './l67/RedoxTransfer'
import Electrolysis from './l67/Electrolysis'

/** Figures for levels 6–7 (engraved technical plates, see ./l67/). */
export const FIGURES_L67: Partial<Record<FigureId, ComponentType>> = {
  'redox-transfer': RedoxTransfer,
  electrolysis: Electrolysis,
}
