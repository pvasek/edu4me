import { useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import { levelNum, type GameProps } from '../types'
import { EFFECT_OPTIONS, LEVELS, makeRound, type BuildTask, type Task } from './levels'
import {
  applyChange,
  checkGoal,
  fill,
  label,
  lampIds,
  mapParts,
  parseNum,
  pieceKey,
  power,
  q,
  slotIds,
  solve,
  within,
  type Circuit,
  type Part,
} from './logic'
import { PartSymbol, Schematic, describe, pieceName } from './Schematic'
import './circuit-builder.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
/** Seconds of full bonus / zero bonus per kind of task. */
const BONUS_TIME: Record<Task['kind'], [number, number]> = { meter: [20, 60], bright: [10, 40], change: [10, 40], build: [30, 90] }

const KIND_TITLE: Record<Task['kind'], string> = {
  meter: 'Co ukáže měřidlo?',
  bright: 'Která svítí nejvíc?',
  change: 'Co se stane?',
  build: 'Postav obvod',
}

type Status = 'play' | 'done'
type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }

const unitWord: Record<string, string> = { A: 'ampérech', V: 'voltech', W: 'wattech', 'Ω': 'ohmech' }

export default function CircuitBuilder({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => {
    const n = levelNum(levelId)
    return n !== undefined && LEVELS[n] ? n : undefined
  })
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const task = tasks[i]
  const [status, setStatus] = useState<Status>('play')
  const [tries, setTries] = useState(0)
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Record<string, Part | undefined>>({})
  const [armed, setArmed] = useState<string | null>(null)
  const [view, setView] = useState<'before' | 'after'>('after')
  const [switches, setSwitches] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [pts, setPts] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(status === 'play', 250)
  const secs = status === 'play' ? Math.max(0, (now - start) / 1000) : frozen
  const [full, zero] = BONUS_TIME[task.kind]
  const bonus = tries === 0 ? timeBonus(secs, BONUS_MAX, full, zero) : 0

  const say = (kind: Msg['kind'], t: string) => {
    setMsg({ kind, text: t })
    setMsgN((n) => n + 1)
  }

  const award = (firstTry: boolean) => {
    const t = (Date.now() - start) / 1000
    const p = firstTry ? 100 + timeBonus(t, BONUS_MAX, full, zero) : 50
    scoreRef.current += p
    setScore(scoreRef.current)
    setPts(p)
    return t
  }

  const done = (t = (Date.now() - start) / 1000) => {
    setFrozen(t)
    setStatus('done')
  }

  // ---------------------------------------------------------------- answers

  const submitMeter = (ev?: FormEvent) => {
    ev?.preventDefault()
    if (status !== 'play' || task.kind !== 'meter') return
    const v = parseNum(text)
    if (v === null) {
      say('info', 'Napiš číslo, třeba 1,5. Desetinná čárka i tečka jsou v pořádku.')
      return
    }
    const ans = `${task.symbol} = ${q(task.answer, task.unit)}`
    if (within(v, task.answer)) {
      done(award(tries === 0))
      say('good', `Správně! ${ans}.`)
      jolt.pop()
      return
    }
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      let hint = 'Zkontroluj, co je zapojené za sebou a co vedle sebe, a zkus to znovu.'
      if (within(v, task.answer * 1000) || within(v * 1000, task.answer)) hint = `Pozor na jednotky – odpověď piš v ${unitWord[task.unit]} (${task.unit}).`
      else if (within(-v, task.answer)) hint = 'Pozor na znaménko.'
      say('bad', `${q(v, task.unit)} to není. ${hint}`)
      inputRef.current?.select()
    } else {
      done()
      say('warn', `Ani tentokrát. Správně je ${ans}.`)
    }
  }

  const giveUp = () => {
    if (status !== 'play') return
    done()
    if (task.kind === 'meter') say('info', `Nevadí. Správně je ${q(task.answer, task.unit)}.`)
    if (task.kind === 'build') {
      setPlaced(task.solution)
      say('info', 'Nevadí. Takhle to jde – podívej se, kde je která součástka.')
    }
  }

  const choose = (id: string) => {
    if (status !== 'play' || (task.kind !== 'bright' && task.kind !== 'change')) return
    setPicked(id)
    const ok = id === task.answer
    if (ok) {
      done(award(true))
      jolt.pop()
      say('good', 'Správně!')
    } else {
      done()
      jolt.shake()
      say('bad', `Kdepak. Správně: ${task.kind === 'bright' ? optionText(task.answer) : `${label(task.target)} ${EFFECT_OPTIONS.find((o) => o.id === task.answer)!.text}`}.`)
    }
    setView('after')
  }

  const pieces = task.kind === 'build' ? task.pieces : []
  const slots = task.kind === 'build' ? slotIds(task.circuit.net) : []
  const inTray = pieces.filter((p) => !Object.values(placed).some((x) => x && pieceKey(x) === pieceKey(p)))
  const allPlaced = task.kind === 'build' && slots.every((s) => placed[s])

  const onSlot = (id: string) => {
    if (status !== 'play') return
    const cur = placed[id]
    if (armed) {
      const p = pieces.find((x) => pieceKey(x) === armed)!
      setPlaced({ ...placed, [id]: p })
      setArmed(null)
    } else if (cur) {
      setPlaced({ ...placed, [id]: undefined })
      setArmed(pieceKey(cur))
    }
  }

  const checkBuild = () => {
    if (status !== 'play' || task.kind !== 'build' || !allPlaced) return
    const r = checkGoal(fill(task.circuit, placed), task.goal)
    if (r.ok) {
      done(award(tries === 0))
      jolt.pop()
      say('good', `Funguje to! ${r.why}`)
      return
    }
    jolt.shake()
    if (tries === 0) {
      setTries(1)
      say('bad', `${r.why} Uprav zapojení a zkus to znovu.`)
    } else {
      done()
      say('warn', `${r.why} Takhle by to šlo:`)
      setPlaced(task.solution)
    }
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setStatus('play')
    setTries(0)
    setText('')
    setPicked(null)
    setPlaced({})
    setArmed(null)
    setView('after')
    setSwitches({})
    setMsg(null)
    setPts(0)
    setStart(Date.now())
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  // ---------------------------------------------------------------- what the schematic shows

  const shown = useMemo(() => {
    let c: Circuit = task.circuit
    if (task.kind === 'build') c = status === 'play' ? c : fill(c, placed)
    if (task.kind === 'change' && status === 'done' && view === 'after') c = applyChange(c, task.change)
    if (Object.keys(switches).length) c = { ...c, net: mapParts(c.net, (p) => (p.t === 'switch' && p.id in switches ? { ...p, closed: switches[p.id] } : p)) }
    return c
  }, [task, status, placed, view, switches])
  const sol = status === 'done' ? solve(shown) : null
  const pRef = useMemo(() => {
    if (status !== 'done') return undefined
    const states = task.kind === 'change' ? [task.circuit, applyChange(task.circuit, task.change)] : [task.kind === 'build' ? fill(task.circuit, placed) : task.circuit]
    return Math.max(1e-9, ...states.flatMap((c) => lampIds(c.net).map((id) => power(solve(c), id))))
  }, [task, status, placed])
  const canToggle = status === 'done' && task.kind !== 'change' && !!sol

  const slotNames = Object.fromEntries(slots.map((s, k) => [s, `Místo ${k + 1}`]))

  const mood: Mood = status === 'done' ? (pts > 0 ? 'cheer' : 'sad') : tries ? 'think' : 'happy'
  const optionText = (id: string) => (id === 'same' ? 'všechny stejně' : label(id))

  return (
    <div className="g-sh-root cb">
      <p className="g-sh-instr">Odpovídej podle schématu. Čísla piš s čárkou i tečkou, tolerance ±2 %. Čím rychleji, tím větší bonus.</p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úloha" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card cb-card">
        <div className="cb-top">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={i} className="cb-q" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <span className="eyebrow">{KIND_TITLE[task.kind]}</span>
              <p className="cb-prompt">
                <Md text={task.prompt} />
              </p>
            </motion.div>
          </AnimatePresence>
          <Mascot mood={mood} size={52} />
          {status === 'done' && pts > 0 && <PointsPop key={`p${i}`} points={pts} />}
        </div>

        <div className="cb-stage">
          <Schematic
            circuit={shown}
            sol={sol}
            lampValues={task.lampValues}
            hideRi={task.kind === 'meter' && task.hideRi}
            given={task.kind === 'meter' ? task.given : undefined}
            pRef={pRef}
            target={task.kind === 'change' ? task.target : undefined}
            label={describe(shown, task.lampValues)}
            slots={
              task.kind === 'build'
                ? { content: placed, armed: !!armed, onSlot, names: slotNames, locked: status !== 'play' }
                : undefined
            }
            onSwitch={canToggle && hasSwitch(shown) ? (id) => setSwitches((s) => ({ ...s, [id]: !(s[id] ?? switchState(shown, id)) })) : undefined}
          />
        </div>

        {task.kind === 'change' && status === 'done' && (
          <div className="g-sh-seg cb-seg" role="group" aria-label="Stav obvodu">
            <button type="button" aria-pressed={view === 'before'} onClick={() => setView('before')}>
              Před
            </button>
            <button type="button" aria-pressed={view === 'after'} onClick={() => setView('after')}>
              Po
            </button>
          </div>
        )}
        {canToggle && hasSwitch(shown) && <p className="cb-hint">Ťukni na spínač a vyzkoušej, co dělá.</p>}

        {status === 'play' && (
          <div className="cb-bonus" aria-label={`Bonus za rychlost: ${bonus} bodů`}>
            <Icon name="bolt" />
            <div className="progress cb-bonusbar">
              <span style={{ width: `${(bonus / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ answer area */}
      {task.kind === 'meter' && status === 'play' && (
        <form className="cb-form" onSubmit={submitMeter}>
          <label className="cb-field">
            <span className="cb-sym">
              <Md text={`${task.symbol} =`} />
            </span>
            <input
              ref={inputRef}
              className="g-sh-input cb-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoFocus
              aria-label={`Výsledek v ${unitWord[task.unit]}`}
              placeholder="např. 1,5"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <span className="cb-unit">{task.unit}</span>
          </label>
          <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </form>
      )}

      {(task.kind === 'bright' || task.kind === 'change') && (
        <div className="cb-opts" role="group" aria-label="Možnosti">
          {(task.kind === 'bright' ? task.options.map((id) => ({ id, text: optionText(id) })) : EFFECT_OPTIONS.map((o) => ({ id: o.id, text: `${label(task.target)} ${o.text}` }))).map((o) => {
            const state = status === 'done' ? (o.id === task.answer ? 'ok' : o.id === picked ? 'bad' : '') : ''
            return (
              <button key={o.id} type="button" className={`btn cb-opt ${state ? `is-${state}` : ''}`} onClick={() => choose(o.id)} disabled={status !== 'play'}>
                {task.kind === 'bright' && o.id !== 'same' && (
                  <svg viewBox="-16 -16 32 32" className="cb-opt-ico" aria-hidden="true">
                    <PartSymbol part={{ t: 'lamp', id: o.id, r: 1 }} cx={0} cy={0} opts={{ bare: true }} />
                  </svg>
                )}
                {o.text}
                {state === 'ok' && <Icon name="check" />}
                {state === 'bad' && <Icon name="x" />}
              </button>
            )
          })}
        </div>
      )}

      {task.kind === 'build' && status === 'play' && <BuildTray task={task} tray={inTray} armed={armed} setArmed={setArmed} />}
      {task.kind === 'build' && status === 'play' && (
        <div className="g-sh-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={checkBuild} disabled={!allPlaced}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn" onClick={() => (setPlaced({}), setArmed(null))} disabled={!Object.values(placed).some(Boolean)}>
            <Icon name="refresh" /> Vyprázdnit
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </div>
      )}

      <div className="cb-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {status === 'done' && (
        <motion.div className="card-flat cb-why" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <p>
            <Icon name="bulb" className="cb-why-ico" /> <Md text={task.explain} />
          </p>
          <div className="g-sh-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
              {i + 1 >= tasks.length ? 'Dokončit' : 'Další úloha'} <Icon name="arrowRight" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function hasSwitch(c: Circuit) {
  let found = false
  mapParts(c.net, (p) => {
    if (p.t === 'switch') found = true
    return p
  })
  return found
}

function switchState(c: Circuit, id: string) {
  let closed = true
  mapParts(c.net, (p) => {
    if (p.t === 'switch' && p.id === id) closed = p.closed
    return p
  })
  return closed
}

const LEAD: Record<Part['t'], number> = { lamp: 12, res: 16, switch: 14, A: 12, V: 12, wire: 0, slot: 0 }

function BuildTray({ task, tray, armed, setArmed }: { task: BuildTask; tray: Part[]; armed: string | null; setArmed: (k: string | null) => void }) {
  return (
    <div className="cb-tray">
      <span className="cb-tray-label">{armed ? 'Teď ťukni na volné místo ve schématu' : tray.length ? 'Vyber součástku' : 'Vše je rozmístěné'}</span>
      <div className="cb-tray-row" role="group" aria-label="Součástky">
        {task.pieces.map((p) => {
          const k = pieceKey(p)
          const free = tray.some((x) => pieceKey(x) === k)
          if (!free && armed !== k) return null
          return (
            <button key={k} type="button" className="btn cb-piece" aria-pressed={armed === k} onClick={() => setArmed(armed === k ? null : k)}>
              <svg viewBox="-20 -14 40 28" className="cb-piece-ico" aria-hidden="true">
                {p.t === 'wire' ? (
                  <line x1={-18} y1={0} x2={18} y2={0} className="cb-stroke" />
                ) : (
                  <>
                    <line x1={-19} y1={0} x2={-LEAD[p.t]} y2={0} className="cb-stroke" />
                    <line x1={LEAD[p.t]} y1={0} x2={19} y2={0} className="cb-stroke" />
                    <PartSymbol part={p} cx={0} cy={0} opts={{ bare: true }} />
                  </>
                )}
              </svg>
              <span>{pieceName(p)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
