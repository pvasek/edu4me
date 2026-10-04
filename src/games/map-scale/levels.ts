/**
 * Měřítko mapy – content (spec/courses/zemepis/games.md, level 1, lesson z1-3).
 * Only the inputs live here (scales, purposes, place names); every answer is computed in logic.ts.
 */

/** Denominators of the scales used in calculations (common Czech map series). */
export const SCALES = [5_000, 10_000, 20_000, 25_000, 50_000, 100_000, 200_000, 250_000, 500_000, 1_000_000] as const

/** Scales for the virtual-ruler task (the map is a hiking or town map). */
export const RULER_SCALES = [10_000, 25_000, 50_000, 100_000] as const

/**
 * Map classes for "choose the right scale". The classes are far apart on purpose,
 * so exactly one of the offered scales fits each purpose.
 */
export type MapClass = 'plan' | 'hiking' | 'road' | 'atlas'

export const CLASS_SCALES: Record<MapClass, readonly number[]> = {
  plan: [5_000, 10_000],
  hiking: [25_000, 50_000],
  road: [500_000, 1_000_000],
  atlas: [50_000_000, 100_000_000],
}

export const CLASS_NAME: Record<MapClass, string> = {
  plan: 'plán města',
  hiking: 'turistická mapa',
  road: 'automapa / přehledná mapa státu',
  atlas: 'mapa světa nebo kontinentu v atlase',
}

export interface Purpose {
  /** The situation, Czech, one sentence. */
  text: string
  cls: MapClass
  /** Why that scale fits (one line). */
  why: string
}

export const PURPOSES: Purpose[] = [
  {
    text: 'Hledáš v Brně ulici, zastávku tramvaje a vchod do školy.',
    cls: 'plan',
    why: 'Na plánu města je 1 cm jen 50–100 m, takže se vejdou jednotlivé ulice a domy.',
  },
  {
    text: 'Chceš najít, kudy vede tramvaj v centru Olomouce a kde je radnice.',
    cls: 'plan',
    why: 'Uvnitř jednoho města potřebuješ co nejpodrobnější mapu, tedy největší měřítko.',
  },
  {
    text: 'Plánuješ celodenní pěší túru po Krkonoších po značených cestách.',
    cls: 'hiking',
    why: 'Turistická mapa 1 : 25 000 až 1 : 50 000 ukáže stezky, značky i vrstevnice na celé túře.',
  },
  {
    text: 'Potřebuješ vidět vrstevnice a turistické značky kolem Sněžky.',
    cls: 'hiking',
    why: 'Vrstevnice a značené cesty mají turistické mapy v měřítku 1 : 25 000 až 1 : 50 000.',
  },
  {
    text: 'Jedete autem z Prahy do Ostravy a chcete vybrat dálnice a silnice.',
    cls: 'road',
    why: 'Na trase přes celé Česko stačí 1 cm = 5–10 km; ulice ani pěšiny nejsou potřeba.',
  },
  {
    text: 'Chceš mít na jednom listu celé Česko se všemi krajskými městy.',
    cls: 'road',
    why: 'Celý stát se na list vejde jen v malém měřítku, kolem 1 : 1 000 000.',
  },
  {
    text: 'Ve škole hledáš v atlase, kde leží státy Afriky.',
    cls: 'atlas',
    why: 'Celý kontinent se vejde na stránku atlasu jen ve velmi malém měřítku.',
  },
  {
    text: 'Chceš na jedné mapě ukázat všechny oceány a světadíly.',
    cls: 'atlas',
    why: 'Mapa světa má nejmenší měřítko: 1 cm jsou stovky kilometrů.',
  },
]

/** Pairs of places for the ruler task: [start, goal, a point on the way]. */
export const PLACES: [string, string, string][] = [
  ['chata', 'rozhledna', 'most'],
  ['nádraží', 'hrad', 'kaple'],
  ['kostel', 'koupaliště', 'mlýn'],
  ['škola', 'zastávka', 'pošta'],
  ['náměstí', 'zámek', 'brána'],
  ['parkoviště', 'vyhlídka', 'studánka'],
  ['tábor', 'jezírko', 'lávka'],
  ['penzion', 'jeskyně', 'rozcestí'],
]
