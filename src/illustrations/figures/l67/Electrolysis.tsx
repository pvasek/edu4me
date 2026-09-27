import { useState } from 'react'
import { Atom, Bubbles, ChemText, Draw, Eq, Fade, Figure, Flame, Lbl, Liquid, Pop, Sign, Toggle, Travel, pat, rng, useCompact, useFig } from './kit'

type Mode = 'nacl' | 'cuso4'
const MODES = {
  nacl: {
    cat: 'Na',
    catT: 'Na^{+}',
    an: 'Cl',
    anT: 'Cl^{-}',
    katEq: 'Na^{+} + e^{-} → Na',
    anEq: '2Cl^{-} → Cl_{2} + 2e^{-}',
    katProd: 'kapalný sodík',
    anProd: 'plynný chlor',
    liquid: '#d9c79a',
    note: 'tavenina NaCl, asi 801 °C',
    label:
      'Elektrolýza taveniny chloridu sodného. Zdroj stejnosměrného napětí je spojen se dvěma grafitovými elektrodami. Kationty Na+ putují ke katodě (−), kde se redukují na kapalný sodík: Na+ + e− → Na. Anionty Cl− putují k anodě (+), kde se oxidují na plynný chlor: 2Cl− → Cl2 + 2e−.',
  },
  cuso4: {
    cat: 'Cu',
    catT: 'Cu^{2+}',
    an: 'S',
    anT: 'SO_{4}^{2-}',
    katEq: 'Cu^{2+} + 2e^{-} → Cu',
    anEq: '2H_{2}O → O_{2} + 4H^{+} + 4e^{-}',
    katProd: 'vylučuje se měď',
    anProd: 'unikají bublinky O₂',
    liquid: '#3b8fe0',
    note: 'roztok CuSO₄',
    label:
      'Elektrolýza vodného roztoku síranu měďnatého s inertními elektrodami. Kationty Cu2+ putují ke katodě (−) a vylučuje se na ní měď: Cu2+ + 2e− → Cu. Síranové anionty putují k anodě (+), ale neoxidují se; oxiduje se voda na kyslík: 2H2O → O2 + 4H+ + 4e−.',
  },
} as const

const KX = 175 // cathode centre
const AX = 345 // anode centre
const TOP = 112 // electrode top
const BOT = 300 // electrode bottom

function Ions({ mode }: { mode: Mode }) {
  const m = MODES[mode]
  const r = rng(mode === 'nacl' ? 7 : 11)
  const ys = [196, 222, 248, 274, 206, 262]
  return (
    <g>
      {ys.map((y, i) => {
        const x0 = 214 + r() * 90
        const y1 = y + (r() - 0.5) * 10
        return (
          <g key={`c${i}`}>
            <Travel path={`M${x0 + 20} ${y} L${KX + 20} ${y1}`} dur={3.4} phase={i / 6} rest={[x0 - 8, y]} fade>
              <Atom x={0} y={0} r={11} el={m.cat} text={m.catT} size={8} />
            </Travel>
          </g>
        )
      })}
      {ys.map((y, i) => {
        const x0 = 214 + r() * 90
        const y1 = y + 12 + (r() - 0.5) * 10
        return (
          <Travel key={`a${i}`} path={`M${x0 - 20} ${y + 12} L${AX - 21} ${y1}`} dur={3.4} phase={(i + 0.5) / 6} rest={[x0 + 10, y + 12]} fade>
            <Atom x={0} y={0} r={mode === 'nacl' ? 12 : 13} el={m.an} text={m.anT} size={mode === 'nacl' ? 8 : 7} />
          </Travel>
        )
      })}
    </g>
  )
}

