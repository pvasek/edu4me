import type { ReactNode } from "react";
import { Figure, Pop, f1, useCompact } from "./kit";

const LABEL =
  "Homologické přední končetiny pěti obratlovců: člověka, kočky, velryby, netopýra a ptáka. Funkce se liší – úchop, chůze, plavání, let s blánou a let s peřím –, ale stavební plán je stejný a stejné kosti mají stejnou barvu: jedna kost pažní, dvě kosti předloktí (vřetenní a loketní), zápěstní kůstky a záprstí s prsty. Velryba má prsty s mnoha články navíc, netopýr extrémně prodloužené prsty napínající blánu a pták srostlé a zakrnělé kosti ruky.";

type G = "h" | "ru" | "c" | "d";
interface Bone {
  a: [number, number];
  b: [number, number];
  w: number;
  g: G;
}
interface Carpal {
  c: [number, number];
  r: number;
}

const bone = (a: [number, number], b: [number, number], w: number, g: G): Bone => ({ a, b, w, g });

/** a digit: a chain of bones from (x, y) in direction `ang` (degrees, 90 = down) */
function chain(x: number, y: number, ang: number, lens: number[], w: number): Bone[] {
  const r = (ang * Math.PI) / 180;
  const ux = Math.cos(r);
  const uy = Math.sin(r);
  const out: Bone[] = [];
  let px = x;
  let py = y;
  lens.forEach((l, i) => {
    const ww = w * (1 - i * 0.1);
    const qx = px + ux * l;
    const qy = py + uy * l;
    out.push(bone([px, py], [qx, qy], Math.max(2.4, ww), "d"));
    px = qx + ux * 2.6;
    py = qy + uy * 2.6;
  });
  return out;
}
const tip = (bs: Bone[]) => bs[bs.length - 1].b;

function capsule({ a, b, w }: Bone) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = (-dy / L) * (w / 2);
  const ny = (dx / L) * (w / 2);
  const r = w / 2;
  return `M${f1(a[0] + nx)} ${f1(a[1] + ny)} L${f1(b[0] + nx)} ${f1(b[1] + ny)} A${f1(r)} ${f1(r)} 0 0 0 ${f1(b[0] - nx)} ${f1(b[1] - ny)} L${f1(a[0] - nx)} ${f1(a[1] - ny)} A${f1(r)} ${f1(r)} 0 0 0 ${f1(a[0] + nx)} ${f1(a[1] + ny)}Z`;
}

function Bones({ bones, carpals }: { bones: Bone[]; carpals: Carpal[] }) {
  return (
    <g>
      {bones.map((b, i) => (
        <g key={i} className={`bz8-bone-${b.g}`}>
          {b.w >= 5 && (
            <>
              <circle cx={f1(b.a[0])} cy={f1(b.a[1])} r={f1(b.w * 0.62)} className="bz8-bone" />
              <circle cx={f1(b.b[0])} cy={f1(b.b[1])} r={f1(b.w * 0.62)} className="bz8-bone" />
            </>
          )}
          <path d={capsule(b)} className="bz8-bone" />
        </g>
      ))}
      {carpals.map((c, i) => (
        <circle key={`c${i}`} cx={c.c[0]} cy={c.c[1]} r={c.r} className="bz8-bone bz8-bone-c" />
      ))}
    </g>
  );
}

const cp = (pts: [number, number][], r = 4.2): Carpal[] => pts.map((c) => ({ c, r }));

// ------------------------------------------------------------------ the five limbs (panel 140 × 260)
function Human() {
  const bones = [
    bone([70, 20], [70, 96], 12, "h"),
    bone([63, 106], [58, 168], 7, "ru"),
    bone([77, 102], [81, 168], 7, "ru"),
    ...chain(54, 194, 118, [19, 12, 9], 5),
    ...chain(61, 195, 95, [26, 15, 10, 7], 4.6),
    ...chain(70, 195, 90, [27, 17, 11, 7], 4.8),
    ...chain(79, 195, 86, [25, 16, 10, 7], 4.6),
    ...chain(87, 194, 80, [22, 12, 8, 6], 4.2),
  ];
  const carpals = cp([
    [56, 176], [64, 175], [72, 175], [80, 176],
    [58, 185], [66, 184], [74, 184], [82, 185],
  ]);
  return <Bones bones={bones} carpals={carpals} />;
}

