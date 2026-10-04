import { GeoMap } from "../../../geo/GeoMap";
import "./gz3.css";

const LABEL =
  "Mapa světa s hlavními mořskými proudy: teplé proudy červeně, studené modře. Teplý Golfský proud teče od Floridy přes Atlantik a jako Severoatlantický proud ohřívá západní a severní Evropu až k Norsku. Studený Labradorský proud teče od Grónska podél Kanady k jihu. U západních pobřeží teče k rovníku studený Kalifornský proud u Severní Ameriky, Humboldtův (Peruánský) proud u Jižní Ameriky a Benguelský proud u jihozápadní Afriky; podél nich leží pobřežní pouště. Teplý Kuro-šio teče podél Japonska k severovýchodu. Kolem Antarktidy obtéká celou Zemi od západu k východu studený západní příhon.";

type LL = [number, number]; // [lon, lat]
interface Current {
  name: string;
  lines?: string[];
  warm: boolean;
  pts: LL[];
  at: LL;
  anchor: "start" | "middle" | "end";
}

const CURRENTS: Current[] = [
  {
    name: "Golfský proud",
    warm: true,
    pts: [[-81, 24.5], [-79.5, 29], [-75.5, 35], [-68, 39.5], [-55, 42], [-42, 46], [-30, 51], [-18, 56], [-6, 61], [4, 65], [12, 69]],
    at: [-58, 33],
    anchor: "start",
  },
  {
    name: "Labradorský",
    warm: false,
    pts: [[-61, 66], [-58, 60], [-54, 54], [-51.5, 48.5], [-50, 44]],
    at: [-61, 55],
    anchor: "end",
  },
  {
    name: "Kalifornský",
    warm: false,
    pts: [[-131, 48], [-128, 41], [-123, 34], [-117, 27], [-112, 22]],
    at: [-133, 34],
    anchor: "end",
  },
  {
    name: "Humboldtův",
    lines: ["Humboldtův", "(Peruánský)"],
    warm: false,
    pts: [[-77, -45], [-75.5, -36], [-73.5, -27], [-73, -18], [-78.5, -9], [-84, -3]],
    at: [-82, -28],
    anchor: "end",
  },
  {
    name: "Benguelský",
    warm: false,
    pts: [[15, -35], [12.5, -29], [11, -22], [10, -15], [8, -9]],
    at: [6, -27],
    anchor: "end",
  },
  {
    name: "Kuro-šio",
    warm: true,
    pts: [[122.5, 20], [124.5, 25], [130, 30.5], [137, 33.5], [143, 36.5], [152, 38.5], [165, 40]],
    at: [148, 30],
    anchor: "start",
  },
  {
    name: "západní příhon",
    warm: false,
    pts: [[-170, -56], [-130, -57], [-90, -58], [-60, -57], [-30, -53], [0, -51], [40, -50], [80, -51], [120, -53], [160, -55], [176, -56]],
    at: [-20, -60],
    anchor: "middle",
  },
];

/** smooth path (Catmull-Rom → Bézier) through projected points */
function smooth(P: [number, number][]) {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** arrow head at b pointing away from a */
function head(a: [number, number], b: [number, number], u: number) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const L = 12 * u;
  const W2 = 5.5 * u;
  const p = (dx: number, dy: number) =>
    `${(b[0] + dx * Math.cos(ang) - dy * Math.sin(ang)).toFixed(1)} ${(b[1] + dx * Math.sin(ang) + dy * Math.cos(ang)).toFixed(1)}`;
  return `M${p(2 * u, 0)} L${p(-L, W2)} L${p(-L * 0.7, 0)} L${p(-L, -W2)} Z`;
}

export default function OceanCurrents() {
  return (
    <div className="gz3 gz3-map">
      <GeoMap view="world" label={LABEL} legend={false}>
        {({ project, u }) => (
          <g className="gz3-currents">
            {CURRENTS.map((c) => {
              const P = c.pts.map(([lon, lat]) => project(lon, lat));
              const d = smooth(P);
              const mid = Math.floor(P.length / 2);
              const [lx, ly] = project(c.at[0], c.at[1]);
              const lines = c.lines ?? [c.name];
              return (
                <g key={c.name} className={c.warm ? "gz3-cur-warm" : "gz3-cur-cold"}>
                  <path d={d} className="gz3-cur" style={{ strokeWidth: 3.4 }} />
                  <path d={head(P[P.length - 2], P[P.length - 1], u)} className="gz3-cur-head" />
                  {P.length > 6 && <path d={head(P[mid - 1], P[mid], u)} className="gz3-cur-head" />}
                  <text
                    x={lx.toFixed(1)}
                    y={ly.toFixed(1)}
                    textAnchor={c.anchor}
                    className="gz3-cur-t"
                    style={{ fontSize: 13 * u, strokeWidth: 3.4 * u }}
                  >
                    {lines.map((l, k) => (
                      <tspan key={k} x={lx.toFixed(1)} dy={k ? 13.5 * u : 0}>
                        {l}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </GeoMap>
      <ul className="gz3-map-legend" aria-hidden="true">
        <li>
          <svg viewBox="0 0 34 12" width={34} height={12}>
            <g className="gz3-cur-warm">
              <path d="M2 6 H26" className="gz3-cur" style={{ strokeWidth: 3 }} />
              <path d="M24 1.5 L33 6 L24 10.5 Z" className="gz3-cur-head" />
            </g>
          </svg>
          teplý proud
        </li>
        <li>
          <svg viewBox="0 0 34 12" width={34} height={12}>
            <g className="gz3-cur-cold">
              <path d="M2 6 H26" className="gz3-cur" style={{ strokeWidth: 3 }} />
              <path d="M24 1.5 L33 6 L24 10.5 Z" className="gz3-cur-head" />
            </g>
          </svg>
          studený proud
        </li>
      </ul>
    </div>
  );
}
