/**
 * Zeměpisná síť – content (spec/courses/zemepis/games.md: level 1 lesson z1-2, level 2 lesson z2-5).
 * Real places with their coordinates (decimal degrees, WGS 84, city centre / summit; checked against
 * GeoNames and Wikipedia, 2026-10). Every derived answer (rounding, minutes, heat zone, polar circle) is
 * computed in logic.ts. `code` is the state the place lies in (tests check it with countryAt on the map data).
 */
import type { MapView } from '../../core/types'

export interface Place {
  name: string
  lat: number
  lon: number
  /** ADM0_A3 of the state (checked against the map data) */
  code: string
  /** continent view for "tap the coordinates" tasks (the place lies well inside it) */
  view?: MapView
}

/** Places on the world map (reading, tapping, comparing; level 2 zones and the Sun in the zenith). */
export const WORLD: Place[] = [
  { name: 'Praha', lat: 50.0875, lon: 14.4214, code: 'CZE', view: 'europe' },
  { name: 'Londýn', lat: 51.5074, lon: -0.1278, code: 'GBR', view: 'europe' },
  { name: 'Paříž', lat: 48.8566, lon: 2.3522, code: 'FRA', view: 'europe' },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, code: 'ESP', view: 'europe' },
  { name: 'Řím', lat: 41.8933, lon: 12.4829, code: 'ITA', view: 'europe' },
  { name: 'Moskva', lat: 55.7558, lon: 37.6173, code: 'RUS', view: 'europe' },
  { name: 'Oslo', lat: 59.9139, lon: 10.7522, code: 'NOR', view: 'europe' },
  { name: 'Atény', lat: 37.9838, lon: 23.7275, code: 'GRC', view: 'europe' },
  { name: 'Lisabon', lat: 38.7223, lon: -9.1393, code: 'PRT', view: 'europe' },
  { name: 'Reykjavík', lat: 64.1466, lon: -21.9426, code: 'ISL' },
  { name: 'Káhira', lat: 30.0444, lon: 31.2357, code: 'EGY', view: 'africa' },
  { name: 'Nairobi', lat: -1.2864, lon: 36.8172, code: 'KEN', view: 'africa' },
  { name: 'Kapské Město', lat: -33.9249, lon: 18.4241, code: 'ZAF', view: 'africa' },
  { name: 'Lagos', lat: 6.5244, lon: 3.3792, code: 'NGA', view: 'africa' },
  { name: 'Kinshasa', lat: -4.4419, lon: 15.2663, code: 'COD', view: 'africa' },
  { name: 'Dakar', lat: 14.7167, lon: -17.4677, code: 'SEN', view: 'africa' },
  { name: 'Addis Abeba', lat: 8.9806, lon: 38.7578, code: 'ETH', view: 'africa' },
  { name: 'Tokio', lat: 35.6895, lon: 139.6917, code: 'JPN', view: 'asia' },
  { name: 'Peking', lat: 39.9042, lon: 116.4074, code: 'CHN', view: 'asia' },
  { name: 'Nové Dillí', lat: 28.6139, lon: 77.209, code: 'IND', view: 'asia' },
  { name: 'Bombaj', lat: 19.076, lon: 72.8777, code: 'IND', view: 'asia' },
  { name: 'Singapur', lat: 1.2903, lon: 103.8519, code: 'SGP' },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018, code: 'THA', view: 'asia' },
  { name: 'Jakarta', lat: -6.2088, lon: 106.8456, code: 'IDN', view: 'asia' },
  { name: 'Teherán', lat: 35.6892, lon: 51.389, code: 'IRN', view: 'middle-east' },
  { name: 'Rijád', lat: 24.7136, lon: 46.6753, code: 'SAU', view: 'middle-east' },
  { name: 'New York', lat: 40.7128, lon: -74.006, code: 'USA', view: 'north-america' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, code: 'USA', view: 'north-america' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, code: 'USA', view: 'north-america' },
  { name: 'Mexiko', lat: 19.4326, lon: -99.1332, code: 'MEX', view: 'north-america' },
  { name: 'Vancouver', lat: 49.2827, lon: -123.1207, code: 'CAN', view: 'north-america' },
  { name: 'Anchorage', lat: 61.2181, lon: -149.9003, code: 'USA', view: 'north-america' },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, code: 'BRA', view: 'latin-america' },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, code: 'ARG', view: 'latin-america' },
  { name: 'Lima', lat: -12.0464, lon: -77.0428, code: 'PER', view: 'latin-america' },
  { name: 'Quito', lat: -0.1807, lon: -78.4678, code: 'ECU', view: 'latin-america' },
  { name: 'Santiago de Chile', lat: -33.4489, lon: -70.6693, code: 'CHL', view: 'latin-america' },
  { name: 'Bogotá', lat: 4.711, lon: -74.0721, code: 'COL', view: 'latin-america' },
  { name: 'Manaus', lat: -3.119, lon: -60.0217, code: 'BRA', view: 'latin-america' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, code: 'AUS', view: 'oceania' },
  { name: 'Perth', lat: -31.9505, lon: 115.8605, code: 'AUS', view: 'oceania' },
  { name: 'Darwin', lat: -12.4634, lon: 130.8456, code: 'AUS', view: 'oceania' },
  { name: 'Auckland', lat: -36.8485, lon: 174.7633, code: 'NZL', view: 'oceania' },
]

