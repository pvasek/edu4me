/**
 * Časová pásma – content (spec/courses/zemepis/games.md, level 2, lessons z2-2 and z2-3).
 * Real cities with their legal UTC offsets in January and in July 2026 (IANA tz database 2025/2026, checked
 * 2026-10): EU summer time from the last Sunday of March to the last Sunday of October, USA and Canada from the
 * second Sunday of March to the first Sunday of November, southern summer time in Australia (NSW, SA) and
 * New Zealand from October to April. Egypt again uses summer time (from the last Friday of April to the last
 * Thursday of October, since 2023); Iran has had none since 2022, Mexico since 2022, Brazil since 2019.
 * Tasks always name the month, so the offset is unambiguous. Every answer is computed in logic.ts.
 */

export interface City {
  name: string
  /** the city in the locative ("v Praze") */
  loc: string
  lat: number
  lon: number
  code: string
  /** UTC offset in hours in January and in July */
  jan: number
  jul: number
}

export const CITIES: City[] = [
  { name: 'Praha', loc: 'v Praze', lat: 50.0875, lon: 14.4214, code: 'CZE', jan: 1, jul: 2 },
  { name: 'Londýn', loc: 'v Londýně', lat: 51.5074, lon: -0.1278, code: 'GBR', jan: 0, jul: 1 },
  { name: 'Lisabon', loc: 'v Lisabonu', lat: 38.7223, lon: -9.1393, code: 'PRT', jan: 0, jul: 1 },
  { name: 'Reykjavík', loc: 'v Reykjavíku', lat: 64.1466, lon: -21.9426, code: 'ISL', jan: 0, jul: 0 },
  { name: 'Madrid', loc: 'v Madridu', lat: 40.4168, lon: -3.7038, code: 'ESP', jan: 1, jul: 2 },
  { name: 'Atény', loc: 'v Aténách', lat: 37.9838, lon: 23.7275, code: 'GRC', jan: 2, jul: 3 },
  { name: 'Moskva', loc: 'v Moskvě', lat: 55.7558, lon: 37.6173, code: 'RUS', jan: 3, jul: 3 },
  { name: 'Káhira', loc: 'v Káhiře', lat: 30.0444, lon: 31.2357, code: 'EGY', jan: 2, jul: 3 },
  { name: 'Nairobi', loc: 'v Nairobi', lat: -1.2864, lon: 36.8172, code: 'KEN', jan: 3, jul: 3 },
  { name: 'Kapské Město', loc: 'v Kapském Městě', lat: -33.9249, lon: 18.4241, code: 'ZAF', jan: 2, jul: 2 },
  { name: 'Dubaj', loc: 'v Dubaji', lat: 25.2048, lon: 55.2708, code: 'ARE', jan: 4, jul: 4 },
  { name: 'Teherán', loc: 'v Teheránu', lat: 35.6892, lon: 51.389, code: 'IRN', jan: 3.5, jul: 3.5 },
  { name: 'Nové Dillí', loc: 'v Novém Dillí', lat: 28.6139, lon: 77.209, code: 'IND', jan: 5.5, jul: 5.5 },
  { name: 'Káthmándú', loc: 'v Káthmándú', lat: 27.7172, lon: 85.324, code: 'NPL', jan: 5.75, jul: 5.75 },
  { name: 'Bangkok', loc: 'v Bangkoku', lat: 13.7563, lon: 100.5018, code: 'THA', jan: 7, jul: 7 },
  { name: 'Peking', loc: 'v Pekingu', lat: 39.9042, lon: 116.4074, code: 'CHN', jan: 8, jul: 8 },
  { name: 'Singapur', loc: 'v Singapuru', lat: 1.2903, lon: 103.8519, code: 'SGP', jan: 8, jul: 8 },
  { name: 'Tokio', loc: 'v Tokiu', lat: 35.6895, lon: 139.6917, code: 'JPN', jan: 9, jul: 9 },
  { name: 'Darwin', loc: 'v Darwinu', lat: -12.4634, lon: 130.8456, code: 'AUS', jan: 9.5, jul: 9.5 },
  { name: 'Adelaide', loc: 'v Adelaide', lat: -34.9285, lon: 138.6007, code: 'AUS', jan: 10.5, jul: 9.5 },
  { name: 'Sydney', loc: 'v Sydney', lat: -33.8688, lon: 151.2093, code: 'AUS', jan: 11, jul: 10 },
  { name: 'Auckland', loc: 'v Aucklandu', lat: -36.8485, lon: 174.7633, code: 'NZL', jan: 13, jul: 12 },
  { name: 'Honolulu', loc: 'v Honolulu', lat: 21.3069, lon: -157.8583, code: 'USA', jan: -10, jul: -10 },
  { name: 'Los Angeles', loc: 'v Los Angeles', lat: 34.0522, lon: -118.2437, code: 'USA', jan: -8, jul: -7 },
  { name: 'Chicago', loc: 'v Chicagu', lat: 41.8781, lon: -87.6298, code: 'USA', jan: -6, jul: -5 },
  { name: 'New York', loc: 'v New Yorku', lat: 40.7128, lon: -74.006, code: 'USA', jan: -5, jul: -4 },
  { name: 'Mexiko (město)', loc: 've městě Mexiku', lat: 19.4326, lon: -99.1332, code: 'MEX', jan: -6, jul: -6 },
  { name: 'Lima', loc: 'v Limě', lat: -12.0464, lon: -77.0428, code: 'PER', jan: -5, jul: -5 },
  { name: 'Rio de Janeiro', loc: 'v Riu de Janeiru', lat: -22.9068, lon: -43.1729, code: 'BRA', jan: -3, jul: -3 },
  { name: 'Buenos Aires', loc: 'v Buenos Aires', lat: -34.6037, lon: -58.3816, code: 'ARG', jan: -3, jul: -3 },
]

/** Flights for the puzzles: [from, to, flight time in hours] – typical block times, rounded. */
export const FLIGHTS: [string, string, number][] = [
  ['Praha', 'New York', 9],
  ['Praha', 'Dubaj', 6],
  ['Praha', 'Peking', 10],
  ['Praha', 'Bangkok', 11],
  ['Praha', 'Tokio', 13],
  ['Praha', 'Nové Dillí', 8],
  ['Praha', 'Los Angeles', 12],
  ['Praha', 'Káhira', 4],
  ['Londýn', 'Sydney', 22],
  ['New York', 'Londýn', 7],
  ['Tokio', 'Los Angeles', 10],
  ['Sydney', 'Los Angeles', 14],
  ['Auckland', 'Honolulu', 9],
  ['Peking', 'Praha', 11],
]

/** Czech towns for local solar time differences (longitude of the town centre). */
export const TOWNS: { name: string; loc: string; lon: number }[] = [
  { name: 'Aš', loc: 'v Aši', lon: 12.195 },
  { name: 'Cheb', loc: 'v Chebu', lon: 12.3739 },
  { name: 'Plzeň', loc: 'v Plzni', lon: 13.3736 },
  { name: 'Praha', loc: 'v Praze', lon: 14.4214 },
  { name: 'Hradec Králové', loc: 'v Hradci Králové', lon: 15.8328 },
  { name: 'Brno', loc: 'v Brně', lon: 16.6068 },
  { name: 'Olomouc', loc: 'v Olomouci', lon: 17.2509 },
  { name: 'Ostrava', loc: 'v Ostravě', lon: 18.2625 },
]

export const WEEKDAYS = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'] as const
/** "v pondělí", "ve středu" … */
export const WEEKDAY_IN = ['v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu', 'v neděli'] as const
