import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import BondTypeScale from './l35/BondTypeScale'
import HydrogenBonds from './l35/HydrogenBonds'
import IonicLattice from './l35/IonicLattice'
import MetallicBond from './l35/MetallicBond'
import Polarity from './l35/Polarity'
import VseprShapes from './l35/VseprShapes'

/** Figures for levels 3–5 (bonding, reactions & calculations, acids & bases). */
export const FIGURES_L35: Partial<Record<FigureId, ComponentType>> = {
  'vsepr-shapes': VseprShapes,
  'ionic-lattice': IonicLattice,
  'metallic-bond': MetallicBond,
  'hydrogen-bonds': HydrogenBonds,
  'bond-type-scale': BondTypeScale,
  polarity: Polarity,
}
