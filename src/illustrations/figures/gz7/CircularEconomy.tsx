import { DrawArrow, Fade, Figure, Pop, f1 } from "./kit";

const LABEL =
  "Lineární a oběhové hospodářství. Lineární ekonomika jde jedním směrem: těžba surovin, výroba, spotřeba a odpad na skládce – vezmi, vyrob, vyhoď. Oběhové neboli cirkulární hospodářství uzavírá kruh: výrobek se navrhne tak, aby vydržel a dal se opravit (ekodesign), vyrobí se, užívá a sdílí, opravuje, použije znovu a nakonec recykluje na suroviny pro novou výrobu. Nových surovin i odpadu je mnohem méně.";

const W = 480;
const H = 498;
const CX = 240;
const CY = 340;
const R = 122;

const LIN = [
  { t: "těžba", x: 50 },
  { t: "výroba", x: 166 },
  { t: "spotřeba", x: 282 },
  { t: "odpad", x: 410 },
];

const LOOP = [
  { t: "ekodesign", a: -90 },
  { t: "výroba", a: -30 },
  { t: "užívání, sdílení", a: 30 },
  { t: "oprava", a: 90 },
  { t: "opětovné použití", a: 150 },
  { t: "recyklace", a: 210 },
];

const pt = (a: number, r = R): [number, number] => [CX + Math.cos((a * Math.PI) / 180) * r, CY + Math.sin((a * Math.PI) / 180) * r];

function Pill({ x, y, t, cls = "gz7-box" }: { x: number; y: number; t: string; cls?: string }) {
  const w = Math.max(70, t.length * 8.2 + 20);
  return (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={30} rx={15} className={cls} />
      <text x={x} y={y + 5} textAnchor="middle" className="gz7-lbl gz7-b gz7-un-t">
        {t}
      </text>
    </g>
  );
}

export default function CircularEconomy() {
  return (
    <Figure level={12} label={LABEL} w={W} h={H} max={600} replay>
      {/* linear */}
      <text x={20} y={24} className="gz7-lbl gz7-b">
        lineární ekonomika
      </text>
      <text x={460} y={24} textAnchor="end" className="gz7-lbl gz7-sm gz7-muted-t">
        vezmi – vyrob – vyhoď
      </text>
      {LIN.slice(0, -1).map((n, i) => (
        <DrawArrow key={i} d={`M${n.x + 44} 62 H${LIN[i + 1].x - 44}`} tone="ink" delay={0.15 + i * 0.15} />
      ))}
      {LIN.map((n, i) => (
        <Pop key={n.t} delay={0.05 + i * 0.15}>
          <Pill x={n.x} y={62} t={n.t} cls={i === 3 ? "gz7-box-bad" : "gz7-box"} />
        </Pop>
      ))}
      {/* landfill */}
      <path d="M370 112 Q410 86 452 112 Z" className="gz7-ce-dump gz7-o gz7-thin" />
      <path d="M410 80 V96" className="gz7-arr gz7-arr-red" />
      <text x={410} y={130} textAnchor="middle" className="gz7-lbl gz7-sm gz7-red-t">
        skládka, spalovna
      </text>

      <path d="M20 150 H460" className="gz7-o gz7-thin gz7-dash gz7-faint" />

      {/* circular */}
      <text x={20} y={180} className="gz7-lbl gz7-b gz7-lvl-t">
        oběhové (cirkulární) hospodářství
      </text>
      <circle cx={CX} cy={CY} r={R} className="gz7-ce-ring" />
      {LOOP.map((n, i) => {
        const a0 = n.a + 17;
        const a1 = LOOP[(i + 1) % LOOP.length].a + (i === LOOP.length - 1 ? 360 : 0) - 17;
        const [x0, y0] = pt(a0);
        const [x1, y1] = pt(a1);
        return (
          <DrawArrow
            key={i}
            d={`M${f1(x0)} ${f1(y0)} A${R} ${R} 0 0 1 ${f1(x1)} ${f1(y1)}`}
            tone="lvl"
            delay={0.5 + i * 0.12}
            className="gz7-ce-arr"
          />
        );
      })}
      {LOOP.map((n, i) => {
        const [x, y] = pt(n.a);
        return (
          <Pop key={n.t} delay={0.4 + i * 0.12}>
            <Pill x={x} y={y} t={n.t} cls="gz7-box-lvl" />
          </Pop>
        );
      })}
      <Fade delay={1.3}>
        <text x={CX} y={CY - 6} textAnchor="middle" className="gz7-lbl gz7-sm">
          výrobek a suroviny
        </text>
        <text x={CX} y={CY + 14} textAnchor="middle" className="gz7-lbl gz7-sm">
          zůstávají v oběhu
        </text>
      </Fade>
      {/* small inflow and outflow */}
      <DrawArrow d="M440 214 Q420 236 384 262" tone="muted" delay={1.2} />
      <text x={470} y={204} textAnchor="end" className="gz7-lbl gz7-sm gz7-muted-t">
        méně nových surovin
      </text>
      <DrawArrow d="M110 290 Q70 300 44 330" tone="muted" delay={1.3} />
      <text x={14} y={352} className="gz7-lbl gz7-sm gz7-muted-t">
        málo
      </text>
      <text x={14} y={370} className="gz7-lbl gz7-sm gz7-muted-t">
        odpadu
      </text>
    </Figure>
  );
}
