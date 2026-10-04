import { Draw, DrawArrow, Fade, Figure, f1, pat, useFig } from "./kit";

const LABEL =
  "Země při pohledu shora nad severním pólem, rozdělená poledníky na 24 dílů po 15°. Poledník obrácený ke Slunci má právě poledne (12 h), protilehlý půlnoc. Země se otočí o 360° za 24 hodin, tedy o 15° za 1 hodinu a o 1° za 4 minuty. Místa východněji mají místní čas pozdější: na 105° v. d. je 18 h, když je na 15° v. d. poledne. Praha (14° 25′ v. d.) má místní poledne asi o 58 minut dříve než Greenwich.";

const W = 520;
const H = 530;
const C = 250;
const CY = 246;
const R = 168;
const RAD = Math.PI / 180;
/** screen angle (deg, clockwise from +x) of local hour h; noon faces the Sun (right), hours grow anticlockwise */
const angOf = (h: number) => -(h - 12) * 15;
const at = (h: number, r: number): [number, number] => [C + r * Math.cos(angOf(h) * RAD), CY + r * Math.sin(angOf(h) * RAD)];

function Plate() {
  const { id, narrow } = useFig();
  return (
    <>
      <circle cx={C} cy={CY} r={R} className="gz1-sea" />
      <path d={`M${C} ${CY - R} A${R} ${R} 0 0 0 ${C} ${CY + R}Z`} className="gz1-night" />
      <path d={`M${C} ${CY - R} A${R} ${R} 0 0 0 ${C} ${CY + R}Z`} fill={pat(id, "sh")} />
      {Array.from({ length: 24 }, (_, h) => {
        const [x, y] = at(h, R);
        return <Draw key={h} d={`M${C} ${CY} L${f1(x)} ${f1(y)}`} className={h === 12 ? "gz1-pm" : "gz1-grat"} delay={0.02 * h} />;
      })}
      <circle cx={C} cy={CY} r={R} className="gz1-o" />
      <circle cx={C} cy={CY} r={4} className="gz1-lvl-f gz1-o gz1-thin" />
      {/* a 15° sector highlighted */}
      <path
        d={`M${C} ${CY} L${f1(at(13, R)[0])} ${f1(at(13, R)[1])} A${R} ${R} 0 0 0 ${f1(at(14, R)[0])} ${f1(at(14, R)[1])}Z`}
        className="gz1-sector"
      />
      {/* hours round the rim */}
      {Array.from({ length: 24 }, (_, h) => {
        const [x, y] = at(h, R + 18);
        return (
          <text key={h} x={f1(x)} y={f1(y + 5)} textAnchor="middle" className={`gz1-hour ${h === 12 ? "gz1-lvl-t" : ""}`}>
            {h}
          </text>
        );
      })}
      {/* sunlight */}
      {[-90, -30, 30, 90].map((dy) => (
        <path key={dy} d={`M${W - 6} ${CY + dy} H${C + R + 40}`} className="gz1-ray" markerEnd={`url(#${id}-ah-acc)`} />
      ))}
      <text x={W - 6} y={CY - 104} textAnchor="end" className="gz1-lbl gz1-b gz1-acc-t">
        Slunce
      </text>
      {/* rotation: anticlockwise seen from above the North Pole */}
      <DrawArrow d={`M${f1(at(20, R + 44)[0])} ${f1(at(20, R + 44)[1])} A${R + 44} ${R + 44} 0 0 0 ${f1(at(22.5, R + 44)[0])} ${f1(at(22.5, R + 44)[1])}`} tone="lvl" delay={0.6} />
      <Fade delay={0.8}>
        <text x={C} y={CY + 28} textAnchor="middle" className="gz1-lbl gz1-sm gz1-halo-soft">
          severní pól
        </text>
        <text x={f1(at(12, 120)[0])} y={f1(at(12, 120)[1] - 8)} textAnchor="middle" className="gz1-lbl gz1-b gz1-lvl-t gz1-halo-soft">
          poledne
        </text>
        <text x={f1(at(0, 112)[0])} y={f1(at(0, 112)[1] - 8)} textAnchor="middle" className="gz1-lbl gz1-b gz1-light-t">
          půlnoc
        </text>
        <text x={f1(at(13.5, 128)[0])} y={f1(at(13.5, 128)[1] + 5)} textAnchor="middle" className="gz1-lbl gz1-b gz1-sm gz1-halo-soft">
          15°
        </text>
        <text x={f1(at(12, 120)[0])} y={f1(at(12, 120)[1] + 14)} textAnchor="middle" className="gz1-lbl gz1-sm gz1-halo-soft">
          15° v. d.
        </text>
        <text x={C + 8} y={f1(at(18, 112)[1] + 4)} className="gz1-lbl gz1-sm gz1-halo-soft">
          105° v. d.
        </text>
        <text x={C + 8} y={f1(at(6, 112)[1] + 4)} className="gz1-lbl gz1-sm gz1-halo-soft">
          75° z. d.
        </text>
        <text x={f1(at(0, 112)[0])} y={f1(at(0, 112)[1] + 14)} textAnchor="middle" className="gz1-lbl gz1-sm gz1-light-t">
          165° z. d.
        </text>
        <text x={18} y={36} className="gz1-lbl gz1-sm gz1-lvl-t">
          {narrow ? "otáčení" : "směr otáčení"}
        </text>
      </Fade>
      <Fade delay={1.1}>
        <text x={W / 2} y={H - 34} textAnchor="middle" className="gz1-lbl gz1-b">
          360° za 24 h → 15° = 1 h, 1° = 4 min
        </text>
        <text x={W / 2} y={H - 10} textAnchor="middle" className="gz1-lbl gz1-sm">
          Praha (14° 25′ v. d.): poledne asi o 58 min dřív než v Greenwichi
        </text>
      </Fade>
    </>
  );
}

export default function LocalTime() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
