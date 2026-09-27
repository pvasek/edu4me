import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AdditionMechanism from './l89/AdditionMechanism'
import Esterification from './l89/Esterification'
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
}
