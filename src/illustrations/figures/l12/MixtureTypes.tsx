import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Board, Mini, riseV, rng, useFigId, useHatch } from './kit'

const C = 60
const R = 50

type P = { x: number; y: number; r: number }

/** Non-overlapping random discs inside the lens. `bias` > 1 pushes them to the bottom. */
function scatter(seed: number, n: number, rMin: number, rMax: number, bias = 1, gap = 1.5): P[] {
  const rand = rng(seed)
  const out: P[] = []
  for (let tries = 0; out.length < n && tries < 4000; tries++) {
    const r = rMin + rand() * (rMax - rMin)
    const x = C - R + r + rand() * (2 * R - 2 * r)
    const y = C - R + r + Math.pow(rand(), 1 / bias) * (2 * R - 2 * r)
    if (Math.hypot(x - C, y - C) > R - r - 1) continue
    if (out.some((p) => Math.hypot(p.x - x, p.y - y) < p.r + r + gap)) continue
    out.push({ x, y, r })
  }
  return out
}

function grain(p: P, i: number) {
  const k = 5 + (i % 3)
  const pts: string[] = []
  const rand = rng(i * 17 + 3)
  for (let j = 0; j < k; j++) {
    const a = (j / k) * Math.PI * 2 + rand() * 0.5
    const rr = p.r * (0.7 + rand() * 0.4)
    pts.push(`${(p.x + Math.cos(a) * rr).toFixed(1)},${(p.y + Math.sin(a) * rr).toFixed(1)}`)
  }
  return <polygon key={i} className="f12-grain f12-jig" points={pts.join(' ')} />
}

/** Round magnifier lens with a clipped scene inside. */
function Lens({ bg, children }: { bg: 'liquid' | 'gas' | 'metal'; children: ReactNode }) {
  const id = useFigId()
  const h = useHatch()
  return (
    <Mini w={120} h={120}>
      <defs>
        <clipPath id={id}>
          <circle cx={C} cy={C} r={R} />
        </clipPath>
      </defs>
      <circle cx={C} cy={C} r={R} className={`f12-lens-${bg}`} />
      <g clipPath={`url(#${id})`}>
        {bg === 'liquid' && <rect x={0} y={0} width={120} height={120} fill={h('h')} className="f12-hatch" />}
        {bg === 'gas' && <rect x={0} y={0} width={120} height={120} fill={h('s')} className="f12-hatch f12-faint" />}
        {children}
        <path className="f12-hatch" d={`M${C + R * 0.2} ${C + R} A${R} ${R} 0 0 0 ${C + R} ${C + R * 0.1} A${R * 1.1} ${R * 1.1} 0 0 1 ${C + R * 0.2} ${C + R}`} fill={h('d')} />
      </g>
      <motion.circle
        cx={C}
        cy={C}
        r={R}
        className="f12-lens-ring"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.8 } } }}
      />
      <circle cx={C} cy={C} r={R + 4} className="f12-thin" />
      <path className="f12-shine" d={`M${C - R * 0.7} ${C - R * 0.35} A${R * 0.8} ${R * 0.8} 0 0 1 ${C - R * 0.3} ${C - R * 0.72}`} />
    </Mini>
  )
}

const Suspension = () => (
  <Lens bg="liquid">
    <g>{scatter(11, 26, 2.5, 6, 2.6).map(grain)}</g>
  </Lens>
)

const Emulsion = () => (
  <Lens bg="liquid">
    {scatter(23, 22, 3, 9).map((p, i) => (
      <g key={i} className="f12-jig">
        <circle className="f12-oil" cx={p.x} cy={p.y} r={p.r} />
        <path className="f12-shine" d={`M${p.x - p.r * 0.5} ${p.y - p.r * 0.2} A${p.r * 0.55} ${p.r * 0.55} 0 0 1 ${p.x - p.r * 0.1} ${p.y - p.r * 0.55}`} />
      </g>
    ))}
  </Lens>
)

