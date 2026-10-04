import { useId, useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  ALBEDO_MAX,
  ALBEDO_MIN,
  ALBEDO_EARTH,
  EPS_EARTH,
  EPS_MAX,
  EPS_MIN,
  K0,
  SIGMA,
  SURFACES,
  T_EARTH,
  absorbed,
  challengeMet,
  greenhouseWarming,
  incoming,
  reflected,
  temperature,
} from './albedo-balance.model'

/** "Vyzkoušej si" for z10-2: albedo and the greenhouse effect → the Earth's equilibrium temperature. */

const PX = 1 / 14 // arrow width per W/m²
const CX = 168
const CY = 128
const R = 50

// thermometer
const TX = 330
const TT = 40
const TB = 206
const T_LO = -60
const T_HI = 60
const ty = (t: number) => TB - ((Math.min(T_HI, Math.max(T_LO, t)) - T_LO) / (T_HI - T_LO)) * (TB - TT)

// albedo scale
const AX0 = 50
const AX1 = 300
const AY = 250
const A_TOP = 0.9
const ax = (a: number) => AX0 + (a / A_TOP) * (AX1 - AX0)

const ICE = 'color-mix(in srgb, #f4f7f9 92%, var(--blue))'
const OCEAN = 'color-mix(in srgb, var(--blue) 62%, var(--surface))'
const LAND = 'color-mix(in srgb, var(--green) 62%, var(--surface))'

