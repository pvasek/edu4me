/** Shared parts of the motor and generator plates (cabinet projection of a magnet and a coil). */
import { NORTH, SOUTH, f1, pat, useFig } from './kit'

export type P = [number, number]
/** cabinet depth direction (per unit of depth): going away = up and to the right */
export const D: P = [0.45, -0.3]
export const at = (p: P, d: number): P => [p[0] + D[0] * d, p[1] + D[1] * d]
export const pt = (p: P) => `${f1(p[0])} ${f1(p[1])}`
export const DEPTH_DEG = (Math.atan2(D[1], D[0]) * 180) / Math.PI

/** A magnet block: front face (x, y, w, h), extruded along the depth; visible top and right faces. */
export function Block({ x, y, w, h, depth, n }: { x: number; y: number; w: number; h: number; depth: number; n: 'N' | 'S' }) {
  const { id } = useFig()
  const col = n === 'N' ? NORTH : SOUTH
  const tl: P = [x, y]
  const tr: P = [x + w, y]
  const br: P = [x + w, y + h]
  const top = `M${pt(tl)} L${pt(tr)} L${pt(at(tr, depth))} L${pt(at(tl, depth))}Z`
  const side = `M${pt(tr)} L${pt(at(tr, depth))} L${pt(at(br, depth))} L${pt(br)}Z`
  return (
    <g>
      <path d={top} fill={col} className="fz3-o" />
      <path d={top} fill={pat(id, 'hi')} opacity={0.6} />
      <path d={side} fill={col} className="fz3-o" />
      <path d={side} fill={pat(id, 'dd')} />
      <rect x={x} y={y} width={w} height={h} fill={col} className="fz3-o" />
      <rect x={x} y={y} width={w} height={h} fill={pat(id, 'd')} opacity={0.5} />
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" className="fz3-pole-t" style={{ fontSize: 24 }}>
        {n}
      </text>
    </g>
  )
}
