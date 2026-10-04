import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, StripBox } from "./kit";

const LABEL =
  "Gentrifikace jedné vnitroměstské ulice ve čtyřech krocích. Úpadek: domy chátrají, okna jsou zatlučená, nájmy nízké. Umělci a studenti: levné byty a ateliéry přitáhnou kreativní lidi, objeví se malby na zdech a kola. Renovace a kavárny: investoři opravují domy, otevírají se kavárny, přicházejí lidé s vyššími příjmy. Vysoké nájmy a vytlačení: z bytů jsou luxusní byty, nájemné vyletí a původní obyvatelé se musí odstěhovat.";

const W = 240;
const H = 200;
const GROUND = 172;
const HOUSES = [
  { x: 14, w: 66, h: 112 },
  { x: 84, w: 70, h: 124 },
  { x: 158, w: 68, h: 106 },
];

type Stage = 1 | 2 | 3 | 4;

function Person({ x, y, cls = "gz7-person" }: { x: number; y: number; cls?: string }) {
  return (
    <g className={cls}>
      <circle cx={x} cy={y - 21} r={4} className="gz7-o gz7-thin" />
      <path d={`M${x - 5} ${y} L${x - 4} ${y - 15} Q${x} ${y - 18} ${x + 4} ${y - 15} L${x + 5} ${y} Z`} className="gz7-o gz7-thin" />
    </g>
  );
}

function House({ x, w, h, stage, k }: { x: number; w: number; h: number; stage: Stage; k: number }) {
  const top = GROUND - h;
  const fill =
    stage === 1
      ? "gz7-facade-old"
      : stage === 2
        ? k === 1
          ? "gz7-facade-mid"
          : "gz7-facade-old"
        : stage === 3
          ? k === 2
            ? "gz7-facade-old"
            : "gz7-facade-new"
          : "gz7-facade-lux";
  const rows = 3;
  const cols = 2;
  const ww = 13;
  const wh = 17;
  const wins = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const wx = x + w / 2 + (c === 0 ? -ww - 6 : 6);
      const wy = top + 16 + r * ((h - 40) / rows);
      const boarded = stage === 1 && (r + c + k) % 3 === 0;
      const dark = stage === 1 && !boarded && (r * 2 + c + k) % 4 === 1;
      wins.push(
        <g key={`${r}-${c}`}>
          <rect x={wx} y={wy} width={ww} height={wh} className={`${dark ? "gz7-win-dark" : stage >= 3 ? "gz7-win-lit" : "gz7-win"} gz7-o gz7-thin`} />
          {boarded && (
            <path d={`M${wx - 2} ${wy + 4} L${wx + ww + 2} ${wy + wh - 6} M${wx - 2} ${wy + wh - 4} L${wx + ww + 2} ${wy + 5}`} className="gz7-plank" />
          )}
          {stage === 2 && k === 1 && r === 0 && <path d={`M${wx + 2} ${wy + wh} q4 -8 9 0`} className="gz7-plant" />}
          {stage >= 3 && !(stage === 3 && k === 2) && <path d={`M${wx} ${wy + wh + 2} h${ww}`} className="gz7-o gz7-thin" />}
        </g>,
      );
    }
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} className={`${fill} gz7-o`} />
      {/* cornice */}
      <path d={`M${x - 3} ${top} h${w + 6}`} className="gz7-o" style={{ strokeWidth: 2.4 }} />
      {stage === 4 && k !== 0 && (
        // glass penthouse on top
        <path d={`M${x + 8} ${top} v-16 h${w - 16} v16`} className="gz7-glass-f gz7-o gz7-thin" />
      )}
      {stage === 1 && (
        // cracks and peeling plaster
        <path d={`M${x + 6} ${top + 30} l6 8 -3 6 5 9 M${x + w - 10} ${top + h - 40} l-5 7 2 6`} className="gz7-o gz7-thin gz7-crack" />
      )}
      {wins}
      {/* door */}
      <rect x={x + w / 2 - 7} y={GROUND - 22} width={14} height={22} className={`${stage === 1 && k === 0 ? "gz7-win-dark" : "gz7-door"} gz7-o gz7-thin`} />
    </g>
  );
}

function Rent({ level }: { level: Stage }) {
  return (
    <g>
      <text x={W - 70} y={20} textAnchor="end" className="gz7-lbl gz7-sm">
        nájem
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={W - 64 + i * 14}
          y={22 - (i + 1) * 4.5}
          width={10}
          height={(i + 1) * 4.5}
          className={`${i < level ? "gz7-rent-on" : "gz7-rent-off"} gz7-o gz7-thin`}
        />
      ))}
    </g>
  );
}

