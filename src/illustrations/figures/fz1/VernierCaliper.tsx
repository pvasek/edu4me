import { Draw, Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const READ = 23.4 // mm
const ALIGN = 4 // vernier line that coincides (23,4 + 4 · 0,9 = 27,0)

interface L {
  w: number
  h: number
  a: number // first mm shown
  b: number // last mm shown
  x0: number
  u: number // units per mm
  top: number // y of the scale boundary
}

/** Small overview of the whole caliper with a cylinder between the jaws. */
function Overview({ w, zx, zw }: { w: number; zx: number; zw: number }) {
  const { id } = useFig()
  const L = 26
  const R = w - 20
  const jaw = L + 10
  const slide = zx
  return (
    <g>
      {/* beam */}
      <rect x={L} y={24} width={R - L} height={18} rx={2} className="fz1-o fz1-metal" />
      {Array.from({ length: Math.floor((R - L - 30) / 6) }, (_, i) => (
        <line key={i} x1={jaw + 10 + i * 6} x2={jaw + 10 + i * 6} y1={42} y2={i % 5 ? 38 : 35} className="fz1-tick" />
      ))}
      {/* fixed jaws */}
      <path d={`M${L} 24 V100 L${jaw + 6} 100 L${jaw + 6} 42 M${L} 24 V12 L${jaw} 12 L${jaw + 3} 24`} className="fz1-o fz1-metal" />
      {/* slider */}
      <path d={`M${slide} 20 H${slide + zw} V56 H${slide + 12} V100 H${slide} Z`} className="fz1-o fz1-fill" />
      <path d={`M${slide} 20 H${slide + zw} V56 H${slide + 12} V100 H${slide} Z`} fill={pat(id, 'd')} opacity={0.3} />
      <path d={`M${slide} 20 V10 L${slide - 6} 10 L${slide - 6} 20`} className="fz1-o fz1-metal" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={slide + 14 + i * ((zw - 20) / 10)} x2={slide + 14 + i * ((zw - 20) / 10)} y1={42} y2={i % 5 ? 46 : 49} className="fz1-tick" />
      ))}
      {/* the measured cylinder */}
      <rect x={jaw + 6} y={62} width={slide - jaw - 6} height={34} className="fz1-o fz1-lvlsoft-f" />
      <ellipse cx={slide} cy={79} rx={4} ry={17} className="fz1-o fz1-lvlsoft-f" />
      {/* zoom frame */}
      <rect x={slide - 4} y={16} width={zw + 8} height={36} rx={3} className="fz1-o fz1-lvl-s fz1-dash" />
    </g>
  )
}

function Scales({ l }: { l: L }) {
  const { a, b, x0, u, top } = l
  const X = (mm: number) => x0 + (mm - a) * u
  const mains = Array.from({ length: b - a + 1 }, (_, i) => a + i)
  const vz = X(READ)
  const vend = X(READ + 9)
  return (
    <g>
      {/* main scale (beam) */}
      <rect x={X(a) - 12} y={top - 58} width={X(b) - X(a) + 24} height={58} className="fz1-o fz1-metal" />
      {mains.map((m) => (
        <line key={m} x1={X(m)} x2={X(m)} y1={top} y2={top - (m % 10 === 0 ? 24 : m % 5 === 0 ? 17 : 11)} className={m === 27 ? 'fz1-o fz1-lvl-s fz1-thick' : m % 5 ? 'fz1-tick' : 'fz1-tickl'} />
      ))}
      {mains
        .filter((m) => m % 5 === 0)
        .map((m) => (
          <text key={m} x={X(m)} y={top - 30} textAnchor="middle" className="fz1-num">
            {m}
          </text>
        ))}
      <text x={X(a) - 4} y={top - 42} className="fz1-lbl fz1-sm">
        hlavní stupnice (mm)
      </text>

      {/* vernier (slider) */}
      <Pop delay={0.2}>
        <rect x={vz - 22} y={top} width={vend - vz + 44} height={50} className="fz1-o fz1-fill" />
        {Array.from({ length: 11 }, (_, k) => {
          const x = vz + k * 0.9 * u
          return (
            <g key={k}>
              <line x1={x} x2={x} y1={top} y2={top + (k % 5 === 0 ? 17 : 11)} className={k === ALIGN ? 'fz1-o fz1-lvl-s fz1-thick' : k % 5 ? 'fz1-tick' : 'fz1-tickl'} />
              <text x={x} y={top + 31} textAnchor="middle" className={`fz1-num ${k === ALIGN ? 'fz1-num-b fz1-lvl-t' : ''}`} style={{ fontSize: 11.5 }}>
                {k}
              </text>
            </g>
          )
        })}
        <text x={vz - 16} y={top + 46} className="fz1-lbl fz1-sm">
          nonius: 10 dílků = 9 mm
        </text>
      </Pop>

      {/* zero of the vernier */}
      <Draw d={`M${vz} ${top - 70} V${top + 2}`} className="fz1-o fz1-dash fz1-lvl-s" delay={0.5} />
      <Fade delay={0.6}>
        <circle cx={vz} cy={top} r={3} className="fz1-lvl-f" />
      </Fade>
      {/* coinciding lines */}
      <Fade delay={1}>
        <rect x={X(27) - 6} y={top - 20} width={12} height={40} rx={5} className="fz1-hl-glow" />
      </Fade>
    </g>
  )
}

