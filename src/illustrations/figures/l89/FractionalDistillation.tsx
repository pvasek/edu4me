import type { CSSProperties } from 'react'
import { Draw, Fade, Figure, Grow, Lbl, Plate, Pop, ChemText, useHatch } from './kit'

const LABEL =
  'Frakční destilace ropy v rafinérské koloně: ropa se zahřeje v peci asi na 400 °C a její páry vstupují do spodní části vysoké kolony s patry a kloboučky. Nahoře je chladno, dole horko. Nahoře se odvádí rafinérský plyn C1–C4 pod 30 °C, níže benzin C5–C10 30–180 °C, petrolej C10–C16 180–250 °C, motorová nafta (plynový olej) C14–C20 250–350 °C a dole zbývá mazut nad C20 a nad 350 °C, ze kterého se vakuovou destilací získávají mazací oleje, parafín a asfalt.'

/** Fractions drawn off at the side of the column (values follow lesson l8-2). */
const FRACTIONS = [
  { y: 30, name: 'rafinérský plyn', c: 'C_{1}–C_{4}', t: 'pod 30 °C', use: 'LPG, topení', color: '#cfe0ea' },
  { y: 120, name: 'benzin', c: 'C_{5}–C_{10}', t: '30–180 °C', use: 'palivo do aut', color: '#f1d67a' },
  { y: 205, name: 'petrolej (kerosin)', c: 'C_{10}–C_{16}', t: '180–250 °C', use: 'letecké palivo', color: '#e3ad4d' },
  { y: 290, name: 'motorová nafta', c: 'C_{14}–C_{20}', t: '250–350 °C', use: 'plynový olej, topný olej', color: '#c27e30' },
  { y: 482, name: 'mazut', c: 'nad C_{20}', t: 'nad 350 °C', use: '', color: '#5b3b22' },
]

const TOWER = { x1: 84, x2: 170, top: 50, bot: 500 }
const TRAYS = [92, 134, 166, 250, 334, 376, 418, 458].concat([208, 292]).sort((a, b) => a - b)

/** Colour of the condensed liquid at a given height (light at the top, dark at the bottom). */
function liquidAt(y: number) {
  if (y < 150) return '#f1d67a'
  if (y < 235) return '#e3ad4d'
  if (y < 330) return '#c27e30'
  if (y < 420) return '#8a5a2b'
  return '#5b3b22'
}

const TEMP = ['#6f9fc9', '#86a9c1', '#a4b3a4', '#c7b27a', '#d69a58', '#d97a45', '#d25a3a', '#c2412f']

export default function FractionalDistillation() {
  return (
    <Figure name="fractional-distillation" level={8} label={LABEL} max={560}>
      <Plate w={460} h={590}>
        <Tower />
      </Plate>
    </Figure>
  )
}

