import { Draw, Fade, Figure, Head, Lbl, Pop, Sym, f1, useClock } from './kit'

const LABEL =
  'Oerstedův pokus. Svislým vodičem prochází elektrický proud I směrem vzhůru. Kolem vodiče vzniká magnetické pole: jeho indukční čáry jsou soustředné kružnice ve vodorovné rovině a při pohledu shora mají směr proti chodu hodinových ručiček. Střelky kompasů rozmístěných kolem vodiče se po zapnutí proudu natočí ve směru těchto kružnic. Pravidlo pravé ruky: palec ukazuje směr proudu, zahnuté prsty směr indukčních čar.'

const CX = 145
const CY = 250
const TILT = 0.45 // ry / rx of a horizontal circle seen from above-front
const RINGS = [42, 78, 112]

/** Point on the horizontal circle of radius r at parameter θ (deg); θ = 90° is the front. */
const on = (r: number, th: number): [number, number] => {
  const a = (th * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * TILT * Math.sin(a)]
}
/**
 * Screen direction (deg) of the field at θ. Current up → field anticlockwise seen from
 * above, i.e. to the right at the front (θ = 90°): the tangent with θ decreasing.
 */
const fieldDeg = (r: number, th: number) => {
  const a = (th * Math.PI) / 180
  return (Math.atan2(-r * TILT * Math.cos(a), r * Math.sin(a)) * 180) / Math.PI
}

function ring(r: number) {
  const ry = r * TILT
  return `M${CX - r} ${CY} A${r} ${f1(ry)} 0 1 0 ${CX + r} ${CY} A${r} ${f1(ry)} 0 1 0 ${CX - r} ${CY}`
}

/** A compass lying on the board at θ on ring r; the needle turns from north to the field. */
function Compass({ th, p }: { th: number; p: number }) {
  const [x, y] = on(78, th)
  const R = 21
  // needle direction in the board plane (top view: x right, z towards the viewer)
  const a0 = -Math.PI / 2 // north = away from the viewer
  const a = (th * Math.PI) / 180
  let a1 = Math.atan2(-Math.cos(a), Math.sin(a))
  while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI
  while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI
  const psi = a0 + (a1 - a0) * p
  const tx = Math.cos(psi) * (R - 3)
  const tz = Math.sin(psi) * (R - 3) * TILT
  const nx = -Math.sin(psi) * 4
  const nz = Math.cos(psi) * 4 * TILT
  const n = `M${f1(x + tx)} ${f1(y + tz)} L${f1(x + nx)} ${f1(y + nz)} L${f1(x - nx)} ${f1(y - nz)}Z`
  const s = `M${f1(x - tx)} ${f1(y - tz)} L${f1(x + nx)} ${f1(y + nz)} L${f1(x - nx)} ${f1(y - nz)}Z`
  return (
    <g>
      <ellipse cx={x} cy={y + 2.5} rx={R} ry={R * TILT} className="fz3-o fz3-fill3" />
      <ellipse cx={x} cy={y} rx={R} ry={R * TILT} className="fz3-o fz3-fill" />
      <path d={s} className="fz3-needle-s" />
      <path d={n} className="fz3-needle" />
      <circle cx={x} cy={y} r={1.4} className="fz3-dot" />
    </g>
  )
}

