import { DrawArrow, Fade, Figure, f1, pat, useFig, useLive, type P2 } from "./kit";

const LABEL =
  "Řez subdukční zónou u západního pobřeží Jižní Ameriky. Těžší oceánská deska Nazca se rychlostí asi 7 cm za rok podsouvá pod lehčí pevninskou Jihoamerickou desku. V místě ohybu vzniká hlubokomořský příkop (Atacamský příkop, hluboký 8 065 m). Podél ponořující se desky leží ohniska zemětřesení: mělká a nejsilnější u příkopu (Chile 2010, M 8,8), hlubší dál od pobřeží, až do hloubky kolem 700 km. V hloubce kolem 100 km deska uvolňuje vodu, ta snižuje teplotu tání pláště nad ní a vzniklé magma stoupá k povrchu a živí sopečný oblouk And.";

const W = 480;
const H = 424;
const SEA = 70;
const KM = 0.95; // px per km of depth
const dy = (km: number) => SEA + km * KM;
const LITH = 76;

/** Catmull-Rom spline through points, sampled */
function spline(P: P2[], per = 8): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
/** offset a polyline to its lower-left side */
function offset(P: P2[], d: number): P2[] {
  return P.map((p, i) => {
    const a = P[Math.max(0, i - 1)];
    const b = P[Math.min(P.length - 1, i + 1)];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    // normal pointing "down" (into the plate)
    return [p[0] - ((b[1] - a[1]) / L) * d, p[1] + ((b[0] - a[0]) / L) * d] as P2;
  });
}
const line = (P: P2[], move = true) => P.map((p, i) => `${i === 0 && move ? "M" : "L"}${f1(p[0])} ${f1(p[1])}`).join(" ");

const TOP = spline([
  [-10, 100],
  [140, 101],
  [178, 108],
  [198, 124],
  [240, 136],
  [280, 152],
  [320, 176],
  [360, 214],
  [400, 262],
  [436, 316],
  [462, 366],
  [478, 404],
]);
/** the plate base: the offset of the top, with the self-crossing loop under the bend removed */
const BOTTOM = (() => {
  const raw = offset(TOP, LITH);
  const out: P2[] = [];
  let mx = -Infinity;
  for (const p of raw) {
    if (p[0] >= mx) {
      out.push(p);
      mx = p[0];
    }
  }
  // re-smooth the corner left where the loop was cut out
  const keep = out.filter((_, i) => i % 10 === 0 || i === out.length - 1);
  return spline(keep, 10);
})();
const CRUST = offset(TOP, 9);
/** the continent's surface: trench → continental slope → coast → Andes */
const LAND = spline([
  [198, 124],
  [222, 104],
  [252, 70],
  [282, 50],
  [306, 34],
  [318, 22],
]).concat(
  spline([
    [326, 22],
    [340, 32],
    [380, 38],
    [430, 44],
    [490, 52],
  ]),
);
/** index of the first TOP point right of x */
const at = (x: number) => TOP.findIndex((p) => p[0] >= x);

