import { useId, useState } from 'react'
import { Md } from '../../core/markup'
import { Plate, czNum, url, usePlate, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  CELL,
  CELL_HA,
  COLS,
  HILL,
  cellCentre,
  inRiver,
  layerOk,
  LAYERS,
  LAYER_LABEL,
  MAX_SLOPE,
  MOTORWAY,
  NOISE_BUFFER,
  RESERVE,
  RIVER,
  ROADS,
  ROWS,
  TASK,
  VILLAGE,
  challengeMet,
  countSuitable,
  suitability,
  type LayerId,
  type Settings,
} from './site-finder.model'

/** "Vyzkoušej si" for z10-8: GIS overlay of layers and buffers → where a new school can be built. */

const PX = 16 / CELL // drawing px per metre
const OX = 6
const OY = 6
const X = (m: number) => OX + m * PX
const Y = (m: number) => OY + m * PX
const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(' ')

const GOOD = 'color-mix(in srgb, var(--good) 55%, transparent)'
const BAD = 'color-mix(in srgb, var(--ink) 30%, transparent)'
/** veil over an excluded cell: darker when more layers exclude it (overlay of transparent layers) */
const veil = (k: number) => `color-mix(in srgb, var(--ink) ${Math.min(62, 16 + 14 * k)}%, transparent)`
const WATER = 'color-mix(in srgb, var(--blue) 75%, var(--surface))'
const FOREST = 'color-mix(in srgb, var(--green) 26%, var(--surface))'

function label(s: Settings, n: number): string {
  const on = LAYERS.filter((l) => s.layers[l])
  const crit: Record<LayerId, string> = {
    reka: `aspoň ${s.riverBuffer} m od řeky`,
    svah: `svah do ${MAX_SLOPE} %`,
    silnice: `nejvýš ${s.roadMax} m od silnice`,
    chranene: 'mimo chráněné území',
    hluk: `aspoň ${NOISE_BUFFER} m od dálnice`,
  }
  return (
    `Mapa vymyšleného území 1 × 0,7 km v síti buněk 50 × 50 m s řekou, vesnicí, silnicemi, dálnicí, kopcem a přírodní rezervací. ` +
    (on.length ? `Zapnuté vrstvy: ${on.map((l) => crit[l]).join(', ')}. ` : 'Žádná vrstva není zapnutá. ') +
    `Vyhovuje ${n} buněk, tedy ${czNum(n * CELL_HA, 2)} ha.`
  )
}

function Map({ s }: { s: Settings }) {
  const { id } = usePlate()
  const grid = suitability(s)
  const [hx, hy, hh, hs] = HILL
  const [ex, ey, erx, ery] = RESERVE
  // centre of the suitable area (for the school marker)
  let sx = 0
  let sy = 0
  let n = 0
  grid.forEach((row, r) =>
    row.forEach((ok, c) => {
      if (ok) {
        sx += c
        sy += r
        n++
      }
    }),
  )
  const done = challengeMet(s)
  return (
    <>
      <rect x={OX} y={OY} width={COLS * 16} height={ROWS * 16} fill="var(--surface-2)" stroke="var(--edge)" strokeWidth={1.4} />
      {/* contour lines of the hill every 10 m */}
      {[10, 20, 30, 40, 50].map((e) =>
        e < hh ? (
          <circle
            key={e}
            cx={X(hx)}
            cy={Y(hy)}
            r={hs * Math.sqrt(2 * Math.log(hh / e)) * PX}
            fill="none"
            stroke="color-mix(in srgb, #9a6a3a 70%, var(--surface))"
            strokeWidth={0.9}
          />
        ) : null,
      )}
      {/* nature reserve */}
      <ellipse cx={X(ex)} cy={Y(ey)} rx={erx * PX} ry={ery * PX} fill={FOREST} stroke="var(--green)" strokeWidth={1.4} />
      <ellipse cx={X(ex)} cy={Y(ey)} rx={erx * PX} ry={ery * PX} fill={url(id, 'd')} />
      {/* river, roads, motorway, village */}
      <path d={line(RIVER)} fill="none" stroke={WATER} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      {ROADS.map((r, i) => (
        <g key={i}>
          <path d={line(r)} fill="none" stroke="var(--edge)" strokeWidth={4} strokeLinejoin="round" />
          <path d={line(r)} fill="none" stroke="var(--surface)" strokeWidth={2} strokeLinejoin="round" />
        </g>
      ))}
      <path d={line(MOTORWAY)} fill="none" stroke="var(--edge)" strokeWidth={6} strokeLinejoin="round" />
      <path d={line(MOTORWAY)} fill="none" stroke="var(--yellow)" strokeWidth={3} strokeLinejoin="round" />
      {VILLAGE.map(([x, y], i) => (
        <rect key={i} x={X(x) - 4} y={Y(y) - 4} width={8} height={8} fill="var(--accent)" stroke="var(--edge)" strokeWidth={0.8} />
      ))}
      {/* overlay result per cell */}
      {grid.map((row, r) =>
        row.map((ok, c) => {
          const p = cellCentre(c, r)
          const k = inRiver(p) ? 1 : LAYERS.filter((l) => s.layers[l] && !layerOk(l, p, s)).length
          return (
            <rect
              key={`${r}-${c}`}
              x={OX + c * 16 + 0.5}
              y={OY + r * 16 + 0.5}
              width={15}
              height={15}
              fill={ok ? GOOD : veil(k)}
              stroke={ok ? 'var(--good)' : 'none'}
              strokeWidth={ok ? 1 : 0}
            />
          )
        }),
      )}
      {/* names */}
      <text x={X(ex)} y={Y(ey) + 4} textAnchor="middle" className="ph-unit ph-halo" style={{ fontSize: 12 }}>
        rezervace
      </text>
      <text x={X(hx)} y={Y(hy) + 4} textAnchor="middle" className="ph-unit ph-halo" style={{ fontSize: 12 }}>
        kopec
      </text>
      <text x={X(990)} y={Y(40)} textAnchor="end" className="ph-unit ph-halo" style={{ fontSize: 12 }}>
        dálnice
      </text>
      <text x={X(990)} y={Y(420)} textAnchor="end" className="ph-unit ph-halo" style={{ fontSize: 12 }}>
        řeka
      </text>
      <text x={X(440)} y={Y(450)} textAnchor="middle" className="ph-unit ph-halo" style={{ fontSize: 12 }}>
        vesnice
      </text>
      {done && n > 0 && (
        <g transform={`translate(${(OX + (sx / n) * 16 + 8).toFixed(1)} ${(OY + (sy / n) * 16 + 8).toFixed(1)})`}>
          <path d="M-10 4 V-4 L0 -11 L10 -4 V4 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.6} strokeLinejoin="round" />
          <rect x={-2.5} y={-2} width={5} height={6} fill="var(--ink)" />
          <text y={18} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo" style={{ fill: 'var(--ink)' }}>
            škola
          </text>
        </g>
      )}
      {/* scale bar and north arrow */}
      <path d={`M${OX} ${OY + ROWS * 16 + 12} h${200 * PX} M${OX} ${OY + ROWS * 16 + 8} v8 M${OX + 200 * PX} ${OY + ROWS * 16 + 8} v8`} stroke="var(--edge)" strokeWidth={1.4} />
      <text x={OX + 200 * PX + 6} y={OY + ROWS * 16 + 16} className="ph-num">
        200 m
      </text>
      <text x={OX + COLS * 16} y={OY + ROWS * 16 + 16} textAnchor="end" className="ph-num">
        buňka 50 × 50 m · S ↑
      </text>
    </>
  )
}

