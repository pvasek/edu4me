import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import SystemModel from "./gz6/SystemModel";
import DrainageBasinSystem from "./gz6/DrainageBasinSystem";
import RadiationBudget from "./gz6/RadiationBudget";
import ElNino from "./gz6/ElNino";
import JetStream from "./gz6/JetStream";
import IceCore from "./gz6/IceCore";
import ClimateFeedbacks from "./gz6/ClimateFeedbacks";
import SubductionZone from "./gz6/SubductionZone";
import SeismicWaves from "./gz6/SeismicWaves";
import HazardRisk from "./gz6/HazardRisk";
import DisasterCycle from "./gz6/DisasterCycle";
import StormHydrograph from "./gz6/StormHydrograph";
import Desertification from "./gz6/Desertification";
import SeaLevelCauses from "./gz6/SeaLevelCauses";
import RemoteSensing from "./gz6/RemoteSensing";
import GisOverlay from "./gz6/GisOverlay";

/** Geography figures, group gz6 – level 10 (Earth systems, hazards) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ6: Partial<Record<FigureId, ComponentType>> = {
  "system-model": SystemModel,
  "drainage-basin-system": DrainageBasinSystem,
  "radiation-budget": RadiationBudget,
  "el-nino": ElNino,
  "jet-stream": JetStream,
  "ice-core": IceCore,
  "climate-feedbacks": ClimateFeedbacks,
  "subduction-zone": SubductionZone,
  "seismic-waves": SeismicWaves,
  "hazard-risk": HazardRisk,
  "disaster-cycle": DisasterCycle,
  "storm-hydrograph": StormHydrograph,
  desertification: Desertification,
  "sea-level-causes": SeaLevelCauses,
  "remote-sensing": RemoteSensing,
  "gis-overlay": GisOverlay,
};
