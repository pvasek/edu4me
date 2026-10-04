import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import { FIGURES_L12 } from './l12'
import { FIGURES_L35 } from './l35'
import { FIGURES_L67 } from './l67'
import { FIGURES_L89 } from './l89'
import { FIGURES_FZ1 } from './fz1'
import { FIGURES_FZ2 } from './fz2'
import { FIGURES_FZ3 } from './fz3'
import { FIGURES_FZ4 } from './fz4'
import { FIGURES_BZ1 } from './bz1'
import { FIGURES_BZ2 } from './bz2'
import { FIGURES_BZ3 } from './bz3'
import { FIGURES_BZ4 } from './bz4'
import { FIGURES_BZ5 } from './bz5'
import { FIGURES_BZ6 } from './bz6'
import { FIGURES_BZ7 } from './bz7'
import { FIGURES_BZ8 } from './bz8'
import { FIGURES_GZ1 } from './gz1'
import { FIGURES_GZ2 } from './gz2'
import { FIGURES_GZ3 } from './gz3'
import { FIGURES_GZ4 } from './gz4'
import { FIGURES_GZ5 } from './gz5'
import { FIGURES_GZ6 } from './gz6'
import { FIGURES_GZ7 } from './gz7'

/** All named figures, imported eagerly: for tests only. The app loads groups lazily (lazy.ts). Each group file is owned by one figure agent. */
export const FIGURE_COMPONENTS: Partial<Record<FigureId, ComponentType>> = {
  ...FIGURES_L12,
  ...FIGURES_L35,
  ...FIGURES_L67,
  ...FIGURES_L89,
  // physics
  ...FIGURES_FZ1,
  ...FIGURES_FZ2,
  ...FIGURES_FZ3,
  ...FIGURES_FZ4,
  // biology
  ...FIGURES_BZ1,
  ...FIGURES_BZ2,
  ...FIGURES_BZ3,
  ...FIGURES_BZ4,
  ...FIGURES_BZ5,
  ...FIGURES_BZ6,
  ...FIGURES_BZ7,
  ...FIGURES_BZ8,
  // geography
  ...FIGURES_GZ1,
  ...FIGURES_GZ2,
  ...FIGURES_GZ3,
  ...FIGURES_GZ4,
  ...FIGURES_GZ5,
  ...FIGURES_GZ6,
  ...FIGURES_GZ7,
}
