import { Draw, DrawArrow, Fade, Figure, Travel, f1, pat, useFig, useLive } from "./kit";

const LABEL =
  "Polární tryskové proudění kolem severního pólu při pohledu shora: úzký pás velmi rychlého západního větru ve výšce 9 až 12 km obtéká pól od západu k východu a vlní se v takzvaných Rossbyho vlnách. Uvnitř je studený polární vzduch, vně teplý vzduch mírných šířek. V brázdě se proud prohne k jihu a studený vzduch pronikne daleko na jih; v hřebeni se prohne k severu a teplý vzduch pronikne na sever. Když proud zeslábne a vlna se zasekne na místě (blokující tlaková výše), drží se pod hřebenem týdny stejné počasí – vlna veder a sucho, pod brázdou dlouhé chladno nebo deště.";

const W = 440;
const H = 548;
const CX = 220;
const CY = 262;
const R0 = 136;
const A = 30;
const N = 5;
/** jet radius at angle t (radians, screen coordinates) */
const rj = (t: number) => R0 - A * Math.sin(N * t);
const pt = (r: number, t: number) => [CX + r * Math.cos(t), CY + r * Math.sin(t)] as const;
const deg = (d: number) => (d * Math.PI) / 180;

/** the jet as a closed path, drawn counter-clockwise on screen (west → east seen from above the pole) */
function jetPath() {
  let d = "";
  const n = 180;
  for (let i = 0; i <= n; i++) {
    const t = -(i / n) * Math.PI * 2;
    const [x, y] = pt(rj(t), t);
    d += `${i ? "L" : "M"}${f1(x)} ${f1(y)} `;
  }
  return d + "Z";
}
const JET = jetPath();

/** position and heading of a resting chevron at fraction `ph` of the lap */
function chev(ph: number) {
  const t = -ph * Math.PI * 2;
  const [x0, y0] = pt(rj(t), t);
  const [x1, y1] = pt(rj(t - 0.01), t - 0.01);
  const a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return `translate(${f1(x0)} ${f1(y0)}) rotate(${f1(a)})`;
}

function Chevron() {
  return <path d="M-6 -6 L3 0 L-6 6" className="gz6-o gz6-lvl-s" style={{ strokeWidth: 2.4 }} />;
}

function Sun({ x, y }: { x: number; y: number }) {
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    rays += `M${f1(x + Math.cos(a) * 13)} ${f1(y + Math.sin(a) * 13)} L${f1(x + Math.cos(a) * 19)} ${f1(y + Math.sin(a) * 19)} `;
  }
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="gz6-sun gz6-o" />
      <path d={rays} className="gz6-o gz6-acc-s" style={{ strokeWidth: 1.8 }} />
    </g>
  );
}

function Flake({ x, y }: { x: number; y: number }) {
  let d = "";
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    d += `M${f1(x - Math.cos(a) * 9)} ${f1(y - Math.sin(a) * 9)} L${f1(x + Math.cos(a) * 9)} ${f1(y + Math.sin(a) * 9)} `;
  }
  return <path d={d} className="gz6-o gz6-blue-s" style={{ strokeWidth: 2 }} />;
}

