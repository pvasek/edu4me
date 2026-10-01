import { Draw, EndOn, Fade, Figure, Head, Lbl, Pop, PoleBlock, Rise, pat, useFig } from './kit'

const LABEL =
  'Magnetické pole cívky. V řezu cívkou teče proud v horních závitech k nám a v dolních od nás. Uvnitř cívky jsou indukční čáry rovnoběžné a hustší, vně se vracejí oblouky od jednoho konce k druhému, stejně jako u tyčového magnetu: z pravého konce (severní pól N) vycházejí a do levého (jižní pól S) vstupují. Pravidlo pravé ruky: prsty ve směru proudu v závitech, palec ukazuje k severnímu pólu. Elektromagnet: cívka se železným jádrem připojená ke zdroji přitahuje kancelářské sponky; železo pole mnohonásobně zesílí a po vypnutí proudu sponky odpadnou.'

// solenoid (section): axis y = AY from X1 to X2, windings at AY ± R
const AY = 136
const X1 = 130
const X2 = 290
const R = 34
const XM = (X1 + X2) / 2

/** A closed field line: straight inside at offset dy (sign = side), out around the end back in. */
function loop(k: number, side: -1 | 1) {
  const yi = AY + side * 11 * k
  const yo = AY + side * (R + 20 + 26 * k)
  const ex = 34 + 24 * k
  return {
    d: `M${X1} ${yi} H${X2} C${X2 + ex} ${yi} ${X2 + ex} ${yo} ${XM} ${yo} C${X1 - ex} ${yo} ${X1 - ex} ${yi} ${X1} ${yi}`,
    yi,
    yo,
  }
}

function Clip({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <path
      d={`M${x + 2} ${y + 6} V${y + 20} a3.5 3.5 0 0 0 7 0 V${y + 3} a5 5 0 0 0 -10 0 V${y + 22} a6 6 0 0 0 12 0 V${y + 8}`}
      className="fz3-clip"
      transform={`rotate(${rot} ${x + 4} ${y})`}
    />
  )
}

function Electromagnet() {
  const { id } = useFig()
  const CXc = 214 // core centre
  const top = 312
  const bot = 404
  const turns = 9
  return (
    <g>
      {/* battery + wires */}
      <rect x={58} y={336} width={58} height={30} rx={4} className="fz3-o fz3-fill2" />
      <rect x={116} y={345} width={6} height={12} rx={1.5} className="fz3-o fz3-fill3" />
      <text x={87} y={356} textAnchor="middle" className="fz3-eq fz3-eq-sm">
        4,5 V
      </text>
      <text x={124} y={338} className="fz3-eq fz3-eq-sm fz3-b-eq">
        +
      </text>
      <text x={52} y={338} textAnchor="end" className="fz3-eq fz3-eq-sm fz3-b-eq">
        −
      </text>
      <path d={`M122 351 H150 V${top + 8} H${CXc - 20}`} className="fz3-wire fz3-wire-thin" />
      <path d={`M58 351 H40 V430 H160 V${bot - 6} H${CXc - 20}`} className="fz3-wire fz3-wire-thin" />
      <path d={`M122 351 H150 V${top + 8} H${CXc - 20}`} className="fz3-current" />
      {/* iron core */}
      <rect x={CXc - 13} y={top - 12} width={26} height={bot - top + 24} rx={3} className="fz3-o fz3-iron" />
      <rect x={CXc - 13} y={top - 12} width={26} height={bot - top + 24} rx={3} fill={pat(id, 'x')} opacity={0.6} />
      <path d={`M${CXc - 20} ${top - 18} H${CXc + 20}`} className="fz3-o fz3-thick" />
      {/* coil turns (front strands) */}
      {Array.from({ length: turns }, (_, i) => {
        const y = top + 8 + (i * (bot - top - 14)) / (turns - 1)
        return <path key={i} d={`M${CXc - 20} ${y} C${CXc - 8} ${y + 7} ${CXc + 8} ${y + 7} ${CXc + 20} ${y - 5}`} className="fz3-coil" />
      })}
      {/* paper clips pulled to the lower end */}
      <Rise delay={0.9}>
        <Clip x={CXc - 10} y={bot + 14} rot={-6} />
        <Clip x={CXc + 2} y={bot + 14} rot={8} />
        <Clip x={CXc - 5} y={bot + 42} rot={14} />
        <Clip x={CXc + 9} y={bot + 40} rot={-10} />
      </Rise>
    </g>
  )
}

