import { Antibody, DrawArrow, Fade, Figure, Pop, blob } from "./kit";
import { Bacterium, Lymphocyte, Macrophage, PlasmaCell } from "./cells";

const LABEL =
  "Specifická imunitní odpověď. Antigen (třeba bakterii) pohltí makrofág a jeho kousky předvede na svém povrchu pomocnému T-lymfocytu. Aktivovaný pomocný T-lymfocyt spustí dvě větve. Látková (humorální) imunita: B-lymfocyt, který antigen rozpozná, se množí a mění v plazmatické buňky; ty vyrábějí protilátky, které se na antigen navážou a označí ho ke zničení. Buněčná imunita: cytotoxický T-lymfocyt najde tělu vlastní buňku napadenou virem a zničí ji. V obou větvích vznikají paměťové buňky, díky nimž je odpověď při dalším setkání se stejným antigenem rychlejší a silnější – na tom stojí očkování.";

const W = 500;
const H = 620;
const B_COL = "color-mix(in srgb, var(--lvl) 30%, var(--surface))";
const T_COL = "color-mix(in srgb, #5c9a6b 34%, var(--surface))";
const TH_COL = "color-mix(in srgb, #e0b43a 38%, var(--surface))";

function Cap({ x, y, a, b, cls = "" }: { x: number; y: number; a: string; b?: string; cls?: string }) {
  return (
    <g>
      <text x={x} y={y} textAnchor="middle" className={`bz4-lbl bz4-sm bz4-b ${cls}`}>
        {a}
      </text>
      {b && (
        <text x={x} y={y + 17} textAnchor="middle" className="bz4-lbl bz4-sm">
          {b}
        </text>
      )}
    </g>
  );
}

function Infected({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={blob(x, y, 30, 26, 7, 0.08)} className="bz4-o bz4-im-inf" />
      <circle cx={x - 4} cy={y + 2} r={10} fill="var(--bz4-nuc)" className="bz4-o bz4-thin" />
      {[
        [x + 14, y - 10],
        [x + 16, y + 10],
        [x - 18, y - 12],
      ].map(([vx, vy], i) => (
        <g key={i}>
          <polygon
            points={Array.from({ length: 6 }, (_, k) => {
              const a = (k / 6) * Math.PI * 2;
              return `${(vx + Math.cos(a) * 5).toFixed(1)},${(vy + Math.sin(a) * 5).toFixed(1)}`;
            }).join(" ")}
            className="bz4-o bz4-thin bz4-im-virus"
          />
        </g>
      ))}
    </g>
  );
}

