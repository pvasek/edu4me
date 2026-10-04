import { useMemo } from "react";
import { DrawArrow, Fade, Figure, Globe, f1, geoPath, globeLand, meridian, ortho, parallel, pat, useClock, useFig, useWorld } from "./kit";

const LABEL =
  "Otáčející se Země osvětlená Sluncem z jedné strany. Osvětlená polokoule má den, odvrácená noc; hranice mezi nimi je rozhraní světla a stínu. Země se otáčí kolem své osy od západu na východ jednou za 24 hodin, a tak místa přecházejí z noci do dne: na rozhraní na straně, kam se Země otáčí ke Slunci, právě vychází Slunce. Česko je zde právě na ranním rozhraní.";

const W = 540;
const H = 470;
const CX = 236;
const CY = 244;
const R = 168;
const DUR = 2.4;

function Plate() {
  const { id, narrow } = useFig();
  const t = useClock(DUR);
  const k = Math.min(1, t / DUR);
  const e = 1 - (1 - k) ** 3;
  // whole degrees, so the land outline is re-projected at most ~40 times per run
  const lon0 = Math.round(55 - 40 * e);
  const P = ortho(CX, CY, R, 20, lon0);
  const world = useWorld();
  const land = useMemo(() => (world ? globeLand(world, ortho(CX, CY, R, 20, lon0), CX, CY, R) : ""), [world, lon0]);
  const cz = P(50, 15);
  const np = P(90, 0);
  const sp = P(-90, 0);
  return (
    <>
      <Globe cx={CX} cy={CY} r={R} shade={false} />
      {land && <path d={land} className="gz1-globeland" />}
      {Array.from({ length: 12 }, (_, i) => -180 + i * 30).map((m) => (
        <path key={m} d={geoPath(meridian(m), P)} className="gz1-grat" />
      ))}
      {[-60, -30, 30, 60].map((p) => (
        <path key={p} d={geoPath(parallel(p), P)} className="gz1-grat" />
      ))}
      <path d={geoPath(parallel(0), P)} className="gz1-equator" style={{ strokeWidth: 1.4 }} />
      {/* night: the half turned away from the Sun (left) */}
      <path d={`M${CX} ${CY - R} A${R} ${R} 0 0 0 ${CX} ${CY + R}Z`} className="gz1-night" />
      <path d={`M${CX} ${CY - R} A${R} ${R} 0 0 0 ${CX} ${CY + R}Z`} fill={pat(id, "sh")} />
      <path d={`M${CX} ${CY - R} V${CY + R}`} className="gz1-terminator" />
      <circle cx={CX} cy={CY} r={R} className="gz1-o" />
      {/* axis */}
      <path d={`M${f1(np.x)} ${f1(np.y)} V${CY - R - 46}`} className="gz1-axis" />
      <path d={`M${f1(sp.x)} ${CY + R} V${CY + R + 26}`} className="gz1-axis" />
      {/* rotation: west → east (to the right on the near side) */}
      <path d={`M${CX + 56} ${CY - R - 24} A56 12 0 0 0 ${CX - 56} ${CY - R - 24}`} className="gz1-arr gz1-arr-lvl gz1-dash" style={{ opacity: 0.6 }} />
      <DrawArrow d={`M${CX - 56} ${CY - R - 24} A56 12 0 0 0 ${CX + 56} ${CY - R - 24}`} tone="lvl" />
      {/* Czechia */}
      {cz.v && (
        <g>
          <circle cx={cz.x} cy={cz.y} r={6} className="gz1-cz" />
          <text x={cz.x + 10} y={cz.y - 8} className="gz1-lbl gz1-b gz1-halo">
            Česko
          </text>
        </g>
      )}
      {/* sunlight from the right */}
      {[-110, -40, 30, 100].map((dy) => (
        <path key={dy} d={`M${W - 8} ${CY + dy} H${CX + R + 22}`} className="gz1-ray" markerEnd={`url(#${id}-ah-acc)`} />
      ))}
      <text x={W - 8} y={CY - 128} textAnchor="end" className="gz1-lbl gz1-b gz1-acc-t">
        Slunce
      </text>
      <Fade delay={0.4}>
        <text x={CX + 70} y={CY + 64} textAnchor="middle" className="gz1-lbl gz1-b gz1-big">
          den
        </text>
        <text x={CX - 80} y={CY + 64} textAnchor="middle" className="gz1-lbl gz1-b gz1-big gz1-light-t">
          noc
        </text>
        <text x={CX + 66} y={CY - R - 34} className="gz1-lbl gz1-b gz1-lvl-t">
          {narrow ? "ze západu na východ" : "otáčení ze západu na východ"}
        </text>
        <text x={CX + 66} y={CY - R - 14} className="gz1-lbl gz1-sm gz1-lvl-t">
          1 otočka za 24 h
        </text>
        <text x={CX} y={H - 8} textAnchor="middle" className="gz1-lbl gz1-sm">
          na rozhraní noci a dne právě vychází Slunce
        </text>
      </Fade>
    </>
  );
}

export default function DayNight() {
  return (
    <Figure level={2} label={LABEL} w={W} h={H} max={600} replay>
      <Plate />
    </Figure>
  );
}
