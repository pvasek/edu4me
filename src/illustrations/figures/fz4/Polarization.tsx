import { useId, useState } from 'react'
import { Fade, Figure, Pop, Qty, Toggle, cz, f1 } from './kit'

const LABEL =
  'Polarizace světla a Malusův zákon. Nepolarizované světlo, ve kterém vektor E kmitá ve všech směrech kolmých na paprsek, projde polarizátorem; ten propustí jen kmity ve svislém směru propustnosti, tedy polovinu intenzity, a za ním je světlo lineárně polarizované s intenzitou I₀. Analyzátor je natočený o úhel α. Projde jen průmět amplitudy do jeho směru, amplituda klesne na cos α a intenzita na I = I₀ · cos² α: při 0° projde vše, při 30° 75 %, při 60° 25 % a při zkřížených polarizátorech (90°) nic. Na tomto principu fungují polarizační brýle a displeje LCD.'

const Y = 122
const R = 62
const KZ = 0.6 // depth foreshortening of the disks
const XS = 56 // source
const XP = 182 // polariser
const XA = 350 // analyser
const LIGHT = '#e3b21c'

type Ang = '0' | '30' | '60' | '90'

/** Screen point of a direction (deg from vertical, in the plane of a disk) scaled by len, around (x, y). */
const dirPt = (x: number, deg: number, len: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [x + KZ * Math.sin(a) * len, Y - Math.cos(a) * len]
}

function DoubleArrow({ x, deg, len, cls }: { x: number; deg: number; len: number; cls: string }) {
  if (len < 2) return null
  const p = dirPt(x, deg, len)
  const q = dirPt(x, deg, -len)
  const ang = (Math.atan2(p[1] - q[1], p[0] - q[0]) * 180) / Math.PI
  const head = (h: [number, number], d: number) => (
    <path d="M-6 -4.5 L5 0 L-6 4.5Z" transform={`translate(${f1(h[0])} ${f1(h[1])}) rotate(${f1(d)})`} className={`${cls}-h`} />
  )
  return (
    <g>
      <path d={`M${f1(q[0])} ${f1(q[1])} L${f1(p[0])} ${f1(p[1])}`} className={cls} />
      {head(p, ang)}
      {head(q, ang + 180)}
    </g>
  )
}

function Disk({ x, deg, label }: { x: number; deg: number; label: string }) {
  const clip = 'pz' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const a = (deg * Math.PI) / 180
  const lines: string[] = []
  for (let t = -R; t <= R; t += 9) {
    // a line along the transmission direction, offset by t across it
    const c: [number, number] = [-Math.sin(a) * t, Math.cos(a) * t] // (y, z) of the offset
    const p = (s: number) => {
      const yy = c[0] + Math.cos(a) * s
      const zz = c[1] + Math.sin(a) * s
      return `${f1(x + KZ * zz)} ${f1(Y - yy)}`
    }
    lines.push(`M${p(-R)} L${p(R)}`)
  }
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <ellipse cx={x} cy={Y} rx={KZ * R} ry={R} />
        </clipPath>
      </defs>
      <ellipse cx={x} cy={Y} rx={KZ * R + 6} ry={R + 6} className="fz4-o fz4-frame-ring" />
      <ellipse cx={x} cy={Y} rx={KZ * R} ry={R} className="fz4-o fz4-filter" />
      <path d={lines.join(' ')} clipPath={`url(#${clip})`} className="fz4-filter-lines" />
      <text x={x} y={Y - R - 16} textAnchor="middle" className="fz4-lbl fz4-b">
        {label}
      </text>
    </g>
  )
}

export default function Polarization() {
  const [ang, setAng] = useState<Ang>('60')
  const al = Number(ang)
  const c = Math.cos((al * Math.PI) / 180)
  const frac = c * c
  const pct = Math.round(frac * 100)
  const xb = XA + 96
  // the angle α drawn in the analyser's plane, from the vertical
  const arc = Array.from({ length: 13 }, (_, i) => dirPt(XA, (al * i) / 12, R + 14))
  return (
    <Figure
      level={12}
      w={540}
      h={280}
      max={700}
      label={LABEL}
      controls={
        <Toggle
          label="Úhel natočení analyzátoru"
          value={ang}
          onChange={setAng}
          options={[
            { id: '0', text: 'α = 0°' },
            { id: '30', text: '30°' },
            { id: '60', text: '60°' },
            { id: '90', text: '90°' },
          ]}
        />
      }
    >
      {/* the beam: its height shows the intensity */}
      <path d={`M14 ${Y - 13} H${XP} V${Y + 13} H14Z`} fill={LIGHT} className="fz4-beam-band" />
      <path d={`M${XP} ${Y - 6.5} H${XA} V${Y + 6.5} H${XP}Z`} fill={LIGHT} className="fz4-beam-band" />
      {frac > 0.001 && <path d={`M${XA} ${f1(Y - 6.5 * frac)} H530 V${f1(Y + 6.5 * frac)} H${XA}Z`} fill={LIGHT} className="fz4-beam-band" />}
      <path d={`M14 ${Y} H530`} className="fz4-o fz4-thin fz4-dash" />
      {/* unpolarised light */}
      <Fade delay={0.2}>
        {[0, 45, 90, 135].map((d) => (
          <DoubleArrow key={d} x={XS} deg={d} len={40} cls="fz4-evec" />
        ))}
        <text x={XS} y={Y - 74} textAnchor="middle" className="fz4-lbl fz4-b">
          nepolarizované
        </text>
        <text x={XS} y={Y - 56} textAnchor="middle" className="fz4-lbl fz4-b">
          světlo
        </text>
      </Fade>
      <Disk x={XP} deg={0} label="polarizátor" />
      <Fade delay={0.5}>
        <DoubleArrow x={268} deg={0} len={40} cls="fz4-evec" />
        <Qty x={268} y={Y + 70} s="I_{0}" anchor="middle" className="fz4-eq-lg" />
        <text x={268} y={Y + 90} textAnchor="middle" className="fz4-lbl fz4-sm">
          polovina intenzity
        </text>
      </Fade>
      <g key={ang}>
        <Disk x={XA} deg={al} label="analyzátor" />
        <path d={'M' + arc.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L')} className="fz4-angle-arc" />
        <path d={`M${XA} ${Y - R - 4} V${Y - R - 22}`} className="fz4-o fz4-thin fz4-dash" />
        <text x={XA + 30} y={Y - R - 2} className="fz4-sym-t fz4-sym-sm">
          α
        </text>
        <Pop delay={0.1}>
          <DoubleArrow x={xb} deg={al} len={40 * c} cls="fz4-evec" />
          {frac < 0.001 && (
            <text x={xb} y={Y + 5} textAnchor="middle" className="fz4-lbl fz4-b">
              tma
            </text>
          )}
        </Pop>
        <Qty x={xb} y={Y + 70} s="I" v={`${cz(frac, 2)} I_{0}`} anchor="middle" className="fz4-eq-lg" />
        <text x={xb} y={Y + 90} textAnchor="middle" className="fz4-lbl fz4-sm">
          projde {pct} %
        </text>
      </g>
      <Pop delay={0.8}>
        <rect x={150} y={232} width={240} height={34} rx={6} className="fz4-tag-lvl" />
        <Qty x={270} y={255} s="I = I_{0} cos^{2} α" anchor="middle" className="fz4-eq-lg" />
      </Pop>
      <text x={14} y={246} className="fz4-lbl fz4-sm fz4-b">
        využití:
      </text>
      <text x={14} y={264} className="fz4-lbl fz4-sm">
        brýle, LCD
      </text>
    </Figure>
  )
}
