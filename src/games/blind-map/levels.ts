/**
 * Slepá mapa – content per level (spec/courses/zemepis/games.md: levels 3, 7, 8, 9, 11).
 * States and regions come from the map data (src/geo, Natural Earth; Czech names in codes.ts); mountain ranges are
 * curated lines along their main ridges and volcanoes curated summit points (approximate, a few tenths of a degree),
 * cities are city centres (GeoNames / Wikipedia, checked 2026-10). Rivers are taken from the map data by name
 * (Natural Earth has no Otava, Lužnice, Jizera, Svitava, Bečva, Oslava, Radbuza, Úhlava, Úslava or Ploučnice; see spec/geo.md). Tests check every state code,
 * every point against countryAt / regionAt and that every tap target is big enough on a 300 px map.
 */
import type { MapView } from '../../core/types'
import type { LL } from './hit'

export type Mech = 'sub' | 'div' | 'hot' | 'col'
export const MECH_TEXT: Record<Mech, string> = {
  sub: 'podsouvání desky pod jinou (subdukce)',
  div: 'rozestupování desek',
  hot: 'horká skvrna uprostřed desky',
  col: 'srážka dvou pevninských desek',
}

export interface Feature {
  id: string
  name: string
  /** "na Alpy", "na Fudži" – the object of "Ťukni …" */
  acc: string
  view: MapView
  kind: 'range' | 'volcano'
  /** lines [lon, lat] (one point = a summit) */
  parts: LL[][]
  /** how the volcano / range formed (plate tectonics, level 3) */
  mech?: Mech
  mechWhy?: string
  /** young (alpine–himalayan folding, Tertiary to today) or old (Palaeozoic) mountains */
  age?: 'young' | 'old'
  /** state(s) the feature lies in – checked against the map data */
  in?: string[]
  /** one line: where it lies, its highest peak */
  note?: string
}

/* ------------------------------------------------------------------ level 3: ranges, volcanoes, plates */

