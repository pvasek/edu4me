/**
 * One drag-and-drop task: a picture with numbered markers (optional), numbered slots or
 * sorting zones, a tray of chips, and Zkontrolovat / Nevím. First check: all right → win;
 * otherwise the right chips lock and the rest return to the tray for a second try;
 * a second miss shows the solution. Shared by Stavitel buňky and Mapa těla.
 */
import { useMemo, useState, type ReactNode } from 'react'
import { Icon } from '../../ui/Icon'
import { boardReady, gradeBoard, keepCorrect, solvedBoard, tokensIn } from './board'
import { Markers, SlotList, Tray, Zones, type ChipStatus, type MarkerInfo, type SlotInfo, type TokenInfo, type ZoneInfo } from './BoardUI'
import { useDnd, type Dnd } from './dnd'

export interface BoardToken extends TokenInfo {
  answer: string | null
}

export interface BoardSpec {
  tokens: readonly BoardToken[]
  slots?: readonly SlotInfo[]
  zones?: readonly ZoneInfo[]
  /** Arrows between slots (a path). */
  arrows?: boolean
  /** Chips with long text (functions, steps). */
  wide?: boolean
  trayTitle: string
  placeholder?: string
}

export interface FigureCtx {
  dnd: Dnd
  hot: string | null
  setHot: (s: string | null) => void
  /** Markers for the given positions, wired to the board. */
  markers: (list: readonly MarkerInfo[]) => ReactNode
  done: boolean
}

export function BoardTask({
  spec,
  tries,
  done,
  figure,
  onWin,
  onRetry,
  onLose,
}: {
  spec: BoardSpec
  tries: number
  done: boolean
  figure?: (ctx: FigureCtx) => ReactNode
  onWin: () => void
  onRetry: (ok: number, total: number) => void
  onLose: (ok: number, total: number) => void
}) {
  const answers = useMemo(() => Object.fromEntries(spec.tokens.map((t) => [t.id, t.answer])), [spec.tokens])
  const single = useMemo(() => (spec.slots ?? []).map((s) => s.id), [spec.slots])
  const singleSet = useMemo(() => new Set(single), [single])
  const [locked, setLocked] = useState<ReadonlySet<string>>(() => new Set())
  const [revealed, setRevealed] = useState<ReadonlySet<string> | null>(null)
  const [hot, setHot] = useState<string | null>(null)
  const byId = useMemo(() => new Map(spec.tokens.map((t) => [t.id, t])), [spec.tokens])
  const dnd = useDnd({
    tokens: spec.tokens.map((t) => t.id),
    capacity: (s) => (singleSet.has(s) ? 1 : Infinity),
    enabled: !done,
    locked,
    label: (id) => byId.get(id)?.text ?? id,
  })
  const ready = boardReady(dnd.where, answers, single)

  const statusOf = (id: string): ChipStatus => {
    if (revealed) return revealed.has(id) ? 'fixed' : answers[id] !== null ? 'ok' : undefined
    if (done) return answers[id] !== null ? 'ok' : undefined
    return locked.has(id) ? 'ok' : undefined
  }
  const statusOfSlot = (slot: string): 'ok' | 'bad' | 'filled' | undefined => {
    const t = tokensIn(dnd.where, slot)[0]
    if (!t) return undefined
    const st = statusOf(t)
    return st === 'ok' ? 'ok' : st === 'fixed' ? 'bad' : 'filled'
  }

  const check = () => {
    if (done || !ready) return
    const g = gradeBoard(dnd.where, answers)
    const ids = spec.tokens.map((t) => t.id)
    const ok = ids.filter((id) => g[id] && answers[id] !== null).length
    const total = ids.filter((id) => answers[id] !== null).length
    if (ids.every((id) => g[id])) return onWin()
    if (tries === 0) {
      const k = keepCorrect(dnd.where, answers)
      dnd.setWhere(k.where)
      setLocked(k.locked)
      dnd.setArmed(null)
      onRetry(ok, total)
      return
    }
    reveal(g)
    onLose(ok, total)
  }

  const reveal = (g: Record<string, boolean>) => {
    setRevealed(new Set(spec.tokens.filter((t) => !g[t.id] && t.answer !== null).map((t) => t.id)))
    dnd.setWhere(solvedBoard(answers))
  }

  const giveUp = () => {
    if (done) return
    const g = gradeBoard(dnd.where, answers)
    const total = spec.tokens.filter((t) => t.answer !== null).length
    reveal(g)
    onLose(spec.tokens.filter((t) => g[t.id] && t.answer !== null).length, total)
  }

  const ctx: FigureCtx = {
    dnd,
    hot,
    setHot,
    done,
    markers: (list) => <Markers dnd={dnd} markers={list} statusOfSlot={statusOfSlot} hot={hot} setHot={setHot} />,
  }
  const fig = figure?.(ctx)

  return (
    <div className={`g-dnd g-bt${fig ? ' has-fig' : ''}`} {...dnd.rootProps}>
      <div className="g-bt-grid">
        {fig && <div className="g-bt-fig">{fig}</div>}
        <div className="g-bt-side">
          {spec.slots && (
            <SlotList
              dnd={dnd}
              slots={spec.slots}
              tokens={spec.tokens}
              statusOf={statusOf}
              arrows={spec.arrows}
              wide={spec.wide}
              hot={hot}
              setHot={setHot}
              placeholder={spec.placeholder}
            />
          )}
          {spec.zones && <Zones dnd={dnd} zones={spec.zones} tokens={spec.tokens} statusOf={statusOf} />}
          {(!done || spec.tokens.some((t) => dnd.where[t.id] === null)) && (
            <Tray dnd={dnd} tokens={spec.tokens} title={done ? 'Sem nepatří' : spec.trayTitle} wide={spec.wide} done={done} />
          )}
        </div>
      </div>
      <p className="g-dnd-sr" aria-live="polite">
        {dnd.announce}
      </p>
      {!done && (
        <div className="g-sh-actions">
          <button type="button" data-check className="btn btn-primary btn-lg" onClick={check} disabled={!ready}>
            <Icon name="check" /> Zkontrolovat
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Nevím
          </button>
        </div>
      )}
      {dnd.ghost}
    </div>
  )
}
