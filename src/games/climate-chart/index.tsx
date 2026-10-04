import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Md } from '../../core/markup'
import { ClimateView } from '../../illustrations/geography/ClimateView'
import { MONTHS, MONTHS_ROMAN, czn } from '../../illustrations/geography/charts'
import { Icon } from '../../ui/Icon'
import { Mascot, type Mood } from '../../ui/Mascot'
import { popIn, spring } from '../../ui/motion'
import { Feedback, Hud, PointsPop } from '../shared/GameKit'
import { useFinishOnce, useJolt, useNow } from '../shared/hooks'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { STATION_BY_ID } from './data'
import type { TaskKind } from './levels'
import { checkNumber, makeRound, playedLevel, toPlace, type ChoiceTask, type MonthTask, type NumberTask } from './logic'
import './climate-chart.css'

const BONUS_MAX = 25
const PER_TASK = 100 + BONUS_MAX
const WINDOW: Record<TaskKind, [number, number]> = {
  warmest: [6, 25],
  coldest: [6, 25],
  wettest: [6, 25],
  range: [12, 45],
  dry: [12, 45],
  total: [12, 45],
  place: [10, 40],
  biome: [10, 40],
  region: [10, 40],
  hemisphere: [6, 25],
  koppen: [15, 60],
  season: [12, 45],
  ocean: [12, 45],
  irrigation: [12, 45],
  'irrig-pair': [12, 45],
}
const EYEBROW: Record<TaskKind, string> = {
  warmest: 'Čtení klimatogramu',
  coldest: 'Čtení klimatogramu',
  wettest: 'Čtení klimatogramu',
  range: 'Roční amplituda',
  dry: 'Suché období',
  total: 'Roční srážky',
  place: 'Poznej místo',
  biome: 'Krajinný pás',
  region: 'Oblast světa',
  hemisphere: 'Polokoule',
  koppen: 'Podnebný typ',
  season: 'Kdy prší',
  ocean: 'Moře a pevnina',
  irrigation: 'Zavlažování',
  'irrig-pair': 'Zavlažování',
}

type Msg = { kind: 'good' | 'bad' | 'warn' | 'info'; text: string }
type Done = { points: number; ok: boolean } | null

