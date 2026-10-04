import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import ChromosomeKaryotype from "./bz3/ChromosomeKaryotype";
import PunnettPeas from "./bz3/PunnettPeas";
import BloodGroupInheritance from "./bz3/BloodGroupInheritance";
import SexLinkage from "./bz3/SexLinkage";
import NaturalSelectionMoth from "./bz3/NaturalSelectionMoth";
import ArtificialSelection from "./bz3/ArtificialSelection";
import GeologicalTimescale from "./bz3/GeologicalTimescale";
import FossilFormation from "./bz3/FossilFormation";
import EarthLayers from "./bz3/EarthLayers";
import PlateBoundaries from "./bz3/PlateBoundaries";
import RockCycle from "./bz3/RockCycle";
import SoilProfile from "./bz3/SoilProfile";
import WaterCycle from "./bz3/WaterCycle";
import FoodWeb from "./bz3/FoodWeb";
import EnergyPyramid from "./bz3/EnergyPyramid";
import Succession from "./bz3/Succession";
import OrganellesDetail from "./bz3/OrganellesDetail";
import Endosymbiosis from "./bz3/Endosymbiosis";
import MembraneTransport from "./bz3/MembraneTransport";
import OsmosisCells from "./bz3/OsmosisCells";
import MitosisMeiosis from "./bz3/MitosisMeiosis";
import ChloroplastReactions from "./bz3/ChloroplastReactions";

/** Biology figures, group bz3 – levels 7–9 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ3: Partial<Record<FigureId, ComponentType>> = {
  "chromosome-karyotype": ChromosomeKaryotype,
  "punnett-peas": PunnettPeas,
  "blood-group-inheritance": BloodGroupInheritance,
  "sex-linkage": SexLinkage,
  "natural-selection-moth": NaturalSelectionMoth,
  "artificial-selection": ArtificialSelection,
  "geological-timescale": GeologicalTimescale,
  "fossil-formation": FossilFormation,
  "earth-layers": EarthLayers,
  "plate-boundaries": PlateBoundaries,
  "rock-cycle": RockCycle,
  "soil-profile": SoilProfile,
  "water-cycle": WaterCycle,
  "food-web": FoodWeb,
  "energy-pyramid": EnergyPyramid,
  succession: Succession,
  "organelles-detail": OrganellesDetail,
  endosymbiosis: Endosymbiosis,
  "membrane-transport": MembraneTransport,
  "osmosis-cells": OsmosisCells,
  "mitosis-meiosis": MitosisMeiosis,
  "chloroplast-reactions": ChloroplastReactions,
};
