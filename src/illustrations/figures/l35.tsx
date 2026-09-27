import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import IonicLattice from './l35/IonicLattice'
import VseprShapes from './l35/VseprShapes'

/** Figures for levels 3–5 (bonding, reactions & calculations, acids & bases). */
export const FIGURES_L35: Partial<Record<FigureId, ComponentType>> = {
  'vsepr-shapes': VseprShapes,
  'ionic-lattice': IonicLattice,
}
