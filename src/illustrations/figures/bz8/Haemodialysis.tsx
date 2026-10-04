import { DrawArrow, Fade, Figure, Lbl, Pop, f1, pat, rng, useFig, useLive } from "./kit";

const LABEL =
  "Hemodialýza. Krev odtéká jehlou z cévy v paži, pumpa ji žene do dialyzátoru a vyčištěná se vrací zpět do žíly. V dialyzátoru teče krev shora dolů tisíci tenkých dutých vláken a kolem nich proudí zdola nahoru dialyzační roztok – protiproud. Zvětšený výřez stěny vlákna ukazuje polopropustnou membránu: močovina, draselné ionty a voda projdou póry do roztoku, krvinky a bílkoviny jsou příliš velké a zůstanou v krvi. Glukózy je v roztoku stejně jako v krvi, takže z krve neodchází.";

const W = 420;
const H = 650;
const DX = 244; // dialyser left
const DW = 60;
const DT = 62;
const DB = 292;
const FIBRES = [252, 263, 274, 285, 296].map((x) => x - 2);

function Arm() {
  const { id } = useFig();
  const d =
    "M30 22 C26 90 28 190 36 268 C38 284 30 296 34 312 C40 340 86 344 92 318 C96 300 86 286 86 268 C92 190 94 90 90 22Z";
  return (
    <g>
      <path d={d} className="bz8-skin" />
      <path d={d} fill={pat(id, "d")} opacity={0.25} />
      <path d={d} className="bz8-o" />
      <path d="M40 300 C52 306 72 306 84 300 M44 316 C56 322 72 322 82 316" className="bz8-o bz8-thin" />
      <path d="M56 30 C54 120 56 200 58 280" className="bz8-vessel bz8-vessel-a" />
      <path d="M68 30 C70 120 70 200 68 280" className="bz8-vessel bz8-vessel-v" />
    </g>
  );
}

function Dialyser() {
  const { id } = useFig();
  const live = useLive();
  return (
    <g>
      {/* dialysate around the fibres */}
      <rect x={DX} y={DT} width={DW} height={DB - DT} className="bz8-dialysate" />
      <rect x={DX} y={DT} width={DW} height={DB - DT} fill={pat(id, "h")} opacity={0.5} />
      {FIBRES.map((x) => (
        <rect key={x} x={x} y={DT - 6} width={5} height={DB - DT + 12} rx={2} className="bz8-fibre" />
      ))}
      {live &&
        FIBRES.map((x) => (
          <path key={`f${x}`} d={`M${x + 2.5} ${DT - 4} V${DB + 4}`} className="bz8-flow bz8-flow-blood" />
        ))}
      {live &&
        FIBRES.slice(0, 4).map((x) => (
          <path key={`d${x}`} d={`M${x + 8} ${DB} V${DT}`} className="bz8-flow bz8-flow-dial" />
        ))}
      <rect x={DX} y={DT} width={DW} height={DB - DT} rx={4} className="bz8-o" />
      {/* end caps */}
      <path d={`M${DX - 4} ${DT} H${DX + DW + 4} M${DX - 4} ${DB} H${DX + DW + 4}`} className="bz8-o" style={{ strokeWidth: 3 }} />
      <path d={`M${DX + 6} ${DT} Q${DX + DW / 2} ${DT - 18} ${DX + DW - 6} ${DT}`} className="bz8-blood-f bz8-o" />
      <path d={`M${DX + 6} ${DB} Q${DX + DW / 2} ${DB + 18} ${DX + DW - 6} ${DB}`} className="bz8-blood-f bz8-o" />
    </g>
  );
}

function Pump({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={19} className="bz8-fill2 bz8-o" />
      <g className="bz8-spin" style={{ transformOrigin: `${x}px ${y}px` }}>
        {[0, 120, 240].map((a) => {
          const r = (a * Math.PI) / 180;
          return <circle key={a} cx={f1(x + Math.cos(r) * 11)} cy={f1(y + Math.sin(r) * 11)} r={4.5} className="bz8-fill bz8-o bz8-thin" />;
        })}
      </g>
      <circle cx={x} cy={y} r={2.5} className="bz8-spot" />
    </g>
  );
}

// ------------------------------------------------------------------ magnified membrane
const BX = 16;
const BY = 380;
const BW = W - 32;
const BH = 168;
const MX = W / 2;

