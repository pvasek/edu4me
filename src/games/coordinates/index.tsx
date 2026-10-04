import { useMemo, useState } from 'react'
import { Icon } from '../../ui/Icon'
import type { Mood } from '../../ui/Mascot'
import { distLL, tolUnits } from '../blind-map/hit'
import { BONUS_MAX, BonusBar, MapStage, NextButton, NoTapToggle, Options, Status, TaskHead, useRound, type Mark } from '../blind-map/MapKit'
import { Hud } from '../shared/GameKit'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { coordText, gradePlace, makeRound, playedLevel, TAP_PX, type ChoiceTask, type PlaceTask, type Task } from './logic'

const WINDOW: Record<Task['type'], [number, number]> = { choice: [8, 30], place: [12, 45] }

/** Zeměpisná síť: read and place coordinates, heat zones and the Sun in the zenith (spec/courses/zemepis/games.md). */
export default function Coordinates({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const r = useRound<Task>(tasks, onFinish)
  const { t, done, i } = r
  const [picked, setPicked] = useState<string | null>(null)
  const [tap, setTap] = useState<{ lon: number; lat: number; u: number } | null>(null)
  const [noTap, setNoTap] = useState(false)
  const win = WINDOW[t.type]
  const bonusNow = timeBonus(r.secs, BONUS_MAX, win[0], win[1])

  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    const right = c.options.find((o) => o.id === c.answer)!.label
    r.end(ok ? r.points(win) : 0, ok, ok ? 'good' : 'bad', ok ? `Správně! ${c.why}` : `Správně je: ${right}${right.endsWith('.') ? '' : '.'} ${c.why}`)
  }

  const confirm = (p: PlaceTask) => {
    if (done || !tap) return
    const d = distLL(p.view, [[[p.target.lon, p.target.lat]]], tap.lon, tap.lat)
    const tol = tolUnits(p.view, p.target.lon, p.target.lat, p.tolDeg, TAP_PX, tap.u)
    const g = gradePlace(d, tol)
    const where = `Tvůj špendlík je zhruba na ${coordText(tap.lat, tap.lon)}.`.replace('d..', 'd.')
    if (g === 'hit') r.end(r.points(win), true, 'good', `Přesně tak! ${p.why}`)
    else if (g === 'near') r.end(50, true, 'warn', `Skoro, kousek vedle. ${where} ${p.why}`)
    else r.end(0, false, 'bad', `${where} ${p.why}`)
  }
  const chooseCand = (p: PlaceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = Number(id) === p.candAnswer
    r.end(ok ? r.points(win) : 0, ok, ok ? 'good' : 'bad', ok ? `Správně, místo ${p.candAnswer + 1}. ${p.why}` : `Správně je místo ${p.candAnswer + 1}. ${p.why}`)
  }

  const next = () => {
    setPicked(null)
    setTap(null)
    setNoTap(false)
    r.next()
  }

  const marks = useMemo<Mark[]>(() => {
    const m: Mark[] = t.pins.map((p) => ({ lon: p.lon, lat: p.lat, kind: 'pin', label: p.label }))
    if (t.type === 'place') {
      if (noTap) t.cands.forEach(([lon, lat], k) => m.push({ lon, lat, kind: 'num', n: k + 1 }))
      if (tap && !noTap) m.push({ lon: tap.lon, lat: tap.lat, kind: done && !done.ok ? 'bad' : 'tap' })
    }
    if (done) t.reveal.forEach((p) => m.push({ lon: p.lon, lat: p.lat, kind: 'good', label: p.label }))
    return m
  }, [t, tap, noTap, done])

  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : 'happy'

  return (
    <div className="g-sh-root g-mk">
      <p className="g-sh-instr">Zeměpisná šířka říká, jak daleko na sever či na jih od rovníku místo leží, délka jak daleko na východ či západ od nultého poledníku. Šířka se píše první.</p>
      <Hud score={r.score} round={i + 1} rounds={tasks.length} roundLabel="Úkol" seconds={r.secs} level={level ?? 'mix'} />
      <div ref={r.cardRef} className="card g-mk-card">
        <TaskHead eyebrow={t.eyebrow} k={i} mood={mood} done={done}>
          {t.text}
        </TaskHead>
        {!done && <BonusBar value={bonusNow} />}
        <MapStage
          key={i}
          view={t.view}
          layers={t.layers}
          marks={marks}
          onTap={t.type === 'place' && !done && !noTap ? (hit, u) => setTap({ lon: hit.lon, lat: hit.lat, u }) : undefined}
        />
        {t.type === 'choice' && <Options options={t.options} answer={t.answer} picked={picked} done={!!done} onPick={(id) => choose(t, id)} wide={t.wide} />}
        {t.type === 'place' && !noTap && !done && (
          <>
            <p className="g-mk-hint">{tap ? 'Můžeš ťuknout znovu a špendlík přesunout.' : 'Ťukni do mapy, pak potvrď.'}</p>
            <div className="g-mk-row">
              <button type="button" className="btn btn-primary btn-lg" disabled={!tap} onClick={() => confirm(t)}>
                <Icon name="check" /> Potvrdit
              </button>
              <NoTapToggle open={false} onToggle={() => setNoTap(true)} />
            </div>
          </>
        )}
        {t.type === 'place' && noTap && (
          <>
            <p className="g-mk-hint">Které očíslované místo má zadané souřadnice?</p>
            <Options
              options={t.cands.map((_, k) => ({ id: String(k), label: `místo ${k + 1}` }))}
              answer={String(t.candAnswer)}
              picked={picked}
              done={!!done}
              onPick={(id) => chooseCand(t, id)}
            />
            {!done && <NoTapToggle open onToggle={() => setNoTap(false)} />}
          </>
        )}
      </div>
      <Status msg={r.msg} n={r.msgN} />
      {done && <NextButton last={r.last} onClick={next} />}
    </div>
  )
}