function Hand() {
  // a right hand gripping a vertical wire (x = 335): thumb up = current, fingers wrap to the right in front
  const X = 335
  return (
    <g>
      <path d={`M${X} 58 V222`} className="fz3-wire" />
      <Head x={X} y={70} deg={-90} tone="acc" s={1.3} />
      <Sym x={X + 12} y={76} t="I" tone="acc" anchor="start" />
      {/* the field ring above the fist */}
      <path d={`M${X - 34} 104 A34 11 0 1 0 ${X + 34} 104 A34 11 0 1 0 ${X - 34} 104`} className="fz3-field" />
      <Head x={X + 4} y={115} deg={0} tone="blue" />
      <Head x={X - 4} y={93} deg={180} tone="blue" />
      <Sym x={X + 42} y={100} t="B" tone="blue" anchor="start" />
      {/* palm + thumb */}
      <path
        d={`M${X - 30} 204 C${X - 36} 184 ${X - 34} 156 ${X - 22} 142 L${X - 13} 142 L${X - 13} 122 C${X - 13} 112 ${X - 1} 112 ${X - 1} 122 L${X - 1} 146 L${X - 22} 150`}
        className="fz3-o fz3-skin"
      />
      {/* four fingers crossing in front of the wire to the right */}
      {[0, 1, 2, 3].map((i) => {
        const y = 150 + i * 14
        const r = 30 - Math.abs(i - 1.2) * 2
        return (
          <path
            key={i}
            d={`M${X - 26} ${y} H${X + r - 6} C${X + r + 3} ${y} ${X + r + 3} ${y + 13} ${X + r - 6} ${y + 13} H${X - 26}`}
            className="fz3-o fz3-skin"
          />
        )
      })}
      <path d={`M${X - 30} 204 C${X - 26} 214 ${X - 6} 214 ${X + 6} 206`} className="fz3-o fz3-skin" />
    </g>
  )
}

/** The compasses turn once the plate is seen (the clock lives inside the Figure). */
function Compasses() {
  const t = useClock(2.2)
  const p = Math.min(1, Math.max(0, (t - 0.7) / 1.3))
  const turn = 1 - (1 - p) ** 3
  return (
    <>
      {[90, 160, 16, 244].map((th) => (
        <Compass key={th} th={th} p={turn} />
      ))}
    </>
  )
}

export default function Oersted() {
  return (
    <Figure level={7} w={420} h={362} max={560} replay label={LABEL}>
      {/* wire below the board */}
      <path d={`M${CX} ${CY + 30} V342`} className="fz3-wire fz3-wire-under" />
      {/* the board: a horizontal card */}
      <ellipse cx={CX} cy={CY + 8} rx={132} ry={132 * TILT} className="fz3-o fz3-fill3" />
      <ellipse cx={CX} cy={CY} rx={132} ry={132 * TILT} className="fz3-o fz3-fill" />
      {/* field lines: concentric circles, anticlockwise seen from above */}
      {RINGS.map((r, i) => (
        <g key={r}>
          <Draw d={ring(r)} className="fz3-field" delay={0.15 + i * 0.12} />
          <Fade delay={0.9 + i * 0.1}>
            {[112, 292].map((th) => {
              const [x, y] = on(r, th)
              return <Head key={th} x={x} y={y} deg={fieldDeg(r, th)} tone="blue" />
            })}
          </Fade>
        </g>
      ))}
      <Compasses />
      {/* wire above the board */}
      <path d={`M${CX} 42 V${CY}`} className="fz3-wire" />
      <circle cx={CX} cy={CY} r={3.5} className="fz3-o fz3-fill2" />
      <Head x={CX} y={64} deg={-90} tone="acc" s={1.3} />
      <Head x={CX} y={330} deg={-90} tone="acc" s={1.3} />
      <Sym x={CX + 12} y={70} t="I" tone="acc" anchor="start" />

      <Fade delay={0.5}>
        <Lbl x={14} y={116} tx={CX - 3} ty={140} className="fz3-b">
          vodič s proudem
        </Lbl>
        <Lbl x={14} y={196} tx={63} ty={244}>
          kompas
        </Lbl>
        <Lbl x={400} y={352} tx={on(112, 40)[0]} ty={on(112, 40)[1]} anchor="end" className="fz3-sm">
          indukční čáry: kružnice
        </Lbl>
      </Fade>
      <Pop delay={0.3}>
        <Hand />
      </Pop>
      <Fade delay={0.6}>
        <text x={335} y={246} textAnchor="middle" className="fz3-lbl fz3-b">
          pravá ruka
        </text>
        <text x={335} y={266} textAnchor="middle" className="fz3-lbl fz3-sm">
          palec → proud
        </text>
        <text x={335} y={284} textAnchor="middle" className="fz3-lbl fz3-sm">
          prsty → čáry
        </text>
      </Fade>
    </Figure>
  )
}
