/**
 * Energetický řetězec – content per level (spec/courses/fyzika/games.md:
 * 3 mechanická energie · 4 teplo a motory · 7 elektrárny a zdroje · 10 tepelné stroje a účinnost).
 *
 * A chain lists its cards from the source of energy to its use. Numbers for the
 * efficiency tasks (level 10) are only ranges; the values and answers are
 * generated and computed in logic.ts.
 */

export interface Card {
  /** What happens / where the energy is (Czech). */
  text: string
  /** Form of energy at this step, <Md> markup allowed (e.g. "teplo Q_{1}"). */
  form: string
}

export interface Chain {
  id: string
  title: string
  cards: Card[]
}

const c = (text: string, form: string): Card => ({ text, form })

/** L3 (f3-5, f3-6): mechanical energy – pendulum, roller coaster, dam, energy chains. */
const L3: Chain[] = [
  {
    id: 'pendulum',
    title: 'Kyvadlo',
    cards: [
      c('Svaly ruky zvednou kuličku kyvadla', 'chemická energie'),
      c('Kulička v krajní poloze', 'polohová energie'),
      c('Kulička v nejnižším bodě', 'pohybová energie'),
      c('Kyvadlo se po chvíli zastaví', 'vnitřní energie (teplo)'),
    ],
  },
  {
    id: 'coaster',
    title: 'Horská dráha',
    cards: [
      c('Elektromotor vytahuje vozík nahoru', 'elektrická energie'),
      c('Vozík na nejvyšším vrcholu', 'polohová energie'),
      c('Vozík se řítí do údolí', 'pohybová energie'),
      c('Brzdy v cíli se zahřejí', 'vnitřní energie (teplo)'),
    ],
  },
  {
    id: 'dam',
    title: 'Vodní přehrada',
    cards: [
      c('Voda v přehradní nádrži', 'polohová energie'),
      c('Voda proudí potrubím dolů', 'pohybová energie'),
      c('Turbína roztočí generátor', 'elektrická energie'),
      c('Lampa v obýváku', 'světlo a teplo'),
    ],
  },
  {
    id: 'sun-bike',
    title: 'Od Slunce na kopec',
    cards: [
      c('Slunce', 'záření (světlo)'),
      c('Obilí na poli (fotosyntéza)', 'chemická energie'),
      c('Cyklista šlape do pedálů', 'pohybová energie'),
      c('Cyklista na vrcholu kopce', 'polohová energie'),
    ],
  },
  {
    id: 'bow',
    title: 'Luk a šíp',
    cards: [
      c('Lukostřelec napíná tětivu', 'chemická energie'),
      c('Napnutý luk', 'energie pružnosti'),
      c('Vystřelený šíp', 'pohybová energie'),
      c('Šíp v nejvyšším bodě letu', 'polohová energie'),
    ],
  },
  {
    id: 'ball',
    title: 'Skákající míček',
    cards: [
      c('Míček držený nad zemí', 'polohová energie'),
      c('Padající míček', 'pohybová energie'),
      c('Míček zmáčknutý při dopadu', 'energie pružnosti'),
      c('Míček se po několika odskocích zastaví', 'vnitřní energie (teplo)'),
    ],
  },
  {
    id: 'dynamo',
    title: 'Dynamo na kole',
    cards: [
      c('Snídaně cyklisty', 'chemická energie'),
      c('Točící se kolo', 'pohybová energie'),
      c('Dynamo', 'elektrická energie'),
      c('Přední světlo', 'záření (světlo)'),
    ],
  },
  {
    id: 'sled',
    title: 'Sáňkování',
    cards: [
      c('Dítě táhne sáně do kopce', 'chemická energie'),
      c('Sáně na vrcholu kopce', 'polohová energie'),
      c('Jízda z kopce', 'pohybová energie'),
      c('Sáně zastaví v závěji', 'vnitřní energie (teplo)'),
    ],
  },
]

