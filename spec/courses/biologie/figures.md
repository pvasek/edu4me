# Biologie – figures

Named engraved figures for the biology course (ids in `src/illustrations/catalog.ts`, rendered by the `diagram` block). Style: exactly as in `spec/illustration-guide.md` (engraving line art, hatching, level colour, Czech labels, readable at 330 px, `role="img"` + Czech aria-label; processes as `StepFilm`, comparisons as `StepStrip`).

Data-shaped pictures don't need a named figure: use the **parametric blocks** `punnett` (Punnett square from genotypes), `pedigree` (family chart) and `graph` (growth curves, enzyme activity, dissociation curve, predator–prey), and the in-lesson **experiments** (`src/lesson/experiments/catalog.ts`).

## bz1 – levels 1–3 (`src/illustrations/figures/bz1/`)

| id | What it shows |
|---|---|
| `microscope-parts` | Light microscope with labelled parts (okulár, objektiv, stolek, zrcátko/osvětlení, makro- a mikrošroub) and magnification = okulár × objektiv. |
| `cell-plant-animal` | Plant and animal cell side by side (StepStrip-like comparison): membrane, cytoplasm, nucleus, mitochondria; wall, chloroplasts, vacuole only in the plant cell. |
| `levels-of-organisation` | StepStrip: cell → tissue → organ → organ system → organism, for a human (muscle) and a plant (leaf). |
| `surface-volume` | Cubes of edge 1, 2 and 4 with surface area, volume and the ratio; a cell that grows too big. |
| `life-cycles` | Asexual (budding yeast, strawberry runner) vs sexual reproduction (two parents → gametes → offspring). |
| `classification-hierarchy` | Nested ranks doména → říše → kmen → třída → řád → čeleď → rod → druh with the example vlk obecný (*Canis lupus*). |
| `dichotomous-key` | A small branching key (leaf shapes or garden animals) with yes/no questions leading to names. |
| `virus-replication` | StepFilm: virus attaches → injects nucleic acid → cell copies it → new viruses assemble → cell bursts. |
| `bacterial-cell` | Prokaryotic cell (wall, membrane, nucleoid, plasmid, ribosomes, flagellum, pili) + the three shapes (koky, tyčinky, spirily). |
| `protists-gallery` | Engraved plate: měňavka, trepka, krásnoočko, rozsivka, dírkonožec, with scale bars in µm. |
| `fungus-anatomy` | Mushroom with fruiting body, gills, spores and the underground mycelium; inset: yeast budding, mould hyphae. |
| `lichen-section` | Cross-section of a lichen: fungal hyphae and algal layer; inset: mutualism, commensalism, parasitism arrows. |
| `immune-response-basic` | StepFilm: skin barrier → bacteria enter → white blood cell engulfs them → antibodies → memory (vaccine). |
| `moss-fern-cycle` | Moss and fern life cycles simplified: spores → gametophyte → gametes → sporophyte. |
| `plant-organs` | Seed plant with root, stem, leaves; arrows for water up (xylem) and sugars around (phloem); root hairs inset. |
| `leaf-cross-section` | Leaf section: cuticle, epidermis, palisade, spongy mesophyll, vascular bundle, stoma; CO₂ in, O₂ and water vapour out. |
| `flower-parts` | Flower in section (petal, sepal, stamen, pistil, ovary, ovule) + insect pollination arrow. |
| `seed-germination` | StepFilm: seed → root emerges → shoot → first leaves, with the conditions (water, warmth, air). |
| `monocot-dicot` | StepStrip comparison: seed leaves, leaf veins, flower parts, roots, stem bundles. |

## bz2 – levels 4–6 (`src/illustrations/figures/bz2/`)

| id | What it shows |
|---|---|
| `animal-symmetry` | Sponge (none), jellyfish (radial), worm and beetle (bilateral) with symmetry axes; head end and segments. |
| `cnidarian-hydra` | Nezmar with tentacles, mouth, two cell layers and a zoomed stinging cell (žahavá buňka) firing. |
| `tapeworm-cycle` | StepFilm life cycle of tasemnice: human ↔ pig/cow, eggs, larvae in muscle, prevention. |
| `mollusc-groups` | Plž, mlž, hlavonožec side by side: shell, foot, head, mantle. |
| `earthworm-soil` | Earthworm segments and bristles in a soil section with burrows, castings and leaves pulled down. |
| `arthropod-groups` | Body plans: korýš (rak), pavoukovec (pavouk), hmyz (brouk), stonožka – body parts and leg counts. |
| `insect-metamorphosis` | Complete (egg → larva → pupa → adult butterfly) vs incomplete (egg → nymph → adult grasshopper). |
| `honeybee-colony` | Queen, worker, drone; comb cells; the waggle dance pointing to a flower relative to the sun. |
| `vertebrate-evolution` | Timeline fish → amphibians → reptiles → birds and mammals with the key innovation of each (jaws, legs, amniotic egg, feathers, fur). |
| `fish-anatomy` | Fish with gills, swim bladder, lateral line, fins; water flow over gills. |
| `frog-metamorphosis` | StepFilm: spawn → tadpole → tadpole with legs → froglet → frog. |
| `amniotic-egg` | Reptile/bird egg in section: shell, amnion, yolk, allantois, embryo. |
| `bird-flight` | Bird skeleton with hollow bone inset, keel, air sacs and a feather's structure. |
| `mammal-teeth` | Three skulls: herbivore (cow), carnivore (wolf), omnivore (human) with tooth types labelled. |
| `human-skeleton` | Skeleton with main bones in Czech; insets: ball-and-socket and hinge joints, bone section. |
| `heart-circulation` | Heart with four chambers and valves; double circulation (body and lungs) with oxygenated/deoxygenated blood. |
| `lungs-alveoli` | Airways to the lungs; alveolus with capillary, O₂ in and CO₂ out; diaphragm. |
| `digestive-system` | Digestive tract and glands (játra, slinivka, žlučník) with what is digested where. |
| `reflex-arc` | Hand on a hot pan: receptor → sensory neuron → spinal cord → motor neuron → muscle. |
| `urinary-system` | Kidneys, ureters, bladder; a kidney in section filtering blood into urine. |
| `human-development` | StepFilm: fertilisation → embryo → fetus (months) → birth. |

