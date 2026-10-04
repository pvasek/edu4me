import type { ReactNode } from "react";
import { DrawArrow, Figure, Fade, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Umělý výběr: z jediného planého druhu, brukve zelné rostoucí na přímořských útesech, vyšlechtili lidé během staletí řadu zelenin tím, že vždy množili rostliny s nejvýraznější žádanou částí. Kapusta kadeřavá vznikla výběrem na velké listy, hlávkové zelí na mohutný vrcholový pupen, růžičková kapusta na postranní pupeny, kedluben na ztlustlý stonek, brokolice na květní poupata a stonky a květák na zbytnělé květenství.";

const W = 420;
const H = 482;
const CX = 210;
const CY = 240;

const GLAUC = "#86a98f";
const GREEN = "#6f9a52";
const PALE = "#b9cf8a";

/** One leaf blade with a midrib, pointing up from (0,0), rotated by `rot`. */
function Leaf({
  rot = 0,
  len = 40,
  wid = 14,
  fill = GLAUC,
  wavy = false,
  x = 0,
  y = 0,
}: {
  rot?: number;
  len?: number;
  wid?: number;
  fill?: string;
  wavy?: boolean;
  x?: number;
  y?: number;
}) {
  const { id } = useFig();
  let d: string;
  if (wavy) {
    // ruffled edge: many small bumps
    const pts: string[] = [];
    const n = 9;
    for (let side of [-1, 1]) {
      const arr: string[] = [];
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const w = Math.sin(Math.PI * Math.min(1, t * 1.08)) * wid * (i % 2 ? 1.15 : 0.8);
        arr.push(`${f1(side * w)} ${f1(-t * len)}`);
      }
      if (side === 1) arr.reverse();
      pts.push(...arr);
    }
    d = "M" + pts.join(" L") + "Z";
  } else {
    d = `M0 0 C${-wid} ${-len * 0.25} ${-wid * 0.9} ${-len * 0.8} 0 ${-len} C${wid * 0.9} ${-len * 0.8} ${wid} ${-len * 0.25} 0 0Z`;
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill={fill} className="bz3-o bz3-thin" strokeLinejoin="round" />
      <path d={d} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M0 0 L0 ${-len * 0.9}`} className="bz3-midrib" />
    </g>
  );
}

function WildCabbage() {
  return (
    <g>
      {/* flowering stalk */}
      <path d="M0 0 C2 -30 -2 -60 2 -86" className="bz3-stem" />
      {[
        [2, -88],
        [-8, -80],
        [10, -76],
        [-9, -66],
        [11, -62],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x > 0 ? x - 6 : x + 6} ${y + 8} L${x} ${y}`} className="bz3-stem bz3-stem-thin" />
          {[0, 90, 180, 270].map((a) => (
            <ellipse
              key={a}
              cx={x}
              cy={y - 3.2}
              rx={2.2}
              ry={3.4}
              transform={`rotate(${a} ${x} ${y})`}
              className="bz3-flower-y"
            />
          ))}
        </g>
      ))}
      {/* loose rosette */}
      {[-70, -45, -20, 20, 45, 70].map((r, i) => (
        <Leaf key={r} rot={r} len={i % 2 ? 40 : 34} wid={13} />
      ))}
    </g>
  );
}

function Kale() {
  return (
    <g>
      <path d="M0 28 V8" className="bz3-stem" />
      {[-50, -25, 0, 25, 50].map((r) => (
        <Leaf key={r} y={18} rot={r} len={46} wid={12} fill={GREEN} wavy />
      ))}
    </g>
  );
}

function Cabbage() {
  const { id } = useFig();
  return (
    <g>
      <Leaf y={26} rot={-62} len={34} wid={14} />
      <Leaf y={26} rot={62} len={34} wid={14} />
      <circle cx={0} cy={2} r={26} fill={PALE} className="bz3-o" />
      <circle cx={0} cy={2} r={26} fill={pat(id, "d")} opacity={0.35} />
      <path d="M-24 -6 C-10 -18 10 -22 24 -8 M-25 8 C-12 -6 14 -10 25 6 M-20 20 C-6 8 12 6 20 20 M-2 -24 C6 -10 4 10 -4 27" className="bz3-o bz3-thin" />
    </g>
  );
}

function Sprouts() {
  return (
    <g>
      <path d="M0 34 V-30" className="bz3-stem bz3-stem-thick" />
      {[-34, -21, -8, 5, 18].map((y, i) =>
        [-1, 1].map((s) => (
          <g key={`${y}${s}`}>
            <circle cx={s * (8 + (i % 2) * 2)} cy={y + (s > 0 ? 6 : 0)} r={6} fill={GREEN} className="bz3-o bz3-thin" />
            <path d={`M${s * (5 + (i % 2) * 2)} ${y + (s > 0 ? 3 : -3)} q${s * 3} 4 ${s * 6} 2`} className="bz3-o bz3-thin" />
          </g>
        )),
      )}
      <Leaf y={-30} rot={-30} len={22} wid={9} />
      <Leaf y={-30} rot={30} len={22} wid={9} />
    </g>
  );
}

