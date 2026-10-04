import { Arrow, Figure, Fade, Num, Pop, cz, f1, pat, useFig } from "./kit";

const LABEL =
  "Řez Zemí. Na povrchu je tenká pevná kůra, silná 5 až 70 kilometrů. Pod ní leží plášť z horké horniny, která velmi pomalu proudí, až do hloubky 2 900 km, s teplotou zhruba 1 000 až 3 700 °C. Následuje vnější jádro z tekutého železa a niklu do hloubky 5 150 km při teplotě asi 4 000 až 5 000 °C a uprostřed pevné vnitřní jádro sahající do středu Země v hloubce 6 371 km, s teplotou kolem 5 500 °C.";

const W = 400;
const H = 452;
const CX = 200;
const CY = 206;
const R = 176;
const KM = 6371;
const CRUST = 7; // drawn thickness (the real crust would be about 1 px)
const rOf = (depth: number) => (R - CRUST) * (1 - depth / KM);

const LAYERS = [
  { n: 1, name: "kůra", depth: "5–70 km", desc: "pevná hornina, 0–1 000 °C", r0: R - CRUST, r1: R, cls: "bz3-crust" },
  { n: 2, name: "plášť", depth: "do 2 900 km", desc: "horká hornina pomalu proudí, 1 000–3 700 °C", r0: rOf(2900), r1: R - CRUST, cls: "bz3-mantle" },
  { n: 3, name: "vnější jádro", depth: "2 900–5 150 km", desc: "tekuté železo a nikl, 4 000–5 000 °C", r0: rOf(5150), r1: rOf(2900), cls: "bz3-ocore" },
  { n: 4, name: "vnitřní jádro", depth: "5 150–6 371 km", desc: "pevné železo a nikl, asi 5 500 °C", r0: 0, r1: rOf(5150), cls: "bz3-icore" },
];

const half = (r: number) => `M${f1(CX - r)} ${CY} A${r} ${r} 0 0 1 ${f1(CX + r)} ${CY}Z`;

function Plate() {
  const { id } = useFig();
  return (
    <>
      {LAYERS.map((L, i) => (
        <Pop key={L.n} delay={0.1 + (3 - i) * 0.25}>
          <path d={half(L.r1)} className={`bz3-o ${L.cls}`} />
          <path d={half(L.r1)} fill={pat(id, L.n === 3 ? "h" : L.n === 4 ? "x" : "d")} opacity={0.45} />
        </Pop>
      ))}
      {/* overlay: inner layers on top again so their outlines stay crisp */}
      <Fade delay={1.1}>
        {LAYERS.slice(1).map((L) => (
          <path key={L.n} d={half(L.r1)} className="bz3-o" fill="none" />
        ))}
        {/* convection in the mantle */}
        <Arrow d={`M${CX - 140} ${CY - 20} C${CX - 150} ${CY - 90} ${CX - 100} ${CY - 140} ${CX - 60} ${CY - 132}`} tone="acc" className="bz3-conv" />
        <Arrow d={`M${CX + 60} ${CY - 132} C${CX + 100} ${CY - 140} ${CX + 150} ${CY - 90} ${CX + 140} ${CY - 20}`} tone="acc" className="bz3-conv" />
        <text x={CX} y={CY - 140} textAnchor="middle" className="bz3-lbl bz3-sm bz3-halo">
          proudění v plášti
        </text>
      </Fade>
      {/* numbers on the layers */}
      <Fade delay={1.2}>
        <Num x={CX - 118} y={CY - 135} n={1} />
        <line x1={CX - 110} y1={CY - 140} x2={CX - 98} y2={CY - 145} className="bz3-lead" />
        <Num x={CX - 128} y={CY - 70} n={2} />
        <Num x={CX - 70} y={CY - 30} n={3} />
        <Num x={CX} y={CY - 22} n={4} />
      </Fade>
      {/* depth scale along the cut */}
      <Fade delay={1.3}>
        <line x1={CX} y1={CY} x2={CX + R} y2={CY} className="bz3-o" />
        {[0, 2900, 5150].map((d) => {
          const x = CX + (d === 0 ? R : rOf(d));
          return (
            <g key={d}>
              <line x1={x} y1={CY} x2={x} y2={CY + 6} className="bz3-o" />
              <text x={x} y={CY + 20} textAnchor={d === 0 ? "end" : "middle"} className="bz3-num bz3-num-sm">
                {cz(d)}
              </text>
            </g>
          );
        })}
        <text x={CX + R} y={CY + 38} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          hloubka v km
        </text>
        <text x={CX - R} y={CY + 22} className="bz3-lbl bz3-sm bz3-muted-t">
          kůra zakreslena silnější
        </text>
      </Fade>
      {/* legend */}
      {LAYERS.map((L, i) => {
        const y = 270 + i * 46;
        return (
          <Fade key={L.n} delay={0.5 + i * 0.2}>
            <Num x={20} y={y - 5} n={L.n} />
            <text x={38} y={y} className="bz3-lbl bz3-b">
              {L.name}
            </text>
            <text x={W - 10} y={y} textAnchor="end" className="bz3-num">
              {L.depth}
            </text>
            <text x={38} y={y + 20} className="bz3-lbl bz3-sm">
              {L.desc}
            </text>
          </Fade>
        );
      })}
    </>
  );
}

export default function EarthLayers() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={540}>
      <Plate />
    </Figure>
  );
}
