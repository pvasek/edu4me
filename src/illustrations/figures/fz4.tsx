import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import GasMoleculesPressure from './fz4/GasMoleculesPressure'
import HeatEngineCycle from './fz4/HeatEngineCycle'
import StressStrain from './fz4/StressStrain'
import SurfaceTension from './fz4/SurfaceTension'
import PhaseDiagram from './fz4/PhaseDiagram'
import ParallelPlateField from './fz4/ParallelPlateField'
import Capacitor from './fz4/Capacitor'
import LorentzForce from './fz4/LorentzForce'
import MassSpectrometer from './fz4/MassSpectrometer'
import FaradayLenz from './fz4/FaradayLenz'
import EmWave from './fz4/EmWave'
import DoubleSlit from './fz4/DoubleSlit'
import DiffractionGrating from './fz4/DiffractionGrating'
import Polarization from './fz4/Polarization'
import LightClock from './fz4/LightClock'
import PhotoelectricEffect from './fz4/PhotoelectricEffect'
import EnergyLevels from './fz4/EnergyLevels'
import LaserCavity from './fz4/LaserCavity'
import BindingEnergy from './fz4/BindingEnergy'
import StandardModel from './fz4/StandardModel'
import HrDiagram from './fz4/HrDiagram'
import BigBangTimeline from './fz4/BigBangTimeline'

/** Physics figures (see spec/courses/fyzika/figures.md, section fz4). */
export const FIGURES_FZ4: Partial<Record<FigureId, ComponentType>> = {
  'gas-molecules-pressure': GasMoleculesPressure,
  'heat-engine-cycle': HeatEngineCycle,
  'stress-strain': StressStrain,
  'surface-tension': SurfaceTension,
  'phase-diagram': PhaseDiagram,
  'parallel-plate-field': ParallelPlateField,
  capacitor: Capacitor,
  'lorentz-force': LorentzForce,
  'mass-spectrometer': MassSpectrometer,
  'faraday-lenz': FaradayLenz,
  'em-wave': EmWave,
  'double-slit': DoubleSlit,
  'diffraction-grating': DiffractionGrating,
  polarization: Polarization,
  'light-clock': LightClock,
  'photoelectric-effect': PhotoelectricEffect,
  'energy-levels': EnergyLevels,
  'laser-cavity': LaserCavity,
  'binding-energy': BindingEnergy,
  'standard-model': StandardModel,
  'hr-diagram': HrDiagram,
  'big-bang-timeline': BigBangTimeline,
}
