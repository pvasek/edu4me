import { DrawArrow, Fade, Figure, Pop, pat, useFig } from "./kit";

const LABEL =
  "Pyramida energie a pravidlo 10 procent. Producenti, tedy rostliny, zachytí ze slunečního světla například 10 000 kJ. Býložravci, konzumenti 1. řádu, z toho získají jen asi 1 000 kJ, konzumenti 2. řádu asi 100 kJ a konzumenti 3. řádu, dravci na vrcholu, jen 10 kJ. Na každém stupni se zhruba 90 % energie spotřebuje na dýchání a pohyb a odejde jako teplo nebo zůstane v nestrávených zbytcích. Proto jsou potravní řetězce krátké a dravců je málo.";

const W = 440;
const H = 392;
const CX = 220;
const TH = 64;
const BASE = 352;

const TIERS = [
  { half: 186, name: "producenti (rostliny)", kj: "10 000 kJ" },
  { half: 146, name: "konzumenti 1. řádu", kj: "1 000 kJ" },
  { half: 106, name: "konzumenti 2. řádu", kj: "100 kJ" },
  { half: 72, name: "konzumenti 3. řádu", kj: "10 kJ" },
];

function Plate() {
  const { id } = useFig();
  return (
    <>
      <Fade>
        <text x={14} y={24} className="bz3-lbl bz3-sm bz3-b bz3-lvl-t">
          o patro výš přejde jen asi 10 %
        </text>
        <text x={W - 14} y={48} textAnchor="end" className="bz3-lbl bz3-sm bz3-b bz3-acc-t">
          asi 90 % odejde jako teplo
        </text>
      </Fade>
      {TIERS.map((t, i) => {
        const y = BASE - (i + 1) * TH;
        return (
          <Pop key={t.name} delay={0.1 + i * 0.3}>
            <rect x={CX - t.half} y={y} width={t.half * 2} height={TH} className={`bz3-tier bz3-tier-${i}`} />
            <rect x={CX - t.half} y={y} width={t.half * 2} height={TH} fill={pat(id, "d")} opacity={0.3} />
            <rect x={CX - t.half} y={y} width={t.half * 2} height={TH} className="bz3-o" />
            <text x={CX} y={y + 26} textAnchor="middle" className="bz3-lbl bz3-b bz3-sm">
              {t.name}
            </text>
            <text x={CX} y={y + 50} textAnchor="middle" className="bz3-kj">
              {t.kj}
            </text>
          </Pop>
        );
      })}
      {/* 10 % up the left ledges, heat off the right ledges */}
      {TIERS.slice(0, 3).map((t, i) => {
        const y = BASE - (i + 1) * TH;
        const next = TIERS[i + 1];
        const lx = CX - t.half + 14;
        const rx = CX + t.half - 20;
        let wave = `M${rx} ${y - 3}`;
        for (let k = 1; k <= 6; k++) wave += ` Q${rx + (k % 2 ? 6 : -6)} ${y - 3 - k * 6 + 3} ${rx} ${y - 3 - k * 6}`;
        return (
          <g key={i}>
            <DrawArrow
              d={`M${lx} ${y + 12} C${lx} ${y - 14} ${CX - next.half - 18} ${y - 20} ${CX - next.half + 8} ${y - 18}`}
              tone="lvl"
              delay={0.5 + i * 0.3}
              className="bz3-arr-w"
            />
            <DrawArrow d={wave} tone="acc" delay={0.6 + i * 0.3} />
            <Fade delay={0.8 + i * 0.3}>
              <text x={lx - 6} y={y - 14} textAnchor="end" className="bz3-lbl bz3-sm bz3-b bz3-lvl-t">
                10 %
              </text>
              <text x={rx + 10} y={y - 22} className="bz3-lbl bz3-sm bz3-acc-t">
                teplo
              </text>
            </Fade>
          </g>
        );
      })}
      <Fade delay={1.6}>
        <text x={CX} y={H - 14} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          šířky pater nejsou v měřítku
        </text>
      </Fade>
    </>
  );
}

export default function EnergyPyramid() {
  return (
    <Figure level={8} label={LABEL} w={W} h={H} max={580} replay>
      <Plate />
    </Figure>
  );
}
