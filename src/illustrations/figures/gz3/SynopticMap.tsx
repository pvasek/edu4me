import { GeoMap } from "../../../geo/GeoMap";
import { VB_W, getView } from "../../../geo/frame";
import "./gz3.css";

const LABEL =
  "Zjednodušená synoptická mapa Evropy. Tlaková níže N s tlakem 987 hPa leží severozápadně od Skotska, tlaková výše H s tlakem 1 028 hPa nad Polskem a Ukrajinou. Izobary po 5 hPa spojují místa se stejným tlakem; čím jsou blíž u sebe, tím silnější vítr. Z níže vybíhá okluzní fronta (fialová, střídavě trojúhelníky a půlkruhy), z jejíhož konce pokračuje teplá fronta (červená s půlkruhy) k jihovýchodu přes Dánsko a studená fronta (modrá s trojúhelníky) k jihozápadu přes Anglii nad Atlantik. Značky na frontách ukazují, kam se fronta pohybuje. Mezi teplou a studenou frontou je teplý sektor.";

type XY = [number, number];
type Proj = (lon: number, lat: number) => XY;

const LOW: XY = [-8, 60];
const HIGH: XY = [19, 54];
const TRIPLE: XY = [3, 58];
const OCCLUDED: XY[] = [LOW, [-3, 60], TRIPLE];
const WARM: XY[] = [TRIPLE, [7, 56.5], [12, 54.6], [17, 53.2]];
const COLD: XY[] = [TRIPLE, [0, 55], [-4, 52], [-9, 49], [-15, 46.5]];

/** sea-level pressure (hPa) at a point of the viewBox */
function field(P: Proj, L: XY, H: XY) {
  const A = P(-28, 38);
  const g = (p: XY, c: XY, s: number) => Math.exp(-((p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2) / (2 * s * s));
  return (p: XY) => 1012 - 34 * g(p, L, 190) + 22 * g(p, H, 230) + 10 * g(p, A, 200);
}

/** isobars by marching squares, one path per level */
function isobars(f: (p: XY) => number, W: number, H: number, levels: number[]) {
  const s = 10;
  const nx = Math.ceil(W / s);
  const ny = Math.ceil(H / s);
  const v: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    v.push([]);
    for (let i = 0; i <= nx; i++) v[j].push(f([i * s, j * s]));
  }
  return levels.map((lv) => {
    let d = "";
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const c = [v[j][i], v[j][i + 1], v[j + 1][i + 1], v[j + 1][i]];
        const pts: XY[] = [];
        const corner: XY[] = [
          [i * s, j * s],
          [(i + 1) * s, j * s],
          [(i + 1) * s, (j + 1) * s],
          [i * s, (j + 1) * s],
        ];
        for (let k = 0; k < 4; k++) {
          const a = c[k];
          const b = c[(k + 1) % 4];
          if ((a < lv) !== (b < lv)) {
            const t = (lv - a) / (b - a);
            const pa = corner[k];
            const pb = corner[(k + 1) % 4];
            pts.push([pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t]);
          }
        }
        if (pts.length >= 2) d += `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}L${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(1)}`;
        if (pts.length === 4) d += `M${pts[2][0].toFixed(1)} ${pts[2][1].toFixed(1)}L${pts[3][0].toFixed(1)} ${pts[3][1].toFixed(1)}`;
      }
    return { lv, d };
  });
}

/** a front line with its symbols on the side facing `ahead` */
function Front({ pts, kind, ahead, P, u, start }: { pts: XY[]; kind: "cold" | "warm" | "occ"; ahead: XY; P: Proj; u: number; start?: XY }) {
  // densify the projected line
  const raw = pts.map((p) => P(...p));
  if (start) raw[0] = start;
  const line: XY[] = [];
  for (let i = 0; i < raw.length - 1; i++)
    for (let t = 0; t < 1; t += 0.05)
      line.push([raw[i][0] + (raw[i + 1][0] - raw[i][0]) * t, raw[i][1] + (raw[i + 1][1] - raw[i][1]) * t]);
  line.push(raw[raw.length - 1]);
  const d = "M" + line.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L");
  const A = P(...ahead);
  const step = 30 * u;
  const a = 6 * u;
  const h = 9 * u;
  const marks: string[] = [];
  let acc = step * 0.6;
  let k = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const p0 = line[i];
    const p1 = line[i + 1];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    let pos = 0;
    while (acc <= pos + len && len > 0) {
      const t = (acc - pos) / len;
      const c: XY = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
      const tx = (p1[0] - p0[0]) / len;
      const ty = (p1[1] - p0[1]) / len;
      let nx = -ty;
      let ny = tx;
      if ((A[0] - c[0]) * nx + (A[1] - c[1]) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const b0: XY = [c[0] - tx * a, c[1] - ty * a];
      const b1: XY = [c[0] + tx * a, c[1] + ty * a];
      const tri = kind === "cold" || (kind === "occ" && k % 2 === 0);
      const f = (p: XY) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
      if (tri) marks.push(`M${f(b0)}L${f([c[0] + nx * h, c[1] + ny * h])}L${f(b1)}Z`);
      else {
        const sweep = nx * ty - ny * tx > 0 ? 1 : 0;
        marks.push(`M${f(b0)}A${a.toFixed(1)} ${a.toFixed(1)} 0 0 ${sweep} ${f(b1)}Z`);
      }
      k++;
      acc += step;
    }
    acc -= len;
  }
  return (
    <g className={`gz3-front-${kind}`}>
      <path d={d} className={`gz3-front-l gz3-front-${kind}`} style={{ strokeWidth: 2.8 }} />
      <path d={marks.join("")} className={`gz3-front-m gz3-front-${kind}`} />
    </g>
  );
}

