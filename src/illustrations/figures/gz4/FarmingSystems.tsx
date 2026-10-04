import { StepStrip } from "../../sequence/StepFigure";
import { DrawArrow, Figure, Frame, House, Person, Tree, pat, useFig } from "./kit";

const LABEL =
  "Pět způsobů zemědělství. Intenzivní: na malé ploše hodně práce, strojů a hnojiv a vysoké výnosy, například Nizozemsko a Česko. Extenzivní: velké plochy, málo práce a nízký výnos z hektaru, například pastviny ovcí v Austrálii. Plantáž: jedna plodina pro vývoz, například káva, čaj nebo banány. Kočovné pastevectví: pastevci putují se stády za vodou a pastvou, například v Sahelu a Mongolsku. Žďárové zemědělství: les se vypálí, pole se pár let obdělává a pak se lidé přesunou dál, například v Amazonii.";

const W = 220;
const H = 128;
const GROUND = 100;

function Ground({ cls = "gz4-grass" }: { cls?: string }) {
  return (
    <>
      <path d={`M4 ${GROUND} H${W - 4} V${H - 6} H4 Z`} className={cls} />
      <path d={`M4 ${GROUND} H${W - 4}`} className="gz4-o" />
    </>
  );
}

/** A grazing animal (sheep, cattle, goat) as a small engraved silhouette, feet at (x, y). */
function Animal({ x, y, s = 1, kind = "sheep", flip = false }: { x: number; y: number; s?: number; kind?: "sheep" | "cow" | "camel"; flip?: boolean }) {
  const body =
    kind === "camel"
      ? "M-12 -12 Q-10 -22 -4 -16 Q0 -24 6 -16 Q10 -14 12 -18 L16 -26 L20 -24 L16 -16 Q14 -10 10 -10 H-10 Q-13 -10 -12 -12 Z"
      : "M-10 -6 Q-12 -15 -2 -15 Q8 -16 10 -10 L14 -13 L16 -9 L12 -7 Q10 -5 6 -5 H-8 Z";
  const legs =
    kind === "camel"
      ? "M-8 -10 V0 M-4 -10 V0 M6 -10 V0 M9 -10 V0"
      : "M-7 -6 V0 M-3 -6 V0 M4 -6 V0 M7 -6 V0";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={legs} className="gz4-o gz4-thin" />
      <path d={body} className={`${kind === "sheep" ? "gz4-fs-sheep" : kind === "cow" ? "gz4-fs-cow" : "gz4-sand"} gz4-o gz4-thin`} />
    </g>
  );
}

