import { Draw, Fade, Figure, f1, pat, useFig } from "./kit";

const LABEL =
  "Energetická bilance Země v jednotkách: ze 100 jednotek slunečního záření, které přijdou na horní hranici atmosféry (100 jednotek = 340 W/m², IPCC AR6), se 29 odrazí zpět do vesmíru (22 od oblaků a vzduchu, 7 od povrchu – albedo Země je asi 0,29), 24 pohltí atmosféra a 47 pohltí zemský povrch. Ohřátý povrch vyzařuje 117 jednotek dlouhovlnného tepelného záření; 12 projde atmosférickým oknem do vesmíru, zbytek pohltí skleníkové plyny a oblaka. Atmosféra vrací k povrchu 100 jednotek zpětného záření (skleníkový efekt) a do vesmíru vyzáří 58. Povrch navíc ztrácí 24 jednotek výparem (latentní teplo) a 6 ohřevem vzduchu (citelné teplo). Vstup i výstup jsou téměř v rovnováze; chybějící asi 0,7 W/m² Zemi ohřívá.";

const W = 480;
const H = 488;
const K = 0.36; // px per unit
const TOP = 70; // top of the atmosphere
const SURF = 312;

type Kind = "sun" | "lw" | "back" | "heat" | "heat2";

/** A flow band: a thick stroke (width ∝ units) with an arrow head at its end. */
function Strand({
  d,
  u,
  kind,
  head,
  delay,
}: {
  d: string;
  u: number;
  kind: Kind;
  /** arrow head: tip point and direction */
  head?: { x: number; y: number; dir: "up" | "down" };
  delay: number;
}) {
  const w = Math.max(2.6, u * K);
  const hw = w / 2 + 5;
  const hl = Math.min(14, 6 + w * 0.3);
  return (
    <g>
      <Draw d={d} className={`gz6-st gz6-st-${kind}`} delay={delay} style={{ strokeWidth: w }} />
      {head && (
        <Fade delay={delay + 0.9}>
          <path
            className={`gz6-hd-${kind}`}
            d={
              head.dir === "up"
                ? `M${f1(head.x - hw)} ${f1(head.y + hl)} L${f1(head.x)} ${f1(head.y)} L${f1(head.x + hw)} ${f1(head.y + hl)} Z`
                : `M${f1(head.x - hw)} ${f1(head.y - hl)} L${f1(head.x)} ${f1(head.y)} L${f1(head.x + hw)} ${f1(head.y - hl)} Z`
            }
          />
        </Fade>
      )}
    </g>
  );
}

function Burst({ x, y, delay }: { x: number; y: number; delay: number }) {
  let d = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    d += `M${f1(x + Math.cos(a) * 4)} ${f1(y + Math.sin(a) * 4)} L${f1(x + Math.cos(a) * 9)} ${f1(y + Math.sin(a) * 9)} `;
  }
  return (
    <Fade delay={delay}>
      <path d={d} className="gz6-burst" />
    </Fade>
  );
}

const n = (x: number, y: number, t: string, anchor: "start" | "middle" | "end" = "middle", cls = "") => (
  <text x={x} y={y} textAnchor={anchor} className={`gz6-eq gz6-b gz6-halo ${cls}`}>
    {t}
  </text>
);