export const WORLD_FEATURES: Feature[] = [
  {
    id: 'himalaje', name: 'Himálaj', acc: 'Himálaj', view: 'asia', kind: 'range', in: ['NPL', 'CHN', 'IND', 'BTN', 'PAK'],
    parts: [[[74.6, 35.2], [77.5, 33.5], [80, 30.8], [83.5, 28.9], [86.9, 28.0], [90, 27.9], [93, 28.3], [95, 29.4]]],
    mech: 'col', mechWhy: 'Indická deska naráží do euroasijské a vrásní Himálaj dodnes (hory stále rostou o několik milimetrů ročně).', age: 'young',
  },
  {
    id: 'andy', name: 'Andy', acc: 'Andy', view: 'latin-america', kind: 'range', in: ['PER', 'CHL', 'ARG', 'BOL', 'ECU', 'COL'],
    parts: [[[-71.5, 9], [-75.5, 4.5], [-78.3, -1], [-76.5, -9], [-72, -15], [-68.8, -21], [-68.6, -27], [-70, -32.6], [-71.3, -40], [-72.5, -47], [-73, -51.5]]],
    mech: 'sub', mechWhy: 'Oceánská deska Nazca se podsouvá pod jihoamerickou: vrásní Andy a živí jejich sopky.', age: 'young',
  },
  {
    id: 'skalnate', name: 'Skalnaté hory', acc: 'Skalnaté hory', view: 'north-america', kind: 'range', in: ['USA', 'CAN'],
    parts: [[[-126, 58], [-120, 54], [-116, 50.8], [-112.5, 47], [-110, 44.3], [-106.5, 40], [-106, 36]]],
    age: 'young',
  },
  {
    id: 'appalacske', name: 'Appalačské pohoří', acc: 'Appalačské pohoří', view: 'north-america', kind: 'range', in: ['USA'],
    parts: [[[-85, 34.2], [-82.5, 36], [-80, 38], [-77.5, 40.3], [-74.8, 42.3], [-72.5, 44.2], [-70, 45.5]]],
    age: 'old',
  },
  {
    id: 'alpy', note: 'Alpy jsou nejvyšší pohoří Evropy (bez Kavkazu); nejvyšší je Mont Blanc (asi 4 806 m).', name: 'Alpy', acc: 'Alpy', view: 'europe', kind: 'range', in: ['CHE', 'AUT', 'ITA', 'FRA'],
    parts: [[[7.0, 44.2], [6.9, 45.8], [8.5, 46.4], [10.5, 46.6], [12.5, 47.1], [15.0, 47.5]]],
    mech: 'col', mechWhy: 'Africká deska (s jadranskou mikrodeskou) tlačí na euroasijskou: vznikly Alpy.', age: 'young',
  },
  {
    id: 'ural', name: 'Ural', acc: 'Ural', view: 'asia', kind: 'range', in: ['RUS', 'KAZ'],
    parts: [[[58.5, 51.5], [59, 55], [59.4, 60], [59.4, 64], [61, 66.5], [65, 68.5]]],
    age: 'old',
  },
  {
    id: 'kavkaz', note: 'Kavkaz leží mezi Černým a Kaspickým mořem; nejvyšší je Elbrus (5 642 m).', name: 'Kavkaz', acc: 'Kavkaz', view: 'europe', kind: 'range', in: ['RUS', 'GEO', 'AZE'],
    parts: [[[38.5, 44.0], [41, 43.5], [42.4, 43.35], [44, 42.8]]],
    mech: 'col', mechWhy: 'Arabská deska tlačí na euroasijskou a vrásní Kavkaz.', age: 'young',
  },
  {
    id: 'atlas', name: 'Atlas', acc: 'Atlas', view: 'africa', kind: 'range', in: ['MAR', 'DZA'],
    parts: [[[-9.3, 30.6], [-6.5, 31.5], [-4, 32.8], [0, 34], [4, 35.2], [8.5, 35.3]]],
    age: 'young',
  },
  {
    id: 'skandinavske', note: 'Skandinávské pohoří leží v Norsku a Švédsku; nejvyšší je Galdhøpiggen (2 469 m).', name: 'Skandinávské pohoří', acc: 'Skandinávské pohoří', view: 'europe', kind: 'range', in: ['NOR', 'SWE'],
    parts: [[[7, 59.5], [8.5, 61.5], [12.3, 63.3], [14.5, 65.5], [17, 67.8], [20, 69.2]]],
    age: 'old',
  },
  {
    id: 'predelove', name: 'Velké předělové pohoří', acc: 'Velké předělové pohoří', view: 'oceania', kind: 'range', in: ['AUS'],
    parts: [[[145.4, -16.5], [146.8, -21], [149.5, -25], [151.5, -29], [150, -33.5], [147.5, -36.8]]],
    age: 'old',
  },
  { id: 'fudzi', name: 'Fudži', acc: 'sopku Fudži', view: 'asia', kind: 'volcano', in: ['JPN'], parts: [[[138.73, 35.36]]], mech: 'sub', mechWhy: 'U Japonska se pacifická a filipínská deska podsouvají pod euroasijskou a severoamerickou; tavenina vystupuje v sopkách.' },
  { id: 'vesuv', name: 'Vesuv', acc: 'sopku Vesuv', view: 'europe', kind: 'volcano', in: ['ITA'], parts: [[[14.43, 40.82]]], mech: 'sub', mechWhy: 'Pod jižní Itálii se podsouvá africká deska; Vesuv zničil v roce 79 Pompeje.' },
  { id: 'hekla', name: 'Hekla', acc: 'sopku Hekla', view: 'europe', kind: 'volcano', in: ['ISL'], parts: [[[-19.67, 63.98]]], mech: 'div', mechWhy: 'Island leží na Středoatlantském hřbetu: severoamerická a euroasijská deska se tu rozestupují asi o 2 cm ročně.' },
  { id: 'kilimandzaro', name: 'Kilimandžáro', acc: 'Kilimandžáro', view: 'africa', kind: 'volcano', in: ['TZA'], parts: [[[37.36, -3.07]]], mech: 'div', mechWhy: 'Kilimandžáro leží u Východoafrického příkopu, kde se africká deska trhá a rozestupuje.' },
  { id: 'nyiragongo', name: 'Nyiragongo', acc: 'sopku Nyiragongo', view: 'africa', kind: 'volcano', in: ['COD'], parts: [[[29.25, -1.52]]], mech: 'div', mechWhy: 'Nyiragongo leží v západní větvi Východoafrického příkopu: deska se tu rozestupuje.' },
  { id: 'maunaloa', name: 'Mauna Loa', acc: 'sopku Mauna Loa', view: 'north-america', kind: 'volcano', in: ['USA'], parts: [[[-155.6, 19.48]]], mech: 'hot', mechWhy: 'Havajské ostrovy leží uprostřed pacifické desky nad horkou skvrnou: deska se nad ní posouvá a vzniká řetěz ostrovů.' },
  { id: 'popocatepetl', name: 'Popocatépetl', acc: 'sopku Popocatépetl', view: 'north-america', kind: 'volcano', in: ['MEX'], parts: [[[-98.63, 19.02]]], mech: 'sub', mechWhy: 'Kokosová deska se podsouvá pod severoamerickou; nad ní vznikají mexické sopky.' },
  { id: 'sthelens', name: 'Mount St. Helens', acc: 'sopku Mount St. Helens', view: 'north-america', kind: 'volcano', in: ['USA'], parts: [[[-122.19, 46.19]]], mech: 'sub', mechWhy: 'Malá deska Juan de Fuca se podsouvá pod severoamerickou; sopka explodovala v roce 1980.' },
  { id: 'cotopaxi', name: 'Cotopaxi', acc: 'sopku Cotopaxi', view: 'latin-america', kind: 'volcano', in: ['ECU'], parts: [[[-78.44, -0.68]]], mech: 'sub', mechWhy: 'Deska Nazca se podsouvá pod jihoamerickou; Cotopaxi je jedna z nejvyšších činných sopek světa.' },
  { id: 'krakatau', name: 'Krakatau', acc: 'sopku Krakatau', view: 'asia', kind: 'volcano', in: ['IDN'], parts: [[[105.42, -6.1]]], mech: 'sub', mechWhy: 'Indoaustralská deska se podsouvá pod Sundské ostrovy; výbuch Krakatau v roce 1883 slyšeli lidé až v Austrálii.' },
  { id: 'pinatubo', name: 'Pinatubo', acc: 'sopku Pinatubo', view: 'asia', kind: 'volcano', in: ['PHL'], parts: [[[120.35, 15.13]]], mech: 'sub', mechWhy: 'U Filipín se podsouvají desky; výbuch Pinatuba v roce 1991 ochladil celou Zemi asi o 0,5 °C na jeden až dva roky.' },
  { id: 'yellowstone', name: 'Yellowstone', acc: 'Yellowstone', view: 'north-america', kind: 'volcano', in: ['USA'], parts: [[[-110.59, 44.43]]], mech: 'hot', mechWhy: 'Pod Yellowstonem je horká skvrna uprostřed severoamerické desky (supervulkán, gejzíry).' },
]
/** Features that may be asked as "tap it" (no other feature of their view lies too close). */
export const TAP_FEATURES = ['himalaje', 'andy', 'skalnate', 'appalacske', 'alpy', 'ural', 'kavkaz', 'atlas', 'skandinavske', 'predelove', 'fudzi', 'vesuv', 'hekla', 'kilimandzaro', 'maunaloa', 'popocatepetl', 'cotopaxi', 'krakatau', 'pinatubo']

