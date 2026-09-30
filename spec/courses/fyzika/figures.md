# Fyzika – figures

Named engraved figures for the physics course (ids in `src/illustrations/catalog.ts`, rendered by the `diagram` block). Style: exactly as in `spec/illustration-guide.md` (engraving line art, hatching, level colour, Czech labels, readable at 330 px, `role="img"` + Czech aria-label; processes as `StepFilm`, comparisons as `StepStrip`).

Many physics pictures don't need a named figure: use the **parametric blocks** instead (`graph`, `circuit`, `forces`, `rays`, `wave` – see spec/content-guidelines.md) and the reusable chemistry figures listed at the end.

## fz1 – levels 1–3 (`src/illustrations/figures/fz1/`)

| id | What it shows |
|---|---|
| `measuring-instruments` | The physics bench set: ruler, vernier caliper, measuring cylinder, stopwatch, scales, thermometer, newton meter – each labelled with what it measures and its resolution. |
| `vernier-caliper` | Reading a vernier caliper: main scale + vernier, a worked reading (23,4 mm) with the aligned line highlighted. |
| `displacement-volume` | Measuring an irregular stone: measuring cylinder before (60 ml) and after (74 ml) → V = 14 cm³. |
| `density-column` | A tall glass with layered liquids (syrup, water, oil, alcohol) and objects floating at different layers, densities labelled. |
| `brownian-motion` | A pollen grain's zigzag path, with (magnified inset) the invisible water molecules bumping it. |
| `thermometer-scales` | °C, K and °F thermometers side by side: absolute zero, water freezing/boiling, body temperature. |
| `thermal-expansion` | Three panels: bimetallic strip bending (thermostat), rail gap in summer/winter, bridge expansion joint. |
| `electroscope` | A charged rod near an electroscope; charges drawn, leaves spreading; touching vs. induction. |
| `magnet-field` | Bar magnet with field lines (iron-filings look) and small compasses; inset: like poles repel, unlike attract. |
| `earth-magnetism` | Earth as a giant magnet: geographic vs magnetic poles, field lines, a compass needle pointing north. |
| `center-of-gravity` | Stability: a box tilting over its support base (stable → unstable), low vs high centre of gravity, balancing toy. |
| `lever-types` | The three classes of lever with fulcrum, effort and load (seesaw/crowbar, wheelbarrow/nutcracker, forearm/tweezers). |
| `pulley-systems` | Fixed pulley, movable pulley and block-and-tackle, each with the force needed for the same load. |
| `hydraulic-press` | Two connected pistons: small force on the small piston → large force on the large piston; Pascal's law. |
| `hydrostatic-pressure` | Tall bottle with holes at three depths (deeper = longer jet); dam thicker at the bottom; diver with pressure gauge. |
| `archimedes-principle` | Object hanging from a newton meter lowered into an overflow can; displaced water weighed; buoyant force arrow. |
| `float-sink` | Three bodies in water: sinks (F_G > F_vz), hovers (=), floats (<), with force arrows and densities. |
| `barometer` | Torricelli's mercury barometer (760 mm) and an aneroid barometer; pressure falling with altitude (mountain inset). |
| `pendulum-energy` | Pendulum at three positions with E_k / E_p bars (energy conservation), friction making it lose height slowly. |

## fz2 – levels 4–6 (`src/illustrations/figures/fz2/`)

