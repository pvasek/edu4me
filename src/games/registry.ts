import { type ComponentType, type LazyExoticComponent } from 'react'
import { lazyWithReload } from '../core/staleBuild'
import type { GameId } from '../core/types'
import type { GameMeta, GameProps } from './types'

/**
 * All mini-games. Each game lives in src/games/<id>/index.tsx and
 * default-exports a React component taking GameProps.
 */
export const GAMES: GameMeta[] = [
  {
    id: 'periodic-find',
    title: 'Najdi prvek',
    blurb: 'Rychle najdi v periodické tabulce prvek podle názvu, značky nebo nápovědy.',
    kind: 'periodic',
    levels: {
      2: 'prvních 20 prvků: názvy, značky, skupiny a periody',
      3: 'elektronegativita, náboje iontů a typ vazby',
      6: 'reaktivita kovů a elektrochemická řada',
      7: 'celá tabulka: skupiny, bloky a vlastnosti prvků',
      9: 'biogenní prvky a stopové prvky v těle',
    },
  },
  {
    id: 'element-memory',
    title: 'Chemické pexeso',
    blurb: 'Otáčej karty a hledej dvojice, které k sobě patří.',
    kind: 'periodic',
    levels: {
      2: 'značka prvku ↔ český název',
      3: 'vzorec ↔ název dvouprvkové sloučeniny',
      4: 'veličina ↔ jednotka a vzorec výpočtu',
      5: 'kyselina ↔ sůl a indikátor ↔ barva',
      6: 'pojem ↔ definice (redox, energie, rovnováha)',
      7: 'prvek ↔ typická sloučenina nebo využití',
      8: 'funkční skupina ↔ třída sloučenin',
      9: 'biomolekula ↔ stavební jednotka',
    },
  },
  {
    id: 'who-am-i',
    title: 'Kdo jsem?',
    blurb: 'Uhádni prvek nebo látku z nápověd. Čím méně nápověd, tím víc bodů.',
    kind: 'periodic',
    levels: {
      2: 'prvky podle stavby atomu a polohy v tabulce',
      3: 'prvky podle vazeb, iontů a elektronegativity',
      7: 'prvky podle vlastností, výroby a využití',
      8: 'organické látky (ethanol, benzen, aceton…)',
      9: 'biomolekuly (glukóza, DNA, hemoglobin…)',
    },
  },
  {
    id: 'build-atom',
    title: 'Postav atom',
    blurb: 'Přidávej protony, neutrony a elektrony a sestav zadaný atom, izotop nebo ion.',
    kind: 'build',
    levels: {
      2: 'atomy a izotopy prvků do Z = 20',
      3: 'ionty s konfigurací vzácného plynu',
    },
  },
  {
    id: 'electron-config',
    title: 'Zaplň orbitaly',
    blurb: 'Rozmísti elektrony do orbitalů podle výstavbového principu, Pauliho a Hundova pravidla.',
    kind: 'build',
    levels: {
      2: 'atomy do Z = 20',
      3: 'ionty hlavních skupin',
      7: 'přechodné kovy, jejich ionty a výjimky Cr a Cu',
    },
  },
  {
    id: 'ion-builder',
    title: 'Iontová skládačka',
    blurb: 'Poskládej kationty a anionty tak, aby byla sloučenina neutrální.',
    kind: 'build',
    levels: {
      3: 'jednoduché ionty: halogenidy, oxidy, sulfidy',
      5: 'víceatomové ionty: soli oxokyselin, hydroxidy, hydrogensoli',
      7: 'přechodné kovy s různými náboji a méně běžné anionty',
    },
  },
  {
    id: 'naming',
    title: 'Názvoslovný trenažér',
    blurb: 'Převáděj vzorce na názvy a zpět.',
    kind: 'quiz',
    levels: {
      3: 'oxidy, halogenidy, sulfidy, hydridy, peroxidy',
      5: 'kyseliny, hydroxidy, soli, hydrogensoli a hydráty',
      7: 'vše anorganické včetně iontů a komplexů',
      8: 'organické názvosloví: uhlovodíky a deriváty',
    },
  },
  {
    id: 'balance',
    title: 'Vyčísli rovnici',
    blurb: 'Nastav koeficienty tak, aby na obou stranách bylo stejně atomů.',
    kind: 'build',
    levels: {
      4: 'syntézy, rozklady, záměny a spalování',
      5: 'neutralizace, srážecí reakce a reakce kyselin',
      6: 'redoxní rovnice',
      7: 'průmyslové výroby (vysoká pec, Haber–Bosch, kontaktní způsob)',
      8: 'spalování a reakce organických látek',
      9: 'fotosyntéza, dýchání, kvašení a biochemické děje',
    },
  },
  {
    id: 'molar-mass',
    title: 'Molární hmotnost',
    blurb: 'Spočítej molární hmotnost látky dřív, než vyprší čas.',
    kind: 'quiz',
    levels: {
      4: 'jednoduché sloučeniny a plyny',
      5: 'kyseliny, hydroxidy, soli a hydráty',
      7: 'minerály, rudy a průmyslové látky',
      8: 'organické sloučeniny',
      9: 'biomolekuly: cukry, aminokyseliny, tuky',
    },
  },
  {
    id: 'quickfire',
    title: 'Blesková výzva',
    blurb: '60 sekund, co nejvíc správných odpovědí v řadě.',
    kind: 'quiz',
    levels: {
      1: 'otázky z lekcí úrovně 1',
      2: 'otázky z lekcí úrovně 2',
      3: 'otázky z lekcí úrovně 3',
      4: 'otázky z lekcí úrovně 4',
      5: 'otázky z lekcí úrovně 5',
      6: 'otázky z lekcí úrovně 6',
      7: 'otázky z lekcí úrovně 7',
      8: 'otázky z lekcí úrovně 8',
      9: 'otázky z lekcí úrovně 9',
    },
  },
  {
    id: 'swipe',
    title: 'Pravda, nebo lež?',
    blurb: 'Rozhoduj rychle: tvrzení je pravdivé, nebo ne?',
    kind: 'quiz',
    levels: {
      1: 'tvrzení z úrovně 1',
      2: 'tvrzení z úrovně 2',
      3: 'tvrzení z úrovně 3',
      4: 'tvrzení z úrovně 4',
      5: 'tvrzení z úrovně 5',
      6: 'tvrzení z úrovně 6',
      7: 'tvrzení z úrovně 7',
      8: 'tvrzení z úrovně 8',
      9: 'tvrzení z úrovně 9',
    },
  },
  {
    id: 'ph-lab',
    title: 'pH laboratoř',
    blurb: 'Přikapávej roztoky a sleduj barvu indikátoru a hodnotu pH.',
    kind: 'lab',
    levels: {
      5: 'silné kyseliny a zásady, neutralizace, ředění',
      6: 'slabé kyseliny a pufry',
      9: 'pH v živých organismech: krev, žaludek, enzymy',
    },
  },
  {
    id: 'titration',
    title: 'Titrace',
    blurb: 'Zneutralizuj vzorek s přesností na kapku a spočítej koncentraci.',
    kind: 'lab',
    levels: {
      5: 'silná kyselina + silná zásada (HCl, NaOH)',
      6: 'slabá kyselina, volba indikátoru a dvojsytné kyseliny',
    },
  },
  {
    id: 'functional-groups',
    title: 'Funkční skupiny',
    blurb: 'Poznej skupinu atomů a přiřaď k ní správný typ sloučeniny.',
    kind: 'quiz',
    levels: {
      8: 'funkční skupiny organických sloučenin',
      9: 'funkční skupiny v biomolekulách',
    },
  },
]

/** Games available for a level number, in registry order. */
export const gamesForLevel = (n: number) => GAMES.filter((g) => n in g.levels)

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<GameId, GameMeta>

export const GAME_COMPONENTS: Record<GameId, LazyExoticComponent<ComponentType<GameProps>>> = {
  'periodic-find': lazyWithReload(() => import('./periodic-find')),
  'element-memory': lazyWithReload(() => import('./element-memory')),
  'who-am-i': lazyWithReload(() => import('./who-am-i')),
  'build-atom': lazyWithReload(() => import('./build-atom')),
  'electron-config': lazyWithReload(() => import('./electron-config')),
  'ion-builder': lazyWithReload(() => import('./ion-builder')),
  naming: lazyWithReload(() => import('./naming')),
  balance: lazyWithReload(() => import('./balance')),
  'molar-mass': lazyWithReload(() => import('./molar-mass')),
  quickfire: lazyWithReload(() => import('./quickfire')),
  swipe: lazyWithReload(() => import('./swipe')),
  'ph-lab': lazyWithReload(() => import('./ph-lab')),
  titration: lazyWithReload(() => import('./titration')),
  'functional-groups': lazyWithReload(() => import('./functional-groups')),
}
