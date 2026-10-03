import type { Course, LevelContent } from '../../core/types'

/**
 * Biology course outline. The full syllabus with curriculum alignment
 * lives in spec/courses/biologie/syllabus.md – keep both in sync.
 * Lesson bodies are lazy-loaded per level from ./levels/lN.ts.
 * Level ids are "l1"…"l12" (games read the number from them); lesson ids "bN-M".
 * Ids are permanent once shipped (src/courses/biologie/progress-ids.json).
 */
const load = (n: number) => () =>
  import(`./levels/l${n}.ts`).then((m: { default: LevelContent }) => m.default)

export const biologie: Course = {
  id: 'biologie',
  title: 'Biologie',
  tagline: 'Od buňky a mikrobů přes rostliny, zvířata a lidské tělo až po geny, evoluci a ekosystémy.',
  color: '#56834a',
  icon: 'leaf',
  available: false,
  album: { kind: 'emblems', title: 'Sbírka slavných organismů' },
  levels: [
    {
      id: 'l1', number: 1, title: 'Život a buňka', subtitle: 'Znaky života, mikroskop, buňka a třídění organismů',
      stage: 'ZŠ 6. třída', color: '#56834a', symbol: 'Pc', emblemName: 'trepka velká', load: load(1),
      lessons: [
        { id: 'b1-1', icon: 'question', title: 'Co je život a jak ho zkoumáme', minutes: 14 },
        { id: 'b1-2', icon: 'microscope', title: 'Mikroskop a pozorování', minutes: 15 },
        { id: 'b1-3', icon: 'cell', title: 'Buňka: základ života', minutes: 16 },
        { id: 'b1-4', icon: 'muscle', title: 'Od buňky k organismu', minutes: 15 },
        { id: 'b1-5', icon: 'egg', title: 'Jak se organismy živí a rozmnožují', minutes: 14 },
        { id: 'b1-6', icon: 'family-tree', title: 'Rozmanitost a třídění života', minutes: 15 },
      ],
    },
    {
      id: 'l2', number: 2, title: 'Mikroorganismy a houby', subtitle: 'Viry, bakterie, protista, houby a lišejníky',
      stage: 'ZŠ 6. třída', color: '#7a6a2e', symbol: 'Sc', emblemName: 'kvasinka pivní', load: load(2),
      lessons: [
        { id: 'b2-1', icon: 'virus', title: 'Viry: na hranici života', minutes: 15 },
        { id: 'b2-2', icon: 'bacteria', title: 'Bakterie a sinice', minutes: 15 },
        { id: 'b2-3', icon: 'amoeba', title: 'Prvoci a řasy', minutes: 14 },
        { id: 'b2-4', icon: 'mushroom', title: 'Houby', minutes: 15 },
        { id: 'b2-5', icon: 'lichen', title: 'Lišejníky a soužití organismů', minutes: 14 },
        { id: 'b2-6', icon: 'syringe', title: 'Mikroby a naše zdraví', minutes: 16 },
      ],
    },
    {
      id: 'l3', number: 3, title: 'Rostliny', subtitle: 'Stavba, výživa a rozmnožování rostlin, jejich systém',
      stage: 'ZŠ 6.–7. třída', color: '#3f7d3a', symbol: 'At', emblemName: 'huseníček rolní', load: load(3),
      lessons: [
        { id: 'b3-1', icon: 'fern', title: 'Mechy a kapradiny', minutes: 14 },
        { id: 'b3-2', icon: 'root', title: 'Kořen, stonek a list', minutes: 16 },
        { id: 'b3-3', icon: 'sun', title: 'Fotosyntéza a dýchání rostlin', minutes: 15 },
        { id: 'b3-4', icon: 'flower', title: 'Květ, opylení a plod', minutes: 15 },
        { id: 'b3-5', icon: 'tree', title: 'Nahosemenné a krytosemenné', minutes: 16 },
        { id: 'b3-6', icon: 'seed', title: 'Rostliny a člověk', minutes: 14 },
      ],
    },
    {
      id: 'l4', number: 4, title: 'Bezobratlí živočichové', subtitle: 'Tělní plány od hub po hmyz',
      stage: 'ZŠ 7. třída', color: '#a0632c', symbol: 'Dm', emblemName: 'octomilka obecná', load: load(4),
      lessons: [
        { id: 'b4-1', icon: 'sponge', title: 'Jak je stavěno tělo živočicha', minutes: 14 },
        { id: 'b4-2', icon: 'jellyfish', title: 'Žahavci, ploštěnci a hlístice', minutes: 15 },
        { id: 'b4-3', icon: 'snail', title: 'Měkkýši a kroužkovci', minutes: 14 },
        { id: 'b4-4', icon: 'spider', title: 'Členovci: korýši a pavoukovci', minutes: 15 },
        { id: 'b4-5', icon: 'bee', title: 'Hmyz', minutes: 16 },
        { id: 'b4-6', icon: 'starfish', title: 'Ostnokožci a přehled bezobratlých', minutes: 14 },
      ],
    },
    {
      id: 'l5', number: 5, title: 'Obratlovci a chování', subtitle: 'Od ryb po savce a chování zvířat',
      stage: 'ZŠ 7. třída', color: '#2c7a72', symbol: 'Mm', emblemName: 'myš domácí', load: load(5),
      lessons: [
        { id: 'b5-1', icon: 'fish', title: 'Strunatci a ryby', minutes: 15 },
        { id: 'b5-2', icon: 'frog', title: 'Obojživelníci', minutes: 14 },
        { id: 'b5-3', icon: 'lizard', title: 'Plazi', minutes: 14 },
        { id: 'b5-4', icon: 'bird', title: 'Ptáci', minutes: 15 },
        { id: 'b5-5', icon: 'mouse', title: 'Savci: stavba a rozmnožování', minutes: 15 },
        { id: 'b5-6', icon: 'paw', title: 'Savci: přehled', minutes: 15 },
        { id: 'b5-7', icon: 'idea', title: 'Chování živočichů', minutes: 15 },
      ],
    },
    {
      id: 'l6', number: 6, title: 'Lidské tělo', subtitle: 'Orgánové soustavy, zdraví a první pomoc',
      stage: 'ZŠ 8. třída', color: '#b8483a', symbol: 'Hs', emblemName: 'člověk rozumný', load: load(6),
      lessons: [
        { id: 'b6-1', icon: 'skeleton', title: 'Kostra a svaly', minutes: 15 },
        { id: 'b6-2', icon: 'heart', title: 'Krev a oběh', minutes: 16 },
        { id: 'b6-3', icon: 'lungs', title: 'Dýchání', minutes: 14 },
        { id: 'b6-4', icon: 'stomach', title: 'Trávení a výživa', minutes: 16 },
        { id: 'b6-5', icon: 'kidney', title: 'Vylučování a kůže', minutes: 14 },
        { id: 'b6-6', icon: 'brain', title: 'Nervy a smysly', minutes: 16 },
        { id: 'b6-7', icon: 'baby', title: 'Hormony, rozmnožování a vývoj', minutes: 16 },
        { id: 'b6-8', icon: 'first-aid', title: 'Zdraví, závislosti a první pomoc', minutes: 16 },
      ],
    },
    {
      id: 'l7', number: 7, title: 'Dědičnost a evoluce', subtitle: 'Geny, křížení, proměnlivost, přírodní výběr a dějiny života',
      stage: 'ZŠ 9. třída', color: '#7a5290', symbol: 'Ps', emblemName: 'hrách setý', load: load(7),
      lessons: [
        { id: 'b7-1', icon: 'chromosome', title: 'DNA, geny a chromozomy', minutes: 15 },
        { id: 'b7-2', icon: 'pea', title: 'Mendel a křížení', minutes: 16 },
        { id: 'b7-3', icon: 'twins', title: 'Dědičnost u člověka', minutes: 15 },
        { id: 'b7-4', icon: 'radiation', title: 'Proměnlivost a mutace', minutes: 14 },
        { id: 'b7-5', icon: 'butterfly', title: 'Evoluce a přírodní výběr', minutes: 16 },
        { id: 'b7-6', icon: 'fossil', title: 'Vznik života a dějiny Země', minutes: 15 },
      ],
    },
    {
      id: 'l8', number: 8, title: 'Země a ekosystémy', subtitle: 'Neživá příroda, potravní vztahy a ochrana přírody',
      stage: 'ZŠ 9. třída', color: '#8a5a2b', symbol: 'Qr', emblemName: 'dub letní', load: load(8),
      lessons: [
        { id: 'b8-1', icon: 'volcano', title: 'Stavba Země a desková tektonika', minutes: 15 },
        { id: 'b8-2', icon: 'crystal', title: 'Nerosty a horniny', minutes: 16 },
        { id: 'b8-3', icon: 'soil', title: 'Půda a voda', minutes: 14 },
        { id: 'b8-4', icon: 'food-chain', title: 'Ekosystém a potravní vztahy', minutes: 15 },
        { id: 'b8-5', icon: 'arrow-cycle', title: 'Populace a koloběhy látek', minutes: 15 },
        { id: 'b8-6', icon: 'forest', title: 'Ekosystémy Česka', minutes: 15 },
        { id: 'b8-7', icon: 'earth', title: 'Ochrana přírody a biodiverzita', minutes: 15 },
      ],
    },
    {
      id: 'l9', number: 9, title: 'Buňka a energie', subtitle: 'Molekuly života, membrány, enzymy, dýchání, fotosyntéza a dělení buněk',
      stage: 'G1 · A-level/AP', color: '#1f6f8b', symbol: 'Ec', emblemName: 'Escherichia coli', load: load(9),
      lessons: [
        { id: 'b9-1', icon: 'drop', title: 'Chemie života', minutes: 16 },
        { id: 'b9-2', icon: 'cell', title: 'Prokaryotní a eukaryotní buňka', minutes: 17 },
        { id: 'b9-3', icon: 'droplets', title: 'Membrána a transport', minutes: 17 },
        { id: 'b9-4', icon: 'enzyme', title: 'Enzymy a metabolismus', minutes: 17 },
        { id: 'b9-5', icon: 'battery', title: 'Buněčné dýchání', minutes: 18 },
        { id: 'b9-6', icon: 'leaf', title: 'Fotosyntéza', minutes: 18 },
        { id: 'b9-7', icon: 'cell-division', title: 'Buněčný cyklus a signalizace', minutes: 17 },
      ],
    },
    {
      id: 'l10', number: 10, title: 'Molekulární genetika a biotechnologie', subtitle: 'Od DNA k bílkovině, regulace, mutace, populace a genové technologie',
      stage: 'G2 · A-level/AP', color: '#555a9e', symbol: 'Ce', emblemName: 'háďátko obecné', load: load(10),
      lessons: [
        { id: 'b10-1', icon: 'dna', title: 'DNA a její replikace', minutes: 16 },
        { id: 'b10-2', icon: 'protein', title: 'Od genu k bílkovině', minutes: 18 },
        { id: 'b10-3', icon: 'twins', title: 'Regulace genů', minutes: 16 },
        { id: 'b10-4', icon: 'warning', title: 'Mutace a nádory', minutes: 16 },
        { id: 'b10-5', icon: 'family-tree', title: 'Mendelovská genetika do hloubky', minutes: 18 },
        { id: 'b10-6', icon: 'chart', title: 'Populační genetika', minutes: 16 },
        { id: 'b10-7', icon: 'gene-scissors', title: 'Biotechnologie', minutes: 18 },
      ],
    },
    {
      id: 'l11', number: 11, title: 'Fyziologie a homeostáza', subtitle: 'Zpětná vazba, oběh, ledviny, nervy, svaly, imunita a rostliny',
      stage: 'G3 · A-level', color: '#a84d6c', symbol: 'Xl', emblemName: 'drápatka vodní', load: load(11),
      lessons: [
        { id: 'b11-1', icon: 'thermometer', title: 'Homeostáza a zpětná vazba', minutes: 16 },
        { id: 'b11-2', icon: 'blood', title: 'Výměna plynů a oběh', minutes: 17 },
        { id: 'b11-3', icon: 'kidney', title: 'Trávení, ledviny a osmoregulace', minutes: 17 },
        { id: 'b11-4', icon: 'neuron', title: 'Neuron a synapse', minutes: 17 },
        { id: 'b11-5', icon: 'eye', title: 'Smysly, svaly a pohyb', minutes: 17 },
        { id: 'b11-6', icon: 'syringe', title: 'Imunita', minutes: 17 },
        { id: 'b11-7', icon: 'root', title: 'Fyziologie rostlin', minutes: 16 },
      ],
    },
    {
      id: 'l12', number: 12, title: 'Evoluce a ekologie', subtitle: 'Důkazy evoluce, vznik druhů, člověk, populace, společenstva a biosféra',
      stage: 'G4 · maturita', color: '#3f6699', symbol: 'Gf', emblemName: 'Darwinova pěnkava', load: load(12),
      lessons: [
        { id: 'b12-1', icon: 'fossil', title: 'Důkazy evoluce a fylogeneze', minutes: 17 },
        { id: 'b12-2', icon: 'bird', title: 'Vznik druhů', minutes: 16 },
        { id: 'b12-3', icon: 'skeleton', title: 'Evoluce člověka', minutes: 16 },
        { id: 'b12-4', icon: 'chart', title: 'Populační ekologie', minutes: 17 },
        { id: 'b12-5', icon: 'pond', title: 'Společenstva a sukcese', minutes: 16 },
        { id: 'b12-6', icon: 'ocean', title: 'Ekosystémy a biomy', minutes: 17 },
        { id: 'b12-7', icon: 'earth', title: 'Člověk a biosféra', minutes: 17 },
      ],
    },
  ],
}
