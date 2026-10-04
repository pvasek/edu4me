import type { ComponentType, LazyExoticComponent } from 'react'
import { lazyWithReload } from '../../core/staleBuild'
import type { ExperimentId } from './catalog'

/** Each experiment is its own lazy chunk, loaded only when its lesson shows it. */
export const EXPERIMENT_COMPONENTS: Partial<Record<ExperimentId, LazyExoticComponent<ComponentType>>> = {
  'density-float': lazyWithReload(() => import('./density-float')),
  'ohm-law': lazyWithReload(() => import('./ohm-law')),
  // biology
  'microscope-zoom': lazyWithReload(() => import('./microscope-zoom')),
  'surface-volume': lazyWithReload(() => import('./surface-volume')),
  'bacterial-growth': lazyWithReload(() => import('./bacterial-growth')),
  'herd-immunity': lazyWithReload(() => import('./herd-immunity')),
  'photosynthesis-rate': lazyWithReload(() => import('./photosynthesis-rate')),
  'pulse-exercise': lazyWithReload(() => import('./pulse-exercise')),
  'punnett-cross': lazyWithReload(() => import('./punnett-cross')),
  'peppered-moth': lazyWithReload(() => import('./peppered-moth')),
  'energy-pyramid': lazyWithReload(() => import('./energy-pyramid')),
  'osmosis-cell': lazyWithReload(() => import('./osmosis-cell')),
  'enzyme-activity': lazyWithReload(() => import('./enzyme-activity')),
  'hardy-weinberg': lazyWithReload(() => import('./hardy-weinberg')),
  'glucose-insulin': lazyWithReload(() => import('./glucose-insulin')),
  'population-growth': lazyWithReload(() => import('./population-growth')),
  'predator-prey': lazyWithReload(() => import('./predator-prey')),
  'body-temperature': lazyWithReload(() => import('./body-temperature')),
  'coral-bleaching': lazyWithReload(() => import('./coral-bleaching')),
  // geography
  'map-projection': lazyWithReload(() => import('./map-projection')),
  'day-night': lazyWithReload(() => import('./day-night')),
  'sun-angle': lazyWithReload(() => import('./sun-angle')),
  'tides': lazyWithReload(() => import('./tides')),
  'plate-motion': lazyWithReload(() => import('./plate-motion')),
  'river-erosion': lazyWithReload(() => import('./river-erosion')),
  'pressure-wind': lazyWithReload(() => import('./pressure-wind')),
  'lapse-rate': lazyWithReload(() => import('./lapse-rate')),
  'flood-hydrograph': lazyWithReload(() => import('./flood-hydrograph')),
  'doubling-time': lazyWithReload(() => import('./doubling-time')),
  'birth-death-rates': lazyWithReload(() => import('./birth-death-rates')),
  'sea-level-rise': lazyWithReload(() => import('./sea-level-rise')),
  'albedo-balance': lazyWithReload(() => import('./albedo-balance')),
  'climate-scenario': lazyWithReload(() => import('./climate-scenario')),
  'risk-index': lazyWithReload(() => import('./risk-index')),
  'site-finder': lazyWithReload(() => import('./site-finder')),
  'energy-mix': lazyWithReload(() => import('./energy-mix')),
}
