import type { ComponentType, LazyExoticComponent } from 'react'
import { lazyWithReload } from '../../core/staleBuild'
import type { ExperimentId } from './catalog'

/** Each experiment is its own lazy chunk, loaded only when its lesson shows it. */
export const EXPERIMENT_COMPONENTS: Partial<Record<ExperimentId, LazyExoticComponent<ComponentType>>> = {
  'density-float': lazyWithReload(() => import('./density-float')),
  'ohm-law': lazyWithReload(() => import('./ohm-law')),
}
