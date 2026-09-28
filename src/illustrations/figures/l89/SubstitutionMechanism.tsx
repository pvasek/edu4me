import { StepFilm } from '../../sequence/StepFigure'
import { Arrow, Atom, ChemText, Curly, Draw, Fade, Figure, Mol, Plate, Pop, F } from './kit'

const LABEL =
  'Radikálová substituce: chlorace methanu za světla. Iniciace: UV záření rozštěpí molekulu chloru homolyticky na dva radikály chloru, Cl2 → 2 Cl·. Propagace 1: radikál chloru utrhne methanu vodík, Cl· + CH4 → HCl + ·CH3. Propagace 2: methylový radikál vezme atom chloru z další molekuly Cl2, ·CH3 + Cl2 → CH3Cl + Cl·, a nový radikál chloru řetěz opakuje. Terminace: dva radikály se spojí, Cl· + Cl· → Cl2, ·CH3 + Cl· → CH3Cl nebo ·CH3 + ·CH3 → C2H6.'

export default function SubstitutionMechanism() {
  return (
    <Figure name="substitution-mechanism" level={8} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: 'Iniciace',
            caption: (
              <>
                Světlo rozštěpí Cl–Cl <b>homolyticky</b>: každý atom si vezme jeden elektron.
              </>
            ),
            art: <Initiation />,
          },
          { title: 'Propagace 1', caption: 'Radikál chloru utrhne methanu vodík.', art: <Prop1 /> },
          {
            title: 'Propagace 2',
            caption: (
              <>
                Vznikne chlormethan a nový <b>Cl·</b>, který se vrací do kroku 2. Řetěz běží dál.
              </>
            ),
            art: <Prop2 />,
          },
          { title: 'Terminace', caption: 'Srazí se dva radikály a řetěz skončí.', art: <Termination /> },
        ]}
      />
    </Figure>
  )
}

/** Unpaired electron: a dot with a softly pulsing halo (ambient loop). */
function Rad({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5.5} className="f89-pulse" fill="var(--lv)" opacity={0.3} />
      <circle cx={x} cy={y} r={2.6} fill="var(--lv)" stroke="var(--edge)" strokeWidth={0.6} />
    </g>
  )
}

function Cl2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line className="f89-bond" x1={x} y1={y} x2={x + 26} y2={y} />
      <Atom x={x} y={y} el="Cl" r={11} />
      <Atom x={x + 26} y={y} el="Cl" r={11} />
    </g>
  )
}
function Methane({ x, y }: { x: number; y: number }) {
  return <Mol atoms={[['C', x, y]]} bonds={[]} />
}
function Methyl({ x, y, rad = true }: { x: number; y: number; rad?: boolean }) {
  return (
    <g>
      <Mol atoms={[['C', x, y, { h: [-90, 30, 150] }]]} bonds={[]} />
      {rad && <Rad x={x + 13} y={y - 6} />}
    </g>
  )
}
function Plus({ x, y }: { x: number; y: number }) {
  return (
    <text className="f89-sym" x={x} y={y + 6} textAnchor="middle">
      +
    </text>
  )
}

function Initiation() {
  return (
    <Plate w={300} h={140}>
      <Pop delay={0.1}>
        <Cl2 x={44} y={78} />
      </Pop>
      {/* photon */}
      <Draw d="M40 18 l6 6 l-6 6 l6 6 l-6 6 l6 6 l-4 4" className="f89-lvstroke" delay={0.2} dur={0.4} />
      <Fade delay={0.3}>
        <text className="f89-lb f89-lv" x={54} y={30}>
          hν (UV)
        </text>
      </Fade>
      <Curly from={[57, 84]} to={[40, 100]} bend={-10} fish delay={0.5} dur={0.4} />
      <Curly from={[57, 84]} to={[74, 100]} bend={10} fish delay={0.5} dur={0.4} />
      <Fade delay={0.8}>
        <Arrow x1={108} y1={78} x2={148} y2={78} />
      </Fade>
      <Pop delay={0.9}>
        <Atom x={180} y={78} el="Cl" r={11} />
        <Rad x={196} y={68} />
        <Atom x={240} y={78} el="Cl" r={11} />
        <Rad x={256} y={68} />
      </Pop>
      <F x={150} y={128} t="Cl_{2} → 2 Cl·" />
    </Plate>
  )
}

function Prop1() {
  return (
    <Plate w={300} h={140}>
      <Pop delay={0.1}>
        <Atom x={24} y={74} el="Cl" r={11} />
        <Rad x={40} y={64} />
      </Pop>
      <Pop delay={0.2}>
        <Methane x={92} y={74} />
      </Pop>
      <Curly from={[44, 60]} to={[92, 52]} bend={-14} fish delay={0.4} dur={0.4} />
      <Fade delay={0.7}>
        <Arrow x1={122} y1={74} x2={150} y2={74} />
      </Fade>
      <Pop delay={0.8}>
        <line className="f89-bond" x1={172} y1={74} x2={192} y2={74} />
        <Atom x={172} y={74} el="H" r={6.5} />
        <Atom x={194} y={74} el="Cl" r={11} />
        <Plus x={222} y={74} />
        <Methyl x={256} y={76} />
      </Pop>
      <F x={150} y={128} t="Cl· + CH_{4} → HCl + ·CH_{3}" />
    </Plate>
  )
}

function Prop2() {
  return (
    <Plate w={300} h={140}>
      <Pop delay={0.1}>
        <Methyl x={30} y={76} />
      </Pop>
      <Pop delay={0.2}>
        <Cl2 x={78} y={74} />
      </Pop>
      <Curly from={[46, 64]} to={[78, 58]} bend={-12} fish delay={0.4} dur={0.4} />
      <Fade delay={0.7}>
        <Arrow x1={124} y1={74} x2={150} y2={74} />
      </Fade>
      <Pop delay={0.8}>
        <Mol atoms={[['C', 178, 74, { h: [-90, 90, 180] }], ['Cl', 202, 74]]} bonds={[[0, 1]]} />
        <Plus x={232} y={74} />
        <Atom x={262} y={74} el="Cl" r={11} />
        <Rad x={278} y={64} />
      </Pop>
      {/* back to step 2 */}
      <Draw d="M262 94 C262 112 232 116 206 108" className="f89-lvstroke" delay={1.0} dur={0.5} />
      <Fade delay={1.3}>
        <polygon points="200,106 209,103 207,112" className="f89-lvfill" />
        <text className="f89-lb f89-lv f89-sm" x={196} y={112} textAnchor="end">
          zpět do kroku 2
        </text>
      </Fade>
      <F x={150} y={134} t="·CH_{3} + Cl_{2} → CH_{3}Cl + Cl·" />
    </Plate>
  )
}

function Termination() {
  const rows = ['Cl· + Cl· → Cl_{2}', '·CH_{3} + Cl· → CH_{3}Cl', '·CH_{3} + ·CH_{3} → C_{2}H_{6}']
  return (
    <Plate w={300} h={140}>
      {rows.map((r, i) => (
        <Pop key={r} delay={0.1 + i * 0.2}>
          <circle cx={36} cy={32 + i * 38} r={11} className="f89-soft" style={{ strokeWidth: 1 }} />
          <circle cx={31} cy={32 + i * 38} r={2.4} fill="var(--lv)" />
          <circle cx={41} cy={32 + i * 38} r={2.4} fill="var(--lv)" />
          <text className="f89-f" x={60} y={37 + i * 38} style={{ fontSize: 14 }}>
            <ChemText text={r} />
          </text>
        </Pop>
      ))}
    </Plate>
  )
}
