import type { ComponentType } from "react";
import type { FigureId } from "../catalog";
import AtmosphereLayers from "./gz3/AtmosphereLayers";
import WeatherStation from "./gz3/WeatherStation";
import CloudTypes from "./gz3/CloudTypes";
import PressureWind from "./gz3/PressureWind";
import WeatherFronts from "./gz3/WeatherFronts";
import TropicalCyclone from "./gz3/TropicalCyclone";
import GlobalCirculation from "./gz3/GlobalCirculation";
import Monsoon from "./gz3/Monsoon";
import AltitudeZones from "./gz3/AltitudeZones";
import WaterDistribution from "./gz3/WaterDistribution";
import RiverBasin from "./gz3/RiverBasin";
import LakeOrigins from "./gz3/LakeOrigins";
import Groundwater from "./gz3/Groundwater";
import GlacierParts from "./gz3/GlacierParts";
import BiomeClimate from "./gz3/BiomeClimate";
import OceanCurrents from "./gz3/OceanCurrents";
import SynopticMap from "./gz3/SynopticMap";

/** Geography figures, group gz3 – level 4 (weather, climate, water, biomes) (spec/courses/zemepis/figures.md). */
export const FIGURES_GZ3: Partial<Record<FigureId, ComponentType>> = {
  "atmosphere-layers": AtmosphereLayers,
  "weather-station": WeatherStation,
  "cloud-types": CloudTypes,
  "pressure-wind": PressureWind,
  "weather-fronts": WeatherFronts,
  "tropical-cyclone": TropicalCyclone,
  "global-circulation": GlobalCirculation,
  "monsoon": Monsoon,
  "altitude-zones": AltitudeZones,
  "water-distribution": WaterDistribution,
  "river-basin": RiverBasin,
  "lake-origins": LakeOrigins,
  "groundwater": Groundwater,
  "glacier-parts": GlacierParts,
  "biome-climate": BiomeClimate,
  "ocean-currents": OceanCurrents,
  "synoptic-map": SynopticMap,
};
