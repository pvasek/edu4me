import { motion, type Variants } from 'motion/react'
import { Arrow, Draw, DrawArrow, Fade, Figure, Head, Pop, Qty, Sym, pat, useFig } from './kit'

const LABEL =
  'Homogenní elektrické pole mezi dvěma rovnoběžnými deskami vzdálenými d. Levá deska je kladná s potenciálem 100 V, pravá záporná s potenciálem 0 V, napětí U = 100 V. Siločáry jsou rovnoběžné a stejně husté a míří od kladné desky k záporné; jen na okraji se vyklenují ven. Ekvipotenciální hladiny 75 V, 50 V a 25 V jsou roviny rovnoběžné s deskami a kolmé na siločáry, potenciál klesá ve směru siločar rovnoměrně. Kladný náboj Q, například proton, vložený u kladné desky, je urychlován stálou silou F = Q · E k záporné desce; jeho polohy ve stejných časových odstupech jsou stále dál od sebe. Intenzita E = U / d.'

const XL = 110 // inner face of the + plate
const XR = 330 // inner face of the − plate
const Y0 = 52
const Y1 = 252
const LINES = [92, 124, 156, 188, 220]
const PATH_Y = 156
const X_START = 134
const RUN = 172
const GHOSTS = [0, 1, 2, 3, 4].map((k) => X_START + RUN * (k / 4) ** 2)

const fly: Variants = {
  hidden: { x: 0, opacity: 0 },
  show: {
    x: RUN,
    opacity: 1,
    transition: { x: { duration: 1.4, delay: 0.9, ease: [0.5, 0, 1, 1] }, opacity: { duration: 0.15, delay: 0.9 } },
  },
}

function Plates() {
  const { id } = useFig()
  return (
    <g>
      {[
        [XL - 10, 'fz4-plate-p'],
        [XR, 'fz4-plate-n'],
      ].map(([x, c]) => (
        <g key={x as number}>
          <rect x={x as number} y={Y0} width={10} height={Y1 - Y0} className={`fz4-o ${c}`} />
          <rect x={x as number} y={Y0} width={10} height={Y1 - Y0} fill={pat(id, 'd')} />
        </g>
      ))}
      {[70, 104, 138, 172, 206, 240].map((y) => (
        <g key={y}>
          <text x={XL - 18} y={y + 5} textAnchor="middle" className="fz4-charge-t fz4-red-t">
            +
          </text>
          <text x={XR + 18} y={y + 5} textAnchor="middle" className="fz4-charge-t fz4-blue-t">
            −
          </text>
        </g>
      ))}
    </g>
  )
}

export default function ParallelPlateField() {
  const eq = [0.25, 0.5, 0.75].map((k) => XL + (XR - XL) * k)
  return (
    <Figure level={11} w={460} h={344} max={620} replay label={LABEL}>
      {/* equipotentials */}
      <Fade delay={0.5}>
        {eq.map((x, i) => (
          <g key={x}>
            <path d={`M${x} ${Y0} V${Y1}`} className="fz4-equi" />
            <text x={x} y={74} textAnchor="middle" className="fz4-eq fz4-eq-sm fz4-halo">
              {[75, 50, 25][i]} V
            </text>
          </g>
        ))}
      </Fade>
      {/* field lines */}
      {LINES.map((y, i) => (
        <g key={y}>
          <Draw d={`M${XL} ${y} H${XR}`} className="fz4-field" delay={0.1 + i * 0.06} />
          <Fade delay={0.8}>
            <Head x={y === PATH_Y ? 252 : 196} y={y} deg={0} tone="blue" />
          </Fade>
        </g>
      ))}
      <Draw d={`M${XL} ${Y0 + 4} C${XL + 40} ${Y0 - 28} ${XR - 40} ${Y0 - 28} ${XR} ${Y0 + 4}`} className="fz4-field fz4-field-soft" delay={0.3} />
      <Draw d={`M${XL} ${Y1 - 4} C${XL + 40} ${Y1 + 28} ${XR - 40} ${Y1 + 28} ${XR} ${Y1 - 4}`} className="fz4-field fz4-field-soft" delay={0.3} />
      <Plates />
      <Fade delay={0.6}>
        <text x={XL - 26} y={Y0 + 6} textAnchor="end" className="fz4-eq fz4-b-eq">
          100 V
        </text>
        <text x={XR + 26} y={Y0 + 6} className="fz4-eq fz4-b-eq">
          0 V
        </text>
        <Sym x={304} y={LINES[0] + 22} t="E" tone="blue" />
      </Fade>
      {/* stroboscopic ghosts of the accelerating charge */}
      <Fade delay={0.7}>
        {GHOSTS.map((x) => (
          <circle key={x} cx={x} cy={PATH_Y} r={9} className="fz4-ghost-q" />
        ))}
      </Fade>
      <DrawArrow d={`M${X_START + 10} ${PATH_Y - 20} H${X_START + 46}`} tone="red" delay={1} className="fz4-vec" />
      <Fade delay={1.3}>
        <Qty x={X_START + 52} y={PATH_Y - 16} s="F = Q · E" className="fz4-red-t fz4-halo" />
      </Fade>
      <motion.g variants={fly}>
        <circle cx={X_START} cy={PATH_Y} r={9} className="fz4-proton" />
        <text x={X_START} y={PATH_Y + 5} textAnchor="middle" className="fz4-proton-t">
          +
        </text>
      </motion.g>
      {/* d */}
      <Pop delay={1.1}>
        <path d={`M${XL} ${Y1 + 26} V${Y1 + 42} M${XR} ${Y1 + 26} V${Y1 + 42}`} className="fz4-o fz4-thin" />
        <Arrow d={`M${XL + 2} ${Y1 + 34} H${XR - 2}`} both className="fz4-thin-arr" />
        <Sym x={220} y={Y1 + 54} t="d" />
      </Pop>
      {/* notes */}
      <Fade delay={1.5}>
        <rect x={364} y={118} width={88} height={60} rx={6} className="fz4-tag-lvl" />
        <Qty x={408} y={142} s="U" v="100 V" anchor="middle" />
        <Qty x={408} y={166} s="E = U / d" anchor="middle" />
      </Fade>
      {/* legend */}
      <g transform="translate(0 334)">
        <path d="M40 -5 H70" className="fz4-field" />
        <Head x={58} y={-5} deg={0} tone="blue" />
        <text x={78} y={0} className="fz4-lbl fz4-sm">
          siločáry
        </text>
        <path d="M170 -12 V2" className="fz4-equi" />
        <path d="M180 -12 V2" className="fz4-equi" />
        <text x={190} y={0} className="fz4-lbl fz4-sm">
          ekvipotenciální hladiny
        </text>
      </g>
    </Figure>
  )
}
