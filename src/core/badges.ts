import type { ProgressState } from './progress'
import type { IconName } from '../ui/Icon'

export interface Badge {
  id: string
  title: string
  description: string
  icon: IconName
  color: string
  earned: (p: ProgressState) => boolean
}

const lessonsDone = (p: ProgressState) => Object.keys(p.lessons).length
const levelPassed = (p: ProgressState, id: string) => Boolean(p.levels[`chemie:${id}`])

const LEVEL_BADGES: [string, string, string][] = [
  ['l1', 'Pán látek', '#ff6b6b'],
  ['l2', 'Atomový architekt', '#ff9f43'],
  ['l3', 'Mistr vazeb', '#f5c518'],
  ['l4', 'Počtář', '#51cf66'],
  ['l5', 'Strážce pH', '#20c997'],
  ['l6', 'Energetik', '#4dabf7'],
  ['l7', 'Znalec prvků', '#748ffc'],
  ['l8', 'Organik', '#b197fc'],
  ['l9', 'Biochemik', '#f783ac'],
]

export const BADGES: Badge[] = [
  { id: 'first-lesson', title: 'První pokus', description: 'Dokonči svou první lekci.', icon: 'flask', color: 'var(--accent)', earned: (p) => lessonsDone(p) >= 1 },
  { id: 'lessons-10', title: 'Laborant', description: 'Dokonči 10 lekcí.', icon: 'book', color: 'var(--blue)', earned: (p) => lessonsDone(p) >= 10 },
  { id: 'lessons-30', title: 'Chemik', description: 'Dokonči 30 lekcí.', icon: 'book', color: 'var(--violet)', earned: (p) => lessonsDone(p) >= 30 },
  { id: 'lessons-all', title: 'Profesor', description: 'Dokonči všech 54 lekcí chemie.', icon: 'trophy', color: 'var(--yellow)', earned: (p) => lessonsDone(p) >= 54 },
  { id: 'perfect-1', title: 'Bez chyby', description: 'Zvládni kvíz lekce na 100 %.', icon: 'target', color: 'var(--green)', earned: (p) => p.perfectQuizzes >= 1 },
  { id: 'perfect-10', title: 'Ostrostřelec', description: '10 kvízů na 100 %.', icon: 'target', color: 'var(--teal)', earned: (p) => p.perfectQuizzes >= 10 },
  { id: 'streak-3', title: 'Rozjezd', description: 'Uč se 3 dny v řadě.', icon: 'flame', color: 'var(--accent)', earned: (p) => p.streak.best >= 3 },
  { id: 'streak-7', title: 'Týden v laborce', description: 'Uč se 7 dní v řadě.', icon: 'flame', color: 'var(--warn)', earned: (p) => p.streak.best >= 7 },
  { id: 'streak-30', title: 'Věčný plamen', description: 'Uč se 30 dní v řadě.', icon: 'flame', color: 'var(--bad)', earned: (p) => p.streak.best >= 30 },
  { id: 'xp-1000', title: 'Tisícovka', description: 'Nasbírej 1 000 XP.', icon: 'bolt', color: 'var(--yellow)', earned: (p) => p.xp >= 1000 },
  { id: 'xp-5000', title: 'Reaktor', description: 'Nasbírej 5 000 XP.', icon: 'bolt', color: 'var(--pink)', earned: (p) => p.xp >= 5000 },
  { id: 'gamer', title: 'Hráč', description: 'Zahraj si 5 různých her.', icon: 'gamepad', color: 'var(--blue)', earned: (p) => Object.keys(p.games).length >= 5 },
  { id: 'gamer-all', title: 'Herní maniak', description: 'Zahraj si všech 14 her.', icon: 'gamepad', color: 'var(--violet)', earned: (p) => Object.keys(p.games).length >= 14 },
  { id: 'three-stars', title: 'Tři hvězdy', description: 'Získej 3 hvězdy v libovolné hře.', icon: 'star', color: 'var(--yellow)', earned: (p) => Object.values(p.games).some((g) => g.stars >= 3) },
  { id: 'elements-20', title: 'Sběratel', description: 'Sesbírej 20 prvků do alba.', icon: 'atom', color: 'var(--teal)', earned: (p) => p.elements.length >= 20 },
  { id: 'elements-50', title: 'Kurátor', description: 'Sesbírej 50 prvků do alba.', icon: 'atom', color: 'var(--green)', earned: (p) => p.elements.length >= 50 },
  { id: 'elements-all', title: 'Mendělejev', description: 'Sesbírej všech 118 prvků.', icon: 'atom', color: 'var(--accent)', earned: (p) => p.elements.length >= 118 },
  ...LEVEL_BADGES.map(
    ([id, title, color], i): Badge => ({
      id: `level-${id}`,
      title,
      description: `Zvládni závěrečnou výzvu ${i + 1}. úrovně.`,
      icon: 'trophy',
      color,
      earned: (p) => levelPassed(p, id),
    }),
  ),
]

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]))
