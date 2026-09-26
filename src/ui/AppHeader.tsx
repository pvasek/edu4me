import { Link, NavLink } from 'react-router-dom'
import { liveStreak, rankFromXp, setSettings, useProgress } from '../core/progress'
import { Icon } from './Icon'

export function AppHeader() {
  const p = useProgress()
  const streak = liveStreak(p)
  const { rank } = rankFromXp(p.xp)
  const dark =
    p.settings.theme === 'dark' ||
    (p.settings.theme === 'system' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="brand" aria-label="edu4me – domů">
          <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
            <g fill="none" stroke="var(--edge)" strokeWidth="2.2">
              <ellipse cx="20" cy="20" rx="17" ry="6.5" />
              <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(60 20 20)" />
              <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(120 20 20)" />
            </g>
            <circle cx="20" cy="20" r="5" fill="var(--accent)" stroke="var(--edge)" strokeWidth="1.8" />
          </svg>
          <span>
            edu<b>4</b>me
          </span>
        </Link>
        <nav className="app-nav" aria-label="Hlavní navigace">
          <NavLink to="/c/chemie" className="nav-link">
            <Icon name="flask" />
            <span>Chemie</span>
          </NavLink>
          <NavLink to="/c/chemie/hry" className="nav-link">
            <Icon name="gamepad" />
            <span>Hry</span>
          </NavLink>
        </nav>
        <span className="spacer" />
        <span className="chip" title={`Série: ${streak} dní v řadě`}>
          <Icon name="flame" style={{ color: streak ? 'var(--accent)' : 'var(--muted)' }} />
          {streak}
        </span>
        <span className="chip hide-xs" title="Zkušenostní body">
          <Icon name="bolt" style={{ color: 'var(--yellow)' }} />
          {p.xp} XP
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label={dark ? 'Přepnout na světlý vzhled' : 'Přepnout na tmavý vzhled'}
          onClick={() => setSettings({ theme: dark ? 'light' : 'dark' })}
        >
          <Icon name={dark ? 'sun' : 'moon'} />
        </button>
        <Link to="/profil" className="avatar" aria-label={`Profil, úroveň ${rank}`}>
          <span>{rank}</span>
        </Link>
      </div>
    </header>
  )
}
