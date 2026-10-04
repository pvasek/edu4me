import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import AnimalSymmetry from './bz2/AnimalSymmetry'
import CnidarianHydra from './bz2/CnidarianHydra'
import TapewormCycle from './bz2/TapewormCycle'
import MolluscGroups from './bz2/MolluscGroups'
import EarthwormSoil from './bz2/EarthwormSoil'
import ArthropodGroups from './bz2/ArthropodGroups'
import InsectMetamorphosis from './bz2/InsectMetamorphosis'
import HoneybeeColony from './bz2/HoneybeeColony'
import VertebrateEvolution from './bz2/VertebrateEvolution'
import FishAnatomy from './bz2/FishAnatomy'
import FrogMetamorphosis from './bz2/FrogMetamorphosis'
import AmnioticEgg from './bz2/AmnioticEgg'
import BirdFlight from './bz2/BirdFlight'
import MammalTeeth from './bz2/MammalTeeth'
import HumanSkeleton from './bz2/HumanSkeleton'
import HeartCirculation from './bz2/HeartCirculation'
import LungsAlveoli from './bz2/LungsAlveoli'
import DigestiveSystem from './bz2/DigestiveSystem'
import ReflexArc from './bz2/ReflexArc'
import UrinarySystem from './bz2/UrinarySystem'
import HumanDevelopment from './bz2/HumanDevelopment'

/** Biology figures, group bz2 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ2: Partial<Record<FigureId, ComponentType>> = {
  'animal-symmetry': AnimalSymmetry,
  'cnidarian-hydra': CnidarianHydra,
  'tapeworm-cycle': TapewormCycle,
  'mollusc-groups': MolluscGroups,
  'earthworm-soil': EarthwormSoil,
  'arthropod-groups': ArthropodGroups,
  'insect-metamorphosis': InsectMetamorphosis,
  'honeybee-colony': HoneybeeColony,
  'vertebrate-evolution': VertebrateEvolution,
  'fish-anatomy': FishAnatomy,
  'frog-metamorphosis': FrogMetamorphosis,
  'amniotic-egg': AmnioticEgg,
  'bird-flight': BirdFlight,
  'mammal-teeth': MammalTeeth,
  'human-skeleton': HumanSkeleton,
  'heart-circulation': HeartCirculation,
  'lungs-alveoli': LungsAlveoli,
  'digestive-system': DigestiveSystem,
  'reflex-arc': ReflexArc,
  'urinary-system': UrinarySystem,
  'human-development': HumanDevelopment,
}
