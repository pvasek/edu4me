import type { ReactNode } from "react";
import { Draw, Fade, Figure, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Žebřík velikostí od jednoho metru po deset nanometrů, každý dílek je desetkrát menší než ten nad ním. Okem vidíme člověka (1,7 m), ruku (18 cm) a mravence (5 mm). Trepku velkou (0,25 mm) a lidské vajíčko (0,12 mm) vidí oko jen jako tečku, podrobnosti ukáže lupa. Šířku vlasu (70 µm), buňku z líce (60 µm), červenou krvinku (7 µm) a bakterii (2 µm) ukáže světelný mikroskop. Virus (0,1 µm) je pod jeho hranicí asi 0,2 µm a uvidí ho jen elektronový mikroskop.";

const W = 360;
const H = 590;
const AX = 104; // the axis
const TOP = 62; // y of 1 m
const DEC = 62; // px per power of ten
/** y on the ladder of a length in metres */
const yOf = (m: number) => TOP - Math.log10(m) * DEC;

const TICKS = [
  "1 m",
  "10 cm",
  "1 cm",
  "1 mm",
  "0,1 mm",
  "10 µm",
  "1 µm",
  "0,1 µm",
  "10 nm",
];

/** what you need to see it: bands across the plate */
const ZONES: { from: number; to: number; text: string; cls: string }[] = [
  { from: 3, to: 1e-3, text: "okem", cls: "bz5-zone-a" },
  { from: 1e-3, to: 1e-4, text: "lupou", cls: "bz5-zone-b" },
  { from: 1e-4, to: 2e-7, text: "světelným\nmikroskopem", cls: "bz5-zone-a" },
  {
    from: 2e-7,
    to: 6e-9,
    text: "elektronovým\nmikroskopem",
    cls: "bz5-zone-b",
  },
];

interface Item {
  m: number;
  /** y of the row (nudged so rows do not overlap) */
  row: number;
  name: string;
  size: string;
  icon: ReactNode;
}

function Person() {
  return (
    <g className="bz5-o bz5-fill2">
      <circle cx={0} cy={-15} r={4} />
      <path d="M-5 -10 Q0 -12 5 -10 L6 2 L4 2 L3 -4 L2.5 14 H0.6 L0 2 L-0.6 14 H-2.5 L-3 -4 L-4 2 L-6 2 Z" />
    </g>
  );
}
function Hand() {
  return (
    <path
      d="M-6 14 L-8 2 Q-11 -4 -13 -7 Q-12 -10 -9 -7 L-6 -3 L-6 -14 Q-4.5 -16 -3 -14 L-3 -5 L-2.5 -17 Q-1 -19 0.5 -17 L0.5 -5 L1.5 -15 Q3 -17 4.5 -15 L4 -4 L5 -11 Q6.5 -13 8 -11 L7.5 2 Q7 10 5 14 Z"
      className="bz5-o bz5-skin"
    />
  );
}
function Ant() {
  return (
    <g>
      <path
        d="M-9 -2 L-13 -8 M-9 2 L-14 6 M-3 -2 L-4 -9 M-3 2 L-5 9 M1 -2 L5 -9 M1 2 L6 9 M10 -2 L14 -7 M10 2 L15 -6"
        className="bz5-o bz5-thin"
        transform="translate(0 0)"
      />
      <ellipse cx={-10} cy={0} rx={7} ry={4.4} className="bz5-o bz5-ant" />
      <ellipse cx={-1} cy={0} rx={4} ry={2.4} className="bz5-o bz5-ant" />
      <circle cx={6} cy={0} r={3.4} className="bz5-o bz5-ant" />
      <path
        d="M8 -2 Q12 -6 15 -4 M8 -1 Q13 -3 15 0"
        className="bz5-o bz5-thin"
      />
    </g>
  );
}
function Paramecium() {
  // slipper-shaped, covered with cilia, with an oral groove
  const body =
    "M-17 2 C-17 -7 -6 -9 4 -8 C14 -7 18 -3 17 2 C16 7 8 8 0 6 C-6 5 -10 9 -14 7 C-17 6 -17 4 -17 2 Z";
  const cilia = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const x = Math.cos(a) * 17.5;
    const y = Math.sin(a) * 8.4;
    return `M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * 3)} ${f1(Math.sin(a) * 3)}`;
  }).join(" ");
  return (
    <g>
      <path d={cilia} className="bz5-o bz5-thin" />
      <path d={body} className="bz5-o bz5-cyto" />
      <path d="M-2 6 Q2 0 8 -1" className="bz5-o bz5-thin" />
      <ellipse
        cx={-4}
        cy={-1}
        rx={4}
        ry={2.6}
        className="bz5-o bz5-thin bz5-nuc"
      />
      <circle cx={-12} cy={1} r={1.8} className="bz5-o bz5-thin bz5-blood-in" />
    </g>
  );
}
function Egg() {
  const dots = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return (
      <circle
        key={i}
        cx={f1(Math.cos(a) * 15.5)}
        cy={f1(Math.sin(a) * 15.5)}
        r={2}
        className="bz5-o bz5-thin bz5-cyto"
      />
    );
  });
  return (
    <g>
      {dots}
      <circle r={12.5} className="bz5-o bz5-lvl-fill" />
      <circle r={10.5} className="bz5-o bz5-thin bz5-cyto" />
      <circle cx={2} cy={-1} r={3.6} className="bz5-o bz5-thin bz5-nuc" />
    </g>
  );
}
function Hair() {
  const { id } = useFig();
  return (
    <g>
      <path
        d="M-16 -8 Q0 -14 16 -6 L16 4 Q0 -4 -16 2 Z"
        className="bz5-o bz5-hair"
      />
      <path
        d="M-16 -8 Q0 -14 16 -6 L16 4 Q0 -4 -16 2 Z"
        fill={pat(id, "v")}
        opacity={0.6}
      />
      <path
        d="M-8 -12 v12 M8 -11 v12"
        className="bz5-o bz5-thin"
        style={{ opacity: 0.5 }}
      />
    </g>
  );
}
function Cheek() {
  return (
    <g>
      <path
        d="M-15 -6 L-6 -14 L8 -12 L16 -2 L12 11 L-2 14 L-14 7 Z"
        className="bz5-o bz5-cyto"
      />
      <circle cx={0} cy={0} r={3.6} className="bz5-o bz5-thin bz5-nuc" />
    </g>
  );
}
function RedCell() {
  return (
    <g>
      <ellipse rx={14} ry={10} className="bz5-o bz5-blood" />
      <ellipse rx={7} ry={4.6} className="bz5-o bz5-thin bz5-blood-in" />
    </g>
  );
}
function Bacterium() {
  return (
    <g>
      <path d="M13 0 q4 -4 8 0 t6 2" className="bz5-o bz5-thin" />
      <rect
        x={-14}
        y={-6}
        width={28}
        height={12}
        rx={6}
        className="bz5-o bz5-bact"
      />
      <path
        d="M-6 0 q3 -3 6 0 t6 0"
        className="bz5-dna"
        style={{ strokeWidth: 1 }}
      />
    </g>
  );
}
function Virus() {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    return `${f1(Math.cos(a) * 9)} ${f1(Math.sin(a) * 9)}`;
  }).join(" L");
  const spikes = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    return `M${f1(Math.cos(a) * 9)} ${f1(Math.sin(a) * 9)} L${f1(Math.cos(a) * 14)} ${f1(Math.sin(a) * 14)}`;
  }).join(" ");
  return (
    <g>
      <path d={spikes} className="bz5-o bz5-thin" />
      <path d={`M${hex}Z`} className="bz5-o bz5-virus" />
      <path
        d="M0 -9 L0 9 M-7.8 -4.5 L7.8 4.5 M-7.8 4.5 L7.8 -4.5"
        className="bz5-o bz5-thin"
        style={{ opacity: 0.55 }}
      />
    </g>
  );
}

