import { StepFilm } from '../../sequence/StepFigure'
import { Draw, Fade, Figure, Lbl, Plate, Slide, useHatch } from './kit'

const LABEL =
  'Enzym a substrát podle modelu zámku a klíče a indukovaného přizpůsobení. 1: substrát se blíží k aktivnímu centru enzymu, prohlubni, jejíž tvar mu odpovídá. 2: vznikne komplex enzym–substrát, aktivní centrum se mírně změní a substrát obejme. 3: reakce proběhne, produkty se uvolní a enzym zůstane nezměněný pro další molekulu. 4: inhibitor obsadí aktivní centrum a substrát se nemůže navázat. E + S ⇌ ES → E + P.'

const ENZ = '#6aa7a0'
const SUB = '#e8c35a'
const INH = '#d9736a'

export default function EnzymeLockKey() {
  return (
    <Figure name="enzyme-lock-key" level={9} label={LABEL} max={560} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          { title: 'E + S: zámek a klíč', caption: 'Substrát tvarem pasuje do aktivního centra enzymu.', art: <P1 /> },
          { title: 'Komplex ES', caption: 'Indukované přizpůsobení: aktivní centrum substrát „obejme“.', art: <P2 /> },
          { title: 'E + P: produkty odcházejí', caption: 'Reakce proběhla, produkty se uvolní a enzym zůstane nezměněný.', art: <P3 /> },
          { title: 'Inhibitor blokuje', caption: 'Cizí molekula obsadí aktivní centrum a substrát se už nevejde.', art: <P4 /> },
        ]}
      />
    </Figure>
  )
}

function Enzyme({ fit = false }: { fit?: boolean }) {
  const hatch = useHatch()
  const d = fit
    ? 'M30 118 C30 76 84 68 106 70 C112 62 118 60 120 66 L126 104 H154 L160 66 C162 60 168 62 174 70 C196 68 250 76 250 118 C250 164 190 176 140 174 C90 176 30 164 30 118Z'
    : 'M30 118 C30 76 84 70 110 74 L124 104 H156 L170 74 C196 70 250 76 250 118 C250 164 190 176 140 174 C90 176 30 164 30 118Z'
  return (
    <g>
      <path d={d} fill={ENZ} stroke="var(--edge)" strokeWidth={1.6} />
      <path d={d} fill={hatch('s')} className="f89-hatch" />
      <text className="f89-lb f89-b" x={140} y={148} textAnchor="middle" style={{ fill: '#10302c' }}>
        enzym
      </text>
    </g>
  )
}

/** Substrate: a trapezoid key that fits the pocket; drawn with its top-left at the origin. */
function Substrate({ x, y, color = SUB, label = 'S' }: { x: number; y: number; color?: string; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 H44 L36 28 H8 Z" fill={color} stroke="var(--edge)" strokeWidth={1.4} />
      <text className="f89-lb f89-b" x={22} y={19} textAnchor="middle" style={{ fill: '#3a2a10' }}>
        {label}
      </text>
    </g>
  )
}

function P1() {
  return (
    <Plate w={280} h={190}>
      <Enzyme />
      <Slide delay={0.3} dy={-34} dur={0.9}>
        <Substrate x={118} y={26} />
      </Slide>
      <Fade delay={0.4}>
        <path className="f89-guide" d="M140 58 V74" />
        <Lbl x={206} y={46} tx={158} ty={92} className="f89-sm">
          aktivní centrum
        </Lbl>
        <Lbl x={70} y={34} className="f89-sm">
          substrát
        </Lbl>
      </Fade>
    </Plate>
  )
}

function P2() {
  const d = 0
  return (
    <Plate w={280} h={190}>
      <Enzyme fit />
      <Slide delay={d + 0.3} dy={-40} dur={0.7}>
        <Substrate x={118} y={76} label="ES" />
      </Slide>
      <Draw d="M100 60 Q108 50 118 58" className="f89-lvstroke" delay={d + 0.9} dur={0.4} />
      <Draw d="M180 60 Q172 50 162 58" className="f89-lvstroke" delay={d + 0.9} dur={0.4} />
      <Fade delay={d + 1}>
        <text className="f89-lb f89-lv f89-sm" x={140} y={36} textAnchor="middle">
          centrum se přizpůsobí
        </text>
      </Fade>
    </Plate>
  )
}

function P3() {
  const d = 0
  return (
    <Plate w={280} h={190}>
      <Enzyme />
      <Slide delay={d + 0.3} dx={30} dy={60} dur={0.9}>
        <g transform="rotate(-18 110 40)">
          <path d="M88 30 H110 V58 H96 Z" fill={SUB} stroke="var(--edge)" strokeWidth={1.4} />
        </g>
        <text className="f89-lb f89-b" x={74} y={40}>
          P₁
        </text>
      </Slide>
      <Slide delay={d + 0.3} dx={-30} dy={60} dur={0.9}>
        <g transform="rotate(18 170 40)">
          <path d="M170 30 H192 L184 58 H170 Z" fill={SUB} stroke="var(--edge)" strokeWidth={1.4} />
        </g>
        <text className="f89-lb f89-b" x={200} y={40}>
          P₂
        </text>
      </Slide>
      <Fade delay={d + 0.9}>
        <path className="f89-arr-soft" d="M120 70 L104 52 M160 70 L176 52" stroke="var(--ink-soft)" strokeWidth={1.2} strokeDasharray="3 3" />
        <text className="f89-lb f89-sm" x={140} y={16} textAnchor="middle">
          produkty
        </text>
      </Fade>
    </Plate>
  )
}

function P4() {
  const d = 0
  return (
    <Plate w={280} h={190}>
      <Enzyme />
      <Slide delay={d + 0.3} dy={-40} dur={0.7}>
        <g transform="translate(118 76)">
          <path d="M0 0 H44 L36 28 H8 Z M14 0 Q22 -12 30 0" fill={INH} stroke="var(--edge)" strokeWidth={1.4} />
          <text className="f89-lb f89-b" x={22} y={19} textAnchor="middle" style={{ fill: '#3a1010' }}>
            I
          </text>
        </g>
      </Slide>
      <Slide delay={d + 0.6} dx={20} dur={0.6}>
        <Substrate x={210} y={24} />
      </Slide>
      <Fade delay={d + 1.1}>
        <path d="M204 18 L262 60 M262 18 L204 60" stroke="var(--bad)" strokeWidth={3} strokeLinecap="round" />
        <text className="f89-lb f89-sm" x={80} y={40} textAnchor="middle">
          inhibitor
        </text>
        <line className="f89-lead" x1={96} y1={46} x2={122} y2={84} />
      </Fade>
    </Plate>
  )
}
