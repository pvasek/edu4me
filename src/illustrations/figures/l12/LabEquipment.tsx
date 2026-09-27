import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Board, Draw, Flame, Hx, Liquid, Mini, riseV, useHatch } from './kit'

/** Graduation ticks on the right side of a vessel. */
function Ticks({ x, y0, y1, step, long = 3 }: { x: number; y0: number; y1: number; step: number; long?: number }) {
  const out: ReactNode[] = []
  let i = 0
  for (let y = y0; y <= y1 + 0.01; y += step, i++) {
    out.push(<line key={y} className="f12-hair" x1={x} y1={y} x2={x - (i % long === 0 ? 8 : 4.5)} y2={y} />)
  }
  return <g>{out}</g>
}

export function Beaker() {
  return (
    <>
      <path className="f12-glass" d="M27 44 L27 106 Q27 110 31 110 L69 110 Q73 110 73 106 L73 42 L27 42 Z" />
      <Liquid d="M27.8 72 L72.2 72 L72.2 106 Q72.2 109.2 69 109.2 L31 109.2 Q27.8 109.2 27.8 106 Z" />
      <Ticks x={66} y0={52} y1={98} step={11.5} long={2} />
      <Draw d="M21 36.5 Q25.5 38 27 44 L27 106 Q27 110 31 110 L69 110 Q73 110 73 106 L73 41 Q73 38.5 76 38 M21 36.5 Q27 36 29 38.5 L73 38.5" />
      <path className="f12-shine" d="M32 50 L32 100" opacity={0.5} />
    </>
  )
}

export function Erlenmeyer() {
  return (
    <>
      <path className="f12-glass" d="M44 22 L44 44 L23 104 Q21 110 28 110 L72 110 Q79 110 77 104 L56 44 L56 22 Z" />
      <Liquid d="M31.4 80 L68.6 80 L76.3 102 Q77.8 108.5 72 108.5 L28 108.5 Q22.2 108.5 23.7 102 Z" delay={0.35} />
      <Draw d="M44 22 L44 44 L23 104 Q21 110 28 110 L72 110 Q79 110 77 104 L56 44 L56 22 M41.5 19 L58.5 19 L58.5 22.5 L41.5 22.5 Z" />
      <path className="f12-shine" d="M40 58 L30 90" opacity={0.5} />
    </>
  )
}

export function TestTube() {
  return (
    <>
      <path className="f12-glass" d="M42 16 L42 98 A8 8 0 0 0 58 98 L58 16 Z" />
      <Liquid d="M42.8 76 L57.2 76 L57.2 98 A7.2 7.2 0 0 1 42.8 98 Z" delay={0.4} tone="color-mix(in srgb, var(--pink) 30%, var(--surface))" />
      <Draw d="M42 16 L42 98 A8 8 0 0 0 58 98 L58 16 M39.5 13 Q42 14 42 17 M60.5 13 Q58 14 58 17" />
      <path className="f12-shine" d="M45.5 24 L45.5 94" opacity={0.55} />
    </>
  )
}

export function Cylinder() {
  return (
    <>
      <path className="f12-glass" d="M40 12 L40 100 L60 100 L60 12 Z" />
      <Liquid d="M40.8 50 Q50 55 59.2 50 L59.2 99.2 L40.8 99.2 Z" delay={0.4} />
      <Ticks x={58} y0={20} y1={96} step={6.33} long={3} />
      <Hx d="M24 100 L76 100 L78 110 L22 110 Z" kind="x" tone="var(--f12-metal)" className="f12-thin" />
      <Draw d="M36 9 Q39.5 10 40 14 L40 100 M60 100 L60 12 Q60 9.5 62 9.5 M36 9 L62 9.5" />
      <path className="f12-shine" d="M43.5 18 L43.5 96" opacity={0.55} />
    </>
  )
}

