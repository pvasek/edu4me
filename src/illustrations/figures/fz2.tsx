import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import HeatTransfer from './fz2/HeatTransfer'
import FourStrokeEngine from './fz2/FourStrokeEngine'
import HeatPump from './fz2/HeatPump'
import SoundWave from './fz2/SoundWave'
import EarAnatomy from './fz2/EarAnatomy'
import EchoSonar from './fz2/EchoSonar'
import Eclipses from './fz2/Eclipses'
import MoonPhases from './fz2/MoonPhases'
import ReflectionLaw from './fz2/ReflectionLaw'
import CurvedMirrors from './fz2/CurvedMirrors'
import Refraction from './fz2/Refraction'
import TotalInternalReflection from './fz2/TotalInternalReflection'
import EyeAnatomy from './fz2/EyeAnatomy'
import VisionDefects from './fz2/VisionDefects'
import PrismDispersion from './fz2/PrismDispersion'
import ColorMixing from './fz2/ColorMixing'
import EmSpectrum from './fz2/EmSpectrum'
import FieldLinesCharges from './fz2/FieldLinesCharges'
import ResistanceWire from './fz2/ResistanceWire'
import HomeWiring from './fz2/HomeWiring'
import PnDiode from './fz2/PnDiode'

/** Physics figures (see spec/courses/fyzika/figures.md, section fz2). */
export const FIGURES_FZ2: Partial<Record<FigureId, ComponentType>> = {
  'heat-transfer': HeatTransfer,
  'four-stroke-engine': FourStrokeEngine,
  'heat-pump': HeatPump,
  'sound-wave': SoundWave,
  'ear-anatomy': EarAnatomy,
  'echo-sonar': EchoSonar,
  eclipses: Eclipses,
  'moon-phases': MoonPhases,
  'reflection-law': ReflectionLaw,
  'curved-mirrors': CurvedMirrors,
  refraction: Refraction,
  'total-internal-reflection': TotalInternalReflection,
  'eye-anatomy': EyeAnatomy,
  'vision-defects': VisionDefects,
  'prism-dispersion': PrismDispersion,
  'color-mixing': ColorMixing,
  'em-spectrum': EmSpectrum,
  'field-lines-charges': FieldLinesCharges,
  'resistance-wire': ResistanceWire,
  'home-wiring': HomeWiring,
  'pn-diode': PnDiode,
}
