/**
 * Google Drive backend: the progress file lives in the app's hidden
 * "appDataFolder" on the learner's own Drive (scope drive.appdata – the app can
 * see only its own file, nothing else on the Drive, and the file is invisible in
 * the Drive UI). Everything runs in the browser; there is no server.
 *
 * Enabled only when the app is built with VITE_GOOGLE_CLIENT_ID (see
 * spec/persistence.md → "Setting up Google Drive sync").
 */
import { NeedsAuthError, type RemoteStorage } from './types'

export const GOOGLE_CLIENT_ID: string = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''
const SCOPE = 'https://www.googleapis.com/auth/drive.appdata'
const FILE_NAME = 'edu4me-progress.json'
const API = 'https://www.googleapis.com/drive/v3'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3'
const FILE_ID_KEY = 'edu4me-gdrive-file'
const TOKEN_KEY = 'edu4me-gdrive-token'

/** Access-token source; the real one uses Google Identity Services, tests use a fake. */
export interface TokenProvider {
  /** A valid access token. Without `interactive` it must not open any popup (throws NeedsAuthError instead). */
  get(interactive: boolean): Promise<string>
  /** Drop the cached token (e.g. after a 401). */
  clear(): void
  /** Revoke access at Google. */
  revoke(): Promise<void>
  /** Preload the SDK. */
  prepare?(): void
}

type Fetch = typeof fetch

function store(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? localStorage : sessionStorage
  } catch {
    return null
  }
}

export class GoogleDriveStorage implements RemoteStorage {
  readonly id = 'gdrive'
  readonly label = 'Google Disk'
  readonly configured: boolean
  private fetchFn: Fetch
  private tokens: TokenProvider

  constructor(opts: { tokens: TokenProvider; fetch?: Fetch; configured?: boolean }) {
    this.tokens = opts.tokens
    this.fetchFn = opts.fetch ?? ((...a: Parameters<Fetch>) => fetch(...a))
    this.configured = opts.configured ?? Boolean(GOOGLE_CLIENT_ID)
  }

  prepare() {
    this.tokens.prepare?.()
  }

  async authorize(interactive: boolean) {
    await this.tokens.get(interactive)
  }

  /** fetch with the access token; a 401 clears the token and asks for a new sign-in */
  private async call(url: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.tokens.get(false)
    const res = await this.fetchFn(url, { ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } })
    if (res.status === 401) {
      this.tokens.clear()
      throw new NeedsAuthError()
    }
    return res
  }

  private get cachedId() {
    return store('local')?.getItem(FILE_ID_KEY) ?? null
  }
  private set cachedId(id: string | null) {
    const s = store('local')
    if (!s) return
    if (id) s.setItem(FILE_ID_KEY, id)
    else s.removeItem(FILE_ID_KEY)
  }

  private async findFileId(): Promise<string | null> {
    if (this.cachedId) return this.cachedId
    const q = encodeURIComponent(`name='${FILE_NAME}'`)
    const res = await this.call(`${API}/files?spaces=appDataFolder&q=${q}&fields=files(id,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=1`)
    if (!res.ok) throw new Error(`Google Disk: hledání souboru selhalo (${res.status})`)
    const data = (await res.json()) as { files?: { id: string }[] }
    const id = data.files?.[0]?.id ?? null
    this.cachedId = id
    return id
  }

  async load(): Promise<unknown | null> {
    const id = await this.findFileId()
    if (!id) return null
    const res = await this.call(`${API}/files/${id}?alt=media`)
    if (res.status === 404) {
      this.cachedId = null // deleted meanwhile
      return this.findFileId().then((again) => (again ? this.load() : null))
    }
    if (!res.ok) throw new Error(`Google Disk: načtení selhalo (${res.status})`)
    return res.json()
  }

  async save(data: unknown): Promise<void> {
    const body = JSON.stringify(data)
    const id = await this.findFileId()
    if (id) {
      const res = await this.call(`${UPLOAD}/files/${id}?uploadType=media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      if (res.status !== 404) {
        if (!res.ok) throw new Error(`Google Disk: uložení selhalo (${res.status})`)
        return
      }
      this.cachedId = null // the file was deleted: create a new one below
    }
    const boundary = 'edu4me' + Math.random().toString(36).slice(2)
    const meta = JSON.stringify({ name: FILE_NAME, parents: ['appDataFolder'], mimeType: 'application/json' })
    const multipart =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${boundary}--`
    const res = await this.call(`${UPLOAD}/files?uploadType=multipart&fields=id`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body: multipart,
    })
    if (!res.ok) throw new Error(`Google Disk: vytvoření souboru selhalo (${res.status})`)
    this.cachedId = ((await res.json()) as { id: string }).id
  }

  async disconnect(deleteData = false) {
    if (deleteData) {
      try {
        const id = await this.findFileId()
        if (id) await this.call(`${API}/files/${id}`, { method: 'DELETE' })
      } catch {
        /* best effort */
      }
    }
    this.cachedId = null
    await this.tokens.revoke()
  }
}

