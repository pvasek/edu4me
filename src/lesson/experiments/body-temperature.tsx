import { useState } from 'react'
import { Plate, czNum, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  LIZ_BEST,
  T_MAX,
  T_MIN,
  isBest,
  lizardActivity,
  lizardBody,
  lizardEnergy,
  lizardState,
  mouseBody,
  mouseEnergy,
  type LizardState,
} from './body-temperature.model'

/** "Vyzkoušej si" for b5-3: surrounding temperature → a lizard (ectotherm) and a mouse (endotherm). */

const SAYS: Record<LizardState, string> = {
  zmrzla: 'strnulá – venku by zmrzla',
  strnula: 'strnulá, nehýbe se',
  pomala: 'pomalá',
  cila: 'čilá',
  nejcilejsi: 'nejčilejší',
  prehrata: 'přehřátá – hledá stín',
}
const r0 = (v: number) => czNum(Math.round(v))
const x1 = (v: number) => czNum(Math.round(v * 10) / 10)

// graph: body temperature against air temperature
const GX0 = 46
const GX1 = 196
const GY0 = 160
const GY1 = 276
const B0 = -10
const B1 = 45
const gx = (t: number) => GX0 + ((t - T_MIN) / (T_MAX - T_MIN)) * (GX1 - GX0)
const gy = (t: number) => GY1 - ((t - B0) / (B1 - B0)) * (GY1 - GY0)
// energy bars
const EB = 276
const EMAX = 7
const eh = (e: number) => (Math.min(e, EMAX) / EMAX) * 110

const LIZ = 'color-mix(in srgb, var(--level, var(--accent)) 72%, var(--ink))'
const MOUSE = 'var(--accent)'

function bodyLabel(air: number): string {
  const st = SAYS[lizardState(air)]
  return (
    `Při teplotě vzduchu ${czNum(air)} °C má ještěrka ve stínu tělo teplé ${r0(lizardBody(air))} °C a je ${st}. ` +
    `Myš má tělo teplé ${r0(mouseBody(air))} °C a ${mouseEnergy(air) < 1.05 ? 'spotřebuje tolik energie jako v teple' : `spotřebuje ${x1(mouseEnergy(air))}krát víc energie než v teple`}; ` +
    `ještěrka spotřebuje ${lizardEnergy(air) < 0.01 ? 'méně než 1 %' : `asi ${r0(lizardEnergy(air) * 100)} %`} toho, co myš v teple. ` +
    'Graf ukazuje teplotu těla obou zvířat podle teploty vzduchu: čára ještěrky stoupá šikmo, čára myši je vodorovná.'
  )
}

function Lizard({ air }: { air: number }) {
  const { still } = usePlate()
  const a = lizardActivity(lizardBody(air))
  const lift = 1 + 7 * a
  const hot = lizardState(air) === 'prehrata'
  const fill = `color-mix(in srgb, #5c9a4b ${Math.round(25 + 40 * a)}%, var(--surface))`
  const leg = (x: number, back: boolean) => {
    const k = back ? -1 : 1
    return `M${x} 4 L${x + 7 * k} ${4 + lift * 0.6} L${x + 4 * k} ${lift + 6}`
  }
  return (
    <g transform={`translate(86 ${100 - lift})`}>
      {/* speed marks while active */}
      {a > 0.3 && (
        <g opacity={a} stroke="var(--ink-soft)" strokeWidth={1.2} strokeLinecap="round">
          <path d="M-78 -8 H-66 M-82 0 H-68 M-76 8 H-66" />
        </g>
      )}
      <path d={leg(-4, true)} fill="none" stroke="var(--edge)" strokeWidth={2.4} strokeLinecap="round" />
      <path d={leg(24, false)} fill="none" stroke="var(--edge)" strokeWidth={2.4} strokeLinecap="round" />
      <path
        d="M-62 2 C-40 0 -20 -2 -6 -5 C6 -9 20 -9 30 -6 C38 -6 44 -4 50 -1 C56 0 60 2 56 4 C48 6 40 6 30 6 C18 9 4 9 -6 6 C-24 5 -44 4 -62 2Z"
        fill={fill}
        stroke="var(--edge)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      >
        {!still && a > 0.3 && (
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur={`${(0.9 - 0.5 * a).toFixed(2)}s`} repeatCount="indefinite" />
        )}
      </path>
      <circle cx={47} cy={-2} r={1.8} fill="var(--edge)" />
      {[-30, -14, 2, 16].map((x) => (
        <path key={x} d={`M${x} -5 l3 4`} stroke="var(--edge)" strokeWidth={0.8} opacity={0.6} />
      ))}
      {hot && (
        <g fill="none" stroke="var(--bad)" strokeWidth={1.4} strokeLinecap="round">
          <path d="M-10 -22 q3 -4 0 -8 t0 -8 M4 -22 q3 -4 0 -8 t0 -8 M18 -22 q3 -4 0 -8 t0 -8" />
        </g>
      )}
    </g>
  )
}

