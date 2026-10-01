import { useRef, useState } from 'react'
import { useAnimationFrame, useInView } from 'motion/react'
import type { Tone, WaveSpec } from '../../core/types'
import { Draw, Fade, Label, Legend, Plate, czNum, f1, say, toneAt, useNarrow, usePlate, type LegendItem } from './kit'

type Kind = 'transverse' | 'longitudinal' | 'standing'
type WMark = 'wavelength' | 'amplitude' | 'nodes'

const frac = (v: number) => v - Math.floor(v)
const TAU = Math.PI * 2

export function waveLabel(kind: Kind, waves: WaveSpec[], sum: boolean, marks: WMark[]): string {
  const w0 = waves[0]
  const names = waves.map((w, i) => `${w.label ? say(w.label) : `vlnění ${i + 1}`} (amplituda ${czNum(w.amplitude)}, vlnová délka ${czNum(w.wavelength)})`)
  let s: string
  if (kind === 'longitudinal')
    s = `Podélné vlnění: částice prostředí (svislé čárky) kmitají ve směru šíření, takže se střídají zhuštění a zředění. Vlnová délka ${czNum(w0.wavelength)}.`
  else if (kind === 'standing')
    s = `Stojaté vlnění: čárkovaná obálka ukazuje největší výchylky. V uzlech prostředí nekmitá, v kmitnách kmitá nejvíc. Sousední uzly jsou od sebe půl vlnové délky.`
  else if (waves.length > 1 && sum)
    s = `Skládání vlnění (interference): ${names.join(' a ')} jsou tenkou čarou, jejich součet (výsledné vlnění) tlustou čarou.`
  else if (waves.length > 1) s = `Příčná vlnění: ${names.join('; ')}.`
  else s = `Příčné vlnění: sinusoida s amplitudou ${czNum(w0.amplitude)} a vlnovou délkou ${czNum(w0.wavelength)}.`
  if (marks.includes('wavelength')) s += ' Vyznačena vlnová délka λ (vzdálenost dvou sousedních vrcholů).'
  if (marks.includes('amplitude') && kind !== 'longitudinal') s += ' Vyznačena amplituda A (největší výchylka od rovnovážné polohy).'
  if (kind !== 'standing') s += ' Vlnění postupuje doprava.'
  return s
}

export function WaveView({
  kind = 'transverse',
  waves,
  sum = false,
  marks,
}: {
  kind?: Kind
  waves: WaveSpec[]
  sum?: boolean
  marks?: WMark[]
}) {
  const nar = useNarrow()
  const narrow = nar.narrow
  const single = waves.length === 1
  const mk: WMark[] =
    marks ?? (kind === 'standing' ? ['nodes'] : kind === 'longitudinal' ? [] : single ? ['wavelength', 'amplitude'] : [])
  const doSum = sum && waves.length > 1 && kind === 'transverse'

  const W = narrow ? 340 : 600
  const m = 18
  const lmax = Math.max(...waves.map((w) => w.wavelength))
  const D = 2.5 * lmax
  const kx = (W - 2 * m) / D
  const maxA = doSum ? waves.reduce((a, w) => a + w.amplitude, 0) : Math.max(...waves.map((w) => w.amplitude))
  const Ap = narrow ? 46 : 56
  const ky = Ap / maxA

  let H: number
  let axisY: number
  if (kind === 'longitudinal') {
    axisY = (mk.includes('wavelength') ? 34 : 0) + 30 + 36
    H = axisY + 36 + 34 + 26
  } else {
    const topRoom = (mk.includes('wavelength') ? 40 : 18) + (kind === 'standing' && mk.includes('nodes') ? 20 : 0)
    axisY = topRoom + Ap
    H = axisY + Ap + (kind === 'standing' ? (mk.includes('nodes') ? 34 : 16) : 34)
  }

  const legend: LegendItem[] =
    waves.length > 1 || doSum
      ? [
          ...waves.map((w, i) => ({ text: w.label ?? `vlnění ${i + 1}`, tone: toneAt(i, w.tone), kind: 'line' as const })),
          ...(doSum ? [{ text: 'výsledné vlnění (součet)', tone: 'ink' as const, kind: 'bold' as const }] : []),
        ]
      : []

  return (
    <Plate
      narrow={nar}
      vb={[0, 0, W, H]}
      max={680}
      label={waveLabel(kind, waves, doSum, mk)}
      className="ph-wavefig"
      footer={legend.length ? <Legend items={legend} label="Legenda" /> : undefined}
    >
      <WaveBody kind={kind} waves={waves} sum={doSum} marks={mk} geo={{ W, m, D, kx, ky, axisY, Ap, narrow }} />
    </Plate>
  )
}