export default function SolenoidField() {
  const lines = [1, 2].flatMap((k) => [loop(k, -1), loop(k, 1)])
  const xs = Array.from({ length: 8 }, (_, i) => X1 + 10 + i * 20)
  return (
    <Figure level={7} w={420} h={506} max={540} label={LABEL}>
      {/* legend for the current direction */}
      <Fade delay={0.1}>
        <EndOn x={24} y={22} out r={8} />
        <text x={38} y={27} className="fz3-lbl fz3-sm">
          proud k nám
        </text>
        <EndOn x={150} y={22} out={false} r={8} />
        <text x={164} y={27} className="fz3-lbl fz3-sm">
          proud od nás
        </text>
      </Fade>

      {/* field lines */}
      <Draw d={`M34 ${AY} H386`} className="fz3-field" delay={0.2} />
      <Fade delay={1}>
        <Head x={XM} y={AY} deg={0} tone="blue" />
        <Head x={60} y={AY} deg={0} tone="blue" />
        <Head x={366} y={AY} deg={0} tone="blue" />
      </Fade>
      {lines.map((l, i) => (
        <g key={i}>
          <Draw d={l.d} className="fz3-field" delay={0.3 + i * 0.1} />
          <Fade delay={1.05}>
            <Head x={XM - 30} y={l.yi} deg={0} tone="blue" />
            <Head x={XM} y={l.yo} deg={180} tone="blue" />
          </Fade>
        </g>
      ))}

      {/* windings in section: top out of the page, bottom into it */}
      <rect x={X1} y={AY - R} width={X2 - X1} height={2 * R} className="fz3-o fz3-thin fz3-dash" />
      <Pop delay={0.1}>
        {xs.map((x) => (
          <g key={x}>
            <EndOn x={x} y={AY - R} r={8} out />
            <EndOn x={x} y={AY + R} r={8} out={false} />
          </g>
        ))}
      </Pop>
      <Fade delay={0.7}>
        <text x={X2 + 12} y={AY - 8} className="fz3-pole-lbl fz3-halo" style={{ fill: 'var(--fz3-n)' }}>
          N
        </text>
        <text x={X1 - 12} y={AY - 8} textAnchor="end" className="fz3-pole-lbl fz3-halo" style={{ fill: 'var(--fz3-s)' }}>
          S
        </text>
      </Fade>

      {/* like a bar magnet */}
      <Fade delay={0.9}>
        <PoleBlock x={140} y={254} w={70} h={24} n="S" />
        <PoleBlock x={210} y={254} w={70} h={24} n="N" />
        <text x={210} y={298} textAnchor="middle" className="fz3-lbl fz3-sm">
          pole jako u tyčového magnetu
        </text>
      </Fade>

      <g transform="translate(0 26)">
        <Pop delay={0.2}>
          <Electromagnet />
        </Pop>
        <Fade delay={0.6}>
          <text x={14} y={312} className="fz3-cap fz3-lvl-t">
            elektromagnet
          </text>
          <Lbl x={290} y={322} tx={227} ty={318} className="fz3-sm">
            železné jádro
          </Lbl>
          <Lbl x={290} y={360} tx={234} ty={356} className="fz3-sm">
            cívka
          </Lbl>
          <Lbl x={290} y={404} tx={226} ty={428} className="fz3-sm">
            přitažené sponky
          </Lbl>
          <text x={87} y={386} textAnchor="middle" className="fz3-lbl fz3-sm">
            zdroj
          </text>
          <text x={290} y={446} className="fz3-lbl fz3-sm fz3-muted-t">
            po vypnutí proudu
          </text>
          <text x={290} y={464} className="fz3-lbl fz3-sm fz3-muted-t">
            sponky odpadnou
          </text>
        </Fade>
      </g>
    </Figure>
  )
}
