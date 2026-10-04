import { motion } from "motion/react";
import { Fade, Figure, Travel, cz, f1, pat, useCompact, useFig } from "./kit";

const LABEL =
  "Panamský průplav v podélném řezu. Loď z Karibského moře (Atlantský oceán) vplouvá do Gatúnských zdymadel, která ji třemi plavebními komorami zvednou o 26 metrů na hladinu Gatúnského jezera. Pak pluje přes jezero a Culebrovým průkopem, zdymadla Pedro Miguel a Miraflores ji třemi komorami spustí zpět na hladinu Tichého oceánu. Průplav je dlouhý 82 km a otevřen byl v roce 1914. Cesta lodi z New Yorku do San Franciska se tím zkrátí z asi 22 500 km kolem mysu Horn na asi 9 500 km.";

type Seg = { kind: "sea" | "chan" | "lake" | "cut" | "lock"; len: number; level: number };
// lengths: km for channels and lakes, px for sea margins and lock chambers (drawn wider than real)
const SEGS: Seg[] = [
  { kind: "sea", len: 0, level: 0 },
  { kind: "chan", len: 10, level: 0 },
  { kind: "lock", len: 0, level: 8.7 },
  { kind: "lock", len: 0, level: 17.3 },
  { kind: "lock", len: 0, level: 26 },
  { kind: "lake", len: 39, level: 26 },
  { kind: "cut", len: 12, level: 26 },
  { kind: "lock", len: 0, level: 16.5 },
  { kind: "lake", len: 2, level: 16.5 },
  { kind: "lock", len: 0, level: 8.2 },
  { kind: "lock", len: 0, level: 0 },
  { kind: "chan", len: 14, level: 0 },
  { kind: "sea", len: 0, level: 0 },
];

function geometry(W: number, narrow: boolean) {
  const sea = narrow ? 34 : 64;
  const lockW = narrow ? 11 : 14;
  const left = 8;
  const right = W - 8;
  const locks = SEGS.filter((s) => s.kind === "lock").length;
  const km = SEGS.reduce((a, s) => a + (s.kind === "sea" || s.kind === "lock" ? 0 : s.len), 0);
  const pxkm = (right - left - 2 * sea - locks * lockW) / km;
  let x = left;
  const out = SEGS.map((s) => {
    const w = s.kind === "sea" ? sea : s.kind === "lock" ? lockW : s.len * pxkm;
    const r = { ...s, x0: x, x1: x + w };
    x += w;
    return r;
  });
  return out;
}

const SEA_Y = 214;
const K = 4; // px per metre (vertical exaggeration)
const ly = (m: number) => SEA_Y - m * K;
const DEPTH = 14;

export default function PanamaCanal() {
  const compact = useCompact();
  const n = compact.narrow;
  const W = n ? 420 : 680;
  const H = n ? 380 : 360;
  return (
    <Figure level={6} label={LABEL} w={W} h={H} max={720} compact={compact} boost={false} replay>
      <Plate W={W} H={H} n={n} />
    </Figure>
  );
}

