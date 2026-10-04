import { DrawArrow, Fade, Figure, Num, Pop, f1, pat, qpt, rng, useCompact, useFig } from "./kit";

const LABEL =
  "Zjednodušený plán města shora. Uprostřed je centrum (CBD) s obchody, bankami a úřady, kolem něj vnitřní město se starými činžovními domy. Podél železnice a řeky leží průmyslová zóna, na okraji sídliště z panelových domů a předměstí s rodinnými domy. Za městem jsou satelitní městečka, odkud lidé denně dojíždějí za prací do centra.";

const S = 440;
const C: [number, number] = [220, 216];
const pol = (r: number, deg: number): [number, number] => [
  C[0] + r * Math.cos((deg * Math.PI) / 180),
  C[1] + r * Math.sin((deg * Math.PI) / 180),
];

// river (quadratic Bézier) and railway (polyline), sampled to keep houses off them
const RIV: [[number, number], [number, number], [number, number]] = [
  [0, 300],
  [220, 222],
  [440, 268],
];
const RIVER_D = `M${RIV[0][0]} ${RIV[0][1]} Q${RIV[1][0]} ${RIV[1][1]} ${RIV[2][0]} ${RIV[2][1]}`;
const RIV_PTS = Array.from({ length: 60 }, (_, i) => qpt(RIV[0], RIV[1], RIV[2], i / 59));
const RAIL: [number, number][] = [
  [440, 150],
  [330, 178],
  [252, 196],
];
const RAIL_D = `M${RAIL.map((p) => p.join(" ")).join(" L")}`;
const segDist = (p: [number, number], a: [number, number], b: [number, number]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
const free = (p: [number, number], m: number) =>
  RIV_PTS.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > m + 9) &&
  RAIL.slice(1).every((b, i) => segDist(p, RAIL[i], b) > m + 4);

const R = rng(7);
const inSector = (deg: number, a: number, b: number) => {
  const d = ((deg % 360) + 360) % 360;
  return a <= b ? d >= a && d <= b : d >= a || d <= b;
};

// inner city: dense small blocks
const INNER: [number, number][] = [];
for (let r = 40; r <= 76; r += 12)
  for (let a = 0; a < 360; a += 360 / Math.round(r / 2.2)) {
    const p = pol(r, a + r);
    if (free(p, 7)) INNER.push(p);
  }
// housing estate (sídliště): long panel blocks, west to north
const ESTATE: { p: [number, number]; rot: number }[] = [];
for (let r = 96; r <= 150; r += 20)
  for (let a = 200; a <= 285; a += 13) {
    const p = pol(r, a + (r % 40 ? 6 : 0));
    if (free(p, 16)) ESTATE.push({ p, rot: a % 2 ? 0 : 90 });
  }
// suburbs: small family houses, south and south-west, scattered
const SUB: [number, number][] = [];
for (let i = 0; i < 140; i++) {
  const a = 30 + R() * 165;
  const r = 104 + R() * 62;
  const p = pol(r, a);
  if (free(p, 5) && SUB.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 11)) SUB.push(p);
}
// industry: big halls east, by the railway and the river
const IND: { p: [number, number]; w: number; h: number }[] = [];
for (let r = 92; r <= 160; r += 30)
  for (let a = -44; a <= 18; a += 15) {
    const p = pol(r, a);
    if (free(p, 14) && inSector(a, 316, 20)) IND.push({ p, w: 22 + R() * 10, h: 12 + R() * 6 });
  }

const SAT: [number, number][] = [
  [56, 58],
  [392, 396],
  [44, 392],
];

const ITEMS = [
  { n: 1, t: "centrum (CBD)", s: "obchody, banky, úřady" },
  { n: 2, t: "vnitřní město", s: "staré činžovní domy" },
  { n: 3, t: "průmyslová zóna", s: "u železnice a řeky" },
  { n: 4, t: "sídliště", s: "panelové domy" },
  { n: 5, t: "předměstí", s: "rodinné domy" },
  { n: 6, t: "satelitní městečko", s: "za hranicí města" },
];

