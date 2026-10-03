import { Chloro, DrawArrow, Fade, Figure, Lbl, Pop, ChemText, f1, pat, rng, useFig } from "./kit";

const LABEL =
  "Příčný řez listem. Nahoře vosková kutikula a horní pokožka z průhledných buněk. Pod ní palisádový parenchym z vysokých buněk plných chloroplastů, kde probíhá nejvíc fotosyntézy, pak houbovitý parenchym z volně uložených buněk se vzduchovými mezerami. Uprostřed cévní svazek (žilka) s dřevní částí, která přivádí vodu, a lýkovou částí, která odvádí cukry. Ve spodní pokožce je průduch ze dvou svěracích buněk: dovnitř jím vstupuje oxid uhličitý CO₂, ven odchází kyslík O₂ a vodní pára H₂O.";

const W = 440;
const H = 400;
const L = 14;
const R = 290;
const CUT = 40; // top of cuticle
const EP1 = 46;
const PAL = 68;
const SPO = 140;
const EP2 = 222;
const BOT = 242;
const BX = 140; // vascular bundle
const BY = 178;
const ST = 222; // stoma x

function Section() {
  const { id } = useFig();
  const R2 = rng(21);
  const epi = (y0: number, y1: number, skip?: [number, number]) => {
    const cells = [];
    for (let x = L; x < R; x += 24) {
      if (skip && x + 24 > skip[0] && x < skip[1]) continue;
      cells.push(<rect key={x} x={x + 1} y={y0 + 1} width={22} height={y1 - y0 - 2} rx={4} className="bz1-o bz1-thin bz1-fill" />);
    }
    return cells;
  };
  const pal = [];
  for (let x = L + 2; x < R - 10; x += 19) {
    pal.push(
      <g key={x}>
        <rect x={x} y={PAL + 2} width={17} height={SPO - PAL - 6} rx={7} className="bz1-o bz1-thin bz1-leaf2" />
        {[0, 1, 2, 3, 4].map((k) => (
          <Chloro key={k} x={x + (k % 2 ? 11 : 6)} y={PAL + 12 + k * 12} rx={4.2} ry={2.8} rot={k % 2 ? 70 : 110} />
        ))}
      </g>,
    );
  }
  const spo = [];
  for (let row = 0; row < 4; row++) {
    for (let x = L + 12 + (row % 2) * 14; x < R - 8; x += 28) {
      const y = SPO + 12 + row * 20 + (R2() - 0.5) * 6;
      const cx = x + (R2() - 0.5) * 6;
      if (Math.hypot(cx - BX, y - BY) < 40) continue;
      if (Math.abs(cx - ST) < 20 && y > EP2 - 26) continue;
      spo.push(
        <g key={`${row}-${x}`}>
          <ellipse cx={f1(cx)} cy={f1(y)} rx={11 + R2() * 2} ry={8 + R2() * 2} className="bz1-o bz1-thin bz1-leaf2" />
          <Chloro x={cx - 3} y={y - 1} rx={3.6} ry={2.4} rot={30} />
          <Chloro x={cx + 4} y={y + 3} rx={3.6} ry={2.4} rot={-20} />
        </g>,
      );
    }
  }
  return (
    <g>
      <rect x={L} y={CUT} width={R - L} height={BOT - CUT + 6} className="bz1-fill" />
      {/* cuticle */}
      <rect x={L} y={CUT} width={R - L} height={EP1 - CUT} className="bz1-pollen" style={{ opacity: 0.8 }} />
      <rect x={L} y={BOT} width={R - L} height={5} className="bz1-pollen" style={{ opacity: 0.8 }} />
      {epi(EP1, PAL)}
      {pal}
      {spo}
      {/* vascular bundle: xylem above, phloem below */}
      <circle cx={BX} cy={BY} r={32} className="bz1-o bz1-fill2" />
      <circle cx={BX} cy={BY} r={32} fill={pat(id, "dots")} />
      {(
        [
          [-14, -14, 7],
          [0, -18, 8],
          [14, -14, 7],
          [-7, -3, 6],
          [7, -3, 6],
        ] as const
      ).map(([dx, dy, r]) => (
        <circle key={`${dx}${dy}`} cx={BX + dx} cy={BY + dy} r={r} className="bz1-o bz1-vac" style={{ strokeWidth: 2 }} />
      ))}
      {(
        [
          [-12, 12],
          [-3, 16],
          [6, 14],
          [14, 9],
          [2, 7],
          [-8, 21],
          [10, 22],
        ] as const
      ).map(([dx, dy]) => (
        <circle key={`p${dx}${dy}`} cx={BX + dx} cy={BY + dy} r={3.6} className="bz1-o bz1-thin bz1-cap" />
      ))}
      {/* lower epidermis with a stoma */}
      {epi(EP2, BOT, [ST - 14, ST + 14])}
      <rect x={ST + 17} y={EP2 + 1} width={14} height={BOT - EP2 - 2} rx={4} className="bz1-o bz1-thin bz1-fill" />
      <path d={`M${ST - 16} ${EP2 - 14} C${ST - 10} ${EP2 - 22} ${ST + 10} ${EP2 - 22} ${ST + 16} ${EP2 - 14}`} className="bz1-o bz1-thin bz1-dash" />
      <path d={`M${ST - 2} ${EP2} C${ST - 16} ${EP2 - 2} ${ST - 16} ${BOT + 2} ${ST - 2} ${BOT} C${ST - 6} ${BOT - 6} ${ST - 6} ${EP2 + 6} ${ST - 2} ${EP2} Z`} className="bz1-o bz1-leaf" />
      <path d={`M${ST + 2} ${EP2} C${ST + 16} ${EP2 - 2} ${ST + 16} ${BOT + 2} ${ST + 2} ${BOT} C${ST + 6} ${BOT - 6} ${ST + 6} ${EP2 + 6} ${ST + 2} ${EP2} Z`} className="bz1-o bz1-leaf" />
      <path d={`M${L} ${CUT} H${R} V${BOT + 5} H${L} Z`} className="bz1-o" style={{ strokeWidth: 1.8 }} />
    </g>
  );
}