interface Geo {
  W: number
  m: number
  D: number
  kx: number
  ky: number
  axisY: number
  Ap: number
  narrow: boolean
}

/** Seconds since the plate came into view; frozen at 0 with reduced motion or off-screen. */
function useClock(active: boolean) {
  const [t, setT] = useState(0)
  const last = useRef(0)
  const base = useRef<number | null>(null)
  useAnimationFrame((ms) => {
    if (!active) {
      base.current = null
      return
    }
    if (base.current === null) base.current = ms - t * 1000
    if (ms - last.current < 33) return
    last.current = ms
    setT((ms - base.current) / 1000)
  })
  return t
}

function WaveBody({ kind, waves, sum, marks, geo }: { kind: Kind; waves: WaveSpec[]; sum: boolean; marks: WMark[]; geo: Geo }) {
  const { seen, still } = usePlate()
  const ref = useRef<SVGGElement>(null)
  const visible = useInView(ref, { amount: 0.2 })
  const t = useClock(seen && !still && visible)
  const { m, D, kx, ky, axisY, Ap, W } = geo
  const X = (x: number) => m + x * kx
  const Y = (y: number) => axisY - y * ky
  const lmax = Math.max(...waves.map((w) => w.wavelength))
  const v = lmax / 3.2 // travel speed (world units / s)
  const Ts = 2.6 // standing-wave period (s)

  const yAt = (w: WaveSpec, x: number) =>
    kind === 'standing'
      ? w.amplitude * Math.sin(TAU * (x / w.wavelength + (w.phase ?? 0))) * Math.cos((TAU * t) / Ts)
      : w.amplitude * Math.sin(TAU * ((x - v * t) / w.wavelength - (w.phase ?? 0)))
  const N = Math.round(W / 2.5)
  const curve = (fn: (x: number) => number) => {
    let d = ''
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * D
      d += `${i ? 'L' : 'M'}${f1(X(x))} ${f1(Y(fn(x)))}`
    }
    return d
  }

  const axis = <Draw d={`M${f1(X(0) - 4)} ${axisY} H${f1(X(D) + 12)}`} className="ph-o ph-thin" arrow="muted" small dur={0.4} />
  const travel =
    kind !== 'standing' ? (
      <Fade delay={0.8}>
        <TravelArrow x={X(D) - 58} y={kind === 'longitudinal' ? axisY + 36 + 44 : axisY + Ap + 22} />
      </Fade>
    ) : null

  if (kind === 'longitudinal') return <Longitudinal {...{ waves, marks, geo, t, v }} refG={ref} travel={travel} />

  const w0 = waves[0]
  const l0 = w0.wavelength
  // crest of wave 0 that the λ / A marks follow (they glide with the wave and fade when they wrap)
  const cyc = frac(0.25 + (w0.phase ?? 0) + (kind === 'standing' ? 0 : (v * t) / l0))
  const xc = cyc * l0
  const markOpacity = kind === 'standing' || still ? 1 : Math.min(1, cyc / 0.08, (1 - cyc) / 0.08)
  const topY = Y(w0.amplitude)

  return (
    <g ref={ref}>
      {axis}
      {travel}
      {kind === 'standing' &&
        waves.map((w, i) => (
          <Fade key={`e${i}`} delay={0.2} className={`ph-tone-${toneAt(i, w.tone)}`}>
            <path d={curve((x) => Math.abs(w.amplitude * Math.sin(TAU * (x / w.wavelength + (w.phase ?? 0)))))} className="ph-envelope" />
            <path d={curve((x) => -Math.abs(w.amplitude * Math.sin(TAU * (x / w.wavelength + (w.phase ?? 0)))))} className="ph-envelope" />
          </Fade>
        ))}
      {waves.map((w, i) => (
        <g key={i} className={`ph-tone-${toneAt(i, w.tone as Tone | undefined)}`}>
          <Draw d={curve((x) => yAt(w, x))} className={`ph-wave ${sum ? 'ph-wave-thin' : ''}`} delay={0.2 + i * 0.2} dur={1.1} />
        </g>
      ))}
      {sum && <Draw d={curve((x) => waves.reduce((a, w) => a + yAt(w, x), 0))} className="ph-wave ph-wave-sum" delay={0.6} dur={1.1} />}
      {/* marks */}
      {marks.includes('wavelength') && kind !== 'standing' && (
        <Fade delay={1.2}>
          <g opacity={markOpacity}>
            <path d={`M${f1(X(xc))} ${f1(topY - 4)} V${f1(topY - 30)} M${f1(X(xc + l0))} ${f1(topY - 4)} V${f1(topY - 30)}`} className="ph-guide" />
            <DimLine x0={X(xc)} x1={X(xc + l0)} y={topY - 22} />
            <Label x={X(xc + l0 / 2)} y={topY - 28} text="λ" anchor="middle" className="ph-lbl-lg ph-halo" />
          </g>
        </Fade>
      )}
      {marks.includes('amplitude') && kind !== 'standing' && (
        <Fade delay={1.35}>
          <g opacity={markOpacity}>
            <DimLine x0={X(xc)} x1={X(xc)} y={axisY} y1={topY} />
            <Label x={X(xc) - 7} y={(axisY + topY) / 2 + 6} text="A" anchor="end" className="ph-lbl-lg ph-halo" />
          </g>
        </Fade>
      )}
      {kind === 'standing' && marks.includes('nodes') && <Nodes w={w0} X={X} Y={Y} D={D} axisY={axisY} Ap={Ap} />}
      {kind === 'standing' && marks.includes('wavelength') && (
        <Fade delay={1.2}>
          {(() => {
            const n0 = frac(-(w0.phase ?? 0) * 2) * (l0 / 2)
            const y = axisY - Ap - (marks.includes('nodes') ? 32 : 12)
            return (
              <g>
                <DimLine x0={X(n0)} x1={X(n0 + l0)} y={y} />
                <Label x={X(n0 + l0 / 2)} y={y - 6} text="λ" anchor="middle" className="ph-lbl-lg ph-halo" />
              </g>
            )
          })()}
        </Fade>
      )}
    </g>
  )
}

