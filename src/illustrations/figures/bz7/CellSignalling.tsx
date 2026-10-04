import { motion } from "motion/react";
import { Draw, Fade, Figure, Lbl, Num, Pop, f1, rng } from "./kit";

const LABEL =
  "Signální kaskáda v jaterní buňce. Jedna molekula adrenalinu zvenku se naváže na receptor v membráně, receptor přes G-bílkovinu zapne enzym adenylátcyklázu a ten uvnitř vyrobí asi sto molekul druhého posla cAMP. Ty aktivují asi sto molekul první kinázy, ta asi tisíc molekul druhé kinázy a ta asi deset tisíc molekul enzymu, který štěpí glykogen. Výsledkem je asi sto milionů molekul glukózy, které buňka uvolní do krve. V každém kroku se signál zesílí.";

const W = 380;
const H = 540;
const MEM = 116; // membrane centre
const RX = 112; // receptor
const GX = 178; // G protein
const AX = 248; // adenylate cyclase
const MID = 264; // centre of the cascade rows

type Row = {
  y: number;
  name: string[];
  value: string;
  n: number;
  kind: "camp" | "k1" | "k2" | "ph";
  step?: number;
};
const ROWS: Row[] = [
  { y: 226, name: ["druhý posel cAMP"], value: "asi 100", n: 3, kind: "camp", step: 2 },
  { y: 284, name: ["1. kináza"], value: "asi 100", n: 3, kind: "k1" },
  { y: 342, name: ["2. kináza"], value: "asi 1 000", n: 5, kind: "k2" },
  { y: 400, name: ["enzym, který", "štěpí glykogen"], value: "asi 10 000", n: 7, kind: "ph" },
];
const GLU_Y = 450;
const GAP = 28;
const xs = (n: number) =>
  Array.from({ length: n }, (_, i) => MID + (i - (n - 1) / 2) * GAP);
const T0 = 0.75; // first relay step
const DT = 0.3;

/** Adrenaline: a benzene ring with a short side chain (engraved, schematic). */
function Adrenaline({ x, y }: { x: number; y: number }) {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    return `${f1(x + Math.cos(a) * 9)} ${f1(y + Math.sin(a) * 9)}`;
  }).join(" L");
  return (
    <g>
      <path d={`M${hex}Z`} className="bz7-hormone" />
      <path
        d={`M${x - 4.5} ${y - 2.6} L${x - 4.5} ${y + 2.6} M${x + 4.5} ${y - 2.6} L${x + 4.5} ${y + 2.6}`}
        className="bz7-o bz7-thin"
      />
      <path
        d={`M${x} ${y + 9} L${x} ${y + 17} L${x + 7} ${y + 21} L${x + 7} ${y + 28}`}
        className="bz7-o"
      />
      <circle cx={x} cy={y + 17} r={2.6} className="bz7-atom-o-s" />
    </g>
  );
}

/** Lipid bilayer across the plate, with gaps for the membrane proteins. */
function Membrane() {
  const heads: string[] = [];
  const tails: string[] = [];
  for (let x = 6; x < W; x += 9) {
    if (Math.abs(x - RX) < 26 || Math.abs(x - AX) < 22) continue;
    heads.push(`M${x + 3} ${MEM - 12} a3 3 0 1 0 0.01 0 M${x + 3} ${MEM + 12} a3 3 0 1 0 0.01 0`);
    tails.push(`M${x} ${MEM - 9} V${MEM - 1} M${x + 2} ${MEM - 9} V${MEM - 1} M${x} ${MEM + 9} V${MEM + 1} M${x + 2} ${MEM + 9} V${MEM + 1}`);
  }
  return (
    <g>
      <rect x={0} y={MEM - 15} width={W} height={30} className="bz7-mem-bg" />
      <path d={tails.join(" ")} className="bz7-tail" />
      <path d={heads.join(" ")} className="bz7-head" />
    </g>
  );
}

