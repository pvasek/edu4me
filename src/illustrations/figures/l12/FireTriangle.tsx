import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Fade, Flame, Lbl, Plate, Pop, drawV } from './kit'

type Side = 'heat' | 'oxygen' | 'fuel'

const T = [300, 72] as const
const BL = [128, 368] as const
const BR = [472, 368] as const

const SIDES: Record<
  Side,
  { from: readonly [number, number]; to: readonly [number, number]; word: string; out: [number, number]; how: string; lack: string }
> = {
  heat: { from: BL, to: T, word: 'TEPLO', out: [-44, -25], how: 'Ochladit (voda)', lack: 'teplo – hořlavina se ochladila pod zápalnou teplotu' },
  oxygen: { from: T, to: BR, word: 'KYSLÍK', out: [44, -25], how: 'Zakrýt (deka, CO₂)', lack: 'kyslík – deka, písek, pěna nebo CO₂ zamezí přístupu vzduchu' },
  fuel: { from: BR, to: BL, word: 'PALIVO', out: [0, 50], how: 'Odebrat palivo', lack: 'palivo – zavřený přívod plynu nebo průsek v lese' },
}

function Thermometer({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="f12-line" style={{ fill: 'var(--surface)' }} d="M-5 16 L-5 -22 A5 5 0 0 1 5 -22 L5 16 A10 10 0 1 1 -5 16 Z" />
      <path style={{ fill: '#d9493b' }} d="M-2 18 L-2 -8 L2 -8 L2 18 A6.5 6.5 0 1 1 -2 18 Z" />
      <path className="f12-thin" d="M5 -16 L10 -16 M5 -8 L9 -8 M5 0 L10 0 M5 8 L9 8" />
      <path className="f12-heat" d="M-18 -18 q-5 -6 0 -12 q5 -6 0 -12 M-24 -6 q-5 -6 0 -12 q5 -6 0 -12" />
    </g>
  )
}

function O2({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle className="f12-atom f12-O" cx={-9} cy={0} r={13} />
      <circle className="f12-atom f12-O" cx={9} cy={0} r={13} />
      <path className="f12-shine" d="M-16 -4 A8 8 0 0 1 -11 -9 M2 -4 A8 8 0 0 1 7 -9" />
      <text className="f12-t f12-t-strong" x={0} y={34} textAnchor="middle">
        O₂
      </text>
    </g>
  )
}

function Logs({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform="rotate(-14)">
        <rect className="f12-line" x={-34} y={-7} width={64} height={14} rx={3} style={{ fill: 'var(--f12-wood)' }} />
        <ellipse className="f12-line" cx={30} cy={0} rx={4} ry={7} style={{ fill: 'color-mix(in srgb, var(--f12-wood) 60%, var(--surface))' }} />
      </g>
      <g transform="rotate(14)">
        <rect className="f12-line" x={-30} y={-7} width={64} height={14} rx={3} style={{ fill: 'var(--f12-wood)' }} />
        <ellipse className="f12-line" cx={-30} cy={0} rx={4} ry={7} style={{ fill: 'color-mix(in srgb, var(--f12-wood) 60%, var(--surface))' }} />
        <path className="f12-hair" d="M-20 -2 L20 -3 M-16 3 L14 2" />
      </g>
    </g>
  )
}