function Plan() {
  const { id } = useFig();
  return (
    <g>
      <rect x={0} y={0} width={S} height={S} rx={10} className="gz4-grass" />
      <rect x={0} y={0} width={S} height={S} rx={10} fill={pat(id, "dots")} opacity={0.6} />
      {/* city area */}
      <path
        d="M220 42 C312 40 392 104 394 196 C398 290 330 382 232 388 C128 394 46 320 44 220 C42 120 120 44 220 42 Z"
        className="gz4-land gz4-o gz4-thin gz4-dash"
      />
      {/* radial roads to the satellites */}
      {SAT.map((s, i) => (
        <path key={i} d={`M${C[0]} ${C[1]} L${s[0]} ${s[1]}`} className="gz4-uz-road" />
      ))}
      <path d={`M${C[0]} ${C[1]} L${C[0]} 0 M${C[0]} ${C[1]} L${S} ${C[1] - 40}`} className="gz4-uz-road" />
      {/* river */}
      <path d={RIVER_D} className="gz4-uz-river" />
      {/* railway */}
      <path d={RAIL_D} className="gz4-uz-rail" />
      <path d={RAIL_D} className="gz4-uz-rail-ties" />
      <rect x={244} y={190} width={16} height={9} className="gz4-fill gz4-o gz4-thin" />

      {/* suburbs */}
      {SUB.map((p, i) => (
        <g key={i}>
          <rect x={p[0] - 3} y={p[1] - 3} width={6} height={6} className="gz4-roof" />
          <rect x={p[0] - 3} y={p[1] - 3} width={6} height={6} className="gz4-o gz4-thin" />
        </g>
      ))}
      {/* housing estate */}
      {ESTATE.map((e, i) => (
        <rect
          key={i}
          x={e.p[0] - 13}
          y={e.p[1] - 3.5}
          width={26}
          height={7}
          transform={`rotate(${e.rot} ${f1(e.p[0])} ${f1(e.p[1])})`}
          className="gz4-uz-panel gz4-o gz4-thin"
        />
      ))}
      {/* industry */}
      {IND.map((b, i) => (
        <g key={i}>
          <rect x={b.p[0] - b.w / 2} y={b.p[1] - b.h / 2} width={b.w} height={b.h} className="gz4-city" />
          <rect x={b.p[0] - b.w / 2} y={b.p[1] - b.h / 2} width={b.w} height={b.h} fill={pat(id, "d")} />
          <rect x={b.p[0] - b.w / 2} y={b.p[1] - b.h / 2} width={b.w} height={b.h} className="gz4-o gz4-thin" />
          {i % 2 === 0 && <circle cx={b.p[0] + b.w / 2 - 4} cy={b.p[1] - b.h / 2 + 4} r={2.6} className="gz4-coal" />}
        </g>
      ))}
      {/* inner city */}
      {INNER.map((p, i) => (
        <rect key={i} x={p[0] - 4.5} y={p[1] - 4.5} width={9} height={9} className="gz4-uz-block gz4-o gz4-thin" />
      ))}
      {/* CBD: tall office blocks, shaded */}
      <circle cx={C[0]} cy={C[1]} r={30} className="gz4-lvl-fill" />
      {[
        [-14, -14, 12, 12],
        [2, -16, 12, 14],
        [-16, 2, 14, 12],
        [3, 2, 11, 11],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} className="gz4-lvl-fill2" />
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} fill={pat(id, "xd")} />
          <rect x={C[0] + x} y={C[1] + y} width={w} height={h} className="gz4-o gz4-thin" />
        </g>
      ))}

      {/* satellite towns */}
      {SAT.map((s, i) => (
        <g key={i}>
          <circle cx={s[0]} cy={s[1]} r={21} className="gz4-land gz4-o gz4-thin gz4-dash" />
          {[
            [-9, -8],
            [3, -10],
            [-11, 4],
            [2, 2],
            [9, -2],
            [-2, 10],
          ].map(([dx, dy], k) => (
            <rect key={k} x={s[0] + dx - 3} y={s[1] + dy - 3} width={6} height={6} className="gz4-roof gz4-o gz4-thin" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Commute() {
  // commuting arrows: from the satellites and the suburbs to the centre
  const ends: [number, number][] = [
    [80, 82],
    [366, 370],
    [70, 368],
    [214, 362],
  ];
  return (
    <>
      {ends.map((e, i) => {
        const dx = C[0] - e[0];
        const dy = C[1] - e[1];
        const L = Math.hypot(dx, dy);
        const t = (L - 40) / L;
        const mx = e[0] + dx * 0.5 + (dy / L) * 22;
        const my = e[1] + dy * 0.5 - (dx / L) * 22;
        return (
          <DrawArrow
            key={i}
            d={`M${f1(e[0])} ${f1(e[1])} Q${f1(mx)} ${f1(my)} ${f1(e[0] + dx * t)} ${f1(e[1] + dy * t)}`}
            tone="lvl"
            className="gz4-uz-commute"
            delay={0.6 + i * 0.15}
          />
        );
      })}
    </>
  );
}

function Badges() {
  const at: [number, number][] = [
    [C[0] + 34, C[1] - 32],
    [C[0] - 62, C[1] + 2],
    pol(128, -14),
    pol(126, 236),
    pol(132, 112),
    [SAT[0][0] + 24, SAT[0][1] + 22],
  ];
  return (
    <>
      {ITEMS.map((it, i) => (
        <Pop key={it.n} delay={0.3 + i * 0.08}>
          <Num x={at[i][0]} y={at[i][1]} n={it.n} r={11} />
        </Pop>
      ))}
    </>
  );
}

function Legend({ x, y, cols = 1, colW = 0, rowH = 44 }: { x: number; y: number; cols?: number; colW?: number; rowH?: number }) {
  const rows = Math.ceil((ITEMS.length + 1) / cols);
  const pos = (k: number): [number, number] => [x + Math.floor(k / rows) * colW, y + (k % rows) * rowH];
  return (
    <Fade delay={0.5}>
      {ITEMS.map((it, k) => {
        const [lx, ly] = pos(k);
        return (
          <g key={it.n}>
            <Num x={lx + 11} y={ly - 5} n={it.n} r={11} />
            <text x={lx + 30} y={ly} className="gz4-lbl gz4-b">
              {it.t}
            </text>
            <text x={lx + 30} y={ly + 18} className="gz4-lbl gz4-sm">
              {it.s}
            </text>
          </g>
        );
      })}
      {(() => {
        const [lx, ly] = pos(ITEMS.length);
        return (
          <g>
            <path d={`M${lx} ${ly - 5} h22`} className="gz4-arr gz4-arr-lvl gz4-uz-commute" />
            <path d={`M${lx + 16} ${ly - 10} l7 5 l-7 5`} className="gz4-arr gz4-arr-lvl" />
            <text x={lx + 30} y={ly} className="gz4-lbl gz4-b gz4-lvl-t">
              dojížďka za prací
            </text>
            <text x={lx + 30} y={ly + 18} className="gz4-lbl gz4-sm">
              ráno do centra, večer zpět
            </text>
          </g>
        );
      })()}
    </Fade>
  );
}

export default function UrbanZones() {
  const compact = useCompact();
  const n = compact.narrow;
  return (
    <Figure
      level={5}
      label={LABEL}
      w={n ? S : 700}
      h={n ? S + 196 : S}
      max={760}
      compact={compact}
      boost={false}
      replay
    >
      <Plan />
      <Commute />
      <Badges />
      {n ? <Legend x={4} y={S + 32} cols={2} colW={220} rowH={50} /> : <Legend x={462} y={66} rowH={52} />}
    </Figure>
  );
}
