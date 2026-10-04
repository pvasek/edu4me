import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import GeoSpheres from "./gz1/GeoSpheres";
import GlobeGrid from "./gz1/GlobeGrid";
import LatitudeLongitude from "./gz1/LatitudeLongitude";
import MapGeneralisation from "./gz1/MapGeneralisation";
import MapSymbols from "./gz1/MapSymbols";
import ContourHill from "./gz1/ContourHill";
import ContourLandforms from "./gz1/ContourLandforms";
import CompassRose from "./gz1/CompassRose";
import OrientationSun from "./gz1/OrientationSun";
import TrailMarks from "./gz1/TrailMarks";
import ProjectionSurfaces from "./gz1/ProjectionSurfaces";
import GpsTrilateration from "./gz1/GpsTrilateration";
import GisLayers from "./gz1/GisLayers";
import EarthShapeEvidence from "./gz1/EarthShapeEvidence";
import Eratosthenes from "./gz1/Eratosthenes";
import DayNight from "./gz1/DayNight";
import LocalTime from "./gz1/LocalTime";
import DateLine from "./gz1/DateLine";
import SunRaysLatitude from "./gz1/SunRaysLatitude";
import SolsticeLight from "./gz1/SolsticeLight";
import HeatZones from "./gz1/HeatZones";
import Tides from "./gz1/Tides";
import MercatorSizes from "./gz1/MercatorSizes";

/** Geography figures, group gz1 – levels 1–2 (maps, the Earth in space) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ1: Partial<Record<FigureId, ComponentType>> = {
  "geo-spheres": GeoSpheres,
  "globe-grid": GlobeGrid,
  "latitude-longitude": LatitudeLongitude,
  "map-generalisation": MapGeneralisation,
  "map-symbols": MapSymbols,
  "contour-hill": ContourHill,
  "contour-landforms": ContourLandforms,
  "compass-rose": CompassRose,
  "orientation-sun": OrientationSun,
  "trail-marks": TrailMarks,
  "projection-surfaces": ProjectionSurfaces,
  "gps-trilateration": GpsTrilateration,
  "gis-layers": GisLayers,
  "earth-shape-evidence": EarthShapeEvidence,
  eratosthenes: Eratosthenes,
  "day-night": DayNight,
  "local-time": LocalTime,
  "date-line": DateLine,
  "sun-rays-latitude": SunRaysLatitude,
  "solstice-light": SolsticeLight,
  "heat-zones": HeatZones,
  tides: Tides,
  "mercator-sizes": MercatorSizes,
};
