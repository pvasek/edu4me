import { useState } from "react";
import {
  DrawArrow,
  Figure,
  Fade,
  Lbl,
  Pop,
  Toggle,
  f1,
  pat,
  useFig,
} from "./kit";

const LABEL =
  "Od DNA k chromozomu a lidský karyotyp. Dlouhá dvoušroubovice DNA se navíjí na bílkovinné cívky – histony – a vytváří nukleozomy jako korálky na niti. Ty se dál stáčejí do chromatinového vlákna a před dělením buňky se vlákno zhustí do chromozomu ze dvou sesterských chromatid spojených centromerou. Pod tím je karyotyp člověka: 46 chromozomů v 23 párech seřazených podle velikosti, 22 párů autozomů a jeden pár pohlavních chromozomů – žena má XX, muž XY.";

const W = 420;
const H = 492;

/** Relative length (Mb) and centromere position (fraction of length from the top = p arm). */
const CHR: Record<string, [number, number]> = {
  "1": [248, 0.49],
  "2": [242, 0.39],
  "3": [198, 0.47],
  "4": [190, 0.27],
  "5": [181, 0.27],
  "6": [171, 0.36],
  "7": [159, 0.37],
  "8": [145, 0.31],
  "9": [138, 0.33],
  "10": [134, 0.3],
  "11": [135, 0.4],
  "12": [133, 0.27],
  "13": [114, 0.15],
  "14": [107, 0.16],
  "15": [102, 0.17],
  "16": [90, 0.41],
  "17": [83, 0.31],
  "18": [80, 0.24],
  "19": [59, 0.45],
  "20": [64, 0.44],
  "21": [47, 0.26],
  "22": [51, 0.28],
  X: [156, 0.39],
  Y: [57, 0.2],
};
const K = 0.27; // px per Mb

/** One metaphase chromosome: two sister chromatids pinched at the centromere, with bands. */
function Chromo({
  x,
  y,
  name,
  w = 4.2,
  sex = false,
}: {
  x: number;
  y: number;
  name: string;
  w?: number;
  sex?: boolean;
}) {
  const [len, ci] = CHR[name];
  const L = len * K;
  const c = y + Math.max(L * ci, w / 2 + 3.8);
  const r = w / 2;
  const chromatid = (cx: number) => {
    const top = y;
    const bot = y + L;
    const p = 3.2; // half-length of the pinch
    return `M${f1(cx - r)} ${f1(top + r)} A${r} ${r} 0 0 1 ${f1(cx + r)} ${f1(top + r)} L${f1(cx + r)} ${f1(c - p)} Q${f1(cx + r * 0.2)} ${f1(c)} ${f1(cx + r)} ${f1(c + p)} L${f1(cx + r)} ${f1(bot - r)} A${r} ${r} 0 0 1 ${f1(cx - r)} ${f1(bot - r)} L${f1(cx - r)} ${f1(c + p)} Q${f1(cx - r * 0.2)} ${f1(c)} ${f1(cx - r)} ${f1(c - p)}Z`;
  };
  // deterministic band pattern from the name
  const seed = name.split("").reduce((s, ch) => s * 31 + ch.charCodeAt(0), 7);
  const bands: number[] = [];
  for (let t = 0.12; t < 0.95; t += 0.11 + ((seed * (t * 100 + 3)) % 7) / 100)
    if (Math.abs(t - ci) > 0.06) bands.push(t);
  return (
    <g>
      {[x - r - 0.3, x + r + 0.3].map((cx, i) => (
        <g key={i}>
          <path
            d={chromatid(cx)}
            className={`bz3-o bz3-thin ${sex ? "bz3-chr-sex" : "bz3-chr"}`}
          />
          {bands.map((t, k) => (
            <line
              key={k}
              x1={cx - r * 0.8}
              x2={cx + r * 0.8}
              y1={y + L * t}
              y2={y + L * t}
              className="bz3-band"
            />
          ))}
        </g>
      ))}
    </g>
  );
}