/** Seven-helix receptor spanning the membrane. */
function Receptor() {
  return (
    <g>
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          x={RX - 22 + i * 6.4}
          y={MEM - 20 + (i % 2) * 3}
          width={5.6}
          height={38}
          rx={2.8}
          className="bz7-receptor"
        />
      ))}
      <path
        d={`M${RX - 22} ${MEM - 20} Q${RX - 10} ${MEM - 34} ${RX - 4} ${MEM - 22} M${RX + 4} ${MEM - 22} Q${RX + 12} ${MEM - 34} ${RX + 21} ${MEM - 20}`}
        className="bz7-o bz7-thin"
      />
    </g>
  );
}

function Cyclase() {
  return (
    <g>
      <path
        d={`M${AX - 16} ${MEM - 18} Q${AX} ${MEM - 26} ${AX + 16} ${MEM - 18} L${AX + 18} ${MEM + 16} Q${AX + 22} ${MEM + 34} ${AX} ${MEM + 34} Q${AX - 22} ${MEM + 34} ${AX - 18} ${MEM + 16}Z`}
        className="bz7-enzyme"
      />
    </g>
  );
}

function Icon({ kind, x, y }: { kind: Row["kind"]; x: number; y: number }) {
  if (kind === "camp")
    return (
      <g>
        <path
          d={`M${x} ${y - 8} L${x + 7.6} ${y - 2.5} L${x + 4.7} ${y + 6.5} L${x - 4.7} ${y + 6.5} L${x - 7.6} ${y - 2.5}Z`}
          className="bz7-camp"
        />
        <circle cx={x + 9} cy={y + 6} r={3.4} className="bz7-phos" />
      </g>
    );
  const cls = kind === "ph" ? "bz7-enz-ph" : kind === "k2" ? "bz7-enz-k2" : "bz7-enz-k1";
  const r = kind === "ph" ? 8 : 9;
  // an enzyme blob with a notch (active site) and an attached phosphate (= switched on)
  return (
    <g>
      <path
        d={`M${f1(x + r)} ${f1(y - 3)} A${r} ${r} 0 1 0 ${f1(x + r)} ${f1(y + 3)} L${f1(x + r * 0.35)} ${f1(y)}Z`}
        className={`bz7-o bz7-thin ${cls}`}
      />
      <circle cx={x - r * 0.3} cy={y - r - 1} r={3} className="bz7-phos" />
    </g>
  );
}

function Glucose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    return `${f1(x + Math.cos(a) * 4.6 * s)} ${f1(y + Math.sin(a) * 4.6 * s)}`;
  }).join(" L");
  return <path d={`M${hex}Z`} className="bz7-glucose" />;
}

/** Fan of relay lines from each icon of one row to the nearest icons of the next. */
function fan(a: number[], ya: number, b: number[], yb: number) {
  const segs: string[] = [];
  b.forEach((xb) => {
    // each new icon is switched on by the nearest icon above
    const xa = a.reduce((p, c) => (Math.abs(c - xb) < Math.abs(p - xb) ? c : p), a[0]);
    segs.push(`M${f1(xa)} ${ya + 12} L${f1(xb)} ${yb - 13}`);
  });
  return segs.join(" ");
}

