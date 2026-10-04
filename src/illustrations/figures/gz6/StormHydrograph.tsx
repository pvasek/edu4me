import { Draw, DrawArrow, Fade, Figure, f1 } from "./kit";

const LABEL =
  "Povodňový hydrogram: nahoře sloupce srážek po hodinách, dole průtok řeky v m³/s v čase od začátku deště. Před deštěm teče jen základní odtok. Po dešti průtok stoupá (vzestupná větev) až ke kulminačnímu průtoku a pak pomaleji klesá (sestupná větev). Doba zpoždění je čas mezi nejvyšší intenzitou srážek a kulminací. V povodí s městem (beton, asfalt, kanalizace) voda rychle steče po povrchu: vrchol přijde už asi za 4 hodiny a je vysoký. V zalesněném povodí les vodu zadrží (intercepce, infiltrace): vrchol přijde asi za 12 hodin a je mnohem nižší. Hodnoty jsou ilustrační.";

const W = 460;
const H = 384;
const X0 = 56;
const X1 = 446;
const Y0 = 330; // Q = 0
const TOP = 36; // rain axis
const tx = (h: number) => X0 + ((X1 - X0) * h) / 48;
const qy = (q: number) => Y0 - q * 2.4;

const RAIN: [number, number][] = [
  [3, 2], [4, 6], [5, 10], [6, 14], [7, 8], [8, 4], [9, 1],
];
const T_RAIN = 6.5; // peak intensity (middle of the 6–7 h bar)
const BASE = 10;

/** a storm response: base flow + a gamma-shaped wave */
function hydro(t0: number, tp: number, a: number, qp: number) {
  let d = "";
  for (let t = 0; t <= 48; t += 0.25) {
    const s = (t - t0) / tp;
    const q = BASE + (s > 0 ? qp * Math.pow(s, a) * Math.exp(a * (1 - s)) : 0);
    d += `${d ? "L" : "M"}${f1(tx(t))} ${f1(qy(q))} `;
  }
  return d;
}
const T_CITY = 10.5;
const T_FOREST = 18.5;
const CITY = hydro(7, T_CITY - 7, 3, 75);
const FOREST = hydro(7.5, T_FOREST - 7.5, 2.5, 25);

