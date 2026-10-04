import { useState } from 'react'
import { Plate, czNum, useNarrow } from '../../illustrations/physics/kit'
import { Control, Experiment, Readout } from './kit'
import {
  BLEACH_DHW,
  DAYS_MAX,
  DEATH_DHW,
  MMM,
  T_MAX,
  T_MIN,
  algaeShare,
  challengeMet,
  coralState,
  daysTo,
  deadShare,
  dhw,
  outcome,
  type CoralState,
  type Outcome,
} from './coral-bleaching.model'

/** "Vyzkoušej si" for b4-2: sea temperature and duration → a coral loses its algae, recovers or dies. */

const STATE: Record<CoralState, string> = {
  zdravy: 'zdravý',
  bledne: 'bledne',
  vybeleny: 'vybělený',
  odumira: 'odumírá',
  mrtvy: 'mrtvý',
}
const SAY: Record<CoralState, string> = {
  zdravy: 'Korál je zdravý',
  bledne: 'Korál bledne',
  vybeleny: 'Korál je vybělený',
  odumira: 'Korál odumírá',
  mrtvy: 'Korál je mrtvý',
}
const AFTER: Record<Outcome, string> = {
  'bez-zmeny': 'zůstane zdravý',
  zotavi: 'řasy se vrátí, zotaví se',
  'cast-uhyne': 'část korálu uhyne',
  uhyne: 'korál uhyne',
}

export const dayWord = (d: number) => `${d} ${d === 1 ? 'den' : d >= 2 && d <= 4 ? 'dny' : 'dní'}`

// branching coral: [x1, y1, x2, y2, depth]
const BR: [number, number, number, number, number][] = [
  [196, 168, 194, 140, 0],
  [194, 140, 168, 112, 1],
  [168, 112, 156, 84, 2],
  [168, 112, 176, 80, 2],
  [194, 140, 198, 104, 1],
  [198, 104, 192, 68, 2],
  [198, 104, 214, 74, 2],
  [194, 140, 222, 116, 1],
  [222, 116, 238, 88, 2],
  [238, 88, 234, 62, 3],
  [238, 88, 258, 74, 3],
  [196, 162, 164, 144, 1],
  [164, 144, 140, 122, 2],
  [140, 122, 134, 96, 3],
  [140, 122, 118, 108, 3],
  [196, 160, 232, 144, 1],
  [232, 144, 258, 128, 2],
  [258, 128, 280, 108, 3],
  [258, 128, 278, 136, 3],
]
const TIPS = BR.filter(([, , x2, y2]) => !BR.some(([x1, y1]) => x1 === x2 && y1 === y2))
// the order in which branches die (deterministic, patchy)
const DIE_ORDER = [9, 3, 14, 17, 6, 12, 1, 10, 15, 4, 18, 8, 2, 13, 5, 16, 11, 7, 0]

const HEALTHY = '#b8863a'
const DEAD = 'color-mix(in srgb, #6f7a5a 70%, var(--surface))'

// timeline
const TX0 = 34
const TX1 = 340
const TY = 236
const tx = (d: number) => TX0 + (Math.min(d, DAYS_MAX) / DAYS_MAX) * (TX1 - TX0)

function coralLabel(t: number, days: number): string {
  const over = t - MMM
  const sea = `Moře má ${czNum(t)} °C, ${over > 0 ? `o ${czNum(over)} °C víc` : over < 0 ? `o ${czNum(-over)} °C méně` : 'tedy ne víc'} než obvyklé letní maximum ${MMM} °C, a to ${dayWord(days)}. `
  const a = Math.round(algaeShare(dhw(t, days)) * 100)
  const dead = Math.round(deadShare(dhw(t, days)) * 100)
  return (
    sea +
    `${SAY[coralState(t, days)]}: v jeho buňkách zůstalo ${a} % řas${dead ? `, odumřelo ${dead} % kolonie` : ''}. ` +
    `Když se moře ochladí, ${AFTER[outcome(t, days)]}. ` +
    (Number.isFinite(daysTo(t, BLEACH_DHW))
      ? `Při této teplotě korál vybledne asi za ${dayWord(Math.round(daysTo(t, BLEACH_DHW)))} a začne odumírat asi za ${dayWord(Math.round(daysTo(t, DEATH_DHW)))}.`
      : 'Při této teplotě korál nebledne.')
  )
}

