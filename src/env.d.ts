/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google OAuth client id (public). When empty, Google Drive sync is hidden. See spec/persistence.md. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