/** the point at `dist` from `c` along the ray at angle `ang` where the pressure crosses `lv` */
function onIsobar(f: (p: XY) => number, c: XY, ang: number, lv: number): XY | null {
  let prev = f(c);
  for (let r = 4; r < 600; r += 2) {
    const p: XY = [c[0] + Math.cos(ang) * r, c[1] + Math.sin(ang) * r];
    const v = f(p);
    if ((prev < lv) !== (v < lv)) return p;
    prev = v;
  }
  return null;
}

function Overlay({ P, u }: { P: Proj; u: number }) {
  const g = getView("europe");
  const H = g.H;
  const extreme = (fn: (p: XY) => number, c: XY, sign: 1 | -1): XY => {
    let best = c;
    let bv = fn(c) * sign;
    for (let dx = -200; dx <= 200; dx += 4)
      for (let dy = -200; dy <= 200; dy += 4) {
        const q: XY = [c[0] + dx, c[1] + dy];
        const v = fn(q) * sign;
        if (v > bv) {
          bv = v;
          best = q;
        }
      }
    return best;
  };
  // the gaussians shift each other's extremes: N and H go to the true minimum and maximum
  const f = field(P, P(...LOW), P(...HIGH));
  const L = extreme(f, P(...LOW), -1);
  const Hc = extreme(f, P(...HIGH), 1);
  const levels = [985, 990, 995, 1000, 1005, 1010, 1015, 1020, 1025, 1030];
  const iso = isobars(f, VB_W, H, levels);
  const lowV = Math.round(f(L));
  const highV = Math.round(f(Hc));
  const tags: { lv: number; p: XY }[] = [];
  for (const lv of [990, 1000, 1010]) {
    const p = onIsobar(f, L, (-160 * Math.PI) / 180, lv);
    if (p && p[0] > 34 * u && lv - lowV >= 7) tags.push({ lv, p });
  }
  for (const lv of [1020, 1030]) {
    const p = onIsobar(f, Hc, (60 * Math.PI) / 180, lv);
    if (p && p[0] < VB_W - 34 * u && highV - lv >= 7) tags.push({ lv, p });
  }
  const t = (size: number) => ({ fontSize: size * u, strokeWidth: 3.2 * u });
  return (
    <g className="gz3-synop">
      {iso.map((i) => (
        <path key={i.lv} d={i.d} className="gz3-isobar-m" style={{ strokeWidth: 1.1 }} />
      ))}
      {tags.map((tg) => (
        <text key={tg.lv} x={tg.p[0].toFixed(1)} y={(tg.p[1] + 4 * u).toFixed(1)} textAnchor="middle" className="gz3-iso-m" style={t(10.5)}>
          {tg.lv}
        </text>
      ))}
      <Front pts={COLD} kind="cold" ahead={[12, 48]} P={P} u={u} />
      <Front pts={WARM} kind="warm" ahead={[16, 60]} P={P} u={u} />
      <Front pts={OCCLUDED} kind="occ" ahead={[2, 66]} P={P} u={u} start={L} />
      <text x={L[0].toFixed(1)} y={(L[1] + 9 * u).toFixed(1)} textAnchor="middle" className="gz3-synop-c gz3-pres-n" style={t(26)}>
        N
      </text>
      <text x={L[0].toFixed(1)} y={(L[1] + 24 * u).toFixed(1)} textAnchor="middle" className="gz3-iso-m" style={t(11)}>
        {lowV}
      </text>
      <text x={Hc[0].toFixed(1)} y={(Hc[1] + 9 * u).toFixed(1)} textAnchor="middle" className="gz3-synop-c gz3-pres-h" style={t(26)}>
        H
      </text>
      <text x={Hc[0].toFixed(1)} y={(Hc[1] + 24 * u).toFixed(1)} textAnchor="middle" className="gz3-iso-m" style={t(11)}>
        {highV}
      </text>
      {(() => {
        const [x, y] = P(3, 52.6);
        return (
          <text x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle" className="gz3-synop-t" style={t(12)}>
            teplý sektor
          </text>
        );
      })()}
    </g>
  );
}

function Sym({ kind }: { kind: "cold" | "warm" | "occ" }) {
  const marks =
    kind === "cold"
      ? "M6 9 L11 2 L16 9 Z M22 9 L27 2 L32 9 Z"
      : kind === "warm"
        ? "M6 9 A5 5 0 0 1 16 9 Z M22 9 A5 5 0 0 1 32 9 Z"
        : "M6 9 L11 2 L16 9 Z M22 9 A5 5 0 0 1 32 9 Z";
  return (
    <svg viewBox="0 0 38 12" width={38} height={12} aria-hidden="true">
      <path d="M1 9 H37" className={`gz3-front-l gz3-front-${kind}`} />
      <path d={marks} className={`gz3-front-m gz3-front-${kind}`} />
    </svg>
  );
}

export default function SynopticMap() {
  return (
    <div className="gz3 gz3-map">
      <GeoMap view="europe" label={LABEL} legend={false}>
        {({ project, u }) => <Overlay P={project} u={u} />}
      </GeoMap>
      <ul className="gz3-map-legend" aria-hidden="true">
        <li>
          <Sym kind="cold" /> studená fronta
        </li>
        <li>
          <Sym kind="warm" /> teplá fronta
        </li>
        <li>
          <Sym kind="occ" /> okluzní fronta
        </li>
        <li>
          <svg viewBox="0 0 38 12" width={38} height={12} aria-hidden="true">
            <path d="M1 8 C10 2 26 2 37 8" className="gz3-isobar" />
          </svg>
          izobary po 5 hPa
        </li>
      </ul>
      <p className="gz3-strip-note gz3-map-note">
        Značky ukazují, kam fronta postupuje. Husté izobary = silný vítr.
      </p>
    </div>
  );
}
