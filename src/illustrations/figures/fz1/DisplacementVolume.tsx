import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { DrawArrow, Fade, Figure, Pop, pat, useCompact, useFig, Val } from './kit'

const Y0 = 318 // 0 ml
const U = 2.2 // units per ml
const lvl = (ml: number) => Y0 - ml * U
const IW = 64 // inner width

const STONE = 'M-15 -4 L-9 -13 L2 -14 L12 -8 L16 3 L9 12 L-4 13 L-14 7Z'

function Cylinder({ cx, ml, after }: { cx: number; ml: number; after?: boolean }) {
  const { id } = useFig()
  const L = cx - IW / 2
  const R = cx + IW / 2
  const water = (y: number) => `M${L + 1} ${y - 3} Q${cx} ${y + 3} ${R - 1} ${y - 3} V${Y0 - 1} H${L + 1}Z`
  const clip = `${id}-dv${after ? 2 : 1}`
  return (
    <g>
      <defs>
        <clipPath id={`${clip}w`}>
          <rect x={L} y={60} width={IW} height={Y0 - 60} />
        </clipPath>
        <clipPath id={`${clip}s`}>
          <rect x={L - 40} y={0} width={IW + 80} height={Y0} />
        </clipPath>
      </defs>
      {/* water: the second cylinder's level rises when the stone goes in */}
      {after ? (
        <g clipPath={`url(#${clip}w)`}>
        <motion.g
          variants={{
            hidden: { y: (74 - 60) * U },
            show: { y: 0, transition: { duration: 0.7, delay: 1.25, ease: ease.out } },
          }}
        >
          <path d={water(lvl(ml))} className="fz1-water" />
          <path d={water(lvl(ml))} fill={pat(id, 'h')} />
          <path d={`M${L + 1} ${lvl(ml) - 3} Q${cx} ${lvl(ml) + 3} ${R - 1} ${lvl(ml) - 3}`} className="fz1-o fz1-thin" />
        </motion.g>
        </g>
      ) : (
        <g>
          <path d={water(lvl(ml))} className="fz1-water" />
          <path d={water(lvl(ml))} fill={pat(id, 'h')} />
          <path d={`M${L + 1} ${lvl(ml) - 3} Q${cx} ${lvl(ml) + 3} ${R - 1} ${lvl(ml) - 3}`} className="fz1-o fz1-thin" />
        </g>
      )}
      {after && (
        <g clipPath={`url(#${clip}s)`}>
        <motion.g
          variants={{
            hidden: { y: -200 },
            show: { y: 0, transition: { duration: 1.2, delay: 0.25, ease: ease.inOut } },
          }}
        >
          <path d={`M${cx} ${Y0 - 20} V60`} className="fz1-o fz1-thin" />
          <circle cx={cx} cy={56} r={4} className="fz1-o fz1-thin" />
          <g transform={`translate(${cx} ${Y0 - 16})`}>
            <path d={STONE} fill="#8a8277" className="fz1-o" />
            <path d={STONE} fill={pat(id, 'x')} opacity={0.5} />
          </g>
        </motion.g>
        </g>
      )}
      {/* glass */}
      <path d={`M${L} 70 V${Y0} H${R} V70`} className="fz1-o fz1-thick" />
      <path d={`M${L} 70 Q${L - 4} 66 ${L - 8} 62`} className="fz1-o" />
      <path d={`M${cx - 46} ${Y0 + 12} H${cx + 46} M${cx - 38} ${Y0} V${Y0 + 12} M${cx + 38} ${Y0} V${Y0 + 12}`} className="fz1-o" />
      {/* scale: every 2 ml, numbers every 10 ml */}
      {Array.from({ length: 51 }, (_, i) => i * 2)
        .filter((v) => v > 0)
        .map((v) => (
          <line key={v} x1={L} x2={L + (v % 10 === 0 ? 16 : 8)} y1={lvl(v)} y2={lvl(v)} className={v % 10 ? 'fz1-tick' : 'fz1-tickl'} />
        ))}
      {[20, 40, 60, 80, 100].map((v) => (
        <text key={v} x={L - 6} y={lvl(v) + 4} textAnchor="end" className="fz1-scale-n">
          {v}
        </text>
      ))}
      <text x={R + 6} y={80} className="fz1-scale-n">
        ml
      </text>
    </g>
  )
}