function Cat() {
  const bones = [
    bone([56, 22], [78, 90], 11, "h"),
    bone([90, 82], [82, 180], 7, "ru"),
    bone([76, 98], [72, 180], 7, "ru"),
    ...chain(62, 198, 122, [10, 7], 4),
    ...chain(67, 204, 96, [24, 9, 7, 6], 4.4),
    ...chain(74, 204, 92, [26, 9, 7, 6], 4.6),
    ...chain(81, 204, 88, [26, 9, 7, 6], 4.6),
    ...chain(88, 204, 84, [24, 9, 7, 6], 4.4),
  ];
  const carpals = cp([
    [67, 188], [75, 187], [83, 188],
    [70, 196], [79, 196], [87, 196],
  ], 4);
  return <Bones bones={bones} carpals={carpals} />;
}

function Whale() {
  const outline =
    "M48 12 C30 60 32 120 38 170 C42 214 60 252 72 264 C86 244 106 194 106 150 C106 100 98 50 90 12Z";
  const bones = [
    bone([70, 26], [70, 60], 20, "h"),
    bone([61, 70], [57, 108], 12, "ru"),
    bone([80, 70], [84, 108], 11, "ru"),
    ...chain(49, 140, 104, [12, 9], 5),
    ...chain(57, 140, 95, [15, 12, 11, 10, 9, 8, 7], 5.6),
    ...chain(67, 140, 91, [15, 13, 12, 11, 10, 9, 8], 5.6),
    ...chain(78, 140, 87, [14, 12, 11, 10, 9], 5.2),
    ...chain(89, 140, 82, [12, 10, 8], 4.6),
  ];
  const carpals = cp([
    [53, 120], [63, 119], [73, 119], [83, 120],
    [57, 130], [67, 130], [77, 130], [87, 131],
  ], 4.8);
  return (
    <g>
      <path d={outline} className="bz8-flipper bz8-o bz8-thin" />
      <Bones bones={bones} carpals={carpals} />
    </g>
  );
}

function Bat() {
  const d2 = chain(72, 166, 96, [46, 24, 14], 3.4);
  const d3 = chain(73, 166, 76, [48, 28, 16], 3.4);
  const d4 = chain(74, 165, 53, [44, 22, 12], 3.2);
  const d5 = chain(74, 164, 33, [36, 16, 8], 3);
  const t2 = tip(d2);
  const t3 = tip(d3);
  const t4 = tip(d4);
  const t5 = tip(d5);
  const membrane = `M66 158 L${f1(t2[0])} ${f1(t2[1])} Q86 236 ${f1(t3[0])} ${f1(t3[1])} Q108 226 ${f1(t4[0])} ${f1(t4[1])} Q114 206 ${f1(t5[0])} ${f1(t5[1])} Q78 196 22 214 L28 30 Q36 18 44 20Z`;
  const bones = [
    bone([42, 22], [62, 72], 8, "h"),
    bone([63, 80], [69, 154], 5.5, "ru"),
    bone([58, 82], [62, 112], 3, "ru"),
    ...chain(65, 166, 122, [9, 7], 3.4),
    ...d2,
    ...d3,
    ...d4,
    ...d5,
  ];
  const carpals = cp([[67, 159], [74, 160]], 3.8);
  return (
    <g>
      <path d={membrane} className="bz8-membrane-w bz8-o bz8-thin" />
      <Bones bones={bones} carpals={carpals} />
    </g>
  );
}

