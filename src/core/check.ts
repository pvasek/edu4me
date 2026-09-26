import type { Question } from './types'
import { plain } from './markup'

/** Answer given by the learner, shape depends on question kind. */
export type Answer =
  | { kind: 'choice'; index: number }
  | { kind: 'multi'; indices: number[] }
  | { kind: 'tf'; value: boolean }
  | { kind: 'number'; value: string }
  | { kind: 'text'; value: string }
  | { kind: 'order'; order: number[] } // indices into question.items in the learner's order
  | { kind: 'match'; pairs: Record<number, number> } // left index -> right index (into question.pairs)

export function stripDiacritics(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function normalizeText(s: string, caseSensitive = false) {
  let t = plain(s).replace(/[\s·.]+/g, ' ').trim()
  if (!caseSensitive) t = stripDiacritics(t.toLowerCase())
  return t
}

/** Formulas: ignore spaces entirely, keep case. */
function compact(s: string) {
  return plain(s).replace(/\s+/g, '').replace(/[·.*•⋅]/g, '·')
}

export function parseNumber(s: string): number | null {
  const t = s.replace(/\s/g, '').replace(',', '.').replace('−', '-')
  if (!t || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return null
  return Number(t)
}

export function isCorrect(q: Question, a: Answer): boolean {
  switch (q.kind) {
    case 'choice':
      return a.kind === 'choice' && a.index === q.answer
    case 'multi': {
      if (a.kind !== 'multi') return false
      const want = [...q.answers].sort().join(',')
      return [...a.indices].sort().join(',') === want
    }
    case 'tf':
      return a.kind === 'tf' && a.value === q.answer
    case 'number': {
      if (a.kind !== 'number') return false
      const v = parseNumber(a.value)
      if (v === null) return false
      const tol = q.tolerance ?? Math.max(Math.abs(q.answer) * 0.01, 1e-9)
      return Math.abs(v - q.answer) <= tol + 1e-12
    }
    case 'text': {
      if (a.kind !== 'text') return false
      if (q.caseSensitive) return q.accept.some((acc) => compact(acc) === compact(a.value))
      const v = normalizeText(a.value)
      return q.accept.some((acc) => normalizeText(acc) === v)
    }
    case 'order':
      return a.kind === 'order' && a.order.every((idx, pos) => idx === pos) && a.order.length === q.items.length
    case 'match':
      return (
        a.kind === 'match' &&
        q.pairs.every((_, i) => a.pairs[i] === i) &&
        Object.keys(a.pairs).length === q.pairs.length
      )
  }
}

/** Human-readable correct answer for feedback. */
export function correctAnswerText(q: Question): string {
  switch (q.kind) {
    case 'choice':
      return q.options[q.answer]
    case 'multi':
      return q.answers.map((i) => q.options[i]).join(', ')
    case 'tf':
      return q.answer ? 'Pravda' : 'Nepravda'
    case 'number':
      return `${String(q.answer).replace('.', ',')}${q.unit ? ' ' + q.unit : ''}`
    case 'text':
      return q.accept[0]
    case 'order':
      return q.items.join(' → ')
    case 'match':
      return q.pairs.map(([a, b]) => `${a} – ${b}`).join('; ')
  }
}

/** Deterministic-enough shuffle helper. */
export function shuffle<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
