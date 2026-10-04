import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, Pop, StripBox, pat, useFig } from "./kit";

const LABEL =
  "Dva typy vývoje hmyzu jako dva cykly. Proměna dokonalá u motýla: vajíčko, z něj housenka (larva), která roste a svléká se, pak kukla, ve které se tělo přestaví, a nakonec dospělý motýl s křídly. Proměna nedokonalá u kobylky: vajíčko, z něj larva (nymfa), která vypadá jako malý dospělec bez křídel, několikrát se svlékne a postupně jí dorostou křídla, až je z ní dospělá kobylka. Stadium kukly tu chybí.";

const W = 300;
const H = 290;

function Leaf({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-40 0 Q-10 -24 40 0 Q-10 24 -40 0Z" className="bz2-o bz2-leaf" />
      <path d="M-40 0 L40 0" className="bz2-o bz2-thin" />
    </g>
  );
}

function Butterfly({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <path d="M2 -4 Q26 -36 44 -26 Q50 -8 30 2 Q14 4 2 0Z" className="bz2-o bz2-lvlmid-f" />
          <path d="M2 -4 Q26 -36 44 -26 Q50 -8 30 2 Q14 4 2 0Z" fill={pat(id, "d")} />
          <path d="M2 2 Q24 6 30 20 Q24 34 10 28 Q2 20 2 2Z" className="bz2-o bz2-lvlmid-f" />
          <circle cx={30} cy={-16} r={5} className="bz2-o bz2-thin bz2-paper-f" />
        </g>
      ))}
      <ellipse cx={0} cy={2} rx={3.6} ry={18} className="bz2-o bz2-chitin" />
      <path d="M-1 -14 Q-8 -30 -12 -34 M1 -14 Q8 -30 12 -34" className="bz2-o bz2-thin" />
    </g>
  );
}

function Caterpillar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={-32 + i * 8} cy={-Math.sin((i / 8) * Math.PI) * 6} r={7} className="bz2-o bz2-leaf2" />
      ))}
      <circle cx={36} cy={-4} r={8} className="bz2-o bz2-chitin" />
      {[-30, -22, -14, 10, 18, 26].map((lx) => (
        <path key={lx} d={`M${lx} 5 l0 6`} className="bz2-o" />
      ))}
    </g>
  );
}

function Pupa({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-30 -40 H30" className="bz2-o" style={{ strokeWidth: 4 }} />
      <path d="M0 -40 V-32" className="bz2-o" />
      <path d="M0 -32 Q16 -22 14 4 Q10 26 0 34 Q-10 26 -14 4 Q-16 -22 0 -32Z" className="bz2-o bz2-gold" />
      <path d="M0 -32 Q16 -22 14 4 Q10 26 0 34 Q-10 26 -14 4 Q-16 -22 0 -32Z" fill={pat(id, "b")} />
      <path d="M-12 -4 Q0 2 12 -4 M-11 10 Q0 15 11 10" className="bz2-o bz2-thin" />
    </g>
  );
}

function Eggs({ x, y, long = false }: { x: number; y: number; long?: boolean }) {
  const pos = [
    [-12, -4],
    [0, -6],
    [12, -4],
    [-6, 6],
    [6, 6],
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      {pos.map(([dx, dy], i) => (
        <ellipse
          key={i}
          cx={dx}
          cy={dy}
          rx={long ? 3 : 4.2}
          ry={long ? 8 : 5}
          transform={long ? `rotate(${(i - 2) * 12} ${dx} ${dy})` : undefined}
          className="bz2-o bz2-thin bz2-yolk"
        />
      ))}
    </g>
  );
}

function Hopper({ x, y, s = 1, wings = true }: { x: number; y: number; s?: number; wings?: boolean }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* big hind leg */}
      <path d="M8 2 L-12 -18 L-26 10" className="bz2-o" style={{ strokeWidth: 3 }} />
      <path d="M24 6 L22 18 M30 4 L36 16" className="bz2-o" style={{ strokeWidth: 1.8 }} />
      {/* body */}
      <path d="M-34 0 Q-30 -10 0 -8 L32 -10 Q44 -8 46 2 Q42 10 30 10 L0 8 Q-30 8 -34 0Z" className="bz2-o bz2-leaf" />
      <path d="M-34 0 Q-30 -10 0 -8 L32 -10 Q44 -8 46 2 Q42 10 30 10 L0 8 Q-30 8 -34 0Z" fill={pat(id, "d")} />
      {wings ? (
        <path d="M24 -8 Q-10 -18 -38 -6 Q-10 -4 24 -2Z" className="bz2-o bz2-leaf2" />
      ) : (
        <path d="M24 -8 Q14 -14 8 -8 Q14 -4 24 -4Z" className="bz2-o bz2-leaf2" />
      )}
      <circle cx={40} cy={-2} r={2.4} className="bz2-ink-f" />
      <path d="M44 -6 Q60 -40 76 -46" className="bz2-o bz2-thin" />
    </g>
  );
}

