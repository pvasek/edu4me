import { useId } from 'react'
import '../illustrations.css'
import { INK, type Ctx } from './biology/kit'
import { CellScope, Microbes, Plants, Invertebrates, Vertebrates, Body, Heredity, Earth } from './biology/scenes-zs'
import { CellEnergy, GeneEdit, Physiology, TreeOfLife } from './biology/scenes-gym'

/** Czech description of each biology level scene (aria-label). */
export const BIOLOGY_LABELS = [
  'Život a buňka: mikroskop a pod ním zvětšená rostlinná buňka s jádrem a chloroplasty',
  'Mikroorganismy a houby: hřib s podhoubím v půdě a bakterie pod lupou',
  'Rostliny: kvetoucí rostlina se včelou a list kapradiny se stočeným vrcholem',
  'Bezobratlí živočichové: plž s ulitou, motýl a pavouk na pavučině',
  'Obratlovci a chování: liška, žába s hrdelním vakem na leknínu a pták na větvi',
  'Lidské tělo: plíce s průdušnicí, srdce, žebra a páteř',
  'Dědičnost a evoluce: popínavý hrách s lusky, hrášky v poměru 3 : 1 a dvoušroubovice DNA',
  'Země a ekosystémy: hory, dub, vrstvy hornin a zkamenělý amonit',
  'Buňka a energie: rostlinná buňka s jádrem, chloroplastem a mitochondrií vyrábějící ATP',
  'Molekulární genetika a biotechnologie: nůžky přestřihují dvoušroubovici DNA',
  'Fyziologie a homeostáza: neuron s myelinovým axonem a záznam srdečního rytmu',
  'Evoluce a ekologie: Darwinovy pěnkavy s různými zobáky na větvích stromu života',
]

const SCENES = [CellScope, Microbes, Plants, Invertebrates, Vertebrates, Body, Heredity, Earth, CellEnergy, GeneEdit, Physiology, TreeOfLife]

/** Engraved vignette for a biology level (1–12), ~200×200, readable at 120 px. */
export function BiologyVignette({ level, size = 200, color, className }: { level: number; size?: number; color: string; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const idx = Math.min(12, Math.max(1, Math.round(level))) - 1
  const L = color
  const c: Ctx = { L, hi: `url(#bi${uid})`, hl: `url(#bl${uid})`, hx: `url(#bx${uid})` }
  const Scene = SCENES[idx]
  return (
    <svg
      className={className ? `il-vignette ${className}` : 'il-vignette'}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={BIOLOGY_LABELS[idx]}
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern id={`bi${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.9" strokeOpacity="0.45" />
        </pattern>
        <pattern id={`bl${uid}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill={L} fillOpacity="0.28" stroke="none" />
          <line x1="0" y1="0" x2="0" y2="4" stroke={L} strokeWidth="1.3" />
        </pattern>
        <pattern id={`bx${uid}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
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
