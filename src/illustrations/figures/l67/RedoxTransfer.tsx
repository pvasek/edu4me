import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Atom, ChemText, DrawArrow, Eq, Fade, Figure, Lbl, Pop, qpt, useCompact, useFig } from './kit'

type P = [number, number]
interface Lay {
  w: number
  h: number
  zn: P
  cu: P
  shell: number
  top: number
}
const WIDE: Lay = { w: 500, h: 398, zn: [115, 140], cu: [385, 140], shell: 54, top: -2 }
const NARROW: Lay = { w: 340, h: 458, zn: [80, 130], cu: [260, 130], shell: 46, top: -12 }

const at = (c: P, r: number, deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * r, c[1] + Math.sin((deg * Math.PI) / 180) * r]

function geometry(L: Lay) {
  const from = [at(L.zn, L.shell, -55), at(L.zn, L.shell, -20)]
  const to = [at(L.cu, L.shell, 235), at(L.cu, L.shell, 200)]
  const mid = (L.zn[0] + L.cu[0]) / 2
  const ctrl: P[] = [
    [mid, L.zn[1] - 134],
    [mid, L.zn[1] - 96],
  ]
  const a = at(L.zn, L.shell + 8, -62)
  const b = at(L.cu, L.shell + 8, 242)
  const arc = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${mid} ${L.top} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`
  const arcTop = 0.25 * a[1] + 0.5 * L.top + 0.25 * b[1]
  return { from, to, ctrl, arc, arcTop, mid }
}

function Electron({ i, g }: { i: number; g: ReturnType<typeof geometry> }) {
  const { seen, still } = useFig()
  const pts = Array.from({ length: 16 }, (_, k) => qpt(g.from[i], g.ctrl[i], g.to[i], k / 15))
  const end = pts[pts.length - 1]
  const go = seen && !still
  return (
    <motion.g
      initial={{ x: still ? end[0] : g.from[i][0], y: still ? end[1] : g.from[i][1] }}
      animate={go ? { x: pts.map((p) => p[0]), y: pts.map((p) => p[1]) } : { x: end[0], y: end[1] }}
      transition={go ? { duration: 1, delay: 0.7 + i * 0.25, ease: ease.inOut } : { duration: 0 }}
    >
      <circle r={7.5} className="f67-e" />
      <text y={3.6} textAnchor="middle" className="f67-e-t">
        e⁻
      </text>
    </motion.g>
  )
}

/** Crossfades core labels once the electrons have moved. */
function Swap({ x, y, a, b, delay }: { x: number; y: number; a: string; b: string; delay: number }) {
  const { seen, still } = useFig()
  const done = still || seen
  const t = { duration: 0.35, delay }
  return (
    <g className="f67-atom-t f67-atom-t-l" style={{ fontSize: 19 }}>
      <motion.text x={x} y={y + 7} textAnchor="middle" initial={{ opacity: still ? 0 : 1 }} animate={{ opacity: done ? 0 : 1 }} transition={t}>
        {a}
      </motion.text>
      <motion.text x={x} y={y + 7} textAnchor="middle" initial={{ opacity: still ? 1 : 0 }} animate={{ opacity: done ? 1 : 0 }} transition={t}>
        {b.split('^')[0]}
        {b.includes('^') && (
          <tspan dy="-0.45em" fontSize="70%">
            {b.split('^')[1]}
          </tspan>
        )}
      </motion.text>
    </g>
  )
}

function Half({ x, y, w, cap, eq, note, lvl }: { x: number; y: number; w: number; cap: string; eq: string; note: string; lvl?: boolean }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={78} rx={6} className={lvl ? 'f67-tag-lvl' : 'f67-tag'} />
      <text x={cx} y={y + 20} textAnchor="middle" className={`f67-cap ${lvl ? 'f67-lvl-t' : ''}`}>
        {cap}
      </text>
      <Eq x={cx} y={y + 44} t={eq} anchor="middle" className="f67-eq-lg" />
      <text x={cx} y={y + 66} textAnchor="middle" className="f67-lbl f67-sm">
        <ChemText text={note} />
      </text>
    </>
  )
}

export default function RedoxTransfer() {
  const compact = useCompact()
  const L = compact.narrow ? NARROW : WIDE
  const g = geometry(L)
  const [zx, zy] = L.zn
  const [cx, cy] = L.cu
  const sy = zy + (compact.narrow ? 80 : 86)
  const boxes = compact.narrow
    ? [
        [10, sy + 34, 320],
        [10, sy + 122, 320],
      ]
    : [
        [14, sy + 36, 222],
        [264, sy + 36, 222],
      ]
  const cy2 = L.h - 24
  const hw = compact.narrow ? 158 : 187
  const mx = L.w / 2
  return (
    <Figure
      level={6}
      w={L.w}
      h={L.h}
      max={600}
      replay
      compact={compact}
      boost={false}
      label="Přenos elektronů: atom zinku předá dva elektrony kationtu měďnatému. Zinek elektrony ztrácí, oxiduje se na Zn2+ a je redukčním činidlem. Kation Cu2+ elektrony přijímá, redukuje se na měď a je oxidačním činidlem. Pomůcka: ztráta = oxidace, zisk = redukce."
    >
      {/* electron shells */}
      <Pop delay={0.1}>
        <circle cx={zx} cy={zy} r={L.shell} className="f67-o f67-thin f67-dash" />
        <Atom x={zx} y={zy} r={L.shell * 0.63} el="Zn" text="" />
        {g.from.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={7.5} className="f67-o f67-thin f67-dot2" />
        ))}
      </Pop>
      <Pop delay={0.3}>
        <circle cx={cx} cy={cy} r={L.shell} className="f67-o f67-thin f67-dash" />
        <Atom x={cx} y={cy} r={L.shell * 0.56} el="Cu" text="" />
      </Pop>
      <Swap x={zx} y={zy} a="Zn" b="Zn^2+" delay={1.6} />
      <Swap x={cx} y={cy} a="Cu^2+" b="Cu" delay={1.85} />

      {/* the hop */}
      <DrawArrow d={g.arc} tone="blue" delay={0.3} className="f67-wide" />
      <Fade delay={0.6}>
        <text x={g.mid} y={g.arcTop - 9} textAnchor="middle" className="f67-lbl f67-b f67-blue-t f67-big">
          2 e⁻
        </text>
      </Fade>
      <Electron i={0} g={g} />
      <Electron i={1} g={g} />

      {/* labels at the atoms */}
      <Fade delay={0.4}>
        <Lbl x={zx - L.shell - 6} y={zy - L.shell - 16} tx={zx - L.shell * 0.6} ty={zy - L.shell * 0.8} sec>
          valenční vrstva
        </Lbl>
        <Eq x={zx} y={sy} t="Zn → Zn^{2+}" anchor="middle" className="f67-eq-lg" />
        <Eq x={cx} y={sy} t="Cu^{2+} → Cu" anchor="middle" className="f67-eq-lg" />
        <text x={zx} y={sy + 21} textAnchor="middle" className="f67-lbl f67-sm">
          ox. číslo 0 → II
        </text>
        <text x={cx} y={sy + 21} textAnchor="middle" className="f67-lbl f67-sm">
          ox. číslo II → 0
        </text>
      </Fade>

      {/* the two half-reactions */}
      <Pop delay={0.7}>
        <Half x={boxes[0][0]} y={boxes[0][1]} w={boxes[0][2]} cap="oxidace · ztráta e⁻" eq="Zn → Zn^{2+} + 2e^{-}" note="zinek = redukční činidlo" lvl />
      </Pop>
      <Pop delay={0.85}>
        <Half x={boxes[1][0]} y={boxes[1][1]} w={boxes[1][2]} cap="redukce · zisk e⁻" eq="Cu^{2+} + 2e^{-} → Cu" note="Cu^{2+} = oxidační činidlo" />
      </Pop>

      {/* mnemonic cartouche */}
      <Fade delay={1.9}>
        <path d={`M${mx - hw + 14} ${cy2 - 18} H${mx + hw - 14} L${mx + hw} ${cy2} L${mx + hw - 14} ${cy2 + 18} H${mx - hw + 14} L${mx - hw} ${cy2} Z`} className="f67-o f67-fill2" />
        <path d={`M${mx - hw + 19} ${cy2 - 14} H${mx + hw - 19} L${mx + hw - 8} ${cy2} L${mx + hw - 19} ${cy2 + 14} H${mx - hw + 19} L${mx - hw + 8} ${cy2} Z`} className="f67-o f67-thin" />
        <text x={mx} y={cy2 + 6} textAnchor="middle" className="f67-lbl f67-b f67-big">
          ztráta = oxidace · zisk = redukce
        </text>
      </Fade>
    </Figure>
  )
}
