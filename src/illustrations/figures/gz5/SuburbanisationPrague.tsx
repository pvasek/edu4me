import { DrawArrow, Fade, Figure, Pop, Travel, f1, pat, useFig, type P2 } from "./kit";

const LABEL =
  "Schéma suburbanizace v zázemí Prahy (bez přesných tvarů a vzdáleností). Lidé se stěhují z města do okolních obcí, například do Hostivic, Odolene Vody, Říčan nebo Jesenice, kde u starých vesnic vyrůstají nové satelitní čtvrti rodinných domů. Většina z nich ale dál pracuje a studuje v Praze, takže každý den dojíždějí: ráno do města, večer zpátky. Na silnicích do Prahy proto vznikají kolony. Okresy Praha-západ a Praha-východ patří k nejrychleji rostoucím v Česku.";

const W = 440;
const H = 494;
const C: P2 = [220, 190];
const RB = 108; // city boundary
const RV = 166; // villages
const pol = (r: number, deg: number): P2 => [
  C[0] + r * Math.cos((deg * Math.PI) / 180),
  C[1] + r * Math.sin((deg * Math.PI) / 180),
];
const pt = (p: P2) => `${f1(p[0])} ${f1(p[1])}`;

type Village = { deg: number; name?: string; move?: boolean; jam?: boolean; ly?: number };
// directions as on a map (north up): Hostivice W, Odolena Voda N, Říčany SE, Jesenice S
const VILLAGES: Village[] = [
  { deg: 180, name: "Hostivice", move: true },
  { deg: 270, name: "Odolena Voda" },
  { deg: 325 },
  { deg: 30, name: "Říčany", move: true, jam: true },
  { deg: 95, name: "Jesenice", move: true },
  { deg: 140 },
];

