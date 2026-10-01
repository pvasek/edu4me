import { useId } from 'react'
import { motion } from 'motion/react'
import { popIn } from '../../ui/motion'
import { cz, orbitFate, orbitalVelocity, type Launch, type OrbitTask, type Shot, type ThrowTask } from './logic'

const W = 360
const H = 232
const X0 = 40
const GROUND = H - 40
const RIGHT = 14
const TOP = 14

/** Screen mapping for a task: equal scale on both axes so angles look true. */
export function viewOf(task: ThrowTask) {
  const { x, y, w } = task.target
  const xMax = x + w + Math.max(3, 0.14 * x)
  const yMax = Math.max(task.h0, y) * 1.3 + 2
  // a tower needs room on the left for its height label
  const x0 = task.h0 > 0 ? X0 + 34 : X0
  const s = Math.min((W - x0 - RIGHT) / xMax, (GROUND - TOP) / yMax)
  return { s, xMax: (W - x0 - RIGHT) / s, X: (m: number) => x0 + m * s, Y: (m: number) => GROUND - m * s }
}

const pathD = (pts: { x: number; y: number }[], X: (m: number) => number, Y: (m: number) => number) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(' ')

/** Side view: launcher, target, ruler, earlier shots, the flying shot. */
export function ThrowScene({
  task,
  aim,
  shots,
  flying,
  progress,
  solution,
  hit,
}: {
  task: ThrowTask
  aim: Launch
  shots: Shot[]
  /** The shot in the air (drawn up to `progress`, 0–1). */
  flying: Shot | null
  progress: number
  /** Shown in green after 5 misses. */
  solution: Shot | null
  hit: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const { X, Y, xMax } = viewOf(task)
  const { x: tx, y: ty, w } = task.target
  const px = X(0)
  const py = Y(task.h0)
  const body = task.body.id
  const done = shots.filter((s) => s !== flying)
  const visible = flying ? flying.path.slice(0, Math.max(2, Math.round(progress * (flying.path.length - 1)) + 1)) : []
  const head = visible[visible.length - 1]
  const vecLen = 10 + aim.v * 1.6
  const label =
    `Pohled z boku ${task.body.loc}. ` +
    (task.h0 > 0 ? `Vrhač stojí na věži vysoké ${cz(task.h0)} m. ` : 'Vrhač stojí na zemi. ') +
    (ty > 0 ? `Cíl je na plošině vysoké ${cz(ty)} m, ` : 'Cíl leží na zemi ') +
    `ve vzdálenosti ${cz(tx)} m, široký ${cz(2 * w)} m.` +
    (shots.length ? ` Poslední dopad: ${cz(shots[shots.length - 1].end.x)} m.` : '')

  return (
    <svg className={`g-pr-scene g-pr-body-${body}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} overflow="hidden">
      <defs>
        <pattern id={`gh${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="g-pr-hatchline" />
        </pattern>
        <pattern id={`bh${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="5" className="g-pr-hatchline-b" />
        </pattern>
        <clipPath id={`cl${uid}`}>
          <rect x="0" y="0" width={W} height={GROUND} />
        </clipPath>
        <marker id={`ah${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9 z" className="g-pr-ahead" />
        </marker>
      </defs>

      <Backdrop body={body} />

      {/* ground */}
      <rect x="0" y={GROUND} width={W} height={H - GROUND} className="g-pr-ground" />
      <rect x="0" y={GROUND} width={W} height={H - GROUND} fill={`url(#gh${uid})`} className="g-pr-ground-hatch" />
      <line x1="0" x2={W} y1={GROUND} y2={GROUND} className="g-pr-groundline" />

      {/* ruler to the target */}
      <g className="g-pr-ruler">
        <line x1={px} x2={X(tx)} y1={GROUND + 12} y2={GROUND + 12} markerStart={`url(#ah${uid})`} markerEnd={`url(#ah${uid})`} />
        <line x1={px} x2={px} y1={GROUND + 4} y2={GROUND + 18} />
        <line x1={X(tx)} x2={X(tx)} y1={GROUND + 4} y2={GROUND + 18} />
        <text x={(px + X(tx)) / 2} y={GROUND + 33} textAnchor="middle" className="g-pr-rulerlbl">
          {cz(tx)} m
        </text>
      </g>

      {/* tower */}
      {task.h0 > 0 && (
        <g className="g-pr-block">
          <rect x={px - 16} y={py + 5} width="22" height={GROUND - py - 5} />
          <rect x={px - 16} y={py + 5} width="22" height={GROUND - py - 5} fill={`url(#bh${uid})`} />
          <line x1={px - 26} x2={px - 26} y1={py + 5} y2={GROUND} markerStart={`url(#ah${uid})`} markerEnd={`url(#ah${uid})`} className="g-pr-dim" />
          <text x={px - 30} y={(py + GROUND) / 2 + 4} textAnchor="end" className="g-pr-dimlbl">
            {cz(task.h0)} m
          </text>
        </g>
      )}

      {/* platform */}
      {ty > 0 && (
        <g className="g-pr-block">
          <rect x={X(tx - w)} y={Y(ty)} width={X(tx + w) - X(tx - w)} height={GROUND - Y(ty)} />
          <rect x={X(tx - w)} y={Y(ty)} width={X(tx + w) - X(tx - w)} height={GROUND - Y(ty)} fill={`url(#bh${uid})`} />
          <line x1={X(tx + w) + 8} x2={X(tx + w) + 8} y1={Y(ty)} y2={GROUND} markerStart={`url(#ah${uid})`} markerEnd={`url(#ah${uid})`} className="g-pr-dim" />
          <text x={Math.min(W - 2, X(tx + w) + 12)} y={(Y(ty) + GROUND) / 2 + 4} textAnchor={X(tx + w) + 40 > W ? 'end' : 'start'} className="g-pr-dimlbl">
            {cz(ty)} m
          </text>
        </g>
      )}

      {/* target */}
      <g className={`g-pr-target${hit ? ' hit' : ''}`}>
        <line x1={X(tx - w)} x2={X(tx + w)} y1={Y(ty) - 1.5} y2={Y(ty) - 1.5} className="g-pr-pad" />
        <line x1={X(tx)} x2={X(tx)} y1={Y(ty) - 2} y2={Y(ty) - 30} className="g-pr-pole" />
        <motion.path
          d={`M${X(tx)} ${Y(ty) - 30} l16 5 l-16 5 z`}
          className="g-pr-flag"
          animate={hit ? { scale: [1, 1.4, 1] } : undefined}
          style={{ originX: 0, originY: 0.5 }}
          transition={{ duration: 0.5 }}
        />
      </g>

      <g clipPath={`url(#cl${uid})`}>
        {/* earlier shots */}
        {done.map((s, k) => (
          <g key={k} className={`g-pr-old${s.outcome === 'hit' ? ' hit' : ''}`}>
            <path d={pathD(s.path, X, Y)} />
            {s.end.x <= xMax && <path d={`M${X(s.end.x) - 4} ${Y(s.end.y) - 4} l8 8 m0 -8 l-8 8`} className="g-pr-cross" />}
          </g>
        ))}
        {solution && (
          <motion.path d={pathD(solution.path, X, Y)} className="g-pr-solution" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
        )}
        {/* flying shot */}
        {flying && (
          <>
            <path d={pathD(visible, X, Y)} className={`g-pr-trail${flying.outcome === 'hit' && progress >= 1 ? ' hit' : ''}`} />
            {head && <circle cx={X(head.x)} cy={Y(head.y)} r="4.5" className="g-pr-ball" />}
          </>
        )}
      </g>
      {/* landing far off the view */}
      {[...done, ...(flying && progress >= 1 ? [flying] : [])].slice(-1).map((s) =>
        s.end.x > xMax ? (
          <text key="off" x={W - 4} y={TOP + 12} textAnchor="end" className="g-pr-offlbl">
            → {cz(s.end.x)} m
          </text>
        ) : null,
      )}

      {/* launcher */}
      <g className="g-pr-launcher">
        {task.fixedAngle === undefined && (
          <line
            x1={px}
            y1={py}
            x2={px + vecLen * Math.cos((aim.angle * Math.PI) / 180)}
            y2={py - vecLen * Math.sin((aim.angle * Math.PI) / 180)}
            className="g-pr-vec"
            markerEnd={`url(#ah${uid})`}
          />
        )}
        <g style={{ transform: `rotate(${-aim.angle}deg)`, transformOrigin: `${px}px ${py}px`, transition: 'transform 0.2s ease-out' }}>
          <rect x={px - 3} y={py - 4} width="22" height="8" rx="3" className="g-pr-barrel" />
        </g>
        <circle cx={px} cy={py + 1} r="6.5" className="g-pr-wheel" />
        <circle cx={px} cy={py + 1} r="1.6" className="g-pr-hub" />
      </g>
    </svg>
  )
}

function Backdrop({ body }: { body: ThrowTask['body']['id'] }) {
  switch (body) {
    case 'mesic':
      return (
        <g className="g-pr-decor">
          <circle cx="300" cy="40" r="16" />
          <path d="M288 34c8 2 16 0 22-6M286 46c10 2 20 0 28-8" />
          {[
            [60, 30],
            [140, 22],
            [210, 50],
            [250, 18],
            [110, 60],
          ].map(([x, y]) => (
            <path key={`${x}`} d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} />
          ))}
          <ellipse cx="120" cy={GROUND + 4} rx="18" ry="3" />
          <ellipse cx="250" cy={GROUND + 6} rx="12" ry="2.5" />
        </g>
      )
    case 'mars':
      return (
        <g className="g-pr-decor">
          <path d={`M0 ${GROUND - 26} q60 -30 120 -6 q50 18 110 -12 q60 -26 130 4`} />
          <circle cx="310" cy="36" r="9" />
        </g>
      )
    case 'jupiter':
      return (
        <g className="g-pr-decor">
          {[30, 58, 92, 128].map((y, k) => (
            <path key={y} d={`M0 ${y} q90 ${k % 2 ? 8 : -8} 180 0 t180 0`} />
          ))}
          <ellipse cx="270" cy="75" rx="22" ry="9" />
        </g>
      )
    default:
      return (
        <g className="g-pr-decor">
          <path d={`M0 ${GROUND - 18} q70 -26 140 -4 q60 16 120 -10 q50 -18 100 6`} />
          <circle cx="316" cy="34" r="12" />
          <path d="M60 40q8-10 18-2q10-8 18 2q8 0 6 8h-44q-4-8 2-8z" />
        </g>
      )
  }
}

/** Newton's cannon: a planet with a launcher on top; after the answer the satellite flies. */
export function OrbitScene({ task, tried, reveal }: { task: OrbitTask; tried: number | null; reveal: boolean }) {
  const uid = useId().replace(/:/g, '')
  const cx = 180
  const cy = 128
  const r = 70
  const top = cy - r - 12
  const fate = tried !== null ? orbitFate(task.body, tried) : null
  const v1 = orbitalVelocity(task.body)
  const orbitR = r + 12
  return (
    <svg
      className={`g-pr-orbit g-pr-body-${task.body.id}`}
      viewBox="0 0 360 250"
      role="img"
      aria-label={`${task.body.name}: koule o poloměru ${cz(task.body.R / 1000, 0)} km, na vrcholu hory dělo, které střílí vodorovně.${reveal ? ` Družice rychlostí ${cz(v1 / 1000, 2)} km/s obíhá po kružnici těsně nad povrchem.` : ''}`}
    >
      <defs>
        <pattern id={`ph${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="g-pr-hatchline" />
        </pattern>
      </defs>
      <circle cx={cx} cy={cy} r={r} className="g-pr-planet" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#ph${uid})`} className="g-pr-planet-hatch" />
      {task.body.id === 'jupiter' &&
        [-40, -14, 12, 38].map((dy) => (
          <path key={dy} d={`M${cx - Math.sqrt(r * r - dy * dy)} ${cy + dy} q${r} ${dy > 0 ? 8 : -8} ${2 * Math.sqrt(r * r - dy * dy)} 0`} className="g-pr-band" />
        ))}
      <path d={`M${cx - 12} ${cy - r + 3} L${cx} ${top} L${cx + 12} ${cy - r + 3}`} className="g-pr-mountain" />
      <rect x={cx - 2} y={top - 5} width="16" height="6" rx="2.5" className="g-pr-barrel" />
      <circle cx={cx} cy={top} r="3.5" className="g-pr-wheel" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="g-pr-planetlbl">
        {task.body.name}
      </text>
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} className="g-pr-radius" />
      <text x={cx + r / 2} y={cy + 16} textAnchor="middle" className="g-pr-dimlbl">
        R
      </text>
      {reveal && fate && fate !== 'circle' && <FatePath fate={fate} cx={cx} cy={cy} r={r} top={top} />}
      {reveal && (
        <>
          <motion.path
            d={`M${cx} ${cy - orbitR} A${orbitR} ${orbitR} 0 1 1 ${cx - 0.01} ${cy - orbitR}`}
            className="g-pr-orbitpath"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'linear' }}
          />
          <g className="g-pr-sat" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy - orbitR} r="5" className="g-pr-ball" />
          </g>
          <motion.text x={cx} y={20} textAnchor="middle" className="g-pr-orbitlbl" variants={popIn} initial="hidden" animate="show">
            v = {cz(v1 / 1000, 2)} km/s
          </motion.text>
        </>
      )}
    </svg>
  )
}

function FatePath({ fate, cx, cy, r, top }: { fate: 'fall' | 'ellipse' | 'escape'; cx: number; cy: number; r: number; top: number }) {
  const d =
    fate === 'fall'
      ? `M${cx} ${top} Q${cx + r * 0.9} ${top + 6} ${cx + r * 0.78} ${cy - r * 0.62}`
      : fate === 'ellipse'
        ? `M${cx} ${top} C${cx + r * 2.2} ${top} ${cx + r * 2.2} ${cy + r + 30} ${cx} ${cy + r + 30} C${cx - r * 1.6} ${cy + r + 30} ${cx - r * 1.6} ${top} ${cx} ${top}`
        : `M${cx} ${top} C${cx + r * 1.4} ${top} ${cx + r * 2} ${cy} 356 ${cy + 60}`
  return <motion.path d={d} className="g-pr-fate" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
}
