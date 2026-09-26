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
  'hydrogen-isotopes', 'half-life', 'shells-vs-orbitals', 'orbital-shapes',
  // bonding (level 3)
  'vsepr-shapes', 'ionic-lattice', 'metallic-bond', 'hydrogen-bonds', 'bond-type-scale', 'polarity',
  // reactions & calculations (level 4)
  'conservation-of-mass', 'mole-bridge', 'mole-scale', 'dilution', 'limiting-reagent', 'reaction-types',
  // acids & bases (level 5)
  'neutralization', 'indicator-colors', 'acid-rain', 'salt-preparation',
  // energy, rates, equilibrium (level 6)
  'redox-transfer', 'electrolysis', 'li-ion-battery', 'fuel-cell', 'corrosion', 'hess-cycle',
  'maxwell-boltzmann', 'equilibrium-seesaw', 'buffer-action',
  // elements (level 7)
  'blast-furnace', 'haber-process', 'contact-process', 'ostwald-process', 'limestone-cycle', 'carbon-allotropes',
  'flame-tests', 'halogen-colors', 'nitrogen-cycle', 'carbon-cycle', 'aluminium-electrolysis',
  // organic (level 8)
  'fractional-distillation', 'homologous-series', 'isomers', 'addition-mechanism', 'substitution-mechanism',
  'polymer-chain', 'esterification', 'micelle',
  // life & world (level 9)
  'glucose-ring', 'photosynthesis-respiration', 'peptide-bond', 'protein-structure', 'lipid-bilayer',
  'enzyme-lock-key', 'dna-helix', 'protein-synthesis', 'greenhouse-effect', 'ozone-layer', 'plastic-lifecycle',
] as const
export type FigureId = (typeof FIGURES)[number]