function Rbc({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={15} ry={9} className="bz8-rbc bz8-o bz8-thin" />
      <ellipse cx={x} cy={y} rx={7} ry={3.5} className="bz8-o bz8-thin" style={{ opacity: 0.6 }} />
    </g>
  );
}
function Protein({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 9} ${y} q-2 -9 7 -10 q6 -6 11 1 q8 2 4 9 q3 8 -6 9 q-6 5 -11 -1 q-8 -1 -5 -8Z`}
      className="bz8-protein bz8-o bz8-thin"
    />
  );
}
const Urea = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3.2} className="bz8-urea" />;
const Kion = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3.2} className="bz8-kion" />;
function Glu({ x, y }: { x: number; y: number }) {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    d += `${i ? "L" : "M"}${f1(x + Math.cos(a) * 5)} ${f1(y + Math.sin(a) * 5)} `;
  }
  return <path d={d + "Z"} className="bz8-glu bz8-o bz8-thin" />;
}

function Inset() {
  const { id } = useFig();
  const R = rng(7);
  const left = (n: number) =>
    Array.from({ length: n }, () => [BX + 14 + R() * (MX - BX - 40), BY + 36 + R() * (BH - 52)] as [number, number]);
  const right = (n: number) =>
    Array.from({ length: n }, () => [MX + 22 + R() * (BX + BW - MX - 36), BY + 36 + R() * (BH - 52)] as [number, number]);
  const ureaL = left(7);
  const ureaR = right(2);
  const kL = left(4);
  const kR = right(1);
  const gL = left(3);
  const gR = right(3);
  return (
    <g>
      <rect x={BX} y={BY} width={MX - BX} height={BH} className="bz8-blood-soft" />
      <rect x={MX} y={BY} width={BX + BW - MX} height={BH} className="bz8-dialysate" />
      <rect x={MX} y={BY} width={BX + BW - MX} height={BH} fill={pat(id, "h")} opacity={0.4} />
      {/* membrane with pores */}
      {Array.from({ length: 8 }, (_, i) => {
        const y0 = BY + i * (BH / 8) + 4;
        return <rect key={i} x={MX - 4} y={y0} width={8} height={BH / 8 - 8} rx={2} className="bz8-membrane" />;
      })}
      <Rbc x={BX + 46} y={BY + 60} />
      <Rbc x={BX + 120} y={BY + 118} />
      <Rbc x={BX + 70} y={BY + 140} />
      <Protein x={BX + 136} y={BY + 62} />
      <Protein x={BX + 40} y={BY + 104} />
      {ureaL.map(([x, y], i) => <Urea key={`u${i}`} x={x} y={y} />)}
      {ureaR.map(([x, y], i) => <Urea key={`ur${i}`} x={x} y={y} />)}
      {kL.map(([x, y], i) => <Kion key={`k${i}`} x={x} y={y} />)}
      {kR.map(([x, y], i) => <Kion key={`kr${i}`} x={x} y={y} />)}
      {gL.map(([x, y], i) => <Glu key={`g${i}`} x={x} y={y} />)}
      {gR.map(([x, y], i) => <Glu key={`gr${i}`} x={x} y={y} />)}
      {/* small particles cross the pores */}
      {[0.27, 0.52, 0.77].map((k, i) => {
        const y = BY + BH * k - 4;
        return <DrawArrow key={i} d={`M${MX - 30} ${f1(y)} H${MX + 30}`} tone={i === 1 ? "acc" : "lvl"} delay={0.6 + i * 0.15} />;
      })}
      <rect x={BX} y={BY} width={BW} height={BH} rx={6} className="bz8-o" />
      <text x={BX + 10} y={BY + 22} className="bz8-lbl bz8-b bz8-red-t">
        krev
      </text>
      <text x={BX + BW - 10} y={BY + 22} textAnchor="end" className="bz8-lbl bz8-b bz8-blue-t">
        roztok
      </text>
      <text x={MX} y={BY - 10} textAnchor="middle" className="bz8-lbl bz8-sm">
        zvětšeno: stěna vlákna = polopropustná membrána
      </text>
    </g>
  );
}

function Legend() {
  const y = BY + BH + 26;
  return (
    <g>
      <Urea x={BX + 8} y={y - 5} />
      <text x={BX + 18} y={y} className="bz8-lbl bz8-sm">
        močovina
      </text>
      <Kion x={BX + 112} y={y - 5} />
      <text x={BX + 122} y={y} className="bz8-lbl bz8-sm">
        {"K⁺"}
      </text>
      <Glu x={BX + 164} y={y - 5} />
      <text x={BX + 175} y={y} className="bz8-lbl bz8-sm">
        glukóza
      </text>
      <text x={BX} y={y + 24} className="bz8-lbl bz8-sm bz8-b bz8-lvl-t">
        projdou: močovina, K⁺, voda
      </text>
      <text x={BX} y={y + 44} className="bz8-lbl bz8-sm bz8-b">
        zůstanou: krvinky, bílkoviny
      </text>
      <text x={BX} y={y + 64} className="bz8-lbl bz8-sm">
        glukózy je v roztoku stejně jako v krvi – neodchází
      </text>
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const PX = 156;
  const PY = 122;
  return (
    <>
      <Arm />
      <Pop delay={0.1}>
        <Dialyser />
      </Pop>
      <Pump x={PX} y={PY} />
      {/* blood out: arm → pump → top of dialyser */}
      <path d={`M80 122 H${PX - 19}`} className="bz8-tube" />
      <path d={`M${PX + 19} ${PY} H204 V36 H${DX + DW / 2} V${DT - 12}`} className="bz8-tube" />
      {/* blood back: bottom of dialyser → vein */}
      <path d={`M${DX + DW / 2} ${DB + 12} V318 H112 V226 H80`} className="bz8-tube" />
      <circle cx={80} cy={122} r={3} className="bz8-spot" />
      <circle cx={80} cy={226} r={3} className="bz8-spot" />
      <DrawArrow d="M100 112 H124" tone="red" delay={0.2} />
      <DrawArrow d={`M180 36 H230`} tone="red" delay={0.35} />
      <DrawArrow d="M150 330 H122" tone="red" delay={0.5} />
      {/* dialysate in at the bottom, out at the top */}
      <path d={`M${DX + DW} 96 H404 M${DX + DW} 262 H404`} className="bz8-tube bz8-tube-d" />
      <DrawArrow d={`M${DX + DW + 22} 96 H${W - 18}`} tone="blue" delay={0.6} />
      <DrawArrow d={`M${W - 18} 262 H${DX + DW + 22}`} tone="blue" delay={0.6} />
      <Fade delay={0.8}>
        <text x={DX + DW + 10} y={86} className="bz8-lbl bz8-sm bz8-blue-t">
          použitý roztok
        </text>
        <text x={DX + DW + 10} y={282} className="bz8-lbl bz8-sm bz8-blue-t">
          čerstvý roztok
        </text>
        <path d={`M${DX - 12} 140 V200`} className="bz8-arr bz8-arr-red" markerEnd={pat(id, "ah-red")} />
        <text x={DX - 18} y={172} textAnchor="end" className="bz8-lbl bz8-sm bz8-b bz8-red-t">
          krev
        </text>
        <path d={`M${DX + DW + 14} 220 V160`} className="bz8-arr bz8-arr-blue" markerEnd={pat(id, "ah-blue")} />
        <text x={DX + DW + 24} y={186} className="bz8-lbl bz8-sm bz8-b bz8-blue-t">
          roztok
        </text>
        <text x={DX + DW + 24} y={204} className="bz8-lbl bz8-sm bz8-blue-t">
          protiproud
        </text>
      </Fade>
      <Lbl x={DX + DW + 10} y={50} tx={DX + DW} ty={DT + 8} className="bz8-b">
        dialyzátor
      </Lbl>
      <Lbl x={DX - 16} y={262} tx={FIBRES[0] + 2} ty={250} anchor="end" className="bz8-sm">
        dutá vlákna
      </Lbl>
      <Lbl x={PX} y={PY + 40} anchor="middle" className="bz8-sm">
        pumpa
      </Lbl>
      <Lbl x={98} y={102} className="bz8-sm">
        z cévy
      </Lbl>
      <Lbl x={120} y={304} className="bz8-sm">
        zpět do žíly
      </Lbl>
      <text x={60} y={13} textAnchor="middle" className="bz8-lbl bz8-sm bz8-muted-t">
        paže
      </text>
      <path d={`M${DX + DW / 2} ${DB + 24} L${MX + 60} ${BY - 26}`} className="bz8-lead bz8-dash" />
      <Fade delay={0.4}>
        <Inset />
      </Fade>
      <Legend />
    </>
  );
}

export default function Haemodialysis() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={480} replay>
      <Plate />
    </Figure>
  );
}
