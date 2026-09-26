# Chemie – mini-games

14 games in four families. Each round lasts 1–3 minutes and gives 10–50 XP.

**Every game has its own content for every level it lists** (`levels` in `src/games/registry.ts`). The level comes from where the game was opened (a level page, a lesson's game block) or from the level chips on the game's intro screen. At each level the game trains exactly what that level's lessons teach, and never uses concepts from later levels. Without a level ("Vše") a round mixes the content of all the game's levels.

## Level matrix

| Game | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Najdi prvek | | ● | ● | | | ● | ● | | ● |
| Chemické pexeso | | ● | ● | ● | ● | ● | ● | ● | ● |
| Kdo jsem? | | ● | ● | | | | ● | ● | ● |
| Postav atom | | ● | ● | | | | | | |
| Zaplň orbitaly | | ● | ● | | | | ● | | |
| Iontová skládačka | | | ● | | ● | | ● | | |
| Názvoslovný trenažér | | | ● | | ● | | ● | ● | |
| Vyčísli rovnici | | | | ● | ● | ● | ● | ● | ● |
| Molární hmotnost | | | | ● | ● | | ● | ● | ● |
| Blesková výzva | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| Pravda, nebo lež? | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| pH laboratoř | | | | | ● | ● | | | ● |
| Titrace | | | | | ● | ● | | | |
| Funkční skupiny | | | | | | | | ● | ● |

Every level has at least two games (level 1: the two quiz games; level 2: six games).

## Per-game, per-level content

### Najdi prvek (`periodic-find`) – 10 rounds, time bonus
- **L2**: Z 1–20 plus Fe, Cu, Zn, Ag, Au, Hg, Pb, I, Br. Prompts: Czech name, symbol, "prvek s protonovým číslem 12", "3. perioda, 2. skupina", "vzácný plyn ve 2. periodě", "prvek s 5 valenčními elektrony ve 3. periodě".
- **L3**: electronegativity and ions. "Nejelektronegativnější prvek", "halogen, který tvoří anion X⁻ ve 4. periodě", "kov, který tvoří kation M²⁺ ve 3. periodě", "prvek, jehož oxid má vzorec XO₂ ve 3. periodě", "prvek s elektronegativitou 3,44".
- **L6**: reactivity. "Nejreaktivnější alkalický kov ve 4. periodě", "ušlechtilý kov v 11. skupině 6. periody", "kov, který vytěsní měď z CuSO₄, ze 12. skupiny", "kov, kterým se chrání železo (pozinkování)", "kov pro katodu Daniellova článku".
- **L7**: whole table, all main groups and key transition metals. Clues from level-7 lessons: "plyn, který tvoří 78 % vzduchu", "kov vyráběný elektrolýzou taveniny bauxitu", "prvek, jehož alotropem je grafen", "halogen, který je za normálních podmínek kapalina", "kov v hemoglobinu".
- **L9**: biogenic elements. Macro-elements (C, H, O, N, P, S, Ca, K, Na, Cl, Mg), trace elements (Fe, Zn, Cu, I, Se, Co, F, Mn, Mo). "Prvek ve středu chlorofylu", "prvek ve vitaminu B₁₂", "prvek ve hormonu štítné žlázy", "prvek v páteři DNA vedle cukru".

### Chemické pexeso (`element-memory`) – 6–8 pairs, fewer moves = more points
Cards are pairs of two different sides. The Czech text and chemistry markup render through `<Md>`.
- **L2**: symbol ↔ Czech name (weighted to tricky ones: Na, K, Ag, Au, Hg, Pb, Sn, Fe, Cu, Sb, W).
- **L3**: formula ↔ name of binary compounds (CO₂ – oxid uhličitý, FeCl₃ – chlorid železitý, H₂O₂ – peroxid vodíku…).
- **L4**: quantity ↔ unit or formula (látkové množství – mol, molární hmotnost – g/mol, c = n/V, N_A – 6,022·10²³ mol⁻¹, V_m – 22,4 dm³/mol…).
- **L5**: acid ↔ its salt's anion name (kyselina sírová – síran, dusitá – dusitan…), and indicator ↔ colour in base (fenolftalein – fialová…).
- **L6**: term ↔ definition (oxidace – ztráta elektronů, katalyzátor – snižuje aktivační energii, exotermní – ΔH < 0, pufr – odolává změně pH…).
- **L7**: element ↔ typical compound or use (Al – bauxit, N – amoniak / Haber–Bosch, Si – polovodiče, Ca – vápenec, Cl – dezinfekce vody…).
- **L8**: functional group ↔ class (–OH – alkohol, –CHO – aldehyd, –COOH – karboxylová kyselina, –NH₂ – amin…).
- **L9**: biopolymer ↔ building block (škrob – glukóza, bílkovina – aminokyseliny, DNA – nukleotidy, tuk – glycerol + mastné kyseliny…).

### Kdo jsem? (`who-am-i`) – 5 rounds, 5 hints each
- **L2**: elements; hints about particles (Z, number of neutrons of the main isotope, electron shells, valence electrons, period and group).
- **L3**: elements; hints about bonding (electronegativity, typical ion and charge, bond type with chlorine, formula of its oxide).
- **L7**: elements; descriptive hints (appearance, occurrence, production, typical compounds, uses, safety).
- **L8**: organic compounds (methan, ethan, ethen, ethyn, benzen, toluen, methanol, ethanol, glycerol, fenol, formaldehyd, aceton, kyselina octová, ethylacetát, močovina…): hints about formula, functional group, properties, uses.
- **L9**: biomolecules (glukóza, fruktóza, sacharóza, škrob, celulóza, glykogen, cholesterol, glycin, hemoglobin, inzulin, DNA, ATP, vitamin C…).

### Postav atom (`build-atom`) – 6 tasks
- **L2**: neutral atoms in nuclide notation (Z ≤ 20), isotopes (protium/deuterium/tritium, ¹²C/¹⁴C, ³⁵Cl/³⁷Cl), one simple ion.
- **L3**: ions with a noble-gas configuration (Na⁺, Mg²⁺, Al³⁺, F⁻, O²⁻, S²⁻, Cl⁻, N³⁻, K⁺, Ca²⁺); the task text asks for "ion, který vzniká z X ve sloučenině s Y" and the feedback names the noble gas whose configuration it reaches.

### Zaplň orbitaly (`electron-config`) – 4 elements
- **L2**: atoms Z ≤ 20.
- **L3**: main-group ions (Na⁺, Mg²⁺, Cl⁻, O²⁻, S²⁻, N³⁻, Al³⁺…); the learner fills the ion's configuration.
- **L7**: transition metals Z 21–30, their ions (Fe²⁺, Fe³⁺, Cu²⁺, Zn²⁺: 4s empties first), and the Cr/Cu exceptions.

### Iontová skládačka (`ion-builder`) – 8 tasks
- **L3**: monatomic ions only: halides, oxides, sulfides, nitrides (NaCl, MgO, Al₂O₃, CaF₂, Na₂S, Mg₃N₂…).
- **L5**: polyatomic ions: hydroxides, salts of oxoacids, hydrogen salts (Ca(OH)₂, Al₂(SO₄)₃, Ca₃(PO₄)₂, NaHCO₃, (NH₄)₂SO₄…).
- **L7**: transition metals with variable charges (Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺, Cr³⁺, Mn²⁺, Pb²⁺/Pb⁴⁺, Sn²⁺/Sn⁴⁺) and less common anions (MnO₄⁻, Cr₂O₇²⁻, CrO₄²⁻, ClO₃⁻, S₂O₃²⁻, SiO₃²⁻).

### Názvoslovný trenažér (`naming`) – 10 questions
- **L3**: oxides, halides, sulfides, hydrides, peroxides, nitrides.
- **L5**: oxoacids, hydroxides, salts, hydrogen salts, hydrates.
- **L7**: everything inorganic, including ions and simple coordination compounds (tetraamminměďnatý kation, hexakyanidoželeznatan draselný).
- **L8**: organic nomenclature: straight and branched alkanes, alkenes and alkynes with locants, cycloalkanes, benzene derivatives, alcohols, aldehydes, ketones, carboxylic acids, esters, amines (name → structure as a condensed formula, and structure → name).

### Vyčísli rovnici (`balance`) – 6 equations
- **L4**: synthesis, decomposition, single and double displacement, combustion of simple substances and CH₄.
- **L5**: neutralisations (incl. H₃PO₄ + Ca(OH)₂), precipitations (AgNO₃ + NaCl, BaCl₂ + Na₂SO₄), acid + metal, acid + carbonate.
- **L6**: redox (KMnO₄ + HCl, Cu + HNO₃ dilute and concentrated, K₂Cr₂O₇, H₂O₂ as oxidant and reductant, electrolysis equations).
- **L7**: industrial processes (Fe₂O₃ + CO, NH₃ synthesis, 2SO₂ + O₂, Ostwald steps, limestone cycle, thermite, chlor-alkali).
- **L8**: combustion of alkanes, alkenes, alcohols, halogenation, esterification, hydrogenation, saponification with NaOH.
- **L9**: photosynthesis, cellular respiration, alcoholic and lactic fermentation, hydrolysis of sucrose, combustion of glucose, formation of a dipeptide.

### Molární hmotnost (`molar-mass`) – 8 formulas
- **L4**: H₂O, CO₂, NaCl, NH₃, CH₄, O₂, CaCO₃, Fe₂O₃…
- **L5**: acids, hydroxides, salts and hydrates (H₂SO₄, H₃PO₄, Ca(OH)₂, Al₂(SO₄)₃, CuSO₄·5H₂O, Na₂CO₃·10H₂O…).
- **L7**: minerals and industrial compounds (Fe₃O₄, Al₂O₃, CaSO₄·2H₂O, KMnO₄, K₂Cr₂O₇, [Cu(NH₃)₄]SO₄…).
- **L8**: organic compounds (C₂H₅OH, C₆H₆, CH₃COOH, C₆H₅OH, C₃H₈O₃, CH₃COOC₂H₅…).
- **L9**: biomolecules (C₆H₁₂O₆, C₁₂H₂₂O₁₁, glycin C₂H₅NO₂, urea, tristearin C₅₇H₁₁₀O₆, ATP C₁₀H₁₆N₅O₁₃P₃…).

### Blesková výzva (`quickfire`) and Pravda, nebo lež? (`swipe`)
- **L1–L9**: questions from that level's lesson quizzes and level test only (choice/tf for quickfire, tf for swipe). If a level has too few, top up with questions from the previous level and mark them "opakování".
- **Vše**: all levels.

### pH laboratoř (`ph-lab`) – 4 missions
- **L5**: strong acids and bases, neutralisation, dilution (current missions).
- **L6**: weak acids and buffers: acetic acid (pKa 4,76) and ammonia (pKb 4,75) bottles, sodium acetate and ammonium chloride; missions like "připrav pufr o pH 4,76", "přidej 1 cm³ HCl do pufru a do vody a porovnej změnu pH", "připrav roztok octové kyseliny o pH 3". The weak-acid maths must be exact enough (solve the equilibrium, don't just use the approximation).
- **L9**: pH in living things: samples of žaludeční šťáva, krev, sliny, moč, pot; missions "uprav pH na optimum pepsinu (≈ 2)", "na optimum trypsinu (≈ 8)", "připrav pufr o pH krve 7,4 z hydrogenuhličitanu a CO₂ (pKa 6,1)"; show which enzyme would work at the current pH.

### Titrace (`titration`) – 2 samples
- **L5**: HCl with NaOH and phenolphthalein (current).
- **L6**: CH₃COOH (vinegar) with NaOH, where the learner must first pick the right indicator (phenolphthalein, not methyl orange), plus H₂SO₄ with NaOH (1 : 2 ratio in the calculation). The curve shows the half-equivalence point pH = pKa.

### Funkční skupiny (`functional-groups`) – 10 rounds
- **L8**: organic functional groups (current).
- **L9**: groups in biomolecules (current l9 set: glucose, peptide bond, fats, nucleotides, amino acids).

## Design rules for games

- Starts immediately; the shell handles intro, level choice and results.
- The HUD shows which level's content is being played.
- Tactile feedback via Motion presets: pop on correct, shake on wrong, always with text and an icon, never colour alone.
- Works with touch, mouse and keyboard at 360 px wide.
- Honest chemistry: pH and titration curves are computed; every equation, formula and name is verified by unit tests.

## Ideas for more games

- **Reakce ano/ne**: will this metal displace that one? (reactivity series)
- **Plamenové zkoušky**: match flame colours to metal ions.
- **Molekulová stavebnice 3D**: build molecules and see the VSEPR shape.
- **Detektiv v laborce**: identify an unknown substance from tests (precipitates, indicators, flame).
- **Závod izomerů**: draw as many isomers of C₅H₁₂ / C₄H₁₀O as possible.
- **Organická syntéza**: chain reactions to get from ethene to ethyl acetate.
