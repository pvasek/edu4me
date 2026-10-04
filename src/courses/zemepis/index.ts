import type { Course, LevelContent } from '../../core/types'

/**
 * Geography course outline. The full syllabus with curriculum alignment
 * lives in spec/courses/zemepis/syllabus.md – keep both in sync.
 * Lesson bodies are lazy-loaded per level from ./levels/lN.ts.
 * Level ids are "l1"…"l12" (games read the number from them); lesson ids "zN-M".
 * Ids are permanent once shipped (src/courses/zemepis/progress-ids.json).
 */
const load = (n: number) => () =>
  import(`./levels/l${n}.ts`).then((m: { default: LevelContent }) => m.default)

export const zemepis: Course = {
  id: 'zemepis',
  title: 'Zeměpis',
  tagline: 'Od mapy a kompasu přes planetu, podnebí a lidi až po regiony světa, Česko a globální výzvy.',
  color: '#2f7d86',
  icon: 'globe',
  available: true,
  album: { kind: 'emblems', title: 'Sbírka zeměpisných rekordů' },
  levels: [
    {
      id: 'l1', number: 1, title: 'Mapa a orientace', subtitle: 'Zeměpisná síť, měřítko, výškopis, orientace a digitální mapy',
      stage: 'ZŠ 6. třída', color: '#2f7d86', symbol: 'Gr', emblemName: 'Greenwich', load: load(1),
      lessons: [
        { id: 'z1-1', icon: 'question', title: 'Co je zeměpis a jak se ptá', minutes: 13 },
        { id: 'z1-2', icon: 'globe', title: 'Glóbus a zeměpisná síť', minutes: 13 },
        { id: 'z1-3', icon: 'ruler', title: 'Mapa a měřítko', minutes: 13 },
        { id: 'z1-4', icon: 'mountain', title: 'Mapové značky a výškopis', minutes: 13 },
        { id: 'z1-5', icon: 'compass', title: 'Orientace v krajině', minutes: 12 },
        { id: 'z1-6', icon: 'map', title: 'Druhy map a jejich zkreslení', minutes: 12 },
        { id: 'z1-7', icon: 'satellite', title: 'Digitální mapy, GPS a GIS', minutes: 12 },
      ],
    },
    {
      id: 'l2', number: 2, title: 'Země ve vesmíru', subtitle: 'Tvar Země, den a noc, časová pásma, roční období a slapy',
      stage: 'ZŠ 6. třída', color: '#3f5f99', symbol: 'Ch', emblemName: 'Chimborazo', load: load(2),
      lessons: [
        { id: 'z2-1', icon: 'earth', title: 'Tvar a velikost Země', minutes: 14 },
        { id: 'z2-2', icon: 'arrow-cycle', title: 'Otáčení Země', minutes: 13 },
        { id: 'z2-3', icon: 'clock', title: 'Časová pásma a datová hranice', minutes: 14 },
        { id: 'z2-4', icon: 'orbit', title: 'Oběh Země kolem Slunce a roční období', minutes: 13 },
        { id: 'z2-5', icon: 'sun', title: 'Osvětlení Země a teplotní pásy', minutes: 14 },
        { id: 'z2-6', icon: 'moon', title: 'Měsíc a slapy', minutes: 14 },
      ],
    },
    {
      id: 'l3', number: 3, title: 'Reliéf Země', subtitle: 'Desky, zemětřesení, sopky, pohoří, eroze, pobřeží a půdy',
      stage: 'ZŠ 6. třída', color: '#8a5a2b', symbol: 'Ev', emblemName: 'Mount Everest', load: load(3),
      lessons: [
        { id: 'z3-1', icon: 'layers', title: 'Stavba Země a litosférické desky', minutes: 13 },
        { id: 'z3-2', icon: 'volcano', title: 'Zemětřesení a sopky', minutes: 14 },
        { id: 'z3-3', icon: 'mountain', title: 'Jak vznikají pohoří', minutes: 13 },
        { id: 'z3-4', icon: 'cave', title: 'Zvětrávání a eroze', minutes: 12 },
        { id: 'z3-5', icon: 'river', title: 'Práce řek, ledovců a větru', minutes: 14 },
        { id: 'z3-6', icon: 'cliff', title: 'Pobřeží', minutes: 12 },
        { id: 'z3-7', icon: 'soil', title: 'Půdy a jejich ochrana', minutes: 14 },
      ],
    },
    {
      id: 'l4', number: 4, title: 'Podnebí, vody a krajinné pásy', subtitle: 'Počasí, podnebí, klimatogram, oceány, řeky a biomy',
      stage: 'ZŠ 6.–7. třída', color: '#3a7fa6', symbol: 'Bj', emblemName: 'Bajkal', load: load(4),
      lessons: [
        { id: 'z4-1', icon: 'cloud', title: 'Atmosféra a počasí', minutes: 13 },
        { id: 'z4-2', icon: 'wind', title: 'Tlak, vítr a fronty', minutes: 13 },
        { id: 'z4-3', icon: 'thermometer', title: 'Oběh vzduchu a podnebné pásy', minutes: 13 },
        { id: 'z4-4', icon: 'chart', title: 'Klimatogram', minutes: 13 },
        { id: 'z4-5', icon: 'ocean', title: 'Voda na Zemi', minutes: 13 },
        { id: 'z4-6', icon: 'glacier', title: 'Řeky, jezera a ledovce', minutes: 14 },
        { id: 'z4-7', icon: 'forest', title: 'Krajinné pásy a změna klimatu', minutes: 14 },
      ],
    },
    {
      id: 'l5', number: 5, title: 'Lidé na Zemi', subtitle: 'Rozmístění, věková pyramida, migrace, kultury, sídla a státy',
      stage: 'ZŠ 7. třída', color: '#a8573a', symbol: 'Mo', emblemName: 'Monako', load: load(5),
      lessons: [
        { id: 'z5-1', icon: 'people', title: 'Kolik nás je a kde žijeme', minutes: 14 },
        { id: 'z5-2', icon: 'baby', title: 'Porodnost, úmrtnost a věková pyramida', minutes: 14 },
        { id: 'z5-3', icon: 'footprints', title: 'Migrace', minutes: 13 },
        { id: 'z5-4', icon: 'speech', title: 'Jazyky, náboženství a kultury', minutes: 14 },
        { id: 'z5-5', icon: 'city', title: 'Sídla a města', minutes: 13 },
        { id: 'z5-6', icon: 'flag', title: 'Státy a hranice', minutes: 13 },
      ],
    },
    {
      id: 'l6', number: 6, title: 'Hospodářství světa', subtitle: 'Zemědělství, suroviny, průmysl, doprava, služby a globalizace',
      stage: 'ZŠ 7. třída', color: '#7a6a2e', symbol: 'Pa', emblemName: 'Panamský průplav', load: load(6),
      lessons: [
        { id: 'z6-1', icon: 'coin', title: 'Sektory hospodářství', minutes: 14 },
        { id: 'z6-2', icon: 'wheat', title: 'Zemědělství a výživa světa', minutes: 13 },
        { id: 'z6-3', icon: 'pickaxe', title: 'Nerostné suroviny a energie', minutes: 13 },
        { id: 'z6-4', icon: 'factory', title: 'Průmysl', minutes: 13 },
        { id: 'z6-5', icon: 'container', title: 'Doprava a spoje', minutes: 15 },
        { id: 'z6-6', icon: 'suitcase', title: 'Služby, cestovní ruch a obchod', minutes: 14 },
        { id: 'z6-7', icon: 'handshake', title: 'Globalizace a rozvoj', minutes: 14 },
      ],
    },
    {
      id: 'l7', number: 7, title: 'Regiony světa', subtitle: 'Afrika, Asie, Amerika, Austrálie a Oceánie, polární oblasti',
      stage: 'ZŠ 7.–8. třída', color: '#3f7d3a', symbol: 'Am', emblemName: 'Amazonka', load: load(7),
      lessons: [
        { id: 'z7-1', icon: 'pin', title: 'Jak dělíme svět na regiony', minutes: 14 },
        { id: 'z7-2', icon: 'dune', title: 'Afrika', minutes: 14 },
        { id: 'z7-3', icon: 'rain', title: 'Asie: východ a jih', minutes: 13 },
        { id: 'z7-4', icon: 'oil-barrel', title: 'Asie: západ, střed a sever', minutes: 14 },
        { id: 'z7-5', icon: 'tornado', title: 'Severní Amerika', minutes: 13 },
        { id: 'z7-6', icon: 'leaf', title: 'Latinská Amerika', minutes: 13 },
        { id: 'z7-7', icon: 'island', title: 'Austrálie a Oceánie', minutes: 13 },
        { id: 'z7-8', icon: 'penguin', title: 'Polární oblasti', minutes: 13 },
      ],
    },
    {
      id: 'l8', number: 8, title: 'Evropa', subtitle: 'Příroda, obyvatelé, Evropská unie a regiony Evropy',
      stage: 'ZŠ 8. třída', color: '#555a9e', symbol: 'Du', emblemName: 'Dunaj', load: load(8),
      lessons: [
        { id: 'z8-1', icon: 'mountain', title: 'Příroda Evropy', minutes: 14 },
        { id: 'z8-2', icon: 'people', title: 'Obyvatelstvo a státy Evropy', minutes: 14 },
        { id: 'z8-3', icon: 'star', title: 'Evropská unie a integrace', minutes: 14 },
        { id: 'z8-4', icon: 'ship', title: 'Západní a severní Evropa', minutes: 12 },
        { id: 'z8-5', icon: 'sun', title: 'Jižní a jihovýchodní Evropa', minutes: 13 },
        { id: 'z8-6', icon: 'castle', title: 'Střední a východní Evropa', minutes: 14 },
      ],
    },
    {
      id: 'l9', number: 9, title: 'Česko', subtitle: 'Poloha, příroda, obyvatelé, hospodářství, kraje a moje obec',
      stage: 'ZŠ 9. třída', color: '#b8483a', symbol: 'Sn', emblemName: 'Sněžka', load: load(9),
      lessons: [
        { id: 'z9-1', icon: 'pin', title: 'Poloha a území Česka', minutes: 13 },
        { id: 'z9-2', icon: 'forest', title: 'Příroda Česka', minutes: 14 },
        { id: 'z9-3', icon: 'house', title: 'Obyvatelstvo a sídla Česka', minutes: 13 },
        { id: 'z9-4', icon: 'car', title: 'Hospodářství Česka', minutes: 14 },
        { id: 'z9-5', icon: 'border', title: 'Kraje Česka', minutes: 12 },
        { id: 'z9-6', icon: 'recycle', title: 'Životní prostředí Česka', minutes: 13 },
        { id: 'z9-7', icon: 'binoculars', title: 'Moje obec: terénní výzkum', minutes: 14 },
      ],
    },
    {
      id: 'l10', number: 10, title: 'Systémy Země a přírodní rizika', subtitle: 'Cykly, energie atmosféry, změna klimatu, rizika a GIS',
      stage: 'G1–G2 · A-level', color: '#1f6f8b', symbol: 'Mp', emblemName: 'Mariánský příkop', load: load(10),
      lessons: [
        { id: 'z10-1', icon: 'arrow-cycle', title: 'Krajinná sféra jako systém', minutes: 16 },
        { id: 'z10-2', icon: 'wind', title: 'Energetická bilance a cirkulace atmosféry', minutes: 15 },
        { id: 'z10-3', icon: 'leaf', title: 'Uhlíkový cyklus a klima', minutes: 14 },
        { id: 'z10-4', icon: 'thermometer', title: 'Změna klimatu: důkazy, příčiny, scénáře', minutes: 16 },
        { id: 'z10-5', icon: 'quake', title: 'Tektonická rizika', minutes: 15 },
        { id: 'z10-6', icon: 'tornado', title: 'Hydrometeorologická rizika', minutes: 16 },
        { id: 'z10-7', icon: 'glacier', title: 'Krajiny ledovců, pouští a pobřeží', minutes: 15 },
        { id: 'z10-8', icon: 'layers', title: 'Dálkový průzkum a GIS v praxi', minutes: 15 },
      ],
    },
    {
      id: 'l11', number: 11, title: 'Obyvatelstvo, města a geopolitika', subtitle: 'Demografie, migrace, města, kultura, státy a konflikty',
      stage: 'G2–G3 · A-level/AP', color: '#7a5290', symbol: 'Va', emblemName: 'Vatikán', load: load(11),
      lessons: [
        { id: 'z11-1', icon: 'chart', title: 'Demografický přechod', minutes: 16 },
        { id: 'z11-2', icon: 'footprints', title: 'Migrace a teorie migrace', minutes: 14 },
        { id: 'z11-3', icon: 'city', title: 'Urbanizace a město 21. století', minutes: 14 },
        { id: 'z11-4', icon: 'tractor', title: 'Venkov a zemědělství', minutes: 14 },
        { id: 'z11-5', icon: 'speech', title: 'Kultura a identita míst', minutes: 13 },
        { id: 'z11-6', icon: 'border', title: 'Státy, hranice a území', minutes: 14 },
        { id: 'z11-7', icon: 'handshake', title: 'Geopolitika a mezinárodní organizace', minutes: 13 },
        { id: 'z11-8', icon: 'shield', title: 'Konflikty ve světě', minutes: 15 },
      ],
    },
    {
      id: 'l12', number: 12, title: 'Globální hospodářství a udržitelnost', subtitle: 'Globalizace, nerovnosti, voda, energie, potraviny a budoucnost',
      stage: 'G3–G4 · maturita', color: '#3d6b5a', symbol: 'An', emblemName: 'Antarktida', load: load(12),
      lessons: [
        { id: 'z12-1', icon: 'factory', title: 'Lokalizace hospodářských činností', minutes: 16 },
        { id: 'z12-2', icon: 'container', title: 'Globalizace a nadnárodní firmy', minutes: 15 },
        { id: 'z12-3', icon: 'balance-scale', title: 'Rozvoj a nerovnosti', minutes: 17 },
        { id: 'z12-4', icon: 'dam', title: 'Voda jako zdroj', minutes: 16 },
        { id: 'z12-5', icon: 'plug', title: 'Energetická bezpečnost', minutes: 14 },
        { id: 'z12-6', icon: 'wheat', title: 'Potraviny pro 10 miliard', minutes: 14 },
        { id: 'z12-7', icon: 'recycle', title: 'Udržitelný rozvoj', minutes: 15 },
        { id: 'z12-8', icon: 'hourglass', title: 'Svět v roce 2050', minutes: 15 },
      ],
    },
  ],
}
