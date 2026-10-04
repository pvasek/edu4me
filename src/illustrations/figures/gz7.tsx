import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import MigrationModels from "./gz7/MigrationModels";
import UrbanModels from "./gz7/UrbanModels";
import Gentrification from "./gz7/Gentrification";
import VonThunen from "./gz7/VonThunen";
import CulturalDiffusion from "./gz7/CulturalDiffusion";
import BorderTypes from "./gz7/BorderTypes";
import StateShapes from "./gz7/StateShapes";
import UnSystem from "./gz7/UnSystem";
import WeberTriangle from "./gz7/WeberTriangle";
import SmileCurve from "./gz7/SmileCurve";
import CorePeriphery from "./gz7/CorePeriphery";
import VirtualWater from "./gz7/VirtualWater";
import DamImpacts from "./gz7/DamImpacts";
import EnergyTransition from "./gz7/EnergyTransition";
import CircularEconomy from "./gz7/CircularEconomy";
import PlanetaryBoundaries from "./gz7/PlanetaryBoundaries";
import SdgWheel from "./gz7/SdgWheel";
import ScenarioFan from "./gz7/ScenarioFan";

/** Geography figures, group gz7 – levels 11–12 (population, cities, geopolitics, global economy) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ7: Partial<Record<FigureId, ComponentType>> = {
  "migration-models": MigrationModels,
  "urban-models": UrbanModels,
  gentrification: Gentrification,
  "von-thunen": VonThunen,
  "cultural-diffusion": CulturalDiffusion,
  "border-types": BorderTypes,
  "state-shapes": StateShapes,
  "un-system": UnSystem,
  "weber-triangle": WeberTriangle,
  "smile-curve": SmileCurve,
  "core-periphery": CorePeriphery,
  "virtual-water": VirtualWater,
  "dam-impacts": DamImpacts,
  "energy-transition": EnergyTransition,
  "circular-economy": CircularEconomy,
  "planetary-boundaries": PlanetaryBoundaries,
  "sdg-wheel": SdgWheel,
  "scenario-fan": ScenarioFan,
};
