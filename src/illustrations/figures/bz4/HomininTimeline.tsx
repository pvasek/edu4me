import { DrawArrow, Fade, Figure, Pop, cz, pat, smooth, useFig, type P2 } from "./kit";
import { projector } from "./world";

const LABEL =
  "Evoluce člověka. Nahoře časová osa v milionech let s lebkami z profilu: Sahelanthropus (asi před 7 miliony let, mozek asi 350 cm³), Australopithecus (4,2–2 mil. let, asi 450 cm³), Homo habilis (2,4–1,4 mil. let, asi 600 cm³), Homo erectus (1,9 mil. – 110 tis. let, asi 900 cm³), neandertálec (400–40 tis. let, asi 1 450 cm³) a Homo sapiens (od 300 tis. let po dnešek, asi 1 350 cm³). Mozek se zvětšuje, obličej se zkracuje a čelo napřimuje. Dole mapa: Homo erectus opustil Afriku už před 1,8 milionu let; moderní člověk vznikl v Africe a asi před 70–60 tisíci lety se rozšířil do Asie, před 65–50 tisíci lety do Austrálie, před 45 tisíci lety do Evropy, kde potkal neandertálce, a před 20–15 tisíci lety přes Beringii do Ameriky.";

const W = 520;
const H = 616;
const T0 = 7.4; // Ma, left end of the axis
const AX0 = 150;
const AX1 = 500;
const X = (ma: number) => AX0 + ((T0 - ma) / T0) * (AX1 - AX0);
const AXY = 320;

interface Sk {
  name: string;
  from: number;
  to: number;
  cc: number;
  L: number; // vault length
  h: number; // vault height
  fh: number; // forehead height (0–1)
  brow: number; // brow ridge (0–1)
  prog: number; // jaw prognathism (0–1)
  chin: number; // chin (0–1)
  right?: boolean; // label right-aligned at the bar end
}
const SPECIES: Sk[] = [
  { name: "Sahelanthropus", from: 7.2, to: 6.8, cc: 350, L: 38, h: 12, fh: 0.15, brow: 1, prog: 1.1, chin: 0 },
  { name: "Australopithecus", from: 4.2, to: 2.0, cc: 450, L: 38, h: 14, fh: 0.25, brow: 0.6, prog: 1.2, chin: 0 },
  { name: "Homo habilis", from: 2.4, to: 1.4, cc: 600, L: 42, h: 17, fh: 0.4, brow: 0.5, prog: 0.7, chin: 0 },
  { name: "Homo erectus", from: 1.9, to: 0.11, cc: 900, L: 48, h: 16, fh: 0.3, brow: 1, prog: 0.5, chin: 0 },
  { name: "neandertálec", from: 0.4, to: 0.04, cc: 1450, L: 52, h: 20, fh: 0.45, brow: 0.8, prog: 0.4, chin: 0.1, right: true },
  { name: "Homo sapiens", from: 0.3, to: 0, cc: 1350, L: 42, h: 27, fh: 1, brow: 0, prog: 0, chin: 1, right: true },
];

/** a skull in profile facing right, origin at the ear opening */
function skull(s: Sk) {
  const { L, h, fh, brow, prog, chin } = s;
  const pts: P2[] = [
    [-L * 0.48, 2],
    [-L * 0.42, -h * 0.55],
    [-L * 0.1, -h],
    [L * 0.25, -h * (0.7 + fh * 0.25)],
    [L * 0.42, -h * (0.25 + fh * 0.45)],
    [L * 0.5 + brow * 4, -5 - brow * 1.5],
    [L * 0.47, 0],
    [L * 0.5 + prog * 10, 9],
    [L * 0.47 + prog * 10, 15],
    [L * 0.42 + prog * 6 + chin * 5, 24],
    [L * 0.1, 25],
    [0, 13],
    [-L * 0.25, 9],
  ];
  return smooth(pts, true);
}

function Skull({ s, x, y }: { s: Sk; x: number; y: number }) {
  const { id } = useFig();
  const d = skull(s);
  return (
    <g transform={`translate(${x} ${y}) scale(0.9)`}>
      <path d={d} className="bz4-o bz4-hm-bone" />
      <path d={d} fill={pat(id, "d")} opacity={0.35} className="bz4-nohit" />
      <circle cx={s.L * 0.4} cy={-0.5} r={3.4} className="bz4-o bz4-thin bz4-hm-orbit" />
      <path d={`M${s.L * 0.1} 13 C${s.L * 0.25} 12 ${s.L * 0.38 + s.prog * 8} 13 ${s.L * 0.44 + s.prog * 9} 15`} className="bz4-o bz4-thin" />
      <circle cx={0} cy={4} r={1.6} className="bz4-an-eye" />
    </g>
  );
}