function Foci() {
  const live = useLive();
  const pts: [number, number, number][] = [
    [214, 138, 1.4], [232, 146, 1.4], [252, 150, 1.2], [270, 160, 1.1],
    [300, 178, 0.9], [330, 200, 0.8], [362, 232, 0.8], [392, 270, 0.8], [418, 308, 0.8], [446, 352, 0.8], [466, 392, 0.8],
  ];
  return (
    <g>
      {pts.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path
            d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"
            className={live ? "gz6-pulse" : ""}
            style={{ fill: "var(--bad)", stroke: "var(--edge)", strokeWidth: 0.6, animationDelay: `${-i * 0.3}s` }}
          />
        </g>
      ))}
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const iT = at(198);
  const iLith = at(300);
  // continental plate: surface, right edge, lithosphere base (y 150), slab top back to the trench
  const contBody = `${line(LAND)} L${W + 10} 52 L${W + 10} 150 L${f1(TOP[iLith][0])} 150 ${line(TOP.slice(iT, iLith + 1).reverse(), false)} Z`;
  const crustBase: P2[] = [
    [W + 10, 128],
    [380, 136],
    [330, 142],
    [262, 146],
  ];
  const iCr = at(262);
  const crustBody = `${line(LAND)} L${W + 10} 52 ${line(crustBase, false)} ${line(TOP.slice(iT, iCr + 1).reverse(), false)} Z`;
  const plate = `${line(TOP)} ${line(BOTTOM.slice().reverse(), false)} Z`;
  const ocrust = `${line(TOP)} ${line(CRUST.slice().reverse(), false)} Z`;
  return (
    <>
      {/* mantle, sea */}
      <rect x={0} y={SEA} width={W} height={H - SEA - 20} className="gz6-mantle" />
      <rect x={0} y={SEA} width={W} height={H - SEA - 20} fill={pat(id, "dots")} opacity={0.5} />
      <path d={`M0 ${SEA} H252 L${f1(LAND[0][0])} ${f1(LAND[0][1])} L178 108 L140 101 L0 100 Z`} className="gz6-sea" />
      <path d={`M0 ${SEA} H252 L${f1(LAND[0][0])} ${f1(LAND[0][1])} L178 108 L140 101 L0 100 Z`} fill={pat(id, "h")} />
      <path d={`M0 ${SEA} H250`} className="gz6-o gz6-thin gz6-blue-s" />

      {/* plates */}
      <clipPath id={`${id}-clip`}>
        <rect x={-20} y={0} width={W + 40} height={H - 20} />
      </clipPath>
      <g clipPath={`url(#${id}-clip)`}>
        <path d={plate} className="gz6-litho" />
        <path d={plate} fill={pat(id, "b")} opacity={0.5} />
        <path d={ocrust} className="gz6-crust-o" />
        <path d={line(BOTTOM)} className="gz6-o gz6-thin" />
      </g>
      <path d={contBody} className="gz6-litho" />
      <path d={contBody} fill={pat(id, "b")} opacity={0.5} />
      <path d={crustBody} className="gz6-crust-c" />
      <path d={crustBody} fill={pat(id, "d")} opacity={0.5} />
      <path d={line(TOP)} className="gz6-o" clipPath={`url(#${id}-clip)`} />
      <path d={line(LAND)} className="gz6-o" />
      <path d={`M${f1(TOP[iLith][0])} 150 H${W}`} className="gz6-o gz6-thin gz6-dash" />

      {/* magma: melting above the slab, rising to the arc */}
      <Fade delay={0.9}>
        <path d="M312 170 Q326 156 344 164 Q356 176 340 184 Q322 188 312 170 Z" className="gz6-magma" opacity={0.75} />
        <path d="M328 160 C326 140 318 126 322 108 C324 86 322 50 322 24" className="gz6-o gz6-red-s" style={{ strokeWidth: 4 }} />
        <ellipse cx={322} cy={104} rx={14} ry={8} className="gz6-magma gz6-o gz6-thin" />
        <path d="M312 22 Q322 8 332 22" className="gz6-o" />
      </Fade>
      <DrawArrow d="M300 182 L306 168" tone="blue" delay={1.0} />
      <DrawArrow d="M318 194 L322 180" tone="blue" delay={1.05} />

      <Foci />

      {/* motion */}
      <DrawArrow d="M18 156 H82" tone="lvl" delay={0.4} className="gz6-vec" />
      <DrawArrow d={`M${f1(TOP[at(380)][0] - 24)} ${f1(TOP[at(380)][1] + 28)} L${f1(TOP[at(420)][0] - 24)} ${f1(TOP[at(420)][1] + 28)}`} tone="lvl" delay={0.6} className="gz6-vec" />

      {/* depth scale */}
      {[100, 200, 300].map((km) => (
        <g key={km}>
          <path d={`M0 ${f1(dy(km))} h6`} className="gz6-o gz6-thin" />
          <text x={9} y={dy(km) + 4} className="gz6-num gz6-halo" style={{ fontSize: 11 }}>
            {km} km
          </text>
        </g>
      ))}

      {/* labels */}
      <Fade delay={1.2}>
        <text x={12} y={92} className="gz6-lbl gz6-sm gz6-blue-t">
          Tichý oceán
        </text>
        <text x={14} y={136} className="gz6-lbl gz6-b">
          oceánská deska Nazca
        </text>
        <text x={90} y={161} className="gz6-lbl gz6-sm gz6-b gz6-lvl-t">
          ≈ 7 cm za rok
        </text>
        <text x={W - 6} y={74} textAnchor="end" className="gz6-lbl gz6-b">
          pevninská deska
        </text>
        <text x={W - 6} y={90} textAnchor="end" className="gz6-lbl gz6-sm">
          Jihoamerická
        </text>
        <text x={W - 6} y={20} textAnchor="end" className="gz6-lbl gz6-b gz6-red-t">
          sopečný oblouk
        </text>
        <text x={W - 6} y={36} textAnchor="end" className="gz6-lbl gz6-sm">
          Andy
        </text>
        <text x={168} y={24} textAnchor="middle" className="gz6-lbl gz6-b">
          hlubokomořský příkop
        </text>
        <text x={168} y={40} textAnchor="middle" className="gz6-lbl gz6-sm">
          Atacamský, 8 065 m
        </text>
        <path d="M188 46 L198 118" className="gz6-lead" />
        <circle cx={198} cy={120} r={2} className="gz6-dot" />
        <text x={306} y={118} textAnchor="end" className="gz6-lbl gz6-b gz6-red-t gz6-halo">
          magma
        </text>
        <text x={360} y={180} className="gz6-lbl gz6-sm gz6-halo">
          voda z desky
        </text>
        <text x={360} y={196} className="gz6-lbl gz6-sm gz6-halo">
          snižuje teplotu tání
        </text>
        <text x={20} y={236} className="gz6-lbl gz6-sm">
          astenosféra
        </text>
      </Fade>
      <Fade delay={1.5}>
        <text x={150} y={300} className="gz6-lbl gz6-b gz6-red-t">
          ohniska zemětřesení
        </text>
        <text x={150} y={316} className="gz6-lbl gz6-sm">
          mělká u příkopu nejsilnější,
        </text>
        <text x={150} y={332} className="gz6-lbl gz6-sm">
          hlubší dál od pobřeží (až 700 km)
        </text>
        <path d="M290 292 L356 236" className="gz6-lead" />
        <text x={W / 2} y={H - 6} textAnchor="middle" className="gz6-lbl gz6-sm gz6-muted-t">
          hloubky v měřítku, výšky nad mořem převýšeny
        </text>
      </Fade>
    </>
  );
}

export default function SubductionZone() {
  return (
    <Figure label={LABEL} w={W} h={H} max={660} boost={false} replay>
      <Plate />
    </Figure>
  );
}