/** A schematic stretch of the double helix. */
function Helix({ x, y, w, amp = 9 }: { x: number; y: number; w: number; amp?: number }) {
  const s1: string[] = [];
  const s2: string[] = [];
  const rungs: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const px = x + t * w;
    const a = t * Math.PI * 4;
    s1.push(`${f1(px)} ${f1(y - Math.sin(a) * amp)}`);
    s2.push(`${f1(px)} ${f1(y + Math.sin(a) * amp)}`);
    if (i % 4 === 2) rungs.push(`M${f1(px)} ${f1(y - Math.sin(a) * amp)} V${f1(y + Math.sin(a) * amp)}`);
  }
  return (
    <g>
      <path d={rungs.join(" ")} className="bz3-rung" />
      <path d={"M" + s1.join(" L")} className="bz3-strand bz3-strand-a" />
      <path d={"M" + s2.join(" L")} className="bz3-strand bz3-strand-b" />
    </g>
  );
}

function Nucleosomes({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const beads = [0, 1, 2, 3].map((i) => [x + 12 + i * 21, y + (i % 2 ? 7 : -7)] as const);
  const thread =
    `M${x} ${y + 2} ` +
    beads
      .map(([bx, by], i) => `Q${bx - 10} ${by + (i % 2 ? 12 : -12)} ${bx} ${by}`)
      .join(" ") +
    ` Q${x + 92} ${y} ${x + 100} ${y + 3}`;
  return (
    <g>
      <path d={thread} className="bz3-strand bz3-strand-a" />
      {beads.map(([bx, by], i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r={7.5} className="bz3-histone" />
          <circle cx={bx} cy={by} r={7.5} fill={pat(id, "d")} />
          <path
            d={`M${bx - 7} ${by - 2.5} Q${bx} ${by + 3} ${bx + 7} ${by - 2.5} M${bx - 7} ${by + 2.5} Q${bx} ${by + 8} ${bx + 7} ${by + 2.5}`}
            className="bz3-strand bz3-strand-a bz3-wrap"
          />
        </g>
      ))}
    </g>
  );
}

function Fibre({ x, y }: { x: number; y: number }) {
  const loops: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cx = x + 8 + i * 12;
    loops.push(
      `M${cx - 6} ${y} C${cx - 8} ${y - 14} ${cx + 8} ${y - 14} ${cx + 6} ${y} C${cx + 8} ${y + 14} ${cx - 8} ${y + 14} ${cx - 6} ${y}`,
    );
  }
  return <path d={loops.join(" ")} className="bz3-fibre" />;
}

