/**
 * The single list of every visual asset that content may reference.
 * Renderers must implement every id; lesson content may only use these ids
 * (the content validator enforces it). See spec/illustration-guide.md.
 */

/** Line icons in the engraving style (24×24, stroke = currentColor). */
export const CHEM_ICONS = [
  // lab equipment
  'flask', 'beaker', 'test-tube', 'burner', 'flame', 'thermometer', 'balance-scale', 'pipette', 'burette',
  'funnel', 'magnet', 'magnifier', 'goggles', 'gloves', 'hazard', 'fire-extinguisher', 'stopwatch', 'mortar',
  // matter & particles
  'drop', 'droplets', 'ice', 'steam', 'crystal', 'salt', 'sugar', 'atom', 'nucleus', 'electron', 'molecule',
  'ion-plus', 'ion-minus', 'bond', 'periodic-table', 'mixture', 'gas-cloud', 'powder',
  // energy & processes
  'battery', 'lightning', 'plug', 'bulb', 'sun', 'heat', 'cold', 'equilibrium', 'arrow-cycle', 'catalyst',
  'speed', 'factory', 'recycle', 'explosion', 'rust',
  // nature & environment
  'leaf', 'tree', 'cloud', 'rain', 'earth', 'ozone', 'mountain', 'volcano', 'ocean', 'fish', 'wind',
  // everyday life
  'car', 'fuel', 'oil-barrel', 'gas-cylinder', 'plastic-bottle', 'pill', 'syringe', 'soap', 'toothpaste',
  'water-tap', 'apple', 'bread', 'milk', 'coffee', 'lemon', 'cabbage', 'egg', 'phone', 'coin', 'ring',
  'diamond', 'pencil', 'glass', 'fertilizer', 'swimming-pool', 'balloon', 'fireworks',
  // body & life
  'dna', 'cell', 'protein', 'enzyme', 'heart', 'lungs', 'stomach', 'muscle', 'bone', 'blood',
  // learning
  'idea', 'question', 'warning', 'check', 'cross', 'calculator', 'chart', 'book', 'star', 'trophy',
  // physics (drawings in icon-paths-physics.ts)
  'ruler', 'clock', 'weight', 'vector', 'lever', 'pulley', 'spring', 'pendulum', 'gauge', 'ship', 'feather', 'parachute',
  'rocket', 'planet', 'orbit', 'satellite', 'galaxy', 'telescope', 'microscope', 'lens', 'mirror', 'prism', 'rainbow',
  'eye', 'camera', 'laser', 'wave', 'sound', 'ear', 'music', 'compass', 'coil', 'motor', 'socket', 'solar-panel',
  'wind-turbine', 'radiation',
  // biology (drawings in icon-paths-biology.ts)
  'virus', 'bacteria', 'amoeba', 'mushroom', 'lichen', 'moss', 'fern', 'root', 'flower', 'seed', 'sponge', 'jellyfish', 'worm', 'snail', 'spider', 'tick', 'bee', 'butterfly', 'starfish', 'frog', 'lizard', 'bird', 'mouse', 'deer', 'paw', 'skeleton', 'tooth', 'kidney', 'brain', 'neuron', 'baby', 'first-aid', 'chromosome', 'pea', 'twins', 'fossil', 'soil', 'food-chain', 'forest', 'pond', 'family-tree', 'cell-division', 'gene-scissors',
] as const
export type ChemIcon = (typeof CHEM_ICONS)[number]

/** Molecules available to the 3D ball-and-stick renderer and the particle/reaction renderers. */
export const MOLECULES = [
  // elements & diatomics
  'H2', 'O2', 'N2', 'Cl2', 'F2', 'Br2', 'I2', 'O3', 'P4', 'S8',
  // small inorganic
  'H2O', 'CO2', 'CO', 'NH3', 'CH4', 'HCl', 'HF', 'H2S', 'SO2', 'SO3', 'NO', 'NO2', 'N2O', 'H2O2',
  'BF3', 'PCl5', 'SF6', 'CCl4', 'CH2Cl2', 'CCl2F2', 'XeF4', 'BeCl2',
  // ions
  'H3O+', 'NH4+', 'OH-', 'NO3-', 'SO4^2-', 'CO3^2-', 'PO4^3-', 'HCO3-',
  // acids
  'H2SO4', 'HNO3', 'H3PO4', 'H2CO3',
  // hydrocarbons
  'C2H6', 'C3H8', 'butane', 'isobutane', 'C2H4', 'propene', 'C2H2', 'cis-but-2-ene', 'trans-but-2-ene',
  'cyclohexane', 'benzene', 'toluene', 'naphthalene', 'styrene',
  // derivatives
  'CH3Cl', 'vinyl-chloride', 'methanol', 'ethanol', 'propan-2-ol', 'ethylene-glycol', 'glycerol', 'phenol',
  'diethyl-ether', 'formaldehyde', 'acetaldehyde', 'acetone', 'formic-acid', 'acetic-acid', 'ethyl-acetate',
  'methylamine', 'urea', 'nitrobenzene',
  // biomolecules
  'glycine', 'alanine', 'lactic-acid', 'glucose', 'alpha-glucose', 'fructose', 'ribose', 'aspirin', 'caffeine',
  'palmitic-acid', 'cholesterol-core', 'adenine', 'thymine', 'guanine', 'cytosine',
] as const
export type MoleculeId = (typeof MOLECULES)[number]

