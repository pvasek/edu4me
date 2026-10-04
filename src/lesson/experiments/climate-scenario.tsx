import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  END_YEAR,
  SCENARIOS,
  START_YEAR,
  challengeMet,
  cumulative,
  emissionsAt,
  nearestScenario,
  scenarioAt,
  zeroYear,
  type Growth,
  type Pathway,
  type Scenario,
} from './climate-scenario.model'

/** "Vyzkoušej si" for z10-4: when emissions peak and how fast they fall → the nearest IPCC scenario and its warming. */

// emissions graph
const GX0 = 40
const GX1 = 286
const GY0 = 168
const GY1 = 24
const E_MIN = -20
const E_MAX = 140
const gx = (y: number) => GX0 + ((y - 2020) / 80) * (GX1 - GX0)
const gy = (e: number) => GY0 - ((e - E_MIN) / (E_MAX - E_MIN)) * (GY0 - GY1)

// warming bars
const WX0 = 96
const WX1 = 350
const WY = 222
const ROW = 17
const W_MAX = 6
const wx = (t: number) => WX0 + (t / W_MAX) * (WX1 - WX0)

const cz = (n: number, d?: number) => czNum(n, d)
/** whole number with a space between thousands (2 220) */
const thou = (n: number) => Math.round(n).toLocaleString('cs-CZ')
const range = (s: Scenario) => `${cz(s.best, 1)} °C (${cz(s.low, 1)}–${cz(s.high, 1)} °C)`

function label(p: Pathway): string {
  const s = nearestScenario(p)
  const z = zeroYear(p)
  return (
    `Graf ročních emisí CO₂ v letech 2020–2100 v pěti scénářích IPCC a ve tvé cestě: emise rostou ${p.growth === 'pomaly' ? 'pomalu' : 'rychle'} ` +
    `${p.peak >= END_YEAR ? 'po celé století' : `do roku ${p.peak}, pak klesají o ${cz(p.fall * 100, 1)} % vrcholu ročně`}` +
    `${z ? ` a v roce ${Math.round(z)} dosáhnou nuly` : ', nuly do roku 2100 nedosáhnou'}. ` +
    `Od roku 2025 do roku 2100 lidstvo vypustí ${thou(Math.round(cumulative(p) / 10) * 10)} miliard tun CO₂. ` +
    `Nejblíž je scénář ${s.name} (${s.words}): oteplení v letech 2081–2100 asi o ${range(s)} proti období 1850–1900.`
  )
}

/** labels at the right end of the scenario lines, pushed apart so they don't overlap */
function endLabels(): { s: Scenario; y: number }[] {
  const items = SCENARIOS.map((s) => ({ s, y: gy(scenarioAt(s, 2100)) + 4 }))
  items.sort((a, b) => b.y - a.y)
  for (let i = 1; i < items.length; i++) if (items[i - 1].y - items[i].y < 12) items[i].y = items[i - 1].y - 12
  return items
}

