import { motion } from "motion/react";
import { ease } from "../../../ui/motion";
import { Fade, Figure, Legend, f1 } from "./kit";

const LABEL =
  "Planetární meze: kolo devíti procesů, které udržují Zemi stabilní, se zelenou bezpečnou zónou uprostřed. Podle Planetary Health Check 2026 je překročeno 7 z 9 mezí. Ve vysokém riziku jsou změna klimatu, nové látky (plasty a chemikálie), toky dusíku a fosforu a integrita biosféry. V zóně rostoucího rizika jsou sladká voda, změna využívání půdy a okyselování oceánů, které hranici překročilo v roce 2025. V bezpečí zůstávají úbytek ozonu ve stratosféře a aerosoly v atmosféře.";

const W = 400;
const H = 404;
const CX = 200;
const CY = 194;
const R0 = 62; // the boundary (edge of the safe zone)
const R1 = 98; // start of the high-risk zone
const R2 = 150; // outer edge of the drawing

type St = "safe" | "inc" | "high";
const PB: { t: string; r: number; s: St; beyond?: boolean }[] = [
  { t: "změna klimatu", r: 132, s: "high" },
  { t: "nové látky (plasty, chemikálie)", r: 150, s: "high", beyond: true },
  { t: "úbytek ozonu ve stratosféře", r: 44, s: "safe" },
  { t: "aerosoly v atmosféře", r: 50, s: "safe" },
  { t: "okyselování oceánů (překročeno 2025)", r: 70, s: "inc" },
  { t: "toky dusíku a fosforu", r: 146, s: "high" },
  { t: "sladká voda", r: 92, s: "inc" },
  { t: "změna využívání půdy", r: 88, s: "inc" },
  { t: "integrita biosféry", r: 150, s: "high", beyond: true },
];
const ST: Record<St, { cls: string; word: string }> = {
  safe: { cls: "gz7-pb-safe", word: "v bezpečí" },
  inc: { cls: "gz7-pb-inc", word: "rostoucí riziko" },
  high: { cls: "gz7-pb-high", word: "vysoké riziko" },
};

const pol = (a: number, r: number) => [CX + Math.cos((a * Math.PI) / 180) * r, CY + Math.sin((a * Math.PI) / 180) * r];

/** annular sector r0…r1 between angles a0…a1; a jagged outer edge = off the scale */
function sector(a0: number, a1: number, r0: number, r1: number, jag = false) {
  const [x0, y0] = pol(a0, r0);
  const [x1, y1] = pol(a0, r1);
  let d = `M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}`;
  if (jag) {
    const n = 6;
    for (let i = 1; i <= n; i++) {
      const [x, y] = pol(a0 + ((a1 - a0) * i) / n, r1 - (i % 2 ? 9 : 0));
      d += ` L${f1(x)} ${f1(y)}`;
    }
  } else {
    const [x2, y2] = pol(a1, r1);
    d += ` A${r1} ${r1} 0 0 1 ${f1(x2)} ${f1(y2)}`;
  }
  const [x3, y3] = pol(a1, r0);
  d += ` L${f1(x3)} ${f1(y3)}`;
  if (r0 > 0) {
    d += ` A${r0} ${r0} 0 0 0 ${f1(x0)} ${f1(y0)}`;
  }
  return d + " Z";
}

/** a boundary's wedge in layers: green up to the boundary, yellow, then red */
function layers(r: number): [number, number, St][] {
  const out: [number, number, St][] = [[0, Math.min(r, R0), "safe"]];
  if (r > R0) out.push([R0, Math.min(r, R1), "inc"]);
  if (r > R1) out.push([R1, r, "high"]);
  return out;
}

export default function PlanetaryBoundaries() {
  return (
    <Figure
      level={12}
      label={LABEL}
      w={W}
      h={H}
      max={560}
      replay
      controls={
        <Legend
          items={PB.map((p, i) => ({
            n: i + 1,
            fill: ST[p.s].cls,
            text: (
              <>
                {p.t} – <b>{ST[p.s].word}</b>
              </>
            ),
          }))}
        />
      }
    >
      {/* zones */}
      <circle cx={CX} cy={CY} r={R2} className="gz7-pb-zone-high" />
      <circle cx={CX} cy={CY} r={R1} className="gz7-pb-zone-inc" />
      <circle cx={CX} cy={CY} r={R0} className="gz7-pb-zone-safe" />
      {/* wedges grow out of the centre */}
      {PB.map((p, i) => {
        const a0 = -110 + i * 40 + 1.5;
        const a1 = a0 + 37;
        return (
          <motion.g
            key={i}
            style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}
            variants={{
              hidden: { scale: 0 },
              show: { scale: 1, transition: { duration: 0.8, delay: 0.1 + i * 0.08, ease: ease.out } },
            }}
          >
            {layers(p.r).map(([r0, r1, st], k, all) => (
              <path
                key={k}
                d={sector(a0, a1, r0, r1, p.beyond && k === all.length - 1)}
                className={`${ST[st].cls} gz7-o gz7-thin`}
              />
            ))}
          </motion.g>
        );
      })}
      <circle cx={CX} cy={CY} r={R0} className="gz7-pb-line" />
      <circle cx={CX} cy={CY} r={R1} className="gz7-pb-line gz7-dash" />
      {/* numbers */}
      <Fade delay={1}>
        {PB.map((p, i) => {
          const a = -110 + i * 40 + 20;
          const [x, y] = pol(a, Math.min(p.r, R2 - 8) + 16);
          return (
            <g key={i} className="gz7-zone-n">
              <circle cx={x} cy={y} r={10} />
              <text x={x} y={y + 4.5}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </Fade>
      <text x={CX} y={H - 24} textAnchor="middle" className="gz7-lbl gz7-b">
        překročeno 7 z 9 mezí
      </text>
      <text x={CX} y={H - 6} textAnchor="middle" className="gz7-src">
        Planetary Health Check 2026 (PIK, Stockholm Resilience Centre)
      </text>
      {/* zone key */}
      <text x={6} y={18} className="gz7-lbl gz7-sm gz7-good-t">
        zelená = bezpečný prostor
      </text>
      <text x={W - 6} y={18} textAnchor="end" className="gz7-lbl gz7-sm gz7-red-t">
        červená = vysoké riziko
      </text>
    </Figure>
  );
}
