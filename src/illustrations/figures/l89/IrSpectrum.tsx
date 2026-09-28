import { Draw, F, Fade, Figure, Plate, useHatch, useNarrow } from './kit'

const LABEL =
  'Infračervené spektrum kyseliny ethanové (octové) CH3COOH: svisle transmitance v procentech, vodorovně vlnočet od 4000 do 500 cm−1 (osa jde zprava doleva klesající). Dolů mířící pásy ukazují absorpci. Velmi široký pás O–H karboxylové skupiny v rozsahu 2500–3300 cm−1, na něm úzký pás C–H kolem 2950 cm−1, silný ostrý pás C=O u 1710 cm−1 a pás C–O kolem 1250 cm−1. Oblast pod 1500 cm−1 je oblast otisku prstu, typická pro každou látku zvlášť.'

/** Absorption bands: centre (cm⁻¹), width (σ, cm⁻¹), depth (% transmittance). */
const BANDS: [number, number, number][] = [
  // very broad, hydrogen-bonded O–H of the carboxylic acid
  [3120, 170, 28],
  [2930, 190, 28],
  [2700, 130, 20],
  [2560, 70, 12],
  // C–H stretch on top of it
  [2960, 13, 9],
  // C=O
  [1712, 22, 84],
  // fingerprint region
  [1410, 20, 38],
  [1300, 18, 30],
  [1250, 28, 56],
  [1050, 14, 16],
  [935, 36, 34],
  [620, 26, 30],
]

function transmittance(nu: number) {
  let a = 0
  for (const [c, s, d] of BANDS) a += d * Math.exp(-((nu - c) ** 2) / (2 * s * s))
  // gentle ripple on the broad O–H band
  if (nu > 2450 && nu < 3350) a += 2.2 * Math.sin(nu / 23) * Math.exp(-((nu - 2900) ** 2) / (2 * 300 * 300))
  return Math.max(3, 94 - a)
}

export default function IrSpectrum() {
  return (
    <Figure name="ir-spectrum" level={8} label={LABEL} max={680}>
      <Scene />
    </Figure>
  )
}

type Tag = { nu: number; bond: string; lines: string[]; anchor: 'start' | 'middle' | 'end'; dx: number }

