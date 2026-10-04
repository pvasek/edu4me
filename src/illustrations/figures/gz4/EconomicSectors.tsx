import { motion } from "motion/react";
import { DrawArrow, Fade, Figure, pat, useCompact, useFig } from "./kit";

const LABEL =
  "Podíl pracujících v primárním, sekundárním a terciérním sektoru ve třech státech. Etiopie, stát s nízkými příjmy: zemědělství asi 62 %, průmysl asi 10 %, služby asi 28 % (ILO, odhad 2023). Indie, stát se středními příjmy: zemědělství 46 %, průmysl 24 %, služby 30 % (PLFS 2023/24). Česko, stát s vysokými příjmy: zemědělství 3 %, průmysl 36 %, služby 61 % (ČSÚ 2023). S rozvojem ubývá lidí v zemědělství a přibývá jich ve službách.";

const ROWS = [
  { name: "Etiopie", inc: "nízké příjmy", src: "ILO 2023", v: [62, 10, 28] },
  { name: "Indie", inc: "střední příjmy", src: "PLFS 2023/24", v: [46, 24, 30] },
  { name: "Česko", inc: "vysoké příjmy", src: "ČSÚ 2023", v: [3, 36, 61] },
];
const SECT = [
  { k: "p", t: "primární", s: "zemědělství, lesy, rybolov" },
  { k: "s", t: "sekundární", s: "průmysl, stavebnictví" },
  { k: "t", t: "terciérní", s: "služby" },
];

const grow = {
  hidden: { scaleX: 0 },
  show: (d: number) => ({ scaleX: 1, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export default function EconomicSectors() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 400 : 640;
  const bx = n ? 12 : 150; // bar start
  const bw = W - bx - (n ? 12 : 24);
  const rowH = n ? 88 : 70;
  const y0 = n ? 132 : 92;
  const H = y0 + rowH * ROWS.length + (n ? 36 : 30);
  return (
    <Figure level={6} label={LABEL} w={W} h={H} max={680} compact={compact} boost={false} replay>
      <Inner n={n} W={W} bx={bx} bw={bw} rowH={rowH} y0={y0} H={H} />
    </Figure>
  );
}

function Inner({ n, W, bx, bw, rowH, y0, H }: { n: boolean; W: number; bx: number; bw: number; rowH: number; y0: number; H: number }) {
  const { id } = useFig();
  const legW = n ? (W - 24) / 2 : (W - 24) / 3;
  return (
    <>
      {/* legend */}
      {SECT.map((s, i) => {
        const lx = 12 + (n ? (i % 2) * legW : i * legW);
        const ly = 22 + (n ? Math.floor(i / 2) * 44 : 0);
        return (
          <g key={s.k}>
            <rect x={lx} y={ly - 12} width={16} height={16} rx={3} className={`gz4-es-${s.k} gz4-o gz4-thin`} />
            <text x={lx + 24} y={ly + 1} className="gz4-lbl gz4-b">
              {s.t}
            </text>
            <text x={lx + 24} y={ly + 19} className="gz4-lbl gz4-sm gz4-muted-t">
              {s.s}
            </text>
          </g>
        );
      })}

      {ROWS.map((r, i) => {
        const y = y0 + i * rowH;
        const by = n ? y + 10 : y - 16;
        let acc = 0;
        return (
          <g key={r.name}>
            {n ? (
              <text x={bx} y={y - 2} className="gz4-lbl gz4-b">
                {r.name}
                <tspan className="gz4-muted-t" style={{ fontWeight: 600 }}>
                  {" "}· {r.inc}
                </tspan>
              </text>
            ) : (
              <>
                <text x={bx - 12} y={y - 2} textAnchor="end" className="gz4-lbl gz4-b gz4-big">
                  {r.name}
                </text>
                <text x={bx - 12} y={y + 16} textAnchor="end" className="gz4-lbl gz4-sm gz4-muted-t">
                  {r.inc}
                </text>
              </>
            )}
            {r.v.map((v, k) => {
              const x = bx + (acc / 100) * bw;
              const w = (v / 100) * bw;
              acc += v;
              return (
                <g key={k}>
                  <motion.g variants={grow} custom={0.15 + i * 0.25 + k * 0.12} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
                    <rect x={x} y={by} width={w} height={30} className={`gz4-es-${SECT[k].k}`} />
                    {k === 1 && <rect x={x} y={by} width={w} height={30} fill={pat(id, "d")} />}
                    <rect x={x} y={by} width={w} height={30} className="gz4-o gz4-thin" />
                  </motion.g>
                  <Fade delay={0.6 + i * 0.25}>
                    {w > 30 ? (
                      <text x={x + w / 2} y={by + 20} textAnchor="middle" className={`gz4-eq gz4-eq-lg ${k === 1 ? "" : "gz4-light-t"}`}>
                        {v} %
                      </text>
                    ) : (
                      <text x={x + w / 2} y={by + 46} textAnchor="middle" className="gz4-eq">
                        {v} %
                      </text>
                    )}
                  </Fade>
                </g>
              );
            })}
            <text x={bx + bw} y={by + (n ? 48 : 46)} textAnchor="end" className="gz4-lbl gz4-sm gz4-muted-t">
              {r.src}
            </text>
          </g>
        );
      })}
      <DrawArrow
        d={`M${n ? W - 8 : bx - 128} ${y0 - (n ? 4 : 30)} V${y0 + rowH * (ROWS.length - 1) + (n ? 36 : 14)}`}
        tone="lvl"
        delay={1.2}
        className={n ? "gz4-sec" : ""}
      />
      <Fade delay={1.3}>
        <text x={W / 2} y={H - 6} textAnchor="middle" className="gz4-lbl gz4-b gz4-lvl-t">
          s rozvojem: méně zemědělců, víc lidí ve službách
        </text>
      </Fade>
    </>
  );
}
