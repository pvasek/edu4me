import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, Lbl, f1, pat, sine, useFig } from "./kit";

const LABEL =
  "Lac operon bakterie Escherichia coli ve dvou stavech. Na DNA leží za sebou regulační gen pro represor, promotor, operátor a tři strukturní geny lacZ, lacY a lacA pro využití laktózy. 1. Bez laktózy: represor sedí na operátoru a RNA-polymeráza přes něj nemůže, geny se nepřepisují – operon je vypnutý. 2. S laktózou: laktóza (přesněji allolaktóza) se naváže na represor, ten změní tvar a z operátoru se uvolní; RNA-polymeráza přepisuje geny do jedné mRNA a vznikají enzymy, které laktózu přijmou a rozštěpí – operon je zapnutý.";

const W = 440;
const H = 248;
const DY = 162; // DNA axis

const SEG = {
  lacI: [14, 78],
  P: [118, 158],
  O: [158, 192],
  Z: [192, 290],
  Y: [290, 358],
  A: [358, 424],
} as const;

function Dna() {
  const { id } = useFig();
  const g = (k: keyof typeof SEG, cls: string, t: string, it = true) => {
    const [a, b] = SEG[k];
    return (
      <g key={k}>
        <rect x={a} y={DY - 12} width={b - a} height={24} className={`bz4-o ${cls}`} />
        <rect x={a} y={DY - 12} width={b - a} height={24} fill={pat(id, "d")} opacity={0.35} />
        <text
          x={(a + b) / 2}
          y={DY + 5}
          textAnchor="middle"
          className={`bz4-lo-gene ${it ? "bz4-it" : ""}`}
        >
          {t}
        </text>
      </g>
    );
  };
  return (
    <g>
      <path d={`M6 ${DY - 6} H${W - 6} M6 ${DY + 6} H${W - 6}`} className="bz4-o" />
      {Array.from({ length: 42 }, (_, i) => (
        <line key={i} x1={10 + i * 10} x2={10 + i * 10} y1={DY - 6} y2={DY + 6} className="bz4-o bz4-thin" />
      ))}
      {g("lacI", "bz4-lo-reg", "lacI")}
      {g("P", "bz4-fill3", "P", false)}
      {g("O", "bz4-lo-op", "O", false)}
      {g("Z", "bz4-lo-str", "lacZ")}
      {g("Y", "bz4-lo-str", "lacY")}
      {g("A", "bz4-lo-str", "lacA")}
      <text x={46} y={DY + 32} textAnchor="middle" className="bz4-lbl bz4-sm">
        regulační gen
      </text>
      <text x={138} y={DY + 32} textAnchor="middle" className="bz4-lbl bz4-sm">
        promotor
      </text>
      <text x={186} y={DY + 50} textAnchor="middle" className="bz4-lbl bz4-sm">
        operátor
      </text>
      <path d={`M${SEG.Z[0]} ${DY + 22} V${DY + 28} H${SEG.A[1]} V${DY + 22}`} className="bz4-lead" />
      <text x={(SEG.Z[0] + SEG.A[1]) / 2 + 16} y={DY + 46} textAnchor="middle" className="bz4-lbl bz4-sm">
        geny pro využití laktózy
      </text>
    </g>
  );
}

/** the repressor: a dimer with a notch for the DNA (bound) or a twisted, inactive shape */
function Repressor({ x, y, active = true }: { x: number; y: number; active?: boolean }) {
  const { id } = useFig();
  const d = active
    ? "M-20 10 C-24 -6 -16 -20 -2 -20 C2 -24 14 -22 20 -12 C26 -2 22 10 18 12 L10 12 L10 4 L-10 4 L-10 12Z"
    : "M-18 12 C-26 0 -18 -18 -4 -18 C4 -26 20 -20 22 -8 C26 4 16 14 8 12 C2 16 -8 18 -18 12Z";
  return (
    <g transform={`translate(${f1(x)} ${f1(y)})${active ? "" : " rotate(-18)"}`}>
      <path d={d} className="bz4-o bz4-lo-rep" />
      <path d={d} fill={pat(id, "d")} opacity={0.4} className="bz4-nohit" />
    </g>
  );
}

function Polymerase({ x, y }: { x: number; y: number }) {
  const { id } = useFig();
  const d = "M-24 12 C-30 -4 -22 -24 0 -24 C22 -24 30 -6 24 12Z";
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={d} className="bz4-o bz4-prot2" />
      <path d={d} fill={pat(id, "b")} opacity={0.45} className="bz4-nohit" />
    </g>
  );
}

/** lactose: two linked hexagonal rings (galactose + glucose) */
function Lactose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const hex = (cx: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      return `${f1(cx + Math.cos(a) * 5)} ${f1(Math.sin(a) * 5)}`;
    }).join(" L");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="bz4-lo-lac">
      <path d={`M${hex(-6)}Z`} />
      <path d={`M${hex(7)}Z`} />
    </g>
  );
}

