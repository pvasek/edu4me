import { DrawArrow, Fade, Figure, Liquid, Pop, Val, pat, useCompact, useFig } from './kit'

const SURF = 64
const BOT = 280
const S = 40 // body size
const FVZ = 40 // same volume → same buoyant force (arrow length)
const WATER = '#5b8fd0'

interface B {
  name: string
  f: string // force relation
  rho: string // density relation
  ex: string
  fg: number // weight arrow length
  y: number // body centre
  fill: string
  note?: string
}

const BODIES: B[] = [
  { name: 'klesá', f: 'F_{G} > F_{vz}', rho: 'ρ_{t} > ρ_{k}', ex: 'kámen', fg: 66, y: 200, fill: '#8a8277' },
  { name: 'vznáší se', f: 'F_{G} = F_{vz}', rho: 'ρ_{t} = ρ_{k}', ex: 'ryba, ponorka', fg: FVZ, y: 168, fill: '#6b8c7a' },
  { name: 'stoupá a plove', f: 'F_{G} < F_{vz}', rho: 'ρ_{t} < ρ_{k}', ex: 'dřevo, led', fg: 20, y: 196, fill: '#c89a5e' },
]

function Body({ x, b, i }: { x: number; b: B; i: number }) {
  const { id } = useFig()
  return (
    <g>
      <Pop delay={0.1 + i * 0.12}>
        <g className={i === 1 ? 'fz1-bob' : undefined}>
          <rect x={x - S / 2} y={b.y - S / 2} width={S} height={S} rx={4} fill={b.fill} className="fz1-o" />
          <rect x={x - S / 2} y={b.y - S / 2} width={S} height={S} rx={4} fill={pat(id, i === 2 ? 'b' : 'd')} opacity={0.4} />
        </g>
      </Pop>
      <DrawArrow d={`M${x - 7} ${b.y} v${b.fg}`} tone="red" delay={0.6 + i * 0.12} className="fz1-wide" />
      <DrawArrow d={`M${x + 7} ${b.y} v${-FVZ}`} tone="green" delay={0.7 + i * 0.12} className="fz1-wide" />
    </g>
  )
}

export default function FloatSink() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 360 : 640
  const xs = n ? [62, 180, 298] : [118, 320, 522]
  const ty = BOT + 34
  return (
    <Figure
      w={w}
      h={n ? ty + 96 : ty + 78}
      max={n ? 420 : 680}
      compact={compact}
      boost={false}
      replay
      label="Tři stejně velká tělesa ve vodě: na všechna působí stejná vztlaková síla F_vz, liší se tíhovou silou F_G. Kámen klesá, protože F_G > F_vz a jeho hustota je větší než hustota vody. Ryba nebo ponorka se vznáší, když F_G = F_vz a hustoty jsou stejné. Dřevo nebo led stoupá, protože F_G < F_vz a jeho hustota je menší; vyplave a na hladině plove částečně ponořené."
    >
      {/* tank */}
      <Liquid d={`M12 ${SURF} H${w - 12} V${BOT} H12Z`} color={WATER} opacity={0.3} />
      <path d={`M12 ${SURF} H${w - 12}`} className="fz1-o fz1-thin" />
      <path d={`M8 ${SURF - 26} V${BOT + 4} H${w - 8} V${SURF - 26}`} className="fz1-o fz1-thick" />

      {BODIES.map((b, i) => (
        <Body key={b.name} x={xs[i]} b={b} i={i} />
      ))}
      {/* sinking: motion arrow; rising: ghost at the surface, half under water */}
      <Fade delay={1.1}>
        <path d={`M${xs[0] + 30} ${BODIES[0].y - 14} v30`} className="fz1-o fz1-dash" />
        <path d={`M${xs[0] + 25} ${BODIES[0].y + 12} l5 6 l5 -6`} className="fz1-o" />
        <rect x={xs[2] - S / 2} y={SURF - S / 2} width={S} height={S} rx={4} className="fz1-o fz1-dash" />
        <path d={`M${xs[2] + 30} ${BODIES[2].y + 12} v-${BODIES[2].y - SURF - 8}`} className="fz1-o fz1-dash" />
        <path d={`M${xs[2] + 25} ${SURF + 10} l5 -6 l5 6`} className="fz1-o" />
      </Fade>
      <Fade delay={1.0}>
        {!n && (
          <>
            <Val x={xs[0] - 14} y={BODIES[0].y + 58} t="F_{G}" anchor="end" className="fz1-red-t" />
            <Val x={xs[0] + 14} y={BODIES[0].y - 30} t="F_{vz}" className="fz1-green-t" />
          </>
        )}
      </Fade>

      {/* captions */}
      {BODIES.map((b, i) => (
        <Fade key={b.name} delay={0.9 + i * 0.12}>
          <text x={xs[i]} y={ty} textAnchor="middle" className="fz1-lbl fz1-b fz1-lvl-t">
            {n && i === 2 ? 'plove' : b.name}
          </text>
          <Val x={xs[i]} y={ty + 22} t={b.f} anchor="middle" />
          <Val x={xs[i]} y={ty + 42} t={b.rho} anchor="middle" className="fz1-val-sm" />
          <text x={xs[i]} y={ty + 62} textAnchor="middle" className="fz1-lbl fz1-sm">
            {b.ex}
          </text>
        </Fade>
      ))}
      {n && (
        <Fade delay={1.3}>
          <Val x={w / 2} y={ty + 86} t="F_{G} tíhová síla · F_{vz} vztlaková síla" anchor="middle" className="fz1-val-sm fz1-muted-t" />
        </Fade>
      )}
      {!n && (
        <Fade delay={1.3}>
          <text x={24} y={SURF - 10} className="fz1-lbl fz1-sm fz1-muted-t">
            stejný objem → stejná vztlaková síla
          </text>
        </Fade>
      )}
    </Figure>
  )
}