/* ------------------------------------------------------------------ level 7: states of the continents */

/** States by continent view: `tap` are big enough to tap on a phone, `name` only as "name the highlighted state". */
export const CONTINENTS: { view: MapView; region: string; tap: string[]; name: string[] }[] = [
  { view: 'africa', region: 'Afriky', tap: ['EGY', 'LBY', 'DZA', 'MAR', 'NGA', 'ETH', 'KEN', 'TZA', 'COD', 'ZAF', 'MDG', 'SDN', 'MLI', 'NER', 'TCD', 'AGO', 'SOM', 'NAM', 'MOZ', 'ZMB', 'CMR', 'GHA'], name: ['TUN', 'SEN', 'UGA', 'ZWE', 'BWA', 'CIV', 'RWA', 'LSO'] },
  { view: 'asia', region: 'Asie', tap: ['CHN', 'IND', 'MNG', 'KAZ', 'IDN', 'THA', 'VNM', 'MMR', 'AFG', 'PAK', 'JPN', 'IRN', 'SAU', 'UZB', 'TKM', 'MYS'], name: ['KOR', 'PRK', 'NPL', 'BGD', 'LKA', 'PHL', 'LAO', 'KHM', 'KGZ', 'TJK'] },
  { view: 'middle-east', region: 'Blízkého východu', tap: ['SAU', 'IRN', 'IRQ', 'SYR', 'TUR', 'YEM', 'OMN', 'JOR', 'ISR', 'ARE', 'AFG', 'GEO', 'AZE', 'ARM'], name: ['KWT', 'QAT', 'LBN', 'CYP', 'BHR'] },
  { view: 'north-america', region: 'Severní Ameriky', tap: ['USA', 'CAN', 'MEX', 'CUB', 'HND', 'PAN'], name: ['NIC', 'GTM', 'CRI', 'DOM', 'HTI', 'JAM', 'SLV', 'BLZ'] },
  { view: 'latin-america', region: 'Latinské Ameriky', tap: ['BRA', 'ARG', 'CHL', 'PER', 'COL', 'VEN', 'BOL', 'ECU', 'PRY', 'URY', 'GUY', 'SUR', 'CUB', 'MEX', 'NIC', 'HND', 'PAN'], name: ['GTM', 'CRI', 'DOM', 'HTI', 'JAM', 'SLV', 'BLZ'] },
  { view: 'oceania', region: 'Austrálie a Oceánie', tap: ['AUS', 'NZL', 'PNG'], name: ['FJI', 'SLB', 'VUT', 'NCL', 'TLS'] },
]

/* ------------------------------------------------------------------ level 8: Europe */

export const EUROPE_TAP = ['ESP', 'FRA', 'DEU', 'ITA', 'POL', 'UKR', 'SWE', 'NOR', 'FIN', 'GBR', 'ROU', 'GRC', 'PRT', 'IRL', 'BLR', 'AUT', 'HUN', 'CZE', 'BGR', 'SRB', 'ISL', 'HRV', 'LVA', 'SVK', 'LTU', 'BIH', 'CHE', 'ALB', 'DNK', 'MDA']
export const EUROPE_NAME = ['BEL', 'NLD', 'SVN', 'EST', 'MKD', 'MNE', 'LUX']

export interface Capital {
  name: string
  lat: number
  lon: number
  /** state (or Czech region) whose capital it is */
  code: string
}
export const EUROPE_CAPITALS: Capital[] = [
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, code: 'ESP' },
  { name: 'Paříž', lat: 48.8566, lon: 2.3522, code: 'FRA' },
  { name: 'Berlín', lat: 52.52, lon: 13.405, code: 'DEU' },
  { name: 'Řím', lat: 41.8933, lon: 12.4829, code: 'ITA' },
  { name: 'Varšava', lat: 52.2297, lon: 21.0122, code: 'POL' },
  { name: 'Vídeň', lat: 48.2082, lon: 16.3738, code: 'AUT' },
  { name: 'Budapešť', lat: 47.4979, lon: 19.0402, code: 'HUN' },
  { name: 'Lisabon', lat: 38.7223, lon: -9.1393, code: 'PRT' },
  { name: 'Londýn', lat: 51.5074, lon: -0.1278, code: 'GBR' },
  { name: 'Dublin', lat: 53.3498, lon: -6.2603, code: 'IRL' },
  { name: 'Oslo', lat: 59.9139, lon: 10.7522, code: 'NOR' },
  { name: 'Stockholm', lat: 59.3293, lon: 18.0686, code: 'SWE' },
  { name: 'Helsinky', lat: 60.1699, lon: 24.9384, code: 'FIN' },
  { name: 'Kodaň', lat: 55.6761, lon: 12.5683, code: 'DNK' },
  { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, code: 'NLD' },
  { name: 'Brusel', lat: 50.8503, lon: 4.3517, code: 'BEL' },
  { name: 'Bern', lat: 46.948, lon: 7.4474, code: 'CHE' },
  { name: 'Atény', lat: 37.9838, lon: 23.7275, code: 'GRC' },
  { name: 'Bukurešť', lat: 44.4268, lon: 26.1025, code: 'ROU' },
  { name: 'Sofie', lat: 42.6977, lon: 23.3219, code: 'BGR' },
  { name: 'Bělehrad', lat: 44.7866, lon: 20.4489, code: 'SRB' },
  { name: 'Kyjev', lat: 50.4501, lon: 30.5234, code: 'UKR' },
  { name: 'Bratislava', lat: 48.1486, lon: 17.1077, code: 'SVK' },
  { name: 'Praha', lat: 50.0875, lon: 14.4214, code: 'CZE' },
  { name: 'Záhřeb', lat: 45.815, lon: 15.9819, code: 'HRV' },
  { name: 'Lublaň', lat: 46.0569, lon: 14.5058, code: 'SVN' },
  { name: 'Vilnius', lat: 54.6872, lon: 25.2797, code: 'LTU' },
  { name: 'Riga', lat: 56.9496, lon: 24.1052, code: 'LVA' },
  { name: 'Tallinn', lat: 59.437, lon: 24.7536, code: 'EST' },
  { name: 'Minsk', lat: 53.9006, lon: 27.559, code: 'BLR' },
  { name: 'Reykjavík', lat: 64.1466, lon: -21.9426, code: 'ISL' },
]

