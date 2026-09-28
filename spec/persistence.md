# Progress persistence and sync

Learner progress never needs an account. It is always saved in the browser, can be
backed up to a file, and can optionally be synced to the learner's own Google Drive.

## Layers

| Layer | Code | Always on | What it does |
|---|---|---|---|
| State | `src/core/progress.ts` | yes | In-memory `ProgressState`, XP rules, badges; every change is a `commit`. |
| Merge | `src/core/progressMerge.ts` | yes | `migrate()` (v1 → v2) and `mergeProgress()` – combines two copies without losing anything. |
| Local | `src/core/persistence/local.ts` | yes | `localStorage` (key `edu4me-progress-v1`) + a backup copy of the previous save, device id, persistent-storage request, other-tab sync. |
| Sync engine | `src/core/persistence/sync.ts` | when a remote is connected | load remote → merge → save; runs on connect, 4 s after changes, when the tab is hidden, on tap. |
| Remote backends | `src/core/persistence/*.ts` implementing `RemoteStorage` (`types.ts`) | opt-in | Google Drive today (`googleDrive.ts`). |

Local saving never waits for the network; the app works fully offline.

## Local hardening

- **Backup copy:** each save keeps the previous one under `edu4me-progress-v1.bak`; a corrupt main copy falls back to it.
- **Persistent storage:** after the first completed lesson the app calls `navigator.storage.persist()` (Chrome/Edge/Safari decide silently, Firefox may ask). The profile shows the status and a "Chránit" button.
- **Several tabs:** a save in one tab is merged into the others (`storage` event), so tabs never overwrite each other.
- **Backup reminder:** after 3+ lessons, with no sync, no persistent storage and no backup in 14 days, the profile suggests downloading a backup.
- **Import merges:** loading a backup file merges it with the current progress instead of replacing it.

## Data model (v2) and merge rules

`ProgressState.version = 2`. New fields: `epoch`, `xpBy`, `settingsAt`. v1 data is migrated on load (its XP goes to the shared `legacy` key, so it is never counted twice).

| Field | Merge rule |
|---|---|
| `lessons`, `levels` | union; per key best score, max `max`, earliest completion |
| `games` | union; max of best, max, plays, stars |
| `xpBy` (XP per device) | union; max per device. `xp` = sum. XP earned on two devices adds up. |
| `elements` | union |
| `badges` | union; earliest date |
| `days` (XP per day) | max per day |
| `perfectQuizzes` | max |
| `streak` | the copy that was active most recently; `best` = max |
| `settings` | the copy with the newer `settingsAt` |
| `epoch` | "Smazat postup" sets a new epoch; a newer epoch wins entirely, so a reset isn't undone by old copies |

The merge is commutative and idempotent (`progressMerge.test.ts`).

## Stable ids

Progress refers to lesson, level and game ids. `src/courses/chemie/progress-ids.json` lists every id that exists; `progress-ids.test.ts` fails if one disappears (learners would lose progress) or if a new one isn't registered there. Never rename an id; add new lessons with new ids.

## Adding a remote backend

1. Implement `RemoteStorage` (`src/core/persistence/types.ts`): `authorize(interactive)`, `load()`, `save(data)`, `disconnect(deleteData)`, optional `prepare()`. Throw `NeedsAuthError` when the user must sign in again.
2. Register it in `REGISTRY` in `sync.ts`. Set `configured` to false when its build-time config is missing – it is then hidden.
3. Add a test with a fake transport (see `googleDrive.test.ts`).

## Google Drive sync

- Scope `https://www.googleapis.com/auth/drive.appdata`: the app sees only its own file (`edu4me-progress.json`) in the hidden app folder; nothing else on the Drive, no e-mail, no profile.
- Browser-only OAuth token model (Google Identity Services). The access token (~1 h) is kept in `sessionStorage`. There is no refresh token without a server, so in a new browser session the learner taps the cloud icon (or "Přihlásit" in the profile) once; the Google window closes by itself when access was granted before. Until then everything keeps working locally and syncs afterwards.
- School Google Workspace accounts may be blocked by the school's admin; local saving and file backups still work.

### Setting up Google Drive sync (one-time, ~30–60 min)

1. <https://console.cloud.google.com> → create a project (e.g. "edu4me").
2. **APIs & Services → Library** → enable **Google Drive API**.
3. **Google Auth Platform / OAuth consent screen**: External; app name; support e-mail; app home page `https://pvasek.github.io/edu4me/`; privacy policy `https://pvasek.github.io/edu4me/#/soukromi`; authorised domain `pvasek.github.io`. Add the scope `…/auth/drive.appdata`.
4. **Clients → Create client → Web application**. Authorised JavaScript origins: `https://pvasek.github.io` (and `http://localhost:5173` for development). No redirect URI is needed.
5. Copy the **Client ID** (public, not a secret) and add it as a repository **variable** `GOOGLE_CLIENT_ID` (GitHub → Settings → Secrets and variables → Actions → Variables). The deploy workflow passes it to the build as `VITE_GOOGLE_CLIENT_ID`. For local development put `VITE_GOOGLE_CLIENT_ID=…` in `.env.local`.
6. While the consent screen is in **Testing**, only the test users you list can sign in (max 100). To open it to everyone, **publish** the app. For the app name/logo to be shown, Google may ask to verify the domain (Search Console, by adding a verification file or meta tag to the site). Check Google's current rules.

Without the variable the app builds exactly as before and the Google option is hidden.