export default function VernierCaliper() {
  const compact = useCompact()
  const n = compact.narrow
  const l: L = n ? { w: 360, h: 412, a: 21, b: 33, x0: 26, u: 26.5, top: 238 } : { w: 620, h: 392, a: 18, b: 34, x0: 36, u: 34, top: 222 }
  const X = (mm: number) => l.x0 + (mm - l.a) * l.u
  const zx = n ? 196 : 300
  const zw = n ? 90 : 120
  const ty = l.top + 82
  return (
    <Figure
      w={l.w}
      h={l.h}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      replay
      label="Odečtení délky na posuvném měřidle. Nula nonia leží za ryskou 23 mm hlavní stupnice, to jsou celé milimetry. Desetiny milimetru udává ryska nonia, která se přesně kryje s některou ryskou hlavní stupnice: je to čtvrtá ryska, tedy 0,4 mm. Výsledek je 23 mm + 0,4 mm = 23,4 mm. Nonius má 10 dílků na délce 9 mm, proto měřidlo měří s přesností 0,1 mm."
    >
      <Pop delay={0}>
        <Overview w={l.w} zx={zx} zw={zw} />
      </Pop>
      {/* zoom leaders */}
      <Draw d={`M${zx - 4} 52 L${X(l.a) - 12} ${l.top - 58} M${zx + zw + 4} 52 L${X(l.b) + 12} ${l.top - 58}`} className="fz1-o fz1-thin fz1-lvl-s fz1-dash" delay={0.1} />
      <Scales l={l} />

      {/* the reading */}
      <Fade delay={0.8}>
        <text x={X(READ) - 6} y={l.top - 76} textAnchor={n ? 'middle' : 'end'} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
          nula nonia
        </text>
      </Fade>
      <Fade delay={1.2}>
        <path d={`M${X(27) + 14} ${l.top - 70} L${X(27) + 4} ${l.top - 22}`} className="fz1-lead" />
        <text x={X(27) + 10} y={l.top - 74} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
          {n ? 'rysky se kryjí' : 'tyto rysky se kryjí'}
        </text>
      </Fade>
      <Fade delay={1.5}>
        <text x={l.x0 - 8} y={ty} className="fz1-lbl">
          <tspan className="fz1-b">1.</tspan> nula nonia je za ryskou <tspan className="fz1-b">23 mm</tspan>
        </text>
        <text x={l.x0 - 8} y={ty + 24} className="fz1-lbl">
          <tspan className="fz1-b">2.</tspan> kryje se <tspan className="fz1-b">4.</tspan> ryska nonia → <tspan className="fz1-b">0,4 mm</tspan>
        </text>
      </Fade>
      <Pop delay={1.8}>
        <rect x={l.x0 - 12} y={ty + 38} width={n ? 316 : 330} height={40} rx={6} className="fz1-tag-lvl" />
        <text x={l.x0 + (n ? 146 : 153)} y={ty + 64} textAnchor="middle" className="fz1-val fz1-val-lg">
          l = 23 mm + 0,4 mm = 23,4 mm
        </text>
      </Pop>
    </Figure>
  )
}
