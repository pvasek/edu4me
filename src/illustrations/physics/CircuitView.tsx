import type { CircuitComponent, CircuitComponentKind, CircuitPart, CircuitSource } from '../../core/types'
import { SOURCE_BODY, layoutCircuit, type CircuitLayout } from './circuitLayout'
import { Draw, Fade, Label, Plate, f1, say, url, useNarrow, usePlate } from './kit'

const NAME: Record<CircuitComponentKind, string> = {
  resistor: 'rezistor',
  lamp: 'žárovka',
  switch: 'sepnutý spínač',
  'switch-open': 'rozpojený spínač',
  ammeter: 'ampérmetr',
  voltmeter: 'voltmetr',
  ohmmeter: 'ohmmetr',
  diode: 'dioda',
  led: 'svítivá dioda (LED)',
  capacitor: 'kondenzátor',
  coil: 'cívka',
  motor: 'elektromotor',
  fuse: 'pojistka',
  rheostat: 'reostat',
  ldr: 'fotorezistor',
  thermistor: 'termistor',
  bell: 'zvonek',
  wire: 'vodič',
}
const SOURCE_NAME: Record<CircuitSource['kind'], string> = {
  cell: 'článek',
  battery: 'baterie',
  dc: 'zdroj stejnosměrného napětí',
  ac: 'zdroj střídavého napětí',
}

const compText = (c: CircuitComponent) => NAME[c.kind] + (c.label ? ` ${say(c.label)}` : '')

export function circuitLabel(source: CircuitSource, parts: CircuitPart[], closed: boolean): string {
  const bits = parts.map((p) =>
    'parallel' in p
      ? `paralelně spojené větve (${p.parallel.map((b, i) => `${i + 1}. větev: ${b.length ? b.map(compText).join(' a ') : 'vodič'}`).join('; ')})`
      : compText(p),
  )
  return (
    `Schéma elektrického obvodu. Zdroj: ${SOURCE_NAME[source.kind]}${source.label ? ` ${say(source.label)}` : ''}. ` +
    `Za sebou jsou zapojeny: ${bits.join(', ')}. ` +
    (closed ? 'Obvod je uzavřený, prochází jím proud.' : 'Obvod je rozpojený, proud jím neprochází.')
  )
}

