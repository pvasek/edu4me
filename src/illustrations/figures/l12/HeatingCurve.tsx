import { motion } from 'motion/react'
import { Board, Fade, Pop, drawV, rng } from './kit'

/** Heating curve of water: [time, °C] corners (time in arbitrary units of supplied heat). */
const PTS: [number, number][] = [
  [0, -20],
  [1, 0],
  [3.6, 0],
  [6.4, 100],
  [11.8, 100],
  [12.8, 120],
]
const TMAX = 13

type State = 'solid' | 'liquid' | 'gas'

/** Particle-model inset: (x, y) = centre, s = box size. */
function Particles({ x, y, s, state }: { x: number; y: number; s: number; state: State }) {
  const r = s * 0.1
  const h = s / 2
  let pts: [number, number][] = []
  if (state === 'solid') {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) pts.push([(i - 1) * r * 2.15, (j - 1) * r * 2.15 + r * 0.6])
  } else if (state === 'liquid') {
    pts = [
      [-2.2, 2.3],
      [-0.1, 2.3],
      [2.05, 2.3],
      [-1.2, 0.35],
      [0.95, 0.4],
      [-3, 0.7],
      [2.9, 0.5],
    ].map(([a, b]) => [a * r, b * r])
  } else {
    const g = rng(4)
    pts = [
      [-2.6, -2.4],
      [2.2, -1.6],
      [-0.4, 0.6],
      [2.6, 2.4],
      [-2.4, 2.6],
    ].map(([a, b]) => [a * r + (g() - 0.5) * r * 0.3, b * r])
  }
  return (
    <g>
      <rect className="f12-hc-box" x={x - h} y={y - h} width={s} height={s} rx={5} />
      {pts.map(([dx, dy], i) => (
        <g key={i} className="f12-jig">
          <circle className="f12-hc-p" cx={x + dx} cy={y + dy} r={r} />
          {state === 'gas' && <path className="f12-hc-trail" d={`M${x + dx - r * 1.4} ${y + dy + r * 0.6} l${-r * 1.2} ${r * 0.6}`} />}
        </g>
      ))}
    </g>
  )
}

interface Dims {
  w: number
  h: number
  X0: number
  X1: number
  YT: number
  YB: number
  narrow: boolean
}