/** Named engraved figures (technical schemas, apparatus, cycles). Rendered by the `diagram` block. */
export const FIGURES = [
  // lab & matter (levels 1–2)
  'lab-equipment', 'bunsen-burner', 'heating-test-tube', 'meniscus', 'mixture-types', 'water-treatment',
  'fire-triangle', 'air-composition', 'solubility-curve', 'dissolving', 'rutherford-experiment', 'atom-scale',
  'hydrogen-isotopes', 'half-life', 'shells-vs-orbitals', 'orbital-shapes', 'radiation-penetration', 'nuclear-fission', 'heating-curve',
  // bonding (level 3)
  'vsepr-shapes', 'ionic-lattice', 'metallic-bond', 'hydrogen-bonds', 'bond-type-scale', 'polarity', 'hybridization', 'resonance',
  // reactions & calculations (level 4)
  'conservation-of-mass', 'mole-bridge', 'mole-scale', 'dilution', 'limiting-reagent', 'reaction-types',
  // acids & bases (level 5)
  'neutralization', 'indicator-colors', 'acid-rain', 'salt-preparation',
  // energy, rates, equilibrium (level 6)
  'redox-transfer', 'electrolysis', 'li-ion-battery', 'fuel-cell', 'corrosion', 'hess-cycle',
  'maxwell-boltzmann', 'equilibrium-seesaw', 'buffer-action', 'electroplating', 'calorimeter', 'gibbs-quadrants', 'reaction-orders',
  // elements (level 7)
  'blast-furnace', 'haber-process', 'contact-process', 'ostwald-process', 'limestone-cycle', 'carbon-allotropes',
  'flame-tests', 'halogen-colors', 'nitrogen-cycle', 'carbon-cycle', 'aluminium-electrolysis', 'ion-tests', 'gas-tests',
  // organic (level 8)
  'fractional-distillation', 'homologous-series', 'isomers', 'addition-mechanism', 'substitution-mechanism',
  'polymer-chain', 'esterification', 'micelle', 'polymerization-types', 'mass-spectrum', 'ir-spectrum', 'nmr-spectrum',
  // life & world (level 9)
  'glucose-ring', 'photosynthesis-respiration', 'peptide-bond', 'protein-structure', 'lipid-bilayer',
  'enzyme-lock-key', 'dna-helix', 'protein-synthesis', 'greenhouse-effect', 'ozone-layer', 'plastic-lifecycle',
  'atp-cycle', 'cellular-respiration',
  // ── physics (src/illustrations/figures/fz1…fz4, see spec/courses/fyzika/figures.md) ──
  // levels 1–3
  'measuring-instruments', 'vernier-caliper', 'displacement-volume', 'density-column', 'brownian-motion', 'thermometer-scales',
  'thermal-expansion', 'electroscope', 'magnet-field', 'earth-magnetism', 'center-of-gravity', 'lever-types', 'pulley-systems',
  'hydraulic-press', 'hydrostatic-pressure', 'archimedes-principle', 'float-sink', 'barometer', 'pendulum-energy',
  'calorimeter-mixing',
  // levels 4–6
  'heat-transfer', 'four-stroke-engine', 'heat-pump', 'sound-wave', 'ear-anatomy', 'echo-sonar', 'eclipses', 'moon-phases',
  'reflection-law', 'curved-mirrors', 'refraction', 'total-internal-reflection', 'eye-anatomy', 'vision-defects',
  'prism-dispersion', 'color-mixing', 'em-spectrum', 'field-lines-charges', 'resistance-wire', 'home-wiring', 'pn-diode',
  // levels 7–9
  'oersted', 'solenoid-field', 'dc-motor', 'generator', 'transformer', 'power-grid', 'power-plants', 'nuclear-reactor',
  'solar-system', 'seasons', 'star-life-cycle', 'projectile-motion', 'circular-motion', 'momentum-collision', 'gravity-field',
  'kepler-orbits', 'torque-balance', 'spring-pendulum', 'interference-ripples', 'standing-waves', 'doppler-effect',
  // levels 10–12
  'gas-molecules-pressure', 'heat-engine-cycle', 'stress-strain', 'surface-tension', 'phase-diagram', 'parallel-plate-field',
  'capacitor', 'lorentz-force', 'mass-spectrometer', 'faraday-lenz', 'em-wave', 'double-slit', 'diffraction-grating',
  'polarization', 'light-clock', 'photoelectric-effect', 'energy-levels', 'laser-cavity', 'binding-energy', 'standard-model',
  'hr-diagram', 'big-bang-timeline',
  // ── biology (src/illustrations/figures/bz1…bz4, see spec/courses/biologie/figures.md) ──
  // levels 1–3
  'microscope-parts', 'cell-plant-animal', 'levels-of-organisation', 'surface-volume', 'life-cycles', 'classification-hierarchy', 'dichotomous-key', 'virus-replication', 'bacterial-cell', 'protists-gallery', 'fungus-anatomy', 'lichen-section', 'immune-response-basic', 'moss-fern-cycle', 'plant-organs', 'leaf-cross-section', 'flower-parts', 'seed-germination', 'monocot-dicot',
  // levels 4–6
  'animal-symmetry', 'cnidarian-hydra', 'tapeworm-cycle', 'mollusc-groups', 'earthworm-soil', 'arthropod-groups', 'insect-metamorphosis', 'honeybee-colony', 'vertebrate-evolution', 'fish-anatomy', 'frog-metamorphosis', 'amniotic-egg', 'bird-flight', 'mammal-teeth', 'human-skeleton', 'heart-circulation', 'lungs-alveoli', 'digestive-system', 'reflex-arc', 'urinary-system', 'human-development',
  // levels 7–9
  'chromosome-karyotype', 'punnett-peas', 'blood-group-inheritance', 'sex-linkage', 'natural-selection-moth', 'artificial-selection', 'geological-timescale', 'fossil-formation', 'earth-layers', 'plate-boundaries', 'rock-cycle', 'soil-profile', 'water-cycle', 'food-web', 'energy-pyramid', 'succession', 'organelles-detail', 'endosymbiosis', 'membrane-transport', 'osmosis-cells', 'mitosis-meiosis', 'chloroplast-reactions',
  // levels 10–12
  'dna-replication', 'genetic-code-wheel', 'lac-operon', 'stem-cells', 'cancer-cell-cycle', 'dihybrid-cross', 'pcr-electrophoresis', 'crispr', 'homeostasis-feedback', 'oxygen-dissociation', 'nephron', 'synapse', 'sarcomere', 'immune-response', 'xylem-phloem', 'tropisms', 'cladogram', 'speciation', 'hominin-timeline', 'biomes',
  // extra figures for levels 1–3 (bz5) and 4–7 (bz6)
  'life-signs', 'microscope-history', 'wet-mount', 'size-scale', 'virus-structure', 'malaria-cycle', 'root-tip', 'conifers', 'celery-transpiration', 'carboniferous-forest',
  'sponge-flow', 'starfish-feet', 'skin-section', 'neuron-structure', 'reproductive-organs', 'miller-urey', 'twins',
  // extra figures for levels 8–9 (bz7) and 10–12 (bz8)
  'forest-storeys', 'pond-zones', 'world-plates', 'cell-signalling', 'mitosis-stages',
  'paternity-gel', 'potometer', 'haemodialysis', 'lateral-flow', 'survivorship-curves', 'human-migration', 'pentadactyl-limb',
] as const
export type FigureId = (typeof FIGURES)[number]

/** Individual engraved objects (big pictures on flip cards). */
export const SPECIMENS = [
  'beaker', 'erlenmeyer-flask', 'test-tube', 'graduated-cylinder', 'pipette', 'burette', 'funnel', 'burner',
  'stand', 'mortar', 'evaporating-dish', 'watch-glass', 'wash-bottle', 'test-tube-holder', 'glass-rod', 'wire-gauze',
] as const
export type SpecimenId = (typeof SPECIMENS)[number]
