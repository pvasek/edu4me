import { Link, NavLink, useLocation } from 'react-router-dom'
import { liveStreak, rankFromXp, setSettings, useProgress } from '../core/progress'
import { COURSES, courseById } from '../core/registry'
import { ChemIconView } from '../illustrations/ChemIcon'
import { Icon } from './Icon'
import { SyncDot } from './SyncDot'

const LAST_COURSE = 'edu4me-last-course'

/** The course the learner is in (from the URL) or was in last. */
function useCurrentCourse() {
  const { pathname } = useLocation()
  const fromUrl = courseById(/^\/c\/([^/]+)/.exec(pathname)?.[1])
  let last: string | null = null
  try {
    if (fromUrl) localStorage.setItem(LAST_COURSE, fromUrl.id)
    else last = localStorage.getItem(LAST_COURSE)
  } catch {
    /* storage blocked */
  }
  return fromUrl ?? courseById(last ?? undefined) ?? COURSES.find((c) => c.available)!
}

export function AppHeader() {
  const p = useProgress()
  const course = useCurrentCourse()
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
          <NavLink to={`/c/${course.id}`} end={false} className="nav-link">
            {course.icon ? <ChemIconView name={course.icon} size={20} /> : <Icon name="flask" />}
            <span>{course.title}</span>
          </NavLink>
          <NavLink to={`/c/${course.id}/hry`} className="nav-link">
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
        <SyncDot />
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
