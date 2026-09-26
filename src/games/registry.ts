import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { GameId } from '../core/types'
import type { GameMeta, GameProps } from './types'

/**
 * All mini-games. Each game lives in src/games/<id>/index.tsx and
 * default-exports a React component taking GameProps.
 */
export const GAMES: GameMeta[] = [
  { id: 'periodic-find', title: 'Najdi prvek', blurb: 'Rychle najdi zadaný prvek v periodické tabulce.', kind: 'periodic', minLevel: 2 },
  { id: 'element-memory', title: 'Pexeso prvků', blurb: 'Spoj značku prvku s jeho názvem.', kind: 'periodic', minLevel: 2 },
  { id: 'who-am-i', title: 'Kdo jsem?', blurb: 'Uhádni prvek z nápověd. Čím méně nápověd, tím víc bodů.', kind: 'periodic', minLevel: 2 },
  { id: 'build-atom', title: 'Postav atom', blurb: 'Přidávej protony, neutrony a elektrony a sestav zadaný atom nebo ion.', kind: 'build', minLevel: 2 },
  { id: 'electron-config', title: 'Zaplň orbitaly', blurb: 'Rozmísti elektrony do orbitalů podle výstavbového principu.', kind: 'build', minLevel: 2 },
  { id: 'ion-builder', title: 'Iontová skládačka', blurb: 'Poskládej kationty a anionty tak, aby byla sloučenina neutrální.', kind: 'build', minLevel: 3 },
  { id: 'naming', title: 'Názvoslovný trenažér', blurb: 'Převáděj vzorce na názvy a zpět: oxidy, kyseliny, hydroxidy, soli.', kind: 'quiz', minLevel: 3 },
  { id: 'balance', title: 'Vyčísli rovnici', blurb: 'Nastav koeficienty tak, aby na obou stranách bylo stejně atomů.', kind: 'build', minLevel: 4 },
  { id: 'molar-mass', title: 'Molární hmotnost', blurb: 'Spočítej molární hmotnost sloučeniny dřív, než vyprší čas.', kind: 'quiz', minLevel: 4 },
  { id: 'quickfire', title: 'Blesková výzva', blurb: '60 sekund, co nejvíc správných odpovědí v řadě.', kind: 'quiz', minLevel: 1 },
  { id: 'swipe', title: 'Pravda, nebo lež?', blurb: 'Rozhoduj rychle: tvrzení je pravdivé, nebo ne?', kind: 'quiz', minLevel: 1 },
  { id: 'ph-lab', title: 'pH laboratoř', blurb: 'Přikapávej kyselinu a zásadu a sleduj barvu univerzálního indikátoru.', kind: 'lab', minLevel: 5 },
  { id: 'titration', title: 'Titrace', blurb: 'Zneutralizuj vzorek s přesností na kapku a spočítej koncentraci.', kind: 'lab', minLevel: 5 },
  { id: 'functional-groups', title: 'Funkční skupiny', blurb: 'Poznej skupinu atomů a přiřaď k ní správný typ sloučeniny.', kind: 'quiz', minLevel: 8 },
]

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<GameId, GameMeta>

export const GAME_COMPONENTS: Record<GameId, LazyExoticComponent<ComponentType<GameProps>>> = {
  'periodic-find': lazy(() => import('./periodic-find')),
  'element-memory': lazy(() => import('./element-memory')),
  'who-am-i': lazy(() => import('./who-am-i')),
  'build-atom': lazy(() => import('./build-atom')),
  'electron-config': lazy(() => import('./electron-config')),
  'ion-builder': lazy(() => import('./ion-builder')),
  naming: lazy(() => import('./naming')),
  balance: lazy(() => import('./balance')),
  'molar-mass': lazy(() => import('./molar-mass')),
  quickfire: lazy(() => import('./quickfire')),
  swipe: lazy(() => import('./swipe')),
  'ph-lab': lazy(() => import('./ph-lab')),
  titration: lazy(() => import('./titration')),
  'functional-groups': lazy(() => import('./functional-groups')),
}