export default function ClimateChartGame({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const [i, setI] = useState(0)
  const [done, setDone] = useState<Done>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [msgN, setMsgN] = useState(0)
  const [score, setScore] = useState(0)
  const [start, setStart] = useState(() => Date.now())
  const [frozen, setFrozen] = useState(0)
  const scoreRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const finish = useFinishOnce(onFinish)
  const [cardRef, jolt] = useJolt()
  const now = useNow(!done, 250)

  const t = tasks[i]
  const secs = done ? frozen : Math.max(0, (now - start) / 1000)
  const [full, zero] = WINDOW[t.kind]
  const bonusNow = timeBonus(secs, BONUS_MAX, full, zero)
  const elapsed = () => (Date.now() - start) / 1000

  const say = (kind: Msg['kind'], s: string) => {
    setMsg({ kind, text: s })
    setMsgN((n) => n + 1)
  }
  const end = (points: number, ok: boolean) => {
    scoreRef.current += points
    setScore(scoreRef.current)
    setFrozen(elapsed())
    setDone({ points, ok })
    if (ok) jolt.pop()
    else jolt.shake()
  }

  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    end(ok ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 0, ok)
    const right = c.options.find((o) => o.id === c.answer)!.label
    say(ok ? 'good' : 'bad', ok ? `Správně! ${c.why}` : `Správně je: ${right}. ${c.why}`)
  }

  const chooseMonth = (m: MonthTask, k: number) => {
    if (done) return
    setPicked(String(k))
    const ok = m.answer.includes(k)
    end(ok ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 0, ok)
    say(ok ? 'good' : 'bad', ok ? `Správně! ${m.why}` : `${MONTHS[k][0].toUpperCase() + MONTHS[k].slice(1)} to není. ${m.why}`)
  }

  const submit = (n: NumberTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const r = checkNumber(text, n)
    if (r.kind === 'invalid') return say('info', n.unit === 'měs.' ? 'Napiš počet měsíců, třeba 3.' : 'Napiš číslo, třeba 12,5.')
    const right = `${czn(n.value, n.digits)}${n.unit === 'měs.' ? '' : `\u00a0${n.unit}`}`
    if (r.kind === 'ok') {
      end(tries === 0 ? 100 + timeBonus(elapsed(), BONUS_MAX, full, zero) : 50, true)
      say('good', `Správně${n.tol ? ` (přesně ${right})` : ''}! ${n.why}`)
      return
    }
    if (tries === 0) {
      setTries(1)
      jolt.shake()
      say(
        'bad',
        n.kind === 'dry'
          ? `${czn(r.value)} to není. Projdi měsíce jeden po druhém: je tečka teploty nad sloupcem? (10 °C na levé ose = 20 mm na pravé.)`
          : `${czn(r.value)} ${n.unit} to není. Najdi nejvyšší a nejnižší bod teplotní křivky a odečti je – pozor na mínus.`,
      )
      inputRef.current?.select()
    } else {
      end(0, false)
      say('warn', `Ani to ne. Správně je ${right}. ${n.why}`)
    }
  }
  const giveUp = (n: NumberTask) => {
    end(0, false)
    say('info', `Nevadí. Správně je ${czn(n.value, n.digits)} ${n.unit === 'měs.' ? '' : n.unit}. ${n.why}`)
  }

  const next = () => {
    if (i + 1 >= tasks.length) {
      finish({ score: scoreRef.current, max: tasks.length * PER_TASK })
      return
    }
    setI(i + 1)
    setDone(null)
    setPicked(null)
    setText('')
    setTries(0)
    setMsg(null)
    setStart(Date.now())
  }

  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : tries ? 'think' : 'happy'
  const places = t.stations.map((id) => toPlace(STATION_BY_ID[id]))
  const hiddenNames = t.stations.length > 1 ? ['Místo A', 'Místo B'] : ['Neznámé místo']
  const names = done ? t.stations.map((id, k) => (t.stations.length > 1 ? `${'AB'[k]}: ${STATION_BY_ID[id].name}` : STATION_BY_ID[id].name)) : t.hideName ? hiddenNames : undefined

  return (
    <div className="g-sh-root g-cc">
      <p className="g-sh-instr">
        Klimatogram ukazuje průměrnou teplotu (červená křivka, levá osa) a srážky (modré sloupce, pravá osa) v každém měsíci. 10 °C odpovídá 20 mm: kde je křivka nad sloupcem, je sucho.
      </p>
      <Hud score={score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={secs} level={level ?? 'mix'} />

      <div ref={cardRef} className="card g-cc-card">
        <div className="g-cc-top">
          <div className="g-cc-q">
            <span className="eyebrow">
              {EYEBROW[t.kind]}
              {level === undefined ? ` · úroveň ${t.level}` : ''}
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={i} className="g-cc-text" variants={popIn} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <Md text={t.text} />
              </motion.p>
            </AnimatePresence>
          </div>
          <Mascot mood={mood} size={50} />
          {done && done.points > 0 && <PointsPop key={`p${i}`} points={done.points} />}
        </div>

        {!done && (
          <div className="g-cc-bonus" aria-label={`Bonus za rychlost: ${bonusNow} bodů`}>
            <Icon name="bolt" />
            <div className="progress g-cc-bonusbar">
              <span style={{ width: `${(bonusNow / BONUS_MAX) * 100}%`, ['--bar' as string]: 'var(--yellow)' }} />
            </div>
          </div>
        )}

        <div className="g-cc-stage">
          <ClimateView
            key={i}
            places={places}
            names={names}
            stats={!t.hideStats || !!done}
            dry={!t.hideDry || !!done}
            marks={done ? t.marks : undefined}
          />
        </div>

        {t.mode === 'choice' && (
          <div className={`g-cc-options${t.options.length > 4 ? ' many' : ''}${t.options.length === 2 ? ' two' : ''}`} role="group" aria-label="Odpovědi">
            {t.options.map((o) => {
              const state = !done ? '' : o.id === t.answer ? ' right' : o.id === picked ? ' wrong' : ' off'
              return (
                <button key={o.id} type="button" className={`g-cc-option${state}`} disabled={!!done} aria-pressed={picked === o.id} onClick={() => choose(t, o.id)}>
                  {o.label}
                </button>
              )
            })}
          </div>
        )}

        {t.mode === 'month' && (
          <div className="g-cc-months" role="group" aria-label="Měsíce">
            {MONTHS_ROMAN.map((m, k) => {
              const state = !done ? '' : t.answer.includes(k) ? ' right' : String(k) === picked ? ' wrong' : ' off'
              return (
                <button
                  key={m}
                  type="button"
                  className={`g-cc-month${state}`}
                  disabled={!!done}
                  aria-label={MONTHS[k]}
                  aria-pressed={picked === String(k)}
                  onClick={() => chooseMonth(t, k)}
                >
                  {m}
                </button>
              )
            })}
          </div>
        )}

        {t.mode === 'number' && !done && (
          <form className="g-cc-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-cc-field">
              <span className="sr-only">Odpověď{t.unit === 'měs.' ? ' (počet měsíců)' : ` v ${t.unit}`}</span>
              <span className="g-cc-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-cc-input"
                  type="text"
                  inputMode={t.digits ? 'decimal' : 'numeric'}
                  autoComplete="off"
                  placeholder={t.digits ? 'např. 12,5' : 'např. 3'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-cc-unit">{t.unit}</span>
              </span>
            </label>
            <div className="g-sh-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={!text.trim()}>
                <Icon name="check" /> Zkontrolovat
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => giveUp(t)}>
                Nevím
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="g-cc-status" aria-live="polite">
        {msg && (
          <Feedback kind={msg.kind} key={msgN}>
            <Md text={msg.text} />
          </Feedback>
        )}
      </div>

      {done && (
        <motion.div className="g-sh-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring.gentle}>
          <button type="button" className="btn btn-primary btn-lg" onClick={next} autoFocus>
            {i + 1 >= tasks.length ? 'Dokončit' : 'Další úkol'} <Icon name="arrowRight" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
