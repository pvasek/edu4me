import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Arrow, Draw, Lbl, Plate, Pop, fadeV, rng } from './kit'

const BX = 150
const RX = 470
const CY = 160

/** Stipple "long exposure" of a carbon atom's electrons: 1s, 2s and two 2p lobes (x and y). */
const CLOUD = (() => {
  const r = rng(6)
  const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
  const pts: [number, number][] = []
  const add = (rad: number, ang: number) => {
    if (rad < 108) pts.push([RX + rad * Math.cos(ang), CY + rad * Math.sin(ang)])
  }
  for (let i = 0; i < 300; i++) add((10 / 2) * -Math.log(r() * r() * r() + 1e-9), r() * Math.PI * 2)
  for (let i = 0; i < 150; i++) add(84 + gauss() * 7, r() * Math.PI * 2)
  for (let i = 0; i < 520; i++) {
    const axis = Math.floor(r() * 4) * (Math.PI / 2)
    add(22 + (26 / 2) * -Math.log(r() * r() * r() + 1e-9), axis + gauss() * 0.28)
  }
  return pts
})()

function Nucleus({ x, y }: { x: number; y: number }) {
  const r = rng(2)
  const out: ReactNode[] = []
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4
    const d = 3.6 * Math.sqrt(i)
    out.push(<circle key={i} className={i % 2 ? 'f12-neutron' : 'f12-proton'} cx={x + d * Math.cos(a) + r() * 0.5} cy={y + d * Math.sin(a)} r={4.6} style={{ strokeWidth: 0.7 }} />)
  }
  return <g>{out}</g>
}

function Bohr() {
  const shells = [
    { r: 44, n: 2, dur: 4, L: 'K' },
    { r: 90, n: 4, dur: 9, L: 'L' },
  ]
  return (
    <g>
      {shells.map((s, i) => (
        <g key={s.L}>
          <Draw d={`M${BX - s.r} ${CY} A${s.r} ${s.r} 0 1 1 ${BX + s.r} ${CY} A${s.r} ${s.r} 0 1 1 ${BX - s.r} ${CY}`} className="f12-shell" delay={0.16 + i * 0.24} dur={1} />
          <text className="f12-shell-t" x={BX + s.r * 0.72 + 6} y={CY - s.r * 0.72 - 4}>
            {s.L}
          </text>
          <Pop delay={0.8 + i * 0.24}>
            <g className="f12-spin" style={{ transformOrigin: `${BX}px ${CY}px`, animationDuration: `${s.dur}s` }}>
              {Array.from({ length: s.n }, (_, k) => {
                const a = (k / s.n) * Math.PI * 2 + i * 0.4
                return <circle key={k} className="f12-electron" cx={BX + s.r * Math.cos(a)} cy={CY + s.r * Math.sin(a)} r={6} />
              })}
            </g>
          </Pop>
        </g>
      ))}
      <Pop delay={0.08}>
        <Nucleus x={BX} y={CY} />
      </Pop>
    </g>
  )
}

function Cloud() {
  const groups: ReactNode[][] = [[], [], [], []]
  CLOUD.forEach(([x, y], i) => groups[i % 4].push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={1.15} />))
  return (
    <g>
      {groups.map((g, i) => (
        <motion.g key={i} variants={fadeV(0.4 + i * 0.35, 0.8)}>
          <g className="f12-cloud" style={{ animationDelay: `${-i * 0.6}s` }}>
            {g}
          </g>
        </motion.g>
      ))}
      <circle className="f12-nuc-dot" cx={RX} cy={CY} r={2.5} />
      <g className="f12-orb-guide">
        <circle cx={RX} cy={CY} r={20} />
        <circle cx={RX} cy={CY} r={96} />
        {[0, 90, 180, 270].map((a) => (
          <path key={a} transform={`translate(${RX} ${CY}) rotate(${a})`} d="M6 0 C18 -26 70 -34 78 0 C70 34 18 26 6 0 Z" />
        ))}
      </g>
    </g>
  )
}

export default function ShellsVsOrbitals() {
  return (
    <Plate
      level={2}
      w={620}
      h={372}
      max={660}
      label="Tentýž atom uhlíku dvakrát. Vlevo Bohrův model z roku 1913: jádro a elektrony na přesných kruhových drahách ve vrstvách K (2 elektrony) a L (4 elektrony). Vpravo kvantový model: elektrony nemají dráhu, tečky ukazují, kde se nejspíš vyskytují. Hustý oblak u jádra je orbital 1s, dál je orbital 2s a činky orbitalů 2p. Vrstva K odpovídá 1s, vrstva L orbitalům 2s a 2p."
    >
      <Bohr />
      <Cloud />
      <Arrow x1={276} y1={CY} x2={338} y2={CY} className="f12-arrow f12-arrow-lv" delay={0.96} />

      <text className="f12-title" x={BX} y={290} textAnchor="middle">
        Bohrův model
      </text>
      <text className="f12-small f12-sec" x={BX} y={310} textAnchor="middle">
        1913 · přesné dráhy ve vrstvách
      </text>
      <text className="f12-title" x={RX} y={290} textAnchor="middle">
        kvantový model
      </text>
      <text className="f12-small f12-sec" x={RX} y={310} textAnchor="middle">
        od 1926 · orbitaly = oblaky pravděpodobnosti
      </text>
      <text className="f12-num f12-cfg" x={BX} y={346} textAnchor="middle">
        C: K 2 · L 4
      </text>
      <text className="f12-num f12-cfg" x={RX} y={346} textAnchor="middle">
        1s² 2s² 2p²
      </text>

      <Lbl x={RX + 70} y={CY - 84} tx={RX + 12} ty={CY - 14} delay={1.44} className="f12-lab-strong">
        1s
      </Lbl>
      <Lbl x={RX + 92} y={CY + 96} tx={RX + 70} ty={CY + 66} delay={1.6} className="f12-lab-strong">
        2s
      </Lbl>
      <Lbl x={RX - 100} y={CY - 70} tx={RX - 52} ty={CY - 16} anchor="end" delay={1.76} className="f12-lab-strong" line2="(činky)" line2Sec>
        2p
      </Lbl>
    </Plate>
  )
}
