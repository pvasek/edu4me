import type { ComponentType } from 'react'
import type { FigureId } from '../catalog'
import Corrosion from './l67/Corrosion'
import OstwaldProcess from './l67/OstwaldProcess'
import ContactProcess from './l67/ContactProcess'
import HaberProcess from './l67/HaberProcess'
import BlastFurnace from './l67/BlastFurnace'
import EquilibriumSeesaw from './l67/EquilibriumSeesaw'
import BufferAction from './l67/BufferAction'
import Electrolysis from './l67/Electrolysis'
import FuelCell from './l67/FuelCell'
import HessCycle from './l67/HessCycle'
import LiIonBattery from './l67/LiIonBattery'
import MaxwellBoltzmann from './l67/MaxwellBoltzmann'
import RedoxTransfer from './l67/RedoxTransfer'

/** Figures for levels 6–7 (engraved technical plates, see ./l67/). */
export const FIGURES_L67: Partial<Record<FigureId, ComponentType>> = {
  'redox-transfer': RedoxTransfer,
  electrolysis: Electrolysis,
  'li-ion-battery': LiIonBattery,
  'fuel-cell': FuelCell,
  corrosion: Corrosion,
  'hess-cycle': HessCycle,
  'maxwell-boltzmann': MaxwellBoltzmann,
  'buffer-action': BufferAction,
  'equilibrium-seesaw': EquilibriumSeesaw,
  'blast-furnace': BlastFurnace,
  'haber-process': HaberProcess,
  'contact-process': ContactProcess,
  'ostwald-process': OstwaldProcess,
}
