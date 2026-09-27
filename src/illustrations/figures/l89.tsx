import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import FractionalDistillation from './l89/FractionalDistillation'
import HomologousSeries from './l89/HomologousSeries'

/** Figures for levels 8–9 (organic chemistry, biochemistry, environment). */
export const FIGURES_L89: Partial<Record<FigureId, ComponentType>> = {
  'fractional-distillation': FractionalDistillation,
  'homologous-series': HomologousSeries,
}