function Plate() {
  const { id } = useFig();
  const live = useLive();
  // latitude circles: r = (90° − φ) · 3,2
  const lat = (phi: number) => (90 - phi) * 3.2;
  // troughs (jet furthest from the pole) at 54°, 126°, 198°, 270°, 342°; ridges at 18°, 90°, 162°, 234°, 306°
  const at = (r: number, d: number) => pt(r, deg(d));
  return (
    <>
      {/* warm air outside, cold air inside the jet */}
      <circle cx={CX} cy={CY} r={lat(28)} className="gz6-warm" opacity={0.55} />
      <path d={JET} className="gz6-cold" opacity={0.75} />
      <path d={JET} fill={pat(id, "hi")} opacity={0.5} />
      {[30, 45, 60, 75].map((p) => (
        <circle key={p} cx={CX} cy={CY} r={lat(p)} className="gz6-grid" fill="none" />
      ))}
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = pt(lat(28), deg(a));
        return <path key={a} d={`M${CX} ${CY} L${f1(x)} ${f1(y)}`} className="gz6-grid" />;
      })}
      <circle cx={CX} cy={CY} r={lat(28)} className="gz6-o gz6-thin" fill="none" />
      <text x={CX - 4} y={CY + lat(60) - 5} textAnchor="end" className="gz6-num gz6-faint">
        60° s. š.
      </text>
      <text x={CX - 4} y={CY + lat(30) - 5} textAnchor="end" className="gz6-num gz6-faint">
        30° s. š.
      </text>

      {/* the jet */}
      <Draw d={JET} className="gz6-curve gz6-curve-lvl" delay={0.1} style={{ strokeWidth: 5 }} />
      <Fade delay={1}>
        {[0.05, 0.25, 0.45, 0.65, 0.85].map((ph) =>
          live ? (
            <Travel key={ph} path={JET} dur={18} phase={ph} rotate rest={[0, 0]}>
              <Chevron />
            </Travel>
          ) : (
            <g key={ph} transform={chev(ph)}>
              <Chevron />
            </g>
          ),
        )}
      </Fade>

      {/* pole */}
      <circle cx={CX} cy={CY} r={4} className="gz6-spot" style={{ fill: "var(--ink)" }} />
      <text x={CX} y={CY + 20} textAnchor="middle" className="gz6-lbl gz6-b gz6-halo">
        severní pól
      </text>
      <text x={CX} y={CY - 26} textAnchor="middle" className="gz6-lbl gz6-blue-t gz6-b gz6-halo">
        studený polární vzduch
      </text>

      {/* trough: cold air south */}
      <DrawArrow d={`M${f1(at(112, 54)[0])} ${f1(at(112, 54)[1])} L${f1(at(176, 54)[0])} ${f1(at(176, 54)[1])}`} tone="blue" delay={0.9} className="gz6-vec" />
      <Fade delay={1.0}>
        <Flake x={at(128, 68)[0]} y={at(128, 68)[1]} />
        <text x={W - 6} y={482} textAnchor="end" className="gz6-lbl gz6-b">
          brázda
        </text>
        <text x={W - 6} y={498} textAnchor="end" className="gz6-lbl gz6-sm">
          studený vzduch na jih
        </text>
        <path d={`M${W - 40} 468 L${f1(at(186, 54)[0])} ${f1(at(186, 54)[1])}`} className="gz6-lead" />
      </Fade>

      {/* ridge: warm air north */}
      <DrawArrow d={`M${f1(at(190, 306)[0])} ${f1(at(190, 306)[1])} L${f1(at(118, 306)[0])} ${f1(at(118, 306)[1])}`} tone="red" delay={1.1} className="gz6-vec" />
      <Fade delay={1.2}>
        <text x={W - 6} y={22} textAnchor="end" className="gz6-lbl gz6-b">
          hřeben
        </text>
        <text x={W - 6} y={40} textAnchor="end" className="gz6-lbl gz6-sm">
          teplý vzduch na sever
        </text>
      </Fade>

      {/* a blocked ridge: heatwave */}
      <Fade delay={1.4}>
        <Sun x={at(160, 168)[0]} y={at(160, 168)[1]} />
        <text x={at(160, 168)[0]} y={at(160, 168)[1] + 36} textAnchor="middle" className="gz6-lbl gz6-b gz6-red-t gz6-halo">
          V
        </text>
      </Fade>
      <Fade delay={1.6}>
        <text x={8} y={196} className="gz6-lbl gz6-b gz6-red-t gz6-halo">
          zaseklý hřeben
        </text>
        <text x={8} y={212} className="gz6-lbl gz6-sm gz6-halo">
          tlaková výše (V) týdny
        </text>
        <text x={8} y={228} className="gz6-lbl gz6-sm gz6-halo">
          na místě → vlna veder
        </text>
      </Fade>

      {/* header and note */}
      <Fade delay={0.2}>
        <text x={6} y={22} className="gz6-lbl gz6-b gz6-lvl-t">
          polární tryskové proudění
        </text>
        <text x={6} y={40} className="gz6-lbl gz6-sm">
          9–12 km nad zemí, obvykle 100–250 km/h
        </text>
        <text x={6} y={482} className="gz6-lbl gz6-b gz6-red-t">
          teplý vzduch
        </text>
        <text x={6} y={498} className="gz6-lbl gz6-sm gz6-red-t">
          mírných šířek
        </text>
      </Fade>
      <Fade delay={1.8}>
        <text x={W / 2} y={H - 26} textAnchor="middle" className="gz6-lbl gz6-sm">
          proud obtéká pól od západu k východu a vlní se (Rossbyho vlny);
        </text>
        <text x={W / 2} y={H - 9} textAnchor="middle" className="gz6-lbl gz6-sm">
          když zeslábne, vlny se zpomalí a počasí se zasekne
        </text>
      </Fade>
    </>
  );
}

export default function JetStream() {
  return (
    <Figure label={LABEL} w={W} h={H} max={600} boost={false} replay>
      <Plate />
    </Figure>
  );
}
