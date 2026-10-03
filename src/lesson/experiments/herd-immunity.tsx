import { useState } from 'react'
import { motion } from 'motion/react'
import { Plate, useNarrow, usePlate } from '../../illustrations/physics/kit'
import { Choice, Control, Experiment, Readout } from './kit'
import { COLS, DISEASES, INDEX_CASE, outbreak, type DiseaseId, type Outbreak } from './herd-immunity.model'

/** "Vyzkoušej si" for b2-6: vaccinate part of a crowd and watch whether one sick person starts an epidemic. */

const CELL = 24
const GX = 30
const GY = 8
const WAVE_S = 0.22 // delay between waves of the animation

/** 1 člověk, 2–4 lidé, 5 a víc lidí */
const lidi = (n: number) => (n === 1 ? 'člověk' : n >= 2 && n <= 4 ? 'lidé' : 'lidí')
/** "2 další", "15 dalších" */
const dalsi = (n: number) => `${n} ${n >= 2 && n <= 4 ? 'další' : 'dalších'}`
/** "1 neočkovaný zůstal zdravý", "3 neočkovaní zůstali zdraví", "28 neočkovaných zůstalo zdravých" */
function spared(n: number): string {
  if (n === 0) return 'žádný neočkovaný nezůstal zdravý'
  if (n === 1) return '1 neočkovaný zůstal zdravý'
  if (n <= 4) return `${n} neočkovaní zůstali zdraví`
  return `${n} neočkovaných zůstalo zdravých`
}

function herdLabel(pct: number, disease: DiseaseId, o: Outbreak): string {
  const D = DISEASES[disease]
  const head = `Mřížka 100 lidí, z nich ${o.vaccinated} očkovaných (proočkovanost ${pct} %). Nemoc: ${D.name}, jeden nemocný nakazí asi ${dalsi(D.r0)}. `
  if (o.sick === 0) return head + 'Očkovaní jsou všichni, nikdo neonemocněl.'
  if (o.stopped)
    return head + 'Nemocný uprostřed nikoho dalšího nenakazil: kolem něj jsou hlavně očkovaní, a tak nákaza nemá kudy projít a chráněni jsou i neočkovaní.'
  return (
    head +
    `Nákaza se od nemocného uprostřed rozšířila mezi neočkované: onemocnělo ${o.sick} ${lidi(o.sick)}, ` +
    `${spared(o.sparedUnvaccinated)}.`
  )
}

function Person({ i, o, run }: { i: number; o: Outbreak; run: string }) {
  const { still } = usePlate()
  const x = GX + (i % COLS) * CELL + CELL / 2
  const y = GY + Math.floor(i / COLS) * CELL + CELL / 2
  const body = `M${x - 6.5} ${y + 9}a6.5 6.5 0 0 1 13 0Z`
  const st = o.state[i]
  return (
    <g>
      {st === 'vaccinated' && <rect x={x - 10.5} y={y - 10.5} width={21} height={21} rx={5} className="xp-hi-shield" />}
      <circle cx={x} cy={y - 4} r={3.8} className={`xp-hi-p xp-hi-${st === 'vaccinated' ? 'vac' : 'free'}`} />
      <path d={body} className={`xp-hi-p xp-hi-${st === 'vaccinated' ? 'vac' : 'free'}`} />
      {st === 'sick' && (
        <motion.g
          key={run}
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: o.wave[i] * WAVE_S }}
        >
          <circle cx={x} cy={y - 4} r={3.8} className="xp-hi-p xp-hi-sick" />
          <path d={body} className="xp-hi-p xp-hi-sick" />
        </motion.g>
      )}
      {i === INDEX_CASE && o.sick > 0 && <circle cx={x} cy={y} r={11.5} className="ph-o xp-hi-first" />}
    </g>
  )
}

function Legend() {
  const item = (x: number, kind: 'vac' | 'free' | 'sick', text: string) => (
    <g>
      {kind === 'vac' && <rect x={x - 8} y={262} width={16} height={16} rx={4} className="xp-hi-shield" />}
      <circle cx={x} cy={267} r={2.8} className={`xp-hi-p xp-hi-${kind}`} />
      <path d={`M${x - 5} ${277}a5 5 0 0 1 10 0Z`} className={`xp-hi-p xp-hi-${kind}`} />
      <text x={x + 12} y={275} className="ph-lbl ph-lbl-sm">
        {text}
      </text>
    </g>
  )
  return (
    <>
      {item(GX + 8, 'vac', 'očkovaný')}
      {item(GX + 98, 'free', 'neočkovaný')}
      {item(GX + 196, 'sick', 'nemocný')}
    </>
  )
}

export default function HerdImmunity() {
  const [pct, setPct] = useState(60)
  const [disease, setDisease] = useState<DiseaseId>('spalnicky')
  const nar = useNarrow()
  const o = outbreak(pct, disease)
  const run = `${pct}-${disease}`
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[22, 0, 262, 290]} max={400} label={herdLabel(pct, disease, o)} className="xp-hi">
          {o.state.map((_, i) => (
            <Person key={i} i={i} o={o} run={run} />
          ))}
          <Legend />
        </Plate>
      }
      controls={
        <>
          <Control label="proočkovanost" unit="%" value={pct} min={0} max={100} step={1} onChange={setPct} />
          <Choice
            label="nemoc"
            value={disease}
            onChange={setDisease}
            options={(Object.keys(DISEASES) as DiseaseId[]).map((k) => ({
              value: k,
              label: `${DISEASES[k].name} (R_{0} ≈ ${DISEASES[k].r0})`,
            }))}
          />
        </>
      }
      readouts={
        <>
          <Readout label="onemocnělo" value={o.sick} digits={0} tone={o.stopped ? 'good' : 'bad'} />
          <Readout label="neočkovaní, kteří zůstali zdraví" value={o.sparedUnvaccinated} digits={0} />
        </>
      }
      challenge="Najdi proočkovanost, při které se nákaza nerozšíří."
      done={o.stopped}
    />
  )
}
