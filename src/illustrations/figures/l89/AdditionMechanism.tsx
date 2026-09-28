import type { ReactNode } from 'react'
import { StepFilm } from '../../sequence/StepFigure'
import { Curly, Fade, Figure, Plate, Pop } from './kit'

const LABEL =
  'Elektrofilní adice bromovodíku na propen krok za krokem. 1: π-elektrony dvojné vazby chytí proton z HBr, vazba H–Br se štěpí heterolyticky a brom odchází jako Br−. 2: proton se naváže na krajní uhlík CH2 s více vodíky a na prostředním uhlíku vznikne stabilnější sekundární karbokation CH3–CH+–CH3. 3: anion Br− se naváže na kladně nabitý uhlík. Hlavním produktem je podle Markovnikovova pravidla 2-brompropan CH3–CHBr–CH3.'

export default function AdditionMechanism() {
  return (
    <Figure name="addition-mechanism" level={8} label={LABEL} max={540} interactive>
      <StepFilm
        label={LABEL}
        steps={[
          {
            title: 'Útok na proton',
            caption: (
              <>
                π-elektrony dvojné vazby „chytí“ <b>H⁺</b>, oba elektrony vazby H–Br si vezme brom.
              </>
            ),
            art: <Step1 />,
          },
          {
            title: 'Karbokation',
            caption: (
              <>
                H jde na krajní CH₂ (má víc vodíků). Vznikne <b>sekundární karbokation</b>, stabilnější než primární.
              </>
            ),
            art: <Step2 />,
          },
          {
            title: 'Produkt',
            caption: (
              <>
                <b>Br⁻</b> se naváže na C⁺. Hlavní produkt: <b>2-brompropan</b>, 1-brompropanu vznikne jen málo.
              </>
            ),
            art: <Step3 />,
          },
        ]}
      />
    </Figure>
  )
}

function S({ x, y, children, lv = false, size }: { x: number; y: number; children: ReactNode; lv?: boolean; size?: number }) {
  return (
    <text className="f89-sym" x={x} y={y} textAnchor="middle" style={{ fill: lv ? 'var(--lv-t)' : undefined, fontSize: size }}>
      {children}
    </text>
  )
}
const sub = (t: string) => (
  <tspan dy="0.28em" fontSize="70%">
    {t}
  </tspan>
)
const sup = (t: string) => (
  <tspan dy="-0.45em" fontSize="75%">
    {t}
  </tspan>
)

/** Lone pairs around a symbol centred at (x, y). */
function Pairs({ x, y, sides }: { x: number; y: number; sides: ('t' | 'b' | 'l' | 'r')[] }) {
  const pos = { t: [0, -18, 1, 0], b: [0, 10, 1, 0], l: [-17, -4, 0, 1], r: [17, -4, 0, 1] } as const
  return (
    <g>
      {sides.map((s) => {
        const [dx, dy, hx, vy] = pos[s]
        return (
          <g key={s}>
            <circle cx={x + dx - hx * 3} cy={y + dy - vy * 3} r={1.6} fill="var(--edge)" />
            <circle cx={x + dx + hx * 3} cy={y + dy + vy * 3} r={1.6} fill="var(--edge)" />
          </g>
        )
      })}
    </g>
  )
}

function Propene({ y = 116 }: { y?: number }) {
  const b = y - 6
  return (
    <g>
      <S x={44} y={y}>H{sub('2')}C</S>
      <line className="f89-bond" x1={66} y1={b - 3} x2={98} y2={b - 3} />
      <line className="f89-bond" x1={66} y1={b + 3} x2={98} y2={b + 3} />
      <S x={116} y={y}>CH</S>
      <line className="f89-bond" x1={136} y1={b} x2={166} y2={b} />
      <S x={190} y={y}>CH{sub('3')}</S>
    </g>
  )
}

function Step1() {
  return (
    <Plate w={260} h={160}>
      <Pop delay={0.1}>
        <Propene />
      </Pop>
      <Pop delay={0.25}>
        <S x={82} y={50}>H</S>
        <line className="f89-bond" x1={94} y1={44} x2={120} y2={44} />
        <S x={138} y={50}>Br</S>
        <text className="f89-f f89-sm f89-muted" x={82} y={30} textAnchor="middle">δ+</text>
        <text className="f89-f f89-sm f89-muted" x={168} y={44} textAnchor="middle">δ−</text>
      </Pop>
      <Curly from={[82, 101]} to={[80, 58]} bend={-22} delay={0.4} dur={0.5} />
      <Curly from={[108, 40]} to={[140, 30]} bend={16} delay={0.7} dur={0.5} side={-1} />
      <Fade delay={0.6}>
        <text className="f89-lb f89-lv f89-sm" x={32} y={80}>
          π
        </text>
        <text className="f89-lb f89-sm" x={130} y={150} textAnchor="middle">
          propen + bromovodík
        </text>
      </Fade>
    </Plate>
  )
}

function Step2() {
  return (
    <Plate w={260} h={160}>
      <Pop delay={0.1}>
        <S x={44} y={116}>
          <tspan style={{ fill: 'var(--lv-t)' }}>H</tspan>
          {sub('3')}C
        </S>
        <line className="f89-bond" x1={66} y1={110} x2={98} y2={110} />
        <S x={116} y={116}>CH</S>
        <text className="f89-sym" x={132} y={100} style={{ fill: 'var(--lv-t)', fontSize: 17 }}>
          +
        </text>
        <line className="f89-bond" x1={142} y1={110} x2={166} y2={110} />
        <S x={190} y={116}>CH{sub('3')}</S>
      </Pop>
      <Pop delay={0.25}>
        <S x={116} y={48}>Br{sup('−')}</S>
        <Pairs x={112} y={42} sides={['t', 'l', 'r', 'b']} />
      </Pop>
      <Curly from={[106, 57]} to={[114, 94]} bend={-14} delay={0.6} dur={0.5} />
      <Fade delay={0.5}>
        <text className="f89-lb f89-sm f89-muted" x={130} y={150} textAnchor="middle">
          primární C⁺H₂–CH₂–CH₃ by byl méně stabilní
        </text>
      </Fade>
    </Plate>
  )
}

function Step3() {
  return (
    <Plate w={260} h={160}>
      <Pop delay={0.1}>
        <S x={44} y={80}>
          <tspan style={{ fill: 'var(--lv-t)' }}>H</tspan>
          {sub('3')}C
        </S>
        <line className="f89-bond" x1={66} y1={74} x2={98} y2={74} />
        <S x={116} y={80}>CH</S>
        <line className="f89-bond" x1={136} y1={74} x2={166} y2={74} />
        <S x={190} y={80}>CH{sub('3')}</S>
        <line className="f89-bond" x1={116} y1={86} x2={116} y2={108} />
        <S x={118} y={128} lv>
          Br
        </S>
      </Pop>
      <Fade delay={0.5}>
        <rect x={20} y={138} width={220} height={20} rx={4} className="f89-soft" style={{ strokeWidth: 1 }} />
        <text className="f89-lb f89-b" x={130} y={153} textAnchor="middle">
          2-brompropan (Markovnikov)
        </text>
        <text className="f89-lb f89-sm" x={130} y={30} textAnchor="middle">
          „Kdo má, tomu bude přidáno.“
        </text>
      </Fade>
    </Plate>
  )
}