function Kohlrabi() {
  const { id } = useFig();
  return (
    <g>
      {[-50, -18, 18, 50].map((r, i) => (
        <g key={r}>
          <path
            d={`M${r * 0.3} ${-6 + (i % 3 ? 0 : 8)} Q${r * 0.5} -18 ${r * 0.62} -24`}
            className="bz3-stem bz3-stem-thin"
          />
          <Leaf x={r * 0.62} y={-24} rot={r * 0.9} len={26} wid={11} wavy />
        </g>
      ))}
      <ellipse cx={0} cy={10} rx={24} ry={21} fill={PALE} className="bz3-o" />
      <ellipse cx={0} cy={10} rx={24} ry={21} fill={pat(id, "d")} opacity={0.35} />
      <path d="M-10 4 l-3 -4 M8 0 l3 -4 M-4 18 l-2 -4" className="bz3-o bz3-thin" />
      <path d="M0 31 V38" className="bz3-stem" />
    </g>
  );
}

function Florets({ white }: { white: boolean }) {
  const { id } = useFig();
  const fill = white ? "#f1ead2" : "#4f7f3e";
  const buds = [
    [0, -20, 12],
    [-15, -13, 10],
    [15, -13, 10],
    [-24, 0, 9],
    [24, 0, 9],
    [-8, -4, 11],
    [9, -5, 11],
  ];
  return (
    <g>
      {!white && <path d="M0 34 V4 M0 18 L-14 2 M0 18 L14 2 M0 10 L-6 -6 M0 10 L7 -6" className="bz3-stem bz3-stem-thick" />}
      {white && (
        <>
          <Leaf y={30} rot={-55} len={38} wid={13} fill={GREEN} />
          <Leaf y={30} rot={55} len={38} wid={13} fill={GREEN} />
          <Leaf y={30} rot={-20} len={30} wid={12} fill={GREEN} />
          <Leaf y={30} rot={20} len={30} wid={12} fill={GREEN} />
        </>
      )}
      {buds.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y + (white ? 10 : 0)} r={r} fill={fill} className="bz3-o bz3-thin" />
          <circle cx={x} cy={y + (white ? 10 : 0)} r={r} fill={pat(id, "dots")} opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

const KINDS: { x: number; y: number; name: string; part: string; art: ReactNode }[] = [
  { x: 70, y: 92, name: "kapusta kadeřavá", part: "listy", art: <Kale /> },
  { x: 350, y: 92, name: "hlávkové zelí", part: "vrcholový pupen", art: <Cabbage /> },
  { x: 70, y: 248, name: "růžičková kapusta", part: "postranní pupeny", art: <Sprouts /> },
  { x: 350, y: 248, name: "kedluben", part: "stonek", art: <Kohlrabi /> },
  { x: 70, y: 404, name: "brokolice", part: "poupata a stonky", art: <Florets white={false} /> },
  { x: 350, y: 404, name: "květák", part: "květenství", art: <Florets white /> },
];

export default function ArtificialSelection() {
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={560} replay>
      <Fade>
        <text x={210} y={26} textAnchor="middle" className="bz3-lbl bz3-b bz3-lvl-t">
          umělý výběr
        </text>
        <text x={210} y={46} textAnchor="middle" className="bz3-lbl bz3-sm">
          člověk množí rostliny
        </text>
        <text x={210} y={64} textAnchor="middle" className="bz3-lbl bz3-sm">
          s žádanou vlastností
        </text>
      </Fade>
      <Pop>
        <g transform={`translate(${CX} ${CY + 30})`}>
          <WildCabbage />
        </g>
      </Pop>
      <Fade delay={0.2}>
        <text x={CX} y={CY + 56} textAnchor="middle" className="bz3-lbl bz3-b">
          brukev zelná
        </text>
        <text x={CX} y={CY + 74} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          planý předek
        </text>
        <text x={CX} y={CY + 92} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          z mořských útesů
        </text>
      </Fade>
      {KINDS.map((k, i) => {
        const ax = k.x < CX ? CX - 48 : CX + 48;
        const ay = k.y < 150 ? CY - 50 : k.y > 300 ? CY + 40 : CY - 4;
        const bx = k.x < CX ? k.x + 50 : k.x - 50;
        const by = k.y < 150 ? k.y + 10 : k.y > 300 ? k.y - 20 : k.y;
        return (
          <DrawArrow
            key={k.name}
            d={`M${ax} ${ay} L${bx} ${by}`}
            tone="lvl"
            delay={0.4 + i * 0.08}
          />
        );
      })}
      {KINDS.map((k, i) => (
        <Pop key={k.name} delay={0.8 + i * 0.12}>
          <g transform={`translate(${k.x} ${k.y - 4})`}>{k.art}</g>
          <text x={k.x} y={k.y + 52} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
            {k.name}
          </text>
          <text x={k.x} y={k.y + 70} textAnchor="middle" className="bz3-lbl bz3-sm bz3-lvl-t">
            {k.part}
          </text>
        </Pop>
      ))}
    </Figure>
  );
}