export function Pipette() {
  return (
    <>
      <path className="f12-glass" d="M47.5 4 L47.5 36 Q39 40 39 52 Q39 64 47.5 68 L48.6 106 L50 112 L51.4 106 L52.5 68 Q61 64 61 52 Q61 40 52.5 36 L52.5 4 Z" />
      <Liquid d="M48.3 26 L51.7 26 L51.7 36.8 Q60.2 41 60.2 52 Q60.2 63.4 51.7 67.4 L50.7 105.5 L50 110 L49.3 105.5 L48.3 67.4 Q39.8 63.4 39.8 52 Q39.8 41 48.3 36.8 Z" delay={0.45} />
      <Draw d="M47.5 4 L47.5 36 Q39 40 39 52 Q39 64 47.5 68 L48.6 106 L50 112 L51.4 106 L52.5 68 Q61 64 61 52 Q61 40 52.5 36 L52.5 4" />
      <path className="f12-line" d="M44.5 26 L55.5 26" />
      <path className="f12-shine" d="M43 46 Q42.5 52 44 58" opacity={0.6} />
    </>
  )
}

export function Burette() {
  return (
    <>
      <path className="f12-glass" d="M45 4 L45 88 L55 88 L55 4 Z" />
      <Liquid d="M45.8 20 L54.2 20 L54.2 88 L45.8 88 Z" delay={0.4} tone="color-mix(in srgb, var(--violet) 26%, var(--surface))" />
      <Ticks x={54} y0={10} y1={84} step={4.6} long={4} />
      <Draw d="M45 4 L45 88 L48 92 L48 98 L49.2 108 L50 111 L50.8 108 L52 98 L52 92 L55 88 L55 4" />
      <Hx d="M44 92 L56 92 L56 98 L44 98 Z" kind="x" tone="var(--f12-metal)" className="f12-thin" />
      <path className="f12-line" d="M36 95 L44 95 M56 95 L64 95" />
      <circle className="f12-line" cx={34} cy={95} r={2.5} />
    </>
  )
}

export function Funnel() {
  return (
    <>
      <path className="f12-glass" d="M20 30 L80 30 L54 68 L46 68 Z" />
      <path className="f12-glass" d="M46 68 L54 68 L53 104 L47 108 Z" />
      <Draw d="M18 28 L82 28 L82 31 L55 69 L53.5 104 L46.5 110 L46 69 L18 31 Z" />
      <path className="f12-hair" d="M26 33 L49 65 M74 33 L51 65" />
      <path className="f12-shine" d="M28 34 L46 60" opacity={0.6} />
      <motion.circle
        className="f12-liq"
        cx={47}
        cy={113}
        r={1.8}
        style={{ fill: 'var(--f12-water-2)' }}
        variants={{ hidden: { opacity: 0, y: -4 }, show: { opacity: [0, 1, 1, 0], y: [-4, -4, 6, 8], transition: { duration: 1.4, delay: 1.1, repeat: 2, repeatDelay: 0.6 } } }}
      />
    </>
  )
}

export function Burner() {
  return (
    <>
      <Flame x={50} y={46} h={36} kind="blue" />
      <Hx d="M44 48 L56 48 L56 100 L44 100 Z" kind="d" tone="var(--f12-metal)" className="f12-line" />
      <Hx d="M42.5 82 L57.5 82 L57.5 92 L42.5 92 Z" kind="x" tone="var(--f12-metal-2)" className="f12-line" />
      <rect className="f12-line" x={47} y={85} width={6} height={4} rx={1} style={{ fill: 'var(--surface)' }} />
      <Hx d="M56 95 L78 94 L80 99 L56 99 Z" kind="d" tone="var(--f12-metal)" className="f12-thin" />
      <Hx d="M30 100 L70 100 L76 110 L24 110 Z" kind="x" tone="var(--f12-metal)" className="f12-line" />
      <Draw d="M44 48 L44 100 M56 100 L56 48 M42.5 48 L57.5 48" />
    </>
  )
}

export function Stand() {
  const h = useHatch()
  return (
    <>
      <Hx d="M12 102 L88 102 L88 110 L12 110 Z" kind="x" tone="var(--f12-metal)" className="f12-line" />
      <path className="f12-line" d="M30 8 L34 8 L34 102 L30 102 Z" style={{ fill: 'var(--f12-metal-2)' }} />
      <path className="f12-glass f12-thin" d="M70 18 L80 18 L80 74 A5 5 0 0 1 70 74 Z" />
      <Hx d="M26 34 L38 34 L38 46 L26 46 Z" kind="x" tone="var(--f12-metal-2)" className="f12-line" />
      <path className="f12-line" d="M38 40 L66 40" />
      <path className="f12-line" d="M66 33 Q70 30 70 36 L70 44 Q70 50 66 47 M84 33 Q80 30 80 36 L80 44 Q80 50 84 47" style={{ fill: 'var(--f12-wood)' }} />
      <path className="f12-hatch" d="M66 33 Q70 30 70 36 L70 44 Q70 50 66 47 Z" fill={h('d')} />
      <circle className="f12-line" cx={39.5} cy={32} r={3} style={{ fill: 'var(--f12-metal)' }} />
      <Draw d="M30 8 L34 8 L34 102 L30 102 Z" />
    </>
  )
}

