import { syncNow, useSyncState } from '../core/persistence/sync'
import { ChemIconView } from '../illustrations/ChemIcon'
import './save-sync.css'

/** Header indicator, shown only when cloud sync is connected. Tap = sync now (or sign in again). */
export function SyncDot() {
  const s = useSyncState()
  if (!s.provider) return null
  const warn = s.status === 'needs-auth' || s.status === 'error'
  const title =
    s.status === 'needs-auth'
      ? `${s.label}: klepni a přihlas se, ať se postup synchronizuje`
      : s.status === 'error'
        ? `${s.label}: synchronizace se nepovedla – klepni pro nový pokus`
        : s.status === 'syncing'
          ? `${s.label}: synchronizuji…`
          : `${s.label}: synchronizováno`
  return (
    <button
      type="button"
      className={`sync-dot${warn ? ' is-warn' : ''}${s.status === 'syncing' ? ' is-busy' : ''}`}
      title={title}
      aria-label={title}
      onClick={() => void syncNow({ interactive: true })}
    >
      <ChemIconView name="cloud" size={20} />
    </button>
  )
}