/** Places near home for reading degrees and minutes on a finer grid (czechia 1°, central-europe 2°). */
export const NEAR: (Place & { view: 'czechia' | 'central-europe' })[] = [
  { name: 'Praha', lat: 50.0875, lon: 14.4214, code: 'CZE', view: 'czechia' },
  { name: 'Brno', lat: 49.1951, lon: 16.6068, code: 'CZE', view: 'czechia' },
  { name: 'Ostrava', lat: 49.8209, lon: 18.2625, code: 'CZE', view: 'czechia' },
  { name: 'Plzeň', lat: 49.7384, lon: 13.3736, code: 'CZE', view: 'czechia' },
  { name: 'České Budějovice', lat: 48.9745, lon: 14.4743, code: 'CZE', view: 'czechia' },
  { name: 'Liberec', lat: 50.7671, lon: 15.0562, code: 'CZE', view: 'czechia' },
  { name: 'Olomouc', lat: 49.5938, lon: 17.2509, code: 'CZE', view: 'czechia' },
  { name: 'Sněžka', lat: 50.7360, lon: 15.7399, code: 'CZE', view: 'czechia' },
  { name: 'Vídeň', lat: 48.2082, lon: 16.3738, code: 'AUT', view: 'central-europe' },
  { name: 'Berlín', lat: 52.52, lon: 13.405, code: 'DEU', view: 'central-europe' },
  { name: 'Varšava', lat: 52.2297, lon: 21.0122, code: 'POL', view: 'central-europe' },
  { name: 'Budapešť', lat: 47.4979, lon: 19.0402, code: 'HUN', view: 'central-europe' },
  { name: 'Mnichov', lat: 48.1351, lon: 11.582, code: 'DEU', view: 'central-europe' },
  { name: 'Krakov', lat: 50.0647, lon: 19.945, code: 'POL', view: 'central-europe' },
]

/** Places around the polar circles (level 2: polar day and night). Rovaniemi lies just south of the circle. */
export const POLAR: (Place & { view: 'arctic' | 'antarctica'; note?: string })[] = [
  { name: 'Tromsø', lat: 69.6492, lon: 18.9553, code: 'NOR', view: 'arctic' },
  { name: 'Murmansk', lat: 68.9585, lon: 33.0827, code: 'RUS', view: 'arctic' },
  { name: 'Kiruna', lat: 67.8558, lon: 20.2253, code: 'SWE', view: 'arctic' },
  { name: 'Norilsk', lat: 69.3558, lon: 88.1893, code: 'RUS', view: 'arctic' },
  { name: 'Utqiaġvik', lat: 71.2906, lon: -156.7886, code: 'USA', view: 'arctic' },
  { name: 'Reykjavík', lat: 64.1466, lon: -21.9426, code: 'ISL', view: 'arctic' },
  { name: 'Nuuk', lat: 64.1814, lon: -51.6941, code: 'GRL', view: 'arctic' },
  { name: 'Helsinky', lat: 60.1699, lon: 24.9384, code: 'FIN', view: 'arctic' },
  { name: 'Fairbanks', lat: 64.8378, lon: -147.7164, code: 'USA', view: 'arctic' },
  { name: 'Jakutsk', lat: 62.0355, lon: 129.6755, code: 'RUS', view: 'arctic' },
  {
    name: 'Rovaniemi',
    lat: 66.5039,
    lon: 25.7294,
    code: 'FIN',
    view: 'arctic',
    note: 'Severní polární kruh vede jen několik kilometrů severně od centra (vyznačený je u „Santovy vesnice“). Lom světla v atmosféře ale zvedá Slunce nad obzor, takže tu zhruba od 6. června do 7. července nezapadá.',
  },
  { name: 'stanice McMurdo', lat: -77.8463, lon: 166.6682, code: 'ATA', view: 'antarctica' },
  { name: 'jižní pól', lat: -90, lon: 0, code: 'ATA', view: 'antarctica' },
]

/** Heat zones (teplotní pásy) bounded by the tropics and the polar circles (23° 26′ and 66° 34′). */
export const TROPIC = 23 + 26 / 60
export const POLAR_CIRCLE = 66 + 34 / 60

export type Zone = 'tropical' | 'temperate-n' | 'temperate-s' | 'polar-n' | 'polar-s'
export const ZONE_NAME: Record<Zone, string> = {
  tropical: 'tropický pás',
  'temperate-n': 'severní mírný pás',
  'temperate-s': 'jižní mírný pás',
  'polar-n': 'severní polární pás',
  'polar-s': 'jižní polární pás',
}

/** When the Sun stands in the zenith at noon over a line (dates of the solstices and equinoxes, approximate). */
export const SUN_DATES = {
  june: 'kolem 21. června',
  december: 'kolem 21. prosince',
  equinox: 'o rovnodennostech (kolem 20. března a 23. září)',
  never: 'nikdy',
} as const
