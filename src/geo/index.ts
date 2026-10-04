/**
 * The map engine (spec/geo.md): GeoMap and its pure helpers. Importing this pulls in the renderer; the map data
 * still loads lazily per view. The lesson block loads GeoMap through React.lazy instead (MapBlockView).
 */
export { GeoMap, latLabel, lonLabel, mapLabel, nameOf, TROPIC_LINES, type GeoMapProps, type GeoPick } from './GeoMap'
export { FIGURE_FRAMES, getView, invert, project, resolveView, viewBox, type CustomFrame, type ViewGeo, type ViewSpec } from './frame'
export { countryAt, labelPoint, regionAt } from './query'
export { loadPlates, loadView, peekPlates, peekView, type GeoData } from './load'
export { makeProjection, type Projection, type ProjectionKind } from './project'
export { VIEW_DEFS, MAP_VIEW_IDS } from './views'
