import { useId } from 'react'
import '../illustrations.css'
import { INK, type Ctx } from './geography/kit'
import { MapCompass, EarthSun, Relief, ClimateLake, TownSquare, Port, Rainforest, Danube, Snezka } from './geography/scenes-zs'
import { CoastSatellite, CityFlags, WindPlanet } from './geography/scenes-gym'

/** Czech description of each geography level scene (aria-label). */
export const GEOGRAPHY_LABELS = [
  'Mapa a orientace: turista s batohem na hřebeni u turistického rozcestníku, v popředí rozložená mapa s vrstevnicemi a buzola',
  'Země ve vesmíru: Slunce a Země se skloněnou zemskou osou na oběžné dráze, odvrácená polokoule ve stínu noci a Měsíc',
  'Reliéf Země: sopka s lávou a oblakem popela nad magmatickým krbem, vedle vrásová pohoří a zvrásněné vrstvy hornin',
  'Podnebí, vody a krajinné pásy: jezero pod horami a tajgou, dešťový mrak a na obloze klimatogram se sloupci srážek a křivkou teploty',
  'Lidé na Zemi: náměstí se štítovými domy, radniční věží s hodinami a kašnou, po dlažbě chodí lidé',
  'Hospodářství světa: kontejnerový přístav s portálovým jeřábem, který překládá kontejner na loď',
  'Regiony světa: řeka meandruje deštným pralesem, po ní pluje kánoe, na břehu palma a vysoký strom nad korunami',
  'Evropa: řetězový most přes Dunaj, po řece pluje loď, za ním vinice a zasněžené Alpy a na nebi kruh dvanácti hvězd',
  'Česko: Sněžka s kaplí na vrcholu nad hřebenem Krkonoš, smrkový les a horská bouda na louce',
  'Systémy Země a přírodní rizika: družice snímkuje pobřeží s majákem, pod mořem se oceánská deska podsouvá pod pevninu a vzniká zemětřesení',
  'Obyvatelstvo, města a geopolitika: panorama velkoměsta s kupolí a mrakodrapy, před ním náměstí s řadou vlajek a lidmi',
  'Globální hospodářství a udržitelnost: větrné elektrárny, pole, stromy a solární panely na zeměkouli s poledníky a rovnoběžkami',
]

const SCENES = [MapCompass, EarthSun, Relief, ClimateLake, TownSquare, Port, Rainforest, Danube, Snezka, CoastSatellite, CityFlags, WindPlanet]

/** Engraved vignette for a geography level (1–12), ~200×200, readable at 120 px. */
export function GeographyVignette({ level, size = 200, color, className }: { level: number; size?: number; color: string; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const idx = Math.min(12, Math.max(1, Math.round(level))) - 1
  const L = color
  const c: Ctx = { L, hi: `url(#gi${uid})`, hl: `url(#gl${uid})`, hx: `url(#gx${uid})` }
  const Scene = SCENES[idx]
  return (
    <svg
      className={className ? `il-vignette ${className}` : 'il-vignette'}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={GEOGRAPHY_LABELS[idx]}
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern id={`gi${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.9" strokeOpacity="0.45" />
        </pattern>
        <pattern id={`gl${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill={L} fillOpacity="0.28" stroke="none" />
          <line x1="0" y1="0" x2="0" y2="4" stroke={L} strokeWidth="1.3" />
        </pattern>
        <pattern id={`gx${uid}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke={INK} strokeWidth="0.9" strokeOpacity="0.6" />
          <line x1="0" y1="0" x2="3" y2="0" stroke={INK} strokeWidth="0.6" strokeOpacity="0.35" />
        </pattern>
      </defs>
      {/* backdrop plate */}
      <circle cx="100" cy="100" r="92" fill={L} fillOpacity="0.09" stroke="none" />
      <circle cx="100" cy="100" r="92" stroke={L} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 4.5" />
      <Scene {...c} />
    </svg>
  )
}
