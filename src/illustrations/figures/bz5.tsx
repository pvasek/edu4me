import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import SizeScale from './bz5/SizeScale'
import VirusStructure from './bz5/VirusStructure'
import WetMount from './bz5/WetMount'
import MicroscopeHistory from './bz5/MicroscopeHistory'
import LifeSigns from './bz5/LifeSigns'
import RootTip from './bz5/RootTip'
import Conifers from './bz5/Conifers'
import CeleryTranspiration from './bz5/CeleryTranspiration'
import MalariaCycle from './bz5/MalariaCycle'
import CarboniferousForest from './bz5/CarboniferousForest'

/** Biology figures, group bz5 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ5: Partial<Record<FigureId, ComponentType>> = {
  'size-scale': SizeScale,
  'virus-structure': VirusStructure,
  'wet-mount': WetMount,
  'microscope-history': MicroscopeHistory,
  'life-signs': LifeSigns,
  'root-tip': RootTip,
  'conifers': Conifers,
  'celery-transpiration': CeleryTranspiration,
  'malaria-cycle': MalariaCycle,
  'carboniferous-forest': CarboniferousForest,
}
