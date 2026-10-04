import { motion } from 'motion/react'
import { ease } from '../../../ui/motion'
import { Arrow, DrawArrow, Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const HG = '#a3a8b3' // mercury

/** Torricelli's tube in a dish; local box 190 × 330. */
function Torricelli() {
  const { id } = useFig()
  const lvl = 292 // mercury level in the dish
  const top = 36 // closed top of the tube
  const col = lvl - 760 * 0.29 // 760 mm column
  return (
    <g>
      {/* dish */}
      <path d={`M24 ${lvl} H166 V${lvl + 24} Q166 ${lvl + 30} 160 ${lvl + 30} H30 Q24 ${lvl + 30} 24 ${lvl + 24}Z`} fill={HG} />
      <path d={`M24 ${lvl} H166 V${lvl + 24} Q166 ${lvl + 30} 160 ${lvl + 30} H30 Q24 ${lvl + 30} 24 ${lvl + 24}Z`} fill={pat(id, 'hi')} opacity={0.4} />
      <path d={`M20 ${lvl - 12} V${lvl + 24} Q20 ${lvl + 34} 30 ${lvl + 34} H160 Q170 ${lvl + 34} 170 ${lvl + 24} V${lvl - 12}`} className="fz1-o fz1-thick" />
      {/* mercury column rises into the tube */}
      <motion.rect
        x={86}
        y={col}
        width={18}
        height={lvl + 16 - col}
        fill={HG}
        style={{ originY: 1 }}
        variants={{ hidden: { scaleY: 0.15 }, show: { scaleY: 1, transition: { duration: 1.3, delay: 0.2, ease: ease.out } } }}
      />
      <path d={`M84 ${lvl + 18} V${top + 9} A11 11 0 0 1 106 ${top + 9} V${lvl + 18}`} className="fz1-o fz1-thick" />
      <path d={`M89 ${top + 12} V${lvl - 6}`} className="fz1-o fz1-thin fz1-glint" />
      <Fade delay={1.3}>
        {/* 760 mm */}
        <path d={`M118 ${col} H134 M118 ${lvl} H134 M128 ${col} V${lvl}`} className="fz1-o fz1-thin fz1-lvl-s" />
        <text transform={`translate(146 ${(col + lvl) / 2}) rotate(-90)`} textAnchor="middle" className="fz1-num fz1-num-b fz1-lvl-t">
          760 mm
        </text>
        <text x={78} y={top + 10} textAnchor="end" className="fz1-lbl fz1-sm">
          vakuum
        </text>
        <text x={78} y={col + 60} textAnchor="end" className="fz1-lbl fz1-sm">
          rtuť
        </text>
      </Fade>
      {/* air presses on the open mercury surface */}
      {[38, 62, 128, 152].map((x, i) => (
        <DrawArrow key={x} d={`M${x} ${lvl - 44} V${lvl - 4}`} tone="blue" delay={0.9 + i * 0.05} />
      ))}
      <Fade delay={1.1}>
        <text x={95} y={lvl + 56} textAnchor="middle" className="fz1-lbl fz1-sm fz1-blue-t fz1-b">
          tlak vzduchu
        </text>
      </Fade>
    </g>
  )
}

/** Aneroid barometer dial, centre (cx, cy), radius r; needle at `p` hPa. */
function Aneroid({ cx, cy, r, p = 1013 }: { cx: number; cy: number; r: number; p?: number }) {
  const { id } = useFig()
  const ang = (v: number) => (((v - 1000) / 50) * 135 * Math.PI) / 180 // 950 … 1050 → −135° … 135°
  const pt = (v: number, rr: number) => [cx + Math.sin(ang(v)) * rr, cy - Math.cos(ang(v)) * rr]
  const words: [number, string][] = [
    [962, 'déšť'],
    [1038, 'pěkně'],
  ]
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 8} fill="#c9a24a" className="fz1-o" />
      <circle cx={cx} cy={cy} r={r + 8} fill={pat(id, 'b')} opacity={0.3} />
      <circle cx={cx} cy={cy} r={r} className="fz1-o fz1-fill" />
      {Array.from({ length: 21 }, (_, i) => 950 + i * 5).map((v) => {
        const [x1, y1] = pt(v, r - 4)
        const [x2, y2] = pt(v, r - (v % 10 === 0 ? 14 : 9))
        return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} className={v % 50 === 0 ? 'fz1-tickl' : 'fz1-tick'} />
      })}
      {[960, 980, 1000, 1020, 1040].map((v) => {
        const [x, y] = pt(v, r - 25)
        return (
          <text key={v} x={x} y={y + 4} textAnchor="middle" className="fz1-scale-n" style={{ fontSize: 9.5 }}>
            {v}
          </text>
        )
      })}
      {words.map(([v, t]) => {
        // low pressure (rain) on the left, high (fair weather) on the right, below the pivot
        const x = cx + (v < 1000 ? -1 : 1) * r * 0.3
        const y = cy + r * 0.46
        return (
          <text key={t} x={x} y={y + 4} textAnchor="middle" className="fz1-lbl fz1-sm fz1-muted-t" style={{ fontSize: 12 }}>
            {t}
          </text>
        )
      })}
      <text x={cx} y={cy + r * 0.78} textAnchor="middle" className="fz1-scale-n">
        hPa
      </text>
      <motion.g

        variants={{ hidden: { rotate: -60 }, show: { rotate: (ang(p) * 180) / Math.PI, transition: { duration: 1.4, delay: 0.3, ease: ease.out } } }}
      >
        {/* invisible disc: keeps the rotation centre (motion uses the fill box) on the pivot */}
        <circle cx={cx} cy={cy} r={r - 14} fill="none" stroke="none" />
        <path d={`M${cx - 2.5} ${cy + 12} L${cx} ${cy - r + 16} L${cx + 2.5} ${cy + 12}Z`} className="fz1-needle" />
      </motion.g>
      <circle cx={cx} cy={cy} r={4} className="fz1-o fz1-metal" />
    </g>
  )
}

