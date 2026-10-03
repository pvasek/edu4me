import { useMemo, useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import { fixedShuffle, genotypeCounts, hardyWeinberg, isTaskQ, oneIn } from './hardy-weinberg.model'

/** "Vyzkoušej si" for b10-6: the frequency q of allele a → genotypes p², 2pq, q² in a population of 100. */

type G = 'AA' | 'Aa' | 'aa'
const GENOTYPES: { g: G; formula: string; tone: string; says: string }[] = [
  { g: 'AA', formula: 'p²', tone: 'c', says: 'zdraví (AA)' },
  { g: 'Aa', formula: '2pq', tone: 'b', says: 'přenašeči (Aa)' },
  { g: 'aa', formula: 'q²', tone: 'd', says: 'nemocní (aa)' },
]

// bars on the left, 10 × 10 people on the right (viewBox units)
const BAR_X = 22
const BAR_W = 34
const BAR_GAP = 10
const BAR_TOP = 34
const BAR_BOT = 184
const DOT_X = 186
const DOT_Y = 40
const DOT_STEP = 14.5
const DOT_R = 5.6

/** decimals a percentage needs so that small values do not show as 0 */
const pctDigits = (f: number) => (f === 0 ? 0 : f < 0.001 ? 2 : f < 0.1 ? 1 : 0)
/** percent with a Czech comma */
const pct = (f: number) => czNum(f * 100, pctDigits(f))
/** "1 z N" readable: thousands with a space, "nikdo" for none */
function oneInText(f: number): string {
  const n = oneIn(f)
  if (!Number.isFinite(n)) return 'nikdo'
  return `1 z ${Math.round(n).toLocaleString('cs-CZ')}`
}

function hwLabel(q: number): string {
  const f = hardyWeinberg(q)
  const c = genotypeCounts(q)
  return (
    `Sloupcový graf a populace 100 lidí. Frekvence alely a je q = ${czNum(q, 2)}, alely A p = ${czNum(f.p, 2)}. ` +
    `Zdravých homozygotů AA je p² = ${pct(f.AA)} %, přenašečů Aa 2pq = ${pct(f.Aa)} % a nemocných aa q² = ${pct(f.aa)} %; ` +
    `ve stovce lidí to je ${c.AA} AA, ${c.Aa} Aa a ${c.aa} aa.`
  )
}

/** One person: AA open ring, Aa half filled, aa filled (shape as well as colour). */
function Person({ x, y, g }: { x: number; y: number; g: G }) {
  const t = GENOTYPES.find((k) => k.g === g)!.tone
  return (
    <g className={`ph-tone-${t}`}>
      <circle cx={x} cy={y} r={DOT_R} style={{ fill: g === 'aa' ? 'var(--t)' : 'var(--surface)', stroke: 'var(--t)', strokeWidth: 1.6 }} />
      {g === 'Aa' && <path d={`M${x} ${y - DOT_R} A${DOT_R} ${DOT_R} 0 0 0 ${x} ${y + DOT_R} Z`} style={{ fill: 'var(--t)' }} />}
    </g>
  )
}

function Picture({ q, order }: { q: number; order: number[] }) {
  const f = hardyWeinberg(q)
  const c = genotypeCounts(q)
  const kinds: G[] = []
  for (let i = 0; i < 100; i++) kinds.push(i < c.AA ? 'AA' : i < c.AA + c.Aa ? 'Aa' : 'aa')
  const h = BAR_BOT - BAR_TOP
  return (
    <>
      <text x={BAR_X - 4} y={BAR_TOP - 18} className="ph-lbl ph-lbl-sm">
        podíl genotypů
      </text>
      {[0, 0.5, 1].map((r) => (
        <line key={r} x1={BAR_X - 6} x2={BAR_X + 3 * BAR_W + 2 * BAR_GAP + 6} y1={BAR_BOT - r * h} y2={BAR_BOT - r * h} className="ph-grid" />
      ))}
      {GENOTYPES.map(({ g, formula, tone }, i) => {
        const x = BAR_X + i * (BAR_W + BAR_GAP)
        const bh = f[g] * h
        return (
          <g key={g} className={`ph-tone-${tone}`}>
            <rect x={x} y={BAR_BOT - bh} width={BAR_W} height={bh} className="ph-t-f" style={{ fillOpacity: 0.75 }} />
            <rect x={x} y={BAR_BOT - bh} width={BAR_W} height={bh} className="ph-o" style={{ stroke: 'var(--t)' }} />
            <text x={x + BAR_W / 2} y={BAR_BOT - bh - 5} textAnchor="middle" className="ph-num" style={{ fill: 'var(--ink)' }}>
              {pct(f[g])} %
            </text>
            <text x={x + BAR_W / 2} y={BAR_BOT + 18} textAnchor="middle" className="ph-lbl">
              {g}
            </text>
            <text x={x + BAR_W / 2} y={BAR_BOT + 35} textAnchor="middle" className="ph-unit">
              {formula}
            </text>
          </g>
        )
      })}
      <path d={`M${BAR_X - 6} ${BAR_BOT} H${BAR_X + 3 * BAR_W + 2 * BAR_GAP + 6}`} className="ph-o" />
      <text x={DOT_X - DOT_R} y={BAR_TOP - 18} className="ph-lbl ph-lbl-sm">
        100 lidí
      </text>
      {order.map((slot, i) => (
        <Person key={slot} x={DOT_X + (slot % 10) * DOT_STEP} y={DOT_Y + Math.floor(slot / 10) * DOT_STEP} g={kinds[i]} />
      ))}
      <text x={DOT_X + 4.5 * DOT_STEP} y={DOT_Y + 10 * DOT_STEP + 10} textAnchor="middle" className="ph-unit">
        {c.AA} AA · {c.Aa} Aa · {c.aa} aa
      </text>
    </>
  )
}

function Key() {
  return (
    <ul className="ph-legend" aria-label="Legenda">
      {GENOTYPES.map(({ g, says }) => (
        <li key={g}>
          <svg viewBox="0 0 14 14" width={14} height={14} aria-hidden="true" style={{ width: 14, height: 14, flex: 'none' }}>
            <Person x={7} y={7} g={g} />
          </svg>
          {says}
        </li>
      ))}
    </ul>
  )
}

export default function HardyWeinberg() {
  const [q, setQ] = useState(0.3)
  const nar = useNarrow()
  const order = useMemo(() => fixedShuffle(100), [])
  const f = hardyWeinberg(q)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[8, 0, 334, 232]} max={460} label={hwLabel(q)} className="xp-hw" footer={<Key />}>
          <Picture q={q} order={order} />
        </Plate>
      }
      controls={<Control label="frekvence alely *a* (q)" value={q} min={0} max={1} step={0.01} digits={2} onChange={setQ} />}
      readouts={
        <>
          <Readout label="nemocní aa = q²" value={f.aa * 100} digits={pctDigits(f.aa)} unit="%" />
          <Readout label="nemocný je" value={oneInText(f.aa)} />
          <Readout label="přenašeči Aa = 2pq" value={f.Aa * 100} digits={pctDigits(f.Aa)} unit="%" />
          <Readout label="přenašeč je" value={oneInText(f.Aa)} />
        </>
      }
      challenge={'Kolik je přenašečů, když je nemocný 1 člověk z 2\u00a0500? Nastav q tak, aby q² = 1/2\u00a0500.'}
      done={isTaskQ(q)}
    />
  )
}
