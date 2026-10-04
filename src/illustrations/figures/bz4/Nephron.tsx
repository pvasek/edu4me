import { Arrow, Draw, DrawArrow, Fade, Figure, Lbl, Num, Pop, pat, smooth, useFig, type P2 } from "./kit";

const LABEL =
  "Nefron, základní jednotka ledviny. V kůře ledviny leží ledvinné tělísko: klubíčko vlásečnic (glomerulus) v Bowmanově váčku; přívodná tepénka je širší než odvodná, takže krev je pod tlakem. 1. Filtrace: do váčku projde voda, ionty, glukóza a močovina, ale ne krvinky a bílkoviny. 2. V proximálním kanálku se zpět do krve vstřebá glukóza, aminokyseliny, většina vody a sodíku. 3. Henleova klička sestupuje do dřeně: ze sestupného raménka odchází voda, ze vzestupného ionty Na⁺ a Cl⁻, a dřeň se tím zahušťuje. Následuje distální kanálek a sběrný kanálek. 4. Hormon ADH zvýší propustnost sběrného kanálku pro vodu, víc vody se vrátí do krve a moč je koncentrovanější. Moč odtéká do ledvinné pánvičky.";

const W = 480;
const H = 664;
const C: P2 = [118, 124]; // renal corpuscle
const CORTEX = 236;
const DESC = 252;
const ASC = 292;
const BOTTOM = 486;
const DUCT = 424;

const PCT: P2[] = [
  [160, 124],
  [176, 100],
  [196, 128],
  [214, 98],
  [234, 124],
  [DESC, 150],
  [DESC, 190],
];
const DCT: P2[] = [
  [ASC, 214],
  [ASC, 186],
  [306, 164],
  [326, 190],
  [346, 160],
  [366, 188],
  [390, 162],
  [DUCT, 168],
];
const tubule =
  smooth(PCT) +
  ` L${DESC} ${BOTTOM - 20} C${DESC} ${BOTTOM + 8} ${ASC} ${BOTTOM + 8} ${ASC} ${BOTTOM - 20} L${ASC} 214 ` +
  smooth(DCT).replace(/^M[^C]*/, "");

function Tube({ d, w = 13, delay = 0 }: { d: string; w?: number; delay?: number }) {
  return (
    <g>
      <Draw d={d} className="bz4-nf-tube-o" delay={delay} style={{ strokeWidth: w }} />
      <Draw d={d} className="bz4-nf-tube-i" delay={delay} style={{ strokeWidth: w - 4.5 }} />
    </g>
  );
}

function Corpuscle() {
  const { id } = useFig();
  const [x, y] = C;
  // capsule: a cup open towards the vascular pole (left)
  const cup = (r: number) =>
    `M${x - r * 0.8} ${y - r * 0.6} A${r} ${r} 0 1 1 ${x - r * 0.8} ${y + r * 0.6}`;
  const loops = [
    [-8, -10, 9],
    [8, -12, 8],
    [12, 4, 9],
    [-4, 10, 9],
    [-14, 2, 7],
    [2, -2, 7],
  ];
  return (
    <g>
      <path d={`${cup(44)} L${x - 34 * 0.8} ${y + 34 * 0.6} A34 34 0 1 0 ${x - 34 * 0.8} ${y - 34 * 0.6}Z`} className="bz4-o bz4-nf-caps" />
      <path d={`${cup(44)} L${x - 34 * 0.8} ${y + 34 * 0.6} A34 34 0 1 0 ${x - 34 * 0.8} ${y - 34 * 0.6}Z`} fill={pat(id, "d")} opacity={0.4} />
      <circle cx={x} cy={y} r={34} className="bz4-nf-space" />
      {/* arterioles: afferent (wide) in, efferent (narrow) out */}
      <path d={`M8 ${y - 30} C40 ${y - 30} 60 ${y - 12} ${x - 14} ${y - 6}`} className="bz4-nf-art" style={{ strokeWidth: 10 }} />
      <path d={`M${x - 14} ${y + 6} C60 ${y + 14} 40 ${y + 40} 8 ${y + 44}`} className="bz4-nf-art" style={{ strokeWidth: 6 }} />
      {loops.map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx} cy={y + dy} r={r} className="bz4-nf-glom" />
      ))}
    </g>
  );
}

function Out({ x, y, dx, tone, t }: { x: number; y: number; dx: number; tone: "blue" | "acc"; t: string }) {
  return (
    <g>
      <DrawArrow d={`M${x} ${y} h${dx}`} tone={tone} delay={1.2} />
      <text
        x={x + dx + (dx < 0 ? -3 : 3)}
        y={y + 5}
        textAnchor={dx < 0 ? "end" : "start"}
        className={`bz4-nf-ion ${tone === "blue" ? "bz4-blue-t" : "bz4-acc-t"}`}
      >
        {t}
      </text>
    </g>
  );
}

