import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AcidRain from './l35/AcidRain'
import BondTypeScale from './l35/BondTypeScale'
import ConservationOfMass from './l35/ConservationOfMass'
import Dilution from './l35/Dilution'
import HydrogenBonds from './l35/HydrogenBonds'
import Hybridization from './l35/Hybridization'
import IndicatorColors from './l35/IndicatorColors'
import IonicLattice from './l35/IonicLattice'
import LimitingReagent from './l35/LimitingReagent'
import MetallicBond from './l35/MetallicBond'
import MoleBridge from './l35/MoleBridge'
import MoleScale from './l35/MoleScale'
import Neutralization from './l35/Neutralization'
import Polarity from './l35/Polarity'
import ReactionTypes from './l35/ReactionTypes'
import Resonance from './l35/Resonance'
import SaltPreparation from './l35/SaltPreparation'
import VseprShapes from './l35/VseprShapes'

/** Engraved figures for levels 3–5 (bonding, reactions & calculations, acids & bases). */
export const FIGURES_L35: Partial<Record<FigureId, ComponentType>> = {
  // bonding (level 3)
  'vsepr-shapes': VseprShapes,
  'ionic-lattice': IonicLattice,
  'metallic-bond': MetallicBond,
  'hydrogen-bonds': HydrogenBonds,
  'bond-type-scale': BondTypeScale,
  polarity: Polarity,
  hybridization: Hybridization,
  resonance: Resonance,
  // reactions & calculations (level 4)
  'conservation-of-mass': ConservationOfMass,
  'mole-bridge': MoleBridge,
  'mole-scale': MoleScale,
  dilution: Dilution,
  'limiting-reagent': LimitingReagent,
  'reaction-types': ReactionTypes,
  // acids & bases (level 5)
  neutralization: Neutralization,
  'indicator-colors': IndicatorColors,
  'acid-rain': AcidRain,
  'salt-preparation': SaltPreparation,
}
