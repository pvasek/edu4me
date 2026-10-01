/**
 * Sankey-like energy flow of a heat engine (Q₁ → W + Q₂) or of a refrigerator /
 * heat pump (Q₂ + W → Q₁). Band widths are proportional to the energies; the
 * unknown band is drawn as a dashed "?" until `reveal`.
 */
import { motion, useReducedMotion } from 'motion/react'
import { cz, type Flow } from './logic'

const MAXW = 46

function Band({ d, width, color, unknown, delay }: { d: string; width: number; color: string; unknown: boolean; delay: number }) {
  const still = useReducedMotion()
  return (
    <g>
      {unknown ? (
        <path d={d} fill="none" stroke="var(--muted)" strokeWidth={width} strokeOpacity={0.18} />
      ) : (
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeOpacity={0.55}
          strokeWidth={width}
          initial={still ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay }}
        />
      )}
      {unknown && <path d={d} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 4" />}
    </g>
  )
}

/** Arrow head of a band at (x, y) pointing in direction (dx, dy). */
function Head({ x, y, dx, dy, width, color, unknown }: { x: number; y: number; dx: number; dy: number; width: number; color: string; unknown: boolean }) {
  const h = 12
  const s = width / 2 + 6
  const px = -dy
  const py = dx
  const pts = `${x + dx * h},${y + dy * h} ${x + px * s},${y + py * s} ${x - px * s},${y - py * s}`
  return <polygon points={pts} fill={unknown ? 'var(--surface-2)' : color} fillOpacity={unknown ? 1 : 0.8} stroke={unknown ? 'var(--muted)' : 'none'} strokeDasharray="3 3" />
}

function Label({ x, y, sym, sub, value, anchor = 'start', color }: { x: number; y: number; sym: string; sub?: string; value: string; anchor?: 'start' | 'end' | 'middle'; color: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className="g-ec-flabel" fill={color}>
      <tspan fontStyle="italic">{sym}</tspan>
      {sub && (
        <tspan dy="0.35em" fontSize="0.72em">
          {sub}
        </tspan>
      )}
      <tspan dy={sub ? '-0.35em' : undefined}> = {value}</tspan>
    </text>
  )
}

export function FlowDiagram({ flow, reveal, answerText }: { flow: Flow; reveal: boolean; answerText: string }) {
  const f = flow
  const k = MAXW / Math.max(f.q1, 1e-9)
  const hidden = (b: 'q1' | 'w' | 'q2') => !reveal && f.unknown.includes(b)
  const width = (v: number, b: 'q1' | 'w' | 'q2') => (hidden(b) ? 16 : Math.max(4, v * k))
  const val = (v: number, b: 'q1' | 'w' | 'q2') => {
    if (f.relative) return b === 'q1' ? '100 %' : hidden(b) ? '?' : `${cz(v, 1)} %`
    return hidden(b) ? '?' : `${cz(v, 1)} ${f.unit}`
  }
  const wQ1 = width(f.q1, 'q1')
  const wW = width(f.w, 'w')
  const wQ2 = width(f.q2, 'q2')
  const cx = 150
  const cy = 118
  const heat = 'var(--bad)'
  const cold = 'var(--blue)'
  const work = 'var(--green)'
  const label = `Tok energie: ${f.mode === 'engine' ? 'z ohřívače teplo Q1 do stroje, stroj koná práci W a teplo Q2 odevzdá chladiči' : 'stroj odebírá teplo Q2 chladnějšímu tělesu, dostává práci W a teplo Q1 odevzdává teplejšímu'}. ${reveal ? answerText : ''}`

  return (
    <svg className="g-ec-flow" viewBox="0 0 320 236" role="img" aria-label={label}>
      {/* reservoirs */}
      <rect x="84" y="6" width="132" height="32" rx="4" fill="color-mix(in srgb, var(--bad) 18%, var(--surface))" stroke="var(--edge)" strokeWidth="1.5" />
      <text x={cx} y="23" textAnchor="middle" dominantBaseline="middle" className="g-ec-box">
        {f.hot}
      </text>
      <rect x="84" y="198" width="132" height="32" rx="4" fill="color-mix(in srgb, var(--blue) 18%, var(--surface))" stroke="var(--edge)" strokeWidth="1.5" />
      <text x={cx} y="215" textAnchor="middle" dominantBaseline="middle" className="g-ec-box">
        {f.cold}
      </text>

      {f.mode === 'engine' ? (
        <>
          <Band d={`M ${cx} 38 V ${cy - 45}`} width={wQ1} color={heat} unknown={hidden('q1')} delay={0} />
          <Head x={cx} y={cy - 45} dx={0} dy={1} width={wQ1} color={heat} unknown={hidden('q1')} />
          <Band d={`M ${cx + 31} ${cy} H 282`} width={wW} color={work} unknown={hidden('w')} delay={0.4} />
          <Head x={282} y={cy} dx={1} dy={0} width={wW} color={work} unknown={hidden('w')} />
          <Band d={`M ${cx} ${cy + 31} V 184`} width={wQ2} color={cold} unknown={hidden('q2')} delay={0.4} />
          <Head x={cx} y={184} dx={0} dy={1} width={wQ2} color={cold} unknown={hidden('q2')} />
          <Label x={cx - wQ1 / 2 - 10} y={66} sym="Q" sub="1" value={val(f.q1, 'q1')} anchor="end" color={heat} />
          <Label x={230} y={cy - wW / 2 - 14} sym="W" value={val(f.w, 'w')} anchor="middle" color={work} />
          <Label x={cx - wQ2 / 2 - 10} y={166} sym="Q" sub="2" value={val(f.q2, 'q2')} anchor="end" color={cold} />
        </>
      ) : (
        <>
          <Band d={`M ${cx} 196 V ${cy + 44}`} width={wQ2} color={cold} unknown={hidden('q2')} delay={0} />
          <Head x={cx} y={cy + 44} dx={0} dy={-1} width={wQ2} color={cold} unknown={hidden('q2')} />
          <Band d={`M 300 ${cy} H ${cx + 46}`} width={wW} color={work} unknown={hidden('w')} delay={0.2} />
          <Head x={cx + 46} y={cy} dx={-1} dy={0} width={wW} color={work} unknown={hidden('w')} />
          <Band d={`M ${cx} ${cy - 31} V 52`} width={wQ1} color={heat} unknown={hidden('q1')} delay={0.5} />
          <Head x={cx} y={52} dx={0} dy={-1} width={wQ1} color={heat} unknown={hidden('q1')} />
          <Label x={cx - wQ1 / 2 - 10} y={72} sym="Q" sub="1" value={val(f.q1, 'q1')} anchor="end" color={heat} />
          <Label x={246} y={cy - wW / 2 - 14} sym="W" value={val(f.w, 'w')} anchor="middle" color={work} />
          <Label x={cx - wQ2 / 2 - 10} y={170} sym="Q" sub="2" value={val(f.q2, 'q2')} anchor="end" color={cold} />
        </>
      )}
      {/* machine */}
      <circle cx={cx} cy={cy} r="31" fill="var(--surface)" stroke="var(--edge)" strokeWidth="1.8" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="g-ec-machine">
        {f.machine}
      </text>
    </svg>
  )
}