function Street({ stage }: { stage: Stage }) {
  return (
    <Frame w={W} h={H} className="gz7-small">
      <Rent level={stage} />
      {HOUSES.map((h, k) => (
        <House key={k} {...h} stage={stage} k={k} />
      ))}
      {/* pavement */}
      <path d={`M4 ${GROUND} H${W - 4}`} className="gz7-o" />
      <path d={`M4 ${GROUND + 8} H${W - 4}`} className="gz7-o gz7-thin" />

      {stage === 1 && (
        <>
          <rect x={98} y={88} width={42} height={16} rx={2} className="gz7-sign gz7-o gz7-thin" />
          <text x={119} y={100} textAnchor="middle" className="gz7-sign-t">
            PRÁZDNÉ
          </text>
          <path d="M196 172 v-14 h14 v14" className="gz7-gray-fill gz7-o gz7-thin" />
          <Person x={44} y={GROUND} />
        </>
      )}
      {stage === 2 && (
        <>
          {/* mural on the left house */}
          <circle cx={36} cy={128} r={11} className="gz7-mural1 gz7-o gz7-thin" />
          <path d="M48 140 q10 -22 26 -10 q-6 14 -26 10z" className="gz7-mural2 gz7-o gz7-thin" />
          <rect x={160} y={140} width={40} height={14} rx={2} className="gz7-sign gz7-o gz7-thin" />
          <text x={180} y={151} textAnchor="middle" className="gz7-sign-t">
            ATELIÉR
          </text>
          {/* bicycle */}
          <g className="gz7-o gz7-thin">
            <circle cx={204} cy={184} r={7} className="gz7-o gz7-thin" />
            <circle cx={228} cy={184} r={7} className="gz7-o gz7-thin" />
            <path d="M204 184 l8 -11 h10 l6 11 M212 173 l4 11 h-12 M222 173 l-2 -4 h-4" className="gz7-o gz7-thin" />
          </g>
          <Person x={150} y={GROUND} cls="gz7-person gz7-person-y" />
          <Person x={70} y={GROUND} cls="gz7-person gz7-person-y" />
        </>
      )}
      {stage === 3 && (
        <>
          {/* scaffolding on the right house */}
          <path d="M154 172 V58 M230 172 V58 M154 80 H230 M154 110 H230 M154 140 H230 M154 80 L230 110 M154 140 L230 110" className="gz7-scaffold" />
          {/* café awning and table */}
          <path d="M84 132 h70 l-6 14 h-58 z" className="gz7-awning gz7-o gz7-thin" />
          <path d="M84 132 h70" className="gz7-o" />
          <text x={119} y={128} textAnchor="middle" className="gz7-sign-t gz7-sign-cafe">
            KAVÁRNA
          </text>
          <path d="M60 166 h18 M69 166 v6 M100 166 h18 M109 166 v6" className="gz7-o" />
          <Person x={56} y={GROUND} cls="gz7-person gz7-person-n" />
          <Person x={124} y={GROUND} cls="gz7-person gz7-person-n" />
          {/* young tree */}
          <path d="M8 172 v-20" className="gz7-o" />
          <circle cx={8} cy={146} r={8} className="gz7-forest gz7-o gz7-thin" />
        </>
      )}
      {stage === 4 && (
        <>
          <rect x={92} y={100} width={54} height={16} rx={2} className="gz7-sign-lux gz7-o gz7-thin" />
          <text x={119} y={112} textAnchor="middle" className="gz7-sign-t">
            LUXUSNÍ BYTY
          </text>
          <Person x={196} y={GROUND + 18} cls="gz7-person" />
          <rect x={202} y={GROUND + 6} width={9} height={12} rx={1.5} className="gz7-gray-fill gz7-o gz7-thin" />
          <Arrow d="M214 190 H236" tone="red" />
          <Person x={56} y={GROUND} cls="gz7-person gz7-person-n" />
        </>
      )}
    </Frame>
  );
}

export default function Gentrification() {
  return (
    <Figure level={11} label={LABEL} max={860} interactive boost={false}>
      <StripBox label={LABEL}>
        <StepStrip
          min={230}
          phoneColumns={2}
          steps={[
            {
              title: "Úpadek",
              art: <Street stage={1} />,
              caption: "Domy chátrají, byty jsou prázdné a levné. Kdo může, odchází.",
            },
            {
              title: "Umělci a studenti",
              art: <Street stage={2} />,
              caption: "Nízké nájmy lákají ateliéry, galerie a studenty; čtvrť ožívá.",
            },
            {
              title: "Renovace a kavárny",
              art: <Street stage={3} />,
              caption: "Investoři opravují domy, otevírají se kavárny, přicházejí lidé s vyššími příjmy.",
            },
            {
              title: "Vysoké nájmy a vytlačení",
              art: <Street stage={4} />,
              caption: "Nájmy a ceny vyletí, původní obyvatelé si bydlení nemohou dovolit a stěhují se pryč.",
            },
          ]}
        />
      </StripBox>
    </Figure>
  );
}
