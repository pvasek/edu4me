import { useState } from "react";
import { BASE_T as BASE, Fade, Figure, Pop, f1 } from "./kit";

const LABEL =
  "Kódové kolo genetického kódu. Kodon mRNA se čte od středu ven: vnitřní kruh je první báze (U, C, A, G), prostřední mezikruží druhá báze a vnější mezikruží třetí báze; na okraji je zkratka aminokyseliny, kterou kodon určuje. Kodon AUG kóduje methionin a je zároveň start kodonem, kodony UAA, UAG a UGA jsou stop kodony. Většinu aminokyselin kóduje více kodonů – kód je degenerovaný. Klepnutím na výseč se vybraný kodon vypíše pod kolem.";

const ORDER = ["U", "C", "A", "G"] as const;
const ONE =
  "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const AA: Record<string, [string, string]> = {
  F: ["Phe", "fenylalanin"],
  L: ["Leu", "leucin"],
  S: ["Ser", "serin"],
  Y: ["Tyr", "tyrosin"],
  "*": ["Stop", "stop kodon – konec překladu"],
  C: ["Cys", "cystein"],
  W: ["Trp", "tryptofan"],
  P: ["Pro", "prolin"],
  H: ["His", "histidin"],
  Q: ["Gln", "glutamin"],
  R: ["Arg", "arginin"],
  I: ["Ile", "izoleucin"],
  M: ["Met", "methionin – start"],
  T: ["Thr", "threonin"],
  N: ["Asn", "asparagin"],
  K: ["Lys", "lysin"],
  V: ["Val", "valin"],
  A: ["Ala", "alanin"],
  D: ["Asp", "kyselina asparagová"],
  E: ["Glu", "kyselina glutamová"],
  G: ["Gly", "glycin"],
};

const W = 500;
const H = 590;
const CX = 260;
const CY = 282;
const R1 = 54; // first base
const R2 = 112; // second base
const R3 = 156; // third base
const R4 = 232; // amino acids

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number): [number, number] => [
  CX + r * Math.sin(rad(deg)),
  CY - r * Math.cos(rad(deg)),
];
/** annular sector between radii r1–r2 and angles a1–a2 (degrees, clockwise from top) */
function sector(r1: number, r2: number, a1: number, a2: number) {
  const large = a2 - a1 > 180 ? 1 : 0;
  const [x1, y1] = pt(r2, a1);
  const [x2, y2] = pt(r2, a2);
  const [x3, y3] = pt(r1, a2);
  const [x4, y4] = pt(r1, a1);
  if (r1 <= 0)
    return `M${CX} ${CY} L${f1(x1)} ${f1(y1)} A${r2} ${r2} 0 ${large} 1 ${f1(x2)} ${f1(y2)}Z`;
  return `M${f1(x1)} ${f1(y1)} A${r2} ${r2} 0 ${large} 1 ${f1(x2)} ${f1(y2)} L${f1(x3)} ${f1(y3)} A${r1} ${r1} 0 ${large} 0 ${f1(x4)} ${f1(y4)}Z`;
}

/** runs of codons (within one second-base block) coding the same amino acid */
const GROUPS = (() => {
  const g: { i: number; j: number; k0: number; k1: number; aa: string }[] = [];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let k0 = 0;
      for (let k = 1; k <= 4; k++) {
        const a = ONE[16 * i + 4 * j + k0];
        if (k === 4 || ONE[16 * i + 4 * j + k] !== a) {
          g.push({ i, j, k0, k1: k - 1, aa: a });
          k0 = k;
        }
      }
    }
  return g;
})();
const ang = (i: number, j = 0, k = 0) => i * 90 + j * 22.5 + k * 5.625;