export default function DisplacementVolume() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 360 : 560
  const c1 = n ? 92 : 150
  const c2 = n ? 268 : 410
  return (
    <Figure
      w={w}
      h={n ? 452 : 420}
      max={n ? 420 : 620}
      compact={compact}
      boost={false}
      replay
      label="Měření objemu nepravidelného kamene odměrným válcem. Před vložením kamene je ve válci 60 ml vody. Po ponoření kamene na niti hladina stoupne na 74 ml. Objem kamene je rozdíl obou údajů: V = 74 ml − 60 ml = 14 ml = 14 cm³. Hladinu odečítáme u spodního okraje menisku v úrovni očí."
    >
      <Pop delay={0}>
        <Cylinder cx={c1} ml={60} />
      </Pop>
      <Pop delay={0.05}>
        <Cylinder cx={c2} ml={74} after />
      </Pop>
      <DrawArrow d={`M${(c1 + c2) / 2 - 30} 250 H${(c1 + c2) / 2 + 30}`} tone="lvl" delay={0.2} className="fz1-wide" />
      <Fade delay={0.3}>
        <text x={(c1 + c2) / 2} y={238} textAnchor="middle" className="fz1-lbl fz1-sm">
          ponoříme
        </text>
      </Fade>

      {/* readings */}
      <Fade delay={0.2}>
        <text x={c1} y={24} textAnchor="middle" className="fz1-lbl fz1-b">
          před
        </text>
        <Val x={c1} y={46} t="V_{1} = 60 ml" anchor="middle" />
        <path d={`M${c1 + IW / 2 + 4} ${lvl(60)} h14`} className="fz1-o fz1-lvl-s fz1-thick" />
      </Fade>
      <Fade delay={1.6}>
        <text x={c2} y={24} textAnchor="middle" className="fz1-lbl fz1-b">
          po
        </text>
        <Val x={c2} y={46} t="V_{2} = 74 ml" anchor="middle" className="fz1-lvl-t" />
        <path d={`M${c2 + IW / 2 + 4} ${lvl(74)} h14`} className="fz1-o fz1-lvl-s fz1-thick" />
        {!n && (
          <text x={c2 + IW / 2 + 22} y={lvl(74) + 5} className="fz1-lbl fz1-sm">
            spodní okraj menisku
          </text>
        )}
      </Fade>
      {!n && (
        <Fade delay={0.4}>
          <text x={c1 + IW / 2 + 22} y={lvl(60) - 12} className="fz1-lbl fz1-sm">
            oči v úrovni
          </text>
          <text x={c1 + IW / 2 + 22} y={lvl(60) + 5} className="fz1-lbl fz1-sm">
            hladiny
          </text>
        </Fade>
      )}

      {/* result */}
      <Pop delay={1.9}>
        {n ? (
          <>
            <rect x={20} y={352} width={320} height={84} rx={6} className="fz1-tag-lvl" />
            <Val x={180} y={384} t="V = V_{2} − V_{1} = 74 ml − 60 ml" anchor="middle" />
            <Val x={180} y={414} t="V = 14 ml = 14 cm^{3}" anchor="middle" className="fz1-val-lg" />
          </>
        ) : (
          <>
            <rect x={60} y={356} width={440} height={46} rx={6} className="fz1-tag-lvl" />
            <Val x={280} y={385} t="V = V_{2} − V_{1} = 74 ml − 60 ml = 14 ml = 14 cm^{3}" anchor="middle" className="fz1-val-lg" />
          </>
        )}
      </Pop>
    </Figure>
  )
}