function Picture({ p }: { p: Pathway }) {
  const near = nearestScenario(p)
  const path: string[] = []
  for (let y = 2020; y <= END_YEAR; y += 1) path.push(`${path.length ? 'L' : 'M'}${gx(y).toFixed(1)} ${gy(emissionsAt(p, y)).toFixed(1)}`)
  const line = (s: Scenario) =>
    [2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100].map((y, i) => `${i ? 'L' : 'M'}${gx(y).toFixed(1)} ${gy(scenarioAt(s, y)).toFixed(1)}`).join(' ')
  return (
    <>
      {/* emissions graph */}
      {[0, 40, 80, 120].map((e) => (
        <g key={e}>
          <line x1={GX0} x2={GX1} y1={gy(e)} y2={gy(e)} className="ph-grid" style={e === 0 ? { stroke: 'var(--edge)', strokeWidth: 1 } : undefined} />
          <text x={GX0 - 5} y={gy(e) + 4} textAnchor="end" className="ph-num">
            {cz(e)}
          </text>
        </g>
      ))}
      {[2020, 2040, 2060, 2080, 2100].map((y) => (
        <text key={y} x={gx(y)} y={GY0 + 14} textAnchor="middle" className="ph-num">
          {y}
        </text>
      ))}
      <path d={`M${GX0} ${GY1 - 8} V${GY0} H${GX1 + 4}`} className="ph-o" />
      <text x={GX0 + 4} y={GY1 - 10} className="ph-unit">
        emise CO₂ (miliardy tun za rok)
      </text>
      {SCENARIOS.map((s) => (
        <path
          key={s.id}
          d={line(s)}
          fill="none"
          stroke={s.id === near.id ? 'var(--ph-b)' : 'var(--muted)'}
          strokeWidth={s.id === near.id ? 2.2 : 1.1}
          strokeDasharray={s.id === near.id ? undefined : '4 3'}
        />
      ))}
      {endLabels().map(({ s, y }) => (
        <text
          key={s.id}
          x={GX1 + 6}
          y={y}
          className="ph-num"
          style={s.id === near.id ? { fill: 'var(--ph-b)', fontWeight: 700 } : undefined}
        >
          {s.name}
        </text>
      ))}
      <path d={path.join(' ')} className="ph-series" style={{ ['--t' as string]: 'var(--ph-a)', strokeWidth: 3.2 }} />
      {p.peak < END_YEAR && <circle cx={gx(p.peak)} cy={gy(emissionsAt(p, p.peak))} r={4.5} className="ph-mark-dot" />}
      <circle cx={gx(START_YEAR)} cy={gy(emissionsAt(p, START_YEAR))} r={3.5} className="ph-pt" style={{ ['--t' as string]: 'var(--ph-a)' }} />

      {/* warming in 2081–2100 */}
      <text x={4} y={WY - 14} className="ph-unit">
        oteplení 2081–2100 proti 1850–1900 (IPCC AR6)
      </text>
      {[0, 1, 2, 3, 4, 5, 6].map((t) => (
        <g key={t}>
          <line x1={wx(t)} x2={wx(t)} y1={WY - 6} y2={WY + ROW * 5 - 4} className="ph-grid" />
          <text x={wx(t)} y={WY + ROW * 5 + 8} textAnchor="middle" className="ph-num">
            {t === W_MAX ? `${t} °C` : t}
          </text>
        </g>
      ))}
      {[1.5, 2].map((t) => (
        <line key={t} x1={wx(t)} x2={wx(t)} y1={WY - 6} y2={WY + ROW * 5 - 4} stroke="var(--bad)" strokeWidth={1} strokeDasharray="3 3" />
      ))}
      {SCENARIOS.map((s, i) => {
        const y = WY + i * ROW + 3
        const on = s.id === near.id
        return (
          <g key={s.id}>
            <text x={WX0 - 6} y={y + 4} textAnchor="end" className="ph-num" style={on ? { fill: 'var(--ink)', fontWeight: 700 } : undefined}>
              {s.name}
            </text>
            <rect
              x={wx(s.low)}
              y={y - 5}
              width={wx(s.high) - wx(s.low)}
              height={10}
              rx={5}
              fill={on ? 'color-mix(in srgb, var(--ph-b) 45%, var(--surface))' : 'color-mix(in srgb, var(--muted) 22%, var(--surface))'}
              stroke={on ? 'var(--ph-b)' : 'var(--line)'}
              strokeWidth={1}
            />
            <circle cx={wx(s.best)} cy={y} r={on ? 4.5 : 3} fill={on ? 'var(--ink)' : 'var(--muted)'} stroke="var(--surface)" strokeWidth={1} />
          </g>
        )
      })}
    </>
  )
}

export default function ClimateScenario() {
  const [peak, setPeak] = useState(2030)
  const [fall, setFall] = useState(1)
  const [growth, setGrowth] = useState<Growth>('pomaly')
  const p: Pathway = { peak, fall: fall / 100, growth }
  const s = nearestScenario(p)
  const z = zeroYear(p)
  const nar = useNarrow()
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[0, 0, 360, 316]}
          max={480}
          label={label(p)}
          className="xp-cs"
          footer={
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.35, color: 'var(--muted)', textAlign: 'center' }}>
              Tlustá čára je tvoje cesta, čárkované jsou scénáře IPCC, červeně cíle 1,5 a 2 °C. Zjednodušení: scénář je vybrán
              podle součtu emisí CO₂ 2025–2100.
            </p>
          }
        >
          <Picture p={p} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="do vrcholu emise rostou"
            options={[
              { value: 'pomaly', label: 'pomalu (1 % ročně)' },
              { value: 'rychly', label: 'rychle (2 % ročně)' },
            ]}
            value={growth}
            onChange={setGrowth}
          />
          <Control
            label="vrchol emisí v roce"
            value={peak}
            min={START_YEAR}
            max={END_YEAR}
            step={5}
            format={(v) => (v >= END_YEAR ? 'až 2100' : String(v))}
            onChange={setPeak}
          />
          <Control
            label="pokles po vrcholu (ročně)"
            value={fall}
            min={0}
            max={6}
            step={0.5}
            format={(v) => `${czNum(v, 1)} % vrcholu`}
            onChange={setFall}
          />
        </>
      }
      readouts={
        <>
          <Readout label="nejbližší scénář" value={s.name} tone={s.best < 2 ? 'good' : s.best > 3 ? 'bad' : undefined} />
          <Readout label={`oteplení 2081–2100 (${cz(s.low, 1)}–${cz(s.high, 1)} °C)`} value={s.best} unit="°C" />
          <Readout label="CO₂ 2025–2100" value={thou(Math.round(cumulative(p) / 10) * 10)} unit="mld. t" />
          <Readout label="nulové emise" value={z ? `v roce ${Math.round(z)}` : 'ne do roku 2100'} />
        </>
      }
      challenge="Nastav vrchol a pokles emisí tak, aby nejlepší odhad oteplení zůstal pod 2 °C."
      done={challengeMet(p)}
    />
  )
}