function Products({ mode }: { mode: Mode }) {
  const { id } = useFig()
  if (mode === 'nacl')
    return (
      <g>
        {/* droplets of molten sodium on the cathode, floating up */}
        {[190, 222, 256, 286].map((y, i) => (
          <ellipse key={i} cx={KX + 11 + (i % 2) * 3} cy={y} rx={4.5} ry={3.6} fill="#c9ccd3" className="f67-atom-o" />
        ))}
        <path d={`M${KX - 30} 172 Q${KX} 164 ${KX + 30} 172 Q${KX} 178 ${KX - 30} 172Z`} fill="#c9ccd3" className="f67-o f67-thin" />
        <path d={`M${KX - 30} 172 Q${KX} 164 ${KX + 30} 172 Q${KX} 178 ${KX - 30} 172Z`} fill={pat(id, 'x')} />
        <Bubbles x={AX - 13} y={292} rise={126} n={6} spread={6} r={4} color="#c9d86a" />
        <path d="M322 150 q6 -10 0 -18 q-6 -8 2 -16 M340 148 q6 -10 0 -18 q-6 -8 2 -16" className="f67-o f67-thin f67-drift" style={{ stroke: '#9fb33a' }} />
      </g>
    )
  return (
    <g>
      <rect x={KX - 13} y={172} width={4} height={126} fill="#c7773d" className="f67-o f67-thin" />
      <rect x={KX + 9} y={172} width={4} height={126} fill="#c7773d" className="f67-o f67-thin" />
      <rect x={KX - 13} y={296} width={26} height={4} fill="#c7773d" className="f67-o f67-thin" />
      <Bubbles x={AX - 13} y={292} rise={122} n={6} spread={6} r={3.4} />
    </g>
  )
}

function Electrodes() {
  const { id } = useFig()
  return (
    <Pop delay={0.3}>
      {[KX, AX].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={TOP} width={18} height={BOT - TOP} rx={2} fill="#4a4a4f" className="f67-o" />
          <rect x={x - 9} y={TOP} width={18} height={BOT - TOP} rx={2} fill={pat(id, 'hi')} opacity={0.35} />
        </g>
      ))}
    </Pop>
  )
}

