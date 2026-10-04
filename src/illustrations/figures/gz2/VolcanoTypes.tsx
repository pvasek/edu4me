import { StepStrip } from "../../sequence/StepFigure";
import { Arrow, Figure, Frame, f1, pat, useFig } from "./kit";
import { T } from "./land";

const LABEL =
  "Tři typy sopek v řezu. Vrstevnatá sopka neboli stratovulkán, například Vesuv (1 281 m n. m.), má strmé svahy ze střídajících se vrstev lávy a sopečného popela; hustá láva ucpává sopouch, a proto bývají erupce výbušné. Štítová sopka, například Mauna Loa na Havaji (4 169 m n. m.), je velmi široká s mírnými svahy, protože řídká čedičová láva teče daleko. Struskový (sypaný) kužel, například Komorní hůrka u Chebu (503 m n. m.), je malý kopec ze strusky a popela z jediné krátké erupce. Pod každou sopkou je magmatický krb, z něhož magma stoupá sopouchem do kráteru.";

const W = 300;
const H = 226;
const GY = 158; // ground level
const CX = 150;

/** the rock below the ground and the magma chamber with its vent */
function Under({ chamber, vent }: { chamber: [number, number, number, number]; vent: string }) {
  const { id } = useFig();
  const [cx, cy, rx, ry] = chamber;
  return (
    <g>
      <rect x={4} y={GY} width={W - 8} height={H - 4 - GY} className="gz2-crust" />
      <rect x={4} y={GY} width={W - 8} height={H - 4 - GY} fill={pat(id, "d")} opacity={0.3} />
      <path d={`M4 ${GY} H${W - 4}`} className="gz2-o" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="gz2-magma gz2-o" />
      <path d={vent} className="gz2-magma gz2-o gz2-thin" />
    </g>
  );
}

/** a cone outline with concave (or straight) flanks */
function cone(half: number, top: number, rim: number, concave: number, dip = 8) {
  const l = CX - half;
  const r = CX + half;
  return `M${f1(l)} ${GY} Q${f1(CX - rim - concave)} ${f1(GY - concave * 0.5)} ${f1(CX - rim)} ${f1(top)} Q${CX} ${f1(top + dip * 2)} ${f1(CX + rim)} ${f1(top)} Q${f1(CX + rim + concave)} ${f1(GY - concave * 0.5)} ${f1(r)} ${GY}Z`;
}

function Strato() {
  return (
    <Frame w={W} h={H}>
      <StratoArt />
    </Frame>
  );
}

function StratoArt() {
  const { id } = useFig();
  const layers = [0, 1, 2, 3, 4, 5];
  return (
    <>
      {/* ash cloud */}
      <g className="gz2-ash gz2-o gz2-thin">
        {[
          [150, 30, 13],
          [136, 22, 11],
          [164, 20, 12],
          [150, 10, 11],
          [176, 32, 9],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      {layers.map((k) => (
        <g key={k}>
          <path
            d={cone(136 - k * 21, 50 + k * 15, 15, 40 - k * 4)}
            className={k % 2 ? "gz2-ash" : "gz2-basalt"}
          />
          {k % 2 === 1 && <path d={cone(136 - k * 21, 50 + k * 15, 15, 40 - k * 4)} fill={pat(id, "dots")} />}
        </g>
      ))}
      <path d={cone(136, 50, 15, 40)} className="gz2-o" />
      <Under
        chamber={[CX, 196, 46, 16]}
        vent={`M${CX - 4} 182 L${CX - 5} 62 L${CX + 5} 62 L${CX + 4} 182Z M${CX + 3} 120 L${CX + 46} 96 L${CX + 49} 101 L${CX + 5} 128Z`}
      />
      <T x={CX + 30} y={54} a="start" cls="gz2-sm">kráter</T>
      <T x={8} y={112} a="start" cls="gz2-sm">láva</T>
      <T x={8} y={128} a="start" cls="gz2-sm">a popel</T>
      <path d="M48 124 L80 132" className="gz2-lead" />
      <path d={`M${CX + 62} 136 L${CX + 6} 146`} className="gz2-lead" />
      <T x={CX + 64} y={140} a="start" cls="gz2-sm">sopouch</T>
      <T x={CX} y={H - 10} cls="gz2-sm gz2-b">magmatický krb</T>
    </>
  );
}

function Shield() {
  return (
    <Frame w={W} h={H - 50}>
      <ShieldArt />
    </Frame>
  );
}

function ShieldArt() {
  const { id } = useFig();
  const surf = (k: number) =>
    `M${8 + k * 14} ${GY} Q${CX - 70} ${108 + k * 5} ${CX - 14} ${100 + k * 5} Q${CX} ${104 + k * 5} ${CX + 14} ${100 + k * 5} Q${CX + 70} ${108 + k * 5} ${W - 8 - k * 14} ${GY}Z`;
  return (
    <>
      <g transform="translate(0 -50)">
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <path key={k} d={surf(k)} className={k % 2 ? "gz2-rock" : "gz2-rock2"} />
      ))}
      <path d={surf(0)} fill={pat(id, "h")} opacity={0.4} />
      <path d={surf(0)} className="gz2-o" />
      {/* lava running down the flanks */}
      <path d={`M${CX - 16} 102 Q${CX - 62} 110 ${CX - 108} 138`} className="gz2-lava" style={{ strokeWidth: 4.5 }} />
      <path d={`M${CX + 16} 102 Q${CX + 70} 112 ${CX + 118} 146`} className="gz2-lava" style={{ strokeWidth: 4.5 }} />
      <Arrow d={`M${CX - 66} 102 Q${CX - 90} 110 ${CX - 112} 124`} tone="red" />
      <Arrow d={`M${CX + 70} 104 Q${CX + 94} 114 ${CX + 116} 130`} tone="red" />
      <Under
        chamber={[CX, 196, 70, 15]}
        vent={`M${CX - 4} 182 L${CX - 5} 104 L${CX + 5} 104 L${CX + 4} 182Z`}
      />
      <T x={CX} y={82} cls="gz2-sm">kráter (kaldera)</T>
      <T x={14} y={96} a="start" cls="gz2-sm gz2-red-t">řídká láva</T>
      <T x={W - 14} y={96} a="end" cls="gz2-sm">mírné svahy</T>
      <T x={CX} y={H - 10} cls="gz2-sm gz2-b">magmatický krb</T>
      </g>
    </>
  );
}

