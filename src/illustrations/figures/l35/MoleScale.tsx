import { motion } from 'motion/react'
import { spring } from '../../../ui/motion'
import { Beaker, ChemText, Fade, Figure, Pop, T, pat, usePid } from './kit'

/** Deterministic pseudo-random numbers. */
function rnd(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function Caption({ x, y, name, formula, mass, M }: { x: number; y: number; name: string; formula: string; mass: string; M: string }) {
  return (
    <g>
      <text x={x} y={y + 22} textAnchor="middle" className="f35-note">
        {name} <tspan className="f35-t f35-b" style={{ fontStyle: 'normal' }}>
          <ChemText text={formula} />
        </tspan>
      </text>
      <text x={x} y={y + 44} textAnchor="middle" className="f35-mono f35-b f35-lvt" style={{ fontSize: 17 }}>
        <ChemText text={mass} />
      </text>
      <text x={x} y={y + 62} textAnchor="middle" className="f35-mono f35-muted f35-sec" style={{ fontSize: 11.5 }}>
        <ChemText text={M} />
      </text>
    </g>
  )
}

function Shelf({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const p = usePid()
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={8} className="f35-wood" />
      <rect x={x1} y={y} width={x2 - x1} height={8} fill={pat(p, 'd')} />
    </g>
  )
}

function Water({ x, y }: { x: number; y: number }) {
  return (
    <Pop d={0.2}>
      <Beaker x={x - 24} y={y - 58} w={48} h={58} level={26} graduations />
      <Caption x={x} y={y + 8} name="voda" formula="H_{2}O" mass="18 g" M="M = 18 g/mol" />
    </Pop>
  )
}

function Salt({ x, y }: { x: number; y: number }) {
  const cubes = []
  let i = 0
  for (let row = 0; row < 4; row++) {
    const n = 7 - row * 2
    for (let k = 0; k < n; k++) {
      const s = 7 + rnd(i) * 3
      const cx = x - (n - 1) * 5 + k * 10 + (rnd(i + 3) - 0.5) * 3
      const cy = y - 12 - row * 8 - rnd(i + 7) * 2
      cubes.push(<rect key={i} x={cx - s / 2} y={cy - s / 2} width={s} height={s} transform={`rotate(${(rnd(i + 9) - 0.5) * 30} ${cx} ${cy})`} className="f35-crystal" />)
      i++
    }
  }
  return (
    <Pop d={0.4}>
      <path d={`M${x - 44} ${y - 8} Q${x} ${y + 4} ${x + 44} ${y - 8}`} className="f35-glass-edge" />
      <path d={`M${x - 44} ${y - 8} Q${x} ${y + 4} ${x + 44} ${y - 8} Q${x} ${y - 2} ${x - 44} ${y - 8}Z`} className="f35-glass" />
      {cubes}
      <Caption x={x} y={y + 8} name="sůl" formula="NaCl" mass="58,5 g" M="M = 58,5 g/mol" />
    </Pop>
  )
}

function Carbon({ x, y }: { x: number; y: number }) {
  const bits = []
  for (let i = 0; i < 22; i++) {
    const row = i < 9 ? 0 : i < 16 ? 1 : i < 20 ? 2 : 3
    const inRow = [9, 7, 4, 2][row]
    const k = i - [0, 9, 16, 20][row]
    const cx = x - (inRow - 1) * 4.6 + k * 9.2 + (rnd(i) - 0.5) * 3
    const cy = y - 6 - row * 7
    const r = 4.2 + rnd(i + 5) * 1.6
    bits.push(<path key={i} d={`M${cx - r} ${cy} L${cx - r * 0.3} ${cy - r} L${cx + r} ${cy - r * 0.4} L${cx + r * 0.6} ${cy + r * 0.8} L${cx - r * 0.5} ${cy + r * 0.7}Z`} className="f35-coal" />)
  }
  return (
    <Pop d={0.6}>
      <path d={`M${x - 44} ${y - 1} H${x + 44}`} className="f35-line" />
      {bits}
      <Caption x={x} y={y + 8} name="uhlík" formula="C" mass="12 g" M="M = 12 g/mol" />
    </Pop>
  )
}

function Balloon({ x, y, r }: { x: number; y: number; r: number }) {
  const p = usePid()
  const cy = y - 36 - r
  const d = `M${x - 4} ${y - 30} C${x - r * 0.3} ${cy + r * 0.95} ${x - r} ${cy + r * 0.5} ${x - r} ${cy} C${x - r} ${cy - r * 1.15} ${x + r} ${cy - r * 1.15} ${x + r} ${cy} C${x + r} ${cy + r * 0.5} ${x + r * 0.3} ${cy + r * 0.95} ${x + 4} ${y - 30}Z`
  return (
    <g>
      <path d={`M${x} ${y - 30} q-6 12 2 20 q6 8 -2 10`} className="f35-thin" />
      <rect x={x - 9} y={y - 10} width={18} height={10} rx={2} className="f35-fill2" />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        variants={{ hidden: { scale: 0.2, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { ...spring.gentle, delay: 0.8 } } }}
      >
        <path d={d} className="f35-balloon" style={{ fill: 'color-mix(in srgb, var(--lv) 30%, var(--surface))' }} />
        <path d={d} fill={pat(p, 'd')} />
        <path d={`M${x - r * 0.55} ${cy - r * 0.35} Q${x - r * 0.45} ${cy - r * 0.75} ${x - r * 0.1} ${cy - r * 0.85}`} className="f35-glass-glint" style={{ strokeWidth: 3 }} />
        <text x={x} y={cy + 6} textAnchor="middle" className="f35-mono f35-b" style={{ fontSize: 15 }}>
          <ChemText text="22,4 dm^{3}" />
        </text>
      </motion.g>
    </g>
  )
}

function Gas({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <Balloon x={x} y={y} r={r} />
      <Pop d={0.8}>
        <text x={x} y={y + 30} textAnchor="middle" className="f35-note">
          plyn <tspan className="f35-t f35-small f35-muted" style={{ fontStyle: 'normal' }}>(např. <ChemText text="O_{2}" />)</tspan>
        </text>
        <text x={x} y={y + 52} textAnchor="middle" className="f35-mono f35-b f35-lvt" style={{ fontSize: 17 }}>
          <ChemText text="22,4 dm^{3}" />
        </text>
        <text x={x} y={y + 70} textAnchor="middle" className="f35-mono f35-muted f35-sec" style={{ fontSize: 11.5 }}>
          0 °C, 101,325 kPa
        </text>
      </Pop>
    </g>
  )
}

function Banner({ x, y }: { x: number; y: number }) {
  return (
    <Fade d={1.3}>
      <text x={x} y={y} textAnchor="middle" className="f35-title">
        1 mol od každé látky
      </text>
      <text x={x} y={y + 22} textAnchor="middle" className="f35-t">
        vždy <tspan className="f35-mono f35-b"><ChemText text="6,022·10^{23}" /></tspan> částic
      </text>
    </Fade>
  )
}

export default function MoleScale() {
  return (
    <Figure
      level={4}
      label="Jeden mol různých látek vedle sebe: 18 g vody, 58,5 g chloridu sodného, 12 g uhlíku a balonek s 22,4 dm3 plynu za normálních podmínek. V každém vzorku je stejný počet částic, 6,022·10^23."
      layouts={[
        {
          w: 580,
          h: 300,
          max: 700,
          when: 'wide',
          draw: () => (
            <>
              <Banner x={200} y={30} />
              <Shelf x1={10} x2={570} y={206} />
              <Water x={70} y={206} />
              <Salt x={180} y={206} />
              <Carbon x={292} y={206} />
              <Gas x={460} y={206} r={72} />
            </>
          ),
        },
        {
          w: 340,
          h: 560,
          max: 420,
          when: 'narrow',
          draw: () => (
            <>
              <Banner x={170} y={28} />
              <Shelf x1={6} x2={334} y={150} />
              <Water x={60} y={150} />
              <Salt x={170} y={150} />
              <Carbon x={280} y={150} />
              <Shelf x1={70} x2={270} y={452} />
              <Gas x={170} y={452} r={72} />
            </>
          ),
        },
      ]}
    />
  )
}