/** River names exactly as in the map data, with extra data names of the same river (delta arms, spellings). */
export interface River {
  name: string
  /** names in the data that belong to the river */
  data: string[]
  /** a state the river flows through (tests: some of its points lie there) */
  in: string
  /** "na Dunaj" / "na řeku Odru" */
  acc: string
  note: string
}
export const EUROPE_RIVERS: River[] = [
  { name: 'Dunaj', data: ['Dunaj'], in: 'AUT', acc: 'Dunaj', note: 'Dunaj teče z Německa do Černého moře přes deset států a čtyři hlavní města (Vídeň, Bratislavu, Budapešť, Bělehrad).' },
  { name: 'Rýn', data: ['Rýn'], in: 'DEU', acc: 'Rýn', note: 'Rýn pramení ve švýcarských Alpách a ústí v Nizozemsku do Severního moře; je to nejrušnější vodní cesta Evropy.' },
  { name: 'Labe', data: ['Labe'], in: 'DEU', acc: 'Labe', note: 'Labe pramení v Krkonoších a přes Drážďany a Hamburk teče do Severního moře.' },
  { name: 'Odra', data: ['Odra'], in: 'POL', acc: 'Odru', note: 'Odra pramení v Oderských vrších v Česku a tvoří část hranice Polska a Německa; ústí do Baltského moře.' },
  { name: 'Visla', data: ['Visla'], in: 'POL', acc: 'Vislu', note: 'Visla je nejdelší řeka Polska; teče přes Krakov a Varšavu do Baltského moře.' },
  { name: 'Volha', data: ['Volha'], in: 'RUS', acc: 'Volhu', note: 'Volha je nejdelší řeka Evropy (asi 3 530 km); ústí do Kaspického moře.' },
  { name: 'Dněpr', data: ['Dněpr', 'Dnepre'], in: 'UKR', acc: 'Dněpr', note: 'Dněpr teče z Ruska přes Bělorusko a Ukrajinu (Kyjev) do Černého moře.' },
  { name: 'Seina', data: ['Seina'], in: 'FRA', acc: 'Seinu', note: 'Seina protéká Paříží a ústí do kanálu La Manche.' },
  { name: 'Loira', data: ['Loira'], in: 'FRA', acc: 'Loiru', note: 'Loira je nejdelší řeka Francie; ústí do Atlantského oceánu.' },
  { name: 'Pád', data: ['Pád'], in: 'ITA', acc: 'Pád', note: 'Pád teče Pádskou nížinou na severu Itálie do Jaderského moře.' },
  { name: 'Rhôna', data: ['Rhôna'], in: 'FRA', acc: 'Rhônu', note: 'Rhôna teče ze Švýcarska přes Ženevské jezero a Lyon do Středozemního moře.' },
  { name: 'Temže', data: ['Temže'], in: 'GBR', acc: 'Temži', note: 'Temže protéká Londýnem a ústí do Severního moře.' },
  { name: 'Ebro', data: ['Ebro'], in: 'ESP', acc: 'Ebro', note: 'Ebro teče severovýchodním Španělskem do Středozemního moře.' },
  { name: 'Tajo', data: ['Tajo'], in: 'ESP', acc: 'Tajo', note: 'Tajo (portugalsky Tejo) je nejdelší řeka Pyrenejského poloostrova; ústí u Lisabonu.' },
  { name: 'Don', data: ['Don'], in: 'RUS', acc: 'Don', note: 'Don teče jižním Ruskem do Azovského moře.' },
  { name: 'Dněstr', data: ['Dněstr'], in: 'MDA', acc: 'Dněstr', note: 'Dněstr teče Ukrajinou a Moldavskem do Černého moře.' },
  { name: 'Tisa', data: ['Tisa'], in: 'HUN', acc: 'Tisu', note: 'Tisa je nejdelší přítok Dunaje; protéká Maďarskem.' },
  { name: 'Daugava', data: ['Daugava'], in: 'LVA', acc: 'Daugavu', note: 'Daugava (Západní Dvina) teče přes Rigu do Baltského moře.' },
]