export default function Electrolysis() {
  const [mode, setMode] = useState<Mode>('nacl')
  const compact = useCompact()
  const n = compact.narrow
  const m = MODES[mode]
  const { h, bx } = n ? { h: 492, bx: [[96, 372, 328], [96, 432, 328]] } : { h: 430, bx: [[14, 368, 240], [266, 368, 240]] }
  const liquidTop = mode === 'nacl' ? 164 : 168
  return (
    <Figure
      level={6}
      w={n ? 340 : 520}
      x0={n ? 90 : 0}
      h={h}
      max={640}
      compact={compact}
      boost={false}
      label={m.label}
      controls={
        <Toggle<Mode>
          label="Elektrolyt"
          value={mode}
          onChange={setMode}
          options={[
            { id: 'nacl', text: 'tavenina NaCl' },
            { id: 'cuso4', text: 'roztok CuSO₄' },
          ]}
        />
      }
    >
      {/* vessel + electrolyte */}
      <g key={mode}>
        {mode === 'nacl' ? (
          <>
            <Liquid d={`M110.9 ${liquidTop} L114.8 322 Q116 328 124 328 H396 Q404 328 405.2 322 L409.1 ${liquidTop}Z`} color={m.liquid} opacity={0.5} />
            <Draw d="M104 146 L114 322 Q116 332 124 332 H396 Q404 332 406 322 L416 146" className="f67-o f67-thick" />
            <path d="M104 146 L114 322 Q116 332 124 332 H396 Q404 332 406 322 L416 146 L424 146 L412 326 Q408 340 396 340 H124 Q112 340 108 326 L96 146Z" fill={'var(--surface-3)'} className="f67-o" />
            <Fade delay={0.8}>
              {[180, 225, 260, 295, 340].map((x, i) => (
                <Flame key={x} x={x} y={362} h={i % 2 ? 18 : 22} w={7} />
              ))}
              <Lbl x={434} y={360} tx={345} ty={352} sec>
                ohřev
              </Lbl>
            </Fade>
          </>
        ) : (
          <>
            <Liquid d="M111 168 H409 V326 Q409 329 406 329 H114 Q111 329 111 326Z" color={m.liquid} opacity={0.38} />
            <Draw d="M104 142 L108 146 V326 Q108 332 114 332 H406 Q412 332 412 326 V146 L416 142" className="f67-o f67-thick" />
            <path d="M116 150 V320" className="f67-o f67-thin" style={{ opacity: 0.5 }} />
          </>
        )}
      </g>

      {/* electrodes (graphite) */}
      <Electrodes />
      <Products key={`p${mode}`} mode={mode} />
      <Ions key={`i${mode}`} mode={mode} />

      {/* circuit */}
      <path d={`M222 40 H${KX} V${TOP}`} className="f67-wire" />
      <path d={`M${AX} ${TOP} V40 H298`} className="f67-wire" />
      <Fade delay={1.2}>
        <path d={`M222 40 H${KX} V${TOP}`} className="f67-current" />
        <path d={`M${AX} ${TOP} V40 H298`} className="f67-current" />
      </Fade>
      <rect x={222} y={20} width={76} height={40} rx={4} className="f67-o f67-fill" />
      <path d="M252 32 V48 M268 25 V55" className="f67-ln f67-thick" />
      <path d="M222 40 H252 M268 40 H298" className="f67-ln" />
      <Sign x={KX + 24} y={TOP - 16} s="−" r={10} />
      <Sign x={AX - 24} y={TOP - 16} s="+" r={10} />
      <text x={KX + 22} y={70} className="f67-lbl f67-b f67-blue-t">
        e⁻ ↓
      </text>
      <text x={AX - 22} y={70} textAnchor="end" className="f67-lbl f67-b f67-blue-t">
        e⁻ ↑
      </text>
      <Lbl x={306} y={16} tx={290} ty={24} sec>
        zdroj stejnosměrného napětí
      </Lbl>

      {/* labels */}
      <Fade delay={0.9}>
        {n ? (
          <>
            <text x={KX - 14} y={92} textAnchor="end" className="f67-lbl f67-b">
              katoda
            </text>
            <text x={AX + 14} y={92} className="f67-lbl f67-b">
              anoda
            </text>
          </>
        ) : (
          <>
            <Lbl x={14} y={112} tx={KX - 9} ty={140} className="f67-b">
              katoda (−)
            </Lbl>
            <Lbl x={506} y={112} tx={AX + 9} ty={140} anchor="end" className="f67-b">
              anoda (+)
            </Lbl>
            <Lbl x={14} y={200} tx={KX - 26} ty={mode === 'nacl' ? 172 : 230} className="f67-sm">
              {m.katProd}
            </Lbl>
            <Lbl x={506} y={200} tx={AX + 9} ty={230} anchor="end" className="f67-sm">
              {m.anProd}
            </Lbl>
            <Lbl x={14} y={262} tx={KX - 9} ty={278} className="f67-sm" sec>
              grafit
            </Lbl>
          </>
        )}
        <text x={260} y={318} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          {m.note}
        </text>
      </Fade>

      {/* half-reactions */}
      <Pop delay={1.4}>
        <rect x={bx[0][0]} y={bx[0][1]} width={bx[0][2]} height={54} rx={6} className="f67-tag-lvl" />
        <text x={bx[0][0] + bx[0][2] / 2} y={bx[0][1] + 19} textAnchor="middle" className="f67-cap f67-lvl-t">
          katoda (−) · redukce
        </text>
        <Eq x={bx[0][0] + bx[0][2] / 2} y={bx[0][1] + 42} t={m.katEq} anchor="middle" className="f67-eq-lg" />
      </Pop>
      <Pop delay={1.6}>
        <rect x={bx[1][0]} y={bx[1][1]} width={bx[1][2]} height={54} rx={6} className="f67-tag" />
        <text x={bx[1][0] + bx[1][2] / 2} y={bx[1][1] + 19} textAnchor="middle" className="f67-cap">
          anoda (+) · oxidace
        </text>
        <Eq x={bx[1][0] + bx[1][2] / 2} y={bx[1][1] + 42} t={m.anEq} anchor="middle" className="f67-eq-lg" />
      </Pop>
      {mode === 'cuso4' && !n && (
        <text x={260} y={352} textAnchor="middle" className="f67-lbl f67-sm f67-sec">
          <ChemText text="SO_{4}^{2-} se neoxiduje, na anodě se oxiduje voda" />
        </text>
      )}
    </Figure>
  )
}