export function Mortar() {
  const h = useHatch()
  return (
    <>
      <path className="f12-line" d="M52 66 L78 22 A5 5 0 0 1 86 27 L59 70 Z" style={{ fill: 'var(--f12-porcelain, var(--surface))' }} />
      <path className="f12-porcelain f12-line" d="M18 58 L82 58 Q80 96 60 102 L40 102 Q20 96 18 58 Z" />
      <path className="f12-hatch" d="M60 60 L82 58 Q80 96 60 102 Z" fill={h('d')} />
      <path className="f12-porcelain f12-line" d="M40 102 L60 102 L64 110 L36 110 Z" />
      <path className="f12-hatch" d="M55 102 L60 102 L64 110 L58 110 Z" fill={h('x')} />
      <ellipse className="f12-line" cx={50} cy={58} rx={32} ry={4} style={{ fill: 'var(--surface)' }} />
      <path className="f12-thin" d="M50 54 L60 40" />
      <path className="f12-line" d="M53 58 L62 45 A4.5 4.5 0 0 1 69.5 49.5 L62 61" style={{ fill: 'var(--surface)' }} />
      <Draw d="M18 58 Q20 96 40 102 L60 102 Q80 96 82 58" />
    </>
  )
}

export function Dish() {
  const h = useHatch()
  return (
    <>
      <path className="f12-porcelain f12-line" d="M12 76 L88 76 Q86 98 62 104 L38 104 Q14 98 12 76 Z" />
      <path className="f12-hatch" d="M66 76 L88 76 Q86 98 62 104 Z" fill={h('d')} />
      <ellipse className="f12-line" cx={50} cy={76} rx={38} ry={5} style={{ fill: 'var(--surface)' }} />
      <path className="f12-line" d="M8 74.5 Q10 72 14 74" />
      <path className="f12-porcelain f12-line" d="M40 104 L60 104 L62 110 L38 110 Z" />
      <g className="f12-crys">
        <path className="f12-thin" d="M40 77 l3 -3 l3 3 l-3 2 Z M50 78 l2.5 -3.5 l3 2 l-2 3 Z M58 76.5 l3 -2 l2 3 l-3 1.5 Z" style={{ fill: 'var(--surface-2)' }} />
      </g>
      <Draw d="M12 76 Q14 98 38 104 L62 104 Q86 98 88 76" />
    </>
  )
}

export function WatchGlass() {
  return (
    <>
      <path className="f12-glass" d="M10 90 Q50 118 90 90 Q50 102 10 90 Z" />
      <ellipse className="f12-glass f12-line" cx={50} cy={90} rx={40} ry={7} />
      <path className="f12-thin" d="M46 90 l3 -4 l4 2 l-1 3 Z M56 91 l2 -3 l3 1 l-1 3 Z M40 91.5 l2 -2 l2 1.5 Z" style={{ fill: 'color-mix(in srgb, var(--yellow) 45%, var(--surface))' }} />
      <path className="f12-shine" d="M18 93 Q30 100 42 101" opacity={0.6} />
      <Draw d="M10 90 Q50 118 90 90" />
    </>
  )
}

export function WashBottle() {
  return (
    <>
      <path className="f12-glass" d="M30 52 Q30 42 40 40 L60 40 Q70 42 70 52 L70 104 Q70 110 64 110 L36 110 Q30 110 30 104 Z" />
      <Liquid d="M30.8 72 L69.2 72 L69.2 104 Q69.2 109.2 64 109.2 L36 109.2 Q30.8 109.2 30.8 104 Z" />
      <Hx d="M41 31 L59 31 L59 40 L41 40 Z" kind="x" tone="var(--f12-metal)" className="f12-line" />
      <path className="f12-line" d="M48 31 L48 16 Q48 9 56 9 L78 9 L85 17 M52 31 L52 18 Q52 13 57 13 L76 13 L82 20" />
      <circle cx={86} cy={24} r={1.8} style={{ fill: 'var(--f12-water-2)' }} />
      <Draw d="M30 52 Q30 42 40 40 L60 40 Q70 42 70 52 L70 104 Q70 110 64 110 L36 110 Q30 110 30 104 Z" />
      <path className="f12-shine" d="M35 56 L35 100" opacity={0.5} />
    </>
  )
}

