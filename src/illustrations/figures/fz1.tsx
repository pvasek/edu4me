import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import ArchimedesPrinciple from './fz1/ArchimedesPrinciple'
import Barometer from './fz1/Barometer'
import BrownianMotion from './fz1/BrownianMotion'
import CenterOfGravity from './fz1/CenterOfGravity'
import DensityColumn from './fz1/DensityColumn'
import DisplacementVolume from './fz1/DisplacementVolume'
import EarthMagnetism from './fz1/EarthMagnetism'
import Electroscope from './fz1/Electroscope'
import FloatSink from './fz1/FloatSink'
import HydraulicPress from './fz1/HydraulicPress'
import HydrostaticPressure from './fz1/HydrostaticPressure'
import LeverTypes from './fz1/LeverTypes'
import MagnetField from './fz1/MagnetField'
import MeasuringInstruments from './fz1/MeasuringInstruments'
import PendulumEnergy from './fz1/PendulumEnergy'
import PulleySystems from './fz1/PulleySystems'
import ThermalExpansion from './fz1/ThermalExpansion'
import ThermometerScales from './fz1/ThermometerScales'
import VernierCaliper from './fz1/VernierCaliper'

/** Physics figures of levels 1–3 (see spec/courses/fyzika/figures.md, section fz1). */
export const FIGURES_FZ1: Partial<Record<FigureId, ComponentType>> = {
  'measuring-instruments': MeasuringInstruments,
  'vernier-caliper': VernierCaliper,
  'displacement-volume': DisplacementVolume,
  'density-column': DensityColumn,
  'brownian-motion': BrownianMotion,
  'thermometer-scales': ThermometerScales,
  'thermal-expansion': ThermalExpansion,
  electroscope: Electroscope,
  'magnet-field': MagnetField,
  'earth-magnetism': EarthMagnetism,
  'center-of-gravity': CenterOfGravity,
  'lever-types': LeverTypes,
  'pulley-systems': PulleySystems,
  'hydraulic-press': HydraulicPress,
  'hydrostatic-pressure': HydrostaticPressure,
  'archimedes-principle': ArchimedesPrinciple,
  'float-sink': FloatSink,
  barometer: Barometer,
  'pendulum-energy': PendulumEnergy,
}