function Cinder() {
  return (
    <Frame w={W} h={H}>
      <CinderArt />
    </Frame>
  );
}

function CinderArt() {
  const { id } = useFig();
  const c = `M${CX - 70} ${GY} L${CX - 22} 96 Q${CX} 116 ${CX + 22} 96 L${CX + 70} ${GY}Z`;
  return (
    <>
      {/* bombs and scoria thrown out */}
      {[
        [-1, 46, 58],
        [1, 52, 54],
        [-1, 84, 34],
        [1, 92, 40],
      ].map(([s, dx, h], i) => (
        <path
          key={i}
          d={`M${CX + s * 6} 100 Q${CX + s * dx * 0.5} ${100 - h * 1.6} ${CX + s * dx} ${100 - h * 0.2}`}
          className="gz2-o gz2-thin gz2-dot2"
        />
      ))}
      {[
        [CX - 46, 98],
        [CX + 52, 94],
        [CX - 84, 66],
        [CX + 92, 60],
        [CX - 18, 30],
        [CX + 14, 26],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} className="gz2-rock2 gz2-o gz2-thin" />
      ))}
      <path d={c} className="gz2-ash" />
      <path d={c} fill={pat(id, "dots")} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${CX - 64 + k * 14} ${GY - 4 - k * 2} L${CX - 26 + k * 3} ${104 + k * 6}`} className="gz2-o gz2-thin gz2-faint" />
      ))}
      {[0, 1, 2].map((k) => (
        <path key={`r${k}`} d={`M${CX + 64 - k * 14} ${GY - 4 - k * 2} L${CX + 26 - k * 3} ${104 + k * 6}`} className="gz2-o gz2-thin gz2-faint" />
      ))}
      <path d={c} className="gz2-o" />
      {/* small lava flow from the foot */}
      <path d={`M${CX + 62} ${GY - 2} Q${CX + 96} ${GY - 4} ${CX + 128} ${GY - 1}`} className="gz2-lava" style={{ strokeWidth: 4 }} />
      <Under
        chamber={[CX, 200, 34, 12]}
        vent={`M${CX - 3.5} 190 L${CX - 4} 108 L${CX + 4} 108 L${CX + 3.5} 190Z`}
      />
      <T x={CX + 40} y={108} a="start" cls="gz2-sm">kráter</T>
      <T x={14} y={140} a="start" cls="gz2-sm">struska</T>
      <T x={14} y={140 + 16} a="start" cls="gz2-sm">a popel</T>
      <path d={`M60 136 L${CX - 44} 134`} className="gz2-lead" />
      <T x={W - 10} y={42} a="end" cls="gz2-sm">sopečné pumy</T>
      <T x={CX} y={H - 10} cls="gz2-sm gz2-b">magmatický krb</T>
    </>
  );
}

export default function VolcanoTypes() {
  return (
    <Figure level={3} label={LABEL} max={980} interactive>
      <div className="gz2-stripbox" role="img" aria-label={LABEL}>
        <StepStrip
          min={250}
          steps={[
            {
              title: "Vrstevnatá sopka (stratovulkán)",
              art: <Strato />,
              caption: "Vesuv (Itálie, 1 281 m n. m.): strmý kužel z vrstev lávy a popela; hustá láva, výbušné erupce.",
            },
            {
              title: "Štítová sopka",
              art: <Shield />,
              caption: "Mauna Loa (Havaj, 4 169 m n. m.): řídká čedičová láva teče daleko, sopka je široká s mírnými svahy.",
            },
            {
              title: "Struskový (sypaný) kužel",
              art: <Cinder />,
              caption: "Komorní hůrka (u Chebu, 503 m n. m.): malý kužel ze strusky a popela z jediné krátké erupce.",
            },
          ]}
        />
        <p className="gz2-strip-note">Řezy nejsou ve stejném měřítku: Mauna Loa je u základny široká přes 100 km, Komorní hůrka jen pár set metrů.</p>
      </div>
    </Figure>
  );
}
