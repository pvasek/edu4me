import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot } from '../../ui/Mascot'
import {
  CAPACITY,
  INDICATOR_STOPS,
  MISSION_MAX,
  REAGENTS,
  add,
  describePh,
  formatNum,
  indicatorColor,
  meterReading,
  phOf,
  pickMissions,
  scoreMission,
  type BeakerState,
  type MissionScore,
  type Reagent,
} from './ph'
import { ease, fadeUp, popIn, shake, spring } from '../../ui/motion'
import './ph-lab.css'

interface Drop {
  id: number
  big: boolean
  fall: number
}

/* Beaker geometry (SVG user units). */
const B_TOP = 70
const B_BOTTOM = 262
const PX_PER_ML = 0.72 // 250 cm³ -> 180 px
const surfaceY = (vol: number) => B_BOTTOM - Math.min(vol, CAPACITY) * PX_PER_ML

export default function PhLab({ onFinish }: GameProps) {
  const [missions] = useState(pickMissions)
  const [idx, setIdx] = useState(0)
  const mission = missions[idx]
  const [beaker, setBeaker] = useState<BeakerState>(mission.start)
  const [adds, setAdds] = useState(0)
  const [sel, setSel] = useState(0)
  const [drops, setDrops] = useState<Drop[]>([])
  const [result, setResult] = useState<MissionScore | null>(null)
  const [score, setScore] = useState(0)
  const [bump, setBump] = useState(0)
  const finished = useRef(false)
  const dropId = useRef(0)

  const ph = phOf(beaker)
  const reading = meterReading(ph)
  const color = indicatorColor(ph)
  const reagent = REAGENTS[sel]
  const full = beaker.volume >= CAPACITY
  const room = CAPACITY - beaker.volume

  const pour = useCallback(
    (ml: number) => {
      if (result) return
      setBeaker((b) => {
        const amount = Math.min(ml, CAPACITY - b.volume)
        if (amount <= 0) return b
        return add(b, REAGENTS[sel].conc, amount)
      })
      if (beaker.volume >= CAPACITY) return
      setAdds((n) => n + 1)
      setBump((n) => n + 1)
      const id = ++dropId.current
      setDrops((d) => [...d.slice(-4), { id, big: ml >= 10, fall: surfaceY(beaker.volume) - 44 }])
      window.setTimeout(() => setDrops((d) => d.filter((x) => x.id !== id)), 900)
    },
    [result, sel, beaker.volume],
  )

  const reset = () => {
    if (result) return
    setBeaker(mission.start)
    setDrops([])
  }

  const measure = () => {
    if (result || adds === 0) return
    const r = scoreMission(mission, ph, adds)
    setResult(r)
    setScore((s) => s + r.total)
  }

  const next = () => {
    if (idx + 1 >= missions.length) {
      if (!finished.current) {
        finished.current = true
        onFinish({ score, max: missions.length * MISSION_MAX })
      }
      return
    }
    const n = idx + 1
    setIdx(n)
    setBeaker(missions[n].start)
    setAdds(0)
    setResult(null)
    setDrops([])
  }

  // Keyboard: ←/→ choose bottle, ↓ adds 1 cm³, Shift+↓ adds 10 cm³.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (result) return
      if (e.key === 'ArrowRight') {
        setSel((s) => (s + 1) % REAGENTS.length)
        e.preventDefault()
      } else if (e.key === 'ArrowLeft') {
        setSel((s) => (s - 1 + REAGENTS.length) % REAGENTS.length)
        e.preventDefault()
      } else if (e.key === 'ArrowDown') {
        pour(e.shiftKey ? 10 : 1)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pour, result])

  const sy = surfaceY(beaker.volume)
  const mood = result ? (result.inRange ? 'cheer' : result.total > 0 ? 'think' : 'sad') : full ? 'wow' : 'happy'

  return (
    <div className="g-ph">
      <p className="g-ph-instr">Vyber lahvičku, přikapávej do kádinky a trefi zadané pH. Čím méně přidání, tím líp.</p>

      <div className="g-ph-hud">
        <span className="chip">
          <Icon name="target" /> Mise {idx + 1}/{missions.length}
        </span>
        <motion.span
          className="chip"
          key={`s${score}`}
          initial={score ? { scale: 1.3 } : false}
          animate={{ scale: 1 }}
          transition={spring.bouncy}
        >
          <Icon name="star" /> {score} b.
        </motion.span>
        <span className="chip chip-soft">
          <Icon name="flask" /> Přidání: {adds}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div className="g-ph-mission card" key={mission.id} variants={fadeUp} initial="hidden" animate="show" exit="exit">
          <Mascot mood={mood} size={64} />
          <div className="g-ph-mission-body">
            <div className="eyebrow">Mise {idx + 1}</div>
            <p className="g-ph-mission-text">
              <Md text={mission.text} />
            </p>
            <div className="g-ph-mission-meta">
              <span className="chip">
                Cíl: pH {formatNum(mission.min)}–{formatNum(mission.max)}
              </span>
              <span className="note g-ph-hint">{mission.hint}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="g-ph-lab">
        <div className="g-ph-bench">
          <svg
            className="g-ph-beaker"
            viewBox="0 0 220 280"
            role="img"
            aria-label={`Kádinka s ${Math.round(beaker.volume)} cm³ roztoku, univerzální indikátor ukazuje pH ${formatNum(reading)}`}
          >
            <defs>
              <clipPath id="g-ph-clip">
                <path d={`M44 ${B_TOP} V${B_BOTTOM - 12} Q44 ${B_BOTTOM} 56 ${B_BOTTOM} H164 Q176 ${B_BOTTOM} 176 ${B_BOTTOM - 12} V${B_TOP} Z`} />
              </clipPath>
            </defs>

            {/* dropper */}
            <g className="g-ph-dropper">
              <motion.rect
                key={`dp${bump}`}
                x="100"
                y="-6"
                width="20"
                height="26"
                rx="8"
                className="g-ph-bulb"
                style={{ originY: 1 }}
                animate={bump ? { scaleX: [1, 1.18, 1], scaleY: [1, 0.78, 1] } : undefined}
                transition={{ duration: 0.3 }}
              />
              <path d="M104 20 H116 L113 44 H107 Z" className="g-ph-glass" />
            </g>

            {/* liquid */}
            <g clipPath="url(#g-ph-clip)">
              <motion.g className="g-ph-liquid" initial={false} animate={{ y: sy }} transition={spring.gentle}>
                <motion.rect
                  x="30"
                  y="0"
                  width="160"
                  height="220"
                  className="g-ph-fill"
                  initial={false}
                  animate={{ fill: color }}
                  transition={spring.gentle}
                />
                <path d="M30 0 Q57 -5 84 0 T138 0 T192 0 V6 H30 Z" className="g-ph-shine" />
              </motion.g>
            </g>

            {/* drops */}
            {drops.map((d) =>
              d.big ? (
                <motion.rect
                  key={d.id}
                  className="g-ph-stream"
                  x="107"
                  y="44"
                  width="6"
                  height={Math.max(0, d.fall)}
                  rx="3"
                  style={{ originY: 0 }}
                  initial={{ scaleY: 0, opacity: 0.75 }}
                  animate={{ scaleY: [0, 1, 1], opacity: [0.75, 0.75, 0] }}
                  transition={{ duration: 0.7, times: [0, 0.35, 1] }}
                />
              ) : (
                <motion.path
                  key={d.id}
                  className="g-ph-drop"
                  d="M110 44 q-5 8 0 11 q5 -3 0 -11 z"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: d.fall, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.45, ease: [0.55, 0, 1, 0.45], times: [0, 0.9, 1] }}
                />
              ),
            )}
            {drops.map((d) => (
              <motion.ellipse
                key={`r${d.id}`}
                className="g-ph-ripple"
                cx="110"
                cy={sy}
                rx="18"
                ry="4"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.6], opacity: [0.8, 0] }}
                transition={{ delay: d.big ? 0.25 : 0.4, duration: 0.5 }}
              />
            ))}

            {/* beaker glass */}
            <path
              className="g-ph-glass-outline"
              d={`M36 ${B_TOP - 8} L44 ${B_TOP} V${B_BOTTOM - 12} Q44 ${B_BOTTOM} 56 ${B_BOTTOM} H164 Q176 ${B_BOTTOM} 176 ${B_BOTTOM - 12} V${B_TOP - 8}`}
            />
            {[50, 100, 150, 200, 250].map((v) => (
              <g key={v} className="g-ph-grad">
                <line x1="150" x2="174" y1={surfaceY(v)} y2={surfaceY(v)} />
                <text x="146" y={surfaceY(v) + 4} textAnchor="end">
                  {v}
                </text>
              </g>
            ))}
            <text x="60" y={B_BOTTOM - 10} className="g-ph-unit">
              cm³
            </text>
          </svg>

          <div className="g-ph-meter" role="status" aria-live="polite">
            <div className="g-ph-meter-top">
              <span className="g-ph-meter-label">pH-metr</span>
              <span className="g-ph-meter-vol tabnum">{Math.round(beaker.volume * 10) / 10} cm³</span>
            </div>
            <div className="g-ph-meter-lcd tabnum">
              <RollingNumber value={reading} />
            </div>
            <div className="g-ph-meter-desc">
              <motion.span
                className="g-ph-swatch"
                initial={false}
                animate={{ backgroundColor: color }}
                transition={spring.gentle}
                aria-hidden="true"
              />
              {describePh(ph)}
            </div>
            <PhScale ph={ph} min={mission.min} max={mission.max} />
          </div>
        </div>

        <div className="g-ph-controls">
          {!result ? (
            <>
              <div className="g-ph-bottles" role="radiogroup" aria-label="Lahvičky">
                {REAGENTS.map((r, i) => (
                  <Bottle key={r.id} r={r} selected={i === sel} onSelect={() => setSel(i)} />
                ))}
              </div>
              <div className="g-ph-add">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => pour(1)} disabled={full}>
                  <Icon name="flask" /> +1 cm³
                </button>
                <button type="button" className="btn btn-lg" onClick={() => pour(10)} disabled={full}>
                  +{Math.min(10, Math.max(0, Math.round(room)))} cm³
                </button>
              </div>
              <p className="g-ph-status muted">
                {full ? (
                  <>
                    <Icon name="alert" /> Kádinka je plná. Vylij ji a začni znovu.
                  </>
                ) : (
                  <>
                    Přidáváš: <strong>{reagent.name}</strong> ({reagent.sub})
                  </>
                )}
              </p>
              <div className="g-ph-actions">
                <button type="button" className="btn" onClick={reset}>
                  <Icon name="refresh" /> Vylít a začít znovu
                </button>
                <button type="button" className="btn btn-good" onClick={measure} disabled={adds === 0}>
                  <Icon name="check" /> Změřit a vyhodnotit
                </button>
              </div>
              <p className="g-ph-keys muted">Klávesy: ←/→ lahvička, ↓ +1 cm³, Shift + ↓ +10 cm³</p>
            </>
          ) : (
            <motion.div
              className={`g-ph-result ${result.inRange ? 'ok' : 'bad'}`}
              role="status"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={result.inRange ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: shake.x }}
              transition={{ default: spring.bouncy, x: shake.transition }}
            >
              <div className="g-ph-verdict">
                <Icon name={result.inRange ? 'check' : 'x'} />
                {result.inRange
                  ? `pH ${formatNum(result.reading)}. Trefa!`
                  : `pH ${formatNum(result.reading)}. Cíl byl ${formatNum(mission.min)}–${formatNum(mission.max)}.`}
              </div>
              <ul className="g-ph-breakdown">
                <li>
                  Přesnost: <strong>{result.accuracy}/7</strong>
                </li>
                <li>
                  Úspornost: <strong>{result.efficiency}/3</strong>{' '}
                  <span className="muted">
                    ({adds}× přidáno, ideál {mission.par}×)
                  </span>
                </li>
              </ul>
              <motion.div className="g-ph-points" variants={popIn} initial="hidden" animate="show">
                +{result.total} b.
              </motion.div>
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={next} autoFocus>
                {idx + 1 >= missions.length ? 'Zobrazit výsledky' : 'Další mise'} <Icon name="arrowRight" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function Bottle({ r, selected, onSelect }: { r: Reagent; selected: boolean; onSelect: () => void }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`g-ph-bottle${selected ? ' sel' : ''}`}
      onClick={onSelect}
      animate={{ y: selected ? -3 : 0 }}
      whileTap={{ scale: 0.95 }}
      transition={spring.snappy}
    >
      <motion.svg
        viewBox="0 0 32 40"
        width="30"
        height="38"
        aria-hidden="true"
        animate={selected ? { rotate: [0, -10, 7, 0] } : { rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        <rect x="11" y="1" width="10" height="7" rx="2" className="g-ph-cap" />
        <path d="M9 8 H23 V12 Q28 14 28 20 V35 Q28 39 24 39 H8 Q4 39 4 35 V20 Q4 14 9 12 Z" className="g-ph-bottle-body" />
        <rect x="6" y="22" width="20" height="9" rx="1.5" style={{ fill: r.kind === 'water' ? 'transparent' : indicatorColor(r.ph) }} />
      </motion.svg>
      <span className="g-ph-bottle-name">{r.name}</span>
      <span className="g-ph-bottle-sub">{r.sub}</span>
      {selected && (
        <motion.span className="g-ph-bottle-tick" aria-hidden="true" variants={popIn} initial="hidden" animate="show">
          <Icon name="check" />
        </motion.span>
      )}
    </motion.button>
  )
}

function PhScale({ ph, min, max }: { ph: number; min: number; max: number }) {
  const pct = (v: number) => `${(Math.min(14, Math.max(0, v)) / 14) * 100}%`
  const gradient = `linear-gradient(90deg, ${INDICATOR_STOPS.map((c, i) => `${c} ${((i / 14) * 100).toFixed(1)}%`).join(', ')})`
  return (
    <div className="g-ph-scale" aria-hidden="true">
      <div className="g-ph-scale-bar" style={{ background: gradient }}>
        <div className="g-ph-scale-target" style={{ left: pct(min), width: `calc(${pct(max)} - ${pct(min)})` }} />
        <motion.div className="g-ph-scale-marker" initial={false} animate={{ left: pct(ph) }} transition={spring.gentle} />
      </div>
      <div className="g-ph-scale-labels">
        <span>0</span>
        <span>7</span>
        <span>14</span>
      </div>
    </div>
  )
}

/** pH meter digits that roll to the new value instead of jumping. */
function RollingNumber({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => formatNum(v))
  useEffect(() => {
    const ctl = animate(mv, value, { duration: 0.5, ease: ease.out })
    return () => ctl.stop()
  }, [mv, value])
  return <motion.span>{text}</motion.span>
}