| id | What it shows |
|---|---|
| `heat-transfer` | One kitchen scene: conduction (spoon in a pot), convection (currents in water), radiation (glow of the hob / campfire). |
| `four-stroke-engine` | Four-stroke petrol engine as a StepFilm: intake, compression, power, exhaust (valves, piston, spark). |
| `heat-pump` | Heat pump / fridge cycle: evaporator (takes heat), compressor, condenser (gives heat), expansion valve. |
| `sound-wave` | Tuning fork pushing air particles into compressions and rarefactions, with the matching pressure graph underneath. |
| `ear-anatomy` | The ear: outer ear, eardrum, ossicles, cochlea, auditory nerve – path of the sound. |
| `echo-sonar` | Ship's sonar pulse to the seabed and back (time → depth); bat echolocation inset. |
| `eclipses` | Solar and lunar eclipse geometry: Sun, Earth, Moon, umbra and penumbra. |
| `moon-phases` | Moon orbiting Earth lit from one side, and the phases as seen from Earth. |
| `reflection-law` | Incident and reflected ray, normal, equal angles; regular vs diffuse reflection. |
| `curved-mirrors` | Concave (converging, focus) and convex (diverging) mirrors with parallel rays; uses. |
| `refraction` | Ray entering water bends towards the normal; apparent depth (fish / straw). |
| `total-internal-reflection` | Rays at increasing angles in glass: refraction, critical angle, total reflection; optical fibre. |
| `eye-anatomy` | The eye: cornea, iris, lens, retina, optic nerve; image on the retina upside down. |
| `vision-defects` | Short- and long-sightedness: where the image forms and the correcting lens (two panels). |
| `prism-dispersion` | White light through a prism into a spectrum; rainbow (raindrop) inset. |
| `color-mixing` | Additive RGB circles and subtractive CMY circles, with where they occur (screens, printing). |
| `em-spectrum` | The electromagnetic spectrum from radio to gamma: wavelength scale, visible band, uses and dangers. |
| `field-lines-charges` | Field lines of +, −, a +/− pair and a pair of like charges; uniform field between plates. |
| `resistance-wire` | Resistance of wires: longer (more), thicker (less), different metals; R = ρ·l/S. |
| `home-wiring` | A house circuit: meter, breaker box with breakers and RCD (chránič), sockets in parallel, earth wire, a plug. |
| `pn-diode` | Diode symbol and behaviour: forward bias (current flows, LED glows) vs reverse bias (no current); simple p–n picture. |

## fz3 – levels 7–9 (`src/illustrations/figures/fz3/`)

| id | What it shows |
|---|---|
| `oersted` | Oersted's experiment: compass needle turns near a current-carrying wire; circular field lines, right-hand rule. |
| `solenoid-field` | Coil field (like a bar magnet); electromagnet with an iron core lifting paper clips. |
| `dc-motor` | DC motor: coil between magnet poles, commutator, brushes, force arrows, rotation. |
| `generator` | AC generator: rotating coil in a magnetic field, slip rings, output voltage sine graph. |
| `transformer` | Primary and secondary coils on an iron core, numbers of turns and voltages (step-up / step-down). |
| `power-grid` | From power plant: step-up transformer → high-voltage lines → substations → step-down → homes. |
| `power-plants` | Comparison plate (StepStrip-like): thermal, nuclear, hydro, wind, solar – energy chain of each in one mini schematic. |
| `nuclear-reactor` | Pressurised water reactor: core, control rods, steam generator, turbine, generator, cooling tower. |
| `solar-system` | Sun and planets in order (not to scale) with orbits; asteroid belt; dwarf planet. |
| `seasons` | Earth's orbit with axial tilt at solstices and equinoxes; why summer is warm (angle of sunlight). |
| `star-life-cycle` | Nebula → main sequence star → red giant → white dwarf; massive star → red supergiant → supernova → neutron star / black hole. |
| `projectile-motion` | Oblique throw: parabolic trajectory, velocity components at several points, range and maximum height. |
| `circular-motion` | Body on a circle: velocity tangent, centripetal force/acceleration to the centre, what happens when the string breaks. |
| `momentum-collision` | Two carts before and after collisions (elastic, inelastic, sticking together) with momentum arrows. |
| `gravity-field` | Earth's gravitational field lines; g decreasing with distance (table of heights); a satellite in orbit. |
| `kepler-orbits` | Elliptical orbit with the Sun at a focus; equal areas in equal times (shaded sectors); faster near the Sun. |
| `torque-balance` | Seesaw with two children at different distances in balance; crane with counterweight; moments labelled. |
| `spring-pendulum` | Spring oscillator and simple pendulum side by side, with period formulas and the x–t graph. |
| `interference-ripples` | Two-source interference in a ripple tank: constructive and destructive lines, path difference. |
| `standing-waves` | A string fixed at both ends with the first three harmonics; nodes and antinodes labelled. |
| `doppler-effect` | Moving source (ambulance) with wavefronts bunched ahead and stretched behind; higher/lower pitch for listeners. |

