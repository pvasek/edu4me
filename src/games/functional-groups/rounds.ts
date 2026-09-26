import { shuffle } from '../shared/util'
import { CLASSES, CONFUSE, ITEMS, planFor, type ClassId, type FgItem } from './data'

export interface Round {
  item: FgItem
  options: string[]
}

export function buildRounds(level: number | undefined): Round[] {
  const byKind = (k: FgItem['kind']) => shuffle(ITEMS.filter((i) => i.kind === k))
  const plan = planFor(level)
  const perAnswer = new Map<string, number>()
  const chosen: FgItem[] = []
  for (const [kind, n] of plan) {
    let taken = 0
    for (const item of byKind(kind)) {
      if (taken === n) break
      const c = perAnswer.get(item.answer) ?? 0
      if (c >= 2) continue
      perAnswer.set(item.answer, c + 1)
      chosen.push(item)
      taken++
    }
  }
  // Start with a fragment (the "rule"), then mix the rest.
  const [first, ...rest] = chosen
  return [first, ...shuffle(rest)].map((item) => ({ item, options: optionsFor(item) }))
}

export function optionsFor(item: FgItem): string[] {
  if (item.options) return shuffle(item.options)
  const answer = item.answer as ClassId
  const banned = new Set<string>([answer, ...(item.exclude ?? [])])
  const pool = [
    ...shuffle(CONFUSE[answer]),
    ...shuffle((Object.keys(CLASSES) as ClassId[]).filter((c) => !CONFUSE[answer].includes(c))),
  ]
  const wrong: string[] = []
  for (const c of pool) {
    if (wrong.length === 3) break
    if (!banned.has(c) && !wrong.includes(c)) wrong.push(c)
  }
  return shuffle([answer, ...wrong])
}

