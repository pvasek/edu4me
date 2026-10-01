import { Fade, Figure, Pop, pat, useCompact, useFig } from './kit'

const RAINBOW = ['#d9342b', '#ec7a1c', '#e8c21c', '#3fa24a', '#2f8fd0', '#3b4fc4', '#7d3fb8']

const BANDS = [
  { name: 'rádiové vlny', w: 118, fill: '#b9c3d3', range: 'nad 1 m', use: ['rozhlas, televize,', 'mobilní sítě'] },
  { name: 'mikrovlny', w: 96, fill: '#c3c9e0', range: '1 mm – 1 m', use: ['mikrovlnná trouba,', 'Wi-Fi, radar'] },
  { name: 'infračervené', w: 100, fill: '#e7b1a6', range: '760 nm – 1 mm', use: ['tepelné záření,', 'dálkový ovladač'] },
  { name: 'viditelné', w: 44, fill: '', range: '380 – 760 nm', use: ['zrak,', 'fotosyntéza'] },
  { name: 'ultrafialové', w: 96, fill: '#c9b6e6', range: '10 – 380 nm', use: ['opálení, vitamin D,', 'ničí bakterie'] },
  { name: 'rentgenové', w: 96, fill: '#b3bccc', range: '0,01 – 10 nm', use: ['snímky kostí,', 'kontrola zavazadel'] },
  { name: 'záření gama', w: 100, fill: '#a9aebb', range: 'pod 0,01 nm', use: ['ozařování nádorů,', 'sterilizace'] },
]
const X0 = 26
const xs = BANDS.reduce<number[]>((a, b) => [...a, a[a.length - 1] + b.w], [X0])

/** A sine whose wavelength shrinks exponentially along the band (from x1 to x2). */
function chirp(x1: number, x2: number, y: number, amp: number, horizontal = true) {
  let d = ''
  let ph = 0
  const n = 700
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const pos = x1 + (x2 - x1) * u
    const lam = 90 * Math.pow(8 / 90, u) // 90 → 8 units
    if (i) ph += ((2 * Math.PI) / lam) * ((x2 - x1) / n)
    const off = amp * Math.sin(ph)
    d += `${i ? 'L' : 'M'}${horizontal ? `${pos.toFixed(1)} ${(y + off).toFixed(1)}` : `${(y + off).toFixed(1)} ${pos.toFixed(1)}`} `
  }
  return d
}

function Wide() {
  const { id } = useFig()
  const vis = [xs[3], xs[4]]
  return (
    <g>
      {BANDS.map((b, i) => (
        <Fade key={b.name} delay={0.1 + i * 0.06} className={b.fill ? '' : 'fz2-hidden'}>
          <text x={xs[i] + b.w / 2} y={22} textAnchor="middle" className="fz2-lbl fz2-sm">
            {b.use[0]}
          </text>
          <text x={xs[i] + b.w / 2} y={38} textAnchor="middle" className="fz2-lbl fz2-sm">
            {b.use[1]}
          </text>
        </Fade>
      ))}
      <path d={chirp(X0, xs[7], 70, 14)} className="fz2-chirp" />
      <Pop delay={0}>
        {BANDS.map((b, i) =>
          b.fill ? (
            <g key={b.name}>
              <rect x={xs[i]} y={98} width={b.w} height={36} fill={b.fill} />
              <text x={xs[i] + b.w / 2} y={121} textAnchor="middle" className="fz2-band-t">
                {b.name}
              </text>
            </g>
          ) : (
            <g key={b.name}>
              {RAINBOW.map((c, k) => (
                <rect key={c} x={xs[i] + (k * b.w) / 7} y={98} width={b.w / 7 + 0.3} height={36} fill={c} />
              ))}
            </g>
          ),
        )}
        <rect x={X0} y={98} width={xs[7] - X0} height={36} fill={pat(id, 'd')} opacity={0.35} />
        <rect x={X0} y={98} width={xs[7] - X0} height={36} className="fz2-o" fill="none" />
        {xs.slice(1, 7).map((x) => (
          <path key={x} d={`M${x} 98 V140`} className="fz2-o fz2-thin" />
        ))}
      </Pop>
      <Fade delay={0.6}>
        {[
          [xs[1], '1 m'],
          [xs[2], '1 mm'],
          [xs[5], '10 nm'],
          [xs[6], '0,01 nm'],
        ].map(([x, t]) => (
          <text key={t} x={x} y={154} textAnchor="middle" className="fz2-num fz2-num-sm">
            {t}
          </text>
        ))}
        {/* visible light blown up */}
        <path d={`M${vis[0]} 134 L150 196 M${vis[1]} 134 L390 196`} className="fz2-lead" />
        {RAINBOW.map((c, k) => (
          <rect key={c} x={150 + k * 34.29} y={196} width={34.6} height={22} fill={c} />
        ))}
        <rect x={150} y={196} width={240} height={22} className="fz2-o" fill="none" />
        <text x={150} y={236} className="fz2-num fz2-num-sm">
          760 nm
        </text>
        <text x={390} y={236} textAnchor="end" className="fz2-num fz2-num-sm">
          380 nm
        </text>
        <text x={270} y={236} textAnchor="middle" className="fz2-lbl fz2-b">
          viditelné světlo
        </text>
        <text x={270} y={254} textAnchor="middle" className="fz2-lbl fz2-sm">
          zrak, fotosyntéza
        </text>
        {/* ionising, harmful */}
        <path d={`M${xs[4] + 4} 170 V178 H${xs[7] - 2} V170`} className="fz2-o fz2-bad-s" />
        <text x={(xs[4] + xs[7]) / 2} y={198} textAnchor="middle" className="fz2-lbl fz2-b fz2-red-t">
          škodí živým buňkám
        </text>
        <text x={(xs[4] + xs[7]) / 2} y={216} textAnchor="middle" className="fz2-lbl fz2-sm fz2-red-t">
          (UV pálí kůži, rentgen a gama ionizují)
        </text>
        <path d={`M${X0} 262 H${xs[7]}`} className="fz2-arr fz2-arr-lvl" markerEnd={pat(id, 'ah-lvl')} markerStart={pat(id, 'ah-lvl')} />
        <text x={X0} y={284} className="fz2-lbl fz2-sm">
          delší vlnová délka λ, menší energie
        </text>
        <text x={xs[7]} y={284} textAnchor="end" className="fz2-lbl fz2-sm">
          vyšší frekvence f, větší energie
        </text>
      </Fade>
    </g>
  )
}

