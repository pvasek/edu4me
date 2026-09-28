import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { exportProgress, importProgress, today, useProgress } from '../core/progress'
import { isPersisted, readMeta, requestPersist, writeMeta } from '../core/persistence/local'
import { availableRemotes, connect, disconnect, prepareRemote, syncNow, useSyncState } from '../core/persistence/sync'
import { Icon } from './Icon'
import { ChemIconView } from '../illustrations/ChemIcon'
import './save-sync.css'

const ago = (iso: string | null) => {
  if (!iso) return 'zatím nikdy'
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'právě teď'
  if (min < 60) return `před ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `před ${h} h`
  return new Date(iso).toLocaleDateString('cs-CZ')
}

/** Where progress is kept: this browser (always), a backup file, and optionally Google Drive. */
export function SaveSyncCard() {
  const p = useProgress()
  const sync = useSyncState()
  const remotes = availableRemotes()
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [meta, setMeta] = useState(readMeta)
  const [msg, setMsg] = useState('')
  const [confirmOff, setConfirmOff] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void isPersisted().then(setPersisted)
    remotes.forEach((r) => prepareRemote(r.id)) // load the sign-in SDK early so the click can open its window
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lessons = Object.keys(p.lessons).length
  const staleBackup = !meta.lastExportAt || Date.now() - new Date(meta.lastExportAt).getTime() > 14 * 864e5
  const remindBackup = lessons >= 3 && staleBackup && !sync.provider && persisted !== true

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `edu4me-postup-${today()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    writeMeta({ lastExportAt: new Date().toISOString() })
    setMeta(readMeta())
  }
  const upload = async (f: File | undefined) => {
    if (!f) return
    const ok = importProgress(await f.text())
    setMsg(ok ? 'Záloha byla načtena a spojena s tvým postupem.' : 'Soubor se nepodařilo načíst. Je to záloha z edu4me?')
  }
  const protect = async () => {
    const ok = await requestPersist()
    setPersisted(ok)
    setMsg(ok ? 'Prohlížeč bude tvůj postup chránit.' : 'Prohlížeč ochranu nepovolil. Pomůže přidat stránku na plochu nebo si stáhnout zálohu.')
  }
  const onConnect = async (id: string) => {
    setMsg('')
    try {
      await connect(id)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="card-flat savesync">
      <div className="ss-row">
        <span className="ss-icon">
          <ChemIconView name="book" size={22} />
        </span>
        <div className="ss-body">
          <strong>V tomto prohlížeči</strong>
          <span className="muted">
            Postup se ukládá automaticky.{' '}
            {persisted === true
              ? 'Prohlížeč ho chrání před smazáním.'
              : persisted === false
                ? 'Prohlížeč ho ale může při úklidu smazat.'
                : ''}
          </span>
        </div>
        {persisted === false && (
          <div className="ss-actions">
            <button type="button" className="btn btn-sm" onClick={protect}>
              Chránit
            </button>
          </div>
        )}
      </div>

      <div className="ss-row">
        <span className="ss-icon">
          <Icon name="download" />
        </span>
        <div className="ss-body">
          <strong>Záloha do souboru</strong>
          <span className="muted">Poslední záloha: {meta.lastExportAt ? ago(meta.lastExportAt) : 'zatím žádná'}. Nahráním se záloha spojí s tvým postupem, nic se neztratí.</span>
        </div>
        <div className="ss-actions">
          <button type="button" className="btn btn-sm" onClick={download}>
            <Icon name="download" /> Stáhnout
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" /> Nahrát
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => upload(e.target.files?.[0])} />
        </div>
      </div>
      {remindBackup && (
        <p className="ss-hint">
          <Icon name="bolt" /> Máš za sebou už {lessons} lekcí. Stáhni si zálohu, ať o ně nepřijdeš.
          {remotes.length > 0 && ' Nebo si zapni synchronizaci níže.'}
        </p>
      )}

      {remotes.map((r) => {
        const on = sync.provider === r.id
        return (
          <div key={r.id} className={`ss-row ss-remote${on ? ' is-on' : ''}`}>
            <span className="ss-icon">
              <ChemIconView name="cloud" size={22} />
            </span>
            <div className="ss-body">
              <strong>{r.label}</strong>
              {!on ? (
                <span className="muted">Postup se uloží do skryté složky aplikace na tvém Google Disku a přenese se do dalších zařízení. Ostatní soubory aplikace nevidí.</span>
              ) : sync.status === 'needs-auth' ? (
                <span className="ss-warn">Je potřeba se znovu přihlásit, pak se postup zase synchronizuje.</span>
              ) : sync.status === 'error' ? (
                <span className="ss-warn">Synchronizace se nepovedla: {sync.error}</span>
              ) : (
                <span className="muted">
                  {sync.status === 'syncing' ? 'Synchronizuji…' : `Synchronizováno ${ago(sync.lastSyncAt)}.`}
                  {sync.pending && sync.status !== 'syncing' ? ' Čekají nové změny.' : ''}
                </span>
              )}
            </div>
            <div className="ss-actions">
              {!on ? (
                <button type="button" className="btn btn-sm btn-primary" onClick={() => onConnect(r.id)}>
                  Připojit
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-sm" disabled={sync.status === 'syncing'} onClick={() => syncNow({ interactive: true })}>
                    <Icon name="refresh" /> {sync.status === 'needs-auth' ? 'Přihlásit' : 'Synchronizovat'}
                  </button>
                  {!confirmOff ? (
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmOff(true)}>
                      Odpojit
                    </button>
                  ) : (
                    <span className="ss-confirm">
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => (setConfirmOff(false), void disconnect(false))}>
                        Odpojit, data nechat
                      </button>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => (setConfirmOff(false), void disconnect(true))}>
                        Odpojit a smazat z Disku
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}

      {msg && (
        <p role="status" className="hand">
          {msg}
        </p>
      )}
      <p className="muted ss-foot">
        <Link to="/soukromi">Jak s daty zacházíme</Link>
      </p>
    </div>
  )
}