function Coral({ t, days }: { t: number; days: number }) {
  const d = dhw(t, days)
  const a = algaeShare(d)
  const dead = deadShare(d)
  const live = `color-mix(in srgb, ${HEALTHY} ${Math.round(a * 100)}%, #f8f5ec)`
  const isDead = (i: number) => DIE_ORDER.indexOf(i) < Math.round(dead * BR.length)
  return (
    <g>
      {BR.map(([x1, y1, x2, y2, dep], i) => (
        <path
          key={`e${i}`}
          d={`M${x1} ${y1} L${x2} ${y2}`}
          stroke="var(--edge)"
          strokeWidth={12 - dep * 2 + 2.6}
          strokeLinecap="round"
        />
      ))}
      {BR.map(([x1, y1, x2, y2, dep], i) => (
        <path
          key={`f${i}`}
          d={`M${x1} ${y1} L${x2} ${y2}`}
          stroke={isDead(i) ? DEAD : live}
          strokeWidth={12 - dep * 2}
          strokeLinecap="round"
        />
      ))}
      {/* polyps on living tips */}
      {TIPS.map(([, , x, y], k) => {
        const i = BR.findIndex((b) => b[2] === x && b[3] === y)
        if (isDead(i)) return null
        return (
          <g key={k} stroke="var(--edge)" strokeWidth={0.9} strokeLinecap="round">
            <path d={`M${x} ${y - 4} l-4 -5 M${x} ${y - 4} l0 -6 M${x} ${y - 4} l4 -5`} />
          </g>
        )
      })}
    </g>
  )
}

/** Magnified polyp: the algae (brown dots) inside its cells. */
function Lens({ t, days }: { t: number; days: number }) {
  const d = dhw(t, days)
  const a = algaeShare(d)
  const deadNow = deadShare(d) >= 0.95
  const n = Math.round(a * 22)
  const dots: [number, number][] = []
  for (let k = 0; k < 22; k++) {
    const ang = k * 2.39996
    const r = 6 + 14 * Math.sqrt((k + 0.5) / 22)
    dots.push([60 + Math.cos(ang) * r * 1.1, 70 + Math.sin(ang) * r * 0.8])
  }
  return (
    <g>
      <circle cx={60} cy={64} r={42} fill="var(--surface)" stroke="var(--edge)" strokeWidth={1.4} />
      <path d="M100 76 L142 92" stroke="var(--ink-soft)" strokeWidth={1} strokeDasharray="3 3" />
      {/* polyp body with tentacles */}
      <path
        d="M36 100 C34 80 36 62 44 54 L76 54 C84 62 86 80 84 100Z"
        fill={deadNow ? DEAD : `color-mix(in srgb, ${HEALTHY} ${Math.round(18 + a * 30)}%, #f8f5ec)`}
        stroke="var(--edge)"
        strokeWidth={1.2}
      />
      {!deadNow &&
        [40, 48, 56, 64, 72, 80].map((x, i) => (
          <path key={x} d={`M${x} 54 q${i < 3 ? -6 : 6} -12 ${i < 3 ? -2 : 2} -22`} fill="none" stroke="var(--edge)" strokeWidth={1.2} strokeLinecap="round" />
        ))}
      {!deadNow &&
        dots.slice(0, n).map(([x, y], k) => <circle key={k} cx={x} cy={y} r={2.6} fill="#8a5a1f" stroke="var(--edge)" strokeWidth={0.5} />)}
      <text x={60} y={124} textAnchor="middle" className="ph-lbl ph-lbl-sm">
        řasy v polypu
      </text>
    </g>
  )
}