function Plate({ W, H, n }: { W: number; H: number; n: boolean }) {
  const { id } = useFig();
  const G = geometry(W, n);
  const first = G[1].x0;
  const last = G[G.length - 2].x1;
  // water surface (with vertical steps at the gates)
  let surf = `M${f1(G[0].x0)} ${ly(G[0].level)}`;
  G.forEach((s, i) => {
    if (i > 0) surf += ` V${ly(s.level)}`;
    surf += ` H${f1(s.x1)}`;
  });
  // bed: sea is deep, channels and locks a fixed depth under their surface
  const bedPts: string[] = [];
  G.forEach((s) => {
    const by = s.kind === "sea" ? SEA_Y + 26 : ly(s.level) + DEPTH;
    bedPts.push(`${f1(s.x0)} ${by}`, `${f1(s.x1)} ${by}`);
  });
  const bed = bedPts.join(" L");
  const water = `${surf} L${bed.split(" L").reverse().join(" L")} Z`;
  const bottom = H - (n ? 116 : 96);
  const ground = `M${f1(G[0].x0)} ${SEA_Y + 26} L${bed} L${f1(G[G.length - 1].x1)} ${bottom} H${f1(G[0].x0)} Z`;
  // hills behind the canal, highest at the continental divide (Culebra)
  const cut = G[6];
  const lake = G[5];
  const hills = `M${f1(first)} ${ly(0) - 4} Q${f1(first + 20)} ${ly(14)} ${f1(G[4].x1)} ${ly(30)} L${f1(lake.x0 + 30)} ${ly(33)} Q${f1((lake.x0 + lake.x1) / 2)} ${ly(30)} ${f1(lake.x1 - 10)} ${ly(37)} Q${f1((cut.x0 + cut.x1) / 2)} ${ly(46)} ${f1(cut.x1 + 6)} ${ly(33)} L${f1(G[9].x1)} ${ly(22)} Q${f1(G[11].x0 + 30)} ${ly(10)} ${f1(last)} ${ly(0) - 4} Z`;
  // ship path: on the surface, lifted at each gate
  let ship = `M${f1(G[0].x0 + 14)} ${ly(0) - 1}`;
  G.forEach((s, i) => {
    if (i > 0) ship += ` L${f1(s.x0 + 3)} ${ly(G[i - 1].level) - 1} L${f1(s.x0 + 6)} ${ly(s.level) - 1}`;
    ship += ` L${f1(s.x1 - 3)} ${ly(s.level) - 1}`;
  });

  const lbl = (x: number, y: number, t: string, cls = "", anchor: "start" | "middle" | "end" = "middle") => (
    <text x={f1(x)} y={y} textAnchor={anchor} className={`gz4-lbl ${cls}`}>
      {t}
    </text>
  );
  const lockMid = (a: number, b: number) => (G[a].x0 + G[b].x1) / 2;
  return (
    <>
      <rect x={4} y={4} width={W - 8} height={bottom - 4} className="gz4-mt-sky" />
      <path d={hills} className="gz4-grass" />
      <path d={hills} fill={pat(id, "dots")} opacity={0.6} />
      <path d={hills} className="gz4-o gz4-thin" />
      <path d={ground} className="gz4-rock" />
      <path d={ground} fill={pat(id, "d")} opacity={0.6} />
      <path d={water} className="gz4-sea" />
      <path d={water} fill={pat(id, "h")} opacity={0.5} />
      <path d={surf} className="gz4-mt-water" />
      <path d={`M${f1(G[0].x0)} ${SEA_Y + 26} L${bed} L${f1(G[G.length - 1].x1)} ${SEA_Y + 26}`} className="gz4-o" />
      {G.map((s, i) =>
        s.kind === "lock" ? (
          <g key={i}>
            <path d={`M${f1(s.x0)} ${Math.min(ly(s.level), ly(G[i - 1].level)) - 5} V${Math.max(ly(s.level), ly(G[i - 1].level)) + DEPTH}`} className="gz4-pc-gate" />
            {G[i + 1].kind !== "lock" && (
              <path d={`M${f1(s.x1)} ${Math.min(ly(s.level), ly(G[i + 1].level)) - 5} V${Math.max(ly(s.level), ly(G[i + 1].level)) + DEPTH}`} className="gz4-pc-gate" />
            )}
          </g>
        ) : null,
      )}

      {/* the ship travels through, lifted and lowered at the locks */}
      <Travel path={ship} dur={16} rest={[lake.x0 + 40, ly(26) - 1]}>
        <path d="M-12 0 H12 L9 -5 H-11 Z" className="gz4-red-fill gz4-o gz4-thin" />
        <rect x={-8} y={-11} width={10} height={6} className="gz4-blue-fill gz4-o gz4-thin" />
        <path d="M4 -5 V-12 H8 V-5" className="gz4-fill gz4-o gz4-thin" />
      </Travel>

      {/* labels */}
      <Fade delay={0.4}>
        {lbl(G[0].x0 + 4, SEA_Y - 30, n ? "Karibské" : "Karibské moře", "gz4-sm gz4-b gz4-blue-t", "start")}
        {lbl(G[0].x0 + 4, SEA_Y - 14, n ? "moře" : "(Atlantik)", "gz4-sm gz4-blue-t", "start")}
        {lbl(G[12].x1 - 4, SEA_Y - 30, n ? "Tichý" : "Tichý oceán", "gz4-sm gz4-b gz4-blue-t", "end")}
        {lbl(G[12].x1 - 4, SEA_Y - 14, n ? "oceán" : "Panamá", "gz4-sm gz4-blue-t", "end")}
        {!n && lbl(G[1].x0 + 4, SEA_Y + 40, "Colón", "gz4-sm gz4-light-t", "start")}
        <path d={`M${f1(lockMid(2, 4))} 44 V${ly(26) - 8}`} className="gz4-lead" />
        {lbl(lockMid(2, 4), 22, n ? "Gatún" : "zdymadla Gatún", "gz4-sm gz4-b")}
        {lbl(lockMid(2, 4), 38, "3 komory ↑", "gz4-sm gz4-lvl-t gz4-b")}
        {lbl((lake.x0 + lake.x1) / 2, ly(26) + 30, n ? "Gatúnské jezero" : "Gatúnské jezero · 26 m n. m.", "gz4-b gz4-halo")}
        {n && lbl((lake.x0 + lake.x1) / 2, ly(26) + 47, "26 m n. m.", "gz4-sm gz4-halo")}
        {lbl((cut.x0 + cut.x1) / 2, ly(26) - 8, n ? "Culebra" : "Culebrův průkop", "gz4-sm gz4-b gz4-halo")}
        <path d={`M${f1(lockMid(7, 10))} 44 V${ly(26) - 4}`} className="gz4-lead" />
        {lbl(lockMid(7, 10), 22, n ? "Pedro Miguel," : "Pedro Miguel a Miraflores", "gz4-sm gz4-b", n ? "end" : "middle")}
        {lbl(lockMid(7, 10), 38, n ? "Miraflores: 3 ↓" : "3 komory ↓", "gz4-sm gz4-lvl-t gz4-b", n ? "end" : "middle")}
      </Fade>

      {/* length */}
      <path d={`M${f1(first)} ${bottom + 16} H${f1(last)} M${f1(first)} ${bottom + 10} v12 M${f1(last)} ${bottom + 10} v12`} className="gz4-o" />
      {lbl((first + last) / 2, bottom + 12, "82 km", "gz4-b gz4-halo")}
      {!n && lbl(W - 12, bottom - 8, "výšky zveličeny", "gz4-sm gz4-muted-t", "end")}

      {/* distance saved */}
      <Distance W={W} y={bottom + 40} n={n} />
    </>
  );
}

