import { Body, Fade, Figure, Pop, pat, useFig } from "./kit";

const LABEL =
  "Taxonomické kategorie do sebe zapadají jako krabice v krabici, na příkladu vlka obecného. Doména eukaryota, říše živočichové, kmen strunatci, třída savci, řád šelmy, čeleď psovití, rod pes (Canis) a nakonec druh vlk obecný (Canis lupus). Čím menší krabice, tím méně druhů obsahuje a tím jsou si příbuznější. Vědecké jméno druhu má dvě slova: jméno rodu a druhový přívlastek.";

const RANKS = [
  ["doména", "eukaryota", "Eukaryota"],
  ["říše", "živočichové", "Animalia"],
  ["kmen", "strunatci", "Chordata"],
  ["třída", "savci", "Mammalia"],
  ["řád", "šelmy", "Carnivora"],
  ["čeleď", "psovití", "Canidae"],
  ["rod", "pes", "Canis"],
  ["druh", "vlk obecný", "Canis lupus"],
] as const;

const W = 420;
const H = 452;
const DX = 12;
const DY = 30;

/** A grey wolf in profile, facing right, about 160 × 94. */
const WOLF =
  "M6 84 C-3 66 4 44 22 36 C32 31 42 30 52 30 C72 28 92 28 106 25 C113 23 117 17 120 10 L124 1 L128 10 L133 3 L135 13 C141 15 147 19 151 23 L159 27 L157 32 C151 34 145 35 139 36 C134 41 130 46 126 51 C123 57 121 61 120 65 L121 90 Q121 94 116 94 L113 94 L112 68 L108 68 L107 90 Q107 94 102 94 L99 94 L99 66 C90 65 72 65 58 63 L54 76 L58 89 Q59 94 54 94 L50 94 L45 78 L42 66 L37 78 L41 89 Q42 94 37 94 L33 94 L28 77 C26 68 24 62 22 58 C20 68 16 78 6 84 Z";

function Wolf({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const { id } = useFig();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Body d={WOLF} fill="bz1-animal" />
      <path d={WOLF} fill={pat(id, "b")} opacity={0.7} />
      {/* fur shading on the back, belly line, legs behind */}
      <path d="M30 40 C60 34 90 34 108 30 M60 58 C80 60 92 60 99 60 M126 30 C130 32 134 33 138 33" className="bz1-o bz1-thin" style={{ opacity: 0.6 }} />
      <circle cx={142} cy={21} r={1.6} className="bz1-spot" />
      <path d="M156 27 L159 28" className="bz1-o" />
    </g>
  );
}

export default function ClassificationHierarchy() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={560} replay>
      {RANKS.map(([rank, cz, lat], k) => {
        const x = 6 + k * DX;
        const y = 6 + k * DY;
        const w = W - 12 - 2 * k * DX;
        const h = H - 12 - k * DY - k * 4;
        return (
          <Pop key={rank} delay={k * 0.14}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={10}
              className="bz1-lvl-f"
              style={{ fillOpacity: 0.055 }}
            />
            <rect x={x} y={y} width={w} height={h} rx={10} className="bz1-o bz1-lvl-s" style={{ strokeWidth: 1.2 }} />
            <text x={x + 10} y={y + 21} className="bz1-lbl bz1-sm">
              <tspan className="bz1-muted-t">{rank}</tspan>
              <tspan dx={6} className="bz1-b" style={{ fontSize: 17.5 }}>
                {cz}
              </tspan>
            </text>
            {k < 7 && (
              <text x={x + w - 10} y={y + 21} textAnchor="end" className="bz1-lbl bz1-sm bz1-sec bz1-lvl-t" style={{ fontWeight: 600 }}>
                {lat}
              </text>
            )}
          </Pop>
        );
      })}
      <Fade delay={1.2}>
        <Wolf x={130} y={262} s={1} />
        <text x={W / 2} y={392} textAnchor="middle" className="bz1-eq bz1-it bz1-eq-lg" style={{ fontWeight: 700 }}>
          Canis lupus
        </text>
        <text x={W / 2} y={408} textAnchor="middle" className="bz1-lbl bz1-sm">
          rod + druhový přívlastek
        </text>
      </Fade>
    </Figure>
  );
}