/** L4 (f4-1 – f4-4): heat, changes of state and heat engines. */
const L4: Chain[] = [
  {
    id: 'car',
    title: 'Automobil',
    cards: [
      c('Benzín v nádrži', 'chemická energie'),
      c('Hoření směsi ve válci', 'vnitřní energie horkých plynů'),
      c('Píst a klikový hřídel', 'mechanická práce'),
      c('Jedoucí auto', 'pohybová energie'),
      c('Brzdění před semaforem', 'vnitřní energie brzd (teplo)'),
    ],
  },
  {
    id: 'loco',
    title: 'Parní lokomotiva',
    cards: [
      c('Uhlí v topeništi', 'chemická energie'),
      c('Voda v kotli se mění v páru', 'vnitřní energie páry'),
      c('Pára tlačí píst', 'mechanická práce'),
      c('Rozjetá lokomotiva', 'pohybová energie'),
    ],
  },
  {
    id: 'kettle',
    title: 'Rychlovarná konvice',
    cards: [
      c('Zásuvka', 'elektrická energie'),
      c('Topná spirála', 'teplo'),
      c('Voda se ohřívá', 'vnitřní energie vody'),
      c('Voda vře a mění se v páru', 'skupenské teplo varu'),
    ],
  },
  {
    id: 'match',
    title: 'Škrtnutí sirkou',
    cards: [
      c('Svaly ruky', 'chemická energie'),
      c('Sirka se pohybuje po škrtátku', 'pohybová energie'),
      c('Tření zahřeje hlavičku sirky', 'vnitřní energie (teplo)'),
      c('Plamen sirky', 'teplo a světlo'),
    ],
  },
  {
    id: 'stove',
    title: 'Kamna na dřevo',
    cards: [
      c('Polena dřeva', 'chemická energie'),
      c('Oheň v kamnech', 'teplo'),
      c('Rozpálená litina kamen (vedení tepla)', 'vnitřní energie litiny'),
      c('Teplý vzduch stoupá ke stropu (proudění)', 'vnitřní energie vzduchu'),
    ],
  },
  {
    id: 'jet',
    title: 'Proudové letadlo',
    cards: [
      c('Letecký petrolej', 'chemická energie'),
      c('Spalovací komora motoru', 'vnitřní energie horkých plynů'),
      c('Proud plynů z trysky', 'pohybová energie plynů'),
      c('Letadlo nabírá výšku', 'polohová energie'),
    ],
  },
  {
    id: 'ice',
    title: 'Led na slunci',
    cards: [
      c('Slunce', 'záření'),
      c('Kostka ledu se ohřeje na 0 °C', 'vnitřní energie ledu'),
      c('Led taje', 'skupenské teplo tání'),
      c('Voda z ledu se dál ohřívá', 'vnitřní energie vody'),
    ],
  },
  {
    id: 'genset',
    title: 'Dieselová elektrocentrála',
    cards: [
      c('Nafta v nádrži', 'chemická energie'),
      c('Dieselový motor', 'vnitřní energie horkých plynů'),
      c('Otáčející se hřídel', 'pohybová energie'),
      c('Generátor', 'elektrická energie'),
      c('Světla na stavbě', 'záření (světlo)'),
    ],
  },
]

