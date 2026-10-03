import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { Plate, url, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import {
  SAMPLES,
  STEPS,
  cellsNear,
  scaleBar,
  seesNucleus,
  specimenOutline,
  visible,
  type Cell,
  type SampleId,
  type Step,
  type Structure,
} from './microscope-zoom.model'

/** "Vyzkoušej si" for b1-2: zoom from a hand lens to 400× into onion skin or cheek cells. */

// the round field of view (viewBox units)
const CX = 128
const CY = 126
const R = 110
const LX = 258 // labels column

const TINT: Record<SampleId, { bg: string; cell: string; edge: string; nuc: string; cyto: string }> = {
  // iodine stains onion skin yellow-brown
  cibule: {
    bg: 'color-mix(in srgb, var(--yellow) 16%, var(--surface))',
    cell: 'color-mix(in srgb, var(--yellow) 30%, var(--surface))',
    edge: 'color-mix(in srgb, var(--accent) 55%, var(--ink))',
    nuc: 'color-mix(in srgb, var(--accent) 75%, var(--ink))',
    cyto: 'color-mix(in srgb, var(--accent) 22%, var(--surface))',
  },
  // methylene blue stains cheek cells blue
  lice: {
    bg: 'color-mix(in srgb, var(--blue) 10%, var(--surface))',
    cell: 'color-mix(in srgb, var(--blue) 18%, var(--surface))',
    edge: 'color-mix(in srgb, var(--blue) 70%, var(--ink))',
    nuc: 'color-mix(in srgb, var(--blue) 85%, var(--ink))',
    cyto: 'color-mix(in srgb, var(--blue) 28%, var(--surface))',
  },
}

const LABEL: Record<Structure, string> = {
  vzorek: '',
  bunky: 'buňka',
  stena: 'buněčná stěna',
  membrana: 'membrána',
  jadro: 'jádro',
  jaderko: 'jadérko',
  cytoplazma: 'cytoplazma',
}
const SPECIMEN: Record<SampleId, string> = { cibule: 'blanka pokožky', lice: 'stěr sliznice' }

const magText = (st: Step) => (st.objective ? `${st.ocular} × ${st.objective} = ${st.mag}×` : `lupa ${st.mag}×`)
const umText = (v: number) => `${v.toLocaleString('cs-CZ')} µm`

const pathOf = (pts: [number, number][], s: number) =>
  'M' + pts.map(([x, y]) => `${(CX + x * s).toFixed(1)} ${(CY + y * s).toFixed(1)}`).join('L') + 'Z'

function seenList(sample: SampleId, mag: number): string {
  const v = visible(sample, mag)
  if (v.length === 1) return `jen ${SPECIMEN[sample]}, jednotlivé buňky ještě nerozlišíš`
  const names = v.filter((x) => x !== 'vzorek').map((x) => (x === 'bunky' ? 'jednotlivé buňky' : LABEL[x]))
  return names.join(', ')
}

function microLabel(sample: SampleId, step: Step): string {
  return (
    `Pohled do ${step.objective ? 'mikroskopu' : 'lupy'}: ${SAMPLES[sample].name}, zvětšení ${step.mag}×, ` +
    `zorné pole má průměr asi ${umText(step.field)}. Je vidět: ${seenList(sample, step.mag)}.`
  )
}

/** The cell nearest to the field centre (labels point at it). */
function focusCell(cells: Cell[]): Cell | undefined {
  let best: Cell | undefined
  let bd = Infinity
  for (const c of cells) {
    const d = c.nx * c.nx + c.ny * c.ny
    if (d < bd) {
      bd = d
      best = c
    }
  }
  return best
}

interface Target {
  key: Structure
  x: number
  y: number
}

function targets(sample: SampleId, step: Step, cells: Cell[], s: number, nr: number): Target[] {
  const v = visible(sample, step.mag)
  if (v.length === 1) return [{ key: 'vzorek', x: CX - R * 0.25, y: CY + R * 0.15 }]
  const f = focusCell(cells)
  if (!f) return []
  const P = (x: number, y: number) => ({ x: CX + x * s, y: CY + y * s })
  const out: Target[] = []
  const [a, b] = [f.pts[0], f.pts[1]]
  if (!v.includes('jadro')) {
    // cells only: point at one cell and at its edge
    out.push({ key: 'bunky', ...P(f.nx, f.ny) })
  }
  out.push({ key: v.includes('stena') ? 'stena' : 'membrana', ...P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) })
  if (v.includes('jadro')) {
    out.push({ key: 'jadro', ...P(f.nx, f.ny) })
    if (v.includes('jaderko')) {
      const n = P(f.nx, f.ny)
      out.push({ key: 'jaderko', x: n.x + nr * 0.35, y: n.y - nr * 0.3 })
    }
    if (v.includes('cytoplazma')) {
      const n = P(f.nx, f.ny)
      // onion: the strand of cytoplasm round the nucleus; cheek: halfway to the membrane
      const e = sample === 'cibule' ? { x: n.x - nr * 1.9, y: n.y + nr * 0.6 } : P((f.nx + f.pts[4][0]) / 2, (f.ny + f.pts[4][1]) / 2)
      out.push({ key: 'cytoplazma', ...e })
    }
  }
  return out
}