// ---------------------------------------------------------------- Google Identity Services

interface GisTokenResponse {
  access_token?: string
  expires_in?: number
  error?: string
}
interface GisTokenClient {
  requestAccessToken(overrides?: { prompt?: string }): void
}
interface GisOauth2 {
  initTokenClient(cfg: {
    client_id: string
    scope: string
    callback: (r: GisTokenResponse) => void
    error_callback?: (e: { type: string }) => void
  }): GisTokenClient
  revoke(token: string, done?: () => void): void
}
declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GisOauth2 } }
  }
}

let gisLoading: Promise<void> | null = null
function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  gisLoading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      gisLoading = null
      reject(new Error('Nepodařilo se načíst přihlášení Google.'))
    }
    document.head.appendChild(s)
  })
  return gisLoading
}

/**
 * Browser-only OAuth "token model": a short-lived access token (≈1 h) kept in
 * sessionStorage. There is no refresh token without a server, so after it expires
 * the learner taps "Synchronizovat" once and Google hands out a new token (the
 * popup closes by itself when access was granted before).
 */
export class GisTokenProvider implements TokenProvider {
  private clientId: string
  constructor(clientId = GOOGLE_CLIENT_ID) {
    this.clientId = clientId
  }

  prepare() {
    void loadGis().catch(() => {})
  }

  private cached(): string | null {
    try {
      const t = JSON.parse(store('session')?.getItem(TOKEN_KEY) ?? 'null') as { access: string; exp: number } | null
      return t && t.exp > Date.now() + 60_000 ? t.access : null
    } catch {
      return null
    }
  }

  async get(interactive: boolean): Promise<string> {
    const t = this.cached()
    if (t) return t
    if (!interactive) throw new NeedsAuthError()
    await loadGis()
    const oauth2 = window.google?.accounts?.oauth2
    if (!oauth2) throw new Error('Přihlášení Google není dostupné.')
    return new Promise<string>((resolve, reject) => {
      const client = oauth2.initTokenClient({
        client_id: this.clientId,
        scope: SCOPE,
        callback: (r) => {
          if (r.error || !r.access_token) return reject(new NeedsAuthError('Přihlášení bylo zrušeno.'))
          store('session')?.setItem(TOKEN_KEY, JSON.stringify({ access: r.access_token, exp: Date.now() + (r.expires_in ?? 3600) * 1000 }))
          resolve(r.access_token)
        },
        error_callback: (e) =>
          reject(new NeedsAuthError(e.type === 'popup_failed_to_open' ? 'Prohlížeč zablokoval okno přihlášení. Zkus to znovu.' : 'Přihlášení bylo zrušeno.')),
      })
      client.requestAccessToken({ prompt: '' })
    })
  }

  clear() {
    store('session')?.removeItem(TOKEN_KEY)
  }

  async revoke() {
    const t = this.cached()
    this.clear()
    if (t && window.google?.accounts?.oauth2) await new Promise<void>((r) => window.google!.accounts!.oauth2!.revoke(t, () => r()))
  }
}

export const createGoogleDrive = () => new GoogleDriveStorage({ tokens: new GisTokenProvider() })