function TravelArrow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Draw d={`M${f1(x)} ${f1(y)} h44`} className="ph-o" arrow="ink" small dur={0.4} delay={0.8} />
      <text x={f1(x - 6)} y={f1(y + 5)} textAnchor="end" className="ph-lbl ph-lbl-sm">
        šíření
      </text>
    </g>
  )
}

/** A dimension line with arrow heads at both ends (horizontal, or vertical with y1). */
function DimLine({ x0, x1, y, y1 }: { x0: number; x1: number; y: number; y1?: number }) {
  const { id } = usePlate()
  const d = y1 === undefined ? `M${f1(x0 + 1)} ${f1(y)} H${f1(x1 - 1)}` : `M${f1(x0)} ${f1(y - 1)} V${f1(y1 + 1)}`
  return <path d={d} className="ph-dim" markerStart={`url(#${id}-as-ink)`} markerEnd={`url(#${id}-as-ink)`} />
}

function Nodes({
  w,
  X,
  Y,
  D,
  axisY,
  Ap,
}: {
  w: WaveSpec
  X: (x: number) => number
  Y: (y: number) => number
  D: number
  axisY: number
  Ap: number
}) {
  const l = w.wavelength
  const ph = w.phase ?? 0
  const nodes: number[] = []
  const anti: number[] = []
  for (let n = -2; n < 12; n++) {
    const xn = (n / 2 - ph) * l
    const xa = (n / 2 + 0.25 - ph) * l
    if (xn >= -1e-9 && xn <= D + 1e-9) nodes.push(xn)
    if (xa >= 0 && xa <= D) anti.push(xa)
  }
  const ln = nodes.find((x) => x > D * 0.12) ?? nodes[0]
  const la = anti.find((x) => x > (ln ?? 0)) ?? anti[0]
  return (
    <Fade delay={1.1}>
      {anti.map((x) => (
        <path key={`a${x}`} d={`M${f1(X(x))} ${f1(Y(w.amplitude) + 3)} V${f1(Y(-w.amplitude) - 3)}`} className="ph-guide" />
      ))}
      {nodes.map((x) => (
        <circle key={`n${x}`} cx={f1(X(x))} cy={axisY} r={4} className="ph-mark-dot" />
      ))}
      {ln !== undefined && (
        <g>
          <path d={`M${f1(X(ln))} ${axisY + 6} V${axisY + Ap + 8}`} className="ph-o ph-thin ph-dot2" />
          <text x={f1(X(ln))} y={axisY + Ap + 24} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
            uzel
          </text>
        </g>
      )}
      {la !== undefined && (
        <text x={f1(X(la))} y={f1(Y(w.amplitude) - 8)} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
          kmitna
        </text>
      )}
    </Fade>
  )
}

