import { useRef, useState } from 'react'
import {
  exportProgress,
  importProgress,
  liveStreak,
  rankFromXp,
  rankTitle,
  resetProgress,
  setSettings,
  today,
  useProgress,
} from '../core/progress'
import { BADGES } from '../core/badges'
import { ELEMENTS, CATEGORY_LABEL, categoryVar, tablePosition, type ChemElement } from '../courses/chemie/data/elements'
import { Icon } from '../ui/Icon'
import { Mascot } from '../ui/Mascot'
import { ElementTile } from '../ui/ElementTile'

export default function ProfilePage() {
  const p = useProgress()
  const { rank, into, need } = rankFromXp(p.xp)
  const [picked, setPicked] = useState<ChemElement | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const owned = new Set(p.elements)

  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    const key = today(d)
    return { key, xp: p.days[key] ?? 0, label: d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }) }
  })

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `edu4me-postup-${today()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const upload = async (f: File | undefined) => {
    if (!f) return
    const ok = importProgress(await f.text())
    setMsg(ok ? 'Postup byl nahrán.' : 'Soubor se nepodařilo načíst. Je to export z edu4me?')
  }

  return (
    <main className="page profile">
      <section className="profile-head card">
        <Mascot mood="cheer" size={96} />
        <div className="stack">
          <label className="stat-label" htmlFor="name">
            Tvoje jméno
          </label>
          <input
            id="name"
            className="name-input"
            placeholder="Jak ti má Atomík říkat?"
            value={p.settings.name}
            maxLength={24}
            onChange={(e) => setSettings({ name: e.target.value })}
          />
          <strong className="profile-rank">
            Hodnost {rank}: {rankTitle(rank)}
          </strong>
          <div className="progress" style={{ ['--bar' as string]: 'var(--yellow)' }}>
            <span style={{ width: `${(into / need) * 100}%` }} />
          </div>
          <span className="muted tabnum">
            {p.xp} XP celkem · {need - into} XP do další hodnosti
          </span>
        </div>
      </section>

      <section className="stat-row">
        <div className="stat card-flat">
          <span className="stat-label">Série</span>
          <strong className="stat-value">
            <Icon name="flame" style={{ color: 'var(--accent)' }} /> {liveStreak(p)}
          </strong>
          <span className="stat-sub">Nejdelší {p.streak.best}</span>
        </div>
        <div className="stat card-flat">
          <span className="stat-label">Lekce</span>
          <strong className="stat-value tabnum">{Object.keys(p.lessons).length}</strong>
          <span className="stat-sub">{p.perfectQuizzes}× bez chyby</span>
        </div>
        <div className="stat card-flat">
          <span className="stat-label">Hry</span>
          <strong className="stat-value tabnum">{Object.values(p.games).reduce((a, g) => a + g.plays, 0)}</strong>
          <span className="stat-sub">odehraných kol</span>
        </div>
        <div className="stat card-flat">
          <span className="stat-label">Odznaky</span>
          <strong className="stat-value tabnum">
            {Object.keys(p.badges).length} / {BADGES.length}
          </strong>
        </div>
      </section>

      <section className="stack">
        <h2>Posledních 28 dní</h2>
        <div className="heat" role="img" aria-label="Aktivita za posledních 28 dní">
          {days.map((d) => (
            <span
              key={d.key}
              title={`${d.label}: ${d.xp} XP`}
              className="heat-cell"
              style={{ ['--a' as string]: d.xp ? Math.min(1, 0.25 + d.xp / 200) : 0 }}
            />
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Odznaky</h2>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const got = Boolean(p.badges[b.id])
            return (
              <div key={b.id} className={`badge${got ? ' got' : ''}`} style={{ ['--b-color' as string]: b.color }}>
                <span className="badge-medal">
                  <Icon name={got ? b.icon : 'lock'} width={26} height={26} />
                </span>
                <strong>{b.title}</strong>
                <span className="muted">{b.description}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="stack">
        <div className="row">
          <h2>Album prvků</h2>
          <span className="chip tabnum">{owned.size} / 118</span>
        </div>
        <p className="muted">Prvky získáváš v lekcích, v závěrečných výzvách a ve hrách. Klepni na prvek pro detail.</p>
        <div className="album-scroll">
          <div className="album">
            {ELEMENTS.map((e) => {
              const pos = tablePosition(e)
              const have = owned.has(e.symbol)
              return (
                <button
                  key={e.z}
                  type="button"
                  className={`album-cell${have ? ' have' : ''}${picked?.z === e.z ? ' sel' : ''}`}
                  style={{ gridRow: pos.row + (pos.row >= 9 ? 1 : 0), gridColumn: pos.col, ['--c' as string]: categoryVar(e.category) }}
                  onClick={() => setPicked(e)}
                  aria-label={`${e.name}${have ? '' : ', zatím nezískáno'}`}
                >
                  <span className="album-z">{e.z}</span>
                  <span className="album-sym">{e.symbol}</span>
                </button>
              )
            })}
            <span className="album-gap" style={{ gridRow: 9, gridColumn: '1 / -1' }} />
          </div>
        </div>
        {picked && (
          <div className="card album-detail">
            <ElementTile element={picked} size="lg" dim={!owned.has(picked.symbol)} />
            <div className="stack">
              <h3>{picked.name}</h3>
              <span className="muted">
                {CATEGORY_LABEL[picked.category]} · {picked.period}. perioda{picked.group ? ` · ${picked.group}. skupina` : ''} · blok {picked.block}
              </span>
              <span>
                {picked.state === 'gas' ? 'Plyn' : picked.state === 'liquid' ? 'Kapalina' : 'Pevná látka'} za laboratorní teploty
                {picked.en !== null ? ` · elektronegativita ${String(picked.en).replace('.', ',')}` : ''}
              </span>
              {!owned.has(picked.symbol) && <span className="note">Tenhle ti ještě chybí!</span>}
            </div>
          </div>
        )}
      </section>

      <section className="stack">
        <h2>Nastavení</h2>
        <div className="card-flat settings">
          <div className="row">
            <span className="stat-label">Vzhled</span>
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button key={t} type="button" className={`chip level-chip${p.settings.theme === t ? ' on' : ''}`} onClick={() => setSettings({ theme: t })}>
                {t === 'system' ? 'Podle systému' : t === 'light' ? 'Světlý' : 'Tmavý'}
              </button>
            ))}
          </div>
          <p className="muted">
            Postup se ukládá jen v tomto prohlížeči. Pro přenos do jiného zařízení si ho stáhni a tam nahraj.
          </p>
          <div className="row">
            <button type="button" className="btn btn-sm" onClick={download}>
              <Icon name="download" /> Stáhnout postup
            </button>
            <button type="button" className="btn btn-sm" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" /> Nahrát postup
            </button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => upload(e.target.files?.[0])} />
            {!confirmReset ? (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(true)}>
                Smazat postup
              </button>
            ) : (
              <span className="row">
                <strong>Opravdu smazat všechno?</strong>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ ['--btn-bg' as string]: 'var(--bad)', ['--btn-ink' as string]: '#fff' }}
                  onClick={() => {
                    resetProgress()
                    setConfirmReset(false)
                    setMsg('Postup byl smazán.')
                  }}
                >
                  Ano, smazat
                </button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmReset(false)}>
                  Ne
                </button>
              </span>
            )}
          </div>
          {msg && (
            <p role="status" className="hand">
              {msg}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
