import type { ReactNode } from 'react'
import { Arrow, Draw, Fade, Figure, Plate, Pop, Slide } from './kit'

const LABEL =
  'Vznik peptidové vazby: glycin a alanin se spojí kondenzací. Skupina OH z karboxylové skupiny glycinu a vodík z aminoskupiny alaninu odejdou jako molekula vody. Vznikne dipeptid glycylalanin (Gly-Ala) s peptidovou vazbou –CO–NH–. Opakováním vzniká polypeptidový řetězec s N-koncem a C-koncem, například Gly-Ala-Ser-Cys-Lys-Glu-Val.'

const S = ({ x, y, children, lv, sm }: { x: number; y: number; children: ReactNode; lv?: boolean; sm?: boolean }) => (
  <text className="f89-sym" x={x} y={y} textAnchor="middle" style={{ fontSize: sm ? 15 : 17, fill: lv ? 'var(--lv-t)' : undefined }}>
    {children}
  </text>
)
const sub = (t: string) => (
  <tspan dy="0.28em" fontSize="70%">
    {t}
  </tspan>
)
const B = ({ x1, y1, x2, y2, dbl }: { x1: number; y1: number; x2: number; y2: number; dbl?: boolean }) =>
  dbl ? (
    <g>
      <line className="f89-bond" style={{ strokeWidth: 1.6 }} x1={x1 - 2.5} y1={y1} x2={x2 - 2.5} y2={y2} />
      <line className="f89-bond" style={{ strokeWidth: 1.6 }} x1={x1 + 2.5} y1={y1} x2={x2 + 2.5} y2={y2} />
    </g>
  ) : (
    <line className="f89-bond" style={{ strokeWidth: 1.6 }} x1={x1} y1={y1} x2={x2} y2={y2} />
  )

/** C(=O) centred at (x, y). */
function Carbonyl({ x, y }: { x: number; y: number }) {
  return (
    <>
      <S x={x} y={y + 6}>C</S>
      <B x1={x} y1={y - 10} x2={x} y2={y - 26} dbl />
      <S x={x} y={y - 30}>O</S>
    </>
  )
}

function Glycine({ x, y, hl }: { x: number; y: number; hl?: boolean }) {
  return (
    <g>
      <S x={x} y={y + 6}>H{sub('2')}N</S>
      <B x1={x + 20} y1={y} x2={x + 36} y2={y} />
      <S x={x + 58} y={y + 6}>CH{sub('2')}</S>
      <B x1={x + 80} y1={y} x2={x + 94} y2={y} />
      <Carbonyl x={x + 102} y={y} />
      <B x1={x + 111} y1={y} x2={x + 125} y2={y} />
      <S x={x + 142} y={y + 6} lv={hl}>OH</S>
    </g>
  )
}

function Alanine({ x, y, hl }: { x: number; y: number; hl?: boolean }) {
  return (
    <g>
      <S x={x} y={y + 6} lv={hl}>H</S>
      <B x1={x + 8} y1={y} x2={x + 24} y2={y} />
      <S x={x + 33} y={y + 6}>N</S>
      <B x1={x + 33} y1={y + 10} x2={x + 33} y2={y + 26} />
      <S x={x + 33} y={y + 42}>H</S>
      <B x1={x + 43} y1={y} x2={x + 58} y2={y} />
      <S x={x + 74} y={y + 6}>CH</S>
      <B x1={x + 74} y1={y + 10} x2={x + 74} y2={y + 26} />
      <S x={x + 76} y={y + 42}>CH{sub('3')}</S>
      <B x1={x + 90} y1={y} x2={x + 104} y2={y} />
      <Carbonyl x={x + 112} y={y} />
      <B x1={x + 121} y1={y} x2={x + 135} y2={y} />
      <S x={x + 152} y={y + 6}>OH</S>
    </g>
  )
}

function Dipeptide({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <S x={x} y={y + 6}>H{sub('2')}N</S>
      <B x1={x + 20} y1={y} x2={x + 36} y2={y} />
      <S x={x + 58} y={y + 6}>CH{sub('2')}</S>
      <B x1={x + 80} y1={y} x2={x + 94} y2={y} />
      <Carbonyl x={x + 102} y={y} />
      <B x1={x + 111} y1={y} x2={x + 126} y2={y} />
      <S x={x + 135} y={y + 6}>N</S>
      <B x1={x + 135} y1={y + 10} x2={x + 135} y2={y + 26} />
      <S x={x + 135} y={y + 42}>H</S>
      <B x1={x + 145} y1={y} x2={x + 160} y2={y} />
      <S x={x + 176} y={y + 6}>CH</S>
      <B x1={x + 176} y1={y + 10} x2={x + 176} y2={y + 26} />
      <S x={x + 178} y={y + 42}>CH{sub('3')}</S>
      <B x1={x + 192} y1={y} x2={x + 206} y2={y} />
      <Carbonyl x={x + 214} y={y} />
      <B x1={x + 223} y1={y} x2={x + 237} y2={y} />
      <S x={x + 254} y={y + 6}>OH</S>
    </g>
  )
}