/** A straight fat arrow from (x1, y1) to (x2, y2) whose band is w0 wide at the tail and w1 at the head. */
function fat(x1: number, y1: number, x2: number, y2: number, w0: number, w1 = w0): string {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const nx = -uy
  const ny = ux
  const head = Math.min(len * 0.45, Math.max(10, w1 * 0.9))
  const hx = x2 - ux * head
  const hy = y2 - uy * head
  const hw = w1 / 2 + Math.max(5, w1 * 0.35)
  const p = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`
  return (
    `M${p(x1 + (nx * w0) / 2, y1 + (ny * w0) / 2)} L${p(hx + (nx * w1) / 2, hy + (ny * w1) / 2)} ` +
    `L${p(hx + nx * hw, hy + ny * hw)} L${p(x2, y2)} L${p(hx - nx * hw, hy - ny * hw)} ` +
    `L${p(hx - (nx * w1) / 2, hy - (ny * w1) / 2)} L${p(x1 - (nx * w0) / 2, y1 - (ny * w0) / 2)}Z`
  )
}

const cz = (n: number, d = 0) => czNum(n, d)

function label(albedo: number, eps: number): string {
  const t = temperature(albedo, eps)
  return (
    `Energetická bilance Země. Ze Slunce přichází v průměru ${cz(incoming())} W/m². ` +
    `Albedo ${cz(albedo, 2)} odrazí ${cz(reflected(albedo))} W/m², Země pohltí ${cz(absorbed(albedo))} W/m² a stejně tolik vyzáří do vesmíru. ` +
    `Efektivní emisivita ${cz(eps, 2)}${eps >= 0.999 ? ', tedy žádný skleníkový efekt' : ''}: průměrná teplota je ${cz(t, 1)} °C` +
    `${eps < 0.999 ? `, skleníkový efekt přidává ${cz(greenhouseWarming(albedo, eps), 1)} °C` : ''}.`
  )
}

function Picture({ albedo, eps }: { albedo: number; eps: number }) {
  const clip = 'ab' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const t = temperature(albedo, eps)
  const surf = SIGMA * (t + K0) ** 4
  const out = absorbed(albedo)
  const atm = R + 5 + ((1 - eps) / (1 - EPS_MIN)) * 18
  // ice caps grow with albedo (a picture of "more ice and snow")
  const cap = Math.min(1, Math.max(0, (albedo - 0.08) / 0.72)) * R
  const hot = t > 30
  const cold = t < -5
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>
      {/* Sun */}
      <g>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <path
              key={i}
              d={`M${(28 + Math.cos(a) * 24).toFixed(1)} ${(40 + Math.sin(a) * 24).toFixed(1)} L${(28 + Math.cos(a) * 31).toFixed(1)} ${(40 + Math.sin(a) * 31).toFixed(1)}`}
              stroke="var(--yellow)"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          )
        })}
        <circle cx={28} cy={40} r={19} fill="var(--yellow)" stroke="var(--edge)" strokeWidth={1.2} />
      </g>
      {/* atmosphere: thicker = stronger greenhouse effect */}
      <circle
        cx={CX}
        cy={CY}
        r={atm}
        fill={`color-mix(in srgb, var(--teal) ${Math.round(8 + ((1 - eps) / (1 - EPS_MIN)) * 26)}%, transparent)`}
        stroke="var(--teal)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      {/* Earth */}
      <g clipPath={`url(#${clip})`}>
        <circle cx={CX} cy={CY} r={R} fill={OCEAN} />
        <path
          d={`M${CX - 36} ${CY - 30} q18 -12 30 2 q10 14 -4 26 q-6 18 8 30 q-12 10 -24 -4 q-14 -20 -12 -34 q-6 -10 2 -20Z`}
          fill={LAND}
        />
        <path d={`M${CX + 8} ${CY - 18} q22 -10 34 6 q8 16 -6 22 q-12 4 -14 20 q-14 -4 -16 -22 q-6 -14 2 -26Z`} fill={LAND} />
        <rect x={CX - R} y={CY - R} width={2 * R} height={cap} fill={ICE} />
        <rect x={CX - R} y={CY + R - cap} width={2 * R} height={cap} fill={ICE} />
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--edge)" strokeWidth={1.5} />
      {/* incoming sunlight */}
      <path d={fat(6, CY - 10, CX - atm + 2, CY - 10, incoming() * PX)} fill="color-mix(in srgb, var(--yellow) 70%, var(--surface))" stroke="var(--edge)" strokeWidth={1} />
      <text x={8} y={CY - 10 - (incoming() * PX) / 2 - 7} className="ph-unit ph-halo">
        {cz(incoming())} W/m²
      </text>
      {/* reflected sunlight */}
      {albedo > 0 && (
        <path
          d={fat(CX - R * 0.75, CY - R * 0.66, 96, 36, Math.max(1.5, reflected(albedo) * PX))}
          fill="color-mix(in srgb, var(--yellow) 30%, var(--surface))"
          stroke="var(--edge)"
          strokeWidth={1}
        />
      )}
      <text x={40} y={20} className="ph-unit ph-halo">
        odraženo {cz(reflected(albedo))} W/m²
      </text>
      {/* heat radiation: wide at the surface (σT⁴), narrower where it leaves the atmosphere */}
      <path
        d={fat(CX + R * 0.62, CY - R * 0.74, 240, 34, Math.min(48, surf * PX), out * PX)}
        fill={`color-mix(in srgb, ${hot ? 'var(--bad)' : 'var(--accent)'} 40%, var(--surface))`}
        stroke="var(--edge)"
        strokeWidth={1}
      />
      <text x={196} y={20} className="ph-unit ph-halo">
        do vesmíru {cz(out)} W/m²
      </text>
      <text x={244} y={CY - 4} className="ph-unit ph-halo">
        z povrchu
      </text>
      <text x={244} y={CY + 12} className="ph-unit ph-halo">
        {cz(surf)} W/m²
      </text>
      <text x={CX} y={CY + atm + 16} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
        {eps >= 0.999 ? 'bez skleníkového efektu' : 'atmosféra se skleníkovými plyny'}
      </text>
      {/* thermometer */}
      <rect x={TX - 6} y={TT - 8} width={12} height={TB - TT + 12} rx={6} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.3} />
      <circle cx={TX} cy={TB + 10} r={11} fill={cold ? 'var(--blue)' : 'var(--bad)'} stroke="var(--edge)" strokeWidth={1.3} />
      <rect x={TX - 3} y={ty(t)} width={6} height={TB + 4 - ty(t)} fill={cold ? 'var(--blue)' : 'var(--bad)'} />
      {[-40, -20, 0, 20, 40].map((v) => (
        <g key={v}>
          <path d={`M${TX + 6} ${ty(v)} h5`} stroke="var(--edge)" strokeWidth={1} />
          <text x={TX - 10} y={ty(v) + 4} textAnchor="end" className="ph-num">
            {czNum(v)}
          </text>
        </g>
      ))}
      <path d={`M${TX + 6} ${ty(T_EARTH)} h8`} stroke="var(--good)" strokeWidth={2.4} />
      <text x={TX} y={TB + 38} textAnchor="middle" className="ph-lbl ph-halo">
        {cz(t, 1)} °C
      </text>
      {/* albedo scale */}
      <path d={`M${AX0} ${AY} H${AX1}`} className="ph-o" />
      <text x={4} y={AY + 4} className="ph-unit">
        albedo
      </text>
      {[0, 0.2, 0.4, 0.6, 0.8].map((v) => (
        <text key={v} x={ax(v)} y={AY + 15} textAnchor="middle" className="ph-num">
          {czNum(v)}
        </text>
      ))}
      {SURFACES.map((s, i) => (
        <g key={s.label}>
          <path d={`M${ax(s.albedo)} ${AY - 3} v6`} stroke="var(--edge)" strokeWidth={1} />
          <text x={ax(s.albedo)} y={AY + (i % 2 ? 43 : 29)} textAnchor="middle" className="ph-unit" style={{ fontSize: 12.5 }}>
            {s.label}
          </text>
        </g>
      ))}
      <path d={`M${ax(albedo)} ${AY - 3} l-6 -10 h12Z`} fill="var(--ink)" />
      <text x={ax(albedo)} y={AY - 16} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
        Země {czNum(albedo, 2)}
      </text>
    </>
  )
}

