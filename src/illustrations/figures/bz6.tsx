import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import SpongeFlow from './bz6/SpongeFlow'
import StarfishFeet from './bz6/StarfishFeet'
import SkinSection from './bz6/SkinSection'
import NeuronStructure from './bz6/NeuronStructure'
import ReproductiveOrgans from './bz6/ReproductiveOrgans'
import MillerUrey from './bz6/MillerUrey'
import Twins from './bz6/Twins'

/** Biology figures, group bz6 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ6: Partial<Record<FigureId, ComponentType>> = {
  'sponge-flow': SpongeFlow,
  'starfish-feet': StarfishFeet,
  'skin-section': SkinSection,
  'neuron-structure': NeuronStructure,
  'reproductive-organs': ReproductiveOrgans,
  'miller-urey': MillerUrey,
  'twins': Twins,
}
