import { lazy, Suspense } from 'react'
import type { Block } from '../../core/types'
import { VIEW_DEFS } from '../../geo/views'

// the map engine (projections, label placement) is its own chunk; the data modules load on demand inside it
const GeoMap = lazy(() => import('../../geo/GeoMap'))

/** The `map` lesson block: a real map (src/geo, spec/geo.md). The box keeps the map's aspect while it loads. */
export function MapBlockView({ block }: { block: Extract<Block, { type: 'map' }> }) {
  const aspect = VIEW_DEFS[block.view]?.aspect ?? 1.5
  const fallback = (
    <div
      role="img"
      aria-label="Mapa se načítá"
      style={{ width: '100%', maxWidth: 760, marginInline: 'auto', aspectRatio: String(aspect), background: 'var(--surface-2)', borderRadius: 4 }}
    />
  )
  return (
    <Suspense fallback={fallback}>
      <GeoMap view={block.view} highlight={block.highlight} points={block.points} routes={block.routes} bands={block.bands} layers={block.layers} />
    </Suspense>
  )
}
