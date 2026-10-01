/**
 * Glass tank with a liquid; the body hangs above it and, once `dropped`, falls
 * in and settles where physics puts it (floats with the right part under the
 * surface, hovers, or lies on the bottom). Then F_G and F_vz arrows appear.
 */
import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cz, outcomeOf, submergedFraction, type BodyLook } from './logic'
import type { Liquid } from './levels'

const W = 300
const TOP = 64
const BOTTOM = 236
const LEFT = 46
const RIGHT = 254
const SURFACE = 108
const START = 4

function size(shape: BodyLook['shape']) {
  return shape === 'ship' ? { w: 118, h: 42 } : shape === 'ball' ? { w: 50, h: 50 } : { w: 54, h: 54 }
}

/** Top edge (y) where the body comes to rest. */
export function restTop(body: BodyLook, liquid: Liquid): number {
  const { h } = size(body.shape)
  const o = outcomeOf(body.rho, liquid.rho)
  if (o === 'klesne') return BOTTOM - h - 1
  if (o === 'vznasi') return (SURFACE + BOTTOM) / 2 - h / 2
  return SURFACE - (1 - submergedFraction(body.rho, liquid.rho)) * h
}

function Shape({ body, hatch }: { body: BodyLook; hatch: string }) {
  const { w, h } = size(body.shape)
  const s = { stroke: 'var(--edge)', strokeWidth: 1.5, strokeLinejoin: 'round' as const }
  if (body.shape === 'ship')
    return (
      <g>
        <path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 14} ${h} L ${-w / 2 + 12} ${h} Z`} fill={body.color} {...s} />
        <path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 14} ${h} L ${-w / 2 + 12} ${h} Z`} fill={`url(#${hatch})`} />
        <rect x={-w / 2 + 16} y={-10} width={w - 40} height={10} rx={2} fill="var(--accent-soft)" {...s} />
      </g>
    )
  if (body.shape === 'ball')
    return (
      <g>
        <ellipse cx={0} cy={h / 2} rx={w / 2} ry={h / 2} fill={body.color} {...s} />
        <path d={`M ${-w / 4} ${h / 4} a ${w / 4} ${h / 4} 0 0 1 ${w / 5} ${-h / 9}`} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      </g>
    )
  return (
    <g>
      <rect x={-w / 2} y={0} width={w} height={h} rx={3} fill={body.color} {...s} />
      <rect x={-w / 2} y={0} width={w} height={h} rx={3} fill={`url(#${hatch})`} />
    </g>
  )
}