## bz3 – levels 7–9 (`src/illustrations/figures/bz3/`)

| id | What it shows |
|---|---|
| `chromosome-karyotype` | DNA → wound on histones → chromosome; a human karyotype of 23 pairs with XX/XY. |
| `punnett-peas` | Mendel's experiment: purple × white peas → F1 all purple → F2 3 : 1, drawn with peas. |
| `blood-group-inheritance` | ABO alleles (I^A, I^B, i), codominance, and the four blood groups with antigens on red cells. |
| `sex-linkage` | X and Y chromosomes; colour blindness passed from a carrier mother to sons. |
| `natural-selection-moth` | StepFilm: light and dark peppered moths on clean vs sooty bark; birds eat the visible ones; frequencies change. |
| `artificial-selection` | Wild cabbage → kale, broccoli, cauliflower, kohlrabi, Brussels sprouts. |
| `geological-timescale` | Earth's history as a 24-hour clock or spiral: first cells, oxygen, Cambrian, land, dinosaurs, mammals, humans. |
| `fossil-formation` | StepFilm: organism dies → buried in sediment → minerals replace → uplift and erosion → fossil found. |
| `earth-layers` | Cut-away Earth: crust, mantle, outer and inner core with thicknesses and temperatures. |
| `plate-boundaries` | Divergent, convergent (subduction, mountains) and transform boundaries with arrows. |
| `rock-cycle` | Igneous → sedimentary → metamorphic and back (melting, weathering, pressure). |
| `soil-profile` | Soil horizons (humus, topsoil, subsoil, bedrock) with organisms. |
| `water-cycle` | Evaporation, transpiration, condensation, precipitation, infiltration, runoff, groundwater. |
| `food-web` | Czech forest food web: oak, caterpillar, mouse, tit, owl, fox, fungi, earthworm. |
| `energy-pyramid` | Pyramid of energy with the 10 % rule (10 000 → 1 000 → 100 → 10 kJ). |
| `succession` | StepStrip: abandoned field → grasses → shrubs → pioneer trees → forest. |
| `organelles-detail` | Eukaryotic cell (EM style): nucleus, nucleolus, rough and smooth ER, Golgi, lysosome, mitochondrion, ribosomes, cytoskeleton. |
| `endosymbiosis` | StepFilm: host cell engulfs an aerobic bacterium → mitochondrion; then a cyanobacterium → chloroplast; evidence. |
| `membrane-transport` | Diffusion, facilitated diffusion (channel), osmosis, active transport (pump with ATP), endo/exocytosis. |
| `osmosis-cells` | Red blood cell and plant cell in hypotonic, isotonic and hypertonic solutions (lysis, turgor, plasmolysis). |
| `mitosis-meiosis` | StepStrip: mitosis (2 identical diploid cells) vs meiosis (4 different haploid cells), crossing-over shown. |
| `chloroplast-reactions` | Chloroplast: thylakoid (light reactions: H₂O → O₂, ATP, NADPH) and stroma (Calvin cycle: CO₂ → sugar). |

## bz4 – levels 10–12 (`src/illustrations/figures/bz4/`)