function SideBand({ side, out, onToggle, children }: { side: Side; out: boolean; onToggle: () => void; children: ReactNode }) {
  const s = SIDES[side]
  const [x1, y1] = s.from
  const [x2, y2] = s.to
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  let ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  if (ang > 90 || ang < -90) ang += 180
  return (
    <g
      className="f12-side"
      style={{ transform: out ? `translate(${s.out[0]}px, ${s.out[1]}px)` : 'none', opacity: out ? 0.3 : 1, transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s' }}
      onClick={onToggle}
    >
      <motion.path className="f12-band" d={`M${x1} ${y1} L${x2} ${y2}`} variants={drawV(side === 'heat' ? 0 : side === 'oxygen' ? 0.35 : 0.7, 0.6)} />
      <motion.path className="f12-band-edge" d={`M${x1} ${y1} L${x2} ${y2}`} variants={drawV(side === 'heat' ? 0 : side === 'oxygen' ? 0.35 : 0.7, 0.6)} />
      <Fade delay={1}>
        <text className="f12-side-t" x={mx} y={my} transform={`rotate(${ang} ${mx} ${my})`}>
          {s.word}
        </text>
      </Fade>
      {children}
    </g>
  )
}

export default function FireTriangle() {
  const [out, setOut] = useState<Side | null>(null)
  const toggle = (s: Side) => setOut((o) => (o === s ? null : s))
  const status = out ? `Oheň zhasl. Chybí ${SIDES[out].lack}.` : 'Oheň hoří: má palivo, kyslík i teplo. Odeber jednu stranu.'
  return (
    <Plate
      level={1}
      w={600}
      h={470}
      max={600}
      label="Požární trojúhelník: aby něco hořelo, musí být současně palivo (hořlavá látka), kyslík a teplo (zápalná teplota). Hašení odebírá aspoň jednu stranu: voda ochladí, deka, písek, pěna nebo oxid uhličitý zamezí přístupu kyslíku a zavřením plynu nebo průsekem odstraníš palivo."
      after={
        <>
          <div className="f12-controls" role="group" aria-label="Hašení: odeber jednu stranu trojúhelníku">
            {(Object.keys(SIDES) as Side[]).map((s) => (
              <button key={s} type="button" className="f12-btn" aria-pressed={out === s} onClick={() => toggle(s)}>
                {SIDES[s].how}
              </button>
            ))}
            {out && (
              <button type="button" className="f12-btn" onClick={() => setOut(null)}>
                Zapálit znovu
              </button>
            )}
          </div>
          <p className="f12-status" aria-live="polite">
            {status}
          </p>
        </>
      }
    >
      <SideBand side="heat" out={out === 'heat'} onToggle={() => toggle('heat')}>
        <Pop delay={1.1}>
          <Thermometer x={150} y={176} />
        </Pop>
        <Lbl x={156} y={244} anchor="end" delay={1.3} line2="voda" className="f12-lab-strong">
          ochladit:
        </Lbl>
      </SideBand>
      <SideBand side="oxygen" out={out === 'oxygen'} onToggle={() => toggle('oxygen')}>
        <Pop delay={1.2}>
          <O2 x={452} y={170} />
        </Pop>
        <Lbl x={444} y={244} delay={1.4} line2="deka, CO₂" className="f12-lab-strong">
          zakrýt:
        </Lbl>
      </SideBand>
      <SideBand side="fuel" out={out === 'fuel'} onToggle={() => toggle('fuel')}>
        <Pop delay={1.3}>
          <Logs x={206} y={428} />
        </Pop>
        <Lbl x={290} y={424} delay={1.5} line2="zavřít plyn" className="f12-lab-strong">
          odebrat palivo:
        </Lbl>
      </SideBand>

      {/* the fire */}
      <Pop delay={1.5} origin="50% 100%">
        <g className={`f12-fire ${out ? 'f12-fire-out' : ''}`}>
          <Flame x={268} y={318} h={82} kind="yellow" />
          <Flame x={334} y={318} h={74} kind="yellow" />
          <Flame x={300} y={320} h={132} kind="yellow" />
          <path className="f12-ember" d="M246 322 Q300 334 356 322" />
        </g>
      </Pop>
      <g className={`f12-smoke ${out ? 'f12-smoke-on' : ''}`}>
        <path d="M296 300 q-12 -16 0 -30 q12 -14 0 -30 q-10 -12 0 -24" />
        <path d="M312 304 q-10 -14 2 -26 q10 -12 -2 -26" />
      </g>
    </Plate>
  )
}