function Timeline({ t, days }: { t: number; days: number }) {
  const b = daysTo(t, BLEACH_DHW)
  const dd = daysTo(t, DEATH_DHW)
  const zone = (x0: number, x1: number, fill: string, label: string) =>
    x1 > x0 && (
      <g key={label}>
        <rect x={tx(x0)} y={TY - 12} width={tx(x1) - tx(x0)} height={24} fill={fill} stroke="var(--edge)" strokeWidth={0.8} />
      </g>
    )
  return (
    <g>
      {zone(0, Math.min(b, DAYS_MAX), `color-mix(in srgb, ${HEALTHY} 40%, var(--surface))`, 'zdravý')}
      {zone(Math.min(b, DAYS_MAX), Math.min(dd, DAYS_MAX), '#f8f5ec', 'vybělený')}
      {zone(Math.min(dd, DAYS_MAX), DAYS_MAX, DEAD, 'odumírá')}
      {[0, 2, 4, 6, 8, 10, 12].map((w) => (
        <g key={w}>
          <path d={`M${tx(w * 7)} ${TY + 12} v5`} stroke="var(--edge)" strokeWidth={1} />
          <text x={tx(w * 7)} y={TY + 30} textAnchor="middle" className="ph-num">
            {w}
          </text>
        </g>
      ))}
      <text x={TX0} y={TY - 20} className="ph-unit">
        týdny v teplém moři
      </text>
      {/* legend of the zones */}
      {([
        [`color-mix(in srgb, ${HEALTHY} 40%, var(--surface))`, 'zdravý'],
        ['#f8f5ec', 'vybělený'],
        [DEAD, 'odumírá'],
      ] as const).map(([fill, label], i) => (
        <g key={label} transform={`translate(${TX0 + i * 104} ${TY + 54})`}>
          <rect x={0} y={-10} width={14} height={12} fill={fill} stroke="var(--edge)" strokeWidth={0.8} />
          <text x={20} y={1} className="ph-lbl ph-lbl-sm">
            {label}
          </text>
        </g>
      ))}
      {/* the current duration */}
      <path d={`M${tx(days).toFixed(1)} ${TY - 22} l-6 -9 h12Z`} fill="var(--ink)" />
      <path d={`M${tx(days).toFixed(1)} ${TY - 20} V${TY + 14}`} stroke="var(--ink)" strokeWidth={1.6} />
    </g>
  )
}

export default function CoralBleaching() {
  const [t, setT] = useState(MMM)
  const [days, setDays] = useState(21)
  const nar = useNarrow()
  const st = coralState(t, days)
  const out = outcome(t, days)
  const over = t - MMM
  return (
    <Experiment
      picture={
        <Plate narrow={nar} vb={[0, 0, 360, 300]} max={460} label={coralLabel(t, days)} className="xp-cb">
          {/* sea and reef rock */}
          <rect x={4} y={8} width={352} height={172} rx={10} fill="color-mix(in srgb, #3f7fc4 16%, var(--surface))" />
          <path d="M120 180 Q150 158 196 162 Q246 160 280 180Z" fill="color-mix(in srgb, #9a8a6a 40%, var(--surface))" stroke="var(--edge)" strokeWidth={1.2} />
          <Coral t={t} days={days} />
          <Lens t={t} days={days} />
          <text x={348} y={30} textAnchor="end" className="ph-lbl">
            moře {czNum(t)} °C
          </text>
          <text x={348} y={48} textAnchor="end" className="ph-lbl ph-lbl-sm" style={{ fill: over >= 1 ? 'var(--bad)' : undefined }}>
            {over > 0 ? `o ${czNum(over)} °C víc než obvykle` : over < 0 ? `o ${czNum(-over)} °C méně než obvykle` : 'obvyklé letní maximum'}
          </text>
          <Timeline t={t} days={days} />
        </Plate>
      }
      controls={
        <>
          <Control label="teplota moře" unit="°C" value={t} min={T_MIN} max={T_MAX} step={0.5} digits={1} onChange={setT} />
          <Control label="jak dlouho" value={days} min={0} max={DAYS_MAX} step={1} format={(d) => dayWord(d)} onChange={setDays} />
        </>
      }
      readouts={
        <>
          <Readout label="korál" value={STATE[st]} tone={st === 'zdravy' ? 'good' : st === 'odumira' || st === 'mrtvy' ? 'bad' : undefined} />
          <Readout label="po ochlazení" value={AFTER[out]} tone={out === 'uhyne' || out === 'cast-uhyne' ? 'bad' : out === 'zotavi' ? 'good' : undefined} />
        </>
      }
      challenge="Jak dlouho korál vydrží o 2 °C teplejší moře? Nastav teplotu a dobu, kdy začne odumírat."
      done={challengeMet(t, days)}
    />
  )
}
