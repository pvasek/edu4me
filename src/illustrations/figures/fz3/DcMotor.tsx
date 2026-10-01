import { Draw, EndOn, Fade, Figure, Head, Lbl, Pop, Sym, Vec, useCompact } from './kit'
import { NORTH, SOUTH } from './kit'
import { Block, D, at, pt, type P } from './machine'

const LABEL =
  'Stejnosměrný elektromotor. Mezi severním pólem N (vlevo) a jižním pólem S (vpravo) magnetu je otočná cívka. Proud do ní přivádějí uhlíkové kartáčky přes komutátor, dva půlkroužky na ose. Magnetické pole míří od N k S. Na pravou stranu cívky, kde proud teče od nás, působí síla dolů, na levou stranu, kde teče k nám, síla nahoru; dvojice sil cívkou otáčí ve směru hodinových ručiček. Komutátor po každé půlotáčce obrátí směr proudu v cívce, takže se cívka točí stále stejným směrem. Vpravo řez ve směru osy.'

const L = 90 // coil length along the axis
const A0: P = [175, 204] // axis at the front edge of the coil
const HW = 48 // coil half width
const FL: P = [A0[0] - HW, A0[1]]
const FR: P = [A0[0] + HW, A0[1]]
const BL = at(FL, L)
const BR = at(FR, L)
const C = at(A0, -34) // commutator
function Perspective() {
  const back = at(A0, L + 24)
  const ml = at(FL, L / 2)
  const mr = at(FR, L / 2)
  const coil = `M${pt([C[0] - 5, C[1] + 3])} L${pt(FL)} L${pt(BL)} L${pt(BR)} L${pt(FR)} L${pt([C[0] + 5, C[1] + 3])}`
  const sideDeg = (Math.atan2(D[1], D[0]) * 180) / Math.PI
  const bx0 = 41 // N block front face left edge
  return (
    <g>
      <Block x={bx0} y={140} w={38} h={112} depth={L} n="N" />
      {/* field between the poles (at mid depth), from N to S */}
      {[150, 168].map((y, i) => (
        <Draw key={y} d={`M${pt(at([bx0 + 38, y], L / 2))} L${pt(at([271, y], L / 2))}`} className="fz3-field fz3-dash" delay={0.3 + i * 0.1} />
      ))}
      <Fade delay={1}>
        {[150, 168].map((y) => {
          const h = at([262, y], L / 2)
          return <Head key={y} x={h[0]} y={h[1]} deg={0} tone="blue" />
        })}
        <Sym x={at([250, 150], L / 2)[0]} y={at([250, 150], L / 2)[1] - 8} t="B" tone="blue" />
      </Fade>
      {/* axis */}
      <path d={`M${pt(C)} L${pt(back)}`} className="fz3-o fz3-axle" />
      {/* the coil: current in at the right side (away from us), back along the left side (towards us) */}
      <Draw d={coil} className="fz3-coil fz3-coil-band" delay={0.1} />
      <Fade delay={0.8}>
        <Head x={mr[0]} y={mr[1]} deg={sideDeg} tone="acc" s={1.2} />
        <Head x={ml[0]} y={ml[1]} deg={sideDeg + 180} tone="acc" s={1.2} />
        <Sym x={mr[0] + 12} y={mr[1] + 4} t="I" tone="acc" anchor="start" />
      </Fade>
      <Vec a={[ml[0], ml[1] - 4]} b={[ml[0], ml[1] - 46]} tone="red" t="F" at={[ml[0] - 12, ml[1] - 34]} delay={0.9} />
      <Vec a={[mr[0], mr[1] + 4]} b={[mr[0], mr[1] + 46]} tone="red" t="F" at={[mr[0] + 13, mr[1] + 48]} delay={0.9} />
      {/* rotation (clockwise seen from the front) at the back end of the axis */}
      <Draw
        d={`M${pt([back[0] - 20, back[1] + 8])} A21 21 0 1 1 ${pt([back[0] + 20, back[1] + 8])}`}
        className="fz3-arr fz3-arr-lvl"
        arrow="lvl"
        delay={1.2}
      />
      <Block x={271} y={140} w={38} h={112} depth={L} n="S" />

      {/* commutator (two half rings) and brushes */}
      <path d={`M${C[0] - 1} ${C[1] - 9} a9 9 0 0 0 0 18 l2 -1.5 V${C[1] - 7.5}Z`} className="fz3-o fz3-copper" />
      <path d={`M${C[0] + 2} ${C[1] - 9} a9 9 0 0 1 0 18 l-2 -1.5 V${C[1] - 7.5}Z`} className="fz3-o fz3-copper" />
      <rect x={C[0] - 27} y={C[1] - 5} width={16} height={10} rx={2} className="fz3-o fz3-brush" />
      <rect x={C[0] + 12} y={C[1] - 5} width={16} height={10} rx={2} className="fz3-o fz3-brush" />
      {/* supply: + to the right brush */}
      <path d={`M${C[0] - 27} ${C[1]} H${C[0] - 46} V292 H${C[0] - 5}`} className="fz3-wire fz3-wire-thin" />
      <path d={`M${C[0] + 28} ${C[1]} H${C[0] + 46} V292 H${C[0] + 5}`} className="fz3-wire fz3-wire-thin" />
      <path d={`M${C[0] + 28} ${C[1]} H${C[0] + 46} V292 H${C[0] + 5}`} className="fz3-current fz3-current-rev" />
      <path d={`M${C[0] - 5} 284 V300`} className="fz3-o" style={{ strokeWidth: 4.5 }} />
      <path d={`M${C[0] + 5} 276 V308`} className="fz3-o fz3-thick" />
      <text x={C[0] - 14} y={274} textAnchor="end" className="fz3-eq fz3-b-eq">
        −
      </text>
      <text x={C[0] + 14} y={274} className="fz3-eq fz3-b-eq">
        +
      </text>
    </g>
  )
}

