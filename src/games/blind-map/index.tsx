import { useMemo, useState } from 'react'
import type { MapHighlight } from '../../core/types'
import type { GeoPick } from '../../geo/GeoMap'
import type { Mood } from '../../ui/Mascot'
import { Hud } from '../shared/GameKit'
import { timeBonus } from '../shared/util'
import type { GameProps } from '../types'
import { checkTap, makeRound, nameOf, numberedPlaces, partsOf, playedLevel, targetName, type ChoiceTask, type TapTask, type Task } from './logic'
import { BONUS_MAX, BonusBar, MapStage, NextButton, NoTapToggle, Options, Status, TaskHead, useRound, useViewData, type Mark, type Trace } from './MapKit'
import './blind-map.css'

const WINDOW: Record<Task['type'], [number, number]> = { choice: [8, 30], tap: [8, 30] }

/** Slepá mapa: find states, regions, capitals, rivers, ranges and volcanoes on a blank map (spec/courses/zemepis/games.md). */
export default function BlindMap({ levelId, onFinish }: GameProps) {
  const [level] = useState(() => playedLevel(levelId))
  const [tasks] = useState(() => makeRound(level))
  const r = useRound<Task>(tasks, onFinish)
  const { t, done, i } = r
  const data = useViewData(t.view)
  const [picked, setPicked] = useState<string | null>(null)
  const [tap, setTap] = useState<{ lon: number; lat: number; ok: boolean; hit?: string } | null>(null)
  const [noTap, setNoTap] = useState(false)
  const win = WINDOW[t.type]
  const bonusNow = timeBonus(r.secs, BONUS_MAX, win[0], win[1])

  const choose = (c: ChoiceTask, id: string) => {
    if (done) return
    setPicked(id)
    const ok = id === c.answer
    const right = c.options.find((o) => o.id === c.answer)!.label
    r.end(ok ? r.points(win) : 0, ok, ok ? 'good' : 'bad', ok ? `Správně! ${c.why}` : `Správně je ${right}. ${c.why}`)
  }

  const onTap = (task: TapTask) => (hit: GeoPick, u: number) => {
    if (done) return
    const res = checkTap(task, hit, u, data)
    if (res.sea) {
      setTap({ lon: hit.lon, lat: hit.lat, ok: false })
      r.say('info', task.target.kind === 'region' ? 'Tohle už není Česko. Ťukni dovnitř.' : 'Tady je moře. Ťukni na pevninu.')
      return
    }
    setTap({ lon: hit.lon, lat: hit.lat, ok: res.ok, hit: res.hit })
    if (res.ok) r.end(r.points(win), true, 'good', `Správně! ${task.why}`)
    else {
      const what = res.hit && res.hit !== 'CZE' ? `Vedle, tady leží ${nameOf(res.hit)}. ` : 'Vedle. '
      r.end(0, false, 'bad', `${what}Správné místo (${targetName(task.target)}) je teď vyznačené zeleně. ${task.why}`)
    }
  }

  const places = useMemo(() => (t.type === 'tap' && noTap ? numberedPlaces(t, data) : undefined), [t, noTap, data])
  const chooseNum = (task: TapTask, id: string) => {
    if (done || !places) return
    setPicked(id)
    const ok = Number(id) === places.answer
    const n = places.answer + 1
    r.end(ok ? r.points(win) : 0, ok, ok ? 'good' : 'bad', ok ? `Správně, místo ${n}. ${task.why}` : `Správně je místo ${n}. ${task.why}`)
  }

  const next = () => {
    setPicked(null)
    setTap(null)
    setNoTap(false)
    r.next()
  }

  const highlight = useMemo<MapHighlight[]>(() => {
    if (t.type === 'tap' && done && (t.target.kind === 'state' || t.target.kind === 'region')) return [{ codes: [t.target.code], tone: 'c' }]
    return t.highlight
  }, [t, done])
  const selected = useMemo(() => (t.type === 'tap' && done && tap && !tap.ok && tap.hit && tap.hit !== 'CZE' ? [tap.hit] : []), [t, done, tap])
  const traces = useMemo<Trace[]>(() => {
    const out: Trace[] = []
    if (t.show) out.push({ parts: partsOf(t.show, data), tone: done ? 'good' : 'target' })
    if (t.type === 'tap' && done && (t.target.kind === 'feature' || t.target.kind === 'river')) out.push({ parts: partsOf(t.target, data), tone: 'good' })
    return out
  }, [t, done, data])
  const marks = useMemo<Mark[]>(() => {
    const m: Mark[] = []
    if (places) places.pts.forEach(([lon, lat], k) => m.push({ lon, lat, kind: 'num', n: k + 1 }))
    else if (tap) m.push({ lon: tap.lon, lat: tap.lat, kind: tap.ok ? 'good' : 'bad' })
    return m
  }, [places, tap])

  const tapping = t.type === 'tap' && !done && !noTap && !!data
  const mood: Mood = done ? (done.ok ? 'cheer' : 'sad') : 'happy'

  return (
    <div className="g-sh-root g-mk g-bm">
      <p className="g-sh-instr">Na slepé mapě nejsou žádné popisky. Ťukni na správné místo, nebo poznej, co je vyznačené.</p>
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
          highlight={highlight}
          points={t.points}
          selected={selected}
          traces={traces}
          marks={marks}
          hover={t.type === 'tap' && (t.target.kind === 'state' || t.target.kind === 'region')}
          onTap={tapping ? onTap(t as TapTask) : undefined}
        />
        {t.type === 'choice' && <Options options={t.options} answer={t.answer} picked={picked} done={!!done} onPick={(id) => choose(t, id)} wide={t.wide} />}
        {t.type === 'tap' && !noTap && !done && (
          <div className="g-mk-row">
            <p className="g-mk-hint">{data ? 'Ťukni do mapy.' : 'Načítám mapu…'}</p>
            <NoTapToggle open={false} onToggle={() => setNoTap(true)} />
          </div>
        )}
        {t.type === 'tap' && noTap && places && (
          <>
            <p className="g-mk-hint">Které očíslované místo to je?</p>
            <Options
              options={places.pts.map((_, k) => ({ id: String(k), label: `místo ${k + 1}` }))}
              answer={String(places.answer)}
              picked={picked}
              done={!!done}
              onPick={(id) => chooseNum(t, id)}
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
