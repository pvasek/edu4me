import type { Course, LevelContent, LevelOutline, Question } from '../../core/types'

const tf = (q: string): Question => ({ kind: 'tf', q, answer: true })
const choice = (q: string): Question => ({ kind: 'choice', q, options: ['a', 'b'], answer: 0 })

/** Fake course: l1 rich, l2 thin (3 tf + 2 choice), l3 missing, l4 rich. */
export function fakeCourse(): Course {
  const many = (prefix: string, n: number, make: (q: string) => Question) => Array.from({ length: n }, (_, i) => make(`${prefix}${i}`))
  const content = (quiz: Question[], boss: Question[] = []): LevelContent => ({
    lessons: { x: { id: 'x', title: 'x', goals: [], hook: '', sections: [], summary: [], quiz } },
    boss,
  })
  const level = (n: number, load: () => Promise<LevelContent>): LevelOutline => ({
    id: `l${n}`,
    number: n,
    title: `L${n}`,
    subtitle: '',
    stage: '',
    color: '#000',
    symbol: 'H',
    lessons: [],
    load,
  })
  return {
    id: 'fake',
    title: 'Fake',
    tagline: '',
    color: '#000',
    available: true,
    levels: [
      level(1, async () => content([...many('1tf', 20, tf), ...many('1ch', 20, choice), { kind: 'number', q: '1num', answer: 1 }])),
      level(2, async () => content([...many('2tf', 3, tf), ...many('2ch', 1, choice)], [choice('2boss')])),
      level(3, () => Promise.reject(new Error('missing'))),
      level(4, async () => content([...many('4tf', 30, tf), ...many('4ch', 30, choice)])),
    ],
  }
}