function Intensive() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H - 36}>
      <g transform="translate(0 -36)">
      <Ground cls="gz4-field" />
      {/* furrows */}
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M${10 + i * 21} ${GROUND + 2} L${4 + i * 23} ${H - 8}`} className="gz4-o gz4-thin" style={{ opacity: 0.5 }} />
      ))}
      {/* greenhouse */}
      <path d="M126 100 V70 L146 56 L166 70 L186 56 L206 70 V100 Z" className="gz4-glass" />
      <path d="M126 100 V70 L146 56 L166 70 L186 56 L206 70 V100 Z" fill={pat(id, "v")} opacity={0.5} />
      <path d="M126 100 V70 L146 56 L166 70 L186 56 L206 70 V100 Z M166 70 V100" className="gz4-o gz4-thin" />
      {/* tractor */}
      <g transform="translate(40 100)">
        <path d="M-2 -10 H26 V-22 H38 V-10 H44 V-4 H-2 Z" className="gz4-fs-tractor gz4-o gz4-thin" />
        <path d="M28 -22 V-30 H38 V-22" className="gz4-glass gz4-o gz4-thin" />
        <circle cx={34} cy={-6} r={8} className="gz4-coal gz4-o gz4-thin" />
        <circle cx={6} cy={-3} r={5} className="gz4-coal gz4-o gz4-thin" />
        <path d="M-2 -8 H-14 M-14 -12 V0 M-10 -12 V0 M-6 -12 V0" className="gz4-o gz4-thin" />
      </g>
      </g>
    </Frame>
  );
}

function Extensive() {
  return (
    <Frame w={W} h={H - 36}>
      <g transform="translate(0 -36)">
      <path d={`M4 70 Q60 64 110 70 T${W - 4} 68 V${GROUND} H4 Z`} className="gz4-grass" />
      <Ground cls="gz4-grass-d" />
      <House x={16} y={GROUND} w={18} h={12} />
      <Tree x={44} y={GROUND} s={0.8} kind="round" />
      {/* long fence to the horizon */}
      <path d={`M60 ${GROUND + 14} L${W - 6} ${GROUND - 6}`} className="gz4-o gz4-thin" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 64 + i * 18;
        const y = GROUND + 14 - (i * 18 * 20) / 154;
        return <path key={i} d={`M${x} ${y + 4} V${y - 6}`} className="gz4-o gz4-thin" />;
      })}
      <Animal x={96} y={GROUND - 6} s={0.8} />
      <Animal x={150} y={GROUND - 14} s={0.6} flip />
      <Animal x={196} y={GROUND - 20} s={0.5} />
      <text x={W - 8} y={58} textAnchor="end" className="gz4-lbl gz4-sm gz4-muted-t">
        tisíce hektarů
      </text>
      </g>
    </Frame>
  );
}

function Plantation() {
  return (
    <Frame w={W} h={H - 36}>
      <g transform="translate(0 -36)">
      <Ground cls="gz4-soil" />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 6 }, (_, i) => (
          <g key={`${r}-${i}`}>
            <path d={`M${18 + i * 22 + r * 6} ${GROUND - 2 + r * 10} v-6`} className="gz4-o gz4-thin" />
            <circle cx={18 + i * 22 + r * 6} cy={GROUND - 12 + r * 10} r={7 - r} className="gz4-forest-d gz4-o gz4-thin" />
          </g>
        )),
      )}
      <Tree x={194} y={GROUND} s={1.4} kind="palm" />
      <Person x={174} y={GROUND} s={1.1} />
      {/* sacks for export */}
      <path d="M186 98 q-4 -12 4 -14 h8 q8 2 4 14 Z" className="gz4-sand gz4-o gz4-thin" />
      <text x={W - 8} y={H - 10} textAnchor="end" className="gz4-lbl gz4-sm gz4-b gz4-lvl-t">
        na vývoz
      </text>
      </g>
    </Frame>
  );
}

function Nomadic() {
  return (
    <Frame w={W} h={H - 36}>
      <g transform="translate(0 -36)">
      <Ground cls="gz4-sand" />
      {/* tent (yurt) */}
      <path d="M20 100 V84 Q38 68 56 84 V100 Z" className="gz4-fill gz4-o gz4-thin" />
      <path d="M33 100 V88 H43 V100" className="gz4-o gz4-thin" />
      <Person x={70} y={GROUND} s={1.1} />
      <Animal x={98} y={GROUND} s={1} kind="camel" />
      <Animal x={132} y={GROUND} s={0.8} kind="cow" />
      <Animal x={154} y={GROUND} s={0.7} />
      <Animal x={172} y={GROUND} s={0.7} />
      <DrawArrow d="M120 72 Q160 54 200 72" tone="lvl" delay={0.3} />
      <text x={160} y={52} textAnchor="middle" className="gz4-lbl gz4-sm gz4-lvl-t gz4-b">
        za pastvou a vodou
      </text>
      <Tree x={206} y={GROUND} s={0.8} kind="acacia" />
      </g>
    </Frame>
  );
}

function SlashBurn() {
  const { id } = useFig();
  return (
    <Frame w={W} h={H - 36}>
      <g transform="translate(0 -36)">
      <Ground cls="gz4-soil" />
      {[8, 22, 36, 186, 200, 214].map((x, i) => (
        <Tree key={x} x={x} y={GROUND} s={1.2 + (i % 2) * 0.2} />
      ))}
      {/* burnt clearing with a small field */}
      <path d="M52 100 L60 92 H112 L120 100 Z" className="gz4-coal" opacity={0.5} />
      <path d="M52 100 L60 92 H112 L120 100 Z" fill={pat(id, "dd")} />
      {[64, 70, 76, 86, 92, 98, 106].map((x) => (
        <path key={x} d={`M${x} 92 v-7 M${x} 88 l-2 -3 M${x} 89 l2 -3`} className="gz4-leafline" style={{ strokeWidth: 1 }} />
      ))}
      <path d="M128 100 q2 -12 6 -18 q2 8 4 4 q2 -8 6 -12 q2 12 4 26" className="gz4-fs-fire gz4-o gz4-thin" />
      <DrawArrow d="M90 66 Q120 44 156 64" tone="lvl" delay={0.3} />
      <text x={86} y={54} textAnchor="end" className="gz4-lbl gz4-sm gz4-b gz4-lvl-t">
        za pár let dál
      </text>
      </g>
    </Frame>
  );
}

export default function FarmingSystems() {
  return (
    <Figure level={6} label={LABEL} max={980} interactive boost={false}>
      <div className="gz4-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            { title: "Intenzivní zemědělství", art: <Intensive />, caption: "Na malé ploše hodně práce, strojů a hnojiv, vysoké výnosy. Nizozemsko, Česko." },
            { title: "Extenzivní zemědělství", art: <Extensive />, caption: "Obrovské plochy, málo práce, nízký výnos z hektaru. Pastviny ovcí v Austrálii." },
            { title: "Plantáž", art: <Plantation />, caption: "Jedna plodina pro vývoz: káva, čaj, banány, palma olejná. Brazílie, Keňa, Indonésie." },
            { title: "Kočovné pastevectví", art: <Nomadic />, caption: "Pastevci se stády putují za vodou a pastvou. Sahel, Mongolsko." },
            { title: "Žďárové zemědělství", art: <SlashBurn />, caption: "Les se vypálí, pole se pár let obdělává a pak se lidé přesunou dál. Amazonie, Kongo." },
          ]}
        />
      </div>
    </Figure>
  );
}
