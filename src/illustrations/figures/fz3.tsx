import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import Oersted from './fz3/Oersted'
import SolenoidField from './fz3/SolenoidField'
import DcMotor from './fz3/DcMotor'
import Generator from './fz3/Generator'
import Transformer from './fz3/Transformer'
import PowerGrid from './fz3/PowerGrid'
import PowerPlants from './fz3/PowerPlants'
import NuclearReactor from './fz3/NuclearReactor'
import SolarSystem from './fz3/SolarSystem'
import Seasons from './fz3/Seasons'
import StarLifeCycle from './fz3/StarLifeCycle'
import ProjectileMotion from './fz3/ProjectileMotion'
import CircularMotion from './fz3/CircularMotion'
import MomentumCollision from './fz3/MomentumCollision'
import GravityField from './fz3/GravityField'
import KeplerOrbits from './fz3/KeplerOrbits'
import TorqueBalance from './fz3/TorqueBalance'
import SpringPendulum from './fz3/SpringPendulum'
import InterferenceRipples from './fz3/InterferenceRipples'
import StandingWaves from './fz3/StandingWaves'
import DopplerEffect from './fz3/DopplerEffect'

/** Physics figures (see spec/courses/fyzika/figures.md, section fz3). */
export const FIGURES_FZ3: Partial<Record<FigureId, ComponentType>> = {
  oersted: Oersted,
  'solenoid-field': SolenoidField,
  'dc-motor': DcMotor,
  generator: Generator,
  transformer: Transformer,
  'power-grid': PowerGrid,
  'power-plants': PowerPlants,
  'nuclear-reactor': NuclearReactor,
  'solar-system': SolarSystem,
  seasons: Seasons,
  'star-life-cycle': StarLifeCycle,
  'projectile-motion': ProjectileMotion,
  'circular-motion': CircularMotion,
  'momentum-collision': MomentumCollision,
  'gravity-field': GravityField,
  'kepler-orbits': KeplerOrbits,
  'torque-balance': TorqueBalance,
  'spring-pendulum': SpringPendulum,
  'interference-ripples': InterferenceRipples,
  'standing-waves': StandingWaves,
  'doppler-effect': DopplerEffect,
}
