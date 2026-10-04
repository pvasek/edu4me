import { useMemo } from "react";
import { Draw, Fade, Figure, Globe, Lbl, f1, geoPath, globeLand, meridian, ortho, parallel, useFig, useWorld } from "./kit";

const LABEL =
  "Glóbus se zeměpisnou sítí. Osa prochází severním a jižním pólem. Poledníky jsou půlkružnice spojující oba póly, rovnoběžky jsou kružnice rovnoběžné s rovníkem. Rovník dělí Zemi na severní a jižní polokouli, nultý poledník procházející Greenwichem v Londýně ji spolu s poledníkem 180° dělí na západní a východní polokouli.";

const W = 560;
const H = 482;
const CX = 280;
const CY = 226;
const R = 160;
const P = ortho(CX, CY, R, 18, 0);

const MER = [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150, 180];
const PAR = [-60, -30, 30, 60];

function Grid() {
  const { narrow } = useFig();
  const world = useWorld();
  const land = useMemo(() => (world ? globeLand(world, P, CX, CY, R) : ""), [world]);
  const np = P(90, 0);
  const sp = P(-90, 0);
  const gw = P(51.5, 0);
  const eqR = P(0, 90);
  const merL = P(-22, 60);
  const parL = P(30, -62);
  return (
    <>
      <Globe cx={CX} cy={CY} r={R} />
      {land && <path d={land} className="gz1-globeland" />}
      {/* far side, faint */}
      {MER.map((m) => (
        <path key={`b${m}`} d={geoPath(meridian(m), P, true)} className="gz1-grat-back" />
      ))}
      {PAR.map((p) => (
        <path key={`bp${p}`} d={geoPath(parallel(p), P, true)} className="gz1-grat-back" />
      ))}
      {/* near side */}
      {MER.map((m, i) => (
        <Draw key={m} d={geoPath(meridian(m), P)} className="gz1-grat" delay={0.05 * i} />
      ))}
      {PAR.map((p, i) => (
        <Draw key={`p${p}`} d={geoPath(parallel(p), P)} className="gz1-grat" delay={0.3 + 0.05 * i} />
      ))}
      <Draw d={geoPath(parallel(0), P)} className="gz1-equator" delay={0.6} />
      <Draw d={geoPath(meridian(0), P)} className="gz1-pm" delay={0.8} />
      {/* axis through the poles */}
      <path d={`M${f1(np.x)} ${f1(np.y)} V${f1(np.y - 34)}`} className="gz1-axis" />
      <path d={`M${f1(sp.x)} ${f1(sp.y)} V${f1(CY + R + 26)}`} className="gz1-axis" style={{ opacity: 0.6 }} />
      <circle cx={np.x} cy={np.y} r={4} className="gz1-lvl-f gz1-o gz1-thin" />
      <circle cx={sp.x} cy={sp.y} r={3.2} className="gz1-fill gz1-o gz1-thin" style={{ opacity: 0.7 }} />
      <circle cx={gw.x} cy={gw.y} r={3.4} className="gz1-dot" />

      <Fade delay={1.1}>
        <Lbl x={CX - 22} y={np.y - 20} tx={np.x - 3} ty={np.y - 3} anchor="end" className="gz1-b">
          severní pól
        </Lbl>
        <Lbl x={CX - 16} y={CY + R + 26} tx={sp.x - 3} ty={sp.y + 3} anchor="end" className="gz1-b">
          jižní pól
        </Lbl>
        <Lbl x={CX + 18} y={np.y - 36} tx={gw.x + 2} ty={gw.y - 2} className="gz1-b gz1-lvl-t">
          {narrow ? "nultý poledník" : "nultý poledník (Greenwich)"}
        </Lbl>
        <Lbl x={W - 12} y={CY + 30} tx={eqR.x - 4} ty={eqR.y} anchor="end" className="gz1-b gz1-red-t">
          rovník 0°
        </Lbl>
        <Lbl x={W - 12} y={CY + 118} tx={merL.x + 2} ty={merL.y} anchor="end" className="gz1-b">
          poledník
        </Lbl>
        <Lbl x={12} y={CY - 112} tx={parL.x} ty={parL.y} className="gz1-b">
          rovnoběžka
        </Lbl>
        <text x={12} y={CY - 18} className="gz1-lbl gz1-sm gz1-sec">
          severní
        </text>
        <text x={12} y={CY - 2} className="gz1-lbl gz1-sm gz1-sec">
          polokoule
        </text>
        <text x={12} y={CY + 30} className="gz1-lbl gz1-sm gz1-sec">
          jižní
        </text>
        <text x={12} y={CY + 46} className="gz1-lbl gz1-sm gz1-sec">
          polokoule
        </text>
      </Fade>
      <Fade delay={1.4}>
        <text x={CX - 12} y={H - 42} textAnchor="end" className="gz1-lbl gz1-b gz1-lvl-t">
          západní polokoule
        </text>
        <text x={CX + 12} y={H - 42} className="gz1-lbl gz1-b gz1-lvl-t">
          východní polokoule
        </text>
        <path d={`M${CX} ${H - 56} V${H - 14}`} className="gz1-pm" />
        <text x={CX - 12} y={H - 14} textAnchor="end" className="gz1-lbl gz1-sm">
          ← z. d.
        </text>
        <text x={CX + 12} y={H - 14} className="gz1-lbl gz1-sm">
          v. d. →
        </text>
      </Fade>
    </>
  );
}

export default function GlobeGrid() {
  return (
    <Figure level={1} label={LABEL} w={W} h={H} max={600} replay>
      <Grid />
    </Figure>
  );
}
