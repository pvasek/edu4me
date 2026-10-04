import { DrawArrow, Eq, Fade, Figure, Lbl, Pop, f1, pat, useFig } from "./kit";

const LABEL =
  "Chloroplast a dvě fáze fotosyntézy. Chloroplast má vnější a vnitřní membránu, uvnitř jsou měchýřky tylakoidy naskládané do gran a kolem nich tekuté stroma. Na membránách tylakoidů probíhá světelná fáze: chlorofyl zachytí světlo, voda se rozloží na kyslík, který odchází, a vzniká ATP a NADPH. Ty putují do stromatu, kde Calvinův cyklus zabudovává oxid uhličitý do cukru; ADP, fosfát a NADP⁺ se vracejí zpět do světelné fáze.";

const W = 400;
const H = 486;
const CX = 200;
const CY = 98;

function Granum({ x, y, n = 5 }: { x: number; y: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x - 15} y={y - n * 4 + i * 8} width={30} height={6.5} rx={3.2} className="bz3-thylakoid" />
      ))}
    </g>
  );
}

function Plate() {
  const { id } = useFig();
  const grana: [number, number, number][] = [
    [98, 92, 5],
    [150, 112, 6],
    [204, 86, 5],
    [256, 110, 6],
    [306, 92, 4],
  ];
  const cyc = { x: 300, y: 372, r: 62 };
  const arcPt = (deg: number, r = cyc.r): [number, number] => [
    cyc.x + Math.cos((deg * Math.PI) / 180) * r,
    cyc.y + Math.sin((deg * Math.PI) / 180) * r,
  ];
  const arc = (a0: number, a1: number) => {
    const [x0, y0] = arcPt(a0);
    const [x1, y1] = arcPt(a1);
    return `M${f1(x0)} ${f1(y0)} A${cyc.r} ${cyc.r} 0 0 1 ${f1(x1)} ${f1(y1)}`;
  };
  return (
    <>
      {/* ---------------- chloroplast */}
      <Pop>
        <ellipse cx={CX} cy={CY} rx={168} ry={74} className="bz3-chloro" />
        <ellipse cx={CX} cy={CY} rx={168} ry={74} fill={pat(id, "dots")} opacity={0.5} />
        <ellipse cx={CX} cy={CY} rx={160} ry={66} className="bz3-mito-in" />
        <path d="M112 96 H138 M164 104 H192 M218 92 H244 M270 104 H292" className="bz3-lamella" />
        {grana.map(([x, y, n], i) => (
          <Granum key={i} x={x} y={y} n={n} />
        ))}
        <path d="M80 130 l3 -3 M240 140 l3 -3 M300 60 l3 3 M140 64 l3 3" className="bz3-o bz3-thin" />
      </Pop>
      <Fade delay={0.4}>
        <Lbl x={14} y={22} tx={70} ty={42} className="bz3-sm bz3-b">dvojitá membrána</Lbl>
        <Lbl x={W - 14} y={22} tx={262} ty={84} anchor="end" className="bz3-sm bz3-b">granum (tylakoidy)</Lbl>
        <Lbl x={W - 14} y={192} tx={286} ty={140} anchor="end" className="bz3-sm bz3-b">stroma</Lbl>
      </Fade>

      {/* zoom leaders */}
      <Fade delay={0.6}>
        <path d={`M150 130 L96 222`} className="bz3-zoom" />
        <path d={`M232 150 L290 300`} className="bz3-zoom" />
      </Fade>

      {/* ---------------- light reactions */}
      <Pop delay={0.7}>
        <rect x={14} y={224} width={164} height={196} rx={10} className="bz3-phase-l" />
        <text x={96} y={246} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
          světelná fáze
        </text>
        <text x={96} y={263} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          membrána tylakoidu
        </text>
        {/* thylakoid membrane strip with a photosystem */}
        <rect x={26} y={320} width={140} height={14} rx={7} className="bz3-thylakoid" />
        <ellipse cx={74} cy={327} rx={16} ry={14} className="bz3-psys" />
        <text x={74} y={331} textAnchor="middle" className="bz3-tiny">
          chl
        </text>
        <rect x={124} y={312} width={20} height={30} rx={5} className="bz3-protein" />
        <text x={134} y={360} textAnchor="middle" className="bz3-tiny-l">
          ATP-syntáza
        </text>
      </Pop>
      {/* light in */}
      <Fade delay={0.8}>
        <path d="M28 274 L58 314 M42 270 L70 310" className="bz3-light" />
        <text x={74} y={286} className="bz3-lbl bz3-sm bz3-b bz3-acc-t">
          světlo
        </text>
      </Fade>
      <Fade delay={1}>
        <Eq x={146} y={296} t="H_{2}O" anchor="middle" className="bz3-eq-lg" />
        <path d="M140 301 L96 318" className="bz3-thin-line" />
        <Eq x={52} y={392} t="O_{2}" anchor="middle" className="bz3-eq-lg" />
        <text x={52} y={410} textAnchor="middle" className="bz3-tiny-l">
          ven z listu
        </text>
      </Fade>
      <DrawArrow d="M80 342 L60 376" tone="blue" delay={1} />

      {/* ---------------- products to the Calvin cycle and back */}
      <DrawArrow d="M178 276 C206 270 226 290 244 316" tone="lvl" delay={1.2} className="bz3-arr-w" />
      <DrawArrow d="M248 420 C226 436 200 424 178 404" tone="muted" delay={1.4} className="bz3-arr-w" />
      <Fade delay={1.3}>
        <Eq x={212} y={262} t="ATP" anchor="middle" />
        <Eq x={212} y={278} t="NADPH" anchor="middle" />
        <Eq x={210} y={448} t="ADP + P" anchor="middle" className="bz3-eq-sm" />
        <Eq x={210} y={464} t="NADP^{+}" anchor="middle" className="bz3-eq-sm" />
      </Fade>

      {/* ---------------- Calvin cycle */}
      <Pop delay={1.1}>
        <circle cx={cyc.x} cy={cyc.y} r={cyc.r + 22} className="bz3-phase-d" />
      </Pop>
      <DrawArrow d={arc(-60, 40)} tone="lvl" delay={1.5} />
      <DrawArrow d={arc(60, 160)} tone="lvl" delay={1.6} />
      <DrawArrow d={arc(180, 280)} tone="lvl" delay={1.7} />
      <Fade delay={1.5}>
        <text x={cyc.x} y={cyc.y - 6} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
          Calvinův
        </text>
        <text x={cyc.x} y={cyc.y + 10} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
          cyklus
        </text>
        <text x={cyc.x} y={cyc.y + 28} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          ve stromatu
        </text>
      </Fade>
      <Fade delay={1.8}>
        <Eq x={W - 12} y={276} t="CO_{2}" anchor="end" className="bz3-eq-lg" />
        <DrawArrow d={`M${W - 30} 284 L${f1(arcPt(-40, cyc.r + 8)[0])} ${f1(arcPt(-40, cyc.r + 8)[1])}`} tone="ink" />
        <Eq x={W - 12} y={472} t="cukr (glukóza)" anchor="end" />
        <DrawArrow d={`M${f1(arcPt(60, cyc.r + 8)[0])} ${f1(arcPt(60, cyc.r + 8)[1])} L${W - 40} 456`} tone="ink" />
      </Fade>
    </>
  );
}

export default function ChloroplastReactions() {
  return (
    <Figure level={9} label={LABEL} w={W} h={H} max={560} replay>
      <Plate />
    </Figure>
  );
}