export default function LeafCrossSection() {
  return (
    <Figure level={3} label={LABEL} w={W} h={H} max={600} replay>
      <Fade>
        <Section />
      </Fade>
      <Fade delay={0.5}>
        <Lbl x={302} y={30} tx={R - 6} ty={CUT + 3}>
          kutikula
        </Lbl>
        <Lbl x={302} y={58} tx={R - 8} ty={(EP1 + PAL) / 2}>
          pokožka
        </Lbl>
        <Lbl x={302} y={96} tx={R - 12} ty={100} className="bz1-b">
          {"palisádový\nparenchym"}
        </Lbl>
        <Lbl x={302} y={152} tx={R - 18} ty={160} className="bz1-b">
          {"houbovitý\nparenchym"}
        </Lbl>
        <Lbl x={302} y={204} tx={BX + 30} ty={BY + 8} className="bz1-b bz1-lvl-t">
          {"cévní svazek\n(žilka)"}
        </Lbl>
        <Lbl x={302} y={260} tx={ST + 6} ty={BOT - 4} className="bz1-b">
          průduch
        </Lbl>
        <Lbl x={302} y={280} tx={ST + 14} ty={EP2 + 12} className="bz1-sm" sec>
          svěrací buňky
        </Lbl>
        <Lbl x={20} y={24} tx={60} ty={CUT + 4} className="bz1-sm bz1-muted-t" sec>
          světlo
        </Lbl>
      </Fade>
      <Fade delay={0.8}>
        <text x={BX - 28} y={BY - 34} textAnchor="end" className="bz1-lbl bz1-sm bz1-blue-t bz1-halo bz1-sec">
          dřevní část
        </text>
        <text x={BX - 30} y={BY + 44} textAnchor="end" className="bz1-lbl bz1-sm bz1-acc-t bz1-halo bz1-sec">
          lýková část
        </text>
      </Fade>
      {/* gas exchange at the stoma */}
      <DrawArrow d={`M${ST - 50} 330 Q${ST - 20} 300 ${ST - 3} ${BOT - 8}`} tone="lvl" delay={1} />
      <DrawArrow d={`M${ST + 3} ${BOT + 4} Q${ST + 12} 300 ${ST + 34} 330`} tone="blue" delay={1.3} />
      <DrawArrow d={`M${ST + 6} ${BOT + 4} Q${ST + 50} 280 ${ST + 92} 304`} tone="blue" delay={1.3} />
      <Pop delay={1.5}>
        <text x={ST - 56} y={352} textAnchor="middle" className="bz1-eq bz1-eq-lg bz1-tone-lvl" style={{ fontWeight: 800 }}>
          <ChemText text="CO_{2}" />
        </text>
        <text x={ST - 56} y={372} textAnchor="middle" className="bz1-lbl bz1-sm">
          dovnitř
        </text>
        <text x={ST + 38} y={352} textAnchor="middle" className="bz1-eq bz1-eq-lg bz1-tone-blue" style={{ fontWeight: 800 }}>
          <ChemText text="O_{2}" />
        </text>
        <text x={ST + 108} y={326} textAnchor="middle" className="bz1-eq bz1-tone-blue" style={{ fontWeight: 800 }}>
          <ChemText text="H_{2}O" />
        </text>
        <text x={ST + 108} y={344} textAnchor="middle" className="bz1-lbl bz1-sm">
          pára
        </text>
        <text x={ST + 38} y={372} textAnchor="middle" className="bz1-lbl bz1-sm">
          ven
        </text>
      </Pop>
    </Figure>
  );
}
