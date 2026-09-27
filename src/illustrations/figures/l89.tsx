import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AdditionMechanism from './l89/AdditionMechanism'
import Esterification from './l89/Esterification'
import GlucoseRing from './l89/GlucoseRing'
import PhotosynthesisRespiration from './l89/PhotosynthesisRespiration'
import LipidBilayer from './l89/LipidBilayer'
import PeptideBond from './l89/PeptideBond'
import ProteinStructure from './l89/ProteinStructure'
import DnaHelix from './l89/DnaHelix'
import EnzymeLockKey from './l89/EnzymeLockKey'
import GreenhouseEffect from './l89/GreenhouseEffect'
import ProteinSynthesis from './l89/ProteinSynthesis'
import FractionalDistillation from './l89/FractionalDistillation'
import HomologousSeries from './l89/HomologousSeries'
import Isomers from './l89/Isomers'
import Micelle from './l89/Micelle'
import PolymerChain from './l89/PolymerChain'
import SubstitutionMechanism from './l89/SubstitutionMechanism'

/** Figures for levels 8–9 (organic chemistry, biochemistry, environment). */
export const FIGURES_L89: Partial<Record<FigureId, ComponentType>> = {
  'fractional-distillation': FractionalDistillation,
  'homologous-series': HomologousSeries,
  isomers: Isomers,
  'addition-mechanism': AdditionMechanism,
  'substitution-mechanism': SubstitutionMechanism,
  'polymer-chain': PolymerChain,
  esterification: Esterification,
  micelle: Micelle,
  'glucose-ring': GlucoseRing,
  'photosynthesis-respiration': PhotosynthesisRespiration,
  'peptide-bond': PeptideBond,
  'protein-structure': ProteinStructure,
  'lipid-bilayer': LipidBilayer,
  'enzyme-lock-key': EnzymeLockKey,
  'dna-helix': DnaHelix,
  'protein-synthesis': ProteinSynthesis,
  'greenhouse-effect': GreenhouseEffect,
}
