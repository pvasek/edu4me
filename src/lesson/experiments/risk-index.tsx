import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  CITIES,
  H_QUAKE,
  LEVEL_TOPS,
  LEVEL_WORD,
  R_MAX,
  R_MIN,
  challengeMet,
  collapseShare,
  level,
  matchingCity,
  risk,
  scalePos,
  type CityId,
  type Level,
} from './risk-index.model'

/** "Vyzkoušej si" for z10-6: hazard × vulnerability ÷ capacity – the same earthquake, very different risk. */

const N = 10
const GROUND = 150
// building i: x, width, height
const HOUSES: [number, number, number][] = [
  [14, 26, 34],
  [44, 22, 50],
  [70, 30, 28],
  [104, 24, 62],
  [132, 28, 40],
  [164, 22, 54],
  [190, 30, 32],
  [224, 24, 70],
  [252, 28, 44],
  [284, 22, 36],
]
// which houses are badly built first (as vulnerability grows) and which fall first
const WEAK_ORDER = [2, 6, 0, 9, 4, 8, 1, 5, 3, 7]

// risk scale
const SX0 = 20
const SX1 = 340
const SY = 214
const sx = (r: number) => SX0 + scalePos(r) * (SX1 - SX0)

const ZONE_FILL: Record<Level, string> = {
  nizke: 'color-mix(in srgb, var(--good) 35%, var(--surface))',
  stredni: 'color-mix(in srgb, var(--yellow) 45%, var(--surface))',
  vysoke: 'color-mix(in srgb, var(--accent) 45%, var(--surface))',
  extremni: 'color-mix(in srgb, var(--bad) 50%, var(--surface))',
}

const cz = (n: number, d?: number) => czNum(n, d)

function label(h: number, v: number, c: number): string {
  const r = risk(h, v, c)
  const city = matchingCity(h, v, c)
  const fallen = Math.round(collapseShare(r) * N)
  return (
    (city ? `${CITIES[city].name}, ${CITIES[city].event}: zemětřesení M ${cz(CITIES[city].magnitude, 1)}, ${CITIES[city].deaths}. ` : '') +
    `Hrozba ${h}, zranitelnost ${v}, schopnost zvládnout ${c}: riziko R = ${h} · ${v} ÷ ${c} = ${cz(r, 1)}, ${LEVEL_WORD[level(r)]}. ` +
    `Nezpevněných domů: ${v} z ${N}; na obrázku se jich zřítí ${fallen}.`
  )
}

function House({ i, weak, down }: { i: number; weak: boolean; down: boolean }) {
  const [x, w, h] = HOUSES[i]
  if (down) {
    // rubble
    return (
      <g>
        <path
          d={`M${x - 3} ${GROUND} L${x + w * 0.2} ${GROUND - h * 0.28} L${x + w * 0.45} ${GROUND - h * 0.18} L${x + w * 0.7} ${GROUND - h * 0.34} L${x + w + 3} ${GROUND}Z`}
          fill={weak ? 'color-mix(in srgb, var(--muted) 45%, var(--surface))' : 'color-mix(in srgb, var(--blue) 25%, var(--surface))'}
          stroke="var(--edge)"
          strokeWidth={1.1}
          strokeLinejoin="round"
        />
        <path d={`M${x + w * 0.3} ${GROUND - 3} l4 -5 M${x + w * 0.55} ${GROUND - 4} l-3 -6`} stroke="var(--edge)" strokeWidth={1} />
      </g>
    )
  }
  const y = GROUND - h
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={weak ? 'color-mix(in srgb, var(--muted) 30%, var(--surface))' : 'color-mix(in srgb, var(--blue) 18%, var(--surface))'}
        stroke="var(--edge)"
        strokeWidth={1.2}
      />
      {weak ? (
        // unreinforced block masonry: courses of blocks, a crack
        <g stroke="var(--edge)" strokeWidth={0.6} opacity={0.6}>
          {Array.from({ length: Math.floor(h / 8) }, (_, k) => (
            <path key={k} d={`M${x} ${y + 8 * (k + 1)} h${w}`} />
          ))}
        </g>
      ) : (
        // reinforced frame: columns, beams and a brace
        <g stroke="var(--edge)" strokeWidth={0.9}>
          <path d={`M${x + w / 2} ${y} V${GROUND}`} />
          {Array.from({ length: Math.floor(h / 16) }, (_, k) => (
            <path key={k} d={`M${x} ${y + 16 * (k + 1)} h${w}`} />
          ))}
          <path d={`M${x} ${GROUND} L${x + w / 2} ${GROUND - Math.min(h, 16)} L${x + w} ${GROUND}`} fill="none" />
        </g>
      )}
    </g>
  )
}