/** A component symbol in local coordinates: horizontal, centred on 0 0, "up" is the label side. */
function Symbol({ kind, rot }: { kind: CircuitComponentKind; rot: number }) {
  const { id } = usePlate()
  const arrow = url(id, 'as-ink')
  switch (kind) {
    case 'resistor':
      return <rect x={-15} y={-6.5} width={30} height={13} className="ph-part ph-part-fill" />
    case 'lamp':
      return (
        <g className="ph-part">
          <circle r={11} className="ph-part-fill" />
          <path d="M-7.8 -7.8 L7.8 7.8 M-7.8 7.8 L7.8 -7.8" />
        </g>
      )
    case 'switch':
    case 'switch-open':
      return (
        <g className="ph-part">
          <path d={kind === 'switch' ? 'M-11 0 L14 -4' : 'M-11 0 L9 -14'} />
          <circle cx={-13} r={2.3} className="ph-term" />
          <circle cx={13} r={2.3} className="ph-term" />
        </g>
      )
    case 'ammeter':
    case 'voltmeter':
    case 'ohmmeter':
    case 'motor':
      return (
        <g>
          <circle r={kind === 'motor' ? 13 : 12} className="ph-part ph-part-fill" />
          <text y={4.6} className="ph-part-t" transform={rot ? `rotate(${-rot})` : undefined}>
            {kind === 'ammeter' ? 'A' : kind === 'voltmeter' ? 'V' : kind === 'ohmmeter' ? 'Ω' : 'M'}
          </text>
        </g>
      )
    case 'diode':
    case 'led':
      return (
        <g className="ph-part">
          <path d="M-8 -8.5 L-8 8.5 L7 0 Z" className="ph-part-fill" />
          <path d="M7.5 -8.5 V8.5" />
          {kind === 'led' && (
            <g className="ph-thin" style={{ strokeWidth: 1.2 }}>
              <path d="M-1 -10 L6 -18" markerEnd={arrow} />
              <path d="M5 -8 L12 -16" markerEnd={arrow} />
            </g>
          )}
        </g>
      )
    case 'capacitor':
      return <path d="M-4 -12 V12 M4 -12 V12" className="ph-part" style={{ strokeWidth: 2.4 }} />
    case 'coil':
      return <path d="M-16 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0" className="ph-part" />
    case 'fuse':
      return (
        <g className="ph-part">
          <rect x={-14} y={-5.5} width={28} height={11} className="ph-part-fill" />
          <path d="M-14 0 H14" />
        </g>
      )
    case 'rheostat':
    case 'ldr':
    case 'thermistor':
      return (
        <g className="ph-part">
          <rect x={-15} y={-6.5} width={30} height={13} className="ph-part-fill" />
          {kind === 'rheostat' && <path d="M-13 12 L12 -12" markerEnd={arrow} style={{ strokeWidth: 1.3 }} />}
          {kind === 'thermistor' && <path d="M-14 12 L9 -11 H16" style={{ strokeWidth: 1.3 }} />}
          {kind === 'ldr' && (
            <g style={{ strokeWidth: 1.2 }}>
              <path d="M-15 -22 L-7 -11" markerEnd={arrow} />
              <path d="M-4 -22 L4 -11" markerEnd={arrow} />
            </g>
          )}
        </g>
      )
    case 'bell':
      return (
        <g className="ph-part">
          <path d="M-11 0 A11 11 0 0 1 11 0 Z" fill={url(id, 'd')} />
          <path d="M-12 0 H12" style={{ strokeWidth: 2.6 }} />
        </g>
      )
    case 'wire':
      return null
  }
}

function Source({ kind, y }: { kind: CircuitSource['kind']; y: number }) {
  const sign = (t: string, yy: number) => (
    <text x={17} y={f1(yy)} className="ph-part-t" style={{ fontSize: 13 }}>
      {t}
    </text>
  )
  if (kind === 'cell')
    return (
      <g className="ph-part">
        <path d={`M-14 ${y - 5} H14`} />
        <path d={`M-7 ${y + 5} H7`} style={{ strokeWidth: 4.2 }} />
        {sign('+', y - 8)}
        {sign('−', y + 17)}
      </g>
    )
  if (kind === 'battery')
    return (
      <g className="ph-part">
        <path d={`M-14 ${y - 15} H14 M-14 ${y + 6} H14`} />
        <path d={`M-7 ${y - 6} H7 M-7 ${y + 15} H7`} style={{ strokeWidth: 4.2 }} />
        <path d={`M0 ${y - 6} V${y + 6}`} className="ph-dot2" style={{ strokeWidth: 1.4 }} />
        {sign('+', y - 17)}
        {sign('−', y + 27)}
      </g>
    )
  return (
    <g className="ph-part">
      <circle cy={y} r={SOURCE_BODY[kind]} className="ph-part-fill" />
      {kind === 'dc' ? (
        <>
          <path d={`M-7 ${y - 3} H7`} />
          <path d={`M-7 ${y + 3} H7`} className="ph-dash" style={{ strokeDasharray: '3 2.5' }} />
          {sign('+', y - 17)}
          {sign('−', y + 27)}
        </>
      ) : (
        <path d={`M-8 ${y} C-5 ${y - 8} -2 ${y - 8} 0 ${y} S5 ${y + 8} 8 ${y}`} />
      )}
    </g>
  )
}

