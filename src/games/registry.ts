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
    courses: {
      chemie: {
        2: 'prvních 20 prvků: názvy, značky, skupiny a periody',
        3: 'elektronegativita, náboje iontů a typ vazby',
        6: 'reaktivita kovů a elektrochemická řada',
        7: 'celá tabulka: skupiny, bloky a vlastnosti prvků',
        9: 'biogenní prvky a stopové prvky v těle',
      },
    },
  },
  {
    id: 'element-memory',
    title: 'Chemické pexeso',
    blurb: 'Otáčej karty a hledej dvojice, které k sobě patří.',
    kind: 'periodic',
    courses: {
      chemie: {
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
  },
  {
    id: 'who-am-i',
    title: 'Kdo jsem?',
    blurb: 'Uhádni prvek nebo látku z nápověd. Čím méně nápověd, tím víc bodů.',
    kind: 'periodic',
    courses: {
      chemie: {
        2: 'prvky podle stavby atomu a polohy v tabulce',
        3: 'prvky podle vazeb, iontů a elektronegativity',
        7: 'prvky podle vlastností, výroby a využití',
        8: 'organické látky (ethanol, benzen, aceton…)',
        9: 'biomolekuly (glukóza, DNA, hemoglobin…)',
      },
    },
  },
  {
    id: 'build-atom',
    title: 'Postav atom',
    blurb: 'Přidávej protony, neutrony a elektrony a sestav zadaný atom, izotop nebo ion.',
    kind: 'build',
    courses: {
      chemie: {
        2: 'atomy a izotopy prvků do Z = 20',
        3: 'ionty s konfigurací vzácného plynu',
      },
    },
  },
  {
    id: 'electron-config',
    title: 'Zaplň orbitaly',
    blurb: 'Rozmísti elektrony do orbitalů podle výstavbového principu, Pauliho a Hundova pravidla.',
    kind: 'build',
    courses: {
      chemie: {
        2: 'atomy do Z = 20',
        3: 'ionty hlavních skupin',
        7: 'přechodné kovy, jejich ionty a výjimky Cr a Cu',
      },
    },
  },
  {
    id: 'ion-builder',
    title: 'Iontová skládačka',
    blurb: 'Poskládej kationty a anionty tak, aby byla sloučenina neutrální.',
    kind: 'build',
    courses: {
      chemie: {
        3: 'jednoduché ionty: halogenidy, oxidy, sulfidy',
        5: 'víceatomové ionty: soli oxokyselin, hydroxidy, hydrogensoli',
        7: 'přechodné kovy s různými náboji a méně běžné anionty',
      },
    },
  },
  {
    id: 'naming',
    title: 'Názvoslovný trenažér',
    blurb: 'Převáděj vzorce na názvy a zpět.',
    kind: 'quiz',
    courses: {
      chemie: {
        3: 'oxidy, halogenidy, sulfidy, hydridy, peroxidy',
        5: 'kyseliny, hydroxidy, soli, hydrogensoli a hydráty',
        7: 'vše anorganické včetně iontů a komplexů',
        8: 'organické názvosloví: uhlovodíky a deriváty',
      },
    },
  },
  {
    id: 'balance',
    title: 'Vyčísli rovnici',
    blurb: 'Nastav koeficienty tak, aby na obou stranách bylo stejně atomů.',
    kind: 'build',
    courses: {
      chemie: {
        4: 'syntézy, rozklady, záměny a spalování',
        5: 'neutralizace, srážecí reakce a reakce kyselin',
        6: 'redoxní rovnice',
        7: 'průmyslové výroby (vysoká pec, Haber–Bosch, kontaktní způsob)',
        8: 'spalování a reakce organických látek',
        9: 'fotosyntéza, dýchání, kvašení a biochemické děje',
      },
    },
  },
  {
    id: 'molar-mass',
    title: 'Molární hmotnost',
    blurb: 'Spočítej molární hmotnost látky dřív, než vyprší čas.',
    kind: 'quiz',
    courses: {
      chemie: {
        4: 'jednoduché sloučeniny a plyny',
        5: 'kyseliny, hydroxidy, soli a hydráty',
        7: 'minerály, rudy a průmyslové látky',
        8: 'organické sloučeniny',
        9: 'biomolekuly: cukry, aminokyseliny, tuky',
      },
    },
  },
  {
    id: 'quickfire',
    title: 'Blesková výzva',
    blurb: '60 sekund, co nejvíc správných odpovědí v řadě.',
    kind: 'quiz',
    courses: {
      chemie: {
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
      fyzika: {
        1: 'měření, jednotky, hustota, částice a teplota',
        2: 'pohyb, grafy, síly a Newtonovy zákony',
        3: 'tlak, vztlak, práce a energie',
        4: 'teplo, skupenství, motory a zvuk',
        5: 'světlo, zrcadla, čočky a barvy',
        6: 'elektrický obvod, Ohmův zákon a bezpečnost',
        7: 'magnetismus, elektrárny, jádro a vesmír',
        8: 'kinematika, dynamika, hybnost a energie',
        9: 'gravitace, rotace, kmity a vlny',
        10: 'kinetická teorie, plyny a termodynamika',
        11: 'elektrické a magnetické pole, obvody a indukce',
        12: 'optika, relativita, kvanta, jádro a vesmír',
      },
      biologie: {
        1: 'znaky života, mikroskop, buňka a třídění',
        2: 'viry, bakterie, prvoci a řasy, houby a lišejníky',
        3: 'stavba, výživa a rozmnožování rostlin',
        4: 'bezobratlí živočichové',
        5: 'obratlovci a chování',
        6: 'lidské tělo, zdraví a první pomoc',
        7: 'dědičnost, mutace a evoluce',
        8: 'Země, horniny, ekosystémy a ochrana přírody',
        9: 'buňka, membrány, enzymy, dýchání a fotosyntéza',
        10: 'molekulární genetika a biotechnologie',
        11: 'fyziologie a homeostáza',
        12: 'evoluce, populace a ekosystémy',
      },
      zemepis: {
        1: 'mapa, zeměpisná síť, měřítko a orientace',
        2: 'tvar a pohyby Země, čas a roční období',
        3: 'desky, sopky, pohoří, eroze a půdy',
        4: 'počasí, podnebí, vody a krajinné pásy',
        5: 'obyvatelstvo, migrace, kultury, sídla a státy',
        6: 'hospodářství, doprava, obchod a globalizace',
        7: 'regiony světa',
        8: 'Evropa a Evropská unie',
        9: 'Česko a jeho kraje',
        10: 'systémy Země, změna klimatu a přírodní rizika',
        11: 'demografie, města, kultura a geopolitika',
        12: 'globální hospodářství, zdroje a udržitelnost',
      },
    },
  },
  {
    id: 'swipe',
    title: 'Pravda, nebo lež?',
    blurb: 'Rozhoduj rychle: tvrzení je pravdivé, nebo ne?',
    kind: 'quiz',
    courses: {
      chemie: {
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
      fyzika: {
        1: 'měření, jednotky, hustota, částice a teplota',
        2: 'pohyb, grafy, síly a Newtonovy zákony',
        3: 'tlak, vztlak, práce a energie',
        4: 'teplo, skupenství, motory a zvuk',
        5: 'světlo, zrcadla, čočky a barvy',
        6: 'elektrický obvod, Ohmův zákon a bezpečnost',
        7: 'magnetismus, elektrárny, jádro a vesmír',
        8: 'kinematika, dynamika, hybnost a energie',
        9: 'gravitace, rotace, kmity a vlny',
        10: 'kinetická teorie, plyny a termodynamika',
        11: 'elektrické a magnetické pole, obvody a indukce',
        12: 'optika, relativita, kvanta, jádro a vesmír',
      },
      biologie: {
        1: 'znaky života, mikroskop, buňka a třídění',
        2: 'viry, bakterie, prvoci a řasy, houby a lišejníky',
        3: 'stavba, výživa a rozmnožování rostlin',
        4: 'bezobratlí živočichové',
        5: 'obratlovci a chování',
        6: 'lidské tělo, zdraví a první pomoc',
        7: 'dědičnost, mutace a evoluce',
        8: 'Země, horniny, ekosystémy a ochrana přírody',
        9: 'buňka, membrány, enzymy, dýchání a fotosyntéza',
        10: 'molekulární genetika a biotechnologie',
        11: 'fyziologie a homeostáza',
        12: 'evoluce, populace a ekosystémy',
      },
      zemepis: {
        1: 'mapa, zeměpisná síť, měřítko a orientace',
        2: 'tvar a pohyby Země, čas a roční období',
        3: 'desky, sopky, pohoří, eroze a půdy',
        4: 'počasí, podnebí, vody a krajinné pásy',
        5: 'obyvatelstvo, migrace, kultury, sídla a státy',
        6: 'hospodářství, doprava, obchod a globalizace',
        7: 'regiony světa',
        8: 'Evropa a Evropská unie',
        9: 'Česko a jeho kraje',
        10: 'systémy Země, změna klimatu a přírodní rizika',
        11: 'demografie, města, kultura a geopolitika',
        12: 'globální hospodářství, zdroje a udržitelnost',
      },
    },
  },
  {
    id: 'ph-lab',
    title: 'pH laboratoř',
    blurb: 'Přikapávej roztoky a sleduj barvu indikátoru a hodnotu pH.',
    kind: 'lab',
    courses: {
      chemie: {
        5: 'silné kyseliny a zásady, neutralizace, ředění',
        6: 'slabé kyseliny a pufry',
        9: 'pH v živých organismech: krev, žaludek, enzymy',
      },
    },
  },
  {
    id: 'titration',
    title: 'Titrace',
    blurb: 'Zneutralizuj vzorek s přesností na kapku a spočítej koncentraci.',
    kind: 'lab',
    courses: {
      chemie: {
        5: 'silná kyselina + silná zásada (HCl, NaOH)',
        6: 'slabá kyselina, volba indikátoru a dvojsytné kyseliny',
      },
    },
  },
  {
    id: 'functional-groups',
    title: 'Funkční skupiny',
    blurb: 'Poznej skupinu atomů a přiřaď k ní správný typ sloučeniny.',
    kind: 'quiz',
    courses: {
      chemie: {
        8: 'funkční skupiny organických sloučenin',
        9: 'funkční skupiny v biomolekulách',
      },
    },
  },
  // physics
  {
    id: 'unit-convert',
    title: 'Převody jednotek',
    blurb: 'Převáděj jednotky a předpony rychle a bez chyby.',
    kind: 'quiz',
    courses: {
      fyzika: {
        1: 'délka, objem, hmotnost, čas a předpony',
        2: 'rychlost km/h ↔ m/s a síla',
        3: 'tlak, práce, výkon a energie',
        6: 'proud, napětí, odpor a kWh',
        8: 'vědecký zápis a odvozené jednotky',
      },
    },
  },
  {
    id: 'float-sink',
    title: 'Plave, nebo klesne?',
    blurb: 'Odhadni, co se v kapalině stane s tělesem, a ověř to výpočtem.',
    kind: 'lab',
    courses: {
      fyzika: {
        1: 'hustota: plave, nebo klesne',
        3: 'vztlaková síla, Archimédův zákon a ponor',
      },
    },
  },
  {
    id: 'motion-graph',
    title: 'Graf pohybu',
    blurb: 'Přiřaď příběh pohybu ke správnému grafu a čti z něj.',
    kind: 'motion',
    courses: {
      fyzika: {
        2: 'příběh ↔ graf s–t a v–t',
        8: 'zrychlený pohyb: směrnice a plocha pod grafem',
      },
    },
  },
  {
    id: 'force-sum',
    title: 'Výslednice sil',
    blurb: 'Slož síly a najdi výslednici, nebo sílu, která těleso udrží v klidu.',
    kind: 'motion',
    courses: {
      fyzika: {
        2: 'síly na jedné přímce a rovnováha',
        8: 'skládání pod úhlem, rozklad sil a nakloněná rovina',
      },
    },
  },
  {
    id: 'energy-chain',
    title: 'Energetický řetězec',
    blurb: 'Seřaď přeměny energie od zdroje až po užitek a spočítej účinnost.',
    kind: 'energy',
    courses: {
      fyzika: {
        3: 'přeměny mechanické energie',
        4: 'teplo, skupenství a tepelné motory',
        7: 'elektrárny a zdroje energie',
        10: 'tepelné stroje, Carnotova účinnost, chladnička a tepelné čerpadlo',
      },
    },
  },
  {
    id: 'circuit-builder',
    title: 'Stavitel obvodů',
    blurb: 'Předpověz, co ukážou měřidla, která žárovka svítí nejvíc, a postav obvod podle zadání.',
    kind: 'circuit',
    courses: {
      fyzika: {
        6: 'sériové a paralelní zapojení, Ohmův zákon, jas žárovek a výkon',
        11: 'Kirchhoffovy zákony, vnitřní odpor zdroje, výsledný odpor sítě a výkon',
      },
    },
  },
  {
    id: 'ray-optics',
    title: 'Paprsky',
    blurb: 'Najdi, kde vznikne obraz, urči, jaký bude, a sleduj význačné paprsky.',
    kind: 'optics',
    courses: {
      fyzika: {
        5: 'odraz, lom a obraz v čočce a zrcadle',
        12: 'zobrazovací rovnice, zvětšení a optická mohutnost',
      },
    },
  },
  {
    id: 'projectile',
    title: 'Vrh',
    blurb: 'Nastav úhel a rychlost a zasáhni cíl.',
    kind: 'motion',
    courses: {
      fyzika: {
        8: 'vodorovný a šikmý vrh',
        9: 'vrh na Měsíci, Marsu a Jupiteru, oběžná rychlost',
      },
    },
  },
  // biology
  {
    id: 'id-key',
    title: 'Určovací klíč',
    blurb: 'Poznej organismus podle znaků krok za krokem, jako v pravém určovacím klíči.',
    kind: 'quiz',
    courses: {
      biologie: {
        1: 'skupiny organismů a buňky',
        2: 'mikroorganismy, houby a lišejníky',
        3: 'rostliny: mechy, kapradiny, jehličnany a čeledi',
        4: 'bezobratlí: od houbovců po hmyz',
        5: 'obratlovci: ryby, obojživelníci, plazi, ptáci a savci',
      },
    },
  },
  {
    id: 'cell-builder',
    title: 'Stavitel buňky',
    blurb: 'Poskládej buňku z organel a zjisti, co která dělá.',
    kind: 'build',
    courses: {
      biologie: {
        1: 'rostlinná, živočišná a bakteriální buňka',
        9: 'organely eukaryotní buňky a jejich funkce',
      },
    },
  },
  {
    id: 'body-map',
    title: 'Mapa těla',
    blurb: 'Umísti orgány na správné místo a přiřaď jim funkci.',
    kind: 'build',
    courses: {
      biologie: {
        6: 'orgánové soustavy člověka',
        11: 'fyziologie: hormony, nervy, ledviny a imunita',
      },
    },
  },
  {
    id: 'punnett',
    title: 'Křížení',
    blurb: 'Doplň Punnettův čtverec a odhadni, jací budou potomci.',
    kind: 'lab',
    courses: {
      biologie: {
        7: 'jedna vlastnost, dominance a krevní skupiny',
        10: 'dvě vlastnosti, vazba genů a dědičnost na X',
        12: 'alely v populaci a přírodní výběr',
      },
    },
  },
  {
    id: 'dna-code',
    title: 'Genetický kód',
    blurb: 'Přepiš DNA do mRNA a přelož ji do bílkoviny.',
    kind: 'quiz',
    courses: {
      biologie: {
        10: 'transkripce, translace a mutace',
      },
    },
  },
  {
    id: 'food-web',
    title: 'Potravní síť',
    blurb: 'Sestav potravní řetězec a zjisti, co se stane, když jeden druh zmizí.',
    kind: 'energy',
    courses: {
      biologie: {
        5: 'kdo koho žere',
        8: 'potravní sítě českých ekosystémů a pyramida energie',
        12: 'populace, společenstva a toky energie',
      },
    },
  },
  // geography
  {
    id: 'coordinates',
    title: 'Zeměpisná síť',
    blurb: 'Najdi místo podle zeměpisných souřadnic a přečti souřadnice z mapy.',
    kind: 'map',
    courses: {
      zemepis: {
        1: 'čtení a zápis zeměpisné šířky a délky',
        2: 'rovník, obratníky, polární kruhy a teplotní pásy',
      },
    },
  },
  {
    id: 'map-scale',
    title: 'Měřítko mapy',
    blurb: 'Přepočítej vzdálenost na mapě na skutečnou a zpět.',
    kind: 'map',
    courses: {
      zemepis: {
        1: 'číselné a grafické měřítko, výpočet vzdáleností',
      },
    },
  },
  {
    id: 'contours',
    title: 'Vrstevnice',
    blurb: 'Přečti z vrstevnic výšku, sklon svahu a tvar terénu.',
    kind: 'map',
    courses: {
      zemepis: {
        1: 'nadmořská výška, vrstevnice a profil terénu',
        3: 'tvary reliéfu: vrchol, hřbet, údolí, sedlo',
        9: 'reliéf Česka na turistické mapě',
      },
    },
  },
  {
    id: 'time-zones',
    title: 'Časová pásma',
    blurb: 'Kolik je hodin na druhém konci světa? Spočítej místní a pásmový čas.',
    kind: 'map',
    courses: {
      zemepis: {
        2: 'místní čas, časová pásma, letní čas a datová hranice',
      },
    },
  },
  {
    id: 'climate-chart',
    title: 'Klimatogram',
    blurb: 'Přečti klimatogram a poznej, odkud je.',
    kind: 'quiz',
    courses: {
      zemepis: {
        4: 'čtení klimatogramu, podnebné pásy a krajinné pásy',
        7: 'podnebí regionů světa',
        10: 'typy podnebí a změna klimatu',
        12: 'klima, voda a potraviny',
      },
    },
  },
  {
    id: 'blind-map',
    title: 'Slepá mapa',
    blurb: 'Najdi na slepé mapě státy, pohoří, řeky a města.',
    kind: 'map',
    courses: {
      zemepis: {
        3: 'pohoří, sopky a desky světa',
        7: 'státy a regiony kontinentů',
        8: 'státy, hlavní města, řeky a pohoří Evropy',
        9: 'kraje, města, řeky a pohoří Česka',
        11: 'státy, hranice a ohniska konfliktů',
      },
    },
  },
  {
    id: 'pop-pyramid',
    title: 'Věková pyramida',
    blurb: 'Přečti věkovou pyramidu a poznej, jak se obyvatelstvo vyvíjí.',
    kind: 'quiz',
    courses: {
      zemepis: {
        5: 'tvary pyramid, porodnost, úmrtnost a stárnutí',
        6: 'pyramida a vyspělost státu',
        11: 'demografický přechod a projekce obyvatelstva',
        12: 'stárnutí, závislost a budoucnost populace',
      },
    },
  },
]

/** Levels (by number) a game supports in a course, with what it trains there; undefined = not in that course. */
export const levelsOf = (g: GameMeta, courseId: string) => g.courses[courseId]

/** Games of a course, in registry order. */
export const gamesForCourse = (courseId: string) => GAMES.filter((g) => levelsOf(g, courseId))

/** Games available for a level of a course, in registry order. */
export const gamesForLevel = (courseId: string, n: number) => GAMES.filter((g) => n in (levelsOf(g, courseId) ?? {}))

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<GameId, GameMeta>

export const GAME_COMPONENTS: Partial<Record<GameId, LazyExoticComponent<ComponentType<GameProps>>>> = {
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
  'unit-convert': lazyWithReload(() => import('./unit-convert')),
  'float-sink': lazyWithReload(() => import('./float-sink')),
  'motion-graph': lazyWithReload(() => import('./motion-graph')),
  'force-sum': lazyWithReload(() => import('./force-sum')),
  'energy-chain': lazyWithReload(() => import('./energy-chain')),
  'circuit-builder': lazyWithReload(() => import('./circuit-builder')),
  'ray-optics': lazyWithReload(() => import('./ray-optics')),
  'projectile': lazyWithReload(() => import('./projectile')),
  'id-key': lazyWithReload(() => import('./id-key')),
  'cell-builder': lazyWithReload(() => import('./cell-builder')),
  'body-map': lazyWithReload(() => import('./body-map')),
  'punnett': lazyWithReload(() => import('./punnett')),
  'dna-code': lazyWithReload(() => import('./dna-code')),
  'food-web': lazyWithReload(() => import('./food-web')),
  // geography
  'coordinates': lazyWithReload(() => import('./coordinates')),
  'map-scale': lazyWithReload(() => import('./map-scale')),
  'contours': lazyWithReload(() => import('./contours')),
  'time-zones': lazyWithReload(() => import('./time-zones')),
  'climate-chart': lazyWithReload(() => import('./climate-chart')),
  'blind-map': lazyWithReload(() => import('./blind-map')),
  'pop-pyramid': lazyWithReload(() => import('./pop-pyramid')),
}
