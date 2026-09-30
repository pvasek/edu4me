import type { Course, LevelContent } from '../../core/types'

/**
 * Physics course outline. The full syllabus with curriculum alignment
 * lives in spec/courses/fyzika/syllabus.md – keep both in sync.
 * Lesson bodies are lazy-loaded per level from ./levels/lN.ts.
 * Level ids are "l1"…"l12" (games read the number from them); lesson ids "fN-M".
 */
const load = (n: number) => () =>
  import(`./levels/l${n}.ts`).then((m: { default: LevelContent }) => m.default)

export const fyzika: Course = {
  id: 'fyzika',
  title: 'Fyzika',
  tagline: 'Od měření a sil přes elektřinu a světlo až po atom a vesmír.',
  color: '#3f6699',
  icon: 'pendulum',
  available: true,
  album: { kind: 'emblems', title: 'Sbírka jednotek a konstant' },
  levels: [
    {
      id: 'l1', number: 1, title: 'Měření a látky', subtitle: 'Veličiny, jednotky, hustota, částice a teplota',
      stage: 'ZŠ 6. třída · IGCSE 1', color: '#8a5a2b', symbol: 'm', emblemName: 'metr', load: load(1),
      lessons: [
        { id: 'f1-1', icon: 'magnifier', title: 'Co je fyzika a jak se měří', minutes: 14 },
        { id: 'f1-2', icon: 'ruler', title: 'Veličiny, jednotky a převody', minutes: 16 },
        { id: 'f1-3', icon: 'stopwatch', title: 'Měření délky, objemu a času', minutes: 15 },
        { id: 'f1-4', icon: 'balance-scale', title: 'Hmotnost a hustota', minutes: 16 },
        { id: 'f1-5', icon: 'molecule', title: 'Částicová stavba látek', minutes: 14 },
        { id: 'f1-6', icon: 'thermometer', title: 'Teplota a teplotní roztažnost', minutes: 15 },
        { id: 'f1-7', icon: 'magnet', title: 'Elektrický náboj a magnety', minutes: 15 },
      ],
    },
    {
      id: 'l2', number: 2, title: 'Pohyb a síly', subtitle: 'Rychlost, grafy pohybu, síly, Newtonovy zákony a páka',
      stage: 'ZŠ 7. třída', color: '#b8483a', symbol: 'N', emblemName: 'newton', load: load(2),
      lessons: [
        { id: 'f2-1', icon: 'speed', title: 'Pohyb a jeho popis', minutes: 15 },
        { id: 'f2-2', icon: 'chart', title: 'Grafy pohybu', minutes: 16 },
        { id: 'f2-3', icon: 'weight', title: 'Síla a její měření', minutes: 15 },
        { id: 'f2-4', icon: 'vector', title: 'Skládání sil a rovnováha', minutes: 15 },
        { id: 'f2-5', icon: 'rocket', title: 'Newtonovy pohybové zákony', minutes: 16 },
        { id: 'f2-6', icon: 'car', title: 'Tření a odporové síly', minutes: 14 },
        { id: 'f2-7', icon: 'lever', title: 'Otáčivé účinky síly: páka a kladka', minutes: 16 },
      ],
    },
    {
      id: 'l3', number: 3, title: 'Tlak a tekutiny, práce a energie', subtitle: 'Tlak, vztlak, atmosféra, práce, výkon a energie',
      stage: 'ZŠ 7.–8. třída', color: '#2c7a72', symbol: 'Pa', emblemName: 'pascal', load: load(3),
      lessons: [
        { id: 'f3-1', icon: 'gauge', title: 'Tlak a tlaková síla', minutes: 16 },
        { id: 'f3-2', icon: 'ship', title: 'Vztlak a Archimédův zákon', minutes: 16 },
        { id: 'f3-3', icon: 'balloon', title: 'Atmosférický tlak a plyny', minutes: 14 },
        { id: 'f3-4', icon: 'factory', title: 'Práce a výkon', minutes: 15 },
        { id: 'f3-5', icon: 'pendulum', title: 'Mechanická energie', minutes: 16 },
        { id: 'f3-6', icon: 'bread', title: 'Zdroje energie kolem nás', minutes: 14 },
      ],
    },
    {
      id: 'l4', number: 4, title: 'Teplo a zvuk', subtitle: 'Vnitřní energie, šíření tepla, skupenství, motory a zvuk',
      stage: 'ZŠ 8. třída', color: '#bd6a26', symbol: 'J', emblemName: 'joule', load: load(4),
      lessons: [
        { id: 'f4-1', icon: 'heat', title: 'Vnitřní energie a teplo', minutes: 16 },
        { id: 'f4-2', icon: 'flame', title: 'Šíření tepla', minutes: 14 },
        { id: 'f4-3', icon: 'ice', title: 'Změny skupenství', minutes: 16 },
        { id: 'f4-4', icon: 'fuel', title: 'Tepelné motory', minutes: 15 },
        { id: 'f4-5', icon: 'sound', title: 'Zvuk a jeho šíření', minutes: 15 },
        { id: 'f4-6', icon: 'ear', title: 'Vlastnosti zvuku a hluk', minutes: 15 },
      ],
    },
    {
      id: 'l5', number: 5, title: 'Světlo', subtitle: 'Šíření, odraz a lom světla, čočky, oko a barvy',
      stage: 'ZŠ 8. třída', color: '#9c7a12', symbol: 'c', emblemName: 'rychlost světla', load: load(5),
      lessons: [
        { id: 'f5-1', icon: 'sun', title: 'Světlo a jeho šíření', minutes: 15 },
        { id: 'f5-2', icon: 'mirror', title: 'Odraz světla a zrcadla', minutes: 15 },
        { id: 'f5-3', icon: 'drop', title: 'Lom světla', minutes: 15 },
        { id: 'f5-4', icon: 'lens', title: 'Čočky a zobrazení', minutes: 16 },
        { id: 'f5-5', icon: 'eye', title: 'Oko a optické přístroje', minutes: 16 },
        { id: 'f5-6', icon: 'rainbow', title: 'Barvy a spektrum', minutes: 14 },
      ],
    },
    {
      id: 'l6', number: 6, title: 'Elektřina', subtitle: 'Náboj, obvod, proud, napětí, odpor, výkon a elektronika',
      stage: 'ZŠ 8.–9. třída', color: '#3f6699', symbol: 'Ω', emblemName: 'ohm', load: load(6),
      lessons: [
        { id: 'f6-1', icon: 'lightning', title: 'Elektrický náboj a elektrické pole', minutes: 15 },
        { id: 'f6-2', icon: 'battery', title: 'Elektrický obvod, proud a napětí', minutes: 16 },
        { id: 'f6-3', icon: 'bulb', title: 'Elektrický odpor a Ohmův zákon', minutes: 16 },
        { id: 'f6-4', icon: 'plug', title: 'Zapojení rezistorů', minutes: 16 },
        { id: 'f6-5', icon: 'socket', title: 'Elektrická práce, výkon a bezpečnost', minutes: 16 },
        { id: 'f6-6', icon: 'phone', title: 'Polovodiče a elektronika', minutes: 15 },
      ],
    },
    {
      id: 'l7', number: 7, title: 'Magnetismus, energetika a vesmír', subtitle: 'Elektromagnety, motory, indukce, elektrárny, jádro a vesmír',
      stage: 'ZŠ 9. třída · IGCSE', color: '#555a9e', symbol: 'T', emblemName: 'tesla', load: load(7),
      lessons: [
        { id: 'f7-1', icon: 'coil', title: 'Magnetické pole elektrického proudu', minutes: 15 },
        { id: 'f7-2', icon: 'motor', title: 'Elektromotor', minutes: 15 },
        { id: 'f7-3', icon: 'compass', title: 'Elektromagnetická indukce', minutes: 16 },
        { id: 'f7-4', icon: 'plug', title: 'Střídavý proud a transformátor', minutes: 16 },
        { id: 'f7-5', icon: 'wind-turbine', title: 'Elektrárny a energetika', minutes: 16 },
        { id: 'f7-6', icon: 'radiation', title: 'Atom, radioaktivita a jaderná energie', minutes: 17 },
        { id: 'f7-7', icon: 'planet', title: 'Sluneční soustava a vesmír', minutes: 16 },
      ],
    },
    {
      id: 'l8', number: 8, title: 'Kinematika a dynamika', subtitle: 'Vektory, nejistoty, zrychlený pohyb, vrhy, kruh, síly, hybnost a energie',
      stage: 'Gymnázium 1 · A-level / AP', color: '#56834a', symbol: 'g', emblemName: 'tíhové zrychlení', load: load(8),
      lessons: [
        { id: 'f8-1', icon: 'vector', title: 'Veličiny, vektory a nejistoty', minutes: 17 },
        { id: 'f8-2', icon: 'speed', title: 'Rovnoměrně zrychlený pohyb', minutes: 18 },
        { id: 'f8-3', icon: 'apple', title: 'Volný pád a vrhy', minutes: 18 },
        { id: 'f8-4', icon: 'orbit', title: 'Pohyb po kružnici', minutes: 16 },
        { id: 'f8-5', icon: 'weight', title: 'Newtonovy zákony v praxi', minutes: 18 },
        { id: 'f8-6', icon: 'car', title: 'Hybnost a srážky', minutes: 17 },
        { id: 'f8-7', icon: 'lightning', title: 'Práce, energie a výkon kvantitativně', minutes: 17 },
      ],
    },
    {
      id: 'l9', number: 9, title: 'Gravitace, rotace, kmity a vlny', subtitle: 'Gravitační pole, družice, tuhé těleso, kmitání, vlnění a akustika',
      stage: 'Gymnázium 1–2 · A-level / AP', color: '#7a5290', symbol: 'G', emblemName: 'gravitační konstanta', load: load(9),
      lessons: [
        { id: 'f9-1', icon: 'earth', title: 'Gravitační pole', minutes: 17 },
        { id: 'f9-2', icon: 'satellite', title: 'Keplerovy zákony a družice', minutes: 16 },
        { id: 'f9-3', icon: 'balance-scale', title: 'Tuhé těleso a rovnováha', minutes: 16 },
        { id: 'f9-4', icon: 'arrow-cycle', title: 'Otáčivý pohyb', minutes: 17 },
        { id: 'f9-5', icon: 'spring', title: 'Mechanické kmitání', minutes: 18 },
        { id: 'f9-6', icon: 'wave', title: 'Mechanické vlnění', minutes: 17 },
        { id: 'f9-7', icon: 'music', title: 'Akustika', minutes: 16 },
      ],
    },
    {
      id: 'l10', number: 10, title: 'Molekulová fyzika a termodynamika', subtitle: 'Kinetická teorie, ideální plyn, zákony termodynamiky a skupenství',
      stage: 'Gymnázium 2 · A-level', color: '#a84d6c', symbol: 'K', emblemName: 'kelvin', load: load(10),
      lessons: [
        { id: 'f10-1', icon: 'gas-cloud', title: 'Kinetická teorie látek', minutes: 16 },
        { id: 'f10-2', icon: 'thermometer', title: 'Vnitřní energie, teplo a kalorimetrie', minutes: 17 },
        { id: 'f10-3', icon: 'balloon', title: 'Ideální plyn', minutes: 18 },
        { id: 'f10-4', icon: 'heat', title: 'První termodynamický zákon', minutes: 17 },
        { id: 'f10-5', icon: 'factory', title: 'Tepelné stroje a druhý zákon', minutes: 17 },
        { id: 'f10-6', icon: 'crystal', title: 'Pevné látky a kapaliny', minutes: 17 },
        { id: 'f10-7', icon: 'cloud', title: 'Změny skupenství a fázový diagram', minutes: 16 },
      ],
    },
    {
      id: 'l11', number: 11, title: 'Elektřina a magnetismus', subtitle: 'Pole, kondenzátory, obvody, polovodiče, magnetické síly, indukce a střídavý proud',
      stage: 'Gymnázium 3 · A-level / AP', color: '#1f6f8b', symbol: 'e', emblemName: 'elementární náboj', load: load(11),
      lessons: [
        { id: 'f11-1', icon: 'lightning', title: 'Elektrické pole', minutes: 17 },
        { id: 'f11-2', icon: 'battery', title: 'Kondenzátor a kapacita', minutes: 16 },
        { id: 'f11-3', icon: 'plug', title: 'Obvody stejnosměrného proudu', minutes: 18 },
        { id: 'f11-4', icon: 'solar-panel', title: 'Proud v polovodičích, kapalinách a plynech', minutes: 17 },
        { id: 'f11-5', icon: 'magnet', title: 'Magnetické pole a magnetické síly', minutes: 18 },
        { id: 'f11-6', icon: 'coil', title: 'Elektromagnetická indukce', minutes: 17 },
        { id: 'f11-7', icon: 'satellite', title: 'Střídavý proud a elektromagnetické vlny', minutes: 18 },
      ],
    },
    {
      id: 'l12', number: 12, title: 'Optika a moderní fyzika', subtitle: 'Vlnová optika, relativita, fotony, atom, jádro, částice a vesmír',
      stage: 'Gymnázium 4 · maturita', color: '#8b3a62', symbol: 'h', emblemName: 'Planckova konstanta', load: load(12),
      lessons: [
        { id: 'f12-1', icon: 'rainbow', title: 'Vlnová optika', minutes: 17 },
        { id: 'f12-2', icon: 'lens', title: 'Zobrazování zrcadly a čočkami', minutes: 17 },
        { id: 'f12-3', icon: 'clock', title: 'Speciální teorie relativity', minutes: 18 },
        { id: 'f12-4', icon: 'laser', title: 'Fotony a vlnově-částicová dualita', minutes: 17 },
        { id: 'f12-5', icon: 'atom', title: 'Atom a jeho spektra', minutes: 17 },
        { id: 'f12-6', icon: 'radiation', title: 'Atomové jádro a radioaktivita', minutes: 18 },
        { id: 'f12-7', icon: 'galaxy', title: 'Částice a vesmír', minutes: 18 },
      ],
    },
  ],
}
