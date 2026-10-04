import { useState } from 'react'
import { Plate, czNum, url, usePlate, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  CO2,
  CZ_2024,
  DISPATCHABLE,
  LABEL,
  SOURCES,
  TASK,
  challengeMet,
  dispatchableShare,
  importShare,
  intensity,
  isPreset,
  roundedShares,
  setShare,
  type Mix,
  type Source,
} from './energy-mix.model'

/** "Vyzkoušej si" for z12-5: the electricity mix → CO₂ per kWh, imported fuel and dispatchable share. */

const COLOR: Record<Source, string> = {
  uhli: 'color-mix(in srgb, var(--ink) 62%, var(--surface))',
  plyn: 'var(--accent)',
  jadro: 'var(--violet)',
  voda: 'var(--blue)',
  biomasa: 'var(--green)',
  vitr: 'var(--teal)',
  slunce: 'var(--yellow)',
}

const BX0 = 10
const BX1 = 350
const bw = (share: number) => (share / 100) * (BX1 - BX0)

const cz = (n: number, d?: number) => czNum(n, d)

function label(m: Mix): string {
  const r = roundedShares(m)
  return (
    `Výroba elektřiny: ${SOURCES.filter((s) => r[s] > 0)
      .map((s) => `${LABEL[s]} ${r[s]} %`)
      .join(', ')}. ` +
    `Emise v celém životním cyklu ${cz(Math.round(intensity(m)))} g CO₂ na kWh, ` +
    `z dováženého paliva (plyn a uran) ${cz(Math.round(importShare(m)))} %, ` +
    `řiditelné zdroje ${cz(Math.round(dispatchableShare(m)))} %, na počasí závisí ${cz(Math.round(100 - dispatchableShare(m)))} %.`
  )
}

/** A horizontal meter with a title, a filled part (several segments) and a value. */
function Meter({
  y,
  title,
  value,
  max,
  segs,
  marks = [],
  ticks,
}: {
  y: number
  title: string
  value: string
  max: number
  segs: { v: number; fill: string }[]
  marks?: { v: number; text: string }[]
  ticks: number[]
}) {
  const x = (v: number) => BX0 + (Math.min(max, v) / max) * (BX1 - BX0)
  let acc = 0
  return (
    <g>
      <text x={BX0} y={y - 8} className="ph-unit">
        {title}
      </text>
      <text x={BX1} y={y - 8} textAnchor="end" className="ph-lbl ph-lbl-sm" style={{ fill: 'var(--ink)' }}>
        {value}
      </text>
      <rect x={BX0} y={y} width={BX1 - BX0} height={12} rx={3} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1} />
      {segs.map((s, i) => {
        const x0 = x(acc)
        acc += s.v
        return s.v > 0 ? <rect key={i} x={x0} y={y} width={Math.max(0, x(acc) - x0)} height={12} fill={s.fill} /> : null
      })}
      <rect x={BX0} y={y} width={BX1 - BX0} height={12} rx={3} fill="none" stroke="var(--edge)" strokeWidth={1} />
      {ticks.map((t) => (
        <text key={t} x={x(t)} y={y + 24} textAnchor={t === 0 ? 'start' : t === max ? 'end' : 'middle'} className="ph-num">
          {cz(t)}
        </text>
      ))}
      {marks.map((mk) => (
        <g key={mk.text}>
          <path d={`M${x(mk.v)} ${y - 3} v18`} stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="2 2" />
        </g>
      ))}
    </g>
  )
}

