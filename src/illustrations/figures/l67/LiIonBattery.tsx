import { useState } from 'react'
import { Atom, ChemText, Draw, Fade, Figure, Lbl, Pop, Sign, Toggle, Travel, pat, useFig } from './kit'

type Mode = 'discharge' | 'charge'

const Y0 = 120 // cell top
const Y1 = 310 // cell bottom
const GR = [74, 172] // graphite x-range
const OX = [348, 446] // LiCoO2 x-range
const SEP = 260

function Li({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return <Atom x={x} y={y} r={r} el="Li" fill="#b07ce0" text="+" size={10} />
}

function Graphite() {
  const { id } = useFig()
  const rows = Array.from({ length: 9 }, (_, i) => Y0 + 16 + i * 21)
  return (
    <g>
      <rect x={GR[0]} y={Y0} width={GR[1] - GR[0]} height={Y1 - Y0} fill="#55575e" fillOpacity={0.18} />
      {rows.map((y) => {
        let d = `M${GR[0] + 4} ${y}`
        for (let x = GR[0] + 4; x < GR[1] - 8; x += 12) d += ` l6 -4 l6 4`
        return (
          <g key={y}>
            <path d={d} className="f67-o f67-thin" style={{ stroke: 'var(--edge)' }} />
            <path d={d.replace(/^M(\S+) (\S+)/, (_m, a, b) => `M${a} ${Number(b) + 3}`)} className="f67-o f67-thin" style={{ opacity: 0.5 }} />
          </g>
        )
      })}
      <rect x={GR[0]} y={Y0} width={GR[1] - GR[0]} height={Y1 - Y0} fill={pat(id, 'd')} opacity={0.4} />
    </g>
  )
}

function Oxide() {
  const rows = Array.from({ length: 9 }, (_, i) => Y0 + 16 + i * 21)
  return (
    <g>
      <rect x={OX[0]} y={Y0} width={OX[1] - OX[0]} height={Y1 - Y0} fill="#3d5f9a" fillOpacity={0.12} />
      {rows.map((y) => (
        <g key={y}>
          {Array.from({ length: 8 }, (_, k) => {
            const x = OX[0] + 7 + k * 12
            return <path key={k} d={`M${x} ${y - 4} l5 4 l-5 4 l-5 -4Z`} fill="#6d86b8" className="f67-o f67-thin" />
          })}
        </g>
      ))}
    </g>
  )
}

export default function LiIonBattery() {
  const [mode, setMode] = useState<Mode>('discharge')
  const dis = mode === 'discharge'
  // resting Li+ inside the electrodes (between the layers)
  const inGr = dis ? 3 : 8
  const inOx = dis ? 8 : 3
  const slotsGr = Array.from({ length: 8 }, (_, i) => [GR[0] + 20 + (i % 3) * 30 + (i % 2) * 8, Y0 + 26 + i * 21] as const)
  const slotsOx = Array.from({ length: 8 }, (_, i) => [OX[0] + 18 + ((i + 1) % 3) * 30, Y0 + 26 + i * 21] as const)
  const lanes = [150, 176, 202, 228, 254, 280]
  const label = dis
    ? 'Li-ion akumulátor v řezu při vybíjení: ionty Li+ putují elektrolytem a přes separátor z grafitové anody (−) do katody z LiCoO2 (+), elektrony tečou vnějším obvodem přes spotřebič od grafitu k oxidu kobaltu. Napětí článku je asi 3,7 V.'
    : 'Li-ion akumulátor v řezu při nabíjení: nabíječka dodává energii a žene ionty Li+ zpět z LiCoO2 přes elektrolyt a separátor do vrstev grafitu, elektrony tečou obvodem opačně. Nabíjení je vlastně elektrolýza.'
  const wire = 'M66 120 V52 H236 M284 52 H454 V120'
  const eFlow = dis ? 'M66 120 V52 H236 M284 52 H454 V120' : 'M454 120 V52 H284 M236 52 H66 V120'
  return (
    <Figure
      level={6}
      w={520}
      h={430}
      max={640}
      label={label}
      controls={
        <Toggle<Mode>
          label="Děj"
          value={mode}
          onChange={setMode}
          options={[
            { id: 'discharge', text: 'Vybíjení' },
            { id: 'charge', text: 'Nabíjení' },
          ]}
        />
      }
    >
      {/* outer circuit */}
      <path d={wire} className="f67-wire" />
      <Fade delay={1}>
        <path key={mode} d={eFlow} className="f67-current" />
      </Fade>
      {dis ? (
        <g>
          <circle cx={260} cy={48} r={26} fill="#f3d36b" fillOpacity={0.35} className="f67-glow" />
          <circle cx={260} cy={48} r={16} className="f67-o f67-fill" />
          <path d="M252 60 V52 Q256 40 260 52 Q264 40 268 52 V60" className="f67-o f67-thin" style={{ stroke: '#c9962c' }} />
          <path d="M250 62 H270 V72 H250Z" className="f67-o f67-fill3" />
          <text x={260} y={96} textAnchor="middle" className="f67-lbl f67-sm">
            spotřebič
          </text>
        </g>
      ) : (
        <g>
          <rect x={232} y={34} width={56} height={36} rx={5} className="f67-o f67-fill2" />
          <path d="M246 52 q7 -10 14 0 t14 0" className="f67-o" />
          <text x={260} y={96} textAnchor="middle" className="f67-lbl f67-sm">
            nabíječka
          </text>
        </g>
      )}
      <text x={dis ? 150 : 370} y={42} textAnchor="middle" className="f67-lbl f67-b f67-blue-t">
        {dis ? 'e⁻ →' : '← e⁻'}
      </text>
      <text x={dis ? 370 : 150} y={42} textAnchor="middle" className="f67-lbl f67-b f67-blue-t">
        {dis ? 'e⁻ →' : '← e⁻'}
      </text>

      {/* the cell */}
      <Pop delay={0.1}>
        <Graphite />
      </Pop>
      <Pop delay={0.25}>
        <Oxide />
      </Pop>
      <rect x={GR[1]} y={Y0} width={OX[0] - GR[1]} height={Y1 - Y0} className="f67-glass" />
      <Electrolyte />
      <rect x={60} y={Y0} width={14} height={Y1 - Y0} fill="#c7773d" className="f67-o" />
      <rect x={446} y={Y0} width={14} height={Y1 - Y0} fill="#b9bec7" className="f67-o" />
      <Separator />
      <Draw d={`M60 ${Y0} H460 V${Y1} H60Z`} className="f67-o f67-thick" />
      <Sign x={40} y={Y1 - 16} s="−" r={10} />
      <Sign x={480} y={Y1 - 16} s="+" r={10} />

      {/* Li+ at rest in the electrodes */}
      <g key={`rest-${mode}`}>
        {slotsGr.slice(0, inGr).map(([x, y], i) => (
          <Pop key={`g${i}`} delay={0.5 + i * 0.05}>
            <Li x={x} y={y} r={6} />
          </Pop>
        ))}
        {slotsOx.slice(0, inOx).map(([x, y], i) => (
          <Pop key={`o${i}`} delay={0.5 + i * 0.05}>
            <Li x={x} y={y} r={6} />
          </Pop>
        ))}
      </g>
      {/* Li+ shuttling through the electrolyte */}
      <g key={`move-${mode}`}>
        {lanes.map((y, i) => {
          const a = dis ? 150 : 370
          const b = dis ? 370 : 150
          return (
            <Travel key={i} path={`M${a} ${y} C${a + (b - a) * 0.35} ${y - 10} ${a + (b - a) * 0.65} ${y + 10} ${b} ${y}`} dur={3.6} phase={i / lanes.length} rest={[196 + (i % 3) * 64, y]} fade>
              <Li x={0} y={0} />
            </Travel>
          )
        })}
      </g>
      <Fade delay={0.9}>
        <rect x={222} y={Y0 + 4} width={76} height={24} rx={4} className="f67-tag-lvl" />
        <text x={260} y={Y0 + 22} textAnchor="middle" className="f67-lbl f67-b f67-lvl-t">
          <ChemText text={dis ? 'Li^{+} →' : '← Li^{+}'} />
        </text>
      </Fade>

      {/* labels below the cell */}
      <Fade delay={0.8}>
        <Lbl x={123} y={342} tx={123} ty={296} anchor="middle" className="f67-b">
          grafit
        </Lbl>
        <text x={123} y={360} textAnchor="middle" className="f67-lbl f67-sm">
          anoda (−)
        </text>
        <Lbl x={397} y={342} tx={397} ty={296} anchor="middle" className="f67-b">
          <ChemText text="LiCoO_{2}" />
        </Lbl>
        <text x={397} y={360} textAnchor="middle" className="f67-lbl f67-sm">
          katoda (+)
        </text>
        <Lbl x={SEP} y={342} tx={SEP} ty={300} anchor="middle">
          separátor
        </Lbl>
        <Lbl x={212} y={366} tx={212} ty={300} anchor="middle" className="f67-sm" sec>
          elektrolyt
        </Lbl>
        <Lbl x={14} y={96} tx={66} ty={140} className="f67-sm" sec>
          měď
        </Lbl>
        <Lbl x={506} y={96} tx={454} ty={140} anchor="end" className="f67-sm" sec>
          hliník
        </Lbl>
      </Fade>
      <Fade delay={1.3}>
        <rect x={40} y={378} width={440} height={44} rx={6} className="f67-tag-lvl" />
        <text x={260} y={397} textAnchor="middle" className="f67-cap f67-lvl-t">
          {dis ? 'vybíjení · asi 3,7 V' : 'nabíjení = elektrolýza'}
        </text>
        <text x={260} y={415} textAnchor="middle" className="f67-lbl f67-sm f67-b">
          <ChemText text={dis ? 'Li^{+} jdou z grafitu do oxidu, elektrony obvodem' : 'nabíječka žene Li^{+} zpět mezi vrstvy grafitu'} />
        </text>
      </Fade>
    </Figure>
  )
}

function Electrolyte() {
  const { id } = useFig()
  return <rect x={GR[1]} y={Y0} width={OX[0] - GR[1]} height={Y1 - Y0} fill={pat(id, 'dots')} />
}

function Separator() {
  const { id } = useFig()
  return (
    <g>
      <rect x={SEP - 4} y={Y0} width={8} height={Y1 - Y0} className="f67-fill2" />
      <rect x={SEP - 4} y={Y0} width={8} height={Y1 - Y0} fill={pat(id, 'x')} />
      <path d={`M${SEP - 4} ${Y0} V${Y1} M${SEP + 4} ${Y0} V${Y1}`} className="f67-o f67-thin f67-dash" />
    </g>
  )
}
