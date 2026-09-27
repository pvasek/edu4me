import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { levelNum, type GameProps } from '../types'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import {
  ACIDS,
  BURETTE_MAX,
  C_NAOH,
  DROP,
  PINK_FROM,
  STREAM_RATE,
  V_SAMPLE,
  equivalenceVolume,
  flashDuration,
  fmt,
  halfEquivalence,
  phAt,
  pinkIntensity,
  sampleMax,
  scoreSample,
  type Sample,
  type SampleScore,
} from './titration'
import {
  INDICATORS,
  INDICATOR_CHOICE,
  LEVELS,
  RIGHT_INDICATOR,
  indicatorExplain,
  levelOfAcid,
  pickSamples,
  type IndicatorId,
} from './samples'
import { bump, ease, fadeUp, popIn, rise, shake, spring, stagger } from '../../ui/motion'
import './titration.css'

type Phase = 'indicator' | 'titrate' | 'answer' | 'result'
interface Point {
  v: number
  ph: number
}

/** Phenolphthalein pink and methyl orange (indicator colours = subject data). */
const PINK = '#ff3d9a'
const ORANGE = '#f08a24'

/* Apparatus geometry (SVG user units). */
const SCALE_TOP = 30 // y of the 0 cm³ mark
const PX_PER_CM3 = 6
const TIP_Y = 392
const FLASK_BOTTOM = 535
const levelY = (v: number) => FLASK_BOTTOM - (V_SAMPLE + v) * 1.0

const round3 = (x: number) => Math.round(x * 1000) / 1000

const firstPhase = (s: Sample): Phase => (ACIDS[s.acid].chooseIndicator ? 'indicator' : 'titrate')

