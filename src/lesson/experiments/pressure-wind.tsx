import { useState } from 'react'
import { Plate, czNum, url, usePlate, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { CROSS_ANGLE, DP_MAX, beaufort, centres, challengeMet, isobars, streamline, windSpeed } from './pressure-wind.model'
import './geo-b.css'

/** "Vyzkoušej si" for z4-2: pressure difference → wind speed; the Earth's rotation → deflection to the right. */

const HX = 92
const NX = 268
const CY = 116
const R = 84
const ANGLES = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2 + Math.PI / 4)

type Rot = 'off' | 'on'

const hpa = (p: number) => `${czNum(p).replace(/^(\d)(\d{3})$/, '$1 $2')} hPa`
const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

function label(dp: number, rotate: boolean): string {
  const { high, low } = centres(dp)
  const v = windSpeed(dp)
  const bf = beaufort(v)
  if (dp === 0) return `Mapa tlaku vzduchu: tlak je všude stejný, ${hpa(high)}, proto vítr nefouká (bezvětří).`
  return (
    `Mapa tlaku vzduchu: vlevo tlaková výše H s tlakem ${hpa(high)}, vpravo tlaková níže N s tlakem ${hpa(low)}, ` +
    `izobary po 5 hPa. Vítr fouká z výše do níže rychlostí asi ${czNum(v, 1)} m/s, to je ${bf.force}. stupeň Beaufortovy stupnice (${bf.name}). ` +
    (rotate
      ? `Země se otáčí, takže se vítr na severní polokouli stáčí doprava: z tlakové výše vytéká ve směru hodinových ručiček, do tlakové níže se stáčí proti směru hodinových ručiček a izobary přetíná šikmo, asi pod úhlem ${CROSS_ANGLE}°.`
      : 'Bez otáčení Země by vítr foukal přímo z výše do níže, kolmo na izobary.')
  )
}

function Map({ dp, rotate }: { dp: number; rotate: boolean }) {
  const { id, still } = usePlate()
  const { high, low } = centres(dp)
  const iso = isobars(dp)
  const v = windSpeed(dp)
  const w = 1.3 + v / 7
  const dur = v > 0 ? `${(36 / v).toFixed(2)}s` : '0s'
  const lines: [number, number][][] = []
  if (dp > 0)
    for (const a of ANGLES) {
      lines.push(streamline(HX, CY, a, 20, R - 4, rotate))
      lines.push(streamline(NX, CY, a, R + 2, 20, rotate))
    }
  return (
    <>
      {/* isobars */}
      {iso.high.map(([p, r]) => (
        <circle key={`h${p}`} cx={HX} cy={CY} r={r * R} className="xp-pw-iso" />
      ))}
      {iso.low.map(([p, r]) => (
        <circle key={`n${p}`} cx={NX} cy={CY} r={r * R} className="xp-pw-iso" />
      ))}
      {/* wind */}
      {lines.map((pts, i) => (
        <g key={i}>
          <path d={path(pts)} className="xp-pw-flow" style={{ strokeWidth: w }} markerEnd={url(id, 'as-a')} />
          {!still && <path d={path(pts.slice(0, -2))} className="xp-pw-run" style={{ strokeWidth: w * 0.7, ['--dur' as string]: dur }} />}
        </g>
      ))}
      {iso.high.map(([p, r], i) =>
        (i % 2 === (iso.high.length > 3 ? 1 : 0) || r === 1) && r * R > 26 ? (
          <text key={`ht${p}`} x={HX} y={CY - r * R + 4} textAnchor="middle" className="ph-num ph-halo">
            {czNum(p)}
          </text>
        ) : null,
      )}
      {iso.low.map(([p, r], i) =>
        (i % 2 === (iso.low.length > 3 ? 1 : 0) || r === 1) && r * R > 26 ? (
          <text key={`nt${p}`} x={NX} y={CY - r * R + 4} textAnchor="middle" className="ph-num ph-halo">
            {czNum(p)}
          </text>
        ) : null,
      )}
      {/* centres */}
      {(
        [
          [HX, 'H', high, 'tlaková výše'],
          [NX, 'N', low, 'tlaková níže'],
        ] as const
      ).map(([x, letter, p, name]) => (
        <g key={letter}>
          <circle cx={x} cy={CY} r={17} className="ph-paper" stroke="var(--edge)" strokeWidth={1.4} />
          <text x={x} y={CY + 9} textAnchor="middle" className="xp-pw-centre">
            {letter}
          </text>
          <text x={x} y={CY + R + 22} textAnchor="middle" className="ph-lbl ph-lbl-sm">
            {name}
          </text>
          <text x={x} y={CY + R + 38} textAnchor="middle" className="ph-unit">
            {hpa(p)}
          </text>
        </g>
      ))}
      <text x={180} y={14} textAnchor="middle" className="ph-unit">
        {dp === 0 ? 'tlak všude stejný – vítr nefouká' : rotate ? 'severní polokoule: vítr se stáčí doprava' : 'bez otáčení Země: přímo z H do N'}
      </text>
    </>
  )
}

export default function PressureWind() {
  const [dp, setDp] = useState(20)
  const [rot, setRot] = useState<Rot>('off')
  const nar = useNarrow()
  const rotate = rot === 'on'
  const v = windSpeed(dp)
  const bf = beaufort(v)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 246]} max={460} label={label(dp, rotate)} className="xp-pw">
          <Map dp={dp} rotate={rotate} />
        </Plate>
      }
      controls={
        <>
          <Control label="tlakový rozdíl mezi H a N" unit="hPa" value={dp} min={0} max={DP_MAX} step={10} onChange={setDp} />
          <Choice
            label="otáčení Země"
            value={rot}
            options={[
              { value: 'off', label: 'vypnuto' },
              { value: 'on', label: 'zapnuto (severní polokoule)' },
            ]}
            onChange={setRot}
          />
        </>
      }
      readouts={
        <>
          <Readout label="rychlost větru u země" value={v} digits={1} unit="m/s" />
          <Readout label="Beaufortova stupnice" value={`${bf.force} – ${bf.name}`} />
          <Readout
            label="směr větru"
            value={dp === 0 ? 'žádný' : rotate ? 'stáčí se doprava' : 'přímo z H do N'}
          />
        </>
      }
      challenge="Nastav tlakový rozdíl tak, aby foukal **silný vítr** (6. stupeň), a zapni otáčení Země."
      done={challengeMet(dp, rotate)}
    />
  )
}
