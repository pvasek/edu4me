import type { Block } from '../../core/types'
import { ClimateView } from './ClimateView'
import { MapBlockView } from './MapBlockView'
import { PyramidView } from './PyramidView'

type GeographyBlockData = Extract<Block, { type: 'map' | 'climate' | 'pyramid' }>

/** Parametric geography drawings: the `map`, `climate` and `pyramid` blocks. Placeholder until the renderers are built. */
export function GeographyBlock({ block }: { block: GeographyBlockData }) {
  if (block.type === 'climate') return <ClimateView places={block.places} />
  if (block.type === 'pyramid') return <PyramidView step={block.step} pyramids={block.pyramids} />
  return <MapBlockView block={block} />
}
