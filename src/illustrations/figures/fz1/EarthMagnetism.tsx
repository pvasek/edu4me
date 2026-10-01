import { useId } from 'react'
import { Draw, Fade, Figure, Lbl, Pop, pat, useCompact, useFig } from './kit'
import { along, bAt, fieldLines, toPath, type Poles, type Pt } from './field'
import { Compass, Head } from './MagnetField'

const TILT = 11 // degrees between the rotation axis and the magnetic axis

function Earth({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const { id } = useFig()
  const cid = 'ea' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const k = r / 110
  // rough continents (Europe/Africa side), in units of r/110 around the centre
  const land = [
    'M-20 -96 C0 -104 34 -98 52 -84 C60 -70 44 -62 30 -58 C18 -48 4 -52 -6 -58 C-18 -66 -30 -80 -20 -96Z',
    'M-18 -40 C2 -48 30 -44 44 -30 C56 -10 50 14 38 34 C30 54 16 70 6 70 C-2 56 -6 36 -16 20 C-30 6 -34 -22 -18 -40Z',
    'M-86 -40 C-74 -58 -56 -60 -50 -48 C-46 -34 -60 -20 -70 -6 C-78 4 -90 -16 -86 -40Z',
    'M-40 96 C-10 88 30 90 50 98 C30 108 -10 110 -40 96Z',
  ]
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} className="fz1-earth" />
      <g clipPath={`url(#${cid})`}>
        <circle cx={cx} cy={cy} r={r} fill={pat(id, 'h')} opacity={0.5} />
        {land.map((d, i) => (
          <path key={i} d={d} transform={`translate(${cx} ${cy}) scale(${k})`} className="fz1-land" />
        ))}
        <circle cx={cx + r * 0.35} cy={cy + r * 0.35} r={r * 1.05} fill={pat(id, 'sh')} opacity={0.35} />
      </g>
      <circle cx={cx} cy={cy} r={r} className="fz1-o fz1-thick" />
    </g>
  )
}

/** The imaginary bar magnet inside the Earth: its S pole points to the geographic north. */
function InnerMagnet({ cx, cy, l }: { cx: number; cy: number; l: number }) {
  return (
    <g transform={`rotate(${TILT} ${cx} ${cy})`} opacity={0.88}>
      <rect x={cx - 11} y={cy - l} width={22} height={l} fill="#3d6fd1" className="fz1-o" />
      <rect x={cx - 11} y={cy} width={22} height={l} fill="#c8453a" className="fz1-o" />
      <text x={cx} y={cy - l + 20} textAnchor="middle" className="fz1-mag-t" style={{ fontSize: 16 }}>
        S
      </text>
      <text x={cx} y={cy + l - 8} textAnchor="middle" className="fz1-mag-t" style={{ fontSize: 16 }}>
        N
      </text>
    </g>
  )
}

