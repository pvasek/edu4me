import { ChemText, DrawArrow, Figure, Fade, Pop } from "./kit";
import { PeaFlower } from "./bio";

const LABEL =
  "Mendelův pokus s hrachem. Rodiče: rostlina s fialovými květy (genotyp AA) zkřížená s rostlinou s bílými květy (aa). Všichni potomci první generace F₁ kvetou fialově a mají genotyp Aa, protože alela A pro fialovou barvu je dominantní a alela a pro bílou recesivní. Když se rostliny F₁ opylí mezi sebou, ukazuje Punnettův čtverec gamety A a a a čtyři stejně pravděpodobné kombinace: AA, Aa, Aa a aa. Ve druhé generaci F₂ tak vychází poměr fenotypů 3 fialové : 1 bílý a poměr genotypů 1 : 2 : 1.";

const W = 400;
const H = 512;

const CELL_W = 84;
const CELL_H = 78;
const GX = 146; // grid left
const GY = 300; // grid top

function Gamete({ x, y, a }: { x: number; y: number; a: "A" | "a" }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} className="bz3-gamete" />
      <text x={x} y={y + 6} textAnchor="middle" className="bz3-allele">
        {a}
      </text>
    </g>
  );
}

function Geno({ x, y, g, lvl = false }: { x: number; y: number; g: string; lvl?: boolean }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={`bz3-allele bz3-allele-sm ${lvl ? "bz3-lvl-t" : ""}`}>
      {g}
    </text>
  );
}

export default function PunnettPeas() {
  const cells: { g: string; white: boolean }[][] = [
    [
      { g: "AA", white: false },
      { g: "Aa", white: false },
    ],
    [
      { g: "Aa", white: false },
      { g: "aa", white: true },
    ],
  ];
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={540} replay>
      {/* P */}
      <Fade>
        <text x={14} y={26} className="bz3-lbl bz3-b bz3-sm">
          rodiče (P)
        </text>
      </Fade>
      <Pop delay={0.05}>
        <PeaFlower x={120} y={60} s={1.25} />
        <Geno x={120} y={120} g="AA" />
      </Pop>
      <Fade delay={0.2}>
        <text x={200} y={74} textAnchor="middle" className="bz3-cross">
          ×
        </text>
      </Fade>
      <Pop delay={0.25}>
        <PeaFlower x={280} y={60} s={1.25} white />
        <Geno x={280} y={120} g="aa" />
      </Pop>
      <DrawArrow d="M200 100 V136" tone="lvl" delay={0.5} />

      {/* F1 */}
      <Fade delay={0.6}>
        <text x={14} y={158} className="bz3-lbl bz3-b bz3-big">
          <ChemText text="F_{1}" />
        </text>
        <text x={W - 14} y={156} textAnchor="end" className="bz3-lbl bz3-sm">
          všechny fialové
        </text>
      </Fade>
      {[140, 180, 220, 260].map((x, i) => (
        <Pop key={x} delay={0.7 + i * 0.06}>
          <PeaFlower x={x} y={176} s={0.8} />
          <Geno x={x} y={222} g="Aa" />
        </Pop>
      ))}
      <Fade delay={1}>
        <text x={200} y={248} textAnchor="middle" className="bz3-lbl bz3-sm">
          <ChemText text="F_{1} × F_{1} (samoopylení)" />
        </text>
      </Fade>

      {/* Punnett square */}
      <Fade delay={1.1}>
        <text x={14} y={GY + 40} className="bz3-lbl bz3-b bz3-big">
          <ChemText text="F_{2}" />
        </text>
        <text x={GX - 44} y={GY - 15} textAnchor="end" className="bz3-lbl bz3-sm bz3-muted-t">
          gamety
        </text>
        <Gamete x={GX + CELL_W * 0.5} y={GY - 20} a="A" />
        <Gamete x={GX + CELL_W * 1.5} y={GY - 20} a="a" />
        <Gamete x={GX - 22} y={GY + CELL_H * 0.5} a="A" />
        <Gamete x={GX - 22} y={GY + CELL_H * 1.5} a="a" />
        <rect x={GX} y={GY} width={CELL_W * 2} height={CELL_H * 2} className="bz3-o bz3-fill" />
        <path
          d={`M${GX + CELL_W} ${GY} V${GY + CELL_H * 2} M${GX} ${GY + CELL_H} H${GX + CELL_W * 2}`}
          className="bz3-o"
        />
      </Fade>
      {cells.map((row, r) =>
        row.map((c, k) => (
          <Pop key={`${r}${k}`} delay={1.35 + (r * 2 + k) * 0.12}>
            {c.white && (
              <rect
                x={GX + CELL_W * k + 3}
                y={GY + CELL_H * r + 3}
                width={CELL_W - 6}
                height={CELL_H - 6}
                rx={4}
                className="bz3-tag-lvl"
              />
            )}
            <PeaFlower
              x={GX + CELL_W * (k + 0.5)}
              y={GY + CELL_H * r + 30}
              s={0.78}
              white={c.white}
            />
            <Geno
              x={GX + CELL_W * (k + 0.5)}
              y={GY + CELL_H * r + 72}
              g={c.g}
            />
          </Pop>
        )),
      )}

      {/* result */}
      <Fade delay={2}>
        <text x={W / 2} y={GY + CELL_H * 2 + 30} textAnchor="middle" className="bz3-lbl bz3-b">
          fenotyp 3 fialové : 1 bílý
        </text>
        <text x={W / 2} y={GY + CELL_H * 2 + 52} textAnchor="middle" className="bz3-lbl bz3-sm">
          genotyp 1 AA : 2 Aa : 1 aa
        </text>
      </Fade>
    </Figure>
  );
}
