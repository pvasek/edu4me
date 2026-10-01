import type { ReactNode } from 'react'
import { StepStrip } from '../../sequence/StepFigure'
import { Arrow, Figure, Frame, Val, pat, useFig } from './kit'

const W = 230
const H = 212
const BY = 66 // beam y

function Fulcrum({ x, y = BY + 5 }: { x: number; y?: number }) {
  const { id } = useFig()
  return (
    <g>
      <path d={`M${x} ${y} L${x - 13} ${y + 24} H${x + 13}Z`} className="fz1-o fz1-lvl-f" />
      <path d={`M${x - 22} ${y + 24} H${x + 22}`} className="fz1-o" />
      <rect x={x - 22} y={y + 24} width={44} height={6} fill={pat(id, 'd')} />
    </g>
  )
}

function Load({ x }: { x: number }) {
  const { id } = useFig()
  return (
    <g>
      <rect x={x - 15} y={BY - 30} width={30} height={26} fill="#8a93a3" className="fz1-o" />
      <rect x={x - 15} y={BY - 30} width={30} height={26} fill={pat(id, 'x')} opacity={0.5} />
      <Arrow d={`M${x} ${BY + 4} V${BY + 40}`} tone="blue" className="fz1-wide" />
    </g>
  )
}

function Effort({ x, up }: { x: number; up: boolean }) {
  return up ? <Arrow d={`M${x} ${BY + 2} V${BY - 38}`} tone="red" className="fz1-wide" /> : <Arrow d={`M${x} ${BY - 42} V${BY - 6}`} tone="red" className="fz1-wide" />
}

function Scheme({ f, l, e, up }: { f: number; l: number; e: number; up: boolean }) {
  return (
    <g>
      <rect x={14} y={BY - 4} width={W - 28} height={8} rx={2} className="fz1-o fz1-wood" />
      <Fulcrum x={f} />
      <Load x={l} />
      <Effort x={e} up={up} />
      <Val x={e + 8} y={up ? BY - 26 : BY - 30} t="F" className="fz1-red-t" />
      <text x={l + (l < 150 ? 8 : -8)} y={BY + 30} textAnchor={l < 150 ? 'start' : 'end'} className="fz1-lbl fz1-sm fz1-blue-t fz1-b">
        břemeno
      </text>
      <text x={f < 40 ? 8 : f} y={BY + 46} textAnchor={f < 40 ? 'start' : 'middle'} className="fz1-lbl fz1-sm">
        opěrný bod
      </text>
    </g>
  )
}

/* ---------------------------------------------------------------- examples (bottom) */
const EY = 188

function Seesaw() {
  return (
    <g>
      <path d={`M${W / 2} ${EY - 10} L${W / 2 - 12} ${EY + 14} H${W / 2 + 12}Z`} className="fz1-o fz1-lvl-f" />
      <path d={`M40 ${EY - 2} L190 ${EY - 18}`} className="fz1-o fz1-thick" />
      <circle cx={52} cy={EY - 18} r={9} className="fz1-o fz1-fill" />
      <path d={`M52 ${EY - 9} V${EY - 3}`} className="fz1-o fz1-thick" />
      <circle cx={178} cy={EY - 34} r={7} className="fz1-o fz1-fill" />
      <path d={`M178 ${EY - 27} V${EY - 18}`} className="fz1-o fz1-thick" />
    </g>
  )
}

function Wheelbarrow() {
  const { id } = useFig()
  return (
    <g>
      <circle cx={46} cy={EY + 2} r={12} className="fz1-o fz1-fill" />
      <circle cx={46} cy={EY + 2} r={3} className="fz1-o fz1-lvl-f" />
      <path d={`M46 ${EY + 2} L200 ${EY - 26}`} className="fz1-o fz1-thick" />
      <path d={`M70 ${EY - 6} L84 ${EY - 30} H146 L140 ${EY - 14}Z`} className="fz1-o fz1-metal" />
      <path d={`M88 ${EY - 30} Q115 ${EY - 46} 142 ${EY - 30}`} fill="#b3aa98" className="fz1-o" />
      <path d={`M88 ${EY - 30} Q115 ${EY - 46} 142 ${EY - 30}`} fill={pat(id, 'dots')} />
      <path d={`M150 ${EY - 17} L156 ${EY + 12}`} className="fz1-o" />
    </g>
  )
}