/** Toggle buttons for the layers (several can be on at once). */
function LayerToggles({ layers, onToggle }: { layers: Settings['layers']; onToggle: (l: LayerId) => void }) {
  const id = useId()
  return (
    <div className="xp-choice" role="group" aria-labelledby={id}>
      <span id={id} className="xp-choice-label">
        <Md text="vrstvy (zapni podmínky)" />
      </span>
      <div className="xp-choice-opts">
        {LAYERS.map((l) => (
          <button key={l} type="button" aria-pressed={layers[l]} onClick={() => onToggle(l)}>
            {LAYER_LABEL[l]}
          </button>
        ))}
      </div>
    </div>
  )
}

function LegendRow() {
  const sw = (fill: string, stroke = 'var(--edge)') => (
    <svg viewBox="0 0 28 12" width={28} height={12} aria-hidden="true">
      <rect x={6} y={0.5} width={14} height={11} fill={fill} stroke={stroke} strokeWidth={1} />
    </svg>
  )
  return (
    <ul className="ph-legend" aria-label="Legenda mapy">
      <li>
        {sw(GOOD, 'var(--good)')}
        <span>vyhovuje všem zapnutým vrstvám</span>
      </li>
      <li>
        {sw(BAD, 'none')}
        <span>vyloučeno (tmavší = víc vrstev)</span>
      </li>
    </ul>
  )
}

export default function SiteFinder() {
  const [layers, setLayers] = useState<Settings['layers']>({ reka: false, svah: false, silnice: false, chranene: false, hluk: false })
  const [riverBuffer, setRiverBuffer] = useState(100)
  const [roadMax, setRoadMax] = useState(300)
  const s: Settings = { layers, riverBuffer, roadMax }
  const n = countSuitable(suitability(s))
  const nar = useNarrow()
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 332, 254]} max={520} label={label(s, n)} className="xp-sf" footer={<LegendRow />}>
          <Map s={s} />
        </Plate>
      }
      controls={
        <>
          <LayerToggles layers={layers} onToggle={(l) => setLayers({ ...layers, [l]: !layers[l] })} />
          <Control label="odstup od řeky" unit="m" value={riverBuffer} min={0} max={300} step={50} onChange={setRiverBuffer} />
          <Control label="nejvýš od silnice" unit="m" value={roadMax} min={50} max={500} step={50} onChange={setRoadMax} />
        </>
      }
      readouts={
        <>
          <Readout label="vhodné buňky" value={n} digits={0} tone={n === 0 ? 'bad' : undefined} />
          <Readout label="vhodná plocha" value={n * CELL_HA} unit="ha" digits={2} />
        </>
      }
      challenge={`Najdi místo pro novou školu: zapni všech pět vrstev; škola musí stát aspoň ${TASK.riverBuffer} m od řeky a nejvýš ${TASK.roadMax} m od silnice (svah do ${MAX_SLOPE} %, ${NOISE_BUFFER} m od dálnice hlídají vrstvy samy).`}
      done={challengeMet(s)}
    />
  )
}