const Foam = () => (
  <Lens bg="liquid">
    {scatter(5, 30, 5, 14, 1, 0.6).map((p, i) => (
      <g key={i} className="f12-jig">
        <circle className="f12-foam" cx={p.x} cy={p.y} r={p.r} />
        <path className="f12-thin" d={`M${p.x - p.r * 0.55} ${p.y - p.r * 0.25} A${p.r * 0.6} ${p.r * 0.6} 0 0 1 ${p.x - p.r * 0.15} ${p.y - p.r * 0.6}`} opacity={0.6} />
      </g>
    ))}
  </Lens>
)

const Aerosol = () => (
  <Lens bg="gas">
    {scatter(41, 16, 1.5, 3.2).map((p, i) => (
      <circle key={i} className="f12-drop f12-drift" cx={p.x} cy={p.y} r={p.r} />
    ))}
    {scatter(42, 14, 1.8, 3.2)
      .map((p, i) => grain(p, i + 100))}
  </Lens>
)

const Smoke = () => (
  <Lens bg="gas">
    {scatter(7, 34, 1.4, 3.6).map((p, i) => grain({ ...p, r: p.r }, i + 50))}
  </Lens>
)

const Fog = () => (
  <Lens bg="gas">
    {scatter(19, 36, 1.8, 4.2).map((p, i) => (
      <circle key={i} className="f12-drop f12-drift" cx={p.x} cy={p.y} r={p.r} style={{ animationDelay: `${-(i % 7) * 0.5}s` }} />
    ))}
  </Lens>
)

function Alloy() {
  const rand = rng(99)
  const atoms: ReactNode[] = []
  const d = 13
  for (let row = -5; row <= 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const x = C + col * d + (row % 2 ? d / 2 : 0)
      const y = C + row * d * 0.87
      if (Math.hypot(x - C, y - C) > R + 6) continue
      const zn = rand() < 0.35
      atoms.push(<circle key={`${row}-${col}`} className={`f12-atom ${zn ? 'f12-Zn' : 'f12-Cu'} f12-jig`} cx={x} cy={y} r={zn ? 6.3 : 6} />)
    }
  }
  return <Lens bg="metal">{atoms}</Lens>
}

const ITEMS: { name: string; kind: string; what: string; ex: string; draw: () => ReactNode }[] = [
  { name: 'suspenze', kind: 'různorodá', what: 'pevná látka v kapalině', ex: 'bahnitá voda', draw: Suspension },
  { name: 'emulze', kind: 'různorodá', what: 'kapalina v kapalině', ex: 'mléko, majonéza', draw: Emulsion },
  { name: 'pěna', kind: 'různorodá', what: 'plyn v kapalině', ex: 'šlehačka', draw: Foam },
  { name: 'aerosol', kind: 'různorodá', what: 'částice v plynu', ex: 'sprej (dým + mlha)', draw: Aerosol },
  { name: 'dým', kind: 'různorodá', what: 'pevná látka v plynu', ex: 'kouř z komína', draw: Smoke },
  { name: 'mlha', kind: 'různorodá', what: 'kapalina v plynu', ex: 'oblak, opar', draw: Fog },
  { name: 'slitina', kind: 'stejnorodá', what: 'kov v kovu', ex: 'mosaz (Cu + Zn)', draw: Alloy },
]

export default function MixtureTypes() {
  return (
    <Board
      level={1}
      max={660}
      grid="f12-mix"
      label={`Druhy směsí pod lupou: ${ITEMS.map((i) => `${i.name} – ${i.what}, například ${i.ex} (${i.kind} směs)`).join('; ')}.`}
    >
      {ITEMS.map((it) => (
        <motion.div className="f12-cell" key={it.name} variants={riseV(0)}>
          <it.draw />
          <span className="f12-kind">{it.kind}</span>
          <p className="f12-cap">{it.name}</p>
          <p className="f12-note">
            {it.what}
            <br />
            <i>{it.ex}</i>
          </p>
        </motion.div>
      ))}
    </Board>
  )
}
