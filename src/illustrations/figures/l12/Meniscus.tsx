import type { ReactNode } from 'react'
import { Draw, Fade, Lbl, Liquid, Plate, Pop } from './kit'

const TOP = 70
const BOT = 330
const LEVEL = 200 // 45 ml
const PX_PER_ML = 20

function Eye({ x, y, faded = false }: { x: number; y: number; faded?: boolean }) {
  // looking to the left
  return (
    <g className={faded ? 'f12-eye f12-eye-off' : 'f12-eye'} transform={`translate(${x} ${y})`}>
      <path className="f12-line" d="M-16 0 Q0 -13 18 -6 Q10 0 18 6 Q0 13 -16 0 Z" style={{ fill: 'var(--surface)' }} />
      <circle cx={-5} cy={0} r={6} style={{ fill: 'var(--blue)' }} />
      <circle cx={-6} cy={0} r={2.8} style={{ fill: 'var(--ink)' }} />
      <path className="f12-thin" d="M-14 -5 Q0 -18 20 -10" />
    </g>
  )
}

/** A magnified piece of a graduated cylinder, centred on cx. */
function Tube({ cx, surface, liquid, hg = false }: { cx: number; surface: string; liquid: string; hg?: boolean }) {
  const L = cx - 50
  const R = cx + 50
  const ticks: ReactNode[] = []
  for (let ml = 39; ml <= 51; ml++) {
    const y = LEVEL - (ml - 45) * PX_PER_ML
    if (y < TOP + 6 || y > BOT - 6) continue
    const major = ml % 5 === 0
    ticks.push(<line key={ml} className="f12-tickline" x1={L} y1={y} x2={L + (major ? 30 : 16)} y2={y} />)
    if (major)
      ticks.push(
        <text key={`t${ml}`} className="f12-tick" x={L - 8} y={y + 4} textAnchor="end">
          {ml}
        </text>,
      )
  }
  const wave = (y: number) => `M${L - 6} ${y} q13 -6 28 0 t28 0 t28 0 t28 0`
  return (
    <g>
      <path className="f12-glass" d={`M${L} ${TOP} L${R} ${TOP} L${R} ${BOT} L${L} ${BOT} Z`} />
      {hg ? <Liquid d={liquid} delay={0.3} tone="var(--f12-hg)" kind="x" className="f12-liq f12-hg" /> : <Liquid d={liquid} delay={0.3} />}
      <path className="f12-liq-top" d={surface} />
      {ticks}
      <Draw d={`M${L - 5} ${TOP} L${L - 5} ${BOT} M${R + 5} ${TOP} L${R + 5} ${BOT} M${L} ${TOP} L${L} ${BOT} M${R} ${TOP} L${R} ${BOT}`} dur={0.8} />
      <path className="f12-thin f12-break" d={wave(TOP)} />
      <path className="f12-thin f12-break" d={wave(BOT)} />
      <path className="f12-shine" d={`M${R - 10} ${TOP + 10} L${R - 10} ${BOT - 10}`} opacity={0.5} />
    </g>
  )
}

export default function Meniscus() {
  const W = 150 // water tube centre
  const M = 440 // mercury tube centre
  const wSurf = `M${W - 50} ${LEVEL - 16} Q${W} ${LEVEL + 16} ${W + 50} ${LEVEL - 16}`
  const mSurf = `M${M - 50} ${LEVEL + 12} Q${M} ${LEVEL - 12} ${M + 50} ${LEVEL + 12}`
  return (
    <Plate
      level={1}
      w={620}
      h={380}
      max={640}
      label="Odečítání objemu v odměrném válci (zvětšeno). Oko musí být v úrovni hladiny. Voda tvoří vydutý meniskus a objem se čte u jeho spodního okraje: 45 ml. Rtuť tvoří vypouklý meniskus a čte se u horního okraje. Oko nad hladinou nebo pod ní dává chybný údaj."
    >
      <Fade delay={0}>
        <text className="f12-title" x={W + 20} y={30} textAnchor="middle">
          voda
        </text>
        <text className="f12-small" x={W + 20} y={52} textAnchor="middle">
          vydutý meniskus
        </text>
        <text className="f12-title" x={M + 20} y={30} textAnchor="middle">
          rtuť
        </text>
        <text className="f12-small" x={M + 20} y={52} textAnchor="middle">
          vypouklý meniskus
        </text>
      </Fade>
      <path className="f12-hair f12-dash" d="M315 20 L315 360" />

      <Tube cx={W} surface={wSurf} liquid={`${wSurf} L${W + 50} ${BOT} L${W - 50} ${BOT} Z`} />
      <Tube cx={M} surface={mSurf} liquid={`${mSurf} L${M + 50} ${BOT} L${M - 50} ${BOT} Z`} hg />

      {/* sight lines */}
      <Draw d={`M${W + 76} ${LEVEL} L${W - 58} ${LEVEL}`} className="f12-sight" delay={1.1} dur={0.8} />
      <Draw d={`M${M + 76} ${LEVEL} L${M - 58} ${LEVEL}`} className="f12-sight" delay={1.3} dur={0.8} />
      <Pop delay={0.9}>
        <Eye x={W + 96} y={LEVEL} />
      </Pop>
      <Pop delay={1.1}>
        <Eye x={M + 96} y={LEVEL} />
      </Pop>

      {/* wrong eye (parallax) */}
      <g className="f12-sec">
        <Pop delay={1.8}>
          <Eye x={W + 96} y={LEVEL - 70} faded />
        </Pop>
        <Draw d={`M${W + 78} ${LEVEL - 64} L${W} ${LEVEL} L${W - 36} ${LEVEL + 30}`} className="f12-sight f12-sight-off" delay={2} dur={0.7} />
        <Lbl x={W + 118} y={LEVEL - 92} delay={2.1} line2="odečet je chybný" className="f12-bad-t">
          oko nad hladinou:
        </Lbl>
      </g>

      {/* readings */}
      <Lbl x={W} y={LEVEL + 50} tx={W} ty={LEVEL} anchor="middle" className="f12-lab-strong" delay={1.5} line2="45 ml">
        spodní okraj
      </Lbl>
      <Lbl x={M} y={LEVEL - 42} tx={M} ty={LEVEL} anchor="middle" className="f12-lab-strong f12-lab-on-hg" delay={1.7}>
        horní okraj
      </Lbl>
      <Lbl x={W + 76} y={LEVEL + 34} delay={1.6} sec>
        oko v úrovni hladiny
      </Lbl>
      <text className="f12-small" x={W - 50} y={BOT + 26}>
        ml
      </text>
      <text className="f12-small" x={M - 50} y={BOT + 26}>
        ml
      </text>
    </Plate>
  )
}