export const EUROPE_MOUNTAINS: Feature[] = [
  WORLD_FEATURES.find((f) => f.id === 'alpy')!,
  WORLD_FEATURES.find((f) => f.id === 'skandinavske')!,
  { id: 'pyreneje', note: 'Pyreneje oddělují Španělsko a Francii; nejvyšší je Aneto (3 404 m).', name: 'Pyreneje', acc: 'Pyreneje', view: 'europe', kind: 'range', in: ['ESP', 'FRA', 'AND'], parts: [[[-1.8, 43.1], [0.6, 42.7], [2.9, 42.4]]] },
  { id: 'karpaty', note: 'Karpaty tvoří oblouk od Slovenska po Rumunsko; nejvyšší je Gerlachovský štít (2 655 m) v Tatrách.', name: 'Karpaty', acc: 'Karpaty', view: 'europe', kind: 'range', in: ['SVK', 'POL', 'UKR', 'ROU'], parts: [[[17.6, 48.7], [19.9, 49.2], [22.5, 49.1], [24.5, 48.0], [25.4, 46.8], [25.8, 45.6], [24.3, 45.4], [22.5, 45.2]]] },
  { id: 'apeniny', note: 'Apeniny tvoří páteř Itálie od Janova po Kalábrii.', name: 'Apeniny', acc: 'Apeniny', view: 'europe', kind: 'range', in: ['ITA'], parts: [[[8.8, 44.4], [11, 44.1], [13.4, 42.4], [15.4, 40.6], [16.1, 39.2]]] },
  { id: 'dinarske', note: 'Dinárské hory se táhnou podél Jaderského moře; jsou z vápence a plné krasu.', name: 'Dinárské hory', acc: 'Dinárské hory', view: 'europe', kind: 'range', in: ['HRV', 'BIH', 'MNE'], parts: [[[14.6, 45.4], [16.4, 44.1], [18.3, 43.1], [19.8, 42.4]]] },
  WORLD_FEATURES.find((f) => f.id === 'kavkaz')!,
]

/* ------------------------------------------------------------------ level 9: Czechia */

export const CZ_CAPITALS: Capital[] = [
  { name: 'Praha', lat: 50.0875, lon: 14.4214, code: 'CZ-10' },
  { name: 'České Budějovice', lat: 48.9745, lon: 14.4743, code: 'CZ-31' },
  { name: 'Plzeň', lat: 49.7384, lon: 13.3736, code: 'CZ-32' },
  { name: 'Karlovy Vary', lat: 50.2306, lon: 12.8711, code: 'CZ-41' },
  { name: 'Ústí nad Labem', lat: 50.6607, lon: 14.0323, code: 'CZ-42' },
  { name: 'Liberec', lat: 50.7671, lon: 15.0562, code: 'CZ-51' },
  { name: 'Hradec Králové', lat: 50.2092, lon: 15.8328, code: 'CZ-52' },
  { name: 'Pardubice', lat: 50.0343, lon: 15.7812, code: 'CZ-53' },
  { name: 'Jihlava', lat: 49.3961, lon: 15.5912, code: 'CZ-63' },
  { name: 'Brno', lat: 49.1951, lon: 16.6068, code: 'CZ-64' },
  { name: 'Olomouc', lat: 49.5938, lon: 17.2509, code: 'CZ-71' },
  { name: 'Zlín', lat: 49.2265, lon: 17.6707, code: 'CZ-72' },
  { name: 'Ostrava', lat: 49.8209, lon: 18.2625, code: 'CZ-80' },
]
/** Středočeský kraj (CZ-20) has its regional office in Prague, outside its own territory. */
export const CZ_NOTE_20 = 'Krajský úřad Středočeského kraje sídlí v Praze, tedy mimo území kraje.'

export const CZ_RIVERS: River[] = [
  { name: 'Labe', data: ['Labe'], in: 'CZE', acc: 'Labe', note: 'Labe pramení v Krkonoších, teče přes Hradec Králové, Pardubice a Ústí nad Labem; u Hřenska opouští Česko v nejnižším místě (115 m n. m.).' },
  { name: 'Vltava', data: ['Vltava'], in: 'CZE', acc: 'Vltavu', note: 'Vltava je nejdelší česká řeka (430 km); pramení na Šumavě, protéká Českými Budějovicemi a Prahou a u Mělníka se vlévá do Labe.' },
  { name: 'Morava', data: ['Morava'], in: 'CZE', acc: 'Moravu', note: 'Morava pramení pod Králickým Sněžníkem, teče přes Olomouc a na hranici se Slovenskem a Rakouskem do Dunaje.' },
  { name: 'Dyje', data: ['Dyje'], in: 'CZE', acc: 'Dyji', note: 'Dyje teče podél hranice s Rakouskem (Znojmo, Nové Mlýny) a vlévá se do Moravy.' },
  { name: 'Ohře', data: ['Ohře'], in: 'CZE', acc: 'Ohři', note: 'Ohře přitéká z Německa, teče přes Cheb, Karlovy Vary a Žatec a u Litoměřic se vlévá do Labe.' },
  { name: 'Sázava', data: ['Sázava'], in: 'CZE', acc: 'Sázavu', note: 'Sázava pramení na Českomoravské vrchovině a u Davle jižně od Prahy se vlévá do Vltavy.' },
  { name: 'Svratka', data: ['Svratka'], in: 'CZE', acc: 'Svratku', note: 'Svratka pramení ve Žďárských vrších, teče Brnem a u Nových Mlýnů se vlévá do Dyje.' },
  { name: 'Jihlava', data: ['Jihlava'], in: 'CZE', acc: 'Jihlavu', note: 'Jihlava teče přes Jihlavu a Třebíč a u Mušova se vlévá do Svratky.' },
  { name: 'Berounka', data: ['Berounka'], in: 'CZE', acc: 'Berounku', note: 'Berounka vzniká v Plzni soutokem Mže a Radbuzy, teče přes Beroun a v Praze-Lahovicích se vlévá do Vltavy.' },
  { name: 'Orlice', data: ['Orlice'], in: 'CZE', acc: 'Orlici', note: 'Orlice vzniká soutokem Divoké a Tiché Orlice a v Hradci Králové se vlévá do Labe.' },
  { name: 'Opava', data: ['Opava'], in: 'CZE', acc: 'Opavu', note: 'Opava teče přes Opavu a v Ostravě se vlévá do Odry.' },
  { name: 'Lužická Nisa', data: ['Lužická Nisa'], in: 'CZE', acc: 'Lužickou Nisu', note: 'Lužická Nisa pramení v Jizerských horách, protéká Libercem a tvoří hranici Německa a Polska; ústí do Odry.' },
  { name: 'Odra', data: ['Odra'], in: 'CZE', acc: 'Odru', note: 'Odra pramení v Oderských vrších, protéká Ostravou a odvádí vodu do Baltského moře.' },
]