function Village({ v }: { v: Village }) {
  const [x, y] = pol(RV, v.deg);
  // an old core (church, two houses) and a new satellite estate of identical houses
  return (
    <g>
      <path d={`M${x - 24} ${y + 4} V${y - 8} L${x - 21} ${y - 17} L${x - 18} ${y - 8} V${y + 4} Z`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x - 16} ${y + 4} V${y - 3} H${x - 7} V${y + 4} Z`} className="gz5-wall gz5-o gz5-thin" />
      <path d={`M${x - 17} ${y - 3} L${x - 11.5} ${y - 8} L${x - 6} ${y - 3} Z`} className="gz5-roof gz5-o gz5-thin" />
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => {
          const hx = x - 1 + c * 9;
          const hy = y - 6 + r * 10;
          return (
            <g key={`${c}${r}`}>
              <rect x={hx} y={hy} width={7} height={5} className="gz5-new gz5-o gz5-thin" />
              <path d={`M${hx - 0.8} ${hy} L${hx + 3.5} ${hy - 3.5} L${hx + 7.8} ${hy} Z`} className="gz5-new-roof gz5-o gz5-thin" />
            </g>
          );
        }),
      )}
    </g>
  );
}

function Car({ p, rot }: { p: P2; rot: number }) {
  return (
    <g transform={`translate(${pt(p)}) rotate(${rot})`}>
      <rect x={-5} y={-3} width={10} height={6} rx={2} className="gz5-car" />
    </g>
  );
}

function City() {
  const { id } = useFig();
  // housing estates on the outer ring (the top is left free for its label)
  const angles = [0, 36, 72, 108, 144, 180, 216, 324];
  const blocks: P2[] = angles.map((d) => pol(90, d));
  return (
    <g>
      <circle cx={C[0]} cy={C[1]} r={RB} className="gz5-city-out" />
      <circle cx={C[0]} cy={C[1]} r={72} className="gz5-city-mid" />
      <circle cx={C[0]} cy={C[1]} r={72} fill={pat(id, "d")} opacity={0.6} />
      <circle cx={C[0]} cy={C[1]} r={34} className="gz5-shop gz5-o gz5-thin" />
      <circle cx={C[0]} cy={C[1]} r={34} fill={pat(id, "x")} opacity={0.5} />
      {blocks.map((b, i) => (
        <g key={i} transform={`translate(${pt(b)}) rotate(${angles[i] + 90})`}>
          <rect x={-8} y={-3.5} width={16} height={7} className="gz5-flat gz5-o gz5-thin" />
        </g>
      ))}
      <circle cx={C[0]} cy={C[1]} r={RB} className="gz5-o gz5-dash" />
    </g>
  );
}

function Plate() {
  const jam = VILLAGES.find((v) => v.jam)!;
  return (
    <>
      {/* roads first, under everything */}
      {VILLAGES.map((v) => (
        <path key={v.deg} d={`M${pt(pol(40, v.deg))} L${pt(pol(RV - 18, v.deg))}`} className="gz5-road" />
      ))}
      <Fade delay={0}>
        <City />
      </Fade>
      <Fade delay={0.2}>
        <text x={C[0]} y={C[1] + 6} textAnchor="middle" className="gz5-lbl gz5-b">
          centrum
        </text>
        <text x={C[0]} y={C[1] - 44} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
          vnitřní město
        </text>
        <text x={C[0]} y={C[1] - 85} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
          sídliště
        </text>
        <text x={pol(RB + 8, 222)[0]} y={pol(RB + 8, 222)[1]} textAnchor="end" className="gz5-lbl gz5-sm gz5-muted-t">
          hranice Prahy
        </text>
      </Fade>
      {VILLAGES.map((v, i) => {
        const [x, y] = pol(RV, v.deg);
        const below = v.deg > 0 && v.deg < 180;
        return (
          <Pop key={v.deg} delay={0.3 + i * 0.08}>
            <Village v={v} />
            {v.name && (
              <text x={x + 2} y={below ? y + 28 : y - 22} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
                {v.name}
              </text>
            )}
          </Pop>
        );
      })}
      {/* moving out: city → villages */}
      {VILLAGES.filter((v) => v.move).map((v, i) => {
        const a = pol(50, v.deg - 26);
        const m = pol(112, v.deg - 20);
        const b = pol(RV - 30, v.deg - 8);
        return <DrawArrow key={v.deg} d={`M${pt(a)} Q${pt(m)} ${pt(b)}`} tone="acc" delay={0.8 + i * 0.15} className="gz5-move" />;
      })}
      {/* daily commuting: both ways along the roads */}
      {VILLAGES.filter((v) => v.name).map((v, i) => {
        const a = pol(RB + 6, v.deg + 9);
        const b = pol(RV - 26, v.deg + 6);
        return <DrawArrow key={v.deg} d={`M${pt(b)} L${pt(a)}`} tone="lvl" delay={1.3 + i * 0.1} both className="gz5-commute" />;
      })}
      {/* a queue on the road from Říčany */}
      <Fade delay={1.7}>
        {[0, 1, 2, 3].map((k) => (
          <Car key={k} p={pol(RB + 8 + k * 11, jam.deg)} rot={jam.deg} />
        ))}
      </Fade>
      <Travel path={`M${pt(pol(RV - 22, 180))} L${pt(pol(RB - 30, 180))}`} dur={3.2} rest={pol(RB + 18, 180)} fade>
        <rect x={-5} y={-3} width={10} height={6} rx={2} className="gz5-car" />
      </Travel>
      <Travel path={`M${pt(pol(RV - 22, 270))} L${pt(pol(RB - 30, 270))}`} dur={3.6} phase={0.4} rest={pol(RB + 18, 270)} fade>
        <rect x={-3} y={-5} width={6} height={10} rx={2} className="gz5-car" />
      </Travel>

      {/* north arrow */}
      <Fade delay={0.4}>
        <path d={`M${W - 22} 52 V22`} className="gz5-arr gz5-arr-ink" />
        <path d={`M${W - 27} 30 L${W - 22} 20 L${W - 17} 30 Z`} className="gz5-mk-ink" />
        <text x={W - 22} y={68} textAnchor="middle" className="gz5-lbl gz5-sm gz5-b">
          S
        </text>
      </Fade>
      <Legend />
    </>
  );
}

function Legend() {
  const y0 = 410;
  const x = 22;
  return (
    <Fade delay={1.8}>
      <path d={`M${x} ${y0} h34`} className="gz5-arr gz5-arr-acc gz5-move" />
      <path d={`M${x + 28} ${y0 - 5} L${x + 36} ${y0} L${x + 28} ${y0 + 5}`} className="gz5-arr gz5-arr-acc" />
      <text x={x + 46} y={y0 + 5} className="gz5-lbl gz5-sm">
        stěhování z Prahy do okolních obcí
      </text>
      <path d={`M${x} ${y0 + 26} h36`} className="gz5-arr gz5-arr-lvl gz5-commute" />
      <path d={`M${x + 8} ${y0 + 21} L${x} ${y0 + 26} L${x + 8} ${y0 + 31} M${x + 28} ${y0 + 21} L${x + 36} ${y0 + 26} L${x + 28} ${y0 + 31}`} className="gz5-arr gz5-arr-lvl" />
      <text x={x + 46} y={y0 + 31} className="gz5-lbl gz5-sm">
        denní dojížďka: ráno do Prahy, večer domů
      </text>
      <g transform={`translate(${x + 4} ${y0 + 50})`}>
        {[0, 1, 2].map((c) => (
          <g key={c}>
            <rect x={c * 10} y={0} width={7} height={5} className="gz5-new gz5-o gz5-thin" />
            <path d={`M${c * 10 - 0.8} 0 L${c * 10 + 3.5} -3.5 L${c * 10 + 7.8} 0 Z`} className="gz5-new-roof gz5-o gz5-thin" />
          </g>
        ))}
      </g>
      <text x={x + 46} y={y0 + 57} className="gz5-lbl gz5-sm">
        nová satelitní výstavba u staré vesnice
      </text>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x + k * 12} y={y0 + 74} width={10} height={6} rx={2} className="gz5-car" />
      ))}
      <text x={x + 46} y={y0 + 83} className="gz5-lbl gz5-sm">
        kolony na silnicích do Prahy
      </text>
    </Fade>
  );
}

export default function SuburbanisationPrague() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
