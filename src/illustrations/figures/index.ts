import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import { FIGURES_L12 } from './l12'
import { FIGURES_L35 } from './l35'
import { FIGURES_L67 } from './l67'
import { FIGURES_L89 } from './l89'

/** All named figures. Each group file is owned by one figure agent. */
export const FIGURE_COMPONENTS: Partial<Record<FigureId, ComponentType>> = {
  ...FIGURES_L12,
  ...FIGURES_L35,
  ...FIGURES_L67,
  ...FIGURES_L89,
}