## fz4 – levels 10–12 (`src/illustrations/figures/fz4/`)

| id | What it shows |
|---|---|
| `gas-molecules-pressure` | Box of gas with molecules hitting the walls and a piston; pressure as collisions; heating → faster → more pressure. |
| `heat-engine-cycle` | Energy flow: hot reservoir → Q₁ → engine → W; Q₂ → cold reservoir; fridge reversed. |
| `stress-strain` | Stretched specimen and the stress–strain curve (Hooke region, elastic limit, yield, breaking point). |
| `surface-tension` | Water strider on water, spherical droplet, capillary tubes (water rises, mercury falls). |
| `phase-diagram` | Phase diagram of water: solid/liquid/gas regions, triple point, critical point, boiling at 1 atm. |
| `parallel-plate-field` | Uniform field between charged plates, equipotential lines, a charge accelerating across. |
| `capacitor` | Parallel-plate capacitor: charging from a battery, charges on plates, dielectric between; symbol. |
| `lorentz-force` | Positive charge moving in a magnetic field: F, B, v vectors (right-hand rule) and the circular path. |
| `mass-spectrometer` | Ion source, accelerating voltage, magnetic sector bending ions by mass, detector. |
| `faraday-lenz` | Magnet pushed into a coil connected to a galvanometer; induced current direction opposes the change (Lenz). |
| `em-wave` | Electromagnetic wave: perpendicular E and B sinusoids propagating along x. |
| `double-slit` | Young's double slit: coherent light, two slits, bright and dark fringes on the screen, path difference. |
| `diffraction-grating` | Grating with orders 0, ±1, ±2 of white light spectra on a screen. |
| `polarization` | Unpolarised light → polariser → analyser at an angle; Malus's law; LCD / sunglasses. |
| `light-clock` | Light clock at rest and moving: longer diagonal path → time dilation. |
| `photoelectric-effect` | Vacuum phototube: light on the cathode, electrons to the anode, stopping voltage; inset E_k–f graph with threshold. |
| `energy-levels` | Hydrogen energy levels (n = 1…∞) with Lyman and Balmer transitions and the visible spectral lines. |
| `laser-cavity` | Laser: gain medium, pump, fully and partially reflecting mirrors, stimulated emission photon cascade. |
| `binding-energy` | Binding energy per nucleon vs. mass number: peak at iron, fusion ← and → fission arrows. |
| `standard-model` | Particle table: 6 quarks, 6 leptons, gauge bosons, Higgs, in the familiar layout with charges. |
| `hr-diagram` | Hertzsprung–Russell diagram: main sequence, giants, supergiants, white dwarfs, the Sun. |
| `big-bang-timeline` | Timeline of the Universe: Big Bang, inflation, first nuclei, CMB, first stars, galaxies, today. |

## Reusable chemistry figures (already drawn)

`states` (diagram: particle states), `maxwell-boltzmann`, `radiation-penetration`, `nuclear-fission`, `half-life`, `rutherford-experiment`, `atom-scale`, `hydrogen-isotopes`, `heating-curve`, `calorimeter`, `electrolysis`, `li-ion-battery`, `fuel-cell`, `greenhouse-effect`, `flame-tests` (see `src/illustrations/catalog.ts`). Use them where they fit the physics story.
