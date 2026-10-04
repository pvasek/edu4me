import { useRef, useState, type FormEvent } from 'react'
import type { MapLayer } from '../../core/types'
import { Icon } from '../../ui/Icon'
import type { Mood } from '../../ui/Mascot'
import { BONUS_MAX, BonusBar, MapStage, NextButton, Options, Status, TaskHead, useRound } from '../blind-map/MapKit'
import { Hud } from '../shared/GameKit'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { checkTyped, hm, makeRound, playedLevel, type ChoiceTask, type MinutesTask, type Task, type TimeTask } from './logic'
import './time-zones.css'

const WINDOW: Record<Task['type'], [number, number]> = { choice: [10, 40], time: [15, 60], minutes: [15, 60] }
const LAYERS: MapLayer[] = ['timezones']

/** Časová pásma: local solar time, zone time, flights and the date line (spec/courses/zemepis/games.md, level 2). */
export default function TimeZones({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const r = useRound<Task>(tasks, onFinish)
  const { t, done, i } = r
  const [picked, setPicked] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [tries, setTries] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const win = WINDOW[t.type]
  const bonusNow = timeBonus(r.secs, BONUS_MAX, win[0], win[1])

  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    const right = c.options.find((o) => o.id === c.answer)!.label
    r.end(ok ? r.points(win) : 0, ok, ok ? 'good' : 'bad', ok ? `Správně! ${c.why}` : `Správně je ${right}. ${c.why}`)
  }

  const shown = (n: TimeTask | MinutesTask) => (n.type === 'time' ? hm(n.answer) : `${n.answer} min`)
  const submit = (n: TimeTask | MinutesTask, ev?: FormEvent) => {
    ev?.preventDefault()
    if (done) return
    const c = checkTyped(n, text)
    if (c.kind === 'invalid') return r.say('info', n.type === 'time' ? 'Napiš čas jako hodiny a minuty, třeba 14:30 nebo 14.30.' : 'Napiš počet minut, třeba 12.')
    if (c.kind === 'ok') return r.end(tries === 0 ? r.points(win) : 50, true, 'good', `Správně, ${shown(n)}. ${n.why}`)
    if (tries === 0) {
      setTries(1)
      r.jolt.shake()
      r.say('bad', n.type === 'time' ? `${hm(c.value)} to není. Kolik stupňů je mezi poledníky? Každý stupeň jsou 4 minuty; na východě je později.` : `${c.value} min to není. Spočítej rozdíl délek a vynásob ho čtyřmi.`)
      inputRef.current?.select()
    } else r.end(0, false, 'warn', `Ani to ne. Správně je ${shown(n)}. ${n.why}`)
  }
  const giveUp = (n: TimeTask | MinutesTask) => r.end(0, false, 'info', `Nevadí. Správně je ${shown(n)}. ${n.why}`)

  const next = () => {
    setPicked(null)
    setText('')
    setTries(0)
    r.next()
  }
  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : tries ? 'think' : 'happy'

  return (
    <div className="g-sh-root g-mk g-tz">
      <p className="g-sh-instr">Země se otočí o 15° za hodinu, takže 1° délky = 4 minuty. Pásmový čas se počítá od UTC; na východ hodin přibývá, na západ ubývá.</p>
      <Hud score={r.score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={r.secs} level={level ?? 'mix'} />
      <div ref={r.cardRef} className="card g-mk-card">
        <TaskHead eyebrow={t.eyebrow} k={i} mood={mood} done={done}>
          {t.text}
        </TaskHead>
        {!done && <BonusBar value={bonusNow} />}
        {t.type !== 'minutes' && <MapStage key={i} view="world" layers={LAYERS} points={t.points} routes={t.routes} />}
        {t.type === 'choice' && <Options options={t.options} answer={t.answer} picked={picked} done={!!done} onPick={(id) => choose(t, id)} />}
        {t.type !== 'choice' && !done && (
          <form className="g-tz-form" onSubmit={(e) => submit(t, e)}>
            <label className="g-tz-field">
              <span className="sr-only">{t.type === 'time' ? 'Čas (hodiny a minuty)' : 'Počet minut'}</span>
              <span className="g-tz-inwrap">
                <input
                  ref={inputRef}
                  className="g-sh-input g-tz-input"
                  type="text"
                  inputMode={t.type === 'time' ? 'decimal' : 'numeric'}
                  autoComplete="off"
                  placeholder={t.type === 'time' ? 'např. 14:30' : 'např. 12'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="g-tz-unit">{t.type === 'time' ? 'h' : 'min'}</span>
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
      <Status msg={r.msg} n={r.msgN} />
      {done && <NextButton last={r.last} onClick={next} />}
    </div>
  )
}