export default function AlbedoBalance() {
  const [albedo, setAlbedo] = useState(ALBEDO_EARTH)
  // slider value: 100 · (1 − ε), so moving right = stronger greenhouse effect
  const [g, setG] = useState(Math.round((1 - EPS_EARTH) * 100))
  const eps = Math.round((1 - g / 100) * 100) / 100
  const nar = useNarrow()
  const t = temperature(albedo, eps)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 362, 300]} max={480} label={label(albedo, eps)} className="xp-ab">
          <Picture albedo={albedo} eps={eps} />
        </Plate>
      }
      controls={
        <>
          <Control label="albedo Země *α*" value={albedo} min={ALBEDO_MIN} max={ALBEDO_MAX} step={0.01} digits={2} onChange={setAlbedo} />
          <Control
            label="skleníkový efekt"
            value={g}
            min={Math.round((1 - EPS_MAX) * 100)}
            max={Math.round((1 - EPS_MIN) * 100)}
            step={1}
            format={(v) => `${v === 0 ? 'žádný · ' : Math.abs(1 - v / 100 - EPS_EARTH) < 0.005 ? 'dnes · ' : ''}ε = ${czNum(1 - v / 100, 2)}`}
            onChange={setG}
          />
        </>
      }
      readouts={
        <>
          <Readout label="průměrná teplota" value={t} unit="°C" tone={Math.abs(t - T_EARTH) <= 1 ? 'good' : undefined} />
          <Readout label="skleníkový efekt přidává" value={greenhouseWarming(albedo, eps)} unit="°C" />
          <Readout label="pohlceno = vyzářeno do vesmíru" value={absorbed(albedo)} unit="W/m²" digits={0} />
        </>
      }
      challenge="Vypni skleníkový efekt (ε = 1) a najdi albedo, při kterém by Země měla průměrně aspoň 0 °C."
      done={challengeMet(albedo, eps)}
    />
  )
}
