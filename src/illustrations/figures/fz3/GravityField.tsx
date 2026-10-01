import { Draw, Eq, Fade, Figure, Head, Pop, Vec, f1, pat, useCompact, useFig } from './kit'

const LABEL =
  'Gravitační pole Země. Siločáry gravitačního pole směřují ze všech stran do středu Země a s rostoucí vzdáleností řídnou, pole slábne. Družice na kruhové oběžné dráze se pohybuje rychlostí v po tečně a gravitační síla F_g ji táhne do středu Země; ta jí slouží jako síla dostředivá. Tabulka: tíhové zrychlení g klesá se vzdáleností od středu Země podle g = G·M/r²: na povrchu 9,81 m/s², ve výšce 400 km (ISS) 8,7 m/s², ve výšce jednoho poloměru Země 6 378 km 2,45 m/s², na geostacionární dráze ve výšce 35 786 km 0,22 m/s² a ve vzdálenosti Měsíce 0,0027 m/s².'

const ROWS = [
  { h: '0 km', what: 'povrch Země', g: 9.81, t: '9,81' },
  { h: '400 km', what: 'ISS', g: 8.69, t: '8,7' },
  { h: '6 378 km', what: '= poloměr Země', g: 2.45, t: '2,45' },
  { h: '35 786 km', what: 'geostacionární dráha', g: 0.22, t: '0,22' },
  { h: '378 000 km', what: 'Měsíc', g: 0.0027, t: '0,0027' },
]

function Earth({ cx, cy }: { cx: number; cy: number }) {
  const { id } = useFig()
  const R = 50
  const lines = 12
  return (
    <g>
      {Array.from({ length: lines }, (_, i) => {
        const a = (i * 2 * Math.PI) / lines + 0.13
        const x1 = cx + Math.cos(a) * 138
        const y1 = cy + Math.sin(a) * 138
        const x2 = cx + Math.cos(a) * (R + 6)
        const y2 = cy + Math.sin(a) * (R + 6)
        const hx = cx + Math.cos(a) * 92
        const hy = cy + Math.sin(a) * 92
        return (
          <g key={i}>
            <Draw d={`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`} className="fz3-gfield" delay={0.1 + i * 0.03} />
            <Fade delay={0.9}>
              <Head x={hx} y={hy} deg={(a * 180) / Math.PI + 180} tone="muted" />
            </Fade>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={R} className="fz3-earth" />
      <path
        d={`M${cx - 30} ${cy - 18} q10 -16 26 -10 q10 8 0 18 q-10 6 -8 18 q-10 6 -18 -6 q-8 -10 0 -20Z M${cx + 12} ${cy + 8} q14 -6 22 6 q2 14 -12 18 q-12 -4 -10 -24Z`}
        className="fz3-land"
      />
      <circle cx={cx} cy={cy} r={R} fill={pat(id, 'sh')} opacity={0.35} />
      <circle cx={cx} cy={cy} r={R} className="fz3-o" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="fz3-lbl fz3-b fz3-on-earth">
        Země
      </text>
    </g>
  )
}

function Satellite({ cx, cy, r, deg }: { cx: number; cy: number; r: number; deg: number }) {
  const a = (deg * Math.PI) / 180
  const x = cx + Math.cos(a) * r
  const y = cy - Math.sin(a) * r
  // anticlockwise orbit: tangent (−sin, −cos) on screen
  const tx = -Math.sin(a)
  const ty = -Math.cos(a)
  return (
    <g>
      <Vec a={[x, y]} b={[x + tx * 50, y + ty * 50]} tone="lvl" t="v" at={[x + tx * 50 - 12, y + ty * 50 - 2]} delay={0.9} />
      <Vec
        a={[x, y]}
        b={[x + (cx - x) * 0.36, y + (cy - y) * 0.36]}
        tone="red"
        t="F_{g}"
        at={[x + (cx - x) * 0.36 + 16, y + (cy - y) * 0.36 + 20]}
        delay={1}
      />
      <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(-deg)})`}>
        <rect x={-16} y={-4} width={10} height={8} className="fz3-o fz3-panel" />
        <rect x={6} y={-4} width={10} height={8} className="fz3-o fz3-panel" />
        <rect x={-6} y={-6} width={12} height={12} rx={2} className="fz3-o fz3-fill2" />
      </g>
    </g>
  )
}

function Table({ x, y, w }: { x: number; y: number; w: number }) {
  const rh = 34
  const barX = x + w - 112
  return (
    <g>
      <text x={x} y={y} className="fz3-cap">
        výška nad povrchem
      </text>
      <text x={x + w} y={y + 2} textAnchor="end" className="fz3-lbl fz3-sm fz3-b">
        <tspan className="fz3-it">g</tspan> (m/s²)
      </text>
      {ROWS.map((r, i) => {
        const yy = y + 14 + i * rh
        return (
          <Fade key={r.h} delay={0.3 + i * 0.12}>
            <rect x={x - 6} y={yy} width={w + 12} height={rh - 4} rx={4} className={i % 2 ? 'fz3-row-0' : 'fz3-row'} />
            <text x={x} y={yy + 14} className="fz3-eq fz3-eq-sm">
              {r.h}
            </text>
            <text x={x} y={yy + 27} className="fz3-lbl fz3-sm fz3-muted-t" style={{ fontSize: 13 }}>
              {r.what}
            </text>
            <rect x={barX} y={yy + 18} width={Math.max(1.5, (r.g / 9.81) * 100)} height={6} className="fz3-lvl-f" />
            <text x={x + w} y={yy + 14} textAnchor="end" className="fz3-eq fz3-b-eq">
              {r.t}
            </text>
          </Fade>
        )
      })}
    </g>
  )
}

export default function GravityField() {
  const compact = useCompact()
  const n = compact.narrow
  const cx = n ? 170 : 150
  const cy = 150
  return (
    <Figure level={9} w={n ? 340 : 560} h={n ? 546 : 318} max={n ? 420 : 680} compact={compact} boost={false} label={LABEL}>
      <Earth cx={cx} cy={cy} />
      <Draw
        d={`M${cx - 104} ${cy} A104 104 0 1 0 ${cx + 104} ${cy} A104 104 0 1 0 ${cx - 104} ${cy}`}
        className="fz3-orbit fz3-orbit-strong fz3-dash-soft"
        delay={0.4}
      />
      <Pop delay={0.6}>
        <Satellite cx={cx} cy={cy} r={104} deg={38} />
      </Pop>
      <Fade delay={0.8}>
        <text x={cx - 130} y={cy + 132} className="fz3-lbl fz3-sm fz3-halo">
          siločáry míří do středu
        </text>
        <text x={cx + 64} y={cy - 108} className="fz3-lbl fz3-sm fz3-lvl-t">
          družice
        </text>
      </Fade>
      <g transform={n ? 'translate(0 300)' : 'translate(0 0)'}>
        <Table x={n ? 22 : 330} y={n ? 12 : 30} w={n ? 296 : 212} />
        <Pop delay={1}>
          <rect x={n ? 70 : 336} y={n ? 200 : 222} width={200} height={38} rx={6} className="fz3-tag-lvl" />
          <Eq x={n ? 170 : 436} y={n ? 225 : 247} t="g = G · M_{Z} / r^{2}" anchor="middle" className="fz3-eq-lg" />
        </Pop>
      </g>
      {!n && (
        <text x={436} y={284} textAnchor="middle" className="fz3-lbl fz3-sm fz3-muted-t">
          r = vzdálenost od středu Země
        </text>
      )}
    </Figure>
  )
}