function EndView() {
  // looking along the axis from the commutator end: ⊙ = towards the viewer
  const cx = 70
  const cy = 100
  return (
    <g>
      <text x={cx} y={14} textAnchor="middle" className="fz3-cap">
        řez ve směru osy
      </text>
      <rect x={0} y={30} width={24} height={140} rx={3} fill={NORTH} className="fz3-o" />
      <rect x={116} y={30} width={24} height={140} rx={3} fill={SOUTH} className="fz3-o" />
      <text x={12} y={107} textAnchor="middle" className="fz3-pole-t">
        N
      </text>
      <text x={128} y={107} textAnchor="middle" className="fz3-pole-t">
        S
      </text>
      {[40, 160].map((y) => (
        <g key={y}>
          <path d={`M30 ${y} H108`} className="fz3-field fz3-dash" />
          <Head x={104} y={y} deg={0} tone="blue" />
        </g>
      ))}
      <Sym x={cx} y={34} t="B" tone="blue" />
      <circle cx={cx} cy={cy} r={34} className="fz3-o fz3-thin fz3-dash" />
      <path d={`M${cx - 34} ${cy} H${cx + 34}`} className="fz3-coil" />
      <EndOn x={cx - 34} y={cy} out r={9} />
      <EndOn x={cx + 34} y={cy} out={false} r={9} />
      <circle cx={cx} cy={cy} r={3} className="fz3-o fz3-fill2" />
      <Vec a={[cx - 34, cy - 10]} b={[cx - 34, cy - 48]} tone="red" t="F" at={[cx - 20, cy - 38]} delay={1} />
      <Vec a={[cx + 34, cy + 10]} b={[cx + 34, cy + 48]} tone="red" t="F" at={[cx + 20, cy + 46]} delay={1} />
      <Draw d={`M${cx + 16} ${cy + 16} A22 22 0 0 1 ${cx - 16} ${cy + 16}`} className="fz3-arr fz3-arr-lvl" arrow="lvl" delay={1.3} />
      <text x={cx} y={192} textAnchor="middle" className="fz3-lbl fz3-sm">
        dvojice sil otáčí cívkou
      </text>
    </g>
  )
}

export default function DcMotor() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure level={7} w={n ? 356 : 520} h={n ? 540 : 336} x0={n ? 14 : 0} max={640} compact={compact} label={LABEL}>
      <Pop delay={0}>
        <Perspective />
      </Pop>
      <Fade delay={0.4}>
        <Lbl x={206} y={108} tx={BL[0] + 36} ty={BL[1] - 1} className="fz3-b">
          cívka
        </Lbl>
        <Lbl x={20} y={290} tx={C[0] - 4} ty={C[1] + 9} className="fz3-sm">
          komutátor
        </Lbl>
        <Lbl x={214} y={290} tx={C[0] + 22} ty={C[1] + 5} className="fz3-sm">
          kartáčky
        </Lbl>
        <text x={C[0]} y={328} textAnchor="middle" className="fz3-lbl fz3-sm">
          zdroj
        </text>
      </Fade>
      <g transform={n ? 'translate(122 336)' : 'translate(370 62)'}>
        <Fade delay={0.3}>
          <EndView />
        </Fade>
      </g>
    </Figure>
  )
}
