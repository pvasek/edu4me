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
}
