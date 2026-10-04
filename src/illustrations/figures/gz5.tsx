import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import CzechProfile from "./gz5/CzechProfile";
import GulfStream from "./gz5/GulfStream";
import CzechWatersheds from "./gz5/CzechWatersheds";
import CzechGeomorphology from "./gz5/CzechGeomorphology";
import EuropeRelief from "./gz5/EuropeRelief";
import EuInstitutions from "./gz5/EuInstitutions";
import CzechProtected from "./gz5/CzechProtected";
import FieldworkCycle from "./gz5/FieldworkCycle";
import LandUseTransect from "./gz5/LandUseTransect";
import SuburbanisationPrague from "./gz5/SuburbanisationPrague";

/** Geography figures, group gz5 – levels 8–9 (Europe, Czechia, fieldwork) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ5: Partial<Record<FigureId, ComponentType>> = {
  "gulf-stream": GulfStream,
  "eu-institutions": EuInstitutions,
  "europe-relief": EuropeRelief,
  "czech-watersheds": CzechWatersheds,
  "czech-geomorphology": CzechGeomorphology,
  "czech-profile": CzechProfile,
  "czech-protected": CzechProtected,
  "fieldwork-cycle": FieldworkCycle,
  "suburbanisation-prague": SuburbanisationPrague,
  "land-use-transect": LandUseTransect,
};
