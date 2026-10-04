import type { ComponentType, LazyExoticComponent } from 'react'
import { lazyWithReload } from '../../core/staleBuild'
import type { FigureId } from '../catalog'

type Registry = Partial<Record<FigureId, ComponentType>>

/**
 * Each figure group is its own chunk, loaded only when a lesson shows one of
 * its figures. index.ts imports every group eagerly and is for tests only.
 */
export const FIGURE_GROUPS = {
  l12: () => import('./l12').then((m) => m.FIGURES_L12),
  l35: () => import('./l35').then((m) => m.FIGURES_L35),
  l67: () => import('./l67').then((m) => m.FIGURES_L67),
  l89: () => import('./l89').then((m) => m.FIGURES_L89),
  fz1: () => import('./fz1').then((m) => m.FIGURES_FZ1),
  fz2: () => import('./fz2').then((m) => m.FIGURES_FZ2),
  fz3: () => import('./fz3').then((m) => m.FIGURES_FZ3),
  fz4: () => import('./fz4').then((m) => m.FIGURES_FZ4),
  bz1: () => import('./bz1').then((m) => m.FIGURES_BZ1),
  bz2: () => import('./bz2').then((m) => m.FIGURES_BZ2),
  bz3: () => import('./bz3').then((m) => m.FIGURES_BZ3),
  bz4: () => import('./bz4').then((m) => m.FIGURES_BZ4),
  bz5: () => import('./bz5').then((m) => m.FIGURES_BZ5),
  bz6: () => import('./bz6').then((m) => m.FIGURES_BZ6),
  bz7: () => import('./bz7').then((m) => m.FIGURES_BZ7),
  bz8: () => import('./bz8').then((m) => m.FIGURES_BZ8),
} satisfies Record<string, () => Promise<Registry>>
export type FigureGroup = keyof typeof FIGURE_GROUPS

