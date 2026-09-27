import { useState } from 'react'
import { motion } from 'motion/react'
import { spring } from '../../../ui/motion'
import { Atom, ChemText, Eq, Fade, Figure, Pop, pat, useFig } from './kit'

type Case = 'eq' | 'add' | 'heat' | 'cool' | 'press'
const CASES: Record<Case, { btn: string; tilt: number; nL: number; nR: number; brown: number; head: string; text: string }> = {
  eq: { btn: 'rovnováha', tilt: 0, nL: 2, nR: 4, brown: 0.45, head: 'dynamická rovnováha', text: 'přímá i zpětná reakce běží stejně rychle' },
  add: { btn: '+ N₂O₄', tilt: 9, nL: 2, nR: 6, brown: 0.7, head: 'přidám N_{2}O_{4} → posun doprava', text: 'soustava přebytek spotřebuje, vzniká víc NO_{2}' },
  heat: { btn: 'zahřát', tilt: 10, nL: 1, nR: 6, brown: 0.9, head: 'zahřeju → posun doprava', text: 'podpořím endotermní směr, směs tmavne' },
  cool: { btn: 'ochladit', tilt: -10, nL: 3, nR: 1, brown: 0.12, head: 'ochladím → posun doleva', text: 'podpořím exotermní směr, směs bledne' },
  press: { btn: 'zvýšit tlak', tilt: -8, nL: 3, nR: 2, brown: 0.3, head: 'zvýším tlak → posun doleva', text: 'ke straně s menším počtem molů plynu (1 : 2)' },
}

const PIV: [number, number] = [240, 262]

function NO2({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x - 11 * r} y2={y + 7 * r} className="f67-bond" />
      <line x1={x} y1={y} x2={x + 11 * r} y2={y + 7 * r} className="f67-bond" />
      <Atom x={x - 11 * r} y={y + 7 * r} r={7 * r} el="O" text="" />
      <Atom x={x + 11 * r} y={y + 7 * r} r={7 * r} el="O" text="" />
      <Atom x={x} y={y} r={7.5 * r} el="N" text="" />
    </g>
  )
}
function N2O4({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x - 8} y1={y} x2={x + 8} y2={y} className="f67-bond" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <line x1={x + s * 8} y1={y} x2={x + s * 17} y2={y - 10} className="f67-bond" />
          <line x1={x + s * 8} y1={y} x2={x + s * 17} y2={y + 10} className="f67-bond" />
          <Atom x={x + s * 17} y={y - 10} r={6.5} el="O" text="" />
          <Atom x={x + s * 17} y={y + 10} r={6.5} el="O" text="" />
          <Atom x={x + s * 8} y={y} r={7} el="N" text="" />
        </g>
      ))}
    </g>
  )
}

const LEFT = [
  [102, 232],
  [152, 232],
  [127, 204],
]
const RIGHT = [
  [316, 236],
  [355, 236],
  [394, 236],
  [335, 208],
  [374, 208],
  [355, 180],
]

function Flask({ brown }: { brown: number }) {
  const { id } = useFig()
  const body = 'M226 36 V64 Q192 76 192 106 Q192 142 240 142 Q288 142 288 106 Q288 76 254 64 V36'
  return (
    <g>
      <motion.path d={body + 'Z'} fill="#8a3c14" initial={false} animate={{ fillOpacity: brown * 0.8 }} transition={{ duration: 0.8 }} />
      <path d={body + 'Z'} fill={pat(id, 'dots')} />
      <path d={body} className="f67-o" />
      <path d="M222 34 H258" className="f67-o f67-thick" />
      <path d="M204 96 Q206 84 216 78" className="f67-o f67-thin" style={{ opacity: 0.6 }} />
    </g>
  )
}

