import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import PaternityGel from "./bz8/PaternityGel";
import Potometer from "./bz8/Potometer";
import Haemodialysis from "./bz8/Haemodialysis";
import LateralFlow from "./bz8/LateralFlow";
import SurvivorshipCurves from "./bz8/SurvivorshipCurves";
import HumanMigration from "./bz8/HumanMigration";
import PentadactylLimb from "./bz8/PentadactylLimb";

/** Biology figures, group bz8 – levels 10–12 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ8: Partial<Record<FigureId, ComponentType>> = {
  "paternity-gel": PaternityGel,
  potometer: Potometer,
  haemodialysis: Haemodialysis,
  "lateral-flow": LateralFlow,
  "survivorship-curves": SurvivorshipCurves,
  "human-migration": HumanMigration,
  "pentadactyl-limb": PentadactylLimb,
};