/** Which group draws which figure. figure-groups.test.ts checks it against the registries: add every new figure id here. */
export const GROUP_FIGURES: Record<FigureGroup, readonly FigureId[]> = {
  l12: [
    'lab-equipment', 'bunsen-burner', 'heating-test-tube', 'meniscus', 'mixture-types', 'water-treatment',
    'fire-triangle', 'air-composition', 'solubility-curve', 'dissolving', 'rutherford-experiment', 'atom-scale',
    'hydrogen-isotopes', 'half-life', 'shells-vs-orbitals', 'orbital-shapes', 'radiation-penetration',
    'nuclear-fission', 'heating-curve',
  ],
  l35: [
    'vsepr-shapes', 'ionic-lattice', 'metallic-bond', 'hydrogen-bonds', 'bond-type-scale', 'polarity',
    'hybridization', 'resonance', 'conservation-of-mass', 'mole-bridge', 'mole-scale', 'dilution', 'limiting-reagent',
    'reaction-types', 'neutralization', 'indicator-colors', 'acid-rain', 'salt-preparation',
  ],
  l67: [
    'redox-transfer', 'electrolysis', 'li-ion-battery', 'fuel-cell', 'corrosion', 'hess-cycle', 'maxwell-boltzmann',
    'buffer-action', 'equilibrium-seesaw', 'blast-furnace', 'haber-process', 'contact-process', 'ostwald-process',
    'flame-tests', 'halogen-colors', 'limestone-cycle', 'carbon-allotropes', 'aluminium-electrolysis',
    'nitrogen-cycle', 'carbon-cycle', 'electroplating', 'calorimeter', 'gibbs-quadrants', 'reaction-orders',
    'ion-tests', 'gas-tests',
  ],
  l89: [
    'fractional-distillation', 'homologous-series', 'isomers', 'addition-mechanism', 'substitution-mechanism',
    'polymer-chain', 'esterification', 'micelle', 'glucose-ring', 'photosynthesis-respiration', 'peptide-bond',
    'protein-structure', 'lipid-bilayer', 'enzyme-lock-key', 'dna-helix', 'protein-synthesis', 'greenhouse-effect',
    'ozone-layer', 'plastic-lifecycle', 'polymerization-types', 'mass-spectrum', 'ir-spectrum', 'nmr-spectrum',
    'atp-cycle', 'cellular-respiration',
  ],
  fz1: [
    'measuring-instruments', 'vernier-caliper', 'displacement-volume', 'density-column', 'brownian-motion',
    'thermometer-scales', 'thermal-expansion', 'electroscope', 'magnet-field', 'earth-magnetism', 'center-of-gravity',
    'lever-types', 'pulley-systems', 'hydraulic-press', 'hydrostatic-pressure', 'archimedes-principle', 'float-sink',
    'barometer', 'pendulum-energy',
  ],
  fz2: [
    'heat-transfer', 'four-stroke-engine', 'heat-pump', 'sound-wave', 'ear-anatomy', 'echo-sonar', 'eclipses',
    'moon-phases', 'reflection-law', 'curved-mirrors', 'refraction', 'total-internal-reflection', 'eye-anatomy',
    'vision-defects', 'prism-dispersion', 'color-mixing', 'em-spectrum', 'field-lines-charges', 'resistance-wire',
    'home-wiring', 'pn-diode',
  ],
  fz3: [
    'oersted', 'solenoid-field', 'dc-motor', 'generator', 'transformer', 'power-grid', 'power-plants',
    'nuclear-reactor', 'solar-system', 'seasons', 'star-life-cycle', 'projectile-motion', 'circular-motion',
    'momentum-collision', 'gravity-field', 'kepler-orbits', 'torque-balance', 'spring-pendulum',
    'interference-ripples', 'standing-waves', 'doppler-effect',
  ],
  fz4: [
    'gas-molecules-pressure', 'heat-engine-cycle', 'stress-strain', 'surface-tension', 'phase-diagram',
    'parallel-plate-field', 'capacitor', 'lorentz-force', 'mass-spectrometer', 'faraday-lenz', 'em-wave',
    'double-slit', 'diffraction-grating', 'polarization', 'light-clock', 'photoelectric-effect', 'energy-levels',
    'laser-cavity', 'binding-energy', 'standard-model', 'hr-diagram', 'big-bang-timeline',
  ],
  bz1: [
    'microscope-parts', 'cell-plant-animal', 'levels-of-organisation', 'surface-volume', 'life-cycles',
    'classification-hierarchy', 'dichotomous-key', 'virus-replication', 'bacterial-cell', 'protists-gallery',
    'fungus-anatomy', 'lichen-section', 'immune-response-basic', 'moss-fern-cycle', 'plant-organs',
    'leaf-cross-section', 'flower-parts', 'seed-germination', 'monocot-dicot',
  ],
  bz2: [
    'animal-symmetry', 'cnidarian-hydra', 'tapeworm-cycle', 'mollusc-groups', 'earthworm-soil', 'arthropod-groups',
    'insect-metamorphosis', 'honeybee-colony', 'vertebrate-evolution', 'fish-anatomy', 'frog-metamorphosis',
    'amniotic-egg', 'bird-flight', 'mammal-teeth', 'human-skeleton', 'heart-circulation', 'lungs-alveoli',
    'digestive-system', 'reflex-arc', 'urinary-system', 'human-development',
  ],
  bz3: [
    'chromosome-karyotype', 'punnett-peas', 'blood-group-inheritance', 'sex-linkage', 'natural-selection-moth',
    'artificial-selection', 'geological-timescale', 'fossil-formation', 'earth-layers', 'plate-boundaries',
    'rock-cycle', 'soil-profile', 'water-cycle', 'food-web', 'energy-pyramid', 'succession', 'organelles-detail',
    'endosymbiosis', 'membrane-transport', 'osmosis-cells', 'mitosis-meiosis', 'chloroplast-reactions',
  ],
  bz4: [
    'dna-replication', 'genetic-code-wheel', 'lac-operon', 'stem-cells', 'cancer-cell-cycle', 'dihybrid-cross',
    'pcr-electrophoresis', 'crispr', 'homeostasis-feedback', 'oxygen-dissociation', 'nephron', 'synapse', 'sarcomere',
    'immune-response', 'xylem-phloem', 'tropisms', 'cladogram', 'speciation', 'hominin-timeline', 'biomes',
  ],
  bz5: [
    'size-scale', 'virus-structure', 'wet-mount', 'microscope-history', 'life-signs', 'root-tip', 'conifers',
    'celery-transpiration', 'malaria-cycle', 'carboniferous-forest',
  ],
  bz6: [
    'sponge-flow', 'starfish-feet', 'skin-section', 'neuron-structure', 'reproductive-organs', 'miller-urey', 'twins',
  ],
  bz7: [
    'forest-storeys', 'pond-zones', 'world-plates', 'cell-signalling', 'mitosis-stages',
  ],
  bz8: [
    'paternity-gel', 'potometer', 'haemodialysis', 'lateral-flow', 'survivorship-curves', 'human-migration',
    'pentadactyl-limb',
  ],
}

const GROUP_OF = new Map<string, FigureGroup>(
  (Object.entries(GROUP_FIGURES) as [FigureGroup, readonly FigureId[]][]).flatMap(([g, ids]) => ids.map((id) => [id, g] as const)),
)
const cache = new Map<string, LazyExoticComponent<ComponentType>>()

/** The lazy component of a named figure, or undefined when the id is not a named figure. */
export function lazyFigure(id: string): LazyExoticComponent<ComponentType> | undefined {
  const group = GROUP_OF.get(id)
  if (!group) return undefined
  let C = cache.get(id)
  if (!C) {
    C = lazyWithReload(() =>
      FIGURE_GROUPS[group]().then((r) => {
        const Fig = r[id as FigureId]
        if (!Fig) throw new Error(`Figure "${id}" is missing from group ${group}`)
        return { default: Fig }
      }),
    )
    cache.set(id, C)
  }
  return C
}
