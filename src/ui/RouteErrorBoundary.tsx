import { Component, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { isChunkError, reloadForNewVersion } from '../core/staleBuild'
import { MascotSays } from './Mascot'

class Boundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state: { error: unknown } = { error: null }
  static getDerivedStateFromError(error: unknown) {
    return { error }
  }
  componentDidCatch(error: unknown) {
    console.error(error)
    if (isChunkError(error)) reloadForNewVersion()
  }
  render() {
    if (!this.state.error) return this.props.children
    const stale = isChunkError(this.state.error)
    return (
      <main className="page stack" style={{ maxWidth: 560, margin: '48px auto', padding: '0 16px' }}>
        <MascotSays mood="sad">
          {stale
            ? 'Mezitím vyšla nová verze edu4me a tahle stránka se nenačetla. Načti ji prosím znovu.'
            : 'Tuhle stránku se nepodařilo zobrazit. Zkus ji načíst znovu.'}
        </MascotSays>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              try {
                sessionStorage.removeItem('edu4me-reloaded-at')
              } catch {
                /* ignore */
              }
              if (!reloadForNewVersion()) window.location.reload()
            }}
          >
            Načíst znovu
          </button>
          <a className="btn btn-ghost" href="#/">
            Domů
          </a>
        </div>
      </main>
    )
  }
}

/** Never a blank page: catches rendering/loading errors of the current route; navigating resets it. */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <Boundary key={pathname}>{children}</Boundary>
}