/** L7 (f7-5, f7-6): power plants and energy sources. */
const L7: Chain[] = [
  {
    id: 'coal',
    title: 'Uhelná elektrárna',
    cards: [
      c('Hnědé uhlí', 'chemická energie'),
      c('Kotel plný páry', 'vnitřní energie páry'),
      c('Parní turbína', 'pohybová energie'),
      c('Generátor', 'elektrická energie'),
      c('Pračka doma', 'pohybová energie bubnu'),
    ],
  },
  {
    id: 'nuclear',
    title: 'Jaderná elektrárna',
    cards: [
      c('Uran v palivových tyčích', 'jaderná energie'),
      c('Voda v reaktoru a parogenerátoru', 'vnitřní energie (teplo)'),
      c('Pára roztáčí turbínu', 'pohybová energie'),
      c('Generátor na hřídeli turbíny', 'elektrická energie'),
    ],
  },
  {
    id: 'hydro',
    title: 'Vodní elektrárna',
    cards: [
      c('Voda v nádrži za hrází', 'polohová energie'),
      c('Voda v tlakovém potrubí', 'pohybová energie'),
      c('Turbína s generátorem', 'elektrická energie'),
      c('Tramvaj ve městě', 'pohybová energie tramvaje'),
    ],
  },
  {
    id: 'wind',
    title: 'Větrná elektrárna',
    cards: [
      c('Slunce ohřívá zemi nerovnoměrně', 'záření'),
      c('Vítr', 'pohybová energie vzduchu'),
      c('Rotor s listy', 'pohybová energie rotoru'),
      c('Generátor v gondole', 'elektrická energie'),
      c('Nabíjení elektromobilu', 'chemická energie v baterii'),
    ],
  },
  {
    id: 'solar',
    title: 'Fotovoltaika na střeše',
    cards: [
      c('Jaderná fúze v jádru Slunce', 'jaderná energie'),
      c('Sluneční světlo', 'záření'),
      c('Fotovoltaický panel', 'elektrická energie'),
      c('Domácí baterie', 'chemická energie'),
      c('Večerní svícení', 'záření (světlo)'),
    ],
  },
  {
    id: 'pumped',
    title: 'Přečerpávací elektrárna',
    cards: [
      c('Přebytečná elektřina v noci', 'elektrická energie'),
      c('Čerpadla ženou vodu vzhůru', 'pohybová energie'),
      c('Voda v horní nádrži', 'polohová energie'),
      c('Ve špičce voda stéká dolů', 'pohybová energie vody'),
      c('Turbína s generátorem ve špičce', 'elektrická energie'),
    ],
  },
  {
    id: 'geo',
    title: 'Geotermální elektrárna',
    cards: [
      c('Horké horniny hluboko pod povrchem', 'vnitřní energie Země'),
      c('Pára z vrtu', 'vnitřní energie páry'),
      c('Turbína', 'pohybová energie'),
      c('Generátor', 'elektrická energie'),
    ],
  },
  {
    id: 'biogas',
    title: 'Bioplynová stanice',
    cards: [
      c('Slunce', 'záření'),
      c('Kukuřice na poli (fotosyntéza)', 'chemická energie'),
      c('Bioplyn z fermentoru', 'chemická energie plynu'),
      c('Kogenerační motor', 'pohybová energie'),
      c('Generátor', 'elektrická energie'),
    ],
  },
]

/** L10 (f10-5): heat engines, refrigerators and heat pumps. */
const L10: Chain[] = [
  {
    id: 'otto',
    title: 'Zážehový motor',
    cards: [
      c('Benzín ve válci', 'chemická energie'),
      c('Hoření směsi', 'teplo Q_{1} dodané plynu'),
      c('Rozpínající se plyn tlačí píst', 'práce W'),
      c('Výfukové plyny', 'teplo Q_{2} odevzdané okolí'),
    ],
  },
  {
    id: 'plant',
    title: 'Tepelná elektrárna',
    cards: [
      c('Uhlí v kotli', 'chemická energie'),
      c('Pára v kotli', 'teplo Q_{1} od ohřívače'),
      c('Turbína s generátorem', 'práce W → elektrická energie'),
      c('Kondenzátor a chladicí věž', 'teplo Q_{2} do chladiče'),
    ],
  },
  {
    id: 'heatpump',
    title: 'Tepelné čerpadlo',
    cards: [
      c('Venkovní vzduch', 'teplo Q_{2} z chladnějšího tělesa'),
      c('Výparník: chladivo se odpaří', 'vnitřní energie chladiva'),
      c('Kompresor poháněný elektřinou', 'práce W'),
      c('Radiátory v domě', 'teplo Q_{1} = Q_{2} + W'),
    ],
  },
  {
    id: 'fridge',
    title: 'Chladnička',
    cards: [
      c('Potraviny uvnitř chladničky', 'teplo Q_{2} odebrané uvnitř'),
      c('Výparník v chladničce', 'vnitřní energie chladiva'),
      c('Kompresor', 'práce W z elektrické sítě'),
      c('Mřížka na zadní stěně', 'teplo Q_{1} odevzdané do kuchyně'),
    ],
  },
]

