/**
 * Vrstevnice – content per level (spec/courses/zemepis/games.md): which task kinds a
 * level plays and how many of each in a round, plus names for the tourist map.
 * The terrain and every answer are generated and computed in logic.ts / terrain.ts.
 */

export type TaskKind =
  | 'on-contour'
  | 'between'
  | 'interval'
  | 'steeper'
  | 'profile'
  | 'landform'
  | 'stream-dir'
  | 'stream-line'
  | 'highest'
  | 'steep-part'
  | 'climb'
  | 'water'

/** Level → the task kinds of one round, in the order they are played (10 tasks). */
export const LEVELS: Record<number, TaskKind[]> = {
  /** z1-4 Mapové značky a výškopis: reading heights, interval, slopes, profile. */
  1: ['interval', 'on-contour', 'between', 'steeper', 'profile', 'on-contour', 'between', 'steeper', 'profile', 'interval'],
  /** z3-3 to z3-5: landforms on contour maps and where rivers flow. */
  3: ['landform', 'landform', 'landform', 'stream-dir', 'landform', 'landform', 'stream-line', 'landform', 'stream-dir', 'stream-line'],
  /** z9-2 Příroda Česka: a tourist map of hilly Czech-like terrain. */
  9: ['highest', 'climb', 'steep-part', 'water', 'climb', 'steep-part', 'highest', 'water', 'climb', 'steep-part'],
}

export type Landform = 'vrchol' | 'hřbet' | 'údolí' | 'sedlo' | 'kotlina' | 'svah'

export const LANDFORMS: Landform[] = ['vrchol', 'hřbet', 'údolí', 'sedlo', 'kotlina', 'svah']

/** One-line explanation of each landform's contour pattern. */
export const LANDFORM_WHY: Record<Landform, string> = {
  vrchol: 'Uzavřené vrstevnice kolem bodu a výška roste dovnitř: je to vrchol.',
  kotlina: 'Uzavřené vrstevnice kolem bodu, ale výška dovnitř klesá (spádovky míří dovnitř): je to kotlina.',
  sedlo: 'Nejnižší místo na hřebeni mezi dvěma vrcholy, vrstevnice tvoří dvě proti sobě obrácené smyčky: je to sedlo.',
  hřbet: 'Vrstevnice se ohýbají do tvaru U, který míří od vrcholu dolů: je to hřbet.',
  údolí: 'Vrstevnice se ohýbají do tvaru V se špičkou proti svahu nahoru: je to údolí.',
  svah: 'Vrstevnice jsou skoro rovnoběžné a výška roste jedním směrem: je to svah.',
}

/** Hill names for the tourist map (common Czech hill names). */
export const HILLS = ['Javorník', 'Kamenec', 'Hradiště', 'Vysoký kámen', 'Liščí vrch', 'Skalka', 'Bukovec', 'Kozí hřbet', 'Strážný vrch', 'Holý vrch']

/** Stream names for the tourist map. */
export const STREAMS = ['Černý potok', 'Bílý potok', 'Studený potok', 'Zlatý potok', 'Medvědí potok', 'Lesní potok', 'Olšový potok', 'Jedlový potok']

/** Locative/genitive forms for "do …" ("do Černého potoka"). */
export const STREAM_INTO: Record<string, string> = {
  'Černý potok': 'do Černého potoka',
  'Bílý potok': 'do Bílého potoka',
  'Studený potok': 'do Studeného potoka',
  'Zlatý potok': 'do Zlatého potoka',
  'Medvědí potok': 'do Medvědího potoka',
  'Lesní potok': 'do Lesního potoka',
  'Olšový potok': 'do Olšového potoka',
  'Jedlový potok': 'do Jedlového potoka',
}

/** One map unit of the tourist map in metres (the map shows a scale bar). */
export const TOURIST_M_PER_UNIT = 10