function Stage({ x, y, t, n }: { x: number; y: number; t: string; n: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="bz2-lbl bz2-b">
      <tspan className="bz2-lvl-t">{n}. </tspan>
      {t}
    </text>
  );
}

function Complete() {
  return (
    <Frame w={W} h={H}>
      <Pop delay={0}>
        <Leaf x={70} y={70} s={0.8} />
        <Eggs x={70} y={64} />
      </Pop>
      <Pop delay={0.2}>
        <Leaf x={230} y={78} s={0.9} rot={-6} />
        <Caterpillar x={228} y={66} />
      </Pop>
      <Pop delay={0.4}>
        <Pupa x={230} y={200} />
      </Pop>
      <Pop delay={0.6}>
        <Butterfly x={70} y={200} />
      </Pop>
      <Stage x={70} y={110} t="vajíčko" n={1} />
      <Stage x={230} y={110} t="housenka" n={2} />
      <Stage x={230} y={254} t="kukla" n={3} />
      <Stage x={70} y={254} t="motýl" n={4} />
      <DrawArrow d="M118 58 Q150 44 176 56" tone="lvl" delay={0.2} />
      <DrawArrow d="M262 124 Q272 140 258 156" tone="lvl" delay={0.4} />
      <DrawArrow d="M196 222 Q150 246 120 222" tone="lvl" delay={0.6} />
      <DrawArrow d="M38 168 Q26 140 44 120" tone="lvl" delay={0.8} />
      <text x={150} y={150} textAnchor="middle" className="bz2-lbl bz2-sm bz2-muted-t">larva roste,</text>
      <text x={150} y={168} textAnchor="middle" className="bz2-lbl bz2-sm bz2-muted-t">svléká se</text>
    </Frame>
  );
}

function Incomplete() {
  return (
    <Frame w={W} h={H}>
      <Pop delay={0}>
        <path d="M30 86 Q70 76 110 86 L110 96 L30 96Z" className="bz2-o bz2-soil" />
        <Eggs x={70} y={70} long />
      </Pop>
      <Pop delay={0.2}>
        <Hopper x={214} y={76} s={0.75} wings={false} />
      </Pop>
      <Pop delay={0.4}>
        <Hopper x={150} y={206} s={1.05} />
      </Pop>
      <Stage x={70} y={118} t="vajíčka" n={1} />
      <Stage x={226} y={118} t="larva" n={2} />
      <Stage x={150} y={258} t="dospělá kobylka" n={3} />
      <DrawArrow d="M118 62 Q150 44 182 58" tone="lvl" delay={0.2} />
      <DrawArrow d="M240 132 Q248 158 222 182" tone="lvl" delay={0.4} />
      <DrawArrow d="M82 196 Q52 170 62 134" tone="lvl" delay={0.6} />
      <text x={150} y={150} textAnchor="middle" className="bz2-lbl bz2-sm bz2-muted-t">larva se svléká,</text>
      <text x={150} y={168} textAnchor="middle" className="bz2-lbl bz2-sm bz2-muted-t">kukla chybí</text>
    </Frame>
  );
}

export default function InsectMetamorphosis() {
  return (
    <Figure level={4} label={LABEL} max={760} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Proměna dokonalá – motýl",
              art: <Complete />,
              caption:
                "Larva (housenka) vůbec nevypadá jako dospělec; v kukle se celé tělo přestaví.",
            },
            {
              title: "Proměna nedokonalá – kobylka",
              art: <Incomplete />,
              caption:
                "Larva (nymfa) se podobá dospělci, jen nemá křídla; po každém svlékání je větší a křídla jí dorůstají.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