function Longitudinal({
  waves,
  marks,
  geo,
  t,
  v,
  refG,
  travel,
}: {
  waves: WaveSpec[]
  marks: WMark[]
  geo: Geo
  t: number
  v: number
  refG: React.RefObject<SVGGElement | null>
  travel: React.ReactNode
}) {
  const { still } = usePlate()
  const { m, D, kx, axisY, narrow } = geo
  const X = (x: number) => m + x * kx
  const w0 = waves[0]
  const l0 = w0.wavelength
  const lmin = Math.min(...waves.map((w) => w.wavelength))
  const s = lmin / (narrow ? 12 : 16) // rest spacing of the layers
  // displacement amplitude kept below λ/2π so the layers never cross
  const ampTotal = waves.reduce((a, w) => a + w.amplitude, 0)
  const U = (w: WaveSpec) => (0.86 * (w.amplitude / ampTotal) * lmin) / TAU
  const disp = (x0: number) =>
    waves.reduce((a, w) => a + U(w) * Math.sin(TAU * ((x0 - v * t) / w.wavelength - (w.phase ?? 0))), 0)
  const half = 34
  let d = ''
  let dots = ''
  for (let x0 = -2 * s; x0 <= D + 2 * s; x0 += s) {
    const x = x0 + disp(x0)
    if (x < 0 || x > D) continue
    d += `M${f1(X(x))} ${axisY - half} V${axisY + half}`
    dots += `M${f1(X(x))} ${axisY} h0.01`
  }
  // compression / rarefaction centres of wave 0 (they travel with the wave)
  const base = frac((v * t) / l0 + (w0.phase ?? 0)) * l0
  const comp: number[] = []
  const rare: number[] = []
  for (let n = -1; n < 5; n++) {
    const xr = base + n * l0
    const xc = xr + l0 / 2
    if (xc > D * 0.06 && xc < D * 0.94) comp.push(xc)
    if (xr > D * 0.06 && xr < D * 0.94) rare.push(xr)
  }
  const edge = (x: number) => (still ? 1 : Math.max(0, Math.min(1, (x - D * 0.06) / (D * 0.06), (D * 0.94 - x) / (D * 0.06))))
  const lamY = axisY - half - 34
  const lamX = comp[0]
  return (
    <g ref={refG}>
      {travel}
      <Fade delay={0.1}>
        <rect x={f1(X(0))} y={axisY - half - 4} width={f1(D * kx)} height={2 * half + 8} className="ph-fill2" opacity={0.55} />
        <path d={d} className="ph-coil" />
        <path d={dots} className="ph-o" style={{ strokeWidth: 5, stroke: 'var(--ink)' }} />
      </Fade>
      <Fade delay={0.9}>
        {comp.map((x) => (
          <text key={`c${x}`} x={f1(X(x))} y={axisY - half - 10} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo" opacity={edge(x)}>
            zhuštění
          </text>
        ))}
        {rare.map((x) => (
          <text key={`r${x}`} x={f1(X(x))} y={axisY + half + 22} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo" opacity={edge(x)}>
            zředění
          </text>
        ))}
      </Fade>
      {marks.includes('wavelength') && lamX !== undefined && (
        <Fade delay={1.2}>
          <g opacity={still ? 1 : Math.max(0, Math.min(1, (lamX - D * 0.06) / (0.1 * l0), (D * 0.06 + l0 - lamX) / (0.1 * l0)))}>
            <path d={`M${f1(X(lamX))} ${f1(lamY - 8)} V${f1(axisY - half - 26)} M${f1(X(lamX + l0))} ${f1(lamY - 8)} V${f1(axisY - half - 26)}`} className="ph-guide" />
            <DimLine x0={X(lamX)} x1={X(lamX + l0)} y={lamY} />
            <Label x={X(lamX + l0 / 2)} y={lamY - 6} text="λ" anchor="middle" className="ph-lbl-lg ph-halo" />
          </g>
        </Fade>
      )}
    </g>
  )
}
