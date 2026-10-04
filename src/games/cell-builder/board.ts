/**
 * Pure state of a drag-and-drop board shared by Stavitel buňky and Mapa těla:
 * tokens (chips) sit either in the tray (null) or in a slot. Slots hold one token
 * (labels, positions, steps of a path) or many (sorting zones).
 */

/** token id → slot id, or null while the token is in the tray. */
export type Where = Record<string, string | null>

export const emptyBoard = (tokens: readonly string[]): Where => Object.fromEntries(tokens.map((t) => [t, null]))

/**
 * Moves `token` into `target` (null = back to the tray). A single slot that is already
 * taken hands its token back to where the moved token came from (a swap).
 */
export function moveToken(where: Where, token: string, target: string | null, capacity: (slot: string) => number): Where {
  const from = where[token] ?? null
  if (from === target) return where
  const next: Where = { ...where, [token]: target }
  if (target !== null && capacity(target) === 1) {
    for (const [t, s] of Object.entries(where)) if (t !== token && s === target) next[t] = from
  }
  return next
}

/** Tokens lying in `slot`, in insertion order of `where`. */
export const tokensIn = (where: Where, slot: string | null) => Object.keys(where).filter((t) => where[t] === slot)

/** token → is it where the answer key wants it (null = it should stay in the tray). */
export function gradeBoard(where: Where, answers: Record<string, string | null>): Record<string, boolean> {
  return Object.fromEntries(Object.keys(answers).map((t) => [t, (where[t] ?? null) === answers[t]]))
}

/** Every single slot filled and every zone token placed: ready to check. */
export function boardReady(where: Where, answers: Record<string, string | null>, singleSlots: readonly string[]): boolean {
  const filled = new Set(Object.values(where).filter(Boolean))
  if (singleSlots.some((s) => !filled.has(s))) return false
  // tokens that belong in a zone (multi-slot) must not be left in the tray
  const placedNeeded = Object.keys(answers).filter((t) => answers[t] !== null && !singleSlots.includes(answers[t]!))
  return placedNeeded.every((t) => where[t] !== null)
}

/**
 * After a check: correct tokens stay (and get locked), wrong ones go back to the tray.
 * Returns the new board and the set of locked tokens.
 */
export function keepCorrect(where: Where, answers: Record<string, string | null>): { where: Where; locked: Set<string> } {
  const g = gradeBoard(where, answers)
  const next: Where = {}
  const locked = new Set<string>()
  for (const t of Object.keys(answers)) {
    if (g[t] && answers[t] !== null) {
      next[t] = where[t]
      locked.add(t)
    } else next[t] = null
  }
  return { where: next, locked }
}

/** The solved board. */
export const solvedBoard = (answers: Record<string, string | null>): Where => ({ ...answers })