/** Mountain inset: pressure falls with altitude; local box w × 250. */
function Mountain({ w }: { w: number }) {
  const { id } = useFig()
  const base = 212
  const k = 0.018 // units per metre
  const y = (m: number) => base - m * k
  const snez = w * 0.3
  const ever = w * 0.68
  const d = `M0 ${base} L${snez - 40} ${base - 10} L${snez} ${y(1603)} L${snez + 34} ${base - 16} L${ever - 70} ${base - 60} L${ever} ${y(8849)} L${ever + 30} ${y(6500)} L${w} ${base}Z`
  const rows: [number, string, string, number][] = [
    [0, '0 m', '1 013 hPa', 6],
    [1603, 'Sněžka 1 603 m', '≐ 840 hPa', snez],
    [8849, 'Everest 8 849 m', '≐ 330 hPa', ever],
  ]
  return (
    <g>
      <path d={d} fill="#b3aa98" className="fz1-o" />
      <path d={d} fill={pat(id, 'b')} opacity={0.4} />
      <path d={`M${ever - 16} ${y(8849) + 26} L${ever} ${y(8849)} L${ever + 12} ${y(8849) + 18} L${ever + 4} ${y(8849) + 24}Z`} className="fz1-snow-f" />
      <path d={`M0 ${base} H${w}`} className="fz1-o fz1-thick" />
      {rows.map(([m, a, b, x], i) => (
        <g key={m}>
          <circle cx={x} cy={y(m)} r={3.5} className="fz1-o fz1-lvl-f" />
          <text x={i === 0 ? 12 : x + (i === 2 ? -10 : 8)} y={i === 0 ? base + 22 : y(m) - (i === 2 ? 26 : 22)} textAnchor={i === 2 ? 'end' : 'start'} className="fz1-lbl fz1-sm fz1-halo">
            {a}
          </text>
          <text x={i === 0 ? 12 : x + (i === 2 ? -10 : 8)} y={i === 0 ? base + 40 : y(m) - (i === 2 ? 8 : 4)} textAnchor={i === 2 ? 'end' : 'start'} className="fz1-lbl fz1-sm fz1-b fz1-lvl-t fz1-halo">
            {b}
          </text>
        </g>
      ))}
      <Arrow d={`M${w - 8} ${base - 10} V${y(8849) - 10}`} tone="lvl" />
      <text transform={`translate(${w - 18} ${(base + y(8849)) / 2}) rotate(-90)`} textAnchor="middle" className="fz1-lbl fz1-sm fz1-lvl-t fz1-halo">
        výš → menší tlak
      </text>
    </g>
  )
}

export default function Barometer() {
  const compact = useCompact()
  const n = compact.narrow
  const w = n ? 380 : 700
  return (
    <Figure
      w={w}
      h={n ? 668 : 400}
      max={n ? 420 : 720}
      compact={compact}
      boost={false}
      replay
      label="Měření atmosférického tlaku. Torricelliho pokus: skleněná trubice uzavřená nahoře je ponořená do misky se rtutí; tlak vzduchu na hladinu v misce udrží sloupec rtuti vysoký asi 760 mm, nad ním je vakuum. Aneroid je barometr bez kapaliny, jeho ručička ukazuje tlak v hektopascalech, normální tlak je 1 013 hPa. S rostoucí nadmořskou výškou tlak klesá: u moře 1 013 hPa, na Sněžce (1 603 m) asi 840 hPa, na Everestu (8 849 m) asi 330 hPa."
    >
      {n ? (
        <>
          <g transform="translate(-6 0) scale(0.98)">
            <Torricelli />
          </g>
          <Pop delay={0.3}>
            <Aneroid cx={286} cy={148} r={74} />
          </Pop>
          <Fade delay={0.6}>
            <text x={286} y={262} textAnchor="middle" className="fz1-lbl fz1-b">
              aneroid
            </text>
            <text x={286} y={282} textAnchor="middle" className="fz1-lbl fz1-sm">
              normální tlak 1 013 hPa
            </text>
          </Fade>
          <path d={`M10 386 H${w - 10}`} className="fz1-o fz1-soft" />
          <g transform="translate(10 414)">
            <Mountain w={360} />
          </g>
          <text x={w / 2} y={412} textAnchor="middle" className="fz1-lbl fz1-b">
            tlak klesá s nadmořskou výškou
          </text>
        </>
      ) : (
        <>
          <Torricelli />
          <Pop delay={0.3}>
            <Aneroid cx={292} cy={170} r={86} />
          </Pop>
          <Fade delay={0.6}>
            <text x={292} y={300} textAnchor="middle" className="fz1-lbl fz1-b">
              aneroid
            </text>
            <text x={292} y={320} textAnchor="middle" className="fz1-lbl fz1-sm">
              normální tlak 1 013 hPa
            </text>
          </Fade>
          <g transform="translate(410 90)">
            <Mountain w={282} />
          </g>
          <text x={551} y={40} textAnchor="middle" className="fz1-lbl fz1-b">
            tlak klesá s výškou
          </text>
        </>
      )}
      <text x={95} y={n ? 368 : 384} textAnchor="middle" className="fz1-lbl fz1-b">
        Torricelliho pokus
      </text>
    </Figure>
  )
}