const ITEMS: Item[] = [
  { m: 1.7, row: yOf(1.7), name: "člověk", size: "1,7 m", icon: <Person /> },
  { m: 0.18, row: yOf(0.18), name: "ruka", size: "18 cm", icon: <Hand /> },
  { m: 5e-3, row: yOf(5e-3), name: "mravenec", size: "5 mm", icon: <Ant /> },
  {
    m: 2.5e-4,
    row: 256,
    name: "trepka velká",
    size: "0,25 mm",
    icon: <Paramecium />,
  },
  {
    m: 1.2e-4,
    row: 292,
    name: "lidské vajíčko",
    size: "0,12 mm",
    icon: <Egg />,
  },
  { m: 7e-5, row: 330, name: "šířka vlasu", size: "70 µm", icon: <Hair /> },
  { m: 6e-5, row: 368, name: "buňka z líce", size: "60 µm", icon: <Cheek /> },
  {
    m: 7e-6,
    row: 408,
    name: "červená krvinka",
    size: "7 µm",
    icon: <RedCell />,
  },
  { m: 2e-6, row: 450, name: "bakterie", size: "2 µm", icon: <Bacterium /> },
  { m: 1e-7, row: 512, name: "virus", size: "0,1 µm", icon: <Virus /> },
];

const IX = 202; // icon centre
const TX = 226; // text start
const lines = (t: string) => t.split("\n").length;