function Arrow({ x, y1, y2, color, label, delay }: { x: number; y1: number; y2: number; color: string; label: string; delay: number }) {
  const still = useReducedMotion()
  const dir = Math.sign(y2 - y1) || 1
  const head = 8
  return (
    <motion.g initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.3 }}>
      <line x1={x} y1={y1} x2={x} y2={y2 - dir * head * 0.8} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${x} ${y2} L ${x - 6} ${y2 - dir * head} L ${x + 6} ${y2 - dir * head} Z`} fill={color} stroke={color} strokeLinejoin="round" />
      <text x={x + 9} y={(y1 + y2) / 2} className="g-fl-force" fill={color} dominantBaseline="middle">
        <tspan fontStyle="italic">F</tspan>
        <tspan dy="0.35em" fontSize="0.72em">
          {label}
        </tspan>
      </text>
    </motion.g>
  )
}

export function Tank({ body, liquid, dropped, showForces }: { body: BodyLook; liquid: Liquid; dropped: boolean; showForces: boolean }) {
  const id = useId().replace(/:/g, '')
  const still = useReducedMotion()
  const { w, h } = size(body.shape)
  const rest = restTop(body, liquid)
  const o = outcomeOf(body.rho, liquid.rho)
  const top = dropped ? rest : START
  const liquidFill = `color-mix(in srgb, ${liquid.tint} ${liquid.id === 'mercury' ? 55 : 28}%, var(--surface))`
  const transition = still
    ? { duration: 0 }
    : o === 'klesne'
      ? { type: 'tween' as const, duration: 1.1, ease: [0.5, 0, 0.75, 1] as const }
      : o === 'vznasi'
        ? { type: 'spring' as const, stiffness: 40, damping: 12 }
        : { type: 'spring' as const, stiffness: 55, damping: 6 }

  // arrows: F_G for the whole body, F_vz for the part under the surface
  const frac = submergedFraction(body.rho, liquid.rho)
  const fg = body.rho
  const fvz = liquid.rho * frac
  const cy = rest + h / 2
  const k = Math.min(70, 296 - cy, cy - 12) / Math.max(fg, fvz)
  const sideX = W / 2 + w / 2 + 8

  const label = `Nádoba s kapalinou ${liquid.name} (hustota ${cz(liquid.rho)} kg/m³), těleso ${body.label}${
    dropped ? (o === 'plave' ? ' plave na hladině' : o === 'vznasi' ? ' se vznáší v kapalině' : ' kleslo ke dnu') : ' visí nad hladinou'
  }`

  return (
    <svg className="g-fl-tank" viewBox={`0 0 ${W} 300`} role="img" aria-label={label}>
      <defs>
        <pattern id={`h${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--edge)" strokeOpacity="0.18" strokeWidth="1.4" />
        </pattern>
        <pattern id={`w${id}`} width="24" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 5 q6 -3 12 0 t12 0" fill="none" stroke="var(--edge)" strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
        <clipPath id={`c${id}`}>
          <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOTTOM - TOP} />
        </clipPath>
      </defs>
      {/* liquid */}
      <rect x={LEFT} y={SURFACE} width={RIGHT - LEFT} height={BOTTOM - SURFACE} fill={liquidFill} />
      <rect x={LEFT} y={SURFACE} width={RIGHT - LEFT} height={BOTTOM - SURFACE} fill={`url(#w${id})`} />
      {/* body */}
      <motion.g initial={false} animate={{ y: top }} transition={transition}>
        <g transform={`translate(${W / 2} 0)`}>
          {!dropped && <line x1={0} y1={-40} x2={0} y2={0} stroke="var(--edge)" strokeWidth="1" strokeDasharray="2 3" />}
          <Shape body={body} hatch={`h${id}`} />
        </g>
      </motion.g>
      {/* surface drawn over the body so the submerged part reads as "in the liquid" */}
      <rect x={LEFT} y={SURFACE} width={RIGHT - LEFT} height={BOTTOM - SURFACE} fill={liquidFill} opacity={0.42} clipPath={`url(#c${id})`} pointerEvents="none" />
      <line x1={LEFT} y1={SURFACE} x2={RIGHT} y2={SURFACE} stroke={liquid.tint} strokeWidth="2" />
      {dropped && !still && (
        <motion.ellipse
          cx={W / 2}
          cy={SURFACE}
          rx={w / 2 + 6}
          ry={4}
          fill="none"
          stroke={liquid.tint}
          strokeWidth="1.5"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.8], opacity: [0, 0.9, 0] }}
          transition={{ delay: 0.25, duration: 0.9 }}
        />
      )}
      {/* glass */}
      <path d={`M ${LEFT - 6} ${TOP - 6} L ${LEFT} ${TOP} L ${LEFT} ${BOTTOM} L ${RIGHT} ${BOTTOM} L ${RIGHT} ${TOP} L ${RIGHT + 6} ${TOP - 6}`} fill="none" stroke="var(--edge)" strokeWidth="2" strokeLinejoin="round" />
      <line x1={LEFT + 8} y1={TOP + 14} x2={LEFT + 8} y2={BOTTOM - 16} stroke="var(--surface)" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
      {dropped && showForces && (
        <g>
          <Arrow x={sideX} y1={cy} y2={cy + fg * k} color="var(--bad)" label="G" delay={still ? 0 : 1.2} />
          <Arrow x={sideX + 34} y1={cy} y2={cy - fvz * k} color="var(--blue)" label="vz" delay={still ? 0 : 1.35} />
        </g>
      )}
    </svg>
  )
}