const CHAIN = [
  ['Gly', '#c9a86a'],
  ['Ala', '#b98a5a'],
  ['Ser', '#6fa0c8'],
  ['Cys', '#e0b43a'],
  ['Lys', '#7f8fd6'],
  ['Glu', '#d9736a'],
  ['Val', '#9bb56a'],
] as const

export default function PeptideBond() {
  const gx = 34
  const ax = 262
  const r1 = 76
  const px = 40
  const r2 = 218
  return (
    <Figure name="peptide-bond" level={9} label={LABEL} max={600} replay>
      <Plate w={480} h={392}>
        <Pop delay={0.1}>
          <Glycine x={gx} y={r1} hl />
          <text className="f89-lb f89-sm" x={gx + 60} y={r1 + 46} textAnchor="middle">
            glycin
          </text>
        </Pop>
        <Fade delay={0.15}>
          <S x={228} y={r1 + 6}>+</S>
        </Fade>
        <Pop delay={0.2}>
          <Alanine x={ax} y={r1} hl />
          <text className="f89-lb f89-sm" x={ax + 130} y={r1 + 46} textAnchor="middle">
            alanin
          </text>
        </Pop>
        {/* the atoms that leave as water */}
        <Draw d={`M${gx + 124} ${r1 - 16} H${ax + 12} Q${ax + 20} ${r1 - 16} ${ax + 20} ${r1} Q${ax + 20} ${r1 + 16} ${ax + 12} ${r1 + 16} H${gx + 124} Q${gx + 116} ${r1 + 16} ${gx + 116} ${r1} Q${gx + 116} ${r1 - 16} ${gx + 124} ${r1 - 16}Z`} className="f89-ring" delay={0.45} dur={0.6} />
        <Fade delay={0.75}>
          <Arrow x1={330} y1={r1 + 58} x2={330} y2={r2 - 44} />
          <text className="f89-lb f89-lv" x={340} y={r1 + 86}>
            kondenzace, − H₂O
          </text>
        </Fade>
        <Pop delay={0.95}>
          <Dipeptide x={px} y={r2} />
          <text className="f89-lb f89-sm" x={px + 130} y={r2 + 64} textAnchor="middle">
            dipeptid glycylalanin (Gly-Ala)
          </text>
        </Pop>
        <Draw d={`M${px + 92} ${r2 - 48} H${px + 146} V${r2 + 48} H${px + 92} Z`} className="f89-ln" style={{ stroke: 'var(--lv)', strokeWidth: 2 }} delay={1.2} dur={0.5} />
        <Fade delay={1.45}>
          <rect x={px + 92} y={r2 - 48} width={54} height={96} fill="var(--lv)" opacity={0.12} />
          <text className="f89-lb f89-lv f89-b" x={px + 119} y={r2 - 56} textAnchor="middle">
            peptidová vazba
          </text>
        </Fade>
        <Fade delay={1.05}>
          <S x={px + 292} y={r2 + 6}>+</S>
        </Fade>
        <Slide delay={1.1} dx={-110} dy={r1 - r2} dur={0.7}>
          <S x={px + 336} y={r2 + 6} lv>
            H{sub('2')}O
          </S>
        </Slide>

        {/* a short chain */}
        <line className="f89-thin" x1={10} y1={300} x2={470} y2={300} style={{ opacity: 0.4 }} />
        <Fade delay={1.55}>
          <text className="f89-lb f89-b" x={16} y={326}>
            polypeptid
          </text>
          <text className="f89-lb f89-sm" x={24} y={372} textAnchor="middle">
            N-konec
          </text>
          <text className="f89-lb f89-sm" x={450} y={372} textAnchor="middle">
            C-konec
          </text>
          <line className="f89-bond" x1={24} y1={354} x2={450} y2={354} />
        </Fade>
        {CHAIN.map(([name, color], i) => {
          const x = 78 + i * 53
          return (
            <Pop key={name} delay={1.65 + i * 0.06}>
              <circle cx={x} cy={354} r={19} fill={color} stroke="var(--edge)" strokeWidth={1.3} />
              <text className="f89-t" x={x} y={358} textAnchor="middle" style={{ fill: '#1f2a44', fontWeight: 700 }}>
                {name}
              </text>
              {i < CHAIN.length - 1 && <rect x={x + 21} y={350} width={11} height={8} rx={1.5} fill="var(--lv)" stroke="var(--edge)" strokeWidth={0.8} />}
            </Pop>
          )
        })}
        <Fade delay={2.1} dur={0.3}>
          <text className="f89-lb f89-sm f89-lv" x={464} y={326} textAnchor="end">
            ▬ = peptidová vazba
          </text>
        </Fade>
      </Plate>
    </Figure>
  )
}