export const CHAINS: Record<number, Chain[]> = { 3: L3, 4: L4, 7: L7, 10: L10 }

/* ------------------------------------------------------------------ L10 numbers */

/** [min, max, step] */
export type Range = readonly [number, number, number]

/** η = W / Q_1 from a heat engine: Q_1 and W (or Q_2) are given. */
export interface EtaScene {
  id: string
  title: string
  /** What the engine is. */
  what: string
  unit: 'kJ' | 'MJ'
  q1: Range
  /** Realistic efficiency range (as a fraction) used to pick W. */
  eta: Range
}

export const ETA_SCENES: EtaScene[] = [
  { id: 'car', title: 'Automobilový motor', what: 'Motor auta', unit: 'kJ', q1: [400, 1200, 50], eta: [0.24, 0.34, 0.01] },
  { id: 'diesel', title: 'Dieselový motor', what: 'Dieselový motor kamionu', unit: 'MJ', q1: [20, 90, 5], eta: [0.36, 0.45, 0.01] },
  { id: 'loco', title: 'Parní lokomotiva', what: 'Parní lokomotiva', unit: 'MJ', q1: [200, 800, 50], eta: [0.06, 0.12, 0.01] },
  { id: 'coal', title: 'Uhelná elektrárna', what: 'Blok uhelné elektrárny', unit: 'MJ', q1: [1000, 5000, 100], eta: [0.33, 0.42, 0.01] },
]

/** Carnot limit η_max = 1 − T_2 / T_1 (temperatures given in °C). */
export interface CarnotScene {
  id: string
  title: string
  hot: string
  cold: string
  t1: Range
  t2: Range
}

export const CARNOT_SCENES: CarnotScene[] = [
  { id: 'steam', title: 'Parní turbína', hot: 'pára vstupuje do turbíny', cold: 'kondenzátor', t1: [480, 600, 20], t2: [20, 45, 5] },
  { id: 'geo', title: 'Geotermální elektrárna', hot: 'pára z vrtu', cold: 'chladicí voda', t1: [150, 250, 10], t2: [15, 35, 5] },
  { id: 'otec', title: 'Oceánská tepelná elektrárna', hot: 'povrchová mořská voda', cold: 'voda z hloubky 1 km', t1: [24, 29, 1], t2: [4, 7, 1] },
  { id: 'engine', title: 'Spalovací motor', hot: 'hořící směs ve válci', cold: 'okolní vzduch', t1: [1200, 2000, 100], t2: [10, 30, 5] },
]

/** Refrigerator (ε = Q_2/W) and heat pump (ε = Q_1/W = (Q_2 + W)/W). */
export interface CopScene {
  id: string
  title: string
  kind: 'fridge' | 'pump'
  unit: 'kJ' | 'MJ'
  /** Heat taken from the cold side. */
  q2: Range
  /** Realistic factor range used to pick W. */
  cop: Range
}

export const COP_SCENES: CopScene[] = [
  { id: 'fridge', title: 'Chladnička', kind: 'fridge', unit: 'kJ', q2: [400, 1600, 50], cop: [2, 4, 0.5] },
  { id: 'freezer', title: 'Mraznička', kind: 'fridge', unit: 'kJ', q2: [300, 1200, 50], cop: [1.5, 3, 0.5] },
  { id: 'pump', title: 'Tepelné čerpadlo', kind: 'pump', unit: 'MJ', q2: [20, 120, 5], cop: [2, 4, 0.5] },
]
