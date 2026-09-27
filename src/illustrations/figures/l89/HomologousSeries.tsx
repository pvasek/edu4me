import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { ChemText, Fade, Figure, Plate, useNarrow, useOn } from './kit'

const LABEL =
  'Homologická řada alkanů od methanu po dekan: v každém dalším řádku přibude do řetězce jedna skupina CH2. Vedle vazebného vzorce a souhrnného vzorce ukazuje sloupec teplotu varu: methan −162 °C, ethan −89 °C, propan −42 °C, butan −1 °C jsou za pokojové teploty plyny, pentan 36 °C, hexan 69 °C, heptan 98 °C, oktan 126 °C, nonan 151 °C a dekan 174 °C jsou kapaliny. Delší řetězec znamená vyšší teplotu varu.'

/** Values from lesson l8-2 (table „Homologická řada nerozvětvených alkanů“). */
const ALKANES = [
  ['methan', -162],
  ['ethan', -89],
  ['propan', -42],
  ['butan', -1],
  ['pentan', 36],
  ['hexan', 69],
  ['heptan', 98],
  ['oktan', 126],
  ['nonan', 151],
  ['dekan', 174],
] as const

const T_MIN = -180
const T_MAX = 190

export default function HomologousSeries() {
  return (
    <Figure name="homologous-series" level={8} label={LABEL} max={620}>
      <Series />
    </Figure>
  )
}

function Series() {
  const narrow = useNarrow()
  const on = useOn()
  const L = narrow
    ? { w: 360, rowH: 40, top: 58, name: 6, chain: 92, dx: 10.5, dy: 5.5, formula: -1, a0: 200, a1: 352 }
    : { w: 580, rowH: 36, top: 56, name: 10, chain: 124, dx: 13, dy: 6.5, formula: 272, a0: 346, a1: 566 }
  const h = L.top + ALKANES.length * L.rowH + 44
  const sx = (t: number) => L.a0 + ((t - T_MIN) / (T_MAX - T_MIN)) * (L.a1 - L.a0)
  const x0 = sx(0)
  const x25 = sx(25)
  return (
    <Plate w={L.w} h={h}>
      {/* header */}
      <text className="f89-lb f89-sm" x={L.name} y={22}>
        název
      </text>
      <text className="f89-lb f89-sm" x={L.chain} y={22}>
        vazebný vzorec
      </text>
      {!narrow && (
        <text className="f89-lb f89-sm" x={L.formula} y={22}>
          vzorec
        </text>
      )}
      <text className="f89-lb f89-sm" x={(L.a0 + L.a1) / 2} y={22} textAnchor="middle">
        teplota varu
      </text>
      <line className="f89-thin" x1={4} y1={32} x2={L.w - 4} y2={32} />

      {/* gas rows band */}
      <rect x={4} y={L.top - L.rowH / 2} width={L.w - 8} height={L.rowH * 4} fill="var(--water)" opacity={0.7} />

      {/* temperature axis */}
      <line className="f89-thin" x1={x0} y1={36} x2={x0} y2={L.top + ALKANES.length * L.rowH - L.rowH / 2} />
      <text className="f89-f f89-sm f89-muted" x={x0 - 4} y={46} textAnchor="end">
        0 °C
      </text>
      <line className="f89-guide" x1={x25} y1={L.top - L.rowH / 2} x2={x25} y2={L.top + ALKANES.length * L.rowH - L.rowH / 2 + 8} />

      {ALKANES.map(([name, bp], i) => {
        const n = i + 1
        const y = L.top + i * L.rowH
        const pts = Array.from({ length: n }, (_, k) => [L.chain + 4 + k * L.dx, y + (k % 2 ? -L.dy : L.dy) * (n > 1 ? 1 : 0)] as const)
        const chain = pts.map((p, k) => `${k ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
        const formula = n === 1 ? 'CH_{4}' : `C_{${n}}H_{${2 * n + 2}}`
        const delay = 0.15 + i * 0.12
        const bx = sx(bp)
        const neg = bp < 0
        const gas = bp < 25
        return (
          <motion.g
            key={name}
            initial={{ opacity: 0, x: -10 }}
            animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.35, delay, ease: ease.out }}
          >
            {i > 0 && <line className="f89-thin" x1={4} y1={y - L.rowH / 2} x2={L.w - 4} y2={y - L.rowH / 2} style={{ opacity: 0.25 }} />}
            <text className="f89-lb f89-b" x={L.name} y={narrow ? y - 2 : y + 5} style={{ fontSize: narrow ? 15.5 : 17 }}>
              {name}
            </text>
            {narrow && (
              <text className="f89-f f89-sm" x={L.name} y={y + 14}>
                <ChemText text={formula} />
              </text>
            )}
            {/* skeletal chain; the newly added carbon is highlighted */}
            {n > 1 && <path d={chain} className="f89-ln" style={{ strokeWidth: 1.8 }} />}
            {pts.map((p, k) => (
              <circle
                key={k}
                cx={p[0]}
                cy={p[1]}
                r={k === n - 1 && n > 1 ? 3.6 : 3}
                fill={k === n - 1 && n > 1 ? 'var(--lv)' : 'var(--edge)'}
                stroke="var(--edge)"
                strokeWidth={0.8}
              />
            ))}
            {!narrow && (
              <text className="f89-f" x={L.formula} y={y + 5}>
                <ChemText text={formula} />
              </text>
            )}
            {/* boiling-point bar grows from 0 °C */}
            <motion.rect
              x={Math.min(bx, x0)}
              y={y - 7}
              width={Math.abs(bx - x0)}
              height={14}
              fill={gas ? 'var(--blue)' : 'var(--lv)'}
              opacity={0.85}
              style={{ transformOrigin: neg ? '100% 50%' : '0% 50%' }}
              initial={{ scaleX: 0 }}
              animate={on ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: delay + 0.25, ease: ease.out }}
            />
            <rect x={Math.min(bx, x0)} y={y - 7} width={Math.abs(bx - x0)} height={14} className="f89-thin" style={{ opacity: on ? 1 : 0, transition: `opacity .3s ${delay + 0.7}s` }} />
            <text className="f89-f f89-sm" x={neg ? x25 + 5 : x0 - 5} y={y + 4} textAnchor={neg ? 'start' : 'end'}>
              {bp < 0 ? `−${-bp}` : bp} °C
            </text>
          </motion.g>
        )
      })}

      {/* footer: state at 25 °C and the CH2 increment */}
      <Fade delay={1.7}>
        <text className="f89-f f89-sm f89-muted" x={x25} y={h - 26} textAnchor="middle">
          25 °C
        </text>
        <text className="f89-lb f89-sm" x={x25 - 8} y={h - 8} textAnchor="end" style={{ fill: 'var(--blue)' }}>
          ← plyny
        </text>
        <text className="f89-lb f89-sm f89-lv" x={x25 + 8} y={h - 8}>
          kapaliny →
        </text>
        <circle cx={L.chain + 6} cy={h - 13} r={3.6} fill="var(--lv)" stroke="var(--edge)" strokeWidth={0.8} />
        <text className="f89-lb f89-sm" x={L.chain + 14} y={h - 8}>
          <ChemText text="+ CH_{2} v každém řádku" />
        </text>
      </Fade>
    </Plate>
  )
}
