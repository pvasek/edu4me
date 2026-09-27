import { Atom, ChemText, Draw, Fade, Figure, Mol, Panel, Panels, Plate, Pop, Slide, type MolAtom, type MolBond } from './kit'

const LABEL =
  'Izomery mají stejný souhrnný vzorec, ale jinou stavbu. Řetězcová izomerie C4H10: butan (var −0,5 °C) a rozvětvený 2-methylpropan, isobutan (var −12 °C). Funkční izomerie C2H6O: ethanol se skupinou OH je kapalina s varem 78 °C, dimethylether se skupinou O mezi uhlíky je plyn s varem −24 °C. Cis/trans izomerie but-2-enu: methylové skupiny na stejné, nebo na opačné straně dvojné vazby. Optická izomerie: kyselina mléčná s chirálním uhlíkem existuje jako dva zrcadlové obrazy, které nejdou na sebe přiložit.'

export default function Isomers() {
  return (
    <Figure name="isomers" level={8} label={LABEL} max={680}>
      <Panels min={270}>
        <Panel n={1} title={<>Řetězcová · <ChemText text="C_{4}H_{10}" /></>} delay={0}>
          <Chain />
        </Panel>
        <Panel n={2} title={<>Funkční · <ChemText text="C_{2}H_{6}O" /></>} delay={0.5}>
          <Functional />
        </Panel>
        <Panel n={3} title="Cis/trans · but-2-en" delay={1}>
          <CisTrans />
        </Panel>
        <Panel n={4} title="Optická · zrcadlové obrazy" delay={1.5}>
          <Chiral />
        </Panel>
      </Panels>
    </Figure>
  )
}

function Name({ x, name, note }: { x: number; name: string; note: string }) {
  return (
    <>
      <text className="f89-lb f89-b" x={x} y={166} textAnchor="middle">
        {name}
      </text>
      <text className="f89-lb f89-sm" x={x} y={184} textAnchor="middle">
        {note}
      </text>
    </>
  )
}

function Chain() {
  const butane: MolAtom[] = [
    ['C', 32, 104],
    ['C', 60, 88],
    ['C', 88, 104],
    ['C', 116, 88],
  ]
  const iso: MolAtom[] = [
    ['C', 222, 96],
    ['C', 222, 64],
    ['C', 194, 112],
    ['C', 250, 112],
  ]
  return (
    <Plate w={300} h={200}>
      <Pop delay={0.2}>
        <Mol atoms={butane} bonds={[[0, 1], [1, 2], [2, 3]]} />
      </Pop>
      <Pop delay={0.45}>
        <Mol atoms={iso} bonds={[[0, 1], [0, 2], [0, 3]]} />
      </Pop>
      <Fade delay={0.7}>
        <text className="f89-sym" x={150} y={104} textAnchor="middle" style={{ fontSize: 22 }}>
          ≠
        </text>
        <Name x={74} name="butan" note="var −0,5 °C" />
        <Name x={222} name="isobutan" note="2-methylpropan · var −12 °C" />
      </Fade>
    </Plate>
  )
}

function Functional() {
  const ethanol: MolAtom[] = [
    ['C', 34, 104],
    ['C', 64, 88],
    ['O', 94, 104, { h: [-30] }],
  ]
  const ether: MolAtom[] = [
    ['C', 190, 104],
    ['O', 220, 88],
    ['C', 250, 104],
  ]
  return (
    <Plate w={300} h={200}>
      <Pop delay={0.7}>
        <Mol atoms={ethanol} bonds={[[0, 1], [1, 2]]} />
      </Pop>
      <Pop delay={0.95}>
        <Mol atoms={ether} bonds={[[0, 1], [1, 2]]} />
      </Pop>
      <Draw d="M84 112 C80 90 96 72 116 78 C130 84 120 112 104 116 C96 118 88 118 84 112Z" className="f89-ring" delay={1.3} />
      <Draw d="M206 88 C206 72 234 72 234 88 C234 102 206 102 206 88Z" className="f89-ring" delay={1.4} />
      <Fade delay={1.3}>
        <text className="f89-lb f89-lv f89-sm" x={122} y={70}>
          –OH
        </text>
        <text className="f89-lb f89-lv f89-sm" x={220} y={64} textAnchor="middle">
          –O–
        </text>
        <text className="f89-sym" x={150} y={104} textAnchor="middle" style={{ fontSize: 22 }}>
          ≠
        </text>
        <Name x={66} name="ethanol" note="kapalina · var 78 °C" />
        <Name x={220} name="dimethylether" note="plyn · var −24 °C" />
      </Fade>
    </Plate>
  )
}

function Alkene({ x, trans }: { x: number; trans: boolean }) {
  const atoms: MolAtom[] = [
    ['C', x - 15, 100, { h: [trans ? 120 : 120] }],
    ['C', x + 15, 100, { h: [trans ? -60 : 60] }],
    ['C', x - 32, 72],
    ['C', x + 32, trans ? 128 : 72],
  ]
  const bonds: MolBond[] = [
    [0, 1, 2],
    [0, 2],
    [1, 3],
  ]
  return <Mol atoms={atoms} bonds={bonds} />
}