function Timeline() {
  return (
    <g>
      <text x={10} y={22} className="bz4-lbl bz4-b">lebka a objem mozku</text>
      <text x={AX1} y={22} textAnchor="end" className="bz4-lbl bz4-sm bz4-muted-t">doba výskytu</text>
      {/* axis */}
      <DrawArrow d={`M${AX0} ${AXY} H${AX1 + 12}`} className="bz4-axis" />
      {[7, 6, 5, 4, 3, 2, 1, 0].map((m) => (
        <g key={m}>
          <line x1={X(m)} x2={X(m)} y1={AXY} y2={AXY + 5} className="bz4-o bz4-thin" />
          <line x1={X(m)} x2={X(m)} y1={40} y2={AXY} className="bz4-hm-grid" />
          <text x={X(m)} y={AXY + 19} textAnchor="middle" className="bz4-num">
            {m}
          </text>
        </g>
      ))}
      <text x={AX1 + 12} y={AXY + 38} textAnchor="end" className="bz4-lbl bz4-sm">
        milionů let zpět → dnes
      </text>
      {SPECIES.map((s, i) => {
        const y = 62 + i * 44;
        const x0 = X(s.from);
        const x1 = X(s.to);
        return (
          <Pop key={s.name} delay={0.1 + i * 0.15}>
            <Skull s={s} x={40} y={y + 2} />
            <text x={96} y={y + 4} className="bz4-hm-cc">
              {cz(s.cc)}
            </text>
            <text x={96} y={y + 18} className="bz4-hm-cc bz4-hm-unit">
              cm³
            </text>
            <rect x={x0} y={y} width={Math.max(5, x1 - x0)} height={11} rx={5} className={`bz4-o bz4-thin ${s.name === "Homo sapiens" ? "bz4-hm-bar-s" : "bz4-hm-bar"}`} />
            <text
              x={s.right ? x1 : x0}
              y={y - 5}
              textAnchor={s.right ? "end" : "start"}
              className={`bz4-lbl bz4-sm bz4-b ${s.name.startsWith("Homo") || s.name === "Sahelanthropus" || s.name === "Australopithecus" ? "bz4-it" : ""}`}
            >
              {s.name}
            </text>
          </Pop>
        );
      })}
    </g>
  );
}

function OutOfAfrica() {
  const { id } = useFig();
  const MX = 10;
  const MY = 384;
  const pr = projector(MX, MY, W - 20);
  const P = (lon: number, lat: number) => pr.p(lon, lat).map((v) => v.toFixed(1)).join(" ");
  const pt = pr.p;
  const [ax, ay] = pt(36, 2);
  const route = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => P(lo, la)).join(" L");
  const sapiens: { d: string; delay: number }[] = [
    { d: route([[36, 2], [42, 20], [46, 30]]), delay: 0.5 },
    { d: route([[46, 30], [30, 40], [12, 48]]), delay: 0.9 },
    { d: route([[46, 30], [75, 25], [105, 30], [118, 38]]), delay: 0.9 },
    { d: route([[75, 25], [100, 10], [115, -5], [132, -22]]), delay: 1.2 },
    { d: route([[118, 38], [140, 55], [175, 64]]), delay: 1.3 },
    { d: route([[-168, 64], [-125, 55], [-102, 40], [-80, 10], [-62, -20]]), delay: 1.5 },
  ];
  return (
    <g>
      <text x={10} y={MY - 14} className="bz4-lbl bz4-b">z Afriky do celého světa</text>
      <rect x={MX} y={MY} width={W - 20} height={pr.h} rx={4} className="bz4-hm-sea" />
      <path d={pr.land} className="bz4-o bz4-thin bz4-hm-land" />
      <path d={pr.land} fill={pat(id, "dots")} opacity={0.6} />
      {/* Neanderthal range */}
      <ellipse cx={pt(25, 46)[0]} cy={pt(25, 46)[1]} rx={30} ry={11} className="bz4-hm-nean" />
      {/* Homo erectus, much earlier */}
      <DrawArrow d={route([[36, 2], [40, 22], [44, 41]])} tone="muted" delay={0.3} className="bz4-hm-erectus" />
      <DrawArrow d={route([[40, 22], [80, 22], [104, 2], [110, -6]])} tone="muted" delay={0.3} className="bz4-hm-erectus" />
      {sapiens.map((r, i) => (
        <DrawArrow key={i} d={r.d} tone="lvl" delay={r.delay} className="bz4-hm-route" />
      ))}
      <circle cx={ax} cy={ay} r={7} className="bz4-hm-origin" />
      <Fade delay={1.6}>
        <text x={ax - 12} y={ay + 34} textAnchor="end" className="bz4-hm-t bz4-lvl-t">Afrika: 300 tis.</text>
        <text x={pt(4, 42)[0]} y={pt(4, 42)[1]} textAnchor="end" className="bz4-hm-t">45 tis.</text>
        <text x={pt(100, 47)[0]} y={pt(100, 47)[1]} textAnchor="middle" className="bz4-hm-t">60 tis.</text>
        <text x={pt(140, -32)[0]} y={pt(140, -32)[1] + 10} textAnchor="middle" className="bz4-hm-t">65–50 tis.</text>
        <text x={pt(-100, 25)[0] + 6} y={pt(-100, 25)[1]} className="bz4-hm-t">20–15 tis.</text>
        <text x={pt(25, 46)[0]} y={pt(25, 46)[1] - 14} textAnchor="middle" className="bz4-hm-t bz4-hm-nean-t">neandertálci</text>
      </Fade>
      <Fade delay={0.4}>
        <path d={`M${MX + 8} ${MY + pr.h + 22} h26`} className="bz4-hm-route-key" />
        <text x={MX + 40} y={MY + pr.h + 27} className="bz4-lbl bz4-sm">
          <tspan className="bz4-it">Homo sapiens</tspan> (tisíce let zpět)
        </text>
        <path d={`M${MX + 250} ${MY + pr.h + 22} h26`} className="bz4-hm-erectus-key" />
        <text x={MX + 282} y={MY + pr.h + 27} className="bz4-lbl bz4-sm">
          <tspan className="bz4-it">H. erectus</tspan>, 1,8 mil.
        </text>
      </Fade>
    </g>
  );
}

export default function HomininTimeline() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={640} replay>
      <Timeline />
      <OutOfAfrica />
    </Figure>
  );
}
