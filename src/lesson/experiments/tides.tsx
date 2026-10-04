import { useState } from 'react'
import { Plate, czNum, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  LUNAR_DAY,
  MONTH,
  amplitude,
  bulgeAngle,
  challengeMet,
  harbour,
  height,
  moonAngle,
  phase,
  tideKind,
  type Phase,
  type TideKind,
} from './tides.model'

/** "Vyzkoušej si" for z2-6: the Moon's position (and the Sun) → two tidal bulges, spring and neap tides. */

const RAD = Math.PI / 180
const CX = 206
const CY = 112
const RE = 30
const ORBIT = 92
const NIGHT = 'color-mix(in srgb, #0b1224 42%, transparent)'
const WATER = 'color-mix(in srgb, var(--blue) 42%, var(--surface))'
const at = (a: number, r: number): [number, number] => [CX + r * Math.cos(a * RAD), CY - r * Math.sin(a * RAD)]
const xy = ([x, y]: [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`

const PHASE: Record<Phase, string> = {
  nov: 'nov',
  dorusta: 'dorůstá',
  'prvni-ctvrt': 'první čtvrť',
  uplnek: 'úplněk',
  ubyva: 'couvá',
  'posledni-ctvrt': 'poslední čtvrť',
}
const KIND: Record<TideKind, string> = {
  skocny: 'skočný příliv',
  hluchy: 'hluchý příliv',
  mezi: 'běžný příliv',
  'jen-mesic': '–',
}

/** "1 den", "2 dny", "5 dní", "7,5 dne" */
export function dayWord(d: number): string {
  if (!Number.isInteger(d)) return `${czNum(d)} dne`
  return `${d} ${d === 1 ? 'den' : d >= 2 && d <= 4 ? 'dny' : 'dní'}`
}

/** a half-lit disc: the side facing the Sun (left) light, the other side in shadow */
function Body({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const { id } = usePlate()
  const half = `M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r}Z`
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} />
      <path d={half} fill={NIGHT} />
      <path d={half} fill={url(id, 'dd')} />
      <circle cx={x} cy={y} r={r} className="ph-o" />
    </g>
  )
}

function Orbit({ days, sun }: { days: number; sun: boolean }) {
  const th = moonAngle(days)
  const psi = bulgeAngle(days, sun)
  const pts: string[] = []
  for (let a = 0; a < 360; a += 3) pts.push(xy(at(a, RE + 10 + 7.5 * height(a, days, sun))))
  const moon = at(th, ORBIT)
  const lbl = (a: number, r: number, text: string) => {
    const [x, y] = at(a, r)
    return (
      <text key={text + a} x={x} y={y + 5} textAnchor="middle" className="ph-unit ph-halo" style={{ fill: 'var(--ink)' }}>
        {text}
      </text>
    )
  }
  const tip = RE + 10 + 7.5 * amplitude(days, sun)
  return (
    <g>
      {/* the Sun far to the left */}
      <circle cx={-44} cy={CY} r={58} fill="var(--yellow)" stroke="var(--edge)" strokeWidth={1.2} />
      {[-30, 0, 30].map((dy) => (
        <path key={dy} d={`M24 ${CY + dy} H46`} stroke="var(--yellow)" strokeWidth={2.4} strokeLinecap="round" />
      ))}
      <text x={4} y={CY + 76} className="ph-lbl ph-lbl-sm">
        Slunce
      </text>
      {/* orbit, axes */}
      <circle cx={CX} cy={CY} r={ORBIT} className="ph-o ph-thin ph-dash" style={{ stroke: 'var(--muted)' }} />
      {sun && <path d={`M${xy(at(180, ORBIT + 12))} L${xy(at(0, ORBIT + 12))}`} className="ph-guide" style={{ stroke: 'var(--yellow)' }} />}
      <path d={`M${xy(at(th, ORBIT))} L${xy(at(th + 180, ORBIT))}`} className="ph-guide" />
      {/* ocean with the two bulges, then the solid Earth */}
      <path d={`M${pts.join(' L')}Z`} fill={WATER} stroke="var(--blue)" strokeWidth={1.4} strokeLinejoin="round" />
      <Body x={CX} y={CY} r={RE} fill="color-mix(in srgb, var(--green) 30%, var(--surface))" />
      <text x={CX} y={CY + 5} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo" style={{ fill: 'var(--ink)' }}>
        Země
      </text>
      {lbl(psi + 32, tip + 12, 'příliv')}
      {lbl(psi + 212, tip + 12, 'příliv')}
      {lbl(psi + 90, RE + 22, 'odliv')}
      <Body x={moon[0]} y={moon[1]} r={11} fill="color-mix(in srgb, var(--muted) 30%, var(--surface))" />
      <text
        x={moon[0] + (moon[0] >= CX - 1 ? 16 : -16)}
        y={moon[1] + 5}
        textAnchor={moon[0] >= CX - 1 ? 'start' : 'end'}
        className="ph-lbl ph-lbl-sm ph-halo"
      >
        Měsíc
      </text>
      <text x={356} y={14} textAnchor="end" className="ph-num">
        není v měřítku
      </text>
    </g>
  )
}

// the harbour: water level during one lunar day
const HX0 = 40
const HX1 = 340
const HY = 278
const HS = 14
const hx = (t: number) => HX0 + (t / LUNAR_DAY) * (HX1 - HX0)

function Harbour({ days, sun }: { days: number; sun: boolean }) {
  const curve = (on: boolean) => {
    const pts: string[] = []
    for (let t = 0; t <= LUNAR_DAY + 1e-6; t += LUNAR_DAY / 120) pts.push(`${hx(t).toFixed(1)} ${(HY - HS * harbour(t, days, on)).toFixed(1)}`)
    return `M${pts.join(' L')}`
  }
  const a = amplitude(days, sun)
  return (
    <g>
      <text x={HX0} y={HY - 46} className="ph-unit">
        hladina v přístavu
      </text>
      {sun && (
        <text x={HX1} y={HY - 46} textAnchor="end" className="ph-num">
          - - jen Měsíc
        </text>
      )}
      <path d={`M${HX0} ${HY} H${HX1}`} className="ph-o ph-thin" />
      <path d={`M${HX0} ${HY - 26} V${HY + 26}`} className="ph-o ph-thin" />
      {sun && <path d={curve(false)} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="4 4" />}
      <path d={curve(sun)} fill="none" stroke="var(--blue)" strokeWidth={2.4} strokeLinejoin="round" />
      <text x={hx(LUNAR_DAY / 2)} y={HY - HS * a - 6} textAnchor="middle" className="ph-unit ph-halo">
        příliv
      </text>
      <text x={hx(LUNAR_DAY / 4)} y={HY + HS * a + 14} textAnchor="middle" className="ph-unit ph-halo">
        odliv
      </text>
      {[0, 6, 12, 18, 24].map((t) => (
        <text key={t} x={hx(t)} y={HY + 50} textAnchor="middle" className="ph-num">
          {t} h
        </text>
      ))}
    </g>
  )
}

function tideLabel(days: number, sun: boolean): string {
  const a = Math.round(amplitude(days, sun) * 100)
  return (
    `Pohled shora na Zemi, Měsíc a Slunce, ${dayWord(days)} po novu (fáze Měsíce: ${PHASE[phase(days)]}). ` +
    `Oceán je vytažený do dvou přílivových vln, jedna míří k Měsíci, druhá na opačnou stranu; mezi nimi je odliv. ` +
    (sun
      ? `Se Sluncem je příliv ${a} % přílivu od samotného Měsíce, je to ${KIND[tideKind(days, sun)]}. `
      : 'Počítá se jen působení Měsíce. ') +
    'Každý přístav projde oběma vlnami za 24 h 50 min, má tedy dva přílivy a dva odlivy.'
  )
}

export default function Tides() {
  const [days, setDays] = useState(3)
  const [mode, setMode] = useState<'mesic' | 'oba'>('mesic')
  const sun = mode === 'oba'
  const nar = useNarrow()
  const kind = tideKind(days, sun)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 4, 360, 330]} max={480} label={tideLabel(days, sun)} className="xp-ti">
          <Orbit days={days} sun={sun} />
          <Harbour days={days} sun={sun} />
        </Plate>
      }
      controls={
        <>
          <Control label="čas od novu" value={days} min={0} max={Math.floor(MONTH * 2) / 2} step={0.5} format={dayWord} onChange={setDays} />
          <Choice
            label="slapy působí"
            value={mode}
            options={[
              { value: 'mesic', label: 'jen Měsíc' },
              { value: 'oba', label: 'Měsíc i Slunce' },
            ]}
            onChange={setMode}
          />
        </>
      }
      readouts={
        <>
          <Readout label="fáze Měsíce" value={PHASE[phase(days)]} />
          <Readout label="výška přílivu (jen Měsíc = 100 %)" value={Math.round(amplitude(days, sun) * 100)} unit="%" digits={0} />
          <Readout label="druh přílivu" value={KIND[kind]} />
        </>
      }
      challenge="Zapni i Slunce a najdi den, kdy je příliv nejslabší (hluchý příliv)."
      done={challengeMet(days, sun)}
    />
  )
}
