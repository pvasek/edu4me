/**
 * In-lesson micro-experiments ("Vyzkoušej si"): small interactive pictures
 * with one or two controls that make one idea of a lesson tangible.
 * Used by the `experiment` block; every id needs a component in ./index.ts.
 * Rules: spec/content-guidelines.md, "Experiments".
 */
export const EXPERIMENTS = [
  // physics
  'density-float',
  'ohm-law',
  // biology
  'microscope-zoom',
  'surface-volume',
  'bacterial-growth',
  'herd-immunity',
  'photosynthesis-rate',
  'pulse-exercise',
  'punnett-cross',
  'peppered-moth',
  'energy-pyramid',
  'osmosis-cell',
  'enzyme-activity',
  'hardy-weinberg',
  'glucose-insulin',
  'population-growth',
  'predator-prey',
  'body-temperature',
  'coral-bleaching',
  // geography
  'map-projection',
  'day-night',
  'sun-angle',
  'tides',
  'plate-motion',
  'river-erosion',
  'pressure-wind',
  'lapse-rate',
  'flood-hydrograph',
  'doubling-time',
  'birth-death-rates',
  'sea-level-rise',
  'albedo-balance',
  'climate-scenario',
  'risk-index',
  'site-finder',
  'energy-mix',
] as const
export type ExperimentId = (typeof EXPERIMENTS)[number]