| id | What it shows |
|---|---|
| `dna-replication` | Replication fork: helicase, leading and lagging strand, DNA polymerase, Okazaki fragments, semi-conservative result. |
| `genetic-code-wheel` | Codon wheel (inner first base → outer third base) with amino acid abbreviations, start and stop codons. |
| `lac-operon` | Lac operon off (repressor bound) and on (lactose binds repressor, RNA polymerase transcribes). |
| `stem-cells` | Embryonic stem cell → specialised cells; adult stem cells in bone marrow; iPS cells. |
| `cancer-cell-cycle` | Cell cycle with checkpoints; oncogene as stuck accelerator, tumour suppressor as broken brake; tumour growth. |
| `dihybrid-cross` | Mendel's round/wrinkled × yellow/green peas: gametes and the 9 : 3 : 3 : 1 result drawn as peas. |
| `pcr-electrophoresis` | StepFilm: PCR cycle (denature, anneal, extend, doubling) → gel electrophoresis bands (DNA fingerprint). |
| `crispr` | Cas9 with guide RNA finding a matching DNA sequence, cutting it, the cell repairing or inserting a new gene. |
| `homeostasis-feedback` | Negative feedback loop (receptor → control centre → effector) for body temperature and blood glucose. |
| `oxygen-dissociation` | Haemoglobin dissociation curve (S-shape), lungs vs tissues, Bohr shift to the right. |
| `nephron` | Nephron: glomerulus, Bowman's capsule, tubules, loop of Henle, collecting duct; filtration, reabsorption, ADH. |
| `synapse` | Chemical synapse: action potential arrives, Ca²⁺, vesicles release neurotransmitter, receptors, reuptake. |
| `sarcomere` | Sarcomere relaxed and contracted: actin, myosin, Z-lines; the sliding filament mechanism. |
| `immune-response` | Antigen → macrophage → helper T cell → B cells (plasma cells, antibodies) and killer T cells; memory cells. |
| `xylem-phloem` | Transpiration stream (roots → xylem → stomata) and phloem translocation from source (leaf) to sink (fruit, root). |
| `tropisms` | Phototropism (auxin on the shaded side) and gravitropism of root and shoot. |
| `cladogram` | A cladogram of vertebrates with shared derived traits marked on the branches; how to read it. |
| `speciation` | Allopatric speciation StepFilm: one population → barrier → divergence → two species. |
| `hominin-timeline` | Hominin timeline (Sahelanthropus → Australopithecus → Homo habilis → H. erectus → Neanderthals, H. sapiens) with skulls and the out-of-Africa map. |
| `biomes` | World map of biomes (tropical rainforest, savanna, desert, temperate forest, taiga, tundra) with climate keys. |

## Reusable figures from other courses (already drawn)

`photosynthesis-respiration`, `cellular-respiration`, `atp-cycle`, `enzyme-lock-key`, `lipid-bilayer`, `dna-helix`, `protein-synthesis`, `protein-structure`, `glucose-ring`, `nitrogen-cycle`, `carbon-cycle`, `greenhouse-effect`, `ozone-layer` (chemistry); `eye-anatomy`, `vision-defects`, `ear-anatomy`, `radiation-penetration` (physics). Use them where they fit the biological story.

## bz5 – extra figures for levels 1–3 (`src/illustrations/figures/bz5/`)

| id | What it shows |
|---|---|
| `life-signs` | Plate of the signs of life (metabolism, growth, reproduction, response, movement, cells, heredity), each with a small engraved example; a crystal and a fire as "looks alive but isn't". |
| `microscope-history` | Leeuwenhoek's single-lens microscope, Hooke's compound microscope with his cork cells, and a modern school microscope. |
| `wet-mount` | StepFilm: drop of water → onion epidermis → cover slip at an angle → stain → observe. |
| `size-scale` | Size ladder from 1 m to 10 nm: person, hand, ant, hair width, egg cell, cheek cell, bacterium, virus; which needs eye, lupa, light microscope, electron microscope. |
| `virus-structure` | Two viruses in section: a naked icosahedral virus and an enveloped virus (envelope, spikes, capsid, RNA/DNA), with size compared to a bacterium. |
| `malaria-cycle` | StepFilm: mosquito bite → liver → red blood cells burst (fever cycles) → mosquito takes up gametes. |
| `root-tip` | Root tip zones: root cap, division zone, elongation zone, root-hair zone, with water entering a root hair. |
| `conifers` | Plate of Czech conifers: smrk, borovice, jedle, modřín – twigs with needles and cones, key differences labelled. |
| `celery-transpiration` | Celery stalk in coloured water: after hours the leaves colour; cross-section shows the dyed vessels. |
| `carboniferous-forest` | Carboniferous swamp forest with tree ferns, giant horsetails and club mosses, a giant dragonfly; below, layers turning into coal. |

## bz6 – extra figures for levels 4–7 (`src/illustrations/figures/bz6/`)

| id | What it shows |
|---|---|
| `sponge-flow` | Sponge in section: water in through pores, collar cells, out through the osculum; food filtered. |
| `starfish-feet` | Starfish from below with tube feet; water-vascular system; prying open a mussel. |
| `skin-section` | Skin section: epidermis, dermis, subcutaneous fat, hair follicle, sweat gland, sebaceous gland, receptors, blood vessels. |
| `neuron-structure` | Neuron: dendrites, cell body, nucleus, axon with myelin sheath, nodes, axon terminals; signal direction. |
| `reproductive-organs` | Male and female reproductive systems as clean, respectful textbook diagrams with Czech labels. |
| `miller-urey` | The Miller–Urey apparatus: "ocean" flask heated, "atmosphere" gases, sparks, condenser, amino acids collecting. |
| `twins` | Identical (one egg splits) vs fraternal twins (two eggs, two sperm) as a StepStrip. |