export const CZ_MOUNTAINS: Feature[] = [
  { id: 'krkonose', note: 'Krkonoše leží na hranici s Polskem; nejvyšší je Sněžka (1 603 m), nejvyšší hora Česka.', name: 'Krkonoše', acc: 'Krkonoše', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[15.45, 50.77], [15.6, 50.75], [15.74, 50.736], [15.88, 50.71]]] },
  { id: 'sumava', note: 'Šumava leží na hranici s Německem a Rakouskem; nejvyšší na české straně je Plechý (1 378 m).', name: 'Šumava', acc: 'Šumavu', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[13.1, 49.25], [13.4, 49.05], [13.65, 48.9], [13.86, 48.775], [14.05, 48.66]]] },
  { id: 'krusne', note: 'Krušné hory leží na hranici s Německem; nejvyšší je Klínovec (1 244 m).', name: 'Krušné hory', acc: 'Krušné hory', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[12.5, 50.35], [12.97, 50.40], [13.4, 50.56], [13.85, 50.72]]] },
  { id: 'jesenik', note: 'Hrubý Jeseník je nejvyšší pohoří Moravy a Slezska; nejvyšší je Praděd (1 491 m).', name: 'Hrubý Jeseník', acc: 'Hrubý Jeseník', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[17.05, 50.2], [17.15, 50.13], [17.23, 50.08], [17.33, 49.98]]] },
  { id: 'beskydy', note: 'Moravskoslezské Beskydy leží na hranici se Slovenskem; nejvyšší je Lysá hora (1 323 m).', name: 'Moravskoslezské Beskydy', acc: 'Moravskoslezské Beskydy', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[18.2, 49.49], [18.35, 49.52], [18.45, 49.546], [18.62, 49.5]]] },
  { id: 'orlicke', note: 'Orlické hory leží na hranici s Polskem; nejvyšší je Velká Deštná (1 115 m).', name: 'Orlické hory', acc: 'Orlické hory', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[16.3, 50.38], [16.39, 50.3], [16.5, 50.2], [16.58, 50.12]]] },
  { id: 'ceskyles', note: 'Český les leží na hranici s Německem; nejvyšší na české straně je Čerchov (1 042 m).', name: 'Český les', acc: 'Český les', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[12.5, 49.85], [12.62, 49.65], [12.78, 49.45], [12.9, 49.35]]] },
  { id: 'brdy', note: 'Brdy leží jihozápadně od Prahy; nejvyšší je Tok (865 m).', name: 'Brdy', acc: 'Brdy', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[13.75, 49.85], [13.88, 49.7], [14.0, 49.6]]] },
  { id: 'bilekarpaty', note: 'Bílé Karpaty leží na hranici se Slovenskem; nejvyšší je Velká Javořina (970 m).', name: 'Bílé Karpaty', acc: 'Bílé Karpaty', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[17.45, 48.8], [17.68, 48.86], [17.9, 49.0], [18.1, 49.12]]] },
  { id: 'vrchovina', note: 'Českomoravská vrchovina leží mezi Čechami a Moravou; nejvyšší je Javořice (837 m).', name: 'Českomoravská vrchovina', acc: 'Českomoravskou vrchovinu', view: 'czechia', kind: 'range', in: ['CZE'], parts: [[[15.2, 49.15], [15.35, 49.22], [15.6, 49.45], [15.95, 49.65]]] },
]

/* ------------------------------------------------------------------ level 11: states, borders, conflicts */

export interface Item {
  id: string
  view: MapView
  /** highlighted state (or the state a point lies in) */
  code: string
  /** a point instead of a highlight (exclaves) */
  point?: { lat: number; lon: number }
  text: string
  why: string
  /** option codes (the answer is `code`) */
  options: string[]
}