export default function GeneticCodeWheel() {
  const [sel, setSel] = useState<[number, number, number]>([2, 0, 3]); // AUG
  const [si, sj, sk] = sel;
  const aa = ONE[16 * si + 4 * sj + sk];
  const codon = [ORDER[si], ORDER[sj], ORDER[sk]];
  const tone = aa === "M" ? "bz4-cw-start" : aa === "*" ? "bz4-cw-stop" : "";
  return (
    <Figure level={10} label={LABEL} w={W} x0={10} h={H} max={560} boost={false}>
      <text x={CX} y={22} textAnchor="middle" className="bz4-lbl bz4-sm">
        čti od středu ven: 1. báze → 2. báze → 3. báze
      </text>
      {/* amino acid band */}
      <Pop delay={0.55}>
        {GROUPS.map((g, n) => {
          const a1 = ang(g.i, g.j, g.k0);
          const a2 = ang(g.i, g.j, g.k1 + 1);
          const m = (a1 + a2) / 2;
          const [x, y] = pt((R3 + R4) / 2 + 2, m);
          const right = m < 180;
          const cls =
            g.aa === "M"
              ? "bz4-cw-start"
              : g.aa === "*"
                ? "bz4-cw-stop"
                : n % 2
                  ? "bz4-fill2"
                  : "bz4-fill";
          return (
            <g key={n}>
              <path d={sector(R3, R4, a1, a2)} className={`bz4-o bz4-thin ${cls}`} />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${f1(right ? m - 90 : m + 90)} ${f1(x)} ${f1(y)})`}
                className={`bz4-cw-aa ${g.aa === "M" || g.aa === "*" ? "bz4-cw-aa-b" : ""}`}
              >
                {AA[g.aa][0]}
              </text>
            </g>
          );
        })}
      </Pop>
      {/* third base */}
      <Pop delay={0.4}>
        {Array.from({ length: 64 }, (_, n) => {
          const i = n >> 4;
          const j = (n >> 2) & 3;
          const k = n & 3;
          const a1 = ang(i, j, k);
          const [x, y] = pt((R2 + R3) / 2, a1 + 2.8125);
          const on = i === si && j === sj && k === sk;
          return (
            <g key={n}>
              <path
                d={sector(R2, R3, a1, a1 + 5.625)}
                className={`bz4-o bz4-thin ${on ? "bz4-cw-sel" : "bz4-fill"}`}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="bz4-cw-b3"
                style={{ fill: on ? undefined : BASE[ORDER[k]] }}
              >
                {ORDER[k]}
              </text>
            </g>
          );
        })}
      </Pop>
      {/* second base */}
      <Pop delay={0.25}>
        {Array.from({ length: 16 }, (_, n) => {
          const i = n >> 2;
          const j = n & 3;
          const a1 = ang(i, j);
          const [x, y] = pt((R1 + R2) / 2 + 1, a1 + 11.25);
          const on = i === si && j === sj;
          return (
            <g key={n}>
              <path
                d={sector(R1, R2, a1, a1 + 22.5)}
                className={`bz4-o bz4-thin ${on ? "bz4-cw-sel" : "bz4-fill2"}`}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="bz4-cw-b2"
                style={{ fill: on ? undefined : BASE[ORDER[j]] }}
              >
                {ORDER[j]}
              </text>
            </g>
          );
        })}
      </Pop>
      {/* first base */}
      <Pop delay={0.1}>
        {ORDER.map((b, i) => {
          const [x, y] = pt(R1 * 0.55, i * 90 + 45);
          const on = i === si;
          return (
            <g key={b}>
              <path
                d={sector(0, R1, i * 90, i * 90 + 90)}
                className={`bz4-o ${on ? "bz4-cw-sel" : "bz4-fill3"}`}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="bz4-cw-b1"
                style={{ fill: on ? undefined : BASE[b] }}
              >
                {b}
              </text>
            </g>
          );
        })}
      </Pop>
      <circle cx={CX} cy={CY} r={R4} className="bz4-o" />
      {/* tap targets over the outer rings */}
      <g className="bz4-tap">
        {Array.from({ length: 64 }, (_, n) => {
          const a1 = ang(n >> 4, (n >> 2) & 3, n & 3);
          return (
            <path
              key={n}
              d={sector(R2, R4, a1, a1 + 5.625)}
              fill="transparent"
              onClick={() => setSel([n >> 4, (n >> 2) & 3, n & 3])}
            />
          );
        })}
      </g>

      {/* read-out */}
      <Fade delay={0.9}>
        <rect
          x={50}
          y={H - 76}
          width={W - 80}
          height={40}
          rx={8}
          className={`bz4-tag-lvl ${tone}`}
        />
        <text x={CX} y={H - 49} textAnchor="middle" className="bz4-cw-read">
          <tspan className="bz4-cw-codon">
            {codon.map((b, i) => (
              <tspan key={i} style={{ fill: BASE[b] }}>
                {b}
              </tspan>
            ))}
          </tspan>
          <tspan dx={8}>→</tspan>
          <tspan dx={8} className="bz4-cw-codon">
            {AA[aa][0]}
          </tspan>
          <tspan dx={8} className="bz4-cw-name">
            {AA[aa][1]}
          </tspan>
        </text>
        <text x={CX} y={H - 10} textAnchor="middle" className="bz4-lbl bz4-sm">
          klepni na výseč a přečti kodon
        </text>
      </Fade>
    </Figure>
  );
}