function Chart({ d }: { d: Dims }) {
  const { X0, X1, YT, YB, narrow } = d
  const sx = (t: number) => X0 + (t / TMAX) * (X1 - X0)
  const sy = (c: number) => YB - ((c + 20) / 140) * (YB - YT)
  const P = PTS.map(([t, c]) => [sx(t), sy(c)] as const)
  const curve = P.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const mid = (i: number) => [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2] as const
  const box = narrow ? 34 : 42
  const ticks = narrow ? [-20, 0, 50, 100, 120] : [-20, 0, 20, 40, 60, 80, 100, 120]
  return (
    <>
      {/* grid + axes */}
      {ticks.map((c) => (
        <g key={c}>
          <line className={c === 0 || c === 100 ? 'f12-hc-ref' : 'f12-grid'} x1={X0} x2={X1} y1={sy(c)} y2={sy(c)} />
          <text className="f12-tick" x={X0 - 8} y={sy(c) + 5} textAnchor="end">
            {String(c).replace('-', '−')}
          </text>
        </g>
      ))}
      <line className="f12-axisline" x1={X0} x2={X1 + 8} y1={YB} y2={YB} />
      <line className="f12-axisline" x1={X0} x2={X0} y1={YB} y2={YT - 16} />
      <text className="f12-t f12-t-strong" x={X0 - 8} y={YT - 24} textAnchor="middle">
        t / °C
      </text>
      <text className="f12-t" x={X1 + 6} y={YB + 26} textAnchor="end">
        čas (dodávané teplo) →
      </text>

      {/* plateaus highlighted under the line */}
      <Fade delay={1.56}>
        <path className="f12-hc-plateau" d={`M${P[1][0]} ${P[1][1]} H${P[2][0]} M${P[3][0]} ${P[3][1]} H${P[4][0]}`} />
      </Fade>
      <motion.path className="f12-hc-curve" d={curve} variants={drawV(0.2, 1.6)} />
      {P.slice(1, 5).map((p, i) => (
        <Pop key={i} delay={0.39 + i * 0.29}>
          <circle className="f12-hc-dot" cx={p[0]} cy={p[1]} r={3.6} />
        </Pop>
      ))}

      {/* segment names */}
      <Fade delay={0.33}>
        <text className="f12-t f12-t-strong" x={P[1][0] + 4} y={P[1][1] + 26}>
          led
        </text>
      </Fade>
      <Fade delay={0.98}>
        <text className="f12-t f12-t-strong" x={mid(2)[0] + 12} y={mid(2)[1] + 10}>
          voda
        </text>
      </Fade>
      <Fade delay={1.69}>
        <text className="f12-t f12-t-strong" x={P[5][0] - 14} y={P[5][1] + 6} textAnchor="end">
          pára
        </text>
      </Fade>

      {/* plateau labels */}
      <Fade delay={0.65}>
        <text className="f12-t f12-hc-lab" x={mid(1)[0]} y={P[1][1] - 30} textAnchor="middle">
          tání
        </text>
        <text className="f12-small" x={mid(1)[0]} y={P[1][1] - 12} textAnchor="middle">
          led + voda
        </text>
      </Fade>
      <Fade delay={1.43}>
        <text className="f12-t f12-hc-lab" x={mid(3)[0]} y={P[3][1] - 26} textAnchor="middle">
          var
        </text>
        <text className="f12-small" x={mid(3)[0]} y={P[3][1] - 10} textAnchor="middle">
          voda + pára
        </text>
      </Fade>

      {/* particle insets */}
      <Pop delay={0.52}>
        <Particles x={X0 + box * 0.5 + 14} y={sy(0) - box * 0.5 - 62} s={box} state="solid" />
      </Pop>
      <Pop delay={1.17}>
        <Particles x={mid(2)[0] + box * 0.5 + 18} y={mid(2)[1] + box + 16} s={box} state="liquid" />
      </Pop>
      <Pop delay={1.82}>
        <Particles x={P[4][0] + (narrow ? -box * 0.2 : 4)} y={P[4][1] + box * 0.5 + 30} s={box} state="gas" />
      </Pop>

      {/* note */}
      <Fade delay={1.95}>
        <path className="f12-hc-plateau" d={`M${X0 + 4} ${d.h - (narrow ? 42 : 20)} h26`} />
        <text className="f12-t" x={X0 + 38} y={d.h - (narrow ? 36 : 14)}>
          {narrow ? 'plató: teplota se nemění –' : 'plató: teplota se nemění – energie jde na změnu skupenství'}
        </text>
        {narrow && (
          <text className="f12-t" x={X0 + 38} y={d.h - 12}>
            energie jde na změnu skupenství
          </text>
        )}
      </Fade>
    </>
  )
}

const WIDE: Dims = { w: 640, h: 410, X0: 62, X1: 604, YT: 48, YB: 330, narrow: false }
const NARROW: Dims = { w: 400, h: 470, X0: 48, X1: 382, YT: 48, YB: 364, narrow: true }

export default function HeatingCurve() {
  return (
    <Board
      level={1}
      max={680}
      label="Křivka ohřevu vody: teplota v závislosti na čase při stálém dodávání tepla. Led se ohřívá z −20 °C na 0 °C. Při 0 °C teplota zůstává stejná, dokud led netaje – tání, led a voda vedle sebe. Pak se voda ohřívá z 0 °C na 100 °C. Při 100 °C je delší plató – var, voda a pára vedle sebe. Nakonec se ohřívá pára nad 100 °C. Na plató se teplota nemění, protože energie jde na změnu skupenství. Malé obrázky ukazují uspořádání částic v ledu, ve vodě a v páře."
    >
      <motion.svg className="f12-svg f12-wide" viewBox={`0 0 ${WIDE.w} ${WIDE.h}`} aria-hidden="true" style={{ ['--f12-fs' as string]: '17px' }}>
        <Chart d={WIDE} />
      </motion.svg>
      <motion.svg className="f12-svg f12-narrow" viewBox={`0 0 ${NARROW.w} ${NARROW.h}`} aria-hidden="true" style={{ ['--f12-fs' as string]: '18px' }}>
        <Chart d={NARROW} />
      </motion.svg>
    </Board>
  )
}
