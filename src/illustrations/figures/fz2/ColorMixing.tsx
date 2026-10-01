import { StepStrip } from '../../sequence/StepFigure'
import { Figure, Frame, useFig } from './kit'

const LABEL =
  'Skládání barev. Aditivní míchání světla (obrazovky, reflektory): červená, zelená a modrá světla se sčítají, červená se zelenou dá žlutou, zelená s modrou azurovou, modrá s červenou purpurovou a všechny tři dohromady bílou. Subtraktivní míchání barev (tisk, malování): azurová, purpurová a žlutá barva světlo pohlcují, azurová s purpurovou dá modrou, purpurová se žlutou červenou, žlutá s azurovou zelenou a všechny tři téměř černou.'

const C1 = [150, 80] as const
const C2 = [118, 134] as const
const C3 = [182, 134] as const
const R = 50

type Set = { a: string; b: string; c: string; ab: string; bc: string; ca: string; abc: string; bg: string; ink: string }
const ADD: Set = { a: '#f2352b', b: '#35c24a', c: '#3060f0', ab: '#f5e23a', bc: '#4fd6ee', ca: '#e24fd9', abc: '#ffffff', bg: '#12141c', ink: '#fffaf0' }
const SUB: Set = { a: '#e8338f', b: '#f5d80f', c: '#27b3e6', ab: '#e0312a', bc: '#2f9e44', ca: '#2e3f9e', abc: '#1b1b1f', bg: '#fffaf0', ink: '#1f2a44' }

function Venn({ s, letters }: { s: Set; letters: [string, string, string, string, string, string, string] }) {
  const { id } = useFig()
  const k = (n: string) => `${id}-venn-${n}`
  const circ = (c: readonly [number, number]) => <circle cx={c[0]} cy={c[1]} r={R} />
  const lum = (hex: string) => {
    const v = parseInt(hex.slice(1), 16)
    return (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255
  }
  const t = (x: number, y: number, txt: string, bg: string) => (
    <text x={x} y={y + 5} textAnchor="middle" className="fz2-venn-t" style={{ fill: lum(bg) > 0.55 ? '#1f2a44' : '#fffaf0' }}>
      {txt}
    </text>
  )
  return (
    <g>
      <defs>
        <clipPath id={k('a')}>{circ(C1)}</clipPath>
        <clipPath id={k('b')}>{circ(C2)}</clipPath>
        <clipPath id={k('c')}>{circ(C3)}</clipPath>
      </defs>
      <rect x={20} y={14} width={260} height={184} rx={10} fill={s.bg} className="fz2-o" />
      <circle cx={C1[0]} cy={C1[1]} r={R} fill={s.a} />
      <circle cx={C2[0]} cy={C2[1]} r={R} fill={s.b} />
      <circle cx={C3[0]} cy={C3[1]} r={R} fill={s.c} />
      <g clipPath={`url(#${k('a')})`}>
        <circle cx={C2[0]} cy={C2[1]} r={R} fill={s.ab} />
        <circle cx={C3[0]} cy={C3[1]} r={R} fill={s.ca} />
      </g>
      <g clipPath={`url(#${k('b')})`}>
        <circle cx={C3[0]} cy={C3[1]} r={R} fill={s.bc} />
      </g>
      <g clipPath={`url(#${k('a')})`}>
        <g clipPath={`url(#${k('b')})`}>
          <circle cx={C3[0]} cy={C3[1]} r={R} fill={s.abc} />
        </g>
      </g>
      {[C1, C2, C3].map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={R} fill="none" stroke={s.ink} strokeOpacity={0.35} strokeWidth={1} />
      ))}
      {t(150, 56, letters[0], s.a)}
      {t(98, 152, letters[1], s.b)}
      {t(202, 152, letters[2], s.c)}
      {t(122, 100, letters[3], s.ab)}
      {t(150, 150, letters[4], s.bc)}
      {t(178, 100, letters[5], s.ca)}
      {t(150, 118, letters[6], s.abc)}
    </g>
  )
}

function Additive() {
  return (
    <Frame w={300} h={236}>
      <Venn s={ADD} letters={['R', 'G', 'B', 'Y', 'C', 'M', 'W']} />
      {/* screen sub-pixels */}
      <g transform="translate(30 208)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 22} 0)`}>
            <rect x={0} y={0} width={5} height={18} fill={ADD.a} />
            <rect x={6} y={0} width={5} height={18} fill={ADD.b} />
            <rect x={12} y={0} width={5} height={18} fill={ADD.c} />
          </g>
        ))}
      </g>
      <text x={124} y={223} className="fz2-lbl fz2-sm">
        pixely obrazovky: R G B
      </text>
    </Frame>
  )
}

function Subtractive() {
  const dots = []
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) dots.push([34 + i * 16 + (j ? 8 : 0), 212 + j * 9, [SUB.c, SUB.a, SUB.b, '#1b1b1f'][(i + j) % 4]] as const)
  return (
    <Frame w={300} h={236}>
      <Venn s={SUB} letters={['M', 'Y', 'C', 'R', 'G', 'B', 'K']} />
      {dots.map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r={3.6} fill={c} />
      ))}
      <text x={124} y={223} className="fz2-lbl fz2-sm">
        tiskové body: C M Y K
      </text>
    </Frame>
  )
}

export default function ColorMixing() {
  return (
    <Figure level={5} label={LABEL} max={680} interactive>
      <div className="fz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: 'Světla se sčítají (RGB)',
              caption: 'Červená + zelená = žlutá, zelená + modrá = azurová, modrá + červená = purpurová, všechny tři = bílá. Obrazovky, projektory.',
              art: <Additive />,
            },
            {
              title: 'Barvy pohlcují (CMY)',
              caption: 'Azurová + purpurová = modrá, purpurová + žlutá = červená, žlutá + azurová = zelená, všechny = černá. Tiskárny, malování.',
              art: <Subtractive />,
            },
          ]}
        />
      </div>
    </Figure>
  )
}
