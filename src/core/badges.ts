import type { ProgressState } from './progress'
import type { IconName } from '../ui/Icon'
import type { Course } from './types'
import { chemie } from '../courses/chemie'
import { fyzika } from '../courses/fyzika'
import { gamesForCourse } from '../games/registry'

const lessonCount = (c: Course) => c.levels.reduce((n, l) => n + l.lessons.length, 0)
const CHEMIE_LESSONS = lessonCount(chemie)
const FYZIKA_LESSONS = lessonCount(fyzika)
const CHEMIE_GAMES = gamesForCourse('chemie').map((g) => g.id)

export interface Badge {
  id: string
  title: string
  description: string
  icon: IconName
  color: string
  earned: (p: ProgressState) => boolean
  /** badge belongs to one course (hidden while that course isn't published) */
  course?: string
}

const lessonsDone = (p: ProgressState) => Object.keys(p.lessons).length
const courseLessonsDone = (p: ProgressState, courseId: string) => Object.keys(p.lessons).filter((k) => k.startsWith(`${courseId}:`)).length
const levelPassed = (p: ProgressState, id: string, courseId = 'chemie') => Boolean(p.levels[`${courseId}:${id}`])
/** chemical elements in the album (other courses' emblems are stored as "course:symbol") */
export const albumElements = (p: ProgressState) => p.elements.filter((e) => !e.includes(':'))

const FYZIKA_LEVEL_BADGES: [string, string][] = [
  ['l1', 'Měřič'],
  ['l2', 'Pán sil'],
  ['l3', 'Archimédes'],
  ['l4', 'Topič'],
  ['l5', 'Optik'],
  ['l6', 'Elektrikář'],
  ['l7', 'Astronom'],
  ['l8', 'Newtonovec'],
  ['l9', 'Keplerovec'],
  ['l10', 'Termodynamik'],
  ['l11', 'Faradayovec'],
  ['l12', 'Kvantový fyzik'],
]

const LEVEL_BADGES: [string, string, string][] = [
  ['l1', 'Pán látek', '#b8483a'],
  ['l2', 'Atomový architekt', '#bd6a26'],
  ['l3', 'Mistr vazeb', '#9c7a12'],
  ['l4', 'Počtář', '#56834a'],
  ['l5', 'Strážce pH', '#2c7a72'],
  ['l6', 'Energetik', '#3f6699'],
  ['l7', 'Znalec prvků', '#555a9e'],
  ['l8', 'Organik', '#7a5290'],
  ['l9', 'Biochemik', '#a84d6c'],
]