export default function SizeScale() {
  const yEnd = yOf(1e-8);
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={460} replay>
      {/* bands: what you need to see it */}
      {ZONES.map((z, i) => {
        const y0 = Math.max(yOf(z.from), 22);
        const y1 = Math.min(yOf(z.to), yEnd + 16);
        return (
          <Fade key={z.text} delay={0.1 + i * 0.12}>
            <rect
              x={2}
              y={y0}
              width={W - 4}
              height={y1 - y0}
              className={z.cls}
            />
            <path
              d={`M${AX + 10} ${f1(y1)} H${W - 2}`}
              className="bz5-o bz5-thin bz5-dash"
              style={{ opacity: 0.5 }}
            />
            <text
              className="bz5-zone-t"
              textAnchor="middle"
              transform={`translate(${lines(z.text) > 1 ? 13 : 19} ${f1((y0 + y1) / 2)}) rotate(-90)`}
            >
              {z.text.split("\n").map((l, k) => (
                <tspan key={k} x={0} dy={k ? 15 : 0}>
                  {l}
                </tspan>
              ))}
            </text>
          </Fade>
        );
      })}
      {/* the ladder */}
      <Draw
        d={`M${AX} ${TOP - 8} V${yEnd + 6}`}
        className="bz5-o"
        style={{ strokeWidth: 2.4 }}
      />
      {TICKS.map((t, i) => {
        const y = TOP + i * DEC;
        return (
          <Fade key={t} delay={0.15 + i * 0.06}>
            <path
              d={`M${AX - 7} ${y} H${AX + 7}`}
              className="bz5-o"
              style={{ strokeWidth: 1.8 }}
            />
            {i < TICKS.length - 1 && (
              <path
                d={`M${AX - 4} ${f1(y + DEC * 0.301)} H${AX + 4} M${AX - 4} ${f1(y + DEC * 0.699)} H${AX + 4}`}
                className="bz5-o bz5-thin"
              />
            )}
            <text x={AX - 12} y={y + 4.5} textAnchor="end" className="bz5-num">
              {t}
            </text>
          </Fade>
        );
      })}
      <Fade delay={0.3}>
        <text x={AX + 10} y={22} className="bz5-lbl bz5-sm bz5-lvl-t">
          každý dílek je 10× menší
        </text>
      </Fade>
      {/* objects: a dot at the exact size, a leader to the row */}
      {ITEMS.map((it, i) => {
        const y = yOf(it.m);
        const d = 0.45 + i * 0.16;
        return (
          <g key={it.name}>
            <Fade delay={d}>
              <circle
                cx={AX}
                cy={y}
                r={3.6}
                className="bz5-lvl-f bz5-o bz5-thin"
              />
              <path
                d={`M${AX + 4} ${f1(y)} C${AX + 40} ${f1(y)} ${IX - 60} ${f1(it.row)} ${IX - 24} ${f1(it.row)}`}
                className="bz5-lead"
              />
            </Fade>
            <Pop delay={d + 0.05}>
              <g transform={`translate(${IX} ${f1(it.row)})`}>{it.icon}</g>
            </Pop>
            <Fade delay={d + 0.1}>
              <text x={TX} y={it.row - 2} className="bz5-lbl bz5-b">
                {it.name}
              </text>
              <text x={TX} y={it.row + 15} className="bz5-eq">
                {it.size}
              </text>
            </Fade>
          </g>
        );
      })}
    </Figure>
  );
}
