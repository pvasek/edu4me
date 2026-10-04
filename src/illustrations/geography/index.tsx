import type { Block } from '../../core/types'

type GeographyBlockData = Extract<Block, { type: 'map' | 'climate' | 'pyramid' }>

/** Parametric geography drawings: the `map`, `climate` and `pyramid` blocks. Placeholder until the renderers are built. */
export function GeographyBlock({ block }: { block: GeographyBlockData }) {
  const what = block.type === 'map' ? 'Mapa' : block.type === 'climate' ? 'Klimatogram' : 'Věková pyramida'
  return <svg viewBox="0 0 10 4" role="img" aria-label={`${what}: obrázek se připravuje`} />
}
