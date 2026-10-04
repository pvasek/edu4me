import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import ContinentalDrift from "./gz2/ContinentalDrift";
import EarthquakeFocus from "./gz2/EarthquakeFocus";
import VolcanoTypes from "./gz2/VolcanoTypes";
import HotspotChain from "./gz2/HotspotChain";
import Tsunami from "./gz2/Tsunami";
import FoldingFaulting from "./gz2/FoldingFaulting";
import WeatheringTypes from "./gz2/WeatheringTypes";
import Karst from "./gz2/Karst";
import RiverCourse from "./gz2/RiverCourse";
import Meander from "./gz2/Meander";
import GlacialValley from "./gz2/GlacialValley";
import WindLandforms from "./gz2/WindLandforms";
import CoastalErosion from "./gz2/CoastalErosion";
import CoastTypes from "./gz2/CoastTypes";
import CoralAtoll from "./gz2/CoralAtoll";
import SoilErosion from "./gz2/SoilErosion";

/** Geography figures, group gz2 – level 3 (relief) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ2: Partial<Record<FigureId, ComponentType>> = {
  "continental-drift": ContinentalDrift,
  "earthquake-focus": EarthquakeFocus,
  "volcano-types": VolcanoTypes,
  "hotspot-chain": HotspotChain,
  tsunami: Tsunami,
  "folding-faulting": FoldingFaulting,
  "weathering-types": WeatheringTypes,
  karst: Karst,
  "river-course": RiverCourse,
  meander: Meander,
  "glacial-valley": GlacialValley,
  "wind-landforms": WindLandforms,
  "coastal-erosion": CoastalErosion,
  "coast-types": CoastTypes,
  "coral-atoll": CoralAtoll,
  "soil-erosion": SoilErosion,
};
