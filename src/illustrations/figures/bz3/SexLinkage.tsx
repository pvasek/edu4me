import { ChemText, Draw, Figure, Fade, Pop, pat, useFig } from "./kit";
import { SexChromosome } from "./bio";

const LABEL =
  "Dědičnost vázaná na pohlaví na příkladu barvosleposti (daltonismu). Gen pro vnímání barev leží na chromozomu X, malý chromozom Y ho nemá. Alela D je zdravá a dominantní, alela d způsobuje barvoslepost a je recesivní. Matka přenašečka (Xᴰ Xᵈ) je zdravá, protože druhé X nese zdravou alelu; otec je zdravý (Xᴰ Y). Každé jejich dítě má jednu ze čtyř stejně pravděpodobných kombinací: zdravá dcera, dcera přenašečka, zdravý syn a barvoslepý syn. Syn má jen jedno X, a proto se u něj recesivní alela d vždy projeví.";

const W = 420;
const H = 452;

function Person({
  x,
  y,
  male,
  affected = false,
  carrier = false,
}: {
  x: number;
  y: number;
  male: boolean;
  affected?: boolean;
  carrier?: boolean;
}) {
  const { id } = useFig();
  const r = 17;
  const shape = male ? (
    <rect x={x - r} y={y - r} width={r * 2} height={r * 2} />
  ) : (
    <circle cx={x} cy={y} r={r} />
  );
  return (
    <g>
      <g className={affected ? "bz3-ped bz3-ped-on" : "bz3-ped"}>{shape}</g>
      {affected && (
        <g fill={pat(id, "hi")} className="bz3-nohit">
          {male ? (
            <rect x={x - r} y={y - r} width={r * 2} height={r * 2} />
          ) : (
            <circle cx={x} cy={y} r={r} />
          )}
        </g>
      )}
      {carrier && <circle cx={x} cy={y} r={5.5} className="bz3-ped-dot" />}
    </g>
  );
}

const KIDS = [
  { x: 62, male: false, geno: "X^{D}X^{D}", t: "zdravá", carrier: false, aff: false },
  { x: 160, male: false, geno: "X^{D}X^{d}", t: "přenašečka", carrier: true, aff: false },
  { x: 258, male: true, geno: "X^{D}Y", t: "zdravý", carrier: false, aff: false },
  { x: 356, male: true, geno: "X^{d}Y", t: "barvoslepý", carrier: false, aff: true },
];

export default function SexLinkage() {
  return (
    <Figure level={7} label={LABEL} w={W} h={H} max={560} replay>
      {/* chromosomes */}
      <Fade>
        <text x={14} y={22} className="bz3-lbl bz3-b bz3-sm">
          Gen leží jen na chromozomu X
        </text>
      </Fade>
      <Pop delay={0.1}>
        <SexChromosome x={44} y={36} kind="X" h={96} gene="L" />
        <text x={44} y={150} textAnchor="middle" className="bz3-chr-name">
          X
        </text>
      </Pop>
      <Pop delay={0.25}>
        <SexChromosome x={104} y={36} kind="Y" h={96} />
        <text x={104} y={150} textAnchor="middle" className="bz3-chr-name">
          Y
        </text>
      </Pop>
      <Fade delay={0.45}>
        <line x1={58} y1={101} x2={150} y2={101} className="bz3-lead" />
        <text x={154} y={68} className="bz3-lbl bz3-sm">
          X: velký, nese gen pro vnímání barev
        </text>
        <text x={154} y={92} className="bz3-lbl bz3-sm">
          Y: malý, tento gen nemá
        </text>
        <rect x={154} y={108} width={18} height={8} className="bz3-gene-ok" />
        <text x={178} y={117} className="bz3-lbl bz3-sm">
          D zdravá alela (dominantní)
        </text>
        <rect x={154} y={128} width={18} height={8} className="bz3-gene-bad" />
        <text x={178} y={137} className="bz3-lbl bz3-sm">
          d daltonismus (recesivní)
        </text>
      </Fade>
      <Fade delay={0.6}>
        <line x1={12} x2={W - 12} y1={166} y2={166} className="bz3-rule" />
      </Fade>

      {/* pedigree */}
      <Pop delay={0.7}>
        <Person x={150} y={210} male={false} carrier />
        <text x={124} y={204} textAnchor="end" className="bz3-lbl bz3-sm">
          matka přenašečka
        </text>
        <text x={124} y={224} textAnchor="end" className="bz3-eq">
          <ChemText text="X^{D}X^{d}" />
        </text>
      </Pop>
      <Pop delay={0.8}>
        <Person x={270} y={210} male />
        <text x={296} y={204} className="bz3-lbl bz3-sm">
          otec zdravý
        </text>
        <text x={296} y={224} className="bz3-eq">
          <ChemText text="X^{D}Y" />
        </text>
      </Pop>
      <Draw
        d={`M167 210 H253 M210 210 V262 M${KIDS[0].x} 280 V262 H${KIDS[3].x} V280 M${KIDS[1].x} 262 V280 M${KIDS[2].x} 262 V280`}
        className="bz3-o"
        delay={0.9}
      />
      {KIDS.map((k, i) => (
        <Pop key={k.x} delay={1.4 + i * 0.12}>
          {k.aff && (
            <rect x={k.x - 46} y={276} width={92} height={150} rx={6} className="bz3-tag-lvl" />
          )}
          <Person x={k.x} y={300} male={k.male} carrier={k.carrier} affected={k.aff} />
          <text x={k.x} y={344} textAnchor="middle" className="bz3-eq">
            <ChemText text={k.geno} />
          </text>
          <text x={k.x} y={368} textAnchor="middle" className="bz3-lbl bz3-sm bz3-b">
            {k.male ? "syn" : "dcera"}
          </text>
          <text x={k.x} y={388} textAnchor="middle" className={`bz3-lbl bz3-sm ${k.aff ? "bz3-lvl-t bz3-b" : ""}`}>
            {k.t}
          </text>
          <text x={k.x} y={414} textAnchor="middle" className="bz3-num">
            25 %
          </text>
        </Pop>
      ))}
      <Fade delay={2}>
        <text x={W / 2} y={446} textAnchor="middle" className="bz3-lbl bz3-sm bz3-muted-t">
          syn má jen jedno X – recesivní alela d se u něj vždy projeví
        </text>
      </Fade>
    </Figure>
  );
}