function Picture({ m }: { m: Mix }) {
  const { id } = usePlate()
  const r = roundedShares(m)
  const ci = intensity(m)
  const disp = dispatchableShare(m)
  let acc = 0
  return (
    <>
      {/* the mix as one bar of 100 % */}
      <text x={BX0} y={14} className="ph-unit">
        výroba elektřiny (100 %)
      </text>
      {SOURCES.map((s) => {
        const x0 = BX0 + bw(acc)
        acc += m[s]
        const w = bw(m[s])
        return (
          <g key={s}>
            {w > 0 && <rect x={x0} y={22} width={w} height={30} fill={COLOR[s]} stroke="var(--edge)" strokeWidth={0.8} />}
            {!DISPATCHABLE[s] && w > 0 && <rect x={x0} y={22} width={w} height={30} fill={url(id, 'd')} />}
            {w >= 30 && (
              <text x={x0 + w / 2} y={42} textAnchor="middle" className="ph-num ph-halo" style={{ fill: 'var(--ink)', fontWeight: 700 }}>
                {r[s]} %
              </text>
            )}
          </g>
        )
      })}
      {/* legend chips */}
      {SOURCES.map((s, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        return (
          <g key={s} transform={`translate(${BX0 + col * 86} ${66 + row * 17})`}>
            <rect x={0} y={-9} width={11} height={11} fill={COLOR[s]} stroke="var(--edge)" strokeWidth={0.7} />
            {!DISPATCHABLE[s] && <rect x={0} y={-9} width={11} height={11} fill={url(id, 'd')} />}
            <text x={15} y={0.5} className="ph-unit" style={{ fontSize: 12.5 }}>
              {LABEL[s]}
            </text>
          </g>
        )
      })}
      <Meter
        y={124}
        title="emise CO₂ na 1 kWh"
        value={`${cz(Math.round(ci))} g`}
        max={850}
        ticks={[0, 200, 400, 600, 850]}
        segs={SOURCES.map((s) => ({ v: (m[s] / 100) * CO2[s], fill: COLOR[s] }))}
        marks={[{ v: intensity(CZ_2024), text: 'Česko 2024' }]}
      />
      <Meter
        y={176}
        title="palivo z dovozu"
        value={`${cz(Math.round(importShare(m)))} %`}
        max={100}
        ticks={[0, 25, 50, 75, 100]}
        segs={[
          { v: m.plyn, fill: COLOR.plyn },
          { v: m.jadro, fill: COLOR.jadro },
        ]}
      />
      <Meter
        y={228}
        title="řiditelné zdroje (zbytek podle počasí)"
        value={`${cz(Math.round(disp))} %`}
        max={100}
        ticks={[0, 25, 50, 75, 100]}
        segs={SOURCES.filter((s) => DISPATCHABLE[s]).map((s) => ({ v: m[s], fill: COLOR[s] }))}
      />
    </>
  )
}

export default function EnergyMix() {
  const [m, setM] = useState<Mix>(CZ_2024)
  const nar = useNarrow()
  const r = roundedShares(m)
  return (
    <Experiment
      picture={
        <Plate
          narrow={nar}
          vb={[0, 0, 360, 262]}
          max={480}
          label={label(m)}
          className="xp-em"
          footer={
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.35, color: 'var(--muted)', textAlign: 'center' }}>
              Šrafované zdroje závisí na počasí. Čárkovaná značka: Česko 2024. Emise za celý životní cyklus elektrárny (IPCC 2014).
            </p>
          }
        >
          <Picture m={m} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="skutečný mix (ERÚ, ČEPS)"
            options={[{ value: 'cz', label: 'Česko 2024' }]}
            value={(isPreset(m) ? 'cz' : '') as 'cz'}
            onChange={() => setM(CZ_2024)}
          />
          {SOURCES.map((s) => (
            <Control
              key={s}
              label={LABEL[s]}
              value={Math.round(m[s])}
              min={0}
              max={100}
              step={1}
              format={() => `${r[s]} %`}
              onChange={(v) => setM(setShare(m, s, v))}
            />
          ))}
        </>
      }
      readouts={
        <>
          <Readout
            label="emise"
            value={Math.round(intensity(m))}
            unit="g/kWh"
            digits={0}
            tone={intensity(m) < TASK.maxIntensity ? 'good' : intensity(m) > 400 ? 'bad' : undefined}
          />
          <Readout
            label="palivo z dovozu"
            value={Math.round(importShare(m))}
            unit="%"
            digits={0}
            tone={importShare(m) > TASK.maxImport ? 'bad' : undefined}
          />
          <Readout
            label="řiditelné zdroje"
            value={Math.round(dispatchableShare(m))}
            unit="%"
            digits={0}
            tone={dispatchableShare(m) < TASK.minDispatchable ? 'bad' : undefined}
          />
        </>
      }
      challenge={`Nahraď uhlí tak, aby emise klesly pod ${TASK.maxIntensity} g/kWh, aspoň ${TASK.minDispatchable} % elektřiny dál dávaly řiditelné zdroje a z dováženého paliva bylo nejvýš ${TASK.maxImport} %.`}
      done={challengeMet(m)}
    />
  )
}
