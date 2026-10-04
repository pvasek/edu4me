import { motion } from "motion/react";
import { Fade, Figure, useCompact } from "./kit";

const LABEL =
  "Srovnání druhů dopravy nákladu: silniční, železniční, vodní, letecká a potrubní. Pruhy ukazují rychlost, cenu za přepravu tuny na kilometr, kolik nákladu se vejde najednou a emise oxidu uhličitého na tunu a kilometr. Letadlo je nejrychlejší, ale nejdražší a vypouští nejvíc CO₂. Loď uveze nejvíc nákladu nejlevněji, ale pomalu. Kamion je pružný a doveze zboží až ke dveřím, vlak a potrubí jsou levné a čisté.";

type Mode = "road" | "rail" | "water" | "air" | "pipe";
const MODES: { k: Mode; t: string; load: string; v: [number, number, number, number] }[] = [
  { k: "road", t: "silniční", load: "kamion ≈ 25 t", v: [3, 3, 1, 3] },
  { k: "rail", t: "železniční", load: "vlak ≈ 1 500 t", v: [2, 2, 3, 1] },
  { k: "water", t: "vodní", load: "loď až 400 000 t", v: [2, 1, 5, 1] },
  { k: "air", t: "letecká", load: "letadlo ≈ 100 t", v: [5, 5, 1, 5] },
  { k: "pipe", t: "potrubní", load: "ropa, plyn bez přestávky", v: [1, 1, 4, 1] },
];
const COLS = [
  { t: "rychlost", n: "rychlost", c: "gz4-tm-c0" },
  { t: "cena za t · km", n: "cena", c: "gz4-tm-c1" },
  { t: "náklad najednou", n: "náklad", c: "gz4-tm-c2" },
  { t: "emise CO₂", n: "emise CO₂", c: "gz4-tm-c3" },
];

function Vehicle({ k, x, y }: { k: Mode; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {k === "road" && (
        <>
          <path d="M-16 4 V-9 H5 V4 Z M5 -4 H11 L15 0 V4 H5" className="gz4-blue-fill gz4-o gz4-thin" />
          <circle cx={-10} cy={6} r={3} className="gz4-coal" />
          <circle cx={9} cy={6} r={3} className="gz4-coal" />
        </>
      )}
      {k === "rail" && (
        <>
          <path d="M-17 4 V-7 H-3 V4 Z M-1 4 V-7 H13 V4 Z" className="gz4-acc-fill gz4-o gz4-thin" />
          <path d="M-19 8 H17" className="gz4-o gz4-thin" />
          {[-14, -6, 2, 10].map((cx) => (
            <circle key={cx} cx={cx} cy={5.5} r={2.2} className="gz4-coal" />
          ))}
        </>
      )}
      {k === "water" && (
        <>
          <path d="M-18 -1 H18 L13 7 H-14 Z" className="gz4-red-fill gz4-o gz4-thin" />
          {[-12, -5, 2].map((bx) => (
            <rect key={bx} x={bx} y={-7} width={6} height={6} className="gz4-blue-fill gz4-o gz4-thin" />
          ))}
          <path d="M9 -1 V-10 H14 V-1" className="gz4-fill gz4-o gz4-thin" />
          <path d="M-20 10 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0" className="gz4-mt-water" />
        </>
      )}
      {k === "air" && (
        <path
          d="M-18 0 Q-18 -3 -12 -3 H12 Q18 -3 19 0 Q18 3 12 3 H-12 Q-18 3 -18 0 Z M-2 -3 L-8 -13 H-4 L6 -3 M-2 3 L-8 13 H-4 L6 3 M-14 -3 L-18 -9 H-15 L-10 -3"
          className="gz4-fill gz4-o gz4-thin"
        />
      )}
      {k === "pipe" && (
        <>
          <path d="M-20 -4 H20 V4 H-20 Z" className="gz4-mt-machine gz4-o gz4-thin" />
          <path d="M-8 -6 V6 M8 -6 V6" className="gz4-o" />
          <path d="M-6 9 V4 M6 9 V4" className="gz4-o gz4-thin" />
        </>
      )}
    </g>
  );
}

const grow = {
  hidden: { scaleX: 0 },
  show: (d: number) => ({ scaleX: 1, transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export default function TransportModes() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 400 : 680;
  const nameW = n ? 124 : 210;
  const colW = (W - nameW - 8) / 4;
  const barMax = colW - (n ? 10 : 18);
  const head = n ? 44 : 40;
  const rowH = n ? 60 : 54;
  const H = head + rowH * MODES.length + 30;
  return (
    <Figure level={6} label={LABEL} w={W} h={H} max={720} compact={compact} boost={false} replay>
      {COLS.map((c, j) => (
        <g key={c.t}>
          <rect x={nameW + j * colW + 2} y={8} width={colW - 6} height={6} rx={3} className={c.c} />
          <text x={nameW + j * colW + 2} y={34} className="gz4-lbl gz4-b gz4-sm">
            {n ? c.n : c.t}
          </text>
        </g>
      ))}
      {MODES.map((m, i) => {
        const y = head + i * rowH;
        // narrow: name and bars on one line, the load on a second line under them
        const by = n ? y + 22 : y + rowH / 2;
        return (
          <g key={m.k}>
            {i % 2 === 0 && <rect x={0} y={y + 2} width={W} height={rowH} className="gz4-fill2" opacity={0.55} />}
            <Vehicle k={m.k} x={24} y={n ? by + 4 : by} />
            <text x={50} y={n ? by + 6 : by - 2} className="gz4-lbl gz4-b">
              {m.t}
            </text>
            <text x={n ? nameW + 2 : 50} y={n ? by + 30 : by + 16} className="gz4-lbl gz4-sm gz4-muted-t">
              {m.load}
            </text>
            {m.v.map((v, j) => {
              const bx = nameW + j * colW + 2;
              return (
                <g key={j}>
                  <rect x={bx} y={by - 7} width={barMax} height={14} rx={3} className="gz4-tm-track" />
                  <motion.rect
                    variants={grow}
                    custom={0.15 + i * 0.1 + j * 0.05}
                    style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                    x={bx}
                    y={by - 7}
                    width={(barMax * v) / 5}
                    height={14}
                    rx={3}
                    className={`${COLS[j].c} gz4-o gz4-thin`}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
      <Fade delay={1}>
        <text x={W / 2} y={H - 8} textAnchor="middle" className="gz4-lbl gz4-sm gz4-muted-t">
          {n ? "orientační srovnání: delší pruh = víc" : "orientační srovnání nákladní dopravy: delší pruh = víc (rychlejší, dražší, víc nákladu, víc CO₂)"}
        </text>
      </Fade>
    </Figure>
  );
}