function Picture({ h, v, c }: { h: number; v: number; c: number }) {
  const r = risk(h, v, c)
  const weakSet = new Set(WEAK_ORDER.slice(0, v))
  // weak houses fall first, then the reinforced ones
  const fallOrder = [...WEAK_ORDER.slice(0, v), ...WEAK_ORDER.slice(v)]
  const down = new Set(fallOrder.slice(0, Math.round(collapseShare(r) * N)))
  const amb = Math.round(c / 2.5)
  const city = matchingCity(h, v, c)
  return (
    <>
      <text x={4} y={16} className="ph-lbl ph-lbl-sm">
        {city ? `${CITIES[city].name} · ${CITIES[city].event}` : 'vlastní nastavení'}
      </text>
      {city && (
        <text x={4} y={34} className="ph-unit">
          M {cz(CITIES[city].magnitude, 1)} · {CITIES[city].deaths}
        </text>
      )}
      {/* hospital and ambulances: capacity */}
      <g>
        <rect x={312} y={GROUND - 40} width={40} height={40} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.2} />
        <path d={`M332 ${GROUND - 33} v18 M323 ${GROUND - 24} h18`} stroke="var(--bad)" strokeWidth={4} />
        {Array.from({ length: amb }, (_, k) => (
          <g key={k} transform={`translate(${314 + (k % 2) * 20} ${GROUND - 58 - Math.floor(k / 2) * 14})`}>
            <rect x={0} y={0} width={16} height={9} rx={1.5} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1} />
            <path d="M5 2.5 v4 M3 4.5 h4" stroke="var(--bad)" strokeWidth={1.4} />
          </g>
        ))}
      </g>
      {HOUSES.map((_, i) => (
        <House key={i} i={i} weak={weakSet.has(i)} down={down.has(i)} />
      ))}
      {/* ground and the shaking */}
      <path d={`M0 ${GROUND} H360`} stroke="var(--edge)" strokeWidth={1.6} />
      <rect x={0} y={GROUND} width={360} height={34} fill="color-mix(in srgb, #9a7a4a 22%, var(--surface))" />
      {Array.from({ length: Math.max(1, Math.round(h / 2)) }, (_, k) => (
        <path
          key={k}
          d={`M${150 - 14 - k * 16} ${GROUND + 30} A${14 + k * 16} ${5 + k * 4.5} 0 0 1 ${150 + 14 + k * 16} ${GROUND + 30}`}
          fill="none"
          stroke="var(--bad)"
          strokeWidth={1.2}
          opacity={0.85 - k * 0.12}
        />
      ))}
      <path d={`M150 ${GROUND + 20} l2.5 5 5.5 .6 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.6Z`} fill="var(--bad)" />
      {/* risk scale (logarithmic) */}
      {LEVEL_TOPS.map(([l, top], i) => {
        const from = i === 0 ? R_MIN : LEVEL_TOPS[i - 1][1]
        const to = Math.min(R_MAX, top)
        return (
          <g key={l}>
            <rect x={sx(from)} y={SY - 8} width={sx(to) - sx(from)} height={16} fill={ZONE_FILL[l]} stroke="var(--edge)" strokeWidth={0.8} />
            <text x={(sx(from) + sx(to)) / 2} y={SY + 3.5} textAnchor="middle" className="ph-num" style={{ fontSize: 10, fill: 'var(--ink)' }}>
              {LEVEL_WORD[l]}
            </text>
          </g>
        )
      })}
      {[0.1, 1, 10, 100].map((t) => (
        <text key={t} x={sx(t)} y={SY + 22} textAnchor={t === 0.1 ? 'start' : t === 100 ? 'end' : 'middle'} className="ph-num">
          {cz(t)}
        </text>
      ))}
      {(Object.keys(CITIES) as CityId[]).map((id) => {
        const rc = risk(H_QUAKE, CITIES[id].vulnerability, CITIES[id].capacity)
        return (
          <g key={id}>
            <path d={`M${sx(rc)} ${SY + 8} v5`} stroke="var(--ink-soft)" strokeWidth={1.2} />
            <text x={sx(rc)} y={SY + 36} textAnchor="middle" className="ph-num" style={{ fontSize: 10.5 }}>
              {CITIES[id].name}
            </text>
          </g>
        )
      })}
      <path d={`M${sx(r)} ${SY - 9} l-6 -9 h12Z`} fill="var(--ink)" />
      <text
        x={Math.min(SX1 - 24, Math.max(SX0 + 24, sx(r)))}
        y={SY - 21}
        textAnchor="middle"
        className="ph-lbl ph-lbl-sm ph-halo"
        style={{ fill: 'var(--ink)' }}
      >
        {cz(r, 1)}
      </text>
    </>
  )
}

export default function RiskIndex() {
  const [h, setH] = useState(H_QUAKE)
  const [v, setV] = useState(CITIES.haiti.vulnerability)
  const [c, setC] = useState(CITIES.haiti.capacity)
  const nar = useNarrow()
  const r = risk(h, v, c)
  const city = matchingCity(h, v, c)
  const pick = (id: CityId) => {
    setH(H_QUAKE)
    setV(CITIES[id].vulnerability)
    setC(CITIES[id].capacity)
  }
  const lv = level(r)
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 256]} max={480} label={label(h, v, c)} className="xp-ri">
          <Picture h={h} v={v} c={c} />
        </Plate>
      }
      controls={
        <>
          <Choice
            label="stejné zemětřesení, jiné město"
            options={[
              { value: 'haiti', label: 'Port-au-Prince' },
              { value: 'nz', label: 'Christchurch' },
            ]}
            value={(city ?? '') as CityId}
            onChange={pick}
          />
          <Control label="hrozba *H* (síla otřesů)" value={h} min={1} max={10} onChange={setH} />
          <Control label="zranitelnost *V* (stavby, chudoba)" value={v} min={1} max={10} onChange={setV} />
          <Control label="schopnost zvládnout *C* (varování, záchrana)" value={c} min={1} max={10} onChange={setC} />
        </>
      }
      readouts={
        <>
          <Readout label="riziko *R* = *H* · *V* ÷ *C*" value={r} digits={1} />
          <Readout label="úroveň rizika" value={LEVEL_WORD[lv]} tone={lv === 'nizke' ? 'good' : lv === 'extremni' || lv === 'vysoke' ? 'bad' : undefined} />
        </>
      }
      challenge={`Ponech hrozbu ${H_QUAKE} (stejné zemětřesení) a sniž riziko Port-au-Prince na úroveň Christchurch (${czNum(risk(H_QUAKE, CITIES.nz.vulnerability, CITIES.nz.capacity), 2)} nebo méně).`}
      done={challengeMet(h, v, c)}
    />
  )
}