function CisTrans() {
  return (
    <Plate w={300} h={200}>
      <Pop delay={1.2}>
        <Alkene x={72} trans={false} />
      </Pop>
      <Pop delay={1.45}>
        <Alkene x={222} trans />
      </Pop>
      {/* the double bond axis: groups cannot rotate */}
      <Fade delay={1.8}>
        <line className="f89-guide" x1={20} y1={100} x2={124} y2={100} style={{ stroke: 'var(--lv)' }} />
        <line className="f89-guide" x1={170} y1={100} x2={274} y2={100} style={{ stroke: 'var(--lv)' }} />
        <path className="f89-lvstroke" d="M40 50 Q72 36 104 50" style={{ strokeWidth: 1.4 }} />
        <text className="f89-lb f89-lv f89-sm" x={72} y={34} textAnchor="middle">
          stejná strana
        </text>
        <text className="f89-lb f89-lv f89-sm" x={222} y={40} textAnchor="middle">
          opačné strany
        </text>
        <Name x={72} name="cis-but-2-en" note="var 4 °C" />
        <Name x={222} name="trans-but-2-en" note="var 1 °C" />
      </Fade>
    </Plate>
  )
}

/** Lactic acid around a chiral carbon; `m` mirrors it (x → 300 − x). */
function Lactic({ m }: { m: boolean }) {
  const X = (x: number) => (m ? 300 - x : x)
  const c = { x: X(78), y: 96 }
  const sub = {
    H: { x: X(78), y: 58 },
    OH: { x: X(40), y: 108 },
    CH3: { x: X(114), y: 116 },
    COOH: { x: X(62), y: 134 },
  }
  // wedge toward CH3 (in front of the paper), hashed bond toward COOH (behind)
  const wx = sub.CH3.x - c.x
  const wy = sub.CH3.y - c.y
  const wl = Math.hypot(wx, wy)
  const px = (-wy / wl) * 4.5
  const py = (wx / wl) * 4.5
  const hashes = Array.from({ length: 6 }, (_, i) => {
    const t = 0.2 + (i / 5) * 0.7
    const hx = c.x + (sub.COOH.x - c.x) * t
    const hy = c.y + (sub.COOH.y - c.y) * t
    const w = 1 + t * 4
    return <line key={i} className="f89-bond" style={{ strokeWidth: 1.4 }} x1={hx - w} y1={hy} x2={hx + w} y2={hy} />
  })
  return (
    <g>
      <line className="f89-bond" x1={c.x} y1={c.y} x2={sub.H.x} y2={sub.H.y} />
      <line className="f89-bond" x1={c.x} y1={c.y} x2={sub.OH.x} y2={sub.OH.y} />
      <polygon points={`${c.x},${c.y} ${sub.CH3.x + px},${sub.CH3.y + py} ${sub.CH3.x - px},${sub.CH3.y - py}`} fill="var(--edge)" />
      {hashes}
      <Atom x={sub.H.x} y={sub.H.y} el="H" r={6.5} />
      <Atom x={sub.OH.x} y={sub.OH.y} el="O" r={10} label="OH" />
      <Atom x={sub.CH3.x} y={sub.CH3.y} el="C" r={10} label="CH₃" />
      <Atom x={sub.COOH.x} y={sub.COOH.y} el="C" r={9} label={false} fill="#6d5a7d" />
      <text className="f89-f f89-sm" x={sub.COOH.x} y={sub.COOH.y + 23} textAnchor="middle">
        COOH
      </text>
      <Atom x={c.x} y={c.y} el="C" r={9} className="f89-glow" />
      <text className="f89-lb f89-lv" x={c.x + (m ? -14 : 14)} y={c.y - 10} textAnchor="middle">
        *
      </text>
    </g>
  )
}

function Chiral() {
  return (
    <Plate w={300} h={200}>
      {/* mirror plane */}
      <rect x={146} y={34} width={8} height={120} className="f89-glass" style={{ strokeWidth: 1 }} />
      <text className="f89-lb f89-sm" x={150} y={26} textAnchor="middle">
        zrcadlo
      </text>
      <Pop delay={1.7}>
        <Lactic m={false} />
      </Pop>
      <Slide delay={2.1} dx={-50} dur={0.8}>
        <Lactic m />
      </Slide>
      <Fade delay={2.6}>
        <text className="f89-lb f89-b" x={150} y={178} textAnchor="middle">
          enantiomery kyseliny mléčné
        </text>
        <text className="f89-lb f89-sm" x={150} y={194} textAnchor="middle">
          * chirální uhlík: 4 různé skupiny
        </text>
      </Fade>
    </Plate>
  )
}
