import { useId } from 'react'
import '../illustrations.css'
import { INK, type Ctx } from './physics/kit'
import { Measuring, Motion, Fluids, HeatSound, Light, Electricity, Magnetism } from './physics/scenes-zs'
import { Kinematics, Gravity, Thermo, EM, Modern } from './physics/scenes-gym'

/** Czech description of each physics level scene (aria-label). */
export const PHYSICS_LABELS = [
  'Měření a látky: odměrný válec, stopky, pravítko a krychle látky',
  'Pohyb a síly: vozík tlačený silou a padající jablko',
  'Tlak a tekutiny, práce a energie: loď plovoucí na vodě se vztlakovou silou a tlakoměr',
  'Teplo a zvuk: hrnec s párou nad plamenem a ladička vysílající zvukové vlny',
  'Světlo: hranol rozkládá bílé světlo na barevné spektrum',
  'Elektřina: obvod s baterií, spínačem a svítící žárovkou',
  'Magnetismus, energetika a vesmír: podkovový magnet s indukčními čarami, větrná elektrárna a Saturn',
  'Kinematika a dynamika: dělo na věži, parabolická dráha vodorovně vystřelené koule a vektory rychlosti',
  'Gravitace, rotace, kmity a vlny: družice obíhající planetu, kyvadlo a vlna',
  'Molekulová fyzika a termodynamika: válec s pístem a molekulami plynu a teploměr',
  'Elektřina a magnetismus: magnet zasouvaný do cívky a galvanometr ukazující indukovaný proud',
  'Optika a moderní fyzika: atom vyzařuje foton, dvojštěrbina s interferenčními proužky a hvězda',
]

const SCENES = [Measuring, Motion, Fluids, HeatSound, Light, Electricity, Magnetism, Kinematics, Gravity, Thermo, EM, Modern]

/** Engraved vignette for a physics level (1–12), ~200×200, readable at 120 px. */
export function PhysicsVignette({ level, size = 200, color, className }: { level: number; size?: number; color: string; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const idx = Math.min(12, Math.max(1, Math.round(level))) - 1
  const L = color
  const c: Ctx = { L, hi: `url(#pi${uid})`, hl: `url(#pl${uid})`, hx: `url(#px${uid})` }
  const Scene = SCENES[idx]
  return (
    <svg
      className={className ? `il-vignette ${className}` : 'il-vignette'}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={PHYSICS_LABELS[idx]}
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern id={`pi${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.9" strokeOpacity="0.45" />
        </pattern>
        <pattern id={`pl${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill={L} fillOpacity="0.28" stroke="none" />
          <line x1="0" y1="0" x2="0" y2="4" stroke={L} strokeWidth="1.3" />
        </pattern>
        <pattern id={`px${uid}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
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