function Field({ sample, si }: { sample: SampleId; si: number }) {
  const { id, still } = usePlate()
  const clip = 'mz' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const step = STEPS[si]
  const s = (2 * R) / step.field
  const v = visible(sample, step.mag)
  const T = TINT[sample]
  const showCells = v.includes('bunky')
  const showNuc = v.includes('jadro')
  const cells = showCells ? cellsNear(sample, step.field / 2) : []
  const walls = cells.map((c) => pathOf(c.pts, s)).join('')
  // a stained nucleus is drawn at least 1,6 px wide so it shows as a dot
  const nr = Math.max(1.6, SAMPLES[sample].nucleus * 0.5 * s)
  const bar = scaleBar(step.field)
  const barPx = bar * s
  const tg = targets(sample, step, cells, s, nr)
  const slots = tg
    .slice()
    .sort((p, q) => p.y - q.y)
    .map((t, i, all) => ({ ...t, ly: CY + (i - (all.length - 1) / 2) * 46 }))
  return (
    <>
      <clipPath id={clip}>
        <circle cx={CX} cy={CY} r={R} />
      </clipPath>
      <circle cx={CX} cy={CY} r={R} style={{ fill: T.bg }} />
      <motion.g
        key={`${sample}${si}`}
        clipPath={`url(#${clip})`}
        initial={still ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <path d={pathOf(specimenOutline(sample), s)} style={{ fill: T.cell }} opacity={showCells ? 0.55 : 0.9} />
        {!showCells && <path d={pathOf(specimenOutline(sample), s)} fill={url(id, 'd')} opacity={0.5} />}
        <path d={pathOf(specimenOutline(sample), s)} className="ph-o ph-thin" style={{ stroke: T.edge }} />
        {showCells && (
          <>
            <path d={walls} style={{ fill: T.cell, stroke: T.edge, strokeWidth: si >= 3 ? 1.6 : si === 2 ? 0.9 : 0.6 }} />
            {showNuc && v.includes('cytoplazma') &&
              cells.map((c, i) => (
                <ellipse key={`c${i}`} cx={CX + c.nx * s} cy={CY + c.ny * s} rx={nr * 2.4} ry={nr * 1.7} style={{ fill: T.cyto }} />
              ))}
            {showNuc &&
              cells.map((c, i) => (
                <circle key={`n${i}`} cx={CX + c.nx * s} cy={CY + c.ny * s} r={nr} style={{ fill: T.nuc }} />
              ))}
            {v.includes('jaderko') &&
              cells.map((c, i) => (
                <circle
                  key={`j${i}`}
                  cx={CX + c.nx * s + nr * 0.35}
                  cy={CY + c.ny * s - nr * 0.3}
                  r={nr * 0.28}
                  className="xp-mz-nucleolus"
                />
              ))}
          </>
        )}
      </motion.g>
      {/* eyepiece rim */}
      <circle cx={CX} cy={CY} r={R + 3} className="xp-mz-rim" />
      {/* scale bar */}
      <g className="xp-mz-bar">
        <path d={`M${CX - barPx / 2} ${CY + R - 22} h${barPx}`} className="ph-o ph-thick" />
        <path d={`M${CX - barPx / 2} ${CY + R - 26} v8 M${CX + barPx / 2} ${CY + R - 26} v8`} className="ph-o" />
        <text x={CX} y={CY + R - 30} textAnchor="middle" className="ph-lbl ph-lbl-sm ph-halo">
          {bar.toLocaleString('cs-CZ')} µm
        </text>
      </g>
      {/* labels with leader lines */}
      {slots.map((t) => (
        <g key={t.key}>
          <path d={`M${t.x.toFixed(1)} ${t.y.toFixed(1)} L${LX - 6} ${t.ly - 5}`} className="ph-o ph-thin xp-mz-lead" />
          <circle cx={t.x} cy={t.y} r={2} className="xp-mz-pin" />
          <text x={LX} y={t.ly} className="ph-lbl">
            {t.key === 'vzorek' ? SPECIMEN[sample] : LABEL[t.key]}
          </text>
        </g>
      ))}
      <text x={CX} y={CY + R + 26} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        {step.objective ? `mikroskop ${step.mag}×` : `lupa ${step.mag}×`}
      </text>
    </>
  )
}

export default function MicroscopeZoom() {
  const [si, setSi] = useState(0)
  const [sample, setSample] = useState<SampleId>('cibule')
  const nar = useNarrow()
  const step = STEPS[si]
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[10, 8, 362, 262]} max={460} label={microLabel(sample, step)} className="xp-mz">
          <Field sample={sample} si={si} />
        </Plate>
      }
      controls={
        <>
          <Control
            label="zvětšení"
            value={si}
            min={0}
            max={STEPS.length - 1}
            step={1}
            format={(i) => (STEPS[i].objective ? `${STEPS[i].mag}×` : `lupa ${STEPS[i].mag}×`)}
            onChange={setSi}
          />
          <Choice
            label="vzorek"
            value={sample}
            onChange={setSample}
            options={(Object.keys(SAMPLES) as SampleId[]).map((k) => ({ value: k, label: SAMPLES[k].name }))}
          />
        </>
      }
      readouts={
        <>
          <Readout label="zvětšení = okulár × objektiv" value={magText(step)} />
          <Readout label="průměr zorného pole ≈" value={step.field} digits={0} unit="µm" />
        </>
      }
      challenge="Najdi zvětšení, při kterém uvidíš jádro buňky."
      done={seesNucleus(sample, step.mag)}
    />
  )
}