export default function EquilibriumSeesaw() {
  const [c, setC] = useState<Case>('eq')
  const k = CASES[c]
  return (
    <Figure
      level={6}
      w={480}
      h={420}
      max={600}
      label={`Rovnováha N2O4 ⇌ 2NO2 (bezbarvý oxid dusičitý dimer a hnědý NO2, ΔH = +57 kJ/mol) jako houpačka. Stav: ${k.head.replace(/_\{(\d)\}/g, '$1')}, ${k.text.replace(/_\{(\d)\}/g, '$1')}. Strana, které přibývá, klesá dolů; barva směsi v baňce ukazuje podíl hnědého NO2.`}
      controls={
        <div className="f67-seg" role="group" aria-label="Zásah do rovnováhy">
          {(Object.keys(CASES) as Case[]).map((id) => (
            <button key={id} type="button" className="f67-btn" aria-pressed={c === id} onClick={() => setC(id)}>
              {CASES[id].btn}
            </button>
          ))}
        </div>
      }
    >
      {/* equation + flask */}
      <Fade>
        <Eq x={240} y={24} t="N_{2}O_{4}(g) ⇌ 2NO_{2}(g) · ΔH = +57 kJ/mol" anchor="middle" className="f67-eq-lg" />
        <text x={125} y={150} textAnchor="middle" className="f67-lbl f67-b">
          <ChemText text="N_{2}O_{4}" />
        </text>
        <text x={125} y={168} textAnchor="middle" className="f67-lbl f67-sm">
          bezbarvý
        </text>
        <text x={355} y={132} textAnchor="middle" className="f67-lbl f67-b">
          <ChemText text="NO_{2}" />
        </text>
        <text x={355} y={150} textAnchor="middle" className="f67-lbl f67-sm">
          hnědý
        </text>
        <Flask brown={k.brown} />
        <text x={240} y={162} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          barva směsi
        </text>
      </Fade>

      {/* fulcrum */}
      <Pop delay={0.2}>
        <path d={`M${PIV[0]} ${PIV[1]} L${PIV[0] - 30} 316 H${PIV[0] + 30}Z`} className="f67-o f67-fill3" />
        <path d="M150 316 H330" className="f67-o f67-thick" />
        <circle cx={PIV[0]} cy={PIV[1]} r={4} className="f67-o f67-fill" />
      </Pop>

      {/* plank with the two pans */}
      <motion.g
        initial={false}
        animate={{ rotate: k.tilt }}
        transition={spring.gentle}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {/* invisible square centred on the pivot: rotation origin = pivot */}
        <rect x={PIV[0] - 200} y={PIV[1] - 200} width={400} height={400} fill="none" stroke="none" />
        <rect x={60} y={PIV[1] - 12} width={360} height={10} rx={2} className="f67-o f67-fill2" />
        <path d={`M62 ${PIV[1] - 12} V${PIV[1] - 20} M188 ${PIV[1] - 12} V${PIV[1] - 20} M292 ${PIV[1] - 12} V${PIV[1] - 20} M418 ${PIV[1] - 12} V${PIV[1] - 20}`} className="f67-o" />
        {LEFT.slice(0, k.nL).map(([x, y], i) => (
          <Pop key={`l${i}`} delay={0.3 + i * 0.08}>
            <N2O4 x={x} y={y} />
          </Pop>
        ))}
        {RIGHT.slice(0, k.nR).map(([x, y], i) => (
          <Pop key={`r${i}`} delay={0.3 + i * 0.06}>
            <NO2 x={x} y={y} />
          </Pop>
        ))}
      </motion.g>

      {/* what happened */}
      <g key={c}>
        <Pop>
          <rect x={30} y={336} width={420} height={62} rx={6} className={c === 'eq' ? 'f67-tag' : 'f67-tag-lvl'} />
          <text x={240} y={360} textAnchor="middle" className="f67-lbl f67-b">
            <ChemText text={k.head} />
          </text>
          <text x={240} y={384} textAnchor="middle" className="f67-lbl f67-sm">
            <ChemText text={k.text} />
          </text>
        </Pop>
      </g>
      <text x={240} y={414} textAnchor="middle" className="f67-cap f67-sec">
        klesá strana, které přibývá
      </text>
    </Figure>
  )
}
