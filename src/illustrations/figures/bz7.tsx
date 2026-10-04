import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import MitosisStages from './bz7/MitosisStages'
import CellSignalling from './bz7/CellSignalling'
import ForestStoreys from './bz7/ForestStoreys'
import PondZones from './bz7/PondZones'
import WorldPlates from './bz7/WorldPlates'

/** Biology figures, group bz7 – levels 8–9 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ7: Partial<Record<FigureId, ComponentType>> = {
  'forest-storeys': ForestStoreys,
  'pond-zones': PondZones,
  'world-plates': WorldPlates,
  'cell-signalling': CellSignalling,
  'mitosis-stages': MitosisStages,
}
