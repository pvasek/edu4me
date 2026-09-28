import { ChemText, Draw, DrawArrow, Eq, Fade, Figure, useCompact } from './kit'

const ORDERS = [
  { name: '0. řád', eq: 'v = k', f: () => 0.5, note: 'nezávisí na [A]' },
  { name: '1. řád', eq: 'v = k·[A]', f: (a: number) => a * 0.9, note: 'přímka' },
  { name: '2. řád', eq: 'v = k·[A]^{2}', f: (a: number) => a * a * 0.9, note: 'parabola' },
]

/** Small v–[A] plot; (x, y) top left. */
function Mini({ i, x, y, w }: { i: number; x: number; y: number; w: number }) {
  const o = ORDERS[i]
  const X0 = x + 24
  const X1 = x + w - 10
  const YB = y + 124
  const YT = y + 34
  const sx = (a: number) => X0 + a * (X1 - X0)
  const sy = (v: number) => YB - v * (YB - YT)
  let d = ''
  for (let k = 0; k <= 40; k++) {
    const a = 0.04 + (k / 40) * 0.92
    d += `${k ? 'L' : 'M'}${sx(a).toFixed(1)} ${sy(o.f(a)).toFixed(1)}`
  }
  const dl = 0.12 + i * 0.18
  return (
    <g>
      <text x={x + w / 2} y={y + 18} textAnchor="middle" className="f67-lbl f67-b f67-big f67-lvl-t">
        {o.name}
      </text>
      <DrawArrow d={`M${X0} ${YB} H${X1 + 6}`} delay={dl} />
      <DrawArrow d={`M${X0} ${YB} V${YT - 12}`} delay={dl} />
      <Fade delay={dl + 0.12}>
        <text x={X0 - 6} y={YT - 4} textAnchor="end" className="f67-lbl f67-b">
          v
        </text>
        <text x={X1 + 6} y={YB + 20} textAnchor="end" className="f67-lbl f67-sm">
          [A]
        </text>
      </Fade>
      <Draw d={d} className="f67-curve f67-curve-1" delay={dl + 0.24} />
      <Fade delay={dl + 0.6}>
        <Eq x={x + w / 2 + 6} y={y + 164} t={o.eq} anchor="middle" className="f67-eq-lg" />
        <text x={x + w / 2 + 6} y={y + 184} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          {o.note}
        </text>
      </Fade>
    </g>
  )
}

const FR = ['[A]_{0}', '½ [A]_{0}', '¼ [A]_{0}', '⅛ [A]_{0}']

/** [A]–t for a first-order reaction with three equal half-lives; (x, y) top left. */
function Decay({ x, y, w }: { x: number; y: number; w: number }) {
  const X0 = x + 62
  const X1 = x + w - 12
  const YB = y + 196
  const YT = y + 44
  const T = (X1 - X0) / 4.3 // half-life in px
  const sy = (c: number) => YB - c * (YB - YT)
  let d = ''
  for (let k = 0; k <= 90; k++) {
    const t = (k / 90) * (X1 - X0 - 6)
    d += `${k ? 'L' : 'M'}${(X0 + t).toFixed(1)} ${sy(Math.pow(0.5, t / T)).toFixed(1)}`
  }
  return (
    <g>
      <text x={x + 8} y={y + 18} className="f67-cap f67-lvl-t">
        1. řád: koncentrace v čase
      </text>
      <DrawArrow d={`M${X0} ${YB} H${X1 + 8}`} delay={0.72} />
      <DrawArrow d={`M${X0} ${YB} V${YT - 16}`} delay={0.72} />
      <Fade delay={0.84}>
        <text x={X0 + 8} y={YT - 8} className="f67-lbl f67-b">
          [A]
        </text>
        <text x={X1 + 8} y={YB - 8} textAnchor="end" className="f67-lbl f67-b">
          t
        </text>
      </Fade>
      {[0, 1, 2, 3].map((k) => {
        const c = Math.pow(0.5, k)
        const px = X0 + k * T
        return (
          <Fade key={k} delay={1.2 + k * 0.15}>
            {k > 0 && <path d={`M${X0} ${sy(c)} H${px} V${YB}`} className="f67-o f67-thin f67-dash" />}
            <circle cx={px} cy={sy(c)} r={4} className="f67-lvl-f f67-o f67-thin" />
            <text x={X0 - 8} y={sy(c) + 5} textAnchor="end" className="f67-eq f67-eq-sm">
              <ChemText text={FR[k]} />
            </text>
          </Fade>
        )
      })}
      <Draw d={d} className="f67-curve f67-curve-2" delay={0.9} />
      {[0, 1, 2].map((k) => {
        const a = X0 + k * T + 3
        const b = X0 + (k + 1) * T - 3
        return (
          <Fade key={k} delay={1.44 + k * 0.15}>
            <DrawArrow d={`M${a} ${YB + 16} H${b}`} tone="lvl" both />
            <text x={(a + b) / 2} y={YB + 38} textAnchor="middle" className="f67-lbl f67-b f67-lvl-t">
              <ChemText text="t_{½}" />
            </text>
          </Fade>
        )
      })}
      <Fade delay={1.92}>
        <text x={X1} y={YT + 10} textAnchor="end" className="f67-lbl f67-sm">
          stejné poločasy
        </text>
        <text x={X1} y={YT + 30} textAnchor="end" className="f67-lbl f67-sm f67-sec">
          po každém t½ zbude polovina
        </text>
      </Fade>
    </g>
  )
}

export default function ReactionOrders() {
  const compact = useCompact()
  const n = compact.narrow
  const W = n ? 340 : 560
  const gw = (W - 16) / 3
  return (
    <Figure
      level={6}
      w={W}
      h={n ? 470 : 460}
      max={640}
      compact={compact}
      boost={false}
      label="Řády reakce. Tři grafy rychlosti v v závislosti na koncentraci [A]: u reakce 0. řádu je rychlost stálá (vodorovná čára, v = k), u 1. řádu roste přímo úměrně (přímka, v = k·[A]), u 2. řádu roste s druhou mocninou (parabola, v = k·[A]²). Dolní graf ukazuje pokles koncentrace v čase u reakce 1. řádu: z [A]0 na polovinu, čtvrtinu a osminu vždy za stejnou dobu, poločas t½ je stále stejný."
    >
      {ORDERS.map((_, i) => (
        <Mini key={i} i={i} x={8 + i * gw} y={4} w={gw} />
      ))}
      <line x1={12} x2={W - 12} y1={n ? 200 : 204} y2={n ? 200 : 204} className="f67-o f67-soft" />
      <Decay x={4} y={n ? 212 : 212} w={W - 8} />
    </Figure>
  )
}