export default function Nephron() {
  return (
    <Figure level={11} label={LABEL} w={W} h={H} max={600} replay>
      {/* zones */}
      <rect x={4} y={14} width={W - 8} height={CORTEX - 14} rx={6} className="bz4-nf-cortex" />
      <rect x={4} y={CORTEX} width={W - 8} height={BOTTOM + 44 - CORTEX} rx={6} className="bz4-nf-medulla" />
      <text x={12} y={CORTEX - 8} className="bz4-lbl bz4-sm bz4-muted-t">kůra</text>
      <text x={12} y={CORTEX + 20} className="bz4-lbl bz4-sm bz4-muted-t">dřeň</text>

      <Corpuscle />
      <Tube d={tubule} delay={0.2} />
      <Tube d={`M${DUCT} 26 V${BOTTOM + 30}`} w={17} delay={0.5} />
      <DrawArrow d={`M${DUCT} ${BOTTOM + 34} V${BOTTOM + 60}`} tone="ink" delay={1.4} />

      {/* exchanges */}
      <Fade delay={1.1}>
        {/* filtration */}
        {[-30, 0, 30].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <Arrow
              key={a}
              d={`M${(C[0] + 22 * Math.cos(r)).toFixed(1)} ${(C[1] + 22 * Math.sin(r)).toFixed(1)} L${(C[0] + 33 * Math.cos(r)).toFixed(1)} ${(C[1] + 33 * Math.sin(r)).toFixed(1)}`}
              tone="lvl"
            />
          );
        })}
        {/* proximal reabsorption */}
        <DrawArrow d="M196 140 V164" tone="lvl" delay={1.2} />
        <DrawArrow d="M222 110 L222 82" tone="lvl" delay={1.2} />
        <Out x={DESC - 9} y={300} dx={-26} tone="blue" t="H₂O" />
        <Out x={DESC - 9} y={372} dx={-26} tone="blue" t="H₂O" />
        <Out x={ASC + 9} y={300} dx={26} tone="acc" t="Na⁺ Cl⁻" />
        <Out x={ASC + 9} y={372} dx={26} tone="acc" t="Na⁺ Cl⁻" />
        <Out x={DUCT - 11} y={420} dx={-24} tone="blue" t="H₂O" />
        <Out x={DUCT - 11} y={460} dx={-24} tone="blue" t="H₂O" />
      </Fade>
      <Pop delay={1.3}>
        <Num x={C[0] + 20} y={C[1] + 60} n={1} />
        <Num x={196} y={182} n={2} />
        <Num x={(DESC + ASC) / 2} y={440} n={3} />
        <Num x={DUCT - 30} y={392} n={4} />
        <g>
          <rect x={DUCT + 14} y={404} width={42} height={24} rx={5} className="bz4-tag-lvl" />
          <text x={DUCT + 35} y={421} textAnchor="middle" className="bz4-nf-ion bz4-lvl-t">
            ADH
          </text>
        </g>
      </Pop>

      {/* structure labels */}
      <Fade delay={0.8}>
        <Lbl x={20} y={52} tx={C[0] - 6} ty={C[1] - 8} className="bz4-sm">
          glomerulus
        </Lbl>
        <Lbl x={150} y={36} tx={C[0] + 26} ty={C[1] - 38} className="bz4-sm">
          Bowmanův váček
        </Lbl>
        <text x={8} y={C[1] - 40} className="bz4-lbl bz4-sm bz4-red-t">přívodná</text>
        <text x={8} y={C[1] + 66} className="bz4-lbl bz4-sm bz4-red-t">odvodná tepénka</text>
        <Lbl x={262} y={70} tx={230} ty={104} className="bz4-sm">
          proximální kanálek
        </Lbl>
        <Lbl x={306} y={128} tx={326} ty={182} className="bz4-sm">
          distální kanálek
        </Lbl>
        <text x={DESC - 16} y={BOTTOM - 4} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">
          Henleova klička
        </text>
        <text
          x={W - 14}
          y={300}
          textAnchor="middle"
          transform={`rotate(90 ${W - 14} 300)`}
          className="bz4-lbl bz4-sm bz4-b"
        >
          sběrný kanálek
        </text>
        <text x={DUCT - 12} y={BOTTOM + 58} textAnchor="end" className="bz4-lbl bz4-sm bz4-b">
          moč do pánvičky
        </text>
      </Fade>

      {/* legend */}
      <Fade delay={1.5}>
        {[
          "filtrace: voda, ionty, glukóza, močovina (ne krvinky a bílkoviny)",
          "zpět do krve: glukóza, aminokyseliny, většina vody a Na⁺",
          "klička: voda ven v sestupném, Na⁺ a Cl⁻ ve vzestupném raménku",
          "ADH: víc vody zpět do krve, moč je koncentrovanější",
        ].map((t, i) => (
          <g key={i}>
            <Num x={16} y={H - 82 + i * 22} n={i + 1} r={8.5} />
            <text x={32} y={H - 77 + i * 22} className="bz4-lbl bz4-sm">
              {t}
            </text>
          </g>
        ))}
      </Fade>
    </Figure>
  );
}