function Forearm() {
  return (
    <g>
      {/* upper arm and forearm */}
      <path d={`M58 ${EY - 64} L58 ${EY - 2}`} className="fz1-o" style={{ strokeWidth: 12, stroke: 'var(--surface-3)' }} />
      <path d={`M58 ${EY} L186 ${EY - 8}`} className="fz1-o" style={{ strokeWidth: 11, stroke: 'var(--surface-3)' }} />
      <path d={`M52 ${EY - 64} L52 ${EY - 4} M64 ${EY - 64} V${EY - 8} M58 ${EY + 6} L186 ${EY - 2} M64 ${EY - 6} L186 ${EY - 14}`} className="fz1-o fz1-thin" />
      {/* biceps */}
      <path d={`M64 ${EY - 58} Q86 ${EY - 44} 84 ${EY - 10}`} className="fz1-o fz1-red-s" style={{ strokeWidth: 3 }} />
      <circle cx={58} cy={EY} r={4} className="fz1-o fz1-lvl-f" />
      <circle cx={196} cy={EY - 20} r={11} fill="#8a93a3" className="fz1-o" />
      <text x={34} y={EY + 22} className="fz1-lbl fz1-sm">
        loket
      </text>
      <text x={92} y={EY - 30} className="fz1-lbl fz1-sm fz1-red-t">
        sval
      </text>
    </g>
  )
}

function Panel({ children, ex }: { children: ReactNode; ex: ReactNode }) {
  return (
    <>
      {children}
      <path d={`M14 ${EY - 64} H${W - 14}`} className="fz1-o fz1-soft fz1-dash" style={{ opacity: 0.6 }} />
      {ex}
    </>
  )
}

const LABEL =
  'Tři druhy pák. Páka první třídy (dvojzvratná) má opěrný bod mezi silou a břemenem – houpačka, páčidlo, nůžky. Páka druhé třídy (jednozvratná) má břemeno mezi opěrným bodem a silou – kolečko, louskáček. Páka třetí třídy (jednozvratná) má sílu mezi opěrným bodem a břemenem – předloktí, kde sval táhne blízko lokte, nebo pinzeta.'

export default function LeverTypes() {
  return (
    <Figure label={LABEL} max={720} interactive boost={false}>
      <div className="fz1-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={190}
          steps={[
            {
              title: 'dvojzvratná páka',
              caption: 'Opěrný bod je mezi silou a břemenem. Houpačka, páčidlo, nůžky.',
              art: (
                <Frame w={W} h={H}>
                  <Panel ex={<Seesaw />}>
                    <Scheme f={130} l={42} e={204} up={false} />
                  </Panel>
                </Frame>
              ),
            },
            {
              title: 'jednozvratná – břemeno uprostřed',
              caption: 'Břemeno je mezi opěrným bodem a silou. Kolečko, louskáček.',
              art: (
                <Frame w={W} h={H}>
                  <Panel ex={<Wheelbarrow />}>
                    <Scheme f={26} l={104} e={204} up />
                  </Panel>
                </Frame>
              ),
            },
            {
              title: 'jednozvratná – síla uprostřed',
              caption: 'Síla působí mezi opěrným bodem a břemenem. Předloktí, pinzeta.',
              art: (
                <Frame w={W} h={H}>
                  <Panel ex={<Forearm />}>
                    <Scheme f={26} l={196} e={96} up />
                  </Panel>
                </Frame>
              ),
            },
          ]}
        />
      </div>
    </Figure>
  )
}