export const BADGES: Badge[] = [
  { id: 'first-lesson', title: 'První pokus', description: 'Dokonči svou první lekci.', icon: 'flask', color: 'var(--accent)', earned: (p) => lessonsDone(p) >= 1 },
  { id: 'lessons-10', title: 'Laborant', description: 'Dokonči 10 lekcí.', icon: 'book', color: 'var(--blue)', earned: (p) => lessonsDone(p) >= 10 },
  { id: 'lessons-30', title: 'Chemik', description: 'Dokonči 30 lekcí.', icon: 'book', color: 'var(--violet)', earned: (p) => lessonsDone(p) >= 30 },
  { id: 'lessons-all', title: 'Profesor', description: `Dokonči všech ${CHEMIE_LESSONS} lekcí chemie.`, icon: 'trophy', color: 'var(--yellow)', course: 'chemie', earned: (p) => lessonsDone(p) >= CHEMIE_LESSONS },
  { id: 'perfect-1', title: 'Bez chyby', description: 'Zvládni kvíz lekce na 100 %.', icon: 'target', color: 'var(--green)', earned: (p) => p.perfectQuizzes >= 1 },
  { id: 'perfect-10', title: 'Ostrostřelec', description: '10 kvízů na 100 %.', icon: 'target', color: 'var(--teal)', earned: (p) => p.perfectQuizzes >= 10 },
  { id: 'streak-3', title: 'Rozjezd', description: 'Uč se 3 dny v řadě.', icon: 'flame', color: 'var(--accent)', earned: (p) => p.streak.best >= 3 },
  { id: 'streak-7', title: 'Týden v laborce', description: 'Uč se 7 dní v řadě.', icon: 'flame', color: 'var(--warn)', earned: (p) => p.streak.best >= 7 },
  { id: 'streak-30', title: 'Věčný plamen', description: 'Uč se 30 dní v řadě.', icon: 'flame', color: 'var(--bad)', earned: (p) => p.streak.best >= 30 },
  { id: 'xp-1000', title: 'Tisícovka', description: 'Nasbírej 1 000 XP.', icon: 'bolt', color: 'var(--yellow)', earned: (p) => p.xp >= 1000 },
  { id: 'xp-5000', title: 'Reaktor', description: 'Nasbírej 5 000 XP.', icon: 'bolt', color: 'var(--pink)', earned: (p) => p.xp >= 5000 },
  { id: 'gamer', title: 'Hráč', description: 'Zahraj si 5 různých her.', icon: 'gamepad', color: 'var(--blue)', earned: (p) => Object.keys(p.games).length >= 5 },
  { id: 'gamer-all', title: 'Herní maniak', description: `Zahraj si všech ${CHEMIE_GAMES.length} chemických her.`, icon: 'gamepad', color: 'var(--violet)', course: 'chemie', earned: (p) => CHEMIE_GAMES.every((g) => p.games[g]) },
  { id: 'three-stars', title: 'Tři hvězdy', description: 'Získej 3 hvězdy v libovolné hře.', icon: 'star', color: 'var(--yellow)', earned: (p) => Object.values(p.games).some((g) => g.stars >= 3) },
  { id: 'elements-20', title: 'Sběratel', description: 'Sesbírej 20 prvků do alba.', icon: 'atom', color: 'var(--teal)', course: 'chemie', earned: (p) => albumElements(p).length >= 20 },
  { id: 'elements-50', title: 'Kurátor', description: 'Sesbírej 50 prvků do alba.', icon: 'atom', color: 'var(--green)', course: 'chemie', earned: (p) => albumElements(p).length >= 50 },
  { id: 'elements-all', title: 'Mendělejev', description: 'Sesbírej všech 118 prvků.', icon: 'atom', color: 'var(--accent)', course: 'chemie', earned: (p) => albumElements(p).length >= 118 },
  ...LEVEL_BADGES.map(
    ([id, title, color], i): Badge => ({
      id: `level-${id}`,
      title,
      description: `Zvládni závěrečnou výzvu ${i + 1}. úrovně chemie.`,
      icon: 'trophy',
      color,
      course: 'chemie',
      earned: (p) => levelPassed(p, id),
    }),
  ),
  // physics
  { id: 'fyzika-first', title: 'První měření', description: 'Dokonči první lekci fyziky.', icon: 'target', color: '#3f6699', course: 'fyzika', earned: (p) => courseLessonsDone(p, 'fyzika') >= 1 },
  { id: 'fyzika-all', title: 'Fyzik', description: `Dokonči všech ${FYZIKA_LESSONS} lekcí fyziky.`, icon: 'trophy', color: '#3f6699', course: 'fyzika', earned: (p) => courseLessonsDone(p, 'fyzika') >= FYZIKA_LESSONS },
  ...FYZIKA_LEVEL_BADGES.map(
    ([id, title], i): Badge => ({
      id: `fyzika-level-${id}`,
      title,
      description: `Zvládni závěrečnou výzvu ${i + 1}. úrovně fyziky.`,
      icon: 'trophy',
      color: fyzika.levels[i]?.color ?? '#3f6699',
      course: 'fyzika',
      earned: (p) => levelPassed(p, id, 'fyzika'),
    }),
  ),
]

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]))