function Bird() {
  const feathers: ReactNode[] = [];
  // primaries on the hand, secondaries on the forearm (faint outline only)
  for (let i = 0; i < 6; i++) {
    const bx = 76;
    const by = 182 + i * 8;
    const tx = 126 - i * 2;
    const ty = 196 + i * 13;
    feathers.push(
      <path
        key={`p${i}`}
        d={`M${bx} ${by} Q${f1((bx + tx) / 2 + 6)} ${f1((by + ty) / 2 - 8)} ${tx} ${ty} Q${f1((bx + tx) / 2)} ${f1((by + ty) / 2 + 4)} ${bx} ${by + 4}`}
        className="bz8-feather"
      />,
    );
  }
  for (let i = 0; i < 6; i++) {
    const by = 100 + i * 12;
    feathers.push(
      <path
        key={`s${i}`}
        d={`M80 ${by} Q104 ${by + 6} 124 ${by + 24} Q102 ${by + 14} 80 ${by + 8}`}
        className="bz8-feather"
      />,
    );
  }
  const bones = [
    bone([54, 22], [70, 84], 10, "h"),
    bone([68, 92], [65, 162], 4.5, "ru"),
    bone([78, 90], [79, 162], 7, "ru"),
    bone([70, 178], [72, 216], 6, "d"),
    bone([80, 178], [80, 214], 4, "d"),
    bone([70, 178], [80, 178], 5, "d"),
    bone([72, 216], [80, 214], 4, "d"),
    ...chain(66, 180, 116, [12], 4),
    ...chain(74, 221, 92, [16, 12], 4.6),
    ...chain(81, 219, 84, [9], 3.4),
  ];
  const carpals = cp([[68, 169], [80, 169]], 4);
  return (
    <g>
      <g className="bz8-feathers">{feathers}</g>
      <Bones bones={bones} carpals={carpals} />
    </g>
  );
}

const PANELS = [
  { title: "člověk", job: "úchop", C: Human },
  { title: "kočka", job: "chůze", C: Cat },
  { title: "velryba", job: "plavání", C: Whale },
  { title: "netopýr", job: "let s blánou", C: Bat },
  { title: "pták", job: "let s peřím", C: Bird },
];
const LEGEND: { g: G; t: string }[] = [
  { g: "h", t: "kost pažní" },
  { g: "ru", t: "vřetenní a loketní kost" },
  { g: "c", t: "zápěstí" },
  { g: "d", t: "záprstí a prsty" },
];

const PW = 140;
const PH = 300;

function Plate({ narrow }: { narrow: boolean }) {
  const pos = narrow
    ? [[0, 0], [140, 0], [280, 0], [70, PH], [210, PH]]
    : [[0, 0], [140, 0], [280, 0], [420, 0], [560, 0]];
  const ly = narrow ? 2 * PH + 8 : PH + 8;
  const leg = narrow
    ? [[16, ly + 14], [210, ly + 14], [16, ly + 44], [210, ly + 44]]
    : [[24, ly + 14], [178, ly + 14], [400, ly + 14], [524, ly + 14]];
  return (
    <>
      {PANELS.map(({ title, job, C }, i) => (
        <g key={title} transform={`translate(${pos[i][0]} ${pos[i][1]})`}>
          <text x={PW / 2} y={20} textAnchor="middle" className="bz8-lbl bz8-b bz8-big">
            {title}
          </text>
          <text x={PW / 2} y={40} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
            {job}
          </text>
          <Pop delay={0.1 + i * 0.15}>
            <g transform="translate(7 48) scale(0.9)">
              <C />
            </g>
          </Pop>
        </g>
      ))}
      {LEGEND.map(({ g, t }, i) => (
        <g key={g} transform={`translate(${leg[i][0]} ${leg[i][1]})`}>
          <rect x={0} y={-11} width={22} height={13} rx={4} className={`bz8-bone bz8-bone-${g}`} />
          <text x={30} y={0} className="bz8-lbl bz8-sm bz8-leg">
            {t}
          </text>
        </g>
      ))}
    </>
  );
}

export default function PentadactylLimb() {
  const compact = useCompact(520);
  const narrow = compact.narrow;
  return (
    <Figure
      level={12}
      label={LABEL}
      w={narrow ? 420 : 700}
      h={narrow ? 2 * PH + 66 : PH + 34}
      max={760}
      compact={compact}
      boost={false}
      replay
    >
      <Plate narrow={narrow} />
    </Figure>
  );
}