export default function EarthMagnetism() {
  const compact = useCompact()
  const n = compact.narrow
  const L = n ? { w: 360, h: 470, cx: 180, cy: 236, r: 88 } : { w: 640, h: 420, cx: 320, cy: 214, r: 112 }
  const t = (TILT * Math.PI) / 180
  const d = L.r * 0.34
  // magnet N lies towards the geographic south (down), S towards the geographic north (up)
  const poles: Poles = { n: [L.cx - Math.sin(t) * d, L.cy + Math.cos(t) * d], s: [L.cx + Math.sin(t) * d, L.cy - Math.cos(t) * d] }
  const box: [number, number, number, number] = [0, 26, L.w, L.h - 28]
  const angles = [40, 58, 76, 104, 122, 140].map((a) => a + TILT)
  const lines = fieldLines(poles, box, angles).map((pts) => pts.filter(([x, y]) => Math.hypot(x - L.cx, y - L.cy) > L.r - 1))
  const mp: Pt = [L.cx + Math.sin(t) * (L.r + 4), L.cy - Math.cos(t) * (L.r + 4)] // magnetic pole on the surface (north)
  const ms: Pt = [L.cx - Math.sin(t) * (L.r + 4), L.cy + Math.cos(t) * (L.r + 4)]
  const ca = (-40 * Math.PI) / 180 // compass above Europe (upper left)
  const cp: Pt = [L.cx + Math.sin(ca) * (L.r + 26), L.cy - Math.cos(ca) * (L.r + 26)]
  const b = bAt(cp, poles)
  const cid = 'em' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <Figure
      w={L.w}
      h={L.h}
      max={n ? 420 : 660}
      compact={compact}
      boost={false}
      replay
      label="Země jako obří magnet. Magnetické pole Země vypadá, jako by v ní ležel tyčový magnet skloněný asi o 11° od zemské osy. Blízko severního zeměpisného pólu leží severní magnetický pól – fyzikálně je to jižní pól S tohoto magnetu, a proto k němu míří severní konec střelky kompasu. Indukční čáry vycházejí z jižní polokoule a vstupují do severní."
    >
      <defs>
        <clipPath id={cid}>
          <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        {lines.map((pts, i) =>
          pts.length > 2 ? (
            <g key={i}>
              <Fade delay={0.3 + (i % 4) * 0.1}>
                <path d={toPath(pts)} className="fz1-field" />
              </Fade>
              <Fade delay={1.3}>
                <Head p={along(pts, 0.5).p} deg={along(pts, 0.5).deg} />
              </Fade>
            </g>
          ) : null,
        )}
      </g>
      <Pop delay={0}>
        <Earth cx={L.cx} cy={L.cy} r={L.r} />
      </Pop>
      <Fade delay={0.5}>
        <InnerMagnet cx={L.cx} cy={L.cy} l={L.r * 0.62} />
      </Fade>
      {/* geographic axis */}
      <Draw d={`M${L.cx} 30 V${L.h - 26}`} className="fz1-o fz1-dash" delay={0.2} />
      {/* magnetic axis */}
      <Draw
        d={`M${L.cx - Math.sin(t) * (L.r + 22)} ${L.cy + Math.cos(t) * (L.r + 22)} L${L.cx + Math.sin(t) * (L.r + 22)} ${L.cy - Math.cos(t) * (L.r + 22)}`}
        className="fz1-o fz1-dash fz1-lvl-s"
        delay={0.4}
      />
      <Pop delay={0.9}>
        <circle cx={mp[0]} cy={mp[1]} r={4.5} className="fz1-lvl-f fz1-o" />
        <circle cx={ms[0]} cy={ms[1]} r={4.5} className="fz1-lvl-f fz1-o" />
      </Pop>
      <Fade delay={0.8}>
        <path d={`M${L.cx + 24} 28 L${mp[0] + 2} ${mp[1] - 6}`} className="fz1-lead" />
        <path d={`M${L.cx + 24} ${L.h - 24} L${ms[0] + 2} ${ms[1] + 6}`} className="fz1-lead" />
      </Fade>
      <Pop delay={1.4}>
        <Compass x={cp[0]} y={cp[1]} deg={(Math.atan2(b[1], b[0]) * 180) / Math.PI} r={14} />
      </Pop>

      <Fade delay={0.8}>
        {n ? (
          <>
            <text x={L.cx - 8} y={18} textAnchor="end" className="fz1-lbl fz1-sm fz1-b">
              zeměpisný sever
            </text>
            <text x={L.cx + 14} y={18} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
              magnetický pól
            </text>
            <text x={L.cx - 8} y={L.h - 8} textAnchor="end" className="fz1-lbl fz1-sm fz1-b">
              zeměpisný jih
            </text>
            <text x={L.cx + 14} y={L.h - 8} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t">
              magnetický pól
            </text>
          </>
        ) : (
          <>
            <text x={L.cx - 10} y={20} textAnchor="end" className="fz1-lbl fz1-b">
              severní zeměpisný pól
            </text>
            <text x={L.cx + 18} y={20} className="fz1-lbl fz1-b fz1-lvl-t">
              severní magnetický pól (pól S magnetu)
            </text>
            <text x={L.cx - 10} y={L.h - 8} textAnchor="end" className="fz1-lbl fz1-b">
              jižní zeměpisný pól
            </text>
            <text x={L.cx + 18} y={L.h - 8} className="fz1-lbl fz1-b fz1-lvl-t">
              jižní magnetický pól (pól N magnetu)
            </text>
          </>
        )}
      </Fade>
      <Fade delay={1.5}>
        {n ? (
          <text x={cp[0] - 20} y={cp[1] - 8} textAnchor="end" className="fz1-lbl fz1-sm">
            kompas
          </text>
        ) : (
          <Lbl x={cp[0] - 40} y={cp[1] - 26} tx={cp[0] - 10} ty={cp[1] - 10} anchor="end" className="fz1-sm">
            střelka míří k severu
          </Lbl>
        )}
        <text x={L.cx + 4} y={L.cy - L.r - 36} className="fz1-lbl fz1-sm fz1-lvl-t fz1-halo">
          11°
        </text>
      </Fade>
    </Figure>
  )
}