function Mouse({ air }: { air: number }) {
  const { still } = usePlate()
  const cold = air < 15
  const puff = air < 22
  return (
    <g transform="translate(272 92)">
      {cold && (
        <g fill="none" stroke="var(--ink-soft)" strokeWidth={1.2} strokeLinecap="round">
          <path d="M-46 -14 l4 3 l-4 3 l4 3 M44 -26 l3 4 l-3 4 l3 4" />
          {!still && <animate attributeName="opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite" />}
        </g>
      )}
      <path d="M-26 6 C-44 10 -50 -2 -58 4" fill="none" stroke="var(--edge)" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse
        cx={0}
        cy={0}
        rx={puff ? 28 : 26}
        ry={puff ? 19 : 16}
        fill="color-mix(in srgb, #9a8a7a 40%, var(--surface))"
        stroke="var(--edge)"
        strokeWidth={1.5}
        strokeDasharray={puff ? '3 1.5' : undefined}
      />
      <circle cx={24} cy={-8} r={11} fill="color-mix(in srgb, #9a8a7a 40%, var(--surface))" stroke="var(--edge)" strokeWidth={1.5} />
      <circle cx={20} cy={-20} r={6.5} fill="color-mix(in srgb, #e8a0a0 45%, var(--surface))" stroke="var(--edge)" strokeWidth={1.3} />
      <circle cx={28} cy={-10} r={1.7} fill="var(--edge)" />
      <circle cx={35} cy={-5} r={1.6} fill="color-mix(in srgb, #c46a5a 80%, var(--ink))" />
      <path d="M-14 15 v6 M10 15 v6" stroke="var(--edge)" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function Thermometer({ air }: { air: number }) {
  const top = 22
  const bot = 92
  const h = ((air - T_MIN) / (T_MAX - T_MIN)) * (bot - top)
  return (
    <g>
      <rect x={174} y={top - 4} width={12} height={bot - top + 8} rx={6} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.3} />
      <rect x={177.5} y={bot - h} width={5} height={h + 4} fill="var(--bad)" />
      <circle cx={180} cy={bot + 9} r={8} fill="var(--bad)" stroke="var(--edge)" strokeWidth={1.3} />
      {[-10, 0, 10, 20, 30, 40].map((t) => {
        const y = bot - ((t - T_MIN) / (T_MAX - T_MIN)) * (bot - top)
        return <path key={t} d={`M186 ${y.toFixed(1)} h4`} stroke="var(--edge)" strokeWidth={0.9} />
      })}
      <text x={180} y={124} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        vzduch {czNum(air)} °C
      </text>
    </g>
  )
}

function Graph({ air }: { air: number }) {
  const lz = Array.from({ length: 51 }, (_, i) => T_MIN + i).map((t) => `${gx(t).toFixed(1)} ${gy(lizardBody(t)).toFixed(1)}`)
  const ms = Array.from({ length: 51 }, (_, i) => T_MIN + i).map((t) => `${gx(t).toFixed(1)} ${gy(mouseBody(t)).toFixed(1)}`)
  return (
    <g>
      {[0, 20, 40].map((t) => (
        <g key={t}>
          <path d={`M${GX0} ${gy(t).toFixed(1)} H${GX1}`} className="ph-grid" />
          <text x={GX0 - 5} y={gy(t) + 4} textAnchor="end" className="ph-num">
            {t}
          </text>
        </g>
      ))}
      {[-10, 0, 10, 20, 30, 40].map((t) => (
        <text key={t} x={gx(t)} y={GY1 + 14} textAnchor="middle" className="ph-num">
          {czNum(t)}
        </text>
      ))}
      {/* preferred band of the lizard */}
      <rect x={gx(LIZ_BEST - 2)} y={GY0} width={gx(LIZ_BEST) - gx(LIZ_BEST - 2)} height={GY1 - GY0} fill={LIZ} opacity={0.12} />
      <path d={`M${GX0} ${GY0 - 6} V${GY1} H${GX1 + 4}`} fill="none" stroke="var(--edge)" strokeWidth={1.3} />
      <path d={'M' + ms.join(' L')} fill="none" stroke={MOUSE} strokeWidth={2.4} strokeDasharray="7 4" />
      <path d={'M' + lz.join(' L')} fill="none" stroke={LIZ} strokeWidth={2.4} />
      <path d={`M${gx(air).toFixed(1)} ${GY0} V${GY1}`} className="ph-guide" />
      <circle cx={gx(air)} cy={gy(lizardBody(air))} r={4.5} fill="var(--surface)" stroke={LIZ} strokeWidth={2} />
      <circle cx={gx(air)} cy={gy(mouseBody(air))} r={4.5} fill="var(--surface)" stroke={MOUSE} strokeWidth={2} />
      <text x={GX0 + 4} y={GY0 - 8} className="ph-lbl ph-lbl-sm">
        teplota těla (°C)
      </text>
      <text x={GX1} y={GY1 + 30} textAnchor="end" className="ph-unit">
        teplota vzduchu (°C)
      </text>
      <text x={gx(-8)} y={gy(37) - 6} className="ph-lbl ph-lbl-sm" style={{ fill: MOUSE }}>
        myš
      </text>
      <text x={gx(4)} y={gy(-2) - 4} className="ph-lbl ph-lbl-sm" style={{ fill: LIZ }}>
        ještěrka
      </text>
    </g>
  )
}

function Energy({ air }: { air: number }) {
  const bars: [string, number, string][] = [
    ['ještěrka', lizardEnergy(air), LIZ],
    ['myš', mouseEnergy(air), MOUSE],
  ]
  return (
    <g>
      <text x={292} y={150} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        spotřeba energie
      </text>
      <path d={`M232 ${EB} H352`} stroke="var(--edge)" strokeWidth={1.3} />
      {bars.map(([name, e, col], i) => {
        const x = 248 + i * 58
        const h = Math.max(1.5, eh(e))
        return (
          <g key={name}>
            <rect x={x} y={EB - h} width={30} height={h} fill={col} opacity={0.75} stroke="var(--edge)" strokeWidth={1} />
            <text x={x + 15} y={EB - h - 5} textAnchor="middle" className="ph-num" style={{ fontWeight: 700 }}>
              {e < 0.1 ? '< 0,1' : x1(e)}×
            </text>
            <text x={x + 15} y={EB + 15} textAnchor="middle" className="ph-lbl ph-lbl-sm">
              {name}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function BodyTemperature() {
  const [air, setAir] = useState(15)
  const nar = useNarrow()
  const st = lizardState(air)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 310]} max={460} label={bodyLabel(air)} className="xp-bt">
          {/* ground */}
          <path d="M8 108 H352" stroke="var(--edge)" strokeWidth={1.2} />
          <Lizard air={air} />
          <Mouse air={air} />
          <Thermometer air={air} />
          <text x={86} y={128} textAnchor="middle" className="ph-lbl ph-lbl-sm" style={{ fill: LIZ }}>
            ještěrka: {r0(lizardBody(air))} °C
          </text>
          <text x={276} y={128} textAnchor="middle" className="ph-lbl ph-lbl-sm" style={{ fill: MOUSE }}>
            myš: {r0(mouseBody(air))} °C
          </text>
          <Graph air={air} />
          <Energy air={air} />
        </Plate>
      }
      controls={<Control label="teplota vzduchu" unit="°C" value={air} min={T_MIN} max={T_MAX} step={1} onChange={setAir} />}
      readouts={
        <>
          <Readout label="ještěrka (ve stínu)" value={SAYS[st]} tone={st === 'nejcilejsi' ? 'good' : st === 'zmrzla' || st === 'prehrata' ? 'bad' : undefined} />
          <Readout label="spotřeba energie myši" value={mouseEnergy(air) < 1.05 ? 'jako v teple' : `${x1(mouseEnergy(air))}krát víc`} />
        </>
      }
      challenge="Najdi teplotu, při které je ještěrka nejaktivnější."
      done={isBest(air)}
    />
  )
}
