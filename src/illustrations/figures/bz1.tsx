import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import MicroscopeParts from "./bz1/MicroscopeParts";
import CellPlantAnimal from "./bz1/CellPlantAnimal";
import LevelsOfOrganisation from "./bz1/LevelsOfOrganisation";
import SurfaceVolume from "./bz1/SurfaceVolume";
import LifeCycles from "./bz1/LifeCycles";
import ClassificationHierarchy from "./bz1/ClassificationHierarchy";
import DichotomousKey from "./bz1/DichotomousKey";
import VirusReplication from "./bz1/VirusReplication";
import BacterialCell from "./bz1/BacterialCell";
import ProtistsGallery from "./bz1/ProtistsGallery";
import FungusAnatomy from "./bz1/FungusAnatomy";
import LichenSection from "./bz1/LichenSection";
import ImmuneResponseBasic from "./bz1/ImmuneResponseBasic";
import MossFernCycle from "./bz1/MossFernCycle";
import PlantOrgans from "./bz1/PlantOrgans";
import LeafCrossSection from "./bz1/LeafCrossSection";
import FlowerParts from "./bz1/FlowerParts";
import SeedGermination from "./bz1/SeedGermination";
import MonocotDicot from "./bz1/MonocotDicot";

/** Biology figures, group bz1 – levels 1–3 (spec/courses/biologie/figures.md). */
export const FIGURES_BZ1: Partial<Record<FigureId, ComponentType>> = {
  "microscope-parts": MicroscopeParts,
  "cell-plant-animal": CellPlantAnimal,
  "levels-of-organisation": LevelsOfOrganisation,
  "surface-volume": SurfaceVolume,
  "life-cycles": LifeCycles,
  "classification-hierarchy": ClassificationHierarchy,
  "dichotomous-key": DichotomousKey,
  "virus-replication": VirusReplication,
  "bacterial-cell": BacterialCell,
  "protists-gallery": ProtistsGallery,
  "fungus-anatomy": FungusAnatomy,
  "lichen-section": LichenSection,
  "immune-response-basic": ImmuneResponseBasic,
  "moss-fern-cycle": MossFernCycle,
  "plant-organs": PlantOrgans,
  "leaf-cross-section": LeafCrossSection,
  "flower-parts": FlowerParts,
  "seed-germination": SeedGermination,
  "monocot-dicot": MonocotDicot,
};