function Scene() {
  const n = useNarrow()
  const hatch = useHatch()
  const L = n ? { w: 340, h: 330, x0: 46, x1: 326, y1: 96, y0: 266 } : { w: 660, h: 334, x0: 72, x1: 624, y1: 96, y0: 280 }
  const X = (nu: number) => L.x0 + ((4000 - nu) / 3500) * (L.x1 - L.x0)
  const Y = (t: number) => L.y0 - (t / 100) * (L.y0 - L.y1)
  const pts: string[] = []
  for (let nu = 4000; nu >= 500; nu -= 5) pts.push(`${X(nu).toFixed(1)} ${Y(transmittance(nu)).toFixed(1)}`)
  const curve = `M${pts.join(' L')}`
  const tags: Tag[] = [
    { nu: 2960, bond: 'C–H', lines: [n ? '2950' : '≈ 2950 cm^{-1}'], anchor: 'middle', dx: 0 },
    { nu: 1712, bond: 'C=O', lines: n ? ['1710', 'silný'] : ['1710 cm^{-1}', 'silný, ostrý'], anchor: 'end', dx: -6 },
    { nu: 1250, bond: 'C–O', lines: [n ? '1250' : '≈ 1250 cm^{-1}'], anchor: 'start', dx: 6 },
  ]
  const fp = { a: X(1500), b: X(500) }
  const oh = { a: X(3300), b: X(2500), y: Y(n ? 29 : 27) }
  return (
    <Plate w={L.w} h={L.h}>
      {/* fingerprint region */}
      <Fade delay={0.1}>
        <rect x={fp.a} y={L.y1 - 6} width={fp.b - fp.a} height={L.y0 - L.y1 + 6} style={{ fill: 'color-mix(in srgb, var(--lv) 9%, transparent)' }} />
        <rect x={fp.a} y={L.y1 - 6} width={fp.b - fp.a} height={L.y0 - L.y1 + 6} fill={hatch('d')} className="f89-hatch" style={{ opacity: 0.55 }} />
        <line className="f89-guide" x1={fp.a} y1={L.y1 - 6} x2={fp.a} y2={L.y0} style={{ stroke: 'var(--lv)' }} />
        {n ? (
          <>
            <text className="f89-lb f89-lv f89-sm f89-b" x={(fp.a + fp.b) / 2} y={L.y0 - 26} textAnchor="middle">
              oblast
            </text>
            <text className="f89-lb f89-lv f89-sm f89-b" x={(fp.a + fp.b) / 2} y={L.y0 - 10} textAnchor="middle">
              otisku prstu
            </text>
          </>
        ) : (
          <text className="f89-lb f89-lv f89-b" x={(fp.a + fp.b) / 2} y={L.y0 - 12} textAnchor="middle">
            oblast otisku prstu
          </text>
        )}
      </Fade>

      {/* axes */}
      <Fade delay={0.15}>
        {[0, 50, 100].map((t) => (
          <g key={t}>
            <line className="f89-guide" x1={L.x0} y1={Y(t)} x2={L.x1} y2={Y(t)} style={{ opacity: t ? 0.35 : 0, strokeDasharray: '2 5' }} />
            <text className="f89-f f89-sm f89-muted" x={L.x0 - 7} y={Y(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500].map((nu) => (
          <g key={nu}>
            <line className="f89-thin" x1={X(nu)} y1={L.y0} x2={X(nu)} y2={L.y0 + 5} />
            {(!n || nu % 1000 === 0 || nu === 500) && (
              <text className="f89-f f89-sm f89-muted" x={X(nu)} y={L.y0 + 19} textAnchor="middle">
                {nu}
              </text>
            )}
          </g>
        ))}
        <path className="f89-ln" d={`M${L.x0} ${L.y1 - 10} V${L.y0} H${L.x1 + 6}`} />
        <text className="f89-lb" x={(L.x0 + L.x1) / 2} y={L.y0 + 40} textAnchor="middle">
          <tspan>vlnočet (cm</tspan>
          <tspan dy="-0.4em" fontSize="70%">
            −1
          </tspan>
          <tspan dy="0.4em">)</tspan>
        </text>
        <text className="f89-lb" transform={`translate(${n ? 13 : 24} ${(L.y0 + L.y1) / 2}) rotate(-90)`} textAnchor="middle">
          transmitance (%)
        </text>
        <text className="f89-lb f89-b" x={n ? L.x0 : L.x1} y={20} textAnchor={n ? 'start' : 'end'}>
          kyselina ethanová CH₃COOH
        </text>
      </Fade>

      {/* the spectrum draws in from 4000 to 500 cm⁻¹ */}
      <Draw d={curve} className="f89-ln" delay={0.3} dur={1.5} style={{ strokeWidth: 1.7 }} />

      {/* broad O–H band */}
      <Fade delay={1.0}>
        <path className="f89-ln" style={{ stroke: 'var(--lv)', strokeWidth: 1.6 }} d={`M${oh.a} ${oh.y - 6} V${oh.y} H${oh.b} V${oh.y - 6}`} />
        <F x={(oh.a + oh.b) / 2} y={oh.y + 17} t="O–H" className="f89-f f89-b f89-lv" />
        <text className="f89-f f89-sm f89-muted" x={(oh.a + oh.b) / 2} y={oh.y + 32} textAnchor="middle">
          {n ? '2500–3300' : 'velmi široký pás · 2500–3300'}
        </text>
      </Fade>

      {/* band tags with leaders */}
      {tags.map((t, i) => {
        const x = X(t.nu)
        const yMin = Y(transmittance(t.nu))
        const ty = n ? 40 : 44
        const lastY = ty + 16 * t.lines.length
        return (
          <Fade key={t.bond} delay={1.3 + i * 0.2}>
            <line className="f89-lead" x1={x} y1={t.anchor === 'middle' ? lastY + 6 : ty - 12} x2={x} y2={yMin - 3} style={{ strokeDasharray: '3 3' }} />
            <circle className="f89-dot" cx={x} cy={yMin - 3} r={2.2} />
            <F x={x + t.dx} y={ty} t={t.bond} anchor={t.anchor} className="f89-f f89-b f89-lv" />
            {t.lines.map((s, k) => (
              <text key={s} className="f89-f f89-sm" x={x + t.dx} y={ty + 16 * (k + 1)} textAnchor={t.anchor}>
                <tspan>{s.replace('cm^{-1}', 'cm')}</tspan>
                {s.includes('cm^{-1}') && (
                  <tspan dy="-0.4em" fontSize="70%">
                    −1
                  </tspan>
                )}
              </text>
            ))}
          </Fade>
        )
      })}
    </Plate>
  )
}