export default function ImmuneResponse() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={620} replay>
      {/* row 1: antigen → macrophage → helper T */}
      <Pop delay={0.05}>
        <Bacterium x={46} y={52} rot={-20} />
        <Bacterium x={70} y={78} rot={15} />
        <Bacterium x={38} y={92} rot={60} />
        <Cap x={56} y={128} a="antigen" b="(bakterie)" cls="bz4-red-t" />
      </Pop>
      <DrawArrow d="M96 70 H130" delay={0.2} />
      <Pop delay={0.3}>
        <Macrophage x={176} y={72} s={1.15} />
        <Bacterium x={186} y={70} s={0.55} rot={30} />
        <Cap x={176} y={128} a="makrofág" b="pohltí a předvede" />
      </Pop>
      <DrawArrow d="M222 72 H274" delay={0.45} />
      <Pop delay={0.55}>
        <Lymphocyte x={310} y={72} s={1.2} fill={TH_COL} receptors />
        <Cap x={310} y={128} a="pomocný" b="T-lymfocyt" />
      </Pop>
      <Fade delay={0.6}>
        <text x={W - 10} y={66} textAnchor="end" className="bz4-lbl bz4-sm bz4-im-sec">
          aktivuje
        </text>
        <text x={W - 10} y={84} textAnchor="end" className="bz4-lbl bz4-sm bz4-im-sec">
          obě větve
        </text>
      </Fade>

      {/* branches */}
      <DrawArrow d="M290 152 C250 168 186 168 150 194" delay={0.7} />
      <DrawArrow d="M330 152 C350 168 372 170 382 194" delay={0.7} />
      <Fade delay={0.8}>
        <text x={130} y={170} textAnchor="end" className="bz4-lbl bz4-b bz4-lvl-t">
          látková imunita
        </text>
        <text x={402} y={170} className="bz4-lbl bz4-b bz4-im-t">
          buněčná
        </text>
      </Fade>

      {/* humoral: B cell → plasma cells + memory */}
      <Pop delay={0.9}>
        <Lymphocyte x={140} y={226} s={1.15} fill={B_COL} receptors />
        <Antibody x={164} y={204} s={0.6} rot={45} />
        <Cap x={64} y={222} a="B-lymfocyt" />
      </Pop>
      <DrawArrow d="M124 254 L96 300" delay={1.0} />
      <DrawArrow d="M156 254 L186 300" delay={1.0} />
      <Pop delay={1.1}>
        <PlasmaCell x={86} y={328} s={1.1} />
        <Cap x={86} y={372} a="plazmatická" b="buňka" />
        <Lymphocyte x={196} y={328} fill={B_COL} text="P" />
        <Cap x={196} y={372} a="paměťový" b="B-lymfocyt" />
      </Pop>
      <Fade delay={1.3}>
        {[
          [70, 412, -20],
          [96, 404, 10],
          [118, 420, 30],
          [80, 446, -5],
        ].map(([x, y, r], i) => (
          <Antibody key={i} x={x} y={y} s={0.85} rot={r} />
        ))}
        <text x={128} y={432} className="bz4-lbl bz4-sm bz4-b bz4-lvl-t">
          protilátky
        </text>
        <Bacterium x={86} y={494} rot={0} s={1.2} />
        <Antibody x={70} y={474} s={0.7} rot={150} />
        <Antibody x={104} y={472} s={0.7} rot={210} />
        <Cap x={86} y={530} a="antigen označen" b="ke zničení" />
      </Fade>

      {/* cellular: Tc → kills infected cell + memory */}
      <Pop delay={0.9}>
        <Lymphocyte x={384} y={226} s={1.15} fill={T_COL} receptors />
        <Cap x={450} y={210} a="cytotoxický" b="T-lymfocyt" />
      </Pop>
      <DrawArrow d="M368 254 L320 300" delay={1.0} />
      <DrawArrow d="M398 254 L420 300" delay={1.0} />
      <Pop delay={1.1}>
        <Lymphocyte x={304} y={328} fill={T_COL} text="P" />
        <Cap x={304} y={372} a="paměťový" b="T-lymfocyt" />
      </Pop>
      <Pop delay={1.3}>
        <Infected x={432} y={344} />
        <Lymphocyte x={432} y={300} s={0.8} fill={T_COL} />
        {[
          [418, 318],
          [428, 322],
          [440, 320],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} className="bz4-im-perf" />
        ))}
        <Cap x={432} y={392} a="zničí buňku" b="napadenou virem" />
      </Pop>

      {/* memory */}
      <Fade delay={1.6}>
        <path d="M196 396 V470 M304 396 V470" className="bz4-lead bz4-dash" />
        <rect x={168} y={474} width={W - 180} height={86} rx={8} className="bz4-tag-lvl" />
        <text x={168 + (W - 180) / 2} y={498} textAnchor="middle" className="bz4-lbl bz4-b">
          paměťové buňky
        </text>
        <text x={168 + (W - 180) / 2} y={520} textAnchor="middle" className="bz4-lbl bz4-sm">
          při dalším setkání rychlejší
        </text>
        <text x={168 + (W - 180) / 2} y={538} textAnchor="middle" className="bz4-lbl bz4-sm">
          a silnější odpověď
        </text>
        <text x={168 + (W - 180) / 2} y={556} textAnchor="middle" className="bz4-lbl bz4-sm bz4-lvl-t">
          = princip očkování
        </text>
      </Fade>
      <text x={W / 2} y={H - 12} textAnchor="middle" className="bz4-lbl bz4-sm bz4-muted-t">
        P = paměťová buňka
      </text>
    </Figure>
  );
}
