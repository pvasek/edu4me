/** Building blocks of a drag-and-drop board (tray, numbered slots, zones, markers on a picture). */
import type { ReactNode } from 'react'
import { Icon } from '../../ui/Icon'
import { tokensIn } from './board'
import { TRAY, type Dnd } from './dnd'

export interface TokenInfo {
  id: string
  text: string
}
export type ChipStatus = 'ok' | 'bad' | 'fixed' | undefined

export function Chip({ dnd, token, status, wide }: { dnd: Dnd; token: TokenInfo; status?: ChipStatus; wide?: boolean }) {
  const p = dnd.tokenProps(token.id)
  return (
    <button
      type="button"
      {...p}
      className={`g-dnd-chip${wide ? ' wide' : ''}${status ? ` ${status}` : ''}${dnd.dragging === token.id ? ' is-dragging' : ''}`}
    >
      {status === 'ok' && <Icon name="check" />}
      {status === 'bad' && <Icon name="x" />}
      <span>{token.text}</span>
    </button>
  )
}

export function Tray({
  dnd,
  tokens,
  title,
  wide,
  done,
}: {
  dnd: Dnd
  tokens: readonly TokenInfo[]
  title: string
  wide?: boolean
  done?: boolean
}) {
  const here = tokens.filter((t) => dnd.where[t.id] === null)
  const armedPlaced = dnd.armed !== null && dnd.where[dnd.armed] !== null
  return (
    <div className={`g-dnd-tray${dnd.isOver(TRAY) ? ' is-over' : ''}`} data-drop={TRAY} onClick={dnd.toTray}>
      <div className="g-dnd-tray-head">
        <span>{title}</span>
        {armedPlaced && !done && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              dnd.toTray()
            }}
          >
            <Icon name="arrowLeft" /> Zpět do nabídky
          </button>
        )}
      </div>
      <div className={`g-dnd-chips${wide ? ' col' : ''}`}>
        {here.map((t) => (
          <Chip key={t.id} dnd={dnd} token={t} wide={wide} />
        ))}
        {!here.length && <span className="g-dnd-empty">{done ? 'Hotovo.' : 'Vše je rozmístěné – zkontroluj.'}</span>}
      </div>
    </div>
  )
}

export interface SlotInfo {
  id: string
  /** Number shown in front of the slot (and on the marker in the picture). */
  num: number
  /** Optional fixed text of the slot (e.g. the organelle whose function is asked). */
  title?: string
}

export function SlotList({
  dnd,
  slots,
  tokens,
  statusOf,
  arrows,
  wide,
  hot,
  setHot,
  truth,
  placeholder = 'Sem polož',
}: {
  dnd: Dnd
  slots: readonly SlotInfo[]
  tokens: readonly TokenInfo[]
  statusOf: (token: string) => ChipStatus
  arrows?: boolean
  wide?: boolean
  hot?: string | null
  setHot?: (slot: string | null) => void
  /** After the answer: the correct text of a slot (shown under a wrong chip). */
  truth?: (slot: string) => string | undefined
  placeholder?: string
}) {
  const byId = new Map(tokens.map((t) => [t.id, t]))
  return (
    <ol className="g-dnd-slots">
      {slots.map((s, k) => {
        const inside = tokensIn(dnd.where, s.id)
        const t = inside[0] ? byId.get(inside[0]) : undefined
        const st = t ? statusOf(t.id) : undefined
        const fix = truth?.(s.id)
        return (
          <li key={s.id} style={{ display: 'contents' }}>
            {arrows && k > 0 && (
              <span className="g-dnd-arrow" aria-hidden="true">
                ↓
              </span>
            )}
            <div
              className={`g-dnd-slot${hot === s.id || dnd.isOver(s.id) ? ' hot' : ''}`}
              data-drop={s.id}
              onMouseEnter={() => setHot?.(s.id)}
              onMouseLeave={() => setHot?.(null)}
              onFocus={() => setHot?.(s.id)}
              onBlur={() => setHot?.(null)}
            >
              <span className="g-dnd-num" aria-hidden="true">
                {s.num}
              </span>
              <div className="g-dnd-cell">
                {s.title && <span className="g-dnd-slot-title">{s.title}</span>}
                {t ? (
                  <Chip dnd={dnd} token={t} status={st} wide={wide} />
                ) : (
                  <button
                    type="button"
                    {...dnd.slotProps(s.id)}
                    className={`g-dnd-drop${dnd.armed ? ' armed' : ''}${dnd.isOver(s.id) ? ' is-over' : ''}`}
                    aria-label={`${s.num}. ${s.title ? `${s.title}: ` : ''}prázdné místo${dnd.armed ? ' – polož sem vybraný štítek' : ''}`}
                  >
                    {dnd.armed ? 'Polož sem' : placeholder}
                  </button>
                )}
                {st === 'bad' && fix && <span className="g-dnd-truth">→ {fix}</span>}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export interface ZoneInfo {
  id: string
  title: string
  icon?: ReactNode
}

export function Zones({
  dnd,
  zones,
  tokens,
  statusOf,
}: {
  dnd: Dnd
  zones: readonly ZoneInfo[]
  tokens: readonly TokenInfo[]
  statusOf: (token: string) => ChipStatus
}) {
  const byId = new Map(tokens.map((t) => [t.id, t]))
  return (
    <div className={`g-dnd-zones n${zones.length}`}>
      {zones.map((z) => {
        const sp = dnd.slotProps(z.id)
        return (
          <div
            key={z.id}
            data-drop={z.id}
            onClick={sp.onClick}
            className={`g-dnd-zone${dnd.armed ? ' armed' : ''}${dnd.isOver(z.id) ? ' is-over' : ''}`}
          >
            <div className="g-dnd-zone-head">
              {z.icon}
              <span>{z.title}</span>
              {dnd.armed && (
                <button
                  type="button"
                  className="g-dnd-zone-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    sp.onClick()
                  }}
                >
                  Polož sem
                </button>
              )}
            </div>
            <div className="g-dnd-chips">
              {tokensIn(dnd.where, z.id).map((id) => {
                const t = byId.get(id)
                return t ? <Chip key={id} dnd={dnd} token={t} status={statusOf(id)} /> : null
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export interface MarkerInfo {
  slot: string
  num: number
  /** Position in % of the picture box. */
  x: number
  y: number
  /** Accessible name (the markers are a mouse/touch shortcut; the slot list is the keyboard path). */
  title: string
}

/** Numbered markers over a picture; each is also a drop target for its slot. */
export function Markers({
  dnd,
  markers,
  statusOfSlot,
  hot,
  setHot,
}: {
  dnd: Dnd
  markers: readonly MarkerInfo[]
  statusOfSlot: (slot: string) => 'ok' | 'bad' | 'filled' | undefined
  hot?: string | null
  setHot?: (slot: string | null) => void
}) {
  return (
    <>
      {markers.map((m) => {
        const st = statusOfSlot(m.slot)
        return (
          <button
            key={m.slot}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            title={m.title}
            {...dnd.slotProps(m.slot)}
            onMouseEnter={() => setHot?.(m.slot)}
            onMouseLeave={() => setHot?.(null)}
            className={`g-dnd-marker${st ? ` ${st}` : ''}${hot === m.slot ? ' hot' : ''}${dnd.isOver(m.slot) ? ' is-over' : ''}${dnd.armed && st !== 'ok' ? ' armed-pulse' : ''}`}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            {m.num}
          </button>
        )
      })}
    </>
  )
}