function Off() {
  return (
    <Frame w={W} h={H} className="bz4-lo">
      <Dna />
      {/* repressor made from lacI */}
      <path d={sine(46, DY - 16, 44, 3, 11)} className="bz4-lo-mrna" transform={`rotate(-90 46 ${DY - 16})`} />
      <Repressor x={46} y={DY - 86} />
      <Repressor x={175} y={DY - 24} />
      <Polymerase x={128} y={DY - 34} />
      <path d={`M151 ${DY - 66} L163 ${DY - 54} M163 ${DY - 66} L151 ${DY - 54}`} className="bz4-lo-x" />
      <Lbl x={W - 8} y={DY - 34} tx={190} ty={DY - 34} anchor="end" className="bz4-sm">
        represor na operátoru
      </Lbl>
      <text x={46} y={DY - 118} textAnchor="middle" className="bz4-lbl bz4-b">
        represor
      </text>
      <text x={112} y={DY - 72} textAnchor="middle" className="bz4-lbl bz4-sm">
        RNA-polymeráza
      </text>
      <text x={330} y={64} textAnchor="middle" className="bz4-lbl bz4-b bz4-red-t">
        geny se nepřepisují
      </text>
      <text x={330} y={86} textAnchor="middle" className="bz4-lbl bz4-sm">
        operon je vypnutý
      </text>
    </Frame>
  );
}

function On() {
  // mRNA copied so far, trailing from the promoter end to the moving polymerase
  const pol = 318;
  return (
    <Frame w={W} h={H} className="bz4-lo">
      <Dna />
      {/* lactose in the cell */}
      {[
        [30, 30],
        [104, 22],
        [400, 26],
        [176, 34],
      ].map(([x, y], i) => (
        <Lactose key={i} x={x} y={y} />
      ))}
      <Repressor x={84} y={DY - 78} active={false} />
      <Lactose x={84} y={DY - 80} s={0.9} />
      <Arrow d={`M156 ${DY - 30} C144 ${DY - 56} 128 ${DY - 70} 112 ${DY - 76}`} tone="ink" dashed />
      <text x={84} y={DY - 38} textAnchor="middle" className="bz4-lbl bz4-sm">
        represor
      </text>
      <text x={84} y={DY - 22} textAnchor="middle" className="bz4-lbl bz4-sm">
        + laktóza
      </text>
      {/* transcription */}
      <path d={`M${SEG.Z[0] - 4} ${DY - 18} C${SEG.Z[0] + 30} ${DY - 30} ${pol - 70} ${DY - 74} ${pol - 30} ${DY - 52} L${pol} ${DY - 30}`} className="bz4-lo-mrna" />
      <Polymerase x={pol} y={DY - 34} />
      <Arrow d={`M${pol + 30} ${DY - 30} H${pol + 64}`} tone="lvl" />
      <text x={232} y={DY - 72} textAnchor="middle" className="bz4-lbl bz4-sm bz4-b" style={{ fill: "#94589a" }}>
        mRNA
      </text>
      <Arrow d={`M276 ${DY - 70} L304 ${DY - 86}`} tone="muted" dashed />
      {/* enzymes */}
      <g transform={`translate(316 ${DY - 96})`}>
        <path d="M-14 6 C-18 -6 -8 -14 2 -12 C12 -10 16 0 12 8 C6 14 -10 14 -14 6Z" className="bz4-o bz4-protein" />
        <path d="M12 -2 L18 -6 L18 4Z" className="bz4-fill" />
      </g>
      <Lactose x={348} y={DY - 106} s={0.9} />
      <text x={W - 8} y={DY - 66} textAnchor="end" className="bz4-lbl bz4-sm">
        enzym štěpí laktózu
      </text>
      <text x={250} y={DY - 112} textAnchor="end" className="bz4-lbl bz4-b bz4-good-t">
        operon zapnutý
      </text>
    </Frame>
  );
}

export default function LacOperon() {
  return (
    <Figure level={10} label={LABEL} max={920} interactive boost={false}>
      <div className="bz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={320}
          steps={[
            {
              title: "Bez laktózy: vypnuto",
              art: <Off />,
              caption:
                "Represor sedí na operátoru. RNA-polymeráza se přes něj nedostane, geny lacZ, lacY a lacA se nepřepisují.",
            },
            {
              title: "S laktózou: zapnuto",
              art: <On />,
              caption:
                "Laktóza se naváže na represor, ten změní tvar a pustí operátor. Geny se přepíšou do mRNA a vzniknou enzymy na laktózu.",
            },
          ]}
        />
      </div>
    </Figure>
  );
}