/** Dots drifting along the wires (hidden under the component bodies). */
function Current({ lay, ac }: { lay: CircuitLayout; ac: boolean }) {
  const { id, seen, still } = usePlate()
  if (still || !seen || !lay.flows.length) return null
  const mask = `${id}-cm`
  const b = lay.box
  const len = (d: string) => {
    const n = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
    let s = 0
    if (d.includes('Z')) return 2 * (lay.w + lay.h)
    for (let i = 2; i + 1 < n.length; i += 2) s += Math.abs(n[i] - n[i - 2]) + Math.abs(n[i + 1] - n[i - 1])
    return s
  }
  return (
    <g>
      <mask id={mask} maskUnits="userSpaceOnUse" x={b.x - 20} y={b.y - 20} width={b.w + 40} height={b.h + 40}>
        <rect x={b.x - 20} y={b.y - 20} width={b.w + 40} height={b.h + 40} fill="#fff" />
        {lay.comps.map((c, i) =>
          c.kind === 'wire' ? null : <rect key={i} x={c.box.x - 2} y={c.box.y - 2} width={c.box.w + 4} height={c.box.h + 4} fill="#000" />,
        )}
        <rect x={-16} y={lay.source.y - SOURCE_BODY[lay.source.kind] - 1} width={32} height={2 * SOURCE_BODY[lay.source.kind] + 2} fill="#000" />
      </mask>
      <g mask={`url(#${mask})`}>
        {lay.flows.map((d, k) => {
          const L = len(d)
          const n = Math.max(2, Math.round(L / 34))
          const dur = L / 38
          return Array.from({ length: n }, (_, i) => (
            <circle key={`${k}-${i}`} r={2.3} className="ph-current">
              {ac ? (
                <animateMotion
                  path={d}
                  dur="1.6s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                  keyPoints={`${(i / n).toFixed(3)};${Math.min(1, i / n + 8 / L).toFixed(3)};${(i / n).toFixed(3)}`}
                />
              ) : (
                <animateMotion path={d} dur={`${dur.toFixed(2)}s`} begin={`${(-(i / n) * dur).toFixed(2)}s`} repeatCount="indefinite" />
              )}
            </circle>
          ))
        })}
      </g>
    </g>
  )
}

export function CircuitView({ source, parts }: { source: CircuitSource; parts: CircuitPart[] }) {
  const nar = useNarrow()
  const lay = layoutCircuit(source, parts, nar.narrow)
  const b = lay.box
  const pad = 14
  const n = lay.comps.length
  return (
    <Plate
      narrow={nar}
      vb={[b.x - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad]}
      max={Math.min(640, (b.w + 2 * pad) * 1.25)}
      label={circuitLabel(source, parts, lay.closed)}
      className="ph-circuit"
    >
      {lay.wires.map((w, i) => (
        <Draw key={i} d={`M${w.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L')}`} className="ph-wire" delay={0.05 + (i / Math.max(1, lay.wires.length)) * 0.5} dur={0.5} />
      ))}
      <Current lay={lay} ac={source.kind === 'ac'} />
      <Fade delay={0.3}>
        <Source kind={source.kind} y={lay.source.y} />
        {source.label && <Label x={lay.source.lx} y={lay.source.ly} text={source.label} anchor="end" className="ph-lbl-sm" />}
      </Fade>
      {lay.comps.map((c, i) => (
        <Fade key={i} delay={0.35 + (i / Math.max(1, n)) * 0.6}>
          <g transform={`translate(${f1(c.x)} ${f1(c.y)}) rotate(${c.rot})`}>
            <Symbol kind={c.kind} rot={c.rot} />
          </g>
          {c.label && c.kind !== 'wire' && <Label x={c.lx} y={c.ly} text={c.label} anchor={c.anchor} className="ph-lbl-sm" />}
        </Fade>
      ))}
      <Fade delay={0.6}>
        {lay.junctions.map((p, i) => (
          <circle key={i} cx={f1(p[0])} cy={f1(p[1])} r={3} className="ph-junction" />
        ))}
      </Fade>
    </Plate>
  )
}
