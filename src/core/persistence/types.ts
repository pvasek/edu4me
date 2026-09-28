/**
 * A remote place to keep a copy of the learner's progress (Google Drive today;
 * could be another cloud, a sync-code server… later). Local storage is not a
 * RemoteStorage: it is always on and handled by ../progress.ts.
 *
 * To add a backend: implement this interface, then register it in ./sync.ts
 * (see spec/persistence.md).
 */
export interface RemoteStorage {
  /** stable id, stored as the learner's choice, e.g. "gdrive" */
  readonly id: string
  /** Czech label shown in the UI, e.g. "Google Disk" */
  readonly label: string
  /** false when the app was built without the configuration this backend needs */
  readonly configured: boolean
  /** Make sure we may talk to the backend. `interactive` = called from a click (may show a sign-in). */
  authorize(interactive: boolean): Promise<void>
  /** The stored progress (any version) or null when nothing is stored yet. */
  load(): Promise<unknown | null>
  /** Replaces the stored progress. */
  save(data: unknown): Promise<void>
  /** Forget the connection (revoke access). With `deleteData`, also delete the stored copy. */
  disconnect(deleteData?: boolean): Promise<void>
  /** Optional: start loading heavy SDKs early so a later click can open a popup instantly. */
  prepare?(): void
}

/** Thrown when the backend needs the learner to sign in again (a click is required). */
export class NeedsAuthError extends Error {
  constructor(message = 'Je potřeba se znovu přihlásit.') {
    super(message)
    this.name = 'NeedsAuthError'
  }
}