/** Microstates and small states: "name the highlighted state" (drawn as markers, too small to tap). Areas: UN / CIA World Factbook. */
export const MICRO: Item[] = [
  { id: 'VAT', view: 'europe', code: 'VAT', options: ['VAT', 'SMR', 'MCO', 'MLT'], text: 'Který stát je vyznačený? Je to nejmenší stát světa.', why: 'Vatikán (0,44 km²) leží uvnitř Říma: je to enkláva v Itálii.' },
  { id: 'MCO', view: 'europe', code: 'MCO', options: ['MCO', 'AND', 'VAT', 'LIE'], text: 'Který mikrostát na pobřeží Středozemního moře je vyznačený?', why: 'Monako (asi 2 km²) leží na francouzské Riviéře; je to nejhustěji zalidněný stát světa.' },
  { id: 'SMR', view: 'europe', code: 'SMR', options: ['SMR', 'VAT', 'LIE', 'MCO'], text: 'Který stát je vyznačený? Ze všech stran ho obklopuje Itálie.', why: 'San Marino (61 km²) je enkláva v Itálii a jedna z nejstarších republik světa.' },
  { id: 'LIE', view: 'europe', code: 'LIE', options: ['LIE', 'AND', 'LUX', 'SMR'], text: 'Který mikrostát mezi Švýcarskem a Rakouskem je vyznačený?', why: 'Lichtenštejnsko (160 km²) leží v Alpách na Rýnu mezi Švýcarskem a Rakouskem.' },
  { id: 'AND', view: 'europe', code: 'AND', options: ['AND', 'MCO', 'LIE', 'LUX'], text: 'Který mikrostát v Pyrenejích je vyznačený?', why: 'Andorra (468 km²) leží v Pyrenejích mezi Španělskem a Francií.' },
  { id: 'MLT', view: 'europe', code: 'MLT', options: ['MLT', 'CYP', 'SMR', 'MCO'], text: 'Který ostrovní stát ve Středozemním moři je vyznačený?', why: 'Malta (316 km²) je nejmenší stát EU; leží jižně od Sicílie.' },
  { id: 'LUX', view: 'europe', code: 'LUX', options: ['LUX', 'LIE', 'BEL', 'AND'], text: 'Který malý stát mezi Belgií, Německem a Francií je vyznačený?', why: 'Lucembursko (2 586 km²) je velkovévodství a sídlo několika institucí EU.' },
  { id: 'SGP', view: 'asia', code: 'SGP', options: ['SGP', 'BRN', 'BHR', 'MDV'], text: 'Který městský stát na jihu Malajského poloostrova je vyznačený?', why: 'Singapur (asi 735 km²) je městský stát a jeden z největších přístavů světa.' },
  { id: 'BHR', view: 'middle-east', code: 'BHR', options: ['BHR', 'QAT', 'KWT', 'SGP'], text: 'Který ostrovní stát v Perském zálivu je vyznačený?', why: 'Bahrajn (asi 790 km²) je souostroví v Perském zálivu, se Saúdskou Arábií ho spojuje most.' },
]

/** Enclaves and exclaves. */
export const ENCLAVES: Item[] = [
  { id: 'LSO', view: 'africa', code: 'LSO', options: ['LSO', 'SWZ', 'BWA', 'MWI'], text: 'Který stát je enkláva: ze všech stran ho obklopuje Jihoafrická republika?', why: 'Lesotho je enkláva v Jihoafrické republice; celé leží výš než 1 000 m n. m.' },
  { id: 'kaliningrad', view: 'europe', code: 'RUS', point: { lat: 54.71, lon: 20.51 }, options: ['RUS', 'POL', 'LTU', 'BLR'], text: 'Ke kterému státu patří území se špendlíkem mezi Polskem a Litvou?', why: 'Kaliningradská oblast je exkláva Ruska: se zbytkem státu nemá společnou hranici.' },
  { id: 'nachicevan', view: 'middle-east', code: 'AZE', point: { lat: 39.21, lon: 45.41 }, options: ['AZE', 'ARM', 'IRN', 'TUR'], text: 'Ke kterému státu patří území se špendlíkem mezi Arménií a Íránem?', why: 'Nachičevan je exkláva Ázerbájdžánu; od zbytku státu ji odděluje Arménie.' },
  { id: 'kabinda', view: 'africa', code: 'AGO', point: { lat: -5.55, lon: 12.2 }, options: ['AGO', 'COD', 'COG', 'GAB'], text: 'Ke kterému státu patří území se špendlíkem u ústí Konga?', why: 'Kabinda je exkláva Angoly; od zbytku státu ji odděluje úzký pruh Demokratické republiky Kongo.' },
]

/** Territories with a disputed status (neutral wording, state of 2026). */
export const DISPUTED: Item[] = [
  { id: 'SAH', view: 'africa', code: 'SAH', options: ['SAH', 'MRT', 'MAR', 'MLI'], text: 'Vyznačené území je bývalá španělská kolonie, o kterou se od roku 1975 vede spor. Které to je?', why: 'Západní Sahara: většinu ovládá Maroko, nezávislost požaduje hnutí Polisario; spor řeší OSN.' },
  { id: 'TWN', view: 'asia', code: 'TWN', options: ['TWN', 'PHL', 'KOR', 'JPN'], text: 'Vyznačený ostrov má vlastní vládu, ale Čínská lidová republika ho považuje za svou součást. Který to je?', why: 'Tchaj-wan: demokratická samospráva od roku 1949; oficiálně ho uznává jen malý počet států.' },
  { id: 'KOS', view: 'europe', code: 'KOS', options: ['KOS', 'MKD', 'MNE', 'ALB'], text: 'Vyznačené území vyhlásilo v roce 2008 nezávislost na Srbsku. Které to je?', why: 'Kosovo: uznává ho asi polovina států OSN; Srbsko, Slovensko ani Španělsko ne.' },
  { id: 'CYN', view: 'europe', code: 'CYN', options: ['CYN', 'CYP', 'LBN', 'ISR'], text: 'Sever tohoto ostrova od roku 1974 ovládá Turecko. Které vyznačené území to je?', why: 'Severní Kypr uznává jen Turecko; ostrov je od roku 1974 rozdělený, Kypr je od roku 2004 v EU.' },
]