function BigChromosome({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  // two chromatids drawn as fat rods, crossing at the centromere
  const arm = (dx: number) =>
    `M${x + dx * 0.4} ${y + 38} C${x + dx * 0.5} ${y + 20} ${x + dx * 1.4} ${y + 8} ${x + dx * 1.5} ${y + 2} M${x + dx * 0.4} ${y + 38} C${x + dx * 0.5} ${y + 58} ${x + dx * 1.6} ${y + 80} ${x + dx * 1.7} ${y + 88}`;
  return (
    <g>
      {[-12, 12].map((dx) => (
        <g key={dx}>
          <path d={arm(dx)} className="bz3-chr-big" />
          <path d={arm(dx)} className="bz3-chr-big-in bz3-chr-col" />
          <path d={arm(dx)} className="bz3-chr-big-in" style={{ stroke: pat(id, "d") }} />
        </g>
      ))}
      <ellipse cx={x} cy={y + 38} rx={6} ry={4} className="bz3-centro" />
    </g>
  );
}

const ROWS: { names: string[]; y: number }[] = [
  { names: ["1", "2", "3", "4", "5"], y: 196 },
  { names: ["6", "7", "8", "9", "10", "11", "12"], y: 290 },
  { names: ["13", "14", "15", "16", "17", "18"], y: 360 },
  { names: ["19", "20", "21", "22", "XY"], y: 418 },
];

export default function ChromosomeKaryotype() {
  const [sex, setSex] = useState<"m" | "f">("m");
  return (
    <Figure
      level={7}
      label={LABEL}
      w={W}
      h={H}
      max={560}
      controls={
        <Toggle
          label="Pohlaví"
          value={sex}
          onChange={setSex}
          options={[
            { id: "f", text: "žena · XX" },
            { id: "m", text: "muž · XY" },
          ]}
        />
      }
    >
      {/* zoom strip: DNA → nucleosomes → fibre → chromosome */}
      <Fade>
        <text x={16} y={22} className="bz3-lbl bz3-b bz3-sm">
          Jak se DNA balí
        </text>
      </Fade>
      <Pop delay={0.1}>
        <Helix x={12} y={70} w={78} />
        <text x={51} y={110} textAnchor="middle" className="bz3-lbl bz3-sm">
          DNA
        </text>
      </Pop>
      <DrawArrow d="M96 70 H108" tone="lvl" delay={0.3} />
      <Pop delay={0.4}>
        <Nucleosomes x={112} y={70} />
        <text x={160} y={110} textAnchor="middle" className="bz3-lbl bz3-sm">
          histony
        </text>
      </Pop>
      <DrawArrow d="M216 70 H228" tone="lvl" delay={0.6} />
      <Pop delay={0.7}>
        <Fibre x={232} y={70} />
        <text x={276} y={110} textAnchor="middle" className="bz3-lbl bz3-sm">
          vlákno
        </text>
      </Pop>
      <DrawArrow d="M322 70 H334" tone="lvl" delay={0.9} />
      <Pop delay={1}>
        <BigChromosome x={372} y={30} />
      </Pop>
      <Fade delay={1.2}>
        <Lbl x={332} y={34} tx={368} ty={66} anchor="end" className="bz3-sm">
          centromera
        </Lbl>
        <text x={W - 8} y={22} textAnchor="end" className="bz3-lbl bz3-b bz3-sm">
          chromozom
        </text>
        <Lbl x={W - 8} y={146} tx={391} ty={106} anchor="end" className="bz3-sm">
          2 sesterské chromatidy
        </Lbl>
      </Fade>
      {/* karyotype */}
      <Fade delay={0.2}>
        <line x1={12} x2={W - 12} y1={160} y2={160} className="bz3-rule" />
        <text x={16} y={184} className="bz3-lbl bz3-b bz3-sm">
          Karyotyp člověka: 22 párů + pohlavní pár
        </text>
      </Fade>
      {ROWS.map((row, ri) => {
        const n = row.names.length;
        const gap = (W - 24) / n;
        const tallest = Math.max(
          ...row.names.map((nm) => (nm === "XY" ? CHR.X[0] : CHR[nm][0])),
        );
        const base = row.y + tallest * K; // align on the bottom
        return (
          <Fade key={ri} delay={0.4 + ri * 0.25}>
            {row.names.map((nm, i) => {
              const cx = 12 + gap * (i + 0.5);
              if (nm === "XY") {
                const a = "X";
                const b = sex === "m" ? "Y" : "X";
                return (
                  <g key={nm}>
                    <rect
                      x={cx - gap / 2 + 3}
                      y={row.y - 6}
                      width={gap - 6}
                      height={CHR.X[0] * K + 26}
                      rx={6}
                      className="bz3-tag-lvl"
                    />
                    <Chromo x={cx - 7} y={base - CHR[a][0] * K} name={a} sex />
                    <Chromo x={cx + 7} y={base - CHR[b][0] * K} name={b} sex />
                    <text
                      x={cx}
                      y={base + 15}
                      textAnchor="middle"
                      className="bz3-num bz3-b-num bz3-lvl-t"
                    >
                      {a}
                      {b}
                    </text>
                  </g>
                );
              }
              const L = CHR[nm][0] * K;
              return (
                <g key={nm}>
                  <Chromo x={cx - 6} y={base - L} name={nm} />
                  <Chromo x={cx + 6} y={base - L} name={nm} />
                  <text
                    x={cx}
                    y={base + 15}
                    textAnchor="middle"
                    className="bz3-num"
                  >
                    {nm}
                  </text>
                </g>
              );
            })}
          </Fade>
        );
      })}
    </Figure>
  );
}