export default function Titration({ levelId, onFinish }: GameProps) {
  const n = levelNum(levelId)
  const level = n !== undefined && LEVELS[n] ? n : undefined
  const [samples] = useState<Sample[]>(() => pickSamples(level))
  const [idx, setIdx] = useState(0)
  const sample = samples[idx]
  const acid = ACIDS[sample.acid]
  const [phase, setPhase] = useState<Phase>(() => firstPhase(samples[0]))
  const [indicator, setIndicator] = useState<IndicatorId | null>(null)
  const [v, setV] = useState(0)
  const vRef = useRef(0)
  const [points, setPoints] = useState<Point[]>([{ v: 0, ph: phAt(sample, 0) }])
  const [running, setRunning] = useState(false)
  const [flash, setFlash] = useState<{ id: number; dur: number } | null>(null)
  const [dropKey, setDropKey] = useState(0)
  const [swirlKey, setSwirlKey] = useState(0)
  const [readInput, setReadInput] = useState('')
  const [concInput, setConcInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<SampleScore | null>(null)
  const [score, setScore] = useState(0)
  const finished = useRef(false)
  const flashId = useRef(0)

  const ph = phAt(sample, v)
  const pink = pinkIntensity(ph)
  const empty = v >= BURETTE_MAX - 1e-9

  const setVolume = useCallback(
    (nv: number) => {
      const val = Math.min(BURETTE_MAX, round3(nv))
      vRef.current = val
      setV(val)
      setPoints((pts) => {
        const last = pts[pts.length - 1]
        const p = phAt(sample, val)
        if (last && val - last.v < 0.05 && Math.abs(p - last.ph) < 0.15) return pts
        return [...pts, { v: val, ph: p }]
      })
    },
    [sample],
  )

  const addDrop = useCallback(() => {
    if (phase !== 'titrate' || vRef.current >= BURETTE_MAX) return
    const nv = vRef.current + DROP
    setVolume(nv)
    setDropKey((k) => k + 1)
    const dur = flashDuration(sample, nv)
    if (phAt(sample, nv) < PINK_FROM && dur > 0) setFlash({ id: ++flashId.current, dur })
    else setFlash(null)
  }, [phase, sample, setVolume])

  const swirl = useCallback(() => {
    if (phase !== 'titrate') return
    setSwirlKey((k) => k + 1)
    setFlash(null)
  }, [phase])

  const startStream = useCallback(() => {
    if (phase !== 'titrate' || vRef.current >= BURETTE_MAX) return
    setRunning(true)
  }, [phase])
  const stopStream = useCallback(() => setRunning(false), [])

  // The stream: 0.5 cm³/s while held.
  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const nv = vRef.current + STREAM_RATE * dt
      setVolume(nv)
      if (nv >= BURETTE_MAX) {
        setRunning(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      // When the stream stops before the endpoint, the pink plume fades away.
      const dur = flashDuration(sample, vRef.current)
      if (phAt(sample, vRef.current) < PINK_FROM && dur > 0) setFlash({ id: ++flashId.current, dur: dur + 400 })
    }
  }, [running, sample, setVolume])

  useEffect(() => {
    const stop = () => setRunning(false)
    window.addEventListener('blur', stop)
    return () => window.removeEventListener('blur', stop)
  }, [])

  // Keyboard: K or ↓ = drop, hold P = stream, M = swirl.
  useEffect(() => {
    if (phase !== 'titrate') return
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON')) {
        if (t.tagName !== 'BUTTON' || e.key === ' ' || e.key === 'Enter') return
      }
      const k = e.key.toLowerCase()
      if (k === 'k' || e.key === 'ArrowDown') {
        e.preventDefault()
        addDrop()
      } else if (k === 'm') {
        swirl()
      } else if (k === 'p' && !e.repeat) {
        startStream()
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') stopStream()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [phase, addDrop, swirl, startStream, stopStream])

  const finishTitration = () => {
    setRunning(false)
    setFlash(null)
    setPhase('answer')
  }

  const check = () => {
    if (!readInput.trim() || !concInput.trim()) return
    const r = scoreSample(sample, vRef.current, readInput, concInput, indicator === null || indicator === RIGHT_INDICATOR)
    setResult(r)
    setScore((s) => s + r.total)
    setPhase('result')
  }

  const next = () => {
    if (idx + 1 >= samples.length) {
      if (!finished.current) {
        finished.current = true
        onFinish({ score, max: samples.reduce((m, s) => m + sampleMax(s), 0) })
      }
      return
    }
    const n = idx + 1
    setIdx(n)
    vRef.current = 0
    setV(0)
    setPoints([{ v: 0, ph: phAt(samples[n], 0) }])
    setFlash(null)
    setReadInput('')
    setConcInput('')
    setShowHint(false)
    setResult(null)
    setIndicator(null)
    setPhase(firstPhase(samples[n]))
  }

  const holdKeyDown = (e: ReactKeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault()
      startStream()
    }
  }
  const holdKeyUp = (e: ReactKeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      stopStream()
    }
  }

  const mood: Mood =
    phase === 'result' && result
      ? result.total >= 8
        ? 'cheer'
        : result.total >= 4
          ? 'happy'
          : 'sad'
      : phase === 'answer' || phase === 'indicator'
        ? 'think'
        : pink > 0
          ? 'wow'
          : flash
            ? 'wow'
            : 'think'

  const colourText =
    phase === 'indicator'
      ? 'Indikátor ještě chybí.'
      : pink === 0
      ? flash || running
        ? 'Růžová se objevila… a zase mizí.'
        : 'Roztok v baňce je bezbarvý.'
      : pink < 0.8
        ? 'Roztok zůstal světle růžový.'
        : 'Roztok je sytě růžový.'

  return (
    <div className="g-ti">
      <p className="g-ti-instr">
        {acid.chooseIndicator && <>Nejdřív vyber indikátor. Pak </>}
        {acid.chooseIndicator ? 'přidávej' : 'Přidávej'} NaOH z byrety, dokud roztok v baňce nezůstane <strong>slabě růžový</strong>. Pak
        odečti objem a spočítej c(<Md text={acid.formula} />).
      </p>

      <div className="g-ti-hud">
        <span className="chip chip-soft" title={level ? `Vzorky z úrovně ${level}` : 'Vzorky ze všech úrovní'}>
          <Icon name="book" /> {level ? `Úroveň ${level}` : `Vše · úroveň ${levelOfAcid(sample.acid)}`}
        </span>
        <span className="chip">
          <Icon name="flask" /> Vzorek {idx + 1}/{samples.length}
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
        <span className="chip chip-soft">c(NaOH) = {fmt(C_NAOH, 3)} mol/dm³</span>
        <span className="chip chip-soft">
          <span>
            V(<Md text={acid.formula} />) = {fmt(V_SAMPLE, 1)} cm³
          </span>
        </span>
      </div>

      <div className="g-ti-lab">
        <div className="g-ti-rig">
          <svg
            className="g-ti-app"
            viewBox="0 0 140 545"
            role="img"
            aria-label={`Byreta s hydroxidem sodným nad titrační baňkou. ${colourText}`}
          >
            <defs>
              <clipPath id="g-ti-flask-clip">
                <path d="M60 382 V420 L16 526 Q13 535 22 535 H118 Q127 535 124 526 L80 420 V382 Z" />
              </clipPath>
            </defs>

            {/* burette */}
            <rect x="58" y="6" width="24" height="344" rx="3" className="g-ti-tube" />
            <rect
              x="60"
              y={SCALE_TOP + v * PX_PER_CM3}
              width="20"
              height={Math.max(0, 342 - (SCALE_TOP + v * PX_PER_CM3) + 6)}
              className="g-ti-naoh"
            />
            <path
              d={`M60 ${SCALE_TOP + v * PX_PER_CM3} q10 5 20 0`}
              className="g-ti-meniscus"
            />
            {Array.from({ length: BURETTE_MAX + 1 }, (_, i) => (
              <line
                key={i}
                x1={i % 5 === 0 ? 58 : 66}
                x2="82"
                y1={SCALE_TOP + i * PX_PER_CM3}
                y2={SCALE_TOP + i * PX_PER_CM3}
                className={i % 5 === 0 ? 'g-ti-tick major' : 'g-ti-tick'}
              />
            ))}
            {Array.from({ length: BURETTE_MAX / 5 + 1 }, (_, i) => (
              <text key={i} x="53" y={SCALE_TOP + i * 5 * PX_PER_CM3 + 3.5} className="g-ti-label" textAnchor="end">
                {i * 5}
              </text>
            ))}
            <path d="M58 350 L64 362 H76 L82 350" className="g-ti-tube" />
            <path d="M67 362 V368 M73 362 V368 M67 374 L69 392 H71 L73 374" className="g-ti-tip" />

            {/* stopcock */}
            <motion.g
              key={`c${dropKey}`}
              animate={{ rotate: running ? 90 : dropKey > 0 ? [null, 90, 0] : 0 }}
              transition={running ? spring.snappy : { duration: 0.3 }}
            >
              <rect x="50" y="368" width="40" height="6" rx="3" className="g-ti-cock-handle" />
              <circle cx="70" cy="371" r="6" className="g-ti-cock-body" />
            </motion.g>

            {/* falling drop / stream */}
            {running && (
              <motion.rect
                x="68.5"
                y={TIP_Y}
                width="3"
                height={levelY(v) - TIP_Y}
                className="g-ti-stream"
                style={{ originY: 0 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.15 }}
              />
            )}
            {dropKey > 0 && !running && (
              <motion.path
                key={`d${dropKey}`}
                className="g-ti-drop"
                d={`M70 ${TIP_Y} q-3.5 6 0 8 q3.5 -2 0 -8 z`}
                initial={{ y: 0, opacity: 0.85 }}
                animate={{ y: levelY(v) - TIP_Y - 6, opacity: [0.85, 0.85, 0] }}
                transition={{ duration: 0.4, ease: [0.55, 0, 1, 0.45], times: [0, 0.85, 1] }}
              />
            )}

            {/* flask */}
            <motion.g
              key={`sw${swirlKey}`}
              style={{ originX: 0.5, originY: 1 }}
              animate={swirlKey ? { rotate: [0, -5, 4, -2, 0] } : undefined}
              transition={{ duration: 0.7 }}
            >
              <g clipPath="url(#g-ti-flask-clip)">
                <motion.g initial={false} animate={{ y: levelY(v) - levelY(0) }} transition={spring.gentle}>
                  <rect x="0" y={levelY(0)} width="140" height="200" className="g-ti-liquid" />
                  <motion.rect
                    x="0"
                    y={levelY(0)}
                    width="140"
                    height="200"
                    style={{ fill: PINK }}
                    initial={false}
                    animate={{ opacity: pink * 0.72 }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.g>
                {flash && (
                  <motion.ellipse
                    key={flash.id}
                    cx="70"
                    cy={levelY(v) + 16}
                    rx="16"
                    ry="10"
                    style={{ fill: PINK }}
                    initial={{ opacity: 0.95, scale: 0.4 }}
                    animate={{ opacity: [0.95, 0.85, 0], scale: [0.4, 1, 2.6] }}
                    transition={{ duration: flash.dur / 1000, times: [0, 0.2, 1], ease: 'easeOut' }}
                    onAnimationComplete={() => setFlash((f) => (f && f.id === flash.id ? null : f))}
                  />
                )}
                {running && pink === 0 && (
                  <ellipse cx="70" cy={levelY(v) + 14} rx="14" ry="9" className="g-ti-plume" style={{ fill: PINK }} />
                )}
                <path d={`M0 ${levelY(v)} H140`} className="g-ti-surface" />
              </g>
              <path
                d="M60 382 V420 L16 526 Q13 535 22 535 H118 Q127 535 124 526 L80 420 V382"
                className="g-ti-glass"
              />
              <path d="M56 380 H84" className="g-ti-glass" />
              <text x="70" y="499" textAnchor="middle" className="g-ti-flask-label">
                {acid.plain} +
              </text>
              <text x="70" y="511" textAnchor="middle" className="g-ti-flask-label">
                {indicator || !acid.chooseIndicator ? INDICATORS[RIGHT_INDICATOR].name : 'indikátor?'}
              </text>
            </motion.g>
          </svg>
        </div>

        <div className="g-ti-side">
          <div className="g-ti-status card-flat">
            <Mascot mood={mood} size={56} />
            <div>
              <div className="g-ti-colour">
                <span className="g-ti-swatch" aria-hidden="true">
                  <motion.span
                    style={{ background: PINK }}
                    initial={false}
                    animate={{ opacity: Math.max(pink * 0.72, flash || running ? 0.35 : 0) }}
                    transition={{ duration: 0.5 }}
                  />
                </span>
                {colourText}
              </div>
              {phase === 'titrate' && <p className="note g-ti-tip-note">{tipFor(pink, flash !== null)}</p>}
            </div>
          </div>

          <Lens v={v} />
          <Curve key={idx} sample={sample} points={points} v={v} ph={ph} />
        </div>
      </div>

      {phase === 'indicator' && (
        <IndicatorPick
          acidName={acid.name}
          picked={indicator}
          onPick={(id) => setIndicator((cur) => cur ?? id)}
          explain={indicator ? indicatorExplain(sample.acid, indicator) : ''}
          onStart={() => setPhase('titrate')}
        />
      )}

      {phase === 'titrate' && (
        <div className="g-ti-controls">
          <div className="g-ti-buttons">
            <button type="button" className="btn btn-primary btn-lg" onClick={addDrop} disabled={empty || running}>
              <Icon name="flask" /> Kapka
              <span className="g-ti-small">0,05 cm³</span>
            </button>
            <button
              type="button"
              className={`btn btn-lg g-ti-hold${running ? ' on' : ''}`}
              disabled={empty}
              aria-pressed={running}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                startStream()
              }}
              onPointerUp={stopStream}
              onPointerCancel={stopStream}
              onLostPointerCapture={stopStream}
              onKeyDown={holdKeyDown}
              onKeyUp={holdKeyUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Icon name="bolt" /> Proud
              <span className="g-ti-small">drž</span>
            </button>
            <button type="button" className="btn btn-lg" onClick={swirl}>
              <Icon name="refresh" /> Zamíchat
            </button>
          </div>
          <button type="button" className="btn btn-good btn-block" onClick={finishTitration} disabled={v === 0 || running}>
            <Icon name="check" /> Hotovo, ukončit titraci
          </button>
          <p className="g-ti-keys muted">Klávesy: K nebo ↓ kapka, drž P proud, M zamíchat</p>
        </div>
      )}

      {phase === 'answer' && (
        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="g-ti-answer card"
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
        >
          <div className="eyebrow">Výpočet</div>
          <p>
            Odečti na byretě, kolik NaOH jsi spotřeboval(a), a spočítej koncentraci kyseliny. Desetinná čárka je v pořádku.
          </p>
          <div className="g-ti-fields">
            <label className="g-ti-field">
              <span>
                V(NaOH) <span className="muted">(odečti na byretě)</span>
              </span>
              <span className="g-ti-input-row">
                <input
                  className="g-ti-input"
                  inputMode="decimal"
                  autoComplete="off"
                  value={readInput}
                  onChange={(e) => setReadInput(e.target.value)}
                  placeholder="0,00"
                  autoFocus
                />
                <span className="g-ti-unit">cm³</span>
              </span>
            </label>
            <label className="g-ti-field">
              <span>
                c(<Md text={acid.formula} />)
              </span>
              <span className="g-ti-input-row">
                <input
                  className="g-ti-input"
                  inputMode="decimal"
                  autoComplete="off"
                  value={concInput}
                  onChange={(e) => setConcInput(e.target.value)}
                  placeholder="0,000"
                />
                <span className="g-ti-unit">mol/dm³</span>
              </span>
            </label>
          </div>
          {showHint ? (
            <motion.div className="g-ti-hint" variants={fadeUp} initial="hidden" animate="show">
              <Md
                text={
                  acid.ratio === 1
                    ? `${acid.equation}: reagují v poměru 1 : 1, takže n(${acid.formula}) = n(NaOH).`
                    : `${acid.equation}: poměr 1 : 2, takže n(${acid.formula}) = n(NaOH) / 2.`
                }
              />
              <div className="g-ti-formula">
                <Md
                  text={
                    acid.ratio === 1
                      ? `c(${acid.formula}) = c(NaOH) · V(NaOH) / V(${acid.formula}) = ${fmt(C_NAOH, 3)} · V / ${fmt(V_SAMPLE, 1)}`
                      : `c(${acid.formula}) = c(NaOH) · V(NaOH) / (2 · V(${acid.formula})) = ${fmt(C_NAOH, 3)} · V / (2 · ${fmt(V_SAMPLE, 1)})`
                  }
                />
              </div>
            </motion.div>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm g-ti-hint-btn" onClick={() => setShowHint(true)}>
              <Icon name="bulb" /> Nápověda
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-lg" disabled={!readInput.trim() || !concInput.trim()}>
            Zkontrolovat
          </button>
        </motion.form>
      )}

      {phase === 'result' && result && (
        <motion.div
          className={`g-ti-result card ${result.total >= 6 ? 'ok' : 'bad'}`}
          role="status"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={result.total >= 6 ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: shake.x }}
          transition={{ default: spring.bouncy, x: shake.transition }}
        >
          <div className="g-ti-result-head">
            <span className="g-ti-points">+{result.total} b.</span>
            <span className="muted">z {result.max}</span>
          </div>
          <motion.ul className="g-ti-lines" variants={stagger(0.12, 0.15)} initial="hidden" animate="show">
            {acid.chooseIndicator && (
              <ResultLine ok={result.indicator > 0} pts={result.indicator} max={2}>
                {result.indicator > 0
                  ? 'Indikátor jsi vybral(a) správně: fenolftalein.'
                  : 'Methyloranž by zežloutla dávno před bodem ekvivalence. Správně je fenolftalein.'}
              </ResultLine>
            )}
            <ResultLine ok={result.endpoint >= 4} pts={result.endpoint} max={5}>
              Bod ekvivalence byl při <strong>{fmt(equivalenceVolume(sample), 2)} cm³</strong>, ty jsi skončil(a) na{' '}
              <strong>{fmt(v, 2)} cm³</strong>
              {deltaText(result.delta)}
            </ResultLine>
            <ResultLine ok={result.readingOk} pts={result.reading} max={2}>
              {result.readingOk ? 'Byretu jsi odečetl(a) správně.' : `Na byretě bylo ${fmt(v, 2)} cm³.`}
            </ResultLine>
            <ResultLine ok={result.calcOk} pts={result.calc} max={3}>
              {result.calcOk ? 'Výpočet sedí!' : result.ratioSlip ? 'Pozor na poměr 1 : 2!' : 'Výpočet nesedí.'} Skutečně: c(
              <Md text={acid.formula} />) = <strong>{fmt(sample.c, 4)} mol/dm³</strong>
              {result.ratioSlip && <> Na 1 mol kyseliny sírové spotřebuješ 2 mol NaOH, proto se dělí dvěma.</>}
            </ResultLine>
          </motion.ul>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={next} autoFocus>
            {idx + 1 >= samples.length ? 'Zobrazit výsledky' : 'Další vzorek'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}

/** Choose the indicator before titrating a weak acid. */
function IndicatorPick({
  acidName,
  picked,
  onPick,
  explain,
  onStart,
}: {
  acidName: string
  picked: IndicatorId | null
  onPick: (id: IndicatorId) => void
  explain: string
  onStart: () => void
}) {
  const ok = picked === RIGHT_INDICATOR
  return (
    <motion.div className="g-ti-ind card" variants={fadeUp} initial="hidden" animate="show">
      <div className="eyebrow">Volba indikátoru</div>
      <p>
        V baňce je <strong>{acidName}</strong>, slabá kyselina. Kterým indikátorem poznáš bod ekvivalence?
      </p>
      <div className="g-ti-ind-opts" role="group" aria-label="Indikátory">
        {INDICATOR_CHOICE.map((id, i) => {
          const ind = INDICATORS[id]
          const right = picked !== null && id === RIGHT_INDICATOR
          const wrong = picked === id && id !== RIGHT_INDICATOR
          return (
            <motion.button
              key={id}
              type="button"
              className={`g-ti-ind-opt${right ? ' right' : ''}${wrong ? ' wrong' : ''}`}
              onClick={() => onPick(id)}
              disabled={picked !== null}
              initial={{ opacity: 0, y: 12 }}
              animate={
                wrong
                  ? { opacity: 1, y: 0, x: shake.x, transition: shake.transition }
                  : right
                    ? { opacity: 1, y: 0, scale: bump.scale, transition: bump.transition }
                    : { opacity: 1, y: 0, transition: { ...spring.snappy, delay: 0.05 + i * 0.06 } }
              }
              whileTap={picked ? undefined : { scale: 0.97 }}
            >
              <span className="g-ti-ind-swatch" aria-hidden="true">
                <span style={{ background: id === 'fenolftalein' ? 'transparent' : '#d7263d' }} />
                <span style={{ background: id === 'fenolftalein' ? PINK : '#f5c518' }} />
              </span>
              <span className="g-ti-ind-text">
                <strong>{ind.name}</strong>
                <span className="muted">
                  pH {fmt(ind.from, 1)}–{fmt(ind.to, 1)}, {ind.colours}
                </span>
              </span>
              {(right || wrong) && (
                <motion.span className="g-ti-ind-icon" variants={popIn} initial="hidden" animate="show">
                  <Icon name={right ? 'check' : 'x'} />
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence>
        {picked && (
          <motion.div className="g-ti-ind-after" variants={fadeUp} initial="hidden" animate="show">
            <p className={`g-ti-ind-explain ${ok ? 'ok' : 'bad'}`} role="status">
              <Icon name={ok ? 'check' : 'alert'} />
              <span>
                <Md text={explain} />
              </span>
            </p>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={onStart} autoFocus>
              Začít titrovat s fenolftaleinem <Icon name="arrowRight" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function tipFor(pink: number, flashing: boolean): string {
  if (pink > 0) return 'Růžová vydržela, můžeš skončit!'
  if (flashing) return 'Zamíchej. Mizí růžová pomaleji? Jsi blízko.'
  return 'Zpočátku klidně proudem, pak po kapkách.'
}

function deltaText(d: number): string {
  if (Math.abs(d) < 0.005) return ', přesně!'
  if (d > 0) return ` (o ${fmt(d, 2)} cm³ víc).`
  return ` (o ${fmt(-d, 2)} cm³ méně, roztok nezrůžověl).`
}

function ResultLine({ ok, pts, max, children }: { ok: boolean; pts: number; max: number; children: ReactNode }) {
  return (
    <motion.li className={ok ? 'ok' : 'bad'} variants={rise}>
      <span className="g-ti-line-icon">
        <Icon name={ok ? 'check' : 'x'} />
      </span>
      <span className="g-ti-line-text">{children}</span>
      <span className="g-ti-line-pts">
        {pts}/{max}
      </span>
    </motion.li>
  )
}

/** Magnified burette around the meniscus: 0,1 cm³ ticks. */
function Lens({ v }: { v: number }) {
  const S = 40 // px per cm³
  const H = 120
  const centre = H / 2
  const from = Math.max(0, Math.floor((v - 2) * 10))
  const to = Math.min(BURETTE_MAX * 10, Math.ceil((v + 2) * 10))
  const ticks: number[] = []
  for (let i = from; i <= to; i++) ticks.push(i)
  const y = (x: number) => centre + (x - v) * S
  return (
    <div className="g-ti-lens">
      <div className="g-ti-lens-label">Byreta zblízka</div>
      <svg viewBox={`0 0 160 ${H}`} role="img" aria-label="Zvětšená stupnice byrety u menisku">
        <rect x="40" y="-2" width="80" height={H + 4} className="g-ti-lens-tube" />
        <rect x="41" y={centre} width="78" height={H} className="g-ti-naoh" />
        <path d={`M41 ${centre - 1} Q80 ${centre + 9} 119 ${centre - 1}`} className="g-ti-lens-meniscus" />
        {ticks.map((i) => {
          const major = i % 10 === 0
          const half = i % 5 === 0
          return (
            <g key={i}>
              <line x1="40" x2={major ? 84 : half ? 72 : 62} y1={y(i / 10)} y2={y(i / 10)} className={`g-ti-lens-tick${major ? ' major' : ''}`} />
              {major && (
                <text x="90" y={y(i / 10) + 5} className="g-ti-lens-num">
                  {i / 10}
                </text>
              )}
            </g>
          )
        })}
        <path d={`M4 ${centre} h28 m-6 -5 l6 5 -6 5`} className="g-ti-lens-eye" />
      </svg>
    </div>
  )
}

/** Live titration curve pH = f(V). */
function Curve({ sample, points, v, ph }: { sample: Sample; points: Point[]; v: number; ph: number }) {
  const half = halfEquivalence(sample)
  const reached = half !== null && v >= half.v - 1e-9
  const W = 260
  const H = 150
  const L = 30
  const B = 24
  const xmax = v > 35 ? 50 : 40
  const x = (vv: number) => L + (vv / xmax) * (W - L - 8)
  const y = (p: number) => H - B - (p / 14) * (H - B - 8)
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.v).toFixed(1)} ${y(p.ph).toFixed(1)}`).join(' ') + ` L${x(v).toFixed(1)} ${y(ph).toFixed(1)}`
  return (
    <div className="g-ti-curve">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Titrační křivka, aktuálně pH ${fmt(ph, 1)}${half && reached ? `. V polovině titrace bylo pH = pKa = ${fmt(half.pKa, 2)}` : ''}`}
      >
        <rect x={L} y={y(10)} width={W - L - 8} height={y(PINK_FROM) - y(10)} className="g-ti-band" style={{ fill: PINK }} />
        {half && (
          <>
            <rect
              x={L}
              y={y(INDICATORS.methyloranz.to)}
              width={W - L - 8}
              height={y(INDICATORS.methyloranz.from) - y(INDICATORS.methyloranz.to)}
              className="g-ti-band"
              style={{ fill: ORANGE }}
            />
            <text x={W - 10} y={y(INDICATORS.methyloranz.to) + 9} textAnchor="end" className="g-ti-axis small">
              methyloranž
            </text>
          </>
        )}
        <text x={W - 10} y={y(10) + 9} textAnchor="end" className="g-ti-axis small">
          fenolftalein
        </text>
        {[0, 7, 14].map((p) => (
          <g key={p}>
            <line x1={L} x2={W - 8} y1={y(p)} y2={y(p)} className="g-ti-grid" />
            <text x={L - 6} y={y(p) + 4} textAnchor="end" className="g-ti-axis">
              {p}
            </text>
          </g>
        ))}
        {Array.from({ length: xmax / 10 + 1 }, (_, i) => (
          <text key={i} x={x(i * 10)} y={H - 8} textAnchor="middle" className="g-ti-axis">
            {i * 10}
          </text>
        ))}
        <line x1={L} x2={L} y1={y(14)} y2={y(0)} className="g-ti-axisline" />
        <line x1={L} x2={W - 8} y1={y(0)} y2={y(0)} className="g-ti-axisline" />
        <AnimatePresence>
          {half && reached && (
            <motion.g key="half" className="g-ti-half" variants={popIn} initial="hidden" animate="show">
              <line x1={x(half.v)} x2={x(half.v)} y1={y(0)} y2={y(half.pKa)} className="g-ti-half-line" />
              <line x1={L} x2={x(half.v)} y1={y(half.pKa)} y2={y(half.pKa)} className="g-ti-half-line" />
              <circle cx={x(half.v)} cy={y(half.pKa)} r="3.5" className="g-ti-half-dot" />
              <text x={x(half.v) + 6} y={y(half.pKa) - 6} className="g-ti-axis small g-ti-half-label">
                ½ V: pH = pKₐ = {fmt(half.pKa, 2)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <motion.path d={d} className="g-ti-line" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ease.out }} />
        <motion.circle
          r="4.5"
          className="g-ti-dot"
          initial={false}
          animate={{ cx: x(v), cy: y(ph) }}
          transition={spring.snappy}
        />
        <text x={W - 8} y={H - 8 - 12} textAnchor="end" className="g-ti-axis small">
          V(NaOH) / cm³
        </text>
        <text x={L + 6} y={y(14) + 10} className="g-ti-axis small">
          pH
        </text>
      </svg>
    </div>
  )
}
