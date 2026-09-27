import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AirComposition from './l12/AirComposition'
import AtomScale from './l12/AtomScale'
import BunsenBurner from './l12/BunsenBurner'
import Dissolving from './l12/Dissolving'
import FireTriangle from './l12/FireTriangle'
import HalfLife from './l12/HalfLife'
import HeatingCurve from './l12/HeatingCurve'
import HeatingTestTube from './l12/HeatingTestTube'
import HydrogenIsotopes from './l12/HydrogenIsotopes'
import LabEquipment from './l12/LabEquipment'
import Meniscus from './l12/Meniscus'
import MixtureTypes from './l12/MixtureTypes'
import NuclearFission from './l12/NuclearFission'
import OrbitalShapes from './l12/OrbitalShapes'
import RadiationPenetration from './l12/RadiationPenetration'
import RutherfordExperiment from './l12/RutherfordExperiment'
import ShellsVsOrbitals from './l12/ShellsVsOrbitals'
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
  'rutherford-experiment': RutherfordExperiment,
  'atom-scale': AtomScale,
  'hydrogen-isotopes': HydrogenIsotopes,
  'half-life': HalfLife,
  'shells-vs-orbitals': ShellsVsOrbitals,
  'orbital-shapes': OrbitalShapes,
  'radiation-penetration': RadiationPenetration,
  'nuclear-fission': NuclearFission,
  'heating-curve': HeatingCurve,
}