const grow = {
  hidden: { scaleX: 0 },
  show: (d: number) => ({ scaleX: 1, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

function Distance({ W, y, n }: { W: number; y: number; n: boolean }) {
  const x0 = n ? 12 : 230;
  const full = W - x0 - (n ? 12 : 20);
  const rows = [
    { t: "kolem mysu Horn", v: 22500, c: "gz4-pc-long" },
    { t: "Panamským průplavem", v: 9500, c: "gz4-lvl-fill2" },
  ];
  return (
    <g>
      <text x={n ? 12 : 12} y={y + (n ? 0 : 14)} className="gz4-lbl gz4-b">
        New York → San Francisco
      </text>
      {rows.map((r, i) => {
        const yy = y + (n ? 14 : 0) + i * (n ? 30 : 28);
        const w = (full * r.v) / 22500;
        return (
          <g key={r.t}>
            <motion.rect
              variants={grow}
              custom={0.6 + i * 0.3}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              x={x0}
              y={yy}
              width={w}
              height={18}
              rx={3}
              className={`${r.c} gz4-o gz4-thin`}
            />
            <text x={x0 + 6} y={yy + 14} className="gz4-lbl gz4-sm gz4-b">
              {r.t}: ≈ {cz(r.v)} km
            </text>
          </g>
        );
      })}
    </g>
  );
}
