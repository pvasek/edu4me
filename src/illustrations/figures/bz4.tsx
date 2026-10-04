import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import DnaReplication from './bz4/DnaReplication'
import GeneticCodeWheel from './bz4/GeneticCodeWheel'
import LacOperon from './bz4/LacOperon'
import StemCells from './bz4/StemCells'
import CancerCellCycle from './bz4/CancerCellCycle'
import DihybridCross from './bz4/DihybridCross'
import PcrElectrophoresis from './bz4/PcrElectrophoresis'
import Crispr from './bz4/Crispr'
import HomeostasisFeedback from './bz4/HomeostasisFeedback'
import OxygenDissociation from './bz4/OxygenDissociation'
import Nephron from './bz4/Nephron'
import Synapse from './bz4/Synapse'
import Sarcomere from './bz4/Sarcomere'
import ImmuneResponse from './bz4/ImmuneResponse'
import XylemPhloem from './bz4/XylemPhloem'
import Tropisms from './bz4/Tropisms'
import Cladogram from './bz4/Cladogram'
import Speciation from './bz4/Speciation'
import HomininTimeline from './bz4/HomininTimeline'
import Biomes from './bz4/Biomes'

/** Biology figures, group bz4 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ4: Partial<Record<FigureId, ComponentType>> = {
  'dna-replication': DnaReplication,
  'genetic-code-wheel': GeneticCodeWheel,
  'lac-operon': LacOperon,
  'stem-cells': StemCells,
  'cancer-cell-cycle': CancerCellCycle,
  'dihybrid-cross': DihybridCross,
  'pcr-electrophoresis': PcrElectrophoresis,
  'crispr': Crispr,
  'homeostasis-feedback': HomeostasisFeedback,
  'oxygen-dissociation': OxygenDissociation,
  'nephron': Nephron,
  'synapse': Synapse,
  'sarcomere': Sarcomere,
  'immune-response': ImmuneResponse,
  'xylem-phloem': XylemPhloem,
  'tropisms': Tropisms,
  'cladogram': Cladogram,
  'speciation': Speciation,
  'hominin-timeline': HomininTimeline,
  'biomes': Biomes,
}
