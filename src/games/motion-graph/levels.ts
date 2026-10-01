/**
 * Graf pohybu – content per level (spec/courses/fyzika/games.md):
 *  2 přiřaď příběh ke grafu s–t a v–t (f2-2),
 *  8 rovnoměrně zrychlený pohyb: směrnice a plocha pod grafem (f8-2).
 *
 * A level-2 story is the motion itself: the corners of its s–t or v–t graph
 * (time, value). Everything shown to the learner – the graphs, the wrong graphs,
 * the explanation – is computed from these points in logic.ts. Level 8 graphs are
 * generated in logic.ts.
 */

export type GraphType = 'st' | 'vt'

export interface Story {
  id: string
  text: string
  graph: GraphType
  /** Corner times (increasing, from 0). */
  t: number[]
  /** Distance (s–t) or speed (v–t) at each corner. */
  y: number[]
}

const st = (id: string, text: string, t: number[], y: number[]): Story => ({ id, text, graph: 'st', t, y })
const vt = (id: string, text: string, t: number[], y: number[]): Story => ({ id, text, graph: 'vt', t, y })

export const STORIES: Story[] = [
  st('semafor', 'Cyklista jel stálou rychlostí, u semaforu chvíli stál a pak jel dál stejně rychle.', [0, 3, 5, 8], [0, 3, 3, 6]),
  st('stanek', 'Chodec došel ke stánku, chvíli tam stál a stejnou rychlostí se vrátil domů.', [0, 3, 5, 8], [0, 3, 3, 0]),
  st('svacina', 'Žák šel do školy, v půlce cesty si vzpomněl na svačinu a hned se stejně rychle vrátil domů.', [0, 4, 8], [0, 3, 0]),
  st('autobus', 'Autobus stál na zastávce, pak se rozjel a jel stálou rychlostí.', [0, 3, 8], [0, 0, 5]),
  st('zrychlil', 'Běžec běžel nejdřív pomalu a pak dvakrát rychleji.', [0, 4, 8], [0, 2, 6]),
  st('zpomalil', 'Běžec vyběhl rychle a pak zpomalil na poloviční tempo.', [0, 4, 8], [0, 4, 6]),
  st('pes', 'Pes běžel celou dobu stejnou rychlostí stále stejným směrem.', [0, 8], [0, 6]),
  st('houpacka', 'Dítě rychle doběhlo k houpačce, hned se otočilo a pomalu šlo kus cesty zpátky.', [0, 2, 8], [0, 4, 1]),
  st('kolo', 'Kolo stálo celou dobu opřené o zeď kousek od startu.', [0, 8], [3, 3]),
  st('turista', 'Turista šel pomalu do kopce a nahoře si dlouho odpočinul.', [0, 5, 8], [0, 3, 3]),
  st('brusle', 'Bruslař jel rychle, pak chvíli stál a nakonec jel pomaleji dál.', [0, 2, 4, 8], [0, 4, 4, 6]),

  vt('rozjezd', 'Auto se rozjelo od semaforu a pak jelo stálou rychlostí.', [0, 3, 8], [0, 4, 4]),
  vt('vlak', 'Vlak jel stálou rychlostí a pak rovnoměrně brzdil až do zastavení.', [0, 5, 8], [4, 4, 0]),
  vt('vytah', 'Výtah se rozjel, chvíli jel stálou rychlostí a zase zabrzdil.', [0, 2, 6, 8], [0, 3, 3, 0]),
  vt('sane', 'Sáňkař jel z kopce stále rychleji.', [0, 8], [0, 5]),
  vt('cyklista', 'Cyklista jel celou dobu stálou rychlostí.', [0, 8], [3, 3]),
  vt('mic', 'Míč se kutálel po trávě, postupně zpomaloval, až se zastavil.', [0, 8], [4, 0]),
  vt('cervena', 'Auto stálo na červenou, pak se rozjelo stále rychleji.', [0, 3, 8], [0, 0, 4]),
  vt('spurt', 'Běžec běžel stálou rychlostí a před cílem ještě zrychlil do spurtu.', [0, 5, 8], [3, 3, 5]),
  vt('zatacka', 'Motorkář zpomalil před zatáčkou, projel ji pomalu a za ní zase zrychlil.', [0, 3, 5, 8], [4, 2, 2, 4]),
  vt('tramvaj', 'Tramvaj se rozjela a hned zase zabrzdila a zastavila.', [0, 4, 8], [0, 3, 0]),
]

/** Levels the game has content for. */
export const LEVELS: Record<number, 'stories' | 'numbers'> = { 2: 'stories', 8: 'numbers' }

/** Tasks per round. */
export const ROUND: Record<number, number> = { 2: 10, 8: 8 }
export const MIX_ROUND = 10