function Plate() {
  const { id } = useFig();
  // shortwave strands side by side in the incoming beam (left → right): 47, 7, 24, 22
  const x47 = 30 + (47 * K) / 2;
  const x7 = 30 + 47 * K + (7 * K) / 2 + 0.3;
  const x24 = 30 + 54 * K + (24 * K) / 2;
  const x22 = 30 + 78 * K + (22 * K) / 2;
  const IN0 = 54;
  // longwave group
  const xLat = 238;
  const xSen = xLat + (24 * K) / 2 + 3;
  const xBack = 300;
  const xEm = 352;
  const xWin = xEm + (117 * K) / 2 + 6;
  const xOut = 412;
  return (
    <>
      {/* space, atmosphere, surface */}
      <rect x={0} y={0} width={W} height={TOP} className="gz6-space" />
      <rect x={0} y={TOP} width={W} height={SURF - TOP} className="gz6-air" />
      <rect x={0} y={SURF} width={W} height={26} className="gz6-land" />
      <rect x={0} y={SURF} width={W} height={26} fill={pat(id, "d")} opacity={0.5} />
      <path d={`M0 ${TOP} H${W}`} className="gz6-o gz6-thin gz6-dash" />
      <path d={`M0 ${SURF} H${W}`} className="gz6-o" />
      <text x={275} y={TOP - 8} textAnchor="middle" className="gz6-lbl gz6-sm">
        horní hranice atmosféry
      </text>
      <text x={W - 8} y={SURF - 8} textAnchor="end" className="gz6-lbl gz6-sm gz6-halo">
        zemský povrch
      </text>
      {/* cloud */}
      <path
        d="M22 168 Q8 166 12 152 Q16 138 32 140 Q38 122 60 126 Q74 112 96 122 Q116 116 124 132 Q146 130 148 146 Q162 152 154 164 Q150 170 136 170 Z"
        className="gz6-cloud gz6-o"
      />
      <text x={150} y={186} textAnchor="middle" className="gz6-lbl gz6-sm gz6-halo">
        oblaka
      </text>

      {/* greenhouse gases */}
      <Fade delay={1.2}>
        <text x={276} y={100} textAnchor="middle" className="gz6-lbl gz6-b">
          skleníkové plyny
        </text>
        <text x={276} y={117} textAnchor="middle" className="gz6-lbl gz6-sm">
          a oblaka pohlcují
        </text>
        <text x={276} y={133} textAnchor="middle" className="gz6-lbl gz6-sm">
          a vyzařují teplo
        </text>
      </Fade>

      {/* ---------------- shortwave */}
      <Strand d={`M${f1(x47)} ${IN0} V${SURF + 2}`} u={47} kind="sun" delay={0} />
      <Strand
        d={`M${f1(x7)} ${IN0} V${SURF - 16} Q${f1(x7)} ${SURF - 6} ${f1(x7 + 12)} ${SURF - 6} H170 Q182 ${SURF - 6} 182 ${SURF - 18} V${IN0 + 8}`}
        u={7}
        kind="sun"
        head={{ x: 182, y: IN0 - 4, dir: "up" }}
        delay={0.2}
      />
      <Strand
        d={`M${f1(x24)} ${IN0} V206 Q${f1(x24)} 218 ${f1(x24 + 12)} 218 H96`}
        u={24}
        kind="sun"
        delay={0.1}
      />
      <Burst x={104} y={218} delay={1} />
      <Strand
        d={`M${f1(x22)} ${IN0} V136 Q${f1(x22)} 146 ${f1(x22 + 12)} 146 H112 Q124 146 124 134 V${IN0 + 8}`}
        u={22}
        kind="sun"
        head={{ x: 124, y: IN0 - 4, dir: "up" }}
        delay={0.1}
      />
      <Fade delay={0.9}>
        {n(48, 22, "100")}
        <text x={48} y={40} textAnchor="middle" className="gz6-lbl gz6-sm">
          ze Slunce
        </text>
        <text x={153} y={20} textAnchor="middle" className="gz6-lbl gz6-b">
          odraženo 29
        </text>
        <text x={153} y={37} textAnchor="middle" className="gz6-lbl gz6-sm">
          albedo ≈ 0,29
        </text>
        {n(132, 104, "22", "start")}
        {n(190, 104, "7", "start")}
        {n(116, 223, "24", "start")}
        <text x={136} y={223} className="gz6-lbl gz6-sm gz6-halo">
          pohltí
        </text>
        {n(48, SURF + 19, "47")}
      </Fade>

      {/* ---------------- longwave */}
      <Strand d={`M${xLat} ${SURF} V196`} u={24} kind="heat" delay={0.9} />
      <Strand d={`M${f1(xSen)} ${SURF} V206`} u={6} kind="heat2" delay={0.95} />
      <Burst x={xLat + 2} y={186} delay={1.6} />
      <Strand d={`M${xBack} 154 V${SURF - 14}`} u={100} kind="back" head={{ x: xBack, y: SURF - 1, dir: "down" }} delay={1.1} />
      <Strand d={`M${xEm} ${SURF} V176`} u={105} kind="lw" delay={0.8} />
      <Burst x={xEm} y={166} delay={1.6} />
      <Strand d={`M${f1(xWin)} ${SURF} V${IN0 + 8}`} u={12} kind="lw" head={{ x: xWin, y: IN0 - 4, dir: "up" }} delay={0.8} />
      <Strand d={`M${xOut} 136 V${IN0 + 8}`} u={58} kind="lw" head={{ x: xOut, y: IN0 - 4, dir: "up" }} delay={1.2} />
      <Fade delay={1.6}>
        <text x={394} y={20} textAnchor="middle" className="gz6-lbl gz6-b">
          vyzářeno 70
        </text>
        <text x={394} y={37} textAnchor="middle" className="gz6-lbl gz6-sm">
          58 atmosféra + 12 oknem
        </text>
        {n(xOut, 160, "58")}
        {n(xWin + 6, 104, "12", "start")}
        {n(xLat + 2, SURF + 19, "24 + 6")}
        {n(xBack, SURF + 19, "100")}
        {n(xEm + 4, SURF + 19, "117")}
      </Fade>

      {/* ---------------- legend */}
      <Fade delay={1.9}>
        {(
          [
            ["sun", "krátkovlnné sluneční záření"],
            ["lw", "dlouhovlnné (tepelné) záření povrchu a atmosféry"],
            ["back", "zpětné záření atmosféry – skleníkový efekt"],
            ["heat", "výpar 24 (latentní teplo) a ohřev vzduchu 6 (citelné teplo)"],
          ] as [Kind, string][]
        ).map(([k, t], i) => (
          <g key={k}>
            <path d={`M10 ${362 + i * 21} h26`} className={`gz6-st gz6-st-${k}`} style={{ strokeWidth: 9 }} />
            <text x={44} y={367 + i * 21} className="gz6-lbl gz6-sm">
              {t}
            </text>
          </g>
        ))}
        <text x={10} y={462} className="gz6-eq gz6-eq-sm">
          100 jednotek = 340 W/m² (průměr za Zemi a rok, IPCC AR6)
        </text>
        <text x={10} y={480} className="gz6-eq gz6-eq-sm gz6-tone-lvl">
          povrch: přijme 47 + 100 = 147, odevzdá 117 + 24 + 6 = 147
        </text>
      </Fade>
    </>
  );
}

export default function RadiationBudget() {
  return (
    <Figure label={LABEL} w={W} h={H} max={640} boost={false} replay>
      <Plate />
    </Figure>
  );
}