function Narrow() {
  const { id } = useFig()
  const RH = 58
  const Y0 = 40
  return (
    <g>
      <text x={12} y={22} className="fz2-lbl fz2-sm fz2-lvl-t">
        ↓ kratší vlna, vyšší frekvence a energie
      </text>
      <path d={chirp(Y0, Y0 + RH * 7, 58, 9, false)} className="fz2-chirp" />
      {BANDS.map((b, i) => {
        const y = Y0 + i * RH
        return (
          <g key={b.name}>
            {b.fill ? (
              <rect x={12} y={y} width={30} height={RH} fill={b.fill} />
            ) : (
              RAINBOW.map((c, k) => <rect key={c} x={12} y={y + (k * RH) / 7} width={30} height={RH / 7 + 0.3} fill={c} />)
            )}
            <path d={`M12 ${y} H350`} className={i ? 'fz2-o fz2-thin fz2-soft' : 'fz2-o fz2-thin'} />
            <text x={80} y={y + 22} className="fz2-lbl fz2-b">
              {b.name}
            </text>
            <text x={350} y={y + 22} textAnchor="end" className="fz2-num fz2-num-sm">
              {b.range}
            </text>
            <text x={80} y={y + 44} className={`fz2-lbl fz2-sm ${i >= 4 ? 'fz2-red-t' : ''}`}>
              {b.use.join(' ')}
            </text>
          </g>
        )
      })}
      <rect x={12} y={Y0} width={30} height={RH * 7} fill={pat(id, 'd')} opacity={0.35} />
      <rect x={12} y={Y0} width={30} height={RH * 7} className="fz2-o" fill="none" />
      <path d={`M354 ${Y0 + 4 * RH + 4} H358 V${Y0 + 7 * RH - 4} H354`} className="fz2-o fz2-bad-s" />
      <text x={12} y={Y0 + 7 * RH + 24} className="fz2-lbl fz2-sm fz2-red-t">
        UV, rentgenové a gama záření škodí buňkám
      </text>
    </g>
  )
}

export default function EmSpectrum() {
  const compact = useCompact()
  const n = compact.narrow
  return (
    <Figure
      level={5}
      w={n ? 362 : 696}
      h={n ? 474 : 292}
      max={760}
      compact={compact}
      boost={false}
      label="Elektromagnetické spektrum od nejdelších vln po nejkratší: rádiové vlny (nad 1 m, rozhlas a televize), mikrovlny (1 mm až 1 m, mikrovlnná trouba, Wi-Fi, radar), infračervené záření (tepelné záření, dálkový ovladač), úzký pás viditelného světla od 760 nm (červená) do 380 nm (fialová), ultrafialové záření (opálení, ničí bakterie), rentgenové záření (snímky kostí) a záření gama (ozařování nádorů). S kratší vlnovou délkou roste frekvence i energie; ultrafialové, rentgenové a gama záření škodí živým buňkám."
    >
      {n ? <Narrow /> : <Wide />}
    </Figure>
  )
}