/** States with an armed conflict or a coup in the 2020s (dated facts, neutral wording). */
export const CONFLICTS: Item[] = [
  { id: 'UKR', view: 'europe', code: 'UKR', options: ['UKR', 'BLR', 'MDA', 'ROU'], text: 'V únoru 2022 sem vpadla ruská armáda; válka trvá i v roce 2026.', why: 'Ukrajina. Krym anektovalo Rusko už v roce 2014; mezinárodně je uznáván jako součást Ukrajiny.' },
  { id: 'SDN', view: 'africa', code: 'SDN', options: ['SDN', 'TCD', 'ETH', 'SDS'], text: 'V dubnu 2023 tu vypukla válka mezi armádou a polovojenskými jednotkami RSF; v roce 2026 stále trvá.', why: 'Súdán: podle OSN jedna z největších humanitárních krizí světa, z domovů musely uprchnout miliony lidí.' },
  { id: 'MMR', view: 'asia', code: 'MMR', options: ['MMR', 'THA', 'BGD', 'LAO'], text: 'V únoru 2021 tu armáda převzala moc a v zemi vypukla občanská válka.', why: 'Myanmar (dříve Barma) v jihovýchodní Asii.' },
  { id: 'YEM', view: 'middle-east', code: 'YEM', options: ['YEM', 'OMN', 'SAU', 'ERI'], text: 'Od roku 2014 tu probíhá válka; sever země s hlavním městem Saná ovládá hnutí Húsíů.', why: 'Jemen na jihu Arabského poloostrova.' },
  { id: 'AFG', view: 'asia', code: 'AFG', options: ['AFG', 'PAK', 'IRN', 'TKM'], text: 'V srpnu 2021 tu po odchodu vojsk USA a NATO převzalo moc hnutí Tálibán.', why: 'Afghánistán, vnitrozemský stát mezi Íránem a Pákistánem.' },
  { id: 'COD', view: 'africa', code: 'COD', options: ['COD', 'AGO', 'CAF', 'TZA'], text: 'Na východě země bojuje armáda s rebely M23; v lednu 2025 obsadili město Goma.', why: 'Demokratická republika Kongo: boje v provinciích Severní a Jižní Kivu souvisejí i s nerostnými surovinami; mírové dohody uzavírané od roku 2025 je zatím neukončily.' },
  { id: 'NER', view: 'africa', code: 'NER', options: ['NER', 'MLI', 'TCD', 'NGA'], text: 'V červenci 2023 tu armáda svrhla zvoleného prezidenta; zemí v Sahelu otřásají i útoky ozbrojených skupin.', why: 'Niger. Vojenské převraty proběhly v letech 2020–2023 i v sousedním Mali a Burkině Faso.' },
  { id: 'SYR', view: 'middle-east', code: 'SYR', options: ['SYR', 'IRQ', 'JOR', 'LBN'], text: 'Po občanské válce od roku 2011 tu v prosinci 2024 padl režim Bašára Asada.', why: 'Sýrie: válka vyhnala ze země miliony uprchlíků (hlavně do Turecka, Libanonu a Jordánska).' },
  { id: 'PSX', view: 'middle-east', code: 'PSX', options: ['PSX', 'ISR', 'LBN', 'JOR'], text: 'V říjnu 2023 tu po útoku Hamásu na Izrael začala válka v Pásmu Gazy. Které vyznačené území to je?', why: 'Palestina: palestinská území tvoří Pásmo Gazy a Západní břeh Jordánu.' },
]

/** Types of borders (lesson z11-6). */
export const BORDER_TYPES = {
  geo: 'geometrická (po rovnoběžce nebo přímce)',
  mount: 'přírodní – po hřebeni hor',
  river: 'přírodní – po řece',
  armistice: 'demarkační čára po příměří',
} as const
export const BORDERS: { id: string; view: MapView; codes: [string, string]; type: keyof typeof BORDER_TYPES; why: string }[] = [
  { id: 'usa-can', view: 'north-america', codes: ['USA', 'CAN'], type: 'geo', why: 'Západní část hranice USA a Kanady vede po 49. rovnoběžce (dohody z let 1818 a 1846).' },
  { id: 'egy-sdn', view: 'africa', codes: ['EGY', 'SDN'], type: 'geo', why: 'Hranice Egypta a Súdánu vede z velké části po 22. rovnoběžce – pozůstatek koloniálních dohod.' },
  { id: 'esp-fra', view: 'europe', codes: ['ESP', 'FRA'], type: 'mount', why: 'Španělsko a Francii odděluje hřeben Pyrenejí.' },
  { id: 'chl-arg', view: 'latin-america', codes: ['CHL', 'ARG'], type: 'mount', why: 'Hranice Chile a Argentiny vede většinou po hřebeni And.' },
  { id: 'chn-rus', view: 'asia', codes: ['CHN', 'RUS'], type: 'river', why: 'Na Dálném východě vede hranice Číny a Ruska po řekách Amur a Ussuri.' },
  { id: 'kor-prk', view: 'asia', codes: ['KOR', 'PRK'], type: 'armistice', why: 'Obě Koreje odděluje demilitarizovaná zóna podél linie příměří z roku 1953 (blízko 38. rovnoběžky).' },
]
