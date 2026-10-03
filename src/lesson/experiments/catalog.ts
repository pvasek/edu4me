/**
 * In-lesson micro-experiments ("Vyzkoušej si"): small interactive pictures
 * with one or two controls that make one idea of a lesson tangible.
 * Used by the `experiment` block; every id needs a component in ./index.ts.
 * Rules: spec/content-guidelines.md, "Experiments".
 */
export const EXPERIMENTS = ['density-float', 'ohm-law'] as const
export type ExperimentId = (typeof EXPERIMENTS)[number]