export function TubeHolder() {
  const h = useHatch()
  return (
    <>
      <path className="f12-line" d="M8 72 L62 60 L64 66 L10 78 Z" style={{ fill: 'var(--f12-wood)' }} />
      <path className="f12-hatch" d="M8 72 L62 60 L64 66 L10 78 Z" fill={h('d')} />
      <path className="f12-line" d="M58 58 Q70 50 82 54 L84 60 Q72 58 64 66" style={{ fill: 'var(--f12-metal)' }} />
      <path className="f12-line" d="M62 68 Q72 74 84 70 L84 64" />
      <path className="f12-glass" d="M72 34 L72 96 A6 6 0 0 0 84 96 L84 34 Z" />
      <Draw d="M72 34 L72 96 A6 6 0 0 0 84 96 L84 34" />
      <path className="f12-shine" d="M75 40 L75 92" opacity={0.55} />
    </>
  )
}

export function GlassRod() {
  return (
    <>
      <path className="f12-glass" d="M26 104 L74 14 L78 16 L30 106 Z" />
      <Draw d="M26 104 L74 14 A2.3 2.3 0 0 1 78 16 L30 106 A2.3 2.3 0 0 1 26 104 Z" />
      <path className="f12-shine" d="M34 94 L70 26" opacity={0.6} />
    </>
  )
}

export function WireGauze() {
  const h = useHatch()
  return (
    <>
      <path className="f12-line" d="M10 70 L60 56 L90 70 L40 84 Z" style={{ fill: 'var(--f12-metal)' }} />
      <path className="f12-hatch" d="M10 70 L60 56 L90 70 L40 84 Z" fill={h('x')} />
      <ellipse className="f12-line" cx={50} cy={70} rx={20} ry={7} style={{ fill: 'var(--surface-2)' }} />
      <path className="f12-hatch" d="M30 70 A20 7 0 0 0 70 70 A20 7 0 0 0 30 70 Z" fill={h('s')} />
      <Draw d="M10 70 L60 56 L90 70 L40 84 Z" />
      <path className="f12-thin" d="M14 74 L14 110 M86 74 L86 110 M40 88 L40 112" />
    </>
  )
}

const ITEMS: { name: string; use: string; draw: () => ReactNode }[] = [
  { name: 'kádinka', use: 'míchání, ohřívání, přelévání', draw: Beaker },
  { name: 'Erlenmeyerova baňka', use: 'míchání a titrace', draw: Erlenmeyer },
  { name: 'zkumavka', use: 'malé pokusy, zahřívání', draw: TestTube },
  { name: 'odměrný válec', use: 'odměření objemu', draw: Cylinder },
  { name: 'pipeta', use: 'malý přesný objem', draw: Pipette },
  { name: 'byreta', use: 'přesné dávkování, titrace', draw: Burette },
  { name: 'nálevka', use: 'přelévání a filtrace', draw: Funnel },
  { name: 'kahan', use: 'zdroj plamene', draw: Burner },
  { name: 'stojan s držákem', use: 'upevnění aparatury', draw: Stand },
  { name: 'třecí miska s tloučkem', use: 'drcení látek', draw: Mortar },
  { name: 'odpařovací miska', use: 'odpařování roztoků', draw: Dish },
  { name: 'hodinové sklo', use: 'vážení, sušení, zakrytí', draw: WatchGlass },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export default function LabEquipment() {
  return (
    <Board
      level={1}
      max={640}
      label={`Tabule laboratorních pomůcek: ${ITEMS.map((i) => `${i.name} (${i.use})`).join(', ')}.`}
      grid="f12-lab"
    >
        {ITEMS.map((it, i) => (
          <motion.div className="f12-cell" key={it.name} variants={riseV(0)}>
            <Mini w={100} h={118}><it.draw /></Mini>
            <span className="f12-cap-no">{ROMAN[i]}.</span>
            <p className="f12-cap">{it.name}</p>
            <p className="f12-note">{it.use}</p>
          </motion.div>
        ))}
    </Board>
  )
}