function Tower() {
  const hatch = useHatch()
  const { x1, x2, top, bot } = TOWER
  const cx = (x1 + x2) / 2
  const vapour = Array.from({ length: 14 }, (_, i) => ({
    x: x1 + 12 + ((i * 37) % (x2 - x1 - 24)),
    del: (i * 0.53) % 6,
    dur: 5 + (i % 4),
  }))
  return (
    <>
        {/* temperature scale */}
        <Grow axis="y" origin="50% 100%" dur={1} delay={0.1}>
          {TEMP.map((c, i) => (
            <rect key={c} x={50} y={60 + i * 47.5} width={9} height={47.5} fill={c} />
          ))}
        </Grow>
        <rect x={50} y={60} width={9} height={380} className="f89-thin" />
        <text className="f89-f f89-sm" x={44} y={68} textAnchor="end">25 °C</text>
        <text className="f89-f f89-sm" x={44} y={440} textAnchor="end">350 °C</text>
        <Lbl x={54} y={52} anchor="middle" size={13.5} className="f89-sm">chladno</Lbl>
        <Lbl x={54} y={458} anchor="middle" size={13.5} className="f89-sm">horko</Lbl>

        {/* column body with engraved cylinder shading */}
        <path className="f89-paper" d={`M${x1} ${top + 20} Q${x1} ${top - 8} ${cx} ${top - 8} Q${x2} ${top - 8} ${x2} ${top + 20} V${bot} H${x1} Z`} />
        <rect x={x2 - 20} y={top + 6} width={20} height={bot - top - 6} fill={hatch('d')} className="f89-hatch" />
        {[x1 + 4, x2 - 26, x2 - 30].map((x) => (
          <line key={x} className="f89-thin" x1={x} y1={top + 18} x2={x} y2={bot - 4} style={{ opacity: 0.35 }} />
        ))}

        {/* trays with bubble caps and condensed liquid */}
        {TRAYS.map((y, i) => (
          <Pop key={y} delay={0.5 + (TRAYS.length - i) * 0.05}>
            <rect x={x1 + 2} y={y - 5} width={x2 - x1 - 4} height={5} fill={liquidAt(y)} opacity={0.75} />
            <rect x={x1 + 2} y={y - 5} width={x2 - x1 - 4} height={5} fill={hatch('h')} className="f89-hatch" />
            <line className="f89-ln" x1={x1} y1={y} x2={x2} y2={y} />
            {[0.25, 0.5, 0.75].map((k) => {
              const bx = x1 + (x2 - x1) * k
              return <path key={k} className="f89-thin f89-cap-dome" d={`M${bx - 6} ${y - 1} V${y - 7} Q${bx} ${y - 12} ${bx + 6} ${y - 7} V${y - 1}`} style={{ fill: 'var(--surface)' }} />
            })}
            {/* downcomer, alternating sides */}
            <line className="f89-thin" x1={i % 2 ? x1 + 7 : x2 - 7} y1={y} x2={i % 2 ? x1 + 7 : x2 - 7} y2={y + 20} />
          </Pop>
        ))}

        {/* rising vapour (ambient loop) */}
        <g aria-hidden="true">
          {vapour.map((v, i) => (
            <circle
              key={i}
              className="f89-rise"
              cx={v.x}
              cy={bot - 50}
              r={2.2}
              fill="var(--muted)"
              style={{ '--rise': `-${bot - top - 80}px`, '--del': `${v.del}s`, '--dur': `${v.dur}s` } as CSSProperties}
            />
          ))}
        </g>

        <Draw d={`M${x1} ${top + 20} Q${x1} ${top - 8} ${cx} ${top - 8} Q${x2} ${top - 8} ${x2} ${top + 20} V${bot} H${x1} Z`} dur={1} />
        {/* skirt */}
        <rect x={x1 - 6} y={bot} width={x2 - x1 + 12} height={14} className="f89-box" />
        <rect x={x1 - 6} y={bot} width={x2 - x1 + 12} height={14} fill={hatch('x')} className="f89-hatch" />
        <line className="f89-ln" x1={0} y1={bot + 14} x2={200} y2={bot + 14} />

        {/* furnace */}
        <g>
          <rect x={8} y={466} width={60} height={48} className="f89-box" />
          <rect x={8} y={466} width={60} height={48} fill={hatch('x')} className="f89-hatch" />
          <rect x={22} y={484} width={30} height={22} rx={2} style={{ fill: 'var(--surface)' }} className="f89-thin" />
          <path d="M37 505 C44 497 43 490 37 484 C38 492 31 494 33 499 C30 497 30 492 31 490 C27 496 29 503 37 505Z" fill="#f08c2b" stroke="#c4561a" strokeWidth={0.9} />
          <path d="M37 505 C40 500 39 496 37 493 C36 497 34 500 37 505Z" fill="#ffd166" />
          {/* hot vapour out to the column */}
          <path className="f89-lvstroke" d="M68 476 H84" />
          <polygon points="86,476 79,472 79,480" className="f89-lvfill" />
          <Lbl x={44} y={532} anchor="middle" size={15}>pec</Lbl>
          <text className="f89-f f89-sm" x={44} y={548} textAnchor="middle">≈ 400 °C</text>
        </g>
        {/* crude oil in */}
        <path className="f89-ln" d="M14 580 V520" />
        <polygon points="14,514 10,522 18,522" fill="var(--edge)" />
        <Lbl x={22} y={582} size={15} className="f89-b">ropa</Lbl>
        <Lbl x={cx} y={490} anchor="middle" size={13} className="f89-sm" sec>
          páry ropy
        </Lbl>

        {/* draw-offs: from the bottom up */}
        {FRACTIONS.map((f, i) => {
          const delay = 0.9 + (FRACTIONS.length - 1 - i) * 0.18
          const isGas = i === 0
          const d = isGas ? `M${cx} ${top - 8} V${f.y} H206` : `M${x2} ${f.y} H206`
          return (
            <g key={f.name}>
              <Draw d={d} delay={delay} dur={0.4} className="f89-ln f89-pipe" />
              <Fade delay={delay + 0.3}>
                <polygon points={`206,${f.y} 199,${f.y - 4} 199,${f.y + 4}`} fill="var(--edge)" />
                {/* sample vial */}
                <rect x={210} y={f.y - 9} width={13} height={18} rx={3} fill={f.color} stroke="var(--edge)" strokeWidth={1.1} />
                <rect x={210} y={f.y - 9} width={13} height={6} rx={2} style={{ fill: 'var(--surface)' }} stroke="var(--edge)" strokeWidth={0.8} />
                <text className="f89-lb f89-b" x={230} y={f.y + 1}>{f.name}</text>
                <text className="f89-f f89-sm" x={230} y={f.y + 17}>
                  <ChemText text={`${f.c} · ${f.t}`} />
                </text>
                {f.use && (
                  <text className="f89-lb f89-sm f89-sec" x={230} y={f.y + 33}>
                    {f.use}
                  </text>
                )}
              </Fade>
            </g>
          )
        })}

        {/* residue → vacuum distillation products */}
        <Fade delay={1.9}>
          <path className="f89-thin" d="M216 494 V548 M216 526 H236 M216 548 H236" />
          <polygon points="240,526 233,522.5 233,529.5" fill="var(--edge)" />
          <polygon points="240,548 233,544.5 233,551.5" fill="var(--edge)" />
          <text className="f89-lb" x={246} y={531}>mazací oleje, parafín</text>
          <text className="f89-lb" x={246} y={553}>asfalt</text>
          <text className="f89-lb f89-sm f89-sec" x={246} y={572}>(vakuová destilace mazutu)</text>
        </Fade>

        <Lbl x={cx} y={534} anchor="middle" size={14} className="f89-sm" sec>
          destilační kolona
        </Lbl>
    </>
  )
}
