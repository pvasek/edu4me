/**
 * Map view presets (pure data, small: the lesson block imports it eagerly for the aspect ratio).
 * Geometry derived from a preset (projected frame, data clip box) lives in src/geo/frame.ts;
 * scripts/geo/build-geo.mjs reads these presets to cut and simplify the data modules.
 */
import type { MapView } from '../core/types'
import type { ProjectionSpec } from './project'

export interface ViewDef {
  id: MapView
  /** "Mapa …" in Czech, for the aria label */
  title: string
  proj: ProjectionSpec
  /** lon/lat box that must be inside the frame [west, south, east, north]; east may exceed 180 */
  focus: [number, number, number, number]
  /** width / height of the drawing */
  aspect: number
  /** graticule step and the step of its labels, in degrees */
  grid: number
  gridLabels: number
  /** Natural Earth scale the data module is cut from */
  scale: '50m' | '10m'
  /** simplification tolerance and quantisation step, in degrees */
  tol: number
  q: number
  /** the state the view is about: its neighbours get a quieter land tone */
  home?: string
}

export const VIEW_DEFS: Record<MapView, ViewDef> = {
  world: {
    id: 'world',
    title: 'Mapa světa',
    proj: { kind: 'equal-earth', lon0: 0 },
    focus: [-180, -90, 180, 90],
    aspect: 2.05,
    grid: 15,
    gridLabels: 30,
    scale: '50m',
    tol: 0.12,
    q: 0.04,
  },
  europe: {
    id: 'europe',
    title: 'Mapa Evropy',
    proj: { kind: 'laea', lon0: 15, lat0: 53 },
    focus: [-24, 34.5, 42, 71.2],
    aspect: 1.15,
    grid: 10,
    gridLabels: 10,
    scale: '50m',
    tol: 0.035,
    q: 0.01,
  },
  'central-europe': {
    id: 'central-europe',
    title: 'Mapa střední Evropy',
    proj: { kind: 'laea', lon0: 15.5, lat0: 50 },
    focus: [6, 45.6, 24.6, 55],
    aspect: 1.3,
    grid: 2,
    gridLabels: 2,
    scale: '10m',
    tol: 0.012,
    q: 0.004,
  },
  czechia: {
    id: 'czechia',
    title: 'Mapa Česka',
    proj: { kind: 'laea', lon0: 15.45, lat0: 49.8 },
    focus: [12.0, 48.5, 18.9, 51.1],
    aspect: 1.7,
    grid: 1,
    gridLabels: 1,
    scale: '10m',
    tol: 0.004,
    q: 0.002,
    home: 'CZE',
  },
  africa: {
    id: 'africa',
    title: 'Mapa Afriky',
    proj: { kind: 'laea', lon0: 17, lat0: 2 },
    focus: [-18, -35.5, 52, 38],
    aspect: 0.95,
    grid: 10,
    gridLabels: 20,
    scale: '50m',
    tol: 0.05,
    q: 0.01,
  },
  asia: {
    id: 'asia',
    title: 'Mapa Asie',
    proj: { kind: 'laea', lon0: 95, lat0: 42 },
    focus: [26, -11, 180, 77],
    aspect: 1.3,
    grid: 10,
    gridLabels: 20,
    scale: '50m',
    tol: 0.08,
    q: 0.02,
  },
  'middle-east': {
    id: 'middle-east',
    title: 'Mapa Blízkého východu',
    proj: { kind: 'laea', lon0: 44, lat0: 29 },
    focus: [25, 12, 63, 42],
    aspect: 1.25,
    grid: 5,
    gridLabels: 10,
    scale: '50m',
    tol: 0.03,
    q: 0.01,
  },
  'north-america': {
    id: 'north-america',
    title: 'Mapa Severní Ameriky',
    proj: { kind: 'laea', lon0: -98, lat0: 45 },
    focus: [-166, 8, -54, 70],
    aspect: 1.15,
    grid: 10,
    gridLabels: 20,
    scale: '50m',
    tol: 0.08,
    q: 0.02,
  },
  'latin-america': {
    id: 'latin-america',
    title: 'Mapa Latinské Ameriky',
    proj: { kind: 'laea', lon0: -78, lat0: -10 },
    focus: [-117, -56, -34, 32.5],
    aspect: 0.78,
    grid: 10,
    gridLabels: 20,
    scale: '50m',
    tol: 0.05,
    q: 0.01,
  },
  oceania: {
    id: 'oceania',
    title: 'Mapa Austrálie a Oceánie',
    proj: { kind: 'laea', lon0: 160, lat0: -18 },
    focus: [110, -48, 215, 10],
    aspect: 1.45,
    grid: 10,
    gridLabels: 20,
    scale: '50m',
    tol: 0.05,
    q: 0.01,
  },
  arctic: {
    id: 'arctic',
    title: 'Mapa Arktidy',
    proj: { kind: 'laea', lon0: 0, lat0: 90 },
    focus: [-180, 57, 180, 90],
    aspect: 1,
    grid: 10,
    gridLabels: 10,
    scale: '50m',
    tol: 0.08,
    q: 0.02,
  },
  antarctica: {
    id: 'antarctica',
    title: 'Mapa Antarktidy',
    proj: { kind: 'laea', lon0: 0, lat0: -90 },
    focus: [-180, -90, 180, -60],
    aspect: 1,
    grid: 10,
    gridLabels: 10,
    scale: '50m',
    tol: 0.08,
    q: 0.02,
  },
}

export const MAP_VIEW_IDS = Object.keys(VIEW_DEFS) as MapView[]
