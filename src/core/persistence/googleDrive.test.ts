import { beforeEach, describe, expect, it, vi } from 'vitest'
import { memoryStorage } from './memoryStorage'
import { GoogleDriveStorage, type TokenProvider } from './googleDrive'
import { NeedsAuthError } from './types'

/** A fake Drive API: one appDataFolder, files by id. */
function fakeDrive() {
  const files = new Map<string, string>()
  let n = 0
  const calls: string[] = []
  let failNext401 = false
  const fetchFn = vi.fn(async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? 'GET'
    calls.push(`${method} ${url.replace(/\?.*/, '')}`)
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer T')
    if (failNext401) {
      failNext401 = false
      return new Response('', { status: 401 })
    }
    const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status })
    let m: RegExpMatchArray | null
    if (method === 'GET' && url.includes('/drive/v3/files?')) return json({ files: [...files.keys()].map((id) => ({ id })) })
    if (method === 'GET' && (m = url.match(/\/files\/([^?]+)\?alt=media/))) return files.has(m[1]) ? new Response(files.get(m[1])) : json({}, 404)
    if (method === 'POST' && url.includes('uploadType=multipart')) {
      const body = String(init.body)
      expect(body).toContain('"parents":["appDataFolder"]')
      const content = body.split('\r\n\r\n')[2].split('\r\n--')[0]
      const id = `f${++n}`
      files.set(id, content)
      return json({ id })
    }
    if (method === 'PATCH' && (m = url.match(/\/files\/([^?]+)\?uploadType=media/))) {
      if (!files.has(m[1])) return json({}, 404)
      files.set(m[1], String(init.body))
      return json({ id: m[1] })
    }
    if (method === 'DELETE' && (m = url.match(/\/files\/([^?]+)$/))) {
      files.delete(m[1])
      return new Response('', { status: 204 })
    }
    return json({}, 400)
  })
  return { files, calls, fetchFn, fail401: () => (failNext401 = true) }
}

const tokens = (): TokenProvider & { cleared: number; revoked: number } => ({
  cleared: 0,
  revoked: 0,
  async get() {
    return 'T'
  },
  clear() {
    this.cleared++
  },
  async revoke() {
    this.revoked++
  },
})

describe('GoogleDriveStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
  })

  it('returns null when nothing is stored, then creates the file, then updates it in place', async () => {
    const d = fakeDrive()
    const g = new GoogleDriveStorage({ tokens: tokens(), fetch: d.fetchFn as unknown as typeof fetch, configured: true })
    expect(await g.load()).toBeNull()
    await g.save({ version: 2, xp: 10 })
    expect(d.files.size).toBe(1)
    await g.save({ version: 2, xp: 20 })
    expect(d.files.size).toBe(1)
    expect(await g.load()).toEqual({ version: 2, xp: 20 })
    expect(d.calls.filter((c) => c.startsWith('PATCH'))).toHaveLength(1)
  })

  it('recreates the file if it was deleted on Drive', async () => {
    const d = fakeDrive()
    const g = new GoogleDriveStorage({ tokens: tokens(), fetch: d.fetchFn as unknown as typeof fetch, configured: true })
    await g.save({ a: 1 })
    d.files.clear()
    await g.save({ a: 2 })
    expect([...d.files.values()]).toEqual([JSON.stringify({ a: 2 })])
  })

  it('turns a 401 into NeedsAuthError and drops the token', async () => {
    const d = fakeDrive()
    const t = tokens()
    const g = new GoogleDriveStorage({ tokens: t, fetch: d.fetchFn as unknown as typeof fetch, configured: true })
    d.fail401()
    await expect(g.load()).rejects.toBeInstanceOf(NeedsAuthError)
    expect(t.cleared).toBe(1)
  })

  it('disconnect can delete the stored copy and revokes access', async () => {
    const d = fakeDrive()
    const t = tokens()
    const g = new GoogleDriveStorage({ tokens: t, fetch: d.fetchFn as unknown as typeof fetch, configured: true })
    await g.save({ a: 1 })
    await g.disconnect(true)
    expect(d.files.size).toBe(0)
    expect(t.revoked).toBe(1)
  })
})
