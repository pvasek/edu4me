import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { popIn, stagger } from '../ui/motion'
import { BY_Z } from '../courses/chemie/data/elements'
import { shellsFor } from './math'
import { ChemText, Fallback, Hatches, Svg, hatch, int, plainChem, useSvgId, type DiagramProps } from './util'

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']
const C = 180

/** "2+" / "−" style charge, as ^{…} markup ('' for a neutral atom). */
export function chargeMarkup(ion: number): string {
  if (!ion) return ''
  const n = Math.abs(ion)
  return `^{${n > 1 ? n : ''}${ion > 0 ? '+' : '-'}}`
}

export default function Bohr({ props }: DiagramProps) {
  const hid = useSvgId()
  const z = int(props.z)
  const ion = props.ion === undefined ? 0 : int(props.ion)
  const el = z !== undefined ? BY_Z[z] : undefined
  if (!el || ion === undefined) return <Fallback id="bohr" reason="neplatné z nebo ion" />
  const shells = shellsFor(el.z, ion)
  if (!shells) return <Fallback id="bohr" reason="neplatný náboj" />

  const neutrons = Math.round(el.mass) - el.z
  const electrons = el.z - ion
  const rNuc = 36
  const maxR = 156
  const gap = Math.min(44, (maxR - rNuc - 4) / Math.max(1, shells.length))
  // where the shell name pills sit (a spiral when there are many shells, so they do not collide)
  const many = shells.length > 4
  const pillAngle = () => (many ? -90 : -42)
  const extra = typeof props.label === 'string' ? props.label : ''
  const sym = el.symbol + chargeMarkup(ion)

  return (
    <div className="dg dg-bohr">
      <Svg
        w={360}
        h={360}
        max={420}
        label={`Bohrův model: ${el.name} (${plainChem(sym)}). Jádro: protonů ${el.z}, neutronů ${neutrons}. Elektronů ${electrons}, ve vrstvách ${shells
          .map((n, i) => `${SHELL_NAMES[i]} ${n}`)
          .join(', ')}.`}
      >
        {/* symbol + charge */}
        <text className="dg-sym" x={12} y={44}>
          <ChemText text={sym} />
        </text>
        {ion !== 0 && (
          <text className="dg-note" x={14} y={68}>
            {ion > 0 ? 'kation' : 'anion'}
          </text>
        )}
        <text className="dg-t dg-muted" x={14} y={328}>
          {el.name}
        </text>
        <text className="dg-mono dg-small" x={14} y={348}>
          e⁻ = {electrons}
        </text>
        {extra && (
          <text className="dg-note" x={348} y={348} textAnchor="end">
            {extra}
          </text>
        )}

        <Hatches id={hid} />
        {/* shells */}
        <motion.g initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger(0.18, 0.1)}>
        {shells.map((count, i) => {
          const r = rNuc + (i + 1) * gap
          const step = 360 / Math.max(1, count)
          const labelAngle = pillAngle()
          const start = labelAngle + step / 2
          const re = Math.max(3, Math.min(6.5, gap * 0.28, (Math.PI * r) / Math.max(1, count) * 0.55))
          const la = (labelAngle * Math.PI) / 180
          const lx = C + Math.cos(la) * r
          const ly = C + Math.sin(la) * r
          const pill = `${SHELL_NAMES[i]} ${count}`
          const ph = many ? 14 : 18
          const pw = pill.length * (many ? 6.2 : 7.4) + 8
          return (
            <g className="dg-shell" key={i}>
              <circle className="dg-shell-ring" cx={C} cy={C} r={r} />
              <circle className="dg-shell-hit" cx={C} cy={C} r={r} />
              <g className="dg-orbit" style={{ '--dur': `${14 + i * 7}s` } as CSSProperties}>
                <motion.g variants={stagger(Math.min(0.06, 0.5 / Math.max(1, count)), 0)}>
                  {Array.from({ length: count }, (_, k) => {
                    const a = ((start + k * step) * Math.PI) / 180
                    return (
                      <motion.circle
                        key={k}
                        variants={popIn}
                        className="dg-electron"
                        cx={C + Math.cos(a) * r}
                        cy={C + Math.sin(a) * r}
                        r={re}
                      />
                    )
                  })}
                </motion.g>
              </g>
              <g className="dg-pill">
                <rect x={lx - pw / 2} y={ly - ph / 2} width={pw} height={ph} rx={ph / 2} />
                <text x={lx} y={ly + (many ? 3.6 : 4.5)} textAnchor="middle" style={many ? { fontSize: 10 } : undefined}>
                  {pill}
                </text>
              </g>
            </g>
          )
        })}
        </motion.g>

        {/* nucleus: double rule + engraved cross-hatching */}
        <circle cx={C} cy={C} r={rNuc + 4} className="dg-rule" />
        <circle cx={C} cy={C} r={rNuc} className="dg-nucleus" />
        <circle cx={C} cy={C} r={rNuc} fill={hatch(hid, 'x')} className="dg-hatch" />
        <rect x={C - 30} y={C - 17} width={60} height={37} rx={6} className="dg-nucleus-plate" />
        <text className="dg-mono dg-small dg-strong" x={C} y={C - 3} textAnchor="middle">
          p⁺ = {el.z}
        </text>
        <text className="dg-mono dg-small dg-strong" x={C} y={C + 14} textAnchor="middle">
          n⁰ = {neutrons}
        </text>
      </Svg>
    </div>
  )
}