export default function CellSignalling() {
  const r = rng(11);
  const glu = Array.from({ length: 57 }, (_, i) => {
    const col = i % 19;
    const rowi = Math.floor(i / 19);
    return [164 + col * 11 + (rowi % 2 ? 5.5 : 0) + (r() - 0.5) * 3, GLU_Y + rowi * 12 + (r() - 0.5) * 3];
  });
  const rows = ROWS.map((row) => ({ ...row, xs: xs(row.n) }));
  const last = rows[rows.length - 1];
  const tGlu = T0 + DT * rows.length + 0.1;
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={460} replay>
      {/* outside / inside */}
      <text x={14} y={24} className="bz7-lbl bz7-sm bz7-muted-t">
        mimo buňku (krev)
      </text>
      <text x={14} y={MEM + 40} className="bz7-lbl bz7-sm bz7-muted-t">
        uvnitř buňky
      </text>
      <Membrane />
      <Receptor />
      <Cyclase />
      {/* G protein under the membrane, between receptor and cyclase */}
      <ellipse cx={GX} cy={MEM + 25} rx={13} ry={8} className="bz7-gprot" />
      <Draw d={`M${RX + 22} ${MEM + 22} H${GX - 16}`} className="bz7-arr bz7-arr-lvl" arrow="lvl" delay={0.55} />
      <Draw d={`M${GX + 15} ${MEM + 22} H${AX - 22}`} className="bz7-arr bz7-arr-lvl" arrow="lvl" delay={0.65} />
      {/* the single hormone molecule docks on the receptor */}
      <motion.g
        variants={{
          hidden: { y: -46, opacity: 0 },
          show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
        }}
      >
        <Adrenaline x={RX} y={MEM - 58} />
      </motion.g>
      <Num x={RX + 46} y={MEM - 62} n={1} />
      <text x={RX + 62} y={MEM - 57} className="bz7-lbl bz7-b">
        příjem signálu
      </text>
      <text x={RX + 62} y={MEM - 38} className="bz7-lbl bz7-sm">
        1 molekula adrenalinu
      </text>
      <Lbl x={14} y={MEM - 30} tx={RX - 22} ty={MEM - 14}>
        receptor
      </Lbl>
      <Lbl x={GX - 4} y={MEM + 56} tx={GX} ty={MEM + 32} anchor="middle" sec>
        G-bílkovina
      </Lbl>
      <Lbl x={W - 8} y={MEM + 52} tx={AX + 16} ty={MEM + 28} anchor="end" sec>
        adenylátcykláza
      </Lbl>

      {/* the relay: rows of switched-on molecules */}
      <Draw
        d={fan([AX], MEM + 22, rows[0].xs, rows[0].y)}
        className="bz7-relay"
        delay={T0 - 0.05}
      />
      {rows.map((row, k) => {
        const t = T0 + k * DT;
        return (
          <g key={row.name.join(" ")}>
            {k > 0 && (
              <Draw
                d={fan(rows[k - 1].xs, rows[k - 1].y, row.xs, row.y)}
                className="bz7-relay"
                delay={t - 0.15}
              />
            )}
            <Fade delay={t}>
              {row.step && (
                <>
                  <Num x={22} y={row.y - 38} n={row.step} />
                  <text x={38} y={row.y - 33} className="bz7-lbl bz7-b">
                    přenos a zesílení
                  </text>
                </>
              )}
              {row.name.map((line, j) => (
                <text key={j} x={14} y={row.y - 2 + j * 16 - (row.name.length - 1) * 8} className="bz7-lbl bz7-sm">
                  {line}
                </text>
              ))}
              <text x={14} y={row.y + 16 + (row.name.length - 1) * 8} className="bz7-eq bz7-val">
                {row.value}
              </text>
            </Fade>
            {row.xs.map((x, i) => (
              <Pop key={i} delay={t + 0.04 * i}>
                <Icon kind={row.kind} x={x} y={row.y} />
              </Pop>
            ))}
          </g>
        );
      })}
      <Draw
        d={last.xs
          .map((x, i) => `M${f1(x)} ${last.y + 12} L${f1(170 + i * 31)} ${GLU_Y - 9}`)
          .join(" ")}
        className="bz7-relay"
        delay={tGlu - 0.15}
      />
      <Fade delay={tGlu}>
        {glu.map(([x, y], i) => (
          <Glucose key={i} x={x} y={y} />
        ))}
        <text x={14} y={GLU_Y + 10} className="bz7-lbl bz7-sm">
          glukóza
        </text>
        <text x={14} y={GLU_Y + 28} className="bz7-eq bz7-val">
          asi 100 000 000
        </text>
        <Num x={22} y={GLU_Y + 61} n={3} />
        <text x={38} y={GLU_Y + 66} className="bz7-lbl bz7-b">
          odpověď: glukóza jde do krve
        </text>
      </Fade>
    </Figure>
  );
}
