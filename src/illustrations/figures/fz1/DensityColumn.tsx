import { DrawArrow, Fade, Figure, Lbl, Liquid, Pop, pat, useCompact, useFig } from './kit'

const TOP = 70 // top of the liquids
const LH = 76 // layer height
const BOT = TOP + 4 * LH

/** Liquids from the top down (densities in g/cm³). */
const LAYERS = [
  { name: 'líh', rho: '0,79', col: '#c77aa0' },
  { name: 'olej', rho: '0,92', col: '#e3c24a' },
  { name: 'voda', rho: '1,0', col: '#6f9fd8' },
  { name: 'sirup', rho: '1,3', col: '#b8742a' },
]

function Cork({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g className="fz1-bob">
      <path d={`M${x - 13} ${y - 10} L${x + 13} ${y - 10} L${x + 11} ${y + 6} L${x - 11} ${y + 6}Z`} fill="#c89a5e" className="fz1-o" />
      <path d={`M${x - 13} ${y - 10} L${x + 13} ${y - 10} L${x + 11} ${y + 6} L${x - 11} ${y + 6}Z`} fill={pat(id, 'dots')} />
    </g>
  )
}
function Cap({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 13} ${y - 8} H${x + 13} V${y + 5} Q${x + 13} ${y + 8} ${x + 10} ${y + 8} H${x - 10} Q${x - 13} ${y + 8} ${x - 13} ${y + 5}Z`} fill="#e9eef5" className="fz1-o" />
      {[-8, -3, 2, 7].map((d) => (
        <path key={d} d={`M${x + d} ${y - 5} V${y + 5}`} className="fz1-o fz1-thin" />
      ))}
    </g>
  )
}
function Grape({ x, y }: { x: number; y: number }) {
  const { id } = useFig()
  return (
    <g>
      <ellipse cx={x} cy={y} rx={11} ry={12} fill="#6b3f8f" className="fz1-o" />
      <ellipse cx={x - 3} cy={y - 4} rx={3} ry={4} fill={pat(id, 'hi')} />
      <path d={`M${x} ${y - 12} l2 -5`} className="fz1-o" />
    </g>
  )
}
function Bolt({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`rotate(-72 ${x} ${y})`}>
      <path d={`M${x - 9} ${y - 20} H${x + 9} V${y - 11} H${x - 9}Z`} fill="#8a93a3" className="fz1-o" />
      <path d={`M${x - 4.5} ${y - 11} V${y + 20} H${x + 4.5} V${y - 11}`} fill="#9aa3b0" className="fz1-o" />
      {[-6, 0, 6, 12].map((d) => (
        <path key={d} d={`M${x - 4.5} ${y + d} L${x + 4.5} ${y + d + 3}`} className="fz1-o fz1-thin" />
      ))}
    </g>
  )
}

export default function DensityColumn() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 360 : 580
  const cx = n ? 172 : 290
  const iw = n ? 92 : 128
  const L = cx - iw / 2
  const R = cx + iw / 2
  const lx = n ? 8 : 40 // object labels (left)
  const rx = n ? 352 : 520 // liquid labels (right, anchor end)
  const objs = [
    { el: <Cork x={cx + 14} y={TOP} />, y: TOP, name: 'korek', rho: '0,24', tx: cx + 1 },
    { el: <Cap x={cx - 10} y={TOP + LH * 2} />, y: TOP + LH * 2, name: 'plastové víčko', rho: '0,95', tx: cx - 23 },
    { el: <Grape x={cx + 12} y={TOP + LH * 3 - 2} />, y: TOP + LH * 3, name: 'hroznové víno', rho: '1,1', tx: cx + 1 },
    { el: <Bolt x={cx - 4} y={BOT - 12} />, y: BOT - 14, name: 'ocelový šroub', rho: '7,8', tx: cx - 24 },
  ]
  return (
    <Figure
      w={w}
      h={BOT + (n ? 72 : 60)}
      max={n ? 420 : 640}
      compact={compact}
      boost={false}
      replay
      label="Hustotní sloupec ve vysoké sklenici. Kapaliny se samy seřadí podle hustoty: dole sirup 1,3 g/cm³, nad ním voda 1,0 g/cm³, pak olej 0,92 g/cm³ a nahoře líh 0,79 g/cm³. Tělesa se zastaví tam, kde je kapalina pod nimi hustší a nad nimi řidší než ony: ocelový šroub 7,8 g/cm³ leží na dně, hroznové víno 1,1 g/cm³ na rozhraní sirupu a vody, plastové víčko 0,95 g/cm³ na rozhraní vody a oleje a korek 0,24 g/cm³ plave na hladině lihu."
    >
      {/* liquids pour in bottom-up */}
      {LAYERS.map((ly, i) => {
        const y = TOP + i * LH
        const k = 3 - i
        return (
          <Fade key={ly.name} delay={0.1 + k * 0.22}>
            <Liquid d={`M${L} ${y} H${R} V${y + LH} H${L}Z`} color={ly.col} opacity={0.42} />
            <path d={`M${L} ${y} H${R}`} className="fz1-o fz1-thin" />
          </Fade>
        )
      })}
      {/* tall glass */}
      <path d={`M${L - 3} ${TOP - 44} V${BOT + 3} Q${L - 3} ${BOT + 10} ${L + 4} ${BOT + 10} H${R - 4} Q${R + 3} ${BOT + 10} ${R + 3} ${BOT + 3} V${TOP - 44}`} className="fz1-o fz1-thick" />
      <path d={`M${L + 6} ${TOP - 34} V${BOT - 8}`} className="fz1-o fz1-thin fz1-glint" />

      {objs.map((o, i) => (
        <Pop key={o.name} delay={1.05 + i * 0.12}>
          {o.el}
        </Pop>
      ))}

      {/* liquids: labels on the right */}
      {LAYERS.map((ly, i) => {
        const y = TOP + i * LH + LH / 2
        return (
          <Fade key={ly.name} delay={0.3 + (3 - i) * 0.22}>
            <Lbl x={rx} y={y - 2} tx={R - 6} ty={y + 4} anchor="end" className="fz1-b">
              {ly.name}
            </Lbl>
            <text x={rx} y={y + 17} textAnchor="end" className="fz1-lbl fz1-sm">
              {ly.rho} g/cm³
            </text>
          </Fade>
        )
      })}

      {/* objects: labels on the left */}
      {objs.map((o, i) => {
        const y = i === 0 ? TOP - 22 : o.y + (i === 3 ? 4 : -8)
        return (
          <Fade key={o.name} delay={1.2 + i * 0.12}>
            <Lbl x={lx} y={y} tx={o.tx} ty={i === 0 ? TOP - 6 : o.y + (i === 3 ? -4 : 0)} className="fz1-b fz1-lvl-t">
              {n && o.name === 'plastové víčko' ? 'víčko' : n && o.name === 'hroznové víno' ? 'hrozen' : n && o.name === 'ocelový šroub' ? 'šroub' : o.name}
            </Lbl>
            <text x={lx} y={y + 18} className="fz1-lbl fz1-sm">
              {o.rho} g/cm³
            </text>
          </Fade>
        )
      })}

      {/* density grows downwards */}
      <Fade delay={1.7}>
        {n ? (
          <>
            <text x={w / 2} y={BOT + 38} textAnchor="middle" className="fz1-lbl fz1-sm">
              kapaliny i tělesa se seřadí podle hustoty:
            </text>
            <text x={w / 2} y={BOT + 58} textAnchor="middle" className="fz1-lbl fz1-sm">
              těleso se zastaví nad hustší kapalinou
            </text>
          </>
        ) : (
          <text x={w / 2} y={BOT + 44} textAnchor="middle" className="fz1-lbl fz1-sm">
            těleso se zastaví tam, kde je pod ním hustší a nad ním řidší kapalina
          </text>
        )}
      </Fade>
      {!n && (
        <>
          <DrawArrow d={`M${w - 24} ${TOP + 6} V${BOT - 6}`} tone="lvl" delay={1.5} />
          <Fade delay={1.7}>
            <text transform={`translate(${w - 10} ${TOP + 2 * LH}) rotate(90)`} textAnchor="middle" className="fz1-lbl fz1-sm fz1-lvl-t">
              hustota roste
            </text>
          </Fade>
        </>
      )}
    </Figure>
  )
}
