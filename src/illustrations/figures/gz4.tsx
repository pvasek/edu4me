import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import DemographicTransition from "./gz4/DemographicTransition";
import PushPull from "./gz4/PushPull";
import SettlementHierarchy from "./gz4/SettlementHierarchy";
import UrbanZones from "./gz4/UrbanZones";
import UrbanisationStages from "./gz4/UrbanisationStages";
import StateForms from "./gz4/StateForms";
import EconomicSectors from "./gz4/EconomicSectors";
import FarmingSystems from "./gz4/FarmingSystems";
import MiningTypes from "./gz4/MiningTypes";
import IndustryLocation from "./gz4/IndustryLocation";
import TransportModes from "./gz4/TransportModes";
import PanamaCanal from "./gz4/PanamaCanal";
import SahelTransect from "./gz4/SahelTransect";
import HimalayaSection from "./gz4/HimalayaSection";
import Deforestation from "./gz4/Deforestation";
import PolarCompare from "./gz4/PolarCompare";
import SupplyChain from "./gz4/SupplyChain";

/** Geography figures, group gz4 – levels 5–7 (people, economy, regions) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ4: Partial<Record<FigureId, ComponentType>> = {
  "demographic-transition": DemographicTransition,
  "push-pull": PushPull,
  "settlement-hierarchy": SettlementHierarchy,
  "urban-zones": UrbanZones,
  "urbanisation-stages": UrbanisationStages,
  "state-forms": StateForms,
  "economic-sectors": EconomicSectors,
  "farming-systems": FarmingSystems,
  "mining-types": MiningTypes,
  "industry-location": IndustryLocation,
  "transport-modes": TransportModes,
  "panama-canal": PanamaCanal,
  "sahel-transect": SahelTransect,
  "himalaya-section": HimalayaSection,
  "deforestation": Deforestation,
  "polar-compare": PolarCompare,
  "supply-chain": SupplyChain,
};
