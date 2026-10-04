import { GeoMap } from "../../../geo/GeoMap";
import { FIGURE_FRAMES } from "../../../geo";
import type { P2 } from "./kit";
import { Key, MapFig, MapText, head, llPath, type LL } from "./mapkit";

const LABEL =
  "Mapa severního Atlantiku: teplý Golfský proud teče od Floridy podél Severní Ameriky na severovýchod a jako Severoatlantský proud pokračuje přes oceán až k pobřeží Norska. Studený Labradorský proud teče od severu podél Labradoru k jihu. Západní větry vanou nad teplým oceánem a nesou mírný vzduch nad Evropu. Proto má norský Bergen (60° 23′ s. š.) průměrnou lednovou teplotu asi +3 °C, kdežto Nain na pobřeží Labradoru, ležící dokonce jižněji (56° 33′ s. š.), asi −17 °C.";

const WARM: LL[] = [
  [-80.2, 30.6], [-77.5, 33.6], [-74, 36.6], [-69, 39.3], [-61, 41], [-52, 42.4],
  [-43, 45.3], [-33, 49.6], [-23, 53.8], [-13, 57.8], [-4, 61.4], [5, 64.6], [13, 68.4],
];
const COLD: LL[] = [[-62.5, 66.5], [-60, 62], [-57, 57.5], [-54, 53], [-51.5, 49], [-50.5, 45.2]];
const WINDS: LL[][] = [
  [[-37, 43.5], [-27, 46.4], [-18, 48.6]],
];
const BERGEN: LL = [5.32, 60.39];
const NAIN: LL = [-61.69, 56.54];

export default function GulfStream() {
  return (
    <MapFig
      level={8}
      legend={
        <>
          <Key art={<><path d="M2 7 H25" className="gz5-cur gz5-cur-warm" /><path d="M24 2.5 L33 7 L24 11.5 Z" className="gz5-cur-head gz5-cur-warm" /></>}>
            teplý proud
          </Key>
          <Key art={<><path d="M2 7 H25" className="gz5-cur gz5-cur-cold" /><path d="M24 2.5 L33 7 L24 11.5 Z" className="gz5-cur-head gz5-cur-cold" /></>}>
            studený proud
          </Key>
          <Key art={<><path d="M2 7 H25" className="gz5-wind" /><path d="M24 2.5 L33 7 L24 11.5 Z" className="gz5-wind-head" /></>}>
            západní větry
          </Key>
        </>
      }
      note="Průměrná lednová teplota, normál 1991–2020 (Met Norway, Environment Canada), zaokrouhleno."
    >
      <GeoMap view={FIGURE_FRAMES["north-atlantic"]} label={LABEL} legend={false}>
        {({ project, u }) => {
          const P = (ll: LL) => project(ll[0], ll[1]) as P2;
          const warm = WARM.map(P);
          const cold = COLD.map(P);
          const par: LL[] = [];
          for (let lon = -66; lon <= 3; lon += 1.5) par.push([lon, 60]);
          const [bx, by] = P(BERGEN);
          const [tx, ty] = P([-54, 55.4]);
          const [nx, ny] = P(NAIN);
          const [px, py] = P([-29, 60]);
          const [gx, gy] = P([-60, 35.4]);
          const [sx, sy] = P([-21, 51.2]);
          const [lx, ly] = P([-57, 64.2]);
          return (
            <g>
              {/* the 60th parallel: Bergen and the north of Labrador */}
              <path d={llPath(project, par)} className="gz5-par" />
              <MapText x={px} y={py - 6 * u} u={u} text="60° s. š." size={12} className="gz5-mt-muted" />
              {/* westerlies */}
              {WINDS.map((w, i) => {
                const pts = w.map(P);
                return (
                  <g key={i}>
                    <path d={llPath(project, w)} className="gz5-wind" />
                    <path d={head(pts[pts.length - 2], pts[pts.length - 1], u, 11)} className="gz5-wind-head" />
                  </g>
                );
              })}
              {/* currents */}
              <path d={llPath(project, WARM)} className="gz5-cur gz5-cur-warm" />
              <path d={head(warm[4], warm[5], u)} className="gz5-cur-head gz5-cur-warm" />
              <path d={head(warm[warm.length - 2], warm[warm.length - 1], u)} className="gz5-cur-head gz5-cur-warm" />
              <path d={llPath(project, COLD)} className="gz5-cur gz5-cur-cold" />
              <path d={head(cold[cold.length - 2], cold[cold.length - 1], u)} className="gz5-cur-head gz5-cur-cold" />
              <MapText x={gx} y={gy} u={u} text="Golfský proud" size={13} anchor="start" className="gz5-mt-warm" />
              <MapText x={sx} y={sy} u={u} text={"Severoatlantský\nproud"} size={13} anchor="start" className="gz5-mt-warm" />
              <MapText x={lx} y={ly} u={u} text={"Labradorský\nproud"} size={13} anchor="start" className="gz5-mt-cold" />
              {/* January temperatures */}
              <circle cx={bx} cy={by} r={3.6 * u} className="gz5-town" />
              <circle cx={nx} cy={ny} r={3.6 * u} className="gz5-town" />
              <MapText x={bx + 7 * u} y={by + 4 * u} u={u} text="Bergen" size={14} anchor="start" />
              <MapText x={bx + 7 * u} y={by + 20 * u} u={u} text="leden ≈ +3 °C" size={13.5} anchor="start" className="gz5-mt-warm gz5-mt-b" />
              <MapText x={nx - 7 * u} y={ny + 4 * u} u={u} text="Nain" size={14} anchor="end" />
              <MapText x={tx} y={ty} u={u} text={"leden\n≈ −17 °C"} size={13.5} anchor="start" className="gz5-mt-cold gz5-mt-b" />
              <path d={`M${(tx - 4 * u).toFixed(1)} ${(ty - 4 * u).toFixed(1)} L${(nx + 5 * u).toFixed(1)} ${(ny + 2 * u).toFixed(1)}`} className="gz5-leader" />
            </g>
          );
        }}
      </GeoMap>
    </MapFig>
  );
}