function Plate() {
  return (
    <>
      {/* axes */}
      {[0, 20, 40, 60, 80, 100].map((q) => (
        <g key={q}>
          <path d={`M${X0} ${f1(qy(q))} H${X1}`} className="gz6-grid" />
          <text x={X0 - 6} y={qy(q) + 4} textAnchor="end" className="gz6-num" style={{ fontSize: 11 }}>
            {q}
          </text>
        </g>
      ))}
      {[0, 12, 24, 36, 48].map((h) => (
        <g key={h}>
          <path d={`M${f1(tx(h))} ${Y0} v5`} className="gz6-o gz6-thin" />
          <text x={tx(h)} y={Y0 + 18} textAnchor="middle" className="gz6-num" style={{ fontSize: 11 }}>
            {h}
          </text>
        </g>
      ))}
      <path d={`M${X0} ${qy(100) - 4} V${Y0} H${X1}`} className="gz6-o" />
      <path d={`M${X0} ${TOP} H${X1}`} className="gz6-o gz6-thin" />
      <text x={(X0 + X1) / 2} y={Y0 + 38} textAnchor="middle" className="gz6-lbl gz6-sm">
        čas od začátku deště (h)
      </text>
      <text
        x={16}
        y={(qy(100) + Y0) / 2}
        textAnchor="middle"
        transform={`rotate(-90 16 ${(qy(100) + Y0) / 2})`}
        className="gz6-lbl gz6-sm"
      >
        průtok (m³/s)
      </text>

      {/* rain bars hanging from the top axis */}
      {RAIN.map(([h, mm], i) => (
        <Fade key={h} delay={i * 0.06}>
          <rect x={tx(h)} y={TOP} width={tx(1) - X0 - 1} height={mm * 3} className="gz6-sea-deep gz6-o gz6-thin" />
        </Fade>
      ))}
      <text x={tx(10.5)} y={TOP + 16} className="gz6-lbl gz6-b gz6-blue-t">
        srážky
      </text>
      <text x={tx(10.5)} y={TOP + 32} className="gz6-lbl gz6-sm gz6-blue-t">
        (max. 14 mm/h)
      </text>
      <text x={X1} y={TOP - 10} textAnchor="end" className="gz6-lbl gz6-sm gz6-muted-t">
        ilustrační hodnoty
      </text>

      {/* base flow */}
      <path d={`M${X0} ${qy(BASE)} H${X1}`} className="gz6-o gz6-thin gz6-dash" />
      <text x={X1 - 2} y={qy(BASE) + 16} textAnchor="end" className="gz6-lbl gz6-sm">
        základní odtok
      </text>

      {/* the two hydrographs */}
      <Draw d={FOREST} className="gz6-curve gz6-curve-green" delay={0.4} />
      <Draw d={CITY} className="gz6-curve gz6-curve-red" delay={0.2} />

      {/* lag times */}
      <Fade delay={1.3}>
        <path d={`M${f1(tx(T_RAIN))} ${TOP + 42} V${qy(5)}`} className="gz6-o gz6-thin gz6-dash gz6-blue-s" />
        <path d={`M${f1(tx(T_CITY))} 92 V${f1(qy(85) - 4)}`} className="gz6-o gz6-thin gz6-dash gz6-red-s" />
        <path d={`M${f1(tx(T_FOREST))} 108 V${f1(qy(35) - 4)}`} className="gz6-o gz6-thin gz6-dash gz6-green-s" />
      </Fade>
      <DrawArrow d={`M${f1(tx(T_RAIN))} 96 H${f1(tx(T_CITY))}`} tone="red" delay={1.4} />
      <DrawArrow d={`M${f1(tx(T_RAIN))} 112 H${f1(tx(T_FOREST))}`} tone="green" delay={1.5} />
      <Fade delay={1.6}>
        <text x={tx(T_CITY) + 6} y={100} className="gz6-lbl gz6-b gz6-red-t">
          ≈ 4 h
        </text>
        <text x={tx(T_FOREST) + 6} y={116} className="gz6-lbl gz6-b gz6-good-t">
          ≈ 12 h
        </text>
        <text x={tx(T_FOREST) + 64} y={116} className="gz6-lbl gz6-b">
          doba zpoždění
        </text>
      </Fade>

      {/* parts of the curve */}
      <Fade delay={1.8}>
        <text x={tx(T_CITY) + 12} y={qy(85) + 2} className="gz6-lbl gz6-b gz6-halo">
          kulminační průtok
        </text>
        <text x={X0 + 8} y={qy(48)} className="gz6-lbl gz6-sm">
          vzestupná
        </text>
        <text x={X0 + 8} y={qy(48) + 16} className="gz6-lbl gz6-sm">
          větev
        </text>
        <path d={`M${X0 + 62} ${f1(qy(46))} L${f1(tx(9.3) - 3)} ${f1(qy(46))}`} className="gz6-lead" />
        <text x={tx(17)} y={qy(55)} className="gz6-lbl gz6-sm">
          sestupná větev
        </text>
        <path d={`M${f1(tx(17) - 3)} ${f1(qy(55) - 4)} L${f1(tx(13.2))} ${f1(qy(42))}`} className="gz6-lead" />
      </Fade>
      <Fade delay={2.0}>
        <path d={`M${tx(27)} ${qy(70)} h26`} className="gz6-curve gz6-curve-red" />
        <text x={tx(27) + 32} y={qy(70) + 5} className="gz6-lbl gz6-b gz6-red-t">
          město
        </text>
        <text x={tx(27) + 32} y={qy(70) + 21} className="gz6-lbl gz6-sm">
          beton, asfalt, kanalizace
        </text>
        <path d={`M${tx(27)} ${qy(52)} h26`} className="gz6-curve gz6-curve-green" />
        <text x={tx(27) + 32} y={qy(52) + 5} className="gz6-lbl gz6-b gz6-good-t">
          les
        </text>
        <text x={tx(27) + 32} y={qy(52) + 21} className="gz6-lbl gz6-sm">
          intercepce, infiltrace
        </text>
      </Fade>
    </>
  );
}

export default function StormHydrograph() {
  return (
    <Figure label={LABEL} w={W} h={H} max={640} boost={false} replay>
      <Plate />
    </Figure>
  );
}
